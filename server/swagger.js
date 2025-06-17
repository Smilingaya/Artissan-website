// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Artisan API",
      version: "1.0.0",
      description: "API documentation for the artisan platform",
    },
    servers: [
      {
        url: "http://localhost:3000", // Change this if deploying online
      },
    ],
  },
  apis: ["./routes/*.js"], // Point to your routes folder
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
