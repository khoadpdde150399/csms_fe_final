import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Table, Button, Modal, Popconfirm } from 'antd'; // Đã bỏ Form, Input, DatePicker, Select vì không cần
import AccountSidebar from '@/components/accountSidebar';
import OrderDetailTable from '@/components/orderDetailPage/orderDetailTable';
import { formatTime } from '@/helpers/format';
import { swtoast } from '@/mixins/swal.mixin';
import orderService from '@/services/orderService';
import moment from 'moment'; // Nhập moment để định dạng thời gian
import axios from 'axios'; // Nhập axios để gọi API

const OrderDetailPage = () => {
    const router = useRouter();
    const { order_id } = router.query;
    const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
    const [stateId, setStateId] = useState('');
    const [orderId, setOrderId] = useState('');
    const [stateName, setStateName] = useState('');
    const [orderItems, setOrderItems] = useState([]);
    const [totalProductValue, setTotalProductValue] = useState(0);
    const [deliveryCharges, setDeliveryCharges] = useState(0);
    const [totalOrderValue, setTotalOrderValue] = useState(0);
    const [createdAt, setCreatedAt] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [methodPayment, setMethodPayment] = useState('');
    const [shipping, setShipping] = useState('');
    const [orderHistories, setOrderHistories] = useState([]);

    useEffect(() => {
        const getOrderDetail = async () => {
            try {
                const response = await orderService.getDetail(order_id);
                setOrderId(response.data.order_id);
                setStateName(response.data.state_name);
                setStateId(response.data.state_id);
                setCreatedAt(response.data.created_at);
                setOrderItems(response.data.order_items);
                setTotalProductValue(response.data.total_product_value);
                setDeliveryCharges(response.data.delivery_charges);
                setTotalOrderValue(response.data.total_order_value);
                setCustomerName(response.data.customer_name);
                setEmail(response.data.email);
                setPhoneNumber(response.data.phone_number);
                setAddress(response.data.address);
                setMethodPayment(response.data.methodPayment);
                setShipping(response.data.shipping);
            } catch (error) {
                console.log(error);
                router.push('/404');
            }
        };
        if (order_id) {
            getOrderDetail();
        }
    }, [router, order_id]);

    const handleCancelOrder = useCallback(async () => {
        try {
            await orderService.cancelOrder(orderId);
            swtoast.success({ text: 'Order Cancellation Successful' });
            router.push('/account/orders');
        } catch (err) {
            console.log(err);
            swtoast.error({ text: 'Error canceling order please try again!' });
        }
    }, [orderId, router]);

    const renderCancelBtn = useMemo(() => {
        if (stateId == 1 || stateId == 2) {
            return (
                <button className="cancel-order-btn" onClick={handleCancelOrder}>
                    Cancel order
                </button>
            );
        }
    }, [stateId, handleCancelOrder]);

    const handleHistoryModalCancel = () => {
        setIsHistoryModalVisible(false);
    };

    const fetchOrderHistories = async (orderId) => {
        try {
            const response = await axios.get(`https://www.backend.csms.io.vn/api/order/history/${orderId}`);
            setOrderHistories(response.data);
            setIsHistoryModalVisible(true);
        } catch (error) {
            console.error("Error fetching order histories:", error);
            swtoast.error({ message: 'Error fetching order histories. Please try again!' });
        }
    };

    return (
        <div className="order-detail-page container pb-4">
            <div className="row">
                <div className="col-4">
                    <AccountSidebar />
                </div>
                <div className="col-8">
                    <div className="order-detail">
                        <h1 className="title">Your order information</h1>
                        <div className="d-flex row align-items-center justify-content-between">
                            <div className="col-3">
                                <Button
                                    onClick={() => fetchOrderHistories(orderId)}
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
                            </div>
                            <div className="col-6 order-title border-radius d-flex align-items-center justify-content-center fw-bold">
                                <div>
                                    Order #{orderId}
                                    <span className="order-state">{stateName}</span>
                                </div>
                            </div>
                            <div className="order-date col-3 d-flex align-items-center justify-content-end">
                                Date booked: {formatTime(createdAt)}
                            </div>
                        </div>
                        <div>
                            <OrderDetailTable
                                orderItems={orderItems}
                                totalProductValue={totalProductValue}
                                deliveryCharges={deliveryCharges}
                                totalOrderValue={totalOrderValue}
                            />
                        </div>
                        <p className="receive-info-title">Delivery information</p>
                        <div className="receive-info-box border-radius">
                            <p>
                                Recipient name:
                                <strong>{' ' + customerName}</strong>
                            </p>
                            <p>
                                Email address:
                                <strong>{' ' + email}</strong>
                            </p>
                            <p>
                                Phone number:
                                <strong>{' ' + phoneNumber}</strong>
                            </p>
                            <p>
                                Payment method:
                                <strong>{' ' + methodPayment}</strong>
                            </p>
                            <p>
                                Shipping address:
                                <strong>{' ' + address}</strong>
                            </p>
                            <p>
                                Shipping unit:
                                <strong>{' ' + shipping}</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
    title={`Order History #${orderId}`}
    open={isHistoryModalVisible}
    onCancel={handleHistoryModalCancel}
    footer={null}
    width={1000} // Tăng độ rộng của modal
    bodyStyle={{
        maxHeight: '70vh',
        overflow: 'auto',
        padding: '20px',
        display: 'flex',
        justifyContent: 'center', // Giữa nội dung trong modal
    }}
    centered // Đảm bảo modal được căn giữa trang
>
    <Table
        dataSource={orderHistories}
        rowKey="schedule_id"
        pagination={false}
        style={{
            marginBottom: '20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            borderRadius: '6px',
            width: '100%', // Đảm bảo bảng sử dụng toàn bộ chiều rộng của modal
        }}
    >
        <Table.Column 
            title="Description" 
            dataIndex="notes" 
            key="notes" 
            width={200} // Điều chỉnh độ rộng cột này
        />
        <Table.Column 
            title="Status" 
            dataIndex="status" 
            key="status" 
            width={150} // Điều chỉnh độ rộng cột này
        />
        <Table.Column
            title="Time"
            dataIndex="timestamp"
            key="timestamp"
            render={(timestamp) => moment(timestamp).format('HH:mm:ss DD-MM-YYYY')}
            width={200} // Điều chỉnh độ rộng cột này
        />
        <Table.Column 
            title="Name Shipper" 
            dataIndex="shipper_name" 
            key="shipper_name" 
            width={150} // Điều chỉnh độ rộng cột này
        />
        <Table.Column 
            title="Phone Shipper" 
            dataIndex="shipper_contact" 
            key="shipper_contact" 
            width={150} // Điều chỉnh độ rộng cột này
        />
    </Table>
</Modal>
        </div>
    );
};

OrderDetailPage.isAuth = true;

export default OrderDetailPage;