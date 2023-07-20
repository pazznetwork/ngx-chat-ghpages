import { Component, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { CHAT_SERVICE_TOKEN } from '../../services/chat-service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@angular/cdk/text-field";
export class ChatMessageInputComponent {
    constructor(chatService) {
        this.chatService = chatService;
        this.messageSent = new EventEmitter();
        this.message = '';
    }
    ngOnInit() {
    }
    onSendMessage($event) {
        if ($event) {
            $event.preventDefault();
        }
        this.chatService.sendMessage(this.recipient, this.message);
        this.message = '';
        this.messageSent.emit();
    }
    focus() {
        this.chatInput.nativeElement.focus();
    }
}
ChatMessageInputComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: ChatMessageInputComponent, deps: [{ token: CHAT_SERVICE_TOKEN }], target: i0.ɵɵFactoryTarget.Component });
ChatMessageInputComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.9", type: ChatMessageInputComponent, selector: "ngx-chat-message-input", inputs: { recipient: "recipient" }, outputs: { messageSent: "messageSent" }, viewQueries: [{ propertyName: "chatInput", first: true, predicate: ["chatInput"], descendants: true }], ngImport: i0, template: "<textarea class=\"chat-input\"\n          #chatInput\n          [(ngModel)]=\"message\"\n          (keydown.enter)=\"onSendMessage($event)\"\n          cdkTextareaAutosize\n          cdkAutosizeMinRows=\"1\"\n          cdkAutosizeMaxRows=\"5\"\n          placeholder=\"{{chatService.translations.placeholder}}\"></textarea>\n", styles: ["@keyframes ngx-chat-message-in{0%{transform:translate(50px);opacity:0}to{transform:none;opacity:1}}@keyframes ngx-chat-message-out{0%{transform:translate(-50px);opacity:0}to{transform:none;opacity:1}}*{box-sizing:border-box;margin:0;padding:0;font-family:Helvetica,Arial,serif}.chat-input{border:none;width:100%;font-size:1em;padding:0;display:block;resize:none;overflow-x:hidden;outline:none}\n"], dependencies: [{ kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i2.CdkTextareaAutosize, selector: "textarea[cdkTextareaAutosize]", inputs: ["cdkAutosizeMinRows", "cdkAutosizeMaxRows", "cdkTextareaAutosize", "placeholder"], exportAs: ["cdkTextareaAutosize"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: ChatMessageInputComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-chat-message-input', template: "<textarea class=\"chat-input\"\n          #chatInput\n          [(ngModel)]=\"message\"\n          (keydown.enter)=\"onSendMessage($event)\"\n          cdkTextareaAutosize\n          cdkAutosizeMinRows=\"1\"\n          cdkAutosizeMaxRows=\"5\"\n          placeholder=\"{{chatService.translations.placeholder}}\"></textarea>\n", styles: ["@keyframes ngx-chat-message-in{0%{transform:translate(50px);opacity:0}to{transform:none;opacity:1}}@keyframes ngx-chat-message-out{0%{transform:translate(-50px);opacity:0}to{transform:none;opacity:1}}*{box-sizing:border-box;margin:0;padding:0;font-family:Helvetica,Arial,serif}.chat-input{border:none;width:100%;font-size:1em;padding:0;display:block;resize:none;overflow-x:hidden;outline:none}\n"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [CHAT_SERVICE_TOKEN]
                }] }]; }, propDecorators: { recipient: [{
                type: Input
            }], messageSent: [{
                type: Output
            }], chatInput: [{
                type: ViewChild,
                args: ['chatInput']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC1tZXNzYWdlLWlucHV0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9jaGF0LW1lc3NhZ2UtaW5wdXQvY2hhdC1tZXNzYWdlLWlucHV0LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9jaGF0LW1lc3NhZ2UtaW5wdXQvY2hhdC1tZXNzYWdlLWlucHV0LmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWMsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU5RyxPQUFPLEVBQUUsa0JBQWtCLEVBQWUsTUFBTSw2QkFBNkIsQ0FBQzs7OztBQU85RSxNQUFNLE9BQU8seUJBQXlCO0lBYWxDLFlBQStDLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBUGhFLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUV2QyxZQUFPLEdBQUcsRUFBRSxDQUFDO0lBTXBCLENBQUM7SUFFRCxRQUFRO0lBQ1IsQ0FBQztJQUVELGFBQWEsQ0FBQyxNQUFzQjtRQUNoQyxJQUFJLE1BQU0sRUFBRTtZQUNSLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUMzQjtRQUNELElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVELEtBQUs7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN6QyxDQUFDOztzSEE5QlEseUJBQXlCLGtCQWFkLGtCQUFrQjswR0FiN0IseUJBQXlCLG1QQ1R0Qyx1VUFRQTsyRkRDYSx5QkFBeUI7a0JBTHJDLFNBQVM7K0JBQ0ksd0JBQXdCOzswQkFpQnJCLE1BQU07MkJBQUMsa0JBQWtCOzRDQVYvQixTQUFTO3NCQURmLEtBQUs7Z0JBSUMsV0FBVztzQkFEakIsTUFBTTtnQkFNUCxTQUFTO3NCQURSLFNBQVM7dUJBQUMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIElucHV0LCBPbkluaXQsIE91dHB1dCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSZWNpcGllbnQgfSBmcm9tICcuLi8uLi9jb3JlL3JlY2lwaWVudCc7XG5pbXBvcnQgeyBDSEFUX1NFUlZJQ0VfVE9LRU4sIENoYXRTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2hhdC1zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICduZ3gtY2hhdC1tZXNzYWdlLWlucHV0JyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vY2hhdC1tZXNzYWdlLWlucHV0LmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi9jaGF0LW1lc3NhZ2UtaW5wdXQuY29tcG9uZW50Lmxlc3MnXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2hhdE1lc3NhZ2VJbnB1dENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyByZWNpcGllbnQ6IFJlY2lwaWVudDtcblxuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBtZXNzYWdlU2VudCA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAgIHB1YmxpYyBtZXNzYWdlID0gJyc7XG5cbiAgICBAVmlld0NoaWxkKCdjaGF0SW5wdXQnKVxuICAgIGNoYXRJbnB1dDogRWxlbWVudFJlZjtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoQ0hBVF9TRVJWSUNFX1RPS0VOKSBwdWJsaWMgY2hhdFNlcnZpY2U6IENoYXRTZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgfVxuXG4gICAgb25TZW5kTWVzc2FnZSgkZXZlbnQ/OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGlmICgkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hhdFNlcnZpY2Uuc2VuZE1lc3NhZ2UodGhpcy5yZWNpcGllbnQsIHRoaXMubWVzc2FnZSk7XG4gICAgICAgIHRoaXMubWVzc2FnZSA9ICcnO1xuICAgICAgICB0aGlzLm1lc3NhZ2VTZW50LmVtaXQoKTtcbiAgICB9XG5cbiAgICBmb2N1cygpIHtcbiAgICAgICAgdGhpcy5jaGF0SW5wdXQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgIH1cblxufVxuIiwiPHRleHRhcmVhIGNsYXNzPVwiY2hhdC1pbnB1dFwiXG4gICAgICAgICAgI2NoYXRJbnB1dFxuICAgICAgICAgIFsobmdNb2RlbCldPVwibWVzc2FnZVwiXG4gICAgICAgICAgKGtleWRvd24uZW50ZXIpPVwib25TZW5kTWVzc2FnZSgkZXZlbnQpXCJcbiAgICAgICAgICBjZGtUZXh0YXJlYUF1dG9zaXplXG4gICAgICAgICAgY2RrQXV0b3NpemVNaW5Sb3dzPVwiMVwiXG4gICAgICAgICAgY2RrQXV0b3NpemVNYXhSb3dzPVwiNVwiXG4gICAgICAgICAgcGxhY2Vob2xkZXI9XCJ7e2NoYXRTZXJ2aWNlLnRyYW5zbGF0aW9ucy5wbGFjZWhvbGRlcn19XCI+PC90ZXh0YXJlYT5cbiJdfQ==