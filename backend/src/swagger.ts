import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Shop API",
            version: "1.0.0",
            description: "API documentation for the shop backend",
        },
        servers: [{ url: "http://localhost:4000" }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "b1f6c0a2-1234-4abc-9def-0123456789ab" },
                        email: { type: "string", format: "email", example: "john@example.com" },
                        firstName: { type: "string", example: "John" },
                        lastName: { type: "string", example: "Doe" },
                        isGoogle: { type: "boolean", example: false },
                    },
                },
                AuthResponse: {
                    type: "object",
                    properties: {
                        token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6..." },
                        id: { type: "string" },
                        user: { $ref: "#/components/schemas/User" },
                    },
                },
                RegisterRequest: {
                    type: "object",
                    required: ["firstName", "lastName", "email", "password", "confirmPassword"],
                    properties: {
                        firstName: { type: "string", example: "John" },
                        lastName: { type: "string", example: "Doe" },
                        email: { type: "string", format: "email", example: "john@example.com" },
                        password: { type: "string", format: "password", example: "Secret123!" },
                        confirmPassword: { type: "string", format: "password", example: "Secret123!" },
                    },
                },
                LoginRequest: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", format: "email" },
                        password: { type: "string", format: "password" },
                    },
                },
                EditProfileRequest: {
                    type: "object",
                    properties: {
                        firstName: { type: "string" },
                        lastName: { type: "string" },
                    },
                },
                ChangePasswordRequest: {
                    type: "object",
                    required: ["currentPassword", "newPassword", "confirmPassword"],
                    properties: {
                        currentPassword: { type: "string", format: "password" },
                        newPassword: { type: "string", format: "password" },
                        confirmPassword: { type: "string", format: "password" },
                    },
                },
                ChangeEmailRequest: {
                    type: "object",
                    required: ["newEmail", "currentPassword"],
                    properties: {
                        newEmail: { type: "string", format: "email" },
                        currentPassword: { type: "string", format: "password" },
                    },
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        message: { type: "string", example: "Something went wrong" },
                    },
                },
            },
        },
    },
    // files that contain the @swagger JSDoc comments
    apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);