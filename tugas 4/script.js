console.log('=== MATERI 5 - CONSUME API ===');
console.log('=== MATERI 5 - CONSUME API ===');
console.log('=== MATERI 5 - CONSUME API ===');


const API_URL = 'https://dummyjson.com/products';

// Data produk global untuk mendukung filter lokal, pencarian, & sorting
let allProducts = [];

// Elemen DOM
const productGrid = document.getElementById('product-grid');
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const emptyState = document.getElementById('empty-state');
const errorMessage = document.getElementById('error-message');
const resultSummary = document.getElementById('result-summary');

const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');
const sortSelect = document.getElementById('sort-select');
const resetBtn = document.getElementById('reset-btn');
const reloadBtn = document.getElementById('reload-btn');
const retryBtn = document.getElementById('retry-btn');

// Elemen Pop-up Detail Produk
const productDialog = document.getElementById('product-dialog');
const dialogCloseBtn = document.getElementById('dialog-close');
const dialogContent = document.getElementById('dialog-content');

// ==========================================
// 1. FUNGSI UTAMA RENDER PRODUK
// ==========================================

function renderProduct(dataProducts) {
    productGrid.innerHTML = ''; // reset isi product grid

    // Jika data kosong
    if (!dataProducts || dataProducts.length === 0) {
        showState('empty');
        if (resultSummary) {
            resultSummary.textContent = 'Menampilkan 0 produk';
            resultSummary.hidden = false;
        }
        return;
    }

    showState('success');

    if (resultSummary) {
        resultSummary.textContent = `Menampilkan ${dataProducts.length} dari ${allProducts.length} produk`;
        resultSummary.hidden = false;
    }

    dataProducts.map(dataProduct => {
        // ubah key dari object dataProduct menjadi variabel -> destructuring assignment
        // untuk memudahkan penggunaan variabel di dalam string template
        const { id, title, price, category, thumbnail, rating } = dataProduct;

        // gunakan += untuk menambahkan string ke dalam productGrid.innerHTML 
        // secara iteratif untuk menghindari overwriting atau tertimpa
        productGrid.innerHTML += `
        <article class="product-card">
          <div class="product-image-wrap">
            <img class="product-image" src="${thumbnail}" alt="${title}" loading="lazy">
          </div>
          <div class="product-body">
            <span class="product-category">
              ${category}
            </span>
            <h3 class="product-title">
              ${title}
            </h3>

            <div class="product-meta">
              <span class="product-price">
                $${price}
              </span>

              <span class="product-rating">
                ⭐ ${rating}
              </span>
            </div>

            <button type="button" class="detail-btn" data-id="${id}" onclick="openDetailModal(${id})">
              Lihat Detail
            </button>
          </div>
        </article>
      `;
    });
}

// Menampilkan state UI (loading, error, empty, atau success)
function showState(state) {
    if (loadingState) loadingState.hidden = state !== 'loading';
    if (errorState) errorState.hidden = state !== 'error';
    if (emptyState) emptyState.hidden = state !== 'empty';
    if (productGrid) productGrid.hidden = state !== 'success';
}

// ==========================================
// 2. FETCH DATA DARI API
// ==========================================

// function di variable disebut juga arrow function atau anonymous function
const getProducts = async (category = 'all') => {
    showState('loading');
    try {
        const apiUrl = category === 'all' 
            ? `${API_URL}?limit=100` 
            : `${API_URL}/category/${category}?limit=100`;
            
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json(); // data dijadikan object javascript
        
        // destructuring assignment { key1, key2, ... }
        const { limit, products, skip, total } = data;

        allProducts = products; // Simpan data global untuk search & sort
        
        applyFiltersAndSort(); // Tampilkan dengan filter & sorting yang aktif
    } catch (error) {
        console.error("Error on getProducts:", error);
        showState('error');
        if (errorMessage) {
            errorMessage.textContent = 'Gagal mengambil data dari API. Silakan periksa koneksi internet Anda.';
        }
    }
};

const getProductCategories = async () => {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json();
        
        categorySelect.innerHTML = '<option value="all">Semua kategori</option>';
        data.map(category => {
            // Menangani jika data kategori berbentuk object { slug, name } atau string biasa
            const slug = typeof category === 'object' ? category.slug : category;
            const name = typeof category === 'object' ? category.name : category;
            
            categorySelect.innerHTML += `<option value="${slug}">${name}</option>`;
        });
    } catch (error) {
        console.error("Error on getProductCategories:", error);
    }
};

// ==========================================
// 3. FITUR SEARCH & SORTING
// ==========================================

function applyFiltersAndSort() {
    let filteredProducts = [...allProducts];

    // Fitur Search (pencarian nama / deskripsi)
    if (searchInput && searchInput.value.trim() !== '') {
        const query = searchInput.value.toLowerCase().trim();
        filteredProducts = filteredProducts.filter(item => 
            item.title.toLowerCase().includes(query) ||
            (item.description && item.description.toLowerCase().includes(query)) ||
            (item.brand && item.brand.toLowerCase().includes(query))
        );
    }

    // Fitur Sorting
    if (sortSelect) {
        const sortValue = sortSelect.value;
        if (sortValue === 'price-asc') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'price-desc') {
            filteredProducts.sort((a, b) => b.price - a.price);
        } else if (sortValue === 'rating-desc') {
            filteredProducts.sort((a, b) => b.rating - a.rating);
        } else if (sortValue === 'name-asc') {
            filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
        }
    }

    renderProduct(filteredProducts);
}

// ==========================================
// 4. POP-UP DETAIL PRODUK (DIALOG MODAL)
// ==========================================

window.openDetailModal = function(id) {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;

    const { title, price, category, thumbnail, rating, description, stock, brand, discountPercentage, images } = product;
    const mainImg = images && images.length > 0 ? images[0] : thumbnail;

    dialogContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 1rem;">
            <img src="${mainImg}" alt="${title}" style="max-height: 200px; object-fit: contain; border-radius: 8px;">
        </div>
        <small style="text-transform: uppercase; color: var(--pico-primary); font-weight: bold;">${category}</small>
        <h3 style="margin-top: 0.25rem;">${title}</h3>
        <p><strong>Merek:</strong> ${brand || '-'}</p>
        <p><strong>Harga:</strong> $${price} <small style="color: green;">(${discountPercentage}% Off)</small></p>
        <p><strong>Rating:</strong> ⭐ ${rating} / 5</p>
        <p><strong>Stok:</strong> ${stock} unit</p>
        <hr>
        <p><strong>Deskripsi:</strong></p>
        <p>${description}</p>
    `;

    if (productDialog) {
        if (typeof productDialog.showModal === 'function') {
            productDialog.showModal();
        } else {
            productDialog.setAttribute('open', 'true');
        }
    }
};

// Tutup dialog
if (dialogCloseBtn) {
    dialogCloseBtn.addEventListener('click', () => productDialog.close());
}

if (productDialog) {
    productDialog.addEventListener('click', (e) => {
        const rect = productDialog.getBoundingClientRect();
        const isInDialog = (
            rect.top <= e.clientY &&
            e.clientY <= rect.top + rect.height &&
            rect.left <= e.clientX &&
            e.clientX <= rect.left + rect.width
        );
        if (!isInDialog) {
            productDialog.close();
        }
    });
}

// ==========================================
// 5. EVENT LISTENERS CONTROL
// ==========================================

// Kategori berubah
categorySelect.addEventListener('change', () => {
    getProducts(categorySelect.value);
});

// Search input
if (searchInput) {
    searchInput.addEventListener('input', applyFiltersAndSort);
}

// Sort select
if (sortSelect) {
    sortSelect.addEventListener('change', applyFiltersAndSort);
}

// Reset filter
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (sortSelect) sortSelect.value = 'default';
        if (categorySelect) categorySelect.value = 'all';
        getProducts('all');
    });
}

// Reload & Retry
if (reloadBtn) reloadBtn.addEventListener('click', () => getProducts(categorySelect.value));
if (retryBtn) retryBtn.addEventListener('click', () => getProducts(categorySelect.value));

// Panggil fungsi pertama kali saat halaman di-load
getProductCategories();
getProducts();