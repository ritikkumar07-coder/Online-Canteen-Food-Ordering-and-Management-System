# Online Canteen Food Ordering and Management System

## Project Overview

**Project Name:** CanteenConnect  
**Type:** Full-stack Web Application  
**Core Functionality:** A web-based system enabling students/employees to pre-order food online, schedule pickups, and help canteen staff manage orders efficiently while reducing waiting times.  
**Target Users:** Students, Employees, Canteen Staff, Administrators

---

## Technology Stack

- **Frontend:** React.js with Vite
- **Backend:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Styling:** Custom CSS with CSS Variables
- **State Management:** React Context API
- **API Communication:** RESTful API

---

## UI/UX Specification

### Color Palette

| Color Name | Hex Code | Usage |
|-----------|---------|-------|
| Primary | #FF6B35 | Main accent, buttons, highlights |
| Primary Dark | #E85A24 | Hover states |
| Secondary | #2EC4B6 | Success states, confirmations |
| Background | #0D1117 | Main background (dark mode) |
| Surface | #161B22 | Cards, panels |
| Surface Light | #21262D | Elevated elements |
| Text Primary | #F0F6FC | Main text |
| Text Secondary | #8B949E | Secondary text |
| Warning | #F0AD4E | Pending states |
| Error | #F85149 | Error states |
| Success | #2EC4B6 | Ready states |

### Typography

- **Primary Font:** 'Poppins', sans-serif (headings)
- **Secondary Font:** 'Inter', sans-serif (body text)
- **Monospace:** 'JetBrains Mono', monospace (prices, numbers)

| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 | Poppins | 2.5rem | 700 |
| H2 | Poppins | 2rem | 600 |
| H3 | Poppins | 1.5rem | 600 |
| Body | Inter | 1rem | 400 |
| Small | Inter | 0.875rem | 400 |
| Button | Poppins | 0.875rem | 600 |

### Layout Structure

#### Header/Navigation
- Fixed top navigation bar (height: 64px)
- Logo on left
- Navigation links center
- User profile dropdown right
- Mobile: Hamburger menu

#### Main Content Area
- Max width: 1200px container
- Padding: 24px
- Responsive grid system

#### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Visual Effects

- Card shadows: `0 4px 6px rgba(0, 0, 0, 0.3)`
- Hover transitions: 0.3s ease
- Button hover: Scale 1.02, color shift
- Page transitions: Fade in (0.3s)
- Loading states: Pulse animation
- Success animations: Confetti burst

---

## Module Specifications

### 1. User (Student/Staff) Module

#### Features
- **Registration:** Email-based with ID verification
- **Login:** Email + Password
- **Menu Browser:** Categories (Breakfast, Lunch, Snacks, Beverages)
- **Item Details:** Image, price, description, availability
- **Shopping Cart:** Add/remove items, quantity adjustment
- **Ordering:** Select pickup time slot, payment method
- **Order Tracking:** Real-time status updates
- **Order History:** View past orders

#### User Workflow
1. Register/Login → Browse Menu → Add to Cart → Select Time Slot → Pay → Track Order → Pickup → Rate

#### Order Status States
- **Pending** - Order placed, waiting for confirmation
- **Confirmed** - Accepted by canteen
- **Preparing** - Being prepared
- **Ready** - Ready for pickup
- **Completed** - Picked up
- **Cancelled** - Cancelled by user/canteen

### 2. Admin Module

#### Features
- **Authentication:** Secure admin login
- **Menu Management:** Add/edit/delete food items
- **Availability:** Toggle items daily
- **Pricing:** Set and update prices
- **Order Management:** View all orders, update status
- **User Management:** View, disable users
- **Reports:** Daily/weekly sales, popular items

#### Admin Dashboard
- Quick stats (Today's orders, Revenue, Popular items)
- Order list with filters
- Menu management table
- Analytics charts

### 3. Canteen Staff Module

#### Features
- **Order Queue:** Real-time incoming orders
- **Accept/Reject:** Process new orders
- **Status Update:** Mark preparation stages
- **Ready Notification:** Alert user when ready

#### Staff Dashboard
- Active orders list
- Status update controls
- Order statistics

---

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'staff', 'admin']),
  studentId: String,
  phone: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### MenuItem Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String (enum: ['breakfast', 'lunch', 'snacks', 'beverages']),
  price: Number,
  image: String (URL),
  isAvailable: Boolean,
  preparationTime: Number (minutes),
  createdAt: Date,
  updatedAt: Date
}
```

### Order Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  items: [{
    menuItemId: ObjectId (ref: MenuItem),
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: String (enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']),
  pickupTime: Date,
  paymentMethod: String (enum: ['online', 'cash']),
  paymentStatus: String (enum: ['pending', 'paid', 'refunded']),
  tokenNumber: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get single item
- `POST /api/menu` - Create item (admin)
- `PUT /api/menu/:id` - Update item (admin)
- `DELETE /api/menu/:id` - Delete item (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/orders/all` - Get all orders (admin/staff)

---

## Page Structure

### Public Pages
1. **Landing Page** (`/`) - Hero, features, login/signup CTA
2. **Login** (`/login`) - Login form
3. **Register** (`/register`) - Registration form

### User Pages
4. **Menu** (`/menu`) - Browse menu by category
5. **Cart** (`/cart`) - Shopping cart
6. **Checkout** (`/checkout`) - Order placement
7. **My Orders** (`/orders`) - Order history
8. **Order Details** (`/orders/:id`) - Single order view

### Admin Pages
9. **Admin Dashboard** (`/admin`) - Overview stats
10. **Admin Menu** (`/admin/menu`) - Menu management
11. **Admin Orders** (`/admin/orders`) - All orders
12. **Admin Users** (`/admin/users`) - User management

### Staff Pages
13. **Staff Dashboard** (`/staff`) - Order queue

---

## Component Structure

### Shared Components
- `Navbar` - Navigation bar
- `Sidebar` - Side navigation (admin/staff)
- `Footer` - Footer
- `Button` - Reusable button
- `Input` - Form input
- `Card` - Card wrapper
- `Modal` - Modal dialog
- `Toast` - Notification toast
- `Spinner` - Loading spinner
- `Badge` - Status badge

### Page Components
- `MenuCard` - Menu item card
- `CartItem` - Cart item row
- `OrderCard` - Order summary card
- `OrderTimeline` - Order progress

---

## Acceptance Criteria

### User Module
- [ ] User can register with email and student/employee ID
- [ ] User can login and see personalized dashboard
- [ ] User can browse menu by category
- [ ] User can add items to cart with quantity
- [ ] User can select pickup time slot
- [ ] User can place order and see confirmation
- [ ] User can track order status in real-time
- [ ] User can view order history

### Admin Module
- [ ] Admin can login to dashboard
- [ ] Admin can add new menu items
- [ ] Admin can edit existing items
- [ ] Admin can delete items
- [ ] Admin can toggle item availability
- [ ] Admin can view all orders
- [ ] Admin can update order status
- [ ] Admin can view basic reports

### Staff Module
- [ ] Staff can view order queue
- [ ] Staff can accept/reject orders
- [ ] Staff can update preparation status
- [ ] Staff can mark orders as ready

### Visual Requirements
- [ ] Mobile-responsive design
- [ ] Dark theme with orange accents
- [ ] Smooth page transitions
- [ ] Loading states for async operations
- [ ] Toast notifications for actions

---

## File Structure

```
canteen-app/
├── server/
│   ├── index.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── MenuItem.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── menu.js
│   │   └── orders.js
│   ├── middleware/
│   │   └── auth.js
│   └── utils/
│       └── token.js
├── client/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
└── package.json
