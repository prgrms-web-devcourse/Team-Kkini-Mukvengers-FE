import { Flex } from '@chakra-ui/react';
import { CompatClient, Stomp, StompSubscription } from '@stomp/stompjs';
import { axiosAuthApi } from 'apis/axios';
import GoHomeWhenErrorInvoked from 'components/common/GoHomeWhenErrorInvoked';
import FoodPartyDetailChatLoadingSpinner from 'components/FoodParty/FoodPartyDetail/Chat/FoodPartyDetailChatLoadingSpinner';
import MessageInput from 'components/FoodParty/FoodPartyDetail/Chat/MessageInput';
import MessageList from 'components/FoodParty/FoodPartyDetail/Chat/MessageList';
import {
  useGetFoodPartyDetail,
  useGetFoodPartyMessageList,
} from 'hooks/query/useFoodParty';
import { useGetUser } from 'hooks/query/useUser';
import { GetServerSideProps } from 'next';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Message, ReceivedMessage } from 'types/foodParty';
import { sendMessage } from 'utils/helpers/chat';
import { getNumberArrayCreatedAt } from 'utils/helpers/foodParty';

const FoodPartyDetailChat = ({ roomId }: { roomId: string }) => {
  const client = useRef<CompatClient>();
  const messageListRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const [isLoadingToConnectSocket, setIsLoadingToConnectSocket] = useState(true);
  const [isErrorConnectingSocket, setIsErrorConnectingSocket] = useState(false);
  const [messageList, setMessageList] = useState<Message[]>([]);
  const {
    data: existingMessageList,
    isLoading: isLoadingGettingExistingMessageList,
    isSuccess: isSuccessGettingExistingMessageList,
    error: errorGettingExistingMessageList,
  } = useGetFoodPartyMessageList(roomId);
  const {
    data: userInformation,
    isLoading: isLoadingGettingUserInformation,
    isSuccess: isSuccessGettingUserInformation,
    error: errorGettingUserInformation,
  } = useGetUser();
  const {
    data: foodPartyDetail,
    isLoading: isLoadingGettingFoodPartyDetail,
    isSuccess: isSuccessGettingFoodPartyDetail,
    error: errorGettingFoodPartyDetail,
  } = useGetFoodPartyDetail(roomId, userInformation?.id);

  const handleSendMessage = (event?: KeyboardEvent<HTMLInputElement>) => {
    if (
      !client.current ||
      !messageInputRef.current ||
      !userInformation ||
      !messageInputRef.current.value // empty string
    )
      return;

    // ???????????? enter??? ?????? ???????????? ?????? ??? ????????? ??????.
    // enter ?????? ???????????? shift + enter??? ?????? ???????????? ?????? ??? ????????? ???.
    if (event) {
      if (event.key !== 'Enter' || (event.shiftKey && event.key === 'Enter')) return;
    }

    try {
      sendMessage({
        client: client.current,
        roomId,
        userId: userInformation.id,
        content: messageInputRef.current.value,
      });
    } catch (error) {
      console.error(error);
    }

    messageInputRef.current.value = '';
  };

  // ?????? ????????? ??????
  useEffect(() => {
    if (existingMessageList) setMessageList(existingMessageList);
  }, [existingMessageList]);

  useEffect(() => {
    if (!userInformation) return;
    if (foodPartyDetail?.crewStatus === '?????? ??????') {
      setIsLoadingToConnectSocket(false);
      return;
    }

    // ?????? client ??????
    client.current = Stomp.over(
      () => new SockJS(`${process.env.NEXT_PUBLIC_API_END_POINT}/ws`)
    );

    // console??? ????????? ????????? ?????? ??????.
    client.current.debug = () => {};

    const axiosAuthApiAuthorization =
      axiosAuthApi.defaults.headers.common['Authorization'];

    let subscription: StompSubscription | undefined;
    try {
      // ????????? ?????? ?????? ??????
      client.current.connect(
        {
          Authorization: axiosAuthApiAuthorization,
        },
        // ?????? ??? + ?????? ???????????? publish?????? ?????? callback ?????? ??????
        () => {
          subscription = client.current?.subscribe(
            `/topic/public/${roomId}`,
            (payload) => {
              const receivedMessage = JSON.parse(payload.body) as ReceivedMessage;
              if (receivedMessage.type === 'LEAVE' || receivedMessage.type === 'JOIN')
                return;

              const newReceivedMessage: Message = {
                ...receivedMessage,
                createdAt: getNumberArrayCreatedAt(receivedMessage.createdAt),
              };

              setMessageList((previousMessageList) => [
                ...previousMessageList,
                newReceivedMessage,
              ]);
            }
          );
        },
        // ?????? ?????? ??? ?????? callback ?????? ??????
        () => {
          setIsErrorConnectingSocket(true);
        }
      );
    } catch (error) {
      // ????????? isErrorConnectingSocket??? true??? ????????? GoHomeWhenErrorInvoked ??????????????? ???????????? ?????????
      // ?????? ?????? ??? ????????? ????????? ???????????? ?????? ??? ?????? ?????? ???????????? ????????? ????????? ???.
      console.error(error);
    } finally {
      setIsLoadingToConnectSocket(false);
    }

    return () => {
      // unmount??? ??? ?????? ?????? ??????.
      client.current?.disconnect(() => {
        subscription?.unsubscribe();
      });
    };
  }, [userInformation]);

  // ????????? ?????? ????????? ????????????.
  useEffect(() => {
    if (!messageListRef.current) return;
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  });

  if (
    isLoadingGettingExistingMessageList ||
    isLoadingGettingUserInformation ||
    isLoadingToConnectSocket ||
    isLoadingGettingFoodPartyDetail
  )
    return <FoodPartyDetailChatLoadingSpinner />;
  if (
    errorGettingExistingMessageList ||
    errorGettingExistingMessageList ||
    errorGettingUserInformation ||
    errorGettingFoodPartyDetail
  )
    return <GoHomeWhenErrorInvoked />;

  return (
    <>
      {!isErrorConnectingSocket &&
      isSuccessGettingExistingMessageList &&
      isSuccessGettingUserInformation &&
      isSuccessGettingFoodPartyDetail ? (
        <Flex
          position='relative'
          flexDirection='column'
          height='100%'
          backgroundColor='#f2f2f2'>
          <MessageList
            status={foodPartyDetail.crewStatus}
            ref={messageListRef}
            messageList={messageList}
            currentUserId={userInformation.id}
          />
          {foodPartyDetail.crewStatus !== '?????? ??????' && (
            <MessageInput ref={messageInputRef} onSendMessage={handleSendMessage} />
          )}
        </Flex>
      ) : (
        <GoHomeWhenErrorInvoked
          errorText={isErrorConnectingSocket ? '?????? ????????? ??????????????????.' : ''}
        />
      )}
    </>
  );
};

export default FoodPartyDetailChat;

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { roomId } = context.query;

  return {
    props: {
      roomId,
    },
  };
};
