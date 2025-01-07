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
import InputField from '@/components/inputField';
import { useForm } from 'react-hook-form';

const CartPage = () => {
    const router = useRouter();
    const productList = useCartStore((state) => state.productList);
    const productQuantity = productList.length;
    const clearCart = useCartStore((state) => state.clearCart);

    const { isError, error, data } = useQuery({
        ...queries.customer.infor(),
        staleTime: 5 * 60 * 1000
    });
    if (isError) {
        console.log(error);
        router.push('/404');
    }
    
    const [listCoupon, setlistCoupon] = useState('');
    const [codediscount, setcodediscount] = useState('');

    const { isError: isError2, error: error2, data: data2 } = useQuery(queries.products.listcoupon());

    const [valuecoupon, setValuecoupon] = useState(null);
    useEffect(() => {
        if (isError2) console.error(error2);
        if (data2) {
            const listCouponData = data2.data;
            setlistCoupon(listCouponData);
        }
        console.log("data2",data2);
        if(valuecoupon){
            const foundCoupon = listCoupon.find(item => item.code === valuecoupon);
            setMoneyDiscount(foundCoupon.money)
            setcodediscount(foundCoupon.code)
            console.log(' oke',foundCoupon.code)
        }
    }, [isError2, error2, data2, listCoupon ,valuecoupon]);

    const onChangeDiscount = (newValue) => {
        setValuecoupon(newValue);
    };

    const [shippingcost, setShippingCost] = useState('J&T expreess');
    const handleShippingCostChange = (e) => {
        setShippingCost(e.target.value);
    };

    const customerInfor = data?.data && {
        email: data.data?.email,
        customerName: data.data?.customer_name,
        phoneNumber: data.data?.phone_number,
        address: data.data?.address,
        payment_method: data.data?.payment_method,
        statusPayment: 'Process',
    };

    const [moneydiscount, setMoneyDiscount] = useState(0);

    const totalPrice = useMemo(() => {
        return productList.reduce((accumulator, product) => accumulator + product.totalValue, 0);
    }, [productList]);

    // const deliveryCharges = useMemo(() => {
    //     return totalPrice > 300000 ? 0 : (shippingcost === 'J&T expreess' ? 35000 : 25000);
    // }, [totalPrice, shippingcost]);
    const deliveryCharges = useMemo(() => {
    const shippingFee = shippingcost === 'J&T expreess' ? 35000 : 25000;
        return {
            price: totalPrice > 300000 ? 0 : shippingFee,
            originalPrice: shippingFee,
            isDiscounted: totalPrice > 300000
        };
    }, [totalPrice, shippingcost]);
    const finalTotal = (totalPrice + deliveryCharges.price - moneydiscount) > 0 ? totalPrice + deliveryCharges.price - moneydiscount : 0;

    const { control, handleSubmit } = useForm();

    const submitCoupon = useCallback(async () => {
        try {
            const result = await orderService.checkDiscount(codediscount);
            console.log('dis ', result)
        } catch (err) {
            console.log(err);
        }
    },[codediscount]);

    const handlePlaceOrder = useCallback(async (values) => {
        if (productList.length) {
            try {
                const orderItems = productList.map((product) => {
                    return {
                        product_variant_id: product.productVariantId,
                        quantity: product.quantity
                    };
                });
                const order = {
                    customer_name: values.customerName,
                    email: values.email,
                    phone_number: values.phoneNumber,
                    address: values.address,
                    order_items: orderItems,
                    payment_method: values.payment_method,
                    statusPayment: 'Process',
                    shipping: shippingcost,
                    delivery_charges: deliveryCharges.price,
                };
                await orderService.placeOrder(order);
                await submitCoupon();
                clearCart();
                swtoast.success({ text: 'Order successful' });
            } catch (err) {
                console.log(err);
                swtoast.error({
                    text: 'There was an error creating the order, please try again!'
                });
            }
        } else {
            swtoast.error({
                text: 'There are no products in the cart. Please add products to the cart.'
            });
        }
    }, [clearCart, productList, shippingcost, deliveryCharges, submitCoupon]);

    const handlePlaceOrderPaypal = useCallback(async (values, details, data) => {
        if (productList.length) {
            try {
                const orderItems = productList.map((product) => {
                    return {
                        product_variant_id: product.productVariantId,
                        quantity: product.quantity
                    };
                });
                const order = {
                    customer_name: values.customerName,
                    email: values.email,
                    phone_number: values.phoneNumber,
                    address: values.address,
                    order_items: orderItems,
                    payment_method: values.payment_method,
                    statusPayment: 'Done', // Done đã thanh toán
                    shipping: shippingcost,
                    delivery_charges: deliveryCharges.price,
                };
                await orderService.placeOrder(order);
                clearCart();
                swtoast.success({ text: 'Paypal payment successful' });
            } catch (err) {
                console.log(err);
                swtoast.error({
                    text: 'There was an error creating the order, please try again!'
                });
            }
        } else {
            swtoast.error({
                text: 'There are no products in the cart. Please add products to the cart.'
            });
        }
    }, [clearCart, productList, shippingcost, deliveryCharges])
    return (
        <div className="cart-page container pb-4">
            <div className="row cart-page-child">
                <div className="col-12 col-lg-7 cart-left-section">
                    {
                        customerInfor &&
                        <CustomerInforForm
                            email={customerInfor.email}
                            customerName={customerInfor.customerName}
                            phoneNumber={customerInfor.phoneNumber}
                            address={customerInfor.address}
                            payment_method={customerInfor.payment_method}
                            handlePlaceOrder={handlePlaceOrder}
                            handlePlaceOrderPaypal={handlePlaceOrderPaypal}
                            amount={finalTotal}
                        />
                    }
                </div>
                <div className="col-12 col-lg-5 cart-right-section">
                    <div className="title">Shopping Cart</div>
                    <div className="cart-section">
                        {productList.length > 0 ? (
                            productList &&
                            productList.map((product, index) => {
                                return (
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
                                );
                            })
                        ) : (
                            <p className="text-center">There are no products in the cart.</p>
                        )}
                    </div>
                    <div className="shipping">
                        <div className="title">Shipping unit</div>
                        <div>
                            <label
                                htmlFor="cod"
                                className="shipping-item w-100 border-radius d-flex align-items-center justify-content-start"
                            >
                                <div className="shipping-item-radio">
                                    <Radio
                                        name='shipping_cost'
                                        value="J&T expreess"
                                        checked={shippingcost === 'J&T expreess'}
                                        onChange={handleShippingCostChange}
                                    />
                                </div>
                                <div className="shipping-item-name">
                                    <p className="">J&T expreess (Fast delivery)</p>
                                </div>
                            </label>
                        </div>
                        <div>
                            <label
                                htmlFor="paypal"
                                className="shipping-item w-100 border-radius d-flex align-items-center justify-content-start"
                            >
                                <div className="shipping-item-radio">
                                    <Radio
                                        name='shipping_cost'
                                        value="Viettel"
                                        checked={shippingcost === 'Viettel'}
                                        onChange={handleShippingCostChange}
                                    />
                                </div>
                                <div className="shipping-item-name">
                                    <p className="">Viettel (Delayed delivery)</p>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="discount">
                        <div className="title">Discount code</div>
                        <form >
                            <div className="row">
                                <div className="row-12 mb-3">
                                    {/* <InputField name='codediscount' control={control} placeholder={'Mã ưu đãi'} /> */}
                                    <Select onChange={onChangeDiscount} control={control} placeholder="Select coupon code" style={{ width: '100%' }}>
                                        {listCoupon && Array.isArray(listCoupon) ? (
                                            listCoupon.map((item, index) => (
                                                <Select.Option key={index} value={item.code}>
                                                    {item.code} - {item.money}
                                                </Select.Option>
                                            ))
                                        ) : (
                                            <Select.Option disabled>No coupons available.</Select.Option>
                                        )}
                                    </Select>
                                </div>
                            </div>
                        </form>
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
                            {/* <p>{formatPrice(deliveryCharges)}đ</p> */}
                        </div>
                        {moneydiscount > 0 ? (
                            <div className="pricing-info-item d-flex justify-content-between">
                                <p>Discount code</p>
                                <p>{formatPrice(moneydiscount)}đ</p>
                            </div>
                        ): ('') }
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
