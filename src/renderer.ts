import vertexShaderSource from "./shaders/vertex.glsl";
import fragmentShaderSource from "./shaders/fragment.glsl";

export class Renderer {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private positionAttributeLocation: number;
  private heightAttributeLocation: number;
  private positionBuffer: WebGLBuffer;
  private NUM_BARS: number = 64;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.program = this.createProgram();
    this.positionAttributeLocation = this.gl.getAttribLocation(
      this.program,
      "aPosition",
    );
    this.heightAttributeLocation = this.gl.getAttribLocation(
      this.program,
      "aHeight",
    );
    this.positionBuffer = this.gl.createBuffer()!;
  }

  private createProgram(): WebGLProgram {
    const vertexShader = this.compileShader(
      vertexShaderSource,
      this.gl.VERTEX_SHADER,
    );
    const fragmentShader = this.compileShader(
      fragmentShaderSource,
      this.gl.FRAGMENT_SHADER,
    );

    const program = this.gl.createProgram();
    if (!program) throw new Error("Failed to create WebGL program");

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw new Error(
        "Program linking error: " + this.gl.getProgramInfoLog(program),
      );
    }

    return program;
  }

  private compileShader(source: string, type: number): WebGLShader {
    const shader = this.gl.createShader(type);
    if (!shader) throw new Error("Failed to create shader");

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const info = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw new Error("Shader compilation error: " + info);
    }
    return shader;
  }

  render(frequencyData: Uint8Array): void {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.useProgram(this.program);

    const sampleSize = Math.floor(frequencyData.length / this.NUM_BARS);

    const positions = [];
    const heights = [];
    const barWidth = 2.0 / this.NUM_BARS;

    for (let i = 0; i < this.NUM_BARS; i++) {
      let sum = 0;
      for (let j = 0; j < sampleSize; j++) {
        sum += frequencyData[i * sampleSize + j];
      }
      const value = sum / sampleSize / 255.0; // Normalize to 0-1

      const x1 = -1.0 + i * barWidth;
      const x2 = x1 + barWidth;

      positions.push(x1, -1.0, x2, -1.0, x1, 1.0);
      heights.push(value, value, value);

      positions.push(x1, 1.0, x2, -1.0, x2, 1.0);
      heights.push(value, value, value);
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.DYNAMIC_DRAW,
    );
    this.gl.vertexAttribPointer(
      this.positionAttributeLocation,
      2,
      this.gl.FLOAT,
      false,
      0,
      0,
    );
    this.gl.enableVertexAttribArray(this.positionAttributeLocation);

    const heightBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, heightBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(heights),
      this.gl.DYNAMIC_DRAW,
    );
    this.gl.vertexAttribPointer(
      this.heightAttributeLocation,
      1,
      this.gl.FLOAT,
      false,
      0,
      0,
    );
    this.gl.enableVertexAttribArray(this.heightAttributeLocation);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, positions.length / 2);
  }
}
