// function to handle frontend user reaction

const likeButton = document.getElementById("like");
const likeCount = document.getElementById("like-count");
const dislikeButton = document.getElementById("dislike");
const dislikeCount = document.getElementById("dislike-count");


async function updateLikes() {

    let count = parseInt(likeCount.innerHTML);
    count += 1;
    likeCount.innerHTML = count;

    const response = await fetch('/recipes/')

    



}





// event listenters
likeButton.addEventListener("click",updateLikes);