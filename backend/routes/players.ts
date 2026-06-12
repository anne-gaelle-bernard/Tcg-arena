import express, { Request, Response } from 'express';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Joueurs
 *   description: Profil et historique des joueurs
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     PlayerProfile:
 *       type: object
 *       properties:
 *         player_id:
 *           type: integer
 *           example: 1
 *         username:
 *           type: string
 *           example: duelmaster42
 *         mail:
 *           type: string
 *           format: email
 *           example: joueur@tcg-arena.io
 *         level:
 *           type: integer
 *           example: 5
 *         credits:
 *           type: integer
 *           example: 350
 *         is_banned:
 *           type: boolean
 *           example: false
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: '2025-01-15T08:00:00Z'
 *     GameHistory:
 *       type: object
 *       properties:
 *         game_id:
 *           type: integer
 *           example: 101
 *         opponent:
 *           type: string
 *           example: rival77
 *         result:
 *           type: string
 *           enum: [win, lose, draw]
 *           example: win
 *         credits_earned:
 *           type: integer
 *           example: 30
 *         played_at:
 *           type: string
 *           format: date-time
 *           example: '2025-06-10T14:22:00Z'
 */

/**
 * @openapi
 * /api/players/me:
 *   get:
 *     tags: [Joueurs]
 *     summary: Récupérer le profil complet du joueur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil du joueur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlayerProfile'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/me', (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet.' });
});

/**
 * @openapi
 * /api/players/me/history:
 *   get:
 *     tags: [Joueurs]
 *     summary: Récupérer l'historique des parties du joueur connecté
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Nombre de parties à retourner
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Décalage pour la pagination
 *     responses:
 *       200:
 *         description: Historique des parties
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 42
 *                 games:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GameHistory'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/me/history', (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet.' });
});

/**
 * @openapi
 * /api/players/{id}:
 *   get:
 *     tags: [Joueurs]
 *     summary: Récupérer le profil public d'un joueur par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du joueur
 *         example: 2
 *     responses:
 *       200:
 *         description: Profil public du joueur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 player_id:
 *                   type: integer
 *                   example: 2
 *                 username:
 *                   type: string
 *                   example: rival77
 *                 level:
 *                   type: integer
 *                   example: 8
 *       404:
 *         description: Joueur introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet.' });
});

export default router;
