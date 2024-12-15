import React, { useState, useEffect } from 'react';
import { Empty,Pagination } from 'antd';
import axios from 'axios';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import Header from '@/components/Header';
import Heading from '@/components/Heading';
import ProductAdmin from '@/components/ProductManagementPage/ProductAdmin';
import Router from 'next/router';
import useAdminStore from '@/store/adminStore';
import { Input } from 'antd';
const ProductManagementPage = () => {
  const role_id = useAdminStore((state) => state.role_id);
  const [listProductVariant, setListProductVariant] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;
  const { Search } = Input;
  const isDisabled = () => {
    return role_id === 3;
  };
  useEffect(() => {
    const getListProductVariant = async () => {
      try {
        const result = await axios.get('https://www.backend.csms.io.vn/api/product/admin/list');
        setListProductVariant(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    getListProductVariant();
  }, []);

  const refreshProductVariantTable = async () => {
    const result = await axios.get('https://www.backend.csms.io.vn/api/product/admin/list');
    setListProductVariant(result.data);
  };
  
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
}
  const sortAndFilterData = () => {
    let sortedData = [...listProductVariant];

    if (searchQuery) {
      sortedData = sortedData.filter((item) =>
        item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
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
  const indexOfLastProduct = currentPage * ordersPerPage;
  const indexOfFirstProduct = indexOfLastProduct - ordersPerPage;
  const currentProducts = sortAndFilterData().slice(indexOfFirstProduct, indexOfLastProduct);
  return (
    <div className="product-manager">
      <Header title="Manage Products" />
      <div className="wrapper manager-box">
      <div className="to-add-product-page">
          <button 
            onClick={() => Router.push('/product/create')} 
            className="to-add-product-page-btn"
            disabled={isDisabled()}
            style={{
              opacity: isDisabled() ? 0.5 : 1,
              cursor: isDisabled() ? 'not-allowed' : 'pointer'
            }}
          >
            Add Products
          </button>
        </div>
        <Heading title="All Products" />
        <div className="search-box" style={{ paddingBottom:'10px', maxWidth:'400px'}}>
      
                            <Search placeholder="input search text" onChange={(e) => setSearchQuery(e.target.value)} enterButton />
          {/* <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            /> */}
          </div>
        <div className="wrapper-product-admin table-responsive">
          <table className="table product-admin w-100">
            <thead className="w-100 align-middle text-center">
              <tr className="fs-6 w-100">
                <th
                  title="Product Name"
                  className="name col-infor-product"
                  onClick={() => handleSort('product_name')}
                >
                  Products
                  {sortColumn === 'product_name' && (
                    <span>{sortDirection === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
                  )}
                </th>
                <th
                  title="Products Price"
                  className="col-price"
                  onClick={() => handleSort('price')}
                >
                  Price
                  {sortColumn === 'price' && (
                    <span>{sortDirection === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
                  )}
                </th>
                <th
                  title="Stock"
                  className="col-quantity"
                  onClick={() => handleSort('quantity')}
                >
                  Stock
                  {sortColumn === 'quantity' && (
                    <span>{sortDirection === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
                  )}
                </th>
                <th
                  title="Create Time"
                  className="col-createAt"
                  onClick={() => handleSort('created_at')}
                >
                  Date Create
                  {sortColumn === 'created_at' && (
                    <span>{sortDirection === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
                  )}
                </th>
                <th
                  title="Status"
                  onClick={() => handleSort('state')}
                >
                  Status
                  {sortColumn === 'state' && (
                    <span>{sortDirection === 'asc' ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
                  )}
                </th>
                <th title="Operation" className="col-action manipulation">
                Operation
                </th>
              </tr>
              

              {sortAndFilterData().length ? (
                <>
                  {currentProducts.map((productVariant, index) => (
                    <ProductAdmin
                      key={index}
                      product_id={productVariant.product_id}
                      product_variant_id={productVariant.product_variant_id}
                      product_name={productVariant.product_name}
                      product_image={productVariant.product_image}
                      colour_name={productVariant.colour_name}
                      size_name={productVariant.size_name}
                      price={productVariant.price}
                      quantity={productVariant.quantity}
                      state={productVariant.state}
                      created_at={productVariant.created_at}
                      refreshProductVariantTable={refreshProductVariantTable}
                    />
                  ))}
                </>
              ) : (
                <table
                  className="table w-100 table-hover align-middle table-bordered"
                  style={{ height: '400px' }}
                >
                  <tbody>
                    <tr>
                      <td colSpan={6}>
                        <Empty />
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

            </thead>
          </table>
          {sortAndFilterData().length ? (
                <>
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
                </>
              ) : ( ''
              )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagementPage;