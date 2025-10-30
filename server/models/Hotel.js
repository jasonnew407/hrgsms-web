import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Hotel = sequelize.define('Hotel', {
  hotel_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  hotel_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  branch_location: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  tax_rate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00
  },
  standard_checkin_time: {
    type: DataTypes.TIME,
    defaultValue: '14:00:00'
  },
  standard_checkout_time: {
    type: DataTypes.TIME,
    defaultValue: '11:00:00'
  }
}, {
  tableName: 'hotels',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true
});

export default Hotel;