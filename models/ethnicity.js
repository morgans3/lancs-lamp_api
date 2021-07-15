// @ts-check
const pool = require("../config/database").pool;
const tablename = "ethnicity";

module.exports.getAll = function (callback) {
  const geoquery = `SELECT * FROM public.` + tablename + `;`;
  pool.query(geoquery, callback);
};

module.exports.removeItem = function (ethnicity, createdDT, callback) {
  const geoquery = `DELETE FROM public.` + tablename + ` WHERE ethnicity ='` + ethnicity + `'`;
  pool.query(geoquery, callback);
};

module.exports.addItem = function (newItem, callback) {
  const values = [newItem.ethnicity, newItem.order];
  const geoquery = `INSERT INTO public.` + tablename + ` (ethnicity, "order") VALUES ($1, $2) RETURNING *`;
  pool.query(geoquery, values, callback);
};

module.exports.updateItem = function (updatedItem, callback) {
  const values = [updatedItem.order];
  const geoquery = `UPDATE public.` + tablename + ` SET "order" = $1, "updatedDT" = CURRENT_TIMESTAMP WHERE ethnicity ='` + updatedItem.ethnicity + `'`;
  pool.query(geoquery, values, callback);
};
