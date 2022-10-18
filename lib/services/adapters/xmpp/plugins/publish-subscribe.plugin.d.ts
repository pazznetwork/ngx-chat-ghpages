import { Element } from 'ltx';
import { Subject } from 'rxjs';
import { IqResponseStanza, Stanza } from '../../../../core/stanza';
import { XmppChatAdapter } from '../xmpp-chat-adapter.service';
import { AbstractXmppPlugin } from './abstract-xmpp-plugin';
import { ServiceDiscoveryPlugin } from './service-discovery.plugin';
export declare const PUBSUB_EVENT_XMLNS = "http://jabber.org/protocol/pubsub#event";
/**
 * XEP-0060 Publish Subscribe (https://xmpp.org/extensions/xep-0060.html)
 * XEP-0223 Persistent Storage of Private Data via PubSub (https://xmpp.org/extensions/xep-0223.html)
 */
export declare class PublishSubscribePlugin extends AbstractXmppPlugin {
    private readonly xmppChatAdapter;
    private readonly serviceDiscoveryPlugin;
    readonly publish$: Subject<Stanza>;
    private readonly supportsPrivatePublish;
    constructor(xmppChatAdapter: XmppChatAdapter, serviceDiscoveryPlugin: ServiceDiscoveryPlugin);
    onBeforeOnline(): Promise<void>;
    onOffline(): void;
    storePrivatePayloadPersistent(node: string, id: string, data: Element): Promise<IqResponseStanza<'result'>>;
    privateNotify(node: string, data?: Element, id?: string): Promise<IqResponseStanza>;
    handleStanza(stanza: Stanza): boolean;
    retrieveNodeItems(node: string): Promise<Element[]>;
    private determineSupportForPrivatePublish;
}
