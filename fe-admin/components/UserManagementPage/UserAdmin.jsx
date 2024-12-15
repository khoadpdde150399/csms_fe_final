import React, { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { swalert, swtoast } from "@/mixins/swal.mixin";
import { FaTrash, FaEdit } from "react-icons/fa"

const UserAdmin = (props) => {
    const addPointToPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    const handleDelete = async () => {
        swalert
            .fire({
                title: "Delete User",
                icon: "warning",
                text: "Do you want to delete this User?",
                showCloseButton: true,
                showCancelButton: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await axios.delete('https://www.backend.csms.io.vn/api/user/delete',
                            { data: { customer_info_id: [props.customer_info_id] } })
                        props.refreshUserTable()
                        swtoast.success({
                            text: 'Delete User Successfully!'
                        })
                    } catch (err) {
                        console.log(err)
                        swtoast.error({
                            text: 'Error occurred while deleting Coupon please try again!'
                        })
                    }
                }
            })
    }

    return (
        <tr className="text-center">
            <td className='col-infor-product'>
                <p className="name" title={props.customer_name}>
                    {props.customer_name}
                </p>
            </td>
            <td className="col-phone">
                <p>{props.phone_number}</p>
            </td>
            <td className="col-address">
                <p>{props.address}</p>
            </td>
            <td className="text-danger fw-bold col-point">
                <p className='d-flex align-items-center justify-content-center'>
                    {addPointToPrice(props.point)}
                </p>
            </td>
            <td className="col-action manipulation">
                <Link href={`/user/update/${props.customer_info_id}`}>
                     <FaEdit />
                </Link>
                <br />
                <FaTrash 
                    style={{ cursor: "pointer" }} 
                    title='Delete' 
                    className="text-danger" 
                    onClick={() => handleDelete()} 
                />
            </td>
        </tr>
    )
}

export default UserAdmin