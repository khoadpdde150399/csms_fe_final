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
                await axios.put('http://localhost:8080/api/category/on', {
                    category_ids: [category_id],  // Sử dụng category_id ở đây
                });
                setDisabledInputState(false);
                refreshCategoryTable();
            } catch (e) {
                console.log(e);
                refreshCategoryTable();
                setDisabledInputState(false);
                swtoast.error({ text: 'Xảy ra lỗi khi mở bán vui lòng thử lại!' });
            }
        } else {
            try {
                setDisabledInputState(true);
                await axios.put('http://localhost:8080/api/category/off', {
                    category_ids: [category_id],  // Sử dụng category_id ở đây
                });
                setDisabledInputState(false);
                refreshCategoryTable();
            } catch (e) {
                console.log(e);
                refreshCategoryTable();
                setDisabledInputState(false);
                swtoast.error({ text: 'Xảy ra lỗi khi tắt sản phẩm vui lòng thử lại!' });
            }
        }
    };

    const handleCreateCategoryLevel1 = async () => {
        const { value: newCategory } = await Swal.fire({
            title: 'Nhập tên danh mục mới',
            input: 'text',
            inputLabel: '',
            inputPlaceholder: 'Tên danh mục mới..',
            showCloseButton: true,
        });
        if (!newCategory) {
            swtoast.fire({
                text: 'Thêm danh mục mới không thành công!',
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
                    text: 'Thêm danh mục mới thành công!',
                });
            } catch (e) {
                console.log(e);
                swtoast.error({
                    text: 'Xảy ra lỗi khi thêm danh mục mới vui lòng thử lại!',
                });
            }
        }
    };

    return (
        <div className="catalog-management-item">
            <Heading title="Tất cả danh mục" />
            <div className="create-btn-container">
                <button className="btn btn-dark btn-sm" onClick={handleCreateCategoryLevel1}>
                    Tạo danh mục level 1
                </button>
                <button className="btn btn-dark btn-sm" onClick={() => setIsModalOpen(true)}>
                    Tạo danh mục level 2
                </button>
            </div>
            <div className="table-container" style={{ height: '520px' }}>
                <table className="table table-hover table-bordered">
                    <thead>
                        <tr>
                            <th className="text-center">STT</th>
                            <th>Tên danh mục</th>
                            <th>Level</th>
                            <th>Danh mục cha</th>
                            <th title="Trạng thái" className="col-state">Trạng thái</th>
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
