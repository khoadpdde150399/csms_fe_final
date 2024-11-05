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

import { formatRate } from '@/helpers/format';
import Cookies from 'js-cookie';

const ProductItem = (props) => {
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isShareModalVisible, setIsShareModalVisible] = useState(false);
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
        marginLeft: '10px',
        transition: 'color 0.3s ease',
    };

    const modalStyle = {
        borderRadius: '8px',
        overflow: 'hidden',
    };

    const shareButtonsStyle = {
        display: 'flex',
        gap:'25px',
        marginBottom: '20px',
    };

    const copyLinkStyle = {
        display: 'flex',
        marginTop: '20px',
    };

    const linkInputStyle = {
        flexGrow: 1,
        // padding: '8px 12px',
        border: '1px solid #d9d9d9',
        borderRadius: '4px 0 0 4px',
        fontSize: '14px',
    };

    const copyButtonStyle = {
        borderRadius: '0 4px 4px 0',
    };

    return (
        <div className="product-item col-6 col-md-4 col-lg-3 col-xxl">
            <Link
                href={{
                    pathname: `/product/${props.product_id}`,
                    query: { colour: props.colour_id }
                }}
            >
                <div className='product-thumbnails position-relative'>
                    <Image className="img" src={props.img} fill alt={props.name} />
                    <div className="position-absolute rate-box">
                        <span className="d-flex justify-content-start align-items-center">
                            <span className="rating d-flex justify-content-start align-items-center">
                                {formatRate(props.rating)}
                            </span>
                            <StarFilled className="d-flex justify-content-start align-items-center" />
                            <span className="feedback_quantity text-primary d-flex justify-content-start align-items-center">
                                ⟮{props.feedback_quantity}⟯
                            </span>
                            {isInWishlist ? (
                                <HeartFilled
                                    onClick={(event) => handleWishlistClick(event)}
                                    className="wishlist-icon d-flex justify-content-start align-items-center"
                                    style={{ color: 'black' }} 
                                />
                            ) : (
                                <HeartOutlined
                                    onClick={(event) => handleWishlistClick(event)}
                                    className="wishlist-icon d-flex justify-content-start align-items-center"
                                />
                            )}
                            <ShareAltOutlined
                                onClick={handleShareClick}
                                style={shareIconStyle}
                                className="d-flex justify-content-start align-items-center"
                            />
                        </span>
                    </div>
                    <div className="size-box position-absolute">
                        {props.sizes.map((item, index) => (
                            <span className="size-item d-inline-block text-center" key={index}>
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </Link>
            <div className="infor-product">
                <Link
                    href={{
                        pathname: `/product/${props.product_id}`,
                        query: { colour: props.colour_id }
                    }}
                >
                    <h6>{props.name}</h6>
                </Link>
                <div className="d-flex justify-content-start">
                    <p className="price-after text-danger fw-bold">{props.price}đ</p>
                </div>
            </div>
            
            <Modal
                title="Share this product"
                visible={isShareModalVisible}
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
                        type="text" 
                        value={`${window.location.origin}/product/${props.product_id}?colour=${props.colour_id}`} 
                        readOnly 
                    />
                    <Button 
                        style={copyButtonStyle}
                        type="primary" 
                        onClick={handleCopyLink}
                    >
                        Copy Link
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default memo(ProductItem)