"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Book3D({ stage }) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const bookRef = useRef(null);
  const animationFrameRef = useRef(null);

  // References to animated elements
  const frontCoverPivotRef = useRef(null);
  const backCoverPivotRef = useRef(null);
  const pagePivotsRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- 1. Scene Setup ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // --- 2. Camera Setup ---
    const width = containerRef.current.clientWidth || 400;
    const height = containerRef.current.clientHeight || 450;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 4.8);
    const targetLookAt = new THREE.Vector3(-0.25, 0, 0);
    camera.lookAt(targetLookAt);

    // --- 3. Renderer Setup ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- 4. Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff8ee, 1.4);
    dirLight.position.set(4, 6, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);

    const softFillLight = new THREE.DirectionalLight(0x8bc4f5, 0.5);
    softFillLight.position.set(-4, 2, -2);
    scene.add(softFillLight);

    // --- 5. Procedural Cover Textures ---
    const generateCoverCanvas = (isFront) => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext("2d");

      // Leather background gradient
      const grad = ctx.createRadialGradient(512, 512, 50, 512, 512, 600);
      grad.addColorStop(0, "#084e38"); // Slightly lighter emerald center
      grad.addColorStop(1, "#02261a"); // Darker edges
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Noise to simulate leather grain texture
      for (let i = 0; i < 200000; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const alpha = Math.random() * 0.06;
        ctx.fillStyle = Math.random() > 0.5 ? `rgba(255, 255, 255, ${alpha})` : `rgba(0, 0, 0, ${alpha})`;
        ctx.fillRect(x, y, 1.5, 1.5);
      }

      // Elegant gold embossed border
      ctx.strokeStyle = "#e5c158";
      ctx.lineWidth = 14;
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 8;
      ctx.strokeRect(40, 40, 944, 944);

      ctx.lineWidth = 4;
      ctx.strokeRect(65, 65, 894, 894);

      // Add gold corners
      const drawCornerDeco = (mx, my, dx, dy) => {
        ctx.beginPath();
        ctx.moveTo(mx, my + dy * 60);
        ctx.lineTo(mx, my);
        ctx.lineTo(mx + dx * 60, my);
        ctx.stroke();
      };
      drawCornerDeco(65, 65, 1, 1);
      drawCornerDeco(959, 65, -1, 1);
      drawCornerDeco(65, 959, 1, -1);
      drawCornerDeco(959, 959, -1, -1);

      if (isFront) {
        // Draw Golden Library Emblem Wreath
        ctx.strokeStyle = "#e5c158";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(512, 512, 120, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(512, 512, 105, 0.15 * Math.PI, 0.85 * Math.PI, true);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(512, 512, 105, 1.15 * Math.PI, 1.85 * Math.PI, true);
        ctx.stroke();

        // Draw leaves on wreath
        ctx.fillStyle = "#e5c158";
        for (let a = 0; a < Math.PI * 2; a += 0.25) {
          if ((a > 0.85 * Math.PI && a < 1.15 * Math.PI) || (a > 1.85 * Math.PI || a < 0.15 * Math.PI)) continue;
          const lx = 512 + Math.cos(a) * 105;
          const ly = 512 + Math.sin(a) * 105;
          ctx.beginPath();
          ctx.ellipse(lx, ly, 10, 6, a + Math.PI/4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw Open Book in center
        ctx.fillStyle = "#e5c158";
        ctx.beginPath();
        // Left page
        ctx.moveTo(512, 545);
        ctx.bezierCurveTo(480, 520, 460, 520, 440, 530);
        ctx.lineTo(440, 480);
        ctx.bezierCurveTo(460, 470, 480, 470, 512, 495);
        ctx.closePath();
        ctx.fill();

        // Right page
        ctx.beginPath();
        ctx.moveTo(512, 545);
        ctx.bezierCurveTo(544, 520, 564, 520, 584, 530);
        ctx.lineTo(584, 480);
        ctx.bezierCurveTo(564, 470, 544, 470, 512, 495);
        ctx.closePath();
        ctx.fill();

        // Banner underneath
        ctx.strokeStyle = "#e5c158";
        ctx.lineWidth = 4;
        ctx.strokeRect(440, 570, 144, 25);
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.fillRect(440, 570, 144, 25);
      }

      return canvas;
    };

    // Leather textures
    const frontCanvas = generateCoverCanvas(true);
    const backCanvas = generateCoverCanvas(false);

    const frontTexture = new THREE.CanvasTexture(frontCanvas);
    const backTexture = new THREE.CanvasTexture(backCanvas);

    // Cover material with PBR roughness/bump
    const coverMaterialFront = new THREE.MeshStandardMaterial({
      map: frontTexture,
      roughness: 0.4,
      metalness: 0.1,
      bumpMap: frontTexture,
      bumpScale: 0.005,
    });

    const coverMaterialBack = new THREE.MeshStandardMaterial({
      map: backTexture,
      roughness: 0.4,
      metalness: 0.1,
      bumpMap: backTexture,
      bumpScale: 0.005,
    });

    // Dark green leather color for solid sides of cover
    const coverSideMaterial = new THREE.MeshStandardMaterial({
      color: 0x022c1d,
      roughness: 0.65,
    });

    // Materials array for box cover faces (Right, Left, Top, Bottom, Front, Back)
    const materialsFront = [
      coverSideMaterial,  // Right
      coverSideMaterial,  // Left
      coverSideMaterial,  // Top
      coverSideMaterial,  // Bottom
      coverMaterialFront, // Front
      coverSideMaterial,  // Back
    ];

    const materialsBack = [
      coverSideMaterial,  // Right
      coverSideMaterial,  // Left
      coverSideMaterial,  // Top
      coverSideMaterial,  // Bottom
      coverSideMaterial,  // Front
      coverMaterialBack,  // Back
    ];

    // --- 6. Construct Book Geometry ---
    const bookGroup = new THREE.Group();
    scene.add(bookGroup);
    bookRef.current = bookGroup;

    // Dimensions
    const bookWidth = 1.9;
    const bookHeight = 2.7;
    const coverThickness = 0.06;
    const pagesThickness = 0.22;
    const spineRadius = (pagesThickness + coverThickness) / 2; // 0.14 for elegant flush spine
    const xSpine = -bookWidth / 2 - spineRadius;

    // Pivots positioned on spine (X = xSpine)
    const frontCoverPivot = new THREE.Group();
    frontCoverPivot.position.set(xSpine, 0, pagesThickness / 2 + coverThickness / 2);
    bookGroup.add(frontCoverPivot);
    frontCoverPivotRef.current = frontCoverPivot;

    const backCoverPivot = new THREE.Group();
    backCoverPivot.position.set(xSpine, 0, -pagesThickness / 2 - coverThickness / 2);
    bookGroup.add(backCoverPivot);
    backCoverPivotRef.current = backCoverPivot;

    // Cover meshes inside pivots
    const coverGeom = new THREE.BoxGeometry(bookWidth, bookHeight, coverThickness);
    
    const frontCoverMesh = new THREE.Mesh(coverGeom, materialsFront);
    frontCoverMesh.position.set(bookWidth / 2, 0, 0); // Offset so pivot is on left edge
    frontCoverMesh.castShadow = true;
    frontCoverMesh.receiveShadow = true;
    frontCoverPivot.add(frontCoverMesh);

    const backCoverMesh = new THREE.Mesh(coverGeom, materialsBack);
    backCoverMesh.position.set(bookWidth / 2, 0, 0);
    backCoverMesh.castShadow = true;
    backCoverMesh.receiveShadow = true;
    backCoverPivot.add(backCoverMesh);

    // Spine (rounded back cylinder)
    const spineGeom = new THREE.CylinderGeometry(spineRadius, spineRadius, bookHeight, 24, 1, true, -Math.PI / 2, Math.PI);
    const spineMesh = new THREE.Mesh(spineGeom, coverSideMaterial);
    spineMesh.position.set(xSpine, 0, 0);
    spineMesh.rotation.y = Math.PI / 2;
    spineMesh.castShadow = true;
    bookGroup.add(spineMesh);

    // Pages (staggered stack of 24 individual page meshes)
    const totalPages = 24;
    const pagePivots = [];
    const pageGeom = new THREE.PlaneGeometry(bookWidth - 0.05, bookHeight - 0.08, 12, 1);
    
    // Bend the geometry of each page slightly to make it look organic
    const pos = pageGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      // Bend curve using sine wave
      const bend = Math.sin(((x + (bookWidth - 0.05) / 2) / (bookWidth - 0.05)) * Math.PI) * 0.04;
      pos.setZ(i, bend);
    }
    pageGeom.computeVertexNormals();

    // Cream warm page texture
    const pageMat = new THREE.MeshStandardMaterial({
      color: 0xfbf8ee,
      roughness: 0.9,
      side: THREE.DoubleSide
    });

    for (let i = 0; i < totalPages; i++) {
      const pagePivot = new THREE.Group();
      // Distribute pages stack evenly
      const pageZ = -pagesThickness / 2 + 0.01 + (i / totalPages) * (pagesThickness - 0.02);
      pagePivot.position.set(xSpine + 0.01, 0, pageZ);
      bookGroup.add(pagePivot);
      pagePivots.push(pagePivot);

      const pageMesh = new THREE.Mesh(pageGeom, pageMat);
      pageMesh.position.set((bookWidth - 0.05) / 2, 0, 0); // pivot on left edge
      pageMesh.castShadow = true;
      pageMesh.receiveShadow = true;
      pagePivot.add(pageMesh);
    }
    pagePivotsRef.current = pagePivots;

    // --- 7. Bookmark Ribbon ---
    const ribbonGeom = new THREE.BoxGeometry(0.12, 0.8, 0.01);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xcc291f, // Rich red cloth
      roughness: 0.95,
    });
    const ribbon = new THREE.Mesh(ribbonGeom, ribbonMat);
    ribbon.position.set(bookWidth / 2 - 0.2, -bookHeight / 2 - 0.2, 0.08);
    ribbon.rotation.z = 0.1;
    ribbon.castShadow = true;
    bookGroup.add(ribbon);

    // --- 8. Animation & Render Loop ---
    const clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();

      // Soft rotating floats for intro stage (3/4 perspective: -30 degrees Y, tilted back 10 degrees X)
      if (stage === "intro") {
        bookGroup.rotation.y = -0.52 + Math.sin(time * 0.5) * 0.04;
        bookGroup.rotation.x = 0.17 + Math.sin(time * 0.4) * 0.02;
        bookGroup.rotation.z = Math.sin(time * 0.3) * 0.006;
      }

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // --- 9. Cleanup ---
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameRef.current);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  // --- 10. Synchronized opening/flipping effect on stage changes ---
  useEffect(() => {
    const frontCoverPivot = frontCoverPivotRef.current;
    const pagePivots = pagePivotsRef.current;

    if (!frontCoverPivot || !pagePivots.length) return;

    if (stage === "opening") {
      // 3.7 seconds total animation.
      // Reset cover and page positions
      frontCoverPivot.rotation.y = 0;
      pagePivots.forEach((p) => {
        p.rotation.y = 0;
      });

      // Animate covers and pages in WebGL
      let start = null;
      const duration = 2800; // open phase duration

      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;

        // Cover opens first (progress 0 to 1800ms)
        const coverProgress = Math.min(progress / 1800, 1);
        // Easing for cover: cubic out
        const coverEase = 1 - Math.pow(1 - coverProgress, 3);
        frontCoverPivot.rotation.y = -coverEase * (Math.PI * 0.85); // rotates to -153 degrees

        // Pages flip next (staggered from progress 500ms to 2500ms)
        pagePivots.forEach((page, idx) => {
          // Stagger starting times
          const pageStart = 400 + (idx / pagePivots.length) * 1200;
          const pageDuration = 1000;
          
          if (progress > pageStart) {
            const pageProgress = Math.min((progress - pageStart) / pageDuration, 1);
            // Easing for page flip: cubic in out
            const pageEase = pageProgress < 0.5
              ? 4 * pageProgress * pageProgress * pageProgress
              : 1 - Math.pow(-2 * pageProgress + 2, 3) / 2;
            
            // Stagger open positions so pages stack neatly on the left
            const maxOpenRotation = -Math.PI * 0.82 + (idx * 0.005);
            page.rotation.y = pageEase * maxOpenRotation;
          }
        });

        if (progress < duration) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    } else if (stage === "site") {
      // Instantly open state if skipped
      frontCoverPivot.rotation.y = -Math.PI * 0.85;
      pagePivots.forEach((page, idx) => {
        page.rotation.y = -Math.PI * 0.82 + (idx * 0.005);
      });
    }
  }, [stage]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-w-[280px] min-h-[400px] flex justify-center items-center relative"
      style={{ transformStyle: "preserve-3d" }}
    />
  );
}
