function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageUrl = `http://localhost:4000/uploads/${req.file.filename}`;
  return res.json({ url: imageUrl });
}

module.exports = {
  uploadImage,
};
