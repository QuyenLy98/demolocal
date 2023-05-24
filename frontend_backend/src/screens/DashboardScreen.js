import React, { useContext, useEffect, useReducer } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

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

export default function DashboardScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, users }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `/api/users/admin`,

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
  }, [userInfo]);

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Trang quản trị hệ thống</title>
      </Helmet>
      <Container className="lg-container">
        <Row>
          <Col md={4}>
            <Card className="bg-success text-white">
              <Card.Title className="text-center my-2">
                <h1 className="text-dark">Người dùng</h1>
              </Card.Title>
              <Card.Body>
                <ListGroup.Item variant="flush">
                  <ListGroup.Item className="text-center my-2">
                    <svg className="glyph stroked male-user">
                      <use xlinkHref="#stroked-male-user"></use>
                    </svg>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <h3>Quản trị viên {users.count_admin}</h3>
                    <h3>Người dùng {users.count_user}</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button variant="info">
                      <Link
                        className="text-decoration-none"
                        to="/admin/userlist"
                      >
                        Xem chi tiết
                      </Link>
                    </Button>
                  </ListGroup.Item>
                </ListGroup.Item>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-warning text-white">
              <Card.Title className="text-center my-2">
                <h1 className="text-dark">Danh mục sản phẩm</h1>
              </Card.Title>
              <Card.Body>
                <ListGroup.Item variant="flush">
                  <ListGroup.Item className="text-center my-2">
                    <svg className="glyph stroked clipboard with paper">
                      <use xlinkHref="#stroked-clipboard-with-paper" />
                    </svg>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <h3>Tổng số danh mục {users.count_category}</h3>
                    <h3>Tổng sản phẩm {users.count_product}</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button variant="info">
                      <Link
                        className="text-decoration-none"
                        to="/admin/productlist"
                      >
                        Xem chi tiết
                      </Link>
                    </Button>
                  </ListGroup.Item>
                </ListGroup.Item>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-secondary text-white">
              <Card.Title className="text-center my-2">
                <h1 className="text-dark">Giao dịch</h1>
              </Card.Title>
              <Card.Body>
                <ListGroup.Item variant="flush">
                  <ListGroup.Item className="text-center my-2">
                    <svg className="glyph stroked chain">
                      <use xlinkHref="#stroked-chain" />
                    </svg>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <h3>Chưa thanh toán {users.count_order1}</h3>
                    <h3>
                      Đang xử lí {users.count_order2} / Hoàn tất{' '}
                      {users.count_order3}
                    </h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button variant="info">
                      <Link
                        className="text-decoration-none"
                        to="/admin/orderlist"
                      >
                        Xem chi tiết
                      </Link>
                    </Button>
                  </ListGroup.Item>
                </ListGroup.Item>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
