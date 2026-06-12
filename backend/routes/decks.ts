import express, { Request, Response } from 'express';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Decks
 *   description: Gestion des decks du joueur
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Deck:
 *       type: object
 *       properties:
 *         deck_id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Mon deck offensif
 *         player_id:
 *           type: integer
 *           example: 1
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: '2025-06-01T10:00:00Z'
 *         cards:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Card'
 */

/**
 * @openapi
 * /api/decks:
 *   get:
 *     tags: [Decks]
 *     summary: Récupérer tous les decks du joueur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des decks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Deck'
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
 * /api/decks/{id}:
 *   get:
 *     tags: [Decks]
 *     summary: Récupérer un deck par son ID
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
 *       200:
 *         description: Deck trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Deck'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Ce deck n'appartient pas au joueur connecté
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Deck introuvable
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
 * /api/decks:
 *   post:
 *     tags: [Decks]
 *     summary: Créer un nouveau deck
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mon deck offensif
 *     responses:
 *       201:
 *         description: Deck créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Deck'
 *       400:
 *         description: Nom manquant
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
router.post('/', (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet.' });
});

/**
 * @openapi
 * /api/decks/{id}:
 *   put:
 *     tags: [Decks]
 *     summary: Renommer un deck
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
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nouveau nom
 *     responses:
 *       200:
 *         description: Deck mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Deck'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Ce deck n'appartient pas au joueur connecté
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Deck introuvable
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
 * /api/decks/{id}:
 *   delete:
 *     tags: [Decks]
 *     summary: Supprimer un deck
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
 *         description: Deck supprimé
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Ce deck n'appartient pas au joueur connecté
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Deck introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet.' });
});

/**
 * @openapi
 * /api/decks/{id}/cards:
 *   post:
 *     tags: [Decks]
 *     summary: Ajouter une carte au deck
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
 *             required: [card_id]
 *             properties:
 *               card_id:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Carte ajoutée au deck
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Deck'
 *       400:
 *         description: Carte déjà dans le deck ou non possédée
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
 *       404:
 *         description: Deck ou carte introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id/cards', (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet.' });
});

/**
 * @openapi
 * /api/decks/{id}/cards/{cardId}:
 *   delete:
 *     tags: [Decks]
 *     summary: Retirer une carte du deck
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du deck
 *         example: 1
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la carte à retirer
 *         example: 5
 *     responses:
 *       200:
 *         description: Carte retirée du deck
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Deck'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Deck ou carte introuvable dans le deck
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id/cards/:cardId', (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet.' });
});

export default router;
