import { ComponentFactoryResolver, OnChanges, ViewContainerRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class LinksDirective implements OnChanges {
    private readonly resolver;
    private readonly viewContainerRef;
    ngxChatLinks: string;
    constructor(resolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef);
    ngOnChanges(): void;
    private transform;
    private shorten;
    static ɵfac: i0.ɵɵFactoryDeclaration<LinksDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<LinksDirective, "[ngxChatLinks]", never, { "ngxChatLinks": "ngxChatLinks"; }, {}, never, never, false>;
}
