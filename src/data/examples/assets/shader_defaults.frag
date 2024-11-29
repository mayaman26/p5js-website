/* This is a modification of a shader by Adam Ferriss
   https://github.com/aferriss/p5jsShaderExamples/blob/gh-pages/6_3d/6-2_vertexDisplacement
*/

/* WebGL requires that the first line of the fragment shader
   specify the precision.
   Precision is dependent on the the device.
   Sometimes you'll see bugs if you use lowp so stick to mediump or highp.
*/
precision mediump float;

/* Get the normal from the vertex shader.
   This is the same variable we declared in the vertex shader.
   We need to declare it here too!
*/
varying vec3 vNormal;

void main() {
  
  // Normalize the normal
  vec3 color = vNormal * 0.5 + 0.5;
  
  // Assign the color to be output to the screen
  gl_FragColor = vec4(color, 1.0);
}
