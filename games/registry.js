const games={};



function register(id,game){

console.log(
"[GAME REGISTER]",
id
);


games[id]=game;

}



function get(id){

return games[id];

}



function list(){

return Object.keys(games);

}



module.exports={

register,

get,

list

};
