import { IqResponseStanza } from '../../../../core/stanza';
import { AbstractXmppPlugin } from './abstract-xmpp-plugin';
import { PublishSubscribePlugin } from './publish-subscribe.plugin';
export interface SavedConference {
    name: string;
    jid: string;
    autojoin: boolean;
}
export declare const STORAGE_BOOKMARKS = "storage:bookmarks";
/**
 * XEP-0048 Bookmarks (https://xmpp.org/extensions/xep-0048.html)
 */
export declare class BookmarkPlugin extends AbstractXmppPlugin {
    private readonly publishSubscribePlugin;
    private pendingAddConference;
    constructor(publishSubscribePlugin: PublishSubscribePlugin);
    onOffline(): void;
    retrieveMultiUserChatRooms(): Promise<SavedConference[]>;
    private convertElementToSavedConference;
    saveConferences(conferences: SavedConference[]): Promise<IqResponseStanza<'result'>>;
    addConference(conferenceToSave: SavedConference): Promise<IqResponseStanza<'result'>>;
    private addConferenceInternal;
    private convertSavedConferenceToElement;
}
