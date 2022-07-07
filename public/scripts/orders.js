const addTaxToSubtotal = (subtotal) => {
  const total = Math.floor(subtotal * 1.10).toFixed(2);
  return total;
};

const showTotalWithTax = () => {
  $('.order-total').each(function() {
    const subtotal = Number($(this).text());
    const totalWithTax = addTaxToSubtotal(subtotal);
    $(this).text(totalWithTax);
  }

  );


};
$(document).ready(function() {
  showTotalWithTax();
});
