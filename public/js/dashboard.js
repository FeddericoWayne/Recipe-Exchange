// selects update button
const editRecipes = document.getElementsByClassName("update-recipe");
const cancelButtons = document.getElementsByClassName("cancel");



// handle submitting new project (post)
const newFormHandler = async (event) => {
    event.preventDefault();

    const title = document.querySelector('#recipe-name').value.toUpperCase().trim();
    const ingredients = document.querySelector('#main-ingredient').value;
    const recipe_text = document.querySelector('#recipe-text').value.trim();
    const selectedTaste = document.getElementById("taste").value;

    if (title.length ===0 || recipe_text.length ===0 || ingredients.length ===0 || selectedTaste.length ===0) {
        window.alert("Please fill out recipe title, main ingredient, taste, and text!");
        return;
    }

    if (title && recipe_text && ingredients && selectedTaste.length) {
        const response = await fetch(`/api/recipes`, {
            method: 'POST',
            body: JSON.stringify({ title, recipe_text, ingredients, selectedTaste }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert('Failed to create recipe');
        };
    };
};


// handle deleting a project (post)
const delButtonHandler = async (event) => {

    event.preventDefault();
    const recipe_id = event.target.getAttribute('data-id');

    if (recipe_id) {
        const deleteRecipe = await fetch(`/api/recipes/${recipe_id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (deleteRecipe.ok) {
            // If successful, reload page without project
            window.location.reload();
        } else {
            window.alert('Failed to delete recipe');
        };
    };
};

// handle editing a project (post)
const editButtonHandler = async (event) => {
    event.preventDefault();

    // displays recipe update box
    event.target.parentElement.nextSibling.nextSibling.removeAttribute("style","display:none");
    event.target.setAttribute("style","display:none");

    // assigns recipe ID and save button to variables
    const id = event.target.getAttribute('data-id');
    const saveButton = event.target.parentElement.nextSibling.nextSibling.children[0].children[7].children[1];


    // async function to save updated recipe
    async function saveRecipe(e) {

        e.preventDefault();

        // select user input texts
        const updatedName = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.children[1].value.toUpperCase();
        const ingredients = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.children[1].value.trim();
        const updatedBody = e.target.parentElement.previousElementSibling.previousElementSibling.children[1].value;
        const updatedTaste = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.children[1].value;

        // if user misses any input box
        if (updatedName.length === 0 || ingredients.length === 0 || updatedBody.length === 0 || updatedTaste.length === 0) {
            window.alert("Please fill out recipe title, main ingredient, and text to continue!");
            return;
        };

        // if all three input boxes are filled in
        if (updatedBody && updatedName && ingredients && updatedTaste.length) {
            const updateProject = await fetch(`/api/recipes/${id}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({ updatedName, updatedBody, ingredients, updatedTaste }),
                    headers: { 'Content-Type': 'application/json' },
                });
    
            if (updateProject.ok) {
                // If successful, reload page with updated comment
                window.location.reload();
            } else {
                window.alert('Failed to update post');
            };
        };
    } 

    // event listener for the update recipe button
    saveButton.addEventListener("click",saveRecipe); 

};

//reloads the dashboard page if users cancel recipe update
function cancelUpdate() {
    location.reload();
};

// determine if the user clicked the edit or delete button (and then redirect them to the corresponding function)
const handleDelete = async (event) => {

    if (event.target.getAttribute("id") === "deletepostbutton") {
        delButtonHandler(event);
    };
};


// adds event listeners to each "update" and "cancel" button
for (editRecipe of editRecipes) {
    editRecipe.addEventListener("click",editButtonHandler); 
};

for (cancelButton of cancelButtons) {
    cancelButton.addEventListener("click",cancelUpdate);
};

// event listeners for new recipe posting and recipe deletion
document
    .querySelector('.new-recipe')
    .addEventListener('submit', newFormHandler);

document
    .querySelector('.project-list')
    .addEventListener('click', handleDelete);
