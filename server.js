const WebSocket = require("ws");

const PORT = 8080;
const MAX_PLAYERS = 4;

const server = new WebSocket.Server({
    port: PORT
});

let players = {};


function createPlayer(ws) {

    const id = "player_" + Math.random()
        .toString(36)
        .substring(2, 8);

    players[id] = {
        id,
        connected: true,

        tensorflowReady: false,

        position: {
            x: 0,
            y: 0,
            z: 0
        },

        rotation: {
            x: 0,
            y: 0,
            z: 0
        },

        animation: "idle",

        socket: ws
    };

    return id;
}


function getPublicPlayers() {

    return Object.values(players)
        .map(player => {

            return {
                id: player.id,

                tensorflowReady:
                    player.tensorflowReady,

                position:
                    player.position,

                rotation:
                    player.rotation,

                animation:
                    player.animation
            };

        });

}


function broadcast() {

    const message = JSON.stringify({

        type: "state",

        playerCount:
            Object.keys(players).length,

        players:
            getPublicPlayers()

    });


    Object.values(players)
        .forEach(player => {

            if(player.socket.readyState === WebSocket.OPEN)
            {
                player.socket.send(message);
            }

        });

}



server.on("connection", ws => {


    if(Object.keys(players).length >= MAX_PLAYERS)
    {
        ws.send(JSON.stringify({
            type:"full",
            message:"Server full"
        }));

        ws.close();
        return;
    }


    const id = createPlayer(ws);

    console.log(
        id,
        "connected"
    );


    ws.send(JSON.stringify({

        type:"welcome",

        id:id,

        playerCount:
            Object.keys(players).length

    }));


    ws.on("message", data => {


        const message =
            JSON.parse(data);


        const player =
            players[id];


        if(!player)
            return;



        // TensorFlow.js loaded

        if(message.type === "tf_ready")
        {
            player.tensorflowReady = true;

            console.log(
                id,
                "TensorFlow ready"
            );
        }



        // Movement update

        if(message.type === "move")
        {

            player.position =
                message.position;


            player.rotation =
                message.rotation;


            player.animation =
                message.animation || "idle";


        }


    });



    ws.on("close", ()=>{


        console.log(
            id,
            "disconnected"
        );


        delete players[id];


    });


});


// Send game state 20 times/sec

setInterval(()=>{

    broadcast();

},50);



console.log(
    "WebSocket server running on",
    PORT
);
