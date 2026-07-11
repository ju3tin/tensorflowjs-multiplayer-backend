const express =
require("express");


const router =
express.Router();



const games =
require("../games");




router.get(
"/",
(req,res)=>{


res.json(

games.list()

);


});




module.exports =
router;
