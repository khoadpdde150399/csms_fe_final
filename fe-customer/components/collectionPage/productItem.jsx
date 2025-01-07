/* eslint-disable react-hooks/rules-of-hooks */
import { StarFilled, HeartOutlined, HeartFilled, ShareAltOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useState, useEffect } from 'react';
import { Modal, Button, message } from 'antd';
import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon
} from 'react-share';
import { useQuery } from '@tanstack/react-query';
import queries from '@/queries/index.js';
import { formatRate } from '@/helpers/format';
import Cookies from 'js-cookie';
import ProductDetailModal from '@/pages/product/product_modal';
const styles = {
    productItem: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    productThumbnails: {
        position: 'relative',
        width: '100%',
        paddingTop: '100%', // Giữ tỷ lệ khung hình vuông
        overflow: 'hidden',
        margin: '0 auto', // Căn giữa thumbnail
    },
    thumbnailContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative', // Quan trọng để căn chỉnh nút Mua Ngay trong ảnh
    },
    image: {
        objectFit: 'cover',
    },
    inforProduct: {
        padding: '15px 0',
        textAlign: 'center',
    },
    productName: {
        fontSize: '16px',
        fontWeight: '500',
        marginBottom: '8px',
        color: '#333',
        textDecoration: 'none',
        display: 'block',
    },
    price: {
        fontSize: '18px',
        color: '#ff4d4f',
        fontWeight: 'bold',
        margin: '0',
    },
    rateBox: {
        position: 'absolute',
        top: '10px',
        left: '10px',
        right: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1,
    },
    rateBoxMobile: {
        position: 'absolute',
        top: '5px',
        left: '5px',
        right: '5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1,
    },
    sizeBox: {
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        right: '10px',
        display: 'flex',
        gap: '5px',
    },
    sizeBoxMobile: {
        position: 'absolute',
        bottom: '5px',
        left: '5px',
        display: 'flex',
        gap: '3px',
    },
    sizeItem: {
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '12px',
    },
    buyNowButton: {
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        zIndex: 2,
        padding: '10px 20px',
        fontSize: '14px',
        borderRadius: '25px',
        backgroundColor: '#1890ff',
        color: 'white',
        border: 'none',
    },
    buyNowButtonMobile: {
       display: 'none'
    },
    sizeRating: {
        display: 'flex', 
        alignItems: 'center', 
        background: 'rgba(255, 255, 255, 0.8)', 
        padding: '4px 8px', 
        borderRadius: '4px' 
    },  
    sizeRatingMobile: {
        display: 'flex', 
        alignItems: 'center', 
        background: 'rgba(255, 255, 255, 0.8)', 
        padding: '2px 5px', 
        borderRadius: '4px' 
    }, 
};

const ProductItem = (props) => {
    
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isShareModalVisible, setIsShareModalVisible] = useState(false);
    const [isProductDetailModalVisible, setIsProductDetailModalVisible] = useState(false);
    const [modalData, setModalData] = useState({ product_id: null, colour_id: null });
    const { updateWishlist } = props;

    useEffect(() => {
        const wishlist = Cookies.get('wishlist') ? JSON.parse(Cookies.get('wishlist')) : [];
        const productInWishlist = wishlist.some(product => product.id === props.product_id);
        setIsInWishlist(productInWishlist);
    }, [props.product_id]);

    const handleWishlistClick = (event) => {
        event.preventDefault();
        let wishlist = Cookies.get('wishlist') ? JSON.parse(Cookies.get('wishlist')) : [];
        const index = wishlist.findIndex(product => product.id === props.product_id);
        if (index > -1) {
            wishlist.splice(index, 1);
            setIsInWishlist(false);
        } else {
            wishlist.push({ id: props.product_id, ...props });
            setIsInWishlist(true);
        }
        Cookies.set('wishlist', JSON.stringify(wishlist), { expires: 7 });
        updateWishlist(props);
    };

    const handleShareClick = (event) => {
        event.preventDefault();
        setIsShareModalVisible(true);
    };

    const handleModalClose = () => {
        setIsShareModalVisible(false);
    };

    const handleCopyLink = () => {
        const link = `${window.location.origin}/product/${props.product_id}?colour=${props.colour_id}`;
        navigator.clipboard.writeText(link);
        message.success('Link copied to clipboard!');
    };

    const shareIconStyle = {
        cursor: 'pointer',
        fontSize: '20px',
        color: '#fff',
        background: 'rgba(0, 0, 0, 0.5)',
        padding: '5px',
        borderRadius: '50%',
    };
    const shareIconMobileStyle = {
        cursor: 'pointer',
        fontSize: '15px',
        color: '#fff',
        background: 'rgba(0, 0, 0, 0.5)',
        padding: '5px',
        borderRadius: '50%',
    };

    const modalStyle = {
        borderRadius: '8px',
        overflow: 'hidden',
    };

    const shareButtonsStyle = {
        display: 'flex',
        justifyContent: 'center',
        gap: '25px',
        marginBottom: '20px',
    };

    const copyLinkStyle = {
        display: 'flex',
        gap: '10px',
    };

    const linkInputStyle = {
        flexGrow: 1,
        border: '1px solid #d9d9d9',
        borderRadius: '4px 0 0 4px',
        padding: '8px 12px',
    };

    const copyButtonStyle = {
        borderRadius: '0 4px 4px 0',
    };

    const handleBuyNow = (event) => {
        event.preventDefault(); // Ngăn hành vi mặc định của nút
        // Gửi product_id và colour_id vào Modal
        setModalData({
            product_id: props.product_id,
            colour_id: props.colour_id,
        });
        setIsProductDetailModalVisible(true); // Mở modal
    };
    const closeProductDetailModal = () => {
        setIsProductDetailModalVisible(false); // Đóng modal
        setModalData({ product_id: null, colour_id: null }); // Reset dữ liệu modal
};
    return (
        <div style={styles.productItem}>
            <Link
                href={{
                    pathname: `/product/${props.product_id}`,
                    query: { colour: props.colour_id }
                }}
            >
                <div style={styles.thumbnailContainer}>
                    <div style={styles.productThumbnails}>
                        <Image
                            style={{
                                objectFit: 'cover',
                                objectPosition: 'top',
                                borderRadius: '7px'
                            }}
                            src={props.img}
                            fill
                            alt={props.name}
                            priority 
                        />
                        <div style={isMobile ? styles.rateBoxMobile : styles.rateBox}>
                            <div style={isMobile ? styles.sizeRatingMobile : styles.sizeRating}>
                                <span>{formatRate(props.rating)}</span>
                                <StarFilled style={{ color: '#fadb14', marginLeft: '4px' }} />
                                <span style={{ marginLeft: '4px', color: '#666' }}>
                                    ({props.feedback_quantity})
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                {isInWishlist ? (
                                    <HeartFilled
                                        onClick={(event) => handleWishlistClick(event)}
                                        style={{...(isMobile ? shareIconMobileStyle : shareIconStyle), color: '#ff4d4f' }}
                                    />
                                ) : (
                                    <HeartOutlined
                                        onClick={(event) => handleWishlistClick(event)}
                                        style={isMobile ? shareIconMobileStyle : shareIconStyle}
                                    />
                                )}
                                <ShareAltOutlined
                                    onClick={handleShareClick}
                                    style={isMobile ? shareIconMobileStyle :shareIconStyle}
                                />
                            </div>
                        </div>
                        <div style={isMobile ? styles.sizeBoxMobile : styles.sizeBox}>
                            {props.sizes.map((item, index) => (
                                <span style={styles.sizeItem} key={index}>
                                    {item}
                                </span>
                            ))}
                        </div>
                        <Button                        
                            type="primary"
                            style={isMobile ? styles.buyNowButtonMobile : styles.buyNowButton}
                            onClick={handleBuyNow} 
                        >
                            Buy Now
                        </Button>
                    </div>
                </div>
            </Link>
            <div style={styles.inforProduct}>
                <Link
                    href={{
                        pathname: `/product/${props.product_id}`,
                        query: { colour: props.colour_id }
                    }}
                >
                    <h6 style={styles.productName}>{props.name}</h6>
                </Link>
                <p style={styles.price}>{props.price}đ</p>
            </div>

            {/* Nút "Mua Ngay" */}


            {/* Modal chia sẻ */}
            <Modal
                title="Share this product"
                open={isShareModalVisible}
                onCancel={handleModalClose}
                footer={null}
                style={modalStyle}
            >
                <div style={shareButtonsStyle}>
                    <FacebookShareButton url={`${window.location.origin}/product/${props.product_id}?colour=${props.colour_id}`}>
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={`${window.location.origin}/product/${props.product_id}?colour=${props.colour_id}`}>
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <LinkedinShareButton url={`${window.location.origin}/product/${props.product_id}?colour=${props.colour_id}`}>
                        <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                </div>
                <div style={copyLinkStyle}>
                    <input
                        style={linkInputStyle}
                        readOnly
                        value={`${window.location.origin}/product/${props.product_id}?colour=${props.colour_id}`}
                    />
                    <Button
                        style={copyButtonStyle}
                        onClick={handleCopyLink}
                    >
                        Copy Link
                    </Button>
                </div>
            </Modal>
                        <Modal
                            open={isProductDetailModalVisible}
                            onCancel={closeProductDetailModal}
                            footer={null}
                            width={1200}
                            height={900} // Điều chỉnh độ rộng của Modal
                            bodyStyle={{ padding: '20px' }}
                            >
                            <ProductDetailModal
                                product_id={modalData.product_id}
                                colour={modalData.colour_id}
                                onClose={closeProductDetailModal}
                            />
                        </Modal>
        </div>
    );
};

export default memo(ProductItem);
