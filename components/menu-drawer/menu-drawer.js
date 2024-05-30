"use strict";

/**
 * @class MenuDrawer
 * @extends HTMLElement
 * @description Creates a custom element that acts as a modal (following the W3C pattern) menu drawer in the top right corner of the screen.
 * @example See menu-drawer.liquid
 */

customElements.define(
  "menu-drawer",
  class MenuDrawer extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const template = document.querySelector("#menu-drawer-template");
      const shadowRoot = this.attachShadow({ mode: "open" });

      shadowRoot.appendChild(template.content.cloneNode(true));

      // Bind this keyword for event listeners
      this.handleClick = this.handleClick.bind(this);
      this.handleKeyDown = this.handleKeyDown.bind(this);

      this.setInitialAttributes();
      this.setEventListeners();

      window.addEventListener(
        "added-product-to-cart",
        (event) => {
          event.preventDefault();
          this.addProductToCart(event);
          this.open();
        },
        false,
      );
    }

    disconnectedCallback() {
      this.removeEventListener("click", this.handleClick);
      this.removeEventListener("keydown", this.handleKeyDown);

      this.shadowRoot.querySelector("#menu-drawer-close-menu").removeEventListener("click", this.handleClick);

      this.shadowRoot.querySelectorAll(".menu-drawer-remove-item").forEach((button) => button.removeEventListener("click", this.removeLineItem.bind(this)));

      this.shadowRoot.querySelectorAll(".menu-drawer-increment-product-qty").forEach((button) => button.removeEventListener("click", this.incrementQuantity.bind(this)));

      this.shadowRoot.querySelectorAll(".menu-drawer-decrement-product-qty").forEach((button) => button.removeEventListener("click", this.decrementQuantity.bind(this)));
    }

    setInitialAttributes() {
      this.setAttribute("role", "dialog");
      this.ariaHidden = true;
    }

    setEventListeners() {
      this.shadowRoot.querySelector("#menu-drawer-close-menu").addEventListener("click", (event) => {
        event.stopPropagation();
        this.handleClick(event);
      });

      this.shadowRoot.querySelectorAll(".menu-drawer-remove-item").forEach((button) =>
        button.addEventListener("click", (event) => {
          event.preventDefault();
          this.removeLineItem(event.target);
        }),
      );

      this.shadowRoot.querySelectorAll(".menu-drawer-increment-product-qty").forEach((button) =>
        button.addEventListener("click", (event) => {
          event.preventDefault();
          this.incrementQuantity(event.target);
        }),
      );

      this.shadowRoot.querySelectorAll(".menu-drawer-decrement-product-qty").forEach((button) =>
        button.addEventListener("click", (event) => {
          event.preventDefault();
          this.decrementQuantity(event.target);
        }),
      );
    }

    /** @param {Event} event - The click event */
    handleClick(event) {
      const menuDrawer = this.shadowRoot.querySelector(".menu-drawer-line-items");
      const menuClose = this.shadowRoot.querySelector("#menu-drawer-close-menu");

      if (!menuDrawer.contains(event.target) || menuClose.contains(event.target)) {
        this.close();
      }
    }
    
    /** @param {Event} event - The Key event  */
    handleKeyDown(event) {
      if (event.key === "Escape") {
        this.ariaHidden = true;
        this.style.opacity = 0;
        this.style.visibility = "hidden";
      }
    }

    /**
     * Increments the quantity of the selected product using the Shopify Ajax API cart/update.js endpoint
     * 
     * @param {HTMLButtonElement} button - The button element intended to increase the selected product quantity
     * */
    incrementQuantity(button) {
      const variantId = button.closest(".menu-drawer-line-item-list-item").dataset.variantId;
      const input = button.closest(".menu-drawer-line-item-list-item").querySelector(".menu-drawer-product-qty");

      input.value++;

      let updates = {
        [variantId]: input.value,
      };

      fetch(`${window.Shopify.routes.root}cart/update.js`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updates }),
      })
        .then((response) => {
          if (!response.ok) {
            console.log(response);
            throw new Error("Failed to update quantity");
          }

          let subtotal = this.shadowRoot.querySelector(".menu-drawer-checkout-subtotal span");
          let subtotalValue = Number(subtotal.textContent);

          subtotalValue++;
          subtotal.textContent = subtotalValue.toString();

          return response.json();
        })
        .then((response) => {
          console.log(response);
          const totalCart = this.shadowRoot.querySelector(".menu-drawer-checkout-subtotal-price");
          totalCart.textContent = `$${new Intl.NumberFormat().format(response.items_subtotal_price / 100)}`;
        })
        .catch((error) => {
          console.error("Error updating quantity:", error);
        });
    }

     /**
     * Decrements the quantity of the selected product using the Shopify Ajax API cart/update.js endpoint
     * 
     * @param {HTMLButtonElement} button - The button element intended to decrease the selected product quantity
     * */
    decrementQuantity(button) {
      const variantId = button.closest(".menu-drawer-line-item-list-item").dataset.variantId;
      const input = button.closest(".menu-drawer-line-item-list-item").querySelector(".menu-drawer-product-qty");

      input.value--;

      let updates = {
        [variantId]: input.value,
      };

      fetch(`${window.Shopify.routes.root}cart/update.js`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updates }),
      })
        .then((response) => {
          if (!response.ok) {
            console.log(response);
            throw new Error("Failed to update quantity");
          }

          let subtotal = this.shadowRoot.querySelector(".menu-drawer-checkout-subtotal span");
          let subtotalValue = Number(subtotal.textContent);

          subtotalValue--;
          subtotal.textContent = subtotalValue;

          return response.json();
        })
        .then((response) => {
          console.log(response);
          const totalCart = this.shadowRoot.querySelector(".menu-drawer-checkout-subtotal-price");
          totalCart.textContent = `$${new Intl.NumberFormat().format(response.items_subtotal_price / 100)}`;
        })
        .catch((error) => {
          console.error("Error updating quantity:", error);
        });
    }

    /** @param {HTMLButtonElement} button - The button element intended to remove the selected product quantity*/
    removeLineItem(button) {
      const variantId = button.closest(".menu-drawer-line-item-list-item").dataset.variantId;

      const updates = {
        [variantId]: 0,
      };

      fetch(`${window.Shopify.routes.root}cart/update.js`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updates }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update quantity");
          }
          // Remove line-item in cart
          button.closest(".menu-drawer-line-item-list-item").remove();
          return response.json();
        })
        .then((response) => {
          console.log(response);
          const subtotal = this.shadowRoot.querySelector(".menu-drawer-checkout-subtotal span");
          const totalCart = this.shadowRoot.querySelector(".menu-drawer-checkout-subtotal-price");

          subtotal.textContent = response.item_count.toString();
          totalCart.textContent = `$${new Intl.NumberFormat().format(response.items_subtotal_price / 100)}`;
        })
        .catch((error) => {
          console.error("Error updating quantity:", error);
        });
    }

    /**
     *  Fetches the product data for the selected product using the Shopify Ajax API cart/add.js endpoint
     * 
     *  @param {Event} event - The click event.
     * */
    addProductToCart(event) {
      const variantId = event.detail.variantId;

      fetch(`${window.Shopify.routes.root}cart/add.js`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: 1,
          id: variantId,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Issue adding product to cart.");
          }
          return response.json();
        })
        .then((response) => {
          this.updateMenuDrawer(response);
        })
        .catch((error) => {
          console.error("Error adding product to cart:", error);
        });
    }

    /**
     * Dynamically creates a new line item in the menu-drawer when a product is added.
     * 
     * @param {Object} product - The response object from the Shopify Ajax API call
     * @param {Object} product.featured_image - The featured_image property in the response object that contains its link to the Shopify CDN and its alt text
     * @param {String} product.id - The ID of the product
     * @param {String} product.price - The current price of the product
     * @param {String} product.title - The title of the product
     * @param {String} product.url - The URL to the product
     * @param {String} product.variant_id - The current variant ID of the product
     */
    updateMenuDrawer(product) {
      const lineItemContainer = this.shadowRoot.querySelector(".menu-drawer-line-items ul");
      const existingVariantIds = Array.from(lineItemContainer.querySelectorAll("li")).map((item) => Number(item.dataset.variantId));

      if (!existingVariantIds.includes(product.variant_id)) {
        const newLineItemHTML = document.createElement("li");
        newLineItemHTML.classList.add("menu-drawer-line-item-list-item");
        newLineItemHTML.dataset.productId = product.id;
        newLineItemHTML.dataset.variantId = product.variant_id;
        newLineItemHTML.innerHTML = `
          <img
            src="${product.featured_image.url}"
            alt="${product.featured_image.alt}"
            class="menu-drawer-line-item-image"
            width="75"
            height="auto"
          >
          <div class="menu-drawer-line-item-info">
            <a class="menu-drawer-line-item-title" slot="line-item" href="${product.url}">${product.title}</a>
            <button class="menu-drawer-remove-item" aria-label="Remove ${product.title} from cart"></button>
            <div class="menu-drawer-line-item-quantity">
              <div class="menu-drawer-line-item-quantity-widget">
                <button class="menu-drawer-decrement-product-qty"></button>
                <label for="${product.title.replace(" ", "-")}" class="visually-hidden">Quantity for ${product.title}</label>
                <input id="${product.title.replace(" ", "-")}" class="menu-drawer-product-qty" value="1">
                <button class="menu-drawer-increment-product-qty"></button>
              </div>
            </div>
            <p class="menu-drawer-line-item-price">$${product.price / 100}</p>
          </div>
        `;

      lineItemContainer.appendChild(newLineItemHTML);
      }
    }

    open() {
      this.ariaHidden = false;
      this.style.opacity = 1;
      this.style.visibility = "visible";

      // W3C/WCAG compliance
      this.shadowRoot.querySelector('.menu-drawer-line-item-list-item a').focus();

      window.addEventListener("click", this.handleClick);
      window.addEventListener("keydown", this.handleKeyDown);

      // Stop event propagation when clicking inside the menu drawer
      this.shadowRoot.querySelector(".menu-drawer-line-items").addEventListener("click", function (event) {
        event.stopPropagation();
      });
    }

    close() {
      this.ariaHidden = true;
      this.style.opacity = 0;
      this.style.visibility = "hidden";

      window.removeEventListener("click", this.handleClick);
      window.removeEventListener("keydown", this.handleKeyDown);

      this.shadowRoot.querySelector(".menu-drawer-line-items").removeEventListener("click", function (event) {
        event.stopPropagation();
      });
    }
  },
);

/**
 * Custom event that is fired when a product has been added to cart.
 * 
 * @param {Event} event - The click event
 */
window.addEventListener("click", function (event) {
  if (event.target.closest("button[type='submit'][name='add']")) {
    event.preventDefault(); // Stops location from being directed to cart page

    const variantId = event.target.closest("form[action*='/cart/add']").dataset.variantid;
    const productId = event.target.closest("form[action*='/cart/add']").dataset.productid;

    /** @type {CustomEvent} */
    const addedProductToCart = new CustomEvent("added-product-to-cart", {
      bubbles: true,
      detail: {
        productId: productId,
        variantId: variantId,
      },
    });
    window.dispatchEvent(addedProductToCart);
  }
});
