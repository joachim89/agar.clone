
let w;
let h;
let player;
let mapScale = 3000;
let foodCount=100;
let food = [];
let enemy = [];
let nrEnemies = 8;
let points = 0;
let scores = [];
let popSnd;
let enSnd;
let slomo=0;
let slider;
let startBtn;

let history = [getTime()+": Joachim says HI!","" ,"","",""];
function preload(){
	popSnd = loadSound("./libs/pop.mp3");
	enSnd = loadSound("./libs/enpop.mp3");
}
function setup(){
	w=windowWidth;
	h=windowHeight;
	createCanvas(w,h);
	player = new Player;
	for(var e=0;e<nrEnemies;e++){
		enemy[e] = new Enemy;
		enemy[e].name="Enemy " + parseInt(e+1);
	}
	
	for(i=0;i<foodCount;i++){
		food.push(new Food);
	}

	startBtn = createButton("START GAME");
	startBtn.position((w/2)-40,h/2);
	startBtn.mousePressed(startGame);
	slider = createSlider(0, 1000, 0);
  	slider.position((w/2)-250, h-50);
  	slider.style('width', '500px');

}

function draw(){
	background(255,156,91);
	noStroke();
	

	//if(enemy.mass>player.mass){text("1th: Enemy\n2nd: Player",30,50);}else{text("1th: Player\n2nd: Enemy",30,50);}



push();
stroke(0);
translate(player.x,player.y);
strokeWeight(10);
fill(250,208,137);
rect(0,0,mapScale,mapScale);
strokeWeight(1);


stroke(0,0,0,20);
for(var l = 0; l <mapScale/50; l++){
	line(0,l*50,mapScale,l*50);
	line(l* 50,0,l*50,mapScale);
	
}
noStroke();

fill(255);





for(i=0;i<food.length;i++){
	food[i].show();
}
stroke(0,0,0,30);
for(var e=0;e<enemy.length;e++){
	enemy[e].show();
	// console.log(enemy[e].prevHi.name);
	// strokeWeight(enemy[e].mass/10);
line(enemy[e].x, enemy[e].y, (w/2)-player.x, (h/2)-player.y);
}

pop();
fill(0);
textAlign(LEFT);
	slomo = slider.value()/100;
	text("SPEED: " + player.speed.toFixed(2) + " - POINTS: " + points ,30,30);
	scores=[];
	for(var b = 0; b<enemy.length;b++){
		scores.push(enemy[b]);
	}
	scores.push(player);
	scores.sort((a, b) => parseFloat(b.mass) - parseFloat(a.mass));
	//console.log(scores);
	for(var s = 0; s<scores.length;s++){
		text(s+1 +": " + scores[s].name + " - " + scores[s].mass.toFixed(2), 30,50 + (s*15));
	}


	for(var his = 0; his<5;his++){
		text(history[his],30,(h-50)-his*15);
	}
player.show();	
}







//FUNCTIONS
function startGame(){
	history.unshift(getTime()+": Game Started");
	startBtn.hide();
	slider.value(100);
}
function angle(cx, cy, ex, ey) {
	var dy = ey - cy;
	var dx = ex - cx;
	var theta = Math.atan2(dy, dx); // range (-PI, PI]
	//theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
	//if (theta < 0) theta = 360 + theta; // range [0, 360)
	return theta;
  }


  function getTime(){
	
	var d = new Date();
	var n = (d.getHours()<10?'0':'')+d.getHours() +":" + (d.getMinutes()<10?'0':'')+d.getMinutes()+":"+(d.getSeconds()<10?'0':'')+d.getSeconds() ;
	return n;

  }
// CLASSES:


class Enemy {
	constructor(){
		this.mass=50;
		this.x=Math.random()*mapScale;
		this.y=Math.random()*mapScale;
		this.angle = Math.random()*TWO_PI;
		
		this.speed=4;
		this.distX;
		this.angle;
		this.name;
		this.distY;
		this.prevDist=9999;
		this.prevName;
		
		this.rgbc = {
            r: 59,
            g: 129,
            b: map(this.mass,0,500,100,255)
        };
	}
	show(){
		fill(0,0,0,50);
		ellipse(this.x,this.y+(this.mass/2),this.mass,this.mass/5);
		fill(this.rgbc.r,this.rgbc.g,this.rgbc.b);
		ellipse(this.x,this.y,this.mass,this.mass);
		fill(255);
		textAlign(CENTER,CENTER);
		text(this.mass.toFixed(),this.x,this.y);
		this.move();
	}
	move(){
		this.rgbc.b = map(this.mass,0,500,100,255);
		for(i=0;i<food.length;i++){
			var dist = (this.x-food[i].x)-(this.y-food[i].y); 
			dist = Math.abs(dist);
			if(dist < this.prevDist){
				this.prevDist= dist;
				this.prevName=i;
			}
		}
		
		if(food[this.prevName]){
			this.angle = angle(this.x,this.y,food[this.prevName].x,food[this.prevName].y);
		}else{
			this.angle += Math.random()-0.5;//angle(w/2,h/2,mouseX,mouseY);
		}
		
		var enx = this.x + Math.cos(this.angle)*(this.speed*slomo);
		var eny = this.y + Math.sin(this.angle)*(this.speed*slomo);
		
		 //sperre på banen
		this.x = constrain(enx, 0+(this.mass/2),mapScale-(this.mass/2));
		this.y = constrain(eny,0+(this.mass/2),mapScale-(this.mass/2));
			
	
	this.hitPlayer();
	this.hitEnemy();
	}
	hitEnemy() {
		for (var en = 0; en < enemy.length; en++) {
			if (enemy[en].name != this.name) {
				if (enemy[en].x + (enemy[en].mass / 2) > this.x - (this.mass / 2) && enemy[en].x - (enemy[en].mass / 2) < this.x + (this.mass / 2) && enemy[en].y + (enemy[en].mass / 2) > this.y - (this.mass / 2) && enemy[en].y - (enemy[en].mass / 2) < this.y + (this.mass / 2)) {
					//FOODHIT!
					if(enemy[en].mass>this.mass){
					enemy[en].mass += this.mass / 10;
					if (enemy[en].speed > 1) { enemy[en].speed *= .99; }
					enSnd.play();
					
					history.unshift(getTime()+ ": "+ enemy[en].name + " spiste " + this.name);
					console.log(enemy[en].name + " spiste " + this.name);
					this.reset();
				}else{
					this.mass += enemy[en].mass / 10;
					
					if (this.speed > 1) { this.speed *= .99; }
					enSnd.play();
					enemy[en].reset();
				}
				}
			}
		}
	}

	hitPlayer(){
		if(this.x + player.x > (w/2-((player.mass + this.mass)/2))  &&player.x + this.x<(w/2+((player.mass + this.mass)/2))  && player.y + this.y >(h/2-((player.mass + this.mass)/2))  && player.y + this.y <(h/2+((player.mass + this.mass)/2)) ){
			console.log("HIT!");
			if(this.mass>player.mass){
				if(this.mass<500){this.mass+=player.mass/5;}
				player.reset();
				history.unshift(getTime()+ ": "+ this.name + " spiste " + player.name);
				popSnd.play();
				
			}else{
				if(player.mass<500){ player.mass+=this.mass/5;}
				
				history.unshift(getTime()+ ": "+ player.name + " spiste " + this.name);
				this.reset();
				popSnd.play();
				
			}
		}
	}
	reset(){
		this.mass = 20;
			   this.x = Math.random()*mapScale;
			   this.y = Math.random()*mapScale;
			   this.speed = 5;
	}
}

class Player {
    constructor(){
      this.mass = 20;
	  this.x = -mapScale/2;
	  this.angle=0;
	  this.name = "Player";
      this.y= -mapScale/2;
        this.speed = 5;
      this.rgbc = {
            r: Math.random()*255,
            g: Math.random()*255,
            b: Math.random()*255
        };
   
    }
    show(){
	fill(0,0,0,50);
	ellipse((w/2),(h/2)+(this.mass/2),this.mass,this.mass/5);
        fill(this.rgbc.r,this.rgbc.g,this.rgbc.b);
        ellipse(w/2,h/2,this.mass,this.mass);
		textAlign(CENTER,CENTER);
		fill(255);
		text(this.mass.toFixed(),w/2,h/2);
        this.move();
    }
    move(){
	   this.angle = angle(w/2,h/2,mouseX,mouseY);
	   var nx = this.x - Math.cos(this.angle)*(this.speed*slomo);
	   var ny = this.y - Math.sin(this.angle)*(this.speed*slomo);
		//sperre på banen
	   this.x = constrain(nx, -mapScale+(w/2)+(player.mass/2),0+(w/2)-(player.mass/2));
	   this.y = constrain(ny,-mapScale+(h/2)+(player.mass/2),0+(h/2)-(player.mass/2));
	   
      //this.hitEnemy();
	}

    reset(){
	   this.mass=20;
	   this.speed=5;
	   points=0;

	   this.x=-mapScale + Math.random()*mapScale;
		this.y=-mapScale + Math.random()*mapScale;
        
    }
}


class Food{
	constructor(){
		this.x = Math.random()*mapScale;
		this.y = Math.random()*mapScale;
		this.mass = 5+ Math.random()*18;
		this.rgbc = {
            r: map(this.mass,0,23,150,255),
            g: 99,
            b: 74
		};


	}
	show(){
		fill(0,0,0,50);
		ellipse(this.x,this.y+(this.mass/2),this.mass,this.mass/5);
		fill(this.rgbc.r,this.rgbc.g,this.rgbc.b);
        ellipse(this.x,this.y,this.mass,this.mass);
		
       this.checkHit();
	}
	checkHit(){
	if(player){
			
			if(player.x + this.x > (w/2-(player.mass/2))  &&player.x + this.x<(w/2+(player.mass/2))  && player.y + this.y >(h/2-(player.mass/2))  && player.y + this.y <(h/2+(player.mass/2)) ){
				//FOODHIT!
				
				player.mass+=this.mass/10;
				if(player.speed>1){player.speed*=.99;}
				points++;
				popSnd.play();
				this.reset();
			}
		}
	
	//enemy
	if(enemy){
		for(var en=0; en<enemy.length;en++){
			
			if(enemy[en].x+(enemy[en].mass/2) > this.x-(this.mass/2) &&  enemy[en].x-(enemy[en].mass/2) < this.x+(this.mass/2) && enemy[en].y+(enemy[en].mass/2) > this.y-(this.mass/2) &&  enemy[en].y-(enemy[en].mass/2) < this.y+(this.mass/2)){
				//FOODHIT!
				
				enemy[en].mass+=this.mass/10;
				if(enemy[en].speed>1){enemy[en].speed*=.99;}
				enSnd.play();
				this.reset();
			}
		}
	}
	}
	
	reset(){
		this.x = Math.random()*mapScale;
		this.y = Math.random()*mapScale;
		this.mass = Math.random()*18;
		this.rgbc = {
            r: map(this.mass,0,23,150,255),
            g: 99,
            b: 74
		};
	}
}
