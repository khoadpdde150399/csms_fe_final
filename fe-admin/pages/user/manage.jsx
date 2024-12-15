import React, { useState, useEffect } from 'react';
import { Empty, Pagination } from 'antd';
import axios from 'axios';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import Header from '@/components/Header';
import Heading from '@/components/Heading';
import UserAdmin from '@/components/UserManagementPage/UserAdmin';
import SortBar from '@/components/SortBar';
import Router from 'next/router';
import { Input } from 'antd';
const UserManagementPage = () => {
  const [listUser, setlistUser] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;
  const { Search } = Input;
  useEffect(() => {
    const getlistUser = async () => {
      try {
        const result = await axios.get('https://www.backend.csms.io.vn/api/user/admin/list');
        setlistUser(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    getlistUser();
  }, []);

  const refreshUserTable = async () => {
    const result = await axios.get('https://www.backend.csms.io.vn/api/user/admin/list');
    setlistUser(result.data);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSortFromSortBar = (sortType) => {
    handleSort(sortType);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const sortAndFilterData = () => {
    let sortedData = [...listUser];

    if (searchQuery) {
      sortedData = sortedData.filter((item) =>
        item.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Tính toán dữ liệu cho trang hiện tại
  const indexOfLastUser = currentPage * ordersPerPage;
  const indexOfFirstUser = indexOfLastUser - ordersPerPage;
  const currentUsers = sortAndFilterData().slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="product-manager">
      <Header title="Customer Management" />
      <div className="wrapper manager-box">
        <Heading title="Customer Management" />
        <SortBar onSort={handleSortFromSortBar} />
        
        <div className="search-box" style={{ paddingBottom:'10px', maxWidth:'400px'}}>
      
                            <Search placeholder="input search text" onChange={(e) => setSearchQuery(e.target.value)} enterButton />
          </div>
          <div className="wrapper-product-admin table-responsive">
            <table className="table product-admin w-100">
              <thead className="w-100 align-middle text-center">
                <tr className="fs-6 w-100">
                  <th
                    title="Customer name"
                    className="name col-infor-product"
                    onClick={() => handleSort('customer_name')}
                    style={{ width: '15%' }}
                  >
                    Customer name
                    {sortColumn === 'customer_name' && (
                      <span>{sortDirection === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
                    )}
                  </th>
                  <th
                    title="Money" 
                    className="col-money"
                    onClick={() => handleSort('phone_number')}
                    style={{ width: '15%' }}
                  >
                    Phone number
                    {sortColumn === 'phone_number' && (
                      <span>{sortDirection === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
                    )}
                  </th>
                  <th
                    title="Địa chỉ"
                    className="col-address"
                    onClick={() => handleSort('address')}
                    style={{ width: '45%' }}
                  >
                    Address
                    {sortColumn === 'address' && (
                      <span>{sortDirection === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
                    )}
                  </th>
                  <th
                    title="Điểm"
                    onClick={() => handleSort('point')}
                  >
                    Loyalty Point
                    {sortColumn === 'point' && (
                      <span>{sortDirection === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
                    )}
                  </th>
                  <th title="Thao tác" className="col-action manipulation">
                    Operation
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortAndFilterData().length ? (
                  <>
                    {currentUsers.map((item, index) => (
                      <UserAdmin
                        key={index}
                        customer_info_id={item.customer_info_id}
                        customer_name={item.customer_name}
                        phone_number={item.phone_number}
                        address={item.address}
                        point={item.point}
                        refreshUserTable={refreshUserTable}
                      />
                    ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan={5}>
                      <Empty />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {sortAndFilterData().length > 0 && (
              <div className="d-flex justify-content-center align-items-center mt-4 mb-4">
                <Pagination
                  current={currentPage}
                  total={sortAndFilterData().length}
                  pageSize={ordersPerPage}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showTotal={(total) => `Total ${total} items`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default UserManagementPage;