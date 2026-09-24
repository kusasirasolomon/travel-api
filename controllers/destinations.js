const { ObjectId } = require("mongodb");
const { getDb } = require("../db/connection");

function validateDestination(data) {
    const requiredFields = [
        "name",
        "country",
        "description",
        "bestSeason",
        "featured"
    ];

    const missingFields = requiredFields.filter(
        (field) =>
            data[field] === undefined ||
            data[field] === null ||
            data[field] === ""
    );

    return missingFields;
}

async function getAllDestinations(req, res) {
    try {
        const db = getDb();

        const destinations = await db
            .collection("destinations")
            .find()
            .toArray();

        res.status(200).json(destinations);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "An error occurred while getting destinations."
        });
    }
}

async function getDestinationById(req, res) {
    try {
        const db = getDb();

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                error: "Invalid destination ID."
            });
        }

        const destination = await db
            .collection("destinations")
            .findOne({
                _id: new ObjectId(req.params.id)
            });

        if (!destination) {
            return res.status(404).json({
                error: "Destination not found."
            });
        }

        res.status(200).json(destination);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "An error occurred while getting the destination."
        });
    }
}

async function createDestination(req, res) {
    try {
        const db = getDb();

        const missingFields = validateDestination(req.body);

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: "Missing required fields.",
                fields: missingFields
            });
        }

        const newDestination = {
            name: req.body.name,
            country: req.body.country,
            description: req.body.description,
            bestSeason: req.body.bestSeason,
            featured: req.body.featured,
            createdAt: new Date()
        };

        const result = await db
            .collection("destinations")
            .insertOne(newDestination);

        res.status(201).json({
            message: "Destination created successfully.",
            destinationId: result.insertedId
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "An error occurred while creating the destination."
        });
    }
}

async function updateDestination(req, res) {
    try {
        const db = getDb();

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                error: "Invalid destination ID."
            });
        }

        const missingFields = validateDestination(req.body);

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: "Missing required fields.",
                fields: missingFields
            });
        }

        const updatedDestination = {
            name: req.body.name,
            country: req.body.country,
            description: req.body.description,
            bestSeason: req.body.bestSeason,
            featured: req.body.featured,
            updatedAt: new Date()
        };

        const result = await db
            .collection("destinations")
            .updateOne(
                {
                    _id: new ObjectId(req.params.id)
                },
                {
                    $set: updatedDestination
                }
            );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                error: "Destination not found."
            });
        }

        res.status(200).json({
            message: "Destination updated successfully."
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "An error occurred while updating the destination."
        });
    }
}

async function deleteDestination(req, res) {
    try {
        const db = getDb();

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                error: "Invalid destination ID."
            });
        }

        const result = await db
            .collection("destinations")
            .deleteOne({
                _id: new ObjectId(req.params.id)
            });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                error: "Destination not found."
            });
        }

        res.status(200).json({
            message: "Destination deleted successfully."
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "An error occurred while deleting the destination."
        });
    }
}

module.exports = {
    getAllDestinations,
    getDestinationById,
    createDestination,
    updateDestination,
    deleteDestination
};