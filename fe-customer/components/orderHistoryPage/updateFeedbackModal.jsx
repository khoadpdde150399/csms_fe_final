import { Input, Modal, Rate } from 'antd';
import { useEffect, useState } from 'react';
const { TextArea } = Input;

import { swtoast } from '@/mixins/swal.mixin';
import feedbackService from '@/services/feedbackService';

const UpdateFeedbackModal = (props) => {
    const { isOpen, setIsOpen, productVariantId, setProductVariantId, refreshOrderList } = props;
    const [feedbackId, setFeedbackId] = useState('');
    const [rate, setRate] = useState(0);
    const [content, setContent] = useState('');

    const handleCancel = (e) => {
        e.preventDefault();
        setProductVariantId(null);
        setIsOpen(false);
    };

    const handleUpdateFeedback = async () => {
        try {
            const feedback = {
                feedback_id: feedbackId,
                rate,
                content
            };
            await feedbackService.update(feedback);
            swtoast.success({ text: 'Update Feedback Success' });
            setProductVariantId(null);
            setIsOpen(false);
            refreshOrderList();
        } catch (err) {
            console.log(err);
            setProductVariantId(null);
            setIsOpen(false);
            swtoast.error({ text: 'Error editing review please try again!' });
        }
    };

    useEffect(() => {
        const getFeedback = async () => {
            try {
                const response = await feedbackService.getFeedBackDetail(productVariantId)
                setFeedbackId(response.data.feedback_id);
                setRate(response.data.rate);
                setContent(response.data.content);
            } catch (err) {
                console.log(err);
                setProductVariantId(null);
                setIsOpen(false);
                swtoast.error({ text: 'Error loading review please try again!' });
            }
        };
        getFeedback();
    }, [productVariantId, setIsOpen, setProductVariantId]);

    return (
        <Modal
            className="feedback-modal"
            open={isOpen}
            onCancel={handleCancel}
            footer={null}
            centered={true}
        >
            <div className="modal-head">
                <h5 className="text-center">Your review</h5>
            </div>
            <div className="modal-body">
                <div className="d-flex align-items-center">
                    <label>Rating: </label>
                    <div className="rating-box">
                        <Rate value={rate} onChange={(value) => setRate(value)} />
                    </div>
                </div>
                <div className="">
                    <label htmlFor="content">Comment: </label>
                    <div className="content-box">
                        <TextArea
                            value={content}
                            id="content"
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Comment"
                            autoSize={{
                                minRows: 3,
                                maxRows: 5
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="modal-foot">
                <div
                    className="rate-btn border-radius bg-dark text-light text-center"
                    onClick={handleUpdateFeedback}
                >
                    Update Feedback
                </div>
            </div>
        </Modal>
    );
};

export default UpdateFeedbackModal;
