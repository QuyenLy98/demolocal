import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function AddProduct({ cate }) {
  const [ex, setEx] = useState(''); //thêm danh mục
  const [cat, setCat] = useState(cate); // thêm mảng danh mục

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [rating, setRating] = useState('');
  const [numReviews, setNumReviews] = useState('');
  const [category, setCategory] = useState('');

  const handleAdd = () => {
    setCat((prev) => [...prev, ex]);
    setEx('');
  };

  const submitHandler = async (e) => {
    try {
      await axios.post('/api/products/addproduct', {
        name,
        image,
        brand,
        description,
        price,
        countInStock,
        rating,
        numReviews,
        category,
      });
      toast.success('Thêm thành công sản phẩm');
    } catch (err) {
      toast.error('Lỗi');
    }
  };

  return (
    <div>
      <h4 className="text-center mt-5 mb-3">Thêm sản phẩm</h4>
      <Container className="small-container">
        <Row>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Tên sản phẩm</Form.Label>
              <Form.Control
                type="text"
                required
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="brand">
              <Form.Label>Thương hiệu</Form.Label>
              <Form.Control
                type="text"
                required
                onChange={(e) => setBrand(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                type="textarea"
                required
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Giá</Form.Label>
              <Form.Control
                type="number"
                required
                min="1"
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="countInStock">
              <Form.Label>Số lượng trong kho</Form.Label>
              <Form.Control
                type="number"
                required
                min="1"
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
                onChange={(e) => setRating(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="numReviews">
              <Form.Label>Số lượt đánh giá</Form.Label>
              <Form.Control
                type="number"
                required
                min="0"
                onChange={(e) => setNumReviews(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="image" className="mb-3">
              <Form.Label>URL ảnh</Form.Label>
              <Form.Control
                type="text"
                required
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
                    <Form.Select onChange={(e) => setCategory(e.target.value)}>
                      {cat.map((ca, index) => (
                        <option key={index} value={ca}>
                          {ca}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mt-1" controlId="category">
                  <Form.Label>Tạo danh mục mới</Form.Label>
                  <input
                    value={ex}
                    onChange={(e) => setEx(e.target.value)}
                    type="text"
                  />
                  <Button
                    variant="secondary"
                    className="ms-2"
                    onClick={handleAdd}
                  >
                    Thêm
                  </Button>
                </Form.Group>
              </Col>
            </Row>
            <div className="mb-3">
              <Button type="submit" variant="primary" className="me-5">
                Thêm sản phẩm
              </Button>
            </div>
          </Form>
        </Row>
      </Container>
    </div>
  );
}
