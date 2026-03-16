# Quick Start Guide

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Running Development Server

```bash
npm run dev
```

The app will run on `http://localhost:5173` (or next available port)

## 📋 What You Can Do Now

### 1. Browse Products

- Visit the home page to see featured products
- Click on any product card to view details
- Use the category navigation to filter by category

### 2. Search Products

- Use the search bar at the top
- Search by product name or description

### 3. Shopping Cart

- Add products to cart from product pages or home page
- Cart count updates in the header
- Visit `/cart` to manage your cart
- Update quantities or remove items

### 4. Product Filters

- Filter by price range
- Sort by price (asc/desc), rating, or newest
- Filter by category

## 🏗️ Architecture

### Three-Layer Architecture:

1. **Service Layer** - Business logic (e.g., `productService.getProducts()`)
2. **API Layer** - Data access (e.g., `productApi.getAllProducts()`)
3. **Mock Data** - Temporary data source (e.g., `mockProducts`)

### Key Files (Mock Data):

- `src/domains/product/mockData/products.js` - Product list
- `src/domains/category/mockData/categories.js` - Categories
- `src/domains/order/mockData/orders.js` - Sample orders
- `src/domains/cart/mockData/cart.js` - Cart template

## 📁 Project Structure

```
src/
├── domains/                 # Business domain modules
│   ├── product/            # Product management
│   ├── category/           # Category management
│   ├── cart/               # Shopping cart
│   └── order/              # Order management
│
├── apps/
│   └── customer/           # Customer-facing app
│       ├── features/       # Feature modules
│       ├── layout/         # Layout components
│       └── routes/         # Route configuration
│
├── core/                   # Core utilities
│   ├── api/               # API client
│   └── auth/              # Authentication
│
└── public/                # Public components
    └── auth/              # Auth pages
```

## 🔧 Using Services

### Get Products

```javascript
import productService from "@/domains/product/services/productService";

const products = await productService.getProducts();
const featured = await productService.getFeaturedProducts(6);
const flashSale = await productService.getFlashSaleProducts();
const results = await productService.searchProducts("camera");
```

### Get Categories

```javascript
import categoryService from "@/domains/category/services/categoryService";

const categories = await categoryService.getCategories();
const category = await categoryService.getCategoryById(1);
```

### Use Cart

```javascript
import { useCart } from '@/domains/cart/context/CartContext';

function MyComponent() {
  const { cart, addToCart, removeFromCart, updateCartItem } = useCart();

  // Add to cart
  await addToCart(product, 2);
}
```

## 🎨 Available Routes

- `/` - Home page
- `/category/:categorySlug` - Category view (e.g., `/category/dslr-cameras`)
- `/search?q=keyword` - Search results
- `/product/:productId` - Product detail (e.g., `/product/1`)
- `/cart` - Shopping cart

## 💡 Key Components

### ProductCard

Displays a product in a card format. Used in listings and home page.

### FlashSale

Shows flash sale products with countdown timer.

### ProductSection

Generic section to display products by title.

### ProductListingPage

Full product listing with filters and sorting.

### ProductDetailPage

Single product detail view with related products.

### CartPage

Shopping cart management.

## 🔄 Switching to Real API

When backend is ready:

1. **Update API file** (e.g., `src/domains/product/api/productApi.js`)

   ```javascript
   // Before: return mockData
   // After: return apiClient.get('/products')
   ```

2. **Service layer stays the same** - no changes needed!

3. **Components automatically work** with real API!

See `ARCHITECTURE.md` for detailed migration guide.

## 📝 Notes

- Mock data simulates 300ms network delay
- Cart data is stored in memory (not persisted)
- Images use placeholder paths
- Authentication is scaffolded but not fully implemented

## 🐛 Troubleshooting

**Components not rendering?**

- Ensure CartProvider is in App.jsx ✓

**Images not showing?**

- Mock data has placeholder URLs - this is expected

**Cart not updating?**

- Check browser console for errors
- Verify CartProvider wraps your component

**Search not working?**

- Make sure to press Enter or click search button
- Try searching for product names in mock data

## 📚 Documentation

- See `ARCHITECTURE.md` for detailed architecture guide
- Check individual service files for all available methods
- Component files have comments explaining functionality

## 🎯 Next Steps

1. ✅ Explore the UI
2. ✅ Add products to cart
3. ✅ Try different filters
4. 🔜 Implement checkout process
5. 🔜 Connect to real backend API

---

Happy coding! 🚀
