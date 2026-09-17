import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticate = (req,res,next)=>{
    const authorization = req.headers.authorization;
    const token = authorization?.match(/^Bearer\s+([^\s]+)$/i)?.[1];

    if(!token){
        return res.status(401).json({
            success:false,
            message:"Authentication required"
        });
    }

    try{
        const payload = jwt.verify(token,process.env.JWT_SECRET);
        if(!payload || typeof payload !== "object" || !payload.userId){
            throw new Error("Invalid token payload");
        }
        req.user = payload;
        next();
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:"Authentication required"
        });
    }
};
