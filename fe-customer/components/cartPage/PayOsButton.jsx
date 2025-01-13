import { useState } from 'react';
import axios from 'axios';
import { swtoast } from '@/mixins/swal.mixin';
import { usePayOS, PayOSConfig } from "payos-checkout";
import { useEffect } from 'react';

const PayOsButton = ({ orderCode, amount, description, isValid, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [checkoutUrl, setCheckoutUrl] = useState('');
    const [pay, setPay] = useState(false);


    const handlePayment = async (event) => {
        event.preventDefault();
        if (!isValid) {
            swtoast.error({ title: 'Form is not valid. Please check your input.' });
            return;
        }
        setLoading(true);
        try {
            const numericOrderCode = Number(orderCode);
            const response = await axios.post('https://www.backend.csms.io.vn/api/payment/create_payment_url', { orderCode: numericOrderCode, amount, description });
            if (response.data && response.data.checkoutUrl) {
                setCheckoutUrl(response.data.checkoutUrl);
                setPay(true);
            } else {
                throw new Error('Failed to create payment URL');
            }
        } catch (error) {
            console.error('Payment error:', error);
        } finally {
            setLoading(false);
        }
    };
    const payOSConfig = {
        RETURN_URL: "https://www.csms.io.vn/cart", // required
        ELEMENT_ID: "payos", // required
        CHECKOUT_URL: checkoutUrl, // required
        embedded: false,
        onSuccess: onSuccess,
    };
    const { open, exit } = usePayOS(payOSConfig);
    useEffect(() => {
        if (pay && checkoutUrl) {
          open();
        }
      }, [pay, checkoutUrl]);
    return (
        <>
            <button onClick={handlePayment} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
                {loading ? 'Processing...' : 'Pay with PayOs'}
            </button>

        </>

    );
};

export default PayOsButton;