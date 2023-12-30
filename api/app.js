import express from "express"
import db from "./config/database.js"
import UserRoute from "./router/userRoute.js"
import bodyParser from "body-parser"
import dotenv from "dotenv";
import route from "./route.js"

dotenv.config();

const app = express()
app.use(bodyParser.json());

db.authenticate().then(()=>console.log("Veri Tabanına Bağlandı")).catch((err)=>console.log(err))

route(app);

app.listen(8800,()=>{
    console.log("baglandı")
})