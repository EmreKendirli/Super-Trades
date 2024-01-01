import express from "express"
import db from "./config/database.js"
import UserRoute from "./router/userRoute.js"
import bodyParser from "body-parser"
import dotenv from "dotenv";
import route from "./route.js"
import swaggerUi from "swagger-ui-express"
import { readFile } from 'node:fs/promises';

dotenv.config();

const app = express()
app.use(bodyParser.json());

db.authenticate().then(()=>console.log("Veri Tabanına Bağlandı")).catch((err)=>console.log(err))

//swagger
const fileUrl = new URL("./swagger.json", import.meta.url);
const swaggerDoc = JSON.parse(await readFile(fileUrl, 'utf8'));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc))


route(app);

app.listen(8800,()=>{
    console.log("baglandı")
})