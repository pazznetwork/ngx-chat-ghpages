import { Stanza } from '../../../core/stanza';
export declare class XmppResponseError extends Error {
    readonly errorStanza: Stanza;
    static readonly ERROR_ELEMENT_NS = "urn:ietf:params:xml:ns:xmpp-stanzas";
    readonly errorCode?: number;
    readonly errorType?: string;
    readonly errorCondition?: string;
    constructor(errorStanza: Stanza);
    private static extractErrorDataFromErrorResponse;
    private static extractErrorTextFromErrorResponse;
}
