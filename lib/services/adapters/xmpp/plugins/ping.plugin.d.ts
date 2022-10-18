import { NgZone } from '@angular/core';
import { LogService } from '../../../log.service';
import { XmppChatAdapter } from '../xmpp-chat-adapter.service';
import { AbstractXmppPlugin } from './abstract-xmpp-plugin';
/**
 * XEP-0199 XMPP Ping (https://xmpp.org/extensions/xep-0199.html)
 */
export declare class PingPlugin extends AbstractXmppPlugin {
    private readonly xmppChatAdapter;
    private readonly logService;
    private readonly ngZone;
    private timeoutHandle;
    private readonly pingInterval;
    constructor(xmppChatAdapter: XmppChatAdapter, logService: LogService, ngZone: NgZone);
    private schedulePings;
    private ping;
    private sendPing;
    private unschedulePings;
}
