const API_URL = "https://dummyjson.com/recipes";
let allRecipes = [];
let favorites = [];
let isShowingFavoritesOnly = false;

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const cuisineFilter = document.getElementById("cuisine-filter");
const difficultyFilter = document.getElementById("difficulty-filter");
const sectionTitle = document.getElementById("section-title");
const recipeCount = document.getElementById("recipe-count");
const resetFilterButton = document.getElementById("reset-filter-button");
const favoriteButton = document.getElementById("favorite-button");
const favoriteCount = document.getElementById("favorite-count");

const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");
const emptyState = document.getElementById("empty-state");
const recipeGrid = document.getElementById("recipe-grid");

const recipeDialog = document.getElementById("recipe-dialog");
const closeDialog = document.getElementById("close-dialog");
const dialogContent = document.getElementById("dialog-content");

async function getRecipes() {
  showState("loading");
  try {
    const response = await fetch(`${API_URL}?limit=50`);
    if (!response.ok) throw new Error("Gagal mengambil data dari API");

    const data = await response.json();
    allRecipes = data.recipes;

    populateCuisineOptions(allRecipes);
    applyFilterAndSearch();
  } catch (error) {
    console.error("Error Fetching Recipes:", error);
    showState("error");
  }
}

function applyFilterAndSearch() {
  let filtered = [...allRecipes];

  if (isShowingFavoritesOnly) {
    filtered = filtered.filter((r) => favorites.includes(r.id));
    if (sectionTitle) sectionTitle.textContent = "Favorite Recipes";
  } else if (sectionTitle) {
    sectionTitle.textContent = "Explore Recipes";
  }

  const keyword = searchInput ? searchInput.value.toLowerCase().trim() : "";
  if (keyword) {
    filtered = filtered.filter((r) => r.name.toLowerCase().includes(keyword) || r.cuisine.toLowerCase().includes(keyword));
  }

  const selectedCuisine = cuisineFilter ? cuisineFilter.value : "";
  if (selectedCuisine) {
    filtered = filtered.filter((r) => r.cuisine === selectedCuisine);
  }

  const selectedDifficulty = difficultyFilter ? difficultyFilter.value : "";
  if (selectedDifficulty) {
    filtered = filtered.filter((r) => r.difficulty.toLowerCase() === selectedDifficulty.toLowerCase());
  }

  if (resetFilterButton) {
    const isFiltered = keyword || selectedCuisine || selectedDifficulty || isShowingFavoritesOnly;
    resetFilterButton.hidden = !isFiltered;
  }

  renderRecipes(filtered);
}

function renderRecipes(recipes) {
  if (recipes.length === 0) {
    showState("empty");
    if (recipeCount) recipeCount.textContent = "0 recipes";
    return;
  }

  showState("success");
  if (recipeCount) recipeCount.textContent = `${recipes.length} recipes`;

  recipeGrid.innerHTML = recipes
    .map((item) => {
      const isFav = favorites.includes(item.id);
      return `
      <article class="recipe-card" style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background: #fff;">
        <div style="position: relative;">
          <img src="${item.image}" alt="${item.name}" loading="lazy" style="width: 100%; height: 180px; object-fit: cover;">
          <button
            onclick="toggleFavorite(${item.id})"
            style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.85); border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; font-size: 16px;">
            ${isFav ? "❤️" : "🤍"}
          </button>
        </div>
        <div style="padding: 16px;">
          <small style="color: #6b7280; font-weight: bold; text-transform: uppercase;">${item.cuisine} • ${item.difficulty}</small>
          <h3 style="margin: 8px 0; font-size: 1.1rem;">${item.name}</h3>
          <p style="margin-bottom: 12px; color: #4b5563;">⭐ ${item.rating} (${item.reviewCount} reviews)</p>
          <button
            type="button"
            onclick="openDetail(${item.id})"
            style="width: 100%; padding: 8px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
            View Recipe
          </button>
        </div>
      </article>
    `;
    })
    .join("");
}

function openDetail(id) {
  const recipe = allRecipes.find((r) => r.id === id);
  if (!recipe) return;

  dialogContent.innerHTML = `
    <div style="padding: 10px;">
      <img src="${recipe.image}" alt="${recipe.name}" style="width: 100%; max-height: 220px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;">
      <h2 style="margin: 0 0 6px 0;">${recipe.name}</h2>
      <p style="margin: 0 0 12px 0; color: #6b7280;">
        📌 <strong>Cuisine:</strong> ${recipe.cuisine} |
        ⚡ <strong>Level:</strong> ${recipe.difficulty} |
        ⏱️ <strong>Cook Time:</strong> ${recipe.cookTimeMinutes} mins
      </p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 12px 0;">
      <h4 style="margin: 8px 0;">🛒 Ingredients:</h4>
      <ul style="padding-left: 20px; margin-bottom: 16px;">
        ${recipe.ingredients.map((ing) => `<li style="margin-bottom: 4px;">${ing}</li>`).join("")}
      </ul>
      <h4 style="margin: 8px 0;">👨‍🍳 Instructions:</h4>
      <ol style="padding-left: 20px;">
        ${recipe.instructions.map((step) => `<li style="margin-bottom: 6px;">${step}</li>`).join("")}
      </ol>
    </div>
  `;

  if (recipeDialog) recipeDialog.showModal();
}

if (closeDialog) {
  closeDialog.addEventListener("click", () => recipeDialog.close());
}

if (recipeDialog) {
  recipeDialog.addEventListener("click", (e) => {
    const rect = recipeDialog.getBoundingClientRect();
    const isInDialog = rect.top <= e.clientY && e.clientY <= rect.top + rect.height && rect.left <= e.clientX && e.clientX <= rect.left + rect.width;

    if (!isInDialog) recipeDialog.close();
  });
}

function toggleFavorite(id) {
  favorites = favorites.includes(id) ? favorites.filter((favId) => favId !== id) : [...favorites, id];

  if (favoriteCount) favoriteCount.textContent = favorites.length;
  applyFilterAndSearch();
}

if (favoriteButton) {
  favoriteButton.addEventListener("click", () => {
    isShowingFavoritesOnly = !isShowingFavoritesOnly;
    favoriteButton.style.background = isShowingFavoritesOnly ? "#ffe4e6" : "";
    applyFilterAndSearch();
  });
}

function showState(state) {
  if (loadingState) loadingState.hidden = state !== "loading";
  if (errorState) errorState.hidden = state !== "error";
  if (emptyState) emptyState.hidden = state !== "empty";
  if (recipeGrid) recipeGrid.hidden = state !== "success";
}

function populateCuisineOptions(recipes) {
  if (!cuisineFilter) return;
  const cuisines = [...new Set(recipes.map((r) => r.cuisine))];
  cuisineFilter.innerHTML = `<option value="">All Cuisine</option>` + cuisines.map((c) => `<option value="${c}">${c}</option>`).join("");
}

if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    applyFilterAndSearch();
  });
}

if (searchInput) searchInput.addEventListener("input", applyFilterAndSearch);
if (cuisineFilter) cuisineFilter.addEventListener("change", applyFilterAndSearch);
if (difficultyFilter) difficultyFilter.addEventListener("change", applyFilterAndSearch);

if (resetFilterButton) {
  resetFilterButton.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    if (cuisineFilter) cuisineFilter.value = "";
    if (difficultyFilter) difficultyFilter.value = "";
    isShowingFavoritesOnly = false;
    if (favoriteButton) favoriteButton.style.background = "";
    applyFilterAndSearch();
  });
}

getRecipes();
