let w; 
let h;
let joinedPlayer=false;


let usernameText;
let subBtn;
let subBtn2;

let players = {};
let data = {};

let userName;
let userX=200;
let userY=200;



function setup() {

    //CANVAS
    w = windowWidth;
    h = windowHeight;
    createCanvas(w,h);
   
   
   
    //STARTMENY
    usernameText = createInput('Name');
    usernameText.position(w/2-100,200);
    usernameText.mousePressed(clearIn);
    subBtn = createButton('OK');
    subBtn.position((w/2)+60,200);
    subBtn.id('subBtnId');
    subBtn.mousePressed(gameStart);
    subBtn2 = createButton('Show Info');
    subBtn2.position(w-100,h-100);
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
  

    if(!joinedPlayer){
        background(255);
        textAlign(CENTER);
        text("Velkommen til multiplayerspillet!", w/2,190);
        

     }else{
        background(214,12,124);
        fill(255);
      sendInfo(); blob(userName, userX, userY);
    
    
    
   
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
   
        
        userX +=(mouseX - userX) / 30;
        userY +=(mouseY - userY) /30;

    

    
    }
}
function clearIn(){
   if(usernameText.value() == "Name"){ usernameText.value("");}
}
function viewData(){
    socket.emit('view data');
}

function gameStart(){
    joinedPlayer=true;
    userName = usernameText.value();
    usernameText.hide();
    subBtn.hide();

}
function sendInfo(){
    data = {id: socket.id, name: userName,playerx:userX,playery: userY};
    socket.emit('send player', data);
 
}
function blob(dname,dx,dy){
    fill(255);
    ellipse(dx,dy,50,50);
    fill(0);
    textAlign(CENTER);
    text(dname,dx,dy);
}
function keyPressed() {
    if (keyCode ==13) {
      if(usernameText.elt === document.activeElement ){
          console.log("YES");
          gameStart();
      }else{
          console.log("KEyprs");
      }
    }
  }