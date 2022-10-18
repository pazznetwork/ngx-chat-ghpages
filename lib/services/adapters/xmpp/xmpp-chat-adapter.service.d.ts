import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Contact } from '../../../core/contact';
import { LogInRequest } from '../../../core/log-in-request';
import { ChatPlugin } from '../../../core/plugin';
import { Recipient } from '../../../core/recipient';
import { Translations } from '../../../core/translations';
import { ChatService, ConnectionStates } from '../../chat-service';
import { ContactFactoryService } from '../../contact-factory.service';
import { LogService } from '../../log.service';
import { XmppChatConnectionService } from './xmpp-chat-connection.service';
import * as i0 from "@angular/core";
export interface ChatAction<TChatWindow> {
    cssClass: {
        [className: string]: boolean;
    } | string | string[];
    /**
     * to identify actions
     */
    id: string;
    html: string;
    onClick(chatActionContext: ChatActionContext<TChatWindow>): void;
}
export interface ChatActionContext<TChatWindow> {
    contact: string;
    chatWindow: TChatWindow;
}
export declare class XmppChatAdapter implements ChatService {
    chatConnectionService: XmppChatConnectionService;
    private logService;
    private contactFactory;
    readonly message$: Subject<Contact>;
    readonly messageSent$: Subject<Contact>;
    readonly contacts$: BehaviorSubject<Contact[]>;
    readonly contactCreated$: Subject<Contact>;
    readonly blockedContactIds$: BehaviorSubject<Set<string>>;
    readonly blockedContacts$: Observable<Contact[]>;
    readonly notBlockedContacts$: Observable<Contact[]>;
    readonly contactsSubscribed$: Observable<Contact[]>;
    readonly contactRequestsReceived$: Observable<Contact[]>;
    readonly contactRequestsSent$: Observable<Contact[]>;
    readonly contactsUnaffiliated$: Observable<Contact[]>;
    readonly state$: BehaviorSubject<ConnectionStates>;
    readonly plugins: ChatPlugin[];
    enableDebugging: boolean;
    readonly userAvatar$: BehaviorSubject<string>;
    translations: Translations;
    chatActions: {
        id: string;
        cssClass: string;
        html: string;
        onClick: (chatActionContext: ChatActionContext<{
            sendMessage: () => void;
        }>) => void;
    }[];
    private lastLogInRequest;
    constructor(chatConnectionService: XmppChatConnectionService, logService: LogService, contactFactory: ContactFactoryService);
    private handleInternalStateChange;
    private onOffline;
    private announceAvailability;
    addPlugins(plugins: ChatPlugin[]): void;
    reloadContacts(): void;
    getContactById(jidPlain: string): Contact;
    getOrCreateContactById(jidPlain: string, name?: string): Contact;
    addContact(identifier: string): void;
    removeContact(identifier: string): void;
    logIn(logInRequest: LogInRequest): Promise<void>;
    logOut(): Promise<void>;
    sendMessage(recipient: Recipient, body: string): Promise<void>;
    loadCompleteHistory(): Promise<void>;
    getPlugin<T extends ChatPlugin>(constructor: new (...args: any[]) => T): T;
    private onUnknownStanza;
    reconnectSilently(): void;
    reconnect(): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<XmppChatAdapter, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<XmppChatAdapter>;
}
