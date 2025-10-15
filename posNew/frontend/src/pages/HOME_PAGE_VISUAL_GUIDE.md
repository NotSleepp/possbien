# Home Page Visual Guide

## Overview
The Home Page serves as the landing page after login, providing users with a welcoming interface, quick access to key features, and a summary of important metrics.

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Welcome Section (Gradient Banner)                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Buenos días, [User Name]!                           │  │
│  │  Bienvenido a tu sistema POS...                      │  │
│  │                                          [Rol Badge]  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Resumen del Día (Summary Statistics)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Ventas   │ │ Productos│ │ Stock    │ │ Clientes │      │
│  │ $12,450  │ │ 156      │ │ 1,234    │ │ 89       │      │
│  │ ↑ 12.5%  │ │ ↑ 8.2%   │ │          │ │ ↑ 5.1%   │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Accesos Rápidos (Quick Actions)                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ 📊       │ │ 📦       │ │ 🛒       │ │ ⚙️       │      │
│  │Dashboard │ │Productos │ │ Ventas   │ │Settings  │      │
│  │          │ │          │ │          │ │(Admin)   │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Additional Information (2 columns)                          │
│  ┌──────────────────────┐ ┌──────────────────────┐         │
│  │ Consejos Rápidos     │ │ Información Sistema  │         │
│  │ • Tip 1              │ │ Empresa: #1          │         │
│  │ • Tip 2              │ │ Sucursal: #1         │         │
│  │ • Tip 3              │ │ Usuario: admin       │         │
│  └──────────────────────┘ └──────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## Components Used

### 1. Welcome Section
- **Component**: Custom gradient banner
- **Features**:
  - Dynamic greeting based on time of day (Buenos días/tardes/noches)
  - User name display
  - Role badge showing user's role
  - Gradient background (blue-600 to blue-700)
  - Responsive layout (stacks on mobile)

### 2. Summary Statistics
- **Component**: `MetricCard`
- **Metrics Displayed**:
  1. **Ventas de Hoy** (Today's Sales)
     - Color: Green
     - Icon: FiDollarSign
     - Shows trend vs yesterday
  
  2. **Productos Vendidos** (Products Sold)
     - Color: Blue
     - Icon: FiShoppingCart
     - Shows trend vs yesterday
  
  3. **Productos en Stock** (Products in Stock)
     - Color: Purple
     - Icon: FiPackage
     - Shows total available
  
  4. **Clientes Atendidos** (Customers Served)
     - Color: Orange
     - Icon: FiUsers
     - Shows trend vs yesterday

- **Grid Layout**: 
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 4 columns

### 3. Quick Actions
- **Component**: Custom clickable cards
- **Actions Available**:
  1. **Dashboard** (All users)
     - Icon: FiBarChart2
     - Color: Blue
     - Path: /dashboard
  
  2. **Productos** (All users)
     - Icon: FiPackage
     - Color: Purple
     - Path: /products
  
  3. **Ventas** (All users)
     - Icon: FiShoppingCart
     - Color: Green
     - Path: /sales
  
  4. **Configuración** (Admin only)
     - Icon: FiSettings
     - Color: Orange
     - Path: /settings
     - Only visible to SUPER_ADMIN and ADMIN roles

- **Features**:
  - Hover effects (shadow and scale)
  - Focus states for accessibility
  - Arrow icon indicating navigation
  - Color-coded icon backgrounds
  - Responsive grid layout

- **Grid Layout**:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns
  - Large Desktop: 4 columns

### 4. Additional Information Cards
- **Component**: `Card` with outlined variant
- **Two Cards**:
  
  1. **Consejos Rápidos** (Quick Tips)
     - Icon: FiTrendingUp
     - Lists helpful tips for users
     - Bullet points with blue dots
  
  2. **Información del Sistema** (System Information)
     - Icon: FiSettings
     - Shows user's company, branch, and username
     - Key-value pairs with borders

- **Grid Layout**: 
  - Mobile: 1 column
  - Desktop: 2 columns

## Dynamic Features

### Time-Based Greeting
```javascript
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
};
```

### Role-Based Display
- Settings quick action only visible to admins
- Role badge shows appropriate role name
- Filtered actions based on user permissions

### Navigation
- All quick action cards are clickable
- Uses React Router's `navigate` function
- Smooth transitions between pages

## Responsive Behavior

### Mobile (< 640px)
- Welcome section stacks vertically
- Metrics in single column
- Quick actions in single column
- Info cards stack vertically

### Tablet (640px - 1024px)
- Welcome section side-by-side
- Metrics in 2 columns
- Quick actions in 2 columns
- Info cards stack vertically

### Desktop (> 1024px)
- Full layout with all columns
- Metrics in 4 columns
- Quick actions in 3-4 columns
- Info cards side-by-side

## Color Scheme

### Welcome Banner
- Background: Gradient from blue-600 to blue-700
- Text: White
- Role badge: White with 20% opacity background

### Metric Cards
- Green: Sales metrics
- Blue: Product metrics
- Purple: Inventory metrics
- Orange: Customer metrics

### Quick Action Cards
- Blue: Dashboard
- Purple: Products
- Green: Sales
- Orange: Settings

## Accessibility Features

- Semantic HTML structure
- Keyboard navigation support
- Focus indicators on interactive elements
- ARIA labels where needed
- Sufficient color contrast
- Responsive text sizing

## Requirements Fulfilled

✅ **Requirement 6.3**: Home page with welcome message and quick actions
- Welcome section with personalized greeting
- Quick action cards for common tasks
- Summary statistics display

✅ **Requirement 6.4**: Interactive elements with feedback
- Hover effects on cards
- Loading states (via MetricCard)
- Visual feedback on interactions
- Responsive layout

## Future Enhancements

1. **Real Data Integration**
   - Connect to actual sales API
   - Fetch real-time statistics
   - Display actual user activity

2. **Customizable Dashboard**
   - Allow users to rearrange cards
   - Show/hide specific metrics
   - Personalized quick actions

3. **Recent Activity Feed**
   - Show recent sales
   - Display recent product updates
   - Activity timeline

4. **Notifications**
   - Low stock alerts
   - Important updates
   - System notifications

5. **Charts and Graphs**
   - Mini sales chart
   - Quick trend visualization
   - Performance indicators
