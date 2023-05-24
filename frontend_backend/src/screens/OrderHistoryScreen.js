import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getError } from '../utils';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/esm/Badge';

const changeDate = (data) => {
  const date = new Date(data);
  return (
    date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
  );
};

const changeTime = (data) => {
  const date = new Date(data);
  return (
    date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' '
  );
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default function OrderHistoryScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [check, setCheck] = useState(false);
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `/api/orders/mine`,

          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
    setCheck(false);
  }, [userInfo, check]);

  return (
    <div>
      <Helmet>
        <title>Lịch sử giao dịch</title>
      </Helmet>
      <h1>Lịch sử giao dịch</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : orders.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Mã giao dịch</th>
              <th>Ngày giao dịch</th>
              <th>Tổng</th>
              <th>Thanh toán</th>
              <th>Đã giao hàng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="text-secondary">{order._id}</td>
                <td className="text-secondary">
                  {changeDate(order.createdAt)}
                </td>
                <td className="text-primary">
                  {order.totalPrice.toFixed(2)} $
                </td>
                <td>
                  {order.isPaid ? (
                    <Badge pill bg="success">
                      {changeTime(order.paidAt) + ' (xong)'}
                    </Badge>
                  ) : (
                    <Badge pill bg="info">
                      No
                    </Badge>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    <Badge pill bg="success">
                      Xong
                    </Badge>
                  ) : //order.deliveredAt.substring(0, 10)
                  !order.isDelivered && order.isPaid ? (
                    <Badge pill bg="warning">
                      Đang xử lí
                    </Badge>
                  ) : (
                    <Badge pill bg="info">
                      No
                    </Badge>
                  )}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    Xem chi tiết
                  </Button>
                  {!order.isPaid ? (
                    <Button
                      className="ms-2"
                      type="button"
                      variant="danger"
                      onClick={() => {
                        axios.delete(`/api/orders/delete/${order._id}`, {
                          headers: {
                            Authorization: `Bearer ${userInfo.token}`,
                          },
                        });
                        setCheck(true);
                      }}
                    >
                      Xóa
                    </Button>
                  ) : (
                    ' '
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        'Không có giao dịch'
      )}
    </div>
  );
}
