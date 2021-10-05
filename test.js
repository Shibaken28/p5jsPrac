class Vector2 {
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }
    set(x, y) {
      this.x = x;
      this.y = y;
      return this;
    }
    add(v) {
      return new Vector2(this.x+v.x,this.y+v.y);
    }
    sub(v) {
      return new Vector2(this.x-v.x,this.y-v.y);
    }
    arrow(rad,len){
      return new Vector2(this.x+cos(rad)*len,this.y+sin(rad)*len);
    }
    rotate(rad){
      return new Vector2(this.x*cos(rad)-this.y*sin(rad),this.x*sin(rad)+this.y*cos(rad));
    }
    dot(v2) {
      return (this.x * v2.x + this.y * v2.y);
    }
    clone(){
      return new Vector2(this.x,this.y);
    }
  }
  
  class Arm{
    constructor(rad=PI/2,len=10) {
      this.rad=rad;//相対角度
      this.len=len;//関節の長さ
      this.absPos=new Vector2();//絶対座標
      this.absRad=0;//絶対角度
    }
  }
  
  class Articulated{//関節の集まり(多関節)
    constructor(jointsNum,x,y){
      this.joints = new Array(jointsNum);//arm
      this.root = new Vector2(x,y);
      for(let i=0;i<this.joints.length;i++){
        this.joints[i]=new Arm(0,getRandomInt(20,50));
      }
      this.calc();
    }
    
    draw(){
      let top=this.root;
      let sumRad=0;
      for (let i=0;i<this.joints.length;i++){
        //if(i>0)line(this.joints[i-1].absPos.x,this.joints[i-1].absPos.y,this.joints[i].absPos.x,this.joints[i].absPos.y); 
    ellipse(this.joints[i].absPos.x,this.joints[i].absPos.y,this.joints[i].len);
      }
    }
    
    moveAt(pos){
      for (let i=this.joints.length-1;i>=1;i--){
        let cor=pos.sub(this.joints[i].absPos);//目的の方向ベクトル
        let dir=this.joints[this.joints.length-1].absPos.sub(this.joints[i].absPos);
        //print(pos,dir,cor);
        let right=dir.rotate(PI/120);
        let left=dir.rotate(-PI/120);
        let n=cor.dot(dir);
        let r=cor.dot(right);
        let l=cor.dot(left);
        if(r>l){
          this.joints[i].rad+=0.005;
        }else if(l>r){
          this.joints[i].rad-=0.005;
        }
      }
      this.calc();
    }
    
    calc(){
      this.joints[0].rad=cos(millis()/1000)*PI/9;
      this.joints[1].rad=cos(millis()/1000)*PI/9;
      this.joints[2].rad=cos(millis()/1000)*PI/9;
      let top=this.root;
      let sumRad=0;
      for (let i=0;i<this.joints.length;i++){
        sumRad+=this.joints[i].rad;
        this.joints[i].absPos=top;
        this.joints[i].absRad=sumRad;
        top=top.arrow(sumRad,this.joints[i].len);
      }
    }
  
  }
  
  
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }
  
  function setup() {
    createCanvas(1200, 800);
    stroke(255);
    fill(255);
    noCursor();
    //noStroke();
    tentacleArray = new Array(20);
    for(let i=0;i<tentacleArray.length;i++){
      tentacleArray[i]=new Articulated(10,100,i*200);
    }
  }
  
  function draw() {
    background(0);
    fill(255,0,0);
    let vec=new Vector2(mouseX,mouseY);
    for(let i=0;i<tentacleArray.length;i++){
      tentacleArray[i].moveAt(vec);
      tentacleArray[i].draw();
    }
    
    fill(255);
    ellipse(mouseX,mouseY,50,50);
  }
  
  
  