import {Router} from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const userRouter = Router();

userRouter.route('/register').post(upload.fields([
    {
      name: "avatar",
      maxCount: 1
    },
    {
      name: "coverimage",
      maxCount: 1
    }
  ]),
  registerUser
)

userRouter.route('/login').post(loginUser)
//Secured Routes
userRouter.route("/logout").post(verifyJWT,logoutUser)
userRouter.route("/refreshAccessToken").post(refreshAccessToken)

export default userRouter;