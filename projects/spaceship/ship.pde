class Ship {
  float angle;
  float y;
  float x;
  
  Ship() {
    this.angle = 0;
    this.x = 0;
    this.y = 0;
  }
  
  void render() {
    pushMatrix();

    translate(width/2, height/2);
    rotate(radians(angle));
    fill(255, 0, 0);
    rect(-32, -36, 64, 72);
    
    fill(0);
    circle(0, -24, 8);
    popMatrix();
  }
  
  void rotateLeft() {
     angle--; 
  }
  
  void rotateRight() {
     angle++; 
  }
  
  float getAngle() {
    return angle; 
  }
}
