import React, { useState } from 'react';
import axios from 'axios';
import { Input, InputNumber, Button } from 'antd';
import { swtoast } from "@/mixins/swal.mixin";
import { homeAPI } from '@/config';
import Loading from '@/components/Loading';
const CreateCouponPage = () => {
    const [code, setCode] = useState('');
    const [money, setMoney] = useState(0);
    const [endAt, setEndAt] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const createCoupon = async () => {
        if (validate()) {
            try {
                setIsLoading(true);
                const newCoupon = {
                    code: code,
                    money: money,
                    end_at: endAt,
                    quantity: quantity,
                    status: 0
                };
                const result = await axios.post(`${homeAPI}/coupon/create`, newCoupon);
                console.log(result.data);
                swtoast.success({ text: 'Coupon code added successfully!' });
                clearPage();
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const validate = () => {
        if (!code) {
            swtoast.error({ text: 'Coupon code cannot be left blank' });
            return false;
        }
        if (!money) {
            swtoast.error({ text: 'Money cannot be left blank' });
            return false;
        }
        if (!endAt) {
            swtoast.error({ text: 'End date cannot be left blank' });
            return false;
        }
        const endDate = new Date(endAt);
        if (endDate < new Date()) {
            swtoast.error({ text: 'End date must be after the current date' });
            return false;
        }
        if (quantity <= 0) {
            swtoast.error({ text: 'Quantity must be greater than zero' });
            return false;
        }
        return true;
    };

    const clearPage = () => {
        setCode('');
        setMoney(0);
        setEndAt('');
        setQuantity(1);
    };

    return (
        <div className='create-product-page'>
            <h1>Add Discount Code</h1>
            <div className="create-product-form">
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='product-code' className="fw-bold">Coupon Code Name:</label>
                        <Input
                            id='product-code' 
                            placeholder='Enter coupon code name'
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='product-money' className="fw-bold">Discount Code Price:</label>
                        <br />
                        <InputNumber
                            id='product-money' 
                            placeholder='Enter discount code price'
                            value={money === 0 ? null : money}
                            style={{ width: '100%' }}
                            onChange={setMoney}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='end-at' className="fw-bold">End Date and Time:</label>
                        <input
                            type='datetime-local'
                            id='end-at'
                            value={endAt} 
                            onChange={(e) => setEndAt(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                fontSize: '16px',
                                marginTop: '5px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='quantity' className="fw-bold">Quantity:</label>
                        <InputNumber
                            id='quantity' 
                            placeholder='Enter quantity'
                            value={quantity}
                            min={1}
                            style={{ width: '100%' }}
                            onChange={(value) => setQuantity(value >= 1 ? value : 1)}
                        />
                    </div>
                </div>
                <div className="btn-box text-left">
                    <Button type='primary' onClick={createCoupon} loading={isLoading}>
                        Add Discount Code
                    </Button>
                </div>
            </div>
            {isLoading && <Loading />}
        </div>
    );
}

export default CreateCouponPage;