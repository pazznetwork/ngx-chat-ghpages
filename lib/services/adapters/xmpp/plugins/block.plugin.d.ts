import { BehaviorSubject } from 'rxjs';
import { Stanza } from '../../../../core/stanza';
import { XmppChatAdapter } from '../xmpp-chat-adapter.service';
import { AbstractXmppPlugin } from './abstract-xmpp-plugin';
import { ServiceDiscoveryPlugin } from './service-discovery.plugin';
/**
 * XEP-0191: Blocking Command
 * https://xmpp.org/extensions/xep-0191.html
 */
export declare class BlockPlugin extends AbstractXmppPlugin {
    private xmppChatAdapter;
    private serviceDiscoveryPlugin;
    supportsBlock$: BehaviorSubject<boolean | "unknown">;
    constructor(xmppChatAdapter: XmppChatAdapter, serviceDiscoveryPlugin: ServiceDiscoveryPlugin);
    onBeforeOnline(): Promise<void>;
    private determineSupportForBlock;
    onOffline(): void;
    blockJid(jid: string): Promise<import("../../../../core/stanza").IqResponseStanza<"result">>;
    unblockJid(jid: string): Promise<import("../../../../core/stanza").IqResponseStanza<"result">>;
    private requestBlockedJids;
    handleStanza(stanza: Stanza): boolean;
}
