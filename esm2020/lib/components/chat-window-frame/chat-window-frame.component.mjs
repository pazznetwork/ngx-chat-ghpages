import { Component, EventEmitter, Inject, Optional, Output } from '@angular/core';
import { CHAT_STYLE_TOKEN } from '../../services/chat-style';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class ChatWindowFrameComponent {
    constructor(chatStyle) {
        this.chatStyle = chatStyle;
        this.closeClick = new EventEmitter();
        this.headerClick = new EventEmitter();
    }
}
ChatWindowFrameComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatWindowFrameComponent, deps: [{ token: CHAT_STYLE_TOKEN, optional: true }], target: i0.ɵɵFactoryTarget.Component });
ChatWindowFrameComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.7", type: ChatWindowFrameComponent, selector: "ngx-chat-window-frame", outputs: { closeClick: "closeClick", headerClick: "headerClick" }, ngImport: i0, template: "<div class=\"window\" [style.width]=\"chatStyle?.windowFrame?.windowWidth ?? '17em'\">\n\n    <div (click)=\"headerClick.emit()\" class=\"window-header\">\n\n        <ng-content select=\".window-header-content\"></ng-content>\n\n        <div *ngIf=\"closeClick.observers.length > 0\" class=\"window-close\" (click)=\"closeClick.emit()\">\n            &times;\n        </div>\n\n    </div>\n\n    <ng-content select=\".window-content\"></ng-content>\n\n</div>\n", styles: ["@keyframes ngx-chat-message-in{0%{transform:translate(50px);opacity:0}to{transform:none;opacity:1}}@keyframes ngx-chat-message-out{0%{transform:translate(-50px);opacity:0}to{transform:none;opacity:1}}*{box-sizing:border-box;margin:0;padding:0;font-family:Helvetica,Arial,serif}.window{border:1px solid #e1e1e1;border-bottom:none;background:#f5f5f5;margin-left:1em;bottom:0;pointer-events:auto;position:relative}.window-header{display:flex;justify-content:space-between;border-bottom:1px solid #e1e1e1;cursor:pointer;height:2.5em;align-items:center;padding:.25em}.window-header:hover{background-color:#efefef}.window-close{padding:.5em;text-align:right;color:#777}.window-close:hover{color:#000}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatWindowFrameComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-chat-window-frame', template: "<div class=\"window\" [style.width]=\"chatStyle?.windowFrame?.windowWidth ?? '17em'\">\n\n    <div (click)=\"headerClick.emit()\" class=\"window-header\">\n\n        <ng-content select=\".window-header-content\"></ng-content>\n\n        <div *ngIf=\"closeClick.observers.length > 0\" class=\"window-close\" (click)=\"closeClick.emit()\">\n            &times;\n        </div>\n\n    </div>\n\n    <ng-content select=\".window-content\"></ng-content>\n\n</div>\n", styles: ["@keyframes ngx-chat-message-in{0%{transform:translate(50px);opacity:0}to{transform:none;opacity:1}}@keyframes ngx-chat-message-out{0%{transform:translate(-50px);opacity:0}to{transform:none;opacity:1}}*{box-sizing:border-box;margin:0;padding:0;font-family:Helvetica,Arial,serif}.window{border:1px solid #e1e1e1;border-bottom:none;background:#f5f5f5;margin-left:1em;bottom:0;pointer-events:auto;position:relative}.window-header{display:flex;justify-content:space-between;border-bottom:1px solid #e1e1e1;cursor:pointer;height:2.5em;align-items:center;padding:.25em}.window-header:hover{background-color:#efefef}.window-close{padding:.5em;text-align:right;color:#777}.window-close:hover{color:#000}\n"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [CHAT_STYLE_TOKEN]
                }] }]; }, propDecorators: { closeClick: [{
                type: Output
            }], headerClick: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC13aW5kb3ctZnJhbWUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9jb21wb25lbnRzL2NoYXQtd2luZG93LWZyYW1lL2NoYXQtd2luZG93LWZyYW1lLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9jaGF0LXdpbmRvdy1mcmFtZS9jaGF0LXdpbmRvdy1mcmFtZS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNoRixPQUFPLEVBQVksZ0JBQWdCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQzs7O0FBT3ZFLE1BQU0sT0FBTyx3QkFBd0I7SUFRakMsWUFBeUQsU0FBb0I7UUFBcEIsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUw3RSxlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUd0QyxnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFRLENBQUM7SUFHdkMsQ0FBQzs7cUhBVFEsd0JBQXdCLGtCQVFELGdCQUFnQjt5R0FSdkMsd0JBQXdCLGdJQ1JyQyw4Y0FlQTsyRkRQYSx3QkFBd0I7a0JBTHBDLFNBQVM7K0JBQ0ksdUJBQXVCOzswQkFZcEIsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxnQkFBZ0I7NENBTGhELFVBQVU7c0JBRFQsTUFBTTtnQkFJUCxXQUFXO3NCQURWLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIE9wdGlvbmFsLCBPdXRwdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDaGF0U3R5bGUsIENIQVRfU1RZTEVfVE9LRU4gfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jaGF0LXN0eWxlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICduZ3gtY2hhdC13aW5kb3ctZnJhbWUnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9jaGF0LXdpbmRvdy1mcmFtZS5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vY2hhdC13aW5kb3ctZnJhbWUuY29tcG9uZW50Lmxlc3MnXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2hhdFdpbmRvd0ZyYW1lQ29tcG9uZW50IHtcblxuICAgIEBPdXRwdXQoKVxuICAgIGNsb3NlQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgICBAT3V0cHV0KClcbiAgICBoZWFkZXJDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAgIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBJbmplY3QoQ0hBVF9TVFlMRV9UT0tFTikgcHVibGljIGNoYXRTdHlsZTogQ2hhdFN0eWxlKSB7XG4gICAgfVxuXG59XG4iLCI8ZGl2IGNsYXNzPVwid2luZG93XCIgW3N0eWxlLndpZHRoXT1cImNoYXRTdHlsZT8ud2luZG93RnJhbWU/LndpbmRvd1dpZHRoID8/ICcxN2VtJ1wiPlxuXG4gICAgPGRpdiAoY2xpY2spPVwiaGVhZGVyQ2xpY2suZW1pdCgpXCIgY2xhc3M9XCJ3aW5kb3ctaGVhZGVyXCI+XG5cbiAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiLndpbmRvdy1oZWFkZXItY29udGVudFwiPjwvbmctY29udGVudD5cblxuICAgICAgICA8ZGl2ICpuZ0lmPVwiY2xvc2VDbGljay5vYnNlcnZlcnMubGVuZ3RoID4gMFwiIGNsYXNzPVwid2luZG93LWNsb3NlXCIgKGNsaWNrKT1cImNsb3NlQ2xpY2suZW1pdCgpXCI+XG4gICAgICAgICAgICAmdGltZXM7XG4gICAgICAgIDwvZGl2PlxuXG4gICAgPC9kaXY+XG5cbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCIud2luZG93LWNvbnRlbnRcIj48L25nLWNvbnRlbnQ+XG5cbjwvZGl2PlxuIl19