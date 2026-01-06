# 🚀 Arbab Jewellers - Complete E-Commerce Platform

Full-stack jewelry e-commerce platform with multilingual support, beautiful animations, and comprehensive admin panel.

## 📂 Project Structure

```
back2basics/
├── backend/          # Express.js REST API
│   ├── config/       # Database configuration
│   ├── controllers/  # Business logic (11 controllers)
│   ├── models/       # MongoDB schemas (9 models)
│   ├── routes/       # API routes (12 route files)
│   ├── middleware/   # Auth, validation, error handling
│   ├── utils/        # Helpers, email service, file upload
│   └── uploads/      # Uploaded files storage
│
└── frontend/         # Next.js 14 with TypeScript
    ├── src/
    │   ├── app/          # Next.js pages (App Router)
    │   ├── components/   # React components
    │   ├── lib/          # Utilities (axios, helpers)
    │   ├── store/        # Zustand state management
    │   └── messages/     # i18n translations (en, ur, ar)
    └── public/       # Static assets
```

## 🎯 Key Features

### Backend Features

- ✅ RESTful API with Express.js
- ✅ MongoDB database with Mongoose
- ✅ JWT authentication for admin
- ✅ Role-based access control (admin/superadmin)
- ✅ 3-level category hierarchy
- ✅ Guest checkout (no customer login required)
- ✅ Email notifications (order confirmation, status updates)
- ✅ Newsletter subscription system
- ✅ File upload with Multer
- ✅ Input validation with express-validator
- ✅ Comprehensive error handling
- ✅ 50+ API endpoints

### Frontend Features

- ✅ Next.js 14 with TypeScript
- ✅ Multilingual (English, Urdu, Arabic) with RTL support
- ✅ Framer Motion animations throughout
- ✅ Responsive Tailwind CSS design
- ✅ Shopping cart with Zustand
- ✅ Product catalog with filters
- ✅ Guest checkout process
- ✅ Contact form
- ✅ Newsletter subscription
- ✅ Admin dashboard
- ✅ Image optimization
- ✅ SEO friendly

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 4.4
- npm >= 9.0.0

### Installation

#### Option 1: Automated Setup (Windows)

```bash
# Run the setup script
SETUP.bat
```

#### Option 2: Manual Setup

**Backend:**

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Setup database & seed data
node setupDatabase.js
node seedEmailTemplates.js

# Start development server
npm run dev
```

**Frontend:**

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with your API URL

# Start development server
npm run dev
```

## 🔧 Configuration

### Backend Environment Variables (.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/arbab-jewellers
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Frontend Environment Variables (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_UPLOADS_URL=http://localhost:5000/uploads
```

## 🎨 Technologies Used

### Backend Stack

- **Express.js** 4.20.0 - Web framework
- **MongoDB** - Database
- **Mongoose** 8.6.1 - ODM
- **JWT** 9.0.2 - Authentication
- **bcryptjs** 2.4.3 - Password hashing
- **Nodemailer** 6.9.7 - Email service
- **Multer** 1.4.5 - File uploads
- **express-validator** 7.0.1 - Input validation

### Frontend Stack

- **Next.js** 14.2.15 - React framework
- **TypeScript** 5.6.3 - Type safety
- **Tailwind CSS** 3.4.14 - Styling
- **Framer Motion** 11.11.11 - Animations
- **next-intl** 3.22.0 - Internationalization
- **Zustand** 4.5.5 - State management
- **Axios** 1.7.7 - HTTP client
- **React Hot Toast** 2.4.1 - Notifications
- **Swiper** 11.1.14 - Carousels

## 📱 Pages & Routes

### Public Pages

- `/` - Homepage with hero, featured products, categories
- `/products` - All products listing
- `/products/[id]` - Product detail page
- `/categories` - Categories listing
- `/cart` - Shopping cart
- `/checkout` - Checkout & order placement
- `/contact` - Contact form
- `/about` - About us page

### Admin Pages (Protected)

- `/admin/login` - Admin authentication
- `/admin/dashboard` - Statistics & analytics
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/categories` - Category management
- `/admin/settings` - System settings

### API Endpoints

See [backend/API_TESTING.md](backend/API_TESTING.md) for complete API documentation.

## 🌐 Multilingual Support

The frontend supports 3 languages with automatic RTL layout:

- **English (en)** - Default, LTR
- **Urdu (ur)** - RTL support with Noto Nastaliq Urdu font
- **Arabic (ar)** - RTL support

Translation files: `frontend/src/messages/{en,ur,ar}.json`

## 🎭 Animations

Framer Motion animations include:

- Page transitions
- Scroll-triggered animations
- Hover effects on cards and buttons
- Loading skeletons
- Floating elements
- Smooth menu transitions
- Cart animations
- Form validation feedback

## 🔐 Default Credentials

After running `setupDatabase.js`:

```
Email: admin@arbabjewellers.com
Password: admin123456
```

**⚠️ IMPORTANT: Change this password immediately in production!**

## 📊 Database Setup

The backend includes setup scripts:

```bash
# Create superadmin, default settings, company info
node setupDatabase.js

# Seed email templates
node seedEmailTemplates.js
```

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Start server
npm run dev

# Test endpoints with Postman
# Import: backend/API_TESTING.md
```

### Frontend Testing

```bash
cd frontend

# Start dev server
npm run dev

# Visit http://localhost:3000/en
```

## 📦 Build for Production

### Backend

```bash
cd backend
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm start
```

## 🚢 Deployment

### Backend Deployment

1. Set production environment variables
2. Use MongoDB Atlas for database
3. Deploy to:
   - Heroku
   - AWS EC2
   - DigitalOcean
   - Render
   - Railway

### Frontend Deployment

1. Build the project: `npm run build`
2. Deploy to:
   - **Vercel** (Recommended) - Zero config
   - **Netlify**
   - **AWS Amplify**
   - **Cloudflare Pages**

See [DEPLOYMENT.md](backend/DEPLOYMENT.md) for detailed instructions.

## 📖 Documentation

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
- [API Testing Guide](backend/API_TESTING.md)
- [Setup Guide](backend/SETUP.md)
- [Deployment Guide](backend/DEPLOYMENT.md)
- [Features List](backend/FEATURES.md)
- [Quick Reference](backend/QUICK_REFERENCE.md)

## 🎯 Workflow

1. **Customer Journey:**

   - Browse products by category
   - View product details
   - Add to cart
   - Proceed to checkout (no login required)
   - Receive order confirmation email

2. **Admin Journey:**
   - Login to admin panel
   - Manage products, categories, orders
   - Update order status (triggers email)
   - Send promotional emails to subscribers
   - View dashboard statistics

## 🛠️ Development Tips

### Backend

- All routes are prefixed with `/api`
- Use middleware for authentication
- Validation middleware on all POST/PUT routes
- Error handling middleware catches all errors

### Frontend

- Use `useTranslations()` for all text
- Images auto-optimized by Next.js
- Cart state persists in localStorage
- All animations use Framer Motion

## 🐛 Common Issues

### Backend won't start

```bash
# Check MongoDB connection
# Verify .env configuration
# Check port 5000 is available
```

### Frontend build fails

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Images not loading

```bash
# Check backend is running
# Verify NEXT_PUBLIC_UPLOADS_URL in .env.local
```

## 📝 License

© 2026 Arbab Jewellers. All rights reserved.

## 🤝 Support

For support:

- Email: info@arbabjewellers.com
- Phone: +92 300 1234567

## 🎉 Credits

Built with ❤️ using modern web technologies.

---

**Happy Coding! 🚀✨**
