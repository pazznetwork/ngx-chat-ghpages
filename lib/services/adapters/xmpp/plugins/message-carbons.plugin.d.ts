import { IqResponseStanza, Stanza } from '../../../../core/stanza';
import { XmppChatAdapter } from '../xmpp-chat-adapter.service';
import { AbstractXmppPlugin } from './abstract-xmpp-plugin';
/**
 * XEP-0280 Message Carbons
 */
export declare class MessageCarbonsPlugin extends AbstractXmppPlugin {
    private readonly xmppChatAdapter;
    constructor(xmppChatAdapter: XmppChatAdapter);
    onBeforeOnline(): Promise<IqResponseStanza>;
    handleStanza(stanza: Stanza): boolean;
    private handleCarbonMessageStanza;
}
