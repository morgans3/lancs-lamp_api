// @ts-check
const pool = require("../config/database").pool;
const tablename = "healthinfo_codes";

module.exports.addResource = function (resource, callback) {
  let extravals = "";
  let extrafields = "";
  let valcount = 7;
  const values = [resource.username, resource.organisation, resource.nhsnumber, resource.occupation, resource.consentA, resource.consentB, resource.consentC];
  if (resource.email) {
    extrafields += ", email";
    extravals += ", $" + (valcount + 1).toString();
    valcount++;
    values.push(resource.email);
  }
  if (resource.phone) {
    extrafields += ", phone";
    extravals += ", $" + (valcount + 1).toString();
    valcount++;
    values.push(resource.phone);
  }
  if (resource.date_of_birth) {
    extrafields += ", date_of_birth";
    extravals += ", $" + (valcount + 1).toString();
    valcount++;
    values.push(resource.date_of_birth);
  }
  const geoquery = `INSERT INTO public.` + tablename + `(username, organisation, nhsnumber, occupation, consenta, consentb, consentc` + extrafields + `) VALUES ($1, $2, $3, $4, $5, $6, $7` + extravals + `) RETURNING *`;
  pool.query(geoquery, values, callback);
};

module.exports.updateResource = function (id, resource, callback) {
  let extrafields = "";
  if (resource.email) {
    extrafields += ", email='" + resource.email + "'";
  }
  if (resource.phone) {
    extrafields += ", phone='" + resource.phone + "'";
  }
  if (resource.date_of_birth) {
    extrafields += ", date_of_birth='" + resource.date_of_birth + "'";
  }
  const geoquery = `UPDATE public.` + tablename + ` SET nhsnumber='` + resource.nhsnumber + `', occupation='` + resource.occupation + `', consenta='` + resource.consentA + `', consentb='` + resource.consentB + `', consentc='` + resource.consentC + `'` + extrafields + ` WHERE id = '` + id + `'`;
  console.log(geoquery);
  pool.query(geoquery, callback);
};

module.exports.getByUsernameAndOrganisation = function (username, organisation, callback) {
  const geoquery = `SELECT * FROM public.` + tablename + ` WHERE username ='` + username + `' AND organisation ='` + organisation + `';`;
  pool.query(geoquery, callback);
};

module.exports.getByID = function (id, callback) {
  const geoquery = `SELECT * FROM public.` + tablename + ` WHERE id ='` + id + `';`;
  pool.query(geoquery, callback);
};

module.exports.getAll = function (callback) {
  const geoquery = `SELECT * FROM public.` + tablename + `;`;
  pool.query(geoquery, callback);
};
