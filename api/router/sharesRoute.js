import express  from "express";
import SharesController from "../controller/sharesController.js";


const router = express.Router()

router.route("/").post(SharesController.addShares)
router.route("/").get(SharesController.sharesFindAll)
router.route("/:id").get(SharesController.bringAShares)
router.route("/:id").delete(SharesController.sharesDelete)
router.route("/:id").put(SharesController.sharesPriceUpdate)


export default router

