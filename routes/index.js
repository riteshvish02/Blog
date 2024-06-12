var express = require('express');
var router = express.Router();

var upload = require("./multer")

var userModel = require('./users')
var blogModel = require('./blog')
var passport = require('passport')
var localStrategy = require('passport-local')
passport.use(new localStrategy(userModel.authenticate()))


router.get('/', function(req, res) {
  
  res.render('index',);
});

router.get('/edit',isLoggedIn,async function(req, res) {
  let user = await userModel.findOne({username:req.session.passport.user})
  console.log(user);
  res.render('edit',{user:user});
});


router.post('/updatedets',isLoggedIn,async function(req, res) {
  let users = await userModel.findOneAndUpdate(
    {username:req.session.passport.user},
    {username:req.body.username,name:req.body.name},
    {new:true}
    )
   req.login(users,function(err){
    if(err) throw err;
    res.redirect("/");
   })
  
});


router.post('/register', function(req, res) {

    var user = new userModel({
      email:req.body.email,
      username:req.body.username,
      name:req.body.name,
         
    })

 userModel.register(user,req.body.password)
 .then(function(userdets){
  passport.authenticate("local")(req,res,function(){
    res.redirect("/profile")
  })
 })
 

});








router.get('/profile',isLoggedIn,async function(req, res) {
  const blogs = await blogModel.find()
  const user =  await userModel.findOne({username:req.session.passport.user})
  console.log(blogs);
  console.log(user);
  res.render('profile',{blogs:blogs,user});
});


router.get('/deleteblog/:id',isLoggedIn,async function(req, res) {
  const blogs = await blogModel.findOneAndDelete({_id:req.params.id})
  res.redirect('/profile');
  // res.send("okk")
});


router.get('/postblog',isLoggedIn,function(req, res) {
  res.render('blog');
});


router.post('/login',passport.authenticate("local",{
  successRedirect:"/profile"  ,
  failureRedirect:"/"
}),function(req,res,next) {})


router.get('/logout',function(req, res, next) {
req.logout(function(err){
if (err){
  return next(err);
}
res.redirect("/")
})
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }else{
    res.redirect("/")
  }
}

router.post('/blogpost',isLoggedIn,upload.single("file"),async function(req, res) {
 
  let blog =  await blogModel.create({
    description:req.body.description,
    img:req.file.filename,
    title:req.body.title,
  })

 res.redirect('/profile');

});


















module.exports = router;
