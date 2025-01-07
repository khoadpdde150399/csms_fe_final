/* eslint-disable @next/next/no-img-element */
import Slider from '@/components/slider';
import { ArrowUpOutlined } from '@ant-design/icons';
import Image from 'next/image';

export default function HomePage() {
    return (
        <div className="homepage">
            <div className="container-fluid g-0">
                <Slider />
            </div>
            <div className="homepage-basic container-fluid g-0">
                <div className="row g-0">
                    <div className="homepage-basic-left col-12 col-md-5 bg-dark text-light">
                        <h2 className="content_h2">
                            ElevenT for <br /> Runing
                        </h2>
                        <p className="content_p">
                            Products tested by professional runners
                        </p>
                        <div>
                            <button>Explore Now</button>
                        </div>
                    </div>
                    <div className="homepage-basic-right col-12 col-md-7 position-relative">
                        <img
                            src="/img/banner/banner4.webp"
                            alt="img-homepage-basic"
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>
                </div>
            </div>
            <div className="homepage-brands container pt-4 pb-4">
                <div className="row">
                    <div className="col-12 col-md-6 left-brands">
                        <div className="homepage-brands-img position-relative">
                            <Image src={'/img/homepage/homepageBrandsLeft.jpg'} fill alt="homepage-brands-left" style={{ zIndex: -1, borderRadius: '7px' }}/>
                            <div className="homepage-brands-content">
                                <h2>84Rising*</h2>
                                <p>Fashion brand dedicated to young people by ElevenT</p>
                                <div><button>Explore Now</button></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="homepage-brands-img position-relative">
                            <Image src={'/img/homepage/homepageBrandsRight.jpg'} fill alt="homepage-brands-right" style={{ zIndex: -1, borderRadius: '7px' }}/>
                            <div className="homepage-brands-content">
                                <h2>CM24</h2>
                                <p>Personal care brand for men by Coolmate</p>
                                <div><button className="border-radius fw-bold">Explore Now</button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="homepage-hagstag container-fluid">
                <div className="row g-0 column">
                    <div className="col-12 col-xl-6">
                        <p>
                           PROUDLY MADE IN VIETNAM FOR VIETNAMESE PEOPLE! <br /> OVER 3 MILLION PRODUCTS HAVE BEEN DELIVERED TO CUSTOMERS WHO ARE USING THEM AND ARE SATISFIED!
                        </p>
                    </div>
                    <div className="col-12 col-xl-6 d-flex justify-content-around align-items-center column-right">
                        <div>
                            <p className="hagstag-title">#ElevenT</p>
                        </div>
                        <div>
                            <p>
                                SHOPPING SOLUTIONS <br />
MEN'S WARDROBE
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="homepage-service container">
                <div className="row">
                    <div className="col-12 col-md-6 left-service">
                        <div className="homepage-service-item position-relative">
                            <Image src={'/img/homepage/homepageServiceLeft.jpg'} fill alt="homepage-service-left" style={{ zIndex: -1, borderRadius: '7px' }}/>
                            <div className="homepage-service-content d-flex justify-content-between align-items-end w-100">
                                <span className="title">ElevenT Story</span>
                                <span className="title icon d-flex align-items-center">
                                    <ArrowUpOutlined />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="homepage-service-item position-relative">
                            <Image src={'/img/homepage/homepageServiceRight.jpg'} fill alt="homepage-service-right" style={{ zIndex: -1, borderRadius: '7px' }}/>
                            <div className="homepage-service-content d-flex justify-content-between align-items-end w-100">
                                <span className="title">100% Satisfaction Service</span>
                                <span className="title icon d-flex align-items-center">
                                    <ArrowUpOutlined />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
