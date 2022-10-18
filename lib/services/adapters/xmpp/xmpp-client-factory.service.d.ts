import { Client } from '@xmpp/client';
import { LogInRequest } from '../../../core/log-in-request';
import * as i0 from "@angular/core";
export declare class XmppClientFactoryService {
    client(logInRequest: LogInRequest): Client;
    static ɵfac: i0.ɵɵFactoryDeclaration<XmppClientFactoryService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<XmppClientFactoryService>;
}
