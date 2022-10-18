import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule, NgZone } from '@angular/core';
import { ChatAvatarComponent } from './components/chat-avatar/chat-avatar.component';
import { FileDropComponent } from './components/chat-filedrop/file-drop.component';
import { ChatMessageInputComponent } from './components/chat-message-input/chat-message-input.component';
import { ChatMessageLinkComponent } from './components/chat-message-link/chat-message-link.component';
import { ChatMessageListComponent } from './components/chat-message-list/chat-message-list.component';
import { ChatMessageSimpleComponent } from './components/chat-message-simple/chat-message-simple.component';
import { ChatMessageTextComponent } from './components/chat-message-text/chat-message-text.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { ChatVideoWindowComponent } from './components/chat-video-window/chat-video-window.component';
import { ChatWindowFrameComponent } from './components/chat-window-frame/chat-window-frame.component';
import { ChatWindowListComponent } from './components/chat-window-list/chat-window-list.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { ChatComponent } from './components/chat.component';
import { RosterListComponent } from './components/roster-list/roster-list.component';
import { RosterRecipientComponent } from './components/roster-recipient/roster-recipient.component';
import { IntersectionObserverDirective } from './directives/intersection-observer.directive';
import { LinksDirective } from './directives/links.directive';
import { BlockPlugin } from './services/adapters/xmpp/plugins/block.plugin';
import { BookmarkPlugin } from './services/adapters/xmpp/plugins/bookmark.plugin';
import { EntityTimePlugin } from './services/adapters/xmpp/plugins/entity-time.plugin';
import { HttpFileUploadPlugin } from './services/adapters/xmpp/plugins/http-file-upload.plugin';
import { MessageArchivePlugin } from './services/adapters/xmpp/plugins/message-archive.plugin';
import { MessageCarbonsPlugin } from './services/adapters/xmpp/plugins/message-carbons.plugin';
import { MessageStatePlugin } from './services/adapters/xmpp/plugins/message-state.plugin';
import { MessageUuidPlugin } from './services/adapters/xmpp/plugins/message-uuid.plugin';
import { MessagePlugin } from './services/adapters/xmpp/plugins/message.plugin';
import { MucSubPlugin } from './services/adapters/xmpp/plugins/muc-sub.plugin';
import { MultiUserChatPlugin } from './services/adapters/xmpp/plugins/multi-user-chat/multi-user-chat.plugin';
import { PingPlugin } from './services/adapters/xmpp/plugins/ping.plugin';
import { PublishSubscribePlugin } from './services/adapters/xmpp/plugins/publish-subscribe.plugin';
import { PushPlugin } from './services/adapters/xmpp/plugins/push.plugin';
import { RegistrationPlugin } from './services/adapters/xmpp/plugins/registration.plugin';
import { RosterPlugin } from './services/adapters/xmpp/plugins/roster.plugin';
import { ServiceDiscoveryPlugin } from './services/adapters/xmpp/plugins/service-discovery.plugin';
import { UnreadMessageCountPlugin } from './services/adapters/xmpp/plugins/unread-message-count.plugin';
import { XmppChatAdapter } from './services/adapters/xmpp/xmpp-chat-adapter.service';
import { XmppChatConnectionService } from './services/adapters/xmpp/xmpp-chat-connection.service';
import { XmppClientFactoryService } from './services/adapters/xmpp/xmpp-client-factory.service';
import { ChatBackgroundNotificationService } from './services/chat-background-notification.service';
import { ChatListStateService } from './services/chat-list-state.service';
import { ChatMessageListRegistryService } from './services/chat-message-list-registry.service';
import { CHAT_SERVICE_TOKEN } from './services/chat-service';
import { ContactFactoryService } from './services/contact-factory.service';
import { LogService } from './services/log.service';
import { FILE_UPLOAD_HANDLER_TOKEN } from './hooks/file-upload-handler';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import * as i0 from "@angular/core";
export class NgxChatModule {
    static forRoot() {
        return {
            ngModule: NgxChatModule,
            providers: [
                ChatBackgroundNotificationService,
                ChatListStateService,
                ChatMessageListRegistryService,
                ContactFactoryService,
                LogService,
                XmppChatConnectionService,
                XmppClientFactoryService,
                {
                    provide: CHAT_SERVICE_TOKEN,
                    deps: [
                        XmppChatConnectionService,
                        ChatMessageListRegistryService,
                        ContactFactoryService,
                        HttpClient,
                        LogService,
                        NgZone,
                    ],
                    useFactory: NgxChatModule.xmppChatAdapter,
                },
                {
                    provide: FILE_UPLOAD_HANDLER_TOKEN,
                    deps: [CHAT_SERVICE_TOKEN],
                    useFactory: NgxChatModule.fileUploadHandlerFactory,
                },
            ],
        };
    }
    static fileUploadHandlerFactory(chatService) {
        return chatService.getPlugin(HttpFileUploadPlugin);
    }
    static xmppChatAdapter(chatConnectionService, chatMessageListRegistryService, contactFactory, httpClient, logService, ngZone) {
        const xmppChatAdapter = new XmppChatAdapter(chatConnectionService, logService, contactFactory);
        const serviceDiscoveryPlugin = new ServiceDiscoveryPlugin(xmppChatAdapter);
        const publishSubscribePlugin = new PublishSubscribePlugin(xmppChatAdapter, serviceDiscoveryPlugin);
        const entityTimePlugin = new EntityTimePlugin(xmppChatAdapter, serviceDiscoveryPlugin, logService);
        const multiUserChatPlugin = new MultiUserChatPlugin(xmppChatAdapter, logService, serviceDiscoveryPlugin);
        const unreadMessageCountPlugin = new UnreadMessageCountPlugin(xmppChatAdapter, chatMessageListRegistryService, publishSubscribePlugin, entityTimePlugin, multiUserChatPlugin);
        const messagePlugin = new MessagePlugin(xmppChatAdapter, logService);
        xmppChatAdapter.addPlugins([
            new BookmarkPlugin(publishSubscribePlugin),
            new MessageArchivePlugin(xmppChatAdapter, serviceDiscoveryPlugin, multiUserChatPlugin, logService, messagePlugin),
            messagePlugin,
            new MessageUuidPlugin(),
            multiUserChatPlugin,
            publishSubscribePlugin,
            new RosterPlugin(xmppChatAdapter, logService),
            serviceDiscoveryPlugin,
            new PushPlugin(xmppChatAdapter, serviceDiscoveryPlugin),
            new PingPlugin(xmppChatAdapter, logService, ngZone),
            new RegistrationPlugin(logService, ngZone),
            new MessageCarbonsPlugin(xmppChatAdapter),
            unreadMessageCountPlugin,
            new HttpFileUploadPlugin(httpClient, serviceDiscoveryPlugin, xmppChatAdapter, logService),
            new MessageStatePlugin(publishSubscribePlugin, xmppChatAdapter, chatMessageListRegistryService, logService, entityTimePlugin),
            new MucSubPlugin(xmppChatAdapter, serviceDiscoveryPlugin),
            new BlockPlugin(xmppChatAdapter, serviceDiscoveryPlugin),
            entityTimePlugin,
        ]);
        return xmppChatAdapter;
    }
}
NgxChatModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.6", ngImport: i0, type: NgxChatModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgxChatModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.6", ngImport: i0, type: NgxChatModule, declarations: [ChatComponent,
        ChatMessageComponent,
        ChatMessageInputComponent,
        ChatMessageLinkComponent,
        ChatMessageListComponent,
        ChatMessageSimpleComponent,
        ChatMessageTextComponent,
        ChatWindowComponent,
        ChatWindowListComponent,
        LinksDirective,
        IntersectionObserverDirective,
        RosterListComponent,
        FileDropComponent,
        ChatWindowFrameComponent,
        ChatVideoWindowComponent,
        ChatAvatarComponent,
        RosterRecipientComponent], imports: [CommonModule,
        HttpClientModule,
        FormsModule,
        TextFieldModule,
        RouterModule], exports: [ChatComponent,
        ChatMessageInputComponent,
        ChatMessageListComponent,
        ChatMessageSimpleComponent,
        FileDropComponent,
        LinksDirective] });
NgxChatModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.6", ngImport: i0, type: NgxChatModule, imports: [CommonModule,
        HttpClientModule,
        FormsModule,
        TextFieldModule,
        RouterModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.6", ngImport: i0, type: NgxChatModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        HttpClientModule,
                        FormsModule,
                        TextFieldModule,
                        RouterModule,
                    ],
                    declarations: [
                        ChatComponent,
                        ChatMessageComponent,
                        ChatMessageInputComponent,
                        ChatMessageLinkComponent,
                        ChatMessageListComponent,
                        ChatMessageSimpleComponent,
                        ChatMessageTextComponent,
                        ChatWindowComponent,
                        ChatWindowListComponent,
                        LinksDirective,
                        IntersectionObserverDirective,
                        RosterListComponent,
                        FileDropComponent,
                        ChatWindowFrameComponent,
                        ChatVideoWindowComponent,
                        ChatAvatarComponent,
                        RosterRecipientComponent,
                    ],
                    exports: [
                        ChatComponent,
                        ChatMessageInputComponent,
                        ChatMessageListComponent,
                        ChatMessageSimpleComponent,
                        FileDropComponent,
                        LinksDirective,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWNoYXQubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9uZ3gtY2hhdC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzFELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDcEUsT0FBTyxFQUF1QixRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBQ25GLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLDhEQUE4RCxDQUFDO0FBQ3pHLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQ3RHLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQ3RHLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLGdFQUFnRSxDQUFDO0FBQzVHLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQ3RHLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGtEQUFrRCxDQUFDO0FBQ3hGLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQ3RHLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQ3RHLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDBEQUEwRCxDQUFDO0FBQ25HLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw2QkFB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aUI7UUFDakIsd0JBQXdCO1FBQ3hCLHdCQUF3QjtRQUN4QixtQkFBbUI7UUFDbkIsd0JBQXdCLGFBdkJ4QixZQUFZO1FBQ1osZ0JBQWdCO1FBQ2hCLFdBQVc7UUFDWCxlQUFlO1FBQ2YsWUFBWSxhQXNCWixhQUFhO1FBQ2IseUJBQXlCO1FBQ3pCLHdCQUF3QjtRQUN4QiwwQkFBMEI7UUFDMUIsaUJBQWlCO1FBQ2pCLGNBQWM7MkdBR1QsYUFBYSxZQWxDbEIsWUFBWTtRQUNaLGdCQUFnQjtRQUNoQixXQUFXO1FBQ1gsZUFBZTtRQUNmLFlBQVk7MkZBOEJQLGFBQWE7a0JBcEN6QixRQUFRO21CQUFDO29CQUNOLE9BQU8sRUFBRTt3QkFDTCxZQUFZO3dCQUNaLGdCQUFnQjt3QkFDaEIsV0FBVzt3QkFDWCxlQUFlO3dCQUNmLFlBQVk7cUJBQ2Y7b0JBQ0QsWUFBWSxFQUFFO3dCQUNWLGFBQWE7d0JBQ2Isb0JBQW9CO3dCQUNwQix5QkFBeUI7d0JBQ3pCLHdCQUF3Qjt3QkFDeEIsd0JBQXdCO3dCQUN4QiwwQkFBMEI7d0JBQzFCLHdCQUF3Qjt3QkFDeEIsbUJBQW1CO3dCQUNuQix1QkFBdUI7d0JBQ3ZCLGNBQWM7d0JBQ2QsNkJBQTZCO3dCQUM3QixtQkFBbUI7d0JBQ25CLGlCQUFpQjt3QkFDakIsd0JBQXdCO3dCQUN4Qix3QkFBd0I7d0JBQ3hCLG1CQUFtQjt3QkFDbkIsd0JBQXdCO3FCQUMzQjtvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsYUFBYTt3QkFDYix5QkFBeUI7d0JBQ3pCLHdCQUF3Qjt3QkFDeEIsMEJBQTBCO3dCQUMxQixpQkFBaUI7d0JBQ2pCLGNBQWM7cUJBQ2pCO2lCQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGV4dEZpZWxkTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RleHQtZmllbGQnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBDbGllbnRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSwgTmdab25lIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDaGF0QXZhdGFyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2NoYXQtYXZhdGFyL2NoYXQtYXZhdGFyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBGaWxlRHJvcENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9jaGF0LWZpbGVkcm9wL2ZpbGUtZHJvcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ2hhdE1lc3NhZ2VJbnB1dENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9jaGF0LW1lc3NhZ2UtaW5wdXQvY2hhdC1tZXNzYWdlLWlucHV0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDaGF0TWVzc2FnZUxpbmtDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY2hhdC1tZXNzYWdlLWxpbmsvY2hhdC1tZXNzYWdlLWxpbmsuY29tcG9uZW50JztcbmltcG9ydCB7IENoYXRNZXNzYWdlTGlzdENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9jaGF0LW1lc3NhZ2UtbGlzdC9jaGF0LW1lc3NhZ2UtbGlzdC5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ2hhdE1lc3NhZ2VTaW1wbGVDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY2hhdC1tZXNzYWdlLXNpbXBsZS9jaGF0LW1lc3NhZ2Utc2ltcGxlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDaGF0TWVzc2FnZVRleHRDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY2hhdC1tZXNzYWdlLXRleHQvY2hhdC1tZXNzYWdlLXRleHQuY29tcG9uZW50JztcbmltcG9ydCB7IENoYXRNZXNzYWdlQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2NoYXQtbWVzc2FnZS9jaGF0LW1lc3NhZ2UuY29tcG9uZW50JztcbmltcG9ydCB7IENoYXRWaWRlb1dpbmRvd0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9jaGF0LXZpZGVvLXdpbmRvdy9jaGF0LXZpZGVvLXdpbmRvdy5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ2hhdFdpbmRvd0ZyYW1lQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2NoYXQtd2luZG93LWZyYW1lL2NoYXQtd2luZG93LWZyYW1lLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDaGF0V2luZG93TGlzdENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9jaGF0LXdpbmRvdy1saXN0L2NoYXQtd2luZG93LWxpc3QuY29tcG9uZW50JztcbmltcG9ydCB7IENoYXRXaW5kb3dDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY2hhdC13aW5kb3cvY2hhdC13aW5kb3cuY29tcG9uZW50JztcbmltcG9ydCB7IENoYXRDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY2hhdC5jb21wb25lbnQnO1xuaW1wb3J0IHsgUm9zdGVyTGlzdENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9yb3N0ZXItbGlzdC9yb3N0ZXItbGlzdC5jb21wb25lbnQnO1xuaW1wb3J0IHsgUm9zdGVyUmVjaXBpZW50Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3Jvc3Rlci1yZWNpcGllbnQvcm9zdGVyLXJlY2lwaWVudC5jb21wb25lbnQnO1xuaW1wb3J0IHsgSW50ZXJzZWN0aW9uT2JzZXJ2ZXJEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvaW50ZXJzZWN0aW9uLW9ic2VydmVyLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBMaW5rc0RpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9saW5rcy5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQmxvY2tQbHVnaW4gfSBmcm9tICcuL3NlcnZpY2VzL2FkYXB0ZXJzL3htcHAvcGx1Z2lucy9ibG9jay5wbHVnaW4nO1xuaW1wb3J0IHsgQm9va21hcmtQbHVnaW4gfSBmcm9tICcuL3NlcnZpY2VzL2FkYXB0ZXJzL3htcHAvcGx1Z2lucy9ib29rbWFyay5wbHVnaW4nO1xuaW1wb3J0IHsgRW50aXR5VGltZVBsdWdpbiB9IGZyb20gJy4vc2VydmljZXMvYWRhcHRlcnMveG1wcC9wbHVnaW5zL2VudGl0eS10aW1lLnBsdWdpbic7XG5pbXBvcnQgeyBIdHRwRmlsZVVwbG9hZFBsdWdpbiB9IGZyb20gJy4vc2VydmljZXMvYWRhcHRlcnMveG1wcC9wbHVnaW5zL2h0dHAtZmlsZS11cGxvYWQucGx1Z2luJztcbmltcG9ydCB7IE1lc3NhZ2VBcmNoaXZlUGx1Z2luIH0gZnJvbSAnLi9zZXJ2aWNlcy9hZGFwdGVycy94bXBwL3BsdWdpbnMvbWVzc2FnZS1hcmNoaXZlLnBsdWdpbic7XG5pbXBvcnQgeyBNZXNzYWdlQ2FyYm9uc1BsdWdpbiB9IGZyb20gJy4vc2VydmljZXMvYWRhcHRlcnMveG1wcC9wbHVnaW5zL21lc3NhZ2UtY2FyYm9ucy5wbHVnaW4nO1xuaW1wb3J0IHsgTWVzc2FnZVN0YXRlUGx1Z2luIH0gZnJvbSAnLi9zZXJ2aWNlcy9hZGFwdGVycy94bXBwL3BsdWdpbnMvbWVzc2FnZS1zdGF0ZS5wbHVnaW4nO1xuaW1wb3J0IHsgTWVzc2FnZVV1aWRQbHVnaW4gfSBmcm9tICcuL3NlcnZpY2VzL2FkYXB0ZXJzL3htcHAvcGx1Z2lucy9tZXNzYWdlLXV1aWQucGx1Z2luJztcbmltcG9ydCB7IE1lc3NhZ2VQbHVnaW4gfSBmcm9tICcuL3NlcnZpY2VzL2FkYXB0ZXJzL3htcHAvcGx1Z2lucy9tZXNzYWdlLnBsdWdpbic7XG5pbXBvcnQgeyBNdWNTdWJQbHVnaW4gfSBmcm9tICcuL3NlcnZpY2VzL2FkYXB0ZXJzL3htcHAvcGx1Z2lucy9tdWMtc3ViLnBsdWdpbic7XG5pbXBvcnQgeyBNdWx0aVVzZXJDaGF0UGx1Z2luIH0gZnJvbSAnLi9zZXJ2aWNlcy9hZGFwdGVycy94bXBwL3BsdWdpbnMvbXVsdGktdXNlci1jaGF0L211bHRpLXVzZXItY2hhdC5wbHVnaW4nO1xuaW1wb3J0IHsgUGluZ1BsdWdpbiB9IGZyb20gJy4vc2VydmljZXMvYWRhcHRlcnMveG1wcC9wbHVnaW5zL3BpbmcucGx1Z2luJztcbmltcG9ydCB7IFB1Ymxpc2hTdWJzY3JpYmVQbHVnaW4gfSBmcm9tICcuL3NlcnZpY2VzL2FkYXB0ZXJzL3htcHAvcGx1Z2lucy9wdWJsaXNoLXN1YnNjcmliZS5wbHVnaW4nO1xuaW1wb3J0IHsgUHVzaFBsdWdpbiB9IGZyb20gJy4vc2VydmljZXMvYWRhcHRlcnMveG1wcC9wbHVnaW5zL3B1c2gucGx1Z2luJztcbmltcG9ydCB7IFJlZ2lzdHJhdGlvblBsdWdpbiB9IGZyb20gJy4vc2VydmljZXMvYWRhcHRlcnMveG1wcC9wbHVnaW5zL3JlZ2lzdHJhdGlvbi5wbHVnaW4nO1xuaW1wb3J0IHsgUm9zdGVyUGx1Z2luIH0gZnJvbSAnLi9zZXJ2aWNlcy9hZGFwdGVycy94bXBwL3BsdWdpbnMvcm9zdGVyLnBsdWdpbic7XG5pbXBvcnQgeyBTZXJ2aWNlRGlzY292ZXJ5UGx1Z2luIH0gZnJvbSAnLi9zZXJ2aWNlcy9hZGFwdGVycy94bXBwL3BsdWdpbnMvc2VydmljZS1kaXNjb3ZlcnkucGx1Z2luJztcbmltcG9ydCB7IFVucmVhZE1lc3NhZ2VDb3VudFBsdWdpbiB9IGZyb20gJy4vc2VydmljZXMvYWRhcHRlcnMveG1wcC9wbHVnaW5zL3VucmVhZC1tZXNzYWdlLWNvdW50LnBsdWdpbic7XG5pbXBvcnQgeyBYbXBwQ2hhdEFkYXB0ZXIgfSBmcm9tICcuL3NlcnZpY2VzL2FkYXB0ZXJzL3htcHAveG1wcC1jaGF0LWFkYXB0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBYbXBwQ2hhdENvbm5lY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9hZGFwdGVycy94bXBwL3htcHAtY2hhdC1jb25uZWN0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgWG1wcENsaWVudEZhY3RvcnlTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9hZGFwdGVycy94bXBwL3htcHAtY2xpZW50LWZhY3Rvcnkuc2VydmljZSc7XG5pbXBvcnQgeyBDaGF0QmFja2dyb3VuZE5vdGlmaWNhdGlvblNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL2NoYXQtYmFja2dyb3VuZC1ub3RpZmljYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBDaGF0TGlzdFN0YXRlU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvY2hhdC1saXN0LXN0YXRlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2hhdE1lc3NhZ2VMaXN0UmVnaXN0cnlTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9jaGF0LW1lc3NhZ2UtbGlzdC1yZWdpc3RyeS5zZXJ2aWNlJztcbmltcG9ydCB7IENIQVRfU0VSVklDRV9UT0tFTiwgQ2hhdFNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL2NoYXQtc2VydmljZSc7XG5pbXBvcnQgeyBDb250YWN0RmFjdG9yeVNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL2NvbnRhY3QtZmFjdG9yeS5zZXJ2aWNlJztcbmltcG9ydCB7IExvZ1NlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL2xvZy5zZXJ2aWNlJztcbmltcG9ydCB7IEZJTEVfVVBMT0FEX0hBTkRMRVJfVE9LRU4gfSBmcm9tICcuL2hvb2tzL2ZpbGUtdXBsb2FkLWhhbmRsZXInO1xuaW1wb3J0IHtGb3Jtc01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtSb3V0ZXJNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW1xuICAgICAgICBDb21tb25Nb2R1bGUsXG4gICAgICAgIEh0dHBDbGllbnRNb2R1bGUsXG4gICAgICAgIEZvcm1zTW9kdWxlLFxuICAgICAgICBUZXh0RmllbGRNb2R1bGUsXG4gICAgICAgIFJvdXRlck1vZHVsZSxcbiAgICBdLFxuICAgIGRlY2xhcmF0aW9uczogW1xuICAgICAgICBDaGF0Q29tcG9uZW50LFxuICAgICAgICBDaGF0TWVzc2FnZUNvbXBvbmVudCxcbiAgICAgICAgQ2hhdE1lc3NhZ2VJbnB1dENvbXBvbmVudCxcbiAgICAgICAgQ2hhdE1lc3NhZ2VMaW5rQ29tcG9uZW50LFxuICAgICAgICBDaGF0TWVzc2FnZUxpc3RDb21wb25lbnQsXG4gICAgICAgIENoYXRNZXNzYWdlU2ltcGxlQ29tcG9uZW50LFxuICAgICAgICBDaGF0TWVzc2FnZVRleHRDb21wb25lbnQsXG4gICAgICAgIENoYXRXaW5kb3dDb21wb25lbnQsXG4gICAgICAgIENoYXRXaW5kb3dMaXN0Q29tcG9uZW50LFxuICAgICAgICBMaW5rc0RpcmVjdGl2ZSxcbiAgICAgICAgSW50ZXJzZWN0aW9uT2JzZXJ2ZXJEaXJlY3RpdmUsXG4gICAgICAgIFJvc3Rlckxpc3RDb21wb25lbnQsXG4gICAgICAgIEZpbGVEcm9wQ29tcG9uZW50LFxuICAgICAgICBDaGF0V2luZG93RnJhbWVDb21wb25lbnQsXG4gICAgICAgIENoYXRWaWRlb1dpbmRvd0NvbXBvbmVudCxcbiAgICAgICAgQ2hhdEF2YXRhckNvbXBvbmVudCxcbiAgICAgICAgUm9zdGVyUmVjaXBpZW50Q29tcG9uZW50LFxuICAgIF0sXG4gICAgZXhwb3J0czogW1xuICAgICAgICBDaGF0Q29tcG9uZW50LFxuICAgICAgICBDaGF0TWVzc2FnZUlucHV0Q29tcG9uZW50LFxuICAgICAgICBDaGF0TWVzc2FnZUxpc3RDb21wb25lbnQsXG4gICAgICAgIENoYXRNZXNzYWdlU2ltcGxlQ29tcG9uZW50LFxuICAgICAgICBGaWxlRHJvcENvbXBvbmVudCxcbiAgICAgICAgTGlua3NEaXJlY3RpdmUsXG4gICAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTmd4Q2hhdE1vZHVsZSB7XG5cbiAgICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzPE5neENoYXRNb2R1bGU+IHtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmdNb2R1bGU6IE5neENoYXRNb2R1bGUsXG4gICAgICAgICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgICAgICAgICBDaGF0QmFja2dyb3VuZE5vdGlmaWNhdGlvblNlcnZpY2UsXG4gICAgICAgICAgICAgICAgQ2hhdExpc3RTdGF0ZVNlcnZpY2UsXG4gICAgICAgICAgICAgICAgQ2hhdE1lc3NhZ2VMaXN0UmVnaXN0cnlTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIENvbnRhY3RGYWN0b3J5U2VydmljZSxcbiAgICAgICAgICAgICAgICBMb2dTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIFhtcHBDaGF0Q29ubmVjdGlvblNlcnZpY2UsXG4gICAgICAgICAgICAgICAgWG1wcENsaWVudEZhY3RvcnlTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZTogQ0hBVF9TRVJWSUNFX1RPS0VOLFxuICAgICAgICAgICAgICAgICAgICBkZXBzOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICBYbXBwQ2hhdENvbm5lY3Rpb25TZXJ2aWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgQ2hhdE1lc3NhZ2VMaXN0UmVnaXN0cnlTZXJ2aWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgQ29udGFjdEZhY3RvcnlTZXJ2aWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgSHR0cENsaWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIExvZ1NlcnZpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBOZ1pvbmUsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIHVzZUZhY3Rvcnk6IE5neENoYXRNb2R1bGUueG1wcENoYXRBZGFwdGVyLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwcm92aWRlOiBGSUxFX1VQTE9BRF9IQU5ETEVSX1RPS0VOLFxuICAgICAgICAgICAgICAgICAgICBkZXBzOiBbQ0hBVF9TRVJWSUNFX1RPS0VOXSxcbiAgICAgICAgICAgICAgICAgICAgdXNlRmFjdG9yeTogTmd4Q2hhdE1vZHVsZS5maWxlVXBsb2FkSGFuZGxlckZhY3RvcnksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH07XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBmaWxlVXBsb2FkSGFuZGxlckZhY3RvcnkoY2hhdFNlcnZpY2U6IENoYXRTZXJ2aWNlKSB7XG4gICAgICAgIHJldHVybiBjaGF0U2VydmljZS5nZXRQbHVnaW4oSHR0cEZpbGVVcGxvYWRQbHVnaW4pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIHhtcHBDaGF0QWRhcHRlcihcbiAgICAgICAgY2hhdENvbm5lY3Rpb25TZXJ2aWNlOiBYbXBwQ2hhdENvbm5lY3Rpb25TZXJ2aWNlLFxuICAgICAgICBjaGF0TWVzc2FnZUxpc3RSZWdpc3RyeVNlcnZpY2U6IENoYXRNZXNzYWdlTGlzdFJlZ2lzdHJ5U2VydmljZSxcbiAgICAgICAgY29udGFjdEZhY3Rvcnk6IENvbnRhY3RGYWN0b3J5U2VydmljZSxcbiAgICAgICAgaHR0cENsaWVudDogSHR0cENsaWVudCxcbiAgICAgICAgbG9nU2VydmljZTogTG9nU2VydmljZSxcbiAgICAgICAgbmdab25lOiBOZ1pvbmUsXG4gICAgKTogWG1wcENoYXRBZGFwdGVyIHtcbiAgICAgICAgY29uc3QgeG1wcENoYXRBZGFwdGVyID0gbmV3IFhtcHBDaGF0QWRhcHRlcihjaGF0Q29ubmVjdGlvblNlcnZpY2UsIGxvZ1NlcnZpY2UsIGNvbnRhY3RGYWN0b3J5KTtcblxuICAgICAgICBjb25zdCBzZXJ2aWNlRGlzY292ZXJ5UGx1Z2luID0gbmV3IFNlcnZpY2VEaXNjb3ZlcnlQbHVnaW4oeG1wcENoYXRBZGFwdGVyKTtcbiAgICAgICAgY29uc3QgcHVibGlzaFN1YnNjcmliZVBsdWdpbiA9IG5ldyBQdWJsaXNoU3Vic2NyaWJlUGx1Z2luKHhtcHBDaGF0QWRhcHRlciwgc2VydmljZURpc2NvdmVyeVBsdWdpbik7XG4gICAgICAgIGNvbnN0IGVudGl0eVRpbWVQbHVnaW4gPSBuZXcgRW50aXR5VGltZVBsdWdpbih4bXBwQ2hhdEFkYXB0ZXIsIHNlcnZpY2VEaXNjb3ZlcnlQbHVnaW4sIGxvZ1NlcnZpY2UpO1xuICAgICAgICBjb25zdCBtdWx0aVVzZXJDaGF0UGx1Z2luID0gbmV3IE11bHRpVXNlckNoYXRQbHVnaW4oeG1wcENoYXRBZGFwdGVyLCBsb2dTZXJ2aWNlLCBzZXJ2aWNlRGlzY292ZXJ5UGx1Z2luKTtcbiAgICAgICAgY29uc3QgdW5yZWFkTWVzc2FnZUNvdW50UGx1Z2luID0gbmV3IFVucmVhZE1lc3NhZ2VDb3VudFBsdWdpbihcbiAgICAgICAgICAgIHhtcHBDaGF0QWRhcHRlciwgY2hhdE1lc3NhZ2VMaXN0UmVnaXN0cnlTZXJ2aWNlLCBwdWJsaXNoU3Vic2NyaWJlUGx1Z2luLCBlbnRpdHlUaW1lUGx1Z2luLCBtdWx0aVVzZXJDaGF0UGx1Z2luKTtcbiAgICAgICAgY29uc3QgbWVzc2FnZVBsdWdpbiA9IG5ldyBNZXNzYWdlUGx1Z2luKHhtcHBDaGF0QWRhcHRlciwgbG9nU2VydmljZSk7XG5cbiAgICAgICAgeG1wcENoYXRBZGFwdGVyLmFkZFBsdWdpbnMoW1xuICAgICAgICAgICAgbmV3IEJvb2ttYXJrUGx1Z2luKHB1Ymxpc2hTdWJzY3JpYmVQbHVnaW4pLFxuICAgICAgICAgICAgbmV3IE1lc3NhZ2VBcmNoaXZlUGx1Z2luKHhtcHBDaGF0QWRhcHRlciwgc2VydmljZURpc2NvdmVyeVBsdWdpbiwgbXVsdGlVc2VyQ2hhdFBsdWdpbiwgbG9nU2VydmljZSwgbWVzc2FnZVBsdWdpbiksXG4gICAgICAgICAgICBtZXNzYWdlUGx1Z2luLFxuICAgICAgICAgICAgbmV3IE1lc3NhZ2VVdWlkUGx1Z2luKCksXG4gICAgICAgICAgICBtdWx0aVVzZXJDaGF0UGx1Z2luLFxuICAgICAgICAgICAgcHVibGlzaFN1YnNjcmliZVBsdWdpbixcbiAgICAgICAgICAgIG5ldyBSb3N0ZXJQbHVnaW4oeG1wcENoYXRBZGFwdGVyLCBsb2dTZXJ2aWNlKSxcbiAgICAgICAgICAgIHNlcnZpY2VEaXNjb3ZlcnlQbHVnaW4sXG4gICAgICAgICAgICBuZXcgUHVzaFBsdWdpbih4bXBwQ2hhdEFkYXB0ZXIsIHNlcnZpY2VEaXNjb3ZlcnlQbHVnaW4pLFxuICAgICAgICAgICAgbmV3IFBpbmdQbHVnaW4oeG1wcENoYXRBZGFwdGVyLCBsb2dTZXJ2aWNlLCBuZ1pvbmUpLFxuICAgICAgICAgICAgbmV3IFJlZ2lzdHJhdGlvblBsdWdpbihsb2dTZXJ2aWNlLCBuZ1pvbmUpLFxuICAgICAgICAgICAgbmV3IE1lc3NhZ2VDYXJib25zUGx1Z2luKHhtcHBDaGF0QWRhcHRlciksXG4gICAgICAgICAgICB1bnJlYWRNZXNzYWdlQ291bnRQbHVnaW4sXG4gICAgICAgICAgICBuZXcgSHR0cEZpbGVVcGxvYWRQbHVnaW4oaHR0cENsaWVudCwgc2VydmljZURpc2NvdmVyeVBsdWdpbiwgeG1wcENoYXRBZGFwdGVyLCBsb2dTZXJ2aWNlKSxcbiAgICAgICAgICAgIG5ldyBNZXNzYWdlU3RhdGVQbHVnaW4ocHVibGlzaFN1YnNjcmliZVBsdWdpbiwgeG1wcENoYXRBZGFwdGVyLCBjaGF0TWVzc2FnZUxpc3RSZWdpc3RyeVNlcnZpY2UsIGxvZ1NlcnZpY2UsXG4gICAgICAgICAgICAgICAgZW50aXR5VGltZVBsdWdpbiksXG4gICAgICAgICAgICBuZXcgTXVjU3ViUGx1Z2luKHhtcHBDaGF0QWRhcHRlciwgc2VydmljZURpc2NvdmVyeVBsdWdpbiksXG4gICAgICAgICAgICBuZXcgQmxvY2tQbHVnaW4oeG1wcENoYXRBZGFwdGVyLCBzZXJ2aWNlRGlzY292ZXJ5UGx1Z2luKSxcbiAgICAgICAgICAgIGVudGl0eVRpbWVQbHVnaW4sXG4gICAgICAgIF0pO1xuXG4gICAgICAgIHJldHVybiB4bXBwQ2hhdEFkYXB0ZXI7XG4gICAgfVxuXG59XG4iXX0=