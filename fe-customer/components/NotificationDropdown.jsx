import { BellOutlined } from '@ant-design/icons';
import { Dropdown, Badge, List, Avatar } from 'antd';
import { useEffect, useState } from 'react';
import { formatTime } from '@/helpers/format';
import Link from 'next/link';
import useCustomerStore from '@/store/customerStore';
import orderService from '@/services/orderService';
import { BellFilled } from '@ant-design/icons';
const NotificationDropdown = () => {
    const customerId = useCustomerStore((state) => state.customerInfor?.customerId);
    const [notificationList, setNotificationList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const getNotificationList = async () => {
            try {
                setLoading(true);
                const result = await orderService.getNotification();
                setNotificationList(result.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        getNotificationList();
    }, [customerId]);

    const handleDropdownClick = (open) => {
        setIsDropdownOpen(open);
    };

    const handleReadClick = async (item) => {
        try {
            setLoading(true);
            await orderService.updateStatusNotification(item);
            const result = await orderService.getNotification();
            setNotificationList(result.data);
        } catch (error) {
            console.error('Error updating notification status:', error);
        } finally {
            setLoading(false);
        }
    };



    return (
        <li style={{marginLeft:'-15px'}} className="cart inner-item menu-item fw-bold text-uppercase">
            <Dropdown 
                overlay={<NotificationListContent />}
                placement="bottomRight"
                trigger={['click']}
                arrow
                open={isDropdownOpen}
                onOpenChange={handleDropdownClick}
                overlayStyle={{ zIndex: 1000 }}
            >
                <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    height: '100%',
                    padding: '0 8px'
                }}>
                    <Badge 
                        count={notificationList.length}
                        style={{ 
                            marginRight: '-5px',
                        }}
                        size="small"
                    >
                        <BellOutlined  style={{ 
                            fontSize: '24px',
                            color: 'inherit'
                        }} />
                    </Badge>
                </span>
            </Dropdown>
        </li>
    );
};

export default NotificationDropdown;