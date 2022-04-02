import * as THREE from 'three';
import { useRef, useState, useEffect } from 'react';
import { Canvas, useThree, useLoader } from '@react-three/fiber';
import { useIntersect, ScrollControls, Scroll, MeshDistortMaterial } from '@react-three/drei';

function Item({ url, scale, ...props}) {
  const visible = useRef(false);
  const ref = useIntersect((isVisible) => (visible.current = isVisible));
  const { height } = useThree((state) => state.viewport);
  const texture = useLoader(THREE.TextureLoader, url);

  console.log(texture);

  return (
    <group {...props}>
      <mesh onPointerOver={() => hover(true)} onPointerOut={() => hover(false)} scale={[2, 4, 1]}>
        <planeGeometry attach="geometry" args={[1, 1, 32, 32]} />
        {/* <MeshDistortMaterial ref={ref} speed={5}  attach="material" map={texture} /> */}
      </mesh>
    </group>
  )
}


function Items() {
  const { width: w, height: h } = useThree((state) => state.viewport)

  return (
    <Scroll>
      <Item url="/images/pic1.jpeg" scale={[w / 3, w / 3, 1]} position={[-w / 6, 0, 0]} />
      <Item url="/images/pic2.jpeg" scale={[2, w / 3, 1]} position={[w / 30, -h, 0]} />
      <Item url="/images/pic3.jpeg" scale={[w / 3, w / 5, 1]} position={[-w / 4, -h * 1, 0]} />
    </Scroll>
  )
}

const ImageBlock = (props) => {
  return (
    <Canvas orthographic camera={{ zoom: 80 }} gl={{ alpha: false, antialias: false, stencil: false, depth: false }} dpr={[1, 1.5]}>
      <ScrollControls damping={6} pages={5}>
        <Items />
      </ScrollControls>
    </Canvas>
   );
}

export default ImageBlock;