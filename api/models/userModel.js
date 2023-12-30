import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import db from '../config/database.js';

const User = db.define('users', {
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  identityNumber: {
    type: DataTypes.STRING,
  },
  birthYear: {
    type: DataTypes.INTEGER,
  },
});

User.beforeCreate(async (user, options) => {
  if (user.password) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  }
});

export default User;
