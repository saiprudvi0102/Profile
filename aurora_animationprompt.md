You are given a task to integrate an existing React component in the codebase

~~~/README.md
# Aurora

A high-performance WebGL aurora borealis effect using OGL. This component creates a smooth, flowing gradient animation that simulates the northern lights with configurable colors, speed, and intensity.

## Usage

```tsx
import { Aurora } from '@/sd-components/320ca513-9e1d-4da7-ad85-92f1717417a7';

function MyComponent() {
  return (
    <div style={{ height: '500px', width: '100%', position: 'relative' }}>
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colorStops` | `string[]` | `['#5227FF', '#7cff67', '#5227FF']` | Array of 3 hex color strings defining the gradient ramp. |
| `amplitude` | `number` | `1.0` | Controls the height/intensity of the aurora waves. |
| `blend` | `number` | `0.5` | Controls the softness/blend of the color edges. |
| `speed` | `number` | `1.0` | Multiplier for the animation speed. |
| `time` | `number` | `undefined` | Optional override for the time uniform (for manual control). |

## Dependencies

- `ogl`: Lightweight WebGL library
- `react`: Component framework
~~~

~~~/src/App.tsx
import { Aurora } from './Component';
import { RefreshCw, Play, RotateCcw } from 'lucide-react';
import { useState } from 'react';

export default function App() {
  const [key, setKey] = useState(0);

  const handleReplay = () => {
    setKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1B] p-8 font-sans">
      <div className="w-full max-w-4xl relative">
        {/* Main Content Card */}
        <div className="relative overflow-hidden rounded-2xl bg-black/20 border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.2)] aspect-[16/9]">
          
          {/* Background Gradient to blend with Aurora */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40 z-10 pointer-events-none" />
          
          {/* Aurora Component */}
          <div className="absolute inset-0 z-0">
            <Aurora
              key={key}
              colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
              blend={0.5}
              amplitude={1.0}
              speed={0.5}
            />
          </div>

          {/* Foreground Content */}
          <div className="absolute inset-0 z-20 p-8 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-medium text-white tracking-tight mb-2">
                  Aurora Borealis
                </h1>
                <p className="text-white/60 text-sm max-w-xs leading-relaxed">
                  A WebGL-based fluid simulation mimicking the northern lights using OGL.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/5 backdrop-blur-sm">
                  WebGL
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/5 backdrop-blur-sm">
                  OGL
                </span>
              </div>
            </div>

            {/* Controls / Footer */}
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-4">
                 <button 
                  onClick={handleReplay}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors backdrop-blur-md border border-white/10 group"
                >
                  <RotateCcw className="w-4 h-4 text-white/80 group-hover:-rotate-180 transition-transform duration-500" />
                  <span>Replay</span>
                </button>
              </div>
              
              <div className="text-right">
                <div className="text-white/40 text-xs font-mono">
                  AMPLITUDE: 1.0 <br/> SPEED: 0.5
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements outside */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none mix-blend-screen" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none mix-blend-screen" />
      </div>
    </div>
  );
}
~~~

~~~/package.json
{
  "name": "aurora-component",
  "description": "A WebGL-based aurora borealis effect using OGL",
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "ogl": "^1.0.11",
    "lucide-react": "^0.344.0"
  }
}
~~~

~~~/src/Component.tsx
import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';

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

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
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

export interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  time?: number;
  speed?: number;
}

export function Aurora(props: AuroraProps) {
  const { colorStops = ['#5227FF', '#7cff67', '#5227FF'], amplitude = 1.0, blend = 0.5 } = props;
  const propsRef = useRef<AuroraProps>(props);
  propsRef.current = props;

  const ctnDom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true
    });
    const gl = renderer.gl;
    
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    
    // Ensure canvas is transparent
    gl.canvas.style.backgroundColor = 'transparent';

    let program: Program | undefined;

    function resize() {
      if (!ctn) return;
      const width = ctn.offsetWidth;
      const height = ctn.offsetHeight;
      renderer.setSize(width, height);
      if (program) {
        program.uniforms.uResolution.value = [width, height];
      }
    }
    window.addEventListener('resize', resize);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    const colorStopsArray = colorStops.map(hex => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });

    program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: colorStopsArray },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uBlend: { value: blend }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    let animateId = 0;
    const update = (t: number) => {
      animateId = requestAnimationFrame(update);
      const { time = t * 0.01, speed = 1.0 } = propsRef.current;
      
      if (program) {
        program.uniforms.uTime.value = time * speed * 0.1;
        program.uniforms.uAmplitude.value = propsRef.current.amplitude ?? 1.0;
        program.uniforms.uBlend.value = propsRef.current.blend ?? blend;
        
        const stops = propsRef.current.colorStops ?? colorStops;
        program.uniforms.uColorStops.value = stops.map((hex: string) => {
          const c = new Color(hex);
          return [c.r, c.g, c.b];
        });
        
        renderer.render({ scene: mesh });
      }
    };
    animateId = requestAnimationFrame(update);
    resize();

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener('resize', resize);
      if (ctn && gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [amplitude]);

  return <div ref={ctnDom} className="w-full h-full" />;
}

export default Aurora;
~~~

Implementation Guidelines

1. Analyze the component structure, styling, animation implementations
2. Review the component's arguments and state
3. Think through what is the best place to adopt this component/style into the design we are doing
4. Then adopt the component/design to our current system

Help me integrate this into my design