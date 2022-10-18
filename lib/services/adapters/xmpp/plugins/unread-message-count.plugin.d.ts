import { BehaviorSubject, Observable } from 'rxjs';
import { Recipient } from '../../../../core/recipient';
import { ChatMessageListRegistryService } from '../../../chat-message-list-registry.service';
import { XmppChatAdapter } from '../xmpp-chat-adapter.service';
import { AbstractXmppPlugin } from './abstract-xmpp-plugin';
import { EntityTimePlugin } from './entity-time.plugin';
import { MultiUserChatPlugin } from './multi-user-chat/multi-user-chat.plugin';
import { PublishSubscribePlugin } from './publish-subscribe.plugin';
export declare type JidToNumber = Map<string, number>;
/**
 * Unofficial plugin using XEP-0163 / PubSub to track count of unread messages per recipient
 *
 * It publishes entries to a private PubSub-Node 'ngxchat:unreadmessagedate'
 * The stored elements look like this:
 * <item id="current">
 *     <entries>
 *         <last-read jid="user1@host1.tld" date="1546419050584"/>
 *         <last-read jid="user2@host1.tld" date="1546419050000"/>
 *     </entries>
 * </item>
 */
export declare class UnreadMessageCountPlugin extends AbstractXmppPlugin {
    private chatService;
    private chatMessageListRegistry;
    private publishSubscribePlugin;
    private entityTimePlugin;
    private multiUserChatPlugin;
    /**
     * already debounced to prevent the issues described in {@link UnreadMessageCountPlugin.jidToUnreadCount$}.
     */
    readonly unreadMessageCountSum$: Observable<number>;
    /**
     * emits as soon as the unread message count changes, you might want to debounce it with e.g. half a a second, as
     * new messages might be acknowledged in another session.
     */
    readonly jidToUnreadCount$: BehaviorSubject<JidToNumber>;
    private readonly jidToLastReadTimestamp;
    private readonly recipientIdToMessageSubscription;
    constructor(chatService: XmppChatAdapter, chatMessageListRegistry: ChatMessageListRegistryService, publishSubscribePlugin: PublishSubscribePlugin, entityTimePlugin: EntityTimePlugin, multiUserChatPlugin: MultiUserChatPlugin);
    private checkForUnreadCountChange;
    onBeforeOnline(): Promise<any>;
    onOffline(): void;
    private fetchLastSeenDates;
    private parseLastSeenDates;
    updateContactUnreadMessageState(recipient: Recipient): void;
    private calculateUnreadMessageCount;
    private persistLastSeenDates;
    private handlePubSubEvent;
    private mergeJidToDates;
}
