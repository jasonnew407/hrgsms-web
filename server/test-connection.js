import sequelize from './config/db.js';

sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully!');
    process.exit(0);  // Exit after success
  })
  .catch(err => {
    console.error('❌ Connection error:', err);
    process.exit(1);  // Exit with error
  });