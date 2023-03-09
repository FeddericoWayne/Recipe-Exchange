// function to handle frontend user reaction

const likeButton = document.getElementById("like");
const likeCount = document.getElementById("like-count");
const dislikeButton = document.getElementById("dislike");
const dislikeCount = document.getElementById("dislike-count");
const recipeId = document.getElementById("commentText");
const user = document.getElementById("like");


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



    



}





// event listenters
likeButton.addEventListener("click",updateLikes);