// @ts-check
const express = require("express");
const router = express.Router();
const passport = require("passport");
const occupation = require("../models/occupation");
const occupation_census = require("../models/censusoccupation");
const ethnicity = require("../models/ethnicity");

/**
 * @swagger
 * tags:
 *   name: Lists
 *   description: List functions
 */

/**
 * @swagger
 * /lists/getOccupations:
 *   get:
 *     security:
 *      - JWT: []
 *     description: Returns the entire collection
 *     tags:
 *      - Lists
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Full List
 */
router.get(
  "/getOccupations",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    occupation.getAll(function (err, result) {
      if (err) {
        res.send(err);
      } else {
        if (result.rows) {
          const arraySorted = result.rows.sort((a, b) => {
            if (a.order === b.order) {
              const textA = a.occupation.toUpperCase();
              const textB = b.occupation.toUpperCase();
              return textA < textB ? -1 : textA > textB ? 1 : 0;
            } else {
              return parseInt(b.order) - parseInt(a.order);
            }
          });
          res.send(JSON.stringify(arraySorted));
        } else {
          res.send("[]");
        }
      }
    });
  }
);

/**
 * @swagger
 * /lists/getCensusOccupations:
 *   get:
 *     security:
 *      - JWT: []
 *     description: Returns the entire collection
 *     tags:
 *      - Lists
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Full List
 */
router.get(
  "/getCensusOccupations",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    occupation_census.getAll(function (err, result) {
      if (err) {
        res.send(err);
      } else {
        if (result.rows) {
          const arraySorted = result.rows.sort((a, b) => {
            if (a.order === b.order) {
              const textA = a.occupation.toUpperCase();
              const textB = b.occupation.toUpperCase();
              return textA < textB ? -1 : textA > textB ? 1 : 0;
            } else {
              return parseInt(b.order) - parseInt(a.order);
            }
          });
          res.send(JSON.stringify(arraySorted));
        } else {
          res.send("[]");
        }
      }
    });
  }
);

/**
 * @swagger
 * /lists/getEthnicities:
 *   get:
 *     security:
 *      - JWT: []
 *     description: Returns the entire collection
 *     tags:
 *      - Lists
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Full List
 */
router.get(
  "/getEthnicities",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    ethnicity.getAll(function (err, result) {
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
 * /lists/register_ethnicity:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Registers an Item
 *     tags:
 *      - Lists
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: ethnicity
 *           description: Ethnicity item.
 *           schema:
 *                type: object
 *                properties:
 *                  ethnicity:
 *                     type: string
 *                  createdDT:
 *                     type: string
 *                  order:
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
  "/register_ethnicity",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const item = req.body;
    ethnicity.addItem(item, (err, user) => {
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
 * /lists/register_occupation:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Registers an Item
 *     tags:
 *      - Lists
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: occupation
 *           description: Ethnicity item.
 *           schema:
 *                type: object
 *                properties:
 *                  occupation:
 *                     type: string
 *                  createdDT:
 *                     type: string
 *                  order:
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
  "/register_occupation",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const item = req.body;
    occupation.addItem(item, (err, user) => {
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
 * /lists/register_census_occupation:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Registers an Item
 *     tags:
 *      - Lists
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: occupation
 *           description: Ethnicity item.
 *           schema:
 *                type: object
 *                properties:
 *                  occupation:
 *                     type: string
 *                  createdDT:
 *                     type: string
 *                  order:
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
  "/register_census_occupation",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const item = req.body;
    occupation_census.addItem(item, (err, user) => {
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
 * /lists/update_occupation:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Updates an Item
 *     tags:
 *      - Lists
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: occupation
 *           description: Occupation Item details.
 *           schema:
 *                type: object
 *                properties:
 *                  occupation:
 *                     type: string
 *                  createdDT:
 *                     type: string
 *                  order:
 *                    type: string
 *     responses:
 *       200:
 *         description: Confirmation of Item Updating
 */
router.post(
  "/update_occupation",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    const item = req.body;
    occupation.updateItem(item, function (err, data) {
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
 * /lists/update_census_occupation:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Updates an Item
 *     tags:
 *      - Lists
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: occupation
 *           description: Occupation Item details.
 *           schema:
 *                type: object
 *                properties:
 *                  occupation:
 *                     type: string
 *                  createdDT:
 *                     type: string
 *                  order:
 *                    type: string
 *     responses:
 *       200:
 *         description: Confirmation of Item Updating
 */
router.post(
  "/update_census_occupation",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    const item = req.body;
    occupation_census.updateItem(item, function (err, data) {
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
 * /lists/update_ethnicity:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Updates an Item
 *     tags:
 *      - Lists
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: ethnicity
 *           description: Ethnicity item details.
 *           schema:
 *                type: object
 *                properties:
 *                  ethnicity:
 *                     type: string
 *                  createdDT:
 *                     type: string
 *                  order:
 *                    type: string
 *     responses:
 *       200:
 *         description: Confirmation of Item Updating
 */
router.post(
  "/update_ethnicity",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    const item = req.body;
    ethnicity.updateItem(item, function (err, data) {
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
 * /lists/remove_ethnicity:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Removes the Item
 *     tags:
 *      - Lists
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: ethnicity
 *           description: Ethnicity Item details.
 *           schema:
 *                type: object
 *                properties:
 *                  ethnicity:
 *                     type: string
 *                  createdDT:
 *                     type: string
 *     responses:
 *       200:
 *         description: Full List
 */
router.post(
  "/remove_ethnicity",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const key = req.body.ethnicity;
    const createdDT = req.body.createdDT;
    ethnicity.removeItem(key, createdDT, function (err, result) {
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
 * /lists/remove_occupation:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Removes the Item
 *     tags:
 *      - Lists
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: occupation
 *           description: Occupation Item details.
 *           schema:
 *                type: object
 *                properties:
 *                  occupation:
 *                     type: string
 *                  createdDT:
 *                     type: string
 *     responses:
 *       200:
 *         description: Full List
 */
router.post(
  "/remove_occupation",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const key = req.body.occupation;
    const createdDT = req.body.createdDT;
    occupation.removeItem(key, createdDT, function (err, result) {
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
 * /lists/remove_census_occupation:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Removes the Item
 *     tags:
 *      - Lists
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: occupation
 *           description: Occupation Item details.
 *           schema:
 *                type: object
 *                properties:
 *                  occupation:
 *                     type: string
 *                  createdDT:
 *                     type: string
 *     responses:
 *       200:
 *         description: Full List
 */
router.post(
  "/remove_census_occupation",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const key = req.body.occupation;
    const createdDT = req.body.createdDT;
    occupation_census.removeItem(key, createdDT, function (err, result) {
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

module.exports = router;
