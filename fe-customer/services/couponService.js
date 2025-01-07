import axiosClient from '@/services/axiosClient';

const couponService = {

    getCouponList: async (category) => {
        return await axiosClient.get(`/coupon/customer`);
    }

};

export default couponService;
