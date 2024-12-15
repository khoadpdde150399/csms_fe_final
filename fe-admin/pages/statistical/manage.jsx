import React, { useState, useEffect } from 'react';
import { Empty } from 'antd'
import { Pie, Line } from '@ant-design/plots';
import axios from 'axios'

import Header from '@/components/Header'
import Heading from '@/components/Heading'
// import ProductAdmin from '@/components/ProductManagementPage/ProductAdmin'
import Router from 'next/router'


const StatisticalManagementPage = () => {
    let [listTotalProduct, settotalProduct] = useState([]);
    let [listTotalUser, settotalUser] = useState([]);
    let [listTotalOrderPerDay, settotalOrderPerDay] = useState([]);
    let [listTotalRevenuePerDay, settotalRevenuePerDay] = useState([]);

    useEffect(() => {
        const refreshTotalProduct = async () => {
            const result = await axios.get('https://www.backend.csms.io.vn/api/product/totalProduct')
            settotalProduct(result.data.totalProducts)
        }
        refreshTotalProduct();

        const refreshTotalUser = async () => {
            const result = await axios.get('https://www.backend.csms.io.vn/api/customer/totalUser')
            settotalUser(result.data.totalUser)
        }
        refreshTotalUser();

        const refreshTotalOrderPerDay = async () => {
            const result = await axios.get('https://www.backend.csms.io.vn/api/order/totalOrderPerDay')
            settotalOrderPerDay(result.data.totalOrdersPerDay)
        }
        refreshTotalOrderPerDay();
        const refreshTotalRevenuePerDay = async () => {
            const result = await axios.get('https://www.backend.csms.io.vn/api/order/totalRevenuePerDay')
            settotalRevenuePerDay(result.data.totalRevenuePerDay)
        }
        refreshTotalRevenuePerDay();
    }, []);
      
    const chartTotalProduct = () => {
        const config = {
            data: [
              { type: 'Product', value: listTotalProduct },
            ],
            angleField: 'value',
            colorField: '#4699CD',
            innerRadius: 0.6,
            annotations: [
              {
                type: 'text',
                style: {
                  text: 'All Product',
                  x: '50%',
                  y: '50%',
                  textAlign: 'center',
                  fontSize: 15,
                  fontStyle: 'bold',
                },
              },
            ],
        };
        return config;
    }
    const chartTotalUser = () => {
        const config = {
            data: [
              { type: 'Customer', value: listTotalUser },
            ],
            angleField: 'value',
            colorField: '#B12A0C',
            innerRadius: 0.6,
            annotations: [
              {
                type: 'text',
                style: {
                  text: 'All Customer',
                  x: '50%',
                  y: '50%',
                  textAlign: 'center',
                  fontSize: 15,
                  fontStyle: 'bold',
                },
              },
            ],
        };
        return config;
    }
    const chartTotalPrice = () => {
        const data = Object.keys(listTotalOrderPerDay).map(date => ({
            date,
            value: listTotalOrderPerDay[date]
        }));
        const config = {
            data,
            xField: 'date',
            yField: 'value', 
            point: {
                shapeField: 'square',
                sizeField: 4,
              },
              interaction: {
                tooltip: {
                  marker: false,
                },
              },
              style: {
                lineWidth: 2,
              },
        };
        return config;
    }
    const chartTotalRevenuePerDay = () => {
        const data = Object.keys(listTotalRevenuePerDay).map(date => ({
            date,
            value: listTotalRevenuePerDay[date]
        }));
        const config = {
            data,
            xField: 'date',
            yField: 'value', 
            point: {
                shapeField: 'square',
                sizeField: 4,
              },
              interaction: {
                tooltip: {
                  marker: false,
                },
              },
              style: {
                lineWidth: 2,
              },
        };
        return config;
    }
   

    return (
        <div className="product-manager">
            <Header title="Statistical" />
            <div className="wrapper manager-box">
                <div className="row">
                    <div className="col-12 col-md-6 chart1">
                        <Heading title="All Products" />
                        <Pie {...chartTotalProduct()} />
                    </div>
                    <div className="col-12 col-md-6 chart2" >
                        <Heading title="All Customer" />
                        <Pie {...chartTotalUser()} />
                    </div>
                    <div className="col-12 col-md-6 pt-5 chart3"  >
                        <Heading title="Order by date" />
                        <Line {...chartTotalPrice()} />
                    </div>
                    <div className="col-12 col-md-6 pt-5 chart4" >
                        <Heading title="Daily Profit" />
                        <Line {...chartTotalRevenuePerDay()} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatisticalManagementPage