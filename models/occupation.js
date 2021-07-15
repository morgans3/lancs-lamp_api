// @ts-check
const pool = require("../config/database").pool;
const tablename = "occupations";

module.exports.getAll = function (callback) {
  const geoquery = `SELECT * FROM public.` + tablename + `;`;
  pool.query(geoquery, callback);
};

module.exports.removeItem = function (occupation, createdDT, callback) {
  const geoquery = `DELETE FROM public.` + tablename + ` WHERE occupation ='` + occupation + `'`;
  pool.query(geoquery, callback);
};

module.exports.addItem = function (newItem, callback) {
  const values = [newItem.occupation, newItem.order];
  const geoquery = `INSERT INTO public.` + tablename + ` (occupation, "order") VALUES ($1, $2) RETURNING *`;
  pool.query(geoquery, values, callback);
};

module.exports.updateItem = function (updatedItem, callback) {
  const values = [updatedItem.order];
  const geoquery = `UPDATE public.` + tablename + ` SET "order" = $1, "updatedDT" = CURRENT_TIMESTAMP WHERE occupation ='` + updatedItem.occupation + `'`;
  pool.query(geoquery, values, callback);
};
