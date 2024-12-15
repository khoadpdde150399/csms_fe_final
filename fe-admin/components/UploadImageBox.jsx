import React, { useState } from 'react';
import { Modal, Upload, message } from 'antd';

const UploadImageBox = ({ index, productVariantList, setProductVariantList }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const getBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList }) => {
        let productVariantListClone = [...productVariantList];
        let fileListClone = [...fileList];
        for (let i = 0; i < fileListClone.length; i++) {
            // Nếu file có url từ Cloudinary, giữ nguyên status done
            if (fileListClone[i].url) {
                fileListClone[i].status = 'done';
            }
            // Nếu là file mới upload, để status là uploading hoặc done tùy theo logic của bạn
            else {
                fileListClone[i].status = 'done';
            }
        }
        productVariantListClone[index].fileList = fileListClone;
        setProductVariantList(productVariantListClone);
    };

    const beforeUpload = (file) => {
        // Kiểm tra file là hình ảnh
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image files!');
        }
        // Kiểm tra kích thước file nếu cần
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image size must be less than 5MB!');
        }
        return isImage && isLt5M;
    };

    const uploadButton = (
        <div>
            <span>Add</span>
            <div style={{ marginTop: 8 }}>
                Upload
            </div>
        </div>
    );

    return (
        <div>
            <Upload
                listType="picture-card"
                fileList={productVariantList[index].fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={beforeUpload}
                multiple={true}
                // Vô hiệu hóa upload tự động vì chúng ta sẽ xử lý upload trong form submit
                customRequest={({ file, onSuccess }) => {
                    setTimeout(() => {
                        onSuccess("ok");
                    }, 0);
                }}
            >
                {productVariantList[index].fileList && productVariantList[index].fileList.length >= 6 ? null : uploadButton}
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    )
}

export default UploadImageBox;