const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");

const { connectToDatabase } = require("./db/connection");

const placesRoutes = require("./routes/places");
const destinationsRoutes = require("./routes/destinations");

const swaggerDocument = require("./swagger.json");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Travel API is running"
    });
});

app.use("/places", placesRoutes);

app.use("/destinations", destinationsRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectToDatabase();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Swagger documentation: http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();