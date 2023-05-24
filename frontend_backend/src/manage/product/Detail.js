import React, { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

const changedatetime = (data) => {
  const date = new Date(data);
  return (
    date.getHours() +
    ':' +
    date.getMinutes() +
    ':' +
    date.getSeconds() +
    ' ' +
    date.getDate() +
    '-' +
    (date.getMonth() + 1) +
    '-' +
    date.getFullYear() +
    ' '
  );
};

export default function Detail() {
  const params = useParams();
  const { id: productId } = params;
  const [arr, setArr] = useState([]);
  useEffect(() => {
    const fetchOrder = async () => {
      let a = [];
      try {
        await axios
          .get(`/api/products/${productId}`)
          .then((data) => (a = data.data));
        setArr(a);
      } catch (err) {
        toast.error('Lỗi');
      }
    };
    fetchOrder();
  }, [productId]);

  const navigate = useNavigate();

  return (
    <div>
      <Helmet>
        <title>Chi tiết sản phẩm</title>
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
      <h1>Mã sản phẩm : {arr._id}</h1>
      <Row>
        <Col md={6}>
          <h3>
            Tên sản phẩm: <b>{arr.name}</b>
          </h3>
          <h4>
            Thương hiệu: <Badge>{arr.brand}</Badge>
          </h4>
          <h4>
            Giá: {arr.price}
            <i className="fa-solid fa-dollar-sign"></i>
          </h4>
          <h4>
            Số lượng còn lại:{' '}
            {arr.countInStock > 0
              ? arr.countInStock
              : arr.countInStock + ' (Đã hết hàng)'}
          </h4>
          <h4>
            Đánh giá: {arr.rating}
            <i className="fa-solid fa-star text-success"></i>
          </h4>
          <h4>Số lượt đánh giá: {arr.numReviews}</h4>
          <h4>Mặt hàng: {arr.category}</h4>
          <br />
          <h5>Thời gian tạo: {changedatetime(arr.createdAt)}</h5>
          <h5>Thời gian cập nhật: {changedatetime(arr.updatedAt)}</h5>
        </Col>
        <Col md={6}>
          <h4 className="text-center">Hình ảnh</h4>
          <img className="img-large" src={arr.image} alt={arr.name}></img>
        </Col>
      </Row>
    </div>
  );
}
