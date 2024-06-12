const mongoose = require("mongoose");


const blogSchema = mongoose.Schema({
  title: {
    type: String,
    
  },
  
 description:{
    type:String,
  },
  createdat:{
    type:Date,
    default:Date.now()
  },
  
  img: {
    type: String,
  },
  
 
});


module.exports = mongoose.model("blog", blogSchema);
