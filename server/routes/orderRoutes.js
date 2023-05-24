import express from 'express';
import Order from '../models/orderModel.js';
import { isAuth } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

const orderRouter = express.Router();

orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });

    const order = await newOrder.save();
    res.status(201).send({ message: 'New Order Created', order });
  })
);

orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

orderRouter.get(
  '/managenopayment',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ isPaid: false });
    res.send(orders);
  })
);

orderRouter.get(
  '/managecomplete',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ isPaid: true, isDelivered: true });
    const users = await User.find();
    res.send({ orders, users });
  })
);

orderRouter.get(
  '/manageaccept',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ isPaid: true, isDelivered: false });
    res.send(orders);
  })
);

orderRouter.put(
  '/update',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.user._id);
    if (order) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      const updatedOrder = await user.save();
      res.send({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

orderRouter.delete(
  '/deletenopay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    await Order.deleteMany({ isPaid: false });
    res.status(201).send({ message: `Đã xóa thành công` });
  })
);

orderRouter.delete(
  '/deletecomplete',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    await Order.deleteMany({ isPaid: true, isDelivered: true });
    res.status(201).send({ message: `Đã xóa thành công` });
  })
);

orderRouter.delete(
  '/delete/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    await Order.deleteOne({ _id: req.params.id });
    res.status(201).send({ message: `Đã xóa thành công giao dịch ${id}` });
  })
);

orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      for (let i = 0; i < order.orderItems.length; i++) {
        const data2 = await Product.findById(order.orderItems[i]._id);
        data2.countInStock = data2.countInStock - order.orderItems[i].quantity;
        data2.save();
      }

      const updatedOrder = await order.save();
      res.send({ mesage: 'Đã thanh toán đơn hàng', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Không tìm thấy đơn hàng' });
    }
  })
);

orderRouter.put(
  '/update/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      const updatedOrder = await order.save();
      res.send({ mesage: 'Đã xác nhận giao hàng', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Lỗi' });
    }
  })
);

export default orderRouter;
