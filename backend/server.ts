import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import authRoutes       from './routes/auth';
import cardsRoutes      from './routes/cards';
import collectionRoutes from './routes/collection';
import decksRoutes      from './routes/decks';
import boostersRoutes   from './routes/boosters';
import playersRoutes    from './routes/players';
import adminRoutes      from './routes/admin';

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

app.use('/api/auth',       authRoutes);
app.use('/api/cards',      cardsRoutes);
app.use('/api/collection', collectionRoutes);
app.use('/api/decks',      decksRoutes);
app.use('/api/boosters',   boostersRoutes);
app.use('/api/players',    playersRoutes);
app.use('/api/admin',      adminRoutes);

const server = app.listen(apiPort, apiHost, () => {
  console.log(`API listening on http://${apiHost}:${apiPort}`);
  console.log(`Swagger UI: http://${apiHost}:${apiPort}/api-docs`);
});

server.on('error', (error: Error) => {
  console.error('API startup error:', error.message);
  process.exit(1);
});
