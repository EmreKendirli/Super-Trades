import express  from "express";
import SharesController from "../controller/sharesController.js";
import SharesValidations from "../validations/sharesValidete.js";
const router = express.Router()

router.route("/").post(SharesValidations.sharesValidate,SharesController.addShares)
router.route("/").get(SharesController.sharesFindAll)
router.route("/:id").get(SharesController.bringAShares)
router.route("/:id").delete(SharesController.sharesDelete)
router.route("/:id").put(SharesValidations.sharesUpdateValidate,SharesController.sharesPriceUpdate)

export default router

