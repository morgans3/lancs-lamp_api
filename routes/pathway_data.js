// @ts-check

const express = require("express");
const router = express.Router();
const passport = require("passport");
const PathwayData = require("../models/pathway_data");
const CombinedResults = require("../models/combinedresults");

/**
 * @swagger
 * tags:
 *   name: PathwayData
 *   description: System for Pathway Results and data
 */

/**
 * @swagger
 * /pathwaydata/getByOccupation:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Returns the positive collection
 *     tags:
 *      - PathwayData
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: result
 *           description: Result details.
 *           schema:
 *                type: object
 *                properties:
 *                  occupation:
 *                     type: string
 *                  limit:
 *                      type: string
 *     responses:
 *       200:
 *         description: Result Details
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorised
 *       500:
 *         description: Server Error Processing
 */
router.post(
  "/getByOccupation",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const occupation = req.body.occupation;
    const limit = req.body.limit || "25000";
    res.type("application/json");
    if (occupation === undefined || occupation === null) {
      res.status(400).json({ success: false, msg: "Incorrect Parameters" });
    } else {
      PathwayData.getByOccupation(occupation, limit, function (err, result) {
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
  }
);

/**
 * @swagger
 * /pathwaydata/getPositives:
 *   get:
 *     security:
 *      - JWT: []
 *     description: Returns the positive collection
 *     tags:
 *      - PathwayData
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Full List
 */
router.get(
  "/getPositives",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    PathwayData.getPositives(function (err, result) {
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
 * /pathwaydata/getAll:
 *   get:
 *     security:
 *      - JWT: []
 *     description: Returns the positive collection
 *     tags:
 *      - PathwayData
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Full List
 */
router.get(
  "/getAll",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    PathwayData.getAll(function (err, result) {
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
 * /pathwaydata/getByOccupationAndTime:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Returns the positive collection
 *     tags:
 *      - PathwayData
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: result
 *           description: Result details.
 *           schema:
 *                type: object
 *                properties:
 *                  occupation:
 *                     type: string
 *                  limit:
 *                      type: string
 *                  startdate:
 *                     type: string
 *                  enddate:
 *                      type: string
 *     responses:
 *       200:
 *         description: Result Details
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorised
 *       500:
 *         description: Server Error Processing
 */
router.post(
  "/getByOccupationAndTime",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const occupation = req.body.occupation;
    const limit = req.body.limit || "25000";
    const startdate = req.body.startdate || null;
    const enddate = req.body.enddate || null;
    res.type("application/json");
    if (occupation === undefined || occupation === null || startdate === null || enddate === null) {
      res.status(400).json({ success: false, msg: "Incorrect Parameters" });
    } else {
      const auth = req.headers["authorization"];
      CombinedResults.getByOccupation(occupation, limit, startdate, enddate, auth, function (err, result) {
        if (err) {
          res.send(err);
        } else {
          if (result.length > 0) {
            res.send(JSON.stringify(result));
          } else {
            res.send("[]");
          }
        }
      });
    }
  }
);

module.exports = router;
