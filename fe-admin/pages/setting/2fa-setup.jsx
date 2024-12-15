import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { homeAPI } from '@/config';
import Header from '@/components/Header'
import { Button } from 'antd';

const TwoFactorSetup = () => {
    const [qrCode, setQrCode] = useState('');
    const [backupCode, setBackupCode] = useState('');

    useEffect(() => {
        // const setup2FA = async () => {
        //     try {
        //         const token = Cookies.get('authToken');
        //         const response = await axios.post(homeAPI + '/admin/2fa/generate', { token });
        //         setQrCode(response.data.qrCode);
        //     } catch (error) {
        //         console.error('Error setting up 2FA:', error);
        //     }
        // };
        // setup2FA();
    }, []);

    const handleCreate = async () => {
        try {
            const token = Cookies.get('authToken');
            const response = await axios.post(homeAPI + '/admin/2fa/generate', { token });
            setQrCode(response.data.qrCode);
        } catch (error) {
            console.error('Error setting up 2FA:', error);
        }
    };

    return (
        <div className='catalog-management-page'>
            <Header title="Setup Two-Factor Authentication" />
            <div className="row">
                <div className="col-12 col-md-8">
                    <Button
                        className="btn btn-dark d-flex align-items-center justify-content-center mt-2"
                        type=""
                        danger="true"
                        style={{ backgroundColor: '#000' }}
                        onClick={handleCreate}>Create or Reset 2FA</Button>
                    <div>
                        {qrCode && <img src={qrCode} alt="QR Code" />}
                    </div>
                </div>
            </div>
        </div>

       
    );
};

export default TwoFactorSetup;
