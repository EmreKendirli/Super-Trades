import TradeHistory from './tradeHistoryModel.js';
import Users from "./userModel.js"

import { Sequelize, DataTypes } from 'sequelize';
import db from '../config/database.js';
const Shares = db.define('shares', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Users,
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING(3), // 3 büyük harfle sembol
  },
  description: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2), // 10 basamak toplam, 2 ondalık basamak
  },
  totalSupply: {
    type: DataTypes.INTEGER,
  },
  availableShares: {
    type: DataTypes.INTEGER,
  },
  
});


Shares.User = Shares.belongsTo(Users, { foreignKey: 'user_id' });

export default Shares;
