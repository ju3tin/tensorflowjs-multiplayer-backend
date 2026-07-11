/*
 GameManager

 Loads the correct game plugin
 and sends motion data to it.

*/


const registry =
require("../games");



class GameManager {



create(room){


const Game =
registry.get(
room.gameId
);



if(!Game){

throw new Error(
"Unknown game: " + room.gameId
);

}



room.engine =
new Game(room);



console.log(
"[GAME ENGINE CREATED]",
room.gameId
);



return room.engine;


}





start(room){


if(room.engine){

room.status =
"playing";


room.engine.start();


console.log(
"[GAME START]",
room.roomId
);


}



}





motion(
room,
playerId,
data
){



if(
room.engine &&
room.engine.receiveMotion
){


room.engine.receiveMotion(

playerId,

data

);



}



}





state(room){


if(room.engine){

return room.engine.getState();

}


return null;


}





}



module.exports =
new GameManager();
