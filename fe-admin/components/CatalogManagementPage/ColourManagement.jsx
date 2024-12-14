import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from "sweetalert2";

import Heading from '../Heading'
import { swtoast } from '@/mixins/swal.mixin'
import { homeAPI } from '@/config'

const ColourManage = () => {
    const [colourList, setColourList] = useState([])

    useEffect(() => {
        const getColourList = async () => {
            try {
                const result = await axios.get(`${homeAPI}/colour/list`)
                setColourList(result.data)
            } catch (err) {
                console.log(err)
                // setColourList(fakeColourList)
            }
        }
        getColourList()
    }, [])

    const refreshColourTable = async () => {
        try {
            const result = await axios.get(`${homeAPI}/colour/list`)
            setColourList(result.data)
        } catch (err) {
            console.log(err)
        }
    }

    const handleCreateColour = async () => {
        const { value: newColour } = await Swal.fire({
            title: 'Enter new color name',
            input: 'text',
            inputLabel: '',
            inputPlaceholder: 'New color name..',
            showCloseButton: true,
        })
        if (!newColour) {
            swtoast.fire({
                text: "Adding new color failed!"
            })
            return
        }
        if (newColour) {
            try {
                await axios.post(homeAPI + '/colour/create',
                    {
                        colour_name: newColour
                    })
                refreshColourTable()
                swtoast.success({
                    text: 'New color added successfully!'
                })
            } catch (e) {
                console.log(e)
                swtoast.error({
                    text: 'Error adding new color please try again!'
                })
            }
        }
    }

    return (
        <div className="catalog-management-item">
            <Heading title="All colors" />
            <div className='create-btn-container'>
                <button className='btn btn-dark btn-sm' onClick={handleCreateColour}>Create Color</button>
            </div>
            <div className='table-container' style={{ height: "220px" }}>
                <table className='table table-hover table-bordered'>
                    <thead>
                        <tr>
                            <th className='text-center'>No.</th>
                            <th>
                                Color Name
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            colourList.map((colour, index) => {
                                return (
                                    <tr key={index}>
                                        <td className='text-center'>{index + 1}</td>
                                        <td>{colour.colour_name}</td>
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

export default ColourManage