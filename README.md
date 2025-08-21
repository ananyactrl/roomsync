# RoomSync - Find Your Perfect Roommate

A full-stack web application for college students to find roommates, rooms, and room swaps. Built with Next.js, PostgreSQL, and Express.js.

## Features

- **User Authentication**: Secure registration and login system
- **Post Management**: Create, edit, and delete posts for rooms, roommates, and swaps
- **Real-time Messaging**: Chat with other users about posts
- **User Profiles**: Complete user profiles with university and major information
- **Search & Filter**: Find posts by type, location, and keywords
- **Responsive Design**: Mobile-first design for all devices

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Context** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd roomsync
```

### 2. Database Setup

1. **Install PostgreSQL** if you haven't already
2. **Create a database**:
   ```sql
   CREATE DATABASE roomsync;
   ```
3. **Update the database URL** in `backend/.env`:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/roomsync
   ```

### 3. Backend Setup

```bash
cd backend
npm install
```

**Set up the database schema**:
```bash
node setup-db.js
```

**Start the backend server**:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
# From the root directory
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

## Environment Variables

### Backend (.env)
```
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/roomsync
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Posts
- `GET /api/posts` - Get all posts (with filters)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Messages
- `GET /api/messages/conversations` - Get user conversations
- `GET /api/messages/conversations/:id` - Get conversation messages
- `POST /api/messages/conversations/:id` - Send message
- `POST /api/messages/conversations` - Start new conversation

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/posts` - Get user's posts
- `GET /api/users/:id` - Get public user profile

## Database Schema

### Users Table
- `id` (SERIAL PRIMARY KEY)
- `username` (VARCHAR UNIQUE)
- `email` (VARCHAR UNIQUE)
- `password_hash` (VARCHAR)
- `full_name` (VARCHAR)
- `avatar_url` (TEXT)
- `bio` (TEXT)
- `university` (VARCHAR)
- `major` (VARCHAR)
- `year` (INTEGER)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Posts Table
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER REFERENCES users)
- `title` (VARCHAR)
- `description` (TEXT)
- `type` (VARCHAR - 'room', 'roommate', 'swap')
- `price` (DECIMAL)
- `location` (VARCHAR)
- `room_type` (VARCHAR)
- `amenities` (TEXT[])
- `images` (TEXT[])
- `is_active` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Conversations Table
- `id` (SERIAL PRIMARY KEY)
- `post_id` (INTEGER REFERENCES posts)
- `user1_id` (INTEGER REFERENCES users)
- `user2_id` (INTEGER REFERENCES users)
- `created_at` (TIMESTAMP)

### Messages Table
- `id` (SERIAL PRIMARY KEY)
- `conversation_id` (INTEGER REFERENCES conversations)
- `sender_id` (INTEGER REFERENCES users)
- `content` (TEXT)
- `is_read` (BOOLEAN)
- `created_at` (TIMESTAMP)

## Usage

1. **Register/Login**: Create an account or sign in
2. **Browse Posts**: View available rooms, roommates, and swaps
3. **Create Posts**: Share your own listings
4. **Message Users**: Start conversations about posts
5. **Manage Profile**: Update your information and preferences

## Development

### Running in Development Mode

**Backend**:
```bash
cd backend
npm run dev
```

**Frontend**:
```bash
npm run dev
```

### Database Migrations

To reset the database schema:
```bash
cd backend
node setup-db.js
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository.
