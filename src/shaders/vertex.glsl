attribute vec2 aPosition;
attribute float aHeight;

void main() {
  gl_Position = vec4(aPosition.x, aPosition.y * aHeight, 0, 1);
}