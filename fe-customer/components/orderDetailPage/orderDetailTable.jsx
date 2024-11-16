import { memo } from 'react';

import { formatPrice } from '@/helpers/format';

const OrderDetailTable = (props) => {
    const { orderItems, totalProductValue, deliveryCharges, totalOrderValue } = props;

    return (
        <div className="order-detail-table">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>List price</th>
                        <th>Variant</th>
                        <th>Total amount</th>
                    </tr>
                </thead>
                <tbody className="text-right">
                    {orderItems &&
                        orderItems.map((orderItem, index) => {
                            return (
                                <tr key={index}>
                                    <td>{orderItem.name}</td>
                                    <td className="text-center">{orderItem.quantity}</td>
                                    <td className="text-center">{formatPrice(orderItem.price)}</td>
                                    <td className="text-center">{`${orderItem.colour} / ${orderItem.size}`}</td>
                                    <td className="text-right">
                                        {formatPrice(orderItem.total_value)}
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
                <tfoot>
                    <tr className="">
                        <td colSpan="4" className="">
                            Total product value
                        </td>
                        <td colSpan="1">{formatPrice(totalProductValue)}</td>
                    </tr>
                    <tr className="">
                        <td colSpan="4" className="">
                            Shipping fee
                        </td>
                        <td colSpan="1">{formatPrice(deliveryCharges)}</td>
                    </tr>
                    <tr className="total">
                        <td colSpan="4" className="">
                            Total payment
                        </td>
                        <td colSpan="1">{formatPrice(totalOrderValue)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default memo(OrderDetailTable);
