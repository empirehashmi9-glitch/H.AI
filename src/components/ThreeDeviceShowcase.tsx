import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GeneratedProject, Language } from '../types/agent';
import { Smartphone, Monitor, Rotate3d, Play, Pause, ExternalLink } from 'lucide-react';

interface ThreeDeviceShowcaseProps {
  project: GeneratedProject;
  language: Language;
}

export const ThreeDeviceShowcase: React.FC<ThreeDeviceShowcaseProps> = ({ project, language }) => {
  const isUrdu = language === 'ur';
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeStageDevice, setActiveStageDevice] = useState<'all' | 'iphone' | 'android' | 'web'>('all');
  const [isRotating, setIsRotating] = useState(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const isRotatingRef = useRef(isRotating);
  const stageGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
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

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      500
    );
    camera.position.set(0, 12, 28);
    camera.lookAt(0, 2, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x6366f1, 2.5);
    dirLight1.position.set(15, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x10b981, 1.8);
    dirLight2.position.set(-15, 10, -10);
    scene.add(dirLight2);

    const stageGroup = new THREE.Group();
    stageGroupRef.current = stageGroup;
    scene.add(stageGroup);

    // Ground Holographic Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(14, 15, 0.8, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.2,
      metalness: 0.9,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.4;
    stageGroup.add(pedestal);

    // Pedestal Glowing Ring
    const ringGeo = new THREE.RingGeometry(12, 12.4, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.02;
    stageGroup.add(ring);

    // Device 1: 3D iPhone (SwiftUI iOS)
    const iphoneGroup = new THREE.Group();
    iphoneGroup.position.set(-6, 4.5, 2);
    iphoneGroup.rotation.y = Math.PI / 8;

    // Body chassis
    const phoneGeo = new THREE.BoxGeometry(3.6, 7.4, 0.4);
    const phoneMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      metalness: 0.9,
      roughness: 0.15,
    });
    const phoneMesh = new THREE.Mesh(phoneGeo, phoneMat);
    iphoneGroup.add(phoneMesh);

    // Screen
    const screenGeo = new THREE.PlaneGeometry(3.3, 7.0);
    const screenMat = new THREE.MeshBasicMaterial({
      color: 0x312e81,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = 0.21;
    iphoneGroup.add(screenMesh);

    // Dynamic Island
    const islandGeo = new THREE.BoxGeometry(1.0, 0.25, 0.05);
    const islandMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const islandMesh = new THREE.Mesh(islandGeo, islandMat);
    islandMesh.position.set(0, 3.1, 0.22);
    iphoneGroup.add(islandMesh);

    stageGroup.add(iphoneGroup);

    // Device 2: 3D Web Monitor (React 19 + Tailwind)
    const monitorGroup = new THREE.Group();
    monitorGroup.position.set(0, 6, -3);

    // Monitor screen
    const monitorGeo = new THREE.BoxGeometry(11, 6.5, 0.35);
    const monitorMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.85,
      roughness: 0.2,
    });
    const monitorMesh = new THREE.Mesh(monitorGeo, monitorMat);
    monitorGroup.add(monitorMesh);

    // Screen face
    const monitorScreenGeo = new THREE.PlaneGeometry(10.4, 5.9);
    const monitorScreenMat = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
    });
    const monitorScreenMesh = new THREE.Mesh(monitorScreenGeo, monitorScreenMat);
    monitorScreenMesh.position.z = 0.18;
    monitorGroup.add(monitorScreenMesh);

    // Stand
    const standGeo = new THREE.CylinderGeometry(0.3, 0.4, 4, 16);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 });
    const standMesh = new THREE.Mesh(standGeo, standMat);
    standMesh.position.set(0, -3.5, 0);
    monitorGroup.add(standMesh);

    stageGroup.add(monitorGroup);

    // Device 3: 3D Android (Jetpack Compose)
    const androidGroup = new THREE.Group();
    androidGroup.position.set(6, 4.5, 2);
    androidGroup.rotation.y = -Math.PI / 8;

    const androidGeo = new THREE.BoxGeometry(3.6, 7.4, 0.4);
    const androidMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      metalness: 0.85,
      roughness: 0.25,
    });
    const androidMesh = new THREE.Mesh(androidGeo, androidMat);
    androidGroup.add(androidMesh);

    const androidScreenGeo = new THREE.PlaneGeometry(3.3, 7.0);
    const androidScreenMat = new THREE.MeshBasicMaterial({
      color: 0x065f46,
    });
    const androidScreenMesh = new THREE.Mesh(androidScreenGeo, androidScreenMat);
    androidScreenMesh.position.z = 0.21;
    androidGroup.add(androidScreenMesh);

    // Punch hole
    const holeGeo = new THREE.CircleGeometry(0.1, 16);
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const holeMesh = new THREE.Mesh(holeGeo, holeMat);
    holeMesh.position.set(0, 3.2, 0.22);
    androidGroup.add(holeMesh);

    stageGroup.add(androidGroup);

    // Mouse drag interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        stageGroup.rotation.y += deltaX * 0.008;
        camera.position.y = Math.max(3, Math.min(25, camera.position.y - deltaY * 0.05));
        camera.lookAt(0, 3, 0);
      }
    };

    const handleMouseUp = () => { isDragging = false; };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Loop
    let clock = new THREE.Clock();
    let frameId = 0;

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

      if (isRotatingRef.current && !isDragging) {
        stageGroup.rotation.y += delta * 0.25;
      }

      // Subtle float animation for phones
      iphoneGroup.position.y = 4.5 + Math.sin(time * 2) * 0.15;
      androidGroup.position.y = 4.5 + Math.cos(time * 2) * 0.15;
      monitorGroup.position.y = 6.0 + Math.sin(time * 1.5) * 0.1;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(animate);
      } else {
        frameId = requestAnimationFrame(animate);
      }
    };

    if (isSoftwareGl) {
      afterDraw(animate);
    } else {
      frameId = requestAnimationFrame(animate);
    }

    return () => {
      if (isSoftwareGl) clearTimeout(frameId);
      else cancelAnimationFrame(frameId);

      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [project]);

  return (
    <div className="relative w-full h-[480px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl select-none">
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Overlay Badge */}
      <div className="absolute top-4 left-4 z-10 p-3 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs space-y-0.5">
        <span className="font-bold text-white flex items-center gap-1.5">
          <Rotate3d className="w-4 h-4 text-indigo-400" />
          <span>{isUrdu ? '3D ملٹی پلیٹ فارم اسٹیج' : '3D Spatial Multiplatform Showcase'}</span>
        </span>
        <p className="text-[11px] text-slate-400">
          {isUrdu ? 'آئی او ایس، اینڈرائیڈ اور ویب تینوں کے ماڈلز لائیو گھمائیں' : 'Interactive 3D Stage: iPhone 16, Android & Ultra-Wide Web'}
        </p>
      </div>

      {/* Control bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 p-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition flex items-center gap-1.5"
        >
          {isRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span>{isRotating ? 'Pause' : 'Rotate'}</span>
        </button>
        <span className="text-[10px] text-slate-400 font-mono px-2">Drag to inspect 360°</span>
      </div>
    </div>
  );
};
