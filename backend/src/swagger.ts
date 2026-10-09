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
                Category: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "c1a2b3c4-0000-4abc-9def-0123456789ab" },
                        categoryName: { type: "string", example: "Shoes" },
                    },
                },
                Item: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "i1a2b3c4-0000-4abc-9def-0123456789ab" },
                        itemName: { type: "string", example: "Running Shoe X" },
                        itemPrice: { type: "number", example: 99.99 },
                        itemBrand: { type: "string", example: "Nike" },
                        availableStock: { type: "integer", example: 25 },
                        categories: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Category" },
                        },
                    },
                },
                CreateItemRequest: {
                    type: "object",
                    required: ["itemName", "itemPrice"], // match your CreateItemSchema
                    properties: {
                        itemName: { type: "string", example: "Running Shoe X" },
                        itemPrice: { type: "number", example: 99.99 },
                        itemBrand: { type: "string", example: "Nike" },
                        availableStock: { type: "integer", example: 25 },
                        categories: {
                            type: "array",
                            description: "Category identifiers, as your itemMapper expects them",
                            items: { type: "string" },
                        },
                    },
                },
                EditItemRequest: {
                    type: "object",
                    properties: {
                        itemName: { type: "string" },
                        itemPrice: { type: "number" },
                        itemBrand: { type: "string" },
                        availableStock: { type: "integer" },
                    },
                },
                PaginatedItems: {
                    type: "object",
                    properties: {
                        data: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Item" },
                        },
                        pagination: {
                            type: "object",
                            properties: {
                                page: { type: "integer", example: 1 },
                                limit: { type: "integer", example: 10 },
                                total: { type: "integer", example: 57 },
                                totalPages: { type: "integer", example: 6 },
                            },
                        },
                    },
                },
                CategoryNameRequest: {
                    type: "object",
                    required: ["categoryName"],
                    properties: {
                        categoryName: { type: "string", example: "Shoes" },
                    },
                },
                MessageResponse: {
                    type: "object",
                    properties: {
                        message: { type: "string", example: "Done" },
                    },
                },
            },
        },
    },
    // files that contain the @swagger JSDoc comments
    apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);