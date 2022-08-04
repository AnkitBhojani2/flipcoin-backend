var express =require("express")
var router =express.Router()
const { authenticateUser } = require("../controllers/auth");


router.post("/authenticateUser" ,authenticateUser )



module.exports = router;