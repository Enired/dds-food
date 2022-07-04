const { Template } = require('ejs');
const express = require('express');
const router = express.Router();

module.exports = (db) => {
  getAllMenuItems = (db, res) => {
    db.query(`
    SELECT *
    FROM menu_items
    ORDER BY CASE
      WHEN menu_items.category = 'Appetizer' THEN 1
      WHEN menu_items.category = 'Main' THEN 2
      WHEN menu_items.category = 'Dessert' THEN 3
      WHEN menu_items.category = 'Drink' THEN 4
      END ASC`
      )
      .then((data)=>{
        const menuItems = data.rows;
        console.log(menuItems.length)
        const vars = {menuItems}
        res.render('index', vars);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ error: err.message });
        })
      }

  getMenuItemsCategory = (db, res, category) => {
    const queryParams = [category]
    db.query(
      `
      SELECT *
      FROM menu_items
      WHERE menu_items.category = $1
      `, queryParams
    )
    .then((data)=>{
      const menuItems = data.rows;
      const vars = {menuItems}
      res.render('index', vars);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: err.message });
      })
  }

  router.get('/category/:category', (req, res) => {
    getMenuItemsCategory(db, res, req.params.category);
  })

  router.get('/', (req, res) =>{
    getAllMenuItems(db, res);
  })

  return router;
}
/////////////////////////
// IGNORE THIS FOR NOW //
/////////////////////////



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
