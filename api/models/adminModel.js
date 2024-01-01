import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import db from '../config/database.js';

const Admin = db.define('admins', {
  name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  }
});

Admin.beforeCreate(async (admin, options) => {
  if (admin.password) {
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    admin.password = hashedPassword;
  }
});

export default Admin;
