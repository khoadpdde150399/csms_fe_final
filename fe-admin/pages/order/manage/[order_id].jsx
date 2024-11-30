import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { useRouter } from 'next/router'
import axios from 'axios'
import { homeAPI } from '@/config'
import { formatPrice, formatAllInDate } from '@/helpers/format'

const detail = () => {
  const router = useRouter()
  const id_order = router.query.order_id

  const [orderDetail, setOrderDetail] = useState('')

  useEffect(() => {
    const getOrderItem = async () => {
      const result = await axios.get(homeAPI + `/order/admin/detail/${id_order}`)
      setOrderDetail(result.data);
    }

    getOrderItem()
  }, [])

  return (
    <div className="order-detail-page">
      <Header />
      <div className="header-order-detail-page">
        <p className="fw-bold">
          Orders #{orderDetail.order_id}
        </p>
        <p className="">
          Order Date {formatAllInDate(orderDetail.created_at)}
        </p>
      </div>
      <div className="container-order-detail-page">
        <div>
          <p className="fw-bold heading-detail-page">List Products</p>
        </div>
        <div>
          <table className='table table-light table-bordered'>
            <thead>
              <tr>
                <th>Products</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Provisional</th>
              </tr>
            </thead>
            <tbody>
              {
                orderDetail.order_items && orderDetail.order_items.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{formatPrice(item.price)} đ</td>
                      <td>{item.quantity}</td>
                      <td>{formatPrice(item.total_value)} đ</td>
                    </tr>
                  )
                })
              }
            </tbody>
            <tfoot>
              <tr className=''>
                <td colSpan="3" className=''>Total product value</td>
                <td colSpan="1">{orderDetail.total_product_value} đ</td>
              </tr>
              <tr className=''>
                <td colSpan="3" className=''>Shipping fee</td>
                <td colSpan="1">{orderDetail.delivery_charges} đ</td>
              </tr>
              <tr className='total fw-bold'>
                <td colSpan="3" className=''>Total payment</td>
                <td colSpan="1">{orderDetail.total_order_value} đ</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div className="footer-order-detail-page">
        <div className="row">
          <div className="col-6">
            <div>
              <p className="fw-bold heading_order_histories">Order history</p>
            </div>
            <div>
              <ul>
                {
                  orderDetail.order_histories && orderDetail.order_histories.map((item, index) => {
                    return (
                      <li key={index}>
                        {`${formatAllInDate(item.created_at)}: ${item.state_name}`}
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div>
          <div className="col-6">
            <div>
              <p className="fw-bold heading-detail-page">Customer information</p>
            </div>
            <div>
              <table className=''>
                <tbody>
                  <tr className='row'>
                    <td className="col-4">
                      FullName
                    </td>
                    <td className="col-8 fw-bold d-flex justify-content-end text-end">
                      {orderDetail.customer_name}
                    </td>
                  </tr>
                  <tr className='row'>
                    <td className="col-4">
                      Address
                    </td>
                    <td className="col-8 fw-bold d-flex justify-content-end text-end">
                      {orderDetail.address}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default detail