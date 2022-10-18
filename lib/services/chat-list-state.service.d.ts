import { BehaviorSubject } from 'rxjs';
import { Recipient } from '../core/recipient';
import { ChatService } from './chat-service';
import * as i0 from "@angular/core";
export declare class ChatWindowState {
    readonly recipient: Recipient;
    isCollapsed: boolean;
    constructor(recipient: Recipient, isCollapsed: boolean);
}
export interface AttachableTrack {
    attach(elem: HTMLVideoElement): void;
}
/**
 * Used to open chat windows programmatically.
 */
export declare class ChatListStateService {
    private chatService;
    openChats$: BehaviorSubject<ChatWindowState[]>;
    openTracks$: BehaviorSubject<AttachableTrack[]>;
    constructor(chatService: ChatService);
    private openChatCollapsed;
    openChat(recipient: Recipient): void;
    closeChat(recipient: Recipient): void;
    openTrack(track: AttachableTrack): void;
    closeTrack(track: AttachableTrack): void;
    isChatWithRecipientOpen(recipient: Recipient): boolean;
    private findChatWindowStateIndexByRecipient;
    private findChatWindowStateByRecipient;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChatListStateService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ChatListStateService>;
}
