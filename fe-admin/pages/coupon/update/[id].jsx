import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import { Input, InputNumber, Empty } from 'antd'


import Header from '@/components/Header';
import Loading from '@/components/Loading';
import { swtoast } from "@/mixins/swal.mixin";
import { homeAPI } from '@/config'


const UpdateProductPage = () => {
    const { id } = Router.query

    const [code, setCode] = useState('');
    const [couponid, setCouponId] = useState('');
    const [money, setMoney] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [productVariantList, setProductVariantList] = useState([]);
    const [rowProductVariant, setRowProductVariant] = useState([]);


    useEffect(() => {
        const getCouponDetail = async () => {
            try {
                setIsLoading(true)
                const result = await axios.get(`${homeAPI}/coupon/admin/detail/${id}`)
                setCouponId(result.data.id)
                setCode(result.data.code)
                setMoney(result.data.money)
                setIsLoading(false)
            } catch (err) {
                console.log(err);
                setIsLoading(false)
                Router.push("/404")
            }
        }
        if (id) getCouponDetail()
    }, [id]);



    const refreshPage = async () => {
        if (id) {
            try {
                const result = await axios.get(`${homeAPI}/coupon/admin/detail/${id}`)
                setCode(result.data.code)
                setMoney(result.data.money)
            } catch (err) {
                console.log(err);
                Router.push("/404")
            }
        }
    }

    const updateCoupon = async () => {
        if (Validate()) {
            try {
                setIsLoading(true)
                let updateCoupon = {
                    id: couponid,
                    code: code,
                    money: money
                }
                let result = await axios.put(`${homeAPI}/coupon/update`, updateCoupon);
                console.log(result.data);
                setIsLoading(false)
                swtoast.success({ text: 'Product update successful!' })
                refreshPage()
                na
            } catch (err) {
                console.log(err);
                setIsLoading(false)
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



    return (
        <div className='update-product-page'>
            <Header title="Update discount code" />
            <div className="update-product-form">
                {/* // Input Ten san pham */}
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

export default UpdateProductPage