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

$(document).ready(function () {
  backToTop()
})
