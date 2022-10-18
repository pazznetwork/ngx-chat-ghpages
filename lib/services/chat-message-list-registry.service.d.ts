import { BehaviorSubject, Subject } from 'rxjs';
import { Recipient } from '../core/recipient';
import * as i0 from "@angular/core";
/**
 * Used to determine if a message component for a given recipient is open.
 */
export declare class ChatMessageListRegistryService {
    openChats$: BehaviorSubject<Set<Recipient>>;
    chatOpened$: Subject<Recipient>;
    private recipientToOpenMessageListCount;
    constructor();
    isChatOpen(recipient: Recipient): boolean;
    incrementOpenWindowCount(recipient: Recipient): void;
    decrementOpenWindowCount(recipient: Recipient): void;
    private getOrDefault;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChatMessageListRegistryService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ChatMessageListRegistryService>;
}
