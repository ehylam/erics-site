uniform float time;
uniform vec2 hover;
uniform sampler2D t;

varying float vRandom;
varying float zPosition;
varying vec2 vUv;

void main() {
  // float z = gl_FragCoord.z / gl_FragCoord.w;
  // float noise = 0.5 + 0.5 * sin(time + z * 0.02);

  vec4 tt = texture2D(t, vUv);
  // gl_FragColor = vec4(0.015, 0, 0.14, 1.0);
  // gl_FragColor = vec4(0.015, 0.13, 0.14, 1.0);
  gl_FragColor = vec4(vUv, 0.0, 1.0);
  // gl_FragColor = tt;

  // gl_FragColor.rgb -= noise * 0.01;

}