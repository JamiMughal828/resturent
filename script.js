/* =========================
   VARIABLES
========================= */

let cart = JSON.parse(localStorage.getItem("foodieCart")) || [];

let wishlist =
    JSON.parse(localStorage.getItem("foodieWishlist")) || [];

let currentCategory = "all";

let discountPercent = 0;

const deliveryFee = 150;

const taxPercent = 5;


/* =========================
   ELEMENTS
========================= */

const menuToggle =
    document.getElementById("menuToggle");

const navLinks =
    document.getElementById("navLinks");

const cartButton =
    document.getElementById("cartButton");

const cartPopup =
    document.getElementById("cartPopup");

const closePopup =
    document.getElementById("closePopup");

const cartItems =
    document.getElementById("cartItems");

const popupCartItems =
    document.getElementById("popupCartItems");

const cartCount =
    document.getElementById("cartCount");

const cartItemsText =
    document.getElementById("cartItemsText");

const cartTotal =
    document.getElementById("cartTotal");

const popupTotal =
    document.getElementById("popupTotal");

const searchInput =
    document.getElementById("searchInput");


/* =========================
   MOBILE MENU
========================= */

menuToggle.addEventListener("click", () => {

    navLinks.classList.toggle("show");

});


document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("show");

    });

});


/* =========================
   DARK MODE
========================= */

const darkMode =
    document.getElementById("darkMode");


if (localStorage.getItem("foodieDark") === "true") {

    document.body.classList.add("dark");

    darkMode.textContent = "☀️";

}


darkMode.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const isDark =
        document.body.classList.contains("dark");

    localStorage.setItem("foodieDark", isDark);

    darkMode.textContent =
        isDark ? "☀️" : "🌙";

});


/* =========================
   FILTER
========================= */

const filterButtons =
    document.querySelectorAll(".filter-btn");


filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        currentCategory =
            button.dataset.category;

        filterProducts();

    });

});


/* =========================
   SEARCH
========================= */

searchInput.addEventListener("input", () => {

    filterProducts();

});


function filterProducts() {

    const search =
        searchInput.value.toLowerCase().trim();

    document.querySelectorAll(".food-card").forEach(card => {

        const category =
            card.dataset.category;

        const name =
            card.dataset.name.toLowerCase();

        const categoryMatch =
            currentCategory === "all" ||
            category === currentCategory;

        const searchMatch =
            name.includes(search);

        if (categoryMatch && searchMatch) {

            card.classList.remove("hide");

        } else {

            card.classList.add("hide");

        }

    });

}


/* =========================
   ADD TO CART
========================= */

document.querySelectorAll(".add-btn").forEach(button => {

    button.addEventListener("click", event => {

        event.stopPropagation();

        const name =
            button.dataset.name;

        const price =
            Number(button.dataset.price);

        addToCart(name, price);

    });

});


function addToCart(name, price) {

    const existing =
        cart.find(item => item.name === name);

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            name: name,
            price: price,
            quantity: 1

        });

    }

    saveCart();

    updateCart();

    animateCart();

}


/* =========================
   CART STORAGE
========================= */

function saveCart() {

    localStorage.setItem(
        "foodieCart",
        JSON.stringify(cart)
    );

}


/* =========================
   UPDATE CART
========================= */

function updateCart() {

    let quantity = 0;

    cart.forEach(item => {

        quantity += item.quantity;

    });


    cartCount.textContent = quantity;

    cartItemsText.textContent =
        `${quantity} ${quantity === 1 ? "Item" : "Items"}`;


    renderCart();

    updateBill();

    updatePopupCart();

}


/* =========================
   RENDER CART
========================= */

function renderCart() {

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <span>🛒</span>

                <h4>Your cart is empty</h4>

                <p>
                    Add some delicious food first.
                </p>

            </div>

        `;

        return;

    }


    cartItems.innerHTML = "";


    cart.forEach((item, index) => {

        const element =
            document.createElement("div");

        element.className = "cart-item";

        element.innerHTML = `

            <div>

                <h4>${item.name}</h4>

                <p>
                    Rs. ${item.price.toLocaleString()}
                </p>

            </div>

            <div class="quantity">

                <button onclick="decreaseQuantity(${index})">
                    −
                </button>

                <strong>
                    ${item.quantity}
                </strong>

                <button onclick="increaseQuantity(${index})">
                    +
                </button>

            </div>

            <button
                class="remove-item"
                onclick="removeItem(${index})"
            >
                Remove
            </button>

        `;

        cartItems.appendChild(element);

    });

}


/* =========================
   QUANTITY
========================= */

function increaseQuantity(index) {

    cart[index].quantity++;

    saveCart();

    updateCart();

}


function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }

    saveCart();

    updateCart();

}


function removeItem(index) {

    cart.splice(index, 1);

    saveCart();

    updateCart();

}


/* =========================
   BILL
========================= */

function updateBill() {

    let subtotal = 0;

    cart.forEach(item => {

        subtotal +=
            item.price * item.quantity;

    });


    const delivery =
        subtotal > 0 ? deliveryFee : 0;


    const tax =
        subtotal * taxPercent / 100;


    const discount =
        subtotal * discountPercent / 100;


    const total =
        subtotal +
        delivery +
        tax -
        discount;


    document.getElementById("subtotal").textContent =
        `Rs. ${subtotal.toLocaleString()}`;

    document.getElementById("delivery").textContent =
        `Rs. ${delivery.toLocaleString()}`;

    document.getElementById("tax").textContent =
        `Rs. ${Math.round(tax).toLocaleString()}`;

    document.getElementById("discount").textContent =
        `- Rs. ${Math.round(discount).toLocaleString()}`;

    cartTotal.textContent =
        `Rs. ${Math.round(total).toLocaleString()}`;

}


/* =========================
   COUPON
========================= */

const couponBtn =
    document.getElementById("couponBtn");

const couponInput =
    document.getElementById("couponInput");

const couponMessage =
    document.getElementById("couponMessage");


couponBtn.addEventListener("click", () => {

    const code =
        couponInput.value.trim().toUpperCase();


    if (code === "FOOD10") {

        discountPercent = 10;

        couponMessage.textContent =
            "✓ 10% discount applied!";

        couponMessage.style.color =
            "#25a244";

        updateBill();

    } else if (code === "") {

        couponMessage.textContent =
            "Enter a coupon code.";

        couponMessage.style.color =
            "#e33";

    } else {

        discountPercent = 0;

        couponMessage.textContent =
            "Invalid coupon code.";

        couponMessage.style.color =
            "#e33";

        updateBill();

    }

});


/* =========================
   CART POPUP
========================= */

cartButton.addEventListener("click", () => {

    updatePopupCart();

    cartPopup.classList.add("show");

});


closePopup.addEventListener("click", () => {

    cartPopup.classList.remove("show");

});


cartPopup.addEventListener("click", event => {

    if (event.target === cartPopup) {

        cartPopup.classList.remove("show");

    }

});


function updatePopupCart() {

    if (cart.length === 0) {

        popupCartItems.innerHTML = `

            <div class="empty-cart">

                <span>🛒</span>

                <h4>Your cart is empty</h4>

            </div>

        `;

        popupTotal.textContent =
            "Rs. 0";

        return;

    }


    popupCartItems.innerHTML = "";

    let total = 0;


    cart.forEach(item => {

        total +=
            item.price * item.quantity;


        const element =
            document.createElement("div");

        element.className =
            "cart-item";

        element.innerHTML = `

            <div>

                <h4>${item.name}</h4>

                <p>
                    ${item.quantity} ×
                    Rs. ${item.price.toLocaleString()}
                </p>

            </div>

            <strong>
                Rs. ${(item.price * item.quantity).toLocaleString()}
            </strong>

        `;

        popupCartItems.appendChild(element);

    });


    popupTotal.textContent =
        `Rs. ${total.toLocaleString()}`;

}


/* =========================
   CART ANIMATION
========================= */

function animateCart() {

    cartButton.animate(

        [
            {
                transform: "scale(1)"
            },

            {
                transform: "scale(1.18)"
            },

            {
                transform: "scale(1)"
            }

        ],

        {
            duration: 350
        }

    );

}


/* =========================
   PRODUCT POPUP
========================= */

const productPopup =
    document.getElementById("productPopup");

const closeProductPopup =
    document.getElementById("closeProductPopup");

const popupProductImage =
    document.getElementById("popupProductImage");

const popupProductName =
    document.getElementById("popupProductName");

const popupProductCategory =
    document.getElementById("popupProductCategory");

const popupProductPrice =
    document.getElementById("popupProductPrice");

const popupAddBtn =
    document.getElementById("popupAddBtn");


let selectedProduct = null;


document.querySelectorAll(".food-card").forEach(card => {

    card.addEventListener("click", event => {

        if (
            event.target.classList.contains("add-btn") ||
            event.target.classList.contains("wishlist")
        ) {

            return;

        }


        const image =
            card.querySelector("img").src;

        const name =
            card.dataset.name;

        const category =
            card.dataset.category;

        const priceText =
            card.querySelector(".food-bottom strong").textContent;

        const price =
            Number(
                priceText.replace("Rs. ","").replace(",","")
            );


        selectedProduct = {

            name: name,
            price: price

        };


        popupProductImage.src =
            image;

        popupProductName.textContent =
            name;

        popupProductCategory.textContent =
            category;

        popupProductPrice.textContent =
            `Rs. ${price.toLocaleString()}`;


        productPopup.classList.add("show");

    });

});


closeProductPopup.addEventListener("click", () => {

    productPopup.classList.remove("show");

});


productPopup.addEventListener("click", event => {

    if (event.target === productPopup) {

        productPopup.classList.remove("show");

    }

});


popupAddBtn.addEventListener("click", () => {

    if (!selectedProduct) return;

    addToCart(
        selectedProduct.name,
        selectedProduct.price
    );

    productPopup.classList.remove("show");

});


/* =========================
   WISHLIST
========================= */

document.querySelectorAll(".wishlist").forEach(button => {

    const name =
        button.dataset.name;


    if (wishlist.includes(name)) {

        button.classList.add("active");

        button.textContent = "♥";

    }


    button.addEventListener("click", event => {

        event.stopPropagation();

        const index =
            wishlist.indexOf(name);


        if (index === -1) {

            wishlist.push(name);

            button.classList.add("active");

            button.textContent = "♥";

        } else {

            wishlist.splice(index, 1);

            button.classList.remove("active");

            button.textContent = "♡";

        }


        localStorage.setItem(
            "foodieWishlist",
            JSON.stringify(wishlist)
        );

    });

});


/* =========================
   ORDER FORM
========================= */

const orderForm =
    document.getElementById("orderForm");

const successMessage =
    document.getElementById("successMessage");


orderForm.addEventListener("submit", event => {

    event.preventDefault();


    if (cart.length === 0) {

        alert(
            "Please add at least one food item to your cart."
        );

        return;

    }


    const name =
        document.getElementById("name").value;

    const phone =
        document.getElementById("phone").value;

    const address =
        document.getElementById("address").value;

    const payment =
        document.getElementById("payment").value;


    console.log({

        customer: name,
        phone: phone,
        address: address,
        payment: payment,
        order: cart

    });


    successMessage.classList.add("show");


    /* Activate preparing step */

    setTimeout(() => {

        document
            .querySelectorAll(".track-step")[1]
            .classList.add("active");

    }, 1000);


    /* Activate delivery step */

    setTimeout(() => {

        document
            .querySelectorAll(".track-step")[2]
            .classList.add("active");

    }, 3000);


    orderForm.reset();


    cart = [];

    discountPercent = 0;

    couponInput.value = "";

    couponMessage.textContent = "";

    saveCart();

    updateCart();


    setTimeout(() => {

        successMessage.classList.remove("show");

    }, 5000);

});


/* =========================
   INITIAL LOAD
========================= */

updateCart();

filterProducts();