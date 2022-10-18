import { Element } from 'ltx';
import { Message } from '../../../../core/message';
import { MessageWithBodyStanza, Stanza } from '../../../../core/stanza';
import { ChatMessageListRegistryService } from '../../../chat-message-list-registry.service';
import { LogService } from '../../../log.service';
import { XmppChatAdapter } from '../xmpp-chat-adapter.service';
import { AbstractXmppPlugin } from './abstract-xmpp-plugin';
import { EntityTimePlugin } from './entity-time.plugin';
import { MessageReceivedEvent } from './message.plugin';
import { PublishSubscribePlugin } from './publish-subscribe.plugin';
export interface StateDate {
    lastRecipientReceived: Date;
    lastRecipientSeen: Date;
    lastSent: Date;
}
export declare type JidToMessageStateDate = Map<string, StateDate>;
/**
 * Plugin using PubSub to persist message read states.
 * Custom not part of the XMPP Specification
 * Standardized implementation specification would be https://xmpp.org/extensions/xep-0184.html
 */
export declare class MessageStatePlugin extends AbstractXmppPlugin {
    private readonly publishSubscribePlugin;
    private readonly xmppChatAdapter;
    private readonly chatMessageListRegistry;
    private readonly logService;
    private readonly entityTimePlugin;
    private jidToMessageStateDate;
    constructor(publishSubscribePlugin: PublishSubscribePlugin, xmppChatAdapter: XmppChatAdapter, chatMessageListRegistry: ChatMessageListRegistryService, logService: LogService, entityTimePlugin: EntityTimePlugin);
    onBeforeOnline(): Promise<void>;
    private parseContactMessageStates;
    private processPubSub;
    private persistContactMessageStates;
    onOffline(): void;
    beforeSendMessage(messageStanza: Element, message: Message): void;
    afterSendMessage(message: Message, messageStanza: Element): Promise<void>;
    afterReceiveMessage(messageReceived: Message, stanza: MessageWithBodyStanza, messageReceivedEvent: MessageReceivedEvent): void;
    private acknowledgeReceivedMessage;
    private sendMessageStateNotification;
    handleStanza(stanza: Stanza): boolean;
    private handleStateNotificationStanza;
    private updateContactMessageState;
    getContactMessageState(contactJid: string): StateDate | undefined;
    private handlePubSubEvent;
}
