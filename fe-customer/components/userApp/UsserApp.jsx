import React, { useCallback, useState, useRef } from "react";
import Talk from "talkjs";
import { staff } from "../config";

const UserApp = ({ user }) => {
  const [convId, setConvId] = useState(`conv-${user.id}-${staff.id}`);
  const sessionRef = useRef();

  const createUser = useCallback(() => new Talk.User(user), [user]);

  const createConv = useCallback(
    (session) => {
      const conv = session.getOrCreateConversation(convId);
      conv.setParticipant(session.me);
      conv.setParticipant(new Talk.User(staff));
      return conv;
    },
    [convId]
  );

  return (
    <Talk.Session
      appId={process.env.NEXT_PUBLIC_TALKJS_APP_ID}
      syncUser={createUser}
      sessionRef={sessionRef}
    >
      <Talk.Chatbox
        syncConversation={createConv}
        messageField={{ placeholder: "Gửi tin nhắn..." }}
        style={{ width: 400, height: 600 }}
      />
    </Talk.Session>
  );
};

export default UserApp;
