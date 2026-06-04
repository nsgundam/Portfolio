import { useEffect, useRef } from 'react';
import { ScrollTrigger } from '../../lib/gsap';

export function NeuralNoise() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorObj = useRef({ r: 1.0, g: 1.0, b: 1.0, speed: 0.0004 });
  const pointerRef = useRef({ x: 0, y: 0, tX: 0, tY: 0 });
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation>>({});
  const animationFrameRef = useRef<number | null>(null);

  function initShader(): WebGLRenderingContext | null {
    const vsSource = `
      precision mediump float;
      varying vec2 vUv;
      attribute vec2 a_position;
      void main() {
        vUv = 0.5 * (a_position + 1.0);
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec2 vUv;
      uniform float u_time;
      uniform float u_ratio;
      uniform vec2 u_pointer_position;
      uniform vec3 u_color;
      uniform float u_speed;

      vec2 rotate(vec2 uv, float th) {
        return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
      }

      float neuro_shape(vec2 uv, float t, float p) {
        vec2 sine_acc = vec2(0.0);
        vec2 res = vec2(0.0);
        float scale = 8.0;
        for (int j = 0; j < 15; j++) {
          uv = rotate(uv, 1.0);
          sine_acc = rotate(sine_acc, 1.0);
          vec2 layer = uv * scale + float(j) + sine_acc - t;
          sine_acc += sin(layer) + 3.0 * p;
          res += (0.5 + 0.5 * cos(layer)) / scale;
          scale *= 1.2;
        }
        return res.x + res.y;
      }

      void main() {
        vec2 uv = 0.5 * vUv;
        uv.x *= u_ratio;
        vec2 pointer = vUv - u_pointer_position;
        pointer.x *= u_ratio;
        float p = clamp(length(pointer), 0.0, 1.0);
        p = 0.5 * pow(1.0 - p, 2.0);
        float t = u_speed * u_time;
        vec3 col = vec3(0.0);
        float noise = neuro_shape(uv, t, p);
        noise = 1.2 * pow(noise, 2.0);
        noise += pow(noise, 5.0);
        noise = max(0.0, noise - 0.3);
        noise *= (1.0 - length(vUv - 0.5));

        vec3 color1 = vec3(0.0, 0.91, 0.48);
        vec3 color2 = vec3(0.48, 0.31, 0.75);
        vec3 color3 = vec3(0.31, 0.76, 0.97);
        vec3 color4 = vec3(1.0, 0.24, 0.43);
        
        vec3 mixColor = mix(color1, color2, vUv.x + 0.2 * sin(t));
        mixColor = mix(mixColor, color3, vUv.y + 0.2 * cos(t));
        mixColor = mix(mixColor, color4, smoothstep(0.5, 1.5, noise));
        
        col = mixColor * noise * u_color;
        gl_FragColor = vec4(col, noise);
      }
    `;

    const canvasEl = canvasRef.current;
    if (!canvasEl) return null;

    const gl =
      canvasEl.getContext('webgl') ||
      (canvasEl.getContext('experimental-webgl') as WebGLRenderingContext);

    if (!gl) {
      console.error('WebGL not supported');
      return null;
    }

    const vertexShader = createShader(gl, vsSource, gl.VERTEX_SHADER);
    const fragmentShader = createShader(gl, fsSource, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return null;

    const shaderProgram = createProgram(gl, vertexShader, fragmentShader);
    if (!shaderProgram) return null;

    uniformsRef.current = getUniforms(gl, shaderProgram);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.useProgram(shaderProgram);
    const positionLocation = gl.getAttribLocation(shaderProgram, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    return gl;
  }

  function createShader(
    gl: WebGLRenderingContext,
    source: string,
    type: number
  ): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  function createProgram(
    gl: WebGLRenderingContext,
    vs: WebGLShader,
    fs: WebGLShader
  ): WebGLProgram | null {
    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return null;
    }

    return program;
  }

  function getUniforms(
    gl: WebGLRenderingContext,
    program: WebGLProgram
  ): Record<string, WebGLUniformLocation> {
    const uniforms: Record<string, WebGLUniformLocation> = {};
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < uniformCount; i++) {
      const uniformName = gl.getActiveUniform(program, i)?.name;
      if (uniformName) {
        const location = gl.getUniformLocation(program, uniformName);
        if (location) {
          uniforms[uniformName] = location;
        }
      }
    }

    return uniforms;
  }

  function render() {
    const gl = glRef.current;
    if (!gl) return;

    const currentTime = performance.now();
    const pointer = pointerRef.current;
    const uniforms = uniformsRef.current;

    pointer.x += (pointer.tX - pointer.x) * 0.2;
    pointer.y += (pointer.tY - pointer.y) * 0.2;

    gl.uniform1f(uniforms.u_time, currentTime);
    gl.uniform2f(
      uniforms.u_pointer_position,
      pointer.x / window.innerWidth,
      1 - pointer.y / window.innerHeight
    );
    gl.uniform3f(uniforms.u_color, colorObj.current.r, colorObj.current.g, colorObj.current.b);
    gl.uniform1f(uniforms.u_speed, colorObj.current.speed);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    animationFrameRef.current = requestAnimationFrame(render);
  }

  function resizeCanvas() {
    const canvasEl = canvasRef.current;
    const gl = glRef.current;
    if (!canvasEl || !gl) return;

    const devicePixelRatio = Math.min(window.devicePixelRatio, 2);
    canvasEl.width = window.innerWidth * devicePixelRatio;
    canvasEl.height = window.innerHeight * devicePixelRatio;

    const uniforms = uniformsRef.current;
    if (uniforms.u_ratio) {
      gl.uniform1f(uniforms.u_ratio, canvasEl.width / canvasEl.height);
    }

    gl.viewport(0, 0, canvasEl.width, canvasEl.height);
  }

  function setupEvents() {
    const pointer = pointerRef.current;

    const updateMousePosition = (x: number, y: number) => {
      pointer.tX = x;
      pointer.tY = y;
    };

    const pointermove = (e: PointerEvent) => updateMousePosition(e.clientX, e.clientY);
    const touchmove = (e: TouchEvent) => {
      if (e.targetTouches[0]) {
        updateMousePosition(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
      }
    };
    const click = (e: MouseEvent) => updateMousePosition(e.clientX, e.clientY);

    window.addEventListener('pointermove', pointermove);
    window.addEventListener('touchmove', touchmove);
    window.addEventListener('click', click);

    return () => {
      window.removeEventListener('pointermove', pointermove);
      window.removeEventListener('touchmove', touchmove);
      window.removeEventListener('click', click);
    };
  }

  useEffect(() => {
    const gl = initShader();
    if (!gl) return;

    glRef.current = gl;
    const cleanupEvents = setupEvents();
    resizeCanvas();

    const resizeListener = () => resizeCanvas();
    window.addEventListener('resize', resizeListener);

    const st = ScrollTrigger.create({
      id: "neural-noise-st",
      trigger: "#hero",
      start: "bottom bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        colorObj.current.r = 1.0 - 0.97 * p;
        colorObj.current.g = 1.0 - 0.98 * p;
        colorObj.current.b = 1.0 - 0.98 * p;
        colorObj.current.speed = 0.0001 * (1 - p);
      }
    });

    render();

    return () => {
      window.removeEventListener('resize', resizeListener);
      cleanupEvents();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      st.kill();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.95,
      }}
    />
  );
}
