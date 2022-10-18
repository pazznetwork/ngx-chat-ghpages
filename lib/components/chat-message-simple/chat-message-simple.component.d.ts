import { EventEmitter } from '@angular/core';
import { Direction, MessageState } from '../../core/message';
import * as i0 from "@angular/core";
export declare class ChatMessageSimpleComponent {
    avatar?: string;
    avatarClickHandler: EventEmitter<void>;
    avatarInteractive: boolean;
    direction: Direction;
    formattedDate: string;
    footerHidden: boolean;
    mediaLink: string;
    isImage: boolean;
    isAudio: boolean;
    showImagePlaceholder: boolean;
    messageState: MessageState;
    nick?: string;
    MessageState: typeof MessageState;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChatMessageSimpleComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ChatMessageSimpleComponent, "ngx-chat-message-simple", never, { "avatar": "avatar"; "avatarInteractive": "avatarInteractive"; "direction": "direction"; "formattedDate": "formattedDate"; "footerHidden": "footerHidden"; "mediaLink": "mediaLink"; "isImage": "isImage"; "isAudio": "isAudio"; "showImagePlaceholder": "showImagePlaceholder"; "messageState": "messageState"; "nick": "nick"; }, { "avatarClickHandler": "avatarClickHandler"; }, never, ["*"], false>;
}
