const express = require("express");
const cors = require("cors");
const { WebSocketServer } = require("ws");

const PORT = 8080;


const app = express();

app.use(cors());
app.use(express.json());



// -------------------------
// GAME DATA
// -------------------------

const rooms = new Map();


// room example:
//
// rooms = {
//   ABC123: {
//      players:Set()
//   }
// }



function createRoomId(){

    return Math.random()
        .toString(36)
        .substring(2,8)
        .toUpperCase();

}



function getRoom(roomId){

    if(!rooms.has(roomId)){

        rooms.set(roomId,{

            players:new Set()

        });

    }


    return rooms.get(roomId);

}




function removePlayer(socket){


    if(!socket.roomId)
        return;


    const room =
        rooms.get(socket.roomId);



    if(room){


        room.players.delete(socket);



        console.log(
            socket.playerId,
            "left room",
            socket.roomId
        );



        if(room.players.size === 0){

            rooms.delete(socket.roomId);


            console.log(
                "Deleted empty room",
                socket.roomId
            );

        }

    }



    socket.roomId = null;

}





// -------------------------
// HTTP API
// -------------------------



app.get(
"/api/status",
(req,res)=>{


    res.json({

        online:true,

        service:"motion-game-server",

        time:Date.now()

    });


});





app.post(
"/api/rooms/create",
(req,res)=>{


    const roomId =
        createRoomId();



    rooms.set(roomId,{

        players:new Set()

    });



    console.log(
        "Created room",
        roomId
    );



    res.json({

        roomId

    });


});






app.get(
"/api/rooms",
(req,res)=>{


    const list =
        Array.from(
            rooms.keys()
        );



    res.json(list);


});





// -------------------------
// START HTTP SERVER
// -------------------------


const httpServer =
app.listen(
PORT,
()=>{


console.log(
`HTTP server running on ${PORT}`
);


});




// -------------------------
// WEBSOCKET SERVER
// -------------------------


const wss =
new WebSocketServer({

    server:httpServer

});





wss.on(
"connection",
(socket)=>{


console.log(
"WebSocket connected"
);



socket.roomId = null;

socket.playerId = null;





socket.on(
"message",
(raw)=>{


let message;



try{

message =
JSON.parse(
raw.toString()
);


}
catch(err){

console.log(
"Bad message"
);

return;

}






// -------------------------
// JOIN ROOM
// -------------------------


if(message.type==="join"){



removePlayer(socket);



socket.roomId =
message.roomId;



socket.playerId =
message.playerId;



const room =
getRoom(
message.roomId
);



room.players.add(socket);




console.log(

`${message.playerId} joined ${message.roomId}`

);




socket.send(JSON.stringify({

    type:"joined",

    roomId:message.roomId,

    playerId:message.playerId

}));



return;

}







// -------------------------
// MOTION DATA
// -------------------------


if(message.type==="motion"){



if(!socket.roomId)
    return;



const room =
rooms.get(
socket.roomId
);



if(!room)
    return;





room.players.forEach(
(client)=>{


if(
client !== socket &&
client.readyState === 1
){


client.send(
JSON.stringify(message)
);


}



});


return;

}






// -------------------------
// LEAVE
// -------------------------


if(message.type==="leave"){


removePlayer(socket);


}





});







socket.on(
"close",
()=>{


removePlayer(socket);



console.log(
"WebSocket closed"
);


});





socket.on(
"error",
(err)=>{


console.log(
"Socket error",
err.message
);


});



});
