import User from "../model/user.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import ErrorWrapper from "../utils/ErrorWrapper.js";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.js";

export const postSignUp = ErrorWrapper(async (req, res, next) => {
    const { name, username, password, email, contactNumber } = req.body;
    
    //missingFileds
    const incomingFields = Object.keys(req.body);
    const requiredFields = [
        "name",
        "username",
        "password",
        "email",
        "contactNumber",
    ];
    let missingFields = requiredFields.filter(
        (field) => !incomingFields.includes(field)
    );
    if (missingFields.length > 0) {
        
        throw new ErrorHandler(
            401,
            `Provide  missing fields ${missingFields.join(',')} to signup`
        )
        
    }
    


    //check for existing user
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ErrorHandler(401, `username: ${username} or email :${email} already exists`);
    }

    //upload on cloudinary profilepic
    let cloudinaryResponse;
    try {
      cloudinaryResponse = await uploadOnCloudinary(req.file.path);
      console.log(cloudinaryResponse);
    } catch (error) {
      throw new ErrorHandler(401, `Error while uploading the image ${error}`);
    }


    try {
        console.log("hfsfh");
        //storing in db
        const user=await User.create({
            name,
            username,
            password,
            email,
            contactNumber,
            profileImage: cloudinaryResponse.secure_url
    
        })
        // console.log(user);
    
        const newuser=await User.findOne({
            _id:user._id
        }).select('-password')
    
    
        res.status(201).json({
            message: "Successfully Sign up",
            success: true,
            user:newuser
        })
    } 
    catch (error) {
        throw new ErrorHandler(403,error.message)
        
    }


});


const generateRefreshAndAccessToken =async  (userId)=>{

    try {
        const user=await User.findOne({
            _id: userId
        })

    
        const accessToken=await user.generateAccessToken();
        const refreshToken=await user.generateRefreshToken();
        
        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        throw new ErrorHandler(401,"Error while generating refreshToken and AccessToken",error.message)
    }

}

export const postLogin=ErrorWrapper(async (req,res,next)=>{
    const {username,email,password}=req.body;
    
    //check for username and email
    if(!username || !email){
            throw new ErrorHandler(401,"Enter email or username")
    }
   
    //find user
    const user=await User.findOne({
        $or:[
            {username},{email}
        ]
    })

    
    //check user or password
    if(!user){
        throw new ErrorHandler(401,"User not found please go signup first")
    }
    if(!password){
        throw new ErrorHandler(401,"Please Enter password");

    }

    //check for password correct
    const passwordCheck=user.isPasswordCorrect(password);
    if(!passwordCheck){
        throw new ErrorHandler(401,"Passsword entered not corrrect")
    }

    const {refreshToken,accessToken}=await generateRefreshAndAccessToken(user._id);

    user.refreshToken=refreshToken;
    await user.save()

    const newuser=await User.findOne({
        _id:user.id
    }).select("-password -refreshToken")

    res.status(200)
    .cookie("RefreshToken",refreshToken)
    .cookie("AccessToken",accessToken)
    .json({
        success: true,
        message: "Successfully logged in",
        data: newuser
    })




});