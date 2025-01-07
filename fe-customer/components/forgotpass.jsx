import { useState } from 'react';
import { Modal, Input, Button } from 'antd';
import { FaTimes } from 'react-icons/fa'; // Thêm dòng này
import { swtoast } from '@/mixins/swal.mixin';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'; // Giả sử bạn dùng Yup để validate form
import * as yup from 'yup'; // Giả sử bạn dùng Yup để validate
import InputField from '@/components/inputField';
import customerService from '@/services/customerService';

const ForgotPass = (props) => {
    // Schema dùng để validate email
    const schema = yup.object({
        email: yup
        .string()
        .trim()
        .required('Please enter your Email')
        .email('Invalid Email')
    });

    // Sử dụng react-hook-form với yupResolver để validate form
    const { control, handleSubmit, getValues, formState: { isSubmitting } } = useForm({
        defaultValues: { email: '' },
        resolver: yupResolver(schema)
    });

    const [isOtpModalVisible, setIsOtpModalVisible] = useState(false); // Quản lý trạng thái modal OTP
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false); // Quản lý modal mật khẩu mới
    const [otp, setOtp] = useState(''); // Quản lý mã OTP
    const [newPassword, setNewPassword] = useState(''); // Quản lý mật khẩu mới
    const [confirmPassword, setConfirmPassword] = useState(''); // Quản lý xác nhận mật khẩu

    // Hàm xử lý khi người dùng submit form "Quên Mật Khẩu"
    const handleForgotPass = async (values) => {
        try {
            const data = { email: values.email };
            const respond = await customerService.ForgotPass(data);
            if (respond.status === 200) {
                swtoast.success({
                    text: 'Please check your email!',
                });
                setIsOtpModalVisible(true); // Hiển thị modal OTP khi thành công
            }
        } catch (error) {
            swtoast.error({
                text: error.response?.data?.message,
            });
        }
    };

    // Hàm xử lý xác thực OTP
    const handleVerifyOtp = async () => {
        const email = getValues('email'); // Lấy giá trị email từ form
        try {
            const data = { otp, email };
            const response = await customerService.verifyOtp(data);
            if (response.status === 200) {
                swtoast.success({
                    text: 'OTP authentication successful!',
                });
                setIsOtpModalVisible(false); // Đóng modal OTP
                setIsPasswordModalVisible(true); // Hiển thị modal nhập mật khẩu
            }
        } catch (error) {
            swtoast.error({
                text: 'OTP authentication failed!',
            });
        }
    };

    // Hàm xử lý khi người dùng đổi mật khẩu
    const handleChangePassword = async () => {
        const email = getValues('email'); // Lấy giá trị email từ form
        if (newPassword !== confirmPassword) {
            swtoast.error({ text: 'Passwords do not match!' });
            return;
        }
        try {
            const data = { email, newPassword }; // Gửi yêu cầu đổi mật khẩu
            const response = await customerService.changePassword(data);
            
            console.log('response changePassword: ', response);
            console.log('Response status: ', response.status);
            console.log('Response data: ', response.data);

            if (response.status === 200) {
                console.log(' dmm')
                swtoast.success({ text: 'Password changed successfully!' });
                setIsPasswordModalVisible(false); // Đóng modal sau khi thành công
                props.toClose();
            }
        } catch (error) {
            console.error('Error occurred: ', error);
            swtoast.error({ text: 'Password change failed!' });
        }
    };

    return (
        <div className="login-container" onClick={props.toClose}>
        <div className="login-box" onClick={(e) => e.stopPropagation()}>
            <div className="close-button" onClick={props.toClose}>
                <FaTimes />
            </div>
            
            <form onSubmit={handleSubmit(handleForgotPass)} className="login-form">
                <h3 className="login-title">Forgot Password</h3>
                
                <div className="form-group">
                    <InputField 
                        name='email' 
                        control={control} 
                        placeholder={'Email'} 
                    />
                </div>
    
                <div className="submit-button">
                    <Button 
                        htmlType='submit' 
                        loading={isSubmitting}
                        block
                    >
                        {!isSubmitting && 'Submit Request'}
                    </Button>
                </div>
            </form>
            <div className="form-footer">
  {!isSubmitting && (
    <>
      <a className="register-link" onClick={props.toRegister}>
        Register new account
      </a>
    </>
  )}
</div>
    
            {/* Modal nhập mã OTP */}
            <Modal
                title="Enter OTP code"
                visible={isOtpModalVisible}
                onCancel={() => setIsOtpModalVisible(false)}
                onOk={handleVerifyOtp}
            >
                <div className="form-group">
                    <Input
                        placeholder="Enter OTP code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                </div>
            </Modal>
    
            {/* Modal nhập mật khẩu mới */}
            <Modal
                title="Enter new password"
                visible={isPasswordModalVisible}
                onCancel={() => setIsPasswordModalVisible(false)}
                onOk={handleChangePassword}
            >
                <div className="form-group">
                    <Input.Password
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <Input.Password
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
            </Modal>
        </div>
    </div>
    )
};

export default ForgotPass;
