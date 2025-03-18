const express=require('express');
const {mongoose} = require('mongoose');
const User=require('./models/user');
const path=require('path');

const app=express();
const PORT=8002;

mongoose.connect('mongodb://localhost:27017/potato')
        .then(()=>console.log('Connected to MongoDB'))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.get("/",(req,res)=>{
   res.render("home");
});

app.post("/user/signup",async(req,res)=>{
    const {fullname,email,password}=req.body;
    await User.create({
        fullname,
        email,
        password,
    });
    res.send("User created");
});

app.get("/user/signup",(req,res)=>{
    return res.render("signup");
});

app.get("/user/signin",(req,res)=>{
    return res.render("signin");
});

app.post("/user/signin",(req,res)=>{
    const {email,password}=req.body;
    try{
        const token=User.matchPassword(email,password);
        if(token) res.redirect("http://localhost:5173/");
        else res.render("signin")
    }catch(err){
        console.log(err);
    }
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});