import { Sequelize, DataTypes } from 'sequelize';
import db from '../config/database.js';
import Users from "./userModel.js"
import Shares from './sharesModel.js';

const UserShares = db.define('user_shares', {
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
  }
});

export default UserShares ;
