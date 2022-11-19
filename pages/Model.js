import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useFrame, useLoader } from "@react-three/fiber";

const Model = () => {
  const { scene } = useLoader(GLTFLoader, "can.glb");
  console.log(scene);

  scene.rotation.z = 0.4;

  useFrame((_, delta) => {
    scene.rotation.y += -delta;
  });

  return <primitive object={scene} />;
};

export default Model;