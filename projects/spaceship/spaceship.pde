Ship ship;
ArrayList<Missle> missles = new ArrayList<Missle>();

void setup(){
  size(600, 600);
  ship = new Ship();
  background(255);
  smooth();
}

void draw(){
  background(255);
  
  ship.render();
  if(missles != null && missles.size() > 0) {
    for(int i = 0; i < missles.size() - 1; i++) {
      Missle missle = missles.get(i);
      print(missle, missle.x, missle.y);
      missle.render(); 
    }
  }

}

void keyPressed(){
  if(keyCode == 37){ 
    ship.rotateLeft();
  } else if(keyCode == 39){ 
    ship.rotateRight();
  } else if(keyCode == 32) {
    missles.add(new Missle(ship.x, ship.y, ship.getAngle()));
  }
}
