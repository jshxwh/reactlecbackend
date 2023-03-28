const Order = require("../models/order");

const Product = require("../models/product");

const ErrorHandler = require("../utils/errorHandler");

// Create a new order   =>  /api/v1/order/new

exports.newOrder = async (req, res, next) => {
  const {
    orderItems,

    shippingInfo,

    itemsPrice,

    taxPrice,

    shippingPrice,

    totalPrice,

    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,

    shippingInfo,

    itemsPrice,

    taxPrice,

    shippingPrice,

    totalPrice,

    paymentInfo,

    paidAt: Date.now(),

    user: req.user._id,
  });

  res.status(200).json({
    success: true,

    order,
  });
};

exports.getSingleOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  res.status(200).json({
    success: true,

    order,
  });
};

exports.myOrders = async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  // console.log(req.user)

  res.status(200).json({
    success: true,

    orders,
  });
};

exports.allOrders = async (req, res, next) => {
  const orders = await Order.find();

  // console.log(orders)

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,

    totalAmount,

    orders,
  });
};

exports.updateOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  order.orderItems.forEach(async (item) => {
    await updateStock(item.product, item.quantity);
  });

  (order.orderStatus = req.body.status), (order.deliveredAt = Date.now());

  await order.save();

  res.status(200).json({
    success: true,
  });
};

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock = product.stock - quantity;

  await product.save({ validateBeforeSave: false });
}

exports.deleteOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
};
