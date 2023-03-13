// function to handle frontend user reaction

const likeButton = document.getElementById("like");
const dislikeButton = document.getElementById("dislike");
const recipeId = document.getElementById("commentText");
const user = document.getElementById("like");
const copyButton = document.getElementById("copy");
const copyWrapper = document.getElementById("copy-wrapper");
const copyAlert = document.getElementById("copy-alert");
const recipeText = document.getElementById("recipe-text");


async function updateLikes() {

    const id = recipeId.getAttribute("project-id");
    const userId = user.dataset.id;

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

function showTip(e) {

    if (e.target.matches("img")) {
        copyAlert.removeAttribute("style","visibility:hidden");
    } else {
        copyAlert.setAttribute("style","visibility:hidden");
    }

};

function copyRecipe() {
    // changes alert text
    copyAlert.innerHTML = "Recipe Copied!";

    // changes alert text back to default and sets timeout for alert to disappear in 1 second
    setTimeout(() =>{
        copyAlert.setAttribute("style","visibility:hidden");
        copyAlert.innerHTML = "Copy Recipe?";
    },1000);


    // copies to browser clipboard
    navigator.clipboard.writeText(recipeText.value);

};



// event listenters
likeButton.addEventListener("click",updateLikes);
dislikeButton.addEventListener("click",updateDislikes);
copyWrapper.addEventListener("mouseover",showTip);
copyButton.addEventListener("click",copyRecipe);

