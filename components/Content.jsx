import { useRef, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Physics, useBox, usePlane } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';

function Cube(props) {
  const [ref] = useBox(() => ({ mass: 1, ...props }));
  const [hovered, hover] = useState(false)
  return (
    <mesh {...props} castShadow ref={ref} onPointerOver={(event) => hover(true)} onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
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
    // ref.current.rotation.x += 0.01;
    ref.current.rotation.z += 0.01;
  });

  return <group ref={ref}>{children}</group>
}

function Wall(props) {
  const [ref] = usePlane(() => ({ ...props}));
  const { viewport } = useThree();
  const pos = props.pos === 'top' ? [0, viewport.height / 2, 0] : [0, -viewport.height / 2, 0];

  return (
    <mesh ref={ref} scale={[viewport.width, viewport.height, 1]} position={pos} {...props}>
      <planeGeometry />
      <meshStandardMaterial color="white" />
    </mesh>
  )
}

function Model({ ...props }) {
  const group = useRef()
  const { nodes, materials } = useGLTF('public/renders/spaceship-v1-transformed.glb')
  return (
    <group ref={group} {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]} />
      </group>
      <mesh geometry={nodes.ship001.geometry} material={materials['spaceship.001']} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  )
}

const Content = (props) => {
  const ref = useRef();

  return (
    <>
      <div  ref={ref} className="content__wrapper">
        <p>{ props.content }</p>
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
          <directionalLight angle={0.15} penumbra={1} castShadow shadow-mapSize={[2024, 2024]} position={[10, 10, 10]}/>
          <pointLight position={[10, 0, 0]} />

          <Physics>
            {/* <BoundaryBox /> */}
            <Cube position={[0, 0, 0]} />
            <Cube position={[1.2, 0, 0]} />
            <Wall rotation={[-Math.PI / 2, 0, 0]} pos="top" />
            <Wall rotation={[-Math.PI / 2, 0, 0]} pos="bottom" />
          </Physics>
          <Shadows position={[0, 0, -0.2]} />
        </Canvas>
      </>
   );
}

export default Content;