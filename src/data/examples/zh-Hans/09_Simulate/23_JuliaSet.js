 /*
 * @name Julia Set
 * @frame 710,400 
 * @arialabel Using the mouse position to explore Julia sets in real time.
 * @description An example of how to create and use a shader in 1 JS file using a Julia set
 */
 
// Vertex shader simply maps our canvas space.
const vertexShader = `
    attribute vec2 aPosition;
    void main() {
        // Assign each corner of our canvas to a position in WebGL clip space (from -1 to 1 in both dimensions)
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
`;

// Fragment shader performs calculations for every pixel in the canvas.
const fragmentShader = `
    precision mediump float;

    // Uniforms are data that is the same for all pixels processed by the shader.
    uniform vec2 c; // Complex number for fractal calculation
    uniform vec2 screenSize; // Dimensions of the screen
    uniform float hue; // Color hue

    // Function to convert color from HSL to RGB.
    vec3 hsl2rgb(vec3 hsl) {
        float a, b, c;
        vec3 result;
        for (int i = 0; i < 3; ++i) {
            a = hsl.x + float(i) * 1.3;
            b = 1.0 - abs(mod(a * a*a*a, 1.0) - 1.0);
            c = hsl.z - hsl.z * hsl.y * b* 3.0;
            result[i] = c;
        }
        return result;
    }

    // Picks a color based on a given value (iteration count)
    vec3 color_map(float value) {
        float hue_offset = 0.0;
        float saturation = 0.0;
        float brightness = value; 
        return hsl2rgb(vec3(hue_offset, saturation, brightness));
    }

    // This function calculates the fractal value for each pixel using the iteration cap
    vec4 sample(vec2 normd_pixel) {
        vec2 z = normd_pixel; // itteration for the value of z for each pixel
        float value = 0.0;
        const int iter_cap = 80;

        // Main loop for each pixel
        // Check to see how many iterations it takes for Z to be greater than the value 3 and setting it a colour accordingly,
        for (int i = 0; i < iter_cap; ++i) {
            if (dot(z, z) > 3.0) {
                // If the series escapes, we calculatae  'value based on the iteration number of iterations it took that value to escape
                value = float(i) / float(iter_cap);
                break;
            }
            z = vec2( z.x*z.x - z.y * z.y, 2.0 * z.x * z.y)  + c;
        }

        // Return the color of the pixel based on its 'value'. If it didnt escape the value of it is 0
        return vec4(color_map(value), 1.0);
    }
    void main() {
        // Define the screen size as a 2D vector 
        vec2 screenSize = vec2(710.0, 400.0);
        // Get normalized screen space coordinates for the current pixel,
        vec2 normd_pixel = (gl_FragCoord.xy/screenSize - 0.5) * 2.0;
        // Adjust y-coordinate for aspect ratio,
        normd_pixel.y *= screenSize.y / screenSize.x;

        // Runs the sample function for each pixel
        vec4 color = sample(normd_pixel);

        // Sets the color of the pixel
        gl_FragColor = color;
    }
`;


    let canvas;
    //This is what we will use to create and store our shader in
    let JuliaSet;

    let screenSize;
    let samples;
    let targetC;
    let currentC;
    let currentHue;

    function setup() {
        canvas = createCanvas(710, 400, WEBGL);
        background(0)
        //We create and store the shader using the vS and fS we made before
        JuliaSet = createShader(vertexShader, fragmentShader);
        //We load our created shader to be used in the draw block
        shader(JuliaSet);

        screenSize = [width, height];
        
        //Initialising values used in the calcutions inside of our shader
        targetC = [1.0, 0.0];
        currentC = [0.0, 0.0];
        currentHue = 0.0;

        noStroke();
    }

function draw() {
    JuliaSet.setUniform("screenSize", screenSize);

    // Get mouse position
    let mouseXRatio = mouseX / width;
    let mouseYRatio = mouseY / height;

    targetC[0] = (mouseXRatio - 0.5) * 2;
    targetC[1] = -(mouseYRatio - 0.5) * 2;
    let targetHue = mouseXRatio * 360;

    // Animate the transition of c and hue
    currentC[0] = currentC[0] * 0.9 + targetC[0] * 0.1;
    currentC[1] = currentC[1] * 0.9 + targetC[1] * 0.1;
    currentHue = currentHue * 0.9 + targetHue * 0.1;

    // Sending the new target complex number gaiend from the mouse position
    // to the julia set equation 
    JuliaSet.setUniform("c", currentC);

    // Set the hue as the uniform in the shader
    JuliaSet.setUniform("hue", currentHue);

    quad(-1, -1, 1, -1, 1, 1, -1, 1);
}
