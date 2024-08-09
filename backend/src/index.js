import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import userRouter from './router/auth.js'

const app=express();
const PORT=process.env.PORT;

app.use(bodyParser.json({limit :"100kb"}))
app.use(bodyParser.urlencoded({extended:true, limit: "100kb"}));
app.use(cookieParser())
app.use(express.static("public"))

app.use('/',userRouter);

// app.get('/', (req, res) => {
//     res.send('hello world')
// })


mongoose.connect(`${process.env.DB_PATH}/${process.env.DB_NAME}`)
    .then(()=>{
        app.listen(PORT,()=>{
            console.log(`http://localhost:${PORT}`);
        })
    })
    .catch(err=>{
        console.log(err);
    })


 