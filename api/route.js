import errorHandler from "./utils/errorHandler.js"
import UserRoute from './router/userRoute.js'
import SharesRoute from "./router/sharesRoute.js"
import TradeHistoryRoute from "./router/tradeHistoryRoute.js"
import AdminRoute from "./router/adminRoute.js"
const routersFunction = (app) => {

    app.use("/api/v1/admin", AdminRoute)
    app.use("/api/v1/users", UserRoute)
    app.use("/api/v1/shares", SharesRoute)
    app.use("/api/v1/tradehistory", TradeHistoryRoute)

    app.use(errorHandler)

}
export default routersFunction;
