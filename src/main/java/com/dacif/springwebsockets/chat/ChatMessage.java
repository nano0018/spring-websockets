package com.dacif.springwebsockets.chat;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class ChatMessage {
    private String sender;
    private String content;
    private MessageType type;
}
