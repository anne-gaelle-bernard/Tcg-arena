import express, { Request, Response } from 'express';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Boosters
 *   description: Achat et ouverture de boosters de cartes
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Booster:
 *       type: object
 *       properties:
 *         booster_id:
 *           type: integer
 *           example: 1
 *         type:
 *           type: string
 *           enum: [basic, premium, legend]
 *           example: basic
 *         price:
 *           type: integer
 *           description: Prix en crédits
 *           example: 100
 *         cards_count:
 *           type: integer
 *           description: Nombre de cartes dans le booster
 *           example: 10
 *         description:
 *           type: string
 *           example: '60% Talents · 30% Spéciales · 10% Légendes'
 *     BoosterOpenResult:
 *       type: object
 *       properties:
 *         cards:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Card'
 *         credits_remaining:
 *           type: integer
 *           example: 50
 */

/**
 * @openapi
 * /api/boosters:
 *   get:
 *     tags: [Boosters]
 *     summary: Lister les boosters disponibles à l'achat
 *     responses:
 *       200:
 *         description: Liste des boosters disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booster'
 */
router.get('/', (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet.' });
});

/**
 * @openapi
 * /api/boosters/buy:
 *   post:
 *     tags: [Boosters]
 *     summary: Acheter un booster avec des crédits
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [basic, premium, legend]
 *                 example: basic
 *     responses:
 *       200:
 *         description: Booster acheté — prêt à être ouvert
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Booster purchased.
 *                 booster_instance_id:
 *                   type: integer
 *                   example: 42
 *                 credits_remaining:
 *                   type: integer
 *                   example: 150
 *       400:
 *         description: Type de booster invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       402:
 *         description: Crédits insuffisants
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/buy', (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet.' });
});

/**
 * @openapi
 * /api/boosters/open:
 *   post:
 *     tags: [Boosters]
 *     summary: Ouvrir un booster acheté et recevoir 10 cartes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [booster_instance_id]
 *             properties:
 *               booster_instance_id:
 *                 type: integer
 *                 description: ID de l'instance de booster achetée
 *                 example: 42
 *     responses:
 *       200:
 *         description: Booster ouvert — liste des 10 cartes reçues
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BoosterOpenResult'
 *       400:
 *         description: Booster déjà ouvert ou ID invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Ce booster n'appartient pas au joueur connecté
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/open', (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet.' });
});

export default router;
