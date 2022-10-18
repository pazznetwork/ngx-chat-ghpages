import { jid as parseJid, xml } from '@xmpp/client';
import { BehaviorSubject, Subject } from 'rxjs';
import { Direction } from '../../../../../core/message';
import { AbstractStanzaBuilder } from '../../abstract-stanza-builder';
import { StanzaBuilder } from '../../stanza-builder';
import { AbstractXmppPlugin } from '../abstract-xmpp-plugin';
import { MessageReceivedEvent } from '../message.plugin';
import { ServiceDiscoveryPlugin } from '../service-discovery.plugin';
import { Presence } from '../../../../../core/presence';
import { Room } from './room';
import { Affiliation } from './affiliation';
import { Role } from './role';
import { FORM_NS, getField, parseForm, serializeToSubmitForm, setFieldValue, } from '../../../../../core/form';
import { XmppResponseError } from '../../xmpp-response.error';
import { mucNs, mucAdminNs, mucOwnerNs, mucRoomConfigFormNs, mucUserNs } from './multi-user-chat-constants';
class QueryAffiliatedMemberListStanzaBuilder extends AbstractStanzaBuilder {
    constructor(roomJid, queryType, affiliationOrRole) {
        super();
        this.roomJid = roomJid;
        this.queryType = queryType;
        this.affiliationOrRole = affiliationOrRole;
    }
    static build(roomJid, ...[queryType, affiliationOrRole]) {
        return new QueryAffiliatedMemberListStanzaBuilder(roomJid, queryType, affiliationOrRole).toStanza();
    }
    toStanza() {
        return xml('iq', { type: 'get', to: this.roomJid.toString() }, xml('query', { xmlns: mucAdminNs }, xml('item', { [this.queryType]: this.affiliationOrRole })));
    }
}
class QueryOccupantListStanzaBuilder extends AbstractStanzaBuilder {
    constructor(roomJid) {
        super();
        this.roomJid = roomJid;
    }
    static build(roomJid) {
        return new QueryOccupantListStanzaBuilder(roomJid).toStanza();
    }
    toStanza() {
        return xml('iq', { type: 'get', to: this.roomJid.toString() }, xml('query', { xmlns: ServiceDiscoveryPlugin.DISCO_ITEMS }));
    }
}
class ModifyAffiliationsOrRolesStanzaBuilder extends AbstractStanzaBuilder {
    constructor(roomJid, modifications) {
        super();
        this.roomJid = roomJid;
        this.modifications = modifications;
    }
    static build(roomJid, modifications) {
        return new ModifyAffiliationsOrRolesStanzaBuilder(roomJid, modifications).toStanza();
    }
    toStanza() {
        return xml('iq', { to: this.roomJid.toString(), type: 'set' }, xml('query', { xmlns: mucAdminNs }, ...this.modifications.map(modification => this.buildItem(modification))));
    }
    buildItem(modification) {
        const { reason, ...attrs } = modification;
        return xml('item', 'userJid' in attrs
            ? {
                jid: attrs.userJid.toString(),
                affiliation: attrs.affiliation,
            }
            : {
                nick: attrs.nick,
                role: attrs.role,
            }, reason ? xml('reason', {}, reason) : null);
    }
}
/**
 * The MultiUserChatPlugin tries to provide the necessary functionality for a multi-user text chat,
 * whereby multiple XMPP users can exchange messages in the context of a room or channel, similar to Internet Relay Chat (IRC).
 * For more details see:
 * @see https://xmpp.org/extensions/xep-0045.html
 */
export class MultiUserChatPlugin extends AbstractXmppPlugin {
    constructor(xmppChatAdapter, logService, serviceDiscoveryPlugin) {
        super();
        this.xmppChatAdapter = xmppChatAdapter;
        this.logService = logService;
        this.serviceDiscoveryPlugin = serviceDiscoveryPlugin;
        this.rooms$ = new BehaviorSubject([]);
        this.message$ = new Subject();
        this.onInvitationSubject = new Subject();
        this.onInvitation$ = this.onInvitationSubject.asObservable();
    }
    onOffline() {
        this.rooms$.next([]);
    }
    handleStanza(stanza, archiveDelayElement) {
        if (this.isRoomPresenceStanza(stanza)) {
            return this.handleRoomPresenceStanza(stanza);
        }
        else if (this.isRoomMessageStanza(stanza)) {
            return this.handleRoomMessageStanza(stanza, archiveDelayElement);
        }
        else if (this.isRoomSubjectStanza(stanza)) {
            return this.handleRoomSubjectStanza(stanza, archiveDelayElement);
        }
        else if (this.isRoomInvitationStanza(stanza)) {
            return this.handleRoomInvitationStanza(stanza);
        }
        return false;
    }
    /**
     * Resolves if room could be configured as requested, rejects if room did exist or server did not accept configuration.
     */
    async createRoom(options) {
        const { roomId, nick } = options;
        const service = await this.serviceDiscoveryPlugin.findService('conference', 'text');
        const occupantJid = parseJid(roomId, service.jid, nick);
        const { presenceResponse, room } = await this.joinRoomInternal(occupantJid);
        const itemElement = presenceResponse.getChild('x').getChild('item');
        if (itemElement.attrs.affiliation !== Affiliation.owner) {
            throw new Error('error creating room, user is not owner: ' + presenceResponse.toString());
        }
        try {
            await this.applyRoomConfiguration(room.roomJid, options);
            room.name = options.name || undefined;
            this.rooms$.next(this.rooms$.getValue());
        }
        catch (e) {
            this.logService.error('room configuration rejected', e);
            throw e;
        }
        return room;
    }
    async destroyRoom(roomJid) {
        let roomDestroyedResponse;
        try {
            roomDestroyedResponse = await this.xmppChatAdapter.chatConnectionService.sendIq(xml('iq', { type: 'set', to: roomJid.toString() }, xml('query', { xmlns: mucOwnerNs }, xml('destroy'))));
        }
        catch (e) {
            this.logService.error('error destroying room');
            throw e;
        }
        // TODO: refactor so that we instead listen to the presence destroy stanza
        const allRoomsWithoutDestroyedRoom = this.rooms$.getValue().filter(room => !room.roomJid.equals(roomJid));
        this.rooms$.next(allRoomsWithoutDestroyedRoom);
        return roomDestroyedResponse;
    }
    async joinRoom(occupantJid) {
        const { room } = await this.joinRoomInternal(occupantJid);
        this.rooms$.next(this.rooms$.getValue());
        return room;
    }
    async getRoomInfo(roomJid) {
        const roomInfoResponse = await this.xmppChatAdapter.chatConnectionService.sendIq(xml('iq', { type: 'get', to: roomJid.toString() }, xml('query', { xmlns: ServiceDiscoveryPlugin.DISCO_INFO })));
        const formEl = roomInfoResponse
            .getChild('query', ServiceDiscoveryPlugin.DISCO_INFO)
            ?.getChild('x', FORM_NS);
        if (formEl) {
            return parseForm(formEl);
        }
        return null;
    }
    async queryAllRooms() {
        const conferenceServer = await this.serviceDiscoveryPlugin.findService('conference', 'text');
        const to = conferenceServer.jid.toString();
        const result = [];
        let roomQueryResponse = await this.xmppChatAdapter.chatConnectionService.sendIq(xml('iq', { type: 'get', to }, xml('query', { xmlns: ServiceDiscoveryPlugin.DISCO_ITEMS })));
        result.push(...this.extractRoomSummariesFromResponse(roomQueryResponse));
        let resultSet = this.extractResultSetFromResponse(roomQueryResponse);
        while (resultSet && resultSet.getChild('last')) {
            const lastReceivedRoom = resultSet.getChildText('last');
            roomQueryResponse = await this.xmppChatAdapter.chatConnectionService.sendIq(xml('iq', { type: 'get', to }, xml('query', { xmlns: ServiceDiscoveryPlugin.DISCO_ITEMS }, xml('set', { xmlns: 'http://jabber.org/protocol/rsm' }, xml('max', {}, '250'), xml('after', {}, lastReceivedRoom)))));
            result.push(...this.extractRoomSummariesFromResponse(roomQueryResponse));
            resultSet = this.extractResultSetFromResponse(roomQueryResponse);
        }
        await Promise.all(result.map(async (summary) => {
            summary.roomInfo = await this.getRoomInfo(summary.jid);
        }));
        return result;
    }
    /**
     * Get all members of a MUC-Room with their affiliation to the room using the rooms fullJid
     * @param roomJid jid of the room
     */
    async queryUserList(roomJid) {
        const memberQueryResponses = await Promise.all([
            ...Object
                .values(Affiliation)
                .map(affiliation => this.xmppChatAdapter.chatConnectionService.sendIq(QueryAffiliatedMemberListStanzaBuilder.build(roomJid, 'affiliation', affiliation))),
            ...Object
                .values(Role)
                .map(role => this.xmppChatAdapter.chatConnectionService.sendIq(QueryAffiliatedMemberListStanzaBuilder.build(roomJid, 'role', role))),
        ]);
        const members = new Map();
        for (const memberQueryResponse of memberQueryResponses) {
            memberQueryResponse
                .getChild('query', mucAdminNs)
                .getChildren('item')
                .forEach((memberItem) => {
                const userJid = parseJid(memberItem.attrs.jid);
                const roomUser = members.get(userJid.bare().toString()) || {
                    userIdentifiers: [],
                    affiliation: Affiliation.none,
                    role: Role.none,
                };
                roomUser.userIdentifiers.push({
                    userJid,
                    nick: memberItem.attrs.nick && memberItem.attrs.nick,
                });
                // tslint:disable no-unused-expression
                memberItem.attrs.affiliation && (roomUser.affiliation = memberItem.attrs.affiliation);
                memberItem.attrs.role && (roomUser.role = memberItem.attrs.role);
                // tslint:enable no-unused-expression
                members.set(userJid.bare().toString(), roomUser);
            });
        }
        return [...members.values()];
    }
    async modifyAffiliationOrRole(roomJid, modification) {
        return await this.xmppChatAdapter.chatConnectionService.sendIq(ModifyAffiliationsOrRolesStanzaBuilder.build(roomJid, [modification]));
    }
    async sendMessage(room, body, thread) {
        const from = this.xmppChatAdapter.chatConnectionService.userJid.toString();
        const roomJid = room.roomJid.toString();
        const roomMessageStanza = thread
            ? StanzaBuilder.buildRoomMessageWithThread(from, roomJid, body, thread)
            : StanzaBuilder.buildRoomMessageWithBody(from, roomJid, body);
        for (const plugin of this.xmppChatAdapter.plugins) {
            plugin.beforeSendMessage(roomMessageStanza);
        }
        return await this.xmppChatAdapter.chatConnectionService.send(roomMessageStanza);
    }
    /**
     * requests a configuration form for a room which returns with the default values
     * for an example see:
     * https://xmpp.org/extensions/xep-0045.html#registrar-formtype-owner
     */
    async getRoomConfiguration(roomJid) {
        const configurationForm = await this.xmppChatAdapter.chatConnectionService.sendIq(xml('iq', { type: 'get', to: roomJid.toString() }, xml('query', { xmlns: mucOwnerNs })));
        const formElement = configurationForm.getChild('query').getChild('x', FORM_NS);
        if (!formElement) {
            throw new Error('room not configurable');
        }
        return parseForm(formElement);
    }
    async applyRoomConfiguration(roomJid, roomConfiguration) {
        const roomConfigForm = await this.getRoomConfiguration(roomJid);
        const formTypeField = getField(roomConfigForm, 'FORM_TYPE');
        if (formTypeField.value !== mucRoomConfigFormNs) {
            throw new Error(`unexpected form type for room configuration form: formType=${formTypeField.value}, formTypeField=${JSON.stringify(formTypeField)}`);
        }
        if (typeof roomConfiguration.name === 'string') {
            setFieldValue(roomConfigForm, 'text-single', 'muc#roomconfig_roomname', roomConfiguration.name);
        }
        if (typeof roomConfiguration.nonAnonymous === 'boolean') {
            setFieldValue(roomConfigForm, 'list-single', 'muc#roomconfig_whois', roomConfiguration.nonAnonymous ? 'anyone' : 'moderators');
        }
        if (typeof roomConfiguration.public === 'boolean') {
            setFieldValue(roomConfigForm, 'boolean', 'muc#roomconfig_publicroom', roomConfiguration.public);
        }
        if (typeof roomConfiguration.membersOnly === 'boolean') {
            setFieldValue(roomConfigForm, 'boolean', 'muc#roomconfig_membersonly', roomConfiguration.membersOnly);
        }
        if (typeof roomConfiguration.persistentRoom === 'boolean') {
            setFieldValue(roomConfigForm, 'boolean', 'muc#roomconfig_persistentroom', roomConfiguration.persistentRoom);
        }
        if (typeof roomConfiguration.allowSubscription === 'boolean') {
            setFieldValue(roomConfigForm, 'boolean', 'allow_subscription', roomConfiguration.allowSubscription);
        }
        await this.xmppChatAdapter.chatConnectionService.sendIq(xml('iq', { type: 'set', to: roomJid.toString() }, xml('query', { xmlns: mucOwnerNs }, serializeToSubmitForm(roomConfigForm))));
    }
    getRoomByJid(jid) {
        return this.rooms$.getValue().find(room => room.roomJid.equals(jid.bare()));
    }
    async banUser(occupantJid, roomJid, reason) {
        const userJid = await this.getUserJidByOccupantJid(occupantJid, roomJid);
        const response = await this.modifyAffiliationOrRole(roomJid, {
            userJid: userJid.bare(),
            affiliation: Affiliation.outcast,
            reason,
        });
        this.logService.debug(`ban response ${response.toString()}`);
        return response;
    }
    async unbanUser(occupantJid, roomJid) {
        const userJid = await this.getUserJidByOccupantJid(occupantJid, roomJid);
        const banList = (await this.getBanList(roomJid)).map(bannedUser => bannedUser.userJid);
        this.logService.debug(`ban list: ${JSON.stringify(banList)}`);
        if (!banList.find(bannedJid => bannedJid.equals(userJid))) {
            throw new Error(`error unbanning: ${userJid} isn't on the ban list`);
        }
        const response = await this.modifyAffiliationOrRole(roomJid, { userJid, affiliation: Affiliation.none });
        this.logService.debug('unban response: ' + response.toString());
        return response;
    }
    async getBanList(roomJid) {
        const iq = xml('iq', { to: roomJid.toString(), type: 'get' }, xml('query', { xmlns: mucAdminNs }, xml('item', { affiliation: Affiliation.outcast })));
        const response = await this.xmppChatAdapter.chatConnectionService.sendIq(iq);
        return response.getChild('query').getChildren('item').map(item => ({
            userJid: parseJid(item.attrs.jid),
            affiliation: item.attrs.affiliation,
            reason: item.getChild('reason')?.getText(),
        }));
    }
    async inviteUser(inviteeJid, roomJid, invitationMessage) {
        const from = this.xmppChatAdapter.chatConnectionService.userJid.toString();
        const stanza = xml('message', { to: roomJid.toString(), from }, xml('x', { xmlns: mucUserNs }, xml('invite', { to: inviteeJid.toString() }, invitationMessage ? xml('reason', {}, invitationMessage) : null)));
        await this.xmppChatAdapter.chatConnectionService.send(stanza);
    }
    async declineRoomInvite(occupantJid, reason) {
        const to = occupantJid.bare().toString();
        const from = this.xmppChatAdapter.chatConnectionService.userJid.toString();
        const stanza = xml('message', { to, from }, xml('x', { xmlns: mucUserNs }, xml('decline', { to }, reason ? xml('reason', {}, reason) : null)));
        await this.xmppChatAdapter.chatConnectionService.send(stanza);
    }
    async kickOccupant(nick, roomJid, reason) {
        const response = await this.modifyAffiliationOrRole(roomJid, { nick, role: Role.none, reason });
        this.logService.debug(`kick occupant response: ${response.toString()}`);
        return response;
    }
    async changeUserNickname(newNick, roomJid) {
        const newRoomJid = parseJid(roomJid.toString());
        newRoomJid.resource = newNick;
        const stanza = xml('presence', {
            to: newRoomJid.toString(),
            from: this.xmppChatAdapter.chatConnectionService.userJid.toString(),
        });
        await this.xmppChatAdapter.chatConnectionService.send(stanza);
    }
    async leaveRoom(occupantJid, status) {
        const stanza = xml('presence', {
            to: occupantJid.toString(),
            from: this.xmppChatAdapter.chatConnectionService.userJid.toString(),
            type: Presence[Presence.unavailable],
        }, status ? xml('status', {}, status) : null);
        await this.xmppChatAdapter.chatConnectionService.send(stanza);
        this.logService.debug(`occupant left room: occupantJid=${occupantJid.toString()}`);
    }
    async changeRoomSubject(roomJid, subject) {
        const from = this.xmppChatAdapter.chatConnectionService.userJid.toString();
        await this.xmppChatAdapter.chatConnectionService.send(xml('message', { to: roomJid.toString(), from, type: 'groupchat' }, xml('subject', {}, subject)));
        this.logService.debug(`room subject changed: roomJid=${roomJid.toString()}, new subject=${subject}`);
    }
    isRoomInvitationStanza(stanza) {
        let x;
        return stanza.name === 'message'
            && (x = stanza.getChild('x', mucUserNs)) != null
            && (x.getChild('invite') != null || x.getChild('decline') != null);
    }
    async grantMembership(userJid, roomJid, reason) {
        await this.setAffiliation(userJid, roomJid, Affiliation.member, reason);
    }
    async revokeMembership(userJid, roomJid, reason) {
        await this.setAffiliation(userJid, roomJid, Affiliation.none, reason);
    }
    async grantAdmin(userJid, roomJid, reason) {
        await this.setAffiliation(userJid, roomJid, Affiliation.admin, reason);
    }
    async revokeAdmin(userJid, roomJid, reason) {
        await this.setAffiliation(userJid, roomJid, Affiliation.member, reason);
    }
    async grantModeratorStatus(occupantNick, roomJid, reason) {
        await this.setRole(occupantNick, roomJid, Role.moderator, reason);
    }
    async revokeModeratorStatus(occupantNick, roomJid, reason) {
        await this.setRole(occupantNick, roomJid, Role.participant, reason);
    }
    isRoomPresenceStanza(stanza) {
        return stanza.name === 'presence' && (stanza.getChild('x', mucNs)
            || stanza.getChild('x', mucUserNs)) != null;
    }
    handleRoomPresenceStanza(stanza) {
        const stanzaType = stanza.attrs.type;
        if (stanzaType === 'error') {
            this.logService.error(stanza);
            throw new Error('error handling message, stanza: ' + stanza);
        }
        const occupantJid = parseJid(stanza.attrs.from);
        const roomJid = occupantJid.bare();
        const xEl = stanza.getChild('x', mucUserNs);
        const itemEl = xEl.getChild('item');
        const subjectOccupant = {
            occupantJid,
            affiliation: itemEl.attrs.affiliation,
            role: itemEl.attrs.role,
            nick: occupantJid.resource,
        };
        const room = this.getOrCreateRoom(occupantJid);
        const statusCodes = xEl.getChildren('status').map(status => status.attrs.code);
        const isCurrenUser = statusCodes.includes('110');
        if (stanzaType === 'unavailable') {
            const actor = itemEl.getChild('actor')?.attrs.nick;
            const reason = itemEl.getChild('reason')?.getText();
            if (statusCodes.includes('333')) {
                if (isCurrenUser) {
                    this.rooms$.next(this.rooms$.getValue().filter(r => !r.jidBare.equals(roomJid)));
                }
                return room.handleOccupantConnectionError(subjectOccupant, isCurrenUser);
            }
            else if (statusCodes.includes('307')) {
                if (isCurrenUser) {
                    this.rooms$.next(this.rooms$.getValue().filter(r => !r.jidBare.equals(roomJid)));
                }
                return room.handleOccupantKicked(subjectOccupant, isCurrenUser, actor, reason);
            }
            else if (statusCodes.includes('301')) {
                if (isCurrenUser) {
                    this.rooms$.next(this.rooms$.getValue().filter(r => !r.jidBare.equals(roomJid)));
                }
                return room.handleOccupantBanned(subjectOccupant, isCurrenUser, actor, reason);
            }
            else if (statusCodes.includes('303')) {
                const handled = room.handleOccupantChangedNick(subjectOccupant, isCurrenUser, xEl.getChild('item').attrs.nick);
                if (handled && isCurrenUser) {
                    this.rooms$.next(this.rooms$.getValue());
                }
                return handled;
            }
            else if (statusCodes.includes('321')) {
                if (isCurrenUser) {
                    this.rooms$.next(this.rooms$.getValue().filter(r => !r.jidBare.equals(roomJid)));
                }
                return room.handleOccupantLostMembership(subjectOccupant, isCurrenUser);
            }
            else {
                if (isCurrenUser) {
                    this.rooms$.next(this.rooms$.getValue().filter(r => !r.jidBare.equals(roomJid)));
                }
                return room.handleOccupantLeft(subjectOccupant, isCurrenUser);
            }
        }
        else if (!stanzaType) {
            if (room.hasOccupant(subjectOccupant.occupantJid)) {
                const oldOccupant = room.getOccupant(subjectOccupant.occupantJid);
                return room.handleOccupantModified(subjectOccupant, oldOccupant, isCurrenUser);
            }
            else {
                return room.handleOccupantJoined(subjectOccupant, isCurrenUser);
            }
        }
        return false;
    }
    getOrCreateRoom(roomJid) {
        roomJid = roomJid.bare();
        let room = this.getRoomByJid(roomJid);
        if (!room) {
            room = new Room(roomJid, this.logService);
            this.rooms$.next([room, ...this.rooms$.getValue()]);
        }
        return room;
    }
    async joinRoomInternal(roomJid) {
        if (this.getRoomByJid(roomJid.bare())) {
            throw new Error('can not join room more than once: ' + roomJid.bare().toString());
        }
        const userJid = this.xmppChatAdapter.chatConnectionService.userJid;
        const occupantJid = parseJid(roomJid.local, roomJid.domain, roomJid.resource || userJid.local);
        let roomInfo = null;
        try {
            roomInfo = await this.getRoomInfo(occupantJid.bare());
        }
        catch (e) {
            if (!(e instanceof XmppResponseError) || e.errorCondition !== 'item-not-found') {
                throw e;
            }
        }
        try {
            const presenceResponse = await this.xmppChatAdapter.chatConnectionService.sendAwaitingResponse(xml('presence', { to: occupantJid.toString() }, xml('x', { xmlns: mucNs })));
            this.handleRoomPresenceStanza(presenceResponse);
            const room = this.getOrCreateRoom(occupantJid.bare());
            room.nick = occupantJid.resource;
            if (roomInfo) {
                room.name = getField(roomInfo, 'muc#roomconfig_roomname')?.value;
                room.description = getField(roomInfo, 'muc#roominfo_description')?.value || '';
            }
            return { presenceResponse, room };
        }
        catch (e) {
            this.logService.error('error joining room', e);
            throw e;
        }
    }
    extractRoomSummariesFromResponse(iq) {
        return iq
            .getChild('query', ServiceDiscoveryPlugin.DISCO_ITEMS)
            ?.getChildren('item')
            ?.reduce((acc, item) => {
            const { jid, name } = item.attrs;
            if (typeof jid === 'string' && typeof name === 'string') {
                acc.push({
                    jid: parseJid(jid),
                    name,
                    roomInfo: null,
                });
            }
            return acc;
        }, []) || [];
    }
    extractResultSetFromResponse(iq) {
        return iq
            .getChild('query', ServiceDiscoveryPlugin.DISCO_ITEMS)
            ?.getChild('set', 'http://jabber.org/protocol/rsm');
    }
    isRoomMessageStanza(stanza) {
        return stanza.name === 'message' && stanza.attrs.type === 'groupchat' && !!stanza.getChildText('body')?.trim();
    }
    handleRoomMessageStanza(messageStanza, archiveDelayElement) {
        const delayElement = archiveDelayElement ?? messageStanza.getChild('delay');
        const datetime = delayElement?.attrs.stamp
            ? new Date(delayElement.attrs.stamp)
            : new Date() /* TODO: replace with entity time plugin */;
        const from = parseJid(messageStanza.attrs.from);
        const room = this.getRoomByJid(from.bare());
        if (!room) {
            // there are several reasons why we can receive a message for an unknown room:
            // - this is a message delivered via MAM/MUCSub but the room it was stored for
            //   - is gone (was destroyed)
            //   - user was banned from room
            //   - room wasn't joined yet
            // - this is some kind of error on developer's side
            this.logService.warn(`received stanza for unknown room: ${from.bare().toString()}`);
            return false;
        }
        const message = {
            body: messageStanza.getChildText('body').trim(),
            datetime,
            id: messageStanza.attrs.id,
            from,
            direction: from.equals(room.occupantJid) ? Direction.out : Direction.in,
            delayed: !!delayElement,
            fromArchive: archiveDelayElement != null,
        };
        const messageReceivedEvent = new MessageReceivedEvent();
        for (const plugin of this.xmppChatAdapter.plugins) {
            plugin.afterReceiveMessage(message, messageStanza, messageReceivedEvent);
        }
        if (!messageReceivedEvent.discard) {
            room.addMessage(message);
        }
        if (!message.delayed) {
            this.message$.next(room);
        }
        return true;
    }
    isRoomSubjectStanza(stanza) {
        return stanza.name === 'message'
            && stanza.attrs.type === 'groupchat'
            && stanza.getChild('subject') != null
            && stanza.getChild('body') == null;
    }
    handleRoomSubjectStanza(stanza, archiveDelayElement) {
        const roomJid = parseJid(stanza.attrs.from).bare();
        const room = this.getRoomByJid(roomJid);
        if (!room) {
            throw new Error(`unknown room trying to change room subject: roomJid=${roomJid.toString()}`);
        }
        // The archive only stores non-empty subjects. The current value of the subject is sent directly after entering a room by the room,
        // not the archive.
        // If a subject was first set, then unset, we would first receive the empty subject on room entry and then overwrite it with the
        // previous non-empty value from archive. This is why we want to always ignore subjects from archive.
        // This actually looks like a bug in MAM, it seems that MAM interprets messages with just subject in them as if they were chat
        // messages and not room metadata. This would explain why empty subjects are not stored.
        if (archiveDelayElement) {
            return true;
        }
        room.subject = stanza.getChild('subject').getText().trim();
        this.rooms$.next(this.rooms$.getValue());
        return true;
    }
    handleRoomInvitationStanza(stanza) {
        const xEl = stanza.getChild('x', mucUserNs);
        const invitationEl = xEl.getChild('invite') ?? xEl.getChild('decline');
        this.onInvitationSubject.next({
            type: invitationEl.name,
            roomJid: parseJid(stanza.attrs.from),
            roomPassword: xEl.getChild('password')?.getText(),
            from: parseJid(invitationEl.attrs.from),
            message: invitationEl.getChild('reason')?.getText(),
        });
        return true;
    }
    async setAffiliation(occupantJid, roomJid, affiliation, reason) {
        const userJid = await this.getUserJidByOccupantJid(occupantJid, roomJid);
        return await this.modifyAffiliationOrRole(roomJid, { userJid, affiliation, reason });
    }
    async setRole(occupantNick, roomJid, role, reason) {
        return await this.modifyAffiliationOrRole(roomJid, { nick: occupantNick, role, reason });
    }
    async getUserJidByOccupantJid(occupantJid, roomJid) {
        const users = await this.queryUserList(roomJid);
        return users.find(roomUser => roomUser.userIdentifiers.find(ids => ids.nick === occupantJid.resource || ids.userJid.bare().equals(occupantJid.bare())))?.userIdentifiers?.[0].userJid;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGktdXNlci1jaGF0LnBsdWdpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvc2VydmljZXMvYWRhcHRlcnMveG1wcC9wbHVnaW5zL211bHRpLXVzZXItY2hhdC9tdWx0aS11c2VyLWNoYXQucGx1Z2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxHQUFHLElBQUksUUFBUSxFQUFFLEdBQUcsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUdwRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNoRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFHeEQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDdEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRXJELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzdELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3JFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQzlCLE9BQU8sRUFBRSxXQUFXLEVBQTJCLE1BQU0sZUFBZSxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxJQUFJLEVBQW9CLE1BQU0sUUFBUSxDQUFDO0FBS2hELE9BQU8sRUFFSCxPQUFPLEVBQ1AsUUFBUSxFQUNSLFNBQVMsRUFDVCxxQkFBcUIsRUFDckIsYUFBYSxHQUVoQixNQUFNLDBCQUEwQixDQUFDO0FBQ2xDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzlELE9BQU8sRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxtQkFBbUIsRUFBRSxTQUFTLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQWdFNUcsTUFBTSxzQ0FBdUMsU0FBUSxxQkFBcUI7SUFFdEUsWUFDcUIsT0FBWSxFQUNaLFNBQWlDLEVBQ2pDLGlCQUFxQztRQUV0RCxLQUFLLEVBQUUsQ0FBQztRQUpTLFlBQU8sR0FBUCxPQUFPLENBQUs7UUFDWixjQUFTLEdBQVQsU0FBUyxDQUF3QjtRQUNqQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW9CO0lBRzFELENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQVksRUFBRSxHQUFHLENBQUMsU0FBUyxFQUFFLGlCQUFpQixDQUMrQjtRQUN0RixPQUFPLElBQUksc0NBQXNDLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3hHLENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBQyxFQUN2RCxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsRUFBQyxFQUM1QixHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFDLENBQUMsQ0FDMUQsQ0FDTSxDQUFDO0lBQ2hCLENBQUM7Q0FDSjtBQUVELE1BQU0sOEJBQStCLFNBQVEscUJBQXFCO0lBRTlELFlBQTZCLE9BQVk7UUFDckMsS0FBSyxFQUFFLENBQUM7UUFEaUIsWUFBTyxHQUFQLE9BQU8sQ0FBSztJQUV6QyxDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFZO1FBQ3JCLE9BQU8sSUFBSSw4QkFBOEIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNsRSxDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUMsRUFDdkQsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFDLEtBQUssRUFBRSxzQkFBc0IsQ0FBQyxXQUFXLEVBQUMsQ0FBQyxDQUNsRCxDQUFDO0lBQ2hCLENBQUM7Q0FDSjtBQVFELE1BQU0sc0NBQXVDLFNBQVEscUJBQXFCO0lBRXRFLFlBQ3FCLE9BQVksRUFDWixhQUFzRTtRQUV2RixLQUFLLEVBQUUsQ0FBQztRQUhTLFlBQU8sR0FBUCxPQUFPLENBQUs7UUFDWixrQkFBYSxHQUFiLGFBQWEsQ0FBeUQ7SUFHM0YsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQ1IsT0FBWSxFQUNaLGFBQXNFO1FBRXRFLE9BQU8sSUFBSSxzQ0FBc0MsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDekYsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDLEVBQ3ZELEdBQUcsQ0FDQyxPQUFPLEVBQ1AsRUFBQyxLQUFLLEVBQUUsVUFBVSxFQUFDLEVBQ25CLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQzFFLENBQ00sQ0FBQztJQUNoQixDQUFDO0lBRU8sU0FBUyxDQUFDLFlBQXdEO1FBQ3RFLE1BQU0sRUFBQyxNQUFNLEVBQUUsR0FBRyxLQUFLLEVBQUMsR0FBRyxZQUFZLENBQUM7UUFDeEMsT0FBTyxHQUFHLENBQ04sTUFBTSxFQUNOLFNBQVMsSUFBSSxLQUFLO1lBQ2QsQ0FBQyxDQUFDO2dCQUNFLEdBQUcsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRTtnQkFDN0IsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO2FBQ2pDO1lBQ0QsQ0FBQyxDQUFDO2dCQUNFLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtnQkFDaEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO2FBQ25CLEVBQ0wsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUM1QyxDQUFDO0lBQ04sQ0FBQztDQUNKO0FBRUQ7Ozs7O0dBS0c7QUFDSCxNQUFNLE9BQU8sbUJBQW9CLFNBQVEsa0JBQWtCO0lBT3ZELFlBQ3FCLGVBQWdDLEVBQ2hDLFVBQXNCLEVBQ3RCLHNCQUE4QztRQUUvRCxLQUFLLEVBQUUsQ0FBQztRQUpTLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBd0I7UUFUMUQsV0FBTSxHQUFHLElBQUksZUFBZSxDQUFTLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLGFBQVEsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBRWhDLHdCQUFtQixHQUFHLElBQUksT0FBTyxFQUFjLENBQUM7UUFDL0Msa0JBQWEsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsWUFBWSxFQUFFLENBQUM7SUFRakUsQ0FBQztJQUVELFNBQVM7UUFDTCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRUQsWUFBWSxDQUFDLE1BQWMsRUFBRSxtQkFBNEI7UUFDckQsSUFBSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDbkMsT0FBTyxJQUFJLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDaEQ7YUFBTSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUN6QyxPQUFPLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztTQUNwRTthQUFNLElBQUksSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3pDLE9BQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1NBQ3BFO2FBQU0sSUFBSSxJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDNUMsT0FBTyxJQUFJLENBQUMsMEJBQTBCLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDbEQ7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQTRCO1FBQ3pDLE1BQU0sRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLEdBQUcsT0FBTyxDQUFDO1FBQy9CLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDcEYsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELE1BQU0sRUFBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUUxRSxNQUFNLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BFLElBQUksV0FBVyxDQUFDLEtBQUssQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLEtBQUssRUFBRTtZQUNyRCxNQUFNLElBQUksS0FBSyxDQUFDLDBDQUEwQyxHQUFHLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7U0FDN0Y7UUFFRCxJQUFJO1lBQ0EsTUFBTSxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLElBQUksU0FBUyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUM1QztRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsNkJBQTZCLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDeEQsTUFBTSxDQUFDLENBQUM7U0FDWDtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQVk7UUFDMUIsSUFBSSxxQkFBaUQsQ0FBQztRQUN0RCxJQUFJO1lBQ0EscUJBQXFCLEdBQUcsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FDM0UsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBQyxFQUMzQyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsRUFBQyxFQUM1QixHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDakM7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNSLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDL0MsTUFBTSxDQUFDLENBQUM7U0FDWDtRQUVELDBFQUEwRTtRQUMxRSxNQUFNLDRCQUE0QixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxDQUM5RCxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQ3hDLENBQUM7UUFFRixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1FBRS9DLE9BQU8scUJBQXFCLENBQUM7SUFDakMsQ0FBQztJQUVELEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBZ0I7UUFDM0IsTUFBTSxFQUFDLElBQUksRUFBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN6QyxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFZO1FBQzFCLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FDNUUsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBQyxFQUMzQyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUMsS0FBSyxFQUFFLHNCQUFzQixDQUFDLFVBQVUsRUFBQyxDQUFDLENBQzNELENBQ0osQ0FBQztRQUNGLE1BQU0sTUFBTSxHQUFHLGdCQUFnQjthQUMxQixRQUFRLENBQUMsT0FBTyxFQUFFLHNCQUFzQixDQUFDLFVBQVUsQ0FBQztZQUNyRCxFQUFFLFFBQVEsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFN0IsSUFBSSxNQUFNLEVBQUU7WUFDUixPQUFPLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM1QjtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxLQUFLLENBQUMsYUFBYTtRQUNmLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM3RixNQUFNLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFM0MsTUFBTSxNQUFNLEdBQWtCLEVBQUUsQ0FBQztRQUVqQyxJQUFJLGlCQUFpQixHQUFHLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQzNFLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBQyxFQUN2QixHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUMsS0FBSyxFQUFFLHNCQUFzQixDQUFDLFdBQVcsRUFBQyxDQUFDLENBQzVELENBQ0osQ0FBQztRQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1FBRXpFLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3JFLE9BQU8sU0FBUyxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDNUMsTUFBTSxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hELGlCQUFpQixHQUFHLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQ3ZFLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBQyxFQUN2QixHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUMsS0FBSyxFQUFFLHNCQUFzQixDQUFDLFdBQVcsRUFBQyxFQUNwRCxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLGdDQUFnQyxFQUFDLEVBQ2hELEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUNyQixHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUNyQyxDQUNKLENBQ0osQ0FDSixDQUFDO1lBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7WUFDekUsU0FBUyxHQUFHLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1NBQ3BFO1FBRUQsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUNiLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQ3pCLE9BQU8sQ0FBQyxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzRCxDQUFDLENBQUMsQ0FDTCxDQUFDO1FBRUYsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBWTtRQUM1QixNQUFNLG9CQUFvQixHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDMUM7WUFDSSxHQUFHLE1BQU07aUJBQ0osTUFBTSxDQUFDLFdBQVcsQ0FBQztpQkFDbkIsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQ2YsSUFBSSxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQzdDLHNDQUFzQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUNwRixDQUNKO1lBQ0wsR0FBRyxNQUFNO2lCQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUM7aUJBQ1osR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQ1IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQzdDLHNDQUFzQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUN0RSxDQUNKO1NBQ1IsQ0FDSixDQUFDO1FBQ0YsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQW9CLENBQUM7UUFDNUMsS0FBSyxNQUFNLG1CQUFtQixJQUFJLG9CQUFvQixFQUFFO1lBQ3BELG1CQUFtQjtpQkFDZCxRQUFRLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQztpQkFDN0IsV0FBVyxDQUFDLE1BQU0sQ0FBQztpQkFDbkIsT0FBTyxDQUFDLENBQUMsVUFBbUIsRUFBRSxFQUFFO2dCQUM3QixNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDL0MsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSTtvQkFDdkQsZUFBZSxFQUFFLEVBQUU7b0JBQ25CLFdBQVcsRUFBRSxXQUFXLENBQUMsSUFBSTtvQkFDN0IsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2lCQUNOLENBQUM7Z0JBQ2QsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUM7b0JBQzFCLE9BQU87b0JBQ1AsSUFBSSxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSTtpQkFDdkQsQ0FBQyxDQUFDO2dCQUNILHNDQUFzQztnQkFDdEMsVUFBVSxDQUFDLEtBQUssQ0FBQyxXQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3RGLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNqRSxxQ0FBcUM7Z0JBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3JELENBQUMsQ0FBQyxDQUFDO1NBQ1Y7UUFFRCxPQUFPLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsS0FBSyxDQUFDLHVCQUF1QixDQUFDLE9BQVksRUFBRSxZQUF3RDtRQUNoRyxPQUFPLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQzFELHNDQUFzQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUN4RSxDQUFDO0lBQ04sQ0FBQztJQUVELEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBVSxFQUFFLElBQVksRUFBRSxNQUFlO1FBQ3ZELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzNFLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDeEMsTUFBTSxpQkFBaUIsR0FDbkIsTUFBTTtZQUNGLENBQUMsQ0FBQyxhQUFhLENBQUMsMEJBQTBCLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDO1lBQ3ZFLENBQUMsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUV0RSxLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFO1lBQy9DLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1NBQy9DO1FBRUQsT0FBTyxNQUFNLElBQUksQ0FBQyxlQUFlLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDcEYsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsb0JBQW9CLENBQUMsT0FBWTtRQUNuQyxNQUFNLGlCQUFpQixHQUFHLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQzdFLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUMsRUFDM0MsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLEVBQUMsQ0FBQyxDQUNwQyxDQUNKLENBQUM7UUFFRixNQUFNLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMvRSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1NBQzVDO1FBRUQsT0FBTyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVELEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxPQUFZLEVBQUUsaUJBQW9DO1FBQzNFLE1BQU0sY0FBYyxHQUFHLE1BQU0sSUFBSSxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWhFLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxjQUFjLEVBQUUsV0FBVyxDQUFpQyxDQUFDO1FBQzVGLElBQUksYUFBYSxDQUFDLEtBQUssS0FBSyxtQkFBbUIsRUFBRTtZQUM3QyxNQUFNLElBQUksS0FBSyxDQUFDLDhEQUE4RCxhQUFhLENBQUMsS0FBSyxtQkFBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDeEo7UUFFRCxJQUFJLE9BQU8saUJBQWlCLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUM1QyxhQUFhLENBQUMsY0FBYyxFQUFFLGFBQWEsRUFBRSx5QkFBeUIsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNuRztRQUNELElBQUksT0FBTyxpQkFBaUIsQ0FBQyxZQUFZLEtBQUssU0FBUyxFQUFFO1lBQ3JELGFBQWEsQ0FDVCxjQUFjLEVBQ2QsYUFBYSxFQUNiLHNCQUFzQixFQUN0QixpQkFBaUIsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUMzRCxDQUFDO1NBQ0w7UUFDRCxJQUFJLE9BQU8saUJBQWlCLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtZQUMvQyxhQUFhLENBQUMsY0FBYyxFQUFFLFNBQVMsRUFBRSwyQkFBMkIsRUFBRSxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNuRztRQUNELElBQUksT0FBTyxpQkFBaUIsQ0FBQyxXQUFXLEtBQUssU0FBUyxFQUFFO1lBQ3BELGFBQWEsQ0FBQyxjQUFjLEVBQUUsU0FBUyxFQUFFLDRCQUE0QixFQUFFLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ3pHO1FBQ0QsSUFBSSxPQUFPLGlCQUFpQixDQUFDLGNBQWMsS0FBSyxTQUFTLEVBQUU7WUFDdkQsYUFBYSxDQUFDLGNBQWMsRUFBRSxTQUFTLEVBQUUsK0JBQStCLEVBQUUsaUJBQWlCLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDL0c7UUFDRCxJQUFJLE9BQU8saUJBQWlCLENBQUMsaUJBQWlCLEtBQUssU0FBUyxFQUFFO1lBQzFELGFBQWEsQ0FBQyxjQUFjLEVBQUUsU0FBUyxFQUFFLG9CQUFvQixFQUFFLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FDdkc7UUFFRCxNQUFNLElBQUksQ0FBQyxlQUFlLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUNuRCxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFDLEVBQzNDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxFQUFDLEVBQzVCLHFCQUFxQixDQUFDLGNBQWMsQ0FBQyxDQUN4QyxDQUNKLENBQ0osQ0FBQztJQUNOLENBQUM7SUFFRCxZQUFZLENBQUMsR0FBUTtRQUNqQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFnQixFQUFFLE9BQVksRUFBRSxNQUFlO1FBQ3pELE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLHVCQUF1QixDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUV6RSxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLEVBQUU7WUFDekQsT0FBTyxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUU7WUFDdkIsV0FBVyxFQUFFLFdBQVcsQ0FBQyxPQUFPO1lBQ2hDLE1BQU07U0FDVCxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsUUFBUSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUU3RCxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDO0lBRUQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFnQixFQUFFLE9BQVk7UUFDMUMsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsdUJBQXVCLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXpFLE1BQU0sT0FBTyxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZGLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLGFBQWEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFOUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUU7WUFDdkQsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsT0FBTyx3QkFBd0IsQ0FBQyxDQUFDO1NBQ3hFO1FBRUQsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsdUJBQXVCLENBQUMsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUN2RyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsR0FBRyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUVoRSxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDO0lBRUQsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFZO1FBQ3pCLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUMsRUFDdEQsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLEVBQUMsRUFDNUIsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FDbEQsQ0FDSixDQUFDO1FBQ0YsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU3RSxPQUFPLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDL0QsT0FBTyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztZQUNqQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXO1lBQ25DLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRTtTQUM3QyxDQUFDLENBQUMsQ0FBQztJQUNSLENBQUM7SUFFRCxLQUFLLENBQUMsVUFBVSxDQUFDLFVBQWUsRUFBRSxPQUFZLEVBQUUsaUJBQTBCO1FBQ3RFLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzNFLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxTQUFTLEVBQUUsRUFBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBQyxFQUN4RCxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUMsS0FBSyxFQUFFLFNBQVMsRUFBQyxFQUN2QixHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUMsRUFBRSxFQUFFLFVBQVUsQ0FBQyxRQUFRLEVBQUUsRUFBQyxFQUNyQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUNsRSxDQUNKLENBQ0osQ0FBQztRQUNGLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVELEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxXQUFnQixFQUFFLE1BQWU7UUFDckQsTUFBTSxFQUFFLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3pDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzNFLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxTQUFTLEVBQUUsRUFBQyxFQUFFLEVBQUUsSUFBSSxFQUFDLEVBQ3BDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsU0FBUyxFQUFDLEVBQ3ZCLEdBQUcsQ0FBQyxTQUFTLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFDZixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQzVDLENBQ0osQ0FDSixDQUFDO1FBQ0YsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFZLEVBQUUsT0FBWSxFQUFFLE1BQWU7UUFDMUQsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsdUJBQXVCLENBQUMsT0FBTyxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFDOUYsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsMkJBQTJCLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDeEUsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUVELEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxPQUFlLEVBQUUsT0FBWTtRQUNsRCxNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDaEQsVUFBVSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDOUIsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLFVBQVUsRUFBRTtZQUMzQixFQUFFLEVBQUUsVUFBVSxDQUFDLFFBQVEsRUFBRTtZQUN6QixJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO1NBQ3RFLENBQUMsQ0FBQztRQUNILE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVELEtBQUssQ0FBQyxTQUFTLENBQUMsV0FBZ0IsRUFBRSxNQUFlO1FBQzdDLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxVQUFVLEVBQUU7WUFDdkIsRUFBRSxFQUFFLFdBQVcsQ0FBQyxRQUFRLEVBQUU7WUFDMUIsSUFBSSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRTtZQUNuRSxJQUFJLEVBQUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7U0FDdkMsRUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQzVDLENBQUM7UUFFRixNQUFNLElBQUksQ0FBQyxlQUFlLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLG1DQUFtQyxXQUFXLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFFRCxLQUFLLENBQUMsaUJBQWlCLENBQUMsT0FBWSxFQUFFLE9BQWU7UUFDakQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDM0UsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FDakQsR0FBRyxDQUFDLFNBQVMsRUFBRSxFQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUMsRUFDNUQsR0FBRyxDQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQzlCLENBQ0osQ0FBQztRQUNGLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLGlDQUFpQyxPQUFPLENBQUMsUUFBUSxFQUFFLGlCQUFpQixPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ3pHLENBQUM7SUFFRCxzQkFBc0IsQ0FBQyxNQUFjO1FBQ2pDLElBQUksQ0FBc0IsQ0FBQztRQUMzQixPQUFPLE1BQU0sQ0FBQyxJQUFJLEtBQUssU0FBUztlQUN6QixDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLElBQUk7ZUFDN0MsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFFRCxLQUFLLENBQUMsZUFBZSxDQUFDLE9BQVksRUFBRSxPQUFZLEVBQUUsTUFBZTtRQUM3RCxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsT0FBWSxFQUFFLE9BQVksRUFBRSxNQUFlO1FBQzlELE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFdBQVcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVELEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBWSxFQUFFLE9BQVksRUFBRSxNQUFlO1FBQ3hELE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFdBQVcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVELEtBQUssQ0FBQyxXQUFXLENBQUMsT0FBWSxFQUFFLE9BQVksRUFBRSxNQUFlO1FBQ3pELE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVELEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxZQUFvQixFQUFFLE9BQVksRUFBRSxNQUFlO1FBQzFFLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVELEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxZQUFvQixFQUFFLE9BQVksRUFBRSxNQUFlO1FBQzNFLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVPLG9CQUFvQixDQUFDLE1BQWM7UUFDdkMsT0FBTyxNQUFNLENBQUMsSUFBSSxLQUFLLFVBQVUsSUFBSSxDQUNqQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUM7ZUFDeEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQ3JDLElBQUksSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVPLHdCQUF3QixDQUFDLE1BQWM7UUFDM0MsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFFckMsSUFBSSxVQUFVLEtBQUssT0FBTyxFQUFFO1lBQ3hCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLEdBQUcsTUFBTSxDQUFDLENBQUM7U0FDaEU7UUFFRCxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoRCxNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFbkMsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFNUMsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwQyxNQUFNLGVBQWUsR0FBaUI7WUFDbEMsV0FBVztZQUNYLFdBQVcsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVc7WUFDckMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSTtZQUN2QixJQUFJLEVBQUUsV0FBVyxDQUFDLFFBQVE7U0FDN0IsQ0FBQztRQUVGLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDL0MsTUFBTSxXQUFXLEdBQWEsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pGLE1BQU0sWUFBWSxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakQsSUFBSSxVQUFVLEtBQUssYUFBYSxFQUFFO1lBQzlCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQztZQUNuRCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDO1lBRXBELElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDN0IsSUFBSSxZQUFZLEVBQUU7b0JBQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDcEY7Z0JBQ0QsT0FBTyxJQUFJLENBQUMsNkJBQTZCLENBQUMsZUFBZSxFQUFFLFlBQVksQ0FBQyxDQUFDO2FBQzVFO2lCQUFNLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDcEMsSUFBSSxZQUFZLEVBQUU7b0JBQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDcEY7Z0JBQ0QsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsZUFBZSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDbEY7aUJBQU0sSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNwQyxJQUFJLFlBQVksRUFBRTtvQkFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNwRjtnQkFDRCxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxlQUFlLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQzthQUNsRjtpQkFBTSxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ3BDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxlQUFlLEVBQUUsWUFBWSxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMvRyxJQUFJLE9BQU8sSUFBSSxZQUFZLEVBQUU7b0JBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztpQkFDNUM7Z0JBQ0QsT0FBTyxPQUFPLENBQUM7YUFDbEI7aUJBQU0sSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNwQyxJQUFJLFlBQVksRUFBRTtvQkFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNwRjtnQkFDRCxPQUFPLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxlQUFlLEVBQUUsWUFBWSxDQUFDLENBQUM7YUFDM0U7aUJBQU07Z0JBQ0gsSUFBSSxZQUFZLEVBQUU7b0JBQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDcEY7Z0JBQ0QsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsZUFBZSxFQUFFLFlBQVksQ0FBQyxDQUFDO2FBQ2pFO1NBQ0o7YUFBTSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3BCLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLEVBQUU7Z0JBQy9DLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNsRSxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxlQUFlLEVBQUUsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO2FBQ2xGO2lCQUFNO2dCQUNILE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLGVBQWUsRUFBRSxZQUFZLENBQUMsQ0FBQzthQUNuRTtTQUNKO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVPLGVBQWUsQ0FBQyxPQUFZO1FBQ2hDLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDekIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1AsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUN2RDtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsT0FBWTtRQUN2QyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUU7WUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQ0FBb0MsR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUNyRjtRQUNELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDO1FBQ25FLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFL0YsSUFBSSxRQUFRLEdBQWdCLElBQUksQ0FBQztRQUNqQyxJQUFJO1lBQ0EsUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUN6RDtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsS0FBSyxnQkFBZ0IsRUFBRTtnQkFDNUUsTUFBTSxDQUFDLENBQUM7YUFDWDtTQUNKO1FBRUQsSUFBSTtZQUNBLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLHFCQUFxQixDQUFDLG9CQUFvQixDQUMxRixHQUFHLENBQUMsVUFBVSxFQUFFLEVBQUMsRUFBRSxFQUFFLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBQyxFQUN4QyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQzNCLENBQ0osQ0FBQztZQUNGLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBRWhELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLElBQUksR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDO1lBQ2pDLElBQUksUUFBUSxFQUFFO2dCQUNWLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLFFBQVEsRUFBRSx5QkFBeUIsQ0FBQyxFQUFFLEtBQTJCLENBQUM7Z0JBQ3ZGLElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLFFBQVEsRUFBRSwwQkFBMEIsQ0FBQyxFQUFFLEtBQTJCLElBQUksRUFBRSxDQUFDO2FBQ3hHO1lBRUQsT0FBTyxFQUFDLGdCQUFnQixFQUFFLElBQUksRUFBQyxDQUFDO1NBQ25DO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDUixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMvQyxNQUFNLENBQUMsQ0FBQztTQUNYO0lBQ0wsQ0FBQztJQUVPLGdDQUFnQyxDQUFDLEVBQW9CO1FBQ3pELE9BQU8sRUFBRTthQUNKLFFBQVEsQ0FBQyxPQUFPLEVBQUUsc0JBQXNCLENBQUMsV0FBVyxDQUFDO1lBQ3RELEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQztZQUNyQixFQUFFLE1BQU0sQ0FBZ0IsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDbEMsTUFBTSxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBRS9CLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtnQkFDckQsR0FBRyxDQUFDLElBQUksQ0FBQztvQkFDTCxHQUFHLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQztvQkFDbEIsSUFBSTtvQkFDSixRQUFRLEVBQUUsSUFBSTtpQkFDakIsQ0FBQyxDQUFDO2FBQ047WUFFRCxPQUFPLEdBQUcsQ0FBQztRQUNmLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVPLDRCQUE0QixDQUFDLEVBQW9CO1FBQ3JELE9BQU8sRUFBRTthQUNKLFFBQVEsQ0FBQyxPQUFPLEVBQUUsc0JBQXNCLENBQUMsV0FBVyxDQUFDO1lBQ3RELEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxnQ0FBZ0MsQ0FBVyxDQUFDO0lBQ3RFLENBQUM7SUFFTyxtQkFBbUIsQ0FBQyxNQUFjO1FBQ3RDLE9BQU8sTUFBTSxDQUFDLElBQUksS0FBSyxTQUFTLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssV0FBVyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDO0lBQ25ILENBQUM7SUFFTyx1QkFBdUIsQ0FBQyxhQUFxQixFQUFFLG1CQUE0QjtRQUMvRSxNQUFNLFlBQVksR0FBRyxtQkFBbUIsSUFBSSxhQUFhLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzVFLE1BQU0sUUFBUSxHQUFHLFlBQVksRUFBRSxLQUFLLENBQUMsS0FBSztZQUN0QyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDcEMsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsMkNBQTJDLENBQUM7UUFFN0QsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1AsOEVBQThFO1lBQzlFLDhFQUE4RTtZQUM5RSw4QkFBOEI7WUFDOUIsZ0NBQWdDO1lBQ2hDLDZCQUE2QjtZQUM3QixtREFBbUQ7WUFDbkQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMscUNBQXFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDcEYsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFFRCxNQUFNLE9BQU8sR0FBZ0I7WUFDekIsSUFBSSxFQUFFLGFBQWEsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFO1lBQy9DLFFBQVE7WUFDUixFQUFFLEVBQUUsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzFCLElBQUk7WUFDSixTQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ3ZFLE9BQU8sRUFBRSxDQUFDLENBQUMsWUFBWTtZQUN2QixXQUFXLEVBQUUsbUJBQW1CLElBQUksSUFBSTtTQUMzQyxDQUFDO1FBRUYsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLG9CQUFvQixFQUFFLENBQUM7UUFDeEQsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRTtZQUMvQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1NBQzVFO1FBQ0QsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE9BQU8sRUFBRTtZQUMvQixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzVCO1FBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUU7WUFDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDNUI7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU8sbUJBQW1CLENBQUMsTUFBYztRQUN0QyxPQUFPLE1BQU0sQ0FBQyxJQUFJLEtBQUssU0FBUztlQUN6QixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxXQUFXO2VBQ2pDLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSTtlQUNsQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQztJQUMzQyxDQUFDO0lBRU8sdUJBQXVCLENBQUMsTUFBYyxFQUFFLG1CQUEyQjtRQUN2RSxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNuRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXhDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDUCxNQUFNLElBQUksS0FBSyxDQUFDLHVEQUF1RCxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ2hHO1FBRUQsbUlBQW1JO1FBQ25JLG1CQUFtQjtRQUNuQixnSUFBZ0k7UUFDaEkscUdBQXFHO1FBQ3JHLDhIQUE4SDtRQUM5SCx3RkFBd0Y7UUFDeEYsSUFBSSxtQkFBbUIsRUFBRTtZQUNyQixPQUFPLElBQUksQ0FBQztTQUNmO1FBRUQsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzNELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUV6QyxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU8sMEJBQTBCLENBQUMsTUFBYztRQUM3QyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM1QyxNQUFNLFlBQVksR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFdkUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQztZQUMxQixJQUFJLEVBQUUsWUFBWSxDQUFDLElBQTBCO1lBQzdDLE9BQU8sRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDcEMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsT0FBTyxFQUFFO1lBQ2pELElBQUksRUFBRSxRQUFRLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDdkMsT0FBTyxFQUFFLFlBQVksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFO1NBQ3RELENBQUMsQ0FBQztRQUVILE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTyxLQUFLLENBQUMsY0FBYyxDQUFDLFdBQWdCLEVBQUUsT0FBWSxFQUFFLFdBQXdCLEVBQUUsTUFBZTtRQUNsRyxNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFekUsT0FBTyxNQUFNLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUVPLEtBQUssQ0FBQyxPQUFPLENBQUMsWUFBb0IsRUFBRSxPQUFZLEVBQUUsSUFBVSxFQUFFLE1BQWU7UUFDakYsT0FBTyxNQUFNLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLEVBQUUsRUFBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO0lBQzNGLENBQUM7SUFFTyxLQUFLLENBQUMsdUJBQXVCLENBQUMsV0FBZ0IsRUFBRSxPQUFZO1FBQ2hFLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoRCxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FDdkQsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLFdBQVcsQ0FBQyxRQUFRLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FDN0YsRUFBRSxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFDcEMsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgamlkIGFzIHBhcnNlSmlkLCB4bWwgfSBmcm9tICdAeG1wcC9jbGllbnQnO1xuaW1wb3J0IHsgSklEIH0gZnJvbSAnQHhtcHAvamlkJztcbmltcG9ydCB7IEVsZW1lbnQgfSBmcm9tICdsdHgnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9jb3JlL21lc3NhZ2UnO1xuaW1wb3J0IHsgSXFSZXNwb25zZVN0YW56YSwgU3RhbnphIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vY29yZS9zdGFuemEnO1xuaW1wb3J0IHsgTG9nU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2xvZy5zZXJ2aWNlJztcbmltcG9ydCB7IEFic3RyYWN0U3RhbnphQnVpbGRlciB9IGZyb20gJy4uLy4uL2Fic3RyYWN0LXN0YW56YS1idWlsZGVyJztcbmltcG9ydCB7IFN0YW56YUJ1aWxkZXIgfSBmcm9tICcuLi8uLi9zdGFuemEtYnVpbGRlcic7XG5pbXBvcnQgeyBYbXBwQ2hhdEFkYXB0ZXIgfSBmcm9tICcuLi8uLi94bXBwLWNoYXQtYWRhcHRlci5zZXJ2aWNlJztcbmltcG9ydCB7IEFic3RyYWN0WG1wcFBsdWdpbiB9IGZyb20gJy4uL2Fic3RyYWN0LXhtcHAtcGx1Z2luJztcbmltcG9ydCB7IE1lc3NhZ2VSZWNlaXZlZEV2ZW50IH0gZnJvbSAnLi4vbWVzc2FnZS5wbHVnaW4nO1xuaW1wb3J0IHsgU2VydmljZURpc2NvdmVyeVBsdWdpbiB9IGZyb20gJy4uL3NlcnZpY2UtZGlzY292ZXJ5LnBsdWdpbic7XG5pbXBvcnQgeyBQcmVzZW5jZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL2NvcmUvcHJlc2VuY2UnO1xuaW1wb3J0IHsgUm9vbSB9IGZyb20gJy4vcm9vbSc7XG5pbXBvcnQgeyBBZmZpbGlhdGlvbiwgQWZmaWxpYXRpb25Nb2RpZmljYXRpb24gfSBmcm9tICcuL2FmZmlsaWF0aW9uJztcbmltcG9ydCB7IFJvbGUsIFJvbGVNb2RpZmljYXRpb24gfSBmcm9tICcuL3JvbGUnO1xuaW1wb3J0IHsgUm9vbVVzZXIgfSBmcm9tICcuL3Jvb20tdXNlcic7XG5pbXBvcnQgeyBSb29tT2NjdXBhbnQgfSBmcm9tICcuL3Jvb20tb2NjdXBhbnQnO1xuaW1wb3J0IHsgSW52aXRhdGlvbiB9IGZyb20gJy4vaW52aXRhdGlvbic7XG5pbXBvcnQgeyBSb29tTWVzc2FnZSB9IGZyb20gJy4vcm9vbS1tZXNzYWdlJztcbmltcG9ydCB7XG4gICAgRm9ybSxcbiAgICBGT1JNX05TLFxuICAgIGdldEZpZWxkLFxuICAgIHBhcnNlRm9ybSxcbiAgICBzZXJpYWxpemVUb1N1Ym1pdEZvcm0sXG4gICAgc2V0RmllbGRWYWx1ZSxcbiAgICBUZXh0dWFsRm9ybUZpZWxkLFxufSBmcm9tICcuLi8uLi8uLi8uLi8uLi9jb3JlL2Zvcm0nO1xuaW1wb3J0IHsgWG1wcFJlc3BvbnNlRXJyb3IgfSBmcm9tICcuLi8uLi94bXBwLXJlc3BvbnNlLmVycm9yJztcbmltcG9ydCB7IG11Y05zLCBtdWNBZG1pbk5zLCBtdWNPd25lck5zLCBtdWNSb29tQ29uZmlnRm9ybU5zLCBtdWNVc2VyTnMgfSBmcm9tICcuL211bHRpLXVzZXItY2hhdC1jb25zdGFudHMnO1xuXG4vKipcbiAqIHNlZTpcbiAqIGh0dHBzOi8veG1wcC5vcmcvZXh0ZW5zaW9ucy94ZXAtMDA0NS5odG1sI3Rlcm1zLXJvb21zXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUm9vbUNyZWF0aW9uT3B0aW9ucyBleHRlbmRzIFJvb21Db25maWd1cmF0aW9uIHtcbiAgICAvKipcbiAgICAgKiBUaGUgcm9vbSBpZCB0byBjcmVhdGUgdGhlIHJvb20gd2l0aC4gVGhpcyBpcyB0aGUgYGxvY2FsYCBwYXJ0IG9mIHRoZSByb29tIEpJRC5cbiAgICAgKi9cbiAgICByb29tSWQ6IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBPcHRpb25hbCBuaWNrbmFtZSB0byB1c2UgaW4gdGhlIHJvb20uIEN1cnJlbnQgdXNlcidzIG5pY2tuYW1lIHdpbGwgYmUgdXNlZCBpZiBub3QgcHJvdmlkZWQuXG4gICAgICovXG4gICAgbmljaz86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSb29tQ29uZmlndXJhdGlvbiB7XG4gICAgLyoqXG4gICAgICogT3B0aW9uYWwgbmFtZSBmb3IgdGhlIHJvb20uIElmIG5vbmUgaXMgcHJvdmlkZWQsIHJvb20gd2lsbCBiZSBvbmx5IGlkZW50aWZpZWQgYnkgaXRzIEpJRC5cbiAgICAgKi9cbiAgICBuYW1lPzogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIEEgcm9vbSB0aGF0IGNhbiBiZSBmb3VuZCBieSBhbnkgdXNlciB0aHJvdWdoIG5vcm1hbCBtZWFucyBzdWNoIGFzIHNlYXJjaGluZyBhbmQgc2VydmljZSBkaXNjb3ZlcnlcbiAgICAgKi9cbiAgICBwdWJsaWM/OiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIGZvciB0cnVlOlxuICAgICAqIEEgcm9vbSB0aGF0IGEgdXNlciBjYW5ub3QgZW50ZXIgd2l0aG91dCBiZWluZyBvbiB0aGUgbWVtYmVyIGxpc3QuXG4gICAgICogZm9yIGZhbHNlOlxuICAgICAqIEEgcm9vbSB0aGF0IG5vbi1iYW5uZWQgZW50aXRpZXMgYXJlIGFsbG93ZWQgdG8gZW50ZXIgd2l0aG91dCBiZWluZyBvbiB0aGUgbWVtYmVyIGxpc3QuXG4gICAgICovXG4gICAgbWVtYmVyc09ubHk/OiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIGZvciB0cnVlOlxuICAgICAqIEEgcm9vbSBpbiB3aGljaCBhbiBvY2N1cGFudCdzIGZ1bGwgSklEIGlzIGV4cG9zZWQgdG8gYWxsIG90aGVyIG9jY3VwYW50cyxcbiAgICAgKiBhbHRob3VnaCB0aGUgb2NjdXBhbnQgY2FuIHJlcXVlc3QgYW55IGRlc2lyZWQgcm9vbSBuaWNrbmFtZS5cbiAgICAgKiBmb3IgZmFsc2U6XG4gICAgICogQSByb29tIGluIHdoaWNoIGFuIG9jY3VwYW50J3MgZnVsbCBKSUQgY2FuIGJlIGRpc2NvdmVyZWQgYnkgcm9vbSBtb2RlcmF0b3JzIG9ubHkuXG4gICAgICovXG4gICAgbm9uQW5vbnltb3VzPzogYm9vbGVhbjtcbiAgICAvKipcbiAgICAgKiBmb3IgdHJ1ZTpcbiAgICAgKiBBIHJvb20gdGhhdCBpcyBub3QgZGVzdHJveWVkIGlmIHRoZSBsYXN0IG9jY3VwYW50IGV4aXRzLlxuICAgICAqIGZvciBmYWxzZTpcbiAgICAgKiBBIHJvb20gdGhhdCBpcyBkZXN0cm95ZWQgaWYgdGhlIGxhc3Qgb2NjdXBhbnQgZXhpdHMuXG4gICAgICovXG4gICAgcGVyc2lzdGVudFJvb20/OiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIGFsbG93IGVqYWJiZXJkIE11Y1N1YiBzdWJzY3JpcHRpb25zLlxuICAgICAqIFJvb20gb2NjdXBhbnRzIGFyZSBhbGxvd2VkIHRvIHN1YnNjcmliZSB0byBtZXNzYWdlIG5vdGlmaWNhdGlvbnMgYmVpbmcgYXJjaGl2ZWQgd2hpbGUgdGhleSB3ZXJlIG9mZmxpbmVcbiAgICAgKi9cbiAgICBhbGxvd1N1YnNjcmlwdGlvbj86IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAqIE9ubHkgb2NjdXBhbnRzIHdpdGggXCJ2b2ljZVwiIGNhbiBzZW5kIHB1YmxpYyBtZXNzYWdlcy4gVGhlIGRlZmF1bHQgdmFsdWUgaXMgdHJ1ZS5cbiAgICAqL1xuICAgIG1vZGVyYXRlZD86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUm9vbU1ldGFkYXRhIHtcbiAgICBba2V5OiBzdHJpbmddOiBhbnk7XG59XG5cbmNsYXNzIFF1ZXJ5QWZmaWxpYXRlZE1lbWJlckxpc3RTdGFuemFCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RTdGFuemFCdWlsZGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHJvb21KaWQ6IEpJRCxcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBxdWVyeVR5cGU6ICdhZmZpbGlhdGlvbicgfCAncm9sZScsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgYWZmaWxpYXRpb25PclJvbGU6IEFmZmlsaWF0aW9uIHwgUm9sZSxcbiAgICApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgYnVpbGQocm9vbUppZDogSklELCAuLi5bcXVlcnlUeXBlLCBhZmZpbGlhdGlvbk9yUm9sZV06XG4gICAgICAgIFtxdWVyeVR5cGU6ICdhZmZpbGlhdGlvbicsIGFmZmlsaWF0aW9uOiBBZmZpbGlhdGlvbl0gfCBbcXVlcnlUeXBlOiAncm9sZScsIHJvbGU6IFJvbGVdKTogU3RhbnphIHtcbiAgICAgICAgcmV0dXJuIG5ldyBRdWVyeUFmZmlsaWF0ZWRNZW1iZXJMaXN0U3RhbnphQnVpbGRlcihyb29tSmlkLCBxdWVyeVR5cGUsIGFmZmlsaWF0aW9uT3JSb2xlKS50b1N0YW56YSgpO1xuICAgIH1cblxuICAgIHRvU3RhbnphKCk6IFN0YW56YSB7XG4gICAgICAgIHJldHVybiB4bWwoJ2lxJywge3R5cGU6ICdnZXQnLCB0bzogdGhpcy5yb29tSmlkLnRvU3RyaW5nKCl9LFxuICAgICAgICAgICAgeG1sKCdxdWVyeScsIHt4bWxuczogbXVjQWRtaW5Oc30sXG4gICAgICAgICAgICAgICAgeG1sKCdpdGVtJywge1t0aGlzLnF1ZXJ5VHlwZV06IHRoaXMuYWZmaWxpYXRpb25PclJvbGV9KSxcbiAgICAgICAgICAgICksXG4gICAgICAgICkgYXMgU3RhbnphO1xuICAgIH1cbn1cblxuY2xhc3MgUXVlcnlPY2N1cGFudExpc3RTdGFuemFCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RTdGFuemFCdWlsZGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcm9vbUppZDogSklEKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGJ1aWxkKHJvb21KaWQ6IEpJRCk6IFN0YW56YSB7XG4gICAgICAgIHJldHVybiBuZXcgUXVlcnlPY2N1cGFudExpc3RTdGFuemFCdWlsZGVyKHJvb21KaWQpLnRvU3RhbnphKCk7XG4gICAgfVxuXG4gICAgdG9TdGFuemEoKTogU3RhbnphIHtcbiAgICAgICAgcmV0dXJuIHhtbCgnaXEnLCB7dHlwZTogJ2dldCcsIHRvOiB0aGlzLnJvb21KaWQudG9TdHJpbmcoKX0sXG4gICAgICAgICAgICB4bWwoJ3F1ZXJ5Jywge3htbG5zOiBTZXJ2aWNlRGlzY292ZXJ5UGx1Z2luLkRJU0NPX0lURU1TfSksXG4gICAgICAgICkgYXMgU3RhbnphO1xuICAgIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBSb29tU3VtbWFyeSB7XG4gICAgamlkOiBKSUQ7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIHJvb21JbmZvOiBGb3JtIHwgbnVsbDtcbn1cblxuY2xhc3MgTW9kaWZ5QWZmaWxpYXRpb25zT3JSb2xlc1N0YW56YUJ1aWxkZXIgZXh0ZW5kcyBBYnN0cmFjdFN0YW56YUJ1aWxkZXIge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgcm9vbUppZDogSklELFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IG1vZGlmaWNhdGlvbnM6IHJlYWRvbmx5IChBZmZpbGlhdGlvbk1vZGlmaWNhdGlvbiB8IFJvbGVNb2RpZmljYXRpb24pW10sXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGJ1aWxkKFxuICAgICAgICByb29tSmlkOiBKSUQsXG4gICAgICAgIG1vZGlmaWNhdGlvbnM6IHJlYWRvbmx5IChBZmZpbGlhdGlvbk1vZGlmaWNhdGlvbiB8IFJvbGVNb2RpZmljYXRpb24pW10sXG4gICAgKTogU3RhbnphIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNb2RpZnlBZmZpbGlhdGlvbnNPclJvbGVzU3RhbnphQnVpbGRlcihyb29tSmlkLCBtb2RpZmljYXRpb25zKS50b1N0YW56YSgpO1xuICAgIH1cblxuICAgIHRvU3RhbnphKCk6IFN0YW56YSB7XG4gICAgICAgIHJldHVybiB4bWwoJ2lxJywge3RvOiB0aGlzLnJvb21KaWQudG9TdHJpbmcoKSwgdHlwZTogJ3NldCd9LFxuICAgICAgICAgICAgeG1sKFxuICAgICAgICAgICAgICAgICdxdWVyeScsXG4gICAgICAgICAgICAgICAge3htbG5zOiBtdWNBZG1pbk5zfSxcbiAgICAgICAgICAgICAgICAuLi50aGlzLm1vZGlmaWNhdGlvbnMubWFwKG1vZGlmaWNhdGlvbiA9PiB0aGlzLmJ1aWxkSXRlbShtb2RpZmljYXRpb24pKSxcbiAgICAgICAgICAgICksXG4gICAgICAgICkgYXMgU3RhbnphO1xuICAgIH1cblxuICAgIHByaXZhdGUgYnVpbGRJdGVtKG1vZGlmaWNhdGlvbjogQWZmaWxpYXRpb25Nb2RpZmljYXRpb24gfCBSb2xlTW9kaWZpY2F0aW9uKTogRWxlbWVudCB7XG4gICAgICAgIGNvbnN0IHtyZWFzb24sIC4uLmF0dHJzfSA9IG1vZGlmaWNhdGlvbjtcbiAgICAgICAgcmV0dXJuIHhtbChcbiAgICAgICAgICAgICdpdGVtJyxcbiAgICAgICAgICAgICd1c2VySmlkJyBpbiBhdHRyc1xuICAgICAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgICAgICBqaWQ6IGF0dHJzLnVzZXJKaWQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgYWZmaWxpYXRpb246IGF0dHJzLmFmZmlsaWF0aW9uLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICAgICAgbmljazogYXR0cnMubmljayxcbiAgICAgICAgICAgICAgICAgICAgcm9sZTogYXR0cnMucm9sZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVhc29uID8geG1sKCdyZWFzb24nLCB7fSwgcmVhc29uKSA6IG51bGwsXG4gICAgICAgICk7XG4gICAgfVxufVxuXG4vKipcbiAqIFRoZSBNdWx0aVVzZXJDaGF0UGx1Z2luIHRyaWVzIHRvIHByb3ZpZGUgdGhlIG5lY2Vzc2FyeSBmdW5jdGlvbmFsaXR5IGZvciBhIG11bHRpLXVzZXIgdGV4dCBjaGF0LFxuICogd2hlcmVieSBtdWx0aXBsZSBYTVBQIHVzZXJzIGNhbiBleGNoYW5nZSBtZXNzYWdlcyBpbiB0aGUgY29udGV4dCBvZiBhIHJvb20gb3IgY2hhbm5lbCwgc2ltaWxhciB0byBJbnRlcm5ldCBSZWxheSBDaGF0IChJUkMpLlxuICogRm9yIG1vcmUgZGV0YWlscyBzZWU6XG4gKiBAc2VlIGh0dHBzOi8veG1wcC5vcmcvZXh0ZW5zaW9ucy94ZXAtMDA0NS5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBNdWx0aVVzZXJDaGF0UGx1Z2luIGV4dGVuZHMgQWJzdHJhY3RYbXBwUGx1Z2luIHtcbiAgICByZWFkb25seSByb29tcyQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFJvb21bXT4oW10pO1xuICAgIHJlYWRvbmx5IG1lc3NhZ2UkID0gbmV3IFN1YmplY3Q8Um9vbT4oKTtcblxuICAgIHByaXZhdGUgb25JbnZpdGF0aW9uU3ViamVjdCA9IG5ldyBTdWJqZWN0PEludml0YXRpb24+KCk7XG4gICAgcmVhZG9ubHkgb25JbnZpdGF0aW9uJCA9IHRoaXMub25JbnZpdGF0aW9uU3ViamVjdC5hc09ic2VydmFibGUoKTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHhtcHBDaGF0QWRhcHRlcjogWG1wcENoYXRBZGFwdGVyLFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGxvZ1NlcnZpY2U6IExvZ1NlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgc2VydmljZURpc2NvdmVyeVBsdWdpbjogU2VydmljZURpc2NvdmVyeVBsdWdpbixcbiAgICApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBvbk9mZmxpbmUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucm9vbXMkLm5leHQoW10pO1xuICAgIH1cblxuICAgIGhhbmRsZVN0YW56YShzdGFuemE6IFN0YW56YSwgYXJjaGl2ZURlbGF5RWxlbWVudD86IFN0YW56YSk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5pc1Jvb21QcmVzZW5jZVN0YW56YShzdGFuemEpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVSb29tUHJlc2VuY2VTdGFuemEoc3RhbnphKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzUm9vbU1lc3NhZ2VTdGFuemEoc3RhbnphKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlUm9vbU1lc3NhZ2VTdGFuemEoc3RhbnphLCBhcmNoaXZlRGVsYXlFbGVtZW50KTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzUm9vbVN1YmplY3RTdGFuemEoc3RhbnphKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlUm9vbVN1YmplY3RTdGFuemEoc3RhbnphLCBhcmNoaXZlRGVsYXlFbGVtZW50KTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzUm9vbUludml0YXRpb25TdGFuemEoc3RhbnphKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlUm9vbUludml0YXRpb25TdGFuemEoc3RhbnphKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzb2x2ZXMgaWYgcm9vbSBjb3VsZCBiZSBjb25maWd1cmVkIGFzIHJlcXVlc3RlZCwgcmVqZWN0cyBpZiByb29tIGRpZCBleGlzdCBvciBzZXJ2ZXIgZGlkIG5vdCBhY2NlcHQgY29uZmlndXJhdGlvbi5cbiAgICAgKi9cbiAgICBhc3luYyBjcmVhdGVSb29tKG9wdGlvbnM6IFJvb21DcmVhdGlvbk9wdGlvbnMpOiBQcm9taXNlPFJvb20+IHtcbiAgICAgICAgY29uc3Qge3Jvb21JZCwgbmlja30gPSBvcHRpb25zO1xuICAgICAgICBjb25zdCBzZXJ2aWNlID0gYXdhaXQgdGhpcy5zZXJ2aWNlRGlzY292ZXJ5UGx1Z2luLmZpbmRTZXJ2aWNlKCdjb25mZXJlbmNlJywgJ3RleHQnKTtcbiAgICAgICAgY29uc3Qgb2NjdXBhbnRKaWQgPSBwYXJzZUppZChyb29tSWQsIHNlcnZpY2UuamlkLCBuaWNrKTtcbiAgICAgICAgY29uc3Qge3ByZXNlbmNlUmVzcG9uc2UsIHJvb219ID0gYXdhaXQgdGhpcy5qb2luUm9vbUludGVybmFsKG9jY3VwYW50SmlkKTtcblxuICAgICAgICBjb25zdCBpdGVtRWxlbWVudCA9IHByZXNlbmNlUmVzcG9uc2UuZ2V0Q2hpbGQoJ3gnKS5nZXRDaGlsZCgnaXRlbScpO1xuICAgICAgICBpZiAoaXRlbUVsZW1lbnQuYXR0cnMuYWZmaWxpYXRpb24gIT09IEFmZmlsaWF0aW9uLm93bmVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Vycm9yIGNyZWF0aW5nIHJvb20sIHVzZXIgaXMgbm90IG93bmVyOiAnICsgcHJlc2VuY2VSZXNwb25zZS50b1N0cmluZygpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmFwcGx5Um9vbUNvbmZpZ3VyYXRpb24ocm9vbS5yb29tSmlkLCBvcHRpb25zKTtcbiAgICAgICAgICAgIHJvb20ubmFtZSA9IG9wdGlvbnMubmFtZSB8fCB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLnJvb21zJC5uZXh0KHRoaXMucm9vbXMkLmdldFZhbHVlKCkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ1NlcnZpY2UuZXJyb3IoJ3Jvb20gY29uZmlndXJhdGlvbiByZWplY3RlZCcsIGUpO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByb29tO1xuICAgIH1cblxuICAgIGFzeW5jIGRlc3Ryb3lSb29tKHJvb21KaWQ6IEpJRCk6IFByb21pc2U8SXFSZXNwb25zZVN0YW56YTwncmVzdWx0Jz4+IHtcbiAgICAgICAgbGV0IHJvb21EZXN0cm95ZWRSZXNwb25zZTogSXFSZXNwb25zZVN0YW56YTwncmVzdWx0Jz47XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByb29tRGVzdHJveWVkUmVzcG9uc2UgPSBhd2FpdCB0aGlzLnhtcHBDaGF0QWRhcHRlci5jaGF0Q29ubmVjdGlvblNlcnZpY2Uuc2VuZElxKFxuICAgICAgICAgICAgICAgIHhtbCgnaXEnLCB7dHlwZTogJ3NldCcsIHRvOiByb29tSmlkLnRvU3RyaW5nKCl9LFxuICAgICAgICAgICAgICAgICAgICB4bWwoJ3F1ZXJ5Jywge3htbG5zOiBtdWNPd25lck5zfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHhtbCgnZGVzdHJveScpKSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ1NlcnZpY2UuZXJyb3IoJ2Vycm9yIGRlc3Ryb3lpbmcgcm9vbScpO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE86IHJlZmFjdG9yIHNvIHRoYXQgd2UgaW5zdGVhZCBsaXN0ZW4gdG8gdGhlIHByZXNlbmNlIGRlc3Ryb3kgc3RhbnphXG4gICAgICAgIGNvbnN0IGFsbFJvb21zV2l0aG91dERlc3Ryb3llZFJvb20gPSB0aGlzLnJvb21zJC5nZXRWYWx1ZSgpLmZpbHRlcihcbiAgICAgICAgICAgIHJvb20gPT4gIXJvb20ucm9vbUppZC5lcXVhbHMocm9vbUppZCksXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5yb29tcyQubmV4dChhbGxSb29tc1dpdGhvdXREZXN0cm95ZWRSb29tKTtcblxuICAgICAgICByZXR1cm4gcm9vbURlc3Ryb3llZFJlc3BvbnNlO1xuICAgIH1cblxuICAgIGFzeW5jIGpvaW5Sb29tKG9jY3VwYW50SmlkOiBKSUQpOiBQcm9taXNlPFJvb20+IHtcbiAgICAgICAgY29uc3Qge3Jvb219ID0gYXdhaXQgdGhpcy5qb2luUm9vbUludGVybmFsKG9jY3VwYW50SmlkKTtcbiAgICAgICAgdGhpcy5yb29tcyQubmV4dCh0aGlzLnJvb21zJC5nZXRWYWx1ZSgpKTtcbiAgICAgICAgcmV0dXJuIHJvb207XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0Um9vbUluZm8ocm9vbUppZDogSklEKTogUHJvbWlzZTxGb3JtIHwgbnVsbD4ge1xuICAgICAgICBjb25zdCByb29tSW5mb1Jlc3BvbnNlID0gYXdhaXQgdGhpcy54bXBwQ2hhdEFkYXB0ZXIuY2hhdENvbm5lY3Rpb25TZXJ2aWNlLnNlbmRJcShcbiAgICAgICAgICAgIHhtbCgnaXEnLCB7dHlwZTogJ2dldCcsIHRvOiByb29tSmlkLnRvU3RyaW5nKCl9LFxuICAgICAgICAgICAgICAgIHhtbCgncXVlcnknLCB7eG1sbnM6IFNlcnZpY2VEaXNjb3ZlcnlQbHVnaW4uRElTQ09fSU5GT30pLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgZm9ybUVsID0gcm9vbUluZm9SZXNwb25zZVxuICAgICAgICAgICAgLmdldENoaWxkKCdxdWVyeScsIFNlcnZpY2VEaXNjb3ZlcnlQbHVnaW4uRElTQ09fSU5GTylcbiAgICAgICAgICAgID8uZ2V0Q2hpbGQoJ3gnLCBGT1JNX05TKTtcblxuICAgICAgICBpZiAoZm9ybUVsKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VGb3JtKGZvcm1FbCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBhc3luYyBxdWVyeUFsbFJvb21zKCk6IFByb21pc2U8Um9vbVN1bW1hcnlbXT4ge1xuICAgICAgICBjb25zdCBjb25mZXJlbmNlU2VydmVyID0gYXdhaXQgdGhpcy5zZXJ2aWNlRGlzY292ZXJ5UGx1Z2luLmZpbmRTZXJ2aWNlKCdjb25mZXJlbmNlJywgJ3RleHQnKTtcbiAgICAgICAgY29uc3QgdG8gPSBjb25mZXJlbmNlU2VydmVyLmppZC50b1N0cmluZygpO1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUm9vbVN1bW1hcnlbXSA9IFtdO1xuXG4gICAgICAgIGxldCByb29tUXVlcnlSZXNwb25zZSA9IGF3YWl0IHRoaXMueG1wcENoYXRBZGFwdGVyLmNoYXRDb25uZWN0aW9uU2VydmljZS5zZW5kSXEoXG4gICAgICAgICAgICB4bWwoJ2lxJywge3R5cGU6ICdnZXQnLCB0b30sXG4gICAgICAgICAgICAgICAgeG1sKCdxdWVyeScsIHt4bWxuczogU2VydmljZURpc2NvdmVyeVBsdWdpbi5ESVNDT19JVEVNU30pLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICAgICAgcmVzdWx0LnB1c2goLi4udGhpcy5leHRyYWN0Um9vbVN1bW1hcmllc0Zyb21SZXNwb25zZShyb29tUXVlcnlSZXNwb25zZSkpO1xuXG4gICAgICAgIGxldCByZXN1bHRTZXQgPSB0aGlzLmV4dHJhY3RSZXN1bHRTZXRGcm9tUmVzcG9uc2Uocm9vbVF1ZXJ5UmVzcG9uc2UpO1xuICAgICAgICB3aGlsZSAocmVzdWx0U2V0ICYmIHJlc3VsdFNldC5nZXRDaGlsZCgnbGFzdCcpKSB7XG4gICAgICAgICAgICBjb25zdCBsYXN0UmVjZWl2ZWRSb29tID0gcmVzdWx0U2V0LmdldENoaWxkVGV4dCgnbGFzdCcpO1xuICAgICAgICAgICAgcm9vbVF1ZXJ5UmVzcG9uc2UgPSBhd2FpdCB0aGlzLnhtcHBDaGF0QWRhcHRlci5jaGF0Q29ubmVjdGlvblNlcnZpY2Uuc2VuZElxKFxuICAgICAgICAgICAgICAgIHhtbCgnaXEnLCB7dHlwZTogJ2dldCcsIHRvfSxcbiAgICAgICAgICAgICAgICAgICAgeG1sKCdxdWVyeScsIHt4bWxuczogU2VydmljZURpc2NvdmVyeVBsdWdpbi5ESVNDT19JVEVNU30sXG4gICAgICAgICAgICAgICAgICAgICAgICB4bWwoJ3NldCcsIHt4bWxuczogJ2h0dHA6Ly9qYWJiZXIub3JnL3Byb3RvY29sL3JzbSd9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhtbCgnbWF4Jywge30sICcyNTAnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4bWwoJ2FmdGVyJywge30sIGxhc3RSZWNlaXZlZFJvb20pLFxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKC4uLnRoaXMuZXh0cmFjdFJvb21TdW1tYXJpZXNGcm9tUmVzcG9uc2Uocm9vbVF1ZXJ5UmVzcG9uc2UpKTtcbiAgICAgICAgICAgIHJlc3VsdFNldCA9IHRoaXMuZXh0cmFjdFJlc3VsdFNldEZyb21SZXNwb25zZShyb29tUXVlcnlSZXNwb25zZSk7XG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIHJlc3VsdC5tYXAoYXN5bmMgKHN1bW1hcnkpID0+IHtcbiAgICAgICAgICAgICAgICBzdW1tYXJ5LnJvb21JbmZvID0gYXdhaXQgdGhpcy5nZXRSb29tSW5mbyhzdW1tYXJ5LmppZCk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBhbGwgbWVtYmVycyBvZiBhIE1VQy1Sb29tIHdpdGggdGhlaXIgYWZmaWxpYXRpb24gdG8gdGhlIHJvb20gdXNpbmcgdGhlIHJvb21zIGZ1bGxKaWRcbiAgICAgKiBAcGFyYW0gcm9vbUppZCBqaWQgb2YgdGhlIHJvb21cbiAgICAgKi9cbiAgICBhc3luYyBxdWVyeVVzZXJMaXN0KHJvb21KaWQ6IEpJRCk6IFByb21pc2U8Um9vbVVzZXJbXT4ge1xuICAgICAgICBjb25zdCBtZW1iZXJRdWVyeVJlc3BvbnNlcyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIC4uLk9iamVjdFxuICAgICAgICAgICAgICAgICAgICAudmFsdWVzKEFmZmlsaWF0aW9uKVxuICAgICAgICAgICAgICAgICAgICAubWFwKGFmZmlsaWF0aW9uID0+XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnhtcHBDaGF0QWRhcHRlci5jaGF0Q29ubmVjdGlvblNlcnZpY2Uuc2VuZElxKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFF1ZXJ5QWZmaWxpYXRlZE1lbWJlckxpc3RTdGFuemFCdWlsZGVyLmJ1aWxkKHJvb21KaWQsICdhZmZpbGlhdGlvbicsIGFmZmlsaWF0aW9uKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgLi4uT2JqZWN0XG4gICAgICAgICAgICAgICAgICAgIC52YWx1ZXMoUm9sZSlcbiAgICAgICAgICAgICAgICAgICAgLm1hcChyb2xlID0+XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnhtcHBDaGF0QWRhcHRlci5jaGF0Q29ubmVjdGlvblNlcnZpY2Uuc2VuZElxKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFF1ZXJ5QWZmaWxpYXRlZE1lbWJlckxpc3RTdGFuemFCdWlsZGVyLmJ1aWxkKHJvb21KaWQsICdyb2xlJywgcm9sZSksXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgbWVtYmVycyA9IG5ldyBNYXA8c3RyaW5nLCBSb29tVXNlcj4oKTtcbiAgICAgICAgZm9yIChjb25zdCBtZW1iZXJRdWVyeVJlc3BvbnNlIG9mIG1lbWJlclF1ZXJ5UmVzcG9uc2VzKSB7XG4gICAgICAgICAgICBtZW1iZXJRdWVyeVJlc3BvbnNlXG4gICAgICAgICAgICAgICAgLmdldENoaWxkKCdxdWVyeScsIG11Y0FkbWluTnMpXG4gICAgICAgICAgICAgICAgLmdldENoaWxkcmVuKCdpdGVtJylcbiAgICAgICAgICAgICAgICAuZm9yRWFjaCgobWVtYmVySXRlbTogRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB1c2VySmlkID0gcGFyc2VKaWQobWVtYmVySXRlbS5hdHRycy5qaWQpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByb29tVXNlciA9IG1lbWJlcnMuZ2V0KHVzZXJKaWQuYmFyZSgpLnRvU3RyaW5nKCkpIHx8IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJZGVudGlmaWVyczogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBhZmZpbGlhdGlvbjogQWZmaWxpYXRpb24ubm9uZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvbGU6IFJvbGUubm9uZSxcbiAgICAgICAgICAgICAgICAgICAgfSBhcyBSb29tVXNlcjtcbiAgICAgICAgICAgICAgICAgICAgcm9vbVVzZXIudXNlcklkZW50aWZpZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlckppZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5pY2s6IG1lbWJlckl0ZW0uYXR0cnMubmljayAmJiBtZW1iZXJJdGVtLmF0dHJzLm5pY2ssXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZSBuby11bnVzZWQtZXhwcmVzc2lvblxuICAgICAgICAgICAgICAgICAgICBtZW1iZXJJdGVtLmF0dHJzLmFmZmlsaWF0aW9uICYmIChyb29tVXNlci5hZmZpbGlhdGlvbiA9IG1lbWJlckl0ZW0uYXR0cnMuYWZmaWxpYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBtZW1iZXJJdGVtLmF0dHJzLnJvbGUgJiYgKHJvb21Vc2VyLnJvbGUgPSBtZW1iZXJJdGVtLmF0dHJzLnJvbGUpO1xuICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZW5hYmxlIG5vLXVudXNlZC1leHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgIG1lbWJlcnMuc2V0KHVzZXJKaWQuYmFyZSgpLnRvU3RyaW5nKCksIHJvb21Vc2VyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbLi4ubWVtYmVycy52YWx1ZXMoKV07XG4gICAgfVxuXG4gICAgYXN5bmMgbW9kaWZ5QWZmaWxpYXRpb25PclJvbGUocm9vbUppZDogSklELCBtb2RpZmljYXRpb246IEFmZmlsaWF0aW9uTW9kaWZpY2F0aW9uIHwgUm9sZU1vZGlmaWNhdGlvbik6IFByb21pc2U8SXFSZXNwb25zZVN0YW56YT4ge1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy54bXBwQ2hhdEFkYXB0ZXIuY2hhdENvbm5lY3Rpb25TZXJ2aWNlLnNlbmRJcShcbiAgICAgICAgICAgIE1vZGlmeUFmZmlsaWF0aW9uc09yUm9sZXNTdGFuemFCdWlsZGVyLmJ1aWxkKHJvb21KaWQsIFttb2RpZmljYXRpb25dKSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBhc3luYyBzZW5kTWVzc2FnZShyb29tOiBSb29tLCBib2R5OiBzdHJpbmcsIHRocmVhZD86IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBmcm9tID0gdGhpcy54bXBwQ2hhdEFkYXB0ZXIuY2hhdENvbm5lY3Rpb25TZXJ2aWNlLnVzZXJKaWQudG9TdHJpbmcoKTtcbiAgICAgICAgY29uc3Qgcm9vbUppZCA9IHJvb20ucm9vbUppZC50b1N0cmluZygpO1xuICAgICAgICBjb25zdCByb29tTWVzc2FnZVN0YW56YSA9XG4gICAgICAgICAgICB0aHJlYWRcbiAgICAgICAgICAgICAgICA/IFN0YW56YUJ1aWxkZXIuYnVpbGRSb29tTWVzc2FnZVdpdGhUaHJlYWQoZnJvbSwgcm9vbUppZCwgYm9keSwgdGhyZWFkKVxuICAgICAgICAgICAgICAgIDogU3RhbnphQnVpbGRlci5idWlsZFJvb21NZXNzYWdlV2l0aEJvZHkoZnJvbSwgcm9vbUppZCwgYm9keSk7XG5cbiAgICAgICAgZm9yIChjb25zdCBwbHVnaW4gb2YgdGhpcy54bXBwQ2hhdEFkYXB0ZXIucGx1Z2lucykge1xuICAgICAgICAgICAgcGx1Z2luLmJlZm9yZVNlbmRNZXNzYWdlKHJvb21NZXNzYWdlU3RhbnphKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnhtcHBDaGF0QWRhcHRlci5jaGF0Q29ubmVjdGlvblNlcnZpY2Uuc2VuZChyb29tTWVzc2FnZVN0YW56YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmVxdWVzdHMgYSBjb25maWd1cmF0aW9uIGZvcm0gZm9yIGEgcm9vbSB3aGljaCByZXR1cm5zIHdpdGggdGhlIGRlZmF1bHQgdmFsdWVzXG4gICAgICogZm9yIGFuIGV4YW1wbGUgc2VlOlxuICAgICAqIGh0dHBzOi8veG1wcC5vcmcvZXh0ZW5zaW9ucy94ZXAtMDA0NS5odG1sI3JlZ2lzdHJhci1mb3JtdHlwZS1vd25lclxuICAgICAqL1xuICAgIGFzeW5jIGdldFJvb21Db25maWd1cmF0aW9uKHJvb21KaWQ6IEpJRCk6IFByb21pc2U8Rm9ybT4ge1xuICAgICAgICBjb25zdCBjb25maWd1cmF0aW9uRm9ybSA9IGF3YWl0IHRoaXMueG1wcENoYXRBZGFwdGVyLmNoYXRDb25uZWN0aW9uU2VydmljZS5zZW5kSXEoXG4gICAgICAgICAgICB4bWwoJ2lxJywge3R5cGU6ICdnZXQnLCB0bzogcm9vbUppZC50b1N0cmluZygpfSxcbiAgICAgICAgICAgICAgICB4bWwoJ3F1ZXJ5Jywge3htbG5zOiBtdWNPd25lck5zfSksXG4gICAgICAgICAgICApLFxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IGZvcm1FbGVtZW50ID0gY29uZmlndXJhdGlvbkZvcm0uZ2V0Q2hpbGQoJ3F1ZXJ5JykuZ2V0Q2hpbGQoJ3gnLCBGT1JNX05TKTtcbiAgICAgICAgaWYgKCFmb3JtRWxlbWVudCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdyb29tIG5vdCBjb25maWd1cmFibGUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYXJzZUZvcm0oZm9ybUVsZW1lbnQpO1xuICAgIH1cblxuICAgIGFzeW5jIGFwcGx5Um9vbUNvbmZpZ3VyYXRpb24ocm9vbUppZDogSklELCByb29tQ29uZmlndXJhdGlvbjogUm9vbUNvbmZpZ3VyYXRpb24pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3Qgcm9vbUNvbmZpZ0Zvcm0gPSBhd2FpdCB0aGlzLmdldFJvb21Db25maWd1cmF0aW9uKHJvb21KaWQpO1xuXG4gICAgICAgIGNvbnN0IGZvcm1UeXBlRmllbGQgPSBnZXRGaWVsZChyb29tQ29uZmlnRm9ybSwgJ0ZPUk1fVFlQRScpIGFzIFRleHR1YWxGb3JtRmllbGQgfCB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChmb3JtVHlwZUZpZWxkLnZhbHVlICE9PSBtdWNSb29tQ29uZmlnRm9ybU5zKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHVuZXhwZWN0ZWQgZm9ybSB0eXBlIGZvciByb29tIGNvbmZpZ3VyYXRpb24gZm9ybTogZm9ybVR5cGU9JHtmb3JtVHlwZUZpZWxkLnZhbHVlfSwgZm9ybVR5cGVGaWVsZD0ke0pTT04uc3RyaW5naWZ5KGZvcm1UeXBlRmllbGQpfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiByb29tQ29uZmlndXJhdGlvbi5uYW1lID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgc2V0RmllbGRWYWx1ZShyb29tQ29uZmlnRm9ybSwgJ3RleHQtc2luZ2xlJywgJ211YyNyb29tY29uZmlnX3Jvb21uYW1lJywgcm9vbUNvbmZpZ3VyYXRpb24ubmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiByb29tQ29uZmlndXJhdGlvbi5ub25Bbm9ueW1vdXMgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgc2V0RmllbGRWYWx1ZShcbiAgICAgICAgICAgICAgICByb29tQ29uZmlnRm9ybSxcbiAgICAgICAgICAgICAgICAnbGlzdC1zaW5nbGUnLFxuICAgICAgICAgICAgICAgICdtdWMjcm9vbWNvbmZpZ193aG9pcycsXG4gICAgICAgICAgICAgICAgcm9vbUNvbmZpZ3VyYXRpb24ubm9uQW5vbnltb3VzID8gJ2FueW9uZScgOiAnbW9kZXJhdG9ycycsXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygcm9vbUNvbmZpZ3VyYXRpb24ucHVibGljID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHNldEZpZWxkVmFsdWUocm9vbUNvbmZpZ0Zvcm0sICdib29sZWFuJywgJ211YyNyb29tY29uZmlnX3B1YmxpY3Jvb20nLCByb29tQ29uZmlndXJhdGlvbi5wdWJsaWMpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygcm9vbUNvbmZpZ3VyYXRpb24ubWVtYmVyc09ubHkgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgc2V0RmllbGRWYWx1ZShyb29tQ29uZmlnRm9ybSwgJ2Jvb2xlYW4nLCAnbXVjI3Jvb21jb25maWdfbWVtYmVyc29ubHknLCByb29tQ29uZmlndXJhdGlvbi5tZW1iZXJzT25seSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiByb29tQ29uZmlndXJhdGlvbi5wZXJzaXN0ZW50Um9vbSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICBzZXRGaWVsZFZhbHVlKHJvb21Db25maWdGb3JtLCAnYm9vbGVhbicsICdtdWMjcm9vbWNvbmZpZ19wZXJzaXN0ZW50cm9vbScsIHJvb21Db25maWd1cmF0aW9uLnBlcnNpc3RlbnRSb29tKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHJvb21Db25maWd1cmF0aW9uLmFsbG93U3Vic2NyaXB0aW9uID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHNldEZpZWxkVmFsdWUocm9vbUNvbmZpZ0Zvcm0sICdib29sZWFuJywgJ2FsbG93X3N1YnNjcmlwdGlvbicsIHJvb21Db25maWd1cmF0aW9uLmFsbG93U3Vic2NyaXB0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IHRoaXMueG1wcENoYXRBZGFwdGVyLmNoYXRDb25uZWN0aW9uU2VydmljZS5zZW5kSXEoXG4gICAgICAgICAgICB4bWwoJ2lxJywge3R5cGU6ICdzZXQnLCB0bzogcm9vbUppZC50b1N0cmluZygpfSxcbiAgICAgICAgICAgICAgICB4bWwoJ3F1ZXJ5Jywge3htbG5zOiBtdWNPd25lck5zfSxcbiAgICAgICAgICAgICAgICAgICAgc2VyaWFsaXplVG9TdWJtaXRGb3JtKHJvb21Db25maWdGb3JtKSxcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBnZXRSb29tQnlKaWQoamlkOiBKSUQpOiBSb29tIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucm9vbXMkLmdldFZhbHVlKCkuZmluZChyb29tID0+IHJvb20ucm9vbUppZC5lcXVhbHMoamlkLmJhcmUoKSkpO1xuICAgIH1cblxuICAgIGFzeW5jIGJhblVzZXIob2NjdXBhbnRKaWQ6IEpJRCwgcm9vbUppZDogSklELCByZWFzb24/OiBzdHJpbmcpOiBQcm9taXNlPElxUmVzcG9uc2VTdGFuemE+IHtcbiAgICAgICAgY29uc3QgdXNlckppZCA9IGF3YWl0IHRoaXMuZ2V0VXNlckppZEJ5T2NjdXBhbnRKaWQob2NjdXBhbnRKaWQsIHJvb21KaWQpO1xuXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5tb2RpZnlBZmZpbGlhdGlvbk9yUm9sZShyb29tSmlkLCB7XG4gICAgICAgICAgICB1c2VySmlkOiB1c2VySmlkLmJhcmUoKSxcbiAgICAgICAgICAgIGFmZmlsaWF0aW9uOiBBZmZpbGlhdGlvbi5vdXRjYXN0LFxuICAgICAgICAgICAgcmVhc29uLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5sb2dTZXJ2aWNlLmRlYnVnKGBiYW4gcmVzcG9uc2UgJHtyZXNwb25zZS50b1N0cmluZygpfWApO1xuXG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9XG5cbiAgICBhc3luYyB1bmJhblVzZXIob2NjdXBhbnRKaWQ6IEpJRCwgcm9vbUppZDogSklEKTogUHJvbWlzZTxJcVJlc3BvbnNlU3RhbnphPiB7XG4gICAgICAgIGNvbnN0IHVzZXJKaWQgPSBhd2FpdCB0aGlzLmdldFVzZXJKaWRCeU9jY3VwYW50SmlkKG9jY3VwYW50SmlkLCByb29tSmlkKTtcblxuICAgICAgICBjb25zdCBiYW5MaXN0ID0gKGF3YWl0IHRoaXMuZ2V0QmFuTGlzdChyb29tSmlkKSkubWFwKGJhbm5lZFVzZXIgPT4gYmFubmVkVXNlci51c2VySmlkKTtcbiAgICAgICAgdGhpcy5sb2dTZXJ2aWNlLmRlYnVnKGBiYW4gbGlzdDogJHtKU09OLnN0cmluZ2lmeShiYW5MaXN0KX1gKTtcblxuICAgICAgICBpZiAoIWJhbkxpc3QuZmluZChiYW5uZWRKaWQgPT4gYmFubmVkSmlkLmVxdWFscyh1c2VySmlkKSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgZXJyb3IgdW5iYW5uaW5nOiAke3VzZXJKaWR9IGlzbid0IG9uIHRoZSBiYW4gbGlzdGApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLm1vZGlmeUFmZmlsaWF0aW9uT3JSb2xlKHJvb21KaWQsIHt1c2VySmlkLCBhZmZpbGlhdGlvbjogQWZmaWxpYXRpb24ubm9uZX0pO1xuICAgICAgICB0aGlzLmxvZ1NlcnZpY2UuZGVidWcoJ3VuYmFuIHJlc3BvbnNlOiAnICsgcmVzcG9uc2UudG9TdHJpbmcoKSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH1cblxuICAgIGFzeW5jIGdldEJhbkxpc3Qocm9vbUppZDogSklEKTogUHJvbWlzZTxBZmZpbGlhdGlvbk1vZGlmaWNhdGlvbltdPiB7XG4gICAgICAgIGNvbnN0IGlxID0geG1sKCdpcScsIHt0bzogcm9vbUppZC50b1N0cmluZygpLCB0eXBlOiAnZ2V0J30sXG4gICAgICAgICAgICB4bWwoJ3F1ZXJ5Jywge3htbG5zOiBtdWNBZG1pbk5zfSxcbiAgICAgICAgICAgICAgICB4bWwoJ2l0ZW0nLCB7YWZmaWxpYXRpb246IEFmZmlsaWF0aW9uLm91dGNhc3R9KSxcbiAgICAgICAgICAgICksXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy54bXBwQ2hhdEFkYXB0ZXIuY2hhdENvbm5lY3Rpb25TZXJ2aWNlLnNlbmRJcShpcSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmdldENoaWxkKCdxdWVyeScpLmdldENoaWxkcmVuKCdpdGVtJykubWFwKGl0ZW0gPT4gKHtcbiAgICAgICAgICAgIHVzZXJKaWQ6IHBhcnNlSmlkKGl0ZW0uYXR0cnMuamlkKSxcbiAgICAgICAgICAgIGFmZmlsaWF0aW9uOiBpdGVtLmF0dHJzLmFmZmlsaWF0aW9uLFxuICAgICAgICAgICAgcmVhc29uOiBpdGVtLmdldENoaWxkKCdyZWFzb24nKT8uZ2V0VGV4dCgpLFxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgYXN5bmMgaW52aXRlVXNlcihpbnZpdGVlSmlkOiBKSUQsIHJvb21KaWQ6IEpJRCwgaW52aXRhdGlvbk1lc3NhZ2U/OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgZnJvbSA9IHRoaXMueG1wcENoYXRBZGFwdGVyLmNoYXRDb25uZWN0aW9uU2VydmljZS51c2VySmlkLnRvU3RyaW5nKCk7XG4gICAgICAgIGNvbnN0IHN0YW56YSA9IHhtbCgnbWVzc2FnZScsIHt0bzogcm9vbUppZC50b1N0cmluZygpLCBmcm9tfSxcbiAgICAgICAgICAgIHhtbCgneCcsIHt4bWxuczogbXVjVXNlck5zfSxcbiAgICAgICAgICAgICAgICB4bWwoJ2ludml0ZScsIHt0bzogaW52aXRlZUppZC50b1N0cmluZygpfSxcbiAgICAgICAgICAgICAgICAgICAgaW52aXRhdGlvbk1lc3NhZ2UgPyB4bWwoJ3JlYXNvbicsIHt9LCBpbnZpdGF0aW9uTWVzc2FnZSkgOiBudWxsLFxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICApLFxuICAgICAgICApO1xuICAgICAgICBhd2FpdCB0aGlzLnhtcHBDaGF0QWRhcHRlci5jaGF0Q29ubmVjdGlvblNlcnZpY2Uuc2VuZChzdGFuemEpO1xuICAgIH1cblxuICAgIGFzeW5jIGRlY2xpbmVSb29tSW52aXRlKG9jY3VwYW50SmlkOiBKSUQsIHJlYXNvbj86IHN0cmluZykge1xuICAgICAgICBjb25zdCB0byA9IG9jY3VwYW50SmlkLmJhcmUoKS50b1N0cmluZygpO1xuICAgICAgICBjb25zdCBmcm9tID0gdGhpcy54bXBwQ2hhdEFkYXB0ZXIuY2hhdENvbm5lY3Rpb25TZXJ2aWNlLnVzZXJKaWQudG9TdHJpbmcoKTtcbiAgICAgICAgY29uc3Qgc3RhbnphID0geG1sKCdtZXNzYWdlJywge3RvLCBmcm9tfSxcbiAgICAgICAgICAgIHhtbCgneCcsIHt4bWxuczogbXVjVXNlck5zfSxcbiAgICAgICAgICAgICAgICB4bWwoJ2RlY2xpbmUnLCB7dG99LFxuICAgICAgICAgICAgICAgICAgICByZWFzb24gPyB4bWwoJ3JlYXNvbicsIHt9LCByZWFzb24pIDogbnVsbFxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICApLFxuICAgICAgICApO1xuICAgICAgICBhd2FpdCB0aGlzLnhtcHBDaGF0QWRhcHRlci5jaGF0Q29ubmVjdGlvblNlcnZpY2Uuc2VuZChzdGFuemEpO1xuICAgIH1cblxuICAgIGFzeW5jIGtpY2tPY2N1cGFudChuaWNrOiBzdHJpbmcsIHJvb21KaWQ6IEpJRCwgcmVhc29uPzogc3RyaW5nKTogUHJvbWlzZTxJcVJlc3BvbnNlU3RhbnphPiB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5tb2RpZnlBZmZpbGlhdGlvbk9yUm9sZShyb29tSmlkLCB7bmljaywgcm9sZTogUm9sZS5ub25lLCByZWFzb259KTtcbiAgICAgICAgdGhpcy5sb2dTZXJ2aWNlLmRlYnVnKGBraWNrIG9jY3VwYW50IHJlc3BvbnNlOiAke3Jlc3BvbnNlLnRvU3RyaW5nKCl9YCk7XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9XG5cbiAgICBhc3luYyBjaGFuZ2VVc2VyTmlja25hbWUobmV3Tmljazogc3RyaW5nLCByb29tSmlkOiBKSUQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgbmV3Um9vbUppZCA9IHBhcnNlSmlkKHJvb21KaWQudG9TdHJpbmcoKSk7XG4gICAgICAgIG5ld1Jvb21KaWQucmVzb3VyY2UgPSBuZXdOaWNrO1xuICAgICAgICBjb25zdCBzdGFuemEgPSB4bWwoJ3ByZXNlbmNlJywge1xuICAgICAgICAgICAgdG86IG5ld1Jvb21KaWQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgIGZyb206IHRoaXMueG1wcENoYXRBZGFwdGVyLmNoYXRDb25uZWN0aW9uU2VydmljZS51c2VySmlkLnRvU3RyaW5nKCksXG4gICAgICAgIH0pO1xuICAgICAgICBhd2FpdCB0aGlzLnhtcHBDaGF0QWRhcHRlci5jaGF0Q29ubmVjdGlvblNlcnZpY2Uuc2VuZChzdGFuemEpO1xuICAgIH1cblxuICAgIGFzeW5jIGxlYXZlUm9vbShvY2N1cGFudEppZDogSklELCBzdGF0dXM/OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3Qgc3RhbnphID0geG1sKCdwcmVzZW5jZScsIHtcbiAgICAgICAgICAgICAgICB0bzogb2NjdXBhbnRKaWQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICBmcm9tOiB0aGlzLnhtcHBDaGF0QWRhcHRlci5jaGF0Q29ubmVjdGlvblNlcnZpY2UudXNlckppZC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgIHR5cGU6IFByZXNlbmNlW1ByZXNlbmNlLnVuYXZhaWxhYmxlXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdGF0dXMgPyB4bWwoJ3N0YXR1cycsIHt9LCBzdGF0dXMpIDogbnVsbCxcbiAgICAgICAgKTtcblxuICAgICAgICBhd2FpdCB0aGlzLnhtcHBDaGF0QWRhcHRlci5jaGF0Q29ubmVjdGlvblNlcnZpY2Uuc2VuZChzdGFuemEpO1xuICAgICAgICB0aGlzLmxvZ1NlcnZpY2UuZGVidWcoYG9jY3VwYW50IGxlZnQgcm9vbTogb2NjdXBhbnRKaWQ9JHtvY2N1cGFudEppZC50b1N0cmluZygpfWApO1xuICAgIH1cblxuICAgIGFzeW5jIGNoYW5nZVJvb21TdWJqZWN0KHJvb21KaWQ6IEpJRCwgc3ViamVjdDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IGZyb20gPSB0aGlzLnhtcHBDaGF0QWRhcHRlci5jaGF0Q29ubmVjdGlvblNlcnZpY2UudXNlckppZC50b1N0cmluZygpO1xuICAgICAgICBhd2FpdCB0aGlzLnhtcHBDaGF0QWRhcHRlci5jaGF0Q29ubmVjdGlvblNlcnZpY2Uuc2VuZChcbiAgICAgICAgICAgIHhtbCgnbWVzc2FnZScsIHt0bzogcm9vbUppZC50b1N0cmluZygpLCBmcm9tLCB0eXBlOiAnZ3JvdXBjaGF0J30sXG4gICAgICAgICAgICAgICAgeG1sKCdzdWJqZWN0Jywge30sIHN1YmplY3QpLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5sb2dTZXJ2aWNlLmRlYnVnKGByb29tIHN1YmplY3QgY2hhbmdlZDogcm9vbUppZD0ke3Jvb21KaWQudG9TdHJpbmcoKX0sIG5ldyBzdWJqZWN0PSR7c3ViamVjdH1gKTtcbiAgICB9XG5cbiAgICBpc1Jvb21JbnZpdGF0aW9uU3RhbnphKHN0YW56YTogU3RhbnphKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCB4OiBFbGVtZW50IHwgdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gc3RhbnphLm5hbWUgPT09ICdtZXNzYWdlJ1xuICAgICAgICAgICAgJiYgKHggPSBzdGFuemEuZ2V0Q2hpbGQoJ3gnLCBtdWNVc2VyTnMpKSAhPSBudWxsXG4gICAgICAgICAgICAmJiAoeC5nZXRDaGlsZCgnaW52aXRlJykgIT0gbnVsbCB8fCB4LmdldENoaWxkKCdkZWNsaW5lJykgIT0gbnVsbCk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ3JhbnRNZW1iZXJzaGlwKHVzZXJKaWQ6IEpJRCwgcm9vbUppZDogSklELCByZWFzb24/OiBzdHJpbmcpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5zZXRBZmZpbGlhdGlvbih1c2VySmlkLCByb29tSmlkLCBBZmZpbGlhdGlvbi5tZW1iZXIsIHJlYXNvbik7XG4gICAgfVxuXG4gICAgYXN5bmMgcmV2b2tlTWVtYmVyc2hpcCh1c2VySmlkOiBKSUQsIHJvb21KaWQ6IEpJRCwgcmVhc29uPzogc3RyaW5nKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuc2V0QWZmaWxpYXRpb24odXNlckppZCwgcm9vbUppZCwgQWZmaWxpYXRpb24ubm9uZSwgcmVhc29uKTtcbiAgICB9XG5cbiAgICBhc3luYyBncmFudEFkbWluKHVzZXJKaWQ6IEpJRCwgcm9vbUppZDogSklELCByZWFzb24/OiBzdHJpbmcpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5zZXRBZmZpbGlhdGlvbih1c2VySmlkLCByb29tSmlkLCBBZmZpbGlhdGlvbi5hZG1pbiwgcmVhc29uKTtcbiAgICB9XG5cbiAgICBhc3luYyByZXZva2VBZG1pbih1c2VySmlkOiBKSUQsIHJvb21KaWQ6IEpJRCwgcmVhc29uPzogc3RyaW5nKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuc2V0QWZmaWxpYXRpb24odXNlckppZCwgcm9vbUppZCwgQWZmaWxpYXRpb24ubWVtYmVyLCByZWFzb24pO1xuICAgIH1cblxuICAgIGFzeW5jIGdyYW50TW9kZXJhdG9yU3RhdHVzKG9jY3VwYW50Tmljazogc3RyaW5nLCByb29tSmlkOiBKSUQsIHJlYXNvbj86IHN0cmluZykge1xuICAgICAgICBhd2FpdCB0aGlzLnNldFJvbGUob2NjdXBhbnROaWNrLCByb29tSmlkLCBSb2xlLm1vZGVyYXRvciwgcmVhc29uKTtcbiAgICB9XG5cbiAgICBhc3luYyByZXZva2VNb2RlcmF0b3JTdGF0dXMob2NjdXBhbnROaWNrOiBzdHJpbmcsIHJvb21KaWQ6IEpJRCwgcmVhc29uPzogc3RyaW5nKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuc2V0Um9sZShvY2N1cGFudE5pY2ssIHJvb21KaWQsIFJvbGUucGFydGljaXBhbnQsIHJlYXNvbik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc1Jvb21QcmVzZW5jZVN0YW56YShzdGFuemE6IFN0YW56YSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gc3RhbnphLm5hbWUgPT09ICdwcmVzZW5jZScgJiYgKFxuICAgICAgICAgICAgc3RhbnphLmdldENoaWxkKCd4JywgbXVjTnMpXG4gICAgICAgICAgICB8fCBzdGFuemEuZ2V0Q2hpbGQoJ3gnLCBtdWNVc2VyTnMpXG4gICAgICAgICkgIT0gbnVsbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZVJvb21QcmVzZW5jZVN0YW56YShzdGFuemE6IFN0YW56YSk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBzdGFuemFUeXBlID0gc3RhbnphLmF0dHJzLnR5cGU7XG5cbiAgICAgICAgaWYgKHN0YW56YVR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgICAgICAgIHRoaXMubG9nU2VydmljZS5lcnJvcihzdGFuemEpO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdlcnJvciBoYW5kbGluZyBtZXNzYWdlLCBzdGFuemE6ICcgKyBzdGFuemEpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgb2NjdXBhbnRKaWQgPSBwYXJzZUppZChzdGFuemEuYXR0cnMuZnJvbSk7XG4gICAgICAgIGNvbnN0IHJvb21KaWQgPSBvY2N1cGFudEppZC5iYXJlKCk7XG5cbiAgICAgICAgY29uc3QgeEVsID0gc3RhbnphLmdldENoaWxkKCd4JywgbXVjVXNlck5zKTtcblxuICAgICAgICBjb25zdCBpdGVtRWwgPSB4RWwuZ2V0Q2hpbGQoJ2l0ZW0nKTtcbiAgICAgICAgY29uc3Qgc3ViamVjdE9jY3VwYW50OiBSb29tT2NjdXBhbnQgPSB7XG4gICAgICAgICAgICBvY2N1cGFudEppZCxcbiAgICAgICAgICAgIGFmZmlsaWF0aW9uOiBpdGVtRWwuYXR0cnMuYWZmaWxpYXRpb24sXG4gICAgICAgICAgICByb2xlOiBpdGVtRWwuYXR0cnMucm9sZSxcbiAgICAgICAgICAgIG5pY2s6IG9jY3VwYW50SmlkLnJlc291cmNlLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHJvb20gPSB0aGlzLmdldE9yQ3JlYXRlUm9vbShvY2N1cGFudEppZCk7XG4gICAgICAgIGNvbnN0IHN0YXR1c0NvZGVzOiBzdHJpbmdbXSA9IHhFbC5nZXRDaGlsZHJlbignc3RhdHVzJykubWFwKHN0YXR1cyA9PiBzdGF0dXMuYXR0cnMuY29kZSk7XG4gICAgICAgIGNvbnN0IGlzQ3VycmVuVXNlciA9IHN0YXR1c0NvZGVzLmluY2x1ZGVzKCcxMTAnKTtcbiAgICAgICAgaWYgKHN0YW56YVR5cGUgPT09ICd1bmF2YWlsYWJsZScpIHtcbiAgICAgICAgICAgIGNvbnN0IGFjdG9yID0gaXRlbUVsLmdldENoaWxkKCdhY3RvcicpPy5hdHRycy5uaWNrO1xuICAgICAgICAgICAgY29uc3QgcmVhc29uID0gaXRlbUVsLmdldENoaWxkKCdyZWFzb24nKT8uZ2V0VGV4dCgpO1xuXG4gICAgICAgICAgICBpZiAoc3RhdHVzQ29kZXMuaW5jbHVkZXMoJzMzMycpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzQ3VycmVuVXNlcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb21zJC5uZXh0KHRoaXMucm9vbXMkLmdldFZhbHVlKCkuZmlsdGVyKHIgPT4gIXIuamlkQmFyZS5lcXVhbHMocm9vbUppZCkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvb20uaGFuZGxlT2NjdXBhbnRDb25uZWN0aW9uRXJyb3Ioc3ViamVjdE9jY3VwYW50LCBpc0N1cnJlblVzZXIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdGF0dXNDb2Rlcy5pbmNsdWRlcygnMzA3JykpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNDdXJyZW5Vc2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm9vbXMkLm5leHQodGhpcy5yb29tcyQuZ2V0VmFsdWUoKS5maWx0ZXIociA9PiAhci5qaWRCYXJlLmVxdWFscyhyb29tSmlkKSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcm9vbS5oYW5kbGVPY2N1cGFudEtpY2tlZChzdWJqZWN0T2NjdXBhbnQsIGlzQ3VycmVuVXNlciwgYWN0b3IsIHJlYXNvbik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0YXR1c0NvZGVzLmluY2x1ZGVzKCczMDEnKSkge1xuICAgICAgICAgICAgICAgIGlmIChpc0N1cnJlblVzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb29tcyQubmV4dCh0aGlzLnJvb21zJC5nZXRWYWx1ZSgpLmZpbHRlcihyID0+ICFyLmppZEJhcmUuZXF1YWxzKHJvb21KaWQpKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByb29tLmhhbmRsZU9jY3VwYW50QmFubmVkKHN1YmplY3RPY2N1cGFudCwgaXNDdXJyZW5Vc2VyLCBhY3RvciwgcmVhc29uKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhdHVzQ29kZXMuaW5jbHVkZXMoJzMwMycpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGFuZGxlZCA9IHJvb20uaGFuZGxlT2NjdXBhbnRDaGFuZ2VkTmljayhzdWJqZWN0T2NjdXBhbnQsIGlzQ3VycmVuVXNlciwgeEVsLmdldENoaWxkKCdpdGVtJykuYXR0cnMubmljayk7XG4gICAgICAgICAgICAgICAgaWYgKGhhbmRsZWQgJiYgaXNDdXJyZW5Vc2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm9vbXMkLm5leHQodGhpcy5yb29tcyQuZ2V0VmFsdWUoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBoYW5kbGVkO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdGF0dXNDb2Rlcy5pbmNsdWRlcygnMzIxJykpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNDdXJyZW5Vc2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm9vbXMkLm5leHQodGhpcy5yb29tcyQuZ2V0VmFsdWUoKS5maWx0ZXIociA9PiAhci5qaWRCYXJlLmVxdWFscyhyb29tSmlkKSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcm9vbS5oYW5kbGVPY2N1cGFudExvc3RNZW1iZXJzaGlwKHN1YmplY3RPY2N1cGFudCwgaXNDdXJyZW5Vc2VyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzQ3VycmVuVXNlcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb21zJC5uZXh0KHRoaXMucm9vbXMkLmdldFZhbHVlKCkuZmlsdGVyKHIgPT4gIXIuamlkQmFyZS5lcXVhbHMocm9vbUppZCkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvb20uaGFuZGxlT2NjdXBhbnRMZWZ0KHN1YmplY3RPY2N1cGFudCwgaXNDdXJyZW5Vc2VyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghc3RhbnphVHlwZSkge1xuICAgICAgICAgICAgaWYgKHJvb20uaGFzT2NjdXBhbnQoc3ViamVjdE9jY3VwYW50Lm9jY3VwYW50SmlkKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9sZE9jY3VwYW50ID0gcm9vbS5nZXRPY2N1cGFudChzdWJqZWN0T2NjdXBhbnQub2NjdXBhbnRKaWQpO1xuICAgICAgICAgICAgICAgIHJldHVybiByb29tLmhhbmRsZU9jY3VwYW50TW9kaWZpZWQoc3ViamVjdE9jY3VwYW50LCBvbGRPY2N1cGFudCwgaXNDdXJyZW5Vc2VyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvb20uaGFuZGxlT2NjdXBhbnRKb2luZWQoc3ViamVjdE9jY3VwYW50LCBpc0N1cnJlblVzZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0T3JDcmVhdGVSb29tKHJvb21KaWQ6IEpJRCk6IFJvb20ge1xuICAgICAgICByb29tSmlkID0gcm9vbUppZC5iYXJlKCk7XG4gICAgICAgIGxldCByb29tID0gdGhpcy5nZXRSb29tQnlKaWQocm9vbUppZCk7XG4gICAgICAgIGlmICghcm9vbSkge1xuICAgICAgICAgICAgcm9vbSA9IG5ldyBSb29tKHJvb21KaWQsIHRoaXMubG9nU2VydmljZSk7XG4gICAgICAgICAgICB0aGlzLnJvb21zJC5uZXh0KFtyb29tLCAuLi50aGlzLnJvb21zJC5nZXRWYWx1ZSgpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvb207XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBqb2luUm9vbUludGVybmFsKHJvb21KaWQ6IEpJRCk6IFByb21pc2U8eyBwcmVzZW5jZVJlc3BvbnNlOiBTdGFuemEsIHJvb206IFJvb20gfT4ge1xuICAgICAgICBpZiAodGhpcy5nZXRSb29tQnlKaWQocm9vbUppZC5iYXJlKCkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NhbiBub3Qgam9pbiByb29tIG1vcmUgdGhhbiBvbmNlOiAnICsgcm9vbUppZC5iYXJlKCkudG9TdHJpbmcoKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdXNlckppZCA9IHRoaXMueG1wcENoYXRBZGFwdGVyLmNoYXRDb25uZWN0aW9uU2VydmljZS51c2VySmlkO1xuICAgICAgICBjb25zdCBvY2N1cGFudEppZCA9IHBhcnNlSmlkKHJvb21KaWQubG9jYWwsIHJvb21KaWQuZG9tYWluLCByb29tSmlkLnJlc291cmNlIHx8IHVzZXJKaWQubG9jYWwpO1xuXG4gICAgICAgIGxldCByb29tSW5mbzogRm9ybSB8IG51bGwgPSBudWxsO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcm9vbUluZm8gPSBhd2FpdCB0aGlzLmdldFJvb21JbmZvKG9jY3VwYW50SmlkLmJhcmUoKSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGlmICghKGUgaW5zdGFuY2VvZiBYbXBwUmVzcG9uc2VFcnJvcikgfHwgZS5lcnJvckNvbmRpdGlvbiAhPT0gJ2l0ZW0tbm90LWZvdW5kJykge1xuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcHJlc2VuY2VSZXNwb25zZSA9IGF3YWl0IHRoaXMueG1wcENoYXRBZGFwdGVyLmNoYXRDb25uZWN0aW9uU2VydmljZS5zZW5kQXdhaXRpbmdSZXNwb25zZShcbiAgICAgICAgICAgICAgICB4bWwoJ3ByZXNlbmNlJywge3RvOiBvY2N1cGFudEppZC50b1N0cmluZygpfSxcbiAgICAgICAgICAgICAgICAgICAgeG1sKCd4Jywge3htbG5zOiBtdWNOc30pLFxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVSb29tUHJlc2VuY2VTdGFuemEocHJlc2VuY2VSZXNwb25zZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJvb20gPSB0aGlzLmdldE9yQ3JlYXRlUm9vbShvY2N1cGFudEppZC5iYXJlKCkpO1xuICAgICAgICAgICAgcm9vbS5uaWNrID0gb2NjdXBhbnRKaWQucmVzb3VyY2U7XG4gICAgICAgICAgICBpZiAocm9vbUluZm8pIHtcbiAgICAgICAgICAgICAgICByb29tLm5hbWUgPSBnZXRGaWVsZChyb29tSW5mbywgJ211YyNyb29tY29uZmlnX3Jvb21uYW1lJyk/LnZhbHVlIGFzIHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICByb29tLmRlc2NyaXB0aW9uID0gZ2V0RmllbGQocm9vbUluZm8sICdtdWMjcm9vbWluZm9fZGVzY3JpcHRpb24nKT8udmFsdWUgYXMgc3RyaW5nIHwgdW5kZWZpbmVkIHx8ICcnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge3ByZXNlbmNlUmVzcG9uc2UsIHJvb219O1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ1NlcnZpY2UuZXJyb3IoJ2Vycm9yIGpvaW5pbmcgcm9vbScsIGUpO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZXh0cmFjdFJvb21TdW1tYXJpZXNGcm9tUmVzcG9uc2UoaXE6IElxUmVzcG9uc2VTdGFuemEpOiBSb29tU3VtbWFyeVtdIHtcbiAgICAgICAgcmV0dXJuIGlxXG4gICAgICAgICAgICAuZ2V0Q2hpbGQoJ3F1ZXJ5JywgU2VydmljZURpc2NvdmVyeVBsdWdpbi5ESVNDT19JVEVNUylcbiAgICAgICAgICAgID8uZ2V0Q2hpbGRyZW4oJ2l0ZW0nKVxuICAgICAgICAgICAgPy5yZWR1Y2U8Um9vbVN1bW1hcnlbXT4oKGFjYywgaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHtqaWQsIG5hbWV9ID0gaXRlbS5hdHRycztcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgamlkID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgYWNjLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgamlkOiBwYXJzZUppZChqaWQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb21JbmZvOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgfSwgW10pIHx8IFtdO1xuICAgIH1cblxuICAgIHByaXZhdGUgZXh0cmFjdFJlc3VsdFNldEZyb21SZXNwb25zZShpcTogSXFSZXNwb25zZVN0YW56YSk6IFN0YW56YSB7XG4gICAgICAgIHJldHVybiBpcVxuICAgICAgICAgICAgLmdldENoaWxkKCdxdWVyeScsIFNlcnZpY2VEaXNjb3ZlcnlQbHVnaW4uRElTQ09fSVRFTVMpXG4gICAgICAgICAgICA/LmdldENoaWxkKCdzZXQnLCAnaHR0cDovL2phYmJlci5vcmcvcHJvdG9jb2wvcnNtJykgYXMgU3RhbnphO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNSb29tTWVzc2FnZVN0YW56YShzdGFuemE6IFN0YW56YSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gc3RhbnphLm5hbWUgPT09ICdtZXNzYWdlJyAmJiBzdGFuemEuYXR0cnMudHlwZSA9PT0gJ2dyb3VwY2hhdCcgJiYgISFzdGFuemEuZ2V0Q2hpbGRUZXh0KCdib2R5Jyk/LnRyaW0oKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZVJvb21NZXNzYWdlU3RhbnphKG1lc3NhZ2VTdGFuemE6IFN0YW56YSwgYXJjaGl2ZURlbGF5RWxlbWVudD86IFN0YW56YSk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBkZWxheUVsZW1lbnQgPSBhcmNoaXZlRGVsYXlFbGVtZW50ID8/IG1lc3NhZ2VTdGFuemEuZ2V0Q2hpbGQoJ2RlbGF5Jyk7XG4gICAgICAgIGNvbnN0IGRhdGV0aW1lID0gZGVsYXlFbGVtZW50Py5hdHRycy5zdGFtcFxuICAgICAgICAgICAgPyBuZXcgRGF0ZShkZWxheUVsZW1lbnQuYXR0cnMuc3RhbXApXG4gICAgICAgICAgICA6IG5ldyBEYXRlKCkgLyogVE9ETzogcmVwbGFjZSB3aXRoIGVudGl0eSB0aW1lIHBsdWdpbiAqLztcblxuICAgICAgICBjb25zdCBmcm9tID0gcGFyc2VKaWQobWVzc2FnZVN0YW56YS5hdHRycy5mcm9tKTtcbiAgICAgICAgY29uc3Qgcm9vbSA9IHRoaXMuZ2V0Um9vbUJ5SmlkKGZyb20uYmFyZSgpKTtcbiAgICAgICAgaWYgKCFyb29tKSB7XG4gICAgICAgICAgICAvLyB0aGVyZSBhcmUgc2V2ZXJhbCByZWFzb25zIHdoeSB3ZSBjYW4gcmVjZWl2ZSBhIG1lc3NhZ2UgZm9yIGFuIHVua25vd24gcm9vbTpcbiAgICAgICAgICAgIC8vIC0gdGhpcyBpcyBhIG1lc3NhZ2UgZGVsaXZlcmVkIHZpYSBNQU0vTVVDU3ViIGJ1dCB0aGUgcm9vbSBpdCB3YXMgc3RvcmVkIGZvclxuICAgICAgICAgICAgLy8gICAtIGlzIGdvbmUgKHdhcyBkZXN0cm95ZWQpXG4gICAgICAgICAgICAvLyAgIC0gdXNlciB3YXMgYmFubmVkIGZyb20gcm9vbVxuICAgICAgICAgICAgLy8gICAtIHJvb20gd2Fzbid0IGpvaW5lZCB5ZXRcbiAgICAgICAgICAgIC8vIC0gdGhpcyBpcyBzb21lIGtpbmQgb2YgZXJyb3Igb24gZGV2ZWxvcGVyJ3Mgc2lkZVxuICAgICAgICAgICAgdGhpcy5sb2dTZXJ2aWNlLndhcm4oYHJlY2VpdmVkIHN0YW56YSBmb3IgdW5rbm93biByb29tOiAke2Zyb20uYmFyZSgpLnRvU3RyaW5nKCl9YCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtZXNzYWdlOiBSb29tTWVzc2FnZSA9IHtcbiAgICAgICAgICAgIGJvZHk6IG1lc3NhZ2VTdGFuemEuZ2V0Q2hpbGRUZXh0KCdib2R5JykudHJpbSgpLFxuICAgICAgICAgICAgZGF0ZXRpbWUsXG4gICAgICAgICAgICBpZDogbWVzc2FnZVN0YW56YS5hdHRycy5pZCxcbiAgICAgICAgICAgIGZyb20sXG4gICAgICAgICAgICBkaXJlY3Rpb246IGZyb20uZXF1YWxzKHJvb20ub2NjdXBhbnRKaWQpID8gRGlyZWN0aW9uLm91dCA6IERpcmVjdGlvbi5pbixcbiAgICAgICAgICAgIGRlbGF5ZWQ6ICEhZGVsYXlFbGVtZW50LFxuICAgICAgICAgICAgZnJvbUFyY2hpdmU6IGFyY2hpdmVEZWxheUVsZW1lbnQgIT0gbnVsbCxcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBtZXNzYWdlUmVjZWl2ZWRFdmVudCA9IG5ldyBNZXNzYWdlUmVjZWl2ZWRFdmVudCgpO1xuICAgICAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiB0aGlzLnhtcHBDaGF0QWRhcHRlci5wbHVnaW5zKSB7XG4gICAgICAgICAgICBwbHVnaW4uYWZ0ZXJSZWNlaXZlTWVzc2FnZShtZXNzYWdlLCBtZXNzYWdlU3RhbnphLCBtZXNzYWdlUmVjZWl2ZWRFdmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFtZXNzYWdlUmVjZWl2ZWRFdmVudC5kaXNjYXJkKSB7XG4gICAgICAgICAgICByb29tLmFkZE1lc3NhZ2UobWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIW1lc3NhZ2UuZGVsYXllZCkge1xuICAgICAgICAgICAgdGhpcy5tZXNzYWdlJC5uZXh0KHJvb20pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc1Jvb21TdWJqZWN0U3RhbnphKHN0YW56YTogU3RhbnphKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBzdGFuemEubmFtZSA9PT0gJ21lc3NhZ2UnXG4gICAgICAgICAgICAmJiBzdGFuemEuYXR0cnMudHlwZSA9PT0gJ2dyb3VwY2hhdCdcbiAgICAgICAgICAgICYmIHN0YW56YS5nZXRDaGlsZCgnc3ViamVjdCcpICE9IG51bGxcbiAgICAgICAgICAgICYmIHN0YW56YS5nZXRDaGlsZCgnYm9keScpID09IG51bGw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVSb29tU3ViamVjdFN0YW56YShzdGFuemE6IFN0YW56YSwgYXJjaGl2ZURlbGF5RWxlbWVudDogU3RhbnphKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHJvb21KaWQgPSBwYXJzZUppZChzdGFuemEuYXR0cnMuZnJvbSkuYmFyZSgpO1xuICAgICAgICBjb25zdCByb29tID0gdGhpcy5nZXRSb29tQnlKaWQocm9vbUppZCk7XG5cbiAgICAgICAgaWYgKCFyb29tKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHVua25vd24gcm9vbSB0cnlpbmcgdG8gY2hhbmdlIHJvb20gc3ViamVjdDogcm9vbUppZD0ke3Jvb21KaWQudG9TdHJpbmcoKX1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSBhcmNoaXZlIG9ubHkgc3RvcmVzIG5vbi1lbXB0eSBzdWJqZWN0cy4gVGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIHN1YmplY3QgaXMgc2VudCBkaXJlY3RseSBhZnRlciBlbnRlcmluZyBhIHJvb20gYnkgdGhlIHJvb20sXG4gICAgICAgIC8vIG5vdCB0aGUgYXJjaGl2ZS5cbiAgICAgICAgLy8gSWYgYSBzdWJqZWN0IHdhcyBmaXJzdCBzZXQsIHRoZW4gdW5zZXQsIHdlIHdvdWxkIGZpcnN0IHJlY2VpdmUgdGhlIGVtcHR5IHN1YmplY3Qgb24gcm9vbSBlbnRyeSBhbmQgdGhlbiBvdmVyd3JpdGUgaXQgd2l0aCB0aGVcbiAgICAgICAgLy8gcHJldmlvdXMgbm9uLWVtcHR5IHZhbHVlIGZyb20gYXJjaGl2ZS4gVGhpcyBpcyB3aHkgd2Ugd2FudCB0byBhbHdheXMgaWdub3JlIHN1YmplY3RzIGZyb20gYXJjaGl2ZS5cbiAgICAgICAgLy8gVGhpcyBhY3R1YWxseSBsb29rcyBsaWtlIGEgYnVnIGluIE1BTSwgaXQgc2VlbXMgdGhhdCBNQU0gaW50ZXJwcmV0cyBtZXNzYWdlcyB3aXRoIGp1c3Qgc3ViamVjdCBpbiB0aGVtIGFzIGlmIHRoZXkgd2VyZSBjaGF0XG4gICAgICAgIC8vIG1lc3NhZ2VzIGFuZCBub3Qgcm9vbSBtZXRhZGF0YS4gVGhpcyB3b3VsZCBleHBsYWluIHdoeSBlbXB0eSBzdWJqZWN0cyBhcmUgbm90IHN0b3JlZC5cbiAgICAgICAgaWYgKGFyY2hpdmVEZWxheUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcm9vbS5zdWJqZWN0ID0gc3RhbnphLmdldENoaWxkKCdzdWJqZWN0JykuZ2V0VGV4dCgpLnRyaW0oKTtcbiAgICAgICAgdGhpcy5yb29tcyQubmV4dCh0aGlzLnJvb21zJC5nZXRWYWx1ZSgpKTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZVJvb21JbnZpdGF0aW9uU3RhbnphKHN0YW56YTogU3RhbnphKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHhFbCA9IHN0YW56YS5nZXRDaGlsZCgneCcsIG11Y1VzZXJOcyk7XG4gICAgICAgIGNvbnN0IGludml0YXRpb25FbCA9IHhFbC5nZXRDaGlsZCgnaW52aXRlJykgPz8geEVsLmdldENoaWxkKCdkZWNsaW5lJyk7XG5cbiAgICAgICAgdGhpcy5vbkludml0YXRpb25TdWJqZWN0Lm5leHQoe1xuICAgICAgICAgICAgdHlwZTogaW52aXRhdGlvbkVsLm5hbWUgYXMgSW52aXRhdGlvblsndHlwZSddLFxuICAgICAgICAgICAgcm9vbUppZDogcGFyc2VKaWQoc3RhbnphLmF0dHJzLmZyb20pLFxuICAgICAgICAgICAgcm9vbVBhc3N3b3JkOiB4RWwuZ2V0Q2hpbGQoJ3Bhc3N3b3JkJyk/LmdldFRleHQoKSxcbiAgICAgICAgICAgIGZyb206IHBhcnNlSmlkKGludml0YXRpb25FbC5hdHRycy5mcm9tKSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGludml0YXRpb25FbC5nZXRDaGlsZCgncmVhc29uJyk/LmdldFRleHQoKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBzZXRBZmZpbGlhdGlvbihvY2N1cGFudEppZDogSklELCByb29tSmlkOiBKSUQsIGFmZmlsaWF0aW9uOiBBZmZpbGlhdGlvbiwgcmVhc29uPzogc3RyaW5nKTogUHJvbWlzZTxJcVJlc3BvbnNlU3RhbnphPiB7XG4gICAgICAgIGNvbnN0IHVzZXJKaWQgPSBhd2FpdCB0aGlzLmdldFVzZXJKaWRCeU9jY3VwYW50SmlkKG9jY3VwYW50SmlkLCByb29tSmlkKTtcblxuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5tb2RpZnlBZmZpbGlhdGlvbk9yUm9sZShyb29tSmlkLCB7dXNlckppZCwgYWZmaWxpYXRpb24sIHJlYXNvbn0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgc2V0Um9sZShvY2N1cGFudE5pY2s6IHN0cmluZywgcm9vbUppZDogSklELCByb2xlOiBSb2xlLCByZWFzb24/OiBzdHJpbmcpOiBQcm9taXNlPElxUmVzcG9uc2VTdGFuemE+IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMubW9kaWZ5QWZmaWxpYXRpb25PclJvbGUocm9vbUppZCwge25pY2s6IG9jY3VwYW50Tmljaywgcm9sZSwgcmVhc29ufSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBnZXRVc2VySmlkQnlPY2N1cGFudEppZChvY2N1cGFudEppZDogSklELCByb29tSmlkOiBKSUQpOiBQcm9taXNlPEpJRD4ge1xuICAgICAgICBjb25zdCB1c2VycyA9IGF3YWl0IHRoaXMucXVlcnlVc2VyTGlzdChyb29tSmlkKTtcbiAgICAgICAgcmV0dXJuIHVzZXJzLmZpbmQocm9vbVVzZXIgPT4gcm9vbVVzZXIudXNlcklkZW50aWZpZXJzLmZpbmQoXG4gICAgICAgICAgICBpZHMgPT4gaWRzLm5pY2sgPT09IG9jY3VwYW50SmlkLnJlc291cmNlIHx8IGlkcy51c2VySmlkLmJhcmUoKS5lcXVhbHMob2NjdXBhbnRKaWQuYmFyZSgpKSksXG4gICAgICAgICk/LnVzZXJJZGVudGlmaWVycz8uWzBdLnVzZXJKaWQ7XG4gICAgfVxufVxuIl19