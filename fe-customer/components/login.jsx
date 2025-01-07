import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from 'antd';
import { useForm } from 'react-hook-form';
import { FaTimes } from 'react-icons/fa';
import { object, string } from 'yup';
import { signIn } from "next-auth/react";
import { GoogleOutlined } from '@ant-design/icons';

import InputField from '@/components/inputField';
import { swtoast } from '@/mixins/swal.mixin';
import customerService from '@/services/customerService';
import useCustomerStore from '@/store/customerStore';

const Login = (props) => {
    const setCustomerLogin = useCustomerStore((state) => state.setCustomerLogin);

    // Form validation schema using Yup
    const schema = object({
        email: string()
            .trim()
            .required('Please enter your Email')
            .max(255, "Email must not exceed 255 characters")
            .email('Invalid Email'),
        password: string()
            .trim()
            .required('Please enter your Password')
            .max(255, "Password must not exceed 255 characters"),
    });

    const { control, handleSubmit, formState: { isSubmitting } } = useForm({
        defaultValues: { email: '', password: '' },
        resolver: yupResolver(schema),
    });

    // Handle regular login
    const handleLogin = async (values) => {
        try {
            const respond = await customerService.login(values);
            const customerInfor = {
                accessToken: respond?.data?.access_token,
                accessTokenExpires: respond?.data?.access_token_expires
            };
            setCustomerLogin(customerInfor);
            swtoast.success({
                text: 'Account login successful!'
            });
            props.toClose();
            window.location.reload();
        } catch (error) {
            swtoast.error({
                text: error.response?.data?.message
            });
        }
    };
    return (
        <div className="login-container">
  <div className="login-box" onClick={(e) => e.stopPropagation()}>
    <div className="close-button" onClick={props.toClose}>
      <FaTimes />
    </div>
    
    <form onSubmit={handleSubmit(handleLogin)} className="login-form">
      <h3 className="login-title">Login</h3>
      
      <div className="form-group">
        <InputField name='email' control={control} placeholder='Email' />
      </div>
      
      <div className="form-group">
        <InputField name='password' control={control} password placeholder='Password' />
      </div>

      <div className={`submit-button ${isSubmitting ? 'loading' : ''}`}>
        <Button 
          type="primary" 
          htmlType='submit' 
          loading={isSubmitting}
          block
        >
          {!isSubmitting && 'Login'}
        </Button>
      </div>

      <div className="divider">
        <span>OR</span>
      </div>

      <div className="social-login">

        <Button 
          onClick={() => signIn('google', { callbackUrl: '/' })}
          icon={
            <svg aria-hidden="true" className="native svg-icon iconGoogle" width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18"></path>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17"></path>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"></path>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.8 4.8 0 0 1 4.48-3.3"></path>
            </svg>
          }
          block
          className="google-btn"
        >
          Sign in with Google
        </Button>
      </div>

      <div className="form-footer">
  {!isSubmitting && (
    <>
      <a className="register-link" onClick={props.toRegister}>
        Register new account
      </a>
      <a className="forgot-link" onClick={props.toForgot}>
        Forgot Password?
      </a>
    </>
  )}
</div>
    </form>
  </div>
</div>
    );
};

export default Login;
