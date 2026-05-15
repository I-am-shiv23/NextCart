const Order = require("../model/order");
const sendEmail = require("../utils/sendEmail");
const createOrder = async (req, res) => {
  try {
    const { items, products, totalAmount, address, paymentId } = req.body;
    const orderItems = products || items;

    if (!orderItems || orderItems.length === 0 || !totalAmount || !address) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const normalizedProducts = orderItems.map((item) => ({
      product: item.product || item._id,
      quantity: Number(item.quantity) || 1,
    }));

    if (normalizedProducts.some((item) => !item.product)) {
      return res.status(400).json({ message: "Invalid order products" });
    }

    const order = new Order({
      user: req.user._id,
      products: normalizedProducts,
      totalAmount,
      address,
      paymentId,
    });
    await order.save();

    const shippingAddress = `${address.fullName}, ${address.street}, ${address.city}, ${address.postalCode}, ${address.country}`;
    const message = `Dear ${req.user.name},\n\nThank you for your order. Your order has been successfully created.\n\nOrder ID: ${order._id}\nTotal Amount: $${totalAmount}\nShipping Address: ${shippingAddress}\n\nWe will notify you once your order is shipped.\n\nBest regards,\nNexCart Team`;

    await sendEmail(req.user.email, "Order Created", message);
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "products.product",
      "name price imageUrl",
    );
    res.json(orders);
  } catch (error) {
     console.log(error);
    res.status(500).json({ message: "Error fatching orders", error });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "id name email")
      .populate("products.product", "name price imageUrl");
    res.json(orders);
  } catch (error) {
   
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = status;
      await order.save();
      res.json({ message: "Order status updated", order });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error });
  }
};
module.exports = {
  createOrder,
  myOrders,
  getOrders,
  updateOrderStatus,
};
