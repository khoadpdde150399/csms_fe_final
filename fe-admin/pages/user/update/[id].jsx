import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import { Input, InputNumber, Empty } from 'antd'


import Header from '@/components/Header';
import Loading from '@/components/Loading';
import { swtoast } from "@/mixins/swal.mixin";
import { homeAPI } from '@/config'


const UpdateUserPage = () => {
    const { id } = Router.query

    const [customername, setCustomerName] = useState('');
    const [customerinfoid, setCustomerInfoid] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [point, setPoint] = useState(0);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const getUserDetail = async () => {
            try {
                setIsLoading(true)
                const result = await axios.get(`${homeAPI}/user/admin/detail/${id}`)
                setCustomerInfoid(result.data.customer_info_id)
                setPhone(result.data.phone_number)
                setCustomerName(result.data.customer_name)
                setAddress(result.data.address)
                setPoint(result.data.point)
                setIsLoading(false)
            } catch (err) {
                console.log(err);
                setIsLoading(false)
                Router.push("/404")
            }
        }
        if (id) getUserDetail()
    }, [id]);



    const refreshPage = async () => {
        if (id) {
            try {
                const result = await axios.get(`${homeAPI}/user/admin/detail/${id}`)
                setPhone(result.data.phone_number)
                setCustomerName(result.data.customer_name)
                setAddress(result.data.address)
                setPoint(result.data.point)
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
                    customer_info_id: customerinfoid,
                    phone_number: phone,
                    customer_name: customername,
                    address: address,
                    point: point,
                }
                let result = await axios.put(`${homeAPI}/user/update`, updateCoupon);
                console.log(result.data);
                setIsLoading(false)
                swtoast.success({ text: 'Update User success!' })
                refreshPage()
            } catch (err) {
                console.log(err);
                setIsLoading(false)
            }
        }
    }

    const Validate = () => {
        if (!customername) {
            swtoast.error({ text: 'Customer name cannot be left blank' })
            return false
        }
        return true
    }



    return (
        <div className='update-product-page'>
            <Header title="Update Customer" />
            <div className="update-product-form">
                {/* // Input Ten san pham */}
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='product-customername' className="fw-bold">Customer Name:</label>
                        <Input
                            id='product-code' placeholder='Customer Name'
                            value={customername}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                    </div>
                    <div className="col-6">
                        <label htmlFor='product-money' className="fw-bold">Phone:</label>
                        <InputNumber
                            id='product-money' placeholder='Phone'
                            value={phone}
                            style={{ width: '100%' }}
                            onChange={setPhone}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='product-address' className="fw-bold">Address:</label>
                        <Input
                            id='product-address' placeholder='Address'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="col-6">
                        <label htmlFor='product-address' className="fw-bold">Loyalty Point</label>
                        <InputNumber
                            id='product-point' placeholder='Input Points'
                            value={point}
                            style={{ width: '100%' }}
                            onChange={setPoint}
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

export default UpdateUserPage