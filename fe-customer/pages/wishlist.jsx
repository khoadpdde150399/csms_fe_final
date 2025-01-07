import { useQuery } from '@tanstack/react-query';
import { Empty } from 'antd';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { formatTime, formatPrice, formatAllInDate } from '@/helpers/format'
import ProductItem from '@/components/collectionPage/productItem';

const WishlistPage = () => {
    const router = useRouter();
    const [wishlist, setWishlist] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8; // 2 rows of 4 products each
    useEffect(() => {
        const savedWishlist = Cookies.get('wishlist') ? JSON.parse(Cookies.get('wishlist')) : [];
        setWishlist(savedWishlist);
    }, []);

    const updateWishlist = (product) => {
        let updatedWishlist = [...wishlist];
        const index = updatedWishlist.findIndex(item => item.id === product.product_id);
        if (index > -1) {
            updatedWishlist.splice(index, 1);
        } else {
            updatedWishlist.push({ id: product.product_id, ...product });
        }
        Cookies.set('wishlist', JSON.stringify(updatedWishlist), { expires: 7 });
        setWishlist(updatedWishlist);
    };
    // Calculate current products
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = wishlist ? wishlist.slice(indexOfFirstProduct, indexOfLastProduct) : [];

    // Change page
    const onPageChange = (page) => setCurrentPage(page);
    return (
        <div className="product-page container pt-4">
            <div className="product-list row">
            {wishlist.length > 0 ? (
                    wishlist.map((product, index) => {
                        return (
                            <ProductItem
                                key={product.product_id}
                                product_id={product.product_id}
                                name={product.name}
                                img={product.img}
                                price={product.price}
                                colour_id={product.colour_id}
                                sizes={product.sizes}
                                rating={product.rating}
                                feedback_quantity={product.feedback_quantity}
                                isInWishlist={true}
                                updateWishlist={updateWishlist}
                            />
                        );
                    })
                ) : (
                    <div className="d-flex" style={{ width: '100%', height: '400px' }}>
                        <Empty style={{ margin: 'auto' }} />
                    </div>
                )}
            </div>
            {wishlist && wishlist.length > productsPerPage && (
                <div className="pagination-container">
                    <Pagination
                        current={currentPage}
                        total={wishlist.length}
                        pageSize={productsPerPage}
                        onChange={onPageChange}
                        showSizeChanger={false}
                    />
                </div>
            )}
            <style jsx>{`
                .product-list {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 24px;
                }

                .pagination-container {
                    display: flex;
                    justify-content: center;
                    margin-top: 40px;
                    margin-bottom: 40px;
                }

                @media (max-width: 1200px) {
                    .product-list {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                @media (max-width: 768px) {
                    .product-list {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            `}</style>
            <style jsx global>{`
                .ant-pagination-item {
                    border-radius: 50%;
                    font-weight: 500;
                }

                .ant-pagination-item-active {
                    background-color: #1890ff;
                    border-color: #1890ff;
                }

                .ant-pagination-item-active a {
                    color: #fff;
                }

                .ant-pagination-prev button,
                .ant-pagination-next button {
                    border-radius: 50%;
                }

                .ant-pagination-item:hover,
                .ant-pagination-prev button:hover,
                .ant-pagination-next button:hover {
                    border-color: #40a9ff;
                }

                .ant-pagination-item:hover a {
                    color: #40a9ff;
                }
            `}</style>
        </div>
    );
};

export default WishlistPage;
