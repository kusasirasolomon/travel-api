const express = require("express");

const {
    getAllDestinations,
    getDestinationById,
    createDestination,
    updateDestination,
    deleteDestination
} = require("../controllers/destinations");

const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.get("/", getAllDestinations);
router.get("/:id", getDestinationById);

router.post("/", authenticate, createDestination);
router.put("/:id", authenticate, updateDestination);
router.delete("/:id", authenticate, deleteDestination);

module.exports = router;