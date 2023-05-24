import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { getError } from '../../utils';

export default function UpdateProduct({ cate }) {
  const params = useParams();
  const { id: productId } = params;
  //const [arr, setArr] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      let a = [];
      try {
        await axios
          .get(`/api/products/${productId}`)
          .then((data) => (a = data.data));

        //setArr(a);
        setName(a.name);
        setImage(a.image);
        setBrand(a.brand);
        setDescription(a.description);
        setPrice(a.price);
        setCountInStock(a.countInStock);
        setRating(a.rating);
        setNumReviews(a.numReviews);
        setCategory(a.category);
      } catch (err) {
        toast.error('Lỗi');
      }
    };
    fetchOrder();
    // return () => {  //hàm clean up
    //   console.log(
    //     name,
    //     image,
    //     brand,
    //     description,
    //     price,
    //     countInStock,
    //     rating,
    //     numReviews,
    //     category
    //   );
    // };
  }, [productId]);

  const navigate = useNavigate();
  const [name, setName] = useState();
  const [image, setImage] = useState();
  const [brand, setBrand] = useState();
  const [description, setDescription] = useState();
  const [price, setPrice] = useState();
  const [countInStock, setCountInStock] = useState();
  const [rating, setRating] = useState();
  const [numReviews, setNumReviews] = useState();
  const [category, setCategory] = useState();

  const submitHandler = async (e) => {
    e.preventDefault();
    let b = [];
    try {
      await axios
        .put(`/api/products/update/${productId}`, {
          name,
          image,
          brand,
          description,
          price,
          countInStock,
          rating,
          numReviews,
          category,
        })
        .then((update) => (b = update));
      toast.success('Cập nhật thành công');
      return navigate('/admin/productlist');
      //Điều hướng ???
    } catch (err) {
      toast.error(getError(err));
    }
    //setArr(b);
    setName(b.name);
    setImage(b.image);
    setBrand(b.brand);
    setDescription(b.description);
    setPrice(b.price);
    setCountInStock(b.countInStock);
    setRating(b.rating);
    setNumReviews(b.numReviews);
    setCategory(b.category);
  };

  return (
    <div>
      <Helmet>
        <title>Cập nhật sản phẩm</title>
      </Helmet>
      <Button
        variant="info"
        type="button"
        onClick={() => {
          navigate(`/admin/productlist`);
        }}
      >
        <i className="fa-solid fa-backward"> back</i>
      </Button>
      <h1>Mã sản phẩm : {`${productId}`}</h1>
      <Container className="small-container">
        <Row>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Tên sản phẩm</Form.Label>
              <Form.Control
                type="text"
                required
                value={name || ''}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="brand">
              <Form.Label>Thương hiệu</Form.Label>
              <Form.Control
                type="text"
                required
                value={brand || ''}
                onChange={(e) => setBrand(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                type="textarea"
                required
                value={description || ''}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Giá</Form.Label>
              <Form.Control
                type="number"
                required
                min="1"
                value={price || ''}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="countInStock">
              <Form.Label>Số lượng trong kho</Form.Label>
              <Form.Control
                type="number"
                required
                min="1"
                value={countInStock || ''}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="rating">
              <Form.Label>Đánh giá</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="5"
                required
                value={rating || ''}
                onChange={(e) => setRating(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="numReviews">
              <Form.Label>Số lượt đánh giá</Form.Label>
              <Form.Control
                type="number"
                required
                min="0"
                value={numReviews || ''}
                onChange={(e) => setNumReviews(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="image" className="mb-3">
              <Form.Label>URL ảnh</Form.Label>
              <Form.Control
                type="text"
                required
                value={image || ''}
                onChange={(e) => {
                  setImage(e.target.value);
                }}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="category">
                  <Form.Group className="mb-3">
                    <Form.Label>Danh mục sản phẩm</Form.Label>
                    <Form.Select
                      defaultValue=""
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="" disabled>
                        Chọn danh mục
                      </option>
                      {cate.map((ca, index) => (
                        <option
                          key={index}
                          value={ca}
                          selected={ca === category ? true : false}
                        >
                          {ca}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Form.Group>
              </Col>
            </Row>
            <div className="mb-3">
              <Button type="submit" variant="primary" className="me-5">
                Cập nhật sản phẩm
              </Button>
            </div>
          </Form>
        </Row>
      </Container>
    </div>
  );
}
