import { useQuery } from '@tanstack/react-query';
import { Empty, Pagination } from 'antd';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { formatTime, formatPrice, formatAllInDate } from '@/helpers/format'
import ProductItem from '@/components/collectionPage/productItem';
import queries from '@/queries';

const SearchPage = () => {
    const router = useRouter();
    const { s } = router.query;
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8; // 2 rows of 4 products each
    const { isError, error, data } = useQuery(queries.products.search(s));
    if (isError) console.log(error);
    const uniqueProducts = data?.data ? data.data.reduce((acc, current) => {
        const x = acc.find(item => item.product_id === current.product_id);
        if (!x) {
            return acc.concat([current]);
        }
        return acc;
    }, []) : [];
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = uniqueProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const handleShare = (productId, productName) => {
        setSelectedProduct({
            id: productId,
            name: productName,
            url: `${window.location.origin}/product/${productId}`
        });
        setShareModalVisible(true);
    };

    const updateWishlist = (product) => {
        // Xử lý wishlist
    };

    const onPageChange = (page) => setCurrentPage(page);
    return (
        <div className="product-page container pt-4">
            <div className="product-list">
                {currentProducts && currentProducts.length ? (
                    currentProducts.map((product, index) => (
                        <ProductItem
                            key={product.product_id} // Sửa key thành product_id thay vì index
                            product_id={product.product_id}
                            name={product.product_name}
                            img={product.product_image}
                            price={formatPrice(product.price)}
                            colour_id={product.colour_id}
                            sizes={product.sizes}
                            rating={product.rating}
                            feedback_quantity={product.feedback_quantity}
                            updateWishlist={updateWishlist}
                            onShare={handleShare}
                        />
                    ))
                ) : (
                    <div className="d-flex" style={{ width: '100%', height: '400px' }}>
                        <Empty style={{ margin: 'auto' }} />
                    </div>
                )}
            </div>
            {uniqueProducts.length > productsPerPage && (
                <div className="pagination-container">
                    <Pagination
                        current={currentPage}
                        total={uniqueProducts.length}
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

export default SearchPage;
