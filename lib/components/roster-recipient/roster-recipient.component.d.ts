import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Presence } from '../../core/presence';
import { Recipient } from '../../core/recipient';
import { ChatService } from '../../services/chat-service';
import * as i0 from "@angular/core";
export declare class RosterRecipientComponent implements OnInit {
    private chatService;
    recipient: Recipient;
    unreadCount$: Observable<number>;
    presence$: Observable<Presence> | null;
    Presence: typeof Presence;
    constructor(chatService: ChatService);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RosterRecipientComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RosterRecipientComponent, "ngx-chat-roster-recipient", never, { "recipient": "recipient"; }, {}, never, never, false>;
}
