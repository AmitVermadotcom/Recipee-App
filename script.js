const mealsEl = document.getElementById("meals");
const favcontainer=document.getElementById("fav-meals");
const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search");
const mealPopup = document.getElementById("meal-popup");
const popupClosebtn = document.getElementById("close-popup");
const showInfo = document.getElementById("show-info");
getRandomMeal();
fetchFavMeals();
async function getRandomMeal() {

    const randomMeal = await (await fetch("https://www.themealdb.com/api/json/v1/1/random.php")).json();
    const mealData = randomMeal.meals[0];
    // console.log(mealData);
    addMeal(mealData, true);

}
async function getMealById(id) {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);
    const respData= await resp.json();
    const meal=respData.meals[0];
    return meal;
}
async function getMealBySearch(term) {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term);
    const respData = await resp.json();
    const meal = respData.meals;
    return meal;
}


function addMeal(resp,random =false) {
    // console.log(resp);
const meal = document.createElement('div');
meal.classList.add('meal');
    meal.innerHTML=
    `<div class="meal-header">
    ${random ? `<span class="random">Random Recipe</span>`:''}
        
        <img src="${resp.strMealThumb}" alt="${resp.strMeal}">
    </div>
   <div class="meal-body">
       <h4>${resp.strMeal}</h4>
       <button class="fav-btn">
           <i class="fas fa-heart"></i>
       </button>
   </div>`;

   
   const btn =meal.querySelector(".meal-body .fav-btn");
   btn.addEventListener("click",() => {

    if (btn.classList.contains("active")) {
        // console.log("hi")
        removeMealFromLs(resp.idMeal);
        btn.classList.remove("active");
    } else {
        addMealToLs(resp.idMeal);
        btn.classList.add("active");
    }

        // btn.classList.toggle("active");
fetchFavMeals();

   });

   meal.addEventListener("click", () => {
showMealInfo(resp);
   });

   mealsEl.appendChild(meal);
}

function addMealToLs(mealId){
    const mealIds=getMealToLs();
    localStorage.setItem("mealIds",JSON.stringify([...mealIds, mealId]));
}
function removeMealFromLs(mealId){
    const mealIds=getMealToLs();
    localStorage.setItem("mealIds",JSON.stringify(mealIds.filter((id) => id !== mealId)));
}

function getMealToLs(){
    const mealIds=JSON.parse(localStorage.getItem('mealIds'));
    return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals(){
    // clear the container
    favcontainer.innerHTML = " ";
    
    const mealIds = getMealToLs();
    const meals = [];
    for(let i = 0;i < mealIds.length;i++){
        const mealId = mealIds[i];
        meal = await getMealById(mealId);
        meals.push(meal);
        addMealToFav(meal);
    }
    console.log(meal);
} 

async function addMealToFav(resp){
    const favMeal = document.createElement('li');
    favMeal.innerHTML=
    `                     
    <img src="${resp.strMealThumb}" alt="${resp.strMeal}">   
    <div class="meal-body">
       <h4>${resp.strMeal}</h4>
   </div>                     
    <button class="clear"><i class="fas fa-window-close"></i>"</button>

    `;
    const btn =favMeal.querySelector(".clear");
    btn.addEventListener("click",() =>{
        removeMealFromLs(resp.idMeal);
        fetchFavMeals();
    });
    favMeal.addEventListener("click", () =>{
        showMealInfo(resp);
    }) 
favcontainer.appendChild(favMeal);
}

searchBtn.addEventListener("click",async () =>{
    // clear container before another serach
    mealsEl.innerHTML = " ";
    const search = searchBtn.value;
    const meals = await getMealBySearch(search);
    if(meals){
        meals.forEach((meal) => {
            addMeal(meal);
        });
    }
});

popupClosebtn.addEventListener("click", () =>{
    mealPopup.classList.add("hidden");
});

function showMealInfo(resp) {
    // clear
    showInfo.innerHTML = ""; 

    const Ingredients=[];
    for(let i=1;i <= 20; i++){
        if(resp['strIngredient'+i]){
            Ingredients.push(`${resp['strIngredient'+i]} - ${resp['strMeasure'+i]}`)
        }
        else{
            break;
        }
    }
    
const mealEl = document.createElement('div');
showInfo.appendChild(mealEl);

mealEl.innerHTML = `
<h1>${resp.strMeal}</h1>
<img src="${resp.strMealThumb}" alt="">
<p>
    ${resp.strInstructions}
</p>
<h3> Ingredients: </h3>
<ul>
${Ingredients.map(ing => `
<li>${ing} </li>`
).join("")}
</ul>
`
mealPopup.classList.remove("hidden");

}