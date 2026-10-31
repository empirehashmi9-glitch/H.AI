import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sound } from '../lib/audioEffects';

interface ArcReactorProps {
  isGenerating: boolean;
  powerLevel: number; // 0 to 100
  overclockMultiplier?: number;
}

export const ArcReactor: React.FC<ArcReactorProps> = ({
  isGenerating,
  powerLevel,
  overclockMultiplier = 2.0
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isGeneratingRef = useRef(isGenerating);
  const powerLevelRef = useRef(powerLevel);
  const overclockRef = useRef(overclockMultiplier);

  useEffect(() => {
    isGeneratingRef.current = isGenerating;
    powerLevelRef.current = powerLevel;
    overclockRef.current = overclockMultiplier;
  }, [isGenerating, powerLevel, overclockMultiplier]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 240;
    const height = container.clientHeight || 240;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7.5;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'low-power'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL fallback mode active', e);
      return;
    }

    // Outer Ring
    const outerRingGeo = new THREE.TorusGeometry(2.4, 0.08, 16, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    scene.add(outerRing);

    // Segmented Ring
    const segmentGeo = new THREE.RingGeometry(1.6, 2.1, 12, 1);
    const segmentMat = new THREE.MeshBasicMaterial({ color: 0x0891b2, wireframe: true });
    const segmentRing = new THREE.Mesh(segmentGeo, segmentMat);
    scene.add(segmentRing);

    // Inner Core Ring
    const coreRingGeo = new THREE.TorusGeometry(1.2, 0.06, 16, 48);
    const coreRingMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const coreRing = new THREE.Mesh(coreRingGeo, coreRingMat);
    scene.add(coreRing);

    // Center Core Sphere
    const centerGeo = new THREE.SphereGeometry(0.55, 24, 24);
    const centerMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });
    const centerMesh = new THREE.Mesh(centerGeo, centerMat);
    scene.add(centerMesh);

    // Radiant Rays
    const raysGroup = new THREE.Group();
    for (let i = 0; i < 12; i++) {
      const rayGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.9, 8);
      const rayMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
      const ray = new THREE.Mesh(rayGeo, rayMat);
      const angle = (i / 12) * Math.PI * 2;
      ray.position.x = Math.cos(angle) * 1.6;
      ray.position.y = Math.sin(angle) * 1.6;
      ray.rotation.z = angle + Math.PI / 2;
      raysGroup.add(ray);
    }
    scene.add(raysGroup);

    // Quantum Particle Dust Field
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 1.0 + Math.random() * 2.2;
      particlePositions[i] = Math.cos(theta) * radius;
      particlePositions[i + 1] = Math.sin(theta) * radius;
      particlePositions[i + 2] = (Math.random() - 0.5) * 0.8;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x67e8f9,
      size: 0.08,
      transparent: true,
      opacity: 0.8
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const speedMultiplier = (isGeneratingRef.current ? 4.5 : 1.0) * overclockRef.current;
      outerRing.rotation.z += 0.005 * speedMultiplier;
      segmentRing.rotation.z -= 0.008 * speedMultiplier;
      coreRing.rotation.z += 0.012 * speedMultiplier;
      raysGroup.rotation.z -= 0.004 * speedMultiplier;
      particleSystem.rotation.z += 0.006 * speedMultiplier;

      // Pulse center with overclock excitement
      const pulse = Math.sin(Date.now() * 0.005 * speedMultiplier) * 0.14;
      const targetScale = (1 + pulse) * (0.8 + (powerLevelRef.current / 100) * 0.4);
      centerMesh.scale.set(targetScale, targetScale, targetScale);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW && newH) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      outerRingGeo.dispose();
      segmentGeo.dispose();
      coreRingGeo.dispose();
      centerGeo.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div
      onClick={() => sound.playPowerUp()}
      className="relative flex items-center justify-center cursor-pointer group"
      title="Click Arc Reactor to trigger quantum power surge"
    >
      {/* Three.js Canvas Container */}
      <div
        ref={containerRef}
        className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center relative z-10"
      />

      {/* Decorative Glow Overlays */}
      <div
        className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 pointer-events-none ${
          isGenerating
            ? 'bg-cyan-400/40 scale-110 animate-pulse'
            : 'bg-cyan-500/15 scale-95 group-hover:scale-105 group-hover:bg-cyan-500/25'
        }`}
      />
      <div className="absolute inset-2 border border-cyan-500/20 rounded-full pointer-events-none" />
      <div className="absolute inset-6 border border-cyan-500/30 border-dashed rounded-full pointer-events-none" />
    </div>
  );
};
