import { useState } from 'react';
import { Avatar, Button, Input, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import commentService from '@/services/commentService';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import useCustomerStore from '@/store/customerStore';
import { formatDate } from '@/helpers/format';
const { TextArea } = Input;

const CommentItem = ({ comment, productId }) => {
    const [replyContent, setReplyContent] = useState('');
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const queryClient = useQueryClient();
    const customerInfo = useCustomerStore((state) => state.customerInfor);

    // Sử dụng React Query v5 để fetch replies
    const { data: replies = [] } = useQuery({
        queryKey: ['replies', comment.id],
        queryFn: () => commentService.getReplies(comment.id),
        initialData: comment.replies || [],
    });

    const handleReply = async () => {
        if (!customerInfo?.accessToken) {
            message.error('Please login to reply');
            return;
        }

        if (!replyContent.trim()) {
            message.error('Please enter your reply');
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await commentService.createReply({
                commentId: comment.id,
                content: replyContent,
            });

            const newReply = {
                id: response.data.id,
                user_name: response.data.user_name,
                comment_text: response.data.comment_text,
                created_at: response.data.created_at
            };

            // Cập nhật cache của React Query
            queryClient.setQueryData(['replies', comment.id], (oldData) => [...(oldData || []), newReply]);
            
            message.success('Reply posted successfully');
            setReplyContent('');
            setShowReplyInput(false);
            window.location.reload();
            // Làm mới danh sách comments
            queryClient.invalidateQueries({ queryKey: ['comments', productId] });
        } catch (error) {
            message.error(error?.response?.data?.message || 'Failed to post reply');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelReply = () => {
        setReplyContent('');
        setShowReplyInput(false);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };


    return (
        <div className="comment-item" style={{ marginBottom: '16px', borderBottom: '1px solid #f0f0f0', padding: '16px 0' }}>
            <div className="comment-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', paddingLeft: '5px' }}>
                <Avatar icon={<UserOutlined />} style={{ marginRight: '8px' }} />
                <div>
                    <div style={{ fontWeight: 'bold' }}>{comment.user_name}</div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{formatDate(comment.created_at)}</div>
                </div>
            </div>

            <div className="comment-content" style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '18px', fontWeight: '500' }}>
                {comment.comment_text}
            </div>

            <div className="comment-actions">
                <Button 
                    type="link" 
                    onClick={() => setShowReplyInput(!showReplyInput)}
                    disabled={!customerInfo?.accessToken}
                >
                    Reply
                </Button>
            </div>

            {showReplyInput && (
                <div style={{ marginTop: '16px', marginLeft: '32px' }}>
                    <TextArea
                        rows={2}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write your reply..."
                        style={{ marginBottom: '8px', paddingLeft: '20px' }}
                    />
                   <Button
                        type="primary"
                        onClick={handleReply}
                        loading={isSubmitting}
                        size="small"
                        style={{ marginRight: '8px' }}
                    >
                        Send Reply
                    </Button>
                    <Button
                        type="default"
                        onClick={handleCancelReply}
                        size="small"
                    >
                        Cancel
                    </Button>
                </div>
            )}

            {replies.length > 0 && (
                <div className="replies" style={{ marginLeft: '32px', marginTop: '16px' }}>
                    {replies.map((reply) => (
                        <div key={reply.id} className="reply-item" style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                <Avatar icon={<UserOutlined />} size="small" style={{ marginRight: '8px' }} />
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{reply.user_name}</div>
                                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                        {formatDate(reply.created_at)}
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginLeft: '32px' }}>{reply.comment_text}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentItem;