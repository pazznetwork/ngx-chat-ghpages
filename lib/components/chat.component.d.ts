import { OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../core/contact';
import { Translations } from '../core/translations';
import { ChatService } from '../services/chat-service';
import * as i0 from "@angular/core";
/**
 * The main UI component. Should be instantiated near the root of your application.
 *
 * ```html
 * <!-- plain usage, no configuration -->
 * <ngx-chat></ngx-chat>
 *
 * <!-- if supplied, translations contain an object with the structure of the Translations interface. -->
 * <ngx-chat translations="{'contacts': 'Kontakte', ...}"></ngx-chat>
 *
 * <!-- if supplied, the contacts input attribute takes an Observable<Contact[]> as source for your roster list -->
 * <ngx-chat contacts="..."></ngx-chat>
 *
 * <!-- if supplied, userAvatar$ contains an Obervable<string>, which is used as the src attribute of the img for the current user. -->
 * <ngx-chat userAvatar$="Observable.of('http://...')"></ngx-chat>
 * ```
 */
export declare class ChatComponent implements OnInit, OnChanges {
    private chatService;
    /**
     * If supplied, translations contain an object with the structure of the Translations interface.
     */
    set translations(translations: Partial<Translations>);
    /**
     * If supplied, the contacts input attribute takes an [Observable<Contact[]>]{@link Contact} as source for your roster list.
     */
    contacts?: Observable<Contact[]>;
    /**
     * If supplied, the contacts input attribute takes an [Observable<Contact[]>]{@link Contact} as source for your incoming contact
     * requests list.
     */
    contactRequestsReceived$?: Observable<Contact[]>;
    /**
     * If supplied, the contacts input attribute takes an [Observable<Contact[]>]{@link Contact} as source for your outgoing contact
     * requests list.
     */
    contactRequestsSent$?: Observable<Contact[]>;
    /**
     * If supplied, the contacts input attribute takes an [Observable<Contact[]>]{@link Contact} as source for your unaffiliated contact
     * list.
     */
    contactsUnaffiliated$?: Observable<Contact[]>;
    /**
     * If supplied, userAvatar$ contains an Observable<string>, which is used as the src attribute of the img for the current user.
     */
    userAvatar$?: Observable<string>;
    /**
     * 'shown' shows roster list, 'hidden' hides it.
     */
    rosterState: 'shown' | 'hidden';
    showChatComponent: boolean;
    constructor(chatService: ChatService);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    private onChatStateChange;
    onRosterStateChanged(state: 'shown' | 'hidden'): void;
    private updateBodyClass;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChatComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ChatComponent, "ngx-chat", never, { "translations": "translations"; "contacts": "contacts"; "contactRequestsReceived$": "contactRequestsReceived$"; "contactRequestsSent$": "contactRequestsSent$"; "contactsUnaffiliated$": "contactsUnaffiliated$"; "userAvatar$": "userAvatar$"; "rosterState": "rosterState"; }, {}, never, never, false>;
}
