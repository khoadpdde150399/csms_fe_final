import React, { useEffect } from 'react';
import Router from 'next/router';
import useAdminStore from '@/store/adminStore';  // Giả sử bạn đã import đúng store

const HomePage = () => {
    const role_id = useAdminStore((state) => state.role_id);  // Lấy role_id từ store
    console.log(role_id);

    useEffect(() => {
        // Kiểm tra role_id và điều hướng tương ứng
        if (role_id === 1) {
            Router.push('/user/manage');  // Admin
        } else if (role_id === 3) {
            Router.push('/chat/manage');  // Staff
        } else if (role_id === 4 || role_id === 5) {
            Router.push('/order/schedule/manage');  // Cho role_id 4 và 5
        } else {
            Router.push('/login');  // Nếu không có role_id hoặc role_id khác, điều hướng về login
        }
    }, [role_id]);  // Theo dõi sự thay đổi của role_id

    return (
        <div className="Home"></div>
    );
};

export default HomePage;