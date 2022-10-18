import { Recipient } from '../../../../core/recipient';
import { Stanza } from '../../../../core/stanza';
import { LogService } from '../../../log.service';
import { XmppChatAdapter } from '../xmpp-chat-adapter.service';
import { AbstractXmppPlugin } from './abstract-xmpp-plugin';
import { MultiUserChatPlugin } from './multi-user-chat/multi-user-chat.plugin';
import { ServiceDiscoveryPlugin } from './service-discovery.plugin';
import { MessagePlugin } from './message.plugin';
/**
 * https://xmpp.org/extensions/xep-0313.html
 * Message Archive Management
 */
export declare class MessageArchivePlugin extends AbstractXmppPlugin {
    private readonly chatService;
    private readonly serviceDiscoveryPlugin;
    private readonly multiUserChatPlugin;
    private readonly logService;
    private readonly messagePlugin;
    static readonly MAM_NS = "urn:xmpp:mam:2";
    private readonly mamMessageReceived$;
    constructor(chatService: XmppChatAdapter, serviceDiscoveryPlugin: ServiceDiscoveryPlugin, multiUserChatPlugin: MultiUserChatPlugin, logService: LogService, messagePlugin: MessagePlugin);
    private requestNewestMessages;
    loadMostRecentUnloadedMessages(recipient: Recipient): Promise<void>;
    loadAllMessages(): Promise<void>;
    private supportsMessageArchiveManagement;
    handleStanza(stanza: Stanza): boolean;
    private isMamMessageStanza;
    private handleMamMessageStanza;
    private handleArchivedMessage;
    private handlePubSubEvent;
}
