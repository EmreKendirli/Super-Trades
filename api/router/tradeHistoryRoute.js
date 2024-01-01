import express  from "express";
import TradeHistory from "../controller/tradeHistoryController.js"
import Auth from "../middleware/userAuthMiddleware.js"
import Validate from "../validations/tradeHistoryValidate.js"
const router = express.Router()


router.use(Auth.authenticateUserAPIToken)

router.route("/buy/:id").post(Validate.tradeHistoryValidate,TradeHistory.buyShares)
router.route("/sell/:id").post(Validate.tradeHistoryValidate,TradeHistory.sellShares)

export default router
