const { ObjectId } = require("mongodb");
const { getDb } = require("../db/connection");

function validatePlace(data) {
    const requiredFields = [
        "name",
        "description",
        "category",
        "country",
        "city",
        "address",
        "website",
        "phone",
        "priceRange"
    ];

    const missingFields = requiredFields.filter(
        (field) =>
            data[field] === undefined ||
            data[field] === null ||
            data[field] === ""
    );

    return missingFields;
}

async function getAllPlaces(req, res) {
    try {
        const db = getDb();

        const places = await db.collection("places").find().toArray();

        res.status(200).json(places);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "An error occurred while getting places."
        });
    }
}

async function getPlaceById(req, res) {
    try {
        const db = getDb();

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                error: "Invalid place ID."
            });
        }

        const place = await db.collection("places").findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!place) {
            return res.status(404).json({
                error: "Place not found."
            });
        }

        res.status(200).json(place);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "An error occurred while getting the place."
        });
    }
}

async function createPlace(req, res) {
    try {
        const db = getDb();

        const missingFields = validatePlace(req.body);

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: "Missing required fields.",
                fields: missingFields
            });
        }

        const newPlace = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            country: req.body.country,
            city: req.body.city,
            address: req.body.address,
            website: req.body.website,
            phone: req.body.phone,
            priceRange: req.body.priceRange,
            createdAt: new Date()
        };

        const result = await db.collection("places").insertOne(newPlace);

        res.status(201).json({
            message: "Place created successfully.",
            placeId: result.insertedId
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "An error occurred while creating the place."
        });
    }
}

async function updatePlace(req, res) {
    try {
        const db = getDb();

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                error: "Invalid place ID."
            });
        }

        const missingFields = validatePlace(req.body);

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: "Missing required fields.",
                fields: missingFields
            });
        }

        const updatedPlace = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            country: req.body.country,
            city: req.body.city,
            address: req.body.address,
            website: req.body.website,
            phone: req.body.phone,
            priceRange: req.body.priceRange,
            updatedAt: new Date()
        };

        const result = await db.collection("places").updateOne(
            {
                _id: new ObjectId(req.params.id)
            },
            {
                $set: updatedPlace
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                error: "Place not found."
            });
        }

        res.status(200).json({
            message: "Place updated successfully."
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "An error occurred while updating the place."
        });
    }
}

async function deletePlace(req, res) {
    try {
        const db = getDb();

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                error: "Invalid place ID."
            });
        }

        const result = await db.collection("places").deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                error: "Place not found."
            });
        }

        res.status(200).json({
            message: "Place deleted successfully."
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "An error occurred while deleting the place."
        });
    }
}

module.exports = {
    getAllPlaces,
    getPlaceById,
    createPlace,
    updatePlace,
    deletePlace
};