// Script for /menu route
// Will include click event listeners for adding to cart

(function ($) {
  // Add cart button event listeners
  $(document).ready(function () {
    backToTop()
    const $logout = $('a[href="/logout"]')[0];

    // Only add listeners if user is logged in
    if ($logout) {

      const $addToCartButtons = $('.btn.btn-warning.add-to-cart');
      for (const button of $addToCartButtons) {
        $(button).on('click', addItemToCart);
      }

      updateCartCounter();
      sidebarTrigger()
    }
  });

  //back top button
  const backToTop = function () {
    $('.back-to-top').on('click', function () {
      $('html,body').animate({scrollTop: 0}, 100);
    });
  };
// hide and show backTop button
  $(document).scroll(function () {
    if ($(this).scrollTop() > 10) {
      $('.back-to-top').show();
    }
    if ($(this).scrollTop() <= 0) {
      $('.back-to-top').hide();
    }
  });


  // sidebar trigger
  const sidebarTrigger = function () {
    $('#sidebarTrigger').on('click', function (e) {
      const tbody = $('.sideBarTbody')
      $.get("/sideBarCarts", function (result) {
        if (tbody.children().length > 0) {
          tbody.empty()
        }
        let subtotal = 0
        for (const item of result) {
          subtotal += Number(item.price / 100) * Number(item.quantity)
          const $tr = $(
            ` <tr>
                    <td style='vertical-align: middle; text-align: center'>${item.name}</td>
                    <td style='vertical-align: middle;text-align: center'>$${(item.price / 100).toFixed(2)}</td>
                    <td style='vertical-align: middle;text-align: center'>
                    <input type="number" disabled class="ps-5" value="${item.quantity}" min="1" max="100" step="1"/>
                    </td>
              </tr>
             `
          )
          tbody.append($tr)
        }
        //  show Total

        $('.subTotal').text(`$${subtotal.toFixed(2)}`)
        $('.taxed-total').text(`$${(subtotal * 1.1).toFixed(2)}`)
      })
    })
  }


  const addItemToCart = function () {
    const $quantity = $(this.parentElement.children[0]);
    if ($quantity.val() === '' || $quantity.val() === '0') {
      return;
    }

    console.log(getCartCookie());
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

    cart = cart.join(',');
    updateCartCookie(cart);

    $quantity.val('');
    updateCartCounter();

  };

  const updateCartCounter = function () {
    const $cartCounter = $('#cart-counter-display');
    let cart = getCartCookie().split(',');
    let total = 0;
    for (let val of cart) {
      val = val.split('x');
      total += Number(val[0]);
    }
    $cartCounter.text(total);
  };

  const updateCartCookie = function (cart) {
    const expires = `;expires=${new Date((new Date()).valueOf() + 2 * 24 * 60 * 60 * 1000)};`;
    const path = ';path=/';
    let cookie = `cart=${cart}`;
    document.cookie = cookie + expires + path;
  };

  const getCartCookie = function () {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      if (cookie.includes('cart=')) {
        return cookie.split('cart=')[1];
      }
    }
    return '';
  };

})(jQuery);
