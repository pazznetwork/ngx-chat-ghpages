import { ChatListStateService } from '../../services/chat-list-state.service';
import * as i0 from "@angular/core";
export declare class ChatWindowListComponent {
    chatListService: ChatListStateService;
    rosterState: string;
    constructor(chatListService: ChatListStateService);
    static ɵfac: i0.ɵɵFactoryDeclaration<ChatWindowListComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ChatWindowListComponent, "ngx-chat-window-list", never, { "rosterState": "rosterState"; }, {}, never, never, false>;
}
