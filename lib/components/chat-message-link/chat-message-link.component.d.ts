import { PlatformLocation } from '@angular/common';
import { InjectionToken } from '@angular/core';
import { Router } from '@angular/router';
import * as i0 from "@angular/core";
export interface LinkOpener {
    openLink(url: string): void;
}
/**
 * You can provide your own implementation for {@link LinkOpener} to override link opening e.g. when using Cordova.
 */
export declare const LINK_OPENER_TOKEN: InjectionToken<LinkOpener>;
export declare class ChatMessageLinkComponent {
    private router;
    private platformLocation;
    private linkOpener;
    link: string;
    text: string;
    constructor(router: Router, platformLocation: PlatformLocation, linkOpener: LinkOpener);
    onClick($event: Event): Promise<void>;
    private isInApp;
    private appUrl;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChatMessageLinkComponent, [null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ChatMessageLinkComponent, "ngx-chat-message-link", never, {}, {}, never, never, false, never>;
}
