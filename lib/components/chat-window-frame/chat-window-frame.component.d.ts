import { EventEmitter } from '@angular/core';
import { ChatStyle } from '../../services/chat-style';
import * as i0 from "@angular/core";
export declare class ChatWindowFrameComponent {
    chatStyle: ChatStyle;
    closeClick: EventEmitter<void>;
    headerClick: EventEmitter<void>;
    constructor(chatStyle: ChatStyle);
    static ɵfac: i0.ɵɵFactoryDeclaration<ChatWindowFrameComponent, [{ optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ChatWindowFrameComponent, "ngx-chat-window-frame", never, {}, { "closeClick": "closeClick"; "headerClick": "headerClick"; }, never, [".window-header-content", ".window-content"], false, never>;
}
