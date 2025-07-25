# Vibe Code Backend API

A comprehensive Node.js backend for the Vibe Code social platform, featuring social media functionality, anonymous chat, and productivity tools.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication with refresh tokens
  - Role-based access control (User/Admin)
  - Admin verification system
  - Secure password hashing with bcrypt

- **Social Media Features**
  - Create, read, update, delete posts
  - Like and save posts
  - Comment system with nested replies
  - User profiles and post feeds
  - Image upload support with Cloudinary

- **Anonymous Chat System**
  - Real-time messaging with Socket.IO
  - Anonymous and authenticated messaging
  - Message replies and reactions
  - Message moderation capabilities

- **Todo/Productivity System**
  - Full CRUD operations for todos
  - Priority levels and due dates
  - Position-based ordering (drag & drop support)
  - Bulk operations and statistics
  - Tag system for organization

- **Admin Panel**
  - User management and role assignment
  - Content moderation
  - System statistics and analytics
  - Admin verification string generation

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.IO
- **File Upload**: Multer + Cloudinary
- **Validation**: Joi
- **Testing**: Jest + Supertest
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/vibe-code
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
   ADMIN_VERIFICATION_SECRET=your-admin-verification-secret
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7.0
   ```

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## 🐳 Docker Setup

1. **Using Docker Compose (Recommended)**
   ```bash
   docker-compose up -d
   ```

2. **Building manually**
   ```bash
   docker build -t vibe-code-api .
   docker run -p 5000:5000 --env-file .env vibe-code-api
   ```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/user/signup` | User registration | No |
| POST | `/api/v1/auth/user/login` | User login | No |
| POST | `/api/v1/auth/admin/signup` | Admin registration | No |
| POST | `/api/v1/auth/admin/login` | Admin login | No |
| POST | `/api/v1/auth/admin/generate-verification` | Generate admin verification | Admin |
| GET | `/api/v1/auth/profile` | Get user profile | User |
| PUT | `/api/v1/auth/profile` | Update user profile | User |

### Posts Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/posts` | Get paginated posts | Optional |
| POST | `/api/v1/posts` | Create new post | User |
| PUT | `/api/v1/posts/:id` | Update post | User/Admin |
| DELETE | `/api/v1/posts/:id` | Delete post | User/Admin |
| POST | `/api/v1/posts/:id/like` | Toggle like on post | User |
| POST | `/api/v1/posts/:id/save` | Toggle save post | User |
| GET | `/api/v1/posts/saved` | Get saved posts | User |
| GET | `/api/v1/posts/:id/comments` | Get post comments | Optional |
| POST | `/api/v1/posts/:id/comments` | Add comment | User |
| DELETE | `/api/v1/posts/comments/:id` | Delete comment | User/Admin |

### Chat Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/chat/messages` | Get chat messages | Optional |
| POST | `/api/v1/chat/messages` | Send message | Optional |
| POST | `/api/v1/chat/messages/:id/reply` | Reply to message | Optional |
| POST | `/api/v1/chat/messages/:id/like` | Like message | Optional |
| DELETE | `/api/v1/chat/messages/:id` | Delete message | User/Admin |
| GET | `/api/v1/chat/messages/:id/replies` | Get message replies | Optional |

### Todo Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/todos` | Get user todos | User |
| POST | `/api/v1/todos` | Create todo | User |
| PUT | `/api/v1/todos/:id` | Update todo | User |
| DELETE | `/api/v1/todos/:id` | Delete todo | User |
| PUT | `/api/v1/todos/:id/position` | Update todo position | User |
| GET | `/api/v1/todos/stats` | Get todo statistics | User |
| PATCH | `/api/v1/todos/bulk` | Bulk update todos | User |

### User Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/users` | Get all users | Admin |
| GET | `/api/v1/users/:id` | Get user by ID | No |
| GET | `/api/v1/users/:id/posts` | Get user posts | No |
| PUT | `/api/v1/users/:id/role` | Update user role | Admin |
| PATCH | `/api/v1/users/:id/status` | Toggle user status | Admin |
| DELETE | `/api/v1/users/:id` | Delete user | Admin |
| GET | `/api/v1/users/admin/stats` | Get user statistics | Admin |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **User**: Regular platform users
- **Admin**: Platform administrators with additional privileges

## 📡 Real-time Features

The API supports real-time communication using Socket.IO:

### Chat Events

- `chat:send-message` - Send a new message
- `chat:new-message` - Receive new messages
- `chat:react-message` - React to messages
- `chat:typing-start` - User started typing
- `chat:typing-stop` - User stopped typing

### Connection

```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token' // Optional for anonymous chat
  }
});
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## 📊 Database Schema

### User Model
```typescript
{
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
```

### Post Model
```typescript
{
  author: ObjectId;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  likes: ObjectId[];
  comments: ObjectId[];
  saves: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Todo Model
```typescript
{
  user: ObjectId;
  title: string;
  content?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  position: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

### Docker Deployment

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 📈 Performance & Monitoring

- **Database Indexing**: Optimized indexes for frequently queried fields
- **Rate Limiting**: Configurable rate limits for API endpoints
- **Caching**: Response caching for frequently accessed data
- **Logging**: Comprehensive logging with Winston
- **Health Checks**: Built-in health check endpoint

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Joi schema validation
- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: Secure token generation and validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Changelog

### v1.0.0
- Initial release
- User authentication and authorization
- Social media features (posts, comments, likes)
- Anonymous chat system
- Todo management system
- Admin panel functionality
- Real-time messaging with Socket.IO
- Comprehensive API documentation
- Docker support
- Test coverage