import express, { Request, Response } from 'express';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Cartes
 *   description: Catalogue de toutes les cartes du jeu
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Card:
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
 *         score:
 *           type: integer
 *           example: 99
 */

/**
 * @openapi
 * /api/cards:
 *   get:
 *     tags: [Cartes]
 *     summary: Récupérer toutes les cartes du catalogue
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
 *     responses:
 *       200:
 *         description: Liste de toutes les cartes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 *       500:
 *         description: Erreur serveur
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
 * /api/cards/{id}:
 *   get:
 *     tags: [Cartes]
 *     summary: Récupérer une carte par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la carte
 *         example: 1
 *     responses:
 *       200:
 *         description: Carte trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: Carte introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet.' });
});

/**
 * @openapi
 * /api/cards:
 *   post:
 *     tags: [Cartes]
 *     summary: Créer une nouvelle carte (admin uniquement)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, theme, rarity, atk, def, position, image, score]
 *             properties:
 *               name:
 *                 type: string
 *                 example: NOUVEAU JOUEUR
 *               theme:
 *                 type: string
 *                 enum: [legends, talents, specials]
 *                 example: talents
 *               rarity:
 *                 type: string
 *                 enum: [common, special, legend]
 *                 example: common
 *               atk:
 *                 type: integer
 *                 example: 80
 *               def:
 *                 type: integer
 *                 example: 75
 *               position:
 *                 type: string
 *                 example: PG
 *               image:
 *                 type: string
 *                 example: /png/XX.png
 *               score:
 *                 type: integer
 *                 example: 88
 *     responses:
 *       201:
 *         description: Carte créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       400:
 *         description: Données invalides
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
 *         description: Accès refusé — rôle admin requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet.' });
});

/**
 * @openapi
 * /api/cards/{id}:
 *   put:
 *     tags: [Cartes]
 *     summary: Modifier une carte existante (admin uniquement)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               atk:
 *                 type: integer
 *               def:
 *                 type: integer
 *               position:
 *                 type: string
 *               score:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Carte mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Accès refusé — rôle admin requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Carte introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet.' });
});

/**
 * @openapi
 * /api/cards/{id}:
 *   delete:
 *     tags: [Cartes]
 *     summary: Supprimer une carte (admin uniquement)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       204:
 *         description: Carte supprimée
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Accès refusé — rôle admin requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Carte introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet.' });
});

export default router;
