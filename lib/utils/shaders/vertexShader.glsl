uniform float time;
uniform vec2 hover;
uniform float hoverState;

attribute float aRandom;

varying float vNoise;
varying float vRandom;
varying float zPosition;
varying vec2 vUv;




void main() {
  // vec3 newposition = position;
  // float dist = distance(uv,hover);
  // newposition.z += 10.0*sin(vRandom*10. + time * 0.2);

  // vNoise = sin(dist*10.0 - time);

  // vUv = uv;
  // gl_Position = projectionMatrix * modelViewMatrix * vec4( newposition, 1.0 );

  // zPosition = newposition.z;
  // vRandom = aRandom;


  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.z += aRandom * 0.1;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedMatrix = projectionMatrix * viewPosition;

  gl_Position = projectedMatrix;

  vRandom = aRandom;
}