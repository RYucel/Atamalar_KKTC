import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;

// Ashima 2D Simplex Noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
   vec2 mouseOffset = uMouse * 0.5;
   float noise1 = snoise(vUv * 2.5 + uTime * 0.1 + mouseOffset);
   float noise2 = snoise(vUv * 4.0 - uTime * 0.15 - mouseOffset * 0.5);
   float pattern = snoise(vUv * 2.0 + noise1 + noise2 * 0.5);
   
   // Create a painted brush stroke texture effect
   float brush = smoothstep(0.0, 1.0, pattern * 0.5 + 0.5);
   
   vec3 finalColor = mix(uColor1, uColor2, brush);
   
   gl_FragColor = vec4(finalColor, 1.0);
}
`;

const BackgroundMaterial = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const targetMouse = useRef(new THREE.Vector2(0, 0));
  const currentMouse = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor1: { value: new THREE.Color('#0f172a') }, // Slate 900
      uColor2: { value: new THREE.Color('#312e81') }, // Indigo 900
    }),
    []
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
      
      // Smoothly interpolate mouse
      currentMouse.current.lerp(targetMouse.current, 0.05);
      materialRef.current.uniforms.uMouse.value.copy(currentMouse.current);

      // GSAP ScrollTrigger updates root CSS variables for dynamic colors
      const rootStyle = getComputedStyle(document.documentElement);
      const c1 = rootStyle.getPropertyValue('--bg-color-1').trim() || '#0f172a';
      const c2 = rootStyle.getPropertyValue('--bg-color-2').trim() || '#312e81';
      
      const color1 = new THREE.Color(c1);
      const color2 = new THREE.Color(c2);
      
      const uColor1 = materialRef.current.uniforms.uColor1.value;
      const uColor2 = materialRef.current.uniforms.uColor2.value;

      uColor1.lerp(color1, 0.05);
      uColor2.lerp(color2, 0.05);
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
};

export default function FluidBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
      <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }}>
        <BackgroundMaterial />
      </Canvas>
    </div>
  );
}
