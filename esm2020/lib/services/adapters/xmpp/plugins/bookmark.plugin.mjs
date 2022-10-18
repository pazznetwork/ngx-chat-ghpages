import { xml } from '@xmpp/client';
import { removeDuplicates } from '../../../../core/utils-array';
import { AbstractXmppPlugin } from './abstract-xmpp-plugin';
export const STORAGE_BOOKMARKS = 'storage:bookmarks';
/**
 * XEP-0048 Bookmarks (https://xmpp.org/extensions/xep-0048.html)
 */
export class BookmarkPlugin extends AbstractXmppPlugin {
    constructor(publishSubscribePlugin) {
        super();
        this.publishSubscribePlugin = publishSubscribePlugin;
        this.pendingAddConference = null;
    }
    onOffline() {
        this.pendingAddConference = null;
    }
    async retrieveMultiUserChatRooms() {
        const itemNode = await this.publishSubscribePlugin.retrieveNodeItems(STORAGE_BOOKMARKS);
        const storageNode = itemNode && itemNode[0] && itemNode[0].getChild('storage', STORAGE_BOOKMARKS);
        const conferenceNodes = itemNode && storageNode.getChildren('conference');
        if (!conferenceNodes) {
            return [];
        }
        return conferenceNodes.map(c => this.convertElementToSavedConference(c));
    }
    convertElementToSavedConference(conferenceNode) {
        return {
            name: conferenceNode.attrs.name,
            jid: conferenceNode.attrs.jid,
            autojoin: conferenceNode.attrs.autojoin === 'true',
        };
    }
    saveConferences(conferences) {
        const deduplicatedConferences = removeDuplicates(conferences, (x, y) => x.jid === y.jid);
        return this.publishSubscribePlugin.storePrivatePayloadPersistent(STORAGE_BOOKMARKS, null, xml('storage', { xmlns: STORAGE_BOOKMARKS }, ...deduplicatedConferences.map(c => this.convertSavedConferenceToElement(c))));
    }
    async addConference(conferenceToSave) {
        while (this.pendingAddConference) {
            try {
                await this.pendingAddConference; // serialize the writes, so that in case of multiple conference adds all get added
            }
            catch { }
        }
        this.pendingAddConference = this.addConferenceInternal(conferenceToSave);
        try {
            return await this.pendingAddConference;
        }
        finally {
            this.pendingAddConference = null;
        }
    }
    async addConferenceInternal(conferenceToSave) {
        const savedConferences = await this.retrieveMultiUserChatRooms();
        const conferences = [...savedConferences, conferenceToSave];
        return await this.saveConferences(conferences);
    }
    convertSavedConferenceToElement({ name, autojoin, jid }) {
        return xml('conference', { name, jid, autojoin: autojoin.toString() });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9va21hcmsucGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9zZXJ2aWNlcy9hZGFwdGVycy94bXBwL3BsdWdpbnMvYm9va21hcmsucGx1Z2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFHbkMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDaEUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFTNUQsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsbUJBQW1CLENBQUM7QUFFckQ7O0dBRUc7QUFDSCxNQUFNLE9BQU8sY0FBZSxTQUFRLGtCQUFrQjtJQUlsRCxZQUE2QixzQkFBOEM7UUFDdkUsS0FBSyxFQUFFLENBQUM7UUFEaUIsMkJBQXNCLEdBQXRCLHNCQUFzQixDQUF3QjtRQUZuRSx5QkFBb0IsR0FBK0MsSUFBSSxDQUFDO0lBSWhGLENBQUM7SUFFRCxTQUFTO1FBQ0wsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztJQUNyQyxDQUFDO0lBRUQsS0FBSyxDQUFDLDBCQUEwQjtRQUM1QixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3hGLE1BQU0sV0FBVyxHQUFHLFFBQVEsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUNsRyxNQUFNLGVBQWUsR0FBRyxRQUFRLElBQUksV0FBVyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMxRSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ2xCLE9BQU8sRUFBRSxDQUFDO1NBQ2I7UUFDRCxPQUFPLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsK0JBQStCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBRU8sK0JBQStCLENBQUMsY0FBdUI7UUFDM0QsT0FBTztZQUNILElBQUksRUFBRSxjQUFjLENBQUMsS0FBSyxDQUFDLElBQUk7WUFDL0IsR0FBRyxFQUFFLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRztZQUM3QixRQUFRLEVBQUUsY0FBYyxDQUFDLEtBQUssQ0FBQyxRQUFRLEtBQUssTUFBTTtTQUNyRCxDQUFDO0lBQ04sQ0FBQztJQUVELGVBQWUsQ0FBQyxXQUE4QjtRQUMxQyxNQUFNLHVCQUF1QixHQUFHLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pGLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLDZCQUE2QixDQUM1RCxpQkFBaUIsRUFDakIsSUFBSSxFQUNKLEdBQUcsQ0FBQyxTQUFTLEVBQUUsRUFBQyxLQUFLLEVBQUUsaUJBQWlCLEVBQUMsRUFDckMsR0FBRyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsK0JBQStCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDL0UsQ0FDSixDQUFDO0lBQ04sQ0FBQztJQUVELEtBQUssQ0FBQyxhQUFhLENBQUMsZ0JBQWlDO1FBQ2pELE9BQU8sSUFBSSxDQUFDLG9CQUFvQixFQUFFO1lBQzlCLElBQUk7Z0JBQ0EsTUFBTSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxrRkFBa0Y7YUFDdEg7WUFBQyxNQUFNLEdBQUU7U0FDYjtRQUVELElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUV6RSxJQUFJO1lBQ0EsT0FBTyxNQUFNLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztTQUMxQztnQkFBUztZQUNOLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7U0FDcEM7SUFDTCxDQUFDO0lBRU8sS0FBSyxDQUFDLHFCQUFxQixDQUFDLGdCQUFpQztRQUNqRSxNQUFNLGdCQUFnQixHQUFHLE1BQU0sSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7UUFDakUsTUFBTSxXQUFXLEdBQUcsQ0FBQyxHQUFHLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFFNUQsT0FBTyxNQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVPLCtCQUErQixDQUFDLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQWtCO1FBQzFFLE9BQU8sR0FBRyxDQUFDLFlBQVksRUFBRSxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBQyxDQUFXLENBQUM7SUFDbkYsQ0FBQztDQUVKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgeG1sIH0gZnJvbSAnQHhtcHAvY2xpZW50JztcbmltcG9ydCB7IEVsZW1lbnQgfSBmcm9tICdsdHgnO1xuaW1wb3J0IHsgSXFSZXNwb25zZVN0YW56YSwgU3RhbnphIH0gZnJvbSAnLi4vLi4vLi4vLi4vY29yZS9zdGFuemEnO1xuaW1wb3J0IHsgcmVtb3ZlRHVwbGljYXRlcyB9IGZyb20gJy4uLy4uLy4uLy4uL2NvcmUvdXRpbHMtYXJyYXknO1xuaW1wb3J0IHsgQWJzdHJhY3RYbXBwUGx1Z2luIH0gZnJvbSAnLi9hYnN0cmFjdC14bXBwLXBsdWdpbic7XG5pbXBvcnQgeyBQdWJsaXNoU3Vic2NyaWJlUGx1Z2luIH0gZnJvbSAnLi9wdWJsaXNoLXN1YnNjcmliZS5wbHVnaW4nO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNhdmVkQ29uZmVyZW5jZSB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGppZDogc3RyaW5nO1xuICAgIGF1dG9qb2luOiBib29sZWFuO1xufVxuXG5leHBvcnQgY29uc3QgU1RPUkFHRV9CT09LTUFSS1MgPSAnc3RvcmFnZTpib29rbWFya3MnO1xuXG4vKipcbiAqIFhFUC0wMDQ4IEJvb2ttYXJrcyAoaHR0cHM6Ly94bXBwLm9yZy9leHRlbnNpb25zL3hlcC0wMDQ4Lmh0bWwpXG4gKi9cbmV4cG9ydCBjbGFzcyBCb29rbWFya1BsdWdpbiBleHRlbmRzIEFic3RyYWN0WG1wcFBsdWdpbiB7XG5cbiAgICBwcml2YXRlIHBlbmRpbmdBZGRDb25mZXJlbmNlOiBQcm9taXNlPElxUmVzcG9uc2VTdGFuemE8J3Jlc3VsdCc+PiB8IG51bGwgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwdWJsaXNoU3Vic2NyaWJlUGx1Z2luOiBQdWJsaXNoU3Vic2NyaWJlUGx1Z2luKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgb25PZmZsaW5lKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnBlbmRpbmdBZGRDb25mZXJlbmNlID0gbnVsbDtcbiAgICB9XG5cbiAgICBhc3luYyByZXRyaWV2ZU11bHRpVXNlckNoYXRSb29tcygpOiBQcm9taXNlPFNhdmVkQ29uZmVyZW5jZVtdPiB7XG4gICAgICAgIGNvbnN0IGl0ZW1Ob2RlID0gYXdhaXQgdGhpcy5wdWJsaXNoU3Vic2NyaWJlUGx1Z2luLnJldHJpZXZlTm9kZUl0ZW1zKFNUT1JBR0VfQk9PS01BUktTKTtcbiAgICAgICAgY29uc3Qgc3RvcmFnZU5vZGUgPSBpdGVtTm9kZSAmJiBpdGVtTm9kZVswXSAmJiBpdGVtTm9kZVswXS5nZXRDaGlsZCgnc3RvcmFnZScsIFNUT1JBR0VfQk9PS01BUktTKTtcbiAgICAgICAgY29uc3QgY29uZmVyZW5jZU5vZGVzID0gaXRlbU5vZGUgJiYgc3RvcmFnZU5vZGUuZ2V0Q2hpbGRyZW4oJ2NvbmZlcmVuY2UnKTtcbiAgICAgICAgaWYgKCFjb25mZXJlbmNlTm9kZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29uZmVyZW5jZU5vZGVzLm1hcChjID0+IHRoaXMuY29udmVydEVsZW1lbnRUb1NhdmVkQ29uZmVyZW5jZShjKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb252ZXJ0RWxlbWVudFRvU2F2ZWRDb25mZXJlbmNlKGNvbmZlcmVuY2VOb2RlOiBFbGVtZW50KTogU2F2ZWRDb25mZXJlbmNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6IGNvbmZlcmVuY2VOb2RlLmF0dHJzLm5hbWUsXG4gICAgICAgICAgICBqaWQ6IGNvbmZlcmVuY2VOb2RlLmF0dHJzLmppZCxcbiAgICAgICAgICAgIGF1dG9qb2luOiBjb25mZXJlbmNlTm9kZS5hdHRycy5hdXRvam9pbiA9PT0gJ3RydWUnLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHNhdmVDb25mZXJlbmNlcyhjb25mZXJlbmNlczogU2F2ZWRDb25mZXJlbmNlW10pOiBQcm9taXNlPElxUmVzcG9uc2VTdGFuemE8J3Jlc3VsdCc+PiB7XG4gICAgICAgIGNvbnN0IGRlZHVwbGljYXRlZENvbmZlcmVuY2VzID0gcmVtb3ZlRHVwbGljYXRlcyhjb25mZXJlbmNlcywgKHgsIHkpID0+IHguamlkID09PSB5LmppZCk7XG4gICAgICAgIHJldHVybiB0aGlzLnB1Ymxpc2hTdWJzY3JpYmVQbHVnaW4uc3RvcmVQcml2YXRlUGF5bG9hZFBlcnNpc3RlbnQoXG4gICAgICAgICAgICBTVE9SQUdFX0JPT0tNQVJLUyxcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICB4bWwoJ3N0b3JhZ2UnLCB7eG1sbnM6IFNUT1JBR0VfQk9PS01BUktTfSxcbiAgICAgICAgICAgICAgICAuLi5kZWR1cGxpY2F0ZWRDb25mZXJlbmNlcy5tYXAoYyA9PiB0aGlzLmNvbnZlcnRTYXZlZENvbmZlcmVuY2VUb0VsZW1lbnQoYykpLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBhc3luYyBhZGRDb25mZXJlbmNlKGNvbmZlcmVuY2VUb1NhdmU6IFNhdmVkQ29uZmVyZW5jZSk6IFByb21pc2U8SXFSZXNwb25zZVN0YW56YTwncmVzdWx0Jz4+IHtcbiAgICAgICAgd2hpbGUgKHRoaXMucGVuZGluZ0FkZENvbmZlcmVuY2UpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wZW5kaW5nQWRkQ29uZmVyZW5jZTsgLy8gc2VyaWFsaXplIHRoZSB3cml0ZXMsIHNvIHRoYXQgaW4gY2FzZSBvZiBtdWx0aXBsZSBjb25mZXJlbmNlIGFkZHMgYWxsIGdldCBhZGRlZFxuICAgICAgICAgICAgfSBjYXRjaCB7fVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wZW5kaW5nQWRkQ29uZmVyZW5jZSA9IHRoaXMuYWRkQ29uZmVyZW5jZUludGVybmFsKGNvbmZlcmVuY2VUb1NhdmUpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5wZW5kaW5nQWRkQ29uZmVyZW5jZTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRoaXMucGVuZGluZ0FkZENvbmZlcmVuY2UgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBhZGRDb25mZXJlbmNlSW50ZXJuYWwoY29uZmVyZW5jZVRvU2F2ZTogU2F2ZWRDb25mZXJlbmNlKTogUHJvbWlzZTxJcVJlc3BvbnNlU3RhbnphPCdyZXN1bHQnPj4ge1xuICAgICAgICBjb25zdCBzYXZlZENvbmZlcmVuY2VzID0gYXdhaXQgdGhpcy5yZXRyaWV2ZU11bHRpVXNlckNoYXRSb29tcygpO1xuICAgICAgICBjb25zdCBjb25mZXJlbmNlcyA9IFsuLi5zYXZlZENvbmZlcmVuY2VzLCBjb25mZXJlbmNlVG9TYXZlXTtcblxuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5zYXZlQ29uZmVyZW5jZXMoY29uZmVyZW5jZXMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY29udmVydFNhdmVkQ29uZmVyZW5jZVRvRWxlbWVudCh7bmFtZSwgYXV0b2pvaW4sIGppZH06IFNhdmVkQ29uZmVyZW5jZSk6IFN0YW56YSB7XG4gICAgICAgIHJldHVybiB4bWwoJ2NvbmZlcmVuY2UnLCB7bmFtZSwgamlkLCBhdXRvam9pbjogYXV0b2pvaW4udG9TdHJpbmcoKX0pIGFzIFN0YW56YTtcbiAgICB9XG5cbn1cbiJdfQ==