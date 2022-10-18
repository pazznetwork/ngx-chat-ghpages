import { AfterViewInit, ChangeDetectorRef, ElementRef, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { Direction, Message } from '../../core/message';
import { Recipient } from '../../core/recipient';
import { BlockPlugin } from '../../services/adapters/xmpp/plugins/block.plugin';
import { ChatListStateService } from '../../services/chat-list-state.service';
import { ChatMessageListRegistryService } from '../../services/chat-message-list-registry.service';
import { ChatService } from '../../services/chat-service';
import { ContactFactoryService } from '../../services/contact-factory.service';
import { ReportUserService } from '../../services/report-user-service';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { RoomMessage } from '../../services/adapters/xmpp/plugins/multi-user-chat/room-message';
import { Contact, Invitation } from '../../core/contact';
import * as i0 from "@angular/core";
declare enum SubscriptionAction {
    PENDING_REQUEST = 0,
    SHOW_BLOCK_ACTIONS = 1,
    NO_PENDING_REQUEST = 2
}
export declare class ChatMessageListComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    chatListService: ChatListStateService;
    chatService: ChatService;
    private chatMessageListRegistry;
    reportUserService: ReportUserService;
    private changeDetectorRef;
    private contactFactory;
    recipient: Recipient;
    showAvatars: boolean;
    chatMessageAreaElement: ElementRef<HTMLElement>;
    chatMessageViewChildrenList: QueryList<ChatMessageComponent>;
    Direction: typeof Direction;
    SubscriptionAction: typeof SubscriptionAction;
    blockPlugin: BlockPlugin;
    subscriptionAction: SubscriptionAction;
    onTop$: Subject<IntersectionObserverEntry>;
    private ngDestroy;
    private isAtBottom;
    private bottomLeftAt;
    private oldestVisibleMessageBeforeLoading;
    private pendingRoomInvite;
    constructor(chatListService: ChatListStateService, chatService: ChatService, chatMessageListRegistry: ChatMessageListRegistryService, reportUserService: ReportUserService, changeDetectorRef: ChangeDetectorRef, contactFactory: ContactFactoryService);
    ngOnInit(): Promise<void>;
    ngAfterViewInit(): Promise<void>;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    acceptSubscriptionRequest(event: Event): void;
    denySubscriptionRequest(event: Event): void;
    scheduleScrollToLastMessage(): void;
    blockContact($event: MouseEvent): void;
    blockContactAndReport($event: MouseEvent): void;
    dismissBlockOptions($event: MouseEvent): void;
    subscriptionActionShown(): boolean;
    loadOlderMessagesBeforeViewport(): Promise<void>;
    onBottom(event: IntersectionObserverEntry): void;
    getOrCreateContactWithFullJid(message: Message | RoomMessage): Contact;
    showPendingRoomInvite(): false | Invitation;
    acceptRoomInvite(event: MouseEvent): Promise<void>;
    declineRoomInvite(event: MouseEvent): Promise<void>;
    private scrollToLastMessage;
    private scrollToMessage;
    private loadMessages;
    private isNearBottom;
    private isLoadingHistory;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChatMessageListComponent, [null, null, null, { optional: true; }, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ChatMessageListComponent, "ngx-chat-message-list", never, { "recipient": "recipient"; "showAvatars": "showAvatars"; }, {}, never, never, false>;
}
export {};
