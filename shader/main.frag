varying vec2 vUv;

uniform sampler2D uTexture;
uniform float uProgress;
uniform float uTime;
uniform float uAnimation;

void main() {

  // vec4 color = texture2D(uTexture,vec2(vUv.x,abs(sin(uTime * 0.1))));

  vec4 color1 = texture2D(uTexture,vUv);
  vec4 color2 = texture2D(uTexture,vec2(uAnimation,vUv.y));
  vec4 final = mix(color2,color1,step(vUv.x,uAnimation));

  // gl_FragColor = vec4(vUv,uProgress,1.);
  // gl_FragColor = color;
  gl_FragColor = final;
}