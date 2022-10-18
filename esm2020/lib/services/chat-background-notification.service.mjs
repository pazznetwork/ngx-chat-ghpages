import { Inject, Injectable } from '@angular/core';
import { MultiUserChatPlugin } from './adapters/xmpp/plugins/multi-user-chat/multi-user-chat.plugin';
import { CHAT_SERVICE_TOKEN } from './chat-service';
import * as i0 from "@angular/core";
export class ChatBackgroundNotificationService {
    constructor(chatService) {
        this.chatService = chatService;
        this.enabled = false;
        chatService.message$.subscribe((msg) => {
            this.receivedDirectMessage(msg);
        });
        chatService.getPlugin(MultiUserChatPlugin).message$.subscribe(async (room) => {
            await this.receivedGroupMessage(room);
        });
    }
    enable() {
        if (this.supportsNotification()) {
            this.requestNotificationPermission();
            this.enabled = true;
        }
    }
    disable() {
        this.enabled = false;
    }
    requestNotificationPermission() {
        const notification = Notification;
        notification.requestPermission();
    }
    receivedDirectMessage(contact) {
        if (this.shouldDisplayNotification()) {
            const notification = new Notification(contact.name, { body: contact.mostRecentMessage.body, icon: contact.avatar });
            notification.addEventListener('click', () => {
                window.focus();
                notification.close();
            });
        }
    }
    async receivedGroupMessage(room) {
        if (this.shouldDisplayNotification()) {
            const message = room.mostRecentMessage.body;
            const sender = room.mostRecentMessage.from;
            const options = await this.customizeGroupMessage(sender, message);
            const notification = new Notification(room.name, options);
            notification.addEventListener('click', () => {
                window.focus();
                notification.close();
            });
        }
    }
    async customizeGroupMessage(sender, message) {
        return { body: `${sender}: ${message}` };
    }
    shouldDisplayNotification() {
        const notification = Notification;
        return this.enabled
            && document.visibilityState === 'hidden'
            && this.supportsNotification()
            && notification.permission === 'granted';
    }
    supportsNotification() {
        return 'Notification' in window;
    }
}
ChatBackgroundNotificationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.6", ngImport: i0, type: ChatBackgroundNotificationService, deps: [{ token: CHAT_SERVICE_TOKEN }], target: i0.ɵɵFactoryTarget.Injectable });
ChatBackgroundNotificationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.6", ngImport: i0, type: ChatBackgroundNotificationService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.6", ngImport: i0, type: ChatBackgroundNotificationService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [CHAT_SERVICE_TOKEN]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC1iYWNrZ3JvdW5kLW5vdGlmaWNhdGlvbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9zZXJ2aWNlcy9jaGF0LWJhY2tncm91bmQtbm90aWZpY2F0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHbkQsT0FBTyxFQUFFLG1CQUFtQixFQUFDLE1BQU0sZ0VBQWdFLENBQUM7QUFDcEcsT0FBTyxFQUFFLGtCQUFrQixFQUFlLE1BQU0sZ0JBQWdCLENBQUM7O0FBSWpFLE1BQU0sT0FBTyxpQ0FBaUM7SUFJMUMsWUFBa0QsV0FBd0I7UUFBeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFGbEUsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUdwQixXQUFXLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ25DLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUMsQ0FBQztRQUNILFdBQVcsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsRUFBRTtZQUN2RSxNQUFNLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxNQUFNO1FBQ0YsSUFBSSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsRUFBRTtZQUM3QixJQUFJLENBQUMsNkJBQTZCLEVBQUUsQ0FBQztZQUNyQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztTQUN2QjtJQUNMLENBQUM7SUFFRCxPQUFPO1FBQ0gsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDekIsQ0FBQztJQUVPLDZCQUE2QjtRQUNqQyxNQUFNLFlBQVksR0FBRyxZQUFtQixDQUFDO1FBQ3pDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFTyxxQkFBcUIsQ0FBQyxPQUFnQjtRQUMxQyxJQUFJLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxFQUFFO1lBQ2xDLE1BQU0sWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUM7WUFDbEgsWUFBWSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7Z0JBQ3hDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDZixZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDekIsQ0FBQyxDQUFDLENBQUM7U0FDTjtJQUNMLENBQUM7SUFFTyxLQUFLLENBQUMsb0JBQW9CLENBQUMsSUFBVTtRQUN6QyxJQUFJLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxFQUFFO1lBQ2xDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUM7WUFDNUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQztZQUMzQyxNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDbEUsTUFBTSxZQUFZLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMxRCxZQUFZLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtnQkFDeEMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNmLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUN6QixDQUFDLENBQUMsQ0FBQztTQUNOO0lBQ0wsQ0FBQztJQUVTLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxNQUFXLEVBQUUsT0FBZTtRQUM5RCxPQUFPLEVBQUMsSUFBSSxFQUFFLEdBQUcsTUFBTSxLQUFLLE9BQU8sRUFBRSxFQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVPLHlCQUF5QjtRQUM3QixNQUFNLFlBQVksR0FBRyxZQUFtQixDQUFDO1FBQ3pDLE9BQU8sSUFBSSxDQUFDLE9BQU87ZUFDWixRQUFRLENBQUMsZUFBZSxLQUFLLFFBQVE7ZUFDckMsSUFBSSxDQUFDLG9CQUFvQixFQUFFO2VBQzNCLFlBQVksQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDO0lBQ2pELENBQUM7SUFFTyxvQkFBb0I7UUFDeEIsT0FBTyxjQUFjLElBQUksTUFBTSxDQUFDO0lBQ3BDLENBQUM7OzhIQWxFUSxpQ0FBaUMsa0JBSXRCLGtCQUFrQjtrSUFKN0IsaUNBQWlDOzJGQUFqQyxpQ0FBaUM7a0JBRDdDLFVBQVU7OzBCQUtNLE1BQU07MkJBQUMsa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBKSUQgfSBmcm9tICdAeG1wcC9qaWQnO1xuaW1wb3J0IHsgQ29udGFjdCB9IGZyb20gJy4uL2NvcmUvY29udGFjdCc7XG5pbXBvcnQgeyBNdWx0aVVzZXJDaGF0UGx1Z2lufSBmcm9tICcuL2FkYXB0ZXJzL3htcHAvcGx1Z2lucy9tdWx0aS11c2VyLWNoYXQvbXVsdGktdXNlci1jaGF0LnBsdWdpbic7XG5pbXBvcnQgeyBDSEFUX1NFUlZJQ0VfVE9LRU4sIENoYXRTZXJ2aWNlIH0gZnJvbSAnLi9jaGF0LXNlcnZpY2UnO1xuaW1wb3J0IHsgUm9vbSB9IGZyb20gJy4vYWRhcHRlcnMveG1wcC9wbHVnaW5zL211bHRpLXVzZXItY2hhdC9yb29tJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENoYXRCYWNrZ3JvdW5kTm90aWZpY2F0aW9uU2VydmljZSB7XG5cbiAgICBwcml2YXRlIGVuYWJsZWQgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoQ0hBVF9TRVJWSUNFX1RPS0VOKSBwcm90ZWN0ZWQgY2hhdFNlcnZpY2U6IENoYXRTZXJ2aWNlKSB7XG4gICAgICAgIGNoYXRTZXJ2aWNlLm1lc3NhZ2UkLnN1YnNjcmliZSgobXNnKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlY2VpdmVkRGlyZWN0TWVzc2FnZShtc2cpO1xuICAgICAgICB9KTtcbiAgICAgICAgY2hhdFNlcnZpY2UuZ2V0UGx1Z2luKE11bHRpVXNlckNoYXRQbHVnaW4pLm1lc3NhZ2UkLnN1YnNjcmliZShhc3luYyByb29tID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucmVjZWl2ZWRHcm91cE1lc3NhZ2Uocm9vbSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGVuYWJsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3VwcG9ydHNOb3RpZmljYXRpb24oKSkge1xuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0Tm90aWZpY2F0aW9uUGVybWlzc2lvbigpO1xuICAgICAgICAgICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRpc2FibGUoKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVxdWVzdE5vdGlmaWNhdGlvblBlcm1pc3Npb24oKSB7XG4gICAgICAgIGNvbnN0IG5vdGlmaWNhdGlvbiA9IE5vdGlmaWNhdGlvbiBhcyBhbnk7XG4gICAgICAgIG5vdGlmaWNhdGlvbi5yZXF1ZXN0UGVybWlzc2lvbigpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVjZWl2ZWREaXJlY3RNZXNzYWdlKGNvbnRhY3Q6IENvbnRhY3QpIHtcbiAgICAgICAgaWYgKHRoaXMuc2hvdWxkRGlzcGxheU5vdGlmaWNhdGlvbigpKSB7XG4gICAgICAgICAgICBjb25zdCBub3RpZmljYXRpb24gPSBuZXcgTm90aWZpY2F0aW9uKGNvbnRhY3QubmFtZSwge2JvZHk6IGNvbnRhY3QubW9zdFJlY2VudE1lc3NhZ2UuYm9keSwgaWNvbjogY29udGFjdC5hdmF0YXJ9KTtcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICBub3RpZmljYXRpb24uY2xvc2UoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyByZWNlaXZlZEdyb3VwTWVzc2FnZShyb29tOiBSb29tKSB7XG4gICAgICAgIGlmICh0aGlzLnNob3VsZERpc3BsYXlOb3RpZmljYXRpb24oKSkge1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IHJvb20ubW9zdFJlY2VudE1lc3NhZ2UuYm9keTtcbiAgICAgICAgICAgIGNvbnN0IHNlbmRlciA9IHJvb20ubW9zdFJlY2VudE1lc3NhZ2UuZnJvbTtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSBhd2FpdCB0aGlzLmN1c3RvbWl6ZUdyb3VwTWVzc2FnZShzZW5kZXIsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgY29uc3Qgbm90aWZpY2F0aW9uID0gbmV3IE5vdGlmaWNhdGlvbihyb29tLm5hbWUsIG9wdGlvbnMpO1xuICAgICAgICAgICAgbm90aWZpY2F0aW9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5mb2N1cygpO1xuICAgICAgICAgICAgICAgIG5vdGlmaWNhdGlvbi5jbG9zZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYXN5bmMgY3VzdG9taXplR3JvdXBNZXNzYWdlKHNlbmRlcjogSklELCBtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHtib2R5OiBgJHtzZW5kZXJ9OiAke21lc3NhZ2V9YH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzaG91bGREaXNwbGF5Tm90aWZpY2F0aW9uKCkge1xuICAgICAgICBjb25zdCBub3RpZmljYXRpb24gPSBOb3RpZmljYXRpb24gYXMgYW55O1xuICAgICAgICByZXR1cm4gdGhpcy5lbmFibGVkXG4gICAgICAgICAgICAmJiBkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09ICdoaWRkZW4nXG4gICAgICAgICAgICAmJiB0aGlzLnN1cHBvcnRzTm90aWZpY2F0aW9uKClcbiAgICAgICAgICAgICYmIG5vdGlmaWNhdGlvbi5wZXJtaXNzaW9uID09PSAnZ3JhbnRlZCc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdXBwb3J0c05vdGlmaWNhdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICdOb3RpZmljYXRpb24nIGluIHdpbmRvdztcbiAgICB9XG59XG4iXX0=