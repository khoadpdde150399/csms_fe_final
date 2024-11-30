import React from 'react';
import axios from 'axios';
import { InputNumber } from 'antd'
import { FaTrash } from "react-icons/fa"

import UploadImageBox from '@/components/UploadImageBox';
import { swalert, swtoast } from "@/mixins/swal.mixin";

const RowProductVariant = ({ index, productVariantList, setProductVariantList, setIsLoading, refreshPage }) => {

    const handlePriceChance = (value) => {
        let productVariantListClone = [...productVariantList];
        productVariantListClone[index].quantity = value;
        setProductVariantList(productVariantListClone);
    }

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
                            { data: { product_variant_ids: [productVariantList[index].productVariantId] } })
                        refreshPage()
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
        <>
            <tr className='row-product-variant'>
                <td className='col-colour text-center'>
                    {productVariantList[index].colourName}
                </td>
                <td className='col-size text-center'>
                    {productVariantList[index].sizeName}
                </td>
                <td className='col-quantity text-center'>
                    <InputNumber
                        value={productVariantList[index].quantity}
                        style={{ width: '100%' }}
                        onChange={handlePriceChance}
                    />
                </td>
                <td className="col-image">
                    <UploadImageBox
                        index={index}
                        productVariantList={productVariantList}
                        setProductVariantList={setProductVariantList}
                    />
                </td>
                <td className='col-delete text-center'>
                    <FaTrash style={{ cursor: "pointer" }} title='Delete' className="text-danger" onClick={() => handleDelete()} />
                </td>
            </tr>
        </>
    )
}

export default RowProductVariant
