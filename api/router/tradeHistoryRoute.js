import express  from "express";
import TradeHistory from "../controller/tradeHistoryController.js"
import Auth from "../middleware/userAuthMiddleware.js"
const router = express.Router()

router.use(Auth.authenticateUserAPIToken)

router.route("/buy/:id").post(TradeHistory.buyShares)
router.route("/sell/:id").post(TradeHistory.sellShares)

export default router
