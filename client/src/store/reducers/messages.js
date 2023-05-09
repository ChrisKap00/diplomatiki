export default (state = { messages: [], isLoadingMessages: false }, action) => {
  switch (action.type) {
    case "FETCH_MESSAGES":
      return {
        ...state,
        messages: action.payload.sort(
          (chat1, chat2) =>
            chat2.data[chat2.data.length - 1].sentAt -
            chat1.data[chat1.data.length - 1].sentAt
        ),
      };
    case "SHOW_TEMP_MESSAGE":
      return {
        ...state,
        messages: state.messages.find(
          (chat) => chat.withId === action.payload.messageData.receiverId
        )
          ? state.messages.map((chat) => ({
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
            }))
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
        messages: state.messages.map((chat) =>
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
        ),
      };
    default:
      return state;
  }
};
