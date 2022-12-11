const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/databaseConfig");

class movieModel extends Model {}

movieModel.init(
  {
    title: { type: DataTypes.TEXT },
    series: { type: DataTypes.TEXT },
    director: { type: DataTypes.TEXT },
    genre: { type: DataTypes.TEXT },
    //
    year: { type: DataTypes.INTEGER },
    awards: { type: DataTypes.INTEGER },
    rating: { type: DataTypes.INTEGER },
    runtime: { type: DataTypes.INTEGER },
    //
    actors: { type: DataTypes.TEXT },
    plot: { type: DataTypes.TEXT },
    //
    poster: { type: DataTypes.TEXT },
    trailer: { type: DataTypes.TEXT },
    german: { type: DataTypes.TEXT },
    english: { type: DataTypes.TEXT },
    //
    elapsed_time: { type: DataTypes.INTEGER, defaultValue: 0 },
    last_viewed: { type: DataTypes.DATE },
  },

  {
    sequelize,
    modelName: "Movies",
    timestamps: false,
  }
);

module.exports = movieModel;
