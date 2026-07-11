const registry =
require("./registry");



registry.register(

"dance-001",

require("./dance/game")

);



module.exports =
registry;
