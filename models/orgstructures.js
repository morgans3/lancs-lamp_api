// @ts-check
const pool = require("../config/database").pool;
const tablename = "orgstructures";

module.exports.getAll = function (callback) {
  const geoquery = `SELECT * FROM public.` + tablename + `;`;
  pool.query(geoquery, callback);
};

module.exports.getAllByOrg = function (org, callback) {
  const geoquery = `SELECT * FROM public.` + tablename + ` WHERE organisation='` + org + `';`;
  pool.query(geoquery, callback);
};

module.exports.removeItem = function (id, callback) {
  const geoquery = `DELETE FROM public.` + tablename + ` WHERE id ='` + id + `'`;
  pool.query(geoquery, callback);
};

module.exports.addItem = function (newItem, callback) {
  const values = [newItem.organisation, newItem.parent, newItem.area];
  const geoquery = `INSERT INTO public.` + tablename + ` (organisation, parent, area) VALUES ($1, $2, $3) RETURNING *`;
  pool.query(geoquery, values, callback);
};

module.exports.updateItem = function (updatedItem, callback) {
  const values = [updatedItem.organisation, updatedItem.parent, updatedItem.area];
  const geoquery = `UPDATE public.` + tablename + ` SET organisation= $1, parent= $2, area= $3, "updatedDT" = CURRENT_TIMESTAMP WHERE id ='` + updatedItem.id + `'`;
  pool.query(geoquery, values, callback);
};
