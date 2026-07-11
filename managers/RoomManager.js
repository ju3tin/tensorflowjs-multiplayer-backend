const createRoomId =
require("../utils/roomId");


const GameManager =
require("./GameManager");



class RoomManager {


constructor(){

this.rooms = new Map();

}




create(data){


const room={


roomId:
createRoomId(),


gameId:
data.gameId,


type:
data.type || "single",



players:
new Map(),



viewers:
new Map(),



host:null,



status:"waiting",



settings:{


mode:
data.game?.mode || "endless",


duration:
data.game?.duration || null,


targetScore:
data.game?.targetScore || null


},



engine:null



};





room.engine =
GameManager.create(room);




this.rooms.set(
room.roomId,
room
);



console.log(
"[ROOM CREATED]",
room
);



return room;


}





get(id){

return this.rooms.get(id);

}




remove(id){

this.rooms.delete(id);

}



}



module.exports =
new RoomManager();
