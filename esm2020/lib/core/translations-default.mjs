import { Presence } from './presence';
export function defaultTranslations() {
    return {
        acceptSubscriptionRequest: 'Accept',
        block: 'Block',
        blockAndReport: 'Block & report',
        chat: 'Chat',
        contactRequestIn: 'Incoming contact requests',
        contactRequestOut: 'Outgoing contact requests',
        contacts: 'Contacts',
        contactsUnaffiliated: 'Unknown',
        dateFormat: 'EEEE, MM/dd/yyyy',
        denySubscriptionRequest: 'Deny',
        dismiss: 'Dismiss',
        dropMessage: 'Drop your file to send it',
        locale: undefined,
        noContacts: 'No contacts yet.',
        noMessages: 'No messages yet.',
        placeholder: 'Enter your message!',
        presence: {
            [Presence.away]: 'Away',
            [Presence.present]: 'Online',
            [Presence.unavailable]: 'Offline',
        },
        rooms: 'Rooms',
        subscriptionRequestMessage: 'I want to add you as a contact.',
        timeFormat: 'shortTime',
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRpb25zLWRlZmF1bHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL2NvcmUvdHJhbnNsYXRpb25zLWRlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUd0QyxNQUFNLFVBQVUsbUJBQW1CO0lBQy9CLE9BQU87UUFDSCx5QkFBeUIsRUFBRSxRQUFRO1FBQ25DLEtBQUssRUFBRSxPQUFPO1FBQ2QsY0FBYyxFQUFFLGdCQUFnQjtRQUNoQyxJQUFJLEVBQUUsTUFBTTtRQUNaLGdCQUFnQixFQUFFLDJCQUEyQjtRQUM3QyxpQkFBaUIsRUFBRSwyQkFBMkI7UUFDOUMsUUFBUSxFQUFFLFVBQVU7UUFDcEIsb0JBQW9CLEVBQUUsU0FBUztRQUMvQixVQUFVLEVBQUUsa0JBQWtCO1FBQzlCLHVCQUF1QixFQUFFLE1BQU07UUFDL0IsT0FBTyxFQUFFLFNBQVM7UUFDbEIsV0FBVyxFQUFFLDJCQUEyQjtRQUN4QyxNQUFNLEVBQUUsU0FBUztRQUNqQixVQUFVLEVBQUUsa0JBQWtCO1FBQzlCLFVBQVUsRUFBRSxrQkFBa0I7UUFDOUIsV0FBVyxFQUFFLHFCQUFxQjtRQUNsQyxRQUFRLEVBQUU7WUFDTixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNO1lBQ3ZCLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLFFBQVE7WUFDNUIsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUUsU0FBUztTQUNwQztRQUNELEtBQUssRUFBRSxPQUFPO1FBQ2QsMEJBQTBCLEVBQUUsaUNBQWlDO1FBQzdELFVBQVUsRUFBRSxXQUFXO0tBQzFCLENBQUM7QUFDTixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJlc2VuY2UgfSBmcm9tICcuL3ByZXNlbmNlJztcbmltcG9ydCB7IFRyYW5zbGF0aW9ucyB9IGZyb20gJy4vdHJhbnNsYXRpb25zJztcblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRUcmFuc2xhdGlvbnMoKTogVHJhbnNsYXRpb25zIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBhY2NlcHRTdWJzY3JpcHRpb25SZXF1ZXN0OiAnQWNjZXB0JyxcbiAgICAgICAgYmxvY2s6ICdCbG9jaycsXG4gICAgICAgIGJsb2NrQW5kUmVwb3J0OiAnQmxvY2sgJiByZXBvcnQnLFxuICAgICAgICBjaGF0OiAnQ2hhdCcsXG4gICAgICAgIGNvbnRhY3RSZXF1ZXN0SW46ICdJbmNvbWluZyBjb250YWN0IHJlcXVlc3RzJyxcbiAgICAgICAgY29udGFjdFJlcXVlc3RPdXQ6ICdPdXRnb2luZyBjb250YWN0IHJlcXVlc3RzJyxcbiAgICAgICAgY29udGFjdHM6ICdDb250YWN0cycsXG4gICAgICAgIGNvbnRhY3RzVW5hZmZpbGlhdGVkOiAnVW5rbm93bicsXG4gICAgICAgIGRhdGVGb3JtYXQ6ICdFRUVFLCBNTS9kZC95eXl5JyxcbiAgICAgICAgZGVueVN1YnNjcmlwdGlvblJlcXVlc3Q6ICdEZW55JyxcbiAgICAgICAgZGlzbWlzczogJ0Rpc21pc3MnLFxuICAgICAgICBkcm9wTWVzc2FnZTogJ0Ryb3AgeW91ciBmaWxlIHRvIHNlbmQgaXQnLFxuICAgICAgICBsb2NhbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgbm9Db250YWN0czogJ05vIGNvbnRhY3RzIHlldC4nLFxuICAgICAgICBub01lc3NhZ2VzOiAnTm8gbWVzc2FnZXMgeWV0LicsXG4gICAgICAgIHBsYWNlaG9sZGVyOiAnRW50ZXIgeW91ciBtZXNzYWdlIScsXG4gICAgICAgIHByZXNlbmNlOiB7XG4gICAgICAgICAgICBbUHJlc2VuY2UuYXdheV06ICdBd2F5JyxcbiAgICAgICAgICAgIFtQcmVzZW5jZS5wcmVzZW50XTogJ09ubGluZScsXG4gICAgICAgICAgICBbUHJlc2VuY2UudW5hdmFpbGFibGVdOiAnT2ZmbGluZScsXG4gICAgICAgIH0sXG4gICAgICAgIHJvb21zOiAnUm9vbXMnLFxuICAgICAgICBzdWJzY3JpcHRpb25SZXF1ZXN0TWVzc2FnZTogJ0kgd2FudCB0byBhZGQgeW91IGFzIGEgY29udGFjdC4nLFxuICAgICAgICB0aW1lRm9ybWF0OiAnc2hvcnRUaW1lJyxcbiAgICB9O1xufVxuIl19