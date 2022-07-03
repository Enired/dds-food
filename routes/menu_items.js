const express = require('express');
const router = express.Router();

module.exports = (db) => {
/**
 * B - GET menu_items
 * R - GET menu_items/:id
 * E - POST menu_items/:id
 * A - POST menu_items
 * D - DELETE menu_items/:id/delete
 *
 *
 *
 *
*/

  getAllMenuItems = (db) => {
    db.query(`SELECT * FROM menu_items`)
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

  getSpecificMenuItems = (db, options) => {
    //Options should have name, category
    const params = []
    let query = `
    SELECT menu_items.id
    FROM menu_items
    `;

    if(options.name){
      params.push(`%${options.name}%`);
      query += `WHERE name LIKE $${params.length} `;
    }

    if(options.category){
      params.push(`${options.category}`);
      if(params.length === 1){
        query += `WHERE menu_items.category = $${params.length} `;
      }
      else{
        query += `AND menu_items.category = $${params.length} `;
      }
    }

    db.query(query, params)
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


  router.get('/', (req, res) =>{
    getAllMenuItems(db);
  })

  router.get('/:id')

}
