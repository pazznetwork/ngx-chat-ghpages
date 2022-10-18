import { AfterViewInit, ElementRef } from '@angular/core';
import { AttachableTrack } from '../../services/chat-list-state.service';
import * as i0 from "@angular/core";
export declare class ChatVideoWindowComponent implements AfterViewInit {
    video: ElementRef<HTMLVideoElement>;
    track: AttachableTrack;
    constructor();
    ngAfterViewInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChatVideoWindowComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ChatVideoWindowComponent, "ngx-chat-video-window", never, { "track": "track"; }, {}, never, never, false>;
}
