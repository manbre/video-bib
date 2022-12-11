const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/databaseConfig");

class episodeModel extends Model {}

episodeModel.init(
  {
    series: { type: DataTypes.TEXT }, //tv show
    title: { type: DataTypes.TEXT },
    director: { type: DataTypes.TEXT },
    genre: { type: DataTypes.TEXT },
    actors: { type: DataTypes.TEXT },
    //
    year: { type: DataTypes.INTEGER },
    season: { type: DataTypes.INTEGER },
    episode: { type: DataTypes.INTEGER },
    runtime: { type: DataTypes.INTEGER },
    intro: { type: DataTypes.INTEGER },
    //
    plot: { type: DataTypes.TEXT },
    //
    poster: { type: DataTypes.TEXT },
    german: { type: DataTypes.TEXT },
    english: { type: DataTypes.TEXT },
    //
    elapsed_time: { type: DataTypes.INTEGER, defaultValue: 0 },
    last_viewed: { type: DataTypes.DATE },
  },

  {
    sequelize,
    modelName: "Episodes",
    timestamps: false,
  }
);

module.exports = episodeModel;
