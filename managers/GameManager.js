const registry =
require("../games/registry");



class GameManager {



create(room){



const Game =
registry.get(
room.gameId
);



if(!Game){

throw new Error(
"Game not found"
);

}



const engine =
new Game(room);



console.log(
"[ENGINE CREATED]",
room.gameId
);



return engine;


}






motion(
room,
playerId,
motion
){



if(
room.engine &&
room.engine.onMotion
){


room.engine.onMotion(

playerId,

motion

);


}



}





state(room){


if(room.engine){

return room.engine.getState();

}


return {};

}



}



module.exports =
new GameManager();
