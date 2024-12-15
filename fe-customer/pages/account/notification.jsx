import { useEffect, useState } from 'react';
import AccountSidebar from '@/components/accountSidebar';
import orderService from '@/services/orderService';
import useCustomerStore from '@/store/customerStore';
import { formatDate, formatPrice, formatTime } from '@/helpers/format';

const NotificationPage = () => {
    const customerId = useCustomerStore((state) => state.customerInfor?.customerId);
    const [notificationList, setNotificationList] = useState([]);

    const refreshNotificationList = async () => {
        if (customerId) {
            try {
                const result = await orderService.getNotification();
                setNotificationList(result.data);
                console.log("refreshNotificationList a hau",result.data);
            } catch (err) {
                console.log(err);
            }
        }
    };

    useEffect(() => {
        const getNotificationList = async () => {
            try {
                const result = await orderService.getNotificationAll();
                setNotificationList(result.data);
                console.log("setNotificationList a hau",result.data);
            } catch (err) {
                console.log(err);
            }
        };
        getNotificationList();
    }, [customerId]);
    console.log("customerId a hau",customerId);

    return (
        <div className="order-history-page container">
            <div className="row">
                <div className="col-12 col-md-4">
                    <AccountSidebar />
                </div>
                <div className="col-12 col-md-8">
                    <div className="orders-tab">
                        <div className="title">
                        Notifications
                        </div>
                        <div className="orders-body">
                        {notificationList.map((item, index) => (
                            <a class="order border-radius" key={index} >
                                <div class="order-header border-radius d-flex align-items-center justify-content-between">
                                    <div>
                                        <p class="order-title fw-bold">{item.content}</p>
                                        <p class="order-date">{formatTime(item.created_at)}</p>
                                    </div>
                                </div>
                            </a>
                        ))}
                        </div>
                    </div>
                 
                </div>
            </div>
        </div>
    );
};

export default NotificationPage;