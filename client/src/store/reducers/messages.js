export default (
  state = {
    messages: [],
    isLoadingMessages: false,
    isLoadingSendMessage: false,
  },
  action
) => {
  switch (action.type) {
    case "START_LOADING_MESSAGES":
      return { ...state, isLoadingMessages: true };
    case "STOP_LOADING_MESSAGES":
      return { ...state, isLoadingMessages: false };
    case "FETCH_MESSAGES":
      return {
        ...state,
        messages: action.payload.sort(
          (chat1, chat2) =>
            new Date(chat2.data[chat2.data.length - 1].sentAt) -
            new Date(chat1.data[chat1.data.length - 1].sentAt)
        ),
      };
    case "SHOW_TEMP_MESSAGE":
      return {
        ...state,
        isLoadingSendMessage: true,
        messages: state.messages.find(
          (chat) => chat.withId === action.payload.messageData.receiverId
        )
          ? state.messages.map((chat) =>
              chat.withId === action.payload.messageData.receiverId
                ? {
                    ...chat,
                    data: [
                      ...chat.data,
                      {
                        senderId: action.payload.messageData.senderId,
                        text: action.payload.messageData.message.text,
                        image: action.payload.messageData.message.image,
                        file: action.payload.messageData.message.file,
                        sentAt: "Sending...",
                        counter: "Sending...",
                      },
                    ],
                  }
                : chat
            )
          : [
              {
                withId: action.payload.messageData.receiverId,
                withName: action.payload.info.name,
                withPfp: action.payload.info.pfp,
                data: [
                  {
                    senderId: action.payload.messageData.senderId,
                    text: action.payload.messageData.message.text,
                    image: action.payload.messageData.message.image,
                    file: action.payload.messageData.message.file,
                    sentAt: "Sending...",
                    counter: "Sending...",
                  },
                ],
              },
              ...state.messages,
            ],
      };
    case "SEND_MESSAGE":
      return {
        ...state,
        isLoadingSendMessage: false,
        messages: state.messages
          .map((chat) =>
            chat.withId === action.payload.id
              ? {
                  ...chat,
                  data: chat.data.map((message) =>
                    message.sentAt === "Sending..."
                      ? {
                          ...message,
                          sentAt: action.payload.data.sentAt,
                          counter: action.payload.data.counter,
                        }
                      : message
                  ),
                }
              : chat
          )
          .sort(
            (chat1, chat2) =>
              new Date(chat2.data[chat2.data.length - 1].sentAt) -
              new Date(chat1.data[chat1.data.length - 1].sentAt)
          ),
      };
    case "RECEIVE_MESSAGE":
      return {
        ...state,
        messages: state.messages.find(
          (chat) => chat.withId === action.payload.senderId
        )
          ? state.messages.map((chat) =>
              chat.withId === action.payload.senderId
                ? {
                    ...chat,
                    data: [
                      ...chat.data,
                      {
                        senderId: action.payload.senderId,
                        text: action.payload.message.text,
                        image: action.payload.message.image,
                        file: action.payload.message.file,
                        sentAt: action.payload.sentAt,
                        counter: action.payload.counter,
                      },
                    ],
                  }
                : chat
            )
          : [
              {
                withId: action.payload.senderId,
                withName: action.payload.senderName,
                data: [
                  {
                    senderId: action.payload.senderId,
                    text: action.payload.message.text,
                    image: action.payload.message.image,
                    file: action.payload.message.file,
                    sentAt: action.payload.sentAt,
                    counter: action.payload.counter,
                  },
                ],
              },
              ...state.messages,
            ],
      };
    case "FETCH_PFP":
      return {
        ...state,
        messages: state.messages.map((chat) =>
          chat.withId === action.payload.senderId
            ? { ...chat, withPfp: action.payload.pfp }
            : chat
        ),
      };
    default:
      return state;
  }
};
