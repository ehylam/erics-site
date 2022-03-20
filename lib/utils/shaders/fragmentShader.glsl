uniform float time;
uniform vec2 hover;

varying float vRandom;
varying float zPosition;

void main() {
  float z = gl_FragCoord.z / gl_FragCoord.w;
  float noise = 0.5 + 0.5 * sin(time + z * 0.02);
  // gl_FragColor = vec4(0.015, vRandom, 0.14, 1.0);
  gl_FragColor = vec4(0.015, 0.13, 0.14, 1.0);

  // gl_FragColor.rgb -= noise * 0.01;

}