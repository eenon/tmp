import * as THREE from 'three'
import React, { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from "@react-three/drei";

function Galaxy() {
  const particles = useRef()

  useFrame((state) => {
      particles.current.rotation.x = THREE.MathUtils.lerp(particles.current.rotation.x, -state.mouse.y / 15, 0.1)
      particles.current.rotation.y = THREE.MathUtils.lerp(particles.current.rotation.y, state.mouse.x / 15, 0.1)
  })
      
  useEffect(() => {
    const positions = new Float32Array(70000 * 3)
    const colors = new Float32Array(70000 * 3)
    const colorInside = new THREE.Color(0.9876, 0.2765, 0.1882)
    const colorOutside = new THREE.Color(0.10588, 0.32353, 0.61765)

    for (let i = 100; i < 70000; i+=1) {
      const i3 = i * 3

      const radius = Math.random() * 6
      const spinAngle = radius * 1
      const branchAngle = ((i % 3) / 5) * Math.PI * 2.5

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + (Math.pow(Math.random(), 2.83) * (Math.random() < 0.5 ? 1 : -1) * 0.39 * radius)
      positions[i3 + 1] = Math.pow(Math.random(), 2.83) * (Math.random() < 0.5 ? 1 : -1) * 0.39 * radius
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + (Math.pow(Math.random(), 2.83) * (Math.random() < 0.5 ? 1 : -1) * 0.39 * radius)

      const mixedColor = colorInside.clone()
      mixedColor.lerp(colorOutside, radius / 5)

      colors[i3] = mixedColor.r
      colors[i3 + 1] = mixedColor.g
      colors[i3 + 2] = mixedColor.b
    }

    particles.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particles.current.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  })

  return (
    <points ref={particles}>
      <bufferGeometry />
      <pointsMaterial size={0.02} sizeAttenuation={true} depthWrite={true} vertexColors={true} blending={THREE.AdditiveBlending} />
    </points>
  )
}

function Sphere() {
  const { scene, gl } = useThree();
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
    format: THREE.RGBAFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter
  });
  const cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);
  cubeCamera.position.set(0, 0, 0);
  scene.add(cubeCamera);

  useFrame(() => cubeCamera.update(gl, scene));

  return (
    <mesh visible rotation={[0, 0, 0]} castShadow>
      <directionalLight intensity={1}  />
      <sphereGeometry attach="geometry" args={[0.28, 32, 32]} />
      <meshBasicMaterial
        attach="material"
        envMap={cubeCamera.renderTarget.texture}
        color="white"
        roughness={0}
        metalness={1}
      />
    </mesh>
  );
}

export default function Home() {
  return (
      <>
   <div className='w-full h-full fixed'>
     <Canvas linear flat colorManagement={false} camera={{ position: [0, 2.5, 6.2] }}>
    <Suspense fallback={null}>
      <Galaxy/>
      <Sphere/>
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} autoRotate={true} autoRotateSpeed={0.05}/>
      <Stars radius={400} depth={20} count={30000} factor={9} saturation={1} fade={true}/>
    </Suspense>
     </Canvas>
  </div>
    <div className='text-4xl text-center relative'>
      <h1>Hello World</h1>
    </div>
      </>
  )
}
