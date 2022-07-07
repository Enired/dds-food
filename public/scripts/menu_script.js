// Script for /menu route
// Will include click event listeners for adding to cart

(function($) {

  // Add cart button event listeners
  $(document).ready(function() {

    const $logout = $('a[href="/logout"]')[0];

    // Only add listeners if user is logged in
    if ($logout) {

      const $addToCartButtons = $('.btn.btn-warning.add-to-cart');
      for (const button of $addToCartButtons) {
        $(button).on('click', addItemToCart);
      }

      updateCartCounter();

    }
    $('.added-to-cart-notification').hide()

  });

  const addItemToCart = function() {

    const $addedToCartNotification = $(this.parentElement.parentElement.children[1]);
    const $quantity = $(this.parentElement.children[0]);

    if ($quantity.val() === '' || $quantity.val() === '0') {
      $addedToCartNotification.text('Please enter something in the cart.')
      $addedToCartNotification.slideDown()
      setTimeout(()=>$addedToCartNotification.slideUp(), 1000)
      return;
    }

    $addedToCartNotification.text('Added to Cart!')
    $addedToCartNotification.slideDown()
    setTimeout(()=>$addedToCartNotification.slideUp(), 1000)

    let cart = getCartCookie().split(',');
    let existsInCart = false;

    for (let i = 0; i < cart.length; i++) {

      let item = cart[i].split('x');

      // If item exists in cart, add to it
      if (item[1] === this.value) {
        item[0] = String(Number(item[0]) + Number($quantity.val()));
        existsInCart = true;
      }

      cart[i] = item.join('x');

    }

    // If item does not exist in cart, add to end of cart
    if (!existsInCart) {
      cart.push(`${$quantity.val()}x${this.value}`);
    }

    // If starting with 0 items in cart, remove leading '' that appears
    if (cart[0] === '') {
      cart.shift();
    }

    setCartCookie(cart.join(','));

    $quantity.val('');
    updateCartCounter();


  };

  const updateCartCounter = function() {
    const $cartCounter = $('#cart-counter-display');
    let cart = getCartCookie().split(',');
    let total = 0;
    for (let val of cart) {
      val = val.split('x');
      total += Number(val[0]);
    }
    $cartCounter.text(total);
  };

  const setCartCookie = function(cart) {
    const expires = `;expires=${new Date((new Date()).valueOf() + 2 * 24 * 60 * 60 * 1000)};`;
    const path = ';path=/';
    let cookie = `cart=${cart}`;
    document.cookie = cookie + expires + path;
  };

  const getCartCookie = function() {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      if (cookie.includes('cart=')) {
        return cookie.split('cart=')[1];
      }
    }
    return '';
  };



})(jQuery);
