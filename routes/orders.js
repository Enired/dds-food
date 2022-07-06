const e = require('express');
const express = require('express');
const router = express.Router();


//Getting Order Total
getOrderTotal = (db, orderId) => {
  const queryParams = [orderId]
  const query =
  `
  SELECT SUM(menu_items.price * order_items.quantity)/100 as subtotal
  FROM order_items
  JOIN menu_items on menu_items.id = order_items.menu_item
  JOIN orders on orders.id = order_items.order_id
  WHERE orders.id = $1;
  `
  return db.query(query, queryParams)
}

//Getting Order Specific to User
getOrder = (db, customerId) => {
  const queryParams = [customerId];
  const query =
  `
  SELECT orders.id
  FROM orders
  JOIN users ON users.id = orders.customer_ID
  WHERE orders.customer_Id = $1
  `
  return db.query(query, queryParams)

}

//Getting all open orders
getOpenOrders = (db) => {
  const query =
  `
  SELECT orders.id
  FROM orders
  JOIN users ON users.id = orders.customer_ID
  WHERE orders.completed_at IS null
  `
  return db.query(query)

}


//Getting Oder Items of An Order
getOrderDetails = (db, orderId) => {
  const queryParams = [orderId];
  const query =
  `
  SELECT  orders.id as order_Id, orders.created_at,menu_items.name, order_items.quantity, menu_items.image_url,
	(SELECT SUM(menu_items.price * order_items.quantity)/100 as order_total
  FROM order_items
  JOIN menu_items on menu_items.id = order_items.menu_item
  JOIN orders on orders.id = order_items.order_id
  WHERE orders.id = $1)
  FROM orders
  JOIN order_items on orders.id = order_items.order_id
  JOIN menu_items on menu_items.id = order_items.menu_item
  WHERE orders.id = $1;
  `
  return db.query(query, queryParams)
}

module.exports = (db) => {
  router.get("/",
    (req, res) => {

      let p1;
      let pageToRender;

      const customerId = req.session.uid
      const is_owner = req.session.is_owner
      if(is_owner){
        p1 = getOpenOrders(db)
        pageToRender = "owners"
      }
      else{
        p1 = getOrder(db, customerId)
        pageToRender = "orders"
      }

      Promise.resolve(p1)
      .then(results => {orderIds = results.rows; return orderIds})
      .then(results=>{
        findingOrderItems = []
        for(value of results){
          id = value.id
          findingOrderItems.push(getOrderDetails(db,id))
        }
        return findingOrderItems;
      })
      .then(results => {
        Promise.all(results).then(values => {
          orderIds = []
          orderItems = []
          for(value of values){
            for(row of value.rows){
              if(!orderIds.includes(row.order_id)){
                orderIds.push(row.order_id);
              }
            }
            orderItems.push(value.rows)
          }
          const templateVars = {orderIds,orderItems}
          return templateVars
        })
        .then((templateVars)=>{res.render(pageToRender, {templateVars, user: req.session})})
      })
    })
  return router;
}

  /////////////////////
  // PSEUDOCODE JUNK //
  /////////////////////
  ////////original code for cart
  // const templateVars = {};
  // getOrder(db, 2)
  // .then((data) => {templateVars.orderId = data.rows[0].id})
  // .then(()=>{
  //   getOrderItems(db, templateVars.orderId)
  //   .then((data)=>{templateVars.orderItems = data.rows})
  //   .then(()=>{
  //     getOrderTotal(db, templateVars.orderId)
  //     .then((data) => {templateVars.orderTotal = data.rows[0]})
  //     .then(()=>{console.log(templateVars.orderItems[0].image_url)})
  //     .then(()=>{
  //       res.render("orders", {templateVars});})
  //   })
  // })
// So I want the adding to cart button to add an order item to a new order
/*

need a new order button?!!!?!?!?!?!?!?!?!?!?!?!?
              when the user goes to the menu page a new order is created

the current order will always be the last one in the database with a matching customer id
each click on an add to cart button will add the item to the order_items db with the current order ID

when the user goed to the cart page the last order that has the same customer_id will be shown
  this is a joined table between orders and order_items on orders.id = order_items.id


total will be calculated based on the order_items table
   OR OR OR
          create a new table selecting quantity * price as item total



          /// Select (menu_items.price * order_items.quantity)/100 as subtotal
from order_items
join menu_items on menu_items.id = order_items.menu_item
join orders on orders.id = order_items.order_id
where orders.id = 1;



/////////////////////// FINDING SUBTOTAL FOR SPECIFIC ORDER
Select SUM(menu_items.price * order_items.quantity)/100 as subtotal
from order_items
join menu_items on menu_items.id = order_items.menu_item
join orders on orders.id = order_items.order_id
where orders.id = 1;


////////// FINDING ITEMS AND QUANTITY CORRESPONDING TO SPECIFIC ORDER

select  orders.id, menu_items.name, order_items.quantity
from orders
join order_items on orders.id = order_items.order_id
join menu_items on menu_items.id = order_items.menu_item
where orders.id = 2;


//////////SELECT A CUSTOMER LAST ORDER
select * from orders where orders.customer_id = 2 order by orders.created_at desc limit 1;

/////////ADDING A NEW ORDER TO THE DATABASE
INSERT INTO orders(customer_id) values (5);


////  GETTING ALL ORDERS IN PROGRESS
select * from orders where orders.completed_at is null;



// Setting Orders completed value
UPDATE orders SET completed_at = now() where orders.id = 2;

//Setting orders accepted value
UPDATE orders SET accepted_at = now() where orders.id = 2;

//
SELECT users.id from users where users.email = 'octane@legends.com'
;





*/


