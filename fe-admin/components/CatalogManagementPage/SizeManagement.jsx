import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from "sweetalert2";

import Heading from '../Heading'
import { swtoast } from '@/mixins/swal.mixin'
import { homeAPI } from '@/config'

const SizeManage = () => {
    const [sizeList, setSizeList] = useState([])

    useEffect(() => {
        const getSizeList = async () => {
            try {
                const result = await axios.get(`${homeAPI}/size/list`)
                setSizeList(result.data)
            } catch (err) {
                console.log(err)
                // setSizeList(fakeSizeList)
            }
        }
        getSizeList()
    }, [])

    const refreshSizetTable = async () => {
        try {
            const result = await axios.get(homeAPI + '/size/list')
            setSizeList(result.data)
        } catch (err) {
            console.log(err)
        }
    }

    const handleCreateSize = async () => {
        const { value: newSize } = await Swal.fire({
            title: 'Enter new size name',
            input: 'text',
            inputLabel: '',
            inputPlaceholder: 'New size name..',
            showCloseButton: true,
        })
        if (!newSize) {
            swtoast.fire({
                text: "Add new size failed!"
            })
            return
        }
        if (newSize) {
            try {
                await axios.post(homeAPI + '/size/create',
                    {
                        size_name: newSize
                    })
                refreshSizetTable()
                swtoast.success({
                    text: 'New size added successfully!'
                })
            } catch (e) {
                console.log(e)
                swtoast.error({
                    text: 'Error adding new size please try again!'
                })
            }
        }
    }

    return (
        <div className="catalog-management-item">
            <Heading title="All sizes" />
            <div className='create-btn-container'>
                <button className='btn btn-dark btn-sm' onClick={handleCreateSize}>Create size</button>
            </div>
            <div className='table-container' style={{ height: "220px" }}>
                <table className='table table-hover table-bordered'>
                    <thead>
                        <tr>
                            <th className='text-center'>NO.</th>
                            <th>
                            Size name
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            sizeList.map((size, index) => {
                                return (
                                    <tr key={index}>
                                        <td className='text-center'>{index + 1}</td>
                                        <td>{size.size_name}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default SizeManage