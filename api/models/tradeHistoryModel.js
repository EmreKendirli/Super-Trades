import { Sequelize, DataTypes } from 'sequelize';
import db from '../config/database.js';
import Users from "./userModel.js"
import Shares from './sharesModel.js';

const TradeHistory = db.define('trade_histories', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Users,
      key: 'id',
    },
  },
  shares_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Shares,
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('buy', 'sell'), // 'buy' veya 'sell' değerlerini alabilen ENUM
    allowNull: false,
  },
  totalPricePaid: {
    type: DataTypes.DECIMAL(10, 2), // 10 basamak toplam, 2 ondalık basamak
  },
});

export default TradeHistory;
