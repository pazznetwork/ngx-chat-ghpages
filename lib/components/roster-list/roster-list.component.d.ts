import { EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../../core/contact';
import { Recipient } from '../../core/recipient';
import { MultiUserChatPlugin } from '../../services/adapters/xmpp/plugins/multi-user-chat/multi-user-chat.plugin';
import { ChatListStateService } from '../../services/chat-list-state.service';
import { ChatService } from '../../services/chat-service';
import * as i0 from "@angular/core";
export declare class RosterListComponent implements OnInit {
    chatService: ChatService;
    private chatListService;
    rosterState: 'hidden' | 'shown';
    contacts: Observable<Contact[]>;
    contactRequestsReceived$: Observable<Contact[]>;
    contactRequestsSent$: Observable<Contact[]>;
    contactsUnaffiliated$: Observable<Contact[]>;
    hasNoContacts$: Observable<boolean>;
    rosterStateChanged: EventEmitter<"hidden" | "shown">;
    multiUserChatPlugin: MultiUserChatPlugin;
    constructor(chatService: ChatService, chatListService: ChatListStateService);
    ngOnInit(): void;
    onClickRecipient(recipient: Recipient): void;
    toggleVisibility(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RosterListComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RosterListComponent, "ngx-chat-roster-list", never, { "rosterState": "rosterState"; "contacts": "contacts"; "contactRequestsReceived$": "contactRequestsReceived$"; "contactRequestsSent$": "contactRequestsSent$"; "contactsUnaffiliated$": "contactsUnaffiliated$"; }, { "rosterStateChanged": "rosterStateChanged"; }, never, never, false>;
}
