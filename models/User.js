var mongoose=require("mongoose");
const Schema = mongoose.Schema;

var userSchema = new Schema({
    walletAddress:{
        type:String,
        required:true,
        unique:true,
    },
    walletBalance:{
        type:Number,
        default:0
    }
},{timestamps:true});

module.exports = mongoose.model("user",userSchema)