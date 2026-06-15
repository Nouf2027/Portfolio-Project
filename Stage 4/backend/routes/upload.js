const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// حاول Cloudinary، وإذا فشل استخدم base64
async function tryCloudinary(buffer, options = {}) {
  try {
    const cloudinary = require('../config/cloudinary');
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'jeel_centers', ...options },
        (error, result) => { if (error) reject(error); else resolve(result); }
      ).end(buffer);
    });
    return result.secure_url;
  } catch (_err) {
    return null; // Cloudinary غير متاح
  }
}

// رفع صورة
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image provided' });

    let url = await tryCloudinary(req.file.buffer);
    if (!url) {
      // fallback: base64 مباشرة في DB
      url = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// رفع وثيقة (ترخيص/سجل)
router.post('/document', auth, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No document provided' });

    let url = await tryCloudinary(req.file.buffer, { resource_type: 'raw', folder: 'jeel_documents' });
    if (!url) {
      url = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;