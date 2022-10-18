import { LogService } from '../../../log.service';
import { XmppChatAdapter } from '../xmpp-chat-adapter.service';
import { AbstractXmppPlugin } from './abstract-xmpp-plugin';
import { ServiceDiscoveryPlugin } from './service-discovery.plugin';
export interface TimeReference {
    utcTimestamp: number;
    /**
     * When was utcTimestamp seen locally according to performance.now().
     */
    localReference: number;
}
/**
 * Request time of entities via XEP-0202.
 */
export declare class EntityTimePlugin extends AbstractXmppPlugin {
    private xmppChatAdapter;
    private serviceDiscoveryPlugin;
    private logService;
    private serverSupportsTime$;
    private serverTime$;
    constructor(xmppChatAdapter: XmppChatAdapter, serviceDiscoveryPlugin: ServiceDiscoveryPlugin, logService: LogService);
    onBeforeOnline(): Promise<void>;
    onOffline(): void;
    /**
     * Returns a non-client-specific timestamp if server supports XEP-0202. Fallback to local timestamp in case of missing support.
     */
    getNow(): Promise<number>;
    private calculateNow;
    requestTime(jid: string): Promise<TimeReference>;
}
