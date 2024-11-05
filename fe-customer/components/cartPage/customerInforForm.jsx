import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio } from 'antd';
import { memo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaShippingFast, FaPaypal } from 'react-icons/fa';
import { object, string } from 'yup';
import { PayPalButton } from "react-paypal-button-v2";

import InputField from '@/components/inputField';

const CustomerInforForm = ({ email = '', customerName = '', phoneNumber = '', address = '', payment_method='', amount = 0 , handlePlaceOrder, handlePlaceOrderPaypal }) => {
    const schema = object({
        customerName: string()
            .trim()
            .required('Vui lòng nhập Họ và tên của bạn')
            .max(255, 'Họ và tên không được vượt quá 255 ký tự'),
        phoneNumber: string()
            .trim()
            .required('Vui lòng nhập Số điện thoại của bạn')
            .matches(/^\d{10}$/, 'Số điện thoại không hợp lệ'),
        email: string()
            .trim()
            .required('Vui lòng nhập Email của bạn')
            .max(255, "Email không được vượt quá 255 ký tự")
            .email('Email không hợp lệ'),
        address: string()
            .trim()
            .required('Vui lòng nhập Địa chỉ của bạn')
            .max(255, 'Địa chỉ không được vượt quá 255 ký tự'),
        payment_method: string(),
        description: string(),
        amount: Number()
    });

    const { getValues, control, handleSubmit, setValue, formState: { isSubmitting } } = useForm({
        defaultValues: {
            email,
            customerName,
            phoneNumber,
            address,
            payment_method: 'cod',
            description: '',
        },
        resolver: yupResolver(schema),
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
    return (
        <form onSubmit={handleSubmit(handlePlaceOrder)}>
            <div className="title">Thông tin vận chuyển</div>
            <div>
                <div className="row">
                    <div className="col-6">
                        <div className="mb-3"><InputField name='customerName' control={control} placeholder={'Họ và tên của bạn'} /></div>
                    </div>
                    <div className="col-6">
                        <div className="mb-3"><InputField name='phoneNumber' control={control} placeholder={'Số điện thoại'} /></div>
                    </div>
                </div>
                <div className="mb-3"><InputField name='email' control={control} placeholder={'Địa chỉ email'} /></div>
                <div className="mb-3"><InputField name='address' control={control} placeholder={'Địa chỉ (Ví dụ: 112/12 3/2 Hưng Lợi, Ninh Kiều)'} /></div>
            </div>
            <div className="payment">
                <div className="title">Hình thức thanh toán</div>
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
                            <p className="">Thanh toán khi nhận hàng</p>
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
                            <p className="">Thanh toán qua PayPal</p>
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
            ) : (
                <Button htmlType='submit' loading={isSubmitting}>
                    {!isSubmitting && 'Đặt Hàng'}
                </Button>
            )}                
            </div>
        </form>
    )
}

export default memo(CustomerInforForm);
