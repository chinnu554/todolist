import {Resend} from "resend";
import dotenv from "dotenv";
dotenv.config();
const api = process.env.RESEND_API_KEY;
const resend = new Resend(api);
export default resend;