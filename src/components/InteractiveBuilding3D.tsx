import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RotateCw, ZoomIn, ZoomOut, Maximize2, Minimize2, RefreshCw } from "lucide-react";

export interface UnitData {
  id: string;
  name: string;
  floor: "EG" | "1.OG" | "2.OG";
  rooms: string;
  area: number;
  price: number;
  type: string;
  status?: "available" | "reserved" | "sold";
}

interface InteractiveBuilding3DProps {
  units: UnitData[];
  selectedUnitIds: string[];
  hoveredUnitId: string | null;
  soldUnitIds?: string[];
  onUnitClick: (unitId: string, event?: React.MouseEvent) => void;
  onUnitHover?: (unitId: string | null) => void;
  mode?: "invest" | "wohnen";
  heightClass?: string;
  showControlsBar?: boolean;
}

// Normalizes mesh names like 'Area_WHG01', 'Area_WHG2', 'Area_WHG06001', 'Area_WHG06.001', 'WHG_05' to 'WHG01', 'WHG02', etc.
export function normalizeUnitId(name: string): string | null {
  if (!name) return null;
  const match = name.match(/WHG_?0?(\d+)/i);
  if (!match) return null;
  const numStr = match[1];
  if (numStr.startsWith("06") || numStr.startsWith("600") || numStr === "6") {
    return "WHG06";
  }
  const num = parseInt(numStr, 10);
  if (isNaN(num)) return null;
  if (num >= 1 && num <= 9) {
    return `WHG0${num}`;
  }
  return `WHG${num}`;
}

// Procedural Architectural Low-Poly Tree Generator matching V8 styling
function createProceduralTree(foliageMat: THREE.Material, trunkMat: THREE.Material): THREE.Group {
  const tree = new THREE.Group();
  
  const trunkGeom = new THREE.CylinderGeometry(0.12, 0.18, 1.8, 8);
  trunkGeom.translate(0, 0.9, 0);
  const trunk = new THREE.Mesh(trunkGeom, trunkMat);
  trunk.castShadow = false;
  trunk.receiveShadow = false;
  tree.add(trunk);

  const crown = new THREE.Group();
  crown.position.set(0, 1.7, 0);

  const f1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.15, 1), foliageMat);
  f1.position.set(0, 0.7, 0);
  f1.castShadow = false;
  f1.receiveShadow = false;
  crown.add(f1);

  const f2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.75, 1), foliageMat);
  f2.position.set(0.3, 1.25, 0.2);
  f2.castShadow = false;
  f2.receiveShadow = false;
  crown.add(f2);

  tree.add(crown);
  return tree;
}

export default function InteractiveBuilding3D({
  units,
  selectedUnitIds,
  hoveredUnitId,
  soldUnitIds = [],
  onUnitClick,
  onUnitHover,
  mode = "invest",
  heightClass = "h-[500px] md:h-[600px]",
  showControlsBar = true,
}: InteractiveBuilding3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [activeAnglePreset, setActiveAnglePreset] = useState<string>("iso");
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Floating hover tooltip state
  const [hoveredUnitData, setHoveredUnitData] = useState<UnitData | null>(null);
  const [mouseScreenPos, setMouseScreenPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHoveringCanvas, setIsHoveringCanvas] = useState<boolean>(false);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const hitboxMeshesRef = useRef<THREE.Mesh[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseNormRef = useRef<THREE.Vector2>(new THREE.Vector2(-999, -999));
  const hoveredMeshRef = useRef<THREE.Mesh | null>(null);
  const hovered3DUnitIdRef = useRef<string | null>(null);
  const pointerDownPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const buildingCenterRef = useRef<THREE.Vector3>(new THREE.Vector3(9.04, 4.02, 5.32));

  // Camera transition animation state
  const cameraAnimRef = useRef<{
    active: boolean;
    startPos: THREE.Vector3;
    targetPos: THREE.Vector3;
    startLook: THREE.Vector3;
    targetLook: THREE.Vector3;
    startTime: number;
    duration: number;
  } | null>(null);

  // Animate camera to target viewpoint
  const animateCameraTo = useCallback(
    (pos: THREE.Vector3, target: THREE.Vector3, duration = 850) => {
      if (!cameraRef.current || !controlsRef.current) return;
      cameraAnimRef.current = {
        active: true,
        startPos: cameraRef.current.position.clone(),
        targetPos: pos.clone(),
        startLook: controlsRef.current.target.clone(),
        targetLook: target.clone(),
        startTime: performance.now(),
        duration,
      };
    },
    []
  );

  // Preset Views calculated relative to building center
  const applyViewPreset = useCallback(
    (presetKey: string) => {
      setActiveAnglePreset(presetKey);
      setIsAutoRotate(false);

      const center = buildingCenterRef.current;
      const target = center.clone();
      const dist = 38;
      const height = 20;

      switch (presetKey) {
        case "sued": // Front / South
          animateCameraTo(new THREE.Vector3(center.x, center.y + height * 0.85, center.z + dist), target);
          break;
        case "nord": // Rear / North
          animateCameraTo(new THREE.Vector3(center.x, center.y + height * 0.85, center.z - dist), target);
          break;
        case "west": // West
          animateCameraTo(new THREE.Vector3(center.x - dist, center.y + height * 0.85, center.z), target);
          break;
        case "ost": // East
          animateCameraTo(new THREE.Vector3(center.x + dist, center.y + height * 0.85, center.z), target);
          break;
        case "top": // Top-down Vogelperspektive
          animateCameraTo(new THREE.Vector3(center.x + 0.01, center.y + 50, center.z + 0.01), target);
          break;
        case "iso": // Isometric 3/4 view
        default:
          animateCameraTo(new THREE.Vector3(center.x + 28, center.y + 22, center.z + 32), target);
          break;
      }
    },
    [animateCameraTo]
  );

  const handleZoom = (direction: "in" | "out") => {
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const target = controlsRef.current.target;
    const factor = direction === "in" ? 0.8 : 1.25;
    const offset = cam.position.clone().sub(target).multiplyScalar(factor);
    if (offset.length() > 6 && offset.length() < 150) {
      animateCameraTo(target.clone().add(offset), target, 400);
    }
  };

  const handleResetView = () => {
    applyViewPreset("iso");
  };

  // Synchronize all 3D hitboxes with selectedUnitIds, hovered unit, and sold state
  const syncHitboxVisuals = useCallback(
    (selIds: string[], hoverId: string | null, soldIds: string[], curMode: "invest" | "wohnen") => {
      const hitboxes = hitboxMeshesRef.current;
      if (!hitboxes || hitboxes.length === 0) return;

      for (let i = 0; i < hitboxes.length; i++) {
        const mesh = hitboxes[i];
        const uData = mesh.userData;
        if (!uData) continue;
        const unitId = uData.unitId;

        const isSold = soldIds.includes(unitId);
        const isSelected = selIds.includes(unitId);
        const isHovered = !isSelected && hoverId === unitId;

        if (isSold) {
          uData.targetOpacity = isHovered ? 0.35 : 0.12;
          uData.targetColor = new THREE.Color(0x94a3b8);
        } else if (isSelected) {
          if (curMode === "invest") {
            uData.targetOpacity = 0.65;
            uData.targetColor = new THREE.Color(0x10b981); // Emerald Green for portfolio
          } else {
            uData.targetOpacity = 0.65;
            uData.targetColor = new THREE.Color(0xff8200); // Brand Orange for dream home
          }
        } else if (isHovered) {
          uData.targetOpacity = 0.38;
          uData.targetColor = new THREE.Color(0xff8200); // Warm glowing amber orange
        } else {
          // Exactly matching list: if not selected and not hovered, 0 opacity
          uData.targetOpacity = 0;
          uData.targetColor = new THREE.Color(0xff8200);
        }
      }
    },
    []
  );

  // Setup Three.js Scene and Load Genuine GLB
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.5, 500);
    camera.position.set(37, 26, 37);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current || undefined,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      logarithmicDepthBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controls.minDistance = 6;
    controls.maxDistance = 150;
    controls.target.set(9.04, 4.02, 5.32);
    controlsRef.current = controls;

    // 5. Lighting Setup (Warm Luxury Architectural Daylight)
    const ambientLight = new THREE.AmbientLight(0xfff8f0, 0.85);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xd5d0c8, 0.5);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff5ee, 1.9);
    sunLight.position.set(30, 45, 25);
    sunLight.castShadow = false;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xe2eefa, 0.4);
    fillLight.position.set(-25, 20, -25);
    scene.add(fillLight);

    // 6. Materials for Architectural Enhancements
    const customMaterials = {
      lawn: new THREE.MeshStandardMaterial({
        color: 0x4f8225,
        roughness: 0.92,
        metalness: 0,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
        depthWrite: true,
        depthTest: true,
      }),
      pathway: new THREE.MeshStandardMaterial({
        color: 0xdce2ee,
        roughness: 0.7,
        metalness: 0.05,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
        depthWrite: true,
        depthTest: true,
      }),
      playgroundSand: new THREE.MeshStandardMaterial({
        color: 0xd6bf96,
        roughness: 0.95,
        metalness: 0,
        polygonOffset: true,
        polygonOffsetFactor: -0.5,
        polygonOffsetUnits: -0.5,
        depthWrite: true,
        depthTest: true,
      }),
      hedge: new THREE.MeshStandardMaterial({
        color: 0x335e1b,
        roughness: 0.85,
        metalness: 0.05,
      }),
      gardenGate: new THREE.MeshStandardMaterial({
        color: 0x24262c,
        roughness: 0.35,
        metalness: 0.85,
      }),
      greenRoof: new THREE.MeshStandardMaterial({
        color: 0x426e2e,
        roughness: 0.85,
        metalness: 0.05,
      }),
      playgroundWood: new THREE.MeshStandardMaterial({
        color: 0xb88856,
        roughness: 0.75,
        metalness: 0.05,
      }),
      treeTrunk: new THREE.MeshStandardMaterial({
        color: 0x543c2b,
        roughness: 0.85,
        metalness: 0.05,
      }),
      treeFoliage: new THREE.MeshStandardMaterial({
        color: 0x3d7327,
        roughness: 0.8,
        metalness: 0.05,
      }),
    };

    // 7. Load Genuine GLTF Model from /models/V8Web-Model.glb
    const loader = new GLTFLoader();
    const modelPath = "/models/V8Web-Model.glb";

    loader.load(
      modelPath,
      (gltf) => {
        const modelScene = gltf.scene;
        const treeSpawns: Array<{ position: THREE.Vector3; quaternion: THREE.Quaternion; scale: THREE.Vector3 }> = [];
        const detectedHitboxes: THREE.Mesh[] = [];

        modelScene.traverse((child) => {
          const n = child.name || "";
          const r = n.toLowerCase();

          // Filter out distracting outer terrain/context
          if (
            r.includes("terrain") ||
            r.includes("surround") ||
            r.includes("umgeb") ||
            r.includes("gelaende") ||
            r.includes("context") ||
            r.includes("environment") ||
            r.includes("earth") ||
            r.includes("soil") ||
            r.includes("outer") ||
            r.includes("nachbar") ||
            r.includes("site_context") ||
            r.includes("ground_base")
          ) {
            child.visible = false;
            if ((child as THREE.Mesh).isMesh) {
              (child as THREE.Mesh).castShadow = false;
              (child as THREE.Mesh).receiveShadow = false;
            }
            return;
          }

          // Replace heavy tree meshes with clean procedural architectural trees
          if (
            r.includes("small_deciduous_tree") ||
            r.includes("deciduous_tree") ||
            r.includes("small_deciduous") ||
            (r.includes("tree") && !r.includes("street")) ||
            r.includes("baum")
          ) {
            child.visible = false;
            if ((child as THREE.Mesh).isMesh) {
              (child as THREE.Mesh).castShadow = false;
              (child as THREE.Mesh).receiveShadow = false;
            }
            child.updateWorldMatrix(true, false);
            const pos = new THREE.Vector3();
            const rot = new THREE.Quaternion();
            const sc = new THREE.Vector3();
            child.matrixWorld.decompose(pos, rot, sc);
            treeSpawns.push({ position: pos, quaternion: rot, scale: sc });
            return;
          }

          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = false;
            mesh.receiveShadow = false;

            // Interactive Unit Hitboxes
            if (/^(WHG_|Area_WHG)/i.test(n) || (r.includes("whg") && r.includes("area"))) {
              const normalizedId = normalizeUnitId(n);
              mesh.material = new THREE.MeshStandardMaterial({
                color: 0xff8200,
                emissive: 0xff6600,
                emissiveIntensity: 0.15,
                transparent: true,
                opacity: 0,
                roughness: 0.2,
                metalness: 0.1,
                depthWrite: false,
                side: THREE.DoubleSide,
              });
              mesh.visible = true;
              mesh.userData = {
                isHitbox: true,
                unitId: normalizedId || n,
                unitName: n,
                targetOpacity: 0,
                currentOpacity: 0,
                hovered: false,
                targetColor: new THREE.Color(0xff8200),
              };
              detectedHitboxes.push(mesh);
            } else if (
              r.includes("lawn") ||
              r.includes("grass") ||
              r.includes("wiese") ||
              r.includes("rasen") ||
              r.includes("garten_flaeche")
            ) {
              mesh.material = customMaterials.lawn;
              mesh.receiveShadow = true;
            } else if (
              r.includes("pathway") ||
              r.includes("path") ||
              r.includes("pavement") ||
              r.includes("weg") ||
              r.includes("pflaster") ||
              r.includes("terrasse_flaeche")
            ) {
              mesh.material = customMaterials.pathway;
              mesh.receiveShadow = true;
            } else if (r.includes("playground_sand") || r.includes("sand")) {
              mesh.material = customMaterials.playgroundSand;
              mesh.receiveShadow = true;
            } else if (
              r.includes("playground") ||
              r.includes("spielplatz") ||
              r.includes("spiel") ||
              r.includes("schaukel") ||
              r.includes("rutsche")
            ) {
              mesh.material = customMaterials.playgroundWood;
            } else if (r.includes("privet_hedge") || r.includes("hedge") || r.includes("hecke")) {
              mesh.material = customMaterials.hedge;
            } else if (
              r.includes("gardengate") ||
              r.includes("garden_gate") ||
              r.includes("gate") ||
              r.includes("tor")
            ) {
              mesh.material = customMaterials.gardenGate;
            } else if (
              r.includes("green_roof") ||
              r.includes("sedum") ||
              r.includes("roof_green") ||
              r.includes("dachbegruenung")
            ) {
              mesh.material = customMaterials.greenRoof;
              mesh.receiveShadow = true;
            }
          }
        });

        // Spawn procedural architectural trees
        treeSpawns.forEach(({ position, quaternion, scale }) => {
          const tree = createProceduralTree(customMaterials.treeFoliage, customMaterials.treeTrunk);
          tree.position.copy(position);
          tree.quaternion.copy(quaternion);
          const avgScale = (scale.x + scale.y + scale.z) / 3;
          if (avgScale > 0.01 && avgScale < 50) {
            const clamped = Math.max(0.7, Math.min(avgScale, 1.8));
            tree.scale.set(clamped, clamped, clamped);
          }
          scene.add(tree);
        });

        // Calculate building bounds and center
        const bbox = new THREE.Box3().setFromObject(modelScene);
        const center = bbox.getCenter(new THREE.Vector3());
        const size = bbox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        buildingCenterRef.current = center;
        camera.position.set(center.x + maxDim * 0.75, center.y + maxDim * 0.6, center.z + maxDim * 0.85);
        camera.lookAt(center);
        controls.target.copy(center);
        controls.update();

        scene.add(modelScene);
        hitboxMeshesRef.current = detectedHitboxes;
        const currentHover = hovered3DUnitIdRef.current || hoveredUnitId;
        syncHitboxVisuals(selectedUnitIds, currentHover, soldUnitIds, mode);

        setLoadingProgress(100);
        setIsLoaded(true);
      },
      (xhr) => {
        if (xhr.total > 0) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadingProgress(percent);
        } else {
          setLoadingProgress(60);
        }
      },
      (error) => {
        console.error("GLTF load error:", error);
        setLoadError("Das 3D-Modell konnte nicht geladen werden.");
      }
    );

    // 8. Animation & Render Loop
    let lastTime = performance.now();
    const animate = (time: number) => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Smooth camera interpolation
      if (cameraAnimRef.current && cameraAnimRef.current.active) {
        const anim = cameraAnimRef.current;
        const progress = Math.min(1, (time - anim.startTime) / anim.duration);
        const ease = 1 - Math.pow(1 - progress, 3);

        camera.position.lerpVectors(anim.startPos, anim.targetPos, ease);
        controls.target.lerpVectors(anim.startLook, anim.targetLook, ease);
        controls.update();

        if (progress >= 1) {
          anim.active = false;
        }
      } else {
        if (isAutoRotate) {
          controls.autoRotate = true;
          controls.autoRotateSpeed = 1.6;
        } else {
          controls.autoRotate = false;
        }
        controls.update();
      }

      // Smooth opacity & color interpolation for hitboxes
      const curHitboxes = hitboxMeshesRef.current;
      for (let i = 0; i < curHitboxes.length; i++) {
        const mesh = curHitboxes[i];
        const uData = mesh.userData;
        if (uData) {
          const targetOp = uData.targetOpacity || 0;
          uData.currentOpacity += (targetOp - uData.currentOpacity) * 0.25;
          if (Math.abs(targetOp - uData.currentOpacity) < 0.005) {
            uData.currentOpacity = targetOp;
          }

          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat) {
            mat.opacity = uData.currentOpacity;
            mesh.visible = uData.currentOpacity > 0.001;
            if (uData.targetColor) {
              mat.color.lerp(uData.targetColor, 0.25);
              mat.emissive.lerp(uData.targetColor, 0.25);
            }
            mat.emissiveIntensity = 0.12 + (uData.currentOpacity / 0.65) * 0.38;
          }
        }
      }

      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // 9. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
    };
  }, [isAutoRotate]);

  // Update Hitbox Target Colors & Opacity based on external states
  useEffect(() => {
    const currentHover = hovered3DUnitIdRef.current || hoveredUnitId;
    syncHitboxVisuals(selectedUnitIds, currentHover, soldUnitIds, mode);
  }, [selectedUnitIds, hoveredUnitId, soldUnitIds, mode, syncHitboxVisuals]);

  // Clean up 3D hover on scroll so element scrolling away doesn't leave ghost highlights
  useEffect(() => {
    const handleScroll = () => {
      if (hovered3DUnitIdRef.current !== null) {
        hovered3DUnitIdRef.current = null;
        hoveredMeshRef.current = null;
        setHoveredUnitData(null);
        setIsHoveringCanvas(false);
        if (onUnitHover) onUnitHover(null);
        syncHitboxVisuals(selectedUnitIds, hoveredUnitId, soldUnitIds, mode);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedUnitIds, hoveredUnitId, soldUnitIds, mode, syncHitboxVisuals, onUnitHover]);

  // Pointer Interaction Handlers (Raycasting)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const camera = cameraRef.current;
    if (!container || !camera) return;

    const rect = container.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    setMouseScreenPos({ x: clientX, y: clientY });
    setIsHoveringCanvas(true);

    const normX = (clientX / rect.width) * 2 - 1;
    const normY = -(clientY / rect.height) * 2 + 1;
    mouseNormRef.current.set(normX, normY);

    const raycaster = raycasterRef.current;
    raycaster.setFromCamera(mouseNormRef.current, camera);
    const intersects = raycaster.intersectObjects(hitboxMeshesRef.current, false);

    if (intersects.length > 0) {
      const topHit = intersects[0].object as THREE.Mesh;
      const uId = topHit.userData.unitId;
      if (topHit !== hoveredMeshRef.current || hovered3DUnitIdRef.current !== uId) {
        hoveredMeshRef.current = topHit;
        hovered3DUnitIdRef.current = uId;

        const foundUnit = units.find((u) => u.id === uId) || null;
        setHoveredUnitData(foundUnit);
        if (onUnitHover) onUnitHover(uId);
        container.style.cursor = "pointer";
        syncHitboxVisuals(selectedUnitIds, uId, soldUnitIds, mode);
      }
    } else {
      if (hoveredMeshRef.current !== null || hovered3DUnitIdRef.current !== null) {
        hoveredMeshRef.current = null;
        hovered3DUnitIdRef.current = null;
        setHoveredUnitData(null);
        if (onUnitHover) onUnitHover(null);
        container.style.cursor = "default";
        syncHitboxVisuals(selectedUnitIds, hoveredUnitId, soldUnitIds, mode);
      }
    }
  };

  const handlePointerLeave = () => {
    mouseNormRef.current.set(-999, -999);
    setIsHoveringCanvas(false);
    hoveredMeshRef.current = null;
    hovered3DUnitIdRef.current = null;
    setHoveredUnitData(null);
    if (onUnitHover) onUnitHover(null);
    if (containerRef.current) {
      containerRef.current.style.cursor = "default";
    }
    syncHitboxVisuals(selectedUnitIds, hoveredUnitId, soldUnitIds, mode);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Ignore drags / camera rotations in OrbitControls
    const dx = Math.abs(e.clientX - pointerDownPosRef.current.x);
    const dy = Math.abs(e.clientY - pointerDownPosRef.current.y);
    if (dx > 6 || dy > 6) return;

    const container = containerRef.current;
    const camera = cameraRef.current;
    if (!container || !camera) return;

    const rect = container.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const normX = (clientX / rect.width) * 2 - 1;
    const normY = -(clientY / rect.height) * 2 + 1;

    const raycaster = raycasterRef.current;
    raycaster.setFromCamera(new THREE.Vector2(normX, normY), camera);
    const intersects = raycaster.intersectObjects(hitboxMeshesRef.current, false);

    if (intersects.length > 0) {
      const topHit = intersects[0].object as THREE.Mesh;
      const uId = topHit.userData.unitId;
      if (uId) {
        onUnitClick(uId, e);
      }
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      className={`relative w-full ${heightClass} rounded-2xl overflow-hidden select-none bg-gradient-to-b from-stone-100/80 via-stone-50/50 to-stone-100/90 border border-stone-200/80 shadow-inner flex flex-col justify-between`}
    >
      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block touch-none z-0" />

      {/* Loading Overlay */}
      {!isLoaded && !loadError && (
        <div className="absolute inset-0 z-30 bg-stone-100/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-stone-200 border-t-[#ff8200] animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-[11px] font-mono font-bold text-stone-700">
              {loadingProgress}%
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-mono tracking-widest uppercase text-stone-700 font-bold">
              3D-Gebäudemodell wird geladen
            </div>
            <div className="text-[11px] text-stone-500 font-light">
              Präzise BIM-Architektur &bull; Interaktive Wohnungsflächen
            </div>
          </div>
          <div className="w-48 h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#ff8200] to-amber-500 transition-all duration-300 rounded-full"
              style={{ width: `${Math.max(8, loadingProgress)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Error state if any */}
      {loadError && (
        <div className="absolute inset-0 z-30 bg-stone-100/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3">
          <p className="text-sm font-semibold text-rose-600">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#ff8200] text-white rounded-lg text-xs font-medium cursor-pointer"
          >
            Neu laden
          </button>
        </div>
      )}

      {/* Top Header Bar inside 3D Container */}
      <div className="relative z-10 p-3 sm:p-4 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto bg-white/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-200 shadow-sm flex items-center space-x-2 text-[10px] sm:text-xs font-mono text-stone-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold">3D-Modell</span>
          <span className="text-stone-400">|</span>
          <span className="text-stone-500 hidden sm:inline">360° Drehen &amp; Erkunden</span>
        </div>

        {/* Legend / Status Pill */}
        <div className="pointer-events-auto flex items-center space-x-1.5 bg-white/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-200 shadow-sm text-[10px] sm:text-xs font-mono">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#ff8200]/80 border border-[#ff8200]"></span>
          <span className="text-stone-600">Wohnung wählen</span>
        </div>
      </div>

      {/* Floating Hover Card near cursor or top right */}
      {hoveredUnitData && isHoveringCanvas && (
        <div
          className="absolute z-20 pointer-events-none transition-all duration-150 ease-out hidden sm:block"
          style={{
            left: `${Math.min(mouseScreenPos.x + 15, (containerRef.current?.clientWidth || 800) - 220)}px`,
            top: `${Math.max(mouseScreenPos.y - 80, 20)}px`,
          }}
        >
          <div className="ios-glass-pill p-3 rounded-xl shadow-xl min-w-[190px] border border-white/95 text-left backdrop-blur-xl">
            <div className="flex justify-between items-center pb-1 border-b border-stone-200/50">
              <span className="font-bold text-xs text-[#ff8200] font-mono">{hoveredUnitData.name}</span>
              <span className="text-[9px] font-mono text-stone-500 uppercase">{hoveredUnitData.floor}</span>
            </div>
            <div className="text-[11px] text-stone-700 mt-1 font-medium">
              {hoveredUnitData.rooms} &bull; {hoveredUnitData.area} m²
            </div>
            <div className="flex justify-between items-center mt-1 pt-1 font-mono">
              <span className="text-xs font-bold text-stone-900">
                € {hoveredUnitData.price.toLocaleString("de-DE")}
              </span>
              <span
                className={`text-[8.5px] uppercase font-bold px-1.5 py-0.5 rounded ${
                  soldUnitIds.includes(hoveredUnitData.id)
                    ? "bg-stone-200 text-stone-500"
                    : selectedUnitIds.includes(hoveredUnitData.id)
                    ? mode === "invest"
                      ? "bg-emerald-500 text-white"
                      : "bg-[#ff8200] text-white"
                    : "bg-[#ff8200] text-white"
                }`}
              >
                {soldUnitIds.includes(hoveredUnitData.id)
                  ? "VERKAUFT"
                  : selectedUnitIds.includes(hoveredUnitData.id)
                  ? "AUSGEWÄHLT"
                  : "KLICKEN ZUM WÄHLEN"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Toolbar Controls */}
      {showControlsBar && (
        <div className="relative z-10 p-3 sm:p-4 flex flex-wrap justify-between items-center gap-2 pointer-events-none">
          {/* View Angle Presets */}
          <div className="pointer-events-auto flex items-center space-x-1 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-stone-200 shadow-md">
            {[
              { id: "iso", label: "Iso 3D" },
              { id: "sued", label: "Süd (Vorne)" },
              { id: "west", label: "West" },
              { id: "nord", label: "Nord (Hinten)" },
              { id: "ost", label: "Ost" },
              { id: "top", label: "Dach" },
            ].map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyViewPreset(preset.id)}
                className={`px-2.5 py-1 text-[10px] sm:text-xs font-mono rounded-lg transition-all cursor-pointer ${
                  activeAnglePreset === preset.id
                    ? "bg-[#ff8200] text-white font-bold shadow-sm"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Action Tool Buttons: Auto-Rotate, Zoom, Reset, Fullscreen */}
          <div className="pointer-events-auto flex items-center space-x-1.5 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-stone-200 shadow-md">
            <button
              type="button"
              onClick={() => setIsAutoRotate(!isAutoRotate)}
              title="360° Drehung an/aus"
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center space-x-1 ${
                isAutoRotate ? "bg-emerald-600 text-white font-bold" : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? "animate-spin" : ""}`} />
              <span className="text-[10px] font-mono hidden md:inline">{isAutoRotate ? "Stop" : "360°"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleZoom("in")}
              title="Heranzoomen"
              className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => handleZoom("out")}
              title="Herauszoomen"
              className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleResetView}
              title="Ansicht zurücksetzen"
              className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              title="Vollbild umschalten"
              className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
