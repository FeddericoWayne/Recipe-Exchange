// function to handle frontend user reactions
const likeButton = document.getElementById("like");
const dislikeButton = document.getElementById("dislike");
const recipeId = document.getElementById("commentText");
const user = document.getElementById("like");
const userId = user.dataset.id;
const copyButton = document.getElementById("copy");
const copyWrapper = document.getElementById("copy-wrapper");
const copyAlert = document.getElementById("copy-alert");
const ingredientText = document.getElementById("ingredients");
const recipeText = document.getElementById("recipe-content");


// updates recipe's like count
async function updateLikes() {

    const id = recipeId.getAttribute("project-id");

    const response = await fetch(`/api/recipes/likes/${id}`,{
        method: "PUT",
        body: JSON.stringify({ userId }),
        headers: {'Content-Type':'application/json'},
    });

    if (response.ok) {
        window.location.reload();
    };

    if (response.status === 409) {
        return;
    };

};

// updates recipe's dislike count
async function updateDislikes() {

    const id = recipeId.getAttribute("project-id");
    const userId = user.dataset.id;

    const response = await fetch(`/api/recipes/dislikes/${id}`,{
        method: "PUT",
        body: JSON.stringify({ userId }),
        headers: {'Content-Type':'application/json'},
    });

    if (response.ok) {
        window.location.reload();
    };

    if (response.status === 409) {
        return;
    };

};


// copies recipe text for users
function copyRecipe() {
    // changes alert text
    copyAlert.innerHTML = "Recipe Copied!";

    // changes alert text back to default and sets timeout for alert to disappear in 1 second
    setTimeout(() =>{
        copyAlert.innerHTML = "Copy Recipe";
    },1000);

    // copies to browser clipboard
    navigator.clipboard.writeText(`For this recipe you'll need:\n${ingredientText.value}\nHere's how you make it:\n${recipeText.value}`);

};


// event listenters
likeButton.addEventListener("click",updateLikes);
dislikeButton.addEventListener("click",updateDislikes);
copyButton.addEventListener("click",copyRecipe);






