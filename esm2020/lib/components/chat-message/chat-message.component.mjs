import { Component, Inject, Input, Optional } from '@angular/core';
import { Direction, MessageState } from '../../core/message';
import { extractUrls } from '../../core/utils-links';
import { MessageStatePlugin } from '../../services/adapters/xmpp/plugins/message-state.plugin';
import { XmppChatAdapter } from '../../services/adapters/xmpp/xmpp-chat-adapter.service';
import { CONTACT_CLICK_HANDLER_TOKEN } from '../../hooks/chat-contact-click-handler';
import { CHAT_SERVICE_TOKEN } from '../../services/chat-service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "../chat-message-simple/chat-message-simple.component";
import * as i3 from "../../directives/links.directive";
import * as i4 from "@angular/common";
export class ChatMessageComponent {
    constructor(chatService, httpClient, contactClickHandler) {
        this.chatService = chatService;
        this.httpClient = httpClient;
        this.contactClickHandler = contactClickHandler;
        this.showMessageReadState = true;
        this.showImagePlaceholder = true;
        this.isImage = false;
        this.isAudio = false;
        this.Direction = Direction;
        this.messageStatePlugin = this.chatService.getPlugin(MessageStatePlugin);
    }
    ngOnInit() {
        this.tryFindImageLink();
    }
    tryFindImageLink() {
        if (this.chatService instanceof XmppChatAdapter) {
            const candidateUrls = extractUrls(this.message.body);
            if (candidateUrls.length === 0) {
                this.showImagePlaceholder = false;
                return;
            }
            void this.tryFindEmbedImageUrls(candidateUrls);
        }
    }
    async tryFindEmbedImageUrls(candidateUrls) {
        for (const url of candidateUrls) {
            try {
                const headRequest = await this.httpClient.head(url, { observe: 'response' }).toPromise();
                const contentType = headRequest.headers.get('Content-Type');
                this.isImage = contentType && contentType.startsWith('image');
                this.isAudio = url.includes('mp3');
                if (this.isImage || this.isAudio) {
                    this.mediaLink = url;
                    break;
                }
            }
            catch (e) {
            }
        }
        this.showImagePlaceholder = this.isImage;
    }
    getMessageState() {
        if (this.showMessageReadState && this.message.state) {
            return this.message.state;
        }
        if (this.showMessageReadState && this.messageStatePlugin && this.contact) {
            const date = this.message.datetime;
            const states = this.messageStatePlugin.getContactMessageState(this.contact.jidBare.toString());
            return this.getStateForDate(date, states);
        }
        return undefined;
    }
    getStateForDate(date, states) {
        if (date <= states.lastRecipientSeen) {
            return MessageState.RECIPIENT_SEEN;
        }
        else if (date <= states.lastRecipientReceived) {
            return MessageState.RECIPIENT_RECEIVED;
        }
        else if (date <= states.lastSent) {
            return MessageState.SENT;
        }
        return undefined;
    }
    onContactClick() {
        if (this.contactClickHandler) {
            this.contactClickHandler.onClick(this.contact);
        }
    }
    getAvatar() {
        if (this.showAvatars) {
            if (this.message.direction === Direction.in) {
                return this.avatar;
            }
            else {
                return this.chatService.userAvatar$.getValue();
            }
        }
        return undefined;
    }
}
ChatMessageComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatMessageComponent, deps: [{ token: CHAT_SERVICE_TOKEN }, { token: i1.HttpClient }, { token: CONTACT_CLICK_HANDLER_TOKEN, optional: true }], target: i0.ɵɵFactoryTarget.Component });
ChatMessageComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.7", type: ChatMessageComponent, selector: "ngx-chat-message", inputs: { showAvatars: "showAvatars", avatar: "avatar", message: "message", nick: "nick", contact: "contact", showMessageReadState: "showMessageReadState" }, ngImport: i0, template: "<ngx-chat-message-simple [mediaLink]=\"mediaLink\"\n                         [isImage]=\"isImage\"\n                         [isAudio]=\"isAudio\"\n                         [avatar]=\"getAvatar()\"\n                         [avatarInteractive]=\"message.direction === Direction.in\"\n                         (avatarClickHandler)=\"onContactClick()\"\n                         [direction]=\"message.direction\"\n                         [messageState]=\"getMessageState()\"\n                         [formattedDate]=\"message.datetime | date:chatService.translations.timeFormat\"\n                         [nick]=\"nick\">\n    <span [ngxChatLinks]=\"message.body\"></span>\n</ngx-chat-message-simple>\n", styles: [":host.chat-message--out{align-self:flex-end}:host.chat-message--in{align-self:flex-start}\n"], dependencies: [{ kind: "component", type: i2.ChatMessageSimpleComponent, selector: "ngx-chat-message-simple", inputs: ["avatar", "avatarInteractive", "direction", "formattedDate", "footerHidden", "mediaLink", "isImage", "isAudio", "showImagePlaceholder", "messageState", "nick"], outputs: ["avatarClickHandler"] }, { kind: "directive", type: i3.LinksDirective, selector: "[ngxChatLinks]", inputs: ["ngxChatLinks"] }, { kind: "pipe", type: i4.DatePipe, name: "date" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatMessageComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-chat-message', template: "<ngx-chat-message-simple [mediaLink]=\"mediaLink\"\n                         [isImage]=\"isImage\"\n                         [isAudio]=\"isAudio\"\n                         [avatar]=\"getAvatar()\"\n                         [avatarInteractive]=\"message.direction === Direction.in\"\n                         (avatarClickHandler)=\"onContactClick()\"\n                         [direction]=\"message.direction\"\n                         [messageState]=\"getMessageState()\"\n                         [formattedDate]=\"message.datetime | date:chatService.translations.timeFormat\"\n                         [nick]=\"nick\">\n    <span [ngxChatLinks]=\"message.body\"></span>\n</ngx-chat-message-simple>\n", styles: [":host.chat-message--out{align-self:flex-end}:host.chat-message--in{align-self:flex-start}\n"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [CHAT_SERVICE_TOKEN]
                }] }, { type: i1.HttpClient }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [CONTACT_CLICK_HANDLER_TOKEN]
                }, {
                    type: Optional
                }] }]; }, propDecorators: { showAvatars: [{
                type: Input
            }], avatar: [{
                type: Input
            }], message: [{
                type: Input
            }], nick: [{
                type: Input
            }], contact: [{
                type: Input
            }], showMessageReadState: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC1tZXNzYWdlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9jaGF0LW1lc3NhZ2UvY2hhdC1tZXNzYWdlLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9jaGF0LW1lc3NhZ2UvY2hhdC1tZXNzYWdlLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBVSxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekUsT0FBTyxFQUFDLFNBQVMsRUFBVyxZQUFZLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNwRSxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGtCQUFrQixFQUFZLE1BQU0sMkRBQTJELENBQUM7QUFDeEcsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdEQUF3RCxDQUFDO0FBQ3ZGLE9BQU8sRUFBMEIsMkJBQTJCLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQztBQUM1RyxPQUFPLEVBQUMsa0JBQWtCLEVBQWMsTUFBTSw2QkFBNkIsQ0FBQzs7Ozs7O0FBTzVFLE1BQU0sT0FBTyxvQkFBb0I7SUFnQzdCLFlBQ3VDLFdBQXdCLEVBQ25ELFVBQXNCLEVBQzBCLG1CQUE0QztRQUZqRSxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUNuRCxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQzBCLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBeUI7UUFqQnhHLHlCQUFvQixHQUFHLElBQUksQ0FBQztRQUU1Qix5QkFBb0IsR0FBRyxJQUFJLENBQUM7UUFFNUIsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUVoQixZQUFPLEdBQUcsS0FBSyxDQUFDO1FBSWhCLGNBQVMsR0FBRyxTQUFTLENBQUM7UUFTbEIs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QUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNsRDtJQUNMLENBQUM7SUFFRCxTQUFTO1FBQ0wsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2xCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEtBQUssU0FBUyxDQUFDLEVBQUUsRUFBRTtnQkFDekMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO2FBQ3RCO2lCQUFNO2dCQUNILE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7YUFDbEQ7U0FDSjtRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7O2lIQWxIUSxvQkFBb0Isa0JBaUNqQixrQkFBa0IsdUNBRWxCLDJCQUEyQjtxR0FuQzlCLG9CQUFvQixzTkNmakMsaXNCQVlBOzJGREdhLG9CQUFvQjtrQkFMaEMsU0FBUzsrQkFDSSxrQkFBa0I7OzBCQXFDdkIsTUFBTTsyQkFBQyxrQkFBa0I7OzBCQUV6QixNQUFNOzJCQUFDLDJCQUEyQjs7MEJBQUcsUUFBUTs0Q0FoQ2xELFdBQVc7c0JBRFYsS0FBSztnQkFJTixNQUFNO3NCQURMLEtBQUs7Z0JBSU4sT0FBTztzQkFETixLQUFLO2dCQUlOLElBQUk7c0JBREgsS0FBSztnQkFJTixPQUFPO3NCQUROLEtBQUs7Z0JBSU4sb0JBQW9CO3NCQURuQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtIdHRwQ2xpZW50fSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge0NvbXBvbmVudCwgSW5qZWN0LCBJbnB1dCwgT25Jbml0LCBPcHRpb25hbH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRhY3R9IGZyb20gJy4uLy4uL2NvcmUvY29udGFjdCc7XG5pbXBvcnQge0RpcmVjdGlvbiwgTWVzc2FnZSwgTWVzc2FnZVN0YXRlfSBmcm9tICcuLi8uLi9jb3JlL21lc3NhZ2UnO1xuaW1wb3J0IHtleHRyYWN0VXJsc30gZnJvbSAnLi4vLi4vY29yZS91dGlscy1saW5rcyc7XG5pbXBvcnQge01lc3NhZ2VTdGF0ZVBsdWdpbiwgU3RhdGVEYXRlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9hZGFwdGVycy94bXBwL3BsdWdpbnMvbWVzc2FnZS1zdGF0ZS5wbHVnaW4nO1xuaW1wb3J0IHtYbXBwQ2hhdEFkYXB0ZXJ9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2FkYXB0ZXJzL3htcHAveG1wcC1jaGF0LWFkYXB0ZXIuc2VydmljZSc7XG5pbXBvcnQge0NoYXRDb250YWN0Q2xpY2tIYW5kbGVyLCBDT05UQUNUX0NMSUNLX0hBTkRMRVJfVE9LRU59IGZyb20gJy4uLy4uL2hvb2tzL2NoYXQtY29udGFjdC1jbGljay1oYW5kbGVyJztcbmltcG9ydCB7Q0hBVF9TRVJWSUNFX1RPS0VOLCBDaGF0U2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2hhdC1zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICduZ3gtY2hhdC1tZXNzYWdlJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vY2hhdC1tZXNzYWdlLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi9jaGF0LW1lc3NhZ2UuY29tcG9uZW50Lmxlc3MnXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2hhdE1lc3NhZ2VDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgQElucHV0KClcbiAgICBzaG93QXZhdGFyczogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpXG4gICAgYXZhdGFyPzogc3RyaW5nO1xuXG4gICAgQElucHV0KClcbiAgICBtZXNzYWdlOiBNZXNzYWdlO1xuXG4gICAgQElucHV0KClcbiAgICBuaWNrOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKVxuICAgIGNvbnRhY3Q6IENvbnRhY3Q7XG5cbiAgICBASW5wdXQoKVxuICAgIHNob3dNZXNzYWdlUmVhZFN0YXRlID0gdHJ1ZTtcblxuICAgIHNob3dJbWFnZVBsYWNlaG9sZGVyID0gdHJ1ZTtcblxuICAgIGlzSW1hZ2UgPSBmYWxzZTtcblxuICAgIGlzQXVkaW8gPSBmYWxzZTtcblxuICAgIG1lZGlhTGluazogc3RyaW5nO1xuXG4gICAgRGlyZWN0aW9uID0gRGlyZWN0aW9uO1xuXG4gICAgcHJpdmF0ZSByZWFkb25seSBtZXNzYWdlU3RhdGVQbHVnaW46IE1lc3NhZ2VTdGF0ZVBsdWdpbjtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBASW5qZWN0KENIQVRfU0VSVklDRV9UT0tFTikgcHVibGljIGNoYXRTZXJ2aWNlOiBDaGF0U2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSBodHRwQ2xpZW50OiBIdHRwQ2xpZW50LFxuICAgICAgICBASW5qZWN0KENPTlRBQ1RfQ0xJQ0tfSEFORExFUl9UT0tFTikgQE9wdGlvbmFsKCkgcHVibGljIGNvbnRhY3RDbGlja0hhbmRsZXI6IENoYXRDb250YWN0Q2xpY2tIYW5kbGVyLFxuICAgICkge1xuICAgICAgICB0aGlzLm1lc3NhZ2VTdGF0ZVBsdWdpbiA9IHRoaXMuY2hhdFNlcnZpY2UuZ2V0UGx1Z2luKE1lc3NhZ2VTdGF0ZVBsdWdpbik7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMudHJ5RmluZEltYWdlTGluaygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdHJ5RmluZEltYWdlTGluaygpIHtcbiAgICAgICAgaWYgKHRoaXMuY2hhdFNlcnZpY2UgaW5zdGFuY2VvZiBYbXBwQ2hhdEFkYXB0ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbmRpZGF0ZVVybHMgPSBleHRyYWN0VXJscyh0aGlzLm1lc3NhZ2UuYm9keSk7XG5cbiAgICAgICAgICAgIGlmIChjYW5kaWRhdGVVcmxzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0ltYWdlUGxhY2Vob2xkZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZvaWQgdGhpcy50cnlGaW5kRW1iZWRJbWFnZVVybHMoY2FuZGlkYXRlVXJscyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIHRyeUZpbmRFbWJlZEltYWdlVXJscyhjYW5kaWRhdGVVcmxzOiBSZWdFeHBNYXRjaEFycmF5KSB7XG4gICAgICAgIGZvciAoY29uc3QgdXJsIG9mIGNhbmRpZGF0ZVVybHMpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGVhZFJlcXVlc3QgPSBhd2FpdCB0aGlzLmh0dHBDbGllbnQuaGVhZCh1cmwsIHtvYnNlcnZlOiAncmVzcG9uc2UnfSkudG9Qcm9taXNlKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgY29udGVudFR5cGUgPSBoZWFkUmVxdWVzdC5oZWFkZXJzLmdldCgnQ29udGVudC1UeXBlJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0ltYWdlID0gY29udGVudFR5cGUgJiYgY29udGVudFR5cGUuc3RhcnRzV2l0aCgnaW1hZ2UnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmlzQXVkaW8gPSB1cmwuaW5jbHVkZXMoJ21wMycpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzSW1hZ2UgfHwgdGhpcy5pc0F1ZGlvKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWVkaWFMaW5rID0gdXJsO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNob3dJbWFnZVBsYWNlaG9sZGVyID0gdGhpcy5pc0ltYWdlO1xuICAgIH1cblxuICAgIGdldE1lc3NhZ2VTdGF0ZSgpOiBNZXNzYWdlU3RhdGUgfCB1bmRlZmluZWQge1xuICAgICAgICBpZiAodGhpcy5zaG93TWVzc2FnZVJlYWRTdGF0ZSAmJiB0aGlzLm1lc3NhZ2Uuc3RhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1lc3NhZ2Uuc3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zaG93TWVzc2FnZVJlYWRTdGF0ZSAmJiB0aGlzLm1lc3NhZ2VTdGF0ZVBsdWdpbiAmJiB0aGlzLmNvbnRhY3QpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGUgPSB0aGlzLm1lc3NhZ2UuZGF0ZXRpbWU7XG4gICAgICAgICAgICBjb25zdCBzdGF0ZXMgPSB0aGlzLm1lc3NhZ2VTdGF0ZVBsdWdpbi5nZXRDb250YWN0TWVzc2FnZVN0YXRlKHRoaXMuY29udGFjdC5qaWRCYXJlLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGVGb3JEYXRlKGRhdGUsIHN0YXRlcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFN0YXRlRm9yRGF0ZShkYXRlOiBEYXRlLCBzdGF0ZXM6IFN0YXRlRGF0ZSk6IE1lc3NhZ2VTdGF0ZSB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGlmIChkYXRlIDw9IHN0YXRlcy5sYXN0UmVjaXBpZW50U2Vlbikge1xuICAgICAgICAgICAgcmV0dXJuIE1lc3NhZ2VTdGF0ZS5SRUNJUElFTlRfU0VFTjtcbiAgICAgICAgfSBlbHNlIGlmIChkYXRlIDw9IHN0YXRlcy5sYXN0UmVjaXBpZW50UmVjZWl2ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBNZXNzYWdlU3RhdGUuUkVDSVBJRU5UX1JFQ0VJVkVEO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGUgPD0gc3RhdGVzLmxhc3RTZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gTWVzc2FnZVN0YXRlLlNFTlQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBvbkNvbnRhY3RDbGljaygpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGFjdENsaWNrSGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5jb250YWN0Q2xpY2tIYW5kbGVyLm9uQ2xpY2sodGhpcy5jb250YWN0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEF2YXRhcigpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgICBpZiAodGhpcy5zaG93QXZhdGFycykge1xuICAgICAgICAgICAgaWYgKHRoaXMubWVzc2FnZS5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5pbikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmF2YXRhcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hhdFNlcnZpY2UudXNlckF2YXRhciQuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbn1cbiIsIjxuZ3gtY2hhdC1tZXNzYWdlLXNpbXBsZSBbbWVkaWFMaW5rXT1cIm1lZGlhTGlua1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgW2lzSW1hZ2VdPVwiaXNJbWFnZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgW2lzQXVkaW9dPVwiaXNBdWRpb1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgW2F2YXRhcl09XCJnZXRBdmF0YXIoKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgW2F2YXRhckludGVyYWN0aXZlXT1cIm1lc3NhZ2UuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uaW5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgIChhdmF0YXJDbGlja0hhbmRsZXIpPVwib25Db250YWN0Q2xpY2soKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgW2RpcmVjdGlvbl09XCJtZXNzYWdlLmRpcmVjdGlvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgW21lc3NhZ2VTdGF0ZV09XCJnZXRNZXNzYWdlU3RhdGUoKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgW2Zvcm1hdHRlZERhdGVdPVwibWVzc2FnZS5kYXRldGltZSB8IGRhdGU6Y2hhdFNlcnZpY2UudHJhbnNsYXRpb25zLnRpbWVGb3JtYXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgIFtuaWNrXT1cIm5pY2tcIj5cbiAgICA8c3BhbiBbbmd4Q2hhdExpbmtzXT1cIm1lc3NhZ2UuYm9keVwiPjwvc3Bhbj5cbjwvbmd4LWNoYXQtbWVzc2FnZS1zaW1wbGU+XG4iXX0=