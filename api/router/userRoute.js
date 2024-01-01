import express  from "express";
import UserController from "../controller/userController.js";
import UserValidate from "../validations/userValidate.js"
import Auth from "../middleware/userAuthMiddleware.js"

const router = express.Router()
router.route("/bulk-register").post(UserController.bulkUserCreateApi)

router.route("/").delete(Auth.authenticateUserAPIToken,UserController.userDelete)
router.route("/").put(Auth.authenticateUserAPIToken,UserValidate.userUpdateValidate,UserController.userUpdate)
router.route("/reset-password").put(Auth.authenticateUserAPIToken,UserValidate.resetPasswordDataValidate,UserController.userPasswordUpdate)
router.route("/trade-history").get(Auth.authenticateUserAPIToken,UserController.getTradeHistory)
router.route("/user-shares").get(Auth.authenticateUserAPIToken,UserController.getUserShares)
router.route("/shares-add").get(Auth.authenticateUserAPIToken,UserController.getUserSharesAdded)
router.route("/").get(UserController.userFindAll)
router.route("/register").post(UserValidate.userRegisterValidate,UserController.userRegister)
router.route("/login").post(UserValidate.userLoginValidate,UserController.userLogin)
router.route("/:id").get(UserController.bringAUser)



export default router