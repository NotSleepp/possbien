# Dashboard Components

This directory contains specialized components for the dashboard page.

## Components

### SalesChart

A responsive chart component for visualizing sales data over time.

**Features:**
- Supports both line and area chart types
- Responsive design using recharts
- Custom tooltip with formatted values
- Loading skeleton state
- Empty state handling
- Gradient fill for area charts

**Usage:**
```jsx
import SalesChart from '../components/dashboard/SalesChart';

const data = [
  { name: 'Lun', ventas: 4200 },
  { name: 'Mar', ventas: 3800 },
  // ...
];

<SalesChart 
  data={data} 
  type="area"
  isLoading={false}
/>
```

**Props:**
- `data` (Array): Array of objects with `name` and `ventas` properties
- `type` (String): Chart type - 'line' or 'area' (default: 'area')
- `isLoading` (Boolean): Loading state

### RecentActivity

A table component displaying recent activities and transactions.

**Features:**
- Responsive table layout
- Activity type icons
- Status badges
- Loading skeleton state
- Empty state handling
- Hover effects

**Usage:**
```jsx
import RecentActivity from '../components/dashboard/RecentActivity';

const activities = [
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
];

<RecentActivity 
  activities={activities}
  isLoading={false}
/>
```

**Props:**
- `activities` (Array): Array of activity objects
- `isLoading` (Boolean): Loading state

**Activity Object Structure:**
```typescript
{
  id: string | number,
  type: 'sale' | 'product' | 'user' | 'payment',
  title: string,
  description: string,
  amount: number | null,
  status: 'completed' | 'pending' | 'cancelled' | 'processing',
  date: string
}
```

## Integration

These components are used in the `DashboardPage` component to create a comprehensive dashboard view with:
- Key metrics (using MetricCard from ui/)
- Sales visualization (SalesChart)
- Recent activity tracking (RecentActivity)
- Quick stats summary

## Dependencies

- `recharts`: For chart visualization
- `react-icons`: For activity type icons
- `Badge` component: For status indicators

## Future Enhancements

- Real-time data updates
- Date range filtering
- Export functionality
- More chart types (bar, pie, etc.)
- Activity filtering and search
- Pagination for activities
