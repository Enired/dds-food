const { Template } = require('ejs');
const express = require('express');
const router = express.Router();

module.exports = (db) => {

  let vars = {}
  getAllMenuItems = (db, res) => {
    // ALL ITEMS QUERY
    db.query(`
    SELECT *
    FROM menu_items
    ORDER BY CASE
      WHEN menu_items.category = 'Appetizer' THEN 1
      WHEN menu_items.category = 'Main' THEN 2
      WHEN menu_items.category = 'Dessert' THEN 3
      WHEN menu_items.category = 'Drink' THEN 4
      END ASC, menu_items.name`
      )
    .then((data)=>{
      const menuItems = data.rows;
      vars.menuItems = menuItems
    })
    .then(()=>{
      vars.appetizers = [];
      vars.mains = [];
      vars.desserts = [];
      vars.drinks = [];
      for(item of vars.menuItems){
        switch (item.category) {
          case 'Appetizer':
            vars.appetizers.push(item);
            break;
          case 'Main':
            vars.mains.push(item);
            break;
          case 'Dessert':
            vars.desserts.push(item);
            break;
          case 'Drink':
            vars.drinks.push(item);
            break;
          default:
            break;
        }
      }
    })
    //FINAL RENDER
    .then(()=>{
      res.render('index', {menuItems: vars.menuItems, drinks : vars.drinks, appetizers : vars.appetizers, mains : vars.mains, desserts: vars.desserts})
    }
    )
    .catch((err) => {
      res
        .status(500)
        .json({ error: err.message });
      })
    }

    router.get('/', (req, res) =>{
    getAllMenuItems(db, res);
  })

  return router;
}
/////////////////////////
// IGNORE THIS FOR NOW //
/////////////////////////

  // getMenuItemsCategory = (db, res, category) => {
  //   const queryParams = [category]
  //   db.query(
  //     `
  //     SELECT *
  //     FROM menu_items
  //     WHERE menu_items.category = $1
  //     `,
  //     queryParams
  //   )

  //   .then((data)=>{
  //     const menuItems = data.rows;
  //     const vars = {menuItems}
  //     res.render('index', vars);
  //   })
  //   .catch((err) => {
  //     res
  //       .status(500)
  //       .json({ error: err.message });
  //     })
  // }

  // router.get('/category/:category', (req, res) => {
  //   getMenuItemsCategory(db, res, req.params.category);
  // })



// getSpecificMenuItems = (db, options, res) => {
//   //Options should have name, category
//   const params = []
//   let query = `
//   SELECT menu_items.id
//   FROM menu_items
//   `;

//   if(options.name){
//     params.push(`%${options.name}%`);
//     query += `WHERE name LIKE $${params.length} `;
//   }

//   if(options.category){
//     params.push(`${options.category}`);
//     if(params.length === 1){
//       query += `WHERE menu_items.category = $${params.length} `;
//     }
//     else{
//       query += `AND menu_items.category = $${params.length} `;
//     }
//   }

//   db.query(query, params)
//     .then((data)=>{
//       const menuItems = data.rows;
//       res.json({menuItems});
//     })
//     .catch((err) => {
//       res
//         .status(500)
//         .json({ error: err.message });
//     })
// }
// router.get('/:id')
