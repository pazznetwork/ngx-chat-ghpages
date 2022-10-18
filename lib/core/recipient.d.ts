import { JID } from '@xmpp/jid';
import { Contact } from './contact';
import { Room } from '../services/adapters/xmpp/plugins/multi-user-chat/room';
export declare type Recipient = Contact | Room;
export declare function isJid(o: any): o is JID;
