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
