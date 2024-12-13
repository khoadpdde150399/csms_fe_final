import axiosClient from '@/services/axiosClient';
import axiosJWT from './axiosJWT';

const commentService = {
    // Lấy danh sách bình luận của một sản phẩm
    getCommentList: async (productId) => {
        return await axiosClient.get(`/comments/list/${productId}`);
    },

    // Tạo mới một bình luận cho sản phẩm
    createComment: async (data) => {
        return await axiosJWT.post('/comments/create', data);
    },

    // Lấy chi tiết bình luận (có thể bao gồm cả danh sách trả lời)
    getCommentDetail: async (commentId) => {
        return await axiosClient.get(`/comments/detail/${commentId}`);
    },

    // Cập nhật bình luận (sửa nội dung bình luận)
    updateComment: async (data) => {
        return await axiosJWT.put('/comments/update', data);
    },

    // Xóa bình luận
    deleteComment: async (commentId) => {
        return await axiosJWT.delete(`/comments/delete/${commentId}`);
    },

    // Tạo mới một trả lời cho bình luận
    createReply: async (data) => {
        return await axiosJWT.post('/comments/reply/create', data);
    },

    // Lấy danh sách trả lời cho một bình luận cụ thể
    getReplies: async (commentId) => {
        return await axiosClient.get(`/comments/${commentId}/replies`);
    },

    // Cập nhật trả lời (sửa nội dung trả lời)
    updateReply: async (data) => {
        return await axiosJWT.put('/comments/reply/update', data);
    },

    // Xóa trả lời
    deleteReply: async (replyId) => {
        return await axiosJWT.delete(`/comments/reply/delete/${replyId}`);
    },
};

export default commentService;
