const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function createAuthController(pool, logger) {
  return {
    login: async (req, res) => {
      const { username, password } = req.body;
      try {
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (user.rows.length === 0) return res.status(401).json({ error: 'Invalid creds' });

        const valid = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!valid) return res.status(401).json({ error: 'Invalid creds' });

        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
      } catch (err) {
        logger.error(err.message);
        return res.status(500).json({ error: 'Login failed' });
      }
    },
  };
}

module.exports = {
  createAuthController,
};
