/*
 Motion Game Backend

 Handles:

 HTTP API
 WebSocket Server
 Rooms
 Games
 Motion Relay

 Render compatible
*/


const express = require("express");
const cors = require("cors");
const http = require("http");
const { WebSocketServer } = require("ws");


require("./games");


const roomRoutes =
require("./routes/rooms");


const gameRoutes =
require("./routes/games");


const setupSockets =
require("./websocket/socket");



const PORT =
process.env.PORT || 8080;



console.log("==============================");
console.log(" Motion Game Server Starting ");
console.log("==============================");



const app = express();


app.use(cors());

app.use(express.json());




app.use((req,res,next)=>{

console.log(
"[HTTP]",
req.method,
req.url
);

next();

});





app.get(
"/api/status",
(req,res)=>{


res.json({

online:true,

service:
"motion-game-server",

time:
Date.now()

});


});




app.use(
"/api/rooms",
roomRoutes
);



app.use(
"/api/games",
gameRoutes
);





const server =
http.createServer(app);



const wss =
new WebSocketServer({

server

});



setupSockets(wss);



server.listen(
PORT,
()=>{


console.log(
"[SERVER] Running:",
PORT
);


console.log(
"[WSS] Ready"
);


});
