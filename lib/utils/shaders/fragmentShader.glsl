uniform float time;
uniform vec2 hover;

void main() {
  gl_FragColor = vec4(0.015, 0.13, 0.14, 1.0);

  // float noise = 0.5 + 0.5 * sin(time + gl_FragCoord.xy.x * 0.1);
  // gl_FragColor.rgb *= noise;

}