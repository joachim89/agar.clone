let blobs = {};
let counter=0;
let messageText;
let subBtn;
let players = {};
let subBtn2;
let userX=200;
let userY=200;
let data = {};
let joinedPlayer=false;
let userName;
let w; 
let h;

function setup() {
    w = windowWidth;
    h = windowHeight;
    createCanvas(w,h);
    messageText = createInput('Name');
    messageText.position(500,500);
    subBtn = createButton('OK');
    subBtn.position(660,500);
    subBtn.id('subBtnId');
    subBtn.mousePressed(gameStart);
    subBtn2 = createButton('Show Info');
    subBtn2.position(660,600);
    subBtn2.mousePressed(viewData);


    //DIS WORKED:
    var person =[]; 
    person['abc'] = {navn:"Ola Nordmann",alder: 12};
    person['ppp'] = {navn:"Kari Nordmann",alder: 24};
    var text = "";
    var x;
    for (x in person) {
      text += person[x].alder;
    }
    console.log(text);
    // bare for å hjelpe altså
}
function draw() {
    //blob(random(300),random(500));
    background(255);
    
    
    
   
    //EMIT at du vil oppdatere, henter oppdatering og plasser blobsa på nytt
    socket.emit('update players');
    socket.on('update players', function (serverPlayers) {
        players = serverPlayers;
    });
   
    for (var x in players) {
       // console.log(players[x].id,socket.id);
        if(players[x].id!=socket.id){
        blob(players[x].name, players[x].playerx, players[x].playery);
    }
    }
    if(joinedPlayer){sendInfo(); blob(userName, userX, userY);}
        
        userX +=(mouseX - userX) / 30;
        userY +=(mouseY - userY) /30;

    

    

}

function viewData(){
    socket.emit('view data');
}

function gameStart(){
    joinedPlayer=true;
    userName = messageText.value();
    messageText.hide();
    subBtn.hide();

}
function sendInfo(){
    data = {id: socket.id, name: userName,playerx:userX,playery: userY};
    socket.emit('send player', data);
 
}
function blob(dname,dx,dy){
    fill(random(255),random(255),random(255));
    ellipse(dx,dy,50,50);
    fill(0);
    textAlign(CENTER);
    text(dname,dx,dy);
}
function keyPressed() {
    if (keyCode ==13) {
      if(messageText.elt === document.activeElement ){
          console.log("YES");
          gameStart();
      }else{
          console.log("KEyprs");
      }
    }
  }