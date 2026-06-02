import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import authRoutes from './routes/auth';

const app = express();
const apiHost = process.env.API_HOST || '127.0.0.1';
const apiPort = Number(process.env.API_PORT || 5000);

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'TCG Arena API Docs',
  swaggerOptions: { persistAuthorization: true },
}));

app.get('/api-docs.json', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);

const server = app.listen(apiPort, apiHost, () => {
  console.log(`API listening on http://${apiHost}:${apiPort}`);
});

server.on('error', (error: Error) => {
  console.error('API startup error:', error.message);
  process.exit(1);
});
