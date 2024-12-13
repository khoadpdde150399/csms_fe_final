import { swtoast } from '@/mixins/swal.mixin';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { homeAPI } from '@/config';
import useAdminStore from '@/store/adminStore';
import Router from 'next/router';
import Heading from '@/components/Heading';

const TwoFactorVerify = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const setAdminLogin = useAdminStore((state) => state.setAdminLogin);
    const handleVerify = async () => {
        try {
            const token = Cookies.get('authToken');
            console.log('Auth Token:', token);
            if (!token) {
                throw new Error('Invalid session, please log in again.');
            }
    
            const response = await axios.post(homeAPI + '/admin/2fa/verify', { token, code });
            console.log('Server Response:', response.data);
    
            const { role_id, accessToken } = response.data;
            if (!role_id || !accessToken) {
                throw new Error('Invalid response from server.');
            }
    
            Cookies.set('accessToken', accessToken);
            setAdminLogin(response.data);
            swtoast.success({ text: 'Đăng nhập thành công' });
    
            if (role_id === 1) {
                Router.push('/user/manage');
            } else if (role_id === 3) {
                Router.push('/staff/dashboard');
            } else {
                Router.push('/');
            }
        } catch (err) {
            console.error('Error:', err.response?.data || err.message);
            setError(err.response?.data?.error || 'Verification failed, please try again.');
        }
    };

    return (
        <div className="login-page position-fixed d-flex justity-content-center align-items-center">
            <div className="login-box">
                <Heading title="Two-Factor Authentication" />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className="w-100">
                        <input
                            type="text"
                            className="w-100"
                            placeholder="Enter 2FA code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </div>
                    <button className="login-btn w-100" onClick={handleVerify}>Verify</button>
            </div>
        </div>
    );
};

export default TwoFactorVerify;
