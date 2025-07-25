import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import User from '../models/User';
import Post from '../models/Post';
import Comment from '../models/Comment';
import ChatMessage from '../models/ChatMessage';
import Todo from '../models/Todo';
import AdminVerification from '../models/AdminVerification';
import { logger } from '../utils/logger';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Post.deleteMany({}),
      Comment.deleteMany({}),
      ChatMessage.deleteMany({}),
      Todo.deleteMany({}),
      AdminVerification.deleteMany({})
    ]);

    logger.info('Cleared existing data');

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 12);

    const users = await User.create([
      {
        username: 'admin',
        email: 'admin@vibeCode.com',
        password: hashedPassword,
        role: 'admin',
        bio: 'Platform administrator',
        isVerified: true
      },
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'user',
        bio: 'Software developer passionate about coding',
        isVerified: true
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: hashedPassword,
        role: 'user',
        bio: 'UI/UX designer and frontend enthusiast',
        isVerified: true
      },
      {
        username: 'mike_wilson',
        email: 'mike@example.com',
        password: hashedPassword,
        role: 'user',
        bio: 'Full-stack developer and tech blogger',
        isVerified: true
      }
    ]);

    logger.info(`Created ${users.length} users`);

    // Create posts
    const posts = await Post.create([
      {
        author: users[1]._id,
        content: 'Just finished building my first React Native app! The learning curve was steep but totally worth it. #ReactNative #MobileDev',
        imageUrl: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg'
      },
      {
        author: users[2]._id,
        content: 'Working on a new design system for our company. Color theory is fascinating! 🎨',
        linkUrl: 'https://material.io/design'
      },
      {
        author: users[3]._id,
        content: 'Hot take: TypeScript makes JavaScript development so much more enjoyable. The type safety is a game changer!',
      },
      {
        author: users[1]._id,
        content: 'Anyone else excited about the new Next.js 14 features? The app router is incredible!',
        linkUrl: 'https://nextjs.org/blog/next-14'
      },
      {
        author: users[2]._id,
        content: 'Spent the weekend learning Figma. The component system is so powerful for maintaining design consistency.',
        imageUrl: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg'
      }
    ]);

    logger.info(`Created ${posts.length} posts`);

    // Add likes to posts
    posts[0].likes.push(users[2]._id, users[3]._id);
    posts[1].likes.push(users[1]._id, users[3]._id);
    posts[2].likes.push(users[1]._id, users[2]._id);
    posts[3].likes.push(users[2]._id);
    posts[4].likes.push(users[1]._id, users[3]._id);

    // Add saves to posts
    posts[0].saves.push(users[2]._id);
    posts[2].saves.push(users[1]._id);
    posts[4].saves.push(users[3]._id);

    await Promise.all(posts.map(post => post.save()));

    // Create comments
    const comments = await Comment.create([
      {
        post: posts[0]._id,
        author: users[2]._id,
        content: 'Congratulations! React Native is such a powerful framework.'
      },
      {
        post: posts[0]._id,
        author: users[3]._id,
        content: 'Would love to see some screenshots of your app!'
      },
      {
        post: posts[1]._id,
        author: users[1]._id,
        content: 'Material Design has some great color palette tools!'
      },
      {
        post: posts[2]._id,
        author: users[2]._id,
        content: 'Totally agree! TypeScript has saved me from so many runtime errors.'
      },
      {
        post: posts[3]._id,
        author: users[1]._id,
        content: 'The server components are a game changer for performance!'
      }
    ]);

    // Add comments to posts
    posts[0].comments.push(comments[0]._id, comments[1]._id);
    posts[1].comments.push(comments[2]._id);
    posts[2].comments.push(comments[3]._id);
    posts[3].comments.push(comments[4]._id);

    await Promise.all(posts.map(post => post.save()));

    logger.info(`Created ${comments.length} comments`);

    // Create chat messages
    const chatMessages = await ChatMessage.create([
      {
        content: 'Welcome to the anonymous chat! Feel free to share your thoughts and ask questions.',
        isAnonymous: true
      },
      {
        content: 'Has anyone tried the new GitHub Copilot features? Thoughts?',
        author: users[1]._id,
        isAnonymous: false
      },
      {
        content: 'I\'ve been struggling with work-life balance lately. Any tips?',
        isAnonymous: true
      },
      {
        content: 'What\'s everyone\'s favorite VS Code extension?',
        author: users[2]._id,
        isAnonymous: false
      },
      {
        content: 'Just wanted to say this community is amazing! Thanks for all the help.',
        isAnonymous: true
      }
    ]);

    // Create some replies
    const replies = await ChatMessage.create([
      {
        content: 'I love GitHub Copilot! It\'s like having a coding buddy.',
        parentMessage: chatMessages[1]._id,
        isAnonymous: true
      },
      {
        content: 'Try setting boundaries with work hours. It really helps!',
        parentMessage: chatMessages[2]._id,
        author: users[3]._id,
        isAnonymous: false
      },
      {
        content: 'Prettier and ESLint are must-haves for me!',
        parentMessage: chatMessages[3]._id,
        author: users[1]._id,
        isAnonymous: false
      }
    ]);

    // Add replies to parent messages
    chatMessages[1].replies.push(replies[0]._id);
    chatMessages[2].replies.push(replies[1]._id);
    chatMessages[3].replies.push(replies[2]._id);

    await Promise.all(chatMessages.map(msg => msg.save()));

    logger.info(`Created ${chatMessages.length} chat messages and ${replies.length} replies`);

    // Create todos for users
    const todos = await Todo.create([
      // John's todos
      {
        user: users[1]._id,
        title: 'Complete React project',
        content: 'Finish the e-commerce app with payment integration',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        position: 0,
        tags: ['react', 'project', 'urgent']
      },
      {
        user: users[1]._id,
        title: 'Learn GraphQL',
        content: 'Go through the GraphQL tutorial and build a small API',
        priority: 'medium',
        position: 1,
        tags: ['learning', 'graphql', 'api']
      },
      {
        user: users[1]._id,
        title: 'Update portfolio website',
        content: 'Add recent projects and update the design',
        priority: 'low',
        completed: true,
        position: 2,
        tags: ['portfolio', 'design']
      },
      // Jane's todos
      {
        user: users[2]._id,
        title: 'Design system documentation',
        content: 'Create comprehensive documentation for the new design system',
        priority: 'high',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        position: 0,
        tags: ['design', 'documentation']
      },
      {
        user: users[2]._id,
        title: 'User research interviews',
        content: 'Conduct 5 user interviews for the mobile app redesign',
        priority: 'medium',
        position: 1,
        tags: ['research', 'ux', 'interviews']
      },
      // Mike's todos
      {
        user: users[3]._id,
        title: 'Write blog post about Next.js',
        content: 'Share insights about the new app router and server components',
        priority: 'medium',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        position: 0,
        tags: ['blog', 'nextjs', 'writing']
      },
      {
        user: users[3]._id,
        title: 'Code review for team project',
        content: 'Review the authentication module implementation',
        priority: 'high',
        position: 1,
        tags: ['code-review', 'team', 'auth']
      }
    ]);

    logger.info(`Created ${todos.length} todos`);

    // Create admin verification string
    await AdminVerification.create({
      verificationString: 'admin-verification-2024',
      createdBy: users[0]._id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });

    logger.info('Created admin verification string');

    logger.info('🌱 Database seeded successfully!');
    logger.info('📧 Test accounts:');
    logger.info('   Admin: admin@vibeCode.com / password123');
    logger.info('   User: john@example.com / password123');
    logger.info('   User: jane@example.com / password123');
    logger.info('   User: mike@example.com / password123');
    logger.info('🔑 Admin verification string: admin-verification-2024');

  } catch (error) {
    logger.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedData();