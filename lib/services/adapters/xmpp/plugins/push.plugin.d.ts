import { XmppChatAdapter } from '../xmpp-chat-adapter.service';
import { AbstractXmppPlugin } from './abstract-xmpp-plugin';
import { ServiceDiscoveryPlugin } from './service-discovery.plugin';
/**
 * xep-0357
 */
export declare class PushPlugin extends AbstractXmppPlugin {
    private xmppChatAdapter;
    private serviceDiscoveryPlugin;
    constructor(xmppChatAdapter: XmppChatAdapter, serviceDiscoveryPlugin: ServiceDiscoveryPlugin);
    register(node: string, jid?: string): Promise<any>;
    private getPushServiceComponent;
    unregister(node?: string, jid?: string): Promise<any>;
}
