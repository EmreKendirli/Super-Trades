import {Sequelize} from "sequelize"

import dotenv from "dotenv";
dotenv.config();

const data = new Sequelize(process.env.DB_TABLE,process.env.DB_NAME,process.env.DB_PASS,{
    host:"localhost",
    dialect:"postgres"
})

export default data