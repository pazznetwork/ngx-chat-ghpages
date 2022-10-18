import { ElementRef, EventEmitter, OnDestroy } from '@angular/core';
import * as i0 from "@angular/core";
export declare class IntersectionObserverDirective implements OnDestroy {
    private el;
    ngxChatIntersectionObserver: EventEmitter<any>;
    private intersectionObserver;
    constructor(el: ElementRef);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<IntersectionObserverDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<IntersectionObserverDirective, "[ngxChatIntersectionObserver]", never, {}, { "ngxChatIntersectionObserver": "ngxChatIntersectionObserver"; }, never, never, false>;
}
