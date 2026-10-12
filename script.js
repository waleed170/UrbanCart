
"use strict";

// ========================================
// UrbanCart — Product catalogue
// ========================================

const products = [
    {
        id: 1,
        name: "Sculpted Ceramic Vase",
        category: "Home Decor",
        price: 34.00,
        tag: "BESTSELLER",
        description: "A timeless accent for shelves and tables.",
        image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 2,
        name: "Arc Table Lamp",
        category: "Lighting",
        price: 68.00,
        tag: "DESIGN PICK",
        description: "Soft lighting for slow evenings.",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 3,
        name: "Everyday Ceramic Mug",
        category: "Kitchen",
        price: 18.00,
        tag: "",
        description: "Your morning coffee, made a little better.",
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 4,
        name: "Linen Cushion Cover",
        category: "Textiles",
        price: 26.00,
        tag: "NEW",
        description: "An understated layer of natural texture.",
        image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 5,
        name: "Minimalist Wall Clock",
        category: "Home Decor",
        price: 45.00,
        tag: "",
        description: "Clean lines for a calmer space.",
        image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 6,
        name: "Pendant Glass Light",
        category: "Lighting",
        price: 82.00,
        tag: "DESIGN PICK",
        description: "A warm focal point above any table.",
        image: "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 7,
        name: "Wood Serving Board",
        category: "Kitchen",
        price: 32.00,
        tag: "",
        description: "Made for gathering and sharing.",
        image: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 8,
        name: "Soft Woven Throw",
        category: "Textiles",
        price: 54.00,
        tag: "BESTSELLER",
        description: "An extra layer of comfort for quiet nights.",
        image: "https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 9,
        name: "Stoneware Planter",
        category: "Home Decor",
        price: 29.00,
        tag: "",
        description: "A simple home for your favourite greenery.",
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=80"
    }
];

// ========================================
// Application state
// ========================================

// The cart stores product IDs and quantities.
const cart = new Map();

// ========================================
// HTML element references
// ========================================

const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const emptyMessage = document.getElementById("empty-message");
const cartButton = document.getElementById("cart-button");
const cartCount = document.getElementById("cart-count");
const newsletterForm = document.getElementById("newsletter-form");
const newsletterMessage = document.getElementById("newsletter-message");

// ========================================
// Utility functions
// ========================================

function formatPrice(amount) {
    return `$${amount.toFixed(2)}`;
}

// ========================================
// Render products
// ========================================

function renderProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredProducts = products.filter((product) => {
        const matchesSearch = [
            product.name,
            product.category,
            product.description
        ].some((value) => value.toLowerCase().includes(searchTerm));

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    productGrid.replaceChildren();

    emptyMessage.hidden = filteredProducts.length > 0;

    filteredProducts.forEach((product) => {
        const card = document.createElement("article");
        card.className = "product-card";

        const imageWrap = document.createElement("div");
        imageWrap.className = "product-image-wrap";

        const image = document.createElement("img");
        image.className = "product-image";
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";

        const tag = document.createElement("span");
        tag.className = "product-tag";
        tag.textContent = product.tag;
        tag.hidden = !product.tag;

        imageWrap.append(image, tag);

        const info = document.createElement("div");
        info.className = "product-info";

        const category = document.createElement("p");
        category.className = "product-category";
        category.textContent = product.category;

        const name = document.createElement("h3");
        name.className = "product-name";
        name.textContent = product.name;

        const description = document.createElement("p");
        description.className = "product-description";
        description.textContent = product.description;

        const bottom = document.createElement("div");
        bottom.className = "product-bottom";

        const price = document.createElement("span");
        price.className = "product-price";
        price.textContent = formatPrice(product.price);

        const addButton = document.createElement("button");
        addButton.className = "add-to-cart";
        addButton.type = "button";
        addButton.textContent = "Add to bag";
        addButton.setAttribute(
            "aria-label",
            `Add ${product.name} to bag`
        );

        addButton.addEventListener("click", () => {
            addToCart(product.id);
        });

        bottom.append(price, addButton);
        info.append(category, name, description, bottom);
        card.append(imageWrap, info);

        productGrid.append(card);
    });
}

// ========================================
// Shopping cart
// ========================================

function addToCart(productId) {
    const currentQuantity = cart.get(productId) || 0;

    cart.set(productId, currentQuantity + 1);

    updateCartCount();

    const product = products.find((item) => item.id === productId);

    if (product) {
        cartButton.setAttribute(
            "aria-label",
            `${getCartItemCount()} items in bag. Last added: ${product.name}`
        );
    }
}

function getCartItemCount() {
    let total = 0;

    cart.forEach((quantity) => {
        total += quantity;
    });

    return total;
}

function getCartTotal() {
    let total = 0;

    cart.forEach((quantity, productId) => {
        const product = products.find((item) => item.id === productId);

        if (product) {
            total += product.price * quantity;
        }
    });

    return total;
}

function updateCartCount() {
    cartCount.textContent = String(getCartItemCount());
}

// ========================================
// Cart summary
// ========================================

function showCart() {
    if (cart.size === 0) {
        alert("Your shopping bag is empty. Explore the collection!");
        return;
    }

    const lines = [];

    cart.forEach((quantity, productId) => {
        const product = products.find((item) => item.id === productId);

        if (product) {
            lines.push(
                `${product.name} × ${quantity} — ` +
                formatPrice(product.price * quantity)
            );
        }
    });

    lines.push("");
    lines.push(`Subtotal: ${formatPrice(getCartTotal())}`);
    lines.push("");
    lines.push("This is a training demo. No payment will be taken.");

    alert(lines.join("\n"));
}

// ========================================
// Newsletter demo
// ========================================

newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    newsletterMessage.textContent =
        "Thanks for your interest! This demo doesn't send emails.";

    newsletterForm.reset();
});

// ========================================
// Event listeners
// ========================================

searchInput.addEventListener("input", renderProducts);

categoryFilter.addEventListener("change", renderProducts);

cartButton.addEventListener("click", showCart);

// ========================================
// Initial application render
// ========================================

renderProducts();
updateCartCount();
