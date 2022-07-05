// Client facing scripts here

//back to top
const backToTop = function () {
  $('.back-to-top').on('click', function () {
    $('html,body').animate({scrollTop: 0}, 100);
  })
}
// hide and show backTop button
$(document).scroll(function () {
  if ($(this).scrollTop() > 10) {
    $('.back-to-top').show()
  }
  if ($(this).scrollTop() <= 0) {
    $('.back-to-top').hide()
  }
})

//cartQuantity
const minusQuantity = function () {
  $('.minus').on('click', function () {
    let quantity = parseInt($('.input-text').val())
    if (quantity === 1) {
      return
    }
    quantity -= 1
    $('.input-text').val(quantity)
    let singlePrice = $('.single-price').text()
    singlePrice = Number(singlePrice.slice(1))
    $('.total-price').text((singlePrice * quantity).toFixed(2))
  })
}
const addQuantity = function () {
  $('.plus').on('click', function () {
    let quantity = parseInt($('.input-text').val())
    quantity += 1
    $('.input-text').val(quantity)
    let singlePrice = $('.single-price').text()
    singlePrice = Number(singlePrice.slice(1))
    $('.total-price').text((singlePrice * quantity).toFixed(2))
  })
}

$(document).ready(function () {
  backToTop()
  addQuantity()
  minusQuantity()
})
