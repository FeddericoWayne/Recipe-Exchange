require('dotenv').config();
const sequelize = require('../config/connection');
// imports sequelize Models
const { User, Recipe, Comment } = require('../models');

// imports required json modules for data seeding
const userData = require('./userSeedData.json');
const recipeData = require('./recipeSeedData.json');
const commentData = require('./commentSeedData.json');

// async function to seed database
const seedDatabase = async () => {

  await sequelize.sync({ force: true });
  console.log("\n----- Database Synced -----\n");

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
  console.log("\n----- User Data Seeded -----\n");

  const recipes = await Recipe.bulkCreate(recipeData);
  console.log("\n----- Recipe Data Seeded -----\n");

  const comments = await Comment.bulkCreate(commentData);
  console.log("\n----- Comment Data Seeded -----\n");

  process.exit(0);
};

// calls the function to seed database
seedDatabase();
