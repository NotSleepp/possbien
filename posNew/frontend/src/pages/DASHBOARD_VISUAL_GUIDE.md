# Dashboard Visual Guide

## Layout Overview

The dashboard is organized into three main sections:

### 1. Metrics Grid (Top Section)
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│   💰 Sales   │  📦 Products │  👥 Users    │  🛒 Orders   │
│   $45,231    │     350      │      45      │     128      │
│   ↗ +12.5%   │   ↗ +5.2%   │   ↘ -2.1%   │   ↗ +8.3%   │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**Features:**
- 4 metric cards in a responsive grid
- Each card shows: title, value, icon, subtitle, and trend
- Color-coded by metric type (blue, green, purple, orange)
- Trend indicators with up/down arrows
- Loading skeletons during data fetch

**Responsive Behavior:**
- Desktop (>1024px): 4 columns
- Tablet (640-1024px): 2 columns
- Mobile (<640px): 1 column (stacked)

### 2. Charts Section (Middle Section)
```
┌─────────────────────────────────────┬─────────────────┐
│  📈 Sales Chart (Area/Line)         │  📊 Quick Stats │
│                                     │                 │
│  [Interactive Chart with Tooltip]   │  Avg Sale: $353 │
│                                     │  Conv Rate: 68% │
│                                     │  Top Items: 24  │
│                                     │  New Users: 12  │
└─────────────────────────────────────┴─────────────────┘
```

**Sales Chart Features:**
- Area chart with gradient fill
- 7 days of sales data
- Interactive tooltip on hover
- Responsive container
- Grid and axis labels
- Custom styling

**Quick Stats Features:**
- Summary metrics in sidebar
- Key performance indicators
- Clean, minimal design
- Loading skeletons

**Responsive Behavior:**
- Desktop: 2/3 chart + 1/3 stats (side by side)
- Mobile: Stacked (chart on top, stats below)

### 3. Recent Activity Table (Bottom Section)
```
┌─────────────────────────────────────────────────────────────┐
│  📋 Recent Activity                                         │
├──────────┬─────────────────┬─────────┬──────────┬──────────┤
│ Activity │ Description     │ Amount  │ Status   │ Date     │
├──────────┼─────────────────┼─────────┼──────────┼──────────┤
│ 🛒 Sale  │ Venta #1234     │ $1,250  │ ✓ Done   │ 2m ago   │
│ 📦 Prod  │ Stock updated   │    -    │ ✓ Done   │ 15m ago  │
│ 💰 Pay   │ Payment #5678   │ $3,400  │ ⏳ Proc  │ 1h ago   │
│ 👤 User  │ New user added  │    -    │ ✓ Done   │ 2h ago   │
│ 🛒 Sale  │ Venta #1230     │   $890  │ ✗ Cancel │ 3h ago   │
└──────────┴─────────────────┴─────────┴──────────┴──────────┘
```

**Features:**
- Full-width responsive table
- Activity type icons
- Status badges (color-coded)
- Amount formatting
- Hover effects on rows
- Loading skeletons
- Empty state handling

**Status Badge Colors:**
- ✓ Completed: Green
- ⏳ Processing: Blue
- ⚠ Pending: Yellow
- ✗ Cancelled: Red

## Color Scheme

### Metric Cards
- **Blue** (Sales): Primary business metric
- **Green** (Products): Inventory/stock related
- **Purple** (Users): User engagement
- **Orange** (Orders): Transaction volume

### Chart
- **Primary Line/Area**: Blue (#3b82f6)
- **Gradient Fill**: Blue with opacity fade
- **Grid**: Light gray (#e5e7eb)
- **Tooltip**: White background with shadow

### Activity Types
- **Sale** 🛒: Green icon
- **Product** 📦: Blue icon
- **User** 👤: Purple icon
- **Payment** 💰: Orange icon

## Interactive Elements

### Hover States
- Metric cards: Subtle shadow increase
- Table rows: Light gray background
- Chart points: Enlarged dots with tooltip

### Loading States
- Skeleton screens with pulse animation
- Smooth transition to loaded content
- Consistent loading experience

### Responsive Behavior
- Smooth transitions between breakpoints
- Touch-friendly on mobile
- Optimized for all screen sizes

## Data Flow

```
DashboardPage (Container)
    ↓
    ├─→ useEffect (Fetch Data)
    │       ↓
    │   [API Call Simulation]
    │       ↓
    │   setState (metrics, chart, activities)
    │
    ├─→ MetricCard × 4 (Metrics Grid)
    │       ↓
    │   Display: value, trend, icon
    │
    ├─→ SalesChart (Visualization)
    │       ↓
    │   Recharts: Area/Line chart
    │
    └─→ RecentActivity (Table)
            ↓
        Display: activities with status
```

## Mock Data Structure

### Metrics
```javascript
{
  totalSales: {
    value: '$45,231',
    trend: { value: 12.5, isPositive: true }
  },
  totalProducts: {
    value: '350',
    trend: { value: 5.2, isPositive: true }
  },
  // ...
}
```

### Sales Chart Data
```javascript
[
  { name: 'Lun', ventas: 4200 },
  { name: 'Mar', ventas: 3800 },
  // ...
]
```

### Activities
```javascript
[
  {
    id: 1,
    type: 'sale',
    title: 'Nueva Venta',
    description: 'Venta #1234',
    amount: 1250,
    status: 'completed',
    date: '2 min ago'
  },
  // ...
]
```

## Customization Points

### Easy to Modify
1. **Metric Cards**: Add/remove cards, change colors
2. **Chart Type**: Switch between 'area' and 'line'
3. **Activity Types**: Add new types with icons
4. **Status Types**: Add new statuses with colors
5. **Time Periods**: Change chart data range

### API Integration
Replace mock data with real API calls:
```javascript
// Example
const fetchDashboardData = async () => {
  const metrics = await api.get('/dashboard/metrics');
  const sales = await api.get('/dashboard/sales');
  const activities = await api.get('/dashboard/activities');
  
  setMetricsData(metrics.data);
  setSalesChartData(sales.data);
  setRecentActivities(activities.data);
};
```

## Accessibility Features

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly
- Color contrast compliance
- Focus indicators

## Performance Considerations

- Recharts uses canvas for efficient rendering
- Lazy loading can be added for heavy components
- Memoization for expensive calculations
- Pagination for large activity lists
- Debounced updates for real-time data

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for all screen sizes
- Touch-friendly on mobile devices
- Graceful degradation for older browsers
