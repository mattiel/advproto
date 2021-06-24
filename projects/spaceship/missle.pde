class Missle {
  float x, y;
  float angle;
  float speed;
 
  Missle(float x, float y, float angle) {
    this.x = x;
    this.y = y;
    speed = 5;
    angle = radians(angle);
  }
 
  void render() {
     this.x += sin(angle) * speed;
     this.y -= cos(angle) * speed;
     fill(0, 0, 255);
     rect(x, y, 4, 4);
  }
}
