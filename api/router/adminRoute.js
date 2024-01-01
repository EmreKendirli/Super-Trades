import express  from "express";
import AdminController from "../controller/adminController.js";
// import Auth from "../middleware/userAuthMiddleware.js"
import AdminValidations from "../validations/adminValidate.js";
const router = express.Router()


router.route("/register").post(AdminValidations.adminRegisterValidate,AdminController.adminRegister)
router.route("/login").post(AdminValidations.adminLoginValidate,AdminController.adminLogin)
router.route("/:id").delete(AdminController.adminDelete)
router.route("/:id").put(AdminController.adminUpdate)

export default router