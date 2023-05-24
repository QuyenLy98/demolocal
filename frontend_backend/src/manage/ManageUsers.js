import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
//import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getError } from '../utils';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { toast } from 'react-toastify';
import AddUser from './user/AddUser';

const changeDate = (data) => {
  const date = new Date(data);
  return (
    date.getDate() +
    '-' +
    (date.getMonth() + 1) +
    '-' +
    date.getFullYear() +
    '  '
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
      return { ...state, users: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default function ManageUsers() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [check, setCheck] = useState(false);
  const [{ loading, error, users }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `/api/users/manage`,

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

  const [show, setShow] = useState(false);
  const handleload = useCallback(() => {
    setCheck(!check);
    setShow(!show);
  }, [check, show]);

  return (
    <div>
      <Helmet>
        <title>Thông tin các user</title>
      </Helmet>
      <h1>Thông tin các user</h1>
      <Button
        variant="success"
        style={show === true ? { color: '#fff', backgroundColor: 'red' } : {}}
        onClick={() => {
          setShow(!show);
        }}
      >
        {show === true ? 'Đóng' : 'Thêm'}
      </Button>
      {show && <AddUser updateuser={handleload}></AddUser>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Mật khẩu</th>
                <th>Admin/user</th>
                <th>Ngày tạo</th>
                <th>Chỉnh sửa lần cuối</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="text-secondary">{user._id}</td>
                  <td className="text-dark">{user.name}</td>
                  <td className="text-primary">{user.email}</td>
                  <td className="text-primary">
                    <i className="fa-solid fa-eye-slash"></i>
                  </td>
                  <td>
                    {user.isAdmin ? (
                      <Badge pill bg="success">
                        Admin
                      </Badge>
                    ) : (
                      <Badge pill bg="info">
                        User
                      </Badge>
                    )}
                  </td>
                  <td>
                    {changeDate(user.createdAt) + changeTime(user.createdAt)}
                  </td>
                  <td>
                    {changeDate(user.updatedAt) + changeTime(user.updatedAt)}
                  </td>
                  <td>
                    {user.isAdmin ? (
                      ' '
                    ) : (
                      <>
                        <Button
                          className="me-1"
                          type="button"
                          variant="danger"
                          onClick={() => {
                            axios.delete(`/api/users/delete/${user._id}`, {
                              headers: {
                                Authorization: `Bearer ${userInfo.token}`,
                              },
                            });
                            setCheck(true);
                            toast.success(
                              `Xóa thành công user ${user.name} và các giao dịch liên quan`
                            );
                          }}
                        >
                          <i className="fa-solid fa-trash-check "></i>
                        </Button>
                        {/* <Button type="button" variant="warning">
                          <i className="fa-solid fa-pen-to-square"></i>Sửa
                        </Button> */}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
