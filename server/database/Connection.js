const { Sequelize } = require(`sequelize`);
const sequelize = new Sequelize('internship', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: true, // or 'mysql', 'sqlite', 'mssql', etc.
});

  try {
    sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
module.exports=sequelize;

