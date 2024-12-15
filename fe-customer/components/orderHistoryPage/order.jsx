import Link from 'next/link';
import { memo } from 'react';

import { formatDate, formatPrice } from '@/helpers/format';
import OrderItem from './orderItem';

const Order = (props) => {
    const {
        id,
        orderItems,
        totalOrderValue,
        stateId,
        stateName,
        createdAt,
        setIsCreateFeedbackModalOpen,
        setIsUpdateFeedbackModalOpen,
        setProductVariantIdForFeedBack
    } = props;

    return (
        <Link className="order border-radius" href={`/get-order/${id}`}>
            <div className="order-header border-radius d-flex align-items-center justify-content-between" style={{
                            backgroundColor: '#1976d2',color: '#fff',
                                            }}>
                <div>
                    <p className="order-title fw-bold">#{id}</p>
                    <p className="order-date">{formatDate(createdAt)}</p>
                </div>
                <div className="order-status">
                    <span className="fw-bold">{stateName}</span>
                </div>
            </div>
            <div className="order-body">
                {orderItems &&
                    orderItems.map((orderItem, index) => (
                        <OrderItem
                            key={index}
                            productVariantId={orderItem.product_variant_id}
                            name={orderItem.name}
                            image={orderItem.image}
                            quantity={orderItem.quantity}
                            colour={orderItem.colour}
                            size={orderItem.size}
                            price={orderItem.price}
                            stateId={stateId}
                            hasFeedback={orderItem.has_feedback}
                            setIsCreateFeedbackModalOpen={setIsCreateFeedbackModalOpen}
                            setIsUpdateFeedbackModalOpen={setIsUpdateFeedbackModalOpen}
                            setProductVariantIdForFeedBack={setProductVariantIdForFeedBack}
                        />
                    ))}
            </div>
            <div className="order-footer d-flex align-items-center justify-content-end">
                <div>
                    Total Orders: <strong>{formatPrice(totalOrderValue)}đ</strong>
                </div>
            </div>
        </Link>
    );
};

export default memo(Order);
