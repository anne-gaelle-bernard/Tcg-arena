import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TCG Arena API',
      version: '1.0.0',
      description: 'API REST pour la plateforme TCG Arena — authentification et gestion des joueurs.',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Serveur de développement',
      },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Email already used.' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
