import { Contact } from '../../../../core/contact';
import { Stanza } from '../../../../core/stanza';
import { LogService } from '../../../log.service';
import { XmppChatAdapter } from '../xmpp-chat-adapter.service';
import { AbstractXmppPlugin } from './abstract-xmpp-plugin';
export declare class MessageReceivedEvent {
    discard: boolean;
}
/**
 * Part of the XMPP Core Specification
 * see: https://datatracker.ietf.org/doc/rfc6120/
 */
export declare class MessagePlugin extends AbstractXmppPlugin {
    private readonly xmppChatAdapter;
    private readonly logService;
    private static readonly MUC_DIRECT_INVITATION_NS;
    constructor(xmppChatAdapter: XmppChatAdapter, logService: LogService);
    handleStanza(stanza: Stanza, archiveDelayElement?: Stanza): boolean;
    sendMessage(contact: Contact, body: string): void;
    private isMessageStanza;
    private handleMessageStanza;
    private extractInvitationFromMessage;
}
