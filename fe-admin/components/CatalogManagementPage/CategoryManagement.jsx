import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Switch } from 'antd';
import Heading from '../Heading';
import CreateCategoryModal from './CreateCategoryModal';
import { swtoast } from '@/mixins/swal.mixin';
import { homeAPI } from '@/config';

const Category = () => {
    const [categoryList, setCategoryList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [disabledInputState, setDisabledInputState] = useState(false);

    useEffect(() => {
        const getAllCategory = async () => {
            try {
                const result = await axios.get(`${homeAPI}/category/list`);
                setCategoryList(result.data);
            } catch (err) {
                console.log(err);
            }
        };

        getAllCategory();
    }, []);

    const refreshCategoryTable = async () => {
        try {
            const result = await axios.get(homeAPI + '/category/list');
            setCategoryList(result.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleUpdateState = async (state, category_id) => {  // Nhận category_id
        if (state) {
            try {
                setDisabledInputState(true);
                await axios.put('https://www.backend.csms.io.vn/api/category/on', {
                    category_ids: [category_id],  // Sử dụng category_id ở đây
                });
                setDisabledInputState(false);
                refreshCategoryTable();
            } catch (e) {
                console.log(e);
                refreshCategoryTable();
                setDisabledInputState(false);
                swtoast.error({ text: 'An error occurred while opening the sale, please try again.!' });
            }
        } else {
            try {
                setDisabledInputState(true);
                await axios.put('https://www.backend.csms.io.vn/api/category/off', {
                    category_ids: [category_id],  // Sử dụng category_id ở đây
                });
                setDisabledInputState(false);
                refreshCategoryTable();
            } catch (e) {
                console.log(e);
                refreshCategoryTable();
                setDisabledInputState(false);
                swtoast.error({ text: 'An error occurred while opening the sale, please try again.!' });
            }
        }
    };

    const handleCreateCategoryLevel1 = async () => {
        const { value: newCategory } = await Swal.fire({
            title: 'Enter new category name',
            input: 'text',
            inputLabel: '',
            inputPlaceholder: 'New category name..',
            showCloseButton: true,
        });
        if (!newCategory) {
            swtoast.fire({
                text: 'Adding new category failed!',
            });
            return;
        }
        if (newCategory) {
            try {
                await axios.post(homeAPI + '/category/create-level1', {
                    title: newCategory,
                });
                refreshCategoryTable();
                swtoast.success({
                    text: 'New category added successfully!',
                });
            } catch (e) {
                console.log(e);
                swtoast.error({
                    text: 'Error adding new category please try again!',
                });
            }
        }
    };

    return (
        <div className="catalog-management-item">
            <Heading title="All categories" />
            <div className="create-btn-container">
                <button className="btn btn-dark btn-sm" onClick={handleCreateCategoryLevel1}>
                Create level 1 category
                </button>
                <button className="btn btn-dark btn-sm" onClick={() => setIsModalOpen(true)}>
                Create level 2 category
                </button>
            </div>
            <div className="table-container" style={{ height: '520px' }}>
                <table className="table table-hover table-bordered">
                    <thead>
                        <tr>
                            <th className="text-center">NO.</th>
                            <th>Category Name</th>
                            <th>Level</th>
                            <th>Parent Category</th>
                            <th title="Trạng thái" className="col-state">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoryList.map((category, index) => (
                            <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td>{category.title}</td>
                                <td>{category.level}</td>
                                <td>{category.parent}</td>
                                <td>
                                    <Switch
                                        checked={category.state}
                                        onChange={(checked) => handleUpdateState(checked, category.category_id)} // Truyền category.id
                                        disabled={disabledInputState}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <CreateCategoryModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </div>
    );
};

export default Category;
