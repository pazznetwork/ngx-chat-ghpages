import { Element } from 'ltx';
import { Message } from '../../../../core/message';
import { ChatPlugin } from '../../../../core/plugin';
import { MessageWithBodyStanza, Stanza } from '../../../../core/stanza';
import { MessageReceivedEvent } from './message.plugin';
export declare abstract class AbstractXmppPlugin implements ChatPlugin {
    onBeforeOnline(): PromiseLike<any>;
    onOffline(): void;
    afterSendMessage(message: Message, messageStanza: Element): void;
    beforeSendMessage(messageStanza: Element, message: Message): void;
    handleStanza(stanza: Stanza): boolean;
    afterReceiveMessage(message: Message, messageStanza: MessageWithBodyStanza, messageReceivedEvent: MessageReceivedEvent): void;
}
