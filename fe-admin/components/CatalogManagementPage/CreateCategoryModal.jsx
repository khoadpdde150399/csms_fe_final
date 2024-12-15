import React, { useState, useEffect } from 'react';
import { Modal, Select, Input } from 'antd'
import axios from 'axios';
import { swtoast } from '@/mixins/swal.mixin'

import { homeAPI } from '@/config'

const CreateCategoryModal = ({ isModalOpen, setIsModalOpen }) => {

    const [parentId, setParentId] = useState('')
    const [title, setTitle] = useState('')
    const [options, setOptions] = useState([])

    useEffect(() => {
        const getCategoryList = async () => {
            try {
                const result = await axios.get(`${homeAPI}/category/list-level1`)
                convertCategoryList(result.data)
            } catch (err) {
                console.log(err)
            }
        }
        getCategoryList()
    }, [])

    const convertCategoryList = (categoryList) => {
        let options = categoryList.map((category) => {
            return { label: category.title, value: category.category_id }
        })
        setOptions(options)
    }

    const handleCreateCategoryLevel2 = async () => {
        if (Validate()) {
            let newCategoryLevel2 = {
                title: title,
                parent_id: parentId
            }
            try {
                await axios.post(homeAPI + '/category/create-level2', newCategoryLevel2)
                swtoast.success({
                    text: 'Added new category successfully!'
                })
            } catch (err) {
                console.log(err)
                swtoast.error({ text: 'Error adding new category please try again!' })
            }
            setIsModalOpen(false)
        }
    }

    const Validate = () => {
        if (!parentId) {
            swtoast.error({ text: 'Parent category cannot be empty!' })
            return false
        }
        if (!title) {
            swtoast.error({ text: 'Category name cannot be blank!' })
            return false
        }
        return true
    }

    return (
        <Modal
            className='create-category-modal'
            open={isModalOpen}
            onOk={handleCreateCategoryLevel2}
            onCancel={() => setIsModalOpen(false)}
            maskClosable={true}
            centered={true}
            footer={[
                <div key={0} className='btn-container text-center'>
                    <button className='btn-ok btn btn-dark' onClick={handleCreateCategoryLevel2}>Ok</button>
                    <button className='btn btn-light btn-outline-dark' onClick={() => setIsModalOpen(false)}>Cancel</button>
                </div>
            ]}
        >
            <h3 className='text-center'>Create level 2 category</h3>
            <label htmlFor="parent-id">Parent category: </label>
            <Select
                id='parent-id'
                placeholder={'Select parent category'}
                style={{ width: '100%' }}
                options={options}
                onChange={setParentId}
            />
            <label htmlFor="title">Category name: </label>
            <Input
                id='title' placeholder='Enter category name'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
        </Modal>
    )
}

export default CreateCategoryModal