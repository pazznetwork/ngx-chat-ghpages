import { XmppChatAdapter } from '../xmpp-chat-adapter.service';
import { AbstractXmppPlugin } from './abstract-xmpp-plugin';
import { ServiceDiscoveryPlugin } from './service-discovery.plugin';
export declare const MUC_SUB_FEATURE_ID = "urn:xmpp:mucsub:0";
export declare enum MUC_SUB_EVENT_TYPE {
    presence = "urn:xmpp:mucsub:nodes:presence",
    messages = "urn:xmpp:mucsub:nodes:messages",
    affiliations = "urn:xmpp:mucsub:nodes:affiliations",
    subscribers = "urn:xmpp:mucsub:nodes:subscribers",
    config = "urn:xmpp:mucsub:nodes:config",
    subject = "urn:xmpp:mucsub:nodes:subject",
    system = "urn:xmpp:mucsub:nodes:system"
}
/**
 * support for https://docs.ejabberd.im/developer/xmpp-clients-bots/extensions/muc-sub/
 */
export declare class MucSubPlugin extends AbstractXmppPlugin {
    private readonly xmppChatAdapter;
    private readonly serviceDiscoveryPlugin;
    private readonly supportsMucSub$;
    constructor(xmppChatAdapter: XmppChatAdapter, serviceDiscoveryPlugin: ServiceDiscoveryPlugin);
    onBeforeOnline(): PromiseLike<void>;
    private determineSupportForMucSub;
    onOffline(): void;
    subscribeRoom(roomJid: string, nodes?: string[]): Promise<void>;
    unsubscribeRoom(roomJid: string): Promise<void>;
    /**
     * A room moderator can unsubscribe others providing the their jid as attribute to the information query (iq)
     * see: https://docs.ejabberd.im/developer/xmpp-clients-bots/extensions/muc-sub/#unsubscribing-from-a-muc-room
     * @param roomJid for the room to be unsubscribed from
     * @param jid user id to be unsubscribed
     */
    unsubscribeJidFromRoom(roomJid: string, jid: string): void;
    /**
     * A user can query the MUC service to get their list of subscriptions.
     * see: https://docs.ejabberd.im/developer/xmpp-clients-bots/extensions/muc-sub/#g dd ddetting-list-of-subscribed-rooms
     */
    getSubscribedRooms(): Promise<any[]>;
    /**
     * A subscriber or room moderator can get the list of subscribers by sending <subscriptions/> request directly to the room JID.
     * see: https://docs.ejabberd.im/developer/xmpp-clients-bots/extensions/muc-sub/#getting-list-of-subscribers-of-a-room
     * @param roomJid of the room the get a subscriber list from
     */
    getSubscribers(roomJid: string): void;
    retrieveSubscriptions(): Promise<Map<string, string[]>>;
}
