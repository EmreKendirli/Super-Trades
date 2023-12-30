import {Sequelize} from "sequelize"

const data = new Sequelize("superTrades","postgres","12345",{
    host:"localhost",
    dialect:"postgres"
})

export default data