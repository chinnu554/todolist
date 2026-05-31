import { verifyOTP , requestOTP } from "../controllers/otp.js";
import express from "express"
const otpRouter = express.Router();

otpRouter.post("/request-otp",requestOTP);
otpRouter.post("/verify-otp",verifyOTP);

export default otpRouter;