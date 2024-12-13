import { swtoast } from '@/mixins/swal.mixin.js';
import { StarFilled } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Rate } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useCustomerStore from '@/store/customerStore';
import CarouselFade from '@/components/productDetailPage/carousel.jsx';
import ColourList from '@/components/productDetailPage/colourListModal.jsx';
import FeedbackBox from '@/components/productDetailPage/feedbackBox.jsx';
import OptionButton from '@/components/productDetailPage/optionButton.jsx';
import PolicyItem from '@/components/productDetailPage/policyItem.jsx';
import ProductQuantityInput from '@/components/productDetailPage/productQuantityInput.jsx';
import { policyList } from '@/data/policyData.js';
import queries from '@/queries/index.js';
import useCartStore from '@/store/cartStore.js';
import { formatPrice, formatRate } from '../../helpers/format.js';
import Login from '../../components/login';
import Register from '../../components/register';
import ForgotPass from '../../components/forgotpass';

const ProductDetailModal = ({ product_id, colour, onClose }) => {
    const router = useRouter();
    const [isLogInOpen, setIsLogInOpen] = useState(false);
    const [isForgotOpen, setIsForgotOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const isUserLoggedIn = status === 'authenticated';
    const isLoggedIn = useCustomerStore((state) => state.isLoggedIn);
    // const { product_id, colour } = router.query;
    const addToCart = useCartStore((state) => state.addToCart);
    const clearError = useCartStore((state) => state.clearError);
    const isErrorInCart = useCartStore((state) => state.isError);
    const messageErrorInCart = useCartStore((state) => state.messageError);

    const [selectedColourIndex, setSelectedColourIndex] = useState(null);
    const [selectedSizeIndex, setSelectedSizeIndex] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const productQuery = useQuery(queries.products.detail(product_id));
    if (productQuery.isError) console.log(productQuery.error);
    const productName = productQuery.data?.data.product_name;
    const productDescription = productQuery.data?.data.description;
    const feedbackQuantity = productQuery.data?.data.feedback_quantity;
    const rating = productQuery.data?.data.rating;
    const sold = productQuery.data?.data.sold;

    const colourListQuery = useQuery(queries.products.colourList(product_id));
    if (colourListQuery.isError) console.log(colourListQuery.error);
    const colourList = colourListQuery.data?.data;

    const sizeListQuery = useQuery({
        ...queries.products.sizeList(product_id, colourList, selectedColourIndex),
        enabled: !!colourList && selectedColourIndex != null
    });
    if (sizeListQuery.isError) console.log(sizeListQuery.error);
    const sizeList = sizeListQuery.data?.data;

    const productVariantQuery = useQuery({
        ...queries.products.variant(
            product_id,
            colourList,
            selectedColourIndex,
            sizeList,
            selectedSizeIndex
        ),
        enabled:
            !!colourList && selectedColourIndex != null && !!sizeList && selectedSizeIndex != null
    });
    if (productVariantQuery.isError) console.log(productVariantQuery.error);
    const productVariantId = productVariantQuery.data?.data.product_variant_id;
    const inventory = productVariantQuery.data?.data.quantity;
    const price = productVariantQuery.data?.data.price;
    const productImageList = productVariantQuery.data?.data.product_images;

    useEffect(() => {
        if (colourList) {
            let index = colourList.findIndex((color) => color.colour_id == colour);
            if (index === -1) index = 0;
            setSelectedColourIndex(index);
        }
    }, [colourList, colour]);

    useEffect(() => {
        if (sizeList) {
            setSelectedSizeIndex(0);
        }
    }, [sizeList]);

    useEffect(() => {
        if (isErrorInCart) {
            swtoast.fire({
                text: messageErrorInCart
            });
            clearError();
        }
    }, [isErrorInCart, messageErrorInCart, clearError]);
    const toClose = () => {
        setIsLogInOpen(false);
        setIsRegisterOpen(false);
        setIsForgotOpen(false);
    };
    const handleAddToCart = () => {
        const product = {
            productVariantId: productVariantId,
            name: productName,
            colour: colourList[selectedColourIndex].colour_name,
            size: sizeList[selectedSizeIndex].size_name,
            image: productImageList[0],
            price: price,
            inventory: inventory,
            quantity: quantity
        };
    
        // Thêm sản phẩm vào giỏ hàng
        addToCart(product);
        
        // Đặt lại số lượng sản phẩm
        setQuantity(1);
    
        // Hiển thị thông báo thành công
        if (!isErrorInCart) {
            // swtoast.success({ text: 'Product added to cart successfully' });
            if (!isLoggedIn && !isUserLoggedIn) {
                setIsLogInOpen(true); // Mở form đăng nhập
            }
            else{
                router.push('/cart');
            }
        }
    
        // Kiểm tra đăng nhập
        
    };
    return (
        <div className="product-detail-page container">
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
            <div className="row main-infor-product">
                <div className="col-4">
                    {productImageList && <CarouselFade imageList={productImageList} />}
                </div>
                <div className="col-8">
                    <h6 className="product-name">{productName && productName}</h6>
                    <div className="rating d-flex align-items-center">
                        <span className="d-flex align-items-center">
                            <Rate disabled allowHalf value={rating && rating} />
                            <h6 className="d-inline-block">
                                {feedbackQuantity && feedbackQuantity}
                            </h6>
                        </span>
                        <span style={{ margin: '2px 0 0' }}>Sold (web): {sold && sold}</span>
                    </div>
                    <div className="price-box">{price && <span>{formatPrice(price)}đ</span>}</div>
                    <div className="colour-option-box">
                        <span>
                        Color:
                            <strong>
                                &nbsp;
                                {colourList && selectedColourIndex != null
                                    ? colourList[selectedColourIndex]?.colour_name
                                    : ''}
                            </strong>
                        </span>
                        <div>
                            <ColourList
                                productId={product_id}
                                colourList={colourList}
                                selectedColourIndex={selectedColourIndex}
                                setSelectedColourIndex={setSelectedColourIndex}
                            />
                        </div>
                    </div>
                    <div className="size-option-box">
                        <span>
                            Size:&nbsp;
                            <strong>
                                {sizeList && selectedSizeIndex != null
                                    ? sizeList[selectedSizeIndex]?.size_name
                                    : ''}
                            </strong>
                        </span>
                        <div>
                            {sizeList &&
                                sizeList.map((size, index) => {
                                    return (
                                        <OptionButton
                                            key={index}
                                            isSelected={selectedSizeIndex === index}
                                            content={size.size_name}
                                            getContent={() => setSelectedSizeIndex(index)}
                                        />
                                    );
                                })}
                        </div>
                    </div>
                    <div className="action-box row">
                        <ProductQuantityInput quantity={quantity} setQuantity={setQuantity} />
                        <div
                            className="add-product-to-cart-button border-radius col-7 d-flex justify-content-around align-items-center"
                            onClick={handleAddToCart}
                        >
                            Buy Now
                        </div>
                    </div>

                </div>
            </div>
            <style jsx>{`
    .product-detail-page {
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 8px;
        max-width: 1200px;
        margin: 0 auto;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    .main-infor-product {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-bottom: 30px;
    }

    .main-infor-product .col-4 {
        flex: 1;
        max-width: 100%;
    }

    .main-infor-product .col-8 {
        flex: 2;
        max-width: 100%;
        padding: 10px 20px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .product-name {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 10px;
        color: #333;
    }

    .rating {
        margin-bottom: 10px;
    }

    .price-box {
        font-size: 1.5rem;
        font-weight: bold;
        color: #e60023;
        margin-bottom: 20px;
    }

    .colour-option-box,
    .size-option-box {
        margin-bottom: 15px;
    }

    .action-box {
        display: flex;
        align-items: center;
        margin-top: 20px;
        gap: 15px;
    }

    .add-product-to-cart-button {
        padding: 10px 20px;
        background-color: #1890ff;
        color: #fff;
        border-radius: 8px;
        text-align: center;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s;
    }

    .add-product-to-cart-button:hover {
        background-color: #007acc;
    }

    .policy-box {
        margin-top: 20px;
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
    }

    .product-detail {
        margin-top: 30px;
        padding: 20px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .product-detail h5.title {
        font-size: 1.8rem;
        font-weight: bold;
        margin-bottom: 20px;
    }

    .review-box {
        margin-top: 30px;
        padding: 15px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .review-box .feedback_quantify-detail,
    .review-box .rating-detail {
        font-size: 1.2rem;
        font-weight: bold;
        margin-right: 10px;
    }

    .review-box .star-icon {
        color: #fadb14;
        font-size: 1.2rem;
    }

    @media (max-width: 768px) {
        .main-infor-product {
            flex-direction: column;
        }

        .main-infor-product .col-4,
        .main-infor-product .col-8 {
            flex: 1;
        }
    }
`}</style>

        </div>
    );
};

export default ProductDetailModal;
