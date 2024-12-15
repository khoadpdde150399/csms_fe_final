import React, { useState, useEffect } from 'react';
import { Empty, Pagination } from 'antd'
import axios from 'axios'

import Header from '@/components/Header';
import Heading from '@/components/Heading';
import OrderRow from '@/components/OrderManagementPage/OrderRow';

const OrderManagementPage = () => {
    const [orderList, setOrderList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

    useEffect(() => {
        getOrderList();
    }, [])

    const getOrderList = async () => {
        try {
            const result = await axios.get('https://www.backend.csms.io.vn/api/order/admin/list')
            setOrderList(result.data)
        } catch (err) {
            console.log(err);
        }
    }

    const refreshOrderTable = async () => {
        try {
            const result = await axios.get('https://www.backend.csms.io.vn/api/order/admin/list')
            setOrderList(result.data)
        } catch (err) {
            console.log(err);
        }
    }

    // Tính toán orders cho trang hiện tại
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orderList.slice(indexOfFirstOrder, indexOfLastOrder);

    // Xử lý khi thay đổi trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    return (
        <div className="">
            <Header title="Order Management" />
            <div className="wrapper manager-box">
                <Heading title="All orders" />
                <div className="wrapper-product-admin table-responsive">
                    <table className='table order-manage-table w-100'>
                        <thead className="w-100 align-middle text-center">
                            <tr className="fs-6 w-100">
                                <th title='Order code' className="col-order-id">
                                    Order code
                                </th>
                                <th title='Status' className="col-state">Status</th>
                                <th title="Date created" className="col-create-at">Date created</th>
                                <th title='Total value' className="col-total-value">Total value</th>
                                <th title="Operation" className="col-action manipulation">Operation</th>
                            </tr>
                        </thead>
                        {
                        orderList.length ?
                            <>
                                {currentOrders.map((order, index) => (
                                    <OrderRow
                                        key={index}
                                        order_id={order.order_id}
                                        state_id={order.state_id}
                                        state_name={order.state_name}
                                        created_at={order.created_at}
                                        total_order_value={order.total_order_value}
                                        refreshOrderTable={refreshOrderTable}
                                    />
                                ))}
                            </>
                            :
                            <table className="table w-100 table-hover align-middle table-bordered" style={{ height: "400px" }}>
                                <tbody>
                                    <tr><td colSpan={6}><Empty /></td></tr>
                                </tbody>
                            </table>
                        }
                    </table>
                    {
                        orderList.length ?
                            <>
                                <div className="d-flex justify-content-center align-items-center mt-4 mb-4">
                                    <Pagination
                                        current={currentPage}
                                        total={orderList.length}
                                        pageSize={ordersPerPage}
                                        onChange={handlePageChange}
                                        showSizeChanger={false}
                                    />
                                </div>
                            </>
                            :
                            ''
                        }
                   
                </div>
            </div>
        </div>
    )
}

const styles = {
    '.ant-pagination': {
        margin: '20px 0',
    },
    '.ant-pagination-item-active': {
        backgroundColor: '#1890ff',
        borderColor: '#1890ff',
    },
    '.ant-pagination-item-active a': {
        color: '#ffffff',
    }
};

export default OrderManagementPage;