import express  from "express";
import SharesController from "../controller/sharesController.js";
import SharesValidations from "../validations/sharesValidete.js";
import Auth from "../middleware/adminAuthMiddleware.js"
const router = express.Router()

router.route("/").post(Auth.authenticateAdminAPIToken,SharesValidations.sharesValidate,SharesController.addShares)
router.route("/").get(SharesController.sharesFindAll)
router.route("/:id").get(SharesController.bringAShares)
router.route("/:id").delete(Auth.authenticateAdminAPIToken,SharesController.sharesDelete)
router.route("/:id").put(Auth.authenticateAdminAPIToken,SharesValidations.sharesUpdateValidate,SharesController.sharesPriceUpdate)

export default router

