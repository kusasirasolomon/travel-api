const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDb } = require("../db/connection");

async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                error: "Username, email, and password are required."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: "Password must be at least 6 characters."
            });
        }

        const db = getDb();
        const users = db.collection("users");

        const existingUser = await users.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(400).json({
                error: "A user with that email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            username,
            email: email.toLowerCase(),
            password: hashedPassword,
            createdAt: new Date()
        };

        const result = await users.insertOne(newUser);

        res.status(201).json({
            message: "User registered successfully.",
            userId: result.insertedId
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "An error occurred while registering the user."
        });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required."
            });
        }

        const db = getDb();

        const user = await db.collection("users").findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password."
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                error: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                username: user.username,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.status(200).json({
            message: "Login successful.",
            token
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "An error occurred while logging in."
        });
    }
}

async function logout(req, res) {
    try {
        res.status(200).json({
            message: "Logout successful. Remove the JWT token from the client."
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "An error occurred while logging out."
        });
    }
}

module.exports = {
    register,
    login,
    logout
};