let w;
let h;
let gameSize = 2000;
let joinedPlayer = false;

let usernameText;
let subBtn;
let subBtn2;
let subBtn3;
let userRgbc = {};
let isPaused = false;

let players = {};
let data = {};
let history = [];
let apples = [];

let userName;
let userX = 200;
let userY = 200;
let userMass=50;
let maxSpeed = 0;
let isLeft=false;

let mobile=false;
let gammaOr;
let betaOr;
let gamOff;
let betOff;

let connectCounter=0;


//sounds & imgs:
let popSnd;
let enSnd;
let graveImg;
let playerImg;
let playerImgR;
let enemyImg;
let appleImg;
let playerSleep;

// function preload(){
// 	popSnd = loadSound("./libs/pop.mp3");
// 	// enSnd = loadSound("./libs/enpop.mp3");
// 	// graveImg = loadImage("./libs/dead.png");

//     // enemyImg = loadImage("./libs/enemy.png");
//     // appleImg = loadImage("./libs/apple.png");
	

// }
if (location.protocol !== "https:" && !(location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    location.protocol = "https:";
  }
function setup() {

    //CANVAS
    w = windowWidth;
    h = windowHeight;
    createCanvas(w, h);
    
    appleImg = loadImage("./libs/apple.png");
    popSnd = loadSound("./libs/pop.mp3");
    enSnd = loadSound("./libs/enpop.mp3");
    playerImg = loadImage("./libs/playerv2.png");
    playerImgR = loadImage("./libs/playerv2r.png");
    playerSleep = loadImage("./libs/playersleep.png");
    //STARTMENY

    if(randomNames){
       var randomName = randomNames[round(random(randomNames.length))];
     }else{ var randomName = "Name";}

    usernameText = createInput(randomName);
    usernameText.position(w / 2 - 100, 300);
    usernameText.mousePressed(clearIn);
    subBtn = createButton('JOIN');
    subBtn.position((w / 2) + 60, 300);
    subBtn.id('subBtnId');
    subBtn.mousePressed(gameStart);
    subBtn2 = createButton('Show Info');
    subBtn2.position(w - 100, h - 100);
    subBtn2.mousePressed(viewData);
    // subBtn3 = createButton('Restart server');
    // subBtn3.position(w - 100, h - 75);
    // subBtn3.mousePressed(restartServer);
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
        subBtn2.show();
    }else{
        subBtn2.hide();
    }
 

    userRgbc = {
        r: random(155)+100,
        g: random(155)+100,
        b: random(155)+100
    };


    //DIS WORKED:
    var person = [];
    person['abc'] = { navn: "Ola Nordmann", alder: 12 };
    person['ppp'] = { navn: "Kari Nordmann", alder: 24 };
    var text = "";
    var x;
    for (x in person) {
        text += person[x].alder;
    }
    // console.log(text);
    // bare for å hjelpe altså
}
function draw() {
   
    // LAST HISTORIEN UANSETT
    socket.on('history', function (serverHistory) {

        history = serverHistory.history;


    });
    socket.on('total players', function (num){
        connectCounter=num.connectCounter;
    
        
    });
    socket.on('apples', function(serverApples){
        for(var a = 0; a<serverApples.apples.length;a++){
            apples[a] = new Apple;
            apples[a].x = serverApples.apples[a].x;
            apples[a].y = serverApples.apples[a].y;
            apples[a].nr = a;
            
            
        }
    });
    socket.on('move apple', function(serverApples){
       // console.log(serverApples);
            apples[serverApples.data.nr].x = serverApples.data.x;
            apples[serverApples.data.nr].y = serverApples.data.y;
    });


    if (!joinedPlayer) { //MENYEN
        //background(255);
        clear();
        textAlign(CENTER);
        text("Velkommen til multiplayerspillet!", w / 2, 290);
        fill(0);
        // textAlign(LEFT);
        // text("Gam: " + gammaOr + "\nBet: " + betaOr,10,10);

       
        printHistory(0);

    } else {  //SELVE SPILLET:
        // background(70, 130, 60);
        background(255,156,91);

       

        //EMIT at du vil oppdatere, henter oppdatering og plasser blobsa på nytt
        socket.on('update players', function (serverPlayers) {
            players = serverPlayers;
        });

        push();
        translate(userX,userY);
        stroke(0);
        strokeWeight(10);
        // noFill();
    //    fill(82,178,70);
       fill(250,208,137);
        rect(0,0,gameSize,gameSize);
        stroke(0, 0, 0, 20);
        strokeWeight(1);
        for (var l = 0; l < gameSize / 50; l++) {
            line(0, l * 50, gameSize, l * 50);
            line(l * 50, 0, l * 50, gameSize);

        }
        noStroke();
        
        for (var a =0; a<apples.length;a++) {
            // console.log(players[x].id,socket.id);
            apples[a].show();
        }
       
        for (var x in players) {
            // console.log(players[x].id,socket.id);
            if (players[x].id != socket.id) {
                stroke(0,0,0,20);
                strokeWeight(1);
                line(-players[x].playerx + (players[x].wd/2),-players[x].playery+(players[x].hd/2),(w/2)-userX,(h/2)-userY);
                var blobx = -players[x].playerx + (players[x].wd/2);
                var bloby = -players[x].playery+(players[x].hd/2)
                blob(players[x].name, blobx, bloby, players[x].mass,players[x].colors,players[x].paused,players[x].left);
                
                
                if(!players[x].paused){             
                // if (blobx + (players[x].mass / 2) > (w / 2) - userX - (userMass / 2) &&
                //     blobx - (players[x].mass / 2) < (w / 2) - userX + (userMass / 2) &&
                //     bloby + (players[x].mass / 2) > (h / 2) - userY - (userMass / 2) &&
                //     bloby - (players[x].mass / 2) < (h / 2) - userY + (userMass / 2)) {
                
                if(collision(blobx, bloby, players[x].mass/2, (w/2)-userX, (h/2)-userY, userMass/2)){
                 //HIT
                 if(players[x].mass < userMass){
                    if(players[x].mass>20){
                        players[x].mass--;
                        userMass+=.5;
                    }else{
                        enSnd.play();
                    }
                }else{
                    if(userMass>20){
                        players[x].mass+=.5;
                        userMass--;
                    }else{
                        socket.emit('player eaten', {text: (userName+" was eaten by " + players[x].name) });
                        userRestart();
                        window.navigator.vibrate([30,80,100]);
                        enSnd.play();

                    }
                }
                 }

                }
            }
        }
      



        //CONTROLS:
        if (!isPaused) {
            if (mobile) {
                if (mouseIsPressed) {
                    gamOff = false;
                    betOff = false;
                }
                var newSpeed = map(userMass, 20, 1200, .2, 0);
                var newX = userX - gammaOr * newSpeed;
                var newY = userY - betaOr * newSpeed;
                if (newX < userX) {
                    isLeft = false;
                } else {
                    isLeft = true;
                }
                userX = constrain(newX, -gameSize + (w / 2) + (userMass / 2), w / 2 - (userMass / 2));
                userY = constrain(newY, -gameSize + (h / 2) + (userMass / 2), h / 2 - (userMass / 2));
            } else {
                var newSpeed = map(userMass, 20, 1200, .04, 0);
                var newX = userX + constrain(((w / 2) - mouseX),-150,150) *newSpeed;
                var newY = userY + constrain(((h / 2) - mouseY),-150,150) *newSpeed;
                
                
                if (newX < userX) {
                    isLeft = false;
                } else {
                    isLeft = true;
                }
                userX = constrain(newX, -gameSize + (w / 2) + (userMass / 2), w / 2 - (userMass / 2));
                userY = constrain(newY, -gameSize + (h / 2) + (userMass / 2), h / 2 - (userMass / 2));

            }
        }



            
        
        // userX += (mouseX - userX) / 30;
        // userY += (mouseY - userY) / 30;
        pop();
        
        //PRINT HISTORY
        printHistory();
        
        //text("X: "+ userX + "\nY: " + userY,100,50);
       

        sendInfo();
       
        blob(userName, w/2, h/2,userMass,userRgbc,isPaused,isLeft);
        sortScores();
        textAlign(RIGHT);
       // text("MOB?: " + mobile + "\nGAM: " + gammaOr + "\nBET: " + betaOr +"\n\nMAX: " + round(maxSpeed),w-50   ,50);
    }
}










function clearIn() {
    if (usernameText.value() == "Name") { usernameText.value(""); }
}
function viewData() {
    socket.emit('view data');
}
function printHistory(color) {
    fill(color!=undefined?color:255);
    textAlign(LEFT);
   // console.log(history);
    text("HISTORY: " ,w/10 , h-(h/3)-15);
    for (i = 0; i < 10; i++) {
        if (history[i]) { text(history[i], w/10 , h-(h/3) + (15 * i)); }
    }

}

function gameStart() {
    joinedPlayer = true;
    userName = usernameText.value();
    usernameText.hide();
    subBtn.hide();
    socket.emit('player joined', userName);
    socket.emit('get apples');

}
function sendInfo() {
    data = { id: socket.id, name: userName, playerx: userX, playery: userY, mass: userMass, wd:w,hd:h,colors:userRgbc, paused:isPaused,left:isLeft};
    socket.emit('send player', data);

}
function blob(dname, dx, dy,mass,colors,paused,left) {
    noStroke();
    fill(0,0,0,60);
    ellipse(dx,dy+mass/2,mass,mass/5);
    if(paused){
    fill(colors.r,colors.g,colors.b,90);}else{ fill(colors.r,colors.g,colors.b);

    }
  
    ellipse(dx, dy, mass, mass);
    imageMode(CENTER);
    if(!paused){
    if(left){
      image(playerImg,dx,dy,mass,mass);
    }else{
        image(playerImgR,dx,dy,mass,mass);
    }}else{
        image(playerSleep,dx,dy,mass,mass);
    }
      fill(0);
    textAlign(CENTER);
    text(dname, dx, dy-mass/2);
}

function collision(p1x, p1y, r1, p2x, p2y, r2) {
    var a;
    var x;
    var y;
  
    a = r1 + r2;
    x = p1x - p2x;
    y = p1y - p2y;
  
    if (a > Math.sqrt((x * x) + (y * y))) {
      return true;
    } else {
      return false;
    }
  }
  

class Apple{
    constructor(){
        this.x;
        this.y;
        this.nr;
        this.delayer=0;
    }
    show(){
        if(this.delayer!=0){
            this.delayer--;
        }
        fill(0,0,0,60);
        ellipse(this.x,this.y+15,20,7);
        imageMode(CENTER);
        image(appleImg,this.x,this.y,30,30);
        // fill(255,0,0);
        // ellipse(this.x, this.y, 20, 20);
        fill(0);
      // text(this.nr,this.x,this.y+5);
        this.hit();
    }
    hit(){
        if(w/2 > userX+this.x-(userMass/2) && w/2 < userX+ this.x +(userMass/2) && (h/2)+10 >userY + this.y-(userMass/2) && h/2 + 15< userY + this.y+(userMass/2)){
            if(this.delayer==0){userMass++;
                apples[this.nr].x=100000;
                window.navigator.vibrate(50);
                popSnd.play();
            socket.emit('move apple', {nr: this.nr});
           // console.log("move apple", this.nr);
        this.delayer=50;}
        }
    }
}



function keyPressed() {
    if (keyCode == 13) {
        if (usernameText.elt === document.activeElement) {
            console.log("YES");
            gameStart();
        } else {
            console.log("KEyprs");
        }
    }
}
function restartServer(restartData){
    socket.emit('restart',{restartData});
}

function userRestart(){
   
    userX = map(random(gameSize),0,gameSize,-gameSize+(w/2)+(userMass/2),w/2-(userMass/2));
    userY = map(random(gameSize),0,gameSize,-gameSize+(h/2)+(userMass/2),h/2-(userMass/2));
    userMass=50;
}
function sortScores(){
    textAlign(LEFT);
    fill(255);
    var scores=[];
	for( var s in players){
        scores.push(players[s]);
    }
	scores.sort((a, b) => parseFloat(b.mass) - parseFloat(a.mass));
    //console.log(scores);
    text("NUMBER OF PLAYERS: " + connectCounter,w/10 ,h/10-30);
    text("SCORES:",w/10,h/10-15);
	for(var s = 0; s<scores.length;s++){
		text(s+1 +": " + scores[s].name + " - " + scores[s].mass.toFixed(2), w/10,h/10 + (s*15));
    }
    textAlign(CENTER);

}


//eventlisteners
window.addEventListener('deviceorientation', handleOrientation);

function handleOrientation(event){
 
    if(event.gamma && event.beta){mobile=true;}else{mobile=false;}
  //alphaOr = e.alpha;
  if(!gamOff && !betOff){
	  gamOff = event.gamma;
	  betOff = event.beta;
	  
  }

  betaOr = event.beta - betOff;
  gammaOr = event.gamma - gamOff;

}






window.addEventListener('blur', function(){
    console.log("pause!");
   isPaused=true;
   sendInfo();
   noSleep.disable();
 }, false);
 
 window.addEventListener('focus', function(){
     isPaused=false;
    sendInfo();
}, false);






///ENEMYYYY

class Enemy{
    constructor(){
        this.x;
        this.y;
        this.vx;
        this.vy;
        this.mass;
        this.id;
    }
    move(){
        fill(255);
        ellipse(this.x, this.y, this.mass, this.mass);
        fill(0);
        textAlign(CENTER);
        text(dname, this.x, this.y);
    }
    hit(){
        if(w/2 > userX+this.x-(userMass/2) && w/2 < userX+ this.x +(userMass/2) && h/2 >userY + this.y-(userMass/2) && h/2 < userY + this.y+(userMass/2)){
            if(this.delayer==0){userMass++;
                apples[this.nr].x=100000;
                // popSnd.play();
                if(this.mass < userMass){
                    if(this.mass>20){
                        this.mass--;
                        userMass++;
                    }else{
                        this.restart();
                    }
                }else{
                    if(userMass>20){
                        this.mass++
                        userMass--
                    }else{
                        userRestart();
                    }
                }
               
            socket.emit('eat enemy', {thisMass: this.mass, userMass: userMass});
           // console.log("move apple", this.nr);
        this.delayer=10;}
        }
    }
    restart(){
        socket.emit('player restart', {player: this.id});
    }
}
