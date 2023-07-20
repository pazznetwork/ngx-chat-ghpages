import { ElementRef, EventEmitter, OnInit } from '@angular/core';
import { Recipient } from '../../core/recipient';
import { ChatService } from '../../services/chat-service';
import * as i0 from "@angular/core";
export declare class ChatMessageInputComponent implements OnInit {
    chatService: ChatService;
    recipient: Recipient;
    messageSent: EventEmitter<void>;
    message: string;
    chatInput: ElementRef;
    constructor(chatService: ChatService);
    ngOnInit(): void;
    onSendMessage($event?: KeyboardEvent): void;
    focus(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChatMessageInputComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ChatMessageInputComponent, "ngx-chat-message-input", never, { "recipient": "recipient"; }, { "messageSent": "messageSent"; }, never, never, false, never>;
}
