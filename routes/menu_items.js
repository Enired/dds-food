const express = require('express');
const router = express.Router();

module.exports = (db) => {
  getAllMenuItems = (db, res) => {
    db.query(`SELECT * FROM menu_items ORDER BY menu_items.category`)
      .then((data)=>{
        const menuItems = data.rows;
        menuItems.forEach(item=>{console.log(item.id)})
        res.json({menuItems});
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
      res.json({menuItems});
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
