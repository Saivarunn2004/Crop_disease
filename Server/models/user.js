const { Schema,model } = require("mongoose");
const { createHmac,randomBytes } = require("crypto");
const { error } = require("console");
const {createToken}=require('../service/auth');

const userSchema=new Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    salt:{
        type:String,
    },
    gender:{
        type:String,
    }
});

userSchema.pre("save",function(next){
    const user=this;

    if(!user.isModified("password")) return next();
    const salt=randomBytes(16).toString("hex");
    user.salt=salt;
    const hmac=createHmac("sha256",salt)
                    .update(user.password)
                    .digest("hex");
    user.password=hmac;
    
    next();
});

userSchema.static("matchPassword",async function(email,password){
    const user=await this.findOne({email});
    // if(!user) throw new error("User Not Found");
    if(!user) return false;
    const salt=user.salt;
    const hashed_pass=user.password;
    const hmac=createHmac("sha256",salt)
                  .update(password)
                  .digest("hex");
    console.log(hmac);
    console.log(hashed_pass);
    // if(hashed_pass!==hmac) throw new error("Incorrect Password");
    if(hashed_pass!==hmac) return false;
    return true;
    // const token=createToken(user);
    // return token;
})


const User=model("user",userSchema);
module.exports=User;  //export the model