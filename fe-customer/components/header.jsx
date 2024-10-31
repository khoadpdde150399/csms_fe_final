import { swalert, swtoast } from '@/mixins/swal.mixin';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaAngleDown, FaShoppingBag } from 'react-icons/fa';
import logo from '@/public/img/logo.png';
import queries from '@/queries';
import customerService from '@/services/customerService';
import useCustomerStore from '@/store/customerStore';
import Login from './login';
import Register from './register';
import { useSession, signIn, signOut } from 'next-auth/react'; // Import signIn and signOut
import ForgotPass from './forgotpass';
import { useEffect, useRef } from 'react';
import NotificationDropdown from './NotificationDropdown'; 
import { HeartFilled } from '@ant-design/icons';

const Header = () => {
    const [isLogInOpen, setIsLogInOpen] = useState(false);
    const [isForgotOpen, setIsForgotOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const isLoggedIn = useCustomerStore((state) => state.isLoggedIn);
    const setCustomerLogout = useCustomerStore((state) => state.setCustomerLogout);

    const { data: session, status } = useSession(); // Get session and status
    const isUserLoggedIn = status === 'authenticated'; // Check if user is logged in via next-auth

    const setCustomerLogin = useCustomerStore((state) => state.setCustomerLogin);
    useEffect(() => {
        if (session?.access_token) {
            const customerInfor = {
                accessToken: session.access_token,
                accessTokenExpires: session.access_token_expires,
            };
            setCustomerLogin(customerInfor);
        }
    }, [session, setCustomerLogin]);

    const { isError, error, data } = useQuery({
        ...queries.categories.list(),
    });
    if (isError) console.log(error);
    const categoryList = data?.data;

    const toClose = () => {
        setIsLogInOpen(false);
        setIsRegisterOpen(false);
        setIsForgotOpen(false);
    };

    const checkLogin = () => {
        if (!isLoggedIn && !isUserLoggedIn) {
            setIsLogInOpen(true)
        } else {
            window.location.href = `/cart`;
        }
    };

    const searchInputRef = useRef('');
    const searchForm = (event) => {
        event.preventDefault();
        const searchValue = searchInputRef.current.value;
        window.location.href = `/search?s=${encodeURIComponent(searchValue).replace(/%20/g, '+')}`;
    };
    const handleSignOut = () => {
        swalert
            .fire({
                allowOutsideClick: false,
                allowEscapeKey: false,
                showCancelButton: true,
                showLoaderOnConfirm: true,
                preConfirm: async () => {
                    try {
                        await signOut({ redirect: false }); // Use next-auth's signOut method
                        return { isError: false };
                    } catch (error) {
                        console.log(error);
                        return { isError: true };
                    }
                },
                title: 'Đăng xuất',
                icon: 'warning',
                text: 'Bạn muốn đăng xuất?',
            })
            .then((result) => {
                if (result.isConfirmed && !result.value?.isError) {
                    setCustomerLogout();
                    swtoast.success({ text: 'Đăng xuất thành công!' });
                } else if (result.isConfirmed && result.value?.isError) {
                    swtoast.error({ text: 'Đăng xuất thất bại!' });
                }
            });
    };
    return (
        <div className="header-wrapper position-relation">
            {/* Show login and register if not logged in */}
            {!isLoggedIn && !isUserLoggedIn && (
                <>
                    <div className={!isLogInOpen ? 'd-none' : ''}>
                        <Login
                            toRegister={() => {
                                setIsLogInOpen(false);
                                setIsRegisterOpen(true);
                                setIsForgotOpen(false);
                            }}
                            toClose={toClose}
                            toForgot={() => {
                                setIsLogInOpen(false);
                                setIsRegisterOpen(false);
                                setIsForgotOpen(true);
                            }}
                            toCloseForgot={toClose}
                        />
                    </div>
                    <div className={!isRegisterOpen ? 'd-none' : ''}>
                        <Register
                            toLogin={() => {
                                setIsRegisterOpen(false);
                                setIsLogInOpen(true);
                                setIsForgotOpen(false);
                            }}
                            toClose={toClose}
                            toForgot={() => {
                                setIsLogInOpen(false);
                                setIsRegisterOpen(false);
                                setIsForgotOpen(true);
                            }}
                            toCloseForgot={toClose}
                        />
                    </div>
                    <div className={!isForgotOpen ? 'd-none' : ''}>
                        <ForgotPass
                            toLogin={() => {
                                setIsRegisterOpen(false);
                                setIsLogInOpen(true);
                                setIsForgotOpen(false);
                            }}
                            toClose={toClose}
                            toRegister={() => {
                                setIsLogInOpen(false);
                                setIsRegisterOpen(true);
                                setIsForgotOpen(false);
                            }}
                            toClose1={toClose}
                        />
                    </div>
                </>
            )}

            <div className="header w-100 d-flex align-items-center">
                <div className="logo-box p-2">
                    <Link href="/">
                        <Image className="logo" src={logo} alt="" />
                    </Link>
                </div>

                <ul className="menu p-2">
                    <li className="menu-item fw-bold text-uppercase position-relative">
                        <Link href="/collections" className="d-flex align-items-center">
                            Tất cả
                        </Link>
                    </li>
                    {categoryList &&
                        categoryList.map((categoryLevel1, index) => (
                            <li
                                className="menu-item fw-bold text-uppercase position-relative"
                                key={index}
                            >
                                <Link href="#" className="d-flex align-items-center">
                                    {categoryLevel1.title}
                                    <span>
                                        <FaAngleDown />
                                    </span>
                                </Link>
                                <ul className="sub-menu position-absolute">
                                    {categoryLevel1.children &&
                                        categoryLevel1.children.map((category, index) => (
                                            <li key={index} className="w-100">
                                                <Link
                                                    href={{
                                                        pathname: '/collections',
                                                        query: { category: category.category_id },
                                                    }}
                                                >
                                                    {category.title}
                                                </Link>
                                            </li>
                                        ))}
                                </ul>
                            </li>
                        ))}
                </ul>


                <ul className="header-inner p-2 ms-auto">
                    <li className="search inner-item menu-item fw-bold text-uppercase">
                        <div className="h-8 relative transform z-20 flex items-center bg-gray-700 rounded-sm hover:shadow-xl hover:scale-105 transition duration-500">
                            <form method="get" action="/search" onSubmit={searchForm}>
                                <div className="flex px-2 w-42 space-x-2 rounded-sm">
                                    <input
                                        ref={searchInputRef}
                                        name="s"
                                        type="text"
                                        placeholder="Nhập từ khóa..."
                                        defaultValue=""
                                        className="bg-gray-700 text-gray-200 text-sm font-normal outline-none"
                                    />
                                    <svg onClick={searchForm} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="iconsearch h-5 w-5 opacity-50 text-gray-200 cursor-pointer">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>
                            </form>
                        </div>
                    </li>
                    {!isLoggedIn && !isUserLoggedIn ? (
                        <>
                            <li
                                onClick={() => setIsLogInOpen(true)}
                                className="inner-item menu-item fw-bold text-uppercase"
                            >
                                <a href="#">Đăng Nhập</a>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="inner-item menu-item fw-bold text-uppercase">
                                <Link href="/account/infor">Account</Link>
                            </li>
                            <li
                                onClick={handleSignOut} // Handle sign out using next-auth
                                className="inner-item menu-item fw-bold text-uppercase"
                            >
                                <a href="#">Log Out</a>
                            </li>
                        </>
                    )}
                    <li onClick={() => checkLogin()} className="cart inner-item menu-item fw-bold text-uppercase">
                        <FaShoppingBag />
                    </li>
                    <li className="cart inner-item menu-item fw-bold text-uppercase">
                        <Link href="/wishlist">
                            <HeartFilled />
                        </Link>
                    </li>
                    {/* <li style={{marginLeft:'-25px'}} className="cart inner-item menu-item fw-bold text-uppercase" >
                        <Link href="/account/notification">
                        <BellFilled />
                        </Link>
                    </li> */}
                    <NotificationDropdown />
                </ul>
            </div>
        </div>
    );
};

export default Header;
