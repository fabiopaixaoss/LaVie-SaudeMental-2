// const Sequelize = require("sequelize");

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//   host: process.env.DB_HOST,
//   dialect: process.env.DB_DIALECT,
//   port: process.env.DB_PORT,
// });

// module.exports = sequelize;

require('dotenv').config()

const Sequelize = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  port: process.env.DB_PORT,
});

module.exports = sequelize;

// const sequelize = new Sequelize("lavie", "root", "F@bio181612##", {
//   host: "localhost",
//   dialect: "mysql",
//   port: 3306,
// });

// module.exports = sequelize;
