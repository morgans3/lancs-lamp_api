// @ts-check

const express = require("express");
const router = express.Router();
const passport = require("passport");
const PathwayResults = require("../models/results");

/**
 * @swagger
 * tags:
 *   name: Results
 *   description: Storage system for Pathway Results
 */

/**
 * @swagger
 * /results/update:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Updates the Database
 *     tags:
 *      - Results
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: result
 *           description: Result details.
 *           schema:
 *                type: object
 *                properties:
 *                  barcode:
 *                     type: string
 *                  result:
 *                     type: string
 *                  reason:
 *                     type: string
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
  "/update",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const barcode = req.body.barcode;
    const result = req.body.result;
    const reason = req.body.reason || null;
    res.type("application/json");
    if ((barcode === undefined || barcode === null) && (result === undefined || result === null)) {
      res.status(400).json({ success: false, msg: "Incorrect Parameters" });
    } else {
      PathwayResults.updateInformation(barcode, result, function (err, result) {
        if (err) {
          console.error("Problem updating barcode: " + barcode + ". Error: " + err);
          res.status(400).send(err);
        } else {
          if (result.rows.length > 0) {
            console.log("Barcode: " + barcode + " updated successfully.");
            const token = req.headers.authorization;
            PathwayResults.broadcastResult(result.rows[0], reason, token, (e, d) => {
              if (e) {
                console.error("Problem notifying results for barcode: " + barcode + ". Error: " + e);
                res.status(400).send(e);
              } else {
                res.send(JSON.stringify(d));
              }
            });
          } else {
            console.log("Barcode: " + barcode + " is not in the database so can not be updated.");
            res.json("No barcode to update");
          }
        }
      });
    }
  }
);

/**
 * @swagger
 * /results/processrejections:
 *   get:
 *     security:
 *      - JWT: []
 *     description: Processes all the recent rejections
 *     tags:
 *      - Results
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Rejections Processed
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorised
 *       500:
 *         description: Server Error Processing
 */
router.get(
  "/processrejections",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    res.type("application/json");
    PathwayResults.getRejections((dberror, dbresult) => {
      if (dberror) {
        console.error("Problem fetching rejections from DB. Error: " + dberror);
        res.status(400).send(dberror);
      } else {
        if (dbresult.rows.length > 0) {
          const results = [];
          dbresult.rows.forEach((reject) => {
            const barcode = reject.barcode_value;
            const result = reject.status;
            const reason = reject.reason;
            PathwayResults.updateInformation(barcode, result, function (err, result) {
              if (err) {
                console.error("Problem updating barcode: " + barcode + ". Error: " + err);
                PathwayResults.reportIssue(barcode, err, (e, r) => {
                  if (e) console.error(e);
                });
                results.push({ success: false, barcode: barcode, error: err });
                if (results.length === dbresult.rows.length) {
                  res.status(200).json({ success: true, rejections: dbresult.rows.length, report: results });
                }
              } else {
                if (result.rows.length > 0) {
                  const token = req.headers.authorization;
                  PathwayResults.broadcastResult(result.rows[0], reason, token, (e, d) => {
                    if (e) {
                      console.error("Problem notifying results for barcode: " + barcode + ". Error: " + e);
                      PathwayResults.reportIssue(barcode, e, (e, r) => {
                        if (e) console.error(e);
                      });
                      results.push({ success: false, barcode: barcode, error: e });
                      if (results.length === dbresult.rows.length) {
                        res.status(200).json({ success: true, rejections: dbresult.rows.length, report: results });
                      }
                    } else {
                      PathwayResults.updateRejection(barcode, (rejerror, rej) => {
                        if (rejerror) {
                          console.error("Problem recording the rejection for barcode: " + barcode + ". Error: " + rejerror);
                          PathwayResults.reportIssue(barcode, rejerror, (e, r) => {
                            if (e) console.error(e);
                          });
                          results.push({ success: false, barcode: barcode, error: e });
                          if (results.length === dbresult.rows.length) {
                            res.status(200).json({ success: true, rejections: dbresult.rows.length, report: results });
                          }
                        } else {
                          results.push({ success: true, barcode: barcode, result: d });
                          console.log("Barcode: " + barcode + " updated successfully.");
                          if (results.length === dbresult.rows.length) {
                            res.status(200).json({ success: true, rejections: dbresult.rows.length, report: results });
                          }
                        }
                      });
                    }
                  });
                } else {
                  console.log("Barcode: " + barcode + " is not in the database so can not be updated.");
                  PathwayResults.reportIssue(barcode, "No barcode to update", (e, r) => {
                    if (e) console.error(e);
                  });
                  results.push({ success: false, barcode: barcode, error: "No barcode to update" });
                  if (results.length === dbresult.rows.length) {
                    res.status(200).json({ success: true, rejections: dbresult.rows.length, report: results });
                  }
                }
              }
            });
          });
          // res.status(200).json({ success: true, rejections: dbresult.rows.length });
        } else {
          res.status(200).json({ success: true, rejections: 0 });
        }
      }
    });
  }
);

module.exports = router;
