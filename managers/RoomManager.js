/*
 Room Manager

 Creates and stores multiplayer rooms.

*/


const createRoomId =
require("../utils/roomId");


const GameManager =
require("./GameManager");





class RoomManager{


constructor(){

this.rooms =
new Map();

}




create(data){



console.log(
"[ROOM CREATE]",
data
);





const room={



roomId:
createRoomId(),



gameId:
data.gameId,



roomName:
data.roomName ||
"Game Room",




host:
data.host || null,



status:
"waiting",




security:{


joinPassword:
data.security?.joinPassword || "",


viewPassword:
data.security?.viewPassword || ""

},




limits:{


maxPlayers:
data.limits?.maxPlayers || 4,


maxViewers:
data.limits?.maxViewers || 100


},





game:
this.validateGame(
data.game
),





players:
new Set(),



viewers:
new Set(),



engine:null



};





GameManager.create(room);





this.rooms.set(

room.roomId,

room

);





console.log(

"[ROOM CREATED]",

room.roomId

);





return room;


}






validateGame(game){



if(!game){

return {

mode:"endless"

};

}




if(game.mode==="time"){



if(!game.duration){

throw new Error(
"Time game needs duration"
);

}



return {

mode:"time",

duration:
game.duration

};



}





if(game.mode==="score"){



if(!game.targetScore){

throw new Error(
"Score game needs targetScore"
);

}



return {

mode:"score",

targetScore:
game.targetScore

};



}





if(game.mode==="endless"){


return {

mode:"endless"

};


}




throw new Error(
"Invalid game mode"
);



}





get(id){

return this.rooms.get(id);

}





list(){


return Array.from(
this.rooms.values()
)
.map(room=>({


roomId:
room.roomId,


gameId:
room.gameId,


roomName:
room.roomName,


status:
room.status,


players:
room.players.size,


viewers:
room.viewers.size,


game:
room.game.mode


}));


}





remove(id){

this.rooms.delete(id);

}




}



module.exports =
new RoomManager();
