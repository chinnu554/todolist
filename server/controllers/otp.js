
import Otp from "../models/Otp.js";
import   {sendOtp }  from "../utility/sendOtp.js";

const consumeOtp = async (email, otp) => {
  const otpRecord = await Otp.findOne({ email });

  if (!otpRecord) {
    return { success: false, status: 404, message: "OTP not found" };
  }

  if (otpRecord.expiresAt < new Date()) {
    await Otp.deleteOne({ email });
    return { success: false, status: 400, message: "OTP expired" };
  }

  if (otpRecord.otp !== Number(otp)) {
    return { success: false, status: 400, message: "Invalid OTP" };
  }

  await Otp.deleteOne({ email });
  return { success: true };
};

const requestOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    );

    await Otp.findOneAndDelete({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    const emailResult = await sendOtp(email, otp);
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
    console.log("OTP email sent", emailResult?.id)
  } catch (error) {
    if (req.body.email) {
      await Otp.deleteOne({ email: req.body.email });
    }
    console.error("OTP send failed:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const result = await consumeOtp(email, otp);

    if (!result.success) {
      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {requestOTP,verifyOTP,consumeOtp}
