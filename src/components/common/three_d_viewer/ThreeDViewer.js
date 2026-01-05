import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  OrbitControls,
  TDSLoader,
  OBJLoader,
  STLLoader,
  FBXLoader,
  ColladaLoader,
} from "three-stdlib";

const ThreeDViewer = ({ modelUrl }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!modelUrl) return;

    const mount = mountRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 2, 5);
    scene.add(directionalLight);

    // Add Orbit Controls (rotate + zoom)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Detect file extension
    const ext = modelUrl.split(".").pop().toLowerCase();

    let loader;
    switch (ext) {
      case "obj":
        loader = new OBJLoader();
        break;
      case "fbx":
        loader = new FBXLoader();
        break;
      case "stl":
        loader = new STLLoader();
        break;
      case "3ds":
        loader = new TDSLoader();
        break;
      case "dae":
        loader = new ColladaLoader();
        break;
      default:
        console.error("Unsupported 3D format:", ext);
        return;
    }

    // Load model
    loader.load(
      modelUrl,
      (object) => {
        let model = object.scene || object;
        model.scale.set(0.01, 0.01, 0.01);
        scene.add(model);
      },
      undefined,
      (error) => console.error("Error loading model:", error)
    );

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      mount.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
    };
  }, [modelUrl]);

  return <div ref={mountRef} style={{ width: "100%"}} />;
};

export default ThreeDViewer;
