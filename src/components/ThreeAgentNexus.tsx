import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  SpecializedAgent, 
  Language 
} from '../types/agent';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Eye, 
  Layers, 
  Maximize2, 
  Sparkles,
  Zap,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ThreeAgentNexusProps {
  agents: SpecializedAgent[];
  language: Language;
  onSelectAgent?: (agent: SpecializedAgent) => void;
  isGenerating?: boolean;
}

export const ThreeAgentNexus: React.FC<ThreeAgentNexusProps> = ({
  agents,
  language,
  onSelectAgent,
  isGenerating = false,
}) => {
  const isUrdu = language === 'ur';
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Controls state
  const [isRotating, setIsRotating] = useState(true);
  const [explosionFactor, setExplosionFactor] = useState(1.0);
  const [isWireframe, setIsWireframe] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<SpecializedAgent | null>(null);
  const [hoveredAgent, setHoveredAgent] = useState<SpecializedAgent | null>(null);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);

  // Mutable refs for animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameIdRef = useRef<number>(0);
  const coreGroupRef = useRef<THREE.Group | null>(null);
  const agentMeshesRef = useRef<{ mesh: THREE.Mesh; agent: SpecializedAgent; basePos: THREE.Vector3 }[]>([]);
  const beamsGroupRef = useRef<THREE.Group | null>(null);
  const isRotatingRef = useRef(isRotating);
  const explosionRef = useRef(explosionFactor);
  const isWireframeRef = useRef(isWireframe);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    explosionRef.current = explosionFactor;
  }, [explosionFactor]);

  useEffect(() => {
    isWireframeRef.current = isWireframe;
    if (sceneRef.current) {
      sceneRef.current.traverse((obj) => {
        if (obj instanceof THREE.Mesh && obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => { if ('wireframe' in m) m.wireframe = isWireframe; });
          } else if ('wireframe' in obj.material) {
            obj.material.wireframe = isWireframe;
          }
        }
      });
    }
  }, [isWireframe]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL per Three.js skill
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x020617, 0.025);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 18, 42);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x6366f1, 2.5);
    keyLight.position.set(20, 30, 20);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x10b981, 1.8);
    fillLight.position.set(-20, -10, -20);
    scene.add(fillLight);

    const pointCenter = new THREE.PointLight(0xa855f7, 3, 50);
    pointCenter.position.set(0, 0, 0);
    scene.add(pointCenter);

    // 5. Starfield / 3D Neural Particles
    const particleCount = isSoftwareGl ? 400 : 1200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorA = new THREE.Color(0x6366f1);
    const colorB = new THREE.Color(0x10b981);
    const colorC = new THREE.Color(0x38bdf8);

    for (let i = 0; i < particleCount; i++) {
      const radius = 25 + Math.random() * 55;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePos[i * 3 + 2] = radius * Math.cos(phi);

      const chosenColor = Math.random() > 0.5 ? colorA : (Math.random() > 0.5 ? colorB : colorC);
      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.45,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const starfield = new THREE.Points(particleGeo, particleMat);
    scene.add(starfield);

    // 6. Central Orchestrator 3D Core (Composite 4-part Procedural Object)
    const coreGroup = new THREE.Group();
    coreGroupRef.current = coreGroup;

    // Part 1: Central Glowing Nucleus
    const nucleusGeo = new THREE.IcosahedronGeometry(3.2, 2);
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      emissive: 0x4338ca,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.85,
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    coreGroup.add(nucleusMesh);

    // Part 2: Outer Faceted Lattice
    const latticeGeo = new THREE.DodecahedronGeometry(4.2, 0);
    const latticeMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.4,
      wireframe: true,
    });
    const latticeMesh = new THREE.Mesh(latticeGeo, latticeMat);
    coreGroup.add(latticeMesh);

    // Part 3 & 4: Concentric Gyroscopic Rings
    const ringGeo1 = new THREE.TorusGeometry(5.8, 0.12, 16, 100);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x9333ea,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      metalness: 0.9,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    coreGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(7.2, 0.1, 16, 100);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      metalness: 0.9,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 3;
    coreGroup.add(ring2);

    scene.add(coreGroup);

    // 7. 30 Orbiting Agent Satellites
    const agentMeshes: { mesh: THREE.Mesh; agent: SpecializedAgent; basePos: THREE.Vector3 }[] = [];
    const beamsGroup = new THREE.Group();
    beamsGroupRef.current = beamsGroup;
    scene.add(beamsGroup);

    // Color mapper for agent categories
    const getCategoryColor = (cat: string) => {
      switch (cat) {
        case 'orchestration': return 0x6366f1; // Indigo
        case 'architecture': return 0x38bdf8; // Sky
        case 'frontend': return 0x06b6d4; // Cyan
        case 'mobile': return 0xec4899; // Pink
        case 'backend': return 0x10b981; // Emerald
        case 'devops': return 0xf59e0b; // Amber
        case 'qa_security': return 0xef4444; // Red
        case 'learning': return 0xa855f7; // Purple
        case 'support': return 0x84cc16; // Lime
        default: return 0x818cf8;
      }
    };

    // Distribute 30 agents spherically using Fibonacci spiral
    const phiAngle = Math.PI * (3 - Math.sqrt(5)); // Golden angle
    const sphereRadius = 18;

    agents.forEach((agent, i) => {
      const y = 1 - (i / (agents.length - 1)) * 2; // y from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phiAngle * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      const basePos = new THREE.Vector3(x * sphereRadius, y * sphereRadius, z * sphereRadius);

      const colorHex = getCategoryColor(agent.category);

      // Agent Satellite (Sphere + Orbit Bracket Ring)
      const agentGroup = new THREE.Group();
      agentGroup.position.copy(basePos);

      const agentSphereGeo = new THREE.SphereGeometry(0.85, 16, 16);
      const agentSphereMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.6,
        roughness: 0.25,
        metalness: 0.8,
      });
      const agentSphere = new THREE.Mesh(agentSphereGeo, agentSphereMat);
      agentGroup.add(agentSphere);

      // Bracket Ring
      const bracketGeo = new THREE.TorusGeometry(1.3, 0.05, 8, 32);
      const bracketMat = new THREE.MeshBasicMaterial({ color: colorHex, wireframe: true });
      const bracketMesh = new THREE.Mesh(bracketGeo, bracketMat);
      agentGroup.add(bracketMesh);

      // Store agent reference in userData for raycasting
      agentSphere.userData = { agentId: agent.id, agentNumber: agent.number, agent };
      agentMeshes.push({ mesh: agentSphere, agent, basePos });

      scene.add(agentGroup);

      // Neural Beam Line from center to agent
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        basePos
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.25,
      });
      const beamLine = new THREE.Line(lineGeo, lineMat);
      beamsGroup.add(beamLine);
    });

    agentMeshesRef.current = agentMeshes;

    // 8. Raycasting & Mouse Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const interactiveMeshes = agentMeshes.map(am => am.mesh);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const found = agentMeshes.find(am => am.mesh === hit);
        if (found) {
          setHoveredAgent(found.agent);
          container.style.cursor = 'pointer';
        }
      } else {
        setHoveredAgent(null);
        container.style.cursor = 'default';
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const interactiveMeshes = agentMeshes.map(am => am.mesh);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const found = agentMeshes.find(am => am.mesh === hit);
        if (found) {
          setSelectedAgent(found.agent);
          if (onSelectAgent) onSelectAgent(found.agent);
        }
      }
    };

    // Drag to rotate camera
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const handleMouseMoveDrag = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        const spherical = new THREE.Spherical().setFromVector3(camera.position);
        spherical.theta -= deltaX * 0.006;
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi - deltaY * 0.006));
        camera.position.setFromSpherical(spherical);
        camera.lookAt(0, 0, 0);
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const spherical = new THREE.Spherical().setFromVector3(camera.position);
      spherical.radius = Math.max(15, Math.min(85, spherical.radius + e.deltaY * 0.04));
      camera.position.setFromSpherical(spherical);
      camera.lookAt(0, 0, 0);
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('click', handleClick);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMoveDrag);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // Handle Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    let clock = new THREE.Clock();
    let frameId = 0;

    // Software WebGL pacing helper per Three.js skill
    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 8);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 60);
        }
      };
      frameId = window.setTimeout(poll, 8);
    }

    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Rotate Starfield
      starfield.rotation.y += delta * 0.02;

      // Rotate Core Gyros
      if (coreGroup) {
        nucleusMesh.rotation.y += delta * 0.4;
        nucleusMesh.rotation.x += delta * 0.2;
        latticeMesh.rotation.y -= delta * 0.25;
        ring1.rotation.z += delta * 0.6;
        ring2.rotation.y += delta * 0.4;

        if (isGenerating) {
          // Extra pulsing intensity during build
          nucleusMat.emissiveIntensity = 0.8 + Math.sin(time * 6) * 0.4;
        } else {
          nucleusMat.emissiveIntensity = 0.6 + Math.sin(time * 2) * 0.2;
        }
      }

      // Auto Orbit Camera when isRotating is true
      if (isRotatingRef.current && !isDragging) {
        const spherical = new THREE.Spherical().setFromVector3(camera.position);
        spherical.theta += delta * 0.15;
        camera.position.setFromSpherical(spherical);
        camera.lookAt(0, 0, 0);
      }

      // Update Agent Satellites position with explosion scale
      const currentExplosion = explosionRef.current;
      agentMeshes.forEach(({ mesh, basePos }, idx) => {
        const parent = mesh.parent;
        if (parent) {
          // Scale from center
          parent.position.copy(basePos).multiplyScalar(currentExplosion);
          
          // Subtle individual floating bobbing
          parent.position.y += Math.sin(time * 2 + idx) * 0.2;
          parent.rotation.y += delta * 0.5;
        }
      });

      // Render
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(animate);
      } else {
        animationFrameIdRef.current = requestAnimationFrame(animate);
      }
    };

    if (isSoftwareGl) {
      afterDraw(animate);
    } else {
      animationFrameIdRef.current = requestAnimationFrame(animate);
    }

    // Cleanup
    return () => {
      if (isSoftwareGl) {
        clearTimeout(frameId);
      } else {
        cancelAnimationFrame(animationFrameIdRef.current);
      }

      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMoveDrag);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);

      particleGeo.dispose();
      particleMat.dispose();
      nucleusGeo.dispose();
      nucleusMat.dispose();
      latticeGeo.dispose();
      latticeMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [agents, isGenerating, onSelectAgent]);

  // Camera presets
  const setCameraPreset = (preset: 'front' | 'top' | 'closeup' | 'angled') => {
    if (!cameraRef.current) return;
    const camera = cameraRef.current;

    switch (preset) {
      case 'front':
        camera.position.set(0, 10, 44);
        break;
      case 'top':
        camera.position.set(0, 48, 5);
        break;
      case 'closeup':
        camera.position.set(0, 4, 18);
        break;
      case 'angled':
        camera.position.set(30, 24, 30);
        break;
    }
    camera.lookAt(0, 0, 0);
  };

  return (
    <div className="relative w-full h-[580px] md:h-[660px] rounded-3xl overflow-hidden bg-slate-950 border border-indigo-500/30 shadow-2xl select-none">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Badge & Live Agent Inspector */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none z-10 gap-3">
        <div className="p-3 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs shadow-xl space-y-1 pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              {isUrdu ? '3D اسپیشل آرکسٹریٹر ہولوگرام' : '3D SPATIAL NEURAL NEXUS'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {isUrdu 
              ? '30 سیٹلائٹ ایجنٹس مرکزی آرکسٹریٹر کے مدار میں گھوم رہے ہیں'
              : '30 specialized agent nodes orbiting the central executive orchestrator'}
          </p>
        </div>

        {/* Hovered / Selected Agent 3D Tooltip */}
        {(hoveredAgent || selectedAgent) && (
          <div className="p-4 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-indigo-500/50 text-xs shadow-2xl max-w-sm pointer-events-auto space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between gap-3">
              <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Agent #{((hoveredAgent || selectedAgent)!).number.toString().padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-emerald-500/20">
                {((hoveredAgent || selectedAgent)!).status}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-white text-sm">
                {isUrdu ? ((hoveredAgent || selectedAgent)!).nameUrdu : ((hoveredAgent || selectedAgent)!).name}
              </h4>
              <p className="text-[11px] text-slate-400">
                {isUrdu ? ((hoveredAgent || selectedAgent)!).roleUrdu : ((hoveredAgent || selectedAgent)!).role}
              </p>
            </div>

            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-mono text-indigo-300">
              {isUrdu ? ((hoveredAgent || selectedAgent)!).currentTaskUrdu : ((hoveredAgent || selectedAgent)!).currentTask}
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
              <span>{((hoveredAgent || selectedAgent)!).throughputTps} tps</span>
              <span>{((hoveredAgent || selectedAgent)!).latencyMs}ms</span>
              <span>{((hoveredAgent || selectedAgent)!).tasksCompleted.toLocaleString()} ops</span>
            </div>
          </div>
        )}
      </div>

      {/* Sleek Ergonomic Bottom Control Dock per Three.js skill */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 pointer-events-none z-20">
        <div className="pointer-events-auto rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800 p-3 shadow-2xl space-y-3">
          
          {/* Header Toggle */}
          <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800/80">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isUrdu ? '3D کیمرہ اور کلسٹر کنٹرولز' : '3D Camera & Cluster Controls'}</span>
            </span>

            <button
              onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
              className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
            >
              <span>{isControlsCollapsed ? (isUrdu ? 'کھولیں' : 'Expand') : (isUrdu ? 'چھپائیں' : 'Collapse')}</span>
              {isControlsCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {!isControlsCollapsed && (
            <div className="space-y-3">
              {/* Controls Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Auto Rotate Toggle */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsRotating(!isRotating)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                      isRotating
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {isRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{isRotating ? (isUrdu ? 'گھماؤ روکیں' : 'Pause Orbit') : (isUrdu ? 'گھمائیں' : 'Auto Orbit')}</span>
                  </button>

                  <button
                    onClick={() => setIsWireframe(!isWireframe)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                      isWireframe
                        ? 'bg-cyan-600 border-cyan-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3 h-3" />
                    <span>Hologram</span>
                  </button>
                </div>

                {/* Camera Presets */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">Views:</span>
                  {(['front', 'top', 'closeup', 'angled'] as const).map(preset => (
                    <button
                      key={preset}
                      onClick={() => setCameraPreset(preset)}
                      className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-300 capitalize"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exploded 3D Cluster Slider */}
              <div className="flex items-center gap-3 pt-1 border-t border-slate-900 text-xs">
                <span className="text-slate-400 text-[11px] font-mono shrink-0">
                  {isUrdu ? '3D پھیلاؤ (Expansion):' : 'Spatial Radius:'}
                </span>
                <input
                  type="range"
                  min={0.6}
                  max={2.2}
                  step={0.05}
                  value={explosionFactor}
                  onChange={(e) => setExplosionFactor(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <span className="text-indigo-400 font-mono text-xs w-10 text-right">
                  {explosionFactor.toFixed(1)}x
                </span>
              </div>
            </div>
          )}

          {/* Mouse Helper footer */}
          <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between">
            <span>Click & Drag to rotate • Scroll to zoom</span>
            <span>Click any node to inspect agent</span>
          </div>

        </div>
      </div>
    </div>
  );
};
