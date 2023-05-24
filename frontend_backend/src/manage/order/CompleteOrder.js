import React, { useContext, useEffect, useReducer, useState } from 'react';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { Store } from '../../Store';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getError } from '../../utils';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

const changeDate = (data) => {
  const date = new Date(data);
  return (
    date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
  );
};

// const changeTime = (data) => {
//   const date = new Date(data);
//   return (
//     date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' '
//   );
// };

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

export default function CompleteOrder() {
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
          `/api/orders/managecomplete`,

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

  const refuserEmail = (a, b) => {
    for (let i = 0; i < b.length; i++) {
      if (a === b[i]._id) {
        return b[i].email;
      }
    }
  };

  const refuserName = (a, b) => {
    for (let i = 0; i < b.length; i++) {
      if (a === b[i]._id) {
        return b[i].name;
      }
    }
  };

  const handleDeleteComplete = async () => {
    try {
      await axios.delete(
        `/api/orders/deletecomplete`,

        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      toast.success('Xóa tất cả thành công');
      setCheck(true);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div>
      <h3 className="text-center">DANH SÁCH</h3>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : orders.orders.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Mã giao dịch</th>
              <th>Email</th>
              <th>User</th>
              <th>Ngày GD</th>
              <th>Tổng</th>
              <th>Xem</th>
              <th>
                <Button
                  className="float-end bg-danger"
                  onClick={() => handleDeleteComplete()}
                >
                  Xóa tất cả
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.orders.map((order) => (
              <tr key={order._id}>
                <td className="text-secondary">{order._id}</td>
                <td className="text-dark">
                  {refuserEmail(order.user, orders.users)}
                </td>
                <td className="text-dark">
                  {refuserName(order.user, orders.users)}
                </td>
                <td className="text-info">{changeDate(order.createdAt)}</td>
                <td className="text-primary">
                  {order.totalPrice.toFixed(2)} $
                </td>
                <td>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    <i className="fa-regular fa-circle-info"></i>
                  </Button>
                </td>
                <td>
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
                      toast.success('Xóa thành công');
                      setCheck(true);
                    }}
                  >
                    <i className="fa-solid fa-trash-check "></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h3 className="text-secondary text-center">
          <i className="fa-solid fa-empty-set"></i>
        </h3>
      )}
    </div>
  );
}
