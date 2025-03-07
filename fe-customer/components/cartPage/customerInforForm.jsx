import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio } from 'antd';
import { memo, useState, useEffect } from 'react';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { FaShippingFast, FaPaypal } from 'react-icons/fa';
import { object, string, number } from 'yup';
import { PayPalButton } from "react-paypal-button-v2";
import PayOsButton from '@/components/cartPage/PayOsButton'; // Import PayOsButton
import Image from "next/image";
import InputField from '@/components/inputField';
import orderId from 'order-id';
import { swtoast } from '@/mixins/swal.mixin';


const CustomerInforForm = ({ email = '', customerName = '', phoneNumber = '', address = '', payment_method = '', amount = 0, handlePlaceOrder, handlePlaceOrderPaypal, handlePlaceOrderPayOS, clearCart }) => {
    const schema = object({
        customerName: string()
            .trim()
            .required('Please enter your Full Name')
            .max(255, 'Full name cannot exceed 255 characters'),
        phoneNumber: string()
            .trim()
            .required('Please enter your Phone Number')
            .matches(/^\d{10}$/, 'Invalid phone number'),
        email: string()
            .trim()
            .required('Please enter your Email')
            .max(255, "Email must not exceed 255 characters")
            .email('Invalid email'),
        address: string()
            .trim()
            .required('Please enter your Address')
            .max(255, 'Address cannot exceed 255 characters'),
        payment_method: string(),
        description: string(),
        amount: number()
    });
   
    const [orderCode, setOrderCode] = useState('');
    useEffect(() => {
        const getNewestOrder = async () => {
            const idGenerator = orderId('key'); // Khởi tạo instance với secret key
            const order_id = idGenerator.generate().replace(/-/g, ""); // Tạo ID và loại bỏ dấu gạch ngang
            setOrderCode(order_id);
            setValue('orderCode', order_id);
        }
        getNewestOrder();
    }, []);

    const { getValues, control, handleSubmit, setValue, formState: { isSubmitting, isValid } } = useForm({
        defaultValues: {
            email,
            customerName,
            phoneNumber,
            address,
            payment_method: 'cod',
            description: '',
            orderCode: '',
        },
        resolver: yupResolver(schema),
        mode: 'onChange' // Để cập nhật isValid khi form thay đổi
    });
  
    // State để theo dõi hình thức thanh toán
    const [paymentMethod, setPaymentMethod] = useState('cod'); // Mặc định là 'cod'

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
        setValue('payment_method', e.target.value);
    };

    // Set sdk mới thanh toán dc
    const [sdkReady, setSdkReady] = useState(false)
    useEffect(() => {
        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=AeIPHH_Zf2j4axniCevcG1lOWrboR8AQj8gegge_DU216lpIljgksSrAqG72QYxul8haQ0M-IIPZ0AYn&currency=USD`;
        script.async = true;
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script);
    }, []);
    // Thông tin theo dõi Thanh Toán Paypal thành công
    const onSuccessPaypal = (details, data) => {
        const formData = getValues();
        handleSubmit(handlePlaceOrderPaypal(formData, details, data));
    }
    const onSuccessPayos = useCallback((event) => {
        const formData = getValues();
        handleSubmit(handlePlaceOrderPayOS(formData));
    }, []);
    
    return (
        <form onSubmit={handleSubmit(handlePlaceOrder)}>
            <div className="title">Shipping information</div>
            <div>
                <div className="row">
                    <div className="col-6">
                        <div className="mb-3"><InputField name='customerName' control={control} placeholder={'Your first and last name'} /></div>
                    </div>
                    <div className="col-6">
                        <div className="mb-3"><InputField name='phoneNumber' control={control} placeholder={'Phone number'} /></div>
                    </div>
                </div>
                <div className="mb-3"><InputField name='email' control={control} placeholder={'Email address'} /></div>
                <div className="mb-3"><InputField name='address' control={control} placeholder={'Address (Example: 112/12 3/2 Hung Loi, Ninh Kieu)'} /></div>
            </div>
            <div className="payment">
                <div className="title">Payment Methods</div>
                <div>
                    <label
                        htmlFor="cod"
                        className="payment-item w-100 border-radius d-flex align-items-center justify-content-start"
                    >
                        <div className="payment-item-radio">
                            <Radio
                                name='payment_method'
                                value="cod"
                                checked={paymentMethod === 'cod'}
                                onChange={handlePaymentChange}
                            />
                        </div>
                        <div className="payment-item-icon">
                            <FaShippingFast />
                        </div>
                        <div className="payment-item-name">
                            <p className="text-uppercase">cod</p>
                            <p className="">Cash on delivery</p>
                        </div>
                    </label>
                </div>
                <div>
                    <label
                        htmlFor="paypal"
                        className="payment-item w-100 border-radius d-flex align-items-center justify-content-start"
                    >
                        <div className="payment-item-radio">
                            <Radio
                                name='payment_method'
                                value="paypal"
                                checked={paymentMethod === 'paypal'}
                                onChange={handlePaymentChange}
                            />
                        </div>
                        <div className="payment-item-icon">
                            <FaPaypal />
                        </div>
                        <div className="payment-item-name">
                            <p className="text-uppercase">paypal</p>
                            <p className="">Pay via PayPal</p>
                        </div>
                    </label>
                </div>
                <div>
                    <label
                        htmlFor="payos"
                        className="payment-item w-100 border-radius d-flex align-items-center justify-content-start"
                    >
                        <div className="payment-item-radio">
                            <Radio
                                name='payment_method'
                                value="payos"
                                checked={paymentMethod === 'payos'}
                                onChange={handlePaymentChange}
                            />
                        </div>
                        <div className="payment-item-icon">
                            <Image src="img/vnpay.svg" alt="VNPay Icon" width={50} height={50} />
                        </div>
                        <div className="payment-item-name">
                            <p className="text-uppercase">payos</p>
                            <p className="">Pay via PayOS</p>
                        </div>
                    </label>
                </div>
            </div>
            <div className={'btn-container' + (isSubmitting ? ' btn-loading' : '')}>
                {paymentMethod === 'paypal' && sdkReady ? (
                    <PayPalButton
                        amount={(amount / 25000).toFixed(2)}
                        onSuccess={onSuccessPaypal}
                        onError={() => (
                            alert('Error')
                        )}
                    />
                ) : paymentMethod === 'payos' ? (
                    <PayOsButton
                        amount={amount}
                        description={'Thanh toan don hang'}
                        orderCode={orderCode}
                        isValid={isValid} // Truyền isValid vào PayOsButton
                        onSuccess={onSuccessPayos}
                    />
                ) : (
                    <Button htmlType='submit' loading={isSubmitting}>
                        {!isSubmitting && 'Order Now'}
                    </Button>
                )}
            </div>
        </form>
    )
}

export default memo(CustomerInforForm);