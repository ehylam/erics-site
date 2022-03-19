uniform float time;
uniform vec2 hover;
uniform float hoverState;
varying float vNoise;
varying vec2 vUv;

void main() {
  vec3 newposition = position;
  float dist = distance(uv,hover);
  newposition.z += 10.0*sin(dist*10. + time * 0.2);
  vNoise = sin(dist*10.0 - time);

  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( newposition, 1.0 );

  gl_Position.y += 0.5*cos(vNoise);


}