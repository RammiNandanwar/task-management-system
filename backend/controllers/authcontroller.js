const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ================================
// REGISTER USER
// ================================

exports.register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role
        } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                error: "Name, email and password are required"
            });
        }

        // Validate role if provided
        if (
            role &&
            !["applicant", "recruiter"].includes(role)
        ) {
            return res.status(400).json({
                error: "Invalid role"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            email
        });

        if (existingUser) {
            return res.status(400).json({
                error: "User with this email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "applicant"
        });

        res.status(201).json({
            message: "User registered successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


// ================================
// LOGIN USER
// ================================

exports.login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        // Compare password
        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "3d"
            }
        );

        res.status(200).json({
            message: "Login successful",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },

            token
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


// ================================
// GET CURRENT LOGGED-IN USER
// ================================

exports.getMe = async (req, res) => {
    try {
        const user = await User
            .findById(req.user.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};