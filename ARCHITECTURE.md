# Camera Online Store - Architecture & Implementation Guide

## Overview

This camera online store frontend is built with a clean, scalable architecture that separates concerns into **Services**, **APIs**, and **Mock Data**. This allows for easy development with mock data and seamless switching to real backend API calls once the backend is ready.

## Architecture Pattern

### Layer Structure: Service → API → Mock Data (soon: Real API)

```
┌─────────────────────────────────────────────────────┐
│           React Components / Pages                  │
│          (ProductCard, HomePage, etc.)              │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│            Service Layer (Business Logic)           │
│      (productService, categoryService, etc.)        │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│            API Layer (Data Access)                  │
│        (productApi, categoryApi, etc.)              │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                    ▼
   ┌─────────────┐    ┌──────────────┐
   │ Mock Data   │    │ Real API     │
   │ (Current)   │    │ (Backend)    │
   └─────────────┘    └──────────────┘
```

## Domains

### 1. **Product Domain** (`/src/domains/product`)

Manages product catalog, listings, details, and product-related operations.

**Files:**

- `api/productApi.js` - Product API with mock data
- `services/productService.js` - Business logic for product operations
- `mockData/products.js` - Mock product data
- `index.js` - Exports for easy importing

**Usage:**

```javascript
import productService from "@/domains/product/services/productService";

// Get all products
const products = await productService.getProducts();

// Get featured products
const featured = await productService.getFeaturedProducts(6);

// Get flash sale products
const flashSale = await productService.getFlashSaleProducts();

// Search products
const results = await productService.searchProducts("camera");

// Get products by category
const categoryProducts = await productService.getProductsByCategory(1);
```

### 2. **Category Domain** (`/src/domains/category`)

Manages product categories.

**Files:**

- `api/categoryApi.js` - Category API with mock data
- `services/categoryService.js` - Business logic for category operations
- `mockData/categories.js` - Mock category data
- `index.js` - Exports for easy importing

**Usage:**

```javascript
import categoryService from "@/domains/category/services/categoryService";

// Get all categories
const categories = await categoryService.getCategories();

// Get category by ID
const category = await categoryService.getCategoryById(1);

// Get category by slug
const category = await categoryService.getCategoryBySlug("dslr-cameras");
```

### 3. **Cart Domain** (`/src/domains/cart`)

Manages shopping cart state and operations.

**Files:**

- `api/cartApi.js` - Cart API with mock data
- `services/cartService.js` - Business logic for cart operations
- `context/CartContext.jsx` - React Context for global cart state
- `mockData/cart.js` - Mock cart data
- `index.js` - Exports for easy importing

**Usage with Context:**

```javascript
import { useCart } from '@/domains/cart/context/CartContext';

function MyComponent() {
  const { cart, addToCart, removeFromCart, updateCartItem } = useCart();

  // Add to cart
  await addToCart(product, quantity);

  // Update quantity
  await updateCartItem(cartItemId, newQuantity);

  // Remove item
  await removeFromCart(cartItemId);

  // Access cart data
  console.log(cart.items);      // Cart items
  console.log(cart.total);      // Total price
  console.log(cart.itemCount);  // Number of items
}
```

**Note:** CartProvider must wrap your application (already added in App.jsx)

### 4. **Order Domain** (`/src/domains/order`)

Manages orders and order-related operations.

**Files:**

- `api/order.api.js` - Order API with mock data
- `services/order.service.js` - Business logic for order operations
- `mockData/orders.js` - Mock order data
- `index.js` - Exports for easy importing

**Usage:**

```javascript
import orderService from "@/domains/order/services/order.service";

// Get user orders
const orders = await orderService.getUserOrders(userId);

// Get order by ID
const order = await orderService.getOrderById(orderId);

// Create new order
const newOrder = await orderService.createOrder(orderData);

// Update order status
await orderService.updateOrderStatus(orderId, "processing");

// Cancel order
await orderService.cancelOrder(orderId);

// Track order
const trackedOrder = await orderService.trackOrder(trackingNumber);
```

## How to Switch from Mock Data to Real API

When your backend is ready, follow these steps:

### Step 1: Update the API layer

Instead of returning mock data, call your real backend API:

**Example: Before (Mock Data)**

```javascript
// src/domains/product/api/productApi.js
const productApi = {
  getAllProducts: async (filters = {}) => {
    await apiDelay(); // simulate network delay
    let products = [...mockProducts]; // Use mock data
    // ... filtering logic
    return { data: products };
  },
};
```

**Example: After (Real API)**

```javascript
// src/domains/product/api/productApi.js
import { apiClient } from "@/core/api";

const productApi = {
  getAllProducts: async (filters = {}) => {
    const response = await apiClient.get("/products", { params: filters });
    return response.data;
  },
};
```

### Step 2: Ensure Service Layer Stays Unchanged

The service layer should remain the same because it only calls the API layer:

```javascript
// src/domains/product/services/productService.js
// This doesn't need to change!
import productApi from "@/domains/product/api/productApi";

const productService = {
  getProducts: async (filters = {}) => {
    const response = await productApi.getAllProducts(filters);
    return response.data;
  },
};
```

### Step 3: Components Keep Working

All components that use the service will automatically work with the real API:

```javascript
// src/apps/customer/features/product/pages/ProductListingPage.jsx
import productService from "@/domains/product/services/productService";

// This component doesn't change - it automatically uses the real API now!
const products = await productService.getProducts();
```

## API Response Format

All APIs and mock data follow a consistent response format:

```javascript
// Successful Response
{
  data: [...],        // The actual data (array or object)
  total: 0,           // Total count (for lists)
  page: 1,            // Current page
  limit: 10           // Items per page
}

// Error Response (thrown as Error)
throw new Error('Error message here');
```

## Features Implemented

### ✅ Features Currently Available

1. **Product Management**
   - Browse all products
   - View product details with images
   - Product search
   - Filter by category
   - Filter by price range
   - Sort by price, rating, or newest
   - Related products

2. **Category Management**
   - View all categories
   - Filter products by category
   - Category navigation

3. **Shopping Cart**
   - Add products to cart
   - Update product quantity
   - Remove items from cart
   - Clear entire cart
   - View cart summary
   - Real-time cart count in header

4. **User Interface**
   - Responsive product cards
   - Flash sale section with countdown timer
   - Featured products section
   - Product listing with filters
   - Shopping cart page
   - Search functionality

### 🚀 Features to Implement

1. **Order Management**
   - Create orders from cart
   - Order history
   - Order tracking
   - Order cancellation

2. **Checkout Process**
   - Shipping address form
   - Payment method selection
   - Order review
   - Order confirmation

3. **User Management**
   - User registration
   - User login
   - User profile
   - Order history

4. **Admin Functions**
   - Product management
   - Category management
   - Order management
   - User management

## Mock Data Structure

### Products Mock Data

```javascript
{
  id: 1,
  name: 'Product Name',
  categoryId: 1,
  price: 1999,
  originalPrice: 2499,
  discount: 20,
  rating: 4.5,
  reviews: 100,
  image: 'url',
  images: ['url1', 'url2'],
  description: '...',
  specifications: { /*...*/ },
  inStock: true,
  quantity: 50,
  isFeatured: true,
  isFlashSale: true
}
```

### Categories Mock Data

```javascript
{
  id: 1,
  name: 'Category Name',
  description: '...',
  imageUrl: 'url',
  productCount: 15,
  slug: 'category-slug'
}
```

### Cart Mock Data

```javascript
{
  id: 'cart-1',
  userId: 'user-1',
  items: [
    {
      id: 'item-1',
      productId: 1,
      product: { /*product data*/ },
      quantity: 2,
      price: 1999,
      subtotal: 3998,
      addedAt: 'timestamp'
    }
  ],
  total: 3998,
  itemCount: 2,
  createdAt: 'timestamp',
  updatedAt: 'timestamp'
}
```

### Orders Mock Data

```javascript
{
  id: 'ORD-001',
  userId: 'user-1',
  orderNumber: '#1001',
  status: 'delivered',
  items: [/*...*/],
  subtotal: 3899,
  shippingFee: 50,
  tax: 310,
  total: 4259,
  shippingAddress: {
    fullName: '...',
    phone: '...',
    address: '...',
    /*...*/
  },
  paymentMethod: 'credit_card',
  paymentStatus: 'paid',
  trackingNumber: '...',
  createdAt: 'timestamp',
  updatedAt: 'timestamp',
  estimatedDelivery: 'date'
}
```

## Deployment Checklist

- [ ] Backend API endpoints implemented
- [ ] Update API layer with real endpoints
- [ ] Update environment variables (VITE_API_BASE_URL)
- [ ] Test all features with real API
- [ ] Remove mock data files (optional, can keep for testing)
- [ ] Add error handling for API failures
- [ ] Implement pagination for large datasets
- [ ] Add loading states for all API calls
- [ ] Implement proper authentication/authorization
- [ ] Add analytics and monitoring

## Troubleshooting

### Products not loading?

1. Check if mock data files exist
2. Verify import paths are correct
3. Check console for error messages
4. Ensure CartProvider wraps the app

### Cart not persisting?

- Currently mock data is stored in memory. To persist:
  - Store cart data in localStorage
  - Or implement backend persistence

### Images not loading?

- It's because image paths in mock data don't exist
- Replace with real image URLs from your backend or image service

## File Structure Summary

```
src/domains/
├── product/
│   ├── api/productApi.js
│   ├── services/productService.js
│   ├── mockData/products.js
│   └── index.js
├── category/
│   ├── api/categoryApi.js
│   ├── services/categoryService.js
│   ├── mockData/categories.js
│   └── index.js
├── cart/
│   ├── api/cartApi.js
│   ├── services/cartService.js
│   ├── context/CartContext.jsx
│   ├── mockData/cart.js
│   └── index.js
└── order/
    ├── api/order.api.js
    ├── services/order.service.js
    ├── mockData/orders.js
    └── index.js
```

## Next Steps

1. **Run the application:** `npm run dev`
2. **Explore the features:** Visit homepage, browse products, add to cart
3. **Test the mock data:** Everything works with mock data out of the box
4. **When backend is ready:** Update API layer as described above
5. **Deploy:** Build and deploy to production

---

**Architecture Pattern:** Service → API → Mock Data/Real API  
**Status:** ✅ MVP Ready with Mock Data  
**Last Updated:** March 2024
