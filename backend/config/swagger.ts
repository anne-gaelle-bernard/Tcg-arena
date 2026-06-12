import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TCG Arena API',
      version: '1.0.0',
      description: 'API REST pour la plateforme TCG Arena — authentification, cartes, collection, decks, boosters et administration.',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Serveur de développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenu via POST /api/auth/login',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'An error occurred.' },
          },
        },
      },
    },
  },
  apis: ['./backend/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
