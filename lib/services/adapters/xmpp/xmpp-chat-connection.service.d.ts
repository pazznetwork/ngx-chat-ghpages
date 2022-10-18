import { NgZone } from '@angular/core';
import { Client } from '@xmpp/client';
import { JID } from '@xmpp/jid';
import { Element } from 'ltx';
import { BehaviorSubject, Subject } from 'rxjs';
import { LogInRequest } from '../../../core/log-in-request';
import { IqResponseStanza, Stanza } from '../../../core/stanza';
import { LogService } from '../../log.service';
import { XmppClientFactoryService } from './xmpp-client-factory.service';
import * as i0 from "@angular/core";
export declare type XmppChatStates = 'disconnected' | 'online' | 'reconnecting';
/**
 * Implementation of the XMPP specification according to RFC 6121.
 * @see https://xmpp.org/rfcs/rfc6121.html
 * @see https://xmpp.org/rfcs/rfc3920.html
 * @see https://xmpp.org/rfcs/rfc3921.html
 */
export declare class XmppChatConnectionService {
    private readonly logService;
    private readonly ngZone;
    private readonly xmppClientFactoryService;
    readonly state$: BehaviorSubject<XmppChatStates>;
    readonly stanzaUnknown$: Subject<Stanza>;
    /**
     * User JID with resource, not bare.
     */
    userJid?: JID;
    private requestId;
    private readonly stanzaResponseHandlers;
    client?: Client;
    constructor(logService: LogService, ngZone: NgZone, xmppClientFactoryService: XmppClientFactoryService);
    onOnline(jid: JID): void;
    private onOffline;
    sendPresence(): Promise<void>;
    send(content: any): Promise<void>;
    sendAwaitingResponse(request: Element): Promise<Stanza>;
    onStanzaReceived(stanza: Stanza): void;
    sendIq(request: Element): Promise<IqResponseStanza<'result'>>;
    private isIqStanzaResponse;
    sendIqAckResult(id: string): Promise<void>;
    logIn(logInRequest: LogInRequest): Promise<void>;
    /**
     * We should skip our iq handling for the following xmpp/client response:
     * - resource bind on start by https://xmpp.org/rfcs/rfc6120.html#bind
     */
    private skipXmppClientResponses;
    logOut(): Promise<void>;
    getNextRequestId(): string;
    reconnectSilently(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<XmppChatConnectionService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<XmppChatConnectionService>;
}
