import React, { useEffect, useRef, useState } from "react";
import Talk from "talkjs";

const ChatComponent = () => {
  const inboxEl = useRef(null);

  useEffect(() => {
    Talk.ready.then(() => {
      const staff = new Talk.User({
        id: "staff-id",
        name: "Support Staff",
        email: "staff@example.com",
        role: "user",
        photoUrl: "https://talkjs.com/images/avatar-5.jpg",
      });

      const session = new Talk.Session({
        appId: "th2sJikw",
        me: staff,
      });

      // Tạo và mount inbox
      const inbox = session.createInbox({
        showFeedHeader: true, // Tùy chọn: ẩn header của feed
        // selected: conversation1 // Tùy chọn: chọn conversation mặc định
      });
      inbox.mount(inboxEl.current);
    });
  }, []);

  return (
    <div style={{ height: "700px", paddingTop:'100px' }}>
      <div ref={inboxEl} style={{ height: "100%" }}></div>
    </div>
  );
};

export default ChatComponent;