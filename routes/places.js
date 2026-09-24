const express = require("express");

const {
    getAllPlaces,
    getPlaceById,
    createPlace,
    updatePlace,
    deletePlace
} = require("../controllers/places");

const router = express.Router();

router.get("/", getAllPlaces);

router.get("/:id", getPlaceById);

router.post("/", createPlace);

router.put("/:id", updatePlace);

router.delete("/:id", deletePlace);

module.exports = router;