import TradeHistory from './tradeHistoryModel.js';

import { Sequelize, DataTypes } from 'sequelize';
import db from '../config/database.js';
const Shares = db.define('shares', {
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



export default Shares;
