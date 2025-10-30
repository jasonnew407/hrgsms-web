import 'dotenv/config';
import { Sequelize } from 'sequelize';


const sequelize = new Sequelize(
  process.env.DB_NAME || 'hrgsms_db',
  process.env.DB_USER || 'testadmin',
  process.env.DB_PASSWORD || 'test-hrgsms-4321',
  {
    host: process.env.DB_HOST || 'hrgsms-db-server.mysql.database.azure.com',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    timezone: '+00:00',  // UTC
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

export default sequelize;