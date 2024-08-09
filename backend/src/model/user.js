import mongoose,{Schema} from 'mongoose';
import bcrypt from "bcrypt"
import  jwt  from 'jsonwebtoken';

const userSchema = new Schema({
    name:{
        type:String,
        require:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    contactNumber:{
        type:Number,
        required:true,
        unique:true
    },
    profileImage:{
        type:String,
        required:true
    },
    userMoney:{
        type:Number,
    },
    refreshToken:{
        type:String,
    }


},{
    timestamps:true
})



//password hash pre middleware run before signup
userSchema.pre('save',function(next){
    if(!this.isModified("password")) next();

    const user=this;
    bcrypt.hash(user.password, 10, function(err, hash) {
       if(err){ 
            return next(err)
        }   
        user.password=hash;
        next();

    });
})


userSchema.methods.isPasswordCorrect=async function(enteredPassword){
    const user=this;
    return await bcrypt.compare(enteredPassword,user.password);
}

userSchema.methods.generateAccessToken=async function(){
    return jwt.sign(
        {
            userId :this._id,
            name:this.name,
            eamil:this.email,
            contactNumber:this.contactNumber,
            username:this.username
        }, 
            process.env.ACCESS_TOKEN_KEY, 
        { 
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY 
        }
    );
}


userSchema.methods.generateRefreshToken=async function(){
    console.log("method");
    return jwt.sign(
        {
            userId :this._id
        }, 
            process.env.REFRESH_TOKEN_KEY
        , 
        { 
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY 
        }
    );
}


const User =mongoose.model("User",userSchema);

export default User;