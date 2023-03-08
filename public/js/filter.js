// selects savory and sweet filter buttons
const savory = document.getElementById("savory");
const sweet = document.getElementById("sweet");


// function to show only savory recipes
async function showSavory() {

    const response = await fetch("/recipes/savory",{
        method: 'GET',
        headers: { "Content-Type":"application/json"}
    });

    if (response.ok) {
        window.location.replace('/recipes/savory');
    };

};


// function to show only sweet recipes
async function showSweet() {

    const response = await fetch("/recipes/sweet",{
        method: 'GET',
        headers: { "Content-Type":"application/json"}
    });

    if (response.ok) {
        window.location.replace('/recipes/sweet');
    };

};



// event listeners
savory.addEventListener("click",showSavory);
sweet.addEventListener("click",showSweet);