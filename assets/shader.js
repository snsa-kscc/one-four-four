export const vs = `
#ifdef GL_ES
precision mediump float;
#endif
// those are the mandatory attributes that the lib sets
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
// those are mandatory uniforms that the lib sets and that contain our model view and projection matrix
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
// our texture matrix that will handle image cover
uniform mat4 uTextureMatrix0;
// pass your vertex and texture coords to the fragment shader
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;
void main() {
vec3 vertexPosition = aVertexPosition;
gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);
// set the varyings
// here we use our texture matrix to calculate the accurate texture coords
vTextureCoord = (uTextureMatrix0 * vec4(aTextureCoord, 0.0, 1.0)).xy;
vVertexPosition = vertexPosition;
}
`;

export const fs = `
#ifdef GL_ES
precision mediump float;
#endif
// get our varyings
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;
// the uniform we declared inside our javascript
uniform float uTime;
// our texture sampler (default name, to use a different name please refer to the documentation)
uniform sampler2D uSampler0;
void main() {
// get our texture coords from our varying
vec2 textureCoord = vTextureCoord;
// displace our pixels along the X axis based on our time uniform
// textures coords are ranging from 0.0 to 1.0 on both axis
textureCoord.x += sin(textureCoord.y * 25.0) * cos(textureCoord.x * 25.0) * (cos(uTime / 50.0)) / 25.0;
// map our texture with the texture matrix coords
gl_FragColor = texture2D(uSampler0, textureCoord);
}
`;

export const vs1 = `
precision mediump float;
// default mandatory variables
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 planeTextureMatrix;
// custom variables
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;

uniform vec2 uMousePosition;
uniform float uTime;
uniform float uTransition;

void main() {
vec3 vertexPosition = aVertexPosition;

// convert uTransition from [0,1] to [0,1,0]
float transition = 1.0 - abs((uTransition * 2.0) - 1.0);

//vertexPosition.x *= (1 + transition * 2.25);

// get the distance between our vertex and the mouse position
float distanceFromMouse = distance(uMousePosition, vec2(vertexPosition.x, vertexPosition.y));
// calculate our wave effect
float waveSinusoid = cos(5.0 * (distanceFromMouse - (uTime / 30.0)));
// attenuate the effect based on mouse distance
float distanceStrength = (0.4 / (distanceFromMouse + 0.4));
// calculate our distortion effect
float distortionEffect = distanceStrength * waveSinusoid * 0.33;
// apply it to our vertex position
vertexPosition.z +=  distortionEffect * -transition;
vertexPosition.x +=  (distortionEffect * transition * (uMousePosition.x - vertexPosition.x));
vertexPosition.y +=  distortionEffect * transition * (uMousePosition.y - vertexPosition.y);
gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);
// varyings
vVertexPosition = vertexPosition;
vTextureCoord = (planeTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
}
`;

export const fs1 = `
precision mediump float;
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;
uniform sampler2D planeTexture;
void main( void ) {
// apply our texture
vec4 finalColor = texture2D(planeTexture, vTextureCoord);

// fake shadows based on vertex position along Z axis
finalColor.rgb += clamp(vVertexPosition.z, -1.0, 0.0) * 0.75;
// fake lights based on vertex position along Z axis
finalColor.rgb += clamp(vVertexPosition.z, 0.0, 1.0) * 0.75;
// just display our texture
gl_FragColor = finalColor;
}
`;

export const flowmapVs = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

// default mandatory variables
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

// custom variables
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;

void main() {
vec3 vertexPosition = aVertexPosition;

gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);

// varyings
vTextureCoord = aTextureCoord;
vVertexPosition = vertexPosition;
}
`;

export const flowmapFs = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec3 vVertexPosition;
varying vec2 vTextureCoord;

uniform sampler2D uFlowMap;

uniform vec2 uMousePosition;
uniform float uFalloff;
uniform float uAlpha;
uniform float uDissipation;

uniform vec2 uVelocity;
uniform float uAspect;

void main() {
vec2 textCoords = vTextureCoord;    
vec4 color = texture2D(uFlowMap, textCoords) * uDissipation;
//vec4 color = vec4(0.0, 0.0, 0.0, 1.0) * uDissipation;
vec2 mouseTexPos = (uMousePosition + 1.0) * 0.5;
vec2 cursor = vTextureCoord - mouseTexPos;
cursor.x *= uAspect;
vec3 stamp = vec3(uVelocity * vec2(1.0, -1.0), 1.0 - pow(1.0 - min(1.0, length(uVelocity)), 3.0));
float falloff = smoothstep(uFalloff, 0.0, length(cursor)) * uAlpha;
color.rgb = mix(color.rgb, stamp, vec3(falloff));
gl_FragColor = color;
}
`;

export const displacementVs = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

// default mandatory variables
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

// custom variables
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;

void main() {

gl_Position = vec4(aVertexPosition, 1.0);

// set the varyings
vTextureCoord = aTextureCoord;
vVertexPosition = aVertexPosition;
}
`;

export const displacementFs = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

// get our varyings
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;

// our render texture
uniform sampler2D uRenderTexture;
uniform sampler2D uFlowTexture;

void main() {
// our flowmap
vec4 flowTexture = texture2D(uFlowTexture, vTextureCoord);

// distort our image texture based on the flowmap values
vec2 distortedCoords = vTextureCoord;
distortedCoords -= flowTexture.xy * 0.1;

// get our final texture based on the displaced coords
vec4 texture = texture2D(uRenderTexture, distortedCoords);

vec4 rTexture = texture2D(uRenderTexture, distortedCoords + flowTexture.xy * 0.0125);
vec4 gTexture = texture2D(uRenderTexture, distortedCoords);
vec4 bTexture = texture2D(uRenderTexture, distortedCoords - flowTexture.xy * 0.0125);

// mix the BW image and the colored one based on our flowmap color values
float mixValue = clamp((abs(flowTexture.r) + abs(flowTexture.g) + abs(flowTexture.b)) * 1.5, 0.0, 1.0);

texture = mix(texture, vec4(rTexture.r, gTexture.g, bTexture.b, texture.a), mixValue);

gl_FragColor = texture;
}
`;
