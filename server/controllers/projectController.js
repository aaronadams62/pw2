function createProjectController(pool, logger) {
  return {
    getProjects: async (req, res) => {
      try {
        const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
        res.json({ data: result.rows });
      } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: 'Server bad' });
      }
    },

    createProject: async (req, res) => {
      const { title, description, image_url, live_url, category } = req.body;
      try {
        const newProject = await pool.query(
          'INSERT INTO projects (title, description, image_url, live_url, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [title, description, image_url, live_url, category]
        );
        res.json(newProject.rows[0]);
      } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: 'Failed to create project' });
      }
    },

    updateProject: async (req, res) => {
      const { title, description, image_url, live_url, category } = req.body;
      try {
        const updated = await pool.query(
          'UPDATE projects SET title=$1, description=$2, image_url=$3, live_url=$4, category=$5 WHERE id=$6 RETURNING *',
          [title, description, image_url, live_url, category, req.params.id]
        );
        res.json(updated.rows[0]);
      } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: 'Failed to update project' });
      }
    },

    deleteProject: async (req, res) => {
      try {
        await pool.query('DELETE FROM projects WHERE id = $1', [req.params.id]);
        res.json({ success: true });
      } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: 'Failed to delete' });
      }
    },
  };
}

module.exports = {
  createProjectController,
};
