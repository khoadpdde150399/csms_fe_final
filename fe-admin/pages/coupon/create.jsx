import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, InputNumber, Empty } from 'antd'

import Header from '@/components/Header';

import Loading from '@/components/Loading';
import { swtoast } from "@/mixins/swal.mixin";
import { homeAPI } from '@/config'

const CreateCouponPage = () => {
    const [code, setCode] = useState('');
    const [money, setMoney] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const createCopon = async () => {
        if (Validate()) {
            try {
                setIsLoading(true)
                let newProduct = {
                    code: code,
                    money: money,
                    status: 0                }
                let result = await axios.post(`${homeAPI}/coupon/create`, newProduct);
                console.log(result.data);
                setIsLoading(false)
                swtoast.success({ text: 'Coupon code added successfully!' })
                clearPage()
            } catch (err) {
                console.log(err);
            }
        }
    }

    const Validate = () => {
        if (!code) {
            swtoast.error({ text: 'Coupon code cannot be left blank' })
            return false
        }
        if (!money) {
            swtoast.error({ text: 'Money cannot be left blank' })
            return false
        }
        return true
    }

    const clearPage = () => {
        setCode('')
        setMoney(0)
        setStatus('')
        setPrice(0)
    }

    return (
        <div className='create-product-page'>
            <Header title="Add discount code" />
            <div className="create-product-form">
                {/* // Input Ten san pham */}
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='product-code' className="fw-bold">Coupon code name:</label>
                        <Input
                            id='product-code' placeholder='Enter coupon code name'
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='product-money' className="fw-bold">Discount code price:</label>
                        <br />
                        <InputNumber
                            id='product-money' placeholder='Enter discount code price'
                            value={money === 0 ? null : money}
                            style={{ width: '100%' }}
                            onChange={setMoney}
                        />
                    </div>
                </div>
                <div className="btn-box text-left">
                    <button className='text-light bg-dark' onClick={createCopon}>
                        Add discount code
                    </button>
                </div>
            </div>
            {isLoading && <Loading />}
        </div >
    )
}

export default CreateCouponPage