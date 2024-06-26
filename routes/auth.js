const express = require('express');
const authRouter = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookie = require('cookie'); // Import the 'cookie' package to store user
const { enableCourseAfterPurchase } = require('../controller/User.Controllers');
const { addCoursesToUser } = require('../controller/Courses.controller');
const SESSION_PASSWORD = process.env.SESSION_PASSWORD;

// Registration
authRouter.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({ name, email, password: hashedPassword });

        // Save the user to the database
        await user.save();

        // Generate and send a JWT token
        const token = jwt.sign({ id: user._id }, SESSION_PASSWORD, {
            expiresIn: '1h', // Token expires in 1 hour
        });

        // res.status(201).json({
        //     token,
        //     user: { id: user._id, name: user.name, email: user.email },
        // });

        res.status(201).json({
            token,
            user,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Registration failed',
            error: error.message,
        });
    }
});

// Middleware to check if the user is already logged in
function checkLoggedIn(req, res, next) {
    // Parse cookies from the request
    const cookies = cookie.parse(req.headers.cookie || '');

    // Retrieve the 'token' cookie
    const token = cookies.token;

    if (!token) {
        return next(); // No token, proceed with login
    }
    // Verify the token
    jwt.verify(token, SESSION_PASSWORD, (err, decoded) => {
        if (err) {
            return next(); // Token is invalid, proceed with login
        }

        // res.status(200).json({ message: 'Already logged in' });
        // Do not send a response here, just call next()
        // Token is valid, user is already logged in
        req.isLoggedIn = true; // Add a flag to indicate the user is logged in
        req.userId = decoded.id; // Add user ID to request for use in other routes
        next();
    });
}
authRouter.post('/login', checkLoggedIn, async (req, res) => {
    try {
        // Check if the user is already logged in
        if (req.isLoggedIn) {
            return res.status(200).json({ message: 'Already logged in' });
            // Optionally, you can redirect or handle this case as needed
        }
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if the provided password matches the stored password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Store the token as an HttpOnly cookie on the client side
        // res.cookie("token", token, { httpOnly: true });

        // Generate and send a JWT token
        const token = jwt.sign({ id: user._id }, SESSION_PASSWORD, {
            expiresIn: '1h', // Token expires in 1 hour
        });

        // Store the token as an HttpOnly cookie on the client side
        res.cookie('token', token, { httpOnly: true });

        // Send the token to the client (optional)
        // res.json({
        //     token,
        //     user: { id: user._id, name: user.name, email: user.email },
        // });
        console.log('Logged-In successfully ✅');
        res.json({
            token,
            user,
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

// Middleware to check if the user is already logged in
function checkUserLoggedIn(req, res, next) {
    // Parse cookies from the request
    const cookies = cookie.parse(req.headers.cookie || '');

    // Retrieve the 'token' cookie
    const token = cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'User not logged in 1' });
    }

    // Verify the token
    jwt.verify(token, SESSION_PASSWORD, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'User not logged in 2' });
        }

        // Token is valid, user is already logged in
        req.userId = decoded.id;
        next();
    });
}

// Route to get all users
authRouter.get('/getAllUsers', async (req, res) => {
    try {
        // Fetch all users
        const users = await User.find({}, 'name email'); // You can specify which user properties to retrieve

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve users',
            error: error.message,
        });
    }
});

// Route to get details for a specific user
authRouter.get('/getUserDetails/:userId', checkLoggedIn, async (req, res) => {
    try {
        const userId = req.params.userId;

        // Fetch user details by userId
        const user = await User.findById(
            userId,
            'name email totalLearned role lmsPurchaseP1 lmsPurchaseP2 mindMapPurchaseP1 mindMapPurchaseP2 espPurchaseP1 espPurchaseP2 qbPurchaseP1 qbPurchaseP2 fName lName userName phone address city state country',
        ); // You can specify which user properties to retrieve

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve user details',
            error: error.message,
        });
    }
});

// Route to update a user's password
authRouter.post('/updatePassword/:userId', async (req, res) => {
    try {
        // const userId = req.userId; // Get the logged-in user's ID from the request
        const userId = req.params.userId;

        // const { currentPassword, newPassword } = req.body;
        const { data } = req.body;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the current password matches the stored password
        const passwordMatch = await bcrypt.compare(
            data.currentPassword,
            user.password,
        );

        if (!passwordMatch) {
            return res
                .status(200)
                .json({ message: 'Current password is incorrect', status: 0 });
        }

        // Hash and save the new password
        const hashedPassword = await bcrypt.hash(data.newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // Clear the token cookie (user needs to log in again with the new password)
        res.clearCookie('token');

        res.status(200).json({
            message: 'Password updated successfully',
            status: 1,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update password',
            error: error.message,
            status: 0,
        });
    }
});

// Route to delete the logged-in user's account
authRouter.post('/deleteUser', checkUserLoggedIn, async (req, res) => {
    try {
        const userId = req.userId; // Get the logged-in user's ID from the request

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the user's account
        await User.findByIdAndDelete(userId);

        // Clear the token cookie
        res.clearCookie('token');

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to delete user account',
            error: error.message,
        });
    }
});

// Route to update a user's details
authRouter.post('/updateUserDetails/:userId', async (req, res) => {
    try {
        // const userId = req.userId; // Get the logged-in user's ID from the request
        const userId = req.params.userId;

        const { formData } = req.body;
        console.log('formData', formData);

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user details
        if (formData.name) user.name = formData.name;
        if (formData.email) user.email = formData.email;
        if (formData.totalLearned) user.totalLearned = formData.totalLearned;
        if (formData.role) user.role = formData.role;
        if (formData.lms_purchase) user.lms_purchase = formData.lms_purchase;
        if (formData.mindMap_purchase)
            user.mindMap_purchase = formData.mindMap_purchase;
        if (formData.esp_purchase) user.esp_purchase = formData.esp_purchase;
        if (formData.qb_purchase) user.qb_purchase = formData.qb_purchase;
        if (formData.userName) user.userName = formData.userName;
        if (formData.phone) user.phone = formData.phone;
        if (formData.address) user.address = formData.address;
        if (formData.city) user.city = formData.city;
        if (formData.state) user.state = formData.state;
        if (formData.country) user.country = formData.country;

        await user.save();

        res.status(200).json({
            message: 'User details updated successfully',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update user details',
            error: error.message,
        });
    }
});

// Route to handle the forgot password request
authRouter.post('/forgotPassword', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        // console.log('email', email);
        // console.log('newPassword', newPassword);

        // Find the user by email
        const user = await User.findOne({ email });
        // console.log('user', user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate and send a JWT token with a short expiration time (e.g., 15 minutes)
        const token = await jwt.sign({ id: user._id }, SESSION_PASSWORD, {
            expiresIn: '15m',
        });

        // You can send this token to the user through email or some other method for security purposes

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        const updatedUser = await user.save();

        res.status(200).json({
            user: updatedUser,
            message: 'Password reset successful',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to reset password',
            error: error.message,
        });
    }
});

// Middleware function to verify the user's token
const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Retrieve the token from the 'token' cookie

    if (!token) {
        return res
            .status(401)
            .json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, SESSION_PASSWORD, (err, decoded) => {
        if (err) {
            return res
                .status(401)
                .json({ message: 'Unauthorized: Invalid token' });
        }

        // The token is valid, and you can access the user's information in `decoded`
        // console.log("decoded", decoded)
        req.userId = decoded.id;
        next();
    });
};

// Check if the user is logged in
authRouter.get('/check-login', verifyToken, (req, res) => {
    const userId = req.userId;
    User.findById(userId, 'name email').then((user) => {
        res.status(200).json({ message: 'User is logged in', user });
    });
});

//logout route
authRouter.get('/logout', checkLoggedIn, (req, res) => {
    try {
        // Check if the user is already logged out
        if (!req.isLoggedIn) {
            return res.status(200).json({ message: 'Already logged out' });
            // Optionally, you can redirect or handle this case as needed
        }

        // Clear the token cookie on the client side
        res.clearCookie('token');

        console.log('Logged-Out successfully ✅');

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({
            message: 'Logout failed',
            error: error.message,
        });
    }
});

//receive email & name from user & check is account exist from that email, if exist then return userData, otherwise create new user & return userData
authRouter.post('/google-login', async (req, res) => {
    try {
        const { email, name, jti } = req.body;

        // Check if the email is already registered
        const user = await User.findOne({ email });

        if (user) {
            // Generate and send a JWT token
            const token = jwt.sign({ id: user._id }, SESSION_PASSWORD, {
                expiresIn: '1h', // Token expires in 1 hour
            });

            // Store the token as an HttpOnly cookie on the client side
            res.cookie('token', token, { httpOnly: true });

            // Send the token to the client (optional)
            // res.json({
            //     token,
            //     user: { id: user._id, name: user.name, email: user.email },
            // });

            console.log('Logged-In successfully ✅');
            res.json({
                token,
                user,
            });
        } else {
            // Create a new user
            const user = new User({ name, email, password: jti });

            // Save the user to the database
            await user.save();

            // Generate and send a JWT token
            const token = jwt.sign({ id: user._id }, SESSION_PASSWORD, {
                expiresIn: '1h', // Token expires in 1 hour
            });

            // Store the token as an HttpOnly cookie on the client side
            res.cookie('token', token, { httpOnly: true });

            // Send the token to the client (optional)
            // res.json({
            //     token,
            //     user: { id: user._id, name: user.name, email: user.email },
            // });
            console.log('Signup successfully ✅');
            res.json({
                token,
                user,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Login failed',
            error: error.message,
        });
    }
});

authRouter.post('/enable-course', enableCourseAfterPurchase);

module.exports = authRouter;
