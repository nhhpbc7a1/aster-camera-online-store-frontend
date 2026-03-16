import { mockOrders } from "@/domains/order/mockData/orders";

const apiDelay = () => new Promise((resolve) => setTimeout(resolve, 300));

// In-memory storage for orders
let orderStore = [...mockOrders];

const orderApi = {
  // Get all orders for user
  getUserOrders: async (userId) => {
    await apiDelay();

    const userOrders = orderStore.filter((order) => order.userId === userId);

    return {
      data: userOrders,
      total: userOrders.length,
    };
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    await apiDelay();

    const order = orderStore.find((o) => o.id === orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    return { data: order };
  },

  // Create new order
  createOrder: async (orderData) => {
    await apiDelay();

    const newOrder = {
      id: `ORD-${Date.now()}`,
      orderNumber: `#${Math.floor(Math.random() * 10000) + 1000}`,
      status: "pending",
      paymentStatus: "pending",
      trackingNumber: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...orderData,
    };

    orderStore.push(newOrder);

    return { data: newOrder };
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    await apiDelay();

    const order = orderStore.find((o) => o.id === orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();

    return { data: order };
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    await apiDelay();

    const order = orderStore.find((o) => o.id === orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    if (["delivered", "cancelled", "completed"].includes(order.status)) {
      throw new Error(`Cannot cancel order with status: ${order.status}`);
    }

    order.status = "cancelled";
    order.updatedAt = new Date().toISOString();

    return { data: order };
  },

  // Track order
  trackOrder: async (trackingNumber) => {
    await apiDelay();

    const order = orderStore.find((o) => o.trackingNumber === trackingNumber);
    if (!order) {
      throw new Error("Order not found");
    }

    return { data: order };
  },
};

export default orderApi;
