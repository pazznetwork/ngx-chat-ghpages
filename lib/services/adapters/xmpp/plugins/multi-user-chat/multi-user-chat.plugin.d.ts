import { JID } from '@xmpp/jid';
import { BehaviorSubject, Subject } from 'rxjs';
import { IqResponseStanza, Stanza } from '../../../../../core/stanza';
import { LogService } from '../../../../log.service';
import { XmppChatAdapter } from '../../xmpp-chat-adapter.service';
import { AbstractXmppPlugin } from '../abstract-xmpp-plugin';
import { ServiceDiscoveryPlugin } from '../service-discovery.plugin';
import { Room } from './room';
import { AffiliationModification } from './affiliation';
import { RoleModification } from './role';
import { RoomUser } from './room-user';
import { Invitation } from './invitation';
import { Form } from '../../../../../core/form';
/**
 * see:
 * https://xmpp.org/extensions/xep-0045.html#terms-rooms
 */
export interface RoomCreationOptions extends RoomConfiguration {
    /**
     * The room id to create the room with. This is the `local` part of the room JID.
     */
    roomId: string;
    /**
     * Optional nickname to use in the room. Current user's nickname will be used if not provided.
     */
    nick?: string;
}
export interface RoomConfiguration {
    /**
     * Optional name for the room. If none is provided, room will be only identified by its JID.
     */
    name?: string;
    /**
     * A room that can be found by any user through normal means such as searching and service discovery
     */
    public?: boolean;
    /**
     * for true:
     * A room that a user cannot enter without being on the member list.
     * for false:
     * A room that non-banned entities are allowed to enter without being on the member list.
     */
    membersOnly?: boolean;
    /**
     * for true:
     * A room in which an occupant's full JID is exposed to all other occupants,
     * although the occupant can request any desired room nickname.
     * for false:
     * A room in which an occupant's full JID can be discovered by room moderators only.
     */
    nonAnonymous?: boolean;
    /**
     * for true:
     * A room that is not destroyed if the last occupant exits.
     * for false:
     * A room that is destroyed if the last occupant exits.
     */
    persistentRoom?: boolean;
    /**
     * allow ejabberd MucSub subscriptions.
     * Room occupants are allowed to subscribe to message notifications being archived while they were offline
     */
    allowSubscription?: boolean;
    /**
    * Only occupants with "voice" can send public messages. The default value is true.
    */
    moderated?: boolean;
}
export interface RoomMetadata {
    [key: string]: any;
}
export interface RoomSummary {
    jid: JID;
    name: string;
    roomInfo: Form | null;
}
/**
 * The MultiUserChatPlugin tries to provide the necessary functionality for a multi-user text chat,
 * whereby multiple XMPP users can exchange messages in the context of a room or channel, similar to Internet Relay Chat (IRC).
 * For more details see:
 * @see https://xmpp.org/extensions/xep-0045.html
 */
export declare class MultiUserChatPlugin extends AbstractXmppPlugin {
    private readonly xmppChatAdapter;
    private readonly logService;
    private readonly serviceDiscoveryPlugin;
    readonly rooms$: BehaviorSubject<Room[]>;
    readonly message$: Subject<Room>;
    private onInvitationSubject;
    readonly onInvitation$: import("rxjs").Observable<Invitation>;
    constructor(xmppChatAdapter: XmppChatAdapter, logService: LogService, serviceDiscoveryPlugin: ServiceDiscoveryPlugin);
    onOffline(): void;
    handleStanza(stanza: Stanza, archiveDelayElement?: Stanza): boolean;
    /**
     * Resolves if room could be configured as requested, rejects if room did exist or server did not accept configuration.
     */
    createRoom(options: RoomCreationOptions): Promise<Room>;
    destroyRoom(roomJid: JID): Promise<IqResponseStanza<'result'>>;
    joinRoom(occupantJid: JID): Promise<Room>;
    getRoomInfo(roomJid: JID): Promise<Form | null>;
    queryAllRooms(): Promise<RoomSummary[]>;
    /**
     * Get all members of a MUC-Room with their affiliation to the room using the rooms fullJid
     * @param roomJid jid of the room
     */
    queryUserList(roomJid: JID): Promise<RoomUser[]>;
    modifyAffiliationOrRole(roomJid: JID, modification: AffiliationModification | RoleModification): Promise<IqResponseStanza>;
    sendMessage(room: Room, body: string, thread?: string): Promise<void>;
    /**
     * requests a configuration form for a room which returns with the default values
     * for an example see:
     * https://xmpp.org/extensions/xep-0045.html#registrar-formtype-owner
     */
    getRoomConfiguration(roomJid: JID): Promise<Form>;
    applyRoomConfiguration(roomJid: JID, roomConfiguration: RoomConfiguration): Promise<void>;
    getRoomByJid(jid: JID): Room | undefined;
    banUser(occupantJid: JID, roomJid: JID, reason?: string): Promise<IqResponseStanza>;
    unbanUser(occupantJid: JID, roomJid: JID): Promise<IqResponseStanza>;
    getBanList(roomJid: JID): Promise<AffiliationModification[]>;
    inviteUser(inviteeJid: JID, roomJid: JID, invitationMessage?: string): Promise<void>;
    declineRoomInvite(occupantJid: JID, reason?: string): Promise<void>;
    kickOccupant(nick: string, roomJid: JID, reason?: string): Promise<IqResponseStanza>;
    changeUserNickname(newNick: string, roomJid: JID): Promise<void>;
    leaveRoom(occupantJid: JID, status?: string): Promise<void>;
    changeRoomSubject(roomJid: JID, subject: string): Promise<void>;
    isRoomInvitationStanza(stanza: Stanza): boolean;
    grantMembership(userJid: JID, roomJid: JID, reason?: string): Promise<void>;
    revokeMembership(userJid: JID, roomJid: JID, reason?: string): Promise<void>;
    grantAdmin(userJid: JID, roomJid: JID, reason?: string): Promise<void>;
    revokeAdmin(userJid: JID, roomJid: JID, reason?: string): Promise<void>;
    grantModeratorStatus(occupantNick: string, roomJid: JID, reason?: string): Promise<void>;
    revokeModeratorStatus(occupantNick: string, roomJid: JID, reason?: string): Promise<void>;
    private isRoomPresenceStanza;
    private handleRoomPresenceStanza;
    private getOrCreateRoom;
    private joinRoomInternal;
    private extractRoomSummariesFromResponse;
    private extractResultSetFromResponse;
    private isRoomMessageStanza;
    private handleRoomMessageStanza;
    private isRoomSubjectStanza;
    private handleRoomSubjectStanza;
    private handleRoomInvitationStanza;
    private setAffiliation;
    private setRole;
    private getUserJidByOccupantJid;
}
