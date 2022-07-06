const sendETAlert = (time) =>{
  if(time===0){
    return alert('Please enter a time greater than 0')}
  else{

    return console.log(`About ${time} min until your order is ready`)
  }

}

const test = () =>{

  $('.send-time-estimate').each(function(_, element){
    $(this).on('click', function(){
     let time = element.parentNode.children[0].value
     sendETAlert(Number(time));

    })
  })
  $('.order-complete').each(function(_, element){
    $(this).on('click', function(event){
      console.log('You\'re order is ready. Please come to pick it up.')
    })
  })
}

$(document).ready(function () {
  test();
})
