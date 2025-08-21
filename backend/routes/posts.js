import express from 'express';
import pool from '../db.js';
import authenticateToken from '../middleware/auth.js';
import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

const router = express.Router();

// Get all posts with filters
router.get('/', async (req, res) => {
  try {
    const { type, search, limit = 20, offset = 0 } = req.query;
    
    let query = `
      SELECT p.*, u.username, u.full_name, u.avatar_url, u.university
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.is_active = true
    `;
    
    const params = [];
    let paramCount = 0;

    if (type) {
      paramCount++;
      query += ` AND p.type = $${paramCount}`;
      params.push(type);
    }

    if (search) {
      paramCount++;
      query += ` AND p.content ILIKE $${paramCount}`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT p.*, u.username, u.full_name, u.avatar_url, u.university, u.major, u.year
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1 AND p.is_active = true
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new post
router.post('/', authenticateToken, upload.array('images', 5), async (req, res) => {
  try {
    console.log('Received post data:', req.body);
    console.log('Received files:', req.files);
    
    const { title, description, type, price, location, room_type, amenities } = req.body;
    const userId = req.user.userId;

    // Get file URLs
    const imageUrls = req.files ? req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`) : [];

    // Handle amenities - convert to array if it's a string
    let amenitiesArray = [];
    if (amenities) {
      if (typeof amenities === 'string') {
        // If it's a string, try to parse it as JSON or split by comma
        try {
          amenitiesArray = JSON.parse(amenities);
        } catch {
          // If parsing fails, split by comma and trim
          amenitiesArray = amenities.split(',').map(item => item.trim()).filter(item => item.length > 0);
        }
      } else if (Array.isArray(amenities)) {
        amenitiesArray = amenities;
      }
    }

    const result = await pool.query(`
      INSERT INTO posts (user_id, title, description, type, price, location, room_type, amenities, images)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [userId, title, description, type, price, location, room_type, amenitiesArray, imageUrls]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update post
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { content, type, price, location, image_url } = req.body;
    const userId = req.user.userId;

    // Check if user owns the post
    const postCheck = await pool.query(
      'SELECT user_id FROM posts WHERE id = $1',
      [id]
    );

    if (postCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (postCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const result = await pool.query(`
      UPDATE posts 
      SET content = $1, type = $2, price = $3, location = $4, image_url = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `, [content, type, price, location, image_url, id]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete post
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if user owns the post
    const postCheck = await pool.query(
      'SELECT user_id FROM posts WHERE id = $1',
      [id]
    );

    if (postCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (postCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await pool.query('UPDATE posts SET is_active = false WHERE id = $1', [id]);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 