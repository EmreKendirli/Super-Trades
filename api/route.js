import errorHandler from "./utils/errorHandler.js"
import UserRoute from './router/userRoute.js'
import SharesRoute from "./router/sharesRoute.js"
const routersFunction = (app) => {

    app.use("/api/v1/users", UserRoute)
    app.use("/api/v1/shares", SharesRoute)

    app.use(errorHandler)

}
export default routersFunction;
