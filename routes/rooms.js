const express =
require("express");


const router =
express.Router();


const RoomManager =
require("../managers/RoomManager");





router.post(
"/create",
(req,res)=>{


try{


const room =
RoomManager.create(
req.body
);



res.json({

success:true,

roomId:
room.roomId,

gameId:
room.gameId

});



}
catch(error){



console.log(
"[ROOM ERROR]",
error.message
);



res.status(400)
.json({

success:false,

message:
error.message

});


}



});






router.get(
"/",
(req,res)=>{


res.json(

RoomManager.list()

);


});





module.exports =
router;
