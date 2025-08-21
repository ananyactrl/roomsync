import express from 'express';
import pool from '../db.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// Get user's conversations
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(`
      SELECT 
        c.id as conversation_id,
        c.post_id,
        p.title as post_title,
        p.type as post_type,
        CASE 
          WHEN c.user1_id = $1 THEN c.user2_id
          ELSE c.user1_id
        END as other_user_id,
        u.username as other_username,
        u.full_name as other_full_name,
        u.avatar_url as other_avatar_url,
        c.created_at as conversation_created_at,
        (
          SELECT m.content 
          FROM messages m 
          WHERE m.conversation_id = c.id 
          ORDER BY m.created_at DESC 
          LIMIT 1
        ) as last_message,
        (
          SELECT m.created_at 
          FROM messages m 
          WHERE m.conversation_id = c.id 
          ORDER BY m.created_at DESC 
          LIMIT 1
        ) as last_message_time,
        (
          SELECT COUNT(*) 
          FROM messages m 
          WHERE m.conversation_id = c.id 
          AND m.sender_id != $1 
          AND m.is_read = false
        ) as unread_count
      FROM conversations c
      JOIN posts p ON c.post_id = p.id
      JOIN users u ON (
        CASE 
          WHEN c.user1_id = $1 THEN c.user2_id
          ELSE c.user1_id
        END = u.id
      )
      WHERE (c.user1_id = $1 OR c.user2_id = $1)
      ORDER BY last_message_time DESC NULLS LAST
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get messages for a conversation
router.get('/conversations/:conversationId', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;

    // Check if user is part of this conversation
    const conversationCheck = await pool.query(
      'SELECT * FROM conversations WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)',
      [conversationId, userId]
    );

    if (conversationCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Mark messages as read
    await pool.query(
      'UPDATE messages SET is_read = true WHERE conversation_id = $1 AND sender_id != $2',
      [conversationId, userId]
    );

    // Get messages
    const result = await pool.query(`
      SELECT m.*, u.username, u.full_name, u.avatar_url
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = $1
      ORDER BY m.created_at ASC
    `, [conversationId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send a message
router.post('/conversations/:conversationId', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    // Check if user is part of this conversation
    const conversationCheck = await pool.query(
      'SELECT * FROM conversations WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)',
      [conversationId, userId]
    );

    if (conversationCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const result = await pool.query(`
      INSERT INTO messages (conversation_id, sender_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [conversationId, userId, content]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start a new conversation
router.post('/conversations', authenticateToken, async (req, res) => {
  try {
    const { postId, otherUserId } = req.body;
    const userId = req.user.userId;

    // Check if conversation already exists
    const existingConversation = await pool.query(
      'SELECT * FROM conversations WHERE post_id = $1 AND ((user1_id = $2 AND user2_id = $3) OR (user1_id = $3 AND user2_id = $2))',
      [postId, userId, otherUserId]
    );

    if (existingConversation.rows.length > 0) {
      return res.json(existingConversation.rows[0]);
    }

    // Create new conversation
    const result = await pool.query(`
      INSERT INTO conversations (post_id, user1_id, user2_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [postId, userId, otherUserId]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 