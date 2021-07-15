// @ts-check
const express = require("express");
const router = express.Router();
const passport = require("passport");
const testcentres = require("../models/testcentre");

/**
 * @swagger
 * tags:
 *   name: TestCentre
 *   description: Test Centre functions
 */

/**
 * @swagger
 * /testcentre/getAll:
 *   get:
 *     security:
 *      - JWT: []
 *     description: Returns the entire collection
 *     tags:
 *      - TestCentre
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
    testcentres.getAll(function (err, result) {
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
);

/**
 * @swagger
 * /testcentre/register:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Registers an Item
 *     tags:
 *      - TestCentre
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: testcentre
 *           description: Test centre details.
 *           schema:
 *                type: object
 *                properties:
 *                  testcentre:
 *                     type: string
 *                  createdDT:
 *                     type: string
 *                  opening:
 *                    type: string
 *                  closing:
 *                    type: string
 *                  owner:
 *                    type: string
 *                  pathlab:
 *                    type: string
 *                  location:
 *                      type: object
 *                      properties:
 *                          name:
 *                            type: string
 *                          addressline1:
 *                            type: string
 *                          addressline2:
 *                            type: string
 *                          addressline3:
 *                            type: string
 *                          addressline4:
 *                            type: string
 *                          addressline5:
 *                            type: string
 *                          postcode:
 *                            type: string
 *                          lat:
 *                            type: number
 *                          lng:
 *                            type: number
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
    if (item.testcentre) {
      let newItem = {
        testcentre: item.testcentre,
        createdDT: item.createdDT || new Date(),
        opening: item.opening || null,
        closing: item.closing || null,
        owner: item.owner || null,
        location: null,
        node: item.node || null,
        pathlab: item.pathlab || null,
      };

      if (item.location) {
        newItem.location = JSON.stringify(item.location);
      }
      testcentres.addItem(newItem, (err, user) => {
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
    } else {
      res.status(400).json({
        success: false,
        msg: "Bad request, minimum required dataset not included",
      });
    }
  }
);

/**
 * @swagger
 * /testcentre/update:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Updates an Item
 *     tags:
 *      - TestCentre
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: testcentre
 *           description: Test centre details.
 *           schema:
 *                type: object
 *                properties:
 *                  testcentre:
 *                     type: string
 *                  createdDT:
 *                     type: string
 *                  opening:
 *                    type: string
 *                  closing:
 *                    type: string
 *                  owner:
 *                    type: string
 *                  pathlab:
 *                    type: string
 *                  location:
 *                      type: object
 *                      properties:
 *                          name:
 *                            type: string
 *                          addressline1:
 *                            type: string
 *                          addressline2:
 *                            type: string
 *                          addressline3:
 *                            type: string
 *                          addressline4:
 *                            type: string
 *                          addressline5:
 *                            type: string
 *                          postcode:
 *                            type: string
 *                          lat:
 *                            type: number
 *                          lng:
 *                            type: number
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
    if (item.testcentre) {
      let newItem = {
        testcentre: item.testcentre,
        createdDT: item.createdDT || new Date(),
        opening: item.opening || null,
        closing: item.closing || null,
        owner: item.owner || null,
        location: null,
        node: item.node || null,
        pathlab: item.pathlab || null,
      };

      if (item.location) {
        newItem.location = JSON.stringify(item.location);
      }

      testcentres.updateItem(newItem, function (err, data) {
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
    } else {
      res.status(400).json({
        success: false,
        msg: "Bad request, minimum required dataset not included",
      });
    }
  }
);

/**
 * @swagger
 * /testcentre/remove:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Removes the Item
 *     tags:
 *      - TestCentre
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: testcentre
 *           description: Test Centre details.
 *           schema:
 *                type: object
 *                properties:
 *                  testcentre:
 *                     type: string
 *                  createdDT:
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
    const testcentre = req.body.testcentre;
    const createdDT = req.body.createdDT;
    testcentres.removeItem(testcentre, createdDT, function (err, result) {
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
 * /testcentre/gettestcentre:
 *   post:
 *     security:
 *      - JWT: []
 *     description: Provides a single Test Centre's details
 *     tags:
 *      - TestCentre
 *     produces:
 *      - application/json
 *     parameters:
 *         - in: body
 *           name: testcentre
 *           description: Test centre details.
 *           schema:
 *                type: object
 *                properties:
 *                  testcentre:
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
  "/gettestcentre",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    const testcentre = req.body.testcentre;
    res.type("application/json");
    if (testcentre === undefined || testcentre === null) {
      res.status(400).json({ success: false, msg: "Incorrect Parameters" });
    } else {
      testcentres.getByTestCentre(testcentre, function (err, result) {
        if (err) {
          res.status(400).send(err);
        } else {
          if (result.length > 0) {
            res.send(JSON.stringify(result[0]));
          } else {
            res.send("{}");
          }
        }
      });
    }
  }
);

/**
 * @swagger
 * /testcentre/getOpenTestCentres:
 *   get:
 *     security:
 *      - JWT: []
 *     description: Returns the entire collection
 *     tags:
 *      - TestCentre
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Full List
 */
router.get(
  "/getOpenTestCentres",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res, next) => {
    testcentres.getOpenTestCentres(function (err, result) {
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
);

module.exports = router;
