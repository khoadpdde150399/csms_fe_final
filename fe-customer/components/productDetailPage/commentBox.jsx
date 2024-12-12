import { useState } from 'react';
import { Button, Input, List, Typography, message } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import useCustomerStore from '@/store/customerStore';
import commentService from '@/services/commentService';
import CommentItem from '@/components/productDetailPage/commentItem';
import queries from '@/queries/index.js';

const { TextArea } = Input;
const { Title } = Typography;

const CommentBox = ({ productId }) => {
    const queryClient = useQueryClient();
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const customerInfo = useCustomerStore((state) => state.customerInfor);

    // Fetch comments
    const { data: commentData, isLoading, isError, error } = useQuery({
        queryKey: ['comments', productId],
        queryFn: () => commentService.getCommentList(productId),
        enabled: !!productId,
    });

    const commentList = commentData?.data || [];

    if (isError) {
        console.error('Error fetching comments:', error);
    }

    const handleSubmit = async () => {
        if (!customerInfo?.accessToken) {
            message.error('Please login to comment');
            return;
        }

        if (!newComment.trim()) {
            message.error('Please enter your comment');
            return;
        }

        try {
            setIsSubmitting(true);
            await commentService.createComment({
                product_id: productId,
                comment_text: newComment,
                parent_id: null
            });

            message.success('Comment posted successfully');
            setNewComment('');
            queryClient.invalidateQueries(['comments', productId]);
            
        } catch (error) {
            message.error(error?.response?.data?.message || 'Failed to post comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
    <Title level={5}>Comments</Title>

    {/* Phần danh sách comment */}
    <div style={{ marginBottom: '20px' }}>
        {isLoading ? (
            <div>Loading comments...</div>
        ) : isError ? (
            <div>Error loading comments</div>
        ) : commentList.length > 0 ? (
            <List
                dataSource={commentList}
                renderItem={(comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                )}
                bordered
                style={{ background: '#fff', borderRadius: '8px' }}
            />
        ) : (
            <p>No comments yet.</p>
        )}
    </div>

    {/* Phần form nhập bình luận mới */}
    <div style={{ marginTop: '20px' }}>
        <TextArea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={4}
            style={{ marginBottom: '10px', resize: 'none' }}
            disabled={!customerInfo?.accessToken}
        />
        <Button
            type="primary"
            onClick={handleSubmit}
            loading={isSubmitting}
            style={{ marginTop: '10px' }}
            disabled={!customerInfo?.accessToken}
        >
            Post Comment
        </Button>
    </div>
</div>


    );
};

export default CommentBox;