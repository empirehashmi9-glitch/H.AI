import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Crosshair, Minus, MousePointerClick, Plus, RotateCcw } from 'lucide-react';
import { AgentCategory, SpecializedAgent } from '../types/agent';
import { ChibiRobot } from './Chibi';
import { cx } from './Toon';

export interface RoomDef {
  id: string;
  label: string;
  category: AgentCategory;
  color: string;
  x: number;
  y: number;
}

export const OFFICE_ROOMS: RoomDef[] = [
  { id: 'command', label: 'Command Deck', category: 'orchestration', color: '#FF7A8A', x: 62, y: 45 },
  { id: 'blueprint', label: 'Blueprint Lab', category: 'architecture', color: '#6FD6FF', x: 344, y: 45 },
  { id: 'web', label: 'Web Studio', category: 'frontend', color: '#FFC93C', x: 626, y: 45 },
  { id: 'mobile', label: 'Mobile Bay', category: 'mobile', color: '#3DD9B3', x: 62, y: 297 },
  { id: 'vault', label: 'Database Vault', category: 'backend', color: '#6C4CF1', x: 344, y: 297 },
  { id: 'deploy', label: 'Deploy Deck', category: 'devops', color: '#6FD6FF', x: 626, y: 297 },
  { id: 'qa', label: 'QA Range', category: 'qa_security', color: '#F45D9C', x: 62, y: 549 },
  { id: 'learning', label: 'Learning Lab', category: 'learning', color: '#FFC93C', x: 344, y: 549 },
  { id: 'support', label: 'Support Desk', category: 'support', color: '#3DD9B3', x: 626, y: 549 },
];

const SPOTS: Record<number, Array<[number, number]>> = {
  1: [[52, 60]],
  2: [[30, 60], [70, 60]],
  3: [[22, 58], [50, 58], [78, 58]],
  4: [[22, 58], [50, 58], [78, 58], [50, 84]],
  5: [[22, 58], [50, 58], [78, 58], [34, 84], [66, 84]],
  6: [[22, 56], [50, 56], [78, 56], [22, 82], [50, 82], [78, 82]],
};

const DEFAULT_ROT = -32;
const ROT_MIN = -78;
const ROT_MAX = 12;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.8;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const moodFor = (status: SpecializedAgent['status']) =>
  status === 'deployed' ? 'wink' : status === 'idle' || status === 'paused' ? 'happy' : 'focus';

export const Office3D: React.FC<{
  agents: SpecializedAgent[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  building?: boolean;
  className?: string;
}> = ({ agents, selectedId, onSelect, building, className }) => {
  const [rot, setRot] = useState(DEFAULT_ROT);
  const [dragging, setDragging] = useState(false);
  const [fit, setFit] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const [focused, setFocused] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const movedRef = useRef(false);
  const dragRef = useRef<{ startX: number; startY: number; startRot: number } | null>(null);
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchRef = useRef<{ dist: number; zoom: number } | null>(null);

  const total = fit * zoom;

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w < 40 || h < 40) return;
      let s = 1;
      const scaleEl = el.querySelector<HTMLElement>('.office-scale');
      const applied = scaleEl ? getComputedStyle(scaleEl).transform : 'none';
      if (applied && applied !== 'none') {
        const m = new DOMMatrixReadOnly(applied);
        if (m.a) s = m.a;
      }
      const parts = Array.from(
        el.querySelectorAll<HTMLElement>('.office-floor, .office-wall, .office-cube-wall, .office-room'),
      );
      if (!parts.length) return;
      let left = Infinity;
      let right = -Infinity;
      let top = Infinity;
      let bottom = -Infinity;
      for (const part of parts) {
        const r = part.getBoundingClientRect();
        left = Math.min(left, r.left);
        right = Math.max(right, r.right);
        top = Math.min(top, r.top);
        bottom = Math.max(bottom, r.bottom);
      }
      const sc = Math.max(0.05, s);
      const boxW = (right - left) / sc;
      const boxH = (bottom - top) / sc;
      if (boxW < 50 || boxH < 50) return;
      const ideal = clamp(Math.min(w / boxW, h / boxH) * 0.94, 0.18, 1.6);
      setFit(ideal);
      const stageRect = el.getBoundingClientRect();
      setCenter({
        x: (stageRect.left + w / 2 - (left + right) / 2) / sc,
        y: (stageRect.top + h / 2 - (top + bottom) / 2) / sc,
      });
    };
    raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    });
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((z) => clamp(z * Math.exp(-e.deltaY * 0.0014), ZOOM_MIN, ZOOM_MAX));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const rooms = useMemo(
    () =>
      OFFICE_ROOMS.map((room) => ({
        ...room,
        agents: agents.filter((a) => a.category === room.category),
      })),
    [agents],
  );

  const selected = agents.find((a) => a.id === selectedId) || null;

  const zoomBy = (factor: number) =>
    setZoom((z) => clamp(+(z * factor).toFixed(3), ZOOM_MIN, ZOOM_MAX));

  const resetView = () => {
    setRot(DEFAULT_ROT);
    setZoom(1);
    setFocused(null);
    onSelect(null);
  };

  const selectRoom = (id: string) => {
    const next = focused === id ? null : id;
    setFocused(next);
    if (next) {
      const category = OFFICE_ROOMS.find((r) => r.id === next)?.category;
      const agent = agents.find((a) => a.category === category);
      if (agent) onSelect(agent.id);
    } else {
      onSelect(null);
    }
  };

  const beginPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    movedRef.current = false;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointersRef.current.size === 2) {
      const [a, b] = Array.from(pointersRef.current.values());
      pinchRef.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), zoom };
      dragRef.current = null;
      setDragging(true);
      return;
    }
    if ((e.target as HTMLElement).closest('button')) return;
    dragRef.current = { startX: e.clientX, startY: e.clientY, startRot: rot };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const movePointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = pointersRef.current.get(e.pointerId);
    if (p) {
      p.x = e.clientX;
      p.y = e.clientY;
    }
    if (pointersRef.current.size >= 2 && pinchRef.current) {
      const [a, b] = Array.from(pointersRef.current.values());
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      setZoom(clamp((pinchRef.current.zoom * dist) / (pinchRef.current.dist || 1), ZOOM_MIN, ZOOM_MAX));
      return;
    }
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 4) movedRef.current = true;
    setRot(clamp(dragRef.current.startRot + dx * 0.22, ROT_MIN, ROT_MAX));
  };

  const endPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchRef.current = null;
    if (pointersRef.current.size === 0) {
      dragRef.current = null;
      setDragging(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const k = e.key;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', '+', '=', '-', '_'].includes(k)) {
      e.preventDefault();
    }
    switch (k) {
      case 'ArrowUp':
      case 'w':
      case 'W':
      case '+':
      case '=':
        zoomBy(1.15);
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
      case '-':
      case '_':
        zoomBy(1 / 1.15);
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        setRot((r) => clamp(r - 6, ROT_MIN, ROT_MAX));
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        setRot((r) => clamp(r + 6, ROT_MIN, ROT_MAX));
        break;
      case 'r':
      case 'R':
      case '0':
        resetView();
        break;
      case 'Escape':
        setFocused(null);
        onSelect(null);
        break;
    }
  };

  return (
    <div className={cx('relative', className)}>
      <div
        ref={stageRef}
        tabIndex={0}
        className={cx('office-stage h-[280px] sm:h-[470px] lg:h-[600px]', dragging && 'is-dragging')}
        onPointerDown={beginPointer}
        onPointerMove={movePointer}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onPointerLeave={() => {
          if (dragging && pointersRef.current.size === 0) {
            dragRef.current = null;
            setDragging(false);
          }
        }}
        onKeyDown={onKeyDown}
        role="group"
        aria-label="Isometric agent office. Drag to orbit, scroll or press up and down to move forward and back, left and right to rotate."
        style={{ ['--rot' as string]: `${rot}deg` }}
      >
        <div
          className="office-scale absolute inset-0 flex items-center justify-center"
          style={{ transform: `translate(${center.x * total}px, ${center.y * total}px) scale(${total})` }}
        >
          <div className="office-world" style={{ ['--rot' as string]: `${rot}deg` }}>
            <div
              className="office-floor"
              onClick={() => {
                if (movedRef.current) return;
                setFocused(null);
                onSelect(null);
              }}
            />
            <div className="office-wall office-wall-back">
              <div className="office-windows">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className="office-window" />
                ))}
              </div>
            </div>
            <div className="office-wall office-wall-left">
              <div className="office-windows" style={{ left: '14%', right: '14%', top: '30%', bottom: '28%', gap: 7 }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} className="office-window" />
                ))}
              </div>
            </div>

            {rooms.map((room) => {
              const isFocused = focused === room.id;
              const dim = focused !== null && !isFocused;
              const spots = SPOTS[Math.min(6, Math.max(1, room.agents.length))];
              return (
                <div
                  key={room.id}
                  className={cx('office-room', dim && 'dim', isFocused && 'focused')}
                  style={{ left: room.x, top: room.y, ['--room' as string]: room.color }}
                  title={`${room.label} · ${room.agents.length} agents`}
                  role="group"
                  aria-label={`${room.label}, ${room.agents.length} agents`}
                  onClick={() => {
                    if (movedRef.current) return;
                    selectRoom(room.id);
                  }}
                >
                  <span className="office-cube-wall is-back" aria-hidden="true">
                    <span className="office-wall-board" />
                  </span>
                  <span className="office-cube-wall is-left" aria-hidden="true" />
                  <span className="office-rug" aria-hidden="true" />

                  <span className="office-plant absolute" style={{ left: 12, bottom: 10 }} aria-hidden="true" />
                  <span
                    className="office-plant absolute"
                    style={{ right: 14, bottom: 12, transform: 'scale(.78)' }}
                    aria-hidden="true"
                  />

                  {room.agents.map((agent, i) => {
                    const spot = spots[i] || [50, 60];
                    const busy = agent.status !== 'idle' && agent.status !== 'deployed' && agent.status !== 'paused';
                    const isSelected = selected?.id === agent.id;
                    return (
                      <React.Fragment key={agent.id}>
                        <span
                          className="office-desk"
                          style={{
                            left: `${spot[0]}%`,
                            top: `${spot[1]}%`,
                            transform: 'translate(-50%, -50%)',
                          }}
                          aria-hidden="true"
                        >
                          <span
                            className="office-monitor"
                            style={busy ? undefined : { animationPlayState: 'paused', opacity: 0.5 }}
                          />
                        </span>
                        <span
                          className="office-chair"
                          style={{
                            left: `${spot[0]}%`,
                            top: `calc(${spot[1]}% + 28px)`,
                            transform: 'translate(-50%, -50%)',
                          }}
                          aria-hidden="true"
                        />
                        <div className="office-anchor" style={{ left: `${spot[0]}%`, top: `${spot[1]}%` }}>
                          <div className="billboard" style={{ position: 'absolute', left: -34, bottom: 2 }}>
                            <button
                              type="button"
                              className="office-agent"
                              style={{ left: -27, bottom: 0, width: 54, height: 64 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (movedRef.current) return;
                                onSelect(isSelected ? null : agent.id);
                                setFocused(room.id);
                              }}
                              title={`#${agent.number} ${agent.name}`}
                              aria-label={`Agent ${agent.number}: ${agent.name}`}
                              aria-pressed={isSelected}
                            >
                              <span
                                className="bot-pop block"
                                style={
                                  isSelected
                                    ? { filter: 'drop-shadow(0 0 7px #67e8f9)' }
                                    : undefined
                                }
                              >
                                <ChibiRobot
                                  size={46}
                                  color={room.color}
                                  accent={agent.status === 'deployed' ? '#7CF5D8' : '#FFF7EC'}
                                  mood={moodFor(agent.status)}
                                />
                              </span>
                              {busy && (
                                <span
                                  className="absolute left-1/2 top-0 -translate-x-1/2 w-2 h-2 rounded-full bg-sun border border-ink"
                                  style={{ animation: 'pulseRing 1.6s ease-out infinite' }}
                                  aria-hidden="true"
                                />
                              )}
                            </button>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
          <span className="office-hint inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold">
            <span
              className={cx('status-dot', building && 'animate-pulse')}
              style={{ background: building ? '#FFC93C' : '#3DD9B3' }}
            />
            <span className="sm:hidden">{building ? 'Building' : 'Nominal'}</span>
            <span className="hidden sm:inline">{building ? 'Crew building' : 'All systems nominal'}</span>
          </span>
          <span className="office-hint hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold">
            <MousePointerClick className="w-3 h-3" /> drag · scroll · keys
          </span>
        </div>

        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          <span className="office-hint hidden sm:inline-block rounded-md px-2 py-1 font-mono text-[10px] leading-none">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => zoomBy(1 / 1.15)}
            className="office-ctrl w-8 h-8 rounded-md grid place-items-center"
            aria-label="Move camera back"
            title="Move back (↓ / S)"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => zoomBy(1.15)}
            className="office-ctrl w-8 h-8 rounded-md grid place-items-center"
            aria-label="Move camera forward"
            title="Move forward (↑ / W)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={resetView}
            className="office-ctrl w-8 h-8 rounded-md grid place-items-center"
            aria-label="Reset camera"
            title="Reset camera (R)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setFocused(null);
              onSelect(null);
            }}
            className="office-ctrl w-8 h-8 rounded-md grid place-items-center"
            aria-label="Clear focus"
            title="Clear focus (Esc)"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center px-3">
          <span className="office-hint hidden sm:inline-flex rounded-full px-3 py-1 text-[10px]">
            drag to orbit · scroll or ↑ ↓ to move forward / back · ← → to rotate · tap a robot
          </span>
          <span className="office-hint inline-flex sm:hidden rounded-full px-3 py-1 text-[10px]">
            drag · pinch · tap a room or robot
          </span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span className="text-[10px] font-bold text-ink/45">
          {focused ? (
            <>{OFFICE_ROOMS.find((r) => r.id === focused)?.label} · tap a robot for details</>
          ) : (
            <>
              <span className="sm:hidden">Tap a room or robot for live telemetry · pinch to zoom</span>
              <span className="hidden sm:inline">
                Tap a robot for live telemetry · mouse wheel or arrow keys move the camera forward and back
              </span>
            </>
          )}
        </span>
      </div>
    </div>
  );
};
