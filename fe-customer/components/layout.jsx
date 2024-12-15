import Footer from './footer';
import Header from './header';
import Image from 'next/image';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Talk from 'talkjs';
import queries from '@/queries';
import { useCallback, useEffect, useState } from 'react';
import customerService from '@/services/customerService';

const Layout = ({ children }) => {
    const [customerInfor, setCustomerInfor] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [talkLoaded, setTalkLoaded] = useState(false);

    const { data, isLoading } = useQuery({
        ...queries.customer.infor(),
        staleTime: 5 * 60 * 1000
    });

    // Effect để load TalkJS
    useEffect(() => {
        Talk.ready.then(() => setTalkLoaded(true));
    }, []);

    // Effect để set customer info
    useEffect(() => {
        if (data?.data) {
            const customerData = {
                email: data.data?.email,
                customerName: data.data?.customer_name,
                phoneNumber: data.data?.phone_number,
                address: data.data?.address,
                point: data.data?.point
            };
            setCustomerInfor(customerData);
            console.log("Customer Info updated:", customerData);
        }
    }, [data]);

    // Setup chat function
    const setupChat = useCallback(() => {
    if (!talkLoaded || !customerInfor) {
        console.log("Talk not loaded or no customer info yet");
        return;
    }

    try {
        console.log("Setting up chat...");

        const user = new Talk.User({
            id: customerInfor.email,
            name: customerInfor.customerName,
            email: customerInfor.email,
            photoUrl: 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg',
            welcomeMessage: 'Hi!',
        });

        const staffUser = new Talk.User({
            id: 'staff-id',
            name: 'Support Staff',
            email: 'staff@example.com',
            photoUrl: 'https://talkjs.com/new-web/avatar-2.jpg',
            welcomeMessage: 'Hello! How can I assist you today?',
        });

        const session = new Talk.Session({
            appId: 'th2sJikw',
            me: user,
        });

        const conversation = session.getOrCreateConversation(Talk.oneOnOneId(user, staffUser));
        conversation.setParticipant(user);
        conversation.setParticipant(staffUser);

        console.log("Conversation created:", conversation.id);

        let autoReplyTimeout;
        let lastAutoReplyTime = 0;
        const AUTO_REPLY_DELAY = 10000;
        const AUTO_REPLY_COOLDOWN = 60000; // 1 minute cooldown

        session.on('message', (event) => {
            console.log("Message event received:", event);

            if (event.senderId === user.id) {
                console.log("Message is from the user");

                // Clear any existing timeout
                if (autoReplyTimeout) {
                    console.log("Clearing existing timeout");
                    clearTimeout(autoReplyTimeout);
                }

                // Set a new timeout only if cooldown has passed
                const currentTime = Date.now();
                if (currentTime - lastAutoReplyTime > AUTO_REPLY_COOLDOWN) {
                    console.log("Setting new timeout");
                    autoReplyTimeout = setTimeout(() => {
                        console.log("Timeout triggered, sending auto-reply");
                        // Use the staff session to send the message
                        const staffSession = new Talk.Session({
                            appId: 'th2sJikw',
                            me: staffUser,
                        });
                        const staffConversation = staffSession.getOrCreateConversation(conversation.id);
                        staffConversation.sendMessage("Hi! Our staff is currently unavailable. We've received your message and will get back to you as soon as possible!\n\nIf your matter is urgent, please call our number +84 38 3691293");
                        lastAutoReplyTime = Date.now();
                    }, AUTO_REPLY_DELAY);
                } else {
                    console.log("Auto-reply on cooldown");
                }
            } else if (event.senderId === staffUser.id) {
                console.log("Message is from the staff");
                // If staff replies, clear the timeout
                if (autoReplyTimeout) {
                    console.log("Clearing timeout due to staff reply");
                    clearTimeout(autoReplyTimeout);
                }
            }
        });

        const popup = session.createPopup({ keepOpen: true });
        popup.select(conversation);
        popup.mount(document.getElementById("talkjs-popup"));

        console.log("Chat setup completed");
    }  catch (error) {
        console.error("Error setting up chat:", error);
    }
}, [talkLoaded, customerInfor]);

// Effect để setup chat khi điều kiện đã sẵn sàng
useEffect(() => {
    if (talkLoaded && customerInfor && !isLoading) {
        console.log("Conditions met, setting up chat");
        setupChat();
    } else {
        console.log("Conditions not met for chat setup", { talkLoaded, customerInfor, isLoading });
    }
}, [talkLoaded, customerInfor, isLoading, setupChat]);
    // useEffect(() => {
    //     // Tự động hiển thị popup khi trang tải
    //     setShowPopup(true);
    //     if (showPopup) setupChat();
    // }, [showPopup, setupChat]);

    return (
        <>
            <Header />
            <main>{children}</main>
            <div id="button-contact-vr">
                <div id="zalo-vr" className="button-contact">
                    <div className="phone-vr">
                        <div className="phone-vr-circle-fill"></div>
                        <div className="phone-vr-img-circle">
                            <a target="_blank" href="https://zalo.me/+84383691293" className="zalo-button">
                                <Image src={'/img/footer/zalo.png'} width={60} height={60} alt="Zalo" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            {talkLoaded && (
                <div className="talkjs-container">
                    <div id="talkjs-popup"></div>
                </div>
            )}
            <Footer />
            <style jsx>{`
                #button-contact-vr {
                    position: fixed;
                    right: 20px;
                    bottom: 120px;
                    z-index: 999;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                }

                .talkjs-container {
                    position: fixed;
                    right: 20px;
                    bottom: 20px;
                    z-index: 998;
                    width: 100px;
                    height: 100px;
                }

                .button-contact {
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background-color: #0066ff;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .button-contact:hover {
                    transform: scale(1.1);
                    box-shadow: 0 0 15px rgba(0, 102, 255, 0.5);
                }

                .phone-vr {
                    position: relative;
                }

                .phone-vr-circle-fill {
                    position: absolute;
                    width: 65px;
                    height: 65px;
                    top: 11.5px;
                    left: -2.5px;
                    background-color: rgba(0, 123, 255, 0.15);
                    border-radius: 50%;
                    animation: phone-vr-circle-fill 2.3s infinite ease-in-out;
                }

                .phone-vr-img-circle {
                    background-color: #0066ff;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    transition: all 0.3s ease;
                    top: 18px;
                    left: 5px;
                }

                .phone-vr-img-circle:hover {
                    background-color: #0052cc;
                }

                .zalo-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    transition: transform 0.3s ease;
                }

                .zalo-button:hover {
                    transform: scale(1.1);
                }

                @keyframes phone-vr-circle-fill {
                    0% {
                        transform: rotate(0) scale(1) skew(1deg);
                    }
                    10% {
                        transform: rotate(-25deg) scale(1) skew(1deg);
                    }
                    20% {
                        transform: rotate(25deg) scale(1) skew(1deg);
                    }
                    30% {
                        transform: rotate(-25deg) scale(1) skew(1deg);
                    }
                    40% {
                        transform: rotate(25deg) scale(1) skew(1deg);
                    }
                    50% {
                        transform: rotate(0) scale(1) skew(1deg);
                    }
                    100% {
                        transform: rotate(0) scale(1) skew(1deg);
                    }
                }
            `}</style>
        </>
    );
};

export default Layout;