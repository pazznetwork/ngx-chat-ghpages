import { XmppChatAdapter } from '../xmpp-chat-adapter.service';
import { AbstractXmppPlugin } from './abstract-xmpp-plugin';
export interface IdentityAttrs {
    category: string;
    type: string;
    name?: string;
}
export interface Service {
    jid: string;
    identitiesAttrs: IdentityAttrs[];
    features: string[];
}
/**
 * see XEP-0030 Service Discovery
 */
export declare class ServiceDiscoveryPlugin extends AbstractXmppPlugin {
    private readonly chatAdapter;
    static readonly DISCO_INFO = "http://jabber.org/protocol/disco#info";
    static readonly DISCO_ITEMS = "http://jabber.org/protocol/disco#items";
    private readonly servicesInitialized$;
    private hostedServices;
    private readonly resourceCache;
    constructor(chatAdapter: XmppChatAdapter);
    onBeforeOnline(): Promise<void>;
    onOffline(): void;
    supportsFeature(jid: string, searchedFeature: string): Promise<boolean>;
    findService(category: string, type: string): Promise<Service>;
    private discoverServices;
    private discoverServiceInformation;
    private isIdentitiesAttrs;
}
