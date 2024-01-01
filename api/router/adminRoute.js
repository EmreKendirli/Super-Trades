import express  from "express";
import AdminController from "../controller/adminController.js";
import Auth from "../middleware/adminAuthMiddleware.js"
import AdminValidations from "../validations/adminValidate.js";
const router = express.Router()


router.route("/register").post(AdminValidations.adminRegisterValidate,AdminController.adminRegister)
router.route("/login").post(AdminValidations.adminLoginValidate,AdminController.adminLogin)
router.route("/:id").delete(Auth.authenticateAdminAPIToken,AdminController.adminDelete)
router.route("/:id").put(Auth.authenticateAdminAPIToken,AdminController.adminUpdate)

export default router