import Image from 'next/image';

const Footer = () => {
    return (
        <footer className="footer ">
            <div className="container g-0 p-2">
                <div className="footer-sidebar row g-0">
                    <div className="footer-comment col-lg-4 pe-lg-2">
                        <h4>ELEVENT listens to you!</h4>
                        <p>We always value and look forward to receiving all feedback from customers to improve service and product experiences even better.</p>
                        <a href='#'>Give Feedback</a >
                    </div>
                    <div className="footer-contact col-lg-4 px-lg-2">
                        <div className='d-flex justify-content-lg-center'>
                            <div className='d-inline-block'>
                                <div className='contact-item d-flex align-items-center mb-4 mb-lg-2'>
                                    <div className='contact-icon d-inline-block'>
                                        <Image src={'/img/footer/iconHotline.svg'} width={25} height={30} alt='icon-hotline' />
                                    </div>
                                    <div className='contact-content'>
                                        <span>Hotline</span>
                                        <p>19003.175737 - <br />026.747.2737<br />(8:30-22:00)</p>
                                    </div>
                                </div>
                                <div className='contact-item d-flex align-items-center mb-4 mb-lg-2'>
                                    <div className='contact-icon d-inline-block'>
                                        <Image src={'/img/footer/iconEmail.svg'} width={30} height={30} alt='icon-email' />
                                    </div>
                                    <div className='contact-content'>
                                        <span>Email</span>
                                        <p>elevent@elevent.cool</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer-social col-lg-4 row g-0 align-items-lg-center justify-content-lg-end mt-md-4 mt-lg-0 ps-lg-2">
                        <div className='social-icon col flex-lg-grow-0'>
                            <a href='#'><Image src={'/img/footer/iconFacebook.png'} width={48} height={79} alt='icon-facebook' /></a>
                        </div>
                        <div className='social-icon col flex-lg-grow-0 ms-lg-4'>
                            <a href='#'><Image src={'/img/footer/iconZalo.png'} width={76} height={91} alt='icon-zalo' /></a>
                        </div>
                        <div className='social-icon col flex-lg-grow-0 ms-lg-4'>
                            <a href='#'><Image src={'/img/footer/iconTiktok.png'} width={74} height={101} alt='icon-tiktok' /></a>
                        </div>
                        <div className='social-icon col flex-lg-grow-0 ms-lg-4'>
                            <a href='#'><Image src={'/img/footer/iconInstargram.svg'} width={27} height={30} alt='icon-instagram' /></a>
                        </div>
                        <div className='social-icon col flex-lg-grow-0 ms-lg-4'>
                            <a href='#'><Image src={'/img/footer/iconYoutube.svg'} width={34} height={30} alt='icon-youtube' /></a>
                        </div>
                    </div>
                </div>
                <div className="footer-after row g-0 pt-3">
                    <div className="copyright col col-lg-8 pe-1">
                        <h5 className='copyright-title'>@ NASTECH ASIA COMPANY LIMITED</h5>
                        <p className='copyright-description'>Business Registration Number: 0108116083. Certificate of Business Registration issued by the Department of Planning and Investment of Can Tho City on March 21, 2017.</p>
                    </div>
                    <div className="logo col col-lg-4 d-flex justify-content-end ps-1">
                        <div className="logo-item d-inline me-3">
                            <Image src={'/img/footer/logoDMCA.png'} width={121} height={68} alt='logo-dmca' />
                        </div>
                        <div className="logo-item d-inline me-3">
                            <Image src={'/img/footer/logoIQC.png'} width={59} height={61} alt='logo-iqc' />
                        </div>
                        <div className="logo-item d-inline">
                            <Image src={'/img/footer/logoSaleNoti.png'} width={159} height={61} alt='logo-sale-noti' />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
