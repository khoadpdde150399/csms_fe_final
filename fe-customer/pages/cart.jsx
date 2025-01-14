import { swtoast } from '@/mixins/swal.mixin';
import queries from '@/queries';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { Button, Radio, Select } from 'antd';
import CartItem from '@/components/cartPage/cartItem';
import CustomerInforForm from '@/components/cartPage/customerInforForm';
import { formatPrice } from '@/helpers/format';
import orderService from '@/services/orderService';
import useCartStore from '@/store/cartStore';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';

const CartPage = () => {
    const router = useRouter();
    const productList = useCartStore((state) => state.productList);
    const clearCart = useCartStore((state) => state.clearCart);
    const [selectedCoupon, setSelectedCoupon] = useState('');
    const { isError, error, data } = useQuery({
        ...queries.customer.infor(),
        staleTime: 5 * 60 * 1000
    });

    if (isError) {
        console.log(error);
        router.push('/404');
    }

    const [listCoupon, setListCoupon] = useState([]);
    const [moneyDiscount, setMoneyDiscount] = useState(0);

    const { isError: isError2, error: error2, data: data2 } = useQuery(queries.products.listcoupon());

    useEffect(() => {
        if (isError2) console.error(error2);
        if (data2) {
            setListCoupon(data2.data);
        }
    }, [isError2, error2, data2]);

    const formatExpirationTime = (endDate) => {
        const now = dayjs();
        const expiration = dayjs(endDate);
        const diffHours = expiration.diff(now, 'hour');
        const diffDays = expiration.diff(now, 'day');

        if (diffDays < 0) {
            return 'Expired';
        } else if (diffDays === 0) {
            return (diffHours <= 0 ? `${expiration.diff(now, 'minute')} minutes` : `${diffHours} hours`);
        } else {
            return `${diffDays} days`;
        }
    };

    const onChangeDiscount = (value) => {
        const selected = listCoupon.find(item => item.code === value);
        if (selected) {
            setSelectedCoupon(selected.code);
            setMoneyDiscount(selected.money);
        } else {
            setSelectedCoupon('');
            setMoneyDiscount(0);
        }
    };

    const [shippingCost, setShippingCost] = useState('J&T express');
    const handleShippingCostChange = (e) => {
        setShippingCost(e.target.value);
    };

    const customerInfo = data?.data && {
        email: data.data?.email,
        customerName: data.data?.customer_name,
        phoneNumber: data.data?.phone_number,
        address: data.data?.address,
        payment_method: data.data?.payment_method,
        statusPayment: 'Process',
    };

    const totalPrice = useMemo(() => {
        return productList.reduce((accumulator, product) => accumulator + product.totalValue, 0);
    }, [productList]);

    const deliveryCharges = useMemo(() => {
        const shippingFee = shippingCost === 'J&T express' ? 35000 : 25000;
        return {
            price: totalPrice > 300000 ? 0 : shippingFee,
            originalPrice: shippingFee,
            isDiscounted: totalPrice > 300000
        };
    }, [totalPrice, shippingCost]);

    const finalTotal = (totalPrice + deliveryCharges.price - moneyDiscount) > 0 ? totalPrice + deliveryCharges.price - moneyDiscount : 0;

    const { control, handleSubmit } = useForm();

    const handlePlaceOrder = useCallback(async (values) => {
    if (productList.length) {
        try {
            const orderItems = productList.map((product) => ({
                product_variant_id: product.productVariantId,
                quantity: product.quantity
            }));

            const order = {
                customer_name: values.customerName,
                email: values.email,
                phone_number: values.phoneNumber,
                address: values.address,
                order_items: orderItems,
                payment_method: values.payment_method,
                statusPayment: 'Process',
                shipping: shippingCost,
                delivery_charges: deliveryCharges.price,
                discount_code: selectedCoupon, // Thêm mã giảm giá vào đơn hàng
            };

            await orderService.placeOrder(order);
            clearCart();
            swtoast.success({ text: 'Order successful' });
        } catch (err) {
            console.log(err);
            swtoast.error({ text: 'There was an error creating the order, please try again!' });
        }
    } else {
        swtoast.error({ text: 'There are no products in the cart. Please add products to the cart.' });
    }
}, [clearCart, productList, shippingCost, deliveryCharges, selectedCoupon]);

    const getCouponStyle = (isExpired) => ({
        padding: '15px',
        margin: '5px 0',
        borderRadius: '5px',
        backgroundColor: isExpired ? '#f8d7da' : '#e2f0d4',
        color: isExpired ? '#721c24' : '#155724',
        border: `1px solid ${isExpired ? '#f5c6cb' : '#c3e6cb'}`,
        fontWeight: 'bold',
        cursor: isExpired ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
    });
 console.log("selectedCoupon",selectedCoupon);
    return (
        <div className="cart-page container pb-4">
            <div className="row cart-page-child">
                <div className="col-12 col-lg-7 cart-left-section">
                    {customerInfo && <CustomerInforForm
                        email={customerInfo.email}
                        customerName={customerInfo.customerName}
                        phoneNumber={customerInfo.phoneNumber}
                        address={customerInfo.address}
                        payment_method={customerInfo.payment_method}
                        handlePlaceOrder={handlePlaceOrder}
                        amount={finalTotal}
                    />}
                </div>
                <div className="col-12 col-lg-5 cart-right-section">
                    <div className="title">Shopping Cart</div>
                    <div className="cart-section">
                        {productList.length > 0 ? (
                            productList.map((product, index) => (
                                <CartItem
                                    key={index}
                                    productVariantId={product.productVariantId}
                                    name={product.name}
                                    image={product.image}
                                    colour={product.colour}
                                    size={product.size}
                                    quantity={product.quantity}
                                    totalValue={formatPrice(product.totalValue)}
                                />
                            ))
                        ) : (
                            <p className="text-center">There are no products in the cart.</p>
                        )}
                    </div>
                    <div className="shipping">
                        <div className="title">Shipping unit</div>
                        <div>
                            <label className="shipping-item w-100 border-radius d-flex align-items-center justify-content-start">
                                <Radio
                                    name="shipping_cost"
                                    value="J&T express"
                                    checked={shippingCost === 'J&T express'}
                                    onChange={handleShippingCostChange}
                                /> J&T express (Fast delivery)
                            </label>
                        </div>
                        <div>
                            <label className="shipping-item w-100 border-radius d-flex align-items-center justify-content-start">
                                <Radio
                                    name="shipping_cost"
                                    value="Viettel"
                                    checked={shippingCost === 'Viettel'}
                                    onChange={handleShippingCostChange}
                                /> Viettel (Delayed delivery)
                            </label>
                        </div>
                    </div>
    <div className="discount">
    <div className="title">Discount code</div>
    <Select 
        value={selectedCoupon || "Select discount code"} // Đảm bảo rằng trạng thái là chuỗi rỗng khi không có mã nào được chọn
        onChange={onChangeDiscount} 
        placeholder="Select discount code" 
        style={{ width: '100%' }}
    >
        <Select.Option key="default" value="" disabled>Select discount code</Select.Option> {/* Tùy chọn không chọn */}
        {listCoupon && Array.isArray(listCoupon) && listCoupon.map((item, index) => {
            const expirationTime = formatExpirationTime(item.end_at);
            const isExpired = (item.quantity <= 0 || dayjs(item.end_at).isBefore(dayjs()));
            
            return (
                <Select.Option
                    key={index}
                    value={isExpired || item.quantity <= 0 ? '' : item.code}
                    disabled={isExpired}
                    style={getCouponStyle(isExpired)}
                >
                    <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <strong>{item.code}</strong>
                        <span style={{ color: isExpired ? '#721c24' : '#155724' }}>
                            {isExpired || item.quantity < 1 ? 'Out of stock' : `${item.money} - ${expirationTime} - Qty: ${item.quantity}`}
                        </span>
                    </span>
                </Select.Option>
            );
        })}
    </Select>
</div>
                    <div className="row pricing-info">
                        <div className="pricing-info-item position-relative d-flex justify-content-between">
                            <p>Provisional</p>
                            <p>{formatPrice(totalPrice)}đ</p>
                        </div>
                        <div className="pricing-info-item d-flex justify-content-between">
                            <p>Shipping fee</p>
                            {deliveryCharges.isDiscounted ? (
                                <div>
                                    <span style={{ textDecoration: 'line-through', color: '#FF0000' }}>{formatPrice(deliveryCharges.originalPrice)}đ</span>
                                    <span style={{ color: '#00FF00' }}> → 0đ</span>
                                </div>
                            ) : (
                                <span>{formatPrice(deliveryCharges.price)}đ</span>
                            )}
                        </div>
                        {moneyDiscount > 0 ? (
                            <div className="pricing-info-item d-flex justify-content-between">
                                <p>Discount code</p>
                                <p>{formatPrice(moneyDiscount)}đ</p>
                            </div>
                        ) : ''}
                        <div className="pricing-info-item final-total-box position-relative d-flex justify-content-between">
                            <p className="fw-bold">Total</p>
                            <p className="fw-bold" style={{ fontSize: '20px' }}>
                                {formatPrice(finalTotal)}đ
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

CartPage.isAuth = true;

export default CartPage;