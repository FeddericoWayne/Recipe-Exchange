const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// sets up Recipe Model
class Recipe extends Model { };

// initiates Recipe Model
Recipe.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        recipe_text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        ingredients: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        taste: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        likes: {
            type: DataTypes.TEXT,
            defaultValue: "",
        },
        dislikes: {
            type:DataTypes.TEXT,
            defaultValue: "",
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "user",
                key: "id"
            },
        },
    },
    {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: "recipe",
        freezeTableName: true
    }
);

// exports Recipe Model
module.exports = Recipe;