import { Component, Inject, Input } from '@angular/core';
import { defaultTranslations } from '../core/translations-default';
import { CHAT_SERVICE_TOKEN } from '../services/chat-service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "./chat-window-list/chat-window-list.component";
import * as i3 from "./roster-list/roster-list.component";
/**
 * The main UI component. Should be instantiated near the root of your application.
 *
 * ```html
 * <!-- plain usage, no configuration -->
 * <ngx-chat></ngx-chat>
 *
 * <!-- if supplied, translations contain an object with the structure of the Translations interface. -->
 * <ngx-chat translations="{'contacts': 'Kontakte', ...}"></ngx-chat>
 *
 * <!-- if supplied, the contacts input attribute takes an Observable<Contact[]> as source for your roster list -->
 * <ngx-chat contacts="..."></ngx-chat>
 *
 * <!-- if supplied, userAvatar$ contains an Obervable<string>, which is used as the src attribute of the img for the current user. -->
 * <ngx-chat userAvatar$="Observable.of('http://...')"></ngx-chat>
 * ```
 */
export class ChatComponent {
    constructor(chatService) {
        this.chatService = chatService;
        this.showChatComponent = false;
    }
    /**
     * If supplied, translations contain an object with the structure of the Translations interface.
     */
    set translations(translations) {
        const defaultTranslation = defaultTranslations();
        if (translations) {
            this.chatService.translations = {
                ...defaultTranslation,
                ...translations,
                presence: {
                    ...defaultTranslation.presence,
                    ...translations.presence,
                },
            };
        }
    }
    ngOnInit() {
        this.chatService.state$.subscribe($e => this.onChatStateChange($e));
        this.onRosterStateChanged(this.rosterState);
        if (this.userAvatar$) {
            this.userAvatar$.subscribe(avatar => this.chatService.userAvatar$.next(avatar));
        }
    }
    ngOnChanges(changes) {
        if (changes.rosterState) {
            this.onRosterStateChanged(changes.rosterState.currentValue);
        }
    }
    onChatStateChange(state) {
        this.showChatComponent = state === 'online';
        this.updateBodyClass();
    }
    onRosterStateChanged(state) {
        this.rosterState = state;
        this.updateBodyClass();
    }
    updateBodyClass() {
        const rosterClass = 'has-roster';
        if (this.showChatComponent && this.rosterState !== 'hidden') {
            document.body.classList.add(rosterClass);
        }
        else {
            document.body.classList.remove(rosterClass);
        }
    }
}
ChatComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatComponent, deps: [{ token: CHAT_SERVICE_TOKEN }], target: i0.ɵɵFactoryTarget.Component });
ChatComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.7", type: ChatComponent, selector: "ngx-chat", inputs: { translations: "translations", contacts: "contacts", contactRequestsReceived$: "contactRequestsReceived$", contactRequestsSent$: "contactRequestsSent$", contactsUnaffiliated$: "contactsUnaffiliated$", userAvatar$: "userAvatar$", rosterState: "rosterState" }, usesOnChanges: true, ngImport: i0, template: "<ngx-chat-window-list *ngIf=\"showChatComponent\"\n                      [rosterState]=\"rosterState\">\n</ngx-chat-window-list>\n<ngx-chat-roster-list [rosterState]=\"rosterState\"\n                      [contacts]=\"contacts\"\n                      [contactRequestsReceived$]=\"contactRequestsReceived$\"\n                      [contactRequestsSent$]=\"contactRequestsSent$\"\n                      [contactsUnaffiliated$]=\"contactsUnaffiliated$\"\n                      *ngIf=\"showChatComponent\"\n                      (rosterStateChanged)=\"onRosterStateChanged($event)\">\n</ngx-chat-roster-list>\n", styles: [""], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i2.ChatWindowListComponent, selector: "ngx-chat-window-list", inputs: ["rosterState"] }, { kind: "component", type: i3.RosterListComponent, selector: "ngx-chat-roster-list", inputs: ["rosterState", "contacts", "contactRequestsReceived$", "contactRequestsSent$", "contactsUnaffiliated$"], outputs: ["rosterStateChanged"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-chat', template: "<ngx-chat-window-list *ngIf=\"showChatComponent\"\n                      [rosterState]=\"rosterState\">\n</ngx-chat-window-list>\n<ngx-chat-roster-list [rosterState]=\"rosterState\"\n                      [contacts]=\"contacts\"\n                      [contactRequestsReceived$]=\"contactRequestsReceived$\"\n                      [contactRequestsSent$]=\"contactRequestsSent$\"\n                      [contactsUnaffiliated$]=\"contactsUnaffiliated$\"\n                      *ngIf=\"showChatComponent\"\n                      (rosterStateChanged)=\"onRosterStateChanged($event)\">\n</ngx-chat-roster-list>\n" }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [CHAT_SERVICE_TOKEN]
                }] }]; }, propDecorators: { translations: [{
                type: Input
            }], contacts: [{
                type: Input
            }], contactRequestsReceived$: [{
                type: Input
            }], contactRequestsSent$: [{
                type: Input
            }], contactsUnaffiliated$: [{
                type: Input
            }], userAvatar$: [{
                type: Input
            }], rosterState: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL2NvbXBvbmVudHMvY2hhdC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL2NvbXBvbmVudHMvY2hhdC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQW9DLE1BQU0sZUFBZSxDQUFDO0FBSTNGLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ25FLE9BQU8sRUFBRSxrQkFBa0IsRUFBZSxNQUFNLDBCQUEwQixDQUFDOzs7OztBQUUzRTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQU1ILE1BQU0sT0FBTyxhQUFhO0lBNkR0QixZQUN3QyxXQUF3QjtRQUF4QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUhoRSxzQkFBaUIsR0FBRyxLQUFLLENBQUM7SUFLMUIsQ0FBQztJQTlERDs7T0FFRztJQUNILElBQ1csWUFBWSxDQUFDLFlBQW1DO1FBQ3ZELE1BQU0sa0JBQWtCLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQztRQUNqRCxJQUFJLFlBQVksRUFBRTtZQUNkLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxHQUFHO2dCQUM1QixHQUFHLGtCQUFrQjtnQkFDckIsR0FBRyxZQUFZO2dCQUNmLFFBQVEsRUFBRTtvQkFDTixHQUFHLGtCQUFrQixDQUFDLFFBQVE7b0JBQzlCLEdBQUcsWUFBWSxDQUFDLFFBQVE7aUJBQzNCO2FBQ0osQ0FBQztTQUNMO0lBQ0wsQ0FBQztJQWdERCxRQUFRO1FBQ0osSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUU1QyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDbEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUNuRjtJQUNMLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDOUIsSUFBSSxPQUFPLENBQUMsV0FBVyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQy9EO0lBQ0wsQ0FBQztJQUVPLGlCQUFpQixDQUFDLEtBQWE7UUFDbkMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssS0FBSyxRQUFRLENBQUM7UUFDNUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxvQkFBb0IsQ0FBQyxLQUF5QjtRQUMxQyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVPLGVBQWU7UUFDbkIsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDO1FBQ2pDLElBQUksSUFBSSxDQUFDLGlCQUFpQixJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssUUFBUSxFQUFFO1lBQ3pELFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUM1QzthQUFNO1lBQ0gsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQy9DO0lBQ0wsQ0FBQzs7MEdBbEdRLGFBQWEsa0JBOERWLGtCQUFrQjs4RkE5RHJCLGFBQWEsaVZDN0IxQixpbUJBV0E7MkZEa0JhLGFBQWE7a0JBTHpCLFNBQVM7K0JBQ0ksVUFBVTs7MEJBa0VmLE1BQU07MkJBQUMsa0JBQWtCOzRDQXhEbkIsWUFBWTtzQkFEdEIsS0FBSztnQkFtQkMsUUFBUTtzQkFEZCxLQUFLO2dCQVFOLHdCQUF3QjtzQkFEdkIsS0FBSztnQkFRTixvQkFBb0I7c0JBRG5CLEtBQUs7Z0JBUU4scUJBQXFCO3NCQURwQixLQUFLO2dCQU9DLFdBQVc7c0JBRGpCLEtBQUs7Z0JBT04sV0FBVztzQkFEVixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3QsIElucHV0LCBPbkNoYW5nZXMsIE9uSW5pdCwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ29udGFjdCB9IGZyb20gJy4uL2NvcmUvY29udGFjdCc7XG5pbXBvcnQgeyBUcmFuc2xhdGlvbnMgfSBmcm9tICcuLi9jb3JlL3RyYW5zbGF0aW9ucyc7XG5pbXBvcnQgeyBkZWZhdWx0VHJhbnNsYXRpb25zIH0gZnJvbSAnLi4vY29yZS90cmFuc2xhdGlvbnMtZGVmYXVsdCc7XG5pbXBvcnQgeyBDSEFUX1NFUlZJQ0VfVE9LRU4sIENoYXRTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvY2hhdC1zZXJ2aWNlJztcblxuLyoqXG4gKiBUaGUgbWFpbiBVSSBjb21wb25lbnQuIFNob3VsZCBiZSBpbnN0YW50aWF0ZWQgbmVhciB0aGUgcm9vdCBvZiB5b3VyIGFwcGxpY2F0aW9uLlxuICpcbiAqIGBgYGh0bWxcbiAqIDwhLS0gcGxhaW4gdXNhZ2UsIG5vIGNvbmZpZ3VyYXRpb24gLS0+XG4gKiA8bmd4LWNoYXQ+PC9uZ3gtY2hhdD5cbiAqXG4gKiA8IS0tIGlmIHN1cHBsaWVkLCB0cmFuc2xhdGlvbnMgY29udGFpbiBhbiBvYmplY3Qgd2l0aCB0aGUgc3RydWN0dXJlIG9mIHRoZSBUcmFuc2xhdGlvbnMgaW50ZXJmYWNlLiAtLT5cbiAqIDxuZ3gtY2hhdCB0cmFuc2xhdGlvbnM9XCJ7J2NvbnRhY3RzJzogJ0tvbnRha3RlJywgLi4ufVwiPjwvbmd4LWNoYXQ+XG4gKlxuICogPCEtLSBpZiBzdXBwbGllZCwgdGhlIGNvbnRhY3RzIGlucHV0IGF0dHJpYnV0ZSB0YWtlcyBhbiBPYnNlcnZhYmxlPENvbnRhY3RbXT4gYXMgc291cmNlIGZvciB5b3VyIHJvc3RlciBsaXN0IC0tPlxuICogPG5neC1jaGF0IGNvbnRhY3RzPVwiLi4uXCI+PC9uZ3gtY2hhdD5cbiAqXG4gKiA8IS0tIGlmIHN1cHBsaWVkLCB1c2VyQXZhdGFyJCBjb250YWlucyBhbiBPYmVydmFibGU8c3RyaW5nPiwgd2hpY2ggaXMgdXNlZCBhcyB0aGUgc3JjIGF0dHJpYnV0ZSBvZiB0aGUgaW1nIGZvciB0aGUgY3VycmVudCB1c2VyLiAtLT5cbiAqIDxuZ3gtY2hhdCB1c2VyQXZhdGFyJD1cIk9ic2VydmFibGUub2YoJ2h0dHA6Ly8uLi4nKVwiPjwvbmd4LWNoYXQ+XG4gKiBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICduZ3gtY2hhdCcsXG4gICAgdGVtcGxhdGVVcmw6ICcuL2NoYXQuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogWycuL2NoYXQuY29tcG9uZW50Lmxlc3MnXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2hhdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcblxuICAgIC8qKlxuICAgICAqIElmIHN1cHBsaWVkLCB0cmFuc2xhdGlvbnMgY29udGFpbiBhbiBvYmplY3Qgd2l0aCB0aGUgc3RydWN0dXJlIG9mIHRoZSBUcmFuc2xhdGlvbnMgaW50ZXJmYWNlLlxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCB0cmFuc2xhdGlvbnModHJhbnNsYXRpb25zOiBQYXJ0aWFsPFRyYW5zbGF0aW9ucz4pIHtcbiAgICAgICAgY29uc3QgZGVmYXVsdFRyYW5zbGF0aW9uID0gZGVmYXVsdFRyYW5zbGF0aW9ucygpO1xuICAgICAgICBpZiAodHJhbnNsYXRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLmNoYXRTZXJ2aWNlLnRyYW5zbGF0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAuLi5kZWZhdWx0VHJhbnNsYXRpb24sXG4gICAgICAgICAgICAgICAgLi4udHJhbnNsYXRpb25zLFxuICAgICAgICAgICAgICAgIHByZXNlbmNlOiB7XG4gICAgICAgICAgICAgICAgICAgIC4uLmRlZmF1bHRUcmFuc2xhdGlvbi5wcmVzZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgLi4udHJhbnNsYXRpb25zLnByZXNlbmNlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgc3VwcGxpZWQsIHRoZSBjb250YWN0cyBpbnB1dCBhdHRyaWJ1dGUgdGFrZXMgYW4gW09ic2VydmFibGU8Q29udGFjdFtdPl17QGxpbmsgQ29udGFjdH0gYXMgc291cmNlIGZvciB5b3VyIHJvc3RlciBsaXN0LlxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGNvbnRhY3RzPzogT2JzZXJ2YWJsZTxDb250YWN0W10+O1xuXG4gICAgLyoqXG4gICAgICogSWYgc3VwcGxpZWQsIHRoZSBjb250YWN0cyBpbnB1dCBhdHRyaWJ1dGUgdGFrZXMgYW4gW09ic2VydmFibGU8Q29udGFjdFtdPl17QGxpbmsgQ29udGFjdH0gYXMgc291cmNlIGZvciB5b3VyIGluY29taW5nIGNvbnRhY3RcbiAgICAgKiByZXF1ZXN0cyBsaXN0LlxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgY29udGFjdFJlcXVlc3RzUmVjZWl2ZWQkPzogT2JzZXJ2YWJsZTxDb250YWN0W10+O1xuXG4gICAgLyoqXG4gICAgICogSWYgc3VwcGxpZWQsIHRoZSBjb250YWN0cyBpbnB1dCBhdHRyaWJ1dGUgdGFrZXMgYW4gW09ic2VydmFibGU8Q29udGFjdFtdPl17QGxpbmsgQ29udGFjdH0gYXMgc291cmNlIGZvciB5b3VyIG91dGdvaW5nIGNvbnRhY3RcbiAgICAgKiByZXF1ZXN0cyBsaXN0LlxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgY29udGFjdFJlcXVlc3RzU2VudCQ/OiBPYnNlcnZhYmxlPENvbnRhY3RbXT47XG5cbiAgICAvKipcbiAgICAgKiBJZiBzdXBwbGllZCwgdGhlIGNvbnRhY3RzIGlucHV0IGF0dHJpYnV0ZSB0YWtlcyBhbiBbT2JzZXJ2YWJsZTxDb250YWN0W10+XXtAbGluayBDb250YWN0fSBhcyBzb3VyY2UgZm9yIHlvdXIgdW5hZmZpbGlhdGVkIGNvbnRhY3RcbiAgICAgKiBsaXN0LlxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgY29udGFjdHNVbmFmZmlsaWF0ZWQkPzogT2JzZXJ2YWJsZTxDb250YWN0W10+O1xuXG4gICAgLyoqXG4gICAgICogSWYgc3VwcGxpZWQsIHVzZXJBdmF0YXIkIGNvbnRhaW5zIGFuIE9ic2VydmFibGU8c3RyaW5nPiwgd2hpY2ggaXMgdXNlZCBhcyB0aGUgc3JjIGF0dHJpYnV0ZSBvZiB0aGUgaW1nIGZvciB0aGUgY3VycmVudCB1c2VyLlxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHVzZXJBdmF0YXIkPzogT2JzZXJ2YWJsZTxzdHJpbmc+O1xuXG4gICAgLyoqXG4gICAgICogJ3Nob3duJyBzaG93cyByb3N0ZXIgbGlzdCwgJ2hpZGRlbicgaGlkZXMgaXQuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICByb3N0ZXJTdGF0ZTogJ3Nob3duJyB8ICdoaWRkZW4nO1xuXG4gICAgc2hvd0NoYXRDb21wb25lbnQgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBASW5qZWN0KENIQVRfU0VSVklDRV9UT0tFTikgcHJpdmF0ZSBjaGF0U2VydmljZTogQ2hhdFNlcnZpY2UsXG4gICAgKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuY2hhdFNlcnZpY2Uuc3RhdGUkLnN1YnNjcmliZSgkZSA9PiB0aGlzLm9uQ2hhdFN0YXRlQ2hhbmdlKCRlKSk7XG4gICAgICAgIHRoaXMub25Sb3N0ZXJTdGF0ZUNoYW5nZWQodGhpcy5yb3N0ZXJTdGF0ZSk7XG5cbiAgICAgICAgaWYgKHRoaXMudXNlckF2YXRhciQpIHtcbiAgICAgICAgICAgIHRoaXMudXNlckF2YXRhciQuc3Vic2NyaWJlKGF2YXRhciA9PiB0aGlzLmNoYXRTZXJ2aWNlLnVzZXJBdmF0YXIkLm5leHQoYXZhdGFyKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgICAgIGlmIChjaGFuZ2VzLnJvc3RlclN0YXRlKSB7XG4gICAgICAgICAgICB0aGlzLm9uUm9zdGVyU3RhdGVDaGFuZ2VkKGNoYW5nZXMucm9zdGVyU3RhdGUuY3VycmVudFZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgb25DaGF0U3RhdGVDaGFuZ2Uoc3RhdGU6IHN0cmluZykge1xuICAgICAgICB0aGlzLnNob3dDaGF0Q29tcG9uZW50ID0gc3RhdGUgPT09ICdvbmxpbmUnO1xuICAgICAgICB0aGlzLnVwZGF0ZUJvZHlDbGFzcygpO1xuICAgIH1cblxuICAgIG9uUm9zdGVyU3RhdGVDaGFuZ2VkKHN0YXRlOiAnc2hvd24nIHwgJ2hpZGRlbicpIHtcbiAgICAgICAgdGhpcy5yb3N0ZXJTdGF0ZSA9IHN0YXRlO1xuICAgICAgICB0aGlzLnVwZGF0ZUJvZHlDbGFzcygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlQm9keUNsYXNzKCkge1xuICAgICAgICBjb25zdCByb3N0ZXJDbGFzcyA9ICdoYXMtcm9zdGVyJztcbiAgICAgICAgaWYgKHRoaXMuc2hvd0NoYXRDb21wb25lbnQgJiYgdGhpcy5yb3N0ZXJTdGF0ZSAhPT0gJ2hpZGRlbicpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChyb3N0ZXJDbGFzcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUocm9zdGVyQ2xhc3MpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iLCI8bmd4LWNoYXQtd2luZG93LWxpc3QgKm5nSWY9XCJzaG93Q2hhdENvbXBvbmVudFwiXG4gICAgICAgICAgICAgICAgICAgICAgW3Jvc3RlclN0YXRlXT1cInJvc3RlclN0YXRlXCI+XG48L25neC1jaGF0LXdpbmRvdy1saXN0PlxuPG5neC1jaGF0LXJvc3Rlci1saXN0IFtyb3N0ZXJTdGF0ZV09XCJyb3N0ZXJTdGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgW2NvbnRhY3RzXT1cImNvbnRhY3RzXCJcbiAgICAgICAgICAgICAgICAgICAgICBbY29udGFjdFJlcXVlc3RzUmVjZWl2ZWQkXT1cImNvbnRhY3RSZXF1ZXN0c1JlY2VpdmVkJFwiXG4gICAgICAgICAgICAgICAgICAgICAgW2NvbnRhY3RSZXF1ZXN0c1NlbnQkXT1cImNvbnRhY3RSZXF1ZXN0c1NlbnQkXCJcbiAgICAgICAgICAgICAgICAgICAgICBbY29udGFjdHNVbmFmZmlsaWF0ZWQkXT1cImNvbnRhY3RzVW5hZmZpbGlhdGVkJFwiXG4gICAgICAgICAgICAgICAgICAgICAgKm5nSWY9XCJzaG93Q2hhdENvbXBvbmVudFwiXG4gICAgICAgICAgICAgICAgICAgICAgKHJvc3RlclN0YXRlQ2hhbmdlZCk9XCJvblJvc3RlclN0YXRlQ2hhbmdlZCgkZXZlbnQpXCI+XG48L25neC1jaGF0LXJvc3Rlci1saXN0PlxuIl19