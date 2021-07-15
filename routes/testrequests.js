// @ts-check

const express = require("express");
const router = express.Router();
const passport = require("passport");
const testrequests = require("../models/testrequests");

/**
 * @swagger
 * tags:
 *   name: TestRequests
 *   description: Storage system for Lancs LAMP Test Requests
 */

/**
 * @swagger
 * /testrequests/getAll:
 *   get:
 *     security:
 *      - JWT: []
 *     description: Returns the collection
 *     tags:
 *      - TestRequests
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
    testrequests.getAll(function (err, result) {
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
 * /testrequests/getMyTests:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Returns all Tests requested by a Staff member
 *     tags:
 *      - TestRequests
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: resource
 *           description: Trained Staff
 *           schema:
 *                type: object
 *                properties:
 *                  username:
 *                     type: string
 *                  organisation:
 *                     type: string
 *     responses:
 *       200:
 *         description: Confirmation of Requests
 *       400:
 *         description: Bad Request, server doesn't understand input
 *       401:
 *         description: Unauthorised
 *       409:
 *         description: Conflict with something in Database
 *       500:
 *         description: Server Error Processing Result
 */
router.post(
  "/getMyTests",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const item = req.body;
    let newItem = {
      username: item.username,
      organisation: item.organisation,
    };

    testrequests.getByUsername(newItem.username, (err, result) => {
      if (err) {
        res.json({
          success: false,
          data: null,
        });
      } else {
        if (result.rows.length > 0) {
          res.json({
            success: true,
            data: result.rows,
          });
        } else {
          res.json({
            success: true,
            data: [],
          });
        }
      }
    });
  }
);

/**
 * @swagger
 * /testrequests/getTestsByNHSNumber:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Returns all Tests requested by a Staff member
 *     tags:
 *      - TestRequests
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: resource
 *           description: Staff
 *           schema:
 *                type: object
 *                properties:
 *                  nhsnumber:
 *                     type: string
 *     responses:
 *       200:
 *         description: Confirmation of Requests
 *       400:
 *         description: Bad Request, server doesn't understand input
 *       401:
 *         description: Unauthorised
 *       409:
 *         description: Conflict with something in Database
 *       500:
 *         description: Server Error Processing Result
 */
router.post(
  "/getTestsByNHSNumber",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const item = req.body;
    testrequests.getByNHSNumber(item.nhsnumber, (err, result) => {
      if (err) {
        res.json({
          success: false,
          data: null,
        });
      } else {
        if (result.rows.length > 0) {
          res.json({
            success: true,
            data: result.rows,
          });
        } else {
          res.json({
            success: true,
            data: [],
          });
        }
      }
    });
  }
);

module.exports = router;
