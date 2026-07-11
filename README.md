# Motion Game Backend

Multiplayer WebSocket backend for motion capture games.

Built for:

- MediaPipe Pose
- MediaPipe Hands
- Avatar systems
- Multiplayer games
- Multiple game engines


## Features

- Express API
- WebSocket WSS
- Rooms
- Players
- Viewers
- Game plugins
- Motion relay
- Render deployment


# Install


npm install


# Start


npm start



# API


## Status


GET

/api/status


Response:

{
 "online":true
}



# Games


GET

/api/games


Returns installed games.



# Create Room


POST

/api/rooms/create



Example:


{
 "gameId":"dance-001",

 "roomName":"Dance Room",

 "host":{
   "id":"123",
   "name":"Player"
 },


 "security":{

   "joinPassword":"play",

   "viewPassword":"watch"

 },


 "game":{

   "mode":"time",

   "duration":180

 }

}



# WebSocket


Production:

wss://server.com


Development:

ws://localhost:8080



# Join


{
"type":"join",

"roomId":"ABC123",

"role":"capture",

"playerId":"player1"

}



Roles:


capture

Sends motion data.



viewer

Only receives motion.






# Motion Packet


{
"type":"motion",

"timestamp":123456,

"pose":[
{x:0.1,y:0.2,z:0}
],

"hands":[]
}



# Game System


Games are plugins.


Add:


games/mygame/game.js



Register:


registry.register(
"mygame-001",
require("./mygame/game")
);



No server changes required.



# Deployment


Recommended:


Frontend:

Vercel


Backend:

Render



Environment:


PORT supplied automatically by Render.



# Future


- Login
- Avatar bones
- Score system
- Matchmaking
- Spectators
- Replay system
