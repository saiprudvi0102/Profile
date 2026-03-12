const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );
  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m = 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \\
  int index = 0;                                            \\
  for (int i = 0; i < 2; i++) {                               \\
     ColorStop currentColor = colors[i];                    \\
     bool isInBetween = currentColor.position <= factor;    \\
     index = int(mix(float(index), float(i), float(isInBetween))); \\
  }                                                         \\
  ColorStop currentColor = colors[index];                   \\
  ColorStop nextColor = colors[index + 1];                  \\
  float range = nextColor.position - currentColor.position; \\
  float lerpFactor = (factor - currentColor.position) / range; \\
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \\
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  
  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);
  
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;
  
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  
  vec3 auroraColor = intensity * rampColor;
  
  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16) / 255.0,
        parseInt(result[2], 16) / 255.0,
        parseInt(result[3], 16) / 255.0
    ] : [0, 0, 0];
}

class AuroraRenderer {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.gl = this.canvas.getContext('webgl2', {
            alpha: true,
            premultipliedAlpha: true,
            antialias: true
        });

        if (!this.gl) {
            console.error('WebGL2 is not available.');
            return;
        }

        this.options = {
            colorStops: ['#3A29FF', '#FF94B4', '#FF3232'],
            amplitude: 1.0,
            blend: 0.5,
            speed: 0.5,
            ...options
        };

        this.init();
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    init() {
        const gl = this.gl;

        const vertexShader = this.createShader(gl.VERTEX_SHADER, VERT);
        const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, FRAG);

        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error('Program linking error:', gl.getProgramInfoLog(this.program));
            return;
        }

        // Setup clear color and blending
        gl.clearColor(0, 0, 0, 0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        // Fullscreen Quad
        const positions = new Float32Array([
            -1.0, -1.0,
             1.0, -1.0,
            -1.0,  1.0,
            -1.0,  1.0,
             1.0, -1.0,
             1.0,  1.0,
        ]);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        this.positionAttributeLocation = gl.getAttribLocation(this.program, "position");
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);
        gl.enableVertexAttribArray(this.positionAttributeLocation);
        gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        // Uniforms
        this.uTimeLoc = gl.getUniformLocation(this.program, "uTime");
        this.uAmplitudeLoc = gl.getUniformLocation(this.program, "uAmplitude");
        this.uColorStopsLoc = gl.getUniformLocation(this.program, "uColorStops");
        this.uResolutionLoc = gl.getUniformLocation(this.program, "uResolution");
        this.uBlendLoc = gl.getUniformLocation(this.program, "uBlend");

        this.start = performance.now();
        this.resize();

        window.addEventListener('resize', this.resize.bind(this));
        
        requestAnimationFrame(this.render.bind(this));
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    render(now) {
        const gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(this.program);
        gl.bindVertexArray(this.vao);

        const time = (now - this.start) * 0.001 * this.options.speed * 0.1;

        gl.uniform1f(this.uTimeLoc, time);
        gl.uniform1f(this.uAmplitudeLoc, this.options.amplitude);
        gl.uniform1f(this.uBlendLoc, this.options.blend);
        gl.uniform2f(this.uResolutionLoc, this.canvas.width, this.canvas.height);

        const colors = new Float32Array([...hexToRgb(this.options.colorStops[0]), ...hexToRgb(this.options.colorStops[1]), ...hexToRgb(this.options.colorStops[2])]);
        gl.uniform3fv(this.uColorStopsLoc, colors);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        requestAnimationFrame(this.render.bind(this));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AuroraRenderer('aurora-canvas', {
        colorStops: ['#3A29FF', '#FF94B4', '#FF3232'],
        blend: 0.5,
        amplitude: 1.0,
        speed: 0.5
    });
});
