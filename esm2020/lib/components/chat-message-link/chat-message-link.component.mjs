import { Component, Inject, InjectionToken, Optional } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@angular/common";
/**
 * You can provide your own implementation for {@link LinkOpener} to override link opening e.g. when using Cordova.
 */
export const LINK_OPENER_TOKEN = new InjectionToken('ngxChatLinkOpener');
export class ChatMessageLinkComponent {
    constructor(router, platformLocation, linkOpener) {
        this.router = router;
        this.platformLocation = platformLocation;
        this.linkOpener = linkOpener;
    }
    async onClick($event) {
        if (this.linkOpener) {
            $event.preventDefault();
            this.linkOpener.openLink(this.link);
        }
        else if (this.isInApp()) {
            $event.preventDefault();
            const linkParser = document.createElement('a');
            linkParser.href = this.link;
            await this.router.navigateByUrl(linkParser.pathname);
        }
    }
    isInApp() {
        return this.link.startsWith(this.appUrl());
    }
    appUrl() {
        return window.location.protocol + '//' + window.location.host + this.platformLocation.getBaseHrefFromDOM();
    }
}
ChatMessageLinkComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.6", ngImport: i0, type: ChatMessageLinkComponent, deps: [{ token: i1.Router }, { token: i2.PlatformLocation }, { token: LINK_OPENER_TOKEN, optional: true }], target: i0.ɵɵFactoryTarget.Component });
ChatMessageLinkComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.6", type: ChatMessageLinkComponent, selector: "ngx-chat-message-link", ngImport: i0, template: "<a href=\"{{link}}\" target=\"_blank\" rel=\"noopener\" (click)=\"onClick($event)\">{{text}}</a>\n", styles: ["a{color:#198cff;cursor:pointer}a:visited{color:#9a46e8}\n"] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.6", ngImport: i0, type: ChatMessageLinkComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-chat-message-link', template: "<a href=\"{{link}}\" target=\"_blank\" rel=\"noopener\" (click)=\"onClick($event)\">{{text}}</a>\n", styles: ["a{color:#198cff;cursor:pointer}a:visited{color:#9a46e8}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.Router }, { type: i2.PlatformLocation }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [LINK_OPENER_TOKEN]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC1tZXNzYWdlLWxpbmsuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9jb21wb25lbnRzL2NoYXQtbWVzc2FnZS1saW5rL2NoYXQtbWVzc2FnZS1saW5rLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9jaGF0LW1lc3NhZ2UtbGluay9jaGF0LW1lc3NhZ2UtbGluay5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7O0FBTzVFOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxjQUFjLENBQWEsbUJBQW1CLENBQUMsQ0FBQztBQU9yRixNQUFNLE9BQU8sd0JBQXdCO0lBS2pDLFlBQW9CLE1BQWMsRUFDZCxnQkFBa0MsRUFDSyxVQUFzQjtRQUY3RCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNLLGVBQVUsR0FBVixVQUFVLENBQVk7SUFBSSxDQUFDO0lBRXZGLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBYTtRQUN0QixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDakIsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN2QzthQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ3ZCLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN4QixNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQy9DLFVBQVUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztZQUM1QixNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN4RDtJQUNMLENBQUM7SUFFTyxPQUFPO1FBQ1gsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRU8sTUFBTTtRQUNWLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQy9HLENBQUM7O3FIQTNCUSx3QkFBd0Isd0VBT0QsaUJBQWlCO3lHQVB4Qyx3QkFBd0IsNkRDbEJyQyxvR0FDQTsyRkRpQmEsd0JBQXdCO2tCQUxwQyxTQUFTOytCQUNJLHVCQUF1Qjs7MEJBV3BCLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGxhdGZvcm1Mb2NhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgSW5qZWN0aW9uVG9rZW4sIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIExpbmtPcGVuZXIge1xuICAgIG9wZW5MaW5rKHVybDogc3RyaW5nKTogdm9pZDtcbn1cblxuLyoqXG4gKiBZb3UgY2FuIHByb3ZpZGUgeW91ciBvd24gaW1wbGVtZW50YXRpb24gZm9yIHtAbGluayBMaW5rT3BlbmVyfSB0byBvdmVycmlkZSBsaW5rIG9wZW5pbmcgZS5nLiB3aGVuIHVzaW5nIENvcmRvdmEuXG4gKi9cbmV4cG9ydCBjb25zdCBMSU5LX09QRU5FUl9UT0tFTiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxMaW5rT3BlbmVyPignbmd4Q2hhdExpbmtPcGVuZXInKTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICduZ3gtY2hhdC1tZXNzYWdlLWxpbmsnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9jaGF0LW1lc3NhZ2UtbGluay5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vY2hhdC1tZXNzYWdlLWxpbmsuY29tcG9uZW50Lmxlc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBDaGF0TWVzc2FnZUxpbmtDb21wb25lbnQge1xuXG4gICAgbGluazogc3RyaW5nO1xuICAgIHRleHQ6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBwbGF0Zm9ybUxvY2F0aW9uOiBQbGF0Zm9ybUxvY2F0aW9uLFxuICAgICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTElOS19PUEVORVJfVE9LRU4pIHByaXZhdGUgbGlua09wZW5lcjogTGlua09wZW5lcikgeyB9XG5cbiAgIGFzeW5jIG9uQ2xpY2soJGV2ZW50OiBFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5saW5rT3BlbmVyKSB7XG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMubGlua09wZW5lci5vcGVuTGluayh0aGlzLmxpbmspO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNJbkFwcCgpKSB7XG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvbnN0IGxpbmtQYXJzZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICBsaW5rUGFyc2VyLmhyZWYgPSB0aGlzLmxpbms7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnJvdXRlci5uYXZpZ2F0ZUJ5VXJsKGxpbmtQYXJzZXIucGF0aG5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc0luQXBwKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5saW5rLnN0YXJ0c1dpdGgodGhpcy5hcHBVcmwoKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhcHBVcmwoKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyB0aGlzLnBsYXRmb3JtTG9jYXRpb24uZ2V0QmFzZUhyZWZGcm9tRE9NKCk7XG4gICAgfVxufVxuIiwiPGEgaHJlZj1cInt7bGlua319XCIgdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9vcGVuZXJcIiAoY2xpY2spPVwib25DbGljaygkZXZlbnQpXCI+e3t0ZXh0fX08L2E+XG4iXX0=