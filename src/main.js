import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Three.js 3D Architecture Viewer & Apartment Interactive System
 * 
 * 1. Model Loading:
 *    - Loads '/models/V8Web-Model.glb' with GLTFLoader
 *    - Perspective camera, OrbitControls with smooth damping
 *    - ACESFilmicToneMapping & clean light-neutral background (#f5f5f5)
 * 
 * 2. Seamless Non-Glitching Lawn & Ground System:
 *    - Logarithmic depth buffer + optimized near/far planes to eliminate z-fighting
 *    - Depth-layered polygon offsets (Lawn as base, pathways/terraces layered above)
 *    - Unified single-surface lawn material across all grass patches
 * 
 * 3. Interactive Apartment Zones (WHG_01 bis WHG_10):
 *    - Automatic discovery of 'WHG_' / 'Area_WHG*' meshes
 *    - Transparent by default (opacity = 0)
 *    - Smooth raycasted hover effect (interpolates to 0.3 opacity + warm orange glow)
 * 
 * 4. Curated Architectural Materials & Lighting:
 *    - Procedural minimalist trees replacing 'small_Deciduous_tree*' placeholders
 *    - Matte green hedges, anthracite gates, natural sand & warm wood for playgrounds
 *    - Directional sun with soft shadows + ambient and hemisphere fill lights
 */

// =============================================================================
// 1. SCENE, CAMERA & RENDERER SETUP (Z-Fighting Prevention)
// =============================================================================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe0e0e0); // Helles Grau (0xe0e0e0) für klaren Kontrast

// Camera Setup with optimized near plane for maximal depth buffer precision
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.5, // 0.5 prevents depth compression & eliminates ground plane z-fighting
  500
);
camera.position.set(28, 20, 32);

// WebGL Renderer with Logarithmic Depth Buffer to completely prevent coplanar surface glitching
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  logarithmicDepthBuffer: true,
  powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = false; // Schatten deaktiviert
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

// Append to DOM (or specified container)
const container = document.getElementById('threejs-container') || document.body;
container.appendChild(renderer.domElement);

// OrbitControls for smooth, damped camera rotation and zooming
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2 - 0.02; // Prevent camera dipping below ground level
controls.minDistance = 6;
controls.maxDistance = 150;
controls.target.set(0, 4, 0);

// =============================================================================
// 2. LIGHTING & ENVIRONMENT
// =============================================================================

// Ambient Light for balanced baseline visibility
const ambientLight = new THREE.AmbientLight(0xfff8f0, 0.75);
scene.add(ambientLight);

// Hemisphere Light for natural sky/ground bounce gradients
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xd5d0c8, 0.45);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

// Directional Sun Light (Shadows disabled)
const sunLight = new THREE.DirectionalLight(0xfffaee, 1.8);
sunLight.position.set(30, 45, 25);
sunLight.castShadow = false;
scene.add(sunLight);

// Soft fill light from opposite angle
const fillLight = new THREE.DirectionalLight(0xe2e8f0, 0.35);
fillLight.position.set(-25, 20, -25);
scene.add(fillLight);

// =============================================================================
// 3. CURATED LUXURY MATERIALS (With Polygon Offsets for Clean Layering)
// =============================================================================

const materials = {
  // Unified, seamless lawn material (pushed slightly back in depth so paths sit cleanly above)
  lawn: new THREE.MeshStandardMaterial({
    color: 0x4f8045,
    roughness: 0.92,
    metalness: 0.0,
    polygonOffset: true,
    polygonOffsetFactor: 1.0,
    polygonOffsetUnits: 1.0,
    depthWrite: true,
    depthTest: true
  }),

  // Clean architectural stone pathways & pavement (layered cleanly above lawn without z-fighting)
  pathway: new THREE.MeshStandardMaterial({
    color: 0xdcd8ce,
    roughness: 0.7,
    metalness: 0.05,
    polygonOffset: true,
    polygonOffsetFactor: -1.0,
    polygonOffsetUnits: -1.0,
    depthWrite: true,
    depthTest: true
  }),

  // Playground sand ground
  playgroundSand: new THREE.MeshStandardMaterial({
    color: 0xd6bf96,
    roughness: 0.95,
    metalness: 0.0,
    polygonOffset: true,
    polygonOffsetFactor: -0.5,
    polygonOffsetUnits: -0.5,
    depthWrite: true,
    depthTest: true
  }),

  // Fresh, matte architectural hedge material (Privet_hedge*)
  hedge: new THREE.MeshStandardMaterial({
    color: 0x335e3b,
    roughness: 0.85,
    metalness: 0.05
  }),

  // Dark anthracite metallic for garden gates (gardengate*)
  gardenGate: new THREE.MeshStandardMaterial({
    color: 0x24272c,
    roughness: 0.35,
    metalness: 0.85
  }),

  // Sedum green roof vegetation (green_roof*)
  greenRoof: new THREE.MeshStandardMaterial({
    color: 0x426e4e,
    roughness: 0.85,
    metalness: 0.05
  }),

  // Warm natural architectural wood for playground elements (playground_wood*, playground*)
  playgroundWood: new THREE.MeshStandardMaterial({
    color: 0xb88856,
    roughness: 0.75,
    metalness: 0.05
  }),

  // Tree trunk bark
  treeTrunk: new THREE.MeshStandardMaterial({
    color: 0x543d2b,
    roughness: 0.85,
    metalness: 0.05
  }),

  // Tree canopy foliage
  treeFoliage: new THREE.MeshStandardMaterial({
    color: 0x3d7347,
    roughness: 0.8,
    metalness: 0.05
  })
};

// =============================================================================
// 4. PROCEDURAL MINIMALIST TREE GENERATOR
// =============================================================================

/**
 * Creates a minimalist, low-poly architectural 3D tree
 * with a wood trunk and faceted foliage crown
 */
function createMinimalistTree() {
  const treeGroup = new THREE.Group();

  // 1. Trunk (Stamm)
  const trunkGeometry = new THREE.CylinderGeometry(0.12, 0.18, 1.8, 8);
  trunkGeometry.translate(0, 0.9, 0); // Origin at bottom
  const trunkMesh = new THREE.Mesh(trunkGeometry, materials.treeTrunk);
  trunkMesh.castShadow = false;
  trunkMesh.receiveShadow = false;
  treeGroup.add(trunkMesh);

  // 2. Canopy Crown (Krone)
  const crownGroup = new THREE.Group();
  crownGroup.position.set(0, 1.7, 0);

  // Main geometric foliage cluster
  const mainCrownGeo = new THREE.IcosahedronGeometry(1.15, 1);
  const mainCrownMesh = new THREE.Mesh(mainCrownGeo, materials.treeFoliage);
  mainCrownMesh.position.set(0, 0.7, 0);
  mainCrownMesh.castShadow = false;
  mainCrownMesh.receiveShadow = false;
  crownGroup.add(mainCrownMesh);

  // Secondary sub-cluster for organic natural aesthetic
  const subCrownGeo = new THREE.IcosahedronGeometry(0.75, 1);
  const subCrownMesh = new THREE.Mesh(subCrownGeo, materials.treeFoliage);
  subCrownMesh.position.set(0.3, 1.25, 0.2);
  subCrownMesh.castShadow = false;
  subCrownMesh.receiveShadow = false;
  crownGroup.add(subCrownMesh);

  treeGroup.add(crownGroup);
  return treeGroup;
}

// =============================================================================
// 5. MODEL LOADING & OBJECT STYLING (V8Web-Model.glb)
// =============================================================================

const hitboxMeshes = [];
const generatedTrees = [];
let loadedModel = null;

const gltfLoader = new GLTFLoader();
const MODEL_PATH = '/models/V8Web-Model.glb';

gltfLoader.load(
  MODEL_PATH,
  (gltf) => {
    loadedModel = gltf.scene;

    // Temporary array to store tree placeholder world transforms
    const treePlaceholderTransforms = [];

    // Traverse scene to classify hitboxes, remove brown terrain/outer meshes, and unify lawn
    loadedModel.traverse((child) => {
      const name = child.name || '';
      const lowerName = name.toLowerCase();

      // -----------------------------------------------------------------------
      // 1. BRAUNE UMGEBUNG / GELÄNDE / DOPPELTE BODENPLATTEN ENTFERNEN
      // -----------------------------------------------------------------------
      const isSurroundingTerrain = (
        lowerName.includes('terrain') ||
        lowerName.includes('surround') ||
        lowerName.includes('umgeb') ||
        lowerName.includes('gelaende') ||
        lowerName.includes('context') ||
        lowerName.includes('environment') ||
        lowerName.includes('earth') ||
        lowerName.includes('soil') ||
        lowerName.includes('outer') ||
        lowerName.includes('nachbar') ||
        lowerName.includes('site_context') ||
        lowerName.includes('ground_base')
      );

      if (isSurroundingTerrain) {
        child.visible = false;
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
        }
        return;
      }

      // -----------------------------------------------------------------------
      // 2. BÄUME GENERIEREN AUS PLATZHALTERN ('small_Deciduous_tree*')
      // -----------------------------------------------------------------------
      const isTreePlaceholder = (
        lowerName.includes('small_deciduous_tree') ||
        lowerName.includes('deciduous_tree') ||
        lowerName.includes('small_deciduous') ||
        (lowerName.includes('tree') && !lowerName.includes('street')) ||
        lowerName.includes('baum')
      );

      if (isTreePlaceholder) {
        // Hide original placeholder block
        child.visible = false;
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
        }

        // Extract world transform
        child.updateWorldMatrix(true, false);
        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();
        child.matrixWorld.decompose(position, quaternion, scale);

        treePlaceholderTransforms.push({ position, quaternion, scale });
        return;
      }

      if (!child.isMesh) return;

      child.castShadow = false;
      child.receiveShadow = false;

      // -----------------------------------------------------------------------
      // 3. INTERACTIVE APARTMENT ZONES (Hitboxen WHG_01 bis WHG_10 / Area_WHG*)
      // -----------------------------------------------------------------------
      if (/^(WHG_|Area_WHG)/i.test(name)) {
        child.material = new THREE.MeshStandardMaterial({
          color: 0xff8200, // Fehlner & Götz signature warm luxury orange accent
          emissive: 0xff6a00,
          emissiveIntensity: 0.15,
          transparent: true,
          opacity: 0.0, // Initial transparent
          roughness: 0.2,
          metalness: 0.1,
          depthWrite: false,
          side: THREE.DoubleSide
        });

        child.visible = true;
        child.userData = {
          isHitbox: true,
          unitName: name,
          targetOpacity: 0.0,
          currentOpacity: 0.0,
          hovered: false
        };

        hitboxMeshes.push(child);
      }
      // -----------------------------------------------------------------------
      // 4. EINHEITLICHE RASENFLÄCHE (Non-Glitching Lawn System)
      // -----------------------------------------------------------------------
      else if (
        lowerName.includes('lawn') || 
        lowerName.includes('grass') || 
        lowerName.includes('wiese') || 
        lowerName.includes('rasen') ||
        lowerName.includes('garten_flaeche')
      ) {
        // Assign the single unified lawn material instance with polygon offset
        child.material = materials.lawn;
        child.receiveShadow = true;
      }
      // -----------------------------------------------------------------------
      // 5. WEGE & PFLASTER (Layered Above Lawn)
      // -----------------------------------------------------------------------
      else if (
        lowerName.includes('pathway') || 
        lowerName.includes('path') || 
        lowerName.includes('pavement') || 
        lowerName.includes('weg') || 
        lowerName.includes('pflaster') ||
        lowerName.includes('terrasse_flaeche')
      ) {
        child.material = materials.pathway;
        child.receiveShadow = true;
      }
      // -----------------------------------------------------------------------
      // 6. SPIELPLATZ SAND & HOLZ
      // -----------------------------------------------------------------------
      else if (lowerName.includes('playground_sand') || lowerName.includes('sand')) {
        child.material = materials.playgroundSand;
        child.receiveShadow = true;
      }
      else if (
        lowerName.includes('playground') || 
        lowerName.includes('spielplatz') || 
        lowerName.includes('spiel') || 
        lowerName.includes('schaukel') || 
        lowerName.includes('rutsche')
      ) {
        child.material = materials.playgroundWood;
      }
      // -----------------------------------------------------------------------
      // 7. HECKEN, TORE & DACHBEGRÜNUNG
      // -----------------------------------------------------------------------
      else if (lowerName.includes('privet_hedge') || lowerName.includes('hedge') || lowerName.includes('hecke')) {
        child.material = materials.hedge;
      }
      else if (
        lowerName.includes('gardengate') || 
        lowerName.includes('garden_gate') || 
        lowerName.includes('gate') || 
        lowerName.includes('tor')
      ) {
        child.material = materials.gardenGate;
      }
      else if (
        lowerName.includes('green_roof') || 
        lowerName.includes('sedum') || 
        lowerName.includes('roof_green') || 
        lowerName.includes('dachbegruenung')
      ) {
        child.material = materials.greenRoof;
        child.receiveShadow = true;
      }
    });

    // Instantiate minimalist trees at all placeholder locations
    treePlaceholderTransforms.forEach(({ position, quaternion, scale }) => {
      const tree = createMinimalistTree();
      tree.position.copy(position);
      tree.quaternion.copy(quaternion);
      
      // Preserve reasonable tree scale
      const avgScale = (scale.x + scale.y + scale.z) / 3;
      if (avgScale > 0.01 && avgScale < 50) {
        const adjustedScale = Math.max(0.7, Math.min(avgScale, 1.8));
        tree.scale.set(adjustedScale, adjustedScale, adjustedScale);
      }
      
      scene.add(tree);
      generatedTrees.push(tree);
    });

    // Compute bounding box and center camera & OrbitControls on model
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    camera.position.set(center.x + maxDim, center.y + maxDim, center.z + maxDim * 1.5);
    camera.lookAt(center);

    if (controls) {
      controls.target.copy(center);
      controls.update();
    }

    scene.add(loadedModel);
    console.log(`[Three.js] Model loaded from ${MODEL_PATH}. Hitboxes: ${hitboxMeshes.length}, Trees generated: ${generatedTrees.length}`);
  },
  (xhr) => {
    if (xhr.total > 0) {
      const progress = (xhr.loaded / xhr.total) * 100;
      console.log(`[Three.js] Loading progress: ${progress.toFixed(1)}%`);
    }
  },
  (error) => {
    console.error(`[Three.js] Error loading model from ${MODEL_PATH}:`, error);
  }
);

// =============================================================================
// 6. RAYCASTING & INTERACTIVE HOVER BEHAVIOR
// =============================================================================

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(-999, -999);
let currentlyHoveredHitbox = null;

// Track mouse position on the renderer canvas
function onMouseMove(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

// Reset mouse position when cursor leaves canvas
function onMouseLeave() {
  mouse.x = -999;
  mouse.y = -999;
}

window.addEventListener('mousemove', onMouseMove, { passive: true });
window.addEventListener('mouseleave', onMouseLeave, { passive: true });

function updateRaycasting() {
  if (hitboxMeshes.length === 0) return;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(hitboxMeshes, false);

  let newHovered = null;

  if (intersects.length > 0) {
    newHovered = intersects[0].object;
    renderer.domElement.style.cursor = 'pointer';
  } else {
    renderer.domElement.style.cursor = 'default';
  }

  // Update target opacities for all hitboxes
  for (let i = 0; i < hitboxMeshes.length; i++) {
    const mesh = hitboxMeshes[i];
    const isHovered = (mesh === newHovered);
    
    // Set target opacity (0.3 on hover, 0.0 idle)
    mesh.userData.targetOpacity = isHovered ? 0.3 : 0.0;
    mesh.userData.hovered = isHovered;
  }

  // Trigger optional custom event when hover changes
  if (newHovered !== currentlyHoveredHitbox) {
    currentlyHoveredHitbox = newHovered;
    if (currentlyHoveredHitbox) {
      window.dispatchEvent(new CustomEvent('apartmentHover', {
        detail: {
          unitName: currentlyHoveredHitbox.userData.unitName,
          object: currentlyHoveredHitbox
        }
      }));
    } else {
      window.dispatchEvent(new CustomEvent('apartmentHover', {
        detail: { unitName: null, object: null }
      }));
    }
  }
}

// =============================================================================
// 7. SMOOTH ANIMATION & RENDER LOOP
// =============================================================================

const LERP_SPEED = 0.12; // Controls smoothness of the opacity transition

function animate() {
  requestAnimationFrame(animate);

  // Update OrbitControls
  controls.update();

  // Raycast hover detection
  updateRaycasting();

  // Smoothly interpolate (lerp) hitbox opacity & emissive pulse
  for (let i = 0; i < hitboxMeshes.length; i++) {
    const mesh = hitboxMeshes[i];
    const target = mesh.userData.targetOpacity;
    
    // Lerp towards target opacity
    mesh.userData.currentOpacity += (target - mesh.userData.currentOpacity) * LERP_SPEED;
    
    // Apply interpolated opacity to standard material
    mesh.material.opacity = mesh.userData.currentOpacity;
    
    // Dynamic emissive glow intensity
    mesh.material.emissiveIntensity = 0.1 + (mesh.userData.currentOpacity / 0.3) * 0.25;
  }

  renderer.render(scene, camera);
}

animate();

// =============================================================================
// 8. RESPONSIVE WINDOW RESIZING
// =============================================================================

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener('resize', onWindowResize, false);

// Export for modular integration if needed
export {
  scene,
  camera,
  renderer,
  controls,
  hitboxMeshes,
  generatedTrees,
  materials,
  createMinimalistTree
};


