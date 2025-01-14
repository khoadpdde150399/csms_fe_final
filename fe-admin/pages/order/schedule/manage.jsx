import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, notification, DatePicker, Select, Popconfirm } from 'antd';
import moment from 'moment';
import useAdminStore from '@/store/adminStore';
import Header from '@/components/Header';
const { Option } = Select;

const OrderHistoryManage = () => {
    const admin_id = useAdminStore((state) => state.admin_id);
    const [orders, setOrders] = useState([]); 
    const [orderHistories, setOrderHistories] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [editingHistoryId, setEditingHistoryId] = useState(null);
    const [isDeliveredHistoryModalVisible, setIsDeliveredHistoryModalVisible] = useState(false);
    const [deliveredOrders, setDeliveredOrders] = useState([]);
    const statuses = [
        { label: 'In Transit', value: 'In Transit' },
        { label: 'Left Sorting Warehouse', value: 'Left Sorting Warehouse' },
        { label: 'In Warehouse', value: 'In Warehouse' },
        { label: 'Delivered', value: 'Delivered' },
    ];

    useEffect(() => {
        fetchOrdersForAdmin();
        fetchDeliveredOrders();
    }, []);

    const fetchOrdersForAdmin = async () => {
        try {
            const response = await axios.get('https://www.backend.csms.io.vn/api/order/shipper', {
            params: { admin_id } // Nếu API hỗ trợ params
        });
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
            notification.error({ message: 'Error fetching orders. Please try again!' });
        }
    };
    const fetchDeliveredOrders = async () => {
    try {
        const response = await axios.get('https://www.backend.csms.io.vn/api/order/delivered', {
            params: { admin_id } // Nếu API hỗ trợ params
        });
        setDeliveredOrders(response.data);
    } catch (error) {
        console.error("Error fetching delivered orders:", error);
        notification.error({ message: 'Error fetching delivered orders. Please try again!' });
    }
};
    const fetchOrderHistories = async (orderId) => {
        try {
            const response = await axios.get(`https://www.backend.csms.io.vn/api/order/history/${orderId}`, {
            params: { admin_id } // Nếu API hỗ trợ params
        });
            setOrderHistories(response.data);
            setCurrentOrderId(orderId);
            setIsHistoryModalVisible(true);
        } catch (error) {
            console.error("Error fetching order histories:", error);
            notification.error({ message: 'Error fetching order histories. Please try again!' });
        }
    };
const fetchDeliveredOrderHistory = async (orderId) => {
    try {
        const response = await axios.get(`https://www.backend.csms.io.vn/api/order/history/${orderId}`, {
            params: { admin_id } // Nếu API hỗ trợ params
        });
        setOrderHistories(response.data);
        setCurrentOrderId(orderId);
        setIsDeliveredHistoryModalVisible(true);
    } catch (error) {
        console.error("Error fetching delivered order history:", error);
        notification.error({ message: 'Error fetching order history. Please try again!' });
    }
};

    const deleteHistory = async (historyId) => {
        try {
            await axios.delete(`https://www.backend.csms.io.vn/api/order/deleteschedule/${historyId}`, {
            params: { admin_id } // Nếu API hỗ trợ params
        });
            notification.success({ message: 'History deleted successfully!' });
            fetchOrderHistories(currentOrderId);
        } catch (error) {
            console.error("Error deleting history:", error);
            notification.error({ message: 'Error deleting history. Please try again!' });
        }
    };

const showModal = (history) => {
    form.resetFields();
    if (history) {
        // Convert MySQL datetime to moment object
        const estimatedTime = moment(history.estimated_delivery_time).utc();
        
        form.setFieldsValue({
            notes: history.notes,
            status: history.status,
            estimated_delivery_time: estimatedTime
        });
        setEditingHistoryId(history.schedule_id);
    } else {
        setEditingHistoryId(null);
    }
    setIsModalVisible(true);
};


    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleHistoryModalCancel = () => {
        setIsHistoryModalVisible(false);
    };

    const handleFinish = async (values) => {
    try {
        // Convert moment object to MySQL datetime format
        const formattedValues = {
            ...values,
            estimated_delivery_time: values.estimated_delivery_time.format('YYYY-MM-DD HH:mm:ss'),
        };

        if (editingHistoryId) {
            await axios.put(`https://www.backend.csms.io.vn/api/order/updateschedule/${editingHistoryId}`, formattedValues);
            notification.success({ message: 'History updated successfully!' });
        } else {
            await axios.post(`https://www.backend.csms.io.vn/api/order/createschedule`, {
    order_id: currentOrderId,
    ...formattedValues,
    timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    admin_id
});

            notification.success({ message: 'History created successfully!' });
        }
        if (values.status === 'Delivered') {
            Modal.confirm({
                title: 'Confirm state change',
                content: 'Are you sure you want to mark this order as Delivered? This action cannot be undone.',
                onOk: async () => {
                    await updateOrderState(currentOrderId);
                },
                onCancel() {},
            });
        }

        setIsModalVisible(false);
        window.location.reload();
        fetchOrdersForAdmin();
        fetchDeliveredOrders()
        fetchOrderHistories(currentOrderId);
    } catch (error) {
        console.error("Error saving order history:", error);
        notification.error({ message: 'Error saving order history. Please try again!' });
    }
};
 const updateOrderState = async (orderId) => {
    try {
        const response = await axios.put(`https://www.backend.csms.io.vn/api/order/updatestate/${orderId}`);
        if (response.status === 200) {
            notification.success({ message: 'Order state updated to Delivered!' });
            // Refresh danh sách đơn hàng
            fetchOrdersForAdmin();
        } else {
            throw new Error('Failed to update order state');
        }
    } catch (error) {
        console.error("Error updating order state:", error);
        notification.error({ 
            message: 'Error updating order state', 
            description: error.response?.data?.message || 'Please try again!'
        });
    }
};
    const columns = [
        {
            title: 'No.',
            key: 'index',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Order ID',
            dataIndex: 'order_id',
            key: 'order_id',
        },
        {
            title: 'Customer Name',
            dataIndex: 'customer_name',
            key: 'customer_name',
        },
        {
            title: 'Total Value',
            dataIndex: 'total_order_value',
            key: 'total_order_value',
            render: (value) => `${value.toLocaleString()} VND`,
        },
        {
            title: 'Created Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button 
                onClick={() => fetchOrderHistories(record.order_id)}
                style={{
                    backgroundColor: '#1890ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '500',
                    boxShadow: '0 2px 4px rgba(24, 144, 255, 0.2)',
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#40a9ff';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#1890ff';
                }}
            >
                View History
            </Button>
            ),
        },
    ];
    const deliveredColumns = [
    {
        title: 'No.',
        key: 'index',
        render: (_, __, index) => index + 1,
    },
    {
        title: 'Order ID',
        dataIndex: 'order_id',
        key: 'order_id',
    },
    {
        title: 'Customer Name',
        dataIndex: 'customer_name',
        key: 'customer_name',
    },
    {
        title: 'Total Value',
        dataIndex: 'total_order_value',
        key: 'total_order_value',
        render: (value) => `${value.toLocaleString()} VND`,
    },
    {
        title: 'Delivered Date',
        dataIndex: 'delivered_at',
        key: 'delivered_at',
        render: (date) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
        title: 'Phone Number',
        dataIndex: 'phone_number',
        key: 'phone_number',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
];
   return (
    <div>
        <Header />
    <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1 style={{paddingBottom: '30px', fontWeight:600, fontSize:'28px'}}>Order History Management</h1>
        
        <h2 style={{paddingBottom: '20px', fontWeight:600, fontSize:'24px'}}>Pending Orders</h2>
        <Table
            dataSource={orders}
            rowKey="order_id"
            pagination={{
                pageSize: 5,
                position: ['bottomCenter'],
                style: { 
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'center'
                }
            }}
            style={{
                margin: 'auto',
                width: '90%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                marginBottom: '40px'
            }}
        >
            {columns.map((col) => (
                <Table.Column key={col.key} {...col} />
            ))}
        </Table>

        <h2 style={{paddingBottom: '20px', fontWeight:600, fontSize:'24px'}}>Delivered Orders</h2>
        <Table
            dataSource={deliveredOrders}
            rowKey="order_id"
            pagination={{
                pageSize: 5,
                position: ['bottomCenter'],
                style: { 
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'center'
                }
            }}
            style={{
                margin: 'auto',
                width: '90%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                marginBottom: '40px'
            }}
        >
            <Table.Column title="No." key="index" render={(_, __, index) => index + 1} />
            <Table.Column title="Order ID" dataIndex="order_id" key="order_id" />
            <Table.Column title="Customer Name" dataIndex="customer_name" key="customer_name" />
            <Table.Column 
                title="Total Value" 
                dataIndex="total_order_value" 
                key="total_order_value"
                render={(value) => `${value.toLocaleString()} VND`}
            />
            <Table.Column 
                title="Delivered Date" 
                dataIndex="delivered_at" 
                key="delivered_at"
                render={(date) => moment(date).format('YYYY-MM-DD HH:mm:ss')}
            />
            <Table.Column title="Phone Number" dataIndex="phone_number" key="phone_number" />
            <Table.Column title="Address" dataIndex="address" key="address" />
            <Table.Column
        title="Action"
        key="action"
        render={(_, record) => (
            <Button 
                onClick={() => fetchDeliveredOrderHistory(record.order_id)}
                style={{
                    backgroundColor: '#1890ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '500',
                    boxShadow: '0 2px 4px rgba(24, 144, 255, 0.2)',
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#40a9ff';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#1890ff';
                }}
            >
                View History
            </Button>
        )}
    />
</Table>

        <Modal
            title={`Order History #${currentOrderId}`}
            open={isHistoryModalVisible}
            onCancel={handleHistoryModalCancel}
            footer={null}
            width={800}
            style={{
                top: 20,
            }}
            bodyStyle={{
                maxHeight: '70vh',
                overflow: 'auto',
                padding: '20px'
            }}
        >
            <Table
                dataSource={orderHistories}
                rowKey="schedule_id"
                pagination={false}
                style={{
                    marginBottom: '20px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                    borderRadius: '6px'
                }}
            >
                <Table.Column title="Description" dataIndex="notes" key="notes" />
                <Table.Column
                    title="Time"
                    dataIndex="estimated_delivery_time"
                    key="estimated_delivery_time"
                    render={(timestamp) => moment(timestamp).format('YYYY-MM-DD HH:mm:ss')}
                />
                <Table.Column title="Status" dataIndex="status" key="status" />
                <Table.Column
                    title="Actions"
                    key="action"
                    render={(_, record) => (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Button onClick={() => showModal(record)}>Edit</Button>
                            <Popconfirm
                                title="Are you sure you want to delete this history?"
                                onConfirm={() => deleteHistory(record.schedule_id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button danger>Delete</Button>
                            </Popconfirm>
                        </div>
                    )}
                />
            </Table>
            <Button
                type="primary"
                onClick={() => showModal(null)}
                style={{
                    marginTop: '15px',
                    width: '100%',
                    height: '35px',
                    borderRadius: '4px'
                }}
            >
                Add New History
            </Button>
        </Modal>
        <Modal
    title={`Delivered Order History #${currentOrderId}`}
    open={isDeliveredHistoryModalVisible}
    onCancel={() => setIsDeliveredHistoryModalVisible(false)}
    footer={null}
    width={800}
    style={{
        top: 20,
    }}
    bodyStyle={{
        maxHeight: '70vh',
        overflow: 'auto',
        padding: '20px'
    }}
>
    <Table
        dataSource={orderHistories}
        rowKey="schedule_id"
        pagination={false}
        style={{
            marginBottom: '20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            borderRadius: '6px'
        }}
    >
        <Table.Column title="Description" dataIndex="notes" key="notes" />
        <Table.Column
            title="Time"
            dataIndex="estimated_delivery_time"
            key="estimated_delivery_time"
            render={(timestamp) => moment(timestamp).format('YYYY-MM-DD HH:mm:ss')}
        />
        <Table.Column title="Status" dataIndex="status" key="status" />
    </Table>
</Modal>

        <Modal
            title={editingHistoryId ? 'Edit History' : 'Add New History'}
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            style={{ top: 20 }}
            bodyStyle={{
                padding: '24px'
            }}
        >
            <Form 
                form={form} 
                onFinish={handleFinish} 
                layout="vertical"
                style={{
                    maxWidth: '100%'
                }}
            >
                <Form.Item
                    label="Description"
                    name="notes"
                    rules={[{ required: true, message: 'Please input description!' }]}
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    label="Status"
                    name="status"
                    rules={[{ required: true, message: 'Please select status!' }]}
                >
                    <Select placeholder="Select status">
                        {statuses.map((status) => (
                            <Option key={status.value} value={status.value}>
                                {status.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Estimated Delivery Time"
                    name="estimated_delivery_time"
                    rules={[{ required: true, message: 'Please select time!' }]}
                >
                    <DatePicker 
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                        showSecond={true}
                    />
                </Form.Item>
                <Form.Item>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        style={{
                            width: '100%',
                            height: '40px',
                            borderRadius: '4px',
                            fontSize: '16px'
                        }}
                    >
                        {editingHistoryId ? 'Update' : 'Create'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    </div>
    </div>
);
};

export default OrderHistoryManage;