import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const UserRole = sequelize.define('UserRole', {
  role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'role_id'
  },
  role_name: {
    type: DataTypes.ENUM('Guest_Portal', 'Front_Desk', 'Service_Staff', 'Manager', 'Admin'),
    allowNull: false,
    unique: true,
    field: 'role_name'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'description'
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'permissions'
  }
}, {
  tableName: 'user_roles',
  timestamps: false,
  underscored: true
});

export default UserRole;