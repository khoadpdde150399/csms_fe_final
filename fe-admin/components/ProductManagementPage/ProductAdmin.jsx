import React, { useState, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { swalert, swtoast } from "@/mixins/swal.mixin";
import { FaTrash, FaPencilAlt, FaEdit } from "react-icons/fa"
import { Switch } from 'antd';
import Swal from "sweetalert2";
import useAdminStore from '@/store/adminStore';

const ProductAdmin = (props) => {

    const role_id = useAdminStore((state) => state.role_id);
    const isDisabled = () => {
        return role_id === 3;
    }
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

    const handleUpdateQuantity = async () => {
        const { value: newQuantity } = await Swal.fire({
            title: 'Enter new inventory',
            input: 'number',
            inputLabel: '',
            inputPlaceholder: 'New inventory..',
            showCloseButton: true,
        })
        if (!newQuantity) {
            swtoast.fire({
                text: "Product inventory has not been updated!"
            })
            return
        }
        if (newQuantity) {
            try {
                await axios.put('https://www.backend.csms.io.vn/api/product-variant/update-quantity',
                    {
                        product_variant_ids: [props.product_variant_id],
                        quantity: newQuantity
                    })
                props.refreshProductVariantTable()
                swtoast.success({
                    text: 'New inventory update successful!'
                })
            } catch (e) {
                console.log(e)
                swtoast.error({
                    text: 'Error updating inventory please try again!'
                })
            }
        }
    }

    const [disabledInputState, setDisabledInputState] = useState(false);

    const handleUpdateState = async (state) => {
        if (state) {
            try {
                setDisabledInputState(true)
                await axios.put('https://www.backend.csms.io.vn/api/product-variant/on',
                    { product_variant_ids: [props.product_variant_id] })
                setDisabledInputState(false)
                props.refreshProductVariantTable()
            } catch (e) {
                console.log(e)
                props.refreshProductVariantTable()
                setDisabledInputState(false)
                swtoast.error({ text: 'Error occurred while opening sale please try again!' })
            }
        } else {
            try {
                setDisabledInputState(true)
                await axios.put('https://www.backend.csms.io.vn/api/product-variant/off',
                    { product_variant_ids: [props.product_variant_id] })
                setDisabledInputState(false)
                props.refreshProductVariantTable()
            } catch (e) {
                console.log(e)
                props.refreshProductVariantTable()
                setDisabledInputState(false)
                swtoast.error({ text: 'An error occurred while shutting down the product, please try again!' })
            }
        }
    };

    const handleDelete = async () => {
        swalert
            .fire({
                title: "Delete product variation",
                icon: "warning",
                text: "You want to delete this product variation?",
                showCloseButton: true,
                showCancelButton: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await axios.delete('https://www.backend.csms.io.vn/api/product-variant/delete',
                            { data: { product_variant_ids: [props.product_variant_id] } })
                        props.refreshProductVariantTable()
                        swtoast.success({
                            text: 'Product variation deleted successfully!'
                        })
                    } catch (err) {
                        console.log(err)
                        swtoast.error({
                            text: 'An error occurred while deleting product variation please try again!'
                        })
                    }
                }
            })
    }

    return (
        // <div className="table-responsive">
        //     <table className="table align-middle product-admin w-100">
        //         <tbody className='w-100 text-center'>
                    <tr className="w-100">
                        <td className='col-infor-product'>
                            <p className="name">
                                {props.product_name + '-' + props.colour_name + '-' + props.size_name}
                            </p>
                            <img src={props.product_image} />
                        </td>
                        <td className="text-danger fw-bold col-price">
                            <p className='d-flex align-items-center justify-content-center'>
                                {addPointToPrice(props.price)}
                            </p>
                        </td>
                        <td className="text-danger fw-bold col-quantity">
                            <p className='d-flex align-items-center justify-content-center'>
                                {props.quantity}
                                <a href="#" 
                                   onClick={isDisabled() ? null : handleUpdateQuantity}
                                   style={{pointerEvents: isDisabled() ? 'none' : 'auto', 
                                          opacity: isDisabled() ? 0.5 : 1}}>
                                    <span className="edit-price-button text-premium">
                                        <FaPencilAlt />
                                    </span>
                                </a>
                            </p>
                        </td>
                        <td className="col-createAt">
                            <p>{convertTime(props.created_at)}</p>
                        </td>
                        <td className="text-danger fw-bold col-state">
                            <Switch 
                                checked={props.state} 
                                onChange={handleUpdateState} 
                                disabled={isDisabled() || disabledInputState} 
                            />
                        </td>
                        <td className="col-action manipulation">
                            <Link href={`/product/update/${props.product_id}`}
                                  style={{pointerEvents: isDisabled() ? 'none' : 'auto', 
                                         opacity: isDisabled() ? 0.5 : 1}}>
                                <FaEdit />
                            </Link>
                            <br />
                            <FaTrash 
                                style={{ 
                                    cursor: isDisabled() ? "not-allowed" : "pointer",
                                    opacity: isDisabled() ? 0.5 : 1 
                                }} 
                                title='Delete' 
                                className="text-danger" 
                                onClick={isDisabled() ? null : handleDelete} 
                            />
                        </td>
                    </tr>
        //         </tbody>
        //     </table>
        // </div>
    )
}

export default ProductAdmin