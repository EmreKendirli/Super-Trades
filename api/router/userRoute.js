import express  from "express";
import UserController from "../controller/userController.js";
import UserValidate from "../validations/userValidate.js"
import Auth from "../middleware/userAuthMiddleware.js"

const router = express.Router()


router.route("/trade-history").get(Auth.authenticateUserAPIToken,UserController.getTradeHistory)
router.route("/user-shares").get(Auth.authenticateUserAPIToken,UserController.getUserShares)
router.route("/").get(UserController.userFindAll)
router.route("/register").post(UserValidate.userRegisterValidate,UserController.userRegister)
router.route("/login").post(UserValidate.userLoginValidate,UserController.userLogin)
router.route("/:id").get(UserController.bringAUser)
router.route("/:id").delete(UserController.userDelete)
router.route("/:id").put(UserController.userUpdate)

export default router