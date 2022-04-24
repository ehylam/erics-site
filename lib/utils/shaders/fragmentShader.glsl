uniform float time;
uniform vec2 hover;
uniform sampler2D t;

varying float vRandom;
varying float zPosition;
varying vec2 vUv;

void main() {

  vec4 tt = texture2D(t, vUv);
  gl_FragColor = tt;

  // gl_FragColor.rgb -= noise * 0.01;

}