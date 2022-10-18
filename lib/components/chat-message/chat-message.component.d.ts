import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { Contact } from '../../core/contact';
import { Direction, Message, MessageState } from '../../core/message';
import { ChatContactClickHandler } from '../../hooks/chat-contact-click-handler';
import { ChatService } from '../../services/chat-service';
import * as i0 from "@angular/core";
export declare class ChatMessageComponent implements OnInit {
    chatService: ChatService;
    private httpClient;
    contactClickHandler: ChatContactClickHandler;
    showAvatars: boolean;
    avatar?: string;
    message: Message;
    nick: string;
    contact: Contact;
    showMessageReadState: boolean;
    showImagePlaceholder: boolean;
    isImage: boolean;
    isAudio: boolean;
    mediaLink: string;
    Direction: typeof Direction;
    private readonly messageStatePlugin;
    constructor(chatService: ChatService, httpClient: HttpClient, contactClickHandler: ChatContactClickHandler);
    ngOnInit(): void;
    private tryFindImageLink;
    private tryFindEmbedImageUrls;
    getMessageState(): MessageState | undefined;
    private getStateForDate;
    onContactClick(): void;
    getAvatar(): string | undefined;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChatMessageComponent, [null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ChatMessageComponent, "ngx-chat-message", never, { "showAvatars": "showAvatars"; "avatar": "avatar"; "message": "message"; "nick": "nick"; "contact": "contact"; "showMessageReadState": "showMessageReadState"; }, {}, never, never, false>;
}