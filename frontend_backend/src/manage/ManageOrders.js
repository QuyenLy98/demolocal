import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Button from 'react-bootstrap/Button';
import Nopayment from './order/Nopayment';
import AcceptOrder from './order/AcceptOrder';
import CompleteOrder from './order/CompleteOrder';

export default function OrderHistoryScreen() {
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [type, setType] = useState();

  return (
    <div>
      <Helmet>
        <title>Quản lý giao dịch</title>
      </Helmet>
      <h4 className="text-center">QUẢN LÝ THÔNG TIN GIAO DỊCH</h4>
      <br />
      <Button
        variant="info"
        className="me-1"
        style={
          type === 'button1'
            ? {
                color: '#fff',
                backgroundColor: 'blue',
                fontSize: '25px',
                boxShadow: '0px 6px 4px #4F4557',
              }
            : {}
        }
        onClick={() => {
          setType('button1');
          setShow1(!show1);
        }}
      >
        Danh sách giao dịch chưa thanh toán
      </Button>
      <Button
        variant="warning"
        className="me-1"
        style={
          type === 'button2'
            ? {
                color: '#fff',
                backgroundColor: 'orange',
                fontSize: '25px',
                boxShadow: '0px 6px 4px #4F4557',
              }
            : {}
        }
        onClick={() => {
          setType('button2');
          setShow2(!show2);
        }}
      >
        Danh sách giao dịch đang xử lí
      </Button>
      <Button
        variant="success"
        style={
          type === 'button3'
            ? {
                color: '#fff',
                backgroundColor: 'green',
                fontSize: '25px',
                boxShadow: '0px 6px 4px #4F4557',
              }
            : {}
        }
        onClick={() => {
          setType('button3');
          setShow3(!show3);
        }}
      >
        Danh sách giao dịch hoàn tất
      </Button>
      <br />
      <br />
      {show1 && type === 'button1' && <Nopayment />}
      {show2 && type === 'button2' && <AcceptOrder />}
      {show3 && type === 'button3' && <CompleteOrder />}
    </div>
  );
}
