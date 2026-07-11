/*
 WebSocket Motion Server


 Messages:


 join

 motion


*/


const RoomManager =
require("../managers/RoomManager");


const GameManager =
require("../managers/GameManager");





module.exports=function(wss){



console.log(
"[WSS] Socket handler loaded"
);




wss.on(
"connection",
socket=>{



console.log(
"[WSS] Client connected"
);



socket.id =
Math.random()
.toString(36)
.substring(2,10);





socket.on(
"message",
raw=>{



let msg;



try{

msg =
JSON.parse(
raw.toString()
);


}
catch{


console.log(
"[ERROR] Bad JSON"
);


return;


}





console.log(
"[MESSAGE]",
msg.type
);






// JOIN ROOM


if(msg.type==="join"){



const room =
RoomManager.get(
msg.roomId
);




if(!room){


socket.send(JSON.stringify({

type:"error",

message:
"Room not found"

}));

return;


}





if(
msg.role==="viewer"
){

room.viewers.add(socket);


}
else{


room.players.add(socket);


}




socket.roomId =
room.roomId;


socket.playerId =
msg.playerId;


socket.role =
msg.role;





console.log(
"[JOINED]",
socket.playerId,

socket.role,

room.roomId
);





socket.send(JSON.stringify({

type:"joined",

roomId:
room.roomId

}));




return;

}





// MOTION


if(msg.type==="motion"){



const room =
RoomManager.get(
socket.roomId
);




if(!room)
return;





console.log(
"[MOTION]",

socket.playerId,

"pose:",
msg.pose?.length || 0,

"hands:",
msg.hands?.length || 0

);






GameManager.motion(

room,

socket.playerId,

msg

);







room.players.forEach(
client=>{


if(
client!==socket &&
client.readyState===1
){


client.send(JSON.stringify({

type:"remote-motion",

playerId:
socket.playerId,

pose:
msg.pose,

hands:
msg.hands,

timestamp:
msg.timestamp


}));


}



});





}



});






socket.on(
"close",
()=>{


console.log(
"[DISCONNECT]",
socket.id
);



const room =
RoomManager.get(
socket.roomId
);



if(room){


room.players.delete(socket);

room.viewers.delete(socket);


}



});





});



};
