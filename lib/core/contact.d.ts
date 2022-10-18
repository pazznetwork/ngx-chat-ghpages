import { JID } from '@xmpp/jid';
import { BehaviorSubject, Subject } from 'rxjs';
import { LogService } from '../services/log.service';
import { Message } from './message';
import { DateMessagesGroup } from './message-store';
import { Presence } from './presence';
import { Recipient } from './recipient';
import { ContactSubscription } from './subscription';
export interface Invitation {
    from: JID;
    roomJid: JID;
    reason?: string;
    password?: string;
}
export interface ContactMetadata {
    [key: string]: any;
}
export declare type JidToPresence = Map<string, Presence>;
export declare class Contact {
    name: string;
    readonly recipientType = "contact";
    avatar: string;
    metadata: ContactMetadata;
    /** use {@link jidBare}, jid resource is only set for chat room contacts */
    readonly jidFull: JID;
    readonly jidBare: JID;
    readonly presence$: BehaviorSubject<Presence>;
    readonly subscription$: BehaviorSubject<ContactSubscription>;
    readonly pendingOut$: BehaviorSubject<boolean>;
    readonly pendingIn$: BehaviorSubject<boolean>;
    readonly resources$: BehaviorSubject<JidToPresence>;
    readonly pendingRoomInvite$: BehaviorSubject<Invitation>;
    private readonly messageStore;
    get messages$(): Subject<Message>;
    get messages(): Message[];
    get dateMessagesGroups(): DateMessagesGroup<Message>[];
    get oldestMessage(): Message | undefined;
    get mostRecentMessage(): Message | undefined;
    get mostRecentMessageReceived(): Message | undefined;
    get mostRecentMessageSent(): Message | undefined;
    /**
     * Do not call directly, use {@link ContactFactoryService#createContact} instead.
     */
    constructor(jidPlain: string, name: string, logService?: LogService, avatar?: string);
    addMessage(message: Message): void;
    equalsBareJid(other: Recipient | JID): boolean;
    isSubscribed(): boolean;
    isUnaffiliated(): boolean;
    updateResourcePresence(jid: string, presence: Presence): void;
    getMessageById(id: string): Message | null;
    private determineOverallPresence;
}
