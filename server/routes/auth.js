import {register,login} from "../controllers/auth.js";
import express from "express"
const authRouter = express.Router();
authRouter.post("/register",register);
authRouter.post("/login",login)
export default authRouter;