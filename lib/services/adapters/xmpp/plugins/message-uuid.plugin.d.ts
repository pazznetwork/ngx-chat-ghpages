import { Element } from 'ltx';
import { Message } from '../../../../core/message';
import { MessageWithBodyStanza } from '../../../../core/stanza';
import { AbstractXmppPlugin } from './abstract-xmpp-plugin';
/**
 * https://xmpp.org/extensions/xep-0359.html
 */
export declare class MessageUuidPlugin extends AbstractXmppPlugin {
    static extractIdFromStanza(messageStanza: Element): any;
    beforeSendMessage(messageStanza: Element, message: Message): void;
    afterSendMessage(message: Message, messageStanza: Element): void;
    afterReceiveMessage(message: Message, messageStanza: MessageWithBodyStanza): void;
}
