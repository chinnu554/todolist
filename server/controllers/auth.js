import User from "../models/User.js";
import  { hashPassword , checkPassword }from "../utility/bcrypt.js";

const register = async(req,res) => {
    try{
        const {username,password}= req.body;
        if(!username || !password){
            return res.json("Username and password are required");
        }
        const result = await User.findOne({username});
        if(result){
            return res.json("User already exist , please login");
        }
        const hashedpassword = await hashPassword(password);
        const creationResult = await User.create({
            username:username,
            password:hashedpassword
            
        })
        console.log("User registered",creationResult);
        res.json("User is created",creationResult);
    }
    catch(err){
        console.log(err);
        res.json("failed to create user")
    }
}
const login = async(req,res) =>{
    try{
        const {username,password} = req.body;
        if(!username || !password){
            return res.json("Username and password are required");
        }
        const record = await User.findOne({username:username});
        if(!record) {
            return res.json("User not found, please register");
        }
        const comparedPassword = checkPassword(password,record.password);
        if(!comparedPassword){
            return res.json("password incorrect . try again");
        }
        return res.json({message:"Login sucessfull",user:record});
        
    }
    catch(err){
        console.log(err);
        return res.json("Error occured while logining into",err);
    }
}
export  {register,login}