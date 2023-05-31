//create a wrapper to wrap cart-items & cart-footer
const cartPage = document.querySelector('#MainContent');
const cartFooter = cartPage.querySelector('.shopify-section.cart__footer-wrapper');

if(cartFooter) {
    const cartItems = cartFooter.previousElementSibling;
    const cartWrapper = document.createElement('div');
    cartPage.insertBefore(cartWrapper, cartItems);
    cartWrapper.appendChild(cartItems);
    cartWrapper.appendChild(cartFooter);
    cartWrapper.classList.add('main-cart-wrapper','page-width');
}
