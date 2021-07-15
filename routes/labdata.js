// @ts-check
const express = require("express");
const router = express.Router();
const passport = require("passport");
const labdata = require("../models/labdata");

/**
 * @swagger
 * tags:
 *   name: Lab_Data
 *   description: Other information recorded using the Lab Receipting Software
 */

/**
 * @swagger
 * /labdata/getAllLabReceipts:
 *   get:
 *     security:
 *      - JWT: []
 *     description: Returns the entire collection
 *     tags:
 *      - Lab_Data
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Full List
 */
router.get(
  "/getAllLabReceipts",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    labdata.getAllLabReceipts(function (err, result) {
      if (err) {
        res.send(err);
      } else {
        if (result.rows.length > 0) {
          res.send(JSON.stringify(result.rows));
        } else {
          res.send("[]");
        }
      }
    });
  }
);

/**
 * @swagger
 * /labdata/getAllRejectionReasons:
 *   get:
 *     security:
 *      - JWT: []
 *     description: Returns the entire collection
 *     tags:
 *      - Lab_Data
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Full List
 */
router.get(
  "/getAllRejectionReasons",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    labdata.getAllRejectionReasons(function (err, result) {
      if (err) {
        res.send(err);
      } else {
        if (result.rows.length > 0) {
          res.send(JSON.stringify(result.rows));
        } else {
          res.send("[]");
        }
      }
    });
  }
);

module.exports = router;
