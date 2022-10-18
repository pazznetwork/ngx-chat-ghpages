import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../services/chat-list-state.service";
import * as i2 from "@angular/common";
import * as i3 from "../chat-window/chat-window.component";
import * as i4 from "../chat-video-window/chat-video-window.component";
export class ChatWindowListComponent {
    constructor(chatListService) {
        this.chatListService = chatListService;
    }
}
ChatWindowListComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.6", ngImport: i0, type: ChatWindowListComponent, deps: [{ token: i1.ChatListStateService }], target: i0.ɵɵFactoryTarget.Component });
ChatWindowListComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.6", type: ChatWindowListComponent, selector: "ngx-chat-window-list", inputs: { rosterState: "rosterState" }, ngImport: i0, template: "<div class=\"chat-list\" [@rosterVisibility]=\"rosterState\">\n\n    <ngx-chat-video-window\n            *ngFor=\"let track of (chatListService.openTracks$ | async)\"\n            [track]=\"track\">\n    </ngx-chat-video-window>\n\n    <ngx-chat-window\n            *ngFor=\"let chatWindowState of (chatListService.openChats$ | async)\"\n            [chatWindowState]=\"chatWindowState\"></ngx-chat-window>\n\n</div>\n", styles: ["*{box-sizing:border-box;margin:0;padding:0;font-family:Helvetica,Arial,serif}.chat-list{display:flex;flex-flow:row nowrap;align-items:flex-end;position:fixed;bottom:0;right:16em;z-index:5;pointer-events:none}\n"], dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "component", type: i3.ChatWindowComponent, selector: "ngx-chat-window", inputs: ["chatWindowState"] }, { kind: "component", type: i4.ChatVideoWindowComponent, selector: "ngx-chat-video-window", inputs: ["track"] }, { kind: "pipe", type: i2.AsyncPipe, name: "async" }], animations: [
        trigger('rosterVisibility', [
            state('hidden', style({
                right: '1em',
            })),
            state('shown', style({
                right: '15em',
            })),
            transition('hidden => shown', animate('400ms ease')),
            transition('shown => hidden', animate('400ms ease'))
        ])
    ] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.6", ngImport: i0, type: ChatWindowListComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-chat-window-list', animations: [
                        trigger('rosterVisibility', [
                            state('hidden', style({
                                right: '1em',
                            })),
                            state('shown', style({
                                right: '15em',
                            })),
                            transition('hidden => shown', animate('400ms ease')),
                            transition('shown => hidden', animate('400ms ease'))
                        ])
                    ], template: "<div class=\"chat-list\" [@rosterVisibility]=\"rosterState\">\n\n    <ngx-chat-video-window\n            *ngFor=\"let track of (chatListService.openTracks$ | async)\"\n            [track]=\"track\">\n    </ngx-chat-video-window>\n\n    <ngx-chat-window\n            *ngFor=\"let chatWindowState of (chatListService.openChats$ | async)\"\n            [chatWindowState]=\"chatWindowState\"></ngx-chat-window>\n\n</div>\n", styles: ["*{box-sizing:border-box;margin:0;padding:0;font-family:Helvetica,Arial,serif}.chat-list{display:flex;flex-flow:row nowrap;align-items:flex-end;position:fixed;bottom:0;right:16em;z-index:5;pointer-events:none}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.ChatListStateService }]; }, propDecorators: { rosterState: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC13aW5kb3ctbGlzdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2NvbXBvbmVudHMvY2hhdC13aW5kb3ctbGlzdC9jaGF0LXdpbmRvdy1saXN0LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9jaGF0LXdpbmRvdy1saXN0L2NoYXQtd2luZG93LWxpc3QuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRixPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQzs7Ozs7O0FBb0JqRCxNQUFNLE9BQU8sdUJBQXVCO0lBS2hDLFlBQW1CLGVBQXFDO1FBQXJDLG9CQUFlLEdBQWYsZUFBZSxDQUFzQjtJQUN4RCxDQUFDOztvSEFOUSx1QkFBdUI7d0dBQXZCLHVCQUF1QixvR0NyQnBDLG9hQVlBLCtvQkRKZ0I7UUFDUixPQUFPLENBQUMsa0JBQWtCLEVBQUU7WUFDeEIsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUM7Z0JBQ2xCLEtBQUssRUFBRSxLQUFLO2FBQ2YsQ0FBQyxDQUFDO1lBQ0gsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUM7Z0JBQ2pCLEtBQUssRUFBRSxNQUFNO2FBQ2hCLENBQUMsQ0FBQztZQUNILFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDcEQsVUFBVSxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUN2RCxDQUFDO0tBQ0w7MkZBRVEsdUJBQXVCO2tCQWpCbkMsU0FBUzsrQkFDSSxzQkFBc0IsY0FHcEI7d0JBQ1IsT0FBTyxDQUFDLGtCQUFrQixFQUFFOzRCQUN4QixLQUFLLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQztnQ0FDbEIsS0FBSyxFQUFFLEtBQUs7NkJBQ2YsQ0FBQyxDQUFDOzRCQUNILEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDO2dDQUNqQixLQUFLLEVBQUUsTUFBTTs2QkFDaEIsQ0FBQyxDQUFDOzRCQUNILFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7NEJBQ3BELFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7eUJBQ3ZELENBQUM7cUJBQ0w7MkdBS0QsV0FBVztzQkFEVixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYW5pbWF0ZSwgc3RhdGUsIHN0eWxlLCB0cmFuc2l0aW9uLCB0cmlnZ2VyIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDaGF0TGlzdFN0YXRlU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NoYXQtbGlzdC1zdGF0ZS5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICduZ3gtY2hhdC13aW5kb3ctbGlzdCcsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2NoYXQtd2luZG93LWxpc3QuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogWycuL2NoYXQtd2luZG93LWxpc3QuY29tcG9uZW50Lmxlc3MnXSxcbiAgICBhbmltYXRpb25zOiBbXG4gICAgICAgIHRyaWdnZXIoJ3Jvc3RlclZpc2liaWxpdHknLCBbXG4gICAgICAgICAgICBzdGF0ZSgnaGlkZGVuJywgc3R5bGUoe1xuICAgICAgICAgICAgICAgIHJpZ2h0OiAnMWVtJyxcbiAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgIHN0YXRlKCdzaG93bicsIHN0eWxlKHtcbiAgICAgICAgICAgICAgICByaWdodDogJzE1ZW0nLFxuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgdHJhbnNpdGlvbignaGlkZGVuID0+IHNob3duJywgYW5pbWF0ZSgnNDAwbXMgZWFzZScpKSxcbiAgICAgICAgICAgIHRyYW5zaXRpb24oJ3Nob3duID0+IGhpZGRlbicsIGFuaW1hdGUoJzQwMG1zIGVhc2UnKSlcbiAgICAgICAgXSlcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIENoYXRXaW5kb3dMaXN0Q29tcG9uZW50IHtcblxuICAgIEBJbnB1dCgpXG4gICAgcm9zdGVyU3RhdGU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBjaGF0TGlzdFNlcnZpY2U6IENoYXRMaXN0U3RhdGVTZXJ2aWNlKSB7XG4gICAgfVxuXG59XG4iLCI8ZGl2IGNsYXNzPVwiY2hhdC1saXN0XCIgW0Byb3N0ZXJWaXNpYmlsaXR5XT1cInJvc3RlclN0YXRlXCI+XG5cbiAgICA8bmd4LWNoYXQtdmlkZW8td2luZG93XG4gICAgICAgICAgICAqbmdGb3I9XCJsZXQgdHJhY2sgb2YgKGNoYXRMaXN0U2VydmljZS5vcGVuVHJhY2tzJCB8IGFzeW5jKVwiXG4gICAgICAgICAgICBbdHJhY2tdPVwidHJhY2tcIj5cbiAgICA8L25neC1jaGF0LXZpZGVvLXdpbmRvdz5cblxuICAgIDxuZ3gtY2hhdC13aW5kb3dcbiAgICAgICAgICAgICpuZ0Zvcj1cImxldCBjaGF0V2luZG93U3RhdGUgb2YgKGNoYXRMaXN0U2VydmljZS5vcGVuQ2hhdHMkIHwgYXN5bmMpXCJcbiAgICAgICAgICAgIFtjaGF0V2luZG93U3RhdGVdPVwiY2hhdFdpbmRvd1N0YXRlXCI+PC9uZ3gtY2hhdC13aW5kb3c+XG5cbjwvZGl2PlxuIl19