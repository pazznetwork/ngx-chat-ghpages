import { Contact } from '../../../../core/contact';
import { Stanza } from '../../../../core/stanza';
import { LogService } from '../../../log.service';
import { XmppChatAdapter } from '../xmpp-chat-adapter.service';
import { AbstractXmppPlugin } from './abstract-xmpp-plugin';
/**
 * https://xmpp.org/rfcs/rfc6121.html#roster-add-success
 */
export declare class RosterPlugin extends AbstractXmppPlugin {
    private chatService;
    private logService;
    constructor(chatService: XmppChatAdapter, logService: LogService);
    handleStanza(stanza: Stanza): boolean;
    private isRosterPushStanza;
    private isPresenceStanza;
    private isCapabilitiesStanza;
    private handleRosterPushStanza;
    private handlePresenceStanza;
    private transitionSubscriptionRequestReceivedAccepted;
    private transitionSubscriptionRequestSentAccepted;
    private sendAcceptPresenceSubscriptionRequest;
    onBeforeOnline(): PromiseLike<any>;
    getRosterContacts(): Promise<Contact[]>;
    private convertToContacts;
    private parseSubscription;
    addRosterContact(jid: string): void;
    private sendAddToRoster;
    private sendSubscribeToPresence;
    removeRosterContact(jid: string): void;
    private sendRemoveFromRoster;
    private sendWithdrawPresenceSubscription;
    refreshRosterContacts(): Promise<Contact[]>;
}
