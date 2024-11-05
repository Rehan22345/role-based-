const express = require("express");
const app = express();
const connect = require("./db/connect");
const model = require("./model/user.js");
const argon = require("argon2");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const blog = require("./model/blog.js");
const cookieParser = require("cookie-parser");
const port = 3000;
connect();

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
const middleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Please login !!" });
  }
  try {
    const decoded = jwt.verify(token, "Tokens");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

const adminMiddlewares = async(req,res,next)=>{
  const admindetails = await model.findOne({email : "admin@gmail.com"});
  if(!admindetails) return  res.status(401).json({message : "Invalid Admin details"});
  if(req.user.email === admindetails.email){
    next();
  }else{
    return res.status(401).json({message : "acess denied"})
  }
    }
app.get("/createblog",(req,res)=>{
  res.render("blog")
})

app.get("/login",(req,res)=>{
  res.render("login")
})
app.get("/login",(req,res)=>{
  res.render("login")
})
app.get("/register",(req,res)=>{
  res.render("register")
})

app.get("/",async(req,res)=>{
  try {
    const blogs = await blog.find(); // Correct model name to `Blog`
    res.render("index", { blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).send("An error occurred while fetching blogs.");
  }
});


app.post("/createblog",middleware,async(req,res)=>{

  const { title, subtitle, description } = req.body;
  try {
    await blog.create({
      title,
      subtitle,
      description,
    });
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error adding blog", error });
  }
})


app.post("/create",async(req,res)=>{
  const { name , email , password} = req.body;
  const hashed =  await argon.hash(password);

await model.create({
  name:name,
  email:email,
  password:hashed
})
  res.json({
    message : "user created sucessfully"
  })
})




app.post("/login",async(req,res)=>{
  const {email , password} = req.body;
const exists = await  model.findOne({email:email});
console.log(exists);
if(!exists) return  res.json({message : "user not found"});

const validate = await argon.verify(exists.password,password);

if(!validate) return  res.json({message : "invalid password"});


try{
  const token = jwt.sign({email},"Tokens",{
    expiresIn :"30d",
  });
  res.cookie("token",token)
console.log(token);
}catch(err){
console.log(err)
}

res.json({
  message :  "logged in sucessfully"

})

})

app.get("/admin",middleware,adminMiddlewares,async(req,res)=>{
  const users = await model.find({email : { $ne: 'admin@gmail.com' }}); // Fetch all users from the database
  res.render('admin', { users }); 
});

app.delete("/admin/delete/:id",async(req,res)=>{
  const id = req.params.id;
   const user = await model.findByIdAndDelete(id);
res.json({
  message : "user deleted sucessfully"
})
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});