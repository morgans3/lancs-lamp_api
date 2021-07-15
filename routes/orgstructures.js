// @ts-check
const express = require("express");
const router = express.Router();
const passport = require("passport");
const org = require("../models/orgstructures");

/**
 * @swagger
 * tags:
 *   name: OrgStructures
 *   description: Organisation Structures Functions
 */

/**
 * @swagger
 * /orgstructures/getAll:
 *   get:
 *     security:
 *      - JWT: []
 *     description: Returns the entire collection
 *     tags:
 *      - OrgStructures
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
    org.getAll(function (err, result) {
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
 * /orgstructures/register:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Registers an Item
 *     tags:
 *      - OrgStructures
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: items
 *           description: Items details.
 *           schema:
 *                type: object
 *                properties:
 *                  organisation:
 *                     type: string
 *                  area:
 *                     type: string
 *                  parent:
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
    org.addItem(item, (err, user) => {
      if (err) {
        res.json({
          success: false,
          msg: "Failed to register: " + err,
        });
      } else {
        let newrow = null;
        // @ts-ignore
        if (user.rows && user.rows.length > 0) newrow = user.rows[0];
        res.json({
          success: true,
          msg: "Registered",
          item: newrow,
        });
      }
    });
  }
);

/**
 * @swagger
 * /orgstructures/update:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Updates an Item
 *     tags:
 *      - OrgStructures
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: items
 *           description: Items details.
 *           schema:
 *                type: object
 *                properties:
 *                  id:
 *                     type: string
 *                  organisation:
 *                     type: string
 *                  area:
 *                     type: string
 *                  parent:
 *                    type: string
 *     responses:
 *       200:
 *         description: Confirmation of Item Updating
 */
router.post(
  "/update",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    const item = req.body;
    org.updateItem(item, function (err, data) {
      if (err) {
        res.json({
          success: false,
          msg: "Failed to update: " + err,
        });
      }
      res.json({
        success: true,
        msg: "Item updated",
      });
    });
  }
);

/**
 * @swagger
 * /orgstructures/remove:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Removes the Item
 *     tags:
 *      - OrgStructures
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
    org.removeItem(id, function (err, result) {
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
 * /orgstructures/getbyorg:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Provides an organisations structure elements
 *     tags:
 *      - OrgStructures
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
      org.getAllByOrg(area, function (err, result) {
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
