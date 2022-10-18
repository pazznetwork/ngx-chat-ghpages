import { NgZone } from '@angular/core';
import { LogService } from '../../../log.service';
import { AbstractXmppPlugin } from './abstract-xmpp-plugin';
/**
 * XEP-0077: In-Band Registration
 * see: https://xmpp.org/extensions/xep-0077.html
 * Handles registration over the XMPP chat instead of relaying on a admin user account management
 */
export declare class RegistrationPlugin extends AbstractXmppPlugin {
    private logService;
    private ngZone;
    private readonly registered$;
    private readonly cleanUp;
    private readonly loggedIn$;
    private readonly registrationTimeout;
    private client;
    constructor(logService: LogService, ngZone: NgZone);
    /**
     * Promise resolves if user account is registered successfully,
     * rejects if an error happens while registering, e.g. the username is already taken.
     */
    register(username: string, password: string, service: string, domain: string): Promise<void>;
    private connect;
}
