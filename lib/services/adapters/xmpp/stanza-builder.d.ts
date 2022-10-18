import { Element } from 'ltx';
export declare class StanzaBuilder {
    static buildRoomMessage(from: string, roomJid: string, content?: Element[]): Element;
    static buildRoomMessageWithBody(from: string, roomJid: string, body: string, content?: Element[]): Element;
    static buildRoomMessageWithThread(from: string, roomJid: string, body: string, thread: string): Element;
}
