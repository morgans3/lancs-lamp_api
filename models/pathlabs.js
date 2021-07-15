// @ts-check
const pool = require("../config/database").pool;
const tablename = "pathlabs";

module.exports.getItemByLab = function (lab, callback) {
  const geoquery = `SELECT * FROM public.` + tablename + ` WHERE lab ='` + lab + `'`;
  pool.query(geoquery, callback);
};

module.exports.getAll = function (callback) {
  const geoquery = `SELECT * FROM public.` + tablename + `;`;
  pool.query(geoquery, callback);
};

module.exports.removeItem = function (lab, createdDT, callback) {
  const geoquery = `DELETE FROM public.` + tablename + ` WHERE lab ='` + lab + `' AND createdDT = '` + createdDT + `'`;
  pool.query(geoquery, callback);
};

module.exports.addItem = function (newItem, callback) {
  const values = [newItem.lab, newItem.namedcontact, newItem.npexcode, newItem.organisation];
  const geoquery = `INSERT INTO public.` + tablename + ` (lab, namedcontact, npexcode, organisation) VALUES ($1, $2, $3, $4) RETURNING *`;
  pool.query(geoquery, values, callback);
};

module.exports.updateItem = function (updatedItem, callback) {
  const values = [updatedItem.namedcontact, updatedItem.npexcode, updatedItem.organisation];
  const geoquery = `UPDATE public.` + tablename + ` SET namedcontact = $1, npexcode = $2, organisation = $3, "updatedDT" = CURRENT_TIMESTAMP WHERE lab ='` + updatedItem.lab + `' AND createdDT = '` + updatedItem.createdDT + `'`;
  pool.query(geoquery, values, callback);
};
