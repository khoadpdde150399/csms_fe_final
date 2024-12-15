import React, { useState, useEffect } from 'react';
import { menu } from '../data/data';  // Giả sử bạn đã khai báo menu trong file data.js
import router from 'next/router';
import useAdminStore from '@/store/adminStore';  // Giả sử đây là store quản lý trạng thái đăng nhập

// Hàm tùy chỉnh menu dựa trên role_id
const getMenuByRole = (role_id) => {
    if (role_id === 1) {
        // Admin (role_id = 1): Hiển thị tất cả trừ "Tin Nhắn"
        return menu.filter(item => item.title !== 'Message Management');
    } else if (role_id === 3) {
        // Staff (role_id = 3): Chỉ hiển thị "Quản lý sản phẩm" và "Tin Nhắn"
        return menu.filter(item => item.title === 'Products Management' || item.title === 'Message Management');
    } else {
        // Trường hợp khác: Không hiển thị gì hoặc xử lý mặc định
        return [];
    }
};

const Section = () => {
    const [showMenuItem, setShowMenuItem] = useState({});
    const role_id = useAdminStore((state) => state.role_id);  // Lấy role_id từ store Zustand
    const [filteredMenu, setFilteredMenu] = useState([]);

    // Cập nhật menu dựa trên role_id mỗi khi role_id thay đổi
    useEffect(() => {
        const updatedMenu = getMenuByRole(role_id);
        setFilteredMenu(updatedMenu);
    }, [role_id]);

    const handleClick = (index) => {
        setShowMenuItem({
            ...showMenuItem,
            [index]: !showMenuItem[index]
        });
    };
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const showhideMenuMobile = () => {
        setIsMenuOpen(!isMenuOpen);
    }
    return (
        <div className='section w-100'>
            <div className="logo-box text-center">
                <img className='logo' src="../logo.png" alt="Logo" />
                <button className="menu-btn" id="menu-icon" onClick={() => showhideMenuMobile()}>
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>
            <ul className="menu position-relative menu-pc" >
                {filteredMenu && filteredMenu.map((item, index) => {
                    return (
                        <li onClick={() => router.push(item.href)} className='menu-item text-uppercase fw-bold' key={index}>
                            <a onClick={() => handleClick(index)} className='w-100' href="#">{item.title}</a>
                            {showMenuItem[index] && (
                                <ul className='sub-menu position-absolute w-100'>
                                    {item.list && item.list.map((listItem, i) => {
                                        return (
                                            <li onClick={() => router.push(listItem.href)} key={i} className='w-100'>
                                                <a href='#' className="w-100">
                                                    {listItem.title}
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </li>
                    );
                })}
            </ul>
            <ul className="menu position-relative menu-mobile" style={{ display: isMenuOpen ? "block" : "none" }}>
                {filteredMenu && filteredMenu.map((item, index) => {
                    return (
                        <li onClick={() => router.push(item.href)} className='menu-item text-uppercase fw-bold' key={index}>
                            <a onClick={() => handleClick(index)} className='w-100' href="#">{item.title}</a>
                            {showMenuItem[index] && (
                                <ul className='sub-menu position-absolute w-100'>
                                    {item.list && item.list.map((listItem, i) => {
                                        return (
                                            <li onClick={() => router.push(listItem.href) } key={i} className='w-100'>
                                                <a href='#' className="w-100">
                                                    {listItem.title}
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Section;