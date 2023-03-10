const router = require('express').Router();
const { Recipe, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Get route for homepage
router.get('/', async (req, res) => {
  try {
    // Get all recipes and JOIN with user data
    const recipeData = await Recipe.findAll({
      include: [
        {
          model: User,
        },
        {
          model: Comment,
        }
      ],
    });

    // If they are logged in, return user information, and if not, return nothing
    var userInformation = async (req, res) => {
      if (req.session.logged_in) {
        const userData = await User.findByPk(req.session.user_id, {
          attributes: { exclude: ['password'] },
        });
    
        const user = userData.get({ plain: true });
  
        return user;
      } else {
        return;
      };
    }

    // Serialize data so the template can read it
    const recipes = recipeData.map((recipe) => recipe.get({ plain: true }));

    const recentRecipes = recipes.slice((recipes.length - 3), (recipes.length));

    // Pass serialized data and session flag into template
    res.render('homepage', {
      recentRecipes,
      userInformation,
      user_id: req.session.user_id,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Load all recipes for the /recipes page
router.get('/recipes', async (req, res) => {
  try {
    // Get all recipes and JOIN with user data
    const recipeData = await Recipe.findAll({
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Comment,
        }
      ],
    });

    // Serialize data so the template can read it
    const recipes = recipeData.map((recipe) => recipe.get({ plain: true }));

    // sorts through the recipes array by likes count
    recipes.sort((a,b) => {
      return b.likes.split("/").length - a.likes.split("/").length;
    });
    
    // Pass serialized data and session flag into template
    res.render('recipes', {
      recipes,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Load all savory recipes for the /recipes page
router.get('/recipes/savory', async (req, res) => {
  try {
    // Get all recipes and JOIN with user data
    const recipeData = await Recipe.findAll({
      where: {
        taste: "savory"
      },
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Comment,
        }
      ],
    });

    // Serialize data so the template can read it
    const recipes = recipeData.map((recipe) => recipe.get({ plain: true }));

    // sorts through the recipes array by likes count
    recipes.sort((a,b) => {
      return b.likes.split("/").length - a.likes.split("/").length;
    });

    // Pass serialized data and session flag into template
    res.render('recipes', {
      recipes,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Load all savory recipes for the /recipes page
router.get('/recipes/sweet', async (req, res) => {
  try {
    // Get all recipes and JOIN with user data
    const recipeData = await Recipe.findAll({
      where: {
        taste: "sweet"
      },
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Comment,
        }
      ],
    });

    // Serialize data so the template can read it
    const recipes = recipeData.map((recipe) => recipe.get({ plain: true }));

    // sorts through the recipes array by likes count
    recipes.sort((a,b) => {
      return b.likes.split("/").length - a.likes.split("/").length;
    });

    // Pass serialized data and session flag into template
    res.render('recipes', {
      recipes,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Load all beverage recipes for the /recipes page
router.get('/recipes/beverage', async (req, res) => {
  try {
    // Get all recipes and JOIN with user data
    const recipeData = await Recipe.findAll({
      where: {
        taste: "beverage"
      },
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Comment,
        }
      ],
    });

    // Serialize data so the template can read it
    const recipes = recipeData.map((recipe) => recipe.get({ plain: true }));

    // sorts through the recipes array by likes count
    recipes.sort((a,b) => {
      return b.likes.split("/").length - a.likes.split("/").length;
    });

    // Pass serialized data and session flag into template
    res.render('recipes', {
      recipes,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login route
router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to dashboard route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login', {
    logged_in: req.session.logged_in,
  });
});

// Use withAuth middleware to prevent access to route
// Get route for the dashboard
router.get('/dashboard', withAuth, async (req, res) => {

  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Recipe }],
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get one particular recipe 
router.get('/recipe/:id', async (req, res) => {
  try {
    const recipeData = await Recipe.findByPk(req.params.id, {
      include: [
        {
          model: User
        },
        {
          model: Comment,
          include: {
            model: User,
            attributes: ['id', 'username']
          }
        }
      ],
    });

    const recipe = recipeData.get({ plain: true });
    // retrieves the string of user who liked recipe and turns data into a like count


    // TODO: figure out what to do if a recipe's likes and dislikes are null;
    // MAYBE: change the Model set so the default value of a like/dislike of a recipe is "" instead of null
    // new recipes have likes and dislikes value of NULL and is throwing errors making single-recipes page not loading
    const likesArray = recipe.likes.split("/");
    likesArray.pop();
    const likesCount = likesArray.length;


    // retrieves the string of user who liked recipe and turns data into a like count
    const dislikesArray = recipe.dislikes.split("/");
    dislikesArray.pop();
    const dislikesCount = dislikesArray.length; 

    res.render('single-recipe', {
      ...recipe,
      likesCount,
      dislikesCount,
      user_id: req.session.user_id,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;