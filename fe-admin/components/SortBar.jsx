import React, { useState } from 'react';
import { Button, Dropdown, Menu } from 'antd';

const SortBar = ({ onSort }) => {
    const [selected, setSelected] = useState("Latest");

    const handleSortSelect = (value) => {
        setSelected(value);
        onSort(value); // Gọi hàm onSort khi chọn loại sắp xếp
    };

    const menu = (
        <Menu onClick={(e) => handleSortSelect(e.key)}>
            <Menu.Item key="Relate to">Relate to</Menu.Item>
            <Menu.Item key="Latest">Latest</Menu.Item>
            <Menu.Item key="Best Seller">Best Seller</Menu.Item>
            <Menu.Item key="Price Ascending">Price Ascending</Menu.Item>
            <Menu.Item key="Price Descending">Price Descending</Menu.Item>
        </Menu>
    );

    return (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <span>Sort by:</span>
            <Dropdown overlay={menu}>
                <Button>
                    {selected} <span style={{ marginLeft: 4 }}>&#9662;</span>
                </Button>
            </Dropdown>
        </div>
    );
};

export default SortBar;
