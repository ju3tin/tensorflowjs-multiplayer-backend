class DanceGame{


constructor(room){

this.room=room;

this.scores={};


console.log(
"[DANCE] Created",
room.roomId
);


}



start(){

console.log(
"[DANCE] Started"
);


}




receiveMotion(
playerId,
motion
){


if(!this.scores[playerId]){

this.scores[playerId]=0;

}



// temporary score

this.scores[playerId]++;


}




getState(){


return {

scores:this.scores

};


}




finish(){


return {

scores:this.scores

};


}



}



module.exports=DanceGame;
