import express from 'express';
import Product from '../models/productModel.js';
import expressAsyncHandler from 'express-async-handler';
import to_slug from './slug.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

productRouter.get('/showproducts', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

const PAGE_SIZE = 3;

productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const brand = query.brand || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            //1-50
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })

      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });

    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
  })
);

productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

productRouter.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

productRouter.get('/cate/:x', async (req, res) => {
  if (req.params.x === 'aaa') {
    res.send('Chưa gửi dữ liệu');
  } else {
    const pro = await Product.find({ category: req.params.x });
    if (pro) {
      //console.log(req.params.x);
      res.send({ pro });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  }
});

productRouter.post(
  '/addproduct',
  expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
      name: req.body.name,
      slug: to_slug(req.body.name),
      image: req.body.image,
      brand: req.body.brand,
      description: req.body.description,
      price: req.body.price,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      category: req.body.category,
    });
    const product = await newProduct.save();
    return res.send({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      brand: product.brand,
      description: product.description,
      price: product.price,
      countInStock: product.countInStock,
      rating: product.rating,
      numReviews: product.numReviews,
      category: product.category,
    });
  })
);

productRouter.delete(
  '/delete/:id',
  expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    await Product.deleteOne({ _id: id });
    res.status(201).send({ message: `Đã xóa thành công ${id}` });
  })
);

productRouter.put(
  '/update/:id',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    product.name = req.body.name;
    product.slug = to_slug(req.body.name);
    product.image = req.body.image;
    product.brand = req.body.brand;
    product.description = req.body.description;
    product.price = req.body.price;
    product.countInStock = req.body.countInStock;
    product.rating = req.body.rating;
    product.numReviews = req.body.numReviews;
    product.category = req.body.category;
    const updatedProduct = await product.save();
    res.send({
      id: updatedProduct._id,
      name: updatedProduct.name,
      slug: updatedProduct.slug,
      image: updatedProduct.image,
      brand: updatedProduct.brand,
      description: updatedProduct.description,
      price: updatedProduct.price,
      countInStock: updatedProduct.countInStock,
      rating: updatedProduct.rating,
      numReviews: updatedProduct.numReviews,
      category: updatedProduct.category,
    });
  })
);

export default productRouter;
