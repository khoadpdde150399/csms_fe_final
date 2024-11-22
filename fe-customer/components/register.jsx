import { swtoast } from '@/mixins/swal.mixin';
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from 'antd';
import { useForm } from 'react-hook-form';
import { FaTimes } from 'react-icons/fa';
import { object, ref, string } from 'yup';

import InputField from '@/components/inputField';
import customerService from '@/services/customerService';
import useCustomerStore from '@/store/customerStore';

const Register = (props) => {
    const setCustomerLogin = useCustomerStore((state) => state.setCustomerLogin);
    const schema = object({
        fullName: string()
        .trim()
        .required('Please enter your Full Name')
        .max(255, 'Full Name must not exceed 255 characters'),
        phoneNumber: string()
        .trim()
        .required('Please enter your Phone Number')
        .matches(/^\d{10}$/, 'Invalid Phone Number'),
        email: string()
        .trim()
        .required('Please enter your Email')
        .max(255, 'Email must not exceed 255 characters')
        .email('Invalid Email'),
        password: string()
        .trim()
        .required('Please enter your Password')
        .max(255, 'Password must not exceed 255 characters'),
        confirmPassword: string()
        .trim()
        .required('Please enter your Password')
        .oneOf([ref("password"), null], "The password you re-entered does not match")
        .max(255, 'Password cannot exceed 255 characters'),
    });
    const { control, handleSubmit, formState: { isSubmitting } } = useForm({
        defaultValues: {
            fullName: '',
            phoneNumber: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        resolver: yupResolver(schema),
    });

    const handleRegister = async (values) => {
        try {
            const data = {
                email: values.email,
                password: values.password,
                customer_name: values.fullName,
                phone_number: values.phoneNumber
            }
            const respond = await customerService.register(data);

            const customerInfor = {
                accessToken: respond?.data?.access_token,
                accessTokenExpires: respond?.data?.access_token_expires
            }
            setCustomerLogin(customerInfor);
            swtoast.success({
                text: 'Account registration successful!'
            });
            props.toClose();
        } catch (error) {
            swtoast.error({
                text: error.response?.data?.message
            });
        }
    }
    return (
        <div className="login-container">
            <div className="login-box" onClick={(e) => e.stopPropagation()}>
                <div className="close-button" onClick={props.toClose}>
                    <FaTimes />
                </div>
    
                <form onSubmit={handleSubmit(handleRegister)}>
                    <h3 className="login-title">Sign up for an account</h3>
                    
                    <div className="form-group">
                        <InputField 
                            name='fullName' 
                            control={control} 
                            placeholder={'Full name'} 
                        />
                    </div>
    
                    <div className="form-group">
                        <InputField 
                            name='phoneNumber' 
                            control={control} 
                            placeholder={'Phone number'} 
                        />
                    </div>
    
                    <div className="form-group">
                        <InputField 
                            name='email' 
                            control={control} 
                            placeholder={'Email'} 
                        />
                    </div>
    
                    <div className="form-group">
                        <InputField 
                            name='password' 
                            control={control} 
                            password 
                            placeholder={'Password'} 
                        />
                    </div>
    
                    <div className="form-group">
                        <InputField 
                            name='confirmPassword' 
                            control={control} 
                            password 
                            placeholder={'Re-enter password'} 
                        />
                    </div>
    
                    <div className={`submit-button${isSubmitting ? ' loading' : ''}`}>
                        <Button 
                            htmlType='submit' 
                            loading={isSubmitting}
                            block
                        >
                            {!isSubmitting && 'Register'}
                        </Button>
                    </div>
                </form>
    
                <div className="form-footer">
                    <a href="#" onClick={props.toLogin}>
                    Already have an account? Sign in
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Register;
