import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const Guest = sequelize.define('Guest', {
        guest_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: true,
            validate: { isEmail: true }
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        id_type: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        id_number: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        date_of_birth: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        nationality: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        password : {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        verification_key: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        is_email_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        registered_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'guests_new',
        timestamps: false
    });

    export default Guest;
