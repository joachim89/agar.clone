let w;
let h;
let gameSize = 2000;
let joinedPlayer = false;

let usernameText;
let subBtn;
let subBtn2;
let subBtn3;

let players = {};
let data = {};
let history = [];
let apples = [];

let userName;
let userX = 200;
let userY = 200;
let userMass=50;

let mobile=false;
let gammaOr;
let betaOr;
let gamOff;
let betOff;

let connectCounter=0;



function setup() {

    //CANVAS
    w = windowWidth;
    h = windowHeight;
    createCanvas(w, h);
    console.log(w,h);
    //STARTMENY
    usernameText = createInput('Name');
    usernameText.position(w / 2 - 100, 200);
    usernameText.mousePressed(clearIn);
    subBtn = createButton('JOIN');
    subBtn.position((w / 2) + 60, 200);
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
 


    //DIS WORKED:
    var person = [];
    person['abc'] = { navn: "Ola Nordmann", alder: 12 };
    person['ppp'] = { navn: "Kari Nordmann", alder: 24 };
    var text = "";
    var x;
    for (x in person) {
        text += person[x].alder;
    }
    console.log(text);
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
        //console.log(apples);
        // apples = serverApples.apples;
    });
    socket.on('move apple', function(serverApples){
       // console.log(serverApples);
            apples[serverApples.data.nr].x = serverApples.data.x;
            apples[serverApples.data.nr].y = serverApples.data.y;
        
            
        
        //console.log(apples);
        // apples = serverApples.apples;
    });


    if (!joinedPlayer) { //MENYEN
        //background(255);
        textAlign(CENTER);
        text("Velkommen til multiplayerspillet!", w / 2, 190);
        fill(0);


        textAlign(LEFT);
        text("NUMBER OF PLAYERS: " + connectCounter,100,85);
        printHistory();

    } else {  //SELVE SPILLET:
        background(70, 130, 60);
       

       

        //EMIT at du vil oppdatere, henter oppdatering og plasser blobsa på nytt
        socket.on('update players', function (serverPlayers) {
            players = serverPlayers;
        });

        push();
        translate(userX,userY);
        stroke(0);
        strokeWeight(10);
        // noFill();
       fill(82,178,70);
        rect(0,0,gameSize,gameSize);
        strokeWeight(0);
        for (var a =0; a<apples.length;a++) {
            // console.log(players[x].id,socket.id);
            apples[a].show();
        }
       
        for (var x in players) {
            // console.log(players[x].id,socket.id);
            if (players[x].id != socket.id) {
                
                blob(players[x].name, -players[x].playerx + (w/2), -players[x].playery+(h/2), players[x].mass);
            }
        }
      



        //CONTROLS:
        if(mobile){
            if(mouseIsPressed){
                gamOff=false;
                betOff=false;
            }
			var newSpeed = map(userMass,20,1200,.2,0);
			var newX = this.x - gammaOr*newSpeed;
            var newY = this.y - betaOr*newSpeed;
            userX = constrain(newX,-gameSize+(w/2)+(userMass/2),w/2-(userMass/2));
            userY = constrain(newY,-gameSize+(h/2)+(userMass/2),h/2-(userMass/2));
		}else{
            var newX = userX+((w/2)-mouseX)/(userMass*2);
            var newY = userY+((h/2)-mouseY)/(userMass*2);
            
            userX = constrain(newX,-gameSize+(w/2)+(userMass/2),w/2-(userMass/2));
            userY = constrain(newY,-gameSize+(h/2)+(userMass/2),h/2-(userMass/2));

        }



            
        
        // userX += (mouseX - userX) / 30;
        // userY += (mouseY - userY) / 30;
        pop();
        fill(255);
        textAlign(LEFT); //PRINT HISTORY
        printHistory();
        
        //text("X: "+ userX + "\nY: " + userY,100,50);
        text("NUMBER OF PLAYERS: " + connectCounter,100,85);

        sendInfo();
       
        blob(userName, w/2, h/2,userMass);


    }
}
function clearIn() {
    if (usernameText.value() == "Name") { usernameText.value(""); }
}
function viewData() {
    socket.emit('view data');
}
function printHistory() {

    for (i = 0; i < 10; i++) {
        if (history[i]) { text(history[i], 100, 100 + (15 * i)); }
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
    data = { id: socket.id, name: userName, playerx: userX, playery: userY, mass: userMass};
    socket.emit('send player', data);

}
function blob(dname, dx, dy,mass) {
    fill(255);
    ellipse(dx, dy, mass, mass);
    fill(0);
    textAlign(CENTER);
    text(dname, dx, dy);
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
        fill(255,0,0);
        ellipse(this.x, this.y, 20, 20);
        fill(0);
        text(this.nr,this.x,this.y+5);
        this.hit();
    }
    hit(){
        if(w/2 > userX+this.x-(userMass/2) && w/2 < userX+ this.x +(userMass/2) && h/2 >userY + this.y-(userMass/2) && h/2 < userY + this.y+(userMass/2)){
            if(this.delayer==0){userMass++;
                apples[this.nr].x=100000;
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

window.addEventListener('deviceorientation', function(e) 
{  
    if(e.gamma && e.beta){mobile=true;}else{mobile=false;}
  //alphaOr = e.alpha;
  if(!gamOff && !betOff){
	  gamOff = e.gamma;
	  betOff = e.beta;
	  
  }

  betaOr = e.beta - betOff;
  gammaOr = e.gamma - gamOff;
});