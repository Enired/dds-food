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
  $('.minus').each(function (index, element) {
    $(this).on('click', function () {
      // console.log(element.parentNode)
      let quantity = Number(element.parentNode.children[1].value)
      if (quantity === 1) {
        return
      }
      quantity -= 1
      element.parentNode.children[1].value = quantity
      let singlePriceFakeList = $('.single-price').text()
      singlePriceFakeList = singlePriceFakeList.slice(1)
      const singlePriceArray = singlePriceFakeList.split('$')
      const singlePrice = Number(singlePriceArray[index])
      let totalPriceFakeList = $('.total-price').text()
      totalPriceFakeList = totalPriceFakeList.slice(1)
      const totalPriceArray = singlePriceFakeList.split('$')
      const totalPrice = Number(totalPriceArray[index] * quantity)
      element.parentNode.parentNode.parentNode.nextSibling.nextSibling.innerText = `$${totalPrice.toFixed(2)}`
      updateTotalPrice()
      addTax()
      updateTopCartNum()
    })
  })
}
const addQuantity = function () {
  $('.plus').each(function (index, element) {
    $(this).on('click', function () {
      // console.log(element.parentNode)
      let quantity = Number(element.parentNode.children[1].value)
      quantity += 1
      element.parentNode.children[1].value = quantity
      let singlePriceFakeList = $('.single-price').text()
      singlePriceFakeList = singlePriceFakeList.slice(1)
      const singlePriceArray = singlePriceFakeList.split('$')
      // console.log(singlePriceArray)  //['9.00', '11.00', '20.00', '30.00', '20.00']
      const singlePrice = Number(singlePriceArray[index])
      let totalPriceFakeList = $('.total-price').text()
      totalPriceFakeList = totalPriceFakeList.slice(1)
      const totalPriceArray = singlePriceFakeList.split('$')
      const totalPrice = Number(totalPriceArray[index] * quantity)
      element.parentNode.parentNode.parentNode.nextSibling.nextSibling.innerText = `$${totalPrice.toFixed(2)}`
      updateTotalPrice()
      addTax()
      updateTopCartNum()
    })
  })
}

//top right totalPrice
const updateTotalPrice = function () {
// $('.headerTotal').text((singlePrice * quantity).toFixed(2) + '$')
  let totalPriceFakeList = $('.total-price').text()
  totalPriceFakeList = totalPriceFakeList.slice(1)
  const totalPriceArray = totalPriceFakeList.split('$')
  const totalPriceNum = sum(totalPriceArray)
  $('.headerTotal').text(Number(totalPriceNum).toFixed(2) + '$')
  $('.subTotal').text(Number(totalPriceNum).toFixed(2) + '$')
}

// add Tax
const addTax = function () {
  let subtotal = $('.subTotal').text()
  subtotal = subtotal.substr(0, subtotal.length - 1)
  $('.taxed-total').text((subtotal * 1.1).toFixed(2) + '$')
}

//update topCartNum
const updateTopCartNum = function () {
  let topCartNum = 0
  $('.qty').each(function () {
    topCartNum += Number($(this).val())
  })
  $('.topCartNum').text(topCartNum)
}

// sum helper js
function sum(arr) {
  return arr.reduce(function (prev, curr) {
    return Number(prev) + Number(curr)
  });
}

//delete cartItem
const deleteCartItem = function () {
  $('.table').on('click', '.fa-xmark', function () {
    $(this).closest('tr').remove()
    updateTotalPrice()
    updateTopCartNum()
    addTax()
  })
}

//send order
const sendOrder = function () {
  $('.submit-order').on('click', function (e) {
    const quantity =
      e.preventDefault()
    $.ajax({
      type: "POST",  // 使用post方式
      url: "/order",
      // quantity menu_item
      data: {
        quantity: 3
      },
      success: function (result) {
        if (result.resultCode === 200) {

        }
      },
      error: function (err) {
        console.log(err)
      }
    });
  })
}

$(document).ready(function () {
  backToTop()
  addQuantity()
  minusQuantity()
  updateTotalPrice()
  addTax()
  updateTopCartNum()
  deleteCartItem()
  sendOrder()
})
