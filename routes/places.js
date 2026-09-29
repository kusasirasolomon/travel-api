const express = require("express");

const {
    getAllPlaces,
    getPlaceById,
    createPlace,
    updatePlace,
    deletePlace
} = require("../controllers/places");

const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.get("/", getAllPlaces);
router.get("/:id", getPlaceById);

router.post("/", authenticate, createPlace);
router.put("/:id", authenticate, updatePlace);
router.delete("/:id", authenticate, deletePlace);

module.exports = router;