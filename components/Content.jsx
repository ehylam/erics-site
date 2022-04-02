import { useRef, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

function Cube(props) {
  const ref = useRef(0);
  const [hovered, hover] = useState(false);
  const { viewport } = useThree();

  useFrame(({ mouse }) => {
    const x = (mouse.x * viewport.width) / 2;
    const y = (mouse.y * viewport.height) / 2;

    ref.current.position.set(x, y, 0)
    ref.current.rotation.set(-y, x, 0)
    console.log(ref.current);
  })
  return (
    <mesh {...props} castShadow ref={ref} onPointerOver={(event) => hover(true)} onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}


function Plane(props) {
  const ref = useRef(0);
  const { viewport } = useThree();

  return (
    <mesh ref={ref} receiveShadow {...props}>
      <planeBufferGeometry attach="geometry" args={[viewport.width, viewport.height]} />
      <meshPhongMaterial attach="material" color="white" opacity="0" transparent/>
    </mesh>
  )
}


function Shadows(props) {
  const { viewport } = useThree();
  return (
    <mesh receiveShadow scale={[viewport.width, viewport.height, 1]} {...props}>
      <planeGeometry />
      <shadowMaterial transparent opacity={0.5} />
    </mesh>
  )
}

function Rotate({ children }) {
  const ref = useRef();
  useFrame(() => {
    ref.current.rotation.z += 0.01;
  });

  return <group ref={ref}>{children}</group>
}



const Content = (props) => {
  const ref = useRef();

  return (
    <>
      <div  ref={ref} className="content__wrapper">
        <div className="content__text">
          <p>{ props.content }</p>
        </div>
      </div>
      <Canvas
          className="content__canvas"
          shadows
          // frameloop="demand"
          dpr={[1, 2]}
          camera={{ position: [0, 0, 4] }}
          style={{ pointerEvents: 'none' }}
          onCreated={(state) => state.events.connect(ref.current)}>
          <ambientLight intensity={0.5} />
          <directionalLight angle={0.15} penumbra={1} castShadow shadow-mapSize={[2024, 2024]} position={[10, 10, 20]}/>
          <pointLight position={[10, 0, 2]} />
          <Plane />
          <Cube position={[0, 0, 0]} />
          <Shadows position={[0, 0, -0.45]} />
        </Canvas>
      </>
   );
}

export default Content;