import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import { Input, InputNumber } from 'antd'
import { swtoast } from "@/mixins/swal.mixin";
import { homeAPI } from '@/config';
import Header from '@/components/Header';
import Loading from '@/components/Loading';

const UpdateProductPage = () => {
    const { id } = Router.query;

    const [code, setCode] = useState('');
    const [couponid, setCouponId] = useState('');
    const [money, setMoney] = useState(0);
    const [endAt, setEndAt] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getCouponDetail = async () => {
            try {
                setIsLoading(true);
                const result = await axios.get(`${homeAPI}/coupon/admin/detail/${id}`);
                setCouponId(result.data.id);
                setCode(result.data.code);
                setMoney(result.data.money);
                
                // Định dạng end_at thành dạng YYYY-MM-DDTHH:mm
                setEndAt(new Date(result.data.end_at).toISOString().slice(0, 16)); 
                
                setQuantity(result.data.quantity); 
                setIsLoading(false);
            } catch (err) {
                console.log(err);
                setIsLoading(false);
                Router.push("/404");
            }
        }
        if (id) getCouponDetail();
    }, [id]);

    const updateCoupon = async () => {
        if (Validate()) {
            try {
                setIsLoading(true);
                let updateCoupon = {
                    id: couponid,
                    code: code,
                    money: money,
                    end_at: endAt,
                    quantity: quantity
                };
                let result = await axios.put(`${homeAPI}/coupon/update`, updateCoupon);
                console.log(result.data);
                setIsLoading(false);
                swtoast.success({ text: 'Product update successful!' });
                refreshPage();
            } catch (err) {
                console.log(err);
                setIsLoading(false);
            }
        }
    }

    const Validate = () => {
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
        if (quantity <= 0) {
            swtoast.error({ text: 'Quantity must be greater than zero' });
            return false;
        }
    
        return true;
    }

    return (
        <div className='update-product-page'>
            <Header title="Update discount code" />
            <div className="update-product-form">
                {/* Coupon Code */}
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='product-code' className="fw-bold">Coupon code name:</label>
                        <Input
                            id='product-code' placeholder='Enter Coupon Code Name'
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </div>
                </div>
                {/* Discount Code Price */}
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='product-money' className="fw-bold">Discount code price:</label>
                        <br />
                        <InputNumber
                            id='product-money' placeholder='Enter Discount Code Price'
                            value={money === 0 ? null : money}
                            style={{ width: '100%' }}
                            onChange={setMoney}
                        />
                    </div>
                </div>
                {/* End Date */}
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='end-at' className="fw-bold">End Date:</label>
                        <input
                            type='datetime-local'
                            id='end-at'
                            value={endAt}
                            onChange={(e) => setEndAt(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px', marginTop: '5px' }}
                        />
                    </div>
                </div>
                {/* Quantity */}
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='quantity' className="fw-bold">Quantity:</label>
                        <InputNumber
                            id='quantity'
                            min={1}
                            value={quantity}
                            onChange={(value) => setQuantity(value >= 1 ? value : 1)}
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>
                {/* Update Button */}
                <div className="btn-box text-left">
                    <button className='text-light bg-dark' onClick={updateCoupon}>
                        Update
                    </button>
                </div>
            </div>
            {isLoading && <Loading />}
        </div>
    )
}

export default UpdateProductPage;