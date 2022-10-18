import { Component, Input, ViewChild } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../chat-window-frame/chat-window-frame.component";
export class ChatVideoWindowComponent {
    constructor() { }
    ngAfterViewInit() {
        this.track.attach(this.video.nativeElement);
    }
}
ChatVideoWindowComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.6", ngImport: i0, type: ChatVideoWindowComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
ChatVideoWindowComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.6", type: ChatVideoWindowComponent, selector: "ngx-chat-video-window", inputs: { track: "track" }, viewQueries: [{ propertyName: "video", first: true, predicate: ["video"], descendants: true }], ngImport: i0, template: "<ngx-chat-window-frame>\n    <video #video autoplay=\"1\"></video>\n</ngx-chat-window-frame>\n", styles: ["video{width:100%}\n"], dependencies: [{ kind: "component", type: i1.ChatWindowFrameComponent, selector: "ngx-chat-window-frame", outputs: ["closeClick", "headerClick"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.6", ngImport: i0, type: ChatVideoWindowComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-chat-video-window', template: "<ngx-chat-window-frame>\n    <video #video autoplay=\"1\"></video>\n</ngx-chat-window-frame>\n", styles: ["video{width:100%}\n"] }]
        }], ctorParameters: function () { return []; }, propDecorators: { video: [{
                type: ViewChild,
                args: ['video']
            }], track: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC12aWRlby13aW5kb3cuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9jb21wb25lbnRzL2NoYXQtdmlkZW8td2luZG93L2NoYXQtdmlkZW8td2luZG93LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9jaGF0LXZpZGVvLXdpbmRvdy9jaGF0LXZpZGVvLXdpbmRvdy5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQWlCLFNBQVMsRUFBYyxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFRdkYsTUFBTSxPQUFPLHdCQUF3QjtJQVFqQyxnQkFBZ0IsQ0FBQztJQUVqQixlQUFlO1FBQ1gsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNoRCxDQUFDOztxSEFaUSx3QkFBd0I7eUdBQXhCLHdCQUF3Qix5TENSckMsZ0dBR0E7MkZES2Esd0JBQXdCO2tCQUxwQyxTQUFTOytCQUNJLHVCQUF1QjswRUFPMUIsS0FBSztzQkFEWCxTQUFTO3VCQUFDLE9BQU87Z0JBSWxCLEtBQUs7c0JBREosS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5wdXQsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQXR0YWNoYWJsZVRyYWNrIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2hhdC1saXN0LXN0YXRlLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ25neC1jaGF0LXZpZGVvLXdpbmRvdycsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2NoYXQtdmlkZW8td2luZG93LmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi9jaGF0LXZpZGVvLXdpbmRvdy5jb21wb25lbnQubGVzcyddLFxufSlcbmV4cG9ydCBjbGFzcyBDaGF0VmlkZW9XaW5kb3dDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcblxuICAgIEBWaWV3Q2hpbGQoJ3ZpZGVvJylcbiAgICBwdWJsaWMgdmlkZW86IEVsZW1lbnRSZWY8SFRNTFZpZGVvRWxlbWVudD47XG5cbiAgICBASW5wdXQoKVxuICAgIHRyYWNrOiBBdHRhY2hhYmxlVHJhY2s7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnRyYWNrLmF0dGFjaCh0aGlzLnZpZGVvLm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cblxufVxuIiwiPG5neC1jaGF0LXdpbmRvdy1mcmFtZT5cbiAgICA8dmlkZW8gI3ZpZGVvIGF1dG9wbGF5PVwiMVwiPjwvdmlkZW8+XG48L25neC1jaGF0LXdpbmRvdy1mcmFtZT5cbiJdfQ==