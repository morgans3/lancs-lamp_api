// @ts-check
const pool = require("../config/database").pool;
const tablename = "staffarea";

module.exports.getAll = function (callback) {
  const geoquery = `SELECT * FROM public.` + tablename + `;`;
  pool.query(geoquery, callback);
};

module.exports.getAllByOrg = function (org, callback) {
  const geoquery = `SELECT * FROM public.` + tablename + ` WHERE organisation='` + org + `';`;
  pool.query(geoquery, callback);
};

module.exports.getAllByArea = function (areaid, callback) {
  const geoquery = `SELECT * FROM public.` + tablename + ` WHERE areaid='` + areaid + `';`;
  pool.query(geoquery, callback);
};

module.exports.getPersonsAreaInformation = function (nhsnumber, callback) {
  const geoquery = `SELECT areas.*, structs.area, structs.parent FROM public.` + tablename + ` AS areas LEFT OUTER JOIN public.orgstructures AS structs ON structs.id = areas.areaid WHERE areas.nhsnumber='` + nhsnumber + `';`;
  pool.query(geoquery, callback);
};

module.exports.removeItem = function (id, callback) {
  const geoquery = `DELETE FROM public.` + tablename + ` WHERE id ='` + id + `'`;
  pool.query(geoquery, callback);
};

module.exports.addItem = function (newItem, callback) {
  const values = [newItem.nhsnumber, newItem.username, newItem.organisation, newItem.areaid];
  const geoquery = `INSERT INTO public.` + tablename + ` (nhsnumber, username, organisation, areaid) VALUES ($1, $2, $3, $4) RETURNING *`;
  pool.query(geoquery, values, callback);
};

module.exports.updateItem = function (updatedItem, callback) {
  const values = [updatedItem.nhsnumber, updatedItem.username, updatedItem.organisation, updatedItem.areaid];
  const geoquery = `UPDATE public.` + tablename + ` SET nhsnumber= $1, username= $2, organisation= $3, areaid= $4, "updatedDT" = CURRENT_TIMESTAMP WHERE id ='` + updatedItem.id + `'`;
  pool.query(geoquery, values, callback);
};
