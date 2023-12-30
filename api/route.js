import errorHandler from "./utils/errorHandler.js"
import UserRoute from './router/userRoute.js'
const routersFunction = (app) => {

    app.use("/api/v1/users", UserRoute)

    app.use(errorHandler)

}
export default routersFunction;
