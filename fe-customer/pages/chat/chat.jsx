import { useCallback } from 'react';
import Talk from 'talkjs';
import { Session, Popup } from '@talkjs/react';

function Chat() {
  const syncUser = useCallback(
    () =>
      new Talk.User({
        id: 'nina',
        name: 'Nina',
        email: 'nina@example.com',
        photoUrl: 'https://talkjs.com/new-web/avatar-7.jpg',
        welcomeMessage: 'Hi!',
      }),
    []
  );

  const syncConversation = useCallback((session) => {
    // JavaScript SDK code here
    const conversation = session.getOrCreateConversation('welcome');
    return conversation;
  }, []);

  return (
    <Session appId="th2sJikw" syncUser={syncUser}>
      <Popup
        syncConversation={syncConversation}
        asGuest={true}
      ></Popup>
    </Session>
  );
}

export default Chat;
