let diameter = 100;
let steps = 100;
let points = [];
let noiseMax = 3;
let counter = 0;
let prevMouse;
let colorr=0;
let colorg=100;
let colorb=50;
let cu=true;
let w;
let h;
let gammaOr;
let betaOr;
let gamOff;
let betOff;
let nx=0;
let ny=0;
let blobx;
let bloby;
let rndX = 500;
let rndY = 500;
let rndCount=100;

function setup(){
   w = windowWidth;
    h= windowHeight;
    createCanvas(w,h);
    // fill(0);
 let xoff = 0;
    let yoff = 0;

}
function draw(){

    
    if(mouseIsPressed){
        gamOff=false;
        betOff=false;
    }



    rndCount +=.01;
    rndX +=map(noise(rndCount),0,1,-5,5);
    rndY+=map(noise(rndCount+10),0,1,-5,5);

    if(gammaOr && betaOr){
        
        nx = blobx + gammaOr;
        ny = bloby + betaOr;
    }


    //sperre på banen
   blobx = constrain(nx, 0,w);
   bloby = constrain(ny,0,h);


    //noiseMax=mouseY/10;
    // background(255);
    stroke(0);
    if (prevMouse) {
        if (prevMouse.mx != mouseX && prevMouse.my != mouseY) {
            if (cu) {
                counter++;
                if (counter == 255) {
                    cu = false;
                }
            } else {
                counter--;
                if (counter == 0) {
                    cu = true;
                }
            }
        }
    }

//    if(prevMouse){if(prevMouse.mx != mouseX && prevMouse.my !=mouseY){
//     fill(colorr % 255,colorg %255 ,colorb % 255);
//     colorr += random(1);
//     colorg += random(2);
//     colorb += random(3);
//     console.log(colorr,colorg,colorb);
//    }} 
   // fill(map(blobx,0,w,0,255), map(bloby,0,h,0,255), counter);

    blob(mouseX,mouseY);

    blob(map(noise(rndCount+51),0,1,0,w),map(noise(rndCount+53),0,1,0,h));
    blob(map(noise(rndCount+1),0,1,0,w),map(noise(rndCount+12),0,1,0,h));
    blob(map(noise(rndCount+53),0,1,0,w),map(noise(rndCount+10),0,1,0,h));
    prevMouse = { mx: mouseX,my: mouseY};
  
}




function blob(ax,ay){
    push();
    beginShape();
    
   fill(map(ax,0,w,0,255), map(ay,0,h,0,255), counter);
   translate(ax,ay);
    for(var c=0;c<TWO_PI;c+=.1){
       var xoff = map(cos(c),-1,1,0,noiseMax)+ax/100;
        var yoff = map(sin(c),-1,1,0,noiseMax)+ay/100;
      let r = map(noise(xoff,yoff),0,1,50  ,100);
      let x = r*cos(c);
      let y = r*sin(c);
     
      vertex(x,y);
     

    }
    endShape(CLOSE);
    pop();
}



window.addEventListener('deviceorientation', function(e) 
{
  //alphaOr = e.alpha;
  if(!gamOff && !betOff){
	  gamOff = e.gamma;
	  betOff = e.beta;
  }

  betaOr = e.beta - betOff;
  gammaOr = e.gamma - gamOff;
});