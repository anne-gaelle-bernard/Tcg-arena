import express, { Request, Response } from 'express';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Collection
 *   description: Collection de cartes du joueur connecté
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CollectionCard:
 *       type: object
 *       properties:
 *         card_id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: KOBE BRYANT
 *         theme:
 *           type: string
 *           enum: [legends, talents, specials]
 *           example: legends
 *         rarity:
 *           type: string
 *           enum: [common, special, legend]
 *           example: legend
 *         atk:
 *           type: integer
 *           example: 99
 *         def:
 *           type: integer
 *           example: 75
 *         position:
 *           type: string
 *           example: SG/SF
 *         image:
 *           type: string
 *           example: /png/KB.png
 *         quantity:
 *           type: integer
 *           example: 2
 *         obtained_at:
 *           type: string
 *           format: date-time
 *           example: '2025-06-01T10:30:00Z'
 */

/**
 * @openapi
 * /api/collection:
 *   get:
 *     tags: [Collection]
 *     summary: Récupérer toutes les cartes possédées par le joueur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des cartes de la collection
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 16
 *                 cards:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CollectionCard'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet.' });
});

/**
 * @openapi
 * /api/collection/search:
 *   get:
 *     tags: [Collection]
 *     summary: Rechercher une carte dans la collection par nom
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Terme de recherche (nom du joueur)
 *         example: jordan
 *     responses:
 *       200:
 *         description: Résultats de la recherche
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CollectionCard'
 *       400:
 *         description: Paramètre de recherche manquant
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
 */
router.get('/search', (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet.' });
});

/**
 * @openapi
 * /api/collection/filter:
 *   get:
 *     tags: [Collection]
 *     summary: Filtrer la collection par thème ou rareté
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: theme
 *         schema:
 *           type: string
 *           enum: [legends, talents, specials]
 *         description: Filtrer par thème
 *       - in: query
 *         name: rarity
 *         schema:
 *           type: string
 *           enum: [common, special, legend]
 *         description: Filtrer par rareté
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [name, atk, def, obtained_at]
 *           default: name
 *         description: Trier les résultats
 *     responses:
 *       200:
 *         description: Cartes filtrées
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CollectionCard'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/filter', (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet.' });
});

export default router;
