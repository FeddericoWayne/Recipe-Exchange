const router = require('express').Router();
const { Recipe } = require('../../models');
const withAuth = require('../../utils/auth');

// Post a recipe
router.post('/', withAuth, async (req, res) => {
  try {

    const newRecipe = await Recipe.create({
      title: req.body.title,
      recipe_text: req.body.recipe_text,
      ingredients: req.body.ingredients,
      taste: req.body.selectedTaste,
      user_id: req.session.user_id
    });


    res.status(200).json(newRecipe);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a recipe
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const recipeData = await Recipe.destroy({
      where: {
        id: req.params.id
      },
    });

    if (!recipeData) {
      res.status(404).json({ message: 'No recipe found with this id!' });
      return;
    }

    res.status(200).json(recipeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update a recipe/post
router.put('/:id', withAuth, async (req, res) => {
  try {

    const updatedName = req.body.updatedName;
    const updatedBody = req.body.updatedBody;
    const ingredients = req.body.ingredients;
    const updatedTaste = req.body.updatedTaste;

    const recipeData = await Recipe.update(
      {
        title: updatedName,
        recipe_text: updatedBody,
        ingredients: ingredients,
        taste: updatedTaste,
        user_id: req.session.user_id
      },
      {
        where: {
          id: req.params.id
        }
      }
    );

    if (!recipeData) {
      res.status(404).json({ message: 'No recipe found with this id!' });
      return;
    }

    res.status(200).json(recipeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// updates a recipe like
router.put('/likes/:id', withAuth, async(req,res)=> {
  try {
    
    const newLike = `${req.body.userId}/`

    const previousLikes = await Recipe.findByPk(req.params.id);

    const previousLikeCount = previousLikes.likes;
    const currentDislikes = previousLikes.dislikes;

    const previousLikesArray = previousLikeCount.split('/');
    previousLikesArray.pop();

    const currentDislikesArray = currentDislikes.split('/');
    currentDislikesArray.pop();

    // if user already liked the recipe
    if (previousLikesArray.includes(req.body.userId)) {
      
      for (var i=0;i<previousLikesArray.length; i++) {
        if (previousLikesArray[i] === req.body.userId) {
          previousLikesArray.splice(i,1);
        };
        
      };

      if (previousLikesArray.length ===0) {
        await Recipe.update({likes:""},{
          where:{
            id: req.params.id
          }
        });

        res.status(200).json({message:"recipe likes updated!"});

        return;

      } else {

        updatedLikes = previousLikesArray.join("/") + "/";

        await Recipe.update({likes:`${updatedLikes}`},{
          where:{
            id: req.params.id
          }
        });
  
        res.status(200).json({message:"recipe likes updated!"});
  
        return;

      }

    // if user has disliked recipe before
    } else if (currentDislikesArray.includes(req.body.userId)) {

      for (var i=0; i<currentDislikesArray.length; i++) {
        if(currentDislikesArray[i] === req.body.userId) {
          currentDislikesArray.splice(i,1);
        }
      };

      if (currentDislikesArray.length ===0) {
        await Recipe.update({dislikes:""},{
          where: {
            id: req.params.id
          }
        });

      } else {
        const updatedDislikes = currentDislikesArray.join("/") + "/";

        await Recipe.update({dislikes:`${updatedDislikes}`},{
          where:{
            id: req.params.id
          }
        });
      };

      const updatedLikes = await Recipe.update({likes:`${previousLikeCount}${newLike}`},{
        where: {
          id: req.params.id
        }
      });

      res.status(200).json({message:"recipe likes udpated!"});


    // updates recipe likes  
    } else {
    
      const updatedLikes = await Recipe.update({likes:`${previousLikeCount}${newLike}`},{
        where: {
          id: req.params.id
        }
      });

      res.status(200).json({message:"recipe likes udpated!"});
    };
    

  } catch(err) {
    res.status(400).json(err);
  }
});

// updates a recipe dislike
router.put('/dislikes/:id', withAuth, async(req,res)=> {
  try {
    
    const newDislike = `${req.body.userId}/`

    const previousDislikes = await Recipe.findByPk(req.params.id);

    const previousDislikeCount = previousDislikes.dislikes;
    const currentLikes = previousDislikes.likes;

    const previousDislikesArray = previousDislikeCount.split('/');
    previousDislikesArray.pop();

    const currentLikesArray = currentLikes.split('/');
    currentLikesArray.pop();

    if (previousDislikesArray.includes(req.body.userId)) {
      
      for (var i=0;i<previousDislikesArray.length; i++) {
        if (previousDislikesArray[i] === req.body.userId) {
          previousDislikesArray.splice(i,1);
        };
        
      };

      if (previousDislikesArray.length ===0) {
        await Recipe.update({dislikes:""},{
          where:{
            id: req.params.id
          }
        });

        res.status(200).json({message:"recipe likes updated!"});

        return;

      } else {
        
        updatedDislikes = previousDislikesArray.join("/") + "/";

        await Recipe.update({dislikes:`${updatedDislikes}`},{
          where:{
            id: req.params.id
          }
        });
  
        res.status(200).json({message:"recipe dislikes updated!"});
  
        return;

      }

      } else if (currentLikesArray.includes(req.body.userId)) {

        for (var i=0; i< currentLikesArray.length; i++) {
          if (currentLikesArray[i] === req.body.userId) {
            currentLikesArray.splice(i,1);
          }
        };

        if (currentLikesArray.length ===0) {
          await Recipe.update({likes:""},{
            where: {
              id: req.params.id
            }
          });
        } else {

          const updatedLikes = currentLikesArray.join("/") + "/";
  
          await Recipe.update({likes:`${updatedLikes}`},{
            where:{
              id: req.params.id
            }
          });
        };

        const updatedDislikes = await Recipe.update({dislikes:`${previousDislikeCount}${newDislike}`},{
          where: {
            id: req.params.id
          }
        });
  
        res.status(200).json({message:"recipe dislikes udpated!"});
  

    } else {
    
      const updatedDislikes = await Recipe.update({dislikes:`${previousDislikeCount}${newDislike}`},{
        where: {
          id: req.params.id
        }
      });

      res.status(200).json({message:"recipe dislikes udpated!"});
    };

  } catch(err) {
    res.status(400).json(err);
  }
});

module.exports = router;