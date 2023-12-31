import { Sequelize, DataTypes } from 'sequelize';
import Shares from './sharesModel.js';
import db from '../config/database.js';
import Users from "./userModel.js"


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

  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});
UserShares.Share = UserShares.belongsTo(Shares, { foreignKey: 'shares_id' });
UserShares.User = UserShares.belongsTo(Users, { foreignKey: 'user_id' });
export default UserShares ;
