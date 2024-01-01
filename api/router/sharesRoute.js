import express  from "express";
import SharesController from "../controller/sharesController.js";
import SharesValidations from "../validations/sharesValidete.js";
import Auth from "../middleware/adminAuthMiddleware.js"
import AuthUser from "../middleware/userAuthMiddleware.js"
const router = express.Router()

router.route("/").post(AuthUser.authenticateUserAPIToken,SharesValidations.sharesValidate,SharesController.addShares)
router.route("/").get(SharesController.sharesFindAll)
router.route("/:id").get(SharesController.bringAShares)
router.route("/:id").delete(AuthUser.authenticateUserAPIToken,AuthUser.isSharesOwnerMiddleware,SharesController.sharesDelete)
router.route("/:id").put(AuthUser.authenticateUserAPIToken,AuthUser.isSharesOwnerMiddleware,SharesValidations.sharesUpdateValidate,SharesController.sharesPriceUpdate)

export default router

