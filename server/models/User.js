import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Hotel from './Hotel.js';
import UserRole from './UserRole.js';

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  hotel_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'hotels',
      key: 'hotel_id'
    }
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user_roles',
      key: 'role_id'
    }
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  profile_picture_url: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Azure Blob Storage URL for profile picture'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  failed_login_attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  account_locked_until: {
    type: DataTypes.DATE,
    allowNull: true
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'user',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  underscored: true
});

// Define relationships
User.belongsTo(Hotel, { 
  foreignKey: 'hotel_id', 
  as: 'hotel' 
});
Hotel.hasMany(User, { 
  foreignKey: 'hotel_id', 
  as: 'employees' 
});

User.belongsTo(UserRole, { 
  foreignKey: 'role_id', 
  as: 'role' 
});
UserRole.hasMany(User, { 
  foreignKey: 'role_id', 
  as: 'users' 
});

export default User;