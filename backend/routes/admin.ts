import express, { Request, Response } from 'express';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Administration
 *   description: Endpoints réservés aux administrateurs
 */

/**
 * @openapi
 * /api/admin/stats:
 *   get:
 *     tags: [Administration]
 *     summary: Statistiques globales de la plateforme
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques de la plateforme
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_players:
 *                   type: integer
 *                   example: 1240
 *                 active_players_today:
 *                   type: integer
 *                   example: 87
 *                 total_games_played:
 *                   type: integer
 *                   example: 15320
 *                 total_boosters_opened:
 *                   type: integer
 *                   example: 4200
 *                 total_cards_in_circulation:
 *                   type: integer
 *                   example: 42000
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
router.get('/stats', (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet.' });
});

/**
 * @openapi
 * /api/admin/players/{id}/ban:
 *   put:
 *     tags: [Administration]
 *     summary: Bannir ou débannir un joueur
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du joueur à bannir / débannir
 *         example: 5
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [banned]
 *             properties:
 *               banned:
 *                 type: boolean
 *                 example: true
 *               reason:
 *                 type: string
 *                 example: Triche détectée
 *     responses:
 *       200:
 *         description: Statut du joueur mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Player banned successfully.
 *                 player_id:
 *                   type: integer
 *                   example: 5
 *                 is_banned:
 *                   type: boolean
 *                   example: true
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
 *         description: Joueur introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/players/:id/ban', (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet.' });
});

/**
 * @openapi
 * /api/admin/players/{id}/credits:
 *   put:
 *     tags: [Administration]
 *     summary: Modifier les crédits d'un joueur
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du joueur
 *         example: 5
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [credits]
 *             properties:
 *               credits:
 *                 type: integer
 *                 description: Nouvelle valeur absolue des crédits
 *                 example: 500
 *               reason:
 *                 type: string
 *                 example: Compensation suite à un bug
 *     responses:
 *       200:
 *         description: Crédits mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Credits updated.
 *                 player_id:
 *                   type: integer
 *                   example: 5
 *                 credits:
 *                   type: integer
 *                   example: 500
 *       400:
 *         description: Valeur de crédits invalide
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
 *       404:
 *         description: Joueur introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/players/:id/credits', (_req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented yet.' });
});

export default router;
