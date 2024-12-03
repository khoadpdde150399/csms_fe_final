import React, { useState, useEffect } from 'react';
import { Empty } from 'antd';
import axios from 'axios';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

import Header from '@/components/Header';
import Heading from '@/components/Heading';
import CouponAdmin from '@/components/CouponManagementPage/CouponAdmin';
import Router from 'next/router';

const CouponManagementPage = () => {
  const [listCoupon, setlistCoupon] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getlistCoupon = async () => {
      try {
        const result = await axios.get('https://www.backend.csms.io.vn/api/coupon/admin/list');
        setlistCoupon(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    getlistCoupon();
  }, []);

  const refreshCouponTable = async () => {
    const result = await axios.get('https://www.backend.csms.io.vn/api/coupon/admin/list');
    setlistCoupon(result.data);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortAndFilterData = () => {
    let sortedData = [...listCoupon];

    if (searchQuery) {
      sortedData = sortedData.filter((item) =>
        item.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortColumn) {
      sortedData.sort((a, b) => {
        if (sortColumn === 'created_at') {
          return sortDirection === 'asc'
            ? new Date(a[sortColumn]) - new Date(b[sortColumn])
            : new Date(b[sortColumn]) - new Date(a[sortColumn]);
        } else if (typeof a[sortColumn] === 'string') {
          return sortDirection === 'asc'
            ? a[sortColumn].localeCompare(b[sortColumn])
            : b[sortColumn].localeCompare(a[sortColumn]);
        } else {
          if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
          if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        }
      });
    }

    return sortedData;
  };

  return (
    <div className="product-manager">
      <Header title="Manage coupon codes" />
      <div className="wrapper manager-box">
        <div className="to-add-product-page">
          <button onClick={() => Router.push('/coupon/create')} className="to-add-product-page-btn">
          Add discount code
          </button>
        </div>
        <Heading title="All coupon codes" />
        <div className="search-box">
          <input
            type="text"
            placeholder="Find a coupon code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="wrapper-product-admin table-responsive">
          <table className="table product-admin w-100">
            <thead className="w-100 align-middle text-center">
              <tr className="fs-6 w-100">
                <th
                  title="Coupon code name"
                  className="name col-infor-product"
                  onClick={() => handleSort('code')}
                  style={{ width: '15%' }}
                >
                  Discount code
                  {sortColumn === 'code' && (
                    <span>{sortDirection === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
                  )}
                </th>
                <th
                  title="Money"
                  className="col-money"
                  onClick={() => handleSort('money')}
                  style={{ width: '20%' }}
                >
                  Price
                  {sortColumn === 'money' && (
                    <span>{sortDirection === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
                  )}
                </th>
                <th
                  title="Creation time"
                  className="col-createAt"
                  onClick={() => handleSort('created_at')}
                  style={{ width: '20%' }}
                >
                  Date created
                  {sortColumn === 'created_at' && (
                    <span>{sortDirection === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
                  )}
                </th>
                <th
                  title="Status"
                  onClick={() => handleSort('status')}
                  style={{ width: '20%' }}
                >
                  Status
                  {sortColumn === 'status' && (
                    <span>{sortDirection === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
                  )}
                </th>
                <th title="Operation" className="col-action manipulation" style={{ width: '20%' }}>
                Operation
                </th>
              </tr>
            </thead>
          <tbody>
          {sortAndFilterData().length ? (
            sortAndFilterData().map((productVariant, index) => {
              return (
                <CouponAdmin
                  key={index}
                  id={productVariant.id}
                  code={productVariant.code}
                  money={productVariant.money}
                  status={productVariant.status}
                  created_at={productVariant.created_at}
                  refreshCouponTable={refreshCouponTable}
                />
              );
            })
          ) : (
                <tr>
                  <td colSpan={6}>
                    <Empty />
                  </td>
                </tr>
          )}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CouponManagementPage;