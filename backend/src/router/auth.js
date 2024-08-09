import express from "express"
import {  
    postLogin, 
    postSignUp 
} from "../controller/auth.js";
import upload from "../utils/multer.js";

const router=express.Router();



router.post('/signup',upload.single('images'),postSignUp)
router.post('/login',postLogin)



export default router;