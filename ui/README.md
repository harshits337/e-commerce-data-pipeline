# E-commerce Analytics Dashboard

A beautiful, real-time analytics dashboard built with **Next.js 15 App Router**, TypeScript, and Recharts for visualizing e-commerce data from Kafka and ClickHouse.

## ✨ Features

- 📊 **Real-time Analytics**: Live data visualization with automatic updates
- 🎨 **Dark Theme**: Beautiful black-themed UI with smooth animations
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- ⚡ **Next.js 15 App Router**: Modern file-based routing with app directory
- 🔄 **Time Range Filters**: Multiple time ranges (15min to 1 month)
- 📈 **Interactive Charts**: Combined bar and line charts with Recharts
- 🎯 **Key Metrics**: Orders, Product Views, Cart Events, and Average Order Value
- 🏃‍♂️ **Optimized Performance**: Bundle splitting and package optimization

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** 
- Your API server running on `http://localhost:8001`

### Installation

1. **Install dependencies:**
   ```bash
   cd ui
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and update the API URL if needed:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8001
   NODE_ENV=development
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Dashboard Features

### Time Range Filters
- **15 Minutes** - 30-second intervals
- **1 Hour** - 15-minute intervals  
- **12 Hours** - 30-minute intervals
- **1 Day** - 1-hour intervals
- **3 Days** - 6-hour intervals
- **7 Days** - 1-day intervals
- **14 Days** - 1-day intervals
- **1 Month** - 1-day intervals

### Metrics Displayed
1. **Total Orders** - Number of completed orders
2. **Product Views** - Product page views
3. **Cart Events** - Items added to cart
4. **Average Order Value** - Revenue per order

### Charts
- **Bar Charts**: Orders, Product Views, Cart Events
- **Line Chart**: Average Order Value trend
- **Interactive Tooltips**: Hover for detailed information
- **Responsive**: Adapts to screen size

### Additional Metrics
- **Conversion Rates**: View-to-cart and cart-to-order ratios
- **Data Summary**: Total data points and time buckets

## API Integration

The dashboard connects to your backend API at:
- **Endpoint**: `/api/v1/order-management/dashboard`
- **Parameters**: `?range={timeRange}`
- **Expected Response**:
  ```json
  {
    "message": "Dashboard data fetched successfully",
    "data": {
      "orderData": [...],
      "productViewData": [...], 
      "cartData": [...],
      "aovData": [...]
    },
    "summary": {
      "orderCount": 11,
      "productViewCount": 11,
      "cartCount": 11,
      "totalDataPoints": 33
    }
  }
  ```

## 📁 Project Structure (App Router)

```
ui/
├── app/                    # Next.js 15 App Router
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main dashboard page  
│   ├── globals.css        # Global styles
│   └── Dashboard.module.css
├── components/            # Reusable UI components
│   ├── StatsCard.tsx
│   ├── StatsCard.module.css
│   ├── TimeRangeFilter.tsx
│   ├── TimeRangeFilter.module.css
│   ├── AnalyticsChart.tsx
│   └── AnalyticsChart.module.css
├── services/              # API services
│   └── api.ts
├── types/                 # TypeScript definitions
│   └── dashboard.ts
├── next.config.js         # Next.js configuration
└── package.json
```

## 🛠 Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Charts**: Recharts
- **HTTP Client**: Axios  
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Styling**: CSS Modules (no Tailwind)
- **Optimization**: Bundle splitting, package optimization

## Design System

### Colors
- **Background**: `#0a0a0a` (Primary), `#1a1a1a` (Secondary)
- **Text**: `#ffffff` (Primary), `#b3b3b3` (Secondary)
- **Accent**: `#3b82f6` (Blue), `#10b981` (Green), `#f59e0b` (Orange), `#ef4444` (Red)

### Components
- **StatsCard**: Displays key metrics with icons
- **TimeRangeFilter**: Interactive time range selection
- **AnalyticsChart**: Combined bar and line chart
- **Responsive Layout**: Mobile-first design

## Troubleshooting

### Common Issues

1. **API Connection Error**
   - Ensure your backend is running on `http://localhost:8001`
   - Check CORS settings in your API
   - Verify the API endpoint is accessible

2. **No Data Displayed**
   - Check if there's data in your ClickHouse database
   - Verify Kafka messages are being processed
   - Test the API endpoint directly

3. **Chart Not Rendering**
   - Ensure all chart dependencies are installed
   - Check browser console for errors
   - Verify data format matches expected structure

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Set `NEXT_PUBLIC_API_URL` to your production API URL.

---

Built with ❤️ for real-time e-commerce analytics
