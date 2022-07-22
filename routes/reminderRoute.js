const express = require("express");
const router = express.Router();
const reminderController = require("../controllers/reminder_controller.js");
const passport = require("../middleware/passport");
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");

// http://localhost:8000/reminder/
router.get("/new", ensureAuthenticated, reminderController.new);

// Individual reminder, visible to the user
router.get("/:id",  ensureAuthenticated, reminderController.listOne);

// User clicks edit
router.get("/:id/edit", ensureAuthenticated, reminderController.edit);

// Receives the post req, USER IS SENDING THE DATA
router.post("/", ensureAuthenticated,  reminderController.create);

// User sends post update
router.post("/update/:id", ensureAuthenticated, reminderController.update);

router.post("/delete/:id", ensureAuthenticated, reminderController.delete);

module.exports = router;