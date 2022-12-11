const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("video-db", "user", "pass", {
  dialect: "sqlite",
  host: "./video-db.sqlite",
});

module.exports = sequelize;
