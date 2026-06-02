import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/db';

const router = express.Router();

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error';
}

async function ensurePlayerRole() {
  const existingRole = await pool.query(
    'SELECT role_id FROM role WHERE LOWER(name) = LOWER($1) LIMIT 1',
    ['player']
  );

  if (existingRole.rowCount && existingRole.rows[0]) {
    return existingRole.rows[0].role_id;
  }

  const createdRole = await pool.query(
    'INSERT INTO role (name) VALUES ($1) RETURNING role_id',
    ['player']
  );

  return createdRole.rows[0].role_id;
}

/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Authentification et création de compte joueur
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     PlayerPublic:
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
 *           example: 1
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Account created successfully.
 *         user:
 *           $ref: '#/components/schemas/PlayerPublic'
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Login successful.
 *         user:
 *           $ref: '#/components/schemas/PlayerPublic'
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Email already used.
 */

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Créer un compte joueur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: duelmaster42
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joueur@tcg-arena.io
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: secret123
 *     responses:
 *       201:
 *         description: Compte créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Champ manquant ou mot de passe trop court
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please fill all required fields.' });
  }

  if (String(password).length < 6) {
    return res.status(400).json({ message: 'Password must have at least 6 characters.' });
  }

  try {
    const existingPlayer = await pool.query('SELECT player_id FROM player WHERE mail = $1', [email]);

    if (existingPlayer.rowCount > 0) {
      return res.status(409).json({ message: 'Email already used.' });
    }

    const roleId = await ensurePlayerRole();
    const passwordHash = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO player (username, mail, password, level, role_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING player_id, username, mail, level
    `;

    const result = await pool.query(insertQuery, [username, email, passwordHash, 1, roleId]);

    return res.status(201).json({
      message: 'Account created successfully.',
      user: result.rows[0],
    });
  } catch (error: unknown) {
    console.error('Register error:', getErrorMessage(error));
    return res.status(500).json({ message: 'Server error during registration.' });
  }
});

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Se connecter avec email et mot de passe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joueur@tcg-arena.io
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Email ou mot de passe manquant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Identifiants invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const result = await pool.query(
      'SELECT player_id, username, mail, password, level FROM player WHERE mail = $1 LIMIT 1',
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    return res.json({
      message: 'Login successful.',
      user: {
        player_id: user.player_id,
        username: user.username,
        mail: user.mail,
        level: user.level,
      },
    });
  } catch (error: unknown) {
    console.error('Login error:', getErrorMessage(error));
    return res.status(500).json({ message: 'Server error during login.' });
  }
});

export default router;
