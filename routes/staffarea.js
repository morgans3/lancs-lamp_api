// @ts-check
const express = require("express");
const router = express.Router();
const passport = require("passport");
const staffarea = require("../models/staffarea");

/**
 * @swagger
 * tags:
 *   name: StaffAreas
 *   description: Organisational Staff information Functions
 */

/**
 * @swagger
 * /staffarea/getAll:
 *   get:
 *     security:
 *      - JWT: []
 *     description: Returns the entire collection
 *     tags:
 *      - StaffAreas
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
    staffarea.getAll(function (err, result) {
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
 * /staffarea/register:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Registers an Item
 *     tags:
 *      - StaffAreas
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: items
 *           description: Items details.
 *           schema:
 *                type: object
 *                properties:
 *                  nhsnumber:
 *                     type: string
 *                  organisation:
 *                     type: string
 *                  username:
 *                     type: string
 *                  areaid:
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
    staffarea.addItem(item, (err, user) => {
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
 * /staffarea/update:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Updates an Item
 *     tags:
 *      - StaffAreas
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
 *                  nhsnumber:
 *                     type: string
 *                  organisation:
 *                     type: string
 *                  username:
 *                     type: string
 *                  areaid:
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
    staffarea.updateItem(item, function (err, data) {
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
 * /staffarea/remove:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Removes the Item
 *     tags:
 *      - StaffAreas
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
    staffarea.removeItem(id, function (err, result) {
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
 * /staffarea/getbyorg:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Provides an organisations structure elements
 *     tags:
 *      - StaffAreas
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
      staffarea.getAllByOrg(area, function (err, result) {
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

/**
 * @swagger
 * /staffarea/getbyarea:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Provides an organisations structure elements
 *     tags:
 *      - StaffAreas
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: items
 *           description: item details.
 *           schema:
 *                type: object
 *                properties:
 *                  areaid:
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
  "/getbyarea",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const area = req.body.areaid;
    res.type("application/json");
    if (area === undefined || area === null) {
      res.status(400).json({ success: false, msg: "Incorrect Parameters" });
    } else {
      staffarea.getAllByArea(area, function (err, result) {
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

/**
 * @swagger
 * /staffarea/getbynhsnumber:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Provides an organisations structure elements
 *     tags:
 *      - StaffAreas
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: items
 *           description: item details.
 *           schema:
 *                type: object
 *                properties:
 *                  nhsnumber:
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
  "/getbynhsnumber",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const nhsnumber = req.body.nhsnumber;
    res.type("application/json");
    if (nhsnumber === undefined || nhsnumber === null) {
      res.status(400).json({ success: false, msg: "Incorrect Parameters" });
    } else {
      staffarea.getPersonsAreaInformation(nhsnumber, function (err, result) {
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
