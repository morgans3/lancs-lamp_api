// @ts-check
const pool = require("../config/database").pool;
const tablename = "pathway_data_collected";

const joinedtables = `SELECT pd.*, pw.name AS pathwayname, sc.consentsharing AS consent, hi.username as registeredusername FROM public.pathway_data_collected AS pd
LEFT OUTER JOIN public.pathways AS pw ON pd.pathwayid = pw.id
LEFT OUTER JOIN public.staffconsent AS sc ON pd.nhs_number = sc.nhsnumber
LEFT OUTER JOIN public.healthinfo_codes AS hi ON pd.nhs_number = hi.nhsnumber`;

module.exports.getAll = function (callback) {
  const geoquery = `SELECT * FROM public.` + tablename + `;`;
  pool.query(geoquery, callback);
};

module.exports.getByID = function (id, callback) {
  const geoquery = `SELECT * FROM public.` + tablename + ` WHERE id = '` + id + `';`;
  pool.query(geoquery, callback);
};

module.exports.getPositives = function (callback) {
  const geoquery = joinedtables + ` WHERE result = 'POSITIVE';`;
  pool.query(geoquery, callback);
};

module.exports.getByOccupation = function (occupation, limit, callback) {
  const geoquery = joinedtables + ` WHERE pd.occupation = '` + occupation + `' ORDER BY pd."requestedDT" DESC LIMIT ` + limit.toString() + `;`;
  pool.query(geoquery, callback);
};
