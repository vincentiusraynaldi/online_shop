import { Router } from "express";
import passport from "passport";
import { cartRouter } from "./cartRouter";
import { wishlistRouter } from "./wishlistRouter";
import { addressRouter } from "./addressRouter";
import { orderRouter } from "./orderRouter";

import { userController } from "../controller/userController";

const router = Router({mergeParams: true});

const authenticateJWT = passport.authenticate('jwt', { session: false });

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication and profile management
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or email already in use
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/register", userController.registerUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Logged in, returns JWT and user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/login", userController.loginUser);

/**
 * @swagger
 * /users/google/verify:
 *   post:
 *     summary: Login or register using a Google ID token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [credential]
 *             properties:
 *               credential:
 *                 type: string
 *                 description: Google ID token from the frontend
 *     responses:
 *       200:
 *         description: Existing user logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       201:
 *         description: New user created
 *       400:
 *         description: credential is missing
 *       500:
 *         description: Authentication failed
 */
router.post("/google/verify", userController.verifyGoogleToken);

/**
 * @swagger
 * /users/logout:
 *   get:
 *     summary: Logout the current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out
 *       401:
 *         description: Unauthorized
 */
router.get("/logout", authenticateJWT, userController.logoutUser);

/**
 * @swagger
 * /users/editprofile:
 *   put:
 *     summary: Edit the current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditProfileRequest'
 *     responses:
 *       200:
 *         description: Updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put("/editprofile", authenticateJWT, userController.editUserProfile);

/**
 * @swagger
 * /users/password:
 *   put:
 *     summary: Change the current user's password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password changed
 *       400:
 *         description: Wrong current password or passwords don't match
 *       401:
 *         description: Unauthorized
 */
router.put("/password", authenticateJWT, userController.changePassword);

/**
 * @swagger
 * /users/email:
 *   put:
 *     summary: Change the current user's email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangeEmailRequest'
 *     responses:
 *       200:
 *         description: Email changed
 *       400:
 *         description: Wrong password
 *       401:
 *         description: Unauthorized
 */
router.put("/email", authenticateJWT, userController.changeEmail);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get the current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", authenticateJWT, userController.getUserProfile);

/**
 * @swagger
 * /users/delete:
 *   delete:
 *     summary: Delete the current user and related data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted
 *       401:
 *         description: Unauthorized
 */
router.delete("/delete", authenticateJWT, userController.deleteUser);


// !!
// !! cart routes !!
// !!
router.use("/carts", cartRouter);

// !!
// !! wishlist routes !!
// !!
router.use("/wishlists", wishlistRouter);

// !!
// !! address routes !!
// !!
router.use("/addresses", addressRouter);

// !!
// !! order routes !!
// !!
router.use("/orders", orderRouter);

export const userRouter = router;