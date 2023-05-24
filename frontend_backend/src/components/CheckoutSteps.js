import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function CheckoutSteps(props) {
  return (
    <Row className="checkout-steps">
      <Col className={props.step1 ? 'active' : ''}>Đăng nhập</Col>
      <Col className={props.step2 ? 'active' : ''}>Đang chuyển hàng</Col>
      <Col className={props.step3 ? 'active' : ''}>Phương thức thanh toán</Col>
      <Col className={props.step4 ? 'active' : ''}>Xác thực thanh toán</Col>
    </Row>
  );
}
