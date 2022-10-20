import { Directive, Input } from '@angular/core';
import { ChatMessageLinkComponent } from '../components/chat-message-link/chat-message-link.component';
import { ChatMessageTextComponent } from '../components/chat-message-text/chat-message-text.component';
import { extractUrls } from '../core/utils-links';
import * as i0 from "@angular/core";
export class LinksDirective {
    constructor(resolver, viewContainerRef) {
        this.resolver = resolver;
        this.viewContainerRef = viewContainerRef;
    }
    ngOnChanges() {
        this.transform();
    }
    transform() {
        const message = this.ngxChatLinks;
        if (!message) {
            return;
        }
        const links = extractUrls(message);
        const chatMessageTextFactory = this.resolver.resolveComponentFactory(ChatMessageTextComponent);
        const chatMessageLinkFactory = this.resolver.resolveComponentFactory(ChatMessageLinkComponent);
        let lastIndex = 0;
        for (const link of links) {
            const currentIndex = message.indexOf(link, lastIndex);
            const textBeforeLink = message.substring(lastIndex, currentIndex);
            if (textBeforeLink) {
                const textBeforeLinkComponent = this.viewContainerRef.createComponent(chatMessageTextFactory);
                textBeforeLinkComponent.instance.text = textBeforeLink;
            }
            const linkRef = this.viewContainerRef.createComponent(chatMessageLinkFactory);
            linkRef.instance.link = link;
            linkRef.instance.text = this.shorten(link);
            lastIndex = currentIndex + link.length;
        }
        const textAfterLastLink = message.substring(lastIndex);
        if (textAfterLastLink) {
            const textAfterLastLinkComponent = this.viewContainerRef.createComponent(chatMessageTextFactory);
            textAfterLastLinkComponent.instance.text = textAfterLastLink;
        }
    }
    shorten(url) {
        const parser = document.createElement('a');
        parser.href = url;
        let shortenedPathname = parser.pathname;
        if (shortenedPathname.length > 17) {
            shortenedPathname = shortenedPathname.substring(0, 5) + '...' + shortenedPathname.substring(shortenedPathname.length - 10);
        }
        return parser.protocol + '//' + parser.host + shortenedPathname;
    }
}
LinksDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: LinksDirective, deps: [{ token: i0.ComponentFactoryResolver }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive });
LinksDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.7", type: LinksDirective, selector: "[ngxChatLinks]", inputs: { ngxChatLinks: "ngxChatLinks" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: LinksDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngxChatLinks]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ComponentFactoryResolver }, { type: i0.ViewContainerRef }]; }, propDecorators: { ngxChatLinks: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlua3MuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9kaXJlY3RpdmVzL2xpbmtzLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQTRCLFNBQVMsRUFBRSxLQUFLLEVBQStCLE1BQU0sZUFBZSxDQUFDO0FBQ3hHLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDZEQUE2RCxDQUFDO0FBQ3ZHLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDZEQUE2RCxDQUFDO0FBQ3ZHLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQzs7QUFLbEQsTUFBTSxPQUFPLGNBQWM7SUFJdkIsWUFBNkIsUUFBa0MsRUFDbEMsZ0JBQWtDO1FBRGxDLGFBQVEsR0FBUixRQUFRLENBQTBCO1FBQ2xDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7SUFDL0QsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVPLFNBQVM7UUFDYixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBRWxDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDVixPQUFPO1NBQ1Y7UUFFRCxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFbkMsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDL0YsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFFL0YsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO1lBQ3RCLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBRXRELE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQ2xFLElBQUksY0FBYyxFQUFFO2dCQUNoQixNQUFNLHVCQUF1QixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsc0JBQXNCLENBQUMsQ0FBQztnQkFDOUYsdUJBQXVCLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxjQUFjLENBQUM7YUFDMUQ7WUFFRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDOUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQzdCLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFM0MsU0FBUyxHQUFHLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQzFDO1FBRUQsTUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZELElBQUksaUJBQWlCLEVBQUU7WUFDbkIsTUFBTSwwQkFBMEIsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDakcsMEJBQTBCLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQztTQUNoRTtJQUNMLENBQUM7SUFFTyxPQUFPLENBQUMsR0FBVztRQUN2QixNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBRWxCLElBQUksaUJBQWlCLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUN4QyxJQUFJLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxFQUFFLEVBQUU7WUFDL0IsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQztTQUM5SDtRQUVELE9BQU8sTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQztJQUNwRSxDQUFDOzsyR0ExRFEsY0FBYzsrRkFBZCxjQUFjOzJGQUFkLGNBQWM7a0JBSDFCLFNBQVM7bUJBQUM7b0JBQ1AsUUFBUSxFQUFFLGdCQUFnQjtpQkFDN0I7OElBR1ksWUFBWTtzQkFBcEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgRGlyZWN0aXZlLCBJbnB1dCwgT25DaGFuZ2VzLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDaGF0TWVzc2FnZUxpbmtDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL2NoYXQtbWVzc2FnZS1saW5rL2NoYXQtbWVzc2FnZS1saW5rLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDaGF0TWVzc2FnZVRleHRDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL2NoYXQtbWVzc2FnZS10ZXh0L2NoYXQtbWVzc2FnZS10ZXh0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBleHRyYWN0VXJscyB9IGZyb20gJy4uL2NvcmUvdXRpbHMtbGlua3MnO1xuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1tuZ3hDaGF0TGlua3NdJ1xufSlcbmV4cG9ydCBjbGFzcyBMaW5rc0RpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG5cbiAgICBASW5wdXQoKSBuZ3hDaGF0TGlua3M6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYpIHtcbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHRyYW5zZm9ybSgpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IHRoaXMubmd4Q2hhdExpbmtzO1xuXG4gICAgICAgIGlmICghbWVzc2FnZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbGlua3MgPSBleHRyYWN0VXJscyhtZXNzYWdlKTtcblxuICAgICAgICBjb25zdCBjaGF0TWVzc2FnZVRleHRGYWN0b3J5ID0gdGhpcy5yZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShDaGF0TWVzc2FnZVRleHRDb21wb25lbnQpO1xuICAgICAgICBjb25zdCBjaGF0TWVzc2FnZUxpbmtGYWN0b3J5ID0gdGhpcy5yZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShDaGF0TWVzc2FnZUxpbmtDb21wb25lbnQpO1xuXG4gICAgICAgIGxldCBsYXN0SW5kZXggPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGxpbmsgb2YgbGlua3MpIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IG1lc3NhZ2UuaW5kZXhPZihsaW5rLCBsYXN0SW5kZXgpO1xuXG4gICAgICAgICAgICBjb25zdCB0ZXh0QmVmb3JlTGluayA9IG1lc3NhZ2Uuc3Vic3RyaW5nKGxhc3RJbmRleCwgY3VycmVudEluZGV4KTtcbiAgICAgICAgICAgIGlmICh0ZXh0QmVmb3JlTGluaykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRleHRCZWZvcmVMaW5rQ29tcG9uZW50ID0gdGhpcy52aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudChjaGF0TWVzc2FnZVRleHRGYWN0b3J5KTtcbiAgICAgICAgICAgICAgICB0ZXh0QmVmb3JlTGlua0NvbXBvbmVudC5pbnN0YW5jZS50ZXh0ID0gdGV4dEJlZm9yZUxpbms7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGxpbmtSZWYgPSB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50KGNoYXRNZXNzYWdlTGlua0ZhY3RvcnkpO1xuICAgICAgICAgICAgbGlua1JlZi5pbnN0YW5jZS5saW5rID0gbGluaztcbiAgICAgICAgICAgIGxpbmtSZWYuaW5zdGFuY2UudGV4dCA9IHRoaXMuc2hvcnRlbihsaW5rKTtcblxuICAgICAgICAgICAgbGFzdEluZGV4ID0gY3VycmVudEluZGV4ICsgbGluay5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0ZXh0QWZ0ZXJMYXN0TGluayA9IG1lc3NhZ2Uuc3Vic3RyaW5nKGxhc3RJbmRleCk7XG4gICAgICAgIGlmICh0ZXh0QWZ0ZXJMYXN0TGluaykge1xuICAgICAgICAgICAgY29uc3QgdGV4dEFmdGVyTGFzdExpbmtDb21wb25lbnQgPSB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50KGNoYXRNZXNzYWdlVGV4dEZhY3RvcnkpO1xuICAgICAgICAgICAgdGV4dEFmdGVyTGFzdExpbmtDb21wb25lbnQuaW5zdGFuY2UudGV4dCA9IHRleHRBZnRlckxhc3RMaW5rO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzaG9ydGVuKHVybDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgcGFyc2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICBwYXJzZXIuaHJlZiA9IHVybDtcblxuICAgICAgICBsZXQgc2hvcnRlbmVkUGF0aG5hbWUgPSBwYXJzZXIucGF0aG5hbWU7XG4gICAgICAgIGlmIChzaG9ydGVuZWRQYXRobmFtZS5sZW5ndGggPiAxNykge1xuICAgICAgICAgICAgc2hvcnRlbmVkUGF0aG5hbWUgPSBzaG9ydGVuZWRQYXRobmFtZS5zdWJzdHJpbmcoMCwgNSkgKyAnLi4uJyArIHNob3J0ZW5lZFBhdGhuYW1lLnN1YnN0cmluZyhzaG9ydGVuZWRQYXRobmFtZS5sZW5ndGggLSAxMCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFyc2VyLnByb3RvY29sICsgJy8vJyArIHBhcnNlci5ob3N0ICsgc2hvcnRlbmVkUGF0aG5hbWU7XG4gICAgfVxuXG59XG4iXX0=