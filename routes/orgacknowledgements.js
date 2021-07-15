// @ts-check
const express = require("express");
const router = express.Router();
const passport = require("passport");
const orgacknowledgements = require("../models/orgacknowledgements");

/**
 * @swagger
 * tags:
 *   name: Org_Acknowledgements
 *   description: Organisational Acknowledgement of Results that have been actioned
 */

/**
 * @swagger
 * /orgacknowledgements/getAll:
 *   get:
 *     security:
 *      - JWT: []
 *     description: Returns the entire collection
 *     tags:
 *      - Org_Acknowledgements
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
    orgacknowledgements.getAll(function (err, result) {
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
 * /orgacknowledgements/register:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Registers an Item
 *     tags:
 *      - Org_Acknowledgements
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: items
 *           description: Items details.
 *           schema:
 *                type: object
 *                properties:
 *                  barcode_value:
 *                     type: string
 *                  organisation:
 *                     type: string
 *                  username:
 *                     type: string
 *                  displayname:
 *                    type: string
 *                  nhsnumber:
 *                    type: string
 *     responses:
 *       200:
 *         description: Confirmation of Item Registration
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
  "/register",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const item = req.body;
    orgacknowledgements.addItem(item, (err, user) => {
      if (err) {
        res.json({
          success: false,
          msg: "Failed to register: " + err,
        });
      } else {
        res.json({
          success: true,
          msg: "Registered",
        });
      }
    });
  }
);

/**
 * @swagger
 * /orgacknowledgements/remove:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Removes the Item
 *     tags:
 *      - Org_Acknowledgements
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: item
 *           description: Item details.
 *           schema:
 *                type: object
 *                properties:
 *                  id:
 *                     type: string
 *     responses:
 *       200:
 *         description: Full List
 */
router.post(
  "/remove",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const id = req.body.id;
    orgacknowledgements.removeItem(id, function (err, result) {
      if (err) {
        res.json({
          success: false,
          msg: "Failed to remove: " + err,
        });
      } else {
        res.json({
          success: true,
          msg: "Item removed",
        });
      }
    });
  }
);

/**
 * @swagger
 * /orgacknowledgements/getbyorg:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Provides an organisations structure elements
 *     tags:
 *      - Org_Acknowledgements
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: items
 *           description: item details.
 *           schema:
 *                type: object
 *                properties:
 *                  org:
 *                     type: string
 *     responses:
 *       200:
 *         description: Patient Details
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorised
 *       500:
 *         description: Server Error Processing
 */
router.post(
  "/getbyorg",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const area = req.body.org;
    res.type("application/json");
    if (area === undefined || area === null) {
      res.status(400).json({ success: false, msg: "Incorrect Parameters" });
    } else {
      orgacknowledgements.getAllByOrg(area, function (err, result) {
        if (err) {
          res.status(400).send(err);
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

module.exports = router;
