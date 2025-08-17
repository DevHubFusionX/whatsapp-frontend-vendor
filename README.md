# Vendor Dashboard

A comprehensive vendor management dashboard for the CMS MVP platform.

## 🚀 Features

### 📊 Dashboard
- Real-time sales statistics
- Order management overview
- Product performance analytics
- Quick action buttons

### 📦 Product Management
- Add new products with images
- Edit existing products
- Inventory tracking
- Stock level monitoring

### 🛒 Order Processing
- View and manage orders
- Update order status
- Customer communication via WhatsApp
- Order history tracking

### 🤖 Automation
- Auto-post settings
- Customer follow-up automation
- Product card generation
- Interest tracking

### 📈 Analytics
- Sales performance metrics
- Product analytics
- Customer insights
- Revenue tracking

### ⚙️ Settings
- Business profile management
- Logo upload
- Contact information
- Store link sharing

## 🛠️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
```

## 🔧 Configuration

### Environment Variables
The app automatically detects the environment and uses appropriate API endpoints:
- **Development**: `http://localhost:5000/api`
- **Production**: `https://whatsapp-vendor.onrender.com/api`

### Authentication
- Uses JWT tokens stored in localStorage
- Automatic token refresh
- Protected routes with authentication guards

## 📱 Usage

### Getting Started
1. Register or login to your vendor account
2. Complete your business profile
3. Add your first product
4. Share your catalog link with customers
5. Start receiving and managing orders

### Key Features
- **Product Catalog**: Manage your product inventory
- **Order Management**: Process customer orders efficiently
- **WhatsApp Integration**: Communicate directly with customers
- **Analytics**: Track your business performance
- **Automation**: Set up automated workflows

## 🏗️ Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── automation/     # Automation features
│   ├── catalog/        # Catalog display components
│   ├── dashboard/      # Dashboard widgets
│   ├── product/        # Product management
│   ├── ui/            # Reusable UI components
│   └── vendor/        # Vendor-specific components
├── services/
│   └── api.js         # API service layer
└── App.jsx            # Main application component
```

## 🔗 Integration

This vendor dashboard integrates with:
- **Backend API**: Node.js/Express server
- **Database**: MongoDB for data storage
- **File Storage**: Cloudinary for image uploads
- **Communication**: WhatsApp Business API

## 📞 Support

For technical support or feature requests, please refer to the main project documentation or contact the development team.