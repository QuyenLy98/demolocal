import React, { useEffect, useLayoutEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import axios from 'axios';
import { getError } from '../utils';
import Button from 'react-bootstrap/Button';
import AddProduct from './product/AddProduct';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function ManageProducts({ ca }) {
  const [page, setPage] = useState();
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const [delenode, setDelenode] = useState(false);
  const [view, setView] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`/api/products`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [view, delenode]);

  const [type, setType] = useState('aaa');

  const [pro, setPro] = useState([]);

  useLayoutEffect(() => {
    let a = [];
    const load = async () => {
      try {
        await axios
          .get(`/api/products/cate/${type}`)
          .then((prod) => prod.data.pro)
          .then((data) => (a = data));
      } catch (error) {
        console.log(error.message);
      }
      setPro(a);
    };
    load();
  }, [type, delenode]);

  const [show, setShow] = useState(false);

  function SelectedCate() {
    setPage('button3');
    var x = document.getElementById('mySelect').value;
    if (x === 'no data') {
      return false;
    } else {
      setType(x);
    }
  }

  const navigate = useNavigate();

  return (
    <div>
      <Helmet>
        <title>Quản lý sản phẩm</title>
      </Helmet>

      <Button
        className="me-2"
        variant="success"
        style={
          page === 'button1'
            ? {
                color: '#fff',
                backgroundColor: 'green',
                fontSize: '25px',
                boxShadow: '0px 6px 4px #4F4557',
              }
            : {}
        }
        onClick={() => {
          setPage('button1');
          setShow(!show);
        }}
      >
        Thêm sản phẩm mới
      </Button>

      <Button
        className="me-2"
        variant="warning"
        style={
          page === 'button2'
            ? {
                color: '#fff',
                backgroundColor: 'orange',
                fontSize: '25px',
                boxShadow: '0px 6px 4px #4F4557',
              }
            : {}
        }
        onClick={() => {
          setPage('button2');
          setView(!view);
        }}
      >
        Danh sách sản phẩm
      </Button>

      <select id="mySelect" onChange={() => SelectedCate()}>
        <option value="no data">Chưa chọn</option>
        {ca.map((cate) => (
          <option key={cate} value={cate}>
            {cate}
          </option>
        ))}
      </select>

      {show && page === 'button1' && <AddProduct cate={ca}></AddProduct>}

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : page === 'button2' && view ? (
        <>
          <br />
          <br />
          <br />
          <h4 className="text-center">Danh sách tất cả các sản phẩm</h4>
          <br />

          <table className="table" style={{ fontSize: '18px' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên sản phẩm</th>
                <th>Hình ảnh</th>
                <th>Giá</th>
                <th>Số lượng còn lại</th>
                <th>Mặt hàng</th>
                <th>Xem</th>
                <th>Sửa</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="text-secondary">{product._id}</td>
                  <td className="text-primary">{product.name}</td>
                  <td style={{ width: '300px' }}>
                    <img
                      className="w-50"
                      src={product.image}
                      alt={product.name}
                    ></img>
                  </td>
                  <td className="text-info">{product.price}$</td>
                  <td className="text-dark">
                    {product.countInStock === 0
                      ? 'Hết hàng'
                      : product.countInStock}
                  </td>
                  <td className="text-info">{product.category}</td>
                  <td>
                    <Button
                      variant="info"
                      type="button"
                      onClick={() => {
                        navigate(`/productshow/${product._id}`);
                      }}
                    >
                      <i className="fa-regular fa-circle-info"></i>
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      type="button"
                      onClick={() => {
                        navigate(`/productupdate/${product._id}`);
                      }}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </Button>
                  </td>
                  <td>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => {
                        axios.delete(`/api/products/delete/${product._id}`);
                        setDelenode(!delenode);
                        toast.success(
                          `Xóa thành công sản phẩm ${product.name}`
                        );
                      }}
                    >
                      <i className="fa-solid fa-trash-check "></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        ''
      )}

      {page === 'button3' && pro !== undefined ? (
        <>
          <br />
          <br />
          <br />
          <h4 className="text-center">
            Danh sách các mặt hàng <b>{pro[0].category}</b>
          </h4>
          <br /> <br />
          <table className="table" style={{ fontSize: '18px' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên sản phẩm</th>
                <th>Hình ảnh</th>
                <th>Giá</th>
                <th>Số lượng còn lại</th>
                <th>Xem</th>
                <th>Sửa</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {pro.map((p) => (
                <tr key={p._id}>
                  <td className="text-secondary">{p._id}</td>
                  <td className="text-primary">{p.name}</td>
                  <td style={{ width: '300px' }}>
                    <img className="w-50" src={p.image} alt={p.name}></img>
                  </td>
                  <td className="text-info">{p.price}$</td>
                  <td className="text-dark">
                    {p.countInStock === 0 ? 'Hết hàng' : p.countInStock}
                  </td>
                  <td>
                    <Button
                      variant="info"
                      type="button"
                      onClick={() => {
                        navigate(`/productshow/${p._id}`);
                      }}
                    >
                      <i className="fa-regular fa-circle-info"></i>
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      type="button"
                      onClick={() => {
                        navigate(`/productupdate/${p._id}`);
                      }}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      type="button"
                      onClick={() => {
                        axios.delete(`/api/products/delete/${p._id}`);
                        setDelenode(!delenode);
                        toast.success(`Xóa thành công sản phẩm ${p.name}`);
                      }}
                    >
                      <i className="fa-solid fa-trash-check "></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        ''
      )}
    </div>
  );
}
