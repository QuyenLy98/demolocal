import express from 'express';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { generateToken, isAuth } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

const userRouter = express.Router();

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
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

userRouter.get(
  '/manage',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find();
    res.send(users);
  })
);

userRouter.delete(
  '/delete/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    await User.deleteOne({ _id: id });
    await Order.deleteMany({ user: id });
    res.status(201).send({ message: `Đã xóa thành công ${id}` });
  })
);

userRouter.get(
  '/admin',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const count_admin = await User.find({ isAdmin: true }).count();
    const count_user = await User.find({ isAdmin: false }).count();
    const count_category = await (await Product.distinct('category')).length;
    const count_product = await Product.find().count();
    const count_order1 = await Order.find({ isPaid: false }).count();
    const count_order2 = await Order.find({
      isPaid: true,
      isDelivered: false,
    }).count();
    const count_order3 = await Order.find({
      isPaid: true,
      isDelivered: true,
    }).count();
    res.status(201).send({
      count_admin,
      count_user,
      count_category,
      count_product,
      count_order1,
      count_order2,
      count_order3,
    });
  })
);

export default userRouter;
