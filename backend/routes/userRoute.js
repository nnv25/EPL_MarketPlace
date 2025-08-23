import express from "express"
import { /*checkVerification,*/ loginUser, registerUser, /*requestPasswordReset, verifyEmail,*/ verifyOTP, resetPassword, banUser ,listUser, limitListUser, resendOTP, sendOtpForPasswordReset, verifyOtpForPasswordReset } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
/*userRouter.get("/verify-email", verifyEmail);*/
/*userRouter.get("/check-verification", checkVerification);*/
/*userRouter.post('/request-password-reset', requestPasswordReset);*/
userRouter.post('/verify-otp', verifyOTP);
userRouter.post('/reset-password', resetPassword);
userRouter.get("/list", listUser)
userRouter.get("/limitlist", limitListUser)
userRouter.post("/ban-user", banUser)
userRouter.post("/resend-otp", resendOTP)
userRouter.post("/request-password-reset", sendOtpForPasswordReset)
userRouter.post("/otp-password-reset", verifyOtpForPasswordReset)


export default userRouter;