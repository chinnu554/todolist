import User from "../models/User.js";
import  { hashPassword , checkPassword }from "../utility/bcrypt.js";
import jwt from "jsonwebtoken";
import { consumeOtp } from "./otp.js";

const createToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

const formatUser = (user) => ({
    _id: user._id,
    username: user.username,
    email: user.email,
});

const register = async(req,res) => {
    try{
        const {username,password,otp}= req.body;
        const email = req.body.email?.trim().toLowerCase();
        if(!username || !password || !email || !otp){
            return res.status(400).json({message:"Username, password, email, and OTP are required", success:false});
        }
        const result = await User.findOne({$or:[{username},{email}]});
        if(result){
            return res.status(409).json({message:"User already exists, please login", success:false});
        }
        const otpResult = await consumeOtp(email, otp);
        if(!otpResult.success){
            return res.status(otpResult.status).json({message:otpResult.message, success:false});
        }
        const hashedpassword = await hashPassword(password);
        const creationResult = await User.create({
            username:username,
            email:email,
            password:hashedpassword
            
        })
        console.log("User registered",creationResult);
        res.status(201).json({message:"User is created", success:true, user: formatUser(creationResult)});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"failed to create user", success:false})
    }
}
const login = async(req,res) =>{
    try{
        const {username,password} = req.body;
        if(!username || !password){
            return res.status(400).json({message:"Username and password are required", success:false});
        }
        const record = await User.findOne({username:username});
        if(!record) {
            return res.status(404).json({message:"User not found, please register", success:false});
        }
        const comparedPassword = await checkPassword(password,record.password);
        if(!comparedPassword){
            return res.status(401).json({message:"password incorrect. try again", success:false});
        }
        const token = createToken(record);
        return res.json({message:"Login sucessfull",success:true,user:formatUser(record), token});
        
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Error occured while logining in", success:false});
    }
}
export  {register,login}
