import pool from './db.js';

async function cleanupImages() {
  try {
    console.log('Cleaning up invalid image URLs from posts...');
    
    // Update posts to remove blob URLs from images array
    const result = await pool.query(`
      UPDATE posts 
      SET images = ARRAY[]::text[] 
      WHERE images IS NOT NULL AND array_length(images, 1) > 0
    `);
    
    console.log(`Updated ${result.rowCount} posts`);
    
    // Also clean up avatar_urls that are blob URLs
    const avatarResult = await pool.query(`
      UPDATE users 
      SET avatar_url = NULL 
      WHERE avatar_url LIKE 'blob:%'
    `);
    
    console.log(`Updated ${avatarResult.rowCount} user avatar URLs`);
    
    console.log('Cleanup completed successfully!');
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await pool.end();
  }
}

cleanupImages(); 