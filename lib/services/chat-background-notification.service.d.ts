import { JID } from '@xmpp/jid';
import { ChatService } from './chat-service';
import * as i0 from "@angular/core";
export declare class ChatBackgroundNotificationService {
    protected chatService: ChatService;
    private enabled;
    constructor(chatService: ChatService);
    enable(): void;
    disable(): void;
    private requestNotificationPermission;
    private receivedDirectMessage;
    private receivedGroupMessage;
    protected customizeGroupMessage(sender: JID, message: string): Promise<{
        body: string;
    }>;
    private shouldDisplayNotification;
    private supportsNotification;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChatBackgroundNotificationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ChatBackgroundNotificationService>;
}
