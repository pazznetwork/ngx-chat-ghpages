import { xml } from '@xmpp/client';
export class StanzaBuilder {
    static buildRoomMessage(from, roomJid, content = []) {
        return xml('message', { from, to: roomJid, type: 'groupchat' }, ...content);
    }
    static buildRoomMessageWithBody(from, roomJid, body, content = []) {
        return StanzaBuilder.buildRoomMessage(from, roomJid, [
            xml('body', {}, body),
            ...content,
        ]);
    }
    static buildRoomMessageWithThread(from, roomJid, body, thread) {
        return StanzaBuilder.buildRoomMessageWithBody(from, roomJid, body, [
            xml('thread', {}, thread),
        ]);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhbnphLWJ1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL3NlcnZpY2VzL2FkYXB0ZXJzL3htcHAvc3RhbnphLWJ1aWxkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUduQyxNQUFNLE9BQU8sYUFBYTtJQUV0QixNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBWSxFQUFFLE9BQWUsRUFBRSxVQUFxQixFQUFFO1FBQzFFLE9BQU8sR0FBRyxDQUFDLFNBQVMsRUFBRSxFQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUMsRUFDeEQsR0FBRyxPQUFPLENBQ2IsQ0FBQztJQUNOLENBQUM7SUFFRCxNQUFNLENBQUMsd0JBQXdCLENBQUMsSUFBWSxFQUFFLE9BQWUsRUFBRSxJQUFZLEVBQUUsVUFBcUIsRUFBRTtRQUNoRyxPQUFPLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQ2pELEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQztZQUNyQixHQUFHLE9BQU87U0FDYixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsTUFBTSxDQUFDLDBCQUEwQixDQUFDLElBQVksRUFBRSxPQUFlLEVBQUUsSUFBWSxFQUFFLE1BQWM7UUFDekYsT0FBTyxhQUFhLENBQUMsd0JBQXdCLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUU7WUFDL0QsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDO1NBQzVCLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHhtbCB9IGZyb20gJ0B4bXBwL2NsaWVudCc7XG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSAnbHR4JztcblxuZXhwb3J0IGNsYXNzIFN0YW56YUJ1aWxkZXIge1xuXG4gICAgc3RhdGljIGJ1aWxkUm9vbU1lc3NhZ2UoZnJvbTogc3RyaW5nLCByb29tSmlkOiBzdHJpbmcsIGNvbnRlbnQ6IEVsZW1lbnRbXSA9IFtdKTogRWxlbWVudCB7XG4gICAgICAgIHJldHVybiB4bWwoJ21lc3NhZ2UnLCB7ZnJvbSwgdG86IHJvb21KaWQsIHR5cGU6ICdncm91cGNoYXQnfSxcbiAgICAgICAgICAgIC4uLmNvbnRlbnQsXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgc3RhdGljIGJ1aWxkUm9vbU1lc3NhZ2VXaXRoQm9keShmcm9tOiBzdHJpbmcsIHJvb21KaWQ6IHN0cmluZywgYm9keTogc3RyaW5nLCBjb250ZW50OiBFbGVtZW50W10gPSBbXSk6IEVsZW1lbnQge1xuICAgICAgICByZXR1cm4gU3RhbnphQnVpbGRlci5idWlsZFJvb21NZXNzYWdlKGZyb20sIHJvb21KaWQsIFtcbiAgICAgICAgICAgIHhtbCgnYm9keScsIHt9LCBib2R5KSxcbiAgICAgICAgICAgIC4uLmNvbnRlbnQsXG4gICAgICAgIF0pO1xuICAgIH1cblxuICAgIHN0YXRpYyBidWlsZFJvb21NZXNzYWdlV2l0aFRocmVhZChmcm9tOiBzdHJpbmcsIHJvb21KaWQ6IHN0cmluZywgYm9keTogc3RyaW5nLCB0aHJlYWQ6IHN0cmluZyk6IEVsZW1lbnQge1xuICAgICAgICByZXR1cm4gU3RhbnphQnVpbGRlci5idWlsZFJvb21NZXNzYWdlV2l0aEJvZHkoZnJvbSwgcm9vbUppZCwgYm9keSwgW1xuICAgICAgICAgICAgeG1sKCd0aHJlYWQnLCB7fSwgdGhyZWFkKSxcbiAgICAgICAgXSk7XG4gICAgfVxufVxuIl19