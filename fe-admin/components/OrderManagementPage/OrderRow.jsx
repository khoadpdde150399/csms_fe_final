import React, { useState, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { swalert, swtoast } from "@/mixins/swal.mixin";
import { EyeOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const OrderRow = (props) => {
    const { order_id, state_id, state_name, created_at, total_order_value, refreshOrderTable } = props;

    const addPointToPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    const convertTime = (created_at) => {
        const date = new Date(created_at);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // tháng (giá trị từ 0 đến 11, nên cộng thêm 1)
        const day = date.getDate(); // ngày trong tháng
        const hours = date.getHours(); // giờ
        const minutes = date.getMinutes(); // phút
        const seconds = date.getSeconds(); // giây
        const formattedDate = `${day}/${month}/${year}`;
        const formattedTime = `${hours}:${minutes}:${seconds}`;
        return (
            <>
                {formattedDate} <br /> {formattedTime}
            </>
        )
    }

    const renderCancelOrderBtn = () => {
        if (state_id == 1 || state_id == 2 || state_id == 3) {
            return (
                <>
                    <br />
                    <a className="text-danger" href="#" onClick={handleCancelOrder}><CloseCircleOutlined /></a>
                </>
            )
        }
    }

    const renderChangeStatusBtn = () => {
        if (state_id == 1) {
            return (
                <>
                    <a href="#" onClick={handleChangeStatus}><CheckCircleOutlined /></a>
                    <br />
                </>
            )
        }
        if (state_id == 2) {
            return (
                <>
                    <a href="#" onClick={handleChangeStatus}><CheckCircleOutlined /></a>
                    <br />
                </>
            )
        }
        if (state_id == 3) {
            return (
                <>
                    <a href="#" onClick={handleChangeStatus}><CheckCircleOutlined /></a>
                    <br />
                </>
            )
        }
    }

    const handleCancelOrder = () => {
        swalert
            .fire({
                title: "Cancel Order",
                icon: "warning",
                text: "You want to cancel this order?",
                showCloseButton: true,
                showCancelButton: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await axios.put('https://www.backend.csms.io.vn/api/order/change-status/' + order_id + '/6')
                        refreshOrderTable();
                        swtoast.success({
                            text: 'Order Cancellation Successful!'
                        })
                    } catch (err) {
                        console.log(err)
                        swtoast.error({
                            text: 'Error occurred while canceling order please try again!'
                        })
                    }
                }
            })
    }

    const handleChangeStatus = () => {
        if (state_id == 1) {
            swalert
                .fire({
                    title: "Order Confirmation",
                    icon: "info",
                    text: "You want to accept this order?",
                    showCloseButton: true,
                    showCancelButton: true,
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await axios.put('https://www.backend.csms.io.vn/api/order/change-status/' + order_id + '/2')
                            refreshOrderTable();
                            swtoast.success({
                                text: 'Order Confirmation Successful!'
                            })
                        } catch (err) {
                            console.log(err)
                            swtoast.error({
                                text: 'Error occurred while confirming order please try again!'
                            })
                        }
                    }
                })
        }
        if (state_id == 2) {
            swalert
                .fire({
                    title: "Confirmation of delivery to the carrier",
                    icon: "info",
                    text: "This order has been handed over to the carrier?",
                    showCloseButton: true,
                    showCancelButton: true,
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await axios.put('https://www.backend.csms.io.vn/api/order/change-status/' + order_id + '/3')
                            refreshOrderTable();
                            swtoast.success({
                                text: 'Confirm successful handover to the shipping unit!'
                            })
                        } catch (err) {
                            console.log(err)
                            swtoast.error({
                                text: 'Error occurred while confirming delivery, please try again!'
                            })
                        }
                    }
                })
        }
        if (state_id == 3) {
            swalert
                .fire({
                    title: "Confirm successful delivery",
                    icon: "info",
                    text: "This order has been delivered successfully?",
                    showCloseButton: true,
                    showCancelButton: true,
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            await axios.put('https://www.backend.csms.io.vn/api/order/change-status/' + order_id + '/4')
                            refreshOrderTable();
                            swtoast.success({
                                text: 'Confirm successful delivery!'
                            })
                        } catch (err) {
                            console.log(err)
                            swtoast.error({
                                text: 'Error occurred while confirming delivery please try again!'
                            })
                        }
                    }
                })
        }
    }

    return (
        <tr className="w-100">
            <td className="fw-bold col-order-id">
                <p className="d-flex align-items-center justify-content-center">
                    #{order_id}
                </p>
            </td>
            <td className="text-danger fw-bold col-state">
                <p className="d-flex align-items-center ">
                    {state_name}
                </p>
            </td>
            <td className="col-create-at">
                <p className="d-flex align-items-center justify-content-center">
                    {convertTime(created_at)}
                </p>
            </td>
            <td className="text-danger fw-bold col-total-value">
                <p>
                    {addPointToPrice(total_order_value)}
                </p>
            </td>
            <td className="col-action manipulation">
                {renderChangeStatusBtn()}
                <Link href={`/order/detail/${order_id}`}><EyeOutlined /></Link>
                {renderCancelOrderBtn()}
            </td>
        </tr>
    )
}

export default OrderRow