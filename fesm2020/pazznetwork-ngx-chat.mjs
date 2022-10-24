import { xml, jid as jid$1, client } from '@xmpp/client';
export { jid as parseJid } from '@xmpp/client';
import { jid } from '@xmpp/jid';
export { JID } from '@xmpp/jid';
import * as i0 from '@angular/core';
import { EventEmitter, Component, Output, Input, HostListener, InjectionToken, Inject, ViewChild, Injectable, ChangeDetectionStrategy, Optional, Directive, ViewChildren, NgZone, NgModule } from '@angular/core';
import * as i1 from '@angular/forms';
import { FormsModule } from '@angular/forms';
import * as i2 from '@angular/cdk/text-field';
import { TextFieldModule } from '@angular/cdk/text-field';
import { BehaviorSubject, Subject, ReplaySubject, combineLatest, merge, of } from 'rxjs';
import { filter, debounceTime, first, map, takeUntil, delay as delay$1, distinctUntilChanged, share, timeout as timeout$1, mergeMap, catchError } from 'rxjs/operators';
import * as i1$2 from '@angular/common/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as i2$1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i1$1 from '@angular/router';
import { RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

class FileDropComponent {
    constructor() {
        this.fileUpload = new EventEmitter();
        this.enabled = true;
        this.isDropTarget = false;
    }
    onDragOver(event) {
        if (this.enabled) {
            event.preventDefault();
            event.stopPropagation();
            this.isDropTarget = true;
        }
    }
    onDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
        this.isDropTarget = false;
    }
    async onDrop(event) {
        if (this.enabled) {
            event.preventDefault();
            event.stopPropagation();
            this.isDropTarget = false;
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < event.dataTransfer.items.length; i++) {
                const dataTransferItem = event.dataTransfer.items[i];
                if (dataTransferItem.kind === 'file') {
                    this.fileUpload.emit(dataTransferItem.getAsFile());
                }
            }
        }
    }
}
FileDropComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: FileDropComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
FileDropComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.7", type: FileDropComponent, selector: "ngx-chat-filedrop", inputs: { dropMessage: "dropMessage", enabled: "enabled" }, outputs: { fileUpload: "fileUpload" }, host: { listeners: { "dragover": "onDragOver($event)", "dragenter": "onDragOver($event)", "dragleave": "onDragLeave($event)", "dragexit": "onDragLeave($event)", "drop": "onDrop($event)" } }, ngImport: i0, template: "<div>\n    <div class=\"drop-message\"\n         [class.drop-message--visible]=\"isDropTarget\">\n        {{dropMessage}}\n    </div>\n    <div>\n        <ng-content></ng-content>\n    </div>\n</div>\n", styles: [".drop-message{pointer-events:none;display:none}.drop-message--visible{position:absolute;inset:0;display:flex;justify-content:center;align-content:center;flex-direction:column;text-align:center;font-size:1.5em;z-index:999;background-color:#fff9;padding:1em}\n"] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: FileDropComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-chat-filedrop', template: "<div>\n    <div class=\"drop-message\"\n         [class.drop-message--visible]=\"isDropTarget\">\n        {{dropMessage}}\n    </div>\n    <div>\n        <ng-content></ng-content>\n    </div>\n</div>\n", styles: [".drop-message{pointer-events:none;display:none}.drop-message--visible{position:absolute;inset:0;display:flex;justify-content:center;align-content:center;flex-direction:column;text-align:center;font-size:1.5em;z-index:999;background-color:#fff9;padding:1em}\n"] }]
        }], propDecorators: { fileUpload: [{
                type: Output
            }], dropMessage: [{
                type: Input
            }], enabled: [{
                type: Input
            }], onDragOver: [{
                type: HostListener,
                args: ['dragover', ['$event']]
            }, {
                type: HostListener,
                args: ['dragenter', ['$event']]
            }], onDragLeave: [{
                type: HostListener,
                args: ['dragleave', ['$event']]
            }, {
                type: HostListener,
                args: ['dragexit', ['$event']]
            }], onDrop: [{
                type: HostListener,
                args: ['drop', ['$event']]
            }] } });

/**
 * The chat service token gives you access to the main chat api and is implemented by default with an XMPP adapter,
 * you can always reuse the api and ui with a new service implementing the ChatService interface and providing the
 * said implementation with the token
 */
const CHAT_SERVICE_TOKEN = new InjectionToken('ngxChatService');

class ChatMessageInputComponent {
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
ChatMessageInputComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatMessageInputComponent, deps: [{ token: CHAT_SERVICE_TOKEN }], target: i0.ɵɵFactoryTarget.Component });
ChatMessageInputComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.7", type: ChatMessageInputComponent, selector: "ngx-chat-message-input", inputs: { recipient: "recipient" }, outputs: { messageSent: "messageSent" }, viewQueries: [{ propertyName: "chatInput", first: true, predicate: ["chatInput"], descendants: true }], ngImport: i0, template: "<textarea class=\"chat-input\"\n          #chatInput\n          [(ngModel)]=\"message\"\n          (keydown.enter)=\"onSendMessage($event)\"\n          cdkTextareaAutosize\n          cdkAutosizeMinRows=\"1\"\n          cdkAutosizeMaxRows=\"5\"\n          placeholder=\"{{chatService.translations.placeholder}}\"></textarea>\n", styles: ["@keyframes ngx-chat-message-in{0%{transform:translate(50px);opacity:0}to{transform:none;opacity:1}}@keyframes ngx-chat-message-out{0%{transform:translate(-50px);opacity:0}to{transform:none;opacity:1}}*{box-sizing:border-box;margin:0;padding:0;font-family:Helvetica,Arial,serif}.chat-input{border:none;width:100%;font-size:1em;padding:0;display:block;resize:none;overflow-x:hidden;outline:none}\n"], dependencies: [{ kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i2.CdkTextareaAutosize, selector: "textarea[cdkTextareaAutosize]", inputs: ["cdkAutosizeMinRows", "cdkAutosizeMaxRows", "cdkTextareaAutosize", "placeholder"], exportAs: ["cdkTextareaAutosize"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatMessageInputComponent, decorators: [{
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

var MessageState;
(function (MessageState) {
    /**
     * Not yet sent
     */
    MessageState["SENDING"] = "sending";
    /**
     * Sent, but neither received nor seen by the recipient
     */
    MessageState["SENT"] = "sent";
    /**
     * The recipient client has received the message but the recipient has not seen it yet
     */
    MessageState["RECIPIENT_RECEIVED"] = "recipientReceived";
    /**
     * The message has been seen by the recipient
     */
    MessageState["RECIPIENT_SEEN"] = "recipientSeen";
})(MessageState || (MessageState = {}));
var Direction;
(function (Direction) {
    Direction["in"] = "in";
    Direction["out"] = "out";
})(Direction || (Direction = {}));

class AbstractXmppPlugin {
    onBeforeOnline() {
        return Promise.resolve();
    }
    onOffline() {
    }
    afterSendMessage(message, messageStanza) {
        return;
    }
    beforeSendMessage(messageStanza, message) {
        return;
    }
    handleStanza(stanza) {
        return false;
    }
    afterReceiveMessage(message, messageStanza, messageReceivedEvent) {
        return;
    }
}

/**
 * XEP-0191: Blocking Command
 * https://xmpp.org/extensions/xep-0191.html
 */
class BlockPlugin extends AbstractXmppPlugin {
    constructor(xmppChatAdapter, serviceDiscoveryPlugin) {
        super();
        this.xmppChatAdapter = xmppChatAdapter;
        this.serviceDiscoveryPlugin = serviceDiscoveryPlugin;
        this.supportsBlock$ = new BehaviorSubject('unknown');
    }
    async onBeforeOnline() {
        const supportsBlock = await this.determineSupportForBlock();
        this.supportsBlock$.next(supportsBlock);
        if (supportsBlock) {
            await this.requestBlockedJids();
        }
    }
    async determineSupportForBlock() {
        try {
            return await this.serviceDiscoveryPlugin.supportsFeature(this.xmppChatAdapter.chatConnectionService.userJid.domain, 'urn:xmpp:blocking');
        }
        catch (e) {
            return false;
        }
    }
    onOffline() {
        this.supportsBlock$.next('unknown');
        this.xmppChatAdapter.blockedContactIds$.next(new Set());
    }
    blockJid(jid) {
        return this.xmppChatAdapter.chatConnectionService.sendIq(xml('iq', { type: 'set' }, xml('block', { xmlns: 'urn:xmpp:blocking' }, xml('item', { jid }))));
    }
    unblockJid(jid) {
        return this.xmppChatAdapter.chatConnectionService.sendIq(xml('iq', { type: 'set' }, xml('unblock', { xmlns: 'urn:xmpp:blocking' }, xml('item', { jid }))));
    }
    async requestBlockedJids() {
        const blockListResponse = await this.xmppChatAdapter.chatConnectionService.sendIq(xml('iq', { type: 'get' }, xml('blocklist', { xmlns: 'urn:xmpp:blocking' })));
        const blockedJids = blockListResponse
            .getChild('blocklist')
            .getChildren('item')
            .map(e => e.attrs.jid);
        this.xmppChatAdapter.blockedContactIds$.next(new Set(blockedJids));
    }
    handleStanza(stanza) {
        const { from } = stanza.attrs;
        if (from && from === this.xmppChatAdapter.chatConnectionService.userJid?.bare().toString()) {
            const blockPush = stanza.getChild('block', 'urn:xmpp:blocking');
            const unblockPush = stanza.getChild('unblock', 'urn:xmpp:blocking');
            const blockList = this.xmppChatAdapter.blockedContactIds$.getValue();
            if (blockPush) {
                blockPush.getChildren('item')
                    .map(e => e.attrs.jid)
                    .forEach(jid => blockList.add(jid));
                this.xmppChatAdapter.blockedContactIds$.next(blockList);
                return true;
            }
            else if (unblockPush) {
                const jidsToUnblock = unblockPush.getChildren('item').map(e => e.attrs.jid);
                if (jidsToUnblock.length === 0) {
                    // unblock everyone
                    blockList.clear();
                }
                else {
                    // unblock individually
                    jidsToUnblock.forEach(jid => blockList.delete(jid));
                }
                this.xmppChatAdapter.blockedContactIds$.next(blockList);
                return true;
            }
        }
        return false;
    }
}

class AbstractStanzaBuilder {
}

class XmppResponseError extends Error {
    constructor(errorStanza) {
        super(XmppResponseError.extractErrorTextFromErrorResponse(errorStanza, XmppResponseError.extractErrorDataFromErrorResponse(errorStanza)));
        this.errorStanza = errorStanza;
        const { code, type, condition } = XmppResponseError.extractErrorDataFromErrorResponse(errorStanza);
        this.errorCode = code;
        this.errorType = type;
        this.errorCondition = condition;
    }
    static extractErrorDataFromErrorResponse(stanza) {
        const errorElement = stanza.getChild('error');
        const errorCode = Number(errorElement?.attrs.code) || undefined;
        const errorType = errorElement?.attrs.type;
        const errorCondition = errorElement
            ?.children
            .filter(childElement => childElement.getName() !== 'text' &&
            childElement.attrs.xmlns === XmppResponseError.ERROR_ELEMENT_NS)[0]
            ?.getName();
        return {
            code: errorCode,
            type: errorType,
            condition: errorCondition,
        };
    }
    static extractErrorTextFromErrorResponse(stanza, { code, type, condition }) {
        const additionalData = [
            `errorCode: ${code ?? '[unknown]'}`,
            `errorType: ${type ?? '[unknown]'}`,
            `errorCondition: ${condition ?? '[unknown]'}`,
        ].join(', ');
        const errorText = stanza.getChild('error')?.getChildText('text', XmppResponseError.ERROR_ELEMENT_NS) || 'Unknown error';
        return `XmppResponseError: ${errorText}${additionalData ? ` (${additionalData})` : ''}`;
    }
}
XmppResponseError.ERROR_ELEMENT_NS = 'urn:ietf:params:xml:ns:xmpp-stanzas';

// implements https://xmpp.org/extensions/xep-0004.html
const FORM_NS = 'jabber:x:data';
function parseStringValue([valueEl]) {
    return valueEl?.getText();
}
function parseMultipleStringValues(valueEls) {
    return valueEls.map(el => parseStringValue([el]));
}
function parseJidValue([valueEl]) {
    return valueEl && jid(valueEl.getText());
}
const valueParsers = {
    fixed: parseStringValue,
    boolean: ([valueEl]) => {
        if (!valueEl) {
            return false;
        }
        const value = valueEl.getText();
        return value === '1' || value === 'true';
    },
    hidden: parseStringValue,
    'jid-single': parseJidValue,
    'jid-multi': (valueEls) => [
        ...new Set(valueEls.map(el => parseStringValue([el]))),
    ]
        .map(jidStr => jid(jidStr)),
    'list-single': parseStringValue,
    'list-multi': parseMultipleStringValues,
    'text-single': parseStringValue,
    'text-private': parseStringValue,
    'text-multi': parseMultipleStringValues,
};
function parseForm(formEl) {
    if (formEl.name !== 'x' || formEl.getNS() !== FORM_NS) {
        throw new Error(`Provided element is not a form element: elementName=${formEl.name}, xmlns=${formEl.getNS()}, form=${formEl.toString()}`);
    }
    return {
        type: formEl.attrs.type,
        title: formEl.getChildText('title') ?? undefined,
        instructions: formEl.getChildren('instructions').map(descEl => descEl.getText()),
        fields: formEl.getChildren('field')
            .map(fieldEl => {
            const rawType = fieldEl.attrs.type;
            const type = rawType in valueParsers ? rawType : 'text-single';
            const { var: variable, label } = fieldEl.attrs;
            let options;
            if (type === 'list-single' || type === 'list-multi') {
                options = fieldEl.getChildren('option').map(optionEl => ({
                    value: optionEl.getChildText('value'),
                    label: optionEl.attrs.label,
                }));
            }
            return {
                type,
                variable,
                label,
                description: fieldEl.getChildText('desc') ?? undefined,
                required: fieldEl.getChild('required') != null,
                value: valueParsers[type](fieldEl.getChildren('value')),
                options,
            };
        }),
    };
}
function getField(form, variable) {
    return form.fields.find(field => field.variable === variable) ?? undefined;
}
function setFieldValue(form, type, variable, value, createField = false) {
    let field = form.fields
        .find((f) => f.variable === variable);
    if (field) {
        if (field.type !== type) {
            throw new Error(`type mismatch setting field value: variable=${field.variable}, field.type=${field.type}, requested type=${type}`);
        }
        field.value = value;
        return;
    }
    if (createField) {
        field = {
            type,
            variable,
            value,
        };
        form.fields.push(field);
    }
    else {
        throw new Error(`field for variable not found! variable=${variable}, type=${type}, value=${value}`);
    }
}
function serializeTextualField(field) {
    return field.value != null ? [field.value] : [];
}
function serializeTextualMultiField(field) {
    return field.value;
}
const valueSerializers = {
    fixed: serializeTextualField,
    boolean: (field) => field.value != null ? [String(field.value)] : [],
    hidden: serializeTextualField,
    'jid-single': (field) => field.value ? [field.value.toString()] : [],
    'jid-multi': (field) => field.value.map(jid => jid.toString()),
    'list-single': serializeTextualField,
    'list-multi': serializeTextualMultiField,
    'text-single': serializeTextualField,
    'text-private': serializeTextualField,
    'text-multi': serializeTextualMultiField,
};
function serializeToSubmitForm(form) {
    const serializedFields = form.fields
        .reduce((collectedFields, field) => {
        const serializer = valueSerializers[field.type];
        if (!serializer) {
            throw new Error(`unknown field type: ${field.type}`);
        }
        const values = serializer(field);
        if (field.variable != null && values.length > 0) {
            collectedFields.push([field.variable, values]);
        }
        return collectedFields;
    }, []);
    return xml('x', { xmlns: FORM_NS, type: 'submit' }, ...serializedFields.map(([variable, values]) => xml('field', { var: variable }, ...values.map(value => xml('value', {}, value)))));
}

const PUBSUB_EVENT_XMLNS = 'http://jabber.org/protocol/pubsub#event';
class PublishStanzaBuilder extends AbstractStanzaBuilder {
    constructor(options) {
        super();
        this.publishOptions = {
            persistItems: false,
        };
        if (options) {
            this.publishOptions = { ...this.publishOptions, ...options };
        }
    }
    toStanza() {
        const { node, id, persistItems } = this.publishOptions;
        // necessary as a 'event-only' publish is currently broken in ejabberd, see
        // https://github.com/processone/ejabberd/issues/2799
        const data = this.publishOptions.data || xml('data');
        return xml('iq', { type: 'set' }, xml('pubsub', { xmlns: 'http://jabber.org/protocol/pubsub' }, xml('publish', { node }, xml('item', { id }, data)), xml('publish-options', {}, serializeToSubmitForm({
            type: 'submit',
            instructions: [],
            fields: [
                { type: 'hidden', variable: 'FORM_TYPE', value: 'http://jabber.org/protocol/pubsub#publish-options' },
                { type: 'boolean', variable: 'pubsub#persist_items', value: persistItems === true },
                { type: 'list-single', variable: 'pubsub#access_model', value: 'whitelist' },
            ],
        }))));
    }
}
class RetrieveDataStanzaBuilder extends AbstractStanzaBuilder {
    constructor(node) {
        super();
        this.node = node;
    }
    toStanza() {
        return xml('iq', { type: 'get' }, xml('pubsub', { xmlns: 'http://jabber.org/protocol/pubsub' }, xml('items', { node: this.node })));
    }
}
/**
 * XEP-0060 Publish Subscribe (https://xmpp.org/extensions/xep-0060.html)
 * XEP-0223 Persistent Storage of Private Data via PubSub (https://xmpp.org/extensions/xep-0223.html)
 */
class PublishSubscribePlugin extends AbstractXmppPlugin {
    constructor(xmppChatAdapter, serviceDiscoveryPlugin) {
        super();
        this.xmppChatAdapter = xmppChatAdapter;
        this.serviceDiscoveryPlugin = serviceDiscoveryPlugin;
        this.publish$ = new Subject();
        this.supportsPrivatePublish = new BehaviorSubject('unknown');
    }
    onBeforeOnline() {
        return this.determineSupportForPrivatePublish();
    }
    onOffline() {
        this.supportsPrivatePublish.next('unknown');
    }
    storePrivatePayloadPersistent(node, id, data) {
        return new Promise((resolve, reject) => {
            this.supportsPrivatePublish
                .pipe(filter(support => support !== 'unknown'))
                .subscribe((support) => {
                if (!support) {
                    reject(new Error('does not support private publish subscribe'));
                }
                else {
                    resolve(this.xmppChatAdapter.chatConnectionService.sendIq(new PublishStanzaBuilder({ node, id, data, persistItems: true }).toStanza()));
                }
            });
        });
    }
    privateNotify(node, data, id) {
        return new Promise((resolve, reject) => {
            this.supportsPrivatePublish
                .pipe(filter(support => support !== 'unknown'))
                .subscribe((support) => {
                if (!support) {
                    reject(new Error('does not support private publish subscribe'));
                }
                else {
                    resolve(this.xmppChatAdapter.chatConnectionService.sendIq(new PublishStanzaBuilder({ node, id, data, persistItems: false }).toStanza()));
                }
            });
        });
    }
    handleStanza(stanza) {
        const eventElement = stanza.getChild('event', PUBSUB_EVENT_XMLNS);
        if (stanza.is('message') && eventElement) {
            this.publish$.next(eventElement);
            return true;
        }
        return false;
    }
    async retrieveNodeItems(node) {
        try {
            const iqResponseStanza = await this.xmppChatAdapter.chatConnectionService.sendIq(new RetrieveDataStanzaBuilder(node).toStanza());
            return iqResponseStanza.getChild('pubsub').getChild('items').getChildren('item');
        }
        catch (e) {
            if (e instanceof XmppResponseError &&
                (e.errorCondition === 'item-not-found' || e.errorCode === 404)) {
                return [];
            }
            throw e;
        }
    }
    async determineSupportForPrivatePublish() {
        let isSupported;
        try {
            const service = await this.serviceDiscoveryPlugin.findService('pubsub', 'pep');
            isSupported = service.features.includes('http://jabber.org/protocol/pubsub#publish-options');
        }
        catch (e) {
            isSupported = false;
        }
        this.supportsPrivatePublish.next(isSupported);
    }
}

const MUC_SUB_FEATURE_ID = 'urn:xmpp:mucsub:0';
var MUC_SUB_EVENT_TYPE;
(function (MUC_SUB_EVENT_TYPE) {
    MUC_SUB_EVENT_TYPE["presence"] = "urn:xmpp:mucsub:nodes:presence";
    MUC_SUB_EVENT_TYPE["messages"] = "urn:xmpp:mucsub:nodes:messages";
    MUC_SUB_EVENT_TYPE["affiliations"] = "urn:xmpp:mucsub:nodes:affiliations";
    MUC_SUB_EVENT_TYPE["subscribers"] = "urn:xmpp:mucsub:nodes:subscribers";
    MUC_SUB_EVENT_TYPE["config"] = "urn:xmpp:mucsub:nodes:config";
    MUC_SUB_EVENT_TYPE["subject"] = "urn:xmpp:mucsub:nodes:subject";
    MUC_SUB_EVENT_TYPE["system"] = "urn:xmpp:mucsub:nodes:system";
})(MUC_SUB_EVENT_TYPE || (MUC_SUB_EVENT_TYPE = {}));
/**
 * support for https://docs.ejabberd.im/developer/xmpp-clients-bots/extensions/muc-sub/
 */
class MucSubPlugin extends AbstractXmppPlugin {
    constructor(xmppChatAdapter, serviceDiscoveryPlugin) {
        super();
        this.xmppChatAdapter = xmppChatAdapter;
        this.serviceDiscoveryPlugin = serviceDiscoveryPlugin;
        this.supportsMucSub$ = new BehaviorSubject('unknown');
    }
    onBeforeOnline() {
        return this.determineSupportForMucSub();
    }
    async determineSupportForMucSub() {
        let isSupported;
        try {
            const service = await this.serviceDiscoveryPlugin.findService('conference', 'text');
            isSupported = service.features.includes(MUC_SUB_FEATURE_ID);
        }
        catch (e) {
            isSupported = false;
        }
        this.supportsMucSub$.next(isSupported);
    }
    onOffline() {
        this.supportsMucSub$.next('unknown');
    }
    async subscribeRoom(roomJid, nodes = []) {
        const nick = this.xmppChatAdapter.chatConnectionService.userJid.local;
        await this.xmppChatAdapter.chatConnectionService.sendIq(makeSubscribeRoomStanza(roomJid, nick, nodes));
    }
    async unsubscribeRoom(roomJid) {
        await this.xmppChatAdapter.chatConnectionService.sendIq(makeUnsubscribeRoomStanza(roomJid));
    }
    /**
     * A room moderator can unsubscribe others providing the their jid as attribute to the information query (iq)
     * see: https://docs.ejabberd.im/developer/xmpp-clients-bots/extensions/muc-sub/#unsubscribing-from-a-muc-room
     * @param roomJid for the room to be unsubscribed from
     * @param jid user id to be unsubscribed
     */
    unsubscribeJidFromRoom(roomJid, jid) {
        this.xmppChatAdapter.chatConnectionService.sendIq(xml('iq', { type: 'set', to: roomJid }, xml('unsubscribe', { xmlns: 'urn:xmpp:mucsub:0', jid })));
    }
    /**
     * A user can query the MUC service to get their list of subscriptions.
     * see: https://docs.ejabberd.im/developer/xmpp-clients-bots/extensions/muc-sub/#g dd ddetting-list-of-subscribed-rooms
     */
    async getSubscribedRooms() {
        const { local, domain } = this.xmppChatAdapter.chatConnectionService.userJid;
        const from = `${local}@${domain}`;
        const subscriptions = await this.xmppChatAdapter.chatConnectionService.sendIq(xml('iq', { type: 'get', from, to: 'muc.' + domain }, xml('subscriptions', { xmlns: 'urn:xmpp:mucsub:0' })));
        return subscriptions.getChildren('subscription').map(sub => sub.getAttr('jid'));
    }
    /**
     * A subscriber or room moderator can get the list of subscribers by sending <subscriptions/> request directly to the room JID.
     * see: https://docs.ejabberd.im/developer/xmpp-clients-bots/extensions/muc-sub/#getting-list-of-subscribers-of-a-room
     * @param roomJid of the room the get a subscriber list from
     */
    getSubscribers(roomJid) {
        this.xmppChatAdapter.chatConnectionService.sendIq(xml('iq', { type: 'get', to: roomJid }, xml('subscriptions', { xmlns: 'urn:xmpp:mucsub:0' })));
    }
    async retrieveSubscriptions() {
        const service = await this.serviceDiscoveryPlugin.findService('conference', 'text');
        const result = await this.xmppChatAdapter.chatConnectionService.sendIq(makeRetrieveSubscriptionsStanza(service.jid));
        const subscriptions = result
            .getChild('subscriptions', MUC_SUB_FEATURE_ID)
            ?.getChildren('subscription')
            ?.map(subscriptionElement => {
            const subscribedEvents = subscriptionElement
                .getChildren('event')
                ?.map(eventElement => eventElement.attrs.node) ?? [];
            return [subscriptionElement.attrs.jid, subscribedEvents];
        });
        return new Map(subscriptions);
    }
}
function makeSubscribeRoomStanza(roomJid, nick, nodes) {
    return xml('iq', { type: 'set', to: roomJid }, xml('subscribe', { xmlns: MUC_SUB_FEATURE_ID, nick }, ...nodes.map(node => xml('event', { node }))));
}
function makeUnsubscribeRoomStanza(roomJid) {
    return xml('iq', { type: 'set', to: roomJid }, xml('unsubscribe', { xmlns: MUC_SUB_FEATURE_ID }));
}
function makeRetrieveSubscriptionsStanza(conferenceServiceJid) {
    return xml('iq', { type: 'get', to: conferenceServiceJid }, xml('subscriptions', { xmlns: MUC_SUB_FEATURE_ID }));
}

/**
 * https://xmpp.org/extensions/xep-0313.html
 * Message Archive Management
 */
class MessageArchivePlugin extends AbstractXmppPlugin {
    constructor(chatService, serviceDiscoveryPlugin, multiUserChatPlugin, logService, messagePlugin) {
        super();
        this.chatService = chatService;
        this.serviceDiscoveryPlugin = serviceDiscoveryPlugin;
        this.multiUserChatPlugin = multiUserChatPlugin;
        this.logService = logService;
        this.messagePlugin = messagePlugin;
        this.mamMessageReceived$ = new Subject();
        this.chatService.state$
            .pipe(filter(state => state === 'online'))
            .subscribe(async () => {
            if (await this.supportsMessageArchiveManagement()) {
                await this.requestNewestMessages();
            }
        });
        // emit contacts to refresh contact list after receiving mam messages
        this.mamMessageReceived$
            .pipe(debounceTime(10))
            .subscribe(() => this.chatService.contacts$.next(this.chatService.contacts$.getValue()));
    }
    async requestNewestMessages() {
        await this.chatService.chatConnectionService.sendIq(xml('iq', { type: 'set' }, xml('query', { xmlns: MessageArchivePlugin.MAM_NS }, xml('set', { xmlns: 'http://jabber.org/protocol/rsm' }, xml('max', {}, '250'), xml('before')))));
    }
    async loadMostRecentUnloadedMessages(recipient) {
        // for user-to-user chats no to-attribute is necessary, in case of multi-user-chats it has to be set to the bare room jid
        const to = recipient.recipientType === 'room' ? recipient.roomJid.toString() : undefined;
        const form = {
            type: 'submit',
            instructions: [],
            fields: [
                { type: 'hidden', variable: 'FORM_TYPE', value: MessageArchivePlugin.MAM_NS },
                ...(recipient.recipientType === 'contact'
                    ? [{ type: 'jid-single', variable: 'with', value: recipient.jidBare }]
                    : []),
                ...(recipient.oldestMessage
                    ? [{ type: 'text-single', variable: 'end', value: recipient.oldestMessage.datetime.toISOString() }]
                    : []),
            ],
        };
        const request = xml('iq', { type: 'set', to }, xml('query', { xmlns: MessageArchivePlugin.MAM_NS }, serializeToSubmitForm(form), xml('set', { xmlns: 'http://jabber.org/protocol/rsm' }, xml('max', {}, '100'), xml('before'))));
        await this.chatService.chatConnectionService.sendIq(request);
    }
    async loadAllMessages() {
        if (!(await this.supportsMessageArchiveManagement())) {
            throw new Error('message archive management not suppported');
        }
        let lastMamResponse = await this.chatService.chatConnectionService.sendIq(xml('iq', { type: 'set' }, xml('query', { xmlns: MessageArchivePlugin.MAM_NS })));
        while (lastMamResponse.getChild('fin').attrs.complete !== 'true') {
            const lastReceivedMessageId = lastMamResponse.getChild('fin').getChild('set').getChildText('last');
            lastMamResponse = await this.chatService.chatConnectionService.sendIq(xml('iq', { type: 'set' }, xml('query', { xmlns: MessageArchivePlugin.MAM_NS }, xml('set', { xmlns: 'http://jabber.org/protocol/rsm' }, xml('max', {}, '250'), xml('after', {}, lastReceivedMessageId)))));
        }
    }
    async supportsMessageArchiveManagement() {
        const supportsMessageArchiveManagement = await this.serviceDiscoveryPlugin.supportsFeature(this.chatService.chatConnectionService.userJid.bare().toString(), MessageArchivePlugin.MAM_NS);
        if (!supportsMessageArchiveManagement) {
            this.logService.info('server doesn\'t support MAM');
        }
        return supportsMessageArchiveManagement;
    }
    handleStanza(stanza) {
        if (this.isMamMessageStanza(stanza)) {
            this.handleMamMessageStanza(stanza);
            return true;
        }
        return false;
    }
    isMamMessageStanza(stanza) {
        const result = stanza.getChild('result');
        return stanza.name === 'message' && result?.attrs.xmlns === MessageArchivePlugin.MAM_NS;
    }
    handleMamMessageStanza(stanza) {
        const forwardedElement = stanza.getChild('result').getChild('forwarded');
        const messageElement = forwardedElement.getChild('message');
        const delayElement = forwardedElement.getChild('delay');
        const eventElement = messageElement.getChild('event', PUBSUB_EVENT_XMLNS);
        if (messageElement.getAttr('type') == null && eventElement != null) {
            this.handlePubSubEvent(eventElement, delayElement);
        }
        else {
            this.handleArchivedMessage(messageElement, delayElement);
        }
    }
    handleArchivedMessage(messageElement, delayEl) {
        const type = messageElement.getAttr('type');
        if (type === 'chat') {
            const messageHandled = this.messagePlugin.handleStanza(messageElement, delayEl);
            if (messageHandled) {
                this.mamMessageReceived$.next();
            }
        }
        else if (type === 'groupchat' || this.multiUserChatPlugin.isRoomInvitationStanza(messageElement)) {
            this.multiUserChatPlugin.handleStanza(messageElement, delayEl);
        }
        else {
            throw new Error(`unknown archived message type: ${type}`);
        }
    }
    handlePubSubEvent(eventElement, delayElement) {
        const itemsElement = eventElement.getChild('items');
        const itemsNode = itemsElement?.attrs.node;
        if (itemsNode !== MUC_SUB_EVENT_TYPE.messages) {
            this.logService.warn(`Handling of MUC/Sub message types other than ${MUC_SUB_EVENT_TYPE.messages} isn't implemented yet!`);
            return;
        }
        const itemElements = itemsElement.getChildren('item');
        itemElements.forEach((itemEl) => this.handleArchivedMessage(itemEl.getChild('message'), delayElement));
    }
}
MessageArchivePlugin.MAM_NS = 'urn:xmpp:mam:2';

/**
 * Optional injectable token to handle contact reports in the chat
 */
const REPORT_USER_INJECTION_TOKEN = new InjectionToken('ngxChatReportUserService');

const urlRegex = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
function extractUrls(message) {
    return message.match(urlRegex) || [];
}

function id() {
    let i;
    while (!i) {
        i = Math.random()
            .toString(36)
            .substr(2, 12);
    }
    return i;
}

/**
 * https://xmpp.org/extensions/xep-0359.html
 */
class MessageUuidPlugin extends AbstractXmppPlugin {
    static extractIdFromStanza(messageStanza) {
        const originIdElement = messageStanza.getChild('origin-id');
        const stanzaIdElement = messageStanza.getChild('stanza-id');
        return messageStanza.attrs.id || (originIdElement && originIdElement.attrs.id) || (stanzaIdElement && stanzaIdElement.attrs.id);
    }
    beforeSendMessage(messageStanza, message) {
        const generatedId = id();
        messageStanza.children.push(xml('origin-id', { xmlns: 'urn:xmpp:sid:0', id: generatedId }));
        if (message) {
            message.id = generatedId;
        }
    }
    afterSendMessage(message, messageStanza) {
        message.id = MessageUuidPlugin.extractIdFromStanza(messageStanza);
    }
    afterReceiveMessage(message, messageStanza) {
        message.id = MessageUuidPlugin.extractIdFromStanza(messageStanza);
    }
}

const STORAGE_NGX_CHAT_CONTACT_MESSAGE_STATES = 'ngxchat:contactmessagestates';
const wrapperNodeName$1 = 'entries';
const nodeName$1 = 'contact-message-state';
/**
 * Plugin using PubSub to persist message read states.
 * Custom not part of the XMPP Specification
 * Standardized implementation specification would be https://xmpp.org/extensions/xep-0184.html
 */
class MessageStatePlugin extends AbstractXmppPlugin {
    constructor(publishSubscribePlugin, xmppChatAdapter, chatMessageListRegistry, logService, entityTimePlugin) {
        super();
        this.publishSubscribePlugin = publishSubscribePlugin;
        this.xmppChatAdapter = xmppChatAdapter;
        this.chatMessageListRegistry = chatMessageListRegistry;
        this.logService = logService;
        this.entityTimePlugin = entityTimePlugin;
        this.jidToMessageStateDate = new Map();
        this.chatMessageListRegistry.openChats$
            .pipe(filter(() => xmppChatAdapter.state$.getValue() === 'online'))
            .subscribe(contacts => {
            contacts.forEach(async (contact) => {
                if (contact.mostRecentMessageReceived) {
                    await this.sendMessageStateNotification(contact.jidBare, contact.mostRecentMessageReceived.id, MessageState.RECIPIENT_SEEN);
                }
            });
        });
        this.publishSubscribePlugin.publish$
            .subscribe((event) => this.handlePubSubEvent(event));
    }
    async onBeforeOnline() {
        this.parseContactMessageStates().catch(err => this.logService.error('error parsing contact message states', err));
    }
    async parseContactMessageStates() {
        const itemElements = await this.publishSubscribePlugin.retrieveNodeItems(STORAGE_NGX_CHAT_CONTACT_MESSAGE_STATES);
        this.processPubSub(itemElements);
    }
    processPubSub(itemElements) {
        let results = [];
        if (itemElements.length === 1) {
            results = itemElements[0]
                .getChild(wrapperNodeName$1)
                .getChildren(nodeName$1)
                .map((contactMessageStateElement) => {
                const { lastRecipientReceived, lastRecipientSeen, lastSent, jid } = contactMessageStateElement.attrs;
                return [
                    jid,
                    {
                        lastRecipientSeen: new Date(+lastRecipientSeen || 0),
                        lastRecipientReceived: new Date(+lastRecipientReceived || 0),
                        lastSent: new Date(+lastSent || 0),
                    }
                ];
            });
        }
        this.jidToMessageStateDate = new Map(results);
    }
    async persistContactMessageStates() {
        const messageStateElements = [...this.jidToMessageStateDate.entries()]
            .map(([jid, stateDates]) => xml(nodeName$1, {
            jid,
            lastRecipientReceived: String(stateDates.lastRecipientReceived.getTime()),
            lastRecipientSeen: String(stateDates.lastRecipientSeen.getTime()),
            lastSent: String(stateDates.lastSent.getTime()),
        }));
        await this.publishSubscribePlugin.storePrivatePayloadPersistent(STORAGE_NGX_CHAT_CONTACT_MESSAGE_STATES, 'current', xml(wrapperNodeName$1, {}, ...messageStateElements));
    }
    onOffline() {
        this.jidToMessageStateDate.clear();
    }
    beforeSendMessage(messageStanza, message) {
        const { type } = messageStanza.attrs;
        if (type === 'chat' && message) {
            message.state = MessageState.SENDING;
        }
    }
    async afterSendMessage(message, messageStanza) {
        const { type, to } = messageStanza.attrs;
        if (type === 'chat') {
            this.updateContactMessageState(jid$1(to).bare().toString(), MessageState.SENT, new Date(await this.entityTimePlugin.getNow()));
            delete message.state;
        }
    }
    afterReceiveMessage(messageReceived, stanza, messageReceivedEvent) {
        const messageStateElement = stanza.getChild('message-state', STORAGE_NGX_CHAT_CONTACT_MESSAGE_STATES);
        if (messageStateElement) {
            // we received a message state or a message via carbon from another resource, discard it
            messageReceivedEvent.discard = true;
        }
        else if (messageReceived.direction === Direction.in && !messageReceived.fromArchive && stanza.attrs.type !== 'groupchat') {
            this.acknowledgeReceivedMessage(stanza);
        }
    }
    acknowledgeReceivedMessage(stanza) {
        const { from } = stanza.attrs;
        const isChatWithContactOpen = this.chatMessageListRegistry.isChatOpen(this.xmppChatAdapter.getOrCreateContactById(from));
        const state = isChatWithContactOpen ? MessageState.RECIPIENT_SEEN : MessageState.RECIPIENT_RECEIVED;
        const messageId = MessageUuidPlugin.extractIdFromStanza(stanza);
        this.sendMessageStateNotification(jid$1(from), messageId, state).catch(e => this.logService.error('error sending state notification', e));
    }
    async sendMessageStateNotification(recipient, messageId, state) {
        const messageStateResponse = xml('message', {
            to: recipient.bare().toString(),
            from: this.xmppChatAdapter.chatConnectionService.userJid.toString(),
            type: 'chat'
        }, xml('message-state', {
            xmlns: STORAGE_NGX_CHAT_CONTACT_MESSAGE_STATES,
            messageId,
            date: new Date(await this.entityTimePlugin.getNow()).toISOString(),
            state
        }));
        await this.xmppChatAdapter.chatConnectionService.send(messageStateResponse);
    }
    handleStanza(stanza) {
        const { type, from } = stanza.attrs;
        const stateElement = stanza.getChild('message-state', STORAGE_NGX_CHAT_CONTACT_MESSAGE_STATES);
        if (type === 'chat' && stateElement) {
            this.handleStateNotificationStanza(stateElement, from);
            return true;
        }
        return false;
    }
    handleStateNotificationStanza(stateElement, from) {
        const { state, date } = stateElement.attrs;
        const contact = this.xmppChatAdapter.getOrCreateContactById(from);
        const stateDate = new Date(date);
        this.updateContactMessageState(contact.jidBare.toString(), state, stateDate);
    }
    updateContactMessageState(contactJid, state, stateDate) {
        const current = this.getContactMessageState(contactJid);
        let changed = false;
        if (state === MessageState.RECIPIENT_RECEIVED && current.lastRecipientReceived < stateDate) {
            current.lastRecipientReceived = stateDate;
            changed = true;
        }
        else if (state === MessageState.RECIPIENT_SEEN && current.lastRecipientSeen < stateDate) {
            current.lastRecipientReceived = stateDate;
            current.lastRecipientSeen = stateDate;
            changed = true;
        }
        else if (state === MessageState.SENT && current.lastSent < stateDate) {
            current.lastSent = stateDate;
            changed = true;
        }
        if (changed) {
            this.persistContactMessageStates().catch(err => this.logService.error('error persisting contact message states', err));
        }
    }
    getContactMessageState(contactJid) {
        if (!this.jidToMessageStateDate.has(contactJid)) {
            this.jidToMessageStateDate.set(contactJid, {
                lastRecipientReceived: new Date(0),
                lastRecipientSeen: new Date(0),
                lastSent: new Date(0),
            });
        }
        return this.jidToMessageStateDate.get(contactJid);
    }
    handlePubSubEvent(event) {
        const items = event.getChild('items');
        const itemsNode = items?.attrs.node;
        const itemElements = items?.getChildren('item');
        if (itemsNode === STORAGE_NGX_CHAT_CONTACT_MESSAGE_STATES && itemElements) {
            this.processPubSub(itemElements);
        }
    }
}

// tslint:disable
const dummyAvatarContact = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDYwMCA2MDAiPgogIDxkZWZzPgogICAgPGNsaXBQYXRoIGlkPSJjbGlwLV8xIj4KICAgICAgPHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI2MDAiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJfMSIgZGF0YS1uYW1lPSIxIiBjbGlwLXBhdGg9InVybCgjY2xpcC1fMSkiPgogICAgPHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiNmZmYiLz4KICAgIDxnIGlkPSJHcnVwcGVfNzcxNyIgZGF0YS1uYW1lPSJHcnVwcGUgNzcxNyI+CiAgICAgIDxyZWN0IGlkPSJSZWNodGVja18xMzk3IiBkYXRhLW5hbWU9IlJlY2h0ZWNrIDEzOTciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjZTVlNmU4Ii8+CiAgICAgIDxlbGxpcHNlIGlkPSJFbGxpcHNlXzI4MyIgZGF0YS1uYW1lPSJFbGxpcHNlIDI4MyIgY3g9IjExNi4yMzEiIGN5PSIxMjUuNjcxIiByeD0iMTE2LjIzMSIgcnk9IjEyNS42NzEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE4NS4yMzEgMTExLjQ4NSkiIGZpbGw9IiNhZmI0YjgiLz4KICAgICAgPHBhdGggaWQ9IlBmYWRfMjQ5NjIiIGRhdGEtbmFtZT0iUGZhZCAyNDk2MiIgZD0iTTU0Ni4zNTksNTk1LjI3NnMwLTIxNy41NjMtMjQ0LjkwOS0yMTcuNTYzaC0xLjQ1N2MtMjQ0LjkwOSwwLTI0NC45MDksMjE3LjU2My0yNDQuOTA5LDIxNy41NjMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgNC43MjQpIiBmaWxsPSIjYWZiNGI4Ii8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K';
const dummyAvatarRoom = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDYwMCA2MDAiPgogIDxkZWZzPgogICAgPGNsaXBQYXRoIGlkPSJjbGlwLV8zIj4KICAgICAgPHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI2MDAiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJfMyIgZGF0YS1uYW1lPSIzIiBjbGlwLXBhdGg9InVybCgjY2xpcC1fMykiPgogICAgPHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiNmZmYiLz4KICAgIDxnIGlkPSJHcnVwcGVfNzcxOCIgZGF0YS1uYW1lPSJHcnVwcGUgNzcxOCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTc4MC42OTcgODgxLjUpIj4KICAgICAgPHJlY3QgaWQ9IlJlY2h0ZWNrXzEzOTgiIGRhdGEtbmFtZT0iUmVjaHRlY2sgMTM5OCIgd2lkdGg9IjYwMCIgaGVpZ2h0PSI1OTkuOTk1IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3ODAuNjk3IC04ODEuNSkiIGZpbGw9IiNlNWU2ZTgiLz4KICAgICAgPGVsbGlwc2UgaWQ9IkVsbGlwc2VfMjg0IiBkYXRhLW5hbWU9IkVsbGlwc2UgMjg0IiBjeD0iMTE2LjIzMSIgY3k9IjEyNS42NzEiIHJ4PSIxMTYuMjMxIiByeT0iMTI1LjY3MSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOTY1LjkyNiAtNzY5LjA5MykiIGZpbGw9IiNhZmI0YjgiLz4KICAgICAgPGVsbGlwc2UgaWQ9IkVsbGlwc2VfMjg1IiBkYXRhLW5hbWU9IkVsbGlwc2UgMjg1IiBjeD0iNjcuOTk4IiBjeT0iNzMuNTIxIiByeD0iNjcuOTk4IiByeT0iNzMuNTIxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4MTYuMjEgLTY2NS40OTYpIiBmaWxsPSIjYWZiNGI4Ii8+CiAgICAgIDxlbGxpcHNlIGlkPSJFbGxpcHNlXzI4OSIgZGF0YS1uYW1lPSJFbGxpcHNlIDI4OSIgY3g9IjY3Ljk5OCIgY3k9IjczLjUyMSIgcng9IjY3Ljk5OCIgcnk9IjczLjUyMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTIxMi4xMDcgLTY2NS40OTYpIiBmaWxsPSIjYWZiNGI4Ii8+CiAgICAgIDxwYXRoIGlkPSJQZmFkXzI0OTYzIiBkYXRhLW5hbWU9IlBmYWQgMjQ5NjMiIGQ9Ik0xMzI3LjA1Mi0yODYuMjI1czAtMjE3LjU2My0yNDQuOTA3LTIxNy41NjNoLTEuNDU3Yy0yNDQuOTA3LDAtMjQ0LjkwNywyMTcuNTYzLTI0NC45MDcsMjE3LjU2M1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgNC43MjUpIiBmaWxsPSIjYWZiNGI4Ii8+CiAgICAgIDxwYXRoIGlkPSJQZmFkXzI0OTY0IiBkYXRhLW5hbWU9IlBmYWQgMjQ5NjQiIGQ9Ik05MzMuOTc3LTQ4My44Yy0xLjA1LjYtMi4xLDEuMjItMy4xNCwxLjg0LTMyLjM0LDE5LjM0LTU4LjI5LDQ2LjI3LTc3LjEyLDgwLjA1LTMxLjcsNTYuODgtMzQuMzU1LDExOC43MjgtMzQuMzU1LDEyMS4yNDhoLTQwLjkxTDc4MC43LTQ3MS4zMmMyMy4yOC0xOC44Miw1Ny4wNS0zMi40NywxMDYuMDQtMzIuNDdoLjk0YTIxNy43NTMsMjE3Ljc1MywwLDAsMSw0My44Myw0LjE4QTguNTQ5LDguNTQ5LDAsMCwxLDkzMy45NzctNDgzLjhaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTAgLTAuNzI1KSIgZmlsbD0iI2FmYjRiOCIvPgogICAgICA8cGF0aCBpZD0iUGZhZF8yNDk2OCIgZGF0YS1uYW1lPSJQZmFkIDI0OTY4IiBkPSJNNzgyLjc5LTQ4My44YzEuMDUuNiwyLjEsMS4yMiwzLjE0LDEuODQsMzIuMzQsMTkuMzQsNTguMjksNDYuMjcsNzcuMTIsODAuMDUsMzEuNyw1Ni44OCwzNC4zNTUsMTE4LjcyOCwzNC4zNTUsMTIxLjI0OGg0MC45MUw5MzYuMDctNDcxLjMyYy0yMy4yOC0xOC44Mi01Ny4wNS0zMi40Ny0xMDYuMDQtMzIuNDdoLS45NGEyMTcuNzUzLDIxNy43NTMsMCwwLDAtNDMuODMsNC4xOEE4LjU0OSw4LjU0OSwwLDAsMCw3ODIuNzktNDgzLjhaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0NTcuNTQ3IC0wLjcyNikiIGZpbGw9IiNhZmI0YjgiLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo=';

var Presence;
(function (Presence) {
    Presence["present"] = "present";
    Presence["unavailable"] = "unavailable";
    Presence["away"] = "away";
})(Presence || (Presence = {}));

function defaultTranslations() {
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

const mucNs = 'http://jabber.org/protocol/muc';
const mucUserNs = `${mucNs}#user`;
const mucAdminNs = `${mucNs}#admin`;
const mucOwnerNs = `${mucNs}#owner`;
const mucRoomConfigFormNs = `${mucNs}#roomconfig`;
const mucRequestFormNs = `${mucNs}#request`;

class MessageReceivedEvent {
    constructor() {
        this.discard = false;
    }
}
/**
 * Part of the XMPP Core Specification
 * see: https://datatracker.ietf.org/doc/rfc6120/
 */
class MessagePlugin extends AbstractXmppPlugin {
    constructor(xmppChatAdapter, logService) {
        super();
        this.xmppChatAdapter = xmppChatAdapter;
        this.logService = logService;
    }
    handleStanza(stanza, archiveDelayElement) {
        if (this.isMessageStanza(stanza)) {
            this.handleMessageStanza(stanza, archiveDelayElement);
            return true;
        }
        return false;
    }
    sendMessage(contact, body) {
        const messageStanza = xml('message', {
            to: contact.jidBare.toString(),
            from: this.xmppChatAdapter.chatConnectionService.userJid.toString(),
            type: 'chat',
        }, xml('body', {}, body));
        const message = {
            direction: Direction.out,
            body,
            datetime: new Date(),
            delayed: false,
            fromArchive: false,
        };
        this.xmppChatAdapter.plugins.forEach(plugin => plugin.beforeSendMessage(messageStanza, message));
        contact.addMessage(message);
        // TODO: on rejection mark message that it was not sent successfully
        this.xmppChatAdapter.chatConnectionService.send(messageStanza).then(() => {
            this.xmppChatAdapter.plugins.forEach(plugin => plugin.afterSendMessage(message, messageStanza));
        }, (rej) => {
            this.logService.error('rejected message ' + message.id, rej);
        });
    }
    isMessageStanza(stanza) {
        return stanza.name === 'message'
            && stanza.attrs.type !== 'groupchat'
            && stanza.attrs.type !== 'error'
            && !!stanza.getChildText('body')?.trim();
    }
    handleMessageStanza(messageStanza, archiveDelayElement) {
        const isAddressedToMe = this.xmppChatAdapter.chatConnectionService.userJid.bare()
            .equals(jid$1(messageStanza.attrs.to).bare());
        const messageDirection = isAddressedToMe ? Direction.in : Direction.out;
        const messageFromArchive = archiveDelayElement != null;
        const delayElement = archiveDelayElement ?? messageStanza.getChild('delay');
        const datetime = delayElement?.attrs.stamp
            ? new Date(delayElement.attrs.stamp)
            : new Date() /* TODO: replace with entity time plugin */;
        if (messageDirection === Direction.in && !messageFromArchive) {
            this.logService.debug('message received <=', messageStanza.getChildText('body'));
        }
        const message = {
            body: messageStanza.getChildText('body').trim(),
            direction: messageDirection,
            datetime,
            delayed: !!delayElement,
            fromArchive: messageFromArchive,
        };
        const messageReceivedEvent = new MessageReceivedEvent();
        this.xmppChatAdapter.plugins.forEach(plugin => plugin.afterReceiveMessage(message, messageStanza, messageReceivedEvent));
        if (messageReceivedEvent.discard) {
            return;
        }
        const contactJid = isAddressedToMe ? messageStanza.attrs.from : messageStanza.attrs.to;
        const contact = this.xmppChatAdapter.getOrCreateContactById(contactJid);
        contact.addMessage(message);
        const isRoomInviteMessage = messageStanza.getChild('x', mucUserNs)
            || messageStanza.getChild('x', MessagePlugin.MUC_DIRECT_INVITATION_NS);
        if (isRoomInviteMessage) {
            contact.pendingRoomInvite$.next(this.extractInvitationFromMessage(messageStanza));
        }
        if (messageDirection === Direction.in && !messageFromArchive) {
            this.xmppChatAdapter.message$.next(contact);
        }
    }
    extractInvitationFromMessage(messageStanza) {
        const mediatedInvitation = messageStanza.getChild('x', mucUserNs);
        if (mediatedInvitation) {
            const inviteEl = mediatedInvitation.getChild('invite');
            return {
                from: jid$1(inviteEl.attrs.from),
                roomJid: jid$1(messageStanza.attrs.from),
                reason: inviteEl.getChildText('reason'),
                password: mediatedInvitation.getChildText('password'),
            };
        }
        const directInvitation = messageStanza.getChild('x', MessagePlugin.MUC_DIRECT_INVITATION_NS);
        if (directInvitation) {
            return {
                from: jid$1(messageStanza.attrs.from),
                roomJid: jid$1(directInvitation.attrs.jid),
                reason: directInvitation.attrs.reason,
                password: directInvitation.attrs.password,
            };
        }
        throw new Error(`unknown invitation format: ${messageStanza.toString()}`);
    }
}
MessagePlugin.MUC_DIRECT_INVITATION_NS = 'jabber:x:conference';

class StanzaBuilder {
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

class QueryStanzaBuilder extends AbstractStanzaBuilder {
    constructor(xmlns, to) {
        super();
        this.xmlns = xmlns;
        this.to = to;
    }
    toStanza() {
        return xml('iq', {
            type: 'get',
            ...(this.to ? { to: this.to } : {}),
        }, xml('query', { xmlns: this.xmlns }));
    }
}
/**
 * see XEP-0030 Service Discovery
 */
class ServiceDiscoveryPlugin extends AbstractXmppPlugin {
    constructor(chatAdapter) {
        super();
        this.chatAdapter = chatAdapter;
        this.servicesInitialized$ = new BehaviorSubject(false);
        this.hostedServices = [];
        this.resourceCache = new Map();
    }
    async onBeforeOnline() {
        await this.discoverServices(this.chatAdapter.chatConnectionService.userJid.domain);
        this.servicesInitialized$.next(true);
    }
    onOffline() {
        this.servicesInitialized$.next(false);
        this.hostedServices = [];
        this.resourceCache.clear();
    }
    supportsFeature(jid, searchedFeature) {
        return new Promise((resolve, reject) => {
            this.servicesInitialized$.pipe(first(value => !!value)).subscribe(async () => {
                try {
                    const service = this.resourceCache.get(jid) || await this.discoverServiceInformation(jid);
                    if (!service) {
                        reject(new Error('no service found for jid ' + jid));
                    }
                    resolve(service.features.includes(searchedFeature));
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
    findService(category, type) {
        return new Promise((resolve, reject) => {
            this.servicesInitialized$.pipe(first(value => !!value)).subscribe(() => {
                const results = this.hostedServices.filter(service => service.identitiesAttrs.filter(identityAttrs => identityAttrs.category === category
                    && identityAttrs.type === type).length > 0);
                if (results.length === 0) {
                    reject(new Error(`no service matching category ${category} and type ${type} found!`));
                }
                else if (results.length > 1) {
                    reject(new Error(`multiple services matching category ${category} and type ${type} found! ${JSON.stringify(results)}`));
                }
                else {
                    return resolve(results[0]);
                }
            });
        });
    }
    async discoverServices(mainDomain) {
        const serviceListResponse = await this.chatAdapter.chatConnectionService.sendIq(new QueryStanzaBuilder(ServiceDiscoveryPlugin.DISCO_ITEMS, this.chatAdapter.chatConnectionService.userJid.domain).toStanza());
        const serviceDomains = new Set(serviceListResponse
            .getChild('query')
            .getChildren('item')
            .map((itemNode) => itemNode.attrs.jid));
        serviceDomains.add(mainDomain);
        const discoveredServices = await Promise.all([...serviceDomains.keys()]
            .map((serviceDomain) => this.discoverServiceInformation(serviceDomain)));
        this.hostedServices.push(...discoveredServices);
    }
    async discoverServiceInformation(serviceDomain) {
        const serviceInformationResponse = await this.chatAdapter.chatConnectionService.sendIq(new QueryStanzaBuilder(ServiceDiscoveryPlugin.DISCO_INFO, serviceDomain).toStanza());
        const queryNode = serviceInformationResponse.getChild('query');
        const features = queryNode.getChildren('feature').map((featureNode) => featureNode.attrs.var);
        const identitiesAttrs = queryNode
            .getChildren('identity')
            .filter((identityNode) => identityNode.attrs)
            .map((identityNode) => identityNode.attrs);
        const serviceInformation = {
            identitiesAttrs: this.isIdentitiesAttrs(identitiesAttrs) ? identitiesAttrs : [],
            features,
            jid: serviceInformationResponse.attrs.from,
        };
        this.resourceCache.set(serviceInformationResponse.attrs.from, serviceInformation);
        return serviceInformation;
    }
    isIdentitiesAttrs(elements) {
        return elements.every((element) => {
            const keys = Object.keys(element);
            const mustHave = keys.includes('category') && keys.includes('type');
            if (keys.length === 2) {
                return mustHave;
            }
            else if (keys.length === 3) {
                return mustHave && keys.includes('name');
            }
            return false;
        });
    }
}
ServiceDiscoveryPlugin.DISCO_INFO = 'http://jabber.org/protocol/disco#info';
ServiceDiscoveryPlugin.DISCO_ITEMS = 'http://jabber.org/protocol/disco#items';

const identity = elem => elem;
const toString = elem => elem.toString();
/**
 * given a sorted list, insert the given item in place after the last matching item.
 * @param elemToInsert the item to insert
 * @param list the list in which the element should be inserted
 * @param keyExtractor an optional element mapper, defaults to toString
 */
function insertSortedLast(elemToInsert, list, keyExtractor = toString) {
    list.splice(findSortedInsertionIndexLast(keyExtractor(elemToInsert), list, keyExtractor), 0, elemToInsert);
}
/**
 * Find the highest possible index where the given element should be inserted so that the order of the list is preserved.
 * @param needle the needle to find
 * @param haystack the pre sorted list
 * @param keyExtractor an optional needle mapper, defaults to toString
 */
function findSortedInsertionIndexLast(needle, haystack, keyExtractor = toString) {
    let low = 0;
    let high = haystack.length;
    while (low !== high) {
        const cur = Math.floor(low + (high - low) / 2);
        if (needle < keyExtractor(haystack[cur])) {
            high = cur;
        }
        else {
            low = cur + 1;
        }
    }
    return low;
}
/**
 * Find the index of an element in a sorted list. If list contains no matching element, return -1.
 */
function findSortedIndex(needle, haystack, keyExtractor = toString) {
    let low = 0;
    let high = haystack.length;
    while (low !== high) {
        const cur = Math.floor(low + (high - low) / 2);
        const extractedKey = keyExtractor(haystack[cur]);
        if (needle < extractedKey) {
            high = cur;
        }
        else if (needle > extractedKey) {
            low = cur + 1;
        }
        else {
            return cur;
        }
    }
    return -1;
}
/**
 * Like {@link Array.prototype.findIndex} but finds the last index instead.
 */
function findLastIndex(arr, predicate) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (predicate(arr[i])) {
            return i;
        }
    }
    return -1;
}
/**
 * Like {@link Array.prototype.find} but finds the last matching element instead.
 */
function findLast(arr, predicate) {
    return arr[findLastIndex(arr, predicate)];
}
/**
 * Return a new array, where all elements from the original array occur exactly once.
 */
function removeDuplicates(arr, eq = (x, y) => x === y) {
    const results = [];
    for (const arrElement of arr) {
        let duplicateFound = false;
        for (const resultElement of results) {
            if (eq(arrElement, resultElement)) {
                duplicateFound = true;
                break;
            }
        }
        if (!duplicateFound) {
            results.push(arrElement);
        }
    }
    return results;
}

/**
 * converts date objects to date strings like '2011-10-05'
 */
function extractDateStringFromDate(date) {
    const isoString = date.toISOString();
    return isoString.slice(0, isoString.indexOf('T'));
}

class MessageStore {
    constructor(logService) {
        this.logService = logService;
        this.messages = [];
        this.dateMessageGroups = [];
        this.messageIdToMessage = new Map();
        this.messages$ = new Subject();
    }
    addMessage(message) {
        if (message.id && this.messageIdToMessage.has(message.id)) {
            if (this.logService) {
                this.logService.warn(`message with id ${message.id} already exists`);
            }
            return false;
        }
        insertSortedLast(message, this.messages, m => m.datetime);
        this.addToDateMessageGroups(message);
        this.messageIdToMessage.set(message.id, message);
        this.messages$.next(message);
        return true;
    }
    get oldestMessage() {
        return this.messages[0];
    }
    get mostRecentMessage() {
        return this.messages[this.messages.length - 1];
    }
    get mostRecentMessageReceived() {
        return findLast(this.messages, msg => msg.direction === Direction.in);
    }
    get mostRecentMessageSent() {
        return findLast(this.messages, msg => msg.direction === Direction.out);
    }
    addToDateMessageGroups(message) {
        const dateString = extractDateStringFromDate(message.datetime);
        const groupIndex = findSortedIndex(dateString, this.dateMessageGroups, group => extractDateStringFromDate(group.date));
        if (groupIndex !== -1) {
            insertSortedLast(message, this.dateMessageGroups[groupIndex].messages, m => m.datetime);
        }
        else {
            const groupToInsert = {
                date: message.datetime,
                messages: [message],
            };
            const insertIndex = findSortedInsertionIndexLast(dateString, this.dateMessageGroups, group => extractDateStringFromDate(group.date));
            this.dateMessageGroups.splice(insertIndex, 0, groupToInsert);
        }
    }
}

function isJid(o) {
    // due to unknown reasons, `o instanceof JID` does not work when
    // JID is instantiated by an application instead of ngx-chat
    return !!o.bare;
}

class Room {
    constructor(roomJid, logService) {
        this.logService = logService;
        this.recipientType = 'room';
        this.description = '';
        this.subject = '';
        this.avatar = dummyAvatarRoom;
        this.metadata = {};
        this.roomOccupants = new Map();
        this.onOccupantChangeSubject = new ReplaySubject(Infinity, 1000);
        this.onOccupantChange$ = this.onOccupantChangeSubject.asObservable();
        this.occupantsSubject = new ReplaySubject(1);
        this.occupants$ = this.occupantsSubject.asObservable();
        this.roomJid = roomJid.bare();
        this.name = undefined;
        this.messageStore = new MessageStore(logService);
    }
    get nick() {
        return this.occupantJid?.resource;
    }
    set nick(nick) {
        const occupantJid = jid$1(this.roomJid.toString());
        occupantJid.resource = nick;
        this.occupantJid = occupantJid;
    }
    get name() {
        return this._name;
    }
    set name(name) {
        this._name = !!name ? name : this.roomJid.local;
    }
    get jidBare() {
        return this.roomJid;
    }
    get messages$() {
        return this.messageStore.messages$;
    }
    get messages() {
        return this.messageStore.messages;
    }
    get dateMessagesGroups() {
        return this.messageStore.dateMessageGroups;
    }
    get oldestMessage() {
        return this.messageStore.oldestMessage;
    }
    get mostRecentMessage() {
        return this.messageStore.mostRecentMessage;
    }
    get mostRecentMessageReceived() {
        return this.messageStore.mostRecentMessageReceived;
    }
    get mostRecentMessageSent() {
        return this.messageStore.mostRecentMessageSent;
    }
    addMessage(message) {
        this.messageStore.addMessage(message);
    }
    equalsBareJid(other) {
        if (other instanceof Room || isJid(other)) {
            const otherJid = other instanceof Room ? other.roomJid : other.bare();
            return this.roomJid.equals(otherJid);
        }
        return false;
    }
    hasOccupant(occupantJid) {
        return this.roomOccupants.has(occupantJid.toString());
    }
    getOccupant(occupantJid) {
        return this.roomOccupants.get(occupantJid.toString());
    }
    handleOccupantJoined(occupant, isCurrentUser) {
        this.addOccupant(occupant);
        this.onOccupantChangeSubject.next({ change: 'joined', occupant, isCurrentUser });
        this.logService.debug(`occupant joined room: occupantJid=${occupant.occupantJid.toString()}, roomJid=${this.roomJid.toString()}`);
        return true;
    }
    handleOccupantLeft(occupant, isCurrentUser) {
        this.removeOccupant(occupant, isCurrentUser);
        this.logService.debug(`occupant left room: occupantJid=${occupant.occupantJid.toString()}, roomJid=${this.roomJid.toString()}`);
        this.onOccupantChangeSubject.next({ change: 'left', occupant, isCurrentUser });
        return true;
    }
    handleOccupantConnectionError(occupant, isCurrentUser) {
        this.removeOccupant(occupant, isCurrentUser);
        this.logService.debug(`occupant left room due to connection error: occupantJid=${occupant.occupantJid.toString()}, roomJid=${this.roomJid.toString()}`);
        this.onOccupantChangeSubject.next({ change: 'leftOnConnectionError', occupant, isCurrentUser });
        return true;
    }
    handleOccupantKicked(occupant, isCurrentUser, actor, reason) {
        this.removeOccupant(occupant, isCurrentUser);
        if (isCurrentUser) {
            this.logService.info(`you got kicked from room! roomJid=${this.roomJid.toString()}, by=${actor}, reason=${reason}`);
        }
        this.logService.debug(`occupant got kicked: occupantJid=${occupant.occupantJid.toString()}, roomJid=${this.roomJid.toString()}`);
        this.onOccupantChangeSubject.next({ change: 'kicked', occupant, isCurrentUser, actor, reason });
        return true;
    }
    handleOccupantBanned(occupant, isCurrentUser, actor, reason) {
        this.removeOccupant(occupant, isCurrentUser);
        if (isCurrentUser) {
            this.logService.info(`you got banned from room! roomJid=${this.roomJid.toString()}, by=${actor}, reason=${reason}`);
        }
        this.logService.debug(`occupant got banned: occupantJid=${occupant.occupantJid.toString()}, roomJid=${this.roomJid.toString()}`);
        this.onOccupantChangeSubject.next({ change: 'banned', occupant, isCurrentUser, actor, reason });
        return true;
    }
    handleOccupantLostMembership(occupant, isCurrentUser) {
        this.removeOccupant(occupant, isCurrentUser);
        if (isCurrentUser) {
            this.logService.info(`your membership got revoked and you got kicked from member-only room: ${this.roomJid.toString()}`);
        }
        this.onOccupantChangeSubject.next({ change: 'lostMembership', occupant, isCurrentUser });
        return true;
    }
    handleOccupantChangedNick(occupant, isCurrentUser, newNick) {
        if (isCurrentUser) {
            this.nick = newNick;
        }
        let existingOccupant = this.roomOccupants.get(occupant.occupantJid.toString());
        if (!existingOccupant) {
            existingOccupant = { ...occupant };
            existingOccupant.occupantJid = jid$1(occupant.occupantJid.toString());
        }
        existingOccupant.occupantJid.resource = newNick;
        existingOccupant.nick = newNick;
        this.roomOccupants.delete(occupant.occupantJid.toString());
        this.roomOccupants.set(existingOccupant.occupantJid.toString(), existingOccupant);
        this.logService.debug(`occupant changed nick: from=${occupant.nick}, to=${newNick}, occupantJid=${occupant.occupantJid.toString()}, roomJid=${this.roomJid.toString()}`);
        this.onOccupantChangeSubject.next({ change: 'changedNick', occupant, newNick, isCurrentUser });
        return true;
    }
    handleOccupantModified(occupant, oldOccupant, isCurrentUser) {
        this.logService.debug(`occupant changed: from=${JSON.stringify(oldOccupant)}, to=${JSON.stringify(occupant)}`);
        this.onOccupantChangeSubject.next({ change: 'modified', occupant, oldOccupant, isCurrentUser });
        return true;
    }
    equals(other) {
        if (this === other) {
            return true;
        }
        if (other == null || !(other instanceof Room)) {
            return false;
        }
        return this.roomJid.equals(other.roomJid);
    }
    addOccupant(occupant) {
        this.roomOccupants.set(occupant.occupantJid.toString(), occupant);
        this.occupantsSubject.next([...this.roomOccupants.values()]);
    }
    removeOccupant(occupant, isCurrentUser) {
        if (isCurrentUser) {
            this.roomOccupants.clear();
            this.occupantsSubject.next([]);
        }
        else {
            if (this.roomOccupants.delete(occupant.occupantJid.toString())) {
                this.occupantsSubject.next([...this.roomOccupants.values()]);
            }
        }
    }
}

var Affiliation;
(function (Affiliation) {
    Affiliation["none"] = "none";
    Affiliation["outcast"] = "outcast";
    Affiliation["member"] = "member";
    Affiliation["admin"] = "admin";
    Affiliation["owner"] = "owner";
})(Affiliation || (Affiliation = {}));

var Role;
(function (Role) {
    Role["none"] = "none";
    Role["visitor"] = "visitor";
    Role["participant"] = "participant";
    Role["moderator"] = "moderator";
})(Role || (Role = {}));

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
class MultiUserChatPlugin extends AbstractXmppPlugin {
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
        const occupantJid = jid$1(roomId, service.jid, nick);
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
                const userJid = jid$1(memberItem.attrs.jid);
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
            userJid: jid$1(item.attrs.jid),
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
        const newRoomJid = jid$1(roomJid.toString());
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
        const occupantJid = jid$1(stanza.attrs.from);
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
        const occupantJid = jid$1(roomJid.local, roomJid.domain, roomJid.resource || userJid.local);
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
                    jid: jid$1(jid),
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
        const from = jid$1(messageStanza.attrs.from);
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
        const roomJid = jid$1(stanza.attrs.from).bare();
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
            roomJid: jid$1(stanza.attrs.from),
            roomPassword: xEl.getChild('password')?.getText(),
            from: jid$1(invitationEl.attrs.from),
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

var ContactSubscription;
(function (ContactSubscription) {
    ContactSubscription["to"] = "to";
    ContactSubscription["from"] = "from";
    ContactSubscription["both"] = "both";
    ContactSubscription["none"] = "none";
})(ContactSubscription || (ContactSubscription = {}));

/**
 * https://xmpp.org/rfcs/rfc6121.html#roster-add-success
 */
class RosterPlugin extends AbstractXmppPlugin {
    constructor(chatService, logService) {
        super();
        this.chatService = chatService;
        this.logService = logService;
    }
    handleStanza(stanza) {
        if (this.isCapabilitiesStanza(stanza)) {
            return false;
        }
        if (this.isRosterPushStanza(stanza)) {
            return this.handleRosterPushStanza(stanza);
        }
        else if (this.isPresenceStanza(stanza)) {
            return this.handlePresenceStanza(stanza);
        }
        return false;
    }
    isRosterPushStanza(stanza) {
        return stanza.name === 'iq'
            && stanza.attrs.type === 'set'
            && stanza.getChild('query', 'jabber:iq:roster');
    }
    isPresenceStanza(stanza) {
        return stanza.name === 'presence' && !stanza.getChild('x', 'http://jabber.org/protocol/muc#user');
    }
    isCapabilitiesStanza(stanza) {
        const child = stanza.getChild('c', 'http://jabber.org/protocol/caps');
        return !!child;
    }
    handleRosterPushStanza(stanza) {
        // TODO:
        // Security Warning: Traditionally, a roster push included no 'from' address, with the result that all roster pushes were sent
        // implicitly from the bare JID of the account itself. However, this specification allows entities other than the user's server
        // to maintain roster information, which means that a roster push might include a 'from' address other than the bare JID of the
        // user's account. Therefore, the client MUST check the 'from' address to verify that the sender of the roster push is authorized
        // to update the roster. If the client receives a roster push from an unauthorized entity, it MUST NOT process the pushed data; in
        // addition, the client can either return a stanza error of <service-unavailable/> error or refuse to return a stanza error at all
        // (the latter behavior overrides a MUST-level requirement from [XMPP‑CORE] for the purpose of preventing a presence leak).
        const itemChild = stanza.getChild('query').getChild('item');
        const contact = this.chatService.getOrCreateContactById(itemChild.attrs.jid, itemChild.attrs.name || itemChild.attrs.jid);
        contact.pendingOut$.next(itemChild.attrs.ask === 'subscribe');
        const subscriptionStatus = itemChild.attrs.subscription || 'none';
        this.chatService.chatConnectionService.sendIqAckResult(stanza.attrs.id);
        let handled = false;
        if (subscriptionStatus === 'remove') {
            contact.pendingOut$.next(false);
            contact.subscription$.next(ContactSubscription.none);
            handled = true;
        }
        else if (subscriptionStatus === 'none') {
            contact.subscription$.next(ContactSubscription.none);
            handled = true;
        }
        else if (subscriptionStatus === 'to') {
            contact.subscription$.next(ContactSubscription.to);
            handled = true;
        }
        else if (subscriptionStatus === 'from') {
            contact.subscription$.next(ContactSubscription.from);
            handled = true;
        }
        else if (subscriptionStatus === 'both') {
            contact.subscription$.next(ContactSubscription.both);
            handled = true;
        }
        if (handled) {
            const existingContacts = this.chatService.contacts$.getValue();
            this.chatService.contacts$.next(existingContacts);
        }
        return handled;
    }
    handlePresenceStanza(stanza) {
        const fromAsContact = this.chatService.getOrCreateContactById(stanza.attrs.from);
        const isAddressedToMe = this.chatService.chatConnectionService.userJid.bare().equals(jid$1(stanza.attrs.to).bare());
        if (isAddressedToMe) {
            if (!stanza.attrs.type) {
                // https://xmpp.org/rfcs/rfc3921.html#stanzas-presence-children-show
                const show = stanza.getChildText('show');
                const presenceMapping = {
                    chat: Presence.present,
                    null: Presence.present,
                    away: Presence.away,
                    dnd: Presence.away,
                    xa: Presence.away,
                };
                const presence = presenceMapping[show];
                if (presence) {
                    fromAsContact.updateResourcePresence(stanza.attrs.from, presence);
                }
                else {
                    this.logService.error('illegal presence:', stanza.attrs.from, show);
                }
                return true;
            }
            else if (stanza.attrs.type === 'unavailable') {
                fromAsContact.updateResourcePresence(stanza.attrs.from, Presence.unavailable);
                return true;
            }
            else if (stanza.attrs.type === 'subscribe') {
                if (fromAsContact.isSubscribed() || fromAsContact.pendingOut$.getValue()) {
                    // subscriber is already a contact of us, approve subscription
                    fromAsContact.pendingIn$.next(false);
                    this.sendAcceptPresenceSubscriptionRequest(stanza.attrs.from);
                    fromAsContact.subscription$.next(this.transitionSubscriptionRequestReceivedAccepted(fromAsContact.subscription$.getValue()));
                    this.chatService.contacts$.next(this.chatService.contacts$.getValue());
                    return true;
                }
                else if (fromAsContact) {
                    // subscriber is known but not subscribed or pending
                    fromAsContact.pendingIn$.next(true);
                    this.chatService.contacts$.next(this.chatService.contacts$.getValue());
                    return true;
                }
            }
            else if (stanza.attrs.type === 'subscribed') {
                fromAsContact.pendingOut$.next(false);
                fromAsContact.subscription$.next(this.transitionSubscriptionRequestSentAccepted(fromAsContact.subscription$.getValue()));
                this.chatService.contacts$.next(this.chatService.contacts$.getValue());
                return true;
            }
            else if (stanza.attrs.type === 'unsubscribed') {
                // TODO: handle unsubscribed
            }
            else if (stanza.attrs.type === 'unsubscribe') {
                // TODO: handle unsubscribe
            }
        }
        return false;
    }
    transitionSubscriptionRequestReceivedAccepted(subscription) {
        switch (subscription) {
            case ContactSubscription.none:
                return ContactSubscription.from;
            case ContactSubscription.to:
                return ContactSubscription.both;
            default:
                return subscription;
        }
    }
    transitionSubscriptionRequestSentAccepted(subscription) {
        switch (subscription) {
            case ContactSubscription.none:
                return ContactSubscription.to;
            case ContactSubscription.from:
                return ContactSubscription.both;
            default:
                return subscription;
        }
    }
    sendAcceptPresenceSubscriptionRequest(jid) {
        const contact = this.chatService.getOrCreateContactById(jid);
        contact.pendingIn$.next(false);
        this.chatService.chatConnectionService.send(xml('presence', { to: jid, type: 'subscribed', id: this.chatService.chatConnectionService.getNextRequestId() }));
    }
    onBeforeOnline() {
        return this.refreshRosterContacts();
    }
    getRosterContacts() {
        return new Promise((resolve) => this.chatService.chatConnectionService.sendIq(xml('iq', { type: 'get' }, xml('query', { xmlns: 'jabber:iq:roster' }))).then((responseStanza) => resolve(this.convertToContacts(responseStanza)), (responseStanza) => {
            this.logService.error('error converting roster contact push', responseStanza.toString());
            resolve([]);
        }));
    }
    convertToContacts(responseStanza) {
        return responseStanza.getChild('query').getChildElements()
            .map(rosterElement => {
            const contact = this.chatService.getOrCreateContactById(rosterElement.attrs.jid, rosterElement.attrs.name || rosterElement.attrs.jid);
            contact.subscription$.next(this.parseSubscription(rosterElement.attrs.subscription));
            contact.pendingOut$.next(rosterElement.attrs.ask === 'subscribe');
            return contact;
        });
    }
    parseSubscription(subscription) {
        switch (subscription) {
            case 'to':
                return ContactSubscription.to;
            case 'from':
                return ContactSubscription.from;
            case 'both':
                return ContactSubscription.both;
            case 'none':
            default:
                return ContactSubscription.none;
        }
    }
    addRosterContact(jid) {
        this.sendAcceptPresenceSubscriptionRequest(jid);
        this.sendAddToRoster(jid);
        this.sendSubscribeToPresence(jid);
    }
    sendAddToRoster(jid) {
        return this.chatService.chatConnectionService.sendIq(xml('iq', { type: 'set' }, xml('query', { xmlns: 'jabber:iq:roster' }, xml('item', { jid }))));
    }
    sendSubscribeToPresence(jid) {
        this.chatService.chatConnectionService.send(xml('presence', { id: this.chatService.chatConnectionService.getNextRequestId(), to: jid, type: 'subscribe' }));
    }
    removeRosterContact(jid) {
        const contact = this.chatService.getContactById(jid);
        if (contact) {
            contact.subscription$.next(ContactSubscription.none);
            contact.pendingOut$.next(false);
            contact.pendingIn$.next(false);
            this.sendRemoveFromRoster(jid);
            this.sendWithdrawPresenceSubscription(jid);
        }
    }
    sendRemoveFromRoster(jid) {
        this.chatService.chatConnectionService.sendIq(xml('iq', { type: 'set' }, xml('query', { xmlns: 'jabber:iq:roster' }, xml('item', { jid, subscription: 'remove' }))));
    }
    sendWithdrawPresenceSubscription(jid) {
        this.chatService.chatConnectionService.send(xml('presence', { id: this.chatService.chatConnectionService.getNextRequestId(), to: jid, type: 'unsubscribed' }));
    }
    refreshRosterContacts() {
        return this.getRosterContacts();
    }
}

var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Disabled"] = 0] = "Disabled";
    LogLevel[LogLevel["Error"] = 1] = "Error";
    LogLevel[LogLevel["Warn"] = 2] = "Warn";
    LogLevel[LogLevel["Info"] = 3] = "Info";
    LogLevel[LogLevel["Debug"] = 4] = "Debug";
})(LogLevel || (LogLevel = {}));
class LogService {
    constructor() {
        this.logLevel = LogLevel.Info;
        this.writer = console;
        this.messagePrefix = () => 'ChatService:';
    }
    error(...messages) {
        if (this.logLevel >= LogLevel.Error) {
            this.writer.error(this.messagePrefix(), ...messages);
        }
    }
    warn(...messages) {
        if (this.logLevel >= LogLevel.Warn) {
            this.writer.warn(this.messagePrefix(), ...messages);
        }
    }
    info(...messages) {
        if (this.logLevel >= LogLevel.Info) {
            this.writer.info(this.messagePrefix(), ...messages);
        }
    }
    debug(...messages) {
        if (this.logLevel >= LogLevel.Debug) {
            this.writer.debug(this.messagePrefix(), ...messages);
        }
    }
}
LogService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: LogService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
LogService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: LogService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: LogService, decorators: [{
            type: Injectable
        }] });

class XmppClientFactoryService {
    client(logInRequest) {
        return client(logInRequest);
    }
}
XmppClientFactoryService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: XmppClientFactoryService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
XmppClientFactoryService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: XmppClientFactoryService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: XmppClientFactoryService, decorators: [{
            type: Injectable
        }] });

/**
 * Implementation of the XMPP specification according to RFC 6121.
 * @see https://xmpp.org/rfcs/rfc6121.html
 * @see https://xmpp.org/rfcs/rfc3920.html
 * @see https://xmpp.org/rfcs/rfc3921.html
 */
class XmppChatConnectionService {
    constructor(logService, ngZone, xmppClientFactoryService) {
        this.logService = logService;
        this.ngZone = ngZone;
        this.xmppClientFactoryService = xmppClientFactoryService;
        this.state$ = new BehaviorSubject('disconnected');
        this.stanzaUnknown$ = new Subject();
        this.requestId = new Date().getTime();
        this.stanzaResponseHandlers = new Map();
    }
    onOnline(jid) {
        this.logService.info('online =', 'online as', jid.toString());
        this.userJid = jid;
        this.state$.next('online');
    }
    onOffline() {
        this.stanzaResponseHandlers.forEach(([, reject]) => reject(new Error('offline')));
        this.stanzaResponseHandlers.clear();
    }
    async sendPresence() {
        await this.send(xml('presence'));
    }
    async send(content) {
        this.logService.debug('>>>', content);
        await this.client.send(content);
    }
    sendAwaitingResponse(request) {
        return new Promise((resolve, reject) => {
            request.attrs = {
                id: this.getNextRequestId(),
                from: this.userJid.toString(),
                ...request.attrs,
            };
            const { id } = request.attrs;
            this.stanzaResponseHandlers.set(id, [
                (response) => {
                    if (response.attrs.type === 'error') {
                        reject(new XmppResponseError(response));
                        return;
                    }
                    resolve(response);
                },
                reject,
            ]);
            this.send(request).catch((e) => {
                this.logService.error('error sending stanza', e);
                this.stanzaResponseHandlers.delete(id);
                reject(e);
            });
        });
    }
    onStanzaReceived(stanza) {
        let handled = false;
        const [handleResponse] = this.stanzaResponseHandlers.get(stanza.attrs.id) ?? [];
        if (handleResponse) {
            this.logService.debug('<<<', stanza.toString(), 'handled by response handler');
            this.stanzaResponseHandlers.delete(stanza.attrs.id);
            handleResponse(stanza);
            handled = true;
        }
        if (!handled) {
            this.stanzaUnknown$.next(stanza);
        }
    }
    async sendIq(request) {
        const requestType = request.attrs.type;
        // see https://datatracker.ietf.org/doc/html/draft-ietf-xmpp-3920bis#section-8.2.3
        if (!requestType || (requestType !== 'get' && requestType !== 'set')) {
            const message = `iq stanza without type: ${request.toString()}`;
            this.logService.error(message);
            throw new Error(message);
        }
        const response = await this.sendAwaitingResponse(request);
        if (!this.isIqStanzaResponse(response)) {
            throw new Error(`received unexpected stanza as iq response: type=${response.attrs.type}, stanza=${response.toString()}`);
        }
        return response;
    }
    isIqStanzaResponse(stanza) {
        const stanzaType = stanza.attrs.type;
        return stanza.name === 'iq' && (stanzaType === 'result' || stanzaType === 'error');
    }
    async sendIqAckResult(id) {
        await this.send(xml('iq', { from: this.userJid.toString(), id, type: 'result' }));
    }
    async logIn(logInRequest) {
        await this.ngZone.runOutsideAngular(async () => {
            if (logInRequest.username.indexOf('@') >= 0) {
                this.logService.warn('username should not contain domain, only local part, this can lead to errors!');
            }
            this.client = this.xmppClientFactoryService.client(logInRequest);
            this.client.on('error', (err) => {
                this.ngZone.run(() => {
                    this.logService.error('chat service error =>', err.toString(), err);
                });
            });
            this.client.on('status', (status, value) => {
                this.ngZone.run(() => {
                    this.logService.info('status update =', status, value ? JSON.stringify(value) : '');
                    if (status === 'offline') {
                        this.state$.next('disconnected');
                    }
                });
            });
            this.client.on('online', (jid) => {
                return this.ngZone.run(() => {
                    return this.onOnline(jid);
                });
            });
            this.client.on('stanza', (stanza) => {
                this.ngZone.run(() => {
                    if (this.skipXmppClientResponses(stanza)) {
                        return;
                    }
                    this.onStanzaReceived(stanza);
                });
            });
            this.client.on('disconnect', () => {
                this.ngZone.run(() => {
                    this.state$.next('reconnecting');
                });
            });
            this.client.on('offline', () => {
                this.ngZone.run(() => {
                    this.onOffline();
                });
            });
            await this.client.start();
        });
    }
    /**
     * We should skip our iq handling for the following xmpp/client response:
     * - resource bind on start by https://xmpp.org/rfcs/rfc6120.html#bind
     */
    skipXmppClientResponses(stanza) {
        const xmppBindNS = 'urn:ietf:params:xml:ns:xmpp-bind';
        return stanza.getChild('bind')?.getNS() === xmppBindNS;
    }
    async logOut() {
        // TODO: move this to a presence plugin in a handler
        this.logService.debug('logging out');
        if (this.client) {
            this.client.reconnect.stop();
            try {
                await this.send(xml('presence', { type: 'unavailable' }));
            }
            catch (e) {
                this.logService.error('error sending presence unavailable');
            }
            finally {
                this.client.stop();
            }
        }
    }
    getNextRequestId() {
        return String(this.requestId++);
    }
    reconnectSilently() {
        this.logService.warn('hard reconnect...');
        this.state$.next('disconnected');
    }
}
XmppChatConnectionService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: XmppChatConnectionService, deps: [{ token: LogService }, { token: i0.NgZone }, { token: XmppClientFactoryService }], target: i0.ɵɵFactoryTarget.Injectable });
XmppChatConnectionService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: XmppChatConnectionService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: XmppChatConnectionService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: LogService }, { type: i0.NgZone }, { type: XmppClientFactoryService }]; } });

class Contact {
    /**
     * Do not call directly, use {@link ContactFactoryService#createContact} instead.
     */
    constructor(jidPlain, name, logService, avatar) {
        this.name = name;
        this.recipientType = 'contact';
        this.avatar = dummyAvatarContact;
        this.metadata = {};
        this.presence$ = new BehaviorSubject(Presence.unavailable);
        this.subscription$ = new BehaviorSubject(ContactSubscription.none);
        this.pendingOut$ = new BehaviorSubject(false);
        this.pendingIn$ = new BehaviorSubject(false);
        this.resources$ = new BehaviorSubject(new Map());
        this.pendingRoomInvite$ = new BehaviorSubject(null);
        if (avatar) {
            this.avatar = avatar;
        }
        const jid = jid$1(jidPlain);
        this.jidFull = jid;
        this.jidBare = jid.bare();
        this.messageStore = new MessageStore(logService);
    }
    get messages$() {
        return this.messageStore.messages$;
    }
    get messages() {
        return this.messageStore.messages;
    }
    get dateMessagesGroups() {
        return this.messageStore.dateMessageGroups;
    }
    get oldestMessage() {
        return this.messageStore.oldestMessage;
    }
    get mostRecentMessage() {
        return this.messageStore.mostRecentMessage;
    }
    get mostRecentMessageReceived() {
        return this.messageStore.mostRecentMessageReceived;
    }
    get mostRecentMessageSent() {
        return this.messageStore.mostRecentMessageSent;
    }
    addMessage(message) {
        this.messageStore.addMessage(message);
    }
    equalsBareJid(other) {
        if (other instanceof Contact || isJid(other)) {
            const otherJid = other instanceof Contact ? other.jidBare : other.bare();
            return this.jidBare.equals(otherJid);
        }
        return false;
    }
    isSubscribed() {
        const subscription = this.subscription$.getValue();
        return subscription === ContactSubscription.both || subscription === ContactSubscription.to;
    }
    isUnaffiliated() {
        return !this.isSubscribed() && !this.pendingIn$.getValue() && !this.pendingOut$.getValue();
    }
    updateResourcePresence(jid, presence) {
        const resources = this.resources$.getValue();
        resources.set(jid, presence);
        this.presence$.next(this.determineOverallPresence(resources));
        this.resources$.next(resources);
    }
    getMessageById(id) {
        return this.messageStore.messageIdToMessage.get(id);
    }
    determineOverallPresence(jidToPresence) {
        let result = Presence.unavailable;
        [...jidToPresence.values()].some((presence) => {
            if (presence === Presence.present) {
                result = presence;
                return true;
            }
            else if (presence === Presence.away) {
                result = Presence.away;
            }
            return false;
        });
        return result;
    }
}

class ContactFactoryService {
    constructor(logService) {
        this.logService = logService;
    }
    createContact(jidPlain, name, avatar) {
        if (!name) {
            name = jidPlain;
        }
        return new Contact(jidPlain, name, this.logService, avatar);
    }
}
ContactFactoryService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ContactFactoryService, deps: [{ token: LogService }], target: i0.ɵɵFactoryTarget.Injectable });
ContactFactoryService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ContactFactoryService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ContactFactoryService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: LogService }]; } });

class XmppChatAdapter {
    constructor(chatConnectionService, logService, contactFactory) {
        this.chatConnectionService = chatConnectionService;
        this.logService = logService;
        this.contactFactory = contactFactory;
        this.message$ = new Subject();
        this.messageSent$ = new Subject();
        this.contacts$ = new BehaviorSubject([]);
        this.contactCreated$ = new Subject();
        this.blockedContactIds$ = new BehaviorSubject(new Set());
        this.blockedContacts$ = combineLatest([this.contacts$, this.blockedContactIds$])
            .pipe(map(([contacts, blockedJids]) => contacts.filter(contact => blockedJids.has(contact.jidBare.toString()))));
        this.notBlockedContacts$ = combineLatest([this.contacts$, this.blockedContactIds$])
            .pipe(map(([contacts, blockedJids]) => contacts.filter(contact => !blockedJids.has(contact.jidBare.toString()))));
        this.contactsSubscribed$ = this.notBlockedContacts$.pipe(map(contacts => contacts.filter(contact => contact.isSubscribed())));
        this.contactRequestsReceived$ = this.notBlockedContacts$.pipe(map(contacts => contacts.filter(contact => contact.pendingIn$.getValue())));
        this.contactRequestsSent$ = this.notBlockedContacts$.pipe(map(contacts => contacts.filter(contact => contact.pendingOut$.getValue())));
        this.contactsUnaffiliated$ = this.notBlockedContacts$.pipe(map(contacts => contacts.filter(contact => contact.isUnaffiliated() && contact.messages.length > 0)));
        this.state$ = new BehaviorSubject('disconnected');
        this.plugins = [];
        this.enableDebugging = false;
        this.userAvatar$ = new BehaviorSubject(dummyAvatarContact);
        this.translations = defaultTranslations();
        this.chatActions = [{
                id: 'sendMessage',
                cssClass: 'chat-window-send',
                html: '&raquo;',
                onClick: (chatActionContext) => {
                    chatActionContext.chatWindow.sendMessage();
                },
            }];
        this.state$.subscribe((state) => this.logService.info('state changed to:', state));
        chatConnectionService.state$
            .pipe(filter(nextState => nextState !== this.state$.getValue()))
            .subscribe((nextState) => {
            this.handleInternalStateChange(nextState);
        });
        this.chatConnectionService.stanzaUnknown$.subscribe((stanza) => this.onUnknownStanza(stanza));
        merge(this.messageSent$, this.message$).subscribe(() => {
            // re-emit contacts when sending or receiving a message to refresh contact groups
            // if the sending contact was in 'other', he still is in other now, but passes the 'messages.length > 0' predicate, so that
            // he should be seen now.
            this.contacts$.next(this.contacts$.getValue());
        });
    }
    handleInternalStateChange(newState) {
        if (newState === 'online') {
            this.state$.next('connecting');
            Promise
                .all(this.plugins.map(plugin => plugin.onBeforeOnline()))
                .catch((e) => this.logService.error('error while connecting', e))
                .finally(() => this.announceAvailability());
        }
        else {
            if (this.state$.getValue() === 'online') {
                // clear data the first time we transition to a not-online state
                this.onOffline();
            }
            this.state$.next('disconnected');
        }
    }
    onOffline() {
        this.contacts$.next([]);
        this.plugins.forEach(plugin => {
            try {
                plugin.onOffline();
            }
            catch (e) {
                this.logService.error('error while handling offline in ', plugin);
            }
        });
    }
    announceAvailability() {
        this.logService.info('announcing availability');
        this.chatConnectionService.sendPresence();
        this.state$.next('online');
    }
    addPlugins(plugins) {
        plugins.forEach(plugin => {
            this.plugins.push(plugin);
        });
    }
    reloadContacts() {
        this.getPlugin(RosterPlugin).refreshRosterContacts();
    }
    getContactById(jidPlain) {
        const bareJidToFind = jid$1(jidPlain).bare();
        return this.contacts$.getValue().find(contact => contact.jidBare.equals(bareJidToFind));
    }
    getOrCreateContactById(jidPlain, name) {
        let contact = this.getContactById(jidPlain);
        if (!contact) {
            contact = this.contactFactory.createContact(jid$1(jidPlain).bare().toString(), name);
            this.contacts$.next([contact, ...this.contacts$.getValue()]);
            this.contactCreated$.next(contact);
        }
        return contact;
    }
    addContact(identifier) {
        this.getPlugin(RosterPlugin).addRosterContact(identifier);
    }
    removeContact(identifier) {
        this.getPlugin(RosterPlugin).removeRosterContact(identifier);
    }
    async logIn(logInRequest) {
        this.lastLogInRequest = logInRequest;
        if (this.state$.getValue() === 'disconnected') {
            await this.chatConnectionService.logIn(logInRequest);
        }
    }
    logOut() {
        return this.chatConnectionService.logOut();
    }
    async sendMessage(recipient, body) {
        const trimmedBody = body.trim();
        if (trimmedBody.length === 0) {
            return;
        }
        switch (recipient.recipientType) {
            case 'room':
                await this.getPlugin(MultiUserChatPlugin).sendMessage(recipient, trimmedBody);
                break;
            case 'contact':
                this.getPlugin(MessagePlugin).sendMessage(recipient, trimmedBody);
                this.messageSent$.next(recipient);
                break;
            default:
                throw new Error('invalid recipient type: ' + recipient?.recipientType);
        }
    }
    loadCompleteHistory() {
        return this.getPlugin(MessageArchivePlugin).loadAllMessages();
    }
    getPlugin(constructor) {
        for (const plugin of this.plugins) {
            if (plugin.constructor === constructor) {
                return plugin;
            }
        }
        throw new Error('plugin not found: ' + constructor);
    }
    onUnknownStanza(stanza) {
        let handled = false;
        for (const plugin of this.plugins) {
            try {
                if (plugin.handleStanza(stanza)) {
                    this.logService.debug(plugin.constructor.name, 'handled', stanza.toString());
                    handled = true;
                }
            }
            catch (e) {
                this.logService.error('error handling stanza in ', plugin.constructor.name, e);
            }
        }
        if (!handled) {
            this.logService.warn('unknown stanza <=', stanza.toString());
        }
    }
    reconnectSilently() {
        this.chatConnectionService.reconnectSilently();
    }
    reconnect() {
        return this.logIn(this.lastLogInRequest);
    }
}
XmppChatAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: XmppChatAdapter, deps: [{ token: XmppChatConnectionService }, { token: LogService }, { token: ContactFactoryService }], target: i0.ɵɵFactoryTarget.Injectable });
XmppChatAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: XmppChatAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: XmppChatAdapter, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: XmppChatConnectionService }, { type: LogService }, { type: ContactFactoryService }]; } });

/**
 * Optional injectable token to handle contact clicks in the chat
 */
const CONTACT_CLICK_HANDLER_TOKEN = new InjectionToken('ngxChatContactClickHandler');

class ChatAvatarComponent {
}
ChatAvatarComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatAvatarComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
ChatAvatarComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.7", type: ChatAvatarComponent, selector: "ngx-chat-avatar", inputs: { imageUrl: "imageUrl" }, ngImport: i0, template: "<div class=\"chat-avatar\" [ngStyle]=\"{backgroundImage: 'url(' + imageUrl + ')'}\"></div>\n", styles: [".chat-avatar{border-radius:50%;background-size:cover;background-position:50%;background-repeat:no-repeat;width:100%;height:100%}\n"], dependencies: [{ kind: "directive", type: i2$1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatAvatarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-chat-avatar', template: "<div class=\"chat-avatar\" [ngStyle]=\"{backgroundImage: 'url(' + imageUrl + ')'}\"></div>\n", styles: [".chat-avatar{border-radius:50%;background-size:cover;background-position:50%;background-repeat:no-repeat;width:100%;height:100%}\n"] }]
        }], propDecorators: { imageUrl: [{
                type: Input
            }] } });

class ChatMessageSimpleComponent {
    constructor() {
        this.avatarClickHandler = new EventEmitter();
        this.footerHidden = false;
        this.MessageState = MessageState;
    }
}
ChatMessageSimpleComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatMessageSimpleComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
ChatMessageSimpleComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.7", type: ChatMessageSimpleComponent, selector: "ngx-chat-message-simple", inputs: { avatar: "avatar", avatarInteractive: "avatarInteractive", direction: "direction", formattedDate: "formattedDate", footerHidden: "footerHidden", mediaLink: "mediaLink", isImage: "isImage", isAudio: "isAudio", showImagePlaceholder: "showImagePlaceholder", messageState: "messageState", nick: "nick" }, outputs: { avatarClickHandler: "avatarClickHandler" }, ngImport: i0, template: "<div class=\"chat-message\" [class.chat-message--in]=\"direction === 'in'\" [class.chat-message--out]=\"direction === 'out'\">\n    <div class=\"chat-message-text-wrapper\">\n        <div *ngIf=\"avatar\" class=\"chat-message-avatar\">\n            <ngx-chat-avatar [class.has-click-handler]=\"avatarInteractive\" (click)=\"avatarClickHandler.emit()\"\n                             [imageUrl]=\"avatar\"></ngx-chat-avatar>\n        </div>\n        <div class=\"chat-message-text\">\n            <ng-content></ng-content>\n        </div>\n    </div>\n    <div class=\"chat-message-image-wrapper\" *ngIf=\"isImage\"\n         [class.chat-message-image-wrapper--placeholder]=\"showImagePlaceholder\">\n        <img class=\"chat-message-image\" (load)=\"showImagePlaceholder = false\" [src]=\"mediaLink\"/>\n    </div>\n    <audio controls *ngIf=\"isAudio\">\n        <source [src]=\"mediaLink\" type=\"audio/mpeg\">\n    </audio>\n    <div class=\"chat-message-footer\" *ngIf=\"!footerHidden\">\n        <small title=\"{{nick}}\" class=\"chat-message-name\">\n            {{nick}}\n            <ng-container *ngIf=\"direction === 'out'\" [ngSwitch]=\"messageState\">\n                <ng-container *ngSwitchCase=\"MessageState.SENT\">\u2713</ng-container>\n                <ng-container *ngSwitchCase=\"MessageState.RECIPIENT_RECEIVED\">\u2713\u2713</ng-container>\n                <ng-container *ngSwitchCase=\"MessageState.RECIPIENT_SEEN\">\n                    <span class=\"state--seen\">\u2713\u2713</span>\n                </ng-container>\n            </ng-container>\n        </small>\n        <small class=\"chat-message-datetime\">{{formattedDate}}</small>\n    </div>\n</div>\n", styles: [".chat-message-avatar{flex-shrink:0;width:2em;height:2em;padding:.5em}.chat-message--in .chat-message-avatar{padding-right:0}.chat-message--out .chat-message-avatar{padding-left:0}.has-click-handler:hover{cursor:pointer}.chat-message-text{min-width:0;padding:.5em;word-break:break-word}.chat-message{border-radius:.5em;margin:.25em}.chat-message--out{background-color:#e6ffd1}.chat-message--in{background-color:#dbedff}.chat-message-text-wrapper{display:flex;flex-direction:row}.chat-message--out .chat-message-text-wrapper{flex-direction:row-reverse}.chat-message-image-wrapper{max-width:100%;max-height:150px;overflow:hidden;height:auto;margin:0 .5em;display:flex;justify-content:center}.chat-message-image-wrapper.chat-message-image-wrapper--placeholder{height:150px}.chat-message-image-wrapper img{object-fit:contain;min-width:0}.chat-message-footer{font-size:.75em;text-align:right;color:#999;padding:0 .5em .5em;clear:both}.chat-message-datetime{display:inline-block;vertical-align:bottom}.chat-message-name{display:inline-block;max-width:9em;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;vertical-align:bottom;margin-right:.5em}.state--seen{color:#00c5d2}\n"], dependencies: [{ kind: "directive", type: i2$1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2$1.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i2$1.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "component", type: ChatAvatarComponent, selector: "ngx-chat-avatar", inputs: ["imageUrl"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatMessageSimpleComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-chat-message-simple', changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"chat-message\" [class.chat-message--in]=\"direction === 'in'\" [class.chat-message--out]=\"direction === 'out'\">\n    <div class=\"chat-message-text-wrapper\">\n        <div *ngIf=\"avatar\" class=\"chat-message-avatar\">\n            <ngx-chat-avatar [class.has-click-handler]=\"avatarInteractive\" (click)=\"avatarClickHandler.emit()\"\n                             [imageUrl]=\"avatar\"></ngx-chat-avatar>\n        </div>\n        <div class=\"chat-message-text\">\n            <ng-content></ng-content>\n        </div>\n    </div>\n    <div class=\"chat-message-image-wrapper\" *ngIf=\"isImage\"\n         [class.chat-message-image-wrapper--placeholder]=\"showImagePlaceholder\">\n        <img class=\"chat-message-image\" (load)=\"showImagePlaceholder = false\" [src]=\"mediaLink\"/>\n    </div>\n    <audio controls *ngIf=\"isAudio\">\n        <source [src]=\"mediaLink\" type=\"audio/mpeg\">\n    </audio>\n    <div class=\"chat-message-footer\" *ngIf=\"!footerHidden\">\n        <small title=\"{{nick}}\" class=\"chat-message-name\">\n            {{nick}}\n            <ng-container *ngIf=\"direction === 'out'\" [ngSwitch]=\"messageState\">\n                <ng-container *ngSwitchCase=\"MessageState.SENT\">\u2713</ng-container>\n                <ng-container *ngSwitchCase=\"MessageState.RECIPIENT_RECEIVED\">\u2713\u2713</ng-container>\n                <ng-container *ngSwitchCase=\"MessageState.RECIPIENT_SEEN\">\n                    <span class=\"state--seen\">\u2713\u2713</span>\n                </ng-container>\n            </ng-container>\n        </small>\n        <small class=\"chat-message-datetime\">{{formattedDate}}</small>\n    </div>\n</div>\n", styles: [".chat-message-avatar{flex-shrink:0;width:2em;height:2em;padding:.5em}.chat-message--in .chat-message-avatar{padding-right:0}.chat-message--out .chat-message-avatar{padding-left:0}.has-click-handler:hover{cursor:pointer}.chat-message-text{min-width:0;padding:.5em;word-break:break-word}.chat-message{border-radius:.5em;margin:.25em}.chat-message--out{background-color:#e6ffd1}.chat-message--in{background-color:#dbedff}.chat-message-text-wrapper{display:flex;flex-direction:row}.chat-message--out .chat-message-text-wrapper{flex-direction:row-reverse}.chat-message-image-wrapper{max-width:100%;max-height:150px;overflow:hidden;height:auto;margin:0 .5em;display:flex;justify-content:center}.chat-message-image-wrapper.chat-message-image-wrapper--placeholder{height:150px}.chat-message-image-wrapper img{object-fit:contain;min-width:0}.chat-message-footer{font-size:.75em;text-align:right;color:#999;padding:0 .5em .5em;clear:both}.chat-message-datetime{display:inline-block;vertical-align:bottom}.chat-message-name{display:inline-block;max-width:9em;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;vertical-align:bottom;margin-right:.5em}.state--seen{color:#00c5d2}\n"] }]
        }], propDecorators: { avatar: [{
                type: Input
            }], avatarClickHandler: [{
                type: Output
            }], avatarInteractive: [{
                type: Input
            }], direction: [{
                type: Input
            }], formattedDate: [{
                type: Input
            }], footerHidden: [{
                type: Input
            }], mediaLink: [{
                type: Input
            }], isImage: [{
                type: Input
            }], isAudio: [{
                type: Input
            }], showImagePlaceholder: [{
                type: Input
            }], messageState: [{
                type: Input
            }], nick: [{
                type: Input
            }] } });

/**
 * You can provide your own implementation for {@link LinkOpener} to override link opening e.g. when using Cordova.
 */
const LINK_OPENER_TOKEN = new InjectionToken('ngxChatLinkOpener');
class ChatMessageLinkComponent {
    constructor(router, platformLocation, linkOpener) {
        this.router = router;
        this.platformLocation = platformLocation;
        this.linkOpener = linkOpener;
    }
    async onClick($event) {
        if (this.linkOpener) {
            $event.preventDefault();
            this.linkOpener.openLink(this.link);
        }
        else if (this.isInApp()) {
            $event.preventDefault();
            const linkParser = document.createElement('a');
            linkParser.href = this.link;
            await this.router.navigateByUrl(linkParser.pathname);
        }
    }
    isInApp() {
        return this.link.startsWith(this.appUrl());
    }
    appUrl() {
        return window.location.protocol + '//' + window.location.host + this.platformLocation.getBaseHrefFromDOM();
    }
}
ChatMessageLinkComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatMessageLinkComponent, deps: [{ token: i1$1.Router }, { token: i2$1.PlatformLocation }, { token: LINK_OPENER_TOKEN, optional: true }], target: i0.ɵɵFactoryTarget.Component });
ChatMessageLinkComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.7", type: ChatMessageLinkComponent, selector: "ngx-chat-message-link", ngImport: i0, template: "<a href=\"{{link}}\" target=\"_blank\" rel=\"noopener\" (click)=\"onClick($event)\">{{text}}</a>\n", styles: ["a{color:#198cff;cursor:pointer}a:visited{color:#9a46e8}\n"] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatMessageLinkComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-chat-message-link', template: "<a href=\"{{link}}\" target=\"_blank\" rel=\"noopener\" (click)=\"onClick($event)\">{{text}}</a>\n", styles: ["a{color:#198cff;cursor:pointer}a:visited{color:#9a46e8}\n"] }]
        }], ctorParameters: function () { return [{ type: i1$1.Router }, { type: i2$1.PlatformLocation }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [LINK_OPENER_TOKEN]
                }] }]; } });

class ChatMessageTextComponent {
}
ChatMessageTextComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatMessageTextComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
ChatMessageTextComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.7", type: ChatMessageTextComponent, selector: "ngx-chat-message-text", inputs: { text: "text" }, ngImport: i0, template: `{{text}}`, isInline: true, styles: [":host{white-space:pre-wrap}\n"] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatMessageTextComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-chat-message-text', template: `{{text}}`, styles: [":host{white-space:pre-wrap}\n"] }]
        }], propDecorators: { text: [{
                type: Input
            }] } });

class LinksDirective {
    constructor(resolver, viewContainerRef) {
        this.resolver = resolver;
        this.viewContainerRef = viewContainerRef;
    }
    ngOnChanges() {
        this.transform();
    }
    transform() {
        const message = this.ngxChatLinks;
        if (!message) {
            return;
        }
        const links = extractUrls(message);
        const chatMessageTextFactory = this.resolver.resolveComponentFactory(ChatMessageTextComponent);
        const chatMessageLinkFactory = this.resolver.resolveComponentFactory(ChatMessageLinkComponent);
        let lastIndex = 0;
        for (const link of links) {
            const currentIndex = message.indexOf(link, lastIndex);
            const textBeforeLink = message.substring(lastIndex, currentIndex);
            if (textBeforeLink) {
                const textBeforeLinkComponent = this.viewContainerRef.createComponent(chatMessageTextFactory);
                textBeforeLinkComponent.instance.text = textBeforeLink;
            }
            const linkRef = this.viewContainerRef.createComponent(chatMessageLinkFactory);
            linkRef.instance.link = link;
            linkRef.instance.text = this.shorten(link);
            lastIndex = currentIndex + link.length;
        }
        const textAfterLastLink = message.substring(lastIndex);
        if (textAfterLastLink) {
            const textAfterLastLinkComponent = this.viewContainerRef.createComponent(chatMessageTextFactory);
            textAfterLastLinkComponent.instance.text = textAfterLastLink;
        }
    }
    shorten(url) {
        const parser = document.createElement('a');
        parser.href = url;
        let shortenedPathname = parser.pathname;
        if (shortenedPathname.length > 17) {
            shortenedPathname = shortenedPathname.substring(0, 5) + '...' + shortenedPathname.substring(shortenedPathname.length - 10);
        }
        return parser.protocol + '//' + parser.host + shortenedPathname;
    }
}
LinksDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: LinksDirective, deps: [{ token: i0.ComponentFactoryResolver }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive });
LinksDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.7", type: LinksDirective, selector: "[ngxChatLinks]", inputs: { ngxChatLinks: "ngxChatLinks" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: LinksDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngxChatLinks]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ComponentFactoryResolver }, { type: i0.ViewContainerRef }]; }, propDecorators: { ngxChatLinks: [{
                type: Input
            }] } });

class ChatMessageComponent {
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
ChatMessageComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatMessageComponent, deps: [{ token: CHAT_SERVICE_TOKEN }, { token: i1$2.HttpClient }, { token: CONTACT_CLICK_HANDLER_TOKEN, optional: true }], target: i0.ɵɵFactoryTarget.Component });
ChatMessageComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.7", type: ChatMessageComponent, selector: "ngx-chat-message", inputs: { showAvatars: "showAvatars", avatar: "avatar", message: "message", nick: "nick", contact: "contact", showMessageReadState: "showMessageReadState" }, ngImport: i0, template: "<ngx-chat-message-simple [mediaLink]=\"mediaLink\"\n                         [isImage]=\"isImage\"\n                         [isAudio]=\"isAudio\"\n                         [avatar]=\"getAvatar()\"\n                         [avatarInteractive]=\"message.direction === Direction.in\"\n                         (avatarClickHandler)=\"onContactClick()\"\n                         [direction]=\"message.direction\"\n                         [messageState]=\"getMessageState()\"\n                         [formattedDate]=\"message.datetime | date:chatService.translations.timeFormat\"\n                         [nick]=\"nick\">\n    <span [ngxChatLinks]=\"message.body\"></span>\n</ngx-chat-message-simple>\n", styles: [":host.chat-message--out{align-self:flex-end}:host.chat-message--in{align-self:flex-start}\n"], dependencies: [{ kind: "component", type: ChatMessageSimpleComponent, selector: "ngx-chat-message-simple", inputs: ["avatar", "avatarInteractive", "direction", "formattedDate", "footerHidden", "mediaLink", "isImage", "isAudio", "showImagePlaceholder", "messageState", "nick"], outputs: ["avatarClickHandler"] }, { kind: "directive", type: LinksDirective, selector: "[ngxChatLinks]", inputs: ["ngxChatLinks"] }, { kind: "pipe", type: i2$1.DatePipe, name: "date" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatMessageComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-chat-message', template: "<ngx-chat-message-simple [mediaLink]=\"mediaLink\"\n                         [isImage]=\"isImage\"\n                         [isAudio]=\"isAudio\"\n                         [avatar]=\"getAvatar()\"\n                         [avatarInteractive]=\"message.direction === Direction.in\"\n                         (avatarClickHandler)=\"onContactClick()\"\n                         [direction]=\"message.direction\"\n                         [messageState]=\"getMessageState()\"\n                         [formattedDate]=\"message.datetime | date:chatService.translations.timeFormat\"\n                         [nick]=\"nick\">\n    <span [ngxChatLinks]=\"message.body\"></span>\n</ngx-chat-message-simple>\n", styles: [":host.chat-message--out{align-self:flex-end}:host.chat-message--in{align-self:flex-start}\n"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [CHAT_SERVICE_TOKEN]
                }] }, { type: i1$2.HttpClient }, { type: undefined, decorators: [{
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

class ChatWindowState {
    constructor(recipient, isCollapsed) {
        this.recipient = recipient;
        this.isCollapsed = isCollapsed;
    }
}
/**
 * Used to open chat windows programmatically.
 */
class ChatListStateService {
    constructor(chatService) {
        this.chatService = chatService;
        this.openChats$ = new BehaviorSubject([]);
        this.openTracks$ = new BehaviorSubject([]);
        this.chatService.state$
            .pipe(filter(newState => newState === 'disconnected'))
            .subscribe(() => {
            this.openChats$.next([]);
        });
        this.chatService.contactRequestsReceived$.subscribe(contacts => {
            for (const contact of contacts) {
                this.openChat(contact);
            }
        });
    }
    openChatCollapsed(recipient) {
        if (!this.isChatWithRecipientOpen(recipient)) {
            const openChats = this.openChats$.getValue();
            const chatWindow = new ChatWindowState(recipient, true);
            const copyWithNewContact = [chatWindow].concat(openChats);
            this.openChats$.next(copyWithNewContact);
        }
    }
    openChat(recipient) {
        this.openChatCollapsed(recipient);
        this.findChatWindowStateByRecipient(recipient).isCollapsed = false;
    }
    closeChat(recipient) {
        const openChats = this.openChats$.getValue();
        const index = this.findChatWindowStateIndexByRecipient(recipient);
        if (index >= 0) {
            const copyWithoutContact = openChats.slice();
            copyWithoutContact.splice(index, 1);
            this.openChats$.next(copyWithoutContact);
        }
    }
    openTrack(track) {
        this.openTracks$.next(this.openTracks$.getValue().concat([track]));
    }
    closeTrack(track) {
        this.openTracks$.next(this.openTracks$.getValue().filter(s => s !== track));
    }
    isChatWithRecipientOpen(recipient) {
        return this.findChatWindowStateByRecipient(recipient) !== undefined;
    }
    findChatWindowStateIndexByRecipient(recipient) {
        return this.openChats$.getValue()
            .findIndex((chatWindowState) => chatWindowState.recipient.equalsBareJid(recipient));
    }
    findChatWindowStateByRecipient(recipient) {
        return this.openChats$.getValue().find(chat => chat.recipient.equalsBareJid(recipient));
    }
}
ChatListStateService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatListStateService, deps: [{ token: CHAT_SERVICE_TOKEN }], target: i0.ɵɵFactoryTarget.Injectable });
ChatListStateService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatListStateService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatListStateService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [CHAT_SERVICE_TOKEN]
                }] }]; } });

/**
 * Used to determine if a message component for a given recipient is open.
 */
class ChatMessageListRegistryService {
    constructor() {
        this.openChats$ = new BehaviorSubject(new Set());
        this.chatOpened$ = new Subject();
        this.recipientToOpenMessageListCount = new Map();
    }
    isChatOpen(recipient) {
        return this.getOrDefault(recipient, 0) > 0;
    }
    incrementOpenWindowCount(recipient) {
        const wasWindowOpen = this.isChatOpen(recipient);
        this.recipientToOpenMessageListCount.set(recipient, this.getOrDefault(recipient, 0) + 1);
        const openWindowSet = this.openChats$.getValue();
        openWindowSet.add(recipient);
        this.openChats$.next(openWindowSet);
        if (!wasWindowOpen) {
            this.chatOpened$.next(recipient);
        }
    }
    decrementOpenWindowCount(recipient) {
        const newValue = this.getOrDefault(recipient, 0) - 1;
        if (newValue <= 0) {
            this.recipientToOpenMessageListCount.set(recipient, 0);
            const openWindowSet = this.openChats$.getValue();
            openWindowSet.delete(recipient);
            this.openChats$.next(openWindowSet);
        }
        else {
            this.recipientToOpenMessageListCount.set(recipient, newValue);
        }
    }
    getOrDefault(recipient, defaultValue) {
        return this.recipientToOpenMessageListCount.get(recipient) || defaultValue;
    }
}
ChatMessageListRegistryService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatMessageListRegistryService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ChatMessageListRegistryService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatMessageListRegistryService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatMessageListRegistryService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });

class IntersectionObserverDirective {
    constructor(el) {
        this.el = el;
        this.ngxChatIntersectionObserver = new EventEmitter();
        this.intersectionObserver = new IntersectionObserver((entries) => {
            this.ngxChatIntersectionObserver.emit(entries[0]);
        }, {
            // even if user is not pixel-perfect at the bottom of a chat message list we still want to
            // react to new messages, hence we have a buffer of 150px around the bottom of the chat message list
            rootMargin: '150px 0px 150px 0px',
        });
        this.intersectionObserver.observe(el.nativeElement);
    }
    ngOnDestroy() {
        this.intersectionObserver.disconnect();
    }
}
IntersectionObserverDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: IntersectionObserverDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
IntersectionObserverDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.7", type: IntersectionObserverDirective, selector: "[ngxChatIntersectionObserver]", outputs: { ngxChatIntersectionObserver: "ngxChatIntersectionObserver" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: IntersectionObserverDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngxChatIntersectionObserver]',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { ngxChatIntersectionObserver: [{
                type: Output
            }] } });

var SubscriptionAction;
(function (SubscriptionAction) {
    SubscriptionAction[SubscriptionAction["PENDING_REQUEST"] = 0] = "PENDING_REQUEST";
    SubscriptionAction[SubscriptionAction["SHOW_BLOCK_ACTIONS"] = 1] = "SHOW_BLOCK_ACTIONS";
    SubscriptionAction[SubscriptionAction["NO_PENDING_REQUEST"] = 2] = "NO_PENDING_REQUEST";
})(SubscriptionAction || (SubscriptionAction = {}));
class ChatMessageListComponent {
    constructor(chatListService, chatService, chatMessageListRegistry, reportUserService, changeDetectorRef, contactFactory) {
        this.chatListService = chatListService;
        this.chatService = chatService;
        this.chatMessageListRegistry = chatMessageListRegistry;
        this.reportUserService = reportUserService;
        this.changeDetectorRef = changeDetectorRef;
        this.contactFactory = contactFactory;
        this.Direction = Direction;
        this.SubscriptionAction = SubscriptionAction;
        this.subscriptionAction = SubscriptionAction.NO_PENDING_REQUEST;
        this.onTop$ = new Subject();
        this.ngDestroy = new Subject();
        this.isAtBottom = true;
        this.bottomLeftAt = 0;
        this.oldestVisibleMessageBeforeLoading = null;
        this.pendingRoomInvite = null;
        this.blockPlugin = this.chatService.getPlugin(BlockPlugin);
    }
    async ngOnInit() {
        this.onTop$
            .pipe(filter(event => event.isIntersecting), debounceTime(1000))
            .subscribe(() => this.loadOlderMessagesBeforeViewport());
        if (this.recipient.recipientType === 'contact') {
            this.recipient.pendingIn$
                .pipe(filter(pendingIn => pendingIn === true), takeUntil(this.ngDestroy))
                .subscribe(() => {
                this.subscriptionAction = SubscriptionAction.PENDING_REQUEST;
                this.scheduleScrollToLastMessage();
            });
            this.recipient.pendingRoomInvite$
                .pipe(filter(invite => invite != null), takeUntil(this.ngDestroy))
                .subscribe((invite) => this.pendingRoomInvite = invite);
        }
        this.chatMessageListRegistry.incrementOpenWindowCount(this.recipient);
    }
    async ngAfterViewInit() {
        this.chatMessageViewChildrenList.changes
            .subscribe(() => {
            if (this.oldestVisibleMessageBeforeLoading) {
                this.scrollToMessage(this.oldestVisibleMessageBeforeLoading);
            }
            this.oldestVisibleMessageBeforeLoading = null;
        });
        const messages$ = this.recipient.messages$;
        messages$
            .pipe(debounceTime(10), filter(() => this.isNearBottom()), takeUntil(this.ngDestroy))
            .subscribe((_) => this.scheduleScrollToLastMessage());
        if (this.recipient.messages.length < 10) {
            await this.loadMessages(); // in case insufficient old messages are displayed
        }
        this.scheduleScrollToLastMessage();
    }
    ngOnChanges(changes) {
        const contact = changes.contact;
        if (contact && contact.previousValue && contact.currentValue) {
            this.chatMessageListRegistry.decrementOpenWindowCount(contact.previousValue);
            this.chatMessageListRegistry.incrementOpenWindowCount(contact.currentValue);
        }
        if (contact && contact.currentValue) {
            this.scheduleScrollToLastMessage();
        }
    }
    ngOnDestroy() {
        this.ngDestroy.next();
        this.chatMessageListRegistry.decrementOpenWindowCount(this.recipient);
    }
    acceptSubscriptionRequest(event) {
        event.preventDefault();
        if (this.subscriptionAction === SubscriptionAction.PENDING_REQUEST) {
            this.chatService.addContact(this.recipient.jidBare.toString());
            this.subscriptionAction = SubscriptionAction.NO_PENDING_REQUEST;
            this.scheduleScrollToLastMessage();
        }
    }
    denySubscriptionRequest(event) {
        event.preventDefault();
        if (this.subscriptionAction === SubscriptionAction.PENDING_REQUEST) {
            this.chatService.removeContact(this.recipient.jidBare.toString());
            this.subscriptionAction = SubscriptionAction.SHOW_BLOCK_ACTIONS;
            this.scheduleScrollToLastMessage();
        }
    }
    scheduleScrollToLastMessage() {
        setTimeout(() => this.scrollToLastMessage(), 0);
    }
    blockContact($event) {
        $event.preventDefault();
        this.blockPlugin.blockJid(this.recipient.jidBare.toString());
        this.chatListService.closeChat(this.recipient);
        this.subscriptionAction = SubscriptionAction.NO_PENDING_REQUEST;
    }
    blockContactAndReport($event) {
        if (this.recipient.recipientType !== 'contact') {
            return;
        }
        $event.preventDefault();
        this.reportUserService.reportUser(this.recipient);
        this.blockContact($event);
    }
    dismissBlockOptions($event) {
        $event.preventDefault();
        this.subscriptionAction = SubscriptionAction.NO_PENDING_REQUEST;
    }
    subscriptionActionShown() {
        if (this.recipient.recipientType !== 'contact') {
            return false;
        }
        return this.subscriptionAction === SubscriptionAction.PENDING_REQUEST
            || (this.blockPlugin.supportsBlock$.getValue() === true && this.subscriptionAction === SubscriptionAction.SHOW_BLOCK_ACTIONS);
    }
    async loadOlderMessagesBeforeViewport() {
        if (this.isLoadingHistory() || this.isNearBottom()) {
            return;
        }
        try {
            this.oldestVisibleMessageBeforeLoading = this.recipient.oldestMessage;
            await this.loadMessages();
        }
        catch (e) {
            this.oldestVisibleMessageBeforeLoading = null;
        }
    }
    onBottom(event) {
        this.isAtBottom = event.isIntersecting;
        if (event.isIntersecting) {
            this.isAtBottom = true;
        }
        else {
            this.isAtBottom = false;
            this.bottomLeftAt = Date.now();
        }
    }
    getOrCreateContactWithFullJid(message) {
        if (this.recipient.recipientType === 'contact') {
            // this is not a multi user chat, just use recipient as contact
            return this.recipient;
        }
        const roomMessage = message;
        let matchingContact = this.chatService.contacts$.getValue().find(contact => contact.jidFull.equals(roomMessage.from));
        if (!matchingContact) {
            matchingContact = this.contactFactory.createContact(roomMessage.from.toString(), roomMessage.from.resource);
            this.chatService.contacts$.next([matchingContact].concat(this.chatService.contacts$.getValue()));
        }
        return matchingContact;
    }
    showPendingRoomInvite() {
        if (this.recipient.recipientType !== 'contact') {
            return false;
        }
        return this.pendingRoomInvite;
    }
    async acceptRoomInvite(event) {
        event.preventDefault();
        await this.chatService.getPlugin(MultiUserChatPlugin).joinRoom(this.pendingRoomInvite.roomJid);
        this.recipient.pendingRoomInvite$.next(null);
        this.pendingRoomInvite = null;
    }
    async declineRoomInvite(event) {
        event.preventDefault();
        await this.chatService.getPlugin(MultiUserChatPlugin).declineRoomInvite(this.pendingRoomInvite.roomJid);
        this.recipient.pendingRoomInvite$.next(null);
        this.pendingRoomInvite = null;
        this.chatService.removeContact(this.recipient.jidBare.toString());
    }
    scrollToLastMessage() {
        if (this.chatMessageAreaElement) {
            this.chatMessageAreaElement.nativeElement.scrollTop = this.chatMessageAreaElement.nativeElement.scrollHeight;
            this.isAtBottom = true; // in some browsers the intersection observer does not emit when scrolling programmatically
        }
    }
    scrollToMessage(message) {
        if (this.chatMessageAreaElement) {
            const htmlIdAttribute = 'message-' + message.id;
            const messageElement = document.getElementById(htmlIdAttribute);
            messageElement.scrollIntoView(false);
        }
    }
    async loadMessages() {
        try {
            // improve performance when loading lots of old messages
            this.changeDetectorRef.detach();
            await this.chatService.getPlugin(MessageArchivePlugin).loadMostRecentUnloadedMessages(this.recipient);
        }
        finally {
            this.changeDetectorRef.reattach();
        }
    }
    isNearBottom() {
        return this.isAtBottom || Date.now() - this.bottomLeftAt < 1000;
    }
    isLoadingHistory() {
        return !!this.oldestVisibleMessageBeforeLoading;
    }
}
ChatMessageListComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatMessageListComponent, deps: [{ token: ChatListStateService }, { token: CHAT_SERVICE_TOKEN }, { token: ChatMessageListRegistryService }, { token: REPORT_USER_INJECTION_TOKEN, optional: true }, { token: i0.ChangeDetectorRef }, { token: ContactFactoryService }], target: i0.ɵɵFactoryTarget.Component });
ChatMessageListComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.7", type: ChatMessageListComponent, selector: "ngx-chat-message-list", inputs: { recipient: "recipient", showAvatars: "showAvatars" }, viewQueries: [{ propertyName: "chatMessageAreaElement", first: true, predicate: ["messageArea"], descendants: true }, { propertyName: "chatMessageViewChildrenList", predicate: ChatMessageComponent, descendants: true }], usesOnChanges: true, ngImport: i0, template: "<div class=\"chat-messages\" #messageArea>\n\n    <div class=\"chat-messages-start\" (ngxChatIntersectionObserver)=\"onTop$.next($event)\"></div>\n\n    <ng-container *ngFor=\"let dateMessagesGroup of recipient.dateMessagesGroups\">\n        <div class=\"chat-messages-date-group\">{{dateMessagesGroup.date | date:chatService.translations.dateFormat:undefined:chatService.translations.locale}}</div>\n        <ngx-chat-message\n                *ngFor=\"let message of dateMessagesGroup.messages\"\n                [id]=\"'message-' + message.id\"\n                [class.chat-message--in]=\"message.direction === Direction.in\"\n                [class.chat-message--out]=\"message.direction === Direction.out\"\n                [contact]=\"getOrCreateContactWithFullJid(message)\"\n                [nick]=\"message.direction === Direction.in ? getOrCreateContactWithFullJid(message).name : ''\"\n                [avatar]=\"getOrCreateContactWithFullJid(message).avatar\"\n                [message]=\"message\"\n                [showAvatars]=\"showAvatars\">\n        </ngx-chat-message>\n    </ng-container>\n\n    <div class=\"chat-messages-empty\" *ngIf=\"recipient.messages.length === 0\">\n        {{chatService.translations.noMessages}}\n    </div>\n\n    <ngx-chat-message-simple\n            [direction]=\"Direction.in\"\n            [avatar]=\"undefined\"\n            [footerHidden]=\"true\"\n            *ngIf=\"showPendingRoomInvite()\"\n    >\n        <ul class=\"chat-presence-subscription-actions\">\n            <li>\n                <a (click)=\"acceptRoomInvite($event)\" href=\"#\">Join</a>\n            </li>\n            <li>\n                <a (click)=\"declineRoomInvite($event)\" href=\"#\">Decline</a>\n            </li>\n        </ul>\n    </ngx-chat-message-simple>\n\n    <ngx-chat-message-simple\n            [direction]=\"Direction.in\"\n            [avatar]=\"showAvatars ? recipient.avatar : undefined\"\n            [footerHidden]=\"true\"\n            *ngIf=\"subscriptionActionShown()\"\n    >\n        <span>\n            {{chatService.translations.subscriptionRequestMessage}}\n        </span>\n        <ul class=\"chat-presence-subscription-actions\">\n            <li>\n                <span class=\"action-disabled\"\n                      *ngIf=\"subscriptionAction === SubscriptionAction.SHOW_BLOCK_ACTIONS\"\n                >{{chatService.translations.acceptSubscriptionRequest}}</span>\n\n                <a *ngIf=\"subscriptionAction === SubscriptionAction.PENDING_REQUEST\"\n                   (click)=\"acceptSubscriptionRequest($event)\"\n                   href=\"#\"\n                >{{chatService.translations.acceptSubscriptionRequest}}</a>\n            </li>\n\n            <li>\n                <span class=\"action-disabled\"\n                      *ngIf=\"subscriptionAction === SubscriptionAction.SHOW_BLOCK_ACTIONS\"\n                >{{chatService.translations.denySubscriptionRequest}}</span>\n\n                <a *ngIf=\"subscriptionAction === SubscriptionAction.PENDING_REQUEST\"\n                   (click)=\"denySubscriptionRequest($event)\"\n                   href=\"#\"\n                >{{chatService.translations.denySubscriptionRequest}}</a>\n            </li>\n        </ul>\n        <ul class=\"deny-actions\"\n            *ngIf=\"(blockPlugin.supportsBlock$ | async) === true && subscriptionAction === SubscriptionAction.SHOW_BLOCK_ACTIONS\">\n            <li>\n                <a (click)=\"blockContact($event)\" href=\"#\">{{chatService.translations.block}}</a>\n            </li>\n            <li *ngIf=\"reportUserService\">\n                <a (click)=\"blockContactAndReport($event)\" href=\"#\">{{chatService.translations.blockAndReport}}</a>\n            </li>\n            <li>\n                <a (click)=\"dismissBlockOptions($event)\" href=\"#\">{{chatService.translations.dismiss}}</a>\n            </li>\n        </ul>\n    </ngx-chat-message-simple>\n\n    <div class=\"chat-messages-end\" (ngxChatIntersectionObserver)=\"onBottom($event)\"></div>\n\n</div>\n", styles: [":host.chat-message--out{align-self:flex-end}:host.chat-message--in{align-self:flex-start}.chat-messages{display:flex;flex-direction:column;min-height:10em;max-height:20em;overflow-y:scroll}.chat-messages-date-group{font-size:.7em;font-style:italic;margin:.5em 0;text-align:center}ngx-chat-message,ngx-chat-message-simple{max-width:76%;align-self:flex-start;animation-duration:1.5s;animation-timing-function:cubic-bezier(.16,1,.3,1)}ngx-chat-message.chat-message--in,ngx-chat-message-simple.chat-message--in{animation-name:ngx-chat-message-in}ngx-chat-message.chat-message--out,ngx-chat-message-simple.chat-message--out{animation-name:ngx-chat-message-out}.chat-messages-empty{text-align:center;font-size:1.5em;color:#999;margin-top:1em;margin-bottom:1em}.chat-presence-subscription-actions,.deny-actions{list-style:none;padding:0;margin:1em 0 0}.chat-presence-subscription-actions a,.deny-actions a,.chat-presence-subscription-actions a:visited,.deny-actions a:visited{color:#198cff}.deny-actions{margin-top:1em}.action-disabled{color:#999}.chat-messages-start{min-height:5px;height:5px;margin-top:5px}.chat-messages-end{min-height:5px;height:5px;margin-bottom:5px}\n"], dependencies: [{ kind: "directive", type: i2$1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2$1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: ChatMessageComponent, selector: "ngx-chat-message", inputs: ["showAvatars", "avatar", "message", "nick", "contact", "showMessageReadState"] }, { kind: "component", type: ChatMessageSimpleComponent, selector: "ngx-chat-message-simple", inputs: ["avatar", "avatarInteractive", "direction", "formattedDate", "footerHidden", "mediaLink", "isImage", "isAudio", "showImagePlaceholder", "messageState", "nick"], outputs: ["avatarClickHandler"] }, { kind: "directive", type: IntersectionObserverDirective, selector: "[ngxChatIntersectionObserver]", outputs: ["ngxChatIntersectionObserver"] }, { kind: "pipe", type: i2$1.AsyncPipe, name: "async" }, { kind: "pipe", type: i2$1.DatePipe, name: "date" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatMessageListComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-chat-message-list', template: "<div class=\"chat-messages\" #messageArea>\n\n    <div class=\"chat-messages-start\" (ngxChatIntersectionObserver)=\"onTop$.next($event)\"></div>\n\n    <ng-container *ngFor=\"let dateMessagesGroup of recipient.dateMessagesGroups\">\n        <div class=\"chat-messages-date-group\">{{dateMessagesGroup.date | date:chatService.translations.dateFormat:undefined:chatService.translations.locale}}</div>\n        <ngx-chat-message\n                *ngFor=\"let message of dateMessagesGroup.messages\"\n                [id]=\"'message-' + message.id\"\n                [class.chat-message--in]=\"message.direction === Direction.in\"\n                [class.chat-message--out]=\"message.direction === Direction.out\"\n                [contact]=\"getOrCreateContactWithFullJid(message)\"\n                [nick]=\"message.direction === Direction.in ? getOrCreateContactWithFullJid(message).name : ''\"\n                [avatar]=\"getOrCreateContactWithFullJid(message).avatar\"\n                [message]=\"message\"\n                [showAvatars]=\"showAvatars\">\n        </ngx-chat-message>\n    </ng-container>\n\n    <div class=\"chat-messages-empty\" *ngIf=\"recipient.messages.length === 0\">\n        {{chatService.translations.noMessages}}\n    </div>\n\n    <ngx-chat-message-simple\n            [direction]=\"Direction.in\"\n            [avatar]=\"undefined\"\n            [footerHidden]=\"true\"\n            *ngIf=\"showPendingRoomInvite()\"\n    >\n        <ul class=\"chat-presence-subscription-actions\">\n            <li>\n                <a (click)=\"acceptRoomInvite($event)\" href=\"#\">Join</a>\n            </li>\n            <li>\n                <a (click)=\"declineRoomInvite($event)\" href=\"#\">Decline</a>\n            </li>\n        </ul>\n    </ngx-chat-message-simple>\n\n    <ngx-chat-message-simple\n            [direction]=\"Direction.in\"\n            [avatar]=\"showAvatars ? recipient.avatar : undefined\"\n            [footerHidden]=\"true\"\n            *ngIf=\"subscriptionActionShown()\"\n    >\n        <span>\n            {{chatService.translations.subscriptionRequestMessage}}\n        </span>\n        <ul class=\"chat-presence-subscription-actions\">\n            <li>\n                <span class=\"action-disabled\"\n                      *ngIf=\"subscriptionAction === SubscriptionAction.SHOW_BLOCK_ACTIONS\"\n                >{{chatService.translations.acceptSubscriptionRequest}}</span>\n\n                <a *ngIf=\"subscriptionAction === SubscriptionAction.PENDING_REQUEST\"\n                   (click)=\"acceptSubscriptionRequest($event)\"\n                   href=\"#\"\n                >{{chatService.translations.acceptSubscriptionRequest}}</a>\n            </li>\n\n            <li>\n                <span class=\"action-disabled\"\n                      *ngIf=\"subscriptionAction === SubscriptionAction.SHOW_BLOCK_ACTIONS\"\n                >{{chatService.translations.denySubscriptionRequest}}</span>\n\n                <a *ngIf=\"subscriptionAction === SubscriptionAction.PENDING_REQUEST\"\n                   (click)=\"denySubscriptionRequest($event)\"\n                   href=\"#\"\n                >{{chatService.translations.denySubscriptionRequest}}</a>\n            </li>\n        </ul>\n        <ul class=\"deny-actions\"\n            *ngIf=\"(blockPlugin.supportsBlock$ | async) === true && subscriptionAction === SubscriptionAction.SHOW_BLOCK_ACTIONS\">\n            <li>\n                <a (click)=\"blockContact($event)\" href=\"#\">{{chatService.translations.block}}</a>\n            </li>\n            <li *ngIf=\"reportUserService\">\n                <a (click)=\"blockContactAndReport($event)\" href=\"#\">{{chatService.translations.blockAndReport}}</a>\n            </li>\n            <li>\n                <a (click)=\"dismissBlockOptions($event)\" href=\"#\">{{chatService.translations.dismiss}}</a>\n            </li>\n        </ul>\n    </ngx-chat-message-simple>\n\n    <div class=\"chat-messages-end\" (ngxChatIntersectionObserver)=\"onBottom($event)\"></div>\n\n</div>\n", styles: [":host.chat-message--out{align-self:flex-end}:host.chat-message--in{align-self:flex-start}.chat-messages{display:flex;flex-direction:column;min-height:10em;max-height:20em;overflow-y:scroll}.chat-messages-date-group{font-size:.7em;font-style:italic;margin:.5em 0;text-align:center}ngx-chat-message,ngx-chat-message-simple{max-width:76%;align-self:flex-start;animation-duration:1.5s;animation-timing-function:cubic-bezier(.16,1,.3,1)}ngx-chat-message.chat-message--in,ngx-chat-message-simple.chat-message--in{animation-name:ngx-chat-message-in}ngx-chat-message.chat-message--out,ngx-chat-message-simple.chat-message--out{animation-name:ngx-chat-message-out}.chat-messages-empty{text-align:center;font-size:1.5em;color:#999;margin-top:1em;margin-bottom:1em}.chat-presence-subscription-actions,.deny-actions{list-style:none;padding:0;margin:1em 0 0}.chat-presence-subscription-actions a,.deny-actions a,.chat-presence-subscription-actions a:visited,.deny-actions a:visited{color:#198cff}.deny-actions{margin-top:1em}.action-disabled{color:#999}.chat-messages-start{min-height:5px;height:5px;margin-top:5px}.chat-messages-end{min-height:5px;height:5px;margin-bottom:5px}\n"] }]
        }], ctorParameters: function () { return [{ type: ChatListStateService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [CHAT_SERVICE_TOKEN]
                }] }, { type: ChatMessageListRegistryService }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [REPORT_USER_INJECTION_TOKEN]
                }] }, { type: i0.ChangeDetectorRef }, { type: ContactFactoryService }]; }, propDecorators: { recipient: [{
                type: Input
            }], showAvatars: [{
                type: Input
            }], chatMessageAreaElement: [{
                type: ViewChild,
                args: ['messageArea']
            }], chatMessageViewChildrenList: [{
                type: ViewChildren,
                args: [ChatMessageComponent]
            }] } });

/**
 * Optional injectable token to handle file uploads in the chat.
 */
const FILE_UPLOAD_HANDLER_TOKEN = new InjectionToken('ngxChatFileUploadHandler');

const CHAT_STYLE_TOKEN = new InjectionToken('ngxChatStyle');

class ChatWindowFrameComponent {
    constructor(chatStyle) {
        this.chatStyle = chatStyle;
        this.closeClick = new EventEmitter();
        this.headerClick = new EventEmitter();
    }
}
ChatWindowFrameComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatWindowFrameComponent, deps: [{ token: CHAT_STYLE_TOKEN, optional: true }], target: i0.ɵɵFactoryTarget.Component });
ChatWindowFrameComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.7", type: ChatWindowFrameComponent, selector: "ngx-chat-window-frame", outputs: { closeClick: "closeClick", headerClick: "headerClick" }, ngImport: i0, template: "<div class=\"window\" [style.width]=\"chatStyle?.windowFrame?.windowWidth ?? '17em'\">\n\n    <div (click)=\"headerClick.emit()\" class=\"window-header\">\n\n        <ng-content select=\".window-header-content\"></ng-content>\n\n        <div *ngIf=\"closeClick.observers.length > 0\" class=\"window-close\" (click)=\"closeClick.emit()\">\n            &times;\n        </div>\n\n    </div>\n\n    <ng-content select=\".window-content\"></ng-content>\n\n</div>\n", styles: ["@keyframes ngx-chat-message-in{0%{transform:translate(50px);opacity:0}to{transform:none;opacity:1}}@keyframes ngx-chat-message-out{0%{transform:translate(-50px);opacity:0}to{transform:none;opacity:1}}*{box-sizing:border-box;margin:0;padding:0;font-family:Helvetica,Arial,serif}.window{border:1px solid #e1e1e1;border-bottom:none;background:#f5f5f5;margin-left:1em;bottom:0;pointer-events:auto;position:relative}.window-header{display:flex;justify-content:space-between;border-bottom:1px solid #e1e1e1;cursor:pointer;height:2.5em;align-items:center;padding:.25em}.window-header:hover{background-color:#efefef}.window-close{padding:.5em;text-align:right;color:#777}.window-close:hover{color:#000}\n"], dependencies: [{ kind: "directive", type: i2$1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatWindowFrameComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-chat-window-frame', template: "<div class=\"window\" [style.width]=\"chatStyle?.windowFrame?.windowWidth ?? '17em'\">\n\n    <div (click)=\"headerClick.emit()\" class=\"window-header\">\n\n        <ng-content select=\".window-header-content\"></ng-content>\n\n        <div *ngIf=\"closeClick.observers.length > 0\" class=\"window-close\" (click)=\"closeClick.emit()\">\n            &times;\n        </div>\n\n    </div>\n\n    <ng-content select=\".window-content\"></ng-content>\n\n</div>\n", styles: ["@keyframes ngx-chat-message-in{0%{transform:translate(50px);opacity:0}to{transform:none;opacity:1}}@keyframes ngx-chat-message-out{0%{transform:translate(-50px);opacity:0}to{transform:none;opacity:1}}*{box-sizing:border-box;margin:0;padding:0;font-family:Helvetica,Arial,serif}.window{border:1px solid #e1e1e1;border-bottom:none;background:#f5f5f5;margin-left:1em;bottom:0;pointer-events:auto;position:relative}.window-header{display:flex;justify-content:space-between;border-bottom:1px solid #e1e1e1;cursor:pointer;height:2.5em;align-items:center;padding:.25em}.window-header:hover{background-color:#efefef}.window-close{padding:.5em;text-align:right;color:#777}.window-close:hover{color:#000}\n"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [CHAT_STYLE_TOKEN]
                }] }]; }, propDecorators: { closeClick: [{
                type: Output
            }], headerClick: [{
                type: Output
            }] } });

class ChatWindowComponent {
    constructor(chatService, chatListService, fileUploadHandler, contactClickHandler) {
        this.chatService = chatService;
        this.chatListService = chatListService;
        this.fileUploadHandler = fileUploadHandler;
        this.contactClickHandler = contactClickHandler;
        this.ngDestroy = new Subject();
    }
    ngOnInit() {
        const messages$ = this.chatWindowState.recipient.messages$;
        messages$
            .pipe(filter(message => message.direction === Direction.in), takeUntil(this.ngDestroy))
            .subscribe(() => {
            this.chatWindowState.isCollapsed = false;
        });
    }
    ngOnDestroy() {
        this.ngDestroy.next();
        this.ngDestroy.complete();
    }
    onClickHeader() {
        this.chatWindowState.isCollapsed = !this.chatWindowState.isCollapsed;
    }
    onClickClose() {
        this.chatListService.closeChat(this.chatWindowState.recipient);
    }
    sendMessage() {
        this.messageInput.onSendMessage();
    }
    afterSendMessage() {
        this.contactMessageList.scheduleScrollToLastMessage();
    }
    async uploadFile(file) {
        const url = await this.fileUploadHandler.upload(file);
        this.chatService.sendMessage(this.chatWindowState.recipient, url);
    }
    onFocus() {
        this.messageInput.focus();
    }
    onActionClick(chatAction) {
        chatAction.onClick({
            contact: this.chatWindowState.recipient.jidBare.toString(),
            chatWindow: this,
        });
    }
    onContactClick($event) {
        if (this.contactClickHandler && !this.chatWindowState.isCollapsed) {
            $event.stopPropagation();
            this.contactClickHandler.onClick(this.chatWindowState.recipient);
        }
    }
}
ChatWindowComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatWindowComponent, deps: [{ token: CHAT_SERVICE_TOKEN }, { token: ChatListStateService }, { token: FILE_UPLOAD_HANDLER_TOKEN }, { token: CONTACT_CLICK_HANDLER_TOKEN, optional: true }], target: i0.ɵɵFactoryTarget.Component });
ChatWindowComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.7", type: ChatWindowComponent, selector: "ngx-chat-window", inputs: { chatWindowState: "chatWindowState" }, viewQueries: [{ propertyName: "messageInput", first: true, predicate: ChatMessageInputComponent, descendants: true }, { propertyName: "contactMessageList", first: true, predicate: ChatMessageListComponent, descendants: true }], ngImport: i0, template: "<ngx-chat-window-frame\n        (headerClick)=\"onClickHeader()\"\n        (closeClick)=\"onClickClose()\">\n\n    <ng-container class=\"window-header-content\">\n        <div class=\"chat-contact-avatar-wrapper\"\n             (click)=\"onContactClick($event)\"\n        >\n            <ngx-chat-avatar [imageUrl]=\"chatWindowState.recipient.avatar\"></ngx-chat-avatar>\n        </div>\n\n        <div class=\"header-middle\">\n\n            <div class=\"chat-contact-name-wrapper\"\n                 [title]=\"chatWindowState.recipient.name\"\n            >\n                <span [ngClass]=\"{'has-click-handler': !chatWindowState.isCollapsed && !!this.contactClickHandler}\"\n                      (click)=\"onContactClick($event)\">\n                    {{chatWindowState.recipient.name}}\n                </span>\n            </div>\n\n            <div class=\"chat-contact-status-wrapper\"\n                 *ngIf=\"!chatWindowState.isCollapsed && chatWindowState.recipient.recipientType === 'contact'\"\n            >\n                <span class=\"chat-contact-status\">\n                    {{chatService.translations.presence[chatWindowState.recipient.presence$ | async]}}\n                </span>\n            </div>\n\n        </div>\n    </ng-container>\n\n    <ngx-chat-filedrop\n            *ngIf=\"!chatWindowState.isCollapsed\"\n            class=\"window-content\"\n            [enabled]=\"fileUploadHandler.isUploadSupported()\"\n            (fileUpload)=\"uploadFile($event)\"\n            [dropMessage]=\"chatService.translations.dropMessage\">\n        <div (click)=\"onFocus()\">\n            <ngx-chat-message-list\n                    [recipient]=\"chatWindowState.recipient\"\n                    [showAvatars]=\"false\"></ngx-chat-message-list>\n            <div class=\"chat-input-container\">\n                <ngx-chat-message-input\n                        [recipient]=\"chatWindowState.recipient\"\n                        (messageSent)=\"afterSendMessage()\"\n                ></ngx-chat-message-input>\n                <div *ngFor=\"let action of chatService.chatActions\"\n                     (click)=\"onActionClick(action)\"\n                     class=\"chat-action\"\n                     [ngClass]=\"action.cssClass\"\n                     [innerHTML]=\"action.html\">\n                </div>\n            </div>\n        </div>\n    </ngx-chat-filedrop>\n\n</ngx-chat-window-frame>\n", styles: ["@keyframes ngx-chat-message-in{0%{transform:translate(50px);opacity:0}to{transform:none;opacity:1}}@keyframes ngx-chat-message-out{0%{transform:translate(-50px);opacity:0}to{transform:none;opacity:1}}*{box-sizing:border-box;margin:0;padding:0;font-family:Helvetica,Arial,serif}.chat-contact-avatar-wrapper{min-width:2em;width:2em;min-height:2em;height:2em}.header-middle{flex-grow:1;flex-shrink:1;padding:0 .5em;white-space:nowrap;overflow:hidden;font-size:.8em;line-height:1.2;height:100%;display:flex;flex-direction:column;justify-content:space-around}.chat-contact-name-wrapper,.chat-contact-status-wrapper{text-overflow:ellipsis;overflow:hidden;display:block}.has-click-handler:hover{text-decoration:underline}.chat-contact-status{color:#999}.window-content{text-align:left;padding:0;min-height:5em;display:flex;flex-direction:column;overflow-x:hidden;overflow-y:auto}.chat-input-container{display:flex;padding:.5em;border-top:1px solid #e1e1e1;background:#fff;cursor:text}.chat-action{cursor:pointer;align-self:center;text-align:center}.chat-window-send{background-color:#fff;border-color:#fff;color:#000;width:1.5em}.chat-window-send:active{border:none}ngx-chat-message-input{flex-grow:1}\n"], dependencies: [{ kind: "directive", type: i2$1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2$1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2$1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: ChatMessageInputComponent, selector: "ngx-chat-message-input", inputs: ["recipient"], outputs: ["messageSent"] }, { kind: "component", type: ChatMessageListComponent, selector: "ngx-chat-message-list", inputs: ["recipient", "showAvatars"] }, { kind: "component", type: FileDropComponent, selector: "ngx-chat-filedrop", inputs: ["dropMessage", "enabled"], outputs: ["fileUpload"] }, { kind: "component", type: ChatWindowFrameComponent, selector: "ngx-chat-window-frame", outputs: ["closeClick", "headerClick"] }, { kind: "component", type: ChatAvatarComponent, selector: "ngx-chat-avatar", inputs: ["imageUrl"] }, { kind: "pipe", type: i2$1.AsyncPipe, name: "async" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatWindowComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-chat-window', template: "<ngx-chat-window-frame\n        (headerClick)=\"onClickHeader()\"\n        (closeClick)=\"onClickClose()\">\n\n    <ng-container class=\"window-header-content\">\n        <div class=\"chat-contact-avatar-wrapper\"\n             (click)=\"onContactClick($event)\"\n        >\n            <ngx-chat-avatar [imageUrl]=\"chatWindowState.recipient.avatar\"></ngx-chat-avatar>\n        </div>\n\n        <div class=\"header-middle\">\n\n            <div class=\"chat-contact-name-wrapper\"\n                 [title]=\"chatWindowState.recipient.name\"\n            >\n                <span [ngClass]=\"{'has-click-handler': !chatWindowState.isCollapsed && !!this.contactClickHandler}\"\n                      (click)=\"onContactClick($event)\">\n                    {{chatWindowState.recipient.name}}\n                </span>\n            </div>\n\n            <div class=\"chat-contact-status-wrapper\"\n                 *ngIf=\"!chatWindowState.isCollapsed && chatWindowState.recipient.recipientType === 'contact'\"\n            >\n                <span class=\"chat-contact-status\">\n                    {{chatService.translations.presence[chatWindowState.recipient.presence$ | async]}}\n                </span>\n            </div>\n\n        </div>\n    </ng-container>\n\n    <ngx-chat-filedrop\n            *ngIf=\"!chatWindowState.isCollapsed\"\n            class=\"window-content\"\n            [enabled]=\"fileUploadHandler.isUploadSupported()\"\n            (fileUpload)=\"uploadFile($event)\"\n            [dropMessage]=\"chatService.translations.dropMessage\">\n        <div (click)=\"onFocus()\">\n            <ngx-chat-message-list\n                    [recipient]=\"chatWindowState.recipient\"\n                    [showAvatars]=\"false\"></ngx-chat-message-list>\n            <div class=\"chat-input-container\">\n                <ngx-chat-message-input\n                        [recipient]=\"chatWindowState.recipient\"\n                        (messageSent)=\"afterSendMessage()\"\n                ></ngx-chat-message-input>\n                <div *ngFor=\"let action of chatService.chatActions\"\n                     (click)=\"onActionClick(action)\"\n                     class=\"chat-action\"\n                     [ngClass]=\"action.cssClass\"\n                     [innerHTML]=\"action.html\">\n                </div>\n            </div>\n        </div>\n    </ngx-chat-filedrop>\n\n</ngx-chat-window-frame>\n", styles: ["@keyframes ngx-chat-message-in{0%{transform:translate(50px);opacity:0}to{transform:none;opacity:1}}@keyframes ngx-chat-message-out{0%{transform:translate(-50px);opacity:0}to{transform:none;opacity:1}}*{box-sizing:border-box;margin:0;padding:0;font-family:Helvetica,Arial,serif}.chat-contact-avatar-wrapper{min-width:2em;width:2em;min-height:2em;height:2em}.header-middle{flex-grow:1;flex-shrink:1;padding:0 .5em;white-space:nowrap;overflow:hidden;font-size:.8em;line-height:1.2;height:100%;display:flex;flex-direction:column;justify-content:space-around}.chat-contact-name-wrapper,.chat-contact-status-wrapper{text-overflow:ellipsis;overflow:hidden;display:block}.has-click-handler:hover{text-decoration:underline}.chat-contact-status{color:#999}.window-content{text-align:left;padding:0;min-height:5em;display:flex;flex-direction:column;overflow-x:hidden;overflow-y:auto}.chat-input-container{display:flex;padding:.5em;border-top:1px solid #e1e1e1;background:#fff;cursor:text}.chat-action{cursor:pointer;align-self:center;text-align:center}.chat-window-send{background-color:#fff;border-color:#fff;color:#000;width:1.5em}.chat-window-send:active{border:none}ngx-chat-message-input{flex-grow:1}\n"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [CHAT_SERVICE_TOKEN]
                }] }, { type: ChatListStateService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [FILE_UPLOAD_HANDLER_TOKEN]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [CONTACT_CLICK_HANDLER_TOKEN]
                }, {
                    type: Optional
                }] }]; }, propDecorators: { chatWindowState: [{
                type: Input
            }], messageInput: [{
                type: ViewChild,
                args: [ChatMessageInputComponent]
            }], contactMessageList: [{
                type: ViewChild,
                args: [ChatMessageListComponent]
            }] } });

class ChatVideoWindowComponent {
    constructor() { }
    ngAfterViewInit() {
        this.track.attach(this.video.nativeElement);
    }
}
ChatVideoWindowComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatVideoWindowComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
ChatVideoWindowComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.7", type: ChatVideoWindowComponent, selector: "ngx-chat-video-window", inputs: { track: "track" }, viewQueries: [{ propertyName: "video", first: true, predicate: ["video"], descendants: true }], ngImport: i0, template: "<ngx-chat-window-frame>\n    <video #video autoplay=\"1\"></video>\n</ngx-chat-window-frame>\n", styles: ["video{width:100%}\n"], dependencies: [{ kind: "component", type: ChatWindowFrameComponent, selector: "ngx-chat-window-frame", outputs: ["closeClick", "headerClick"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatVideoWindowComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-chat-video-window', template: "<ngx-chat-window-frame>\n    <video #video autoplay=\"1\"></video>\n</ngx-chat-window-frame>\n", styles: ["video{width:100%}\n"] }]
        }], ctorParameters: function () { return []; }, propDecorators: { video: [{
                type: ViewChild,
                args: ['video']
            }], track: [{
                type: Input
            }] } });

class ChatWindowListComponent {
    constructor(chatListService) {
        this.chatListService = chatListService;
    }
}
ChatWindowListComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatWindowListComponent, deps: [{ token: ChatListStateService }], target: i0.ɵɵFactoryTarget.Component });
ChatWindowListComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.7", type: ChatWindowListComponent, selector: "ngx-chat-window-list", inputs: { rosterState: "rosterState" }, ngImport: i0, template: "<div class=\"chat-list\" [@rosterVisibility]=\"rosterState\">\n\n    <ngx-chat-video-window\n            *ngFor=\"let track of (chatListService.openTracks$ | async)\"\n            [track]=\"track\">\n    </ngx-chat-video-window>\n\n    <ngx-chat-window\n            *ngFor=\"let chatWindowState of (chatListService.openChats$ | async)\"\n            [chatWindowState]=\"chatWindowState\"></ngx-chat-window>\n\n</div>\n", styles: ["*{box-sizing:border-box;margin:0;padding:0;font-family:Helvetica,Arial,serif}.chat-list{display:flex;flex-flow:row nowrap;align-items:flex-end;position:fixed;bottom:0;right:16em;z-index:5;pointer-events:none}\n"], dependencies: [{ kind: "directive", type: i2$1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "component", type: ChatWindowComponent, selector: "ngx-chat-window", inputs: ["chatWindowState"] }, { kind: "component", type: ChatVideoWindowComponent, selector: "ngx-chat-video-window", inputs: ["track"] }, { kind: "pipe", type: i2$1.AsyncPipe, name: "async" }], animations: [
        trigger('rosterVisibility', [
            state('hidden', style({
                right: '1em',
            })),
            state('shown', style({
                right: '15em',
            })),
            transition('hidden => shown', animate('400ms ease')),
            transition('shown => hidden', animate('400ms ease'))
        ])
    ] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatWindowListComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-chat-window-list', animations: [
                        trigger('rosterVisibility', [
                            state('hidden', style({
                                right: '1em',
                            })),
                            state('shown', style({
                                right: '15em',
                            })),
                            transition('hidden => shown', animate('400ms ease')),
                            transition('shown => hidden', animate('400ms ease'))
                        ])
                    ], template: "<div class=\"chat-list\" [@rosterVisibility]=\"rosterState\">\n\n    <ngx-chat-video-window\n            *ngFor=\"let track of (chatListService.openTracks$ | async)\"\n            [track]=\"track\">\n    </ngx-chat-video-window>\n\n    <ngx-chat-window\n            *ngFor=\"let chatWindowState of (chatListService.openChats$ | async)\"\n            [chatWindowState]=\"chatWindowState\"></ngx-chat-window>\n\n</div>\n", styles: ["*{box-sizing:border-box;margin:0;padding:0;font-family:Helvetica,Arial,serif}.chat-list{display:flex;flex-flow:row nowrap;align-items:flex-end;position:fixed;bottom:0;right:16em;z-index:5;pointer-events:none}\n"] }]
        }], ctorParameters: function () { return [{ type: ChatListStateService }]; }, propDecorators: { rosterState: [{
                type: Input
            }] } });

const STORAGE_NGX_CHAT_LAST_READ_DATE = 'ngxchat:unreadmessagedate';
const wrapperNodeName = 'entries';
const nodeName = 'last-read';
class LastReadEntriesNodeBuilder extends AbstractStanzaBuilder {
    constructor() {
        super(...arguments);
        this.lastReadNodes = [];
    }
    addLastReadNode(jid, date) {
        this.lastReadNodes.push(xml(nodeName, { jid, date }));
    }
    toStanza() {
        return xml(wrapperNodeName, {}, ...this.lastReadNodes);
    }
}
/**
 * Unofficial plugin using XEP-0163 / PubSub to track count of unread messages per recipient
 *
 * It publishes entries to a private PubSub-Node 'ngxchat:unreadmessagedate'
 * The stored elements look like this:
 * <item id="current">
 *     <entries>
 *         <last-read jid="user1@host1.tld" date="1546419050584"/>
 *         <last-read jid="user2@host1.tld" date="1546419050000"/>
 *     </entries>
 * </item>
 */
class UnreadMessageCountPlugin extends AbstractXmppPlugin {
    constructor(chatService, chatMessageListRegistry, publishSubscribePlugin, entityTimePlugin, multiUserChatPlugin) {
        super();
        this.chatService = chatService;
        this.chatMessageListRegistry = chatMessageListRegistry;
        this.publishSubscribePlugin = publishSubscribePlugin;
        this.entityTimePlugin = entityTimePlugin;
        this.multiUserChatPlugin = multiUserChatPlugin;
        /**
         * emits as soon as the unread message count changes, you might want to debounce it with e.g. half a a second, as
         * new messages might be acknowledged in another session.
         */
        this.jidToUnreadCount$ = new BehaviorSubject(new Map());
        this.jidToLastReadTimestamp = new Map();
        this.recipientIdToMessageSubscription = new Map();
        this.chatMessageListRegistry.chatOpened$
            .pipe(delay$1(0))
            .subscribe(recipient => this.checkForUnreadCountChange(recipient));
        merge(multiUserChatPlugin.rooms$, this.chatService.contactCreated$.pipe(map(contact => [contact]))).subscribe(recipients => {
            for (const recipient of recipients) {
                const jid = recipient.jidBare.toString();
                if (!this.recipientIdToMessageSubscription.has(jid)) {
                    const messages$ = recipient.messages$;
                    const updateUnreadCountSubscription = messages$
                        .pipe(debounceTime(20))
                        .subscribe(() => this.checkForUnreadCountChange(recipient));
                    this.recipientIdToMessageSubscription.set(jid, updateUnreadCountSubscription);
                }
            }
        });
        this.publishSubscribePlugin.publish$
            .subscribe((event) => this.handlePubSubEvent(event));
        this.unreadMessageCountSum$ = combineLatest([this.jidToUnreadCount$, this.chatService.blockedContactIds$])
            .pipe(debounceTime(20), map(([jidToUnreadCount, blockedContactIdSet]) => {
            let sum = 0;
            for (const [recipientJid, count] of jidToUnreadCount) {
                if (!blockedContactIdSet.has(recipientJid)) {
                    sum += count;
                }
            }
            return sum;
        }), distinctUntilChanged(), share());
    }
    async checkForUnreadCountChange(recipient) {
        if (this.chatMessageListRegistry.isChatOpen(recipient)) {
            this.jidToLastReadTimestamp.set(recipient.jidBare.toString(), await this.entityTimePlugin.getNow());
            await this.persistLastSeenDates();
        }
        this.updateContactUnreadMessageState(recipient);
    }
    async onBeforeOnline() {
        const fetchedDates = await this.fetchLastSeenDates();
        this.mergeJidToDates(fetchedDates);
    }
    onOffline() {
        for (const subscription of this.recipientIdToMessageSubscription.values()) {
            subscription.unsubscribe();
        }
        this.recipientIdToMessageSubscription.clear();
        this.jidToLastReadTimestamp.clear();
        this.jidToUnreadCount$.next(new Map());
    }
    async fetchLastSeenDates() {
        const entries = await this.publishSubscribePlugin.retrieveNodeItems(STORAGE_NGX_CHAT_LAST_READ_DATE);
        return this.parseLastSeenDates(entries);
    }
    parseLastSeenDates(topLevelElements) {
        const result = new Map();
        if (topLevelElements.length === 1) {
            const [itemElement] = topLevelElements;
            for (const lastReadEntry of itemElement.getChild(wrapperNodeName).getChildren(nodeName)) {
                const { jid, date } = lastReadEntry.attrs;
                if (!isNaN(date)) {
                    result.set(jid, date);
                }
            }
        }
        return result;
    }
    updateContactUnreadMessageState(recipient) {
        const contactJid = recipient.jidBare.toString();
        const lastReadDate = this.jidToLastReadTimestamp.get(contactJid) || 0;
        const contactUnreadMessageCount = this.calculateUnreadMessageCount(recipient, lastReadDate);
        const jidToCount = this.jidToUnreadCount$.getValue();
        if (jidToCount.get(contactJid) !== contactUnreadMessageCount) {
            this.jidToUnreadCount$.next(jidToCount.set(contactJid, contactUnreadMessageCount));
        }
    }
    calculateUnreadMessageCount(recipient, lastReadTimestamp) {
        const firstUnreadMessageIndex = findSortedInsertionIndexLast(lastReadTimestamp, recipient.messages, message => message.datetime.getTime());
        return recipient.messages.slice(firstUnreadMessageIndex)
            .filter(message => message.direction === Direction.in)
            .length;
    }
    async persistLastSeenDates() {
        const lastReadNodeBuilder = new LastReadEntriesNodeBuilder();
        for (const [jid, date] of this.jidToLastReadTimestamp) {
            lastReadNodeBuilder.addLastReadNode(jid, date.toString());
        }
        await this.publishSubscribePlugin.storePrivatePayloadPersistent(STORAGE_NGX_CHAT_LAST_READ_DATE, 'current', lastReadNodeBuilder.toStanza());
    }
    handlePubSubEvent(event) {
        const items = event.getChild('items');
        const itemsNode = items && items.attrs.node;
        const item = items && items.getChildren('item');
        if (itemsNode === STORAGE_NGX_CHAT_LAST_READ_DATE && item) {
            const publishedLastJidToDate = this.parseLastSeenDates(item);
            this.mergeJidToDates(publishedLastJidToDate);
        }
    }
    mergeJidToDates(newJidToDate) {
        for (const [jid, date] of newJidToDate) {
            const oldLastReadDate = this.jidToLastReadTimestamp.get(jid);
            if (!oldLastReadDate || oldLastReadDate < date) {
                this.jidToLastReadTimestamp.set(jid, date);
            }
        }
    }
}

class RosterRecipientComponent {
    constructor(chatService) {
        this.chatService = chatService;
        this.Presence = Presence;
    }
    ngOnInit() {
        this.unreadCount$ = this.chatService.getPlugin(UnreadMessageCountPlugin).jidToUnreadCount$
            .pipe(map(jidToUnreadCount => jidToUnreadCount.get(this.recipient.jidBare.toString()) || 0), distinctUntilChanged(), debounceTime(20));
        this.presence$ = this.recipient.recipientType === 'contact' ? this.recipient.presence$ : of(Presence.unavailable);
    }
}
RosterRecipientComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: RosterRecipientComponent, deps: [{ token: CHAT_SERVICE_TOKEN }], target: i0.ɵɵFactoryTarget.Component });
RosterRecipientComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.7", type: RosterRecipientComponent, selector: "ngx-chat-roster-recipient", inputs: { recipient: "recipient" }, ngImport: i0, template: "<div class=\"roster-recipient\" [title]=\"recipient.name\">\n\n    <div class=\"roster-recipient-avatar\">\n        <ngx-chat-avatar [imageUrl]=\"recipient.avatar\"></ngx-chat-avatar>\n    </div>\n\n    <div class=\"roster-recipient-name\">\n        {{recipient.name}}\n    </div>\n\n    <div class=\"roster-recipient-status\">\n        <div class=\"unread-message-badge\" *ngIf=\"(unreadCount$ | async) > 0\">{{unreadCount$ | async}}</div>\n        <ng-container *ngIf=\"presence$ | async as presence\">\n            <div *ngIf=\"presence !== Presence.unavailable\"\n                 class=\"roster-presence\"\n                 [ngClass]=\"'roster-presence--' + presence\">\u25CF\n            </div>\n        </ng-container>\n    </div>\n\n</div>\n", styles: ["@keyframes ngx-chat-message-in{0%{transform:translate(50px);opacity:0}to{transform:none;opacity:1}}@keyframes ngx-chat-message-out{0%{transform:translate(-50px);opacity:0}to{transform:none;opacity:1}}*{box-sizing:border-box;margin:0;padding:0;font-family:Helvetica,Arial,serif}.roster-recipient{display:flex;justify-content:space-between}.roster-recipient-avatar{min-width:2em;width:2em;min-height:2em;height:2em}.roster-recipient-name{padding-left:.5em;padding-top:.5em;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;flex-grow:1}.roster-recipient-status{white-space:nowrap}.roster-presence{display:inline-block;padding-top:.5em;margin-left:.3em}.roster-presence.roster-presence--present{color:#69ca48}.roster-presence.roster-presence--away{color:#ffbe00}.roster-presence.roster-presence--unavailable{color:transparent}.unread-message-badge{display:inline-block;padding-top:.2em;background-color:#ff5940;color:#fff;border-radius:50%;align-self:center;margin-top:.25em;width:1.5em;height:1.5em;text-align:center}\n"], dependencies: [{ kind: "directive", type: i2$1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2$1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: ChatAvatarComponent, selector: "ngx-chat-avatar", inputs: ["imageUrl"] }, { kind: "pipe", type: i2$1.AsyncPipe, name: "async" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: RosterRecipientComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-chat-roster-recipient', template: "<div class=\"roster-recipient\" [title]=\"recipient.name\">\n\n    <div class=\"roster-recipient-avatar\">\n        <ngx-chat-avatar [imageUrl]=\"recipient.avatar\"></ngx-chat-avatar>\n    </div>\n\n    <div class=\"roster-recipient-name\">\n        {{recipient.name}}\n    </div>\n\n    <div class=\"roster-recipient-status\">\n        <div class=\"unread-message-badge\" *ngIf=\"(unreadCount$ | async) > 0\">{{unreadCount$ | async}}</div>\n        <ng-container *ngIf=\"presence$ | async as presence\">\n            <div *ngIf=\"presence !== Presence.unavailable\"\n                 class=\"roster-presence\"\n                 [ngClass]=\"'roster-presence--' + presence\">\u25CF\n            </div>\n        </ng-container>\n    </div>\n\n</div>\n", styles: ["@keyframes ngx-chat-message-in{0%{transform:translate(50px);opacity:0}to{transform:none;opacity:1}}@keyframes ngx-chat-message-out{0%{transform:translate(-50px);opacity:0}to{transform:none;opacity:1}}*{box-sizing:border-box;margin:0;padding:0;font-family:Helvetica,Arial,serif}.roster-recipient{display:flex;justify-content:space-between}.roster-recipient-avatar{min-width:2em;width:2em;min-height:2em;height:2em}.roster-recipient-name{padding-left:.5em;padding-top:.5em;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;flex-grow:1}.roster-recipient-status{white-space:nowrap}.roster-presence{display:inline-block;padding-top:.5em;margin-left:.3em}.roster-presence.roster-presence--present{color:#69ca48}.roster-presence.roster-presence--away{color:#ffbe00}.roster-presence.roster-presence--unavailable{color:transparent}.unread-message-badge{display:inline-block;padding-top:.2em;background-color:#ff5940;color:#fff;border-radius:50%;align-self:center;margin-top:.25em;width:1.5em;height:1.5em;text-align:center}\n"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [CHAT_SERVICE_TOKEN]
                }] }]; }, propDecorators: { recipient: [{
                type: Input
            }] } });

class RosterListComponent {
    constructor(chatService, chatListService) {
        this.chatService = chatService;
        this.chatListService = chatListService;
        this.rosterStateChanged = new EventEmitter();
        this.multiUserChatPlugin = this.chatService.getPlugin(MultiUserChatPlugin);
    }
    ngOnInit() {
        if (!this.contacts) {
            this.contacts = this.chatService.contactsSubscribed$;
        }
        if (!this.contactRequestsReceived$) {
            this.contactRequestsReceived$ = this.chatService.contactRequestsReceived$;
        }
        if (!this.contactRequestsSent$) {
            this.contactRequestsSent$ = this.chatService.contactRequestsSent$;
        }
        if (!this.contactsUnaffiliated$) {
            this.contactsUnaffiliated$ = this.chatService.contactsUnaffiliated$;
        }
        this.hasNoContacts$ = combineLatest([
            this.contacts,
            this.contactRequestsReceived$,
            this.contactRequestsSent$,
            this.contactsUnaffiliated$,
        ]).pipe(map(([contacts, received, sent, unaffiliated]) => contacts.length + received.length + sent.length + unaffiliated.length === 0));
    }
    onClickRecipient(recipient) {
        this.chatListService.openChat(recipient);
    }
    toggleVisibility() {
        const newState = this.rosterState === 'shown' ? 'hidden' : 'shown';
        this.rosterStateChanged.emit(newState);
    }
}
RosterListComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: RosterListComponent, deps: [{ token: CHAT_SERVICE_TOKEN }, { token: ChatListStateService }], target: i0.ɵɵFactoryTarget.Component });
RosterListComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.7", type: RosterListComponent, selector: "ngx-chat-roster-list", inputs: { rosterState: "rosterState", contacts: "contacts", contactRequestsReceived$: "contactRequestsReceived$", contactRequestsSent$: "contactRequestsSent$", contactsUnaffiliated$: "contactsUnaffiliated$" }, outputs: { rosterStateChanged: "rosterStateChanged" }, ngImport: i0, template: "<div class=\"roster-drawer\" (click)=\"toggleVisibility()\" [@drawerVisibility]=\"rosterState\">\n    <div class=\"roster-drawer__button\" *ngIf=\"rosterState === 'shown'\">&raquo;</div>\n    <div class=\"roster-drawer__button\" *ngIf=\"rosterState === 'hidden'\">&laquo;</div>\n</div>\n\n<div class=\"roster-list\" [@rosterVisibility]=\"rosterState\" [attr.data-ngx-chat-state]=\"chatService.state$ | async\">\n\n    <div class=\"roster-header\">\n        {{ chatService.translations.chat }}\n    </div>\n\n    <ng-container *ngIf=\"(multiUserChatPlugin.rooms$ | async) as rooms\">\n        <ng-container *ngIf=\"rooms.length > 0\">\n            <div class=\"roster-group-header\">{{chatService.translations.rooms}}</div>\n\n            <div class=\"contact-list-wrapper\">\n                <ngx-chat-roster-recipient\n                        *ngFor=\"let room of rooms\"\n                        [recipient]=\"room\"\n                        (click)=\"onClickRecipient(room)\">\n                </ngx-chat-roster-recipient>\n            </div>\n        </ng-container>\n    </ng-container>\n\n    <ng-container *ngIf=\"(contacts | async).length > 0\">\n        <div class=\"roster-group-header\">{{chatService.translations.contacts}}</div>\n\n        <div class=\"contact-list-wrapper\">\n\n            <ngx-chat-roster-recipient\n                    *ngFor=\"let contact of (contacts | async)\"\n                    [recipient]=\"contact\"\n                    (click)=\"onClickRecipient(contact)\">\n            </ngx-chat-roster-recipient>\n\n        </div>\n    </ng-container>\n\n    <ng-container *ngIf=\"(contactRequestsReceived$ | async).length > 0\">\n        <div class=\"roster-group-header\">{{chatService.translations.contactRequestIn}}</div>\n        <div class=\"contact-list-wrapper\">\n\n            <ngx-chat-roster-recipient\n                    *ngFor=\"let contact of (contactRequestsReceived$ | async)\"\n                    [recipient]=\"contact\"\n                    (click)=\"onClickRecipient(contact)\">\n            </ngx-chat-roster-recipient>\n\n        </div>\n    </ng-container>\n\n    <ng-container *ngIf=\"(contactRequestsSent$ | async).length > 0\">\n        <div class=\"roster-group-header\">{{chatService.translations.contactRequestOut}}</div>\n        <div class=\"contact-list-wrapper\">\n\n            <ngx-chat-roster-recipient\n                    *ngFor=\"let contact of (contactRequestsSent$ | async)\"\n                    [recipient]=\"contact\"\n                    (click)=\"onClickRecipient(contact)\">\n            </ngx-chat-roster-recipient>\n\n        </div>\n    </ng-container>\n\n    <ng-container *ngIf=\"(contactsUnaffiliated$ | async).length > 0\">\n        <div class=\"roster-group-header\">{{chatService.translations.contactsUnaffiliated}}</div>\n        <div class=\"contact-list-wrapper\">\n\n            <ng-container *ngFor=\"let contact of (contactsUnaffiliated$ | async)\">\n                <ngx-chat-roster-recipient\n                        *ngIf=\"contact.messages.length > 0\"\n                        [recipient]=\"contact\"\n                        (click)=\"onClickRecipient(contact)\">\n                </ngx-chat-roster-recipient>\n            </ng-container>\n\n        </div>\n    </ng-container>\n\n    <div class=\"roster-list__empty\" *ngIf=\"hasNoContacts$ | async\">\n        {{chatService.translations.noContacts}}\n    </div>\n\n    <ng-container *ngIf=\"chatService.enableDebugging\">\n        <hr/>\n\n        <div class=\"contact-pending-request-received-wrapper\">\n            debug contact requests in:\n            <div class=\"contact-pending-request-received\"\n                 *ngFor=\"let request of (chatService.contactRequestsReceived$ | async)\">\n                {{request.name}}\n            </div>\n        </div>\n\n        <hr/>\n\n        <div class=\"contact-pending-request-sent-wrapper\">\n            debug contact requests out:\n            <div class=\"contact-pending-request-sent\"\n                 *ngFor=\"let request of (chatService.contactRequestsSent$ | async)\">\n                {{request.name}}\n            </div>\n        </div>\n\n        <hr/>\n\n        <p>\n            debug contacts (count: {{ (chatService.contacts$ | async).length }})<br/>\n        </p>\n        <p *ngFor=\"let contact of (chatService.contacts$|async)\" style=\"margin-bottom: 1em\">\n            <em>{{contact.name}}:</em><br/>\n            subscription={{contact.subscription$ | async}}<br/>\n            presence={{contact.presence$ | async}}<br/>\n            pendingIn={{contact.pendingIn$ | async}}<br/>\n            pendingOut={{contact.pendingOut$ | async}}\n        </p>\n        <p class=\"roster-debug-state\">state: {{chatService.state$ | async}}</p>\n    </ng-container>\n\n    <!--\n    <div class=\"roster-footer\">\n    </div>\n    -->\n</div>\n", styles: ["@keyframes ngx-chat-message-in{0%{transform:translate(50px);opacity:0}to{transform:none;opacity:1}}@keyframes ngx-chat-message-out{0%{transform:translate(-50px);opacity:0}to{transform:none;opacity:1}}*{box-sizing:border-box;margin:0;padding:0;font-family:Helvetica,Arial,serif}.roster-list{position:fixed;top:0;bottom:0;right:0;width:14em;overflow-y:auto;border-left:1px solid #e1e1e1;z-index:80;margin-left:10px;background-color:#f5f5f5;text-align:left;padding:.5em .5em 0;display:flex;flex-direction:column}.roster-list .roster-header{text-align:center;margin-bottom:1em}.roster-list .roster-group-header{border-bottom:1px solid #e1e1e1;padding-bottom:.5em}.roster-list .roster-footer{border-top:1px solid #e1e1e1;width:14em;padding-top:.5em}.roster-list .contact-list-wrapper{margin-bottom:1em}.roster-list ngx-chat-roster-recipient{display:block;padding:.5em}.roster-list ngx-chat-roster-recipient:hover{background-color:#e8e8e8;cursor:pointer}.roster-list__empty{color:#999;text-align:center;margin-top:.5em;font-size:1.5em}.roster-drawer{top:0;bottom:0;right:14em;width:1em;position:fixed;z-index:80;cursor:pointer}.roster-drawer:hover{background-color:#1e1e1e33}.roster-drawer__button{top:50%;color:transparent;background-color:transparent;position:fixed;margin-left:.4rem}.roster-drawer:hover .roster-drawer__button{color:#fff}\n"], dependencies: [{ kind: "directive", type: i2$1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2$1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: RosterRecipientComponent, selector: "ngx-chat-roster-recipient", inputs: ["recipient"] }, { kind: "pipe", type: i2$1.AsyncPipe, name: "async" }], animations: [
        trigger('rosterVisibility', [
            state('hidden', style({
                right: '-14em',
            })),
            state('shown', style({
                right: '0em',
            })),
            transition('hidden => shown', animate('400ms ease')),
            transition('shown => hidden', animate('400ms ease')),
        ]),
        trigger('drawerVisibility', [
            state('hidden', style({
                right: '0em',
            })),
            state('shown', style({
                right: '14em',
            })),
            transition('hidden => shown', animate('400ms ease')),
            transition('shown => hidden', animate('400ms ease')),
        ]),
    ] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: RosterListComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-chat-roster-list', animations: [
                        trigger('rosterVisibility', [
                            state('hidden', style({
                                right: '-14em',
                            })),
                            state('shown', style({
                                right: '0em',
                            })),
                            transition('hidden => shown', animate('400ms ease')),
                            transition('shown => hidden', animate('400ms ease')),
                        ]),
                        trigger('drawerVisibility', [
                            state('hidden', style({
                                right: '0em',
                            })),
                            state('shown', style({
                                right: '14em',
                            })),
                            transition('hidden => shown', animate('400ms ease')),
                            transition('shown => hidden', animate('400ms ease')),
                        ]),
                    ], template: "<div class=\"roster-drawer\" (click)=\"toggleVisibility()\" [@drawerVisibility]=\"rosterState\">\n    <div class=\"roster-drawer__button\" *ngIf=\"rosterState === 'shown'\">&raquo;</div>\n    <div class=\"roster-drawer__button\" *ngIf=\"rosterState === 'hidden'\">&laquo;</div>\n</div>\n\n<div class=\"roster-list\" [@rosterVisibility]=\"rosterState\" [attr.data-ngx-chat-state]=\"chatService.state$ | async\">\n\n    <div class=\"roster-header\">\n        {{ chatService.translations.chat }}\n    </div>\n\n    <ng-container *ngIf=\"(multiUserChatPlugin.rooms$ | async) as rooms\">\n        <ng-container *ngIf=\"rooms.length > 0\">\n            <div class=\"roster-group-header\">{{chatService.translations.rooms}}</div>\n\n            <div class=\"contact-list-wrapper\">\n                <ngx-chat-roster-recipient\n                        *ngFor=\"let room of rooms\"\n                        [recipient]=\"room\"\n                        (click)=\"onClickRecipient(room)\">\n                </ngx-chat-roster-recipient>\n            </div>\n        </ng-container>\n    </ng-container>\n\n    <ng-container *ngIf=\"(contacts | async).length > 0\">\n        <div class=\"roster-group-header\">{{chatService.translations.contacts}}</div>\n\n        <div class=\"contact-list-wrapper\">\n\n            <ngx-chat-roster-recipient\n                    *ngFor=\"let contact of (contacts | async)\"\n                    [recipient]=\"contact\"\n                    (click)=\"onClickRecipient(contact)\">\n            </ngx-chat-roster-recipient>\n\n        </div>\n    </ng-container>\n\n    <ng-container *ngIf=\"(contactRequestsReceived$ | async).length > 0\">\n        <div class=\"roster-group-header\">{{chatService.translations.contactRequestIn}}</div>\n        <div class=\"contact-list-wrapper\">\n\n            <ngx-chat-roster-recipient\n                    *ngFor=\"let contact of (contactRequestsReceived$ | async)\"\n                    [recipient]=\"contact\"\n                    (click)=\"onClickRecipient(contact)\">\n            </ngx-chat-roster-recipient>\n\n        </div>\n    </ng-container>\n\n    <ng-container *ngIf=\"(contactRequestsSent$ | async).length > 0\">\n        <div class=\"roster-group-header\">{{chatService.translations.contactRequestOut}}</div>\n        <div class=\"contact-list-wrapper\">\n\n            <ngx-chat-roster-recipient\n                    *ngFor=\"let contact of (contactRequestsSent$ | async)\"\n                    [recipient]=\"contact\"\n                    (click)=\"onClickRecipient(contact)\">\n            </ngx-chat-roster-recipient>\n\n        </div>\n    </ng-container>\n\n    <ng-container *ngIf=\"(contactsUnaffiliated$ | async).length > 0\">\n        <div class=\"roster-group-header\">{{chatService.translations.contactsUnaffiliated}}</div>\n        <div class=\"contact-list-wrapper\">\n\n            <ng-container *ngFor=\"let contact of (contactsUnaffiliated$ | async)\">\n                <ngx-chat-roster-recipient\n                        *ngIf=\"contact.messages.length > 0\"\n                        [recipient]=\"contact\"\n                        (click)=\"onClickRecipient(contact)\">\n                </ngx-chat-roster-recipient>\n            </ng-container>\n\n        </div>\n    </ng-container>\n\n    <div class=\"roster-list__empty\" *ngIf=\"hasNoContacts$ | async\">\n        {{chatService.translations.noContacts}}\n    </div>\n\n    <ng-container *ngIf=\"chatService.enableDebugging\">\n        <hr/>\n\n        <div class=\"contact-pending-request-received-wrapper\">\n            debug contact requests in:\n            <div class=\"contact-pending-request-received\"\n                 *ngFor=\"let request of (chatService.contactRequestsReceived$ | async)\">\n                {{request.name}}\n            </div>\n        </div>\n\n        <hr/>\n\n        <div class=\"contact-pending-request-sent-wrapper\">\n            debug contact requests out:\n            <div class=\"contact-pending-request-sent\"\n                 *ngFor=\"let request of (chatService.contactRequestsSent$ | async)\">\n                {{request.name}}\n            </div>\n        </div>\n\n        <hr/>\n\n        <p>\n            debug contacts (count: {{ (chatService.contacts$ | async).length }})<br/>\n        </p>\n        <p *ngFor=\"let contact of (chatService.contacts$|async)\" style=\"margin-bottom: 1em\">\n            <em>{{contact.name}}:</em><br/>\n            subscription={{contact.subscription$ | async}}<br/>\n            presence={{contact.presence$ | async}}<br/>\n            pendingIn={{contact.pendingIn$ | async}}<br/>\n            pendingOut={{contact.pendingOut$ | async}}\n        </p>\n        <p class=\"roster-debug-state\">state: {{chatService.state$ | async}}</p>\n    </ng-container>\n\n    <!--\n    <div class=\"roster-footer\">\n    </div>\n    -->\n</div>\n", styles: ["@keyframes ngx-chat-message-in{0%{transform:translate(50px);opacity:0}to{transform:none;opacity:1}}@keyframes ngx-chat-message-out{0%{transform:translate(-50px);opacity:0}to{transform:none;opacity:1}}*{box-sizing:border-box;margin:0;padding:0;font-family:Helvetica,Arial,serif}.roster-list{position:fixed;top:0;bottom:0;right:0;width:14em;overflow-y:auto;border-left:1px solid #e1e1e1;z-index:80;margin-left:10px;background-color:#f5f5f5;text-align:left;padding:.5em .5em 0;display:flex;flex-direction:column}.roster-list .roster-header{text-align:center;margin-bottom:1em}.roster-list .roster-group-header{border-bottom:1px solid #e1e1e1;padding-bottom:.5em}.roster-list .roster-footer{border-top:1px solid #e1e1e1;width:14em;padding-top:.5em}.roster-list .contact-list-wrapper{margin-bottom:1em}.roster-list ngx-chat-roster-recipient{display:block;padding:.5em}.roster-list ngx-chat-roster-recipient:hover{background-color:#e8e8e8;cursor:pointer}.roster-list__empty{color:#999;text-align:center;margin-top:.5em;font-size:1.5em}.roster-drawer{top:0;bottom:0;right:14em;width:1em;position:fixed;z-index:80;cursor:pointer}.roster-drawer:hover{background-color:#1e1e1e33}.roster-drawer__button{top:50%;color:transparent;background-color:transparent;position:fixed;margin-left:.4rem}.roster-drawer:hover .roster-drawer__button{color:#fff}\n"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [CHAT_SERVICE_TOKEN]
                }] }, { type: ChatListStateService }]; }, propDecorators: { rosterState: [{
                type: Input
            }], contacts: [{
                type: Input
            }], contactRequestsReceived$: [{
                type: Input
            }], contactRequestsSent$: [{
                type: Input
            }], contactsUnaffiliated$: [{
                type: Input
            }], rosterStateChanged: [{
                type: Output
            }] } });

/**
 * The main UI component. Should be instantiated near the root of your application.
 *
 * ```html
 * <!-- plain usage, no configuration -->
 * <ngx-chat></ngx-chat>
 *
 * <!-- if supplied, translations contain an object with the structure of the Translations interface. -->
 * <ngx-chat translations="{'contacts': 'Kontakte', ...}"></ngx-chat>
 *
 * <!-- if supplied, the contacts input attribute takes an Observable<Contact[]> as source for your roster list -->
 * <ngx-chat contacts="..."></ngx-chat>
 *
 * <!-- if supplied, userAvatar$ contains an Obervable<string>, which is used as the src attribute of the img for the current user. -->
 * <ngx-chat userAvatar$="Observable.of('http://...')"></ngx-chat>
 * ```
 */
class ChatComponent {
    constructor(chatService) {
        this.chatService = chatService;
        this.showChatComponent = false;
    }
    /**
     * If supplied, translations contain an object with the structure of the Translations interface.
     */
    set translations(translations) {
        const defaultTranslation = defaultTranslations();
        if (translations) {
            this.chatService.translations = {
                ...defaultTranslation,
                ...translations,
                presence: {
                    ...defaultTranslation.presence,
                    ...translations.presence,
                },
            };
        }
    }
    ngOnInit() {
        this.chatService.state$.subscribe($e => this.onChatStateChange($e));
        this.onRosterStateChanged(this.rosterState);
        if (this.userAvatar$) {
            this.userAvatar$.subscribe(avatar => this.chatService.userAvatar$.next(avatar));
        }
    }
    ngOnChanges(changes) {
        if (changes.rosterState) {
            this.onRosterStateChanged(changes.rosterState.currentValue);
        }
    }
    onChatStateChange(state) {
        this.showChatComponent = state === 'online';
        this.updateBodyClass();
    }
    onRosterStateChanged(state) {
        this.rosterState = state;
        this.updateBodyClass();
    }
    updateBodyClass() {
        const rosterClass = 'has-roster';
        if (this.showChatComponent && this.rosterState !== 'hidden') {
            document.body.classList.add(rosterClass);
        }
        else {
            document.body.classList.remove(rosterClass);
        }
    }
}
ChatComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatComponent, deps: [{ token: CHAT_SERVICE_TOKEN }], target: i0.ɵɵFactoryTarget.Component });
ChatComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.7", type: ChatComponent, selector: "ngx-chat", inputs: { translations: "translations", contacts: "contacts", contactRequestsReceived$: "contactRequestsReceived$", contactRequestsSent$: "contactRequestsSent$", contactsUnaffiliated$: "contactsUnaffiliated$", userAvatar$: "userAvatar$", rosterState: "rosterState" }, usesOnChanges: true, ngImport: i0, template: "<ngx-chat-window-list *ngIf=\"showChatComponent\"\n                      [rosterState]=\"rosterState\">\n</ngx-chat-window-list>\n<ngx-chat-roster-list [rosterState]=\"rosterState\"\n                      [contacts]=\"contacts\"\n                      [contactRequestsReceived$]=\"contactRequestsReceived$\"\n                      [contactRequestsSent$]=\"contactRequestsSent$\"\n                      [contactsUnaffiliated$]=\"contactsUnaffiliated$\"\n                      *ngIf=\"showChatComponent\"\n                      (rosterStateChanged)=\"onRosterStateChanged($event)\">\n</ngx-chat-roster-list>\n", styles: [""], dependencies: [{ kind: "directive", type: i2$1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: ChatWindowListComponent, selector: "ngx-chat-window-list", inputs: ["rosterState"] }, { kind: "component", type: RosterListComponent, selector: "ngx-chat-roster-list", inputs: ["rosterState", "contacts", "contactRequestsReceived$", "contactRequestsSent$", "contactsUnaffiliated$"], outputs: ["rosterStateChanged"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-chat', template: "<ngx-chat-window-list *ngIf=\"showChatComponent\"\n                      [rosterState]=\"rosterState\">\n</ngx-chat-window-list>\n<ngx-chat-roster-list [rosterState]=\"rosterState\"\n                      [contacts]=\"contacts\"\n                      [contactRequestsReceived$]=\"contactRequestsReceived$\"\n                      [contactRequestsSent$]=\"contactRequestsSent$\"\n                      [contactsUnaffiliated$]=\"contactsUnaffiliated$\"\n                      *ngIf=\"showChatComponent\"\n                      (rosterStateChanged)=\"onRosterStateChanged($event)\">\n</ngx-chat-roster-list>\n" }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [CHAT_SERVICE_TOKEN]
                }] }]; }, propDecorators: { translations: [{
                type: Input
            }], contacts: [{
                type: Input
            }], contactRequestsReceived$: [{
                type: Input
            }], contactRequestsSent$: [{
                type: Input
            }], contactsUnaffiliated$: [{
                type: Input
            }], userAvatar$: [{
                type: Input
            }], rosterState: [{
                type: Input
            }] } });

function getDomain(service) {
    const domain = service.split('://')[1] || service;
    return domain.split(':')[0].split('/')[0];
}

const STORAGE_BOOKMARKS = 'storage:bookmarks';
/**
 * XEP-0048 Bookmarks (https://xmpp.org/extensions/xep-0048.html)
 */
class BookmarkPlugin extends AbstractXmppPlugin {
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

/**
 * Request time of entities via XEP-0202.
 */
class EntityTimePlugin extends AbstractXmppPlugin {
    constructor(xmppChatAdapter, serviceDiscoveryPlugin, logService) {
        super();
        this.xmppChatAdapter = xmppChatAdapter;
        this.serviceDiscoveryPlugin = serviceDiscoveryPlugin;
        this.logService = logService;
        this.serverSupportsTime$ = new BehaviorSubject('unknown');
        this.serverTime$ = new BehaviorSubject(null);
    }
    async onBeforeOnline() {
        const serverSupportsTimeRequest = await this.serviceDiscoveryPlugin.supportsFeature(this.xmppChatAdapter.chatConnectionService.userJid.domain, 'urn:xmpp:time');
        if (serverSupportsTimeRequest) {
            const sharedUtcTimeStamp = await this.requestTime(this.xmppChatAdapter.chatConnectionService.userJid.domain);
            this.serverTime$.next(sharedUtcTimeStamp);
            this.serverSupportsTime$.next(true);
        }
        else {
            this.serverSupportsTime$.next(false);
        }
    }
    onOffline() {
        this.serverSupportsTime$.next('unknown');
        this.serverTime$.next(null);
    }
    /**
     * Returns a non-client-specific timestamp if server supports XEP-0202. Fallback to local timestamp in case of missing support.
     */
    async getNow() {
        const calculateNowViaServerTime$ = this.serverTime$.pipe(map(reference => this.calculateNow(reference)), first());
        return await this.serverSupportsTime$.pipe(timeout$1(5000), first(supportsServerTime => supportsServerTime !== 'unknown'), mergeMap(supportsServerTime => supportsServerTime ? calculateNowViaServerTime$ : of(Date.now())), catchError(() => of(Date.now()))).toPromise();
    }
    calculateNow(reference) {
        return reference.utcTimestamp + (performance.now() - reference.localReference);
    }
    async requestTime(jid) {
        const response = await this.xmppChatAdapter.chatConnectionService.sendIq(xml('iq', { type: 'get', to: jid }, xml('time', { xmlns: 'urn:xmpp:time' })));
        const utcString = response.getChild('time', 'urn:xmpp:time')?.getChildText('utc');
        if (!utcString) {
            const message = 'invalid time response';
            this.logService.error(message, response.toString());
            throw new Error(message);
        }
        return { utcTimestamp: Date.parse(utcString), localReference: performance.now() };
    }
}

/**
 * XEP-0363 http file upload
 */
class HttpFileUploadPlugin extends AbstractXmppPlugin {
    constructor(httpClient, serviceDiscoveryPlugin, xmppChatAdapter, logService) {
        super();
        this.httpClient = httpClient;
        this.serviceDiscoveryPlugin = serviceDiscoveryPlugin;
        this.xmppChatAdapter = xmppChatAdapter;
        this.logService = logService;
    }
    onBeforeOnline() {
        this.uploadService = this.serviceDiscoveryPlugin.findService('store', 'file');
        this.uploadService.then(() => {
            this.fileUploadSupported = true;
        }, () => {
            this.fileUploadSupported = false;
            this.logService.info('http file upload not supported');
        });
        return Promise.resolve();
    }
    onOffline() {
        this.uploadService = null;
        this.fileUploadSupported = false;
    }
    async upload(file) {
        await this.uploadService;
        const { name, size, type } = file;
        const slotUrl = await this.requestSlot(name, size.toString(), type);
        return await this.uploadToSlot(slotUrl, file);
    }
    isUploadSupported() {
        return this.fileUploadSupported;
    }
    async requestSlot(filename, size, contentType) {
        const to = (await this.uploadService).jid;
        const slotResponse = await this.xmppChatAdapter.chatConnectionService.sendIq(xml('iq', { to, type: 'get' }, xml('request', { xmlns: 'urn:xmpp:http:upload:0', filename, size, 'content-type': contentType })));
        return slotResponse.getChild('slot').getChild('put').attrs.url;
    }
    async uploadToSlot(slot, file) {
        await this.httpClient.put(slot, file, { responseType: 'blob' }).toPromise();
        return slot;
    }
}

/**
 * XEP-0280 Message Carbons
 */
class MessageCarbonsPlugin extends AbstractXmppPlugin {
    constructor(xmppChatAdapter) {
        super();
        this.xmppChatAdapter = xmppChatAdapter;
    }
    async onBeforeOnline() {
        return await this.xmppChatAdapter.chatConnectionService.sendIq(xml('iq', { type: 'set' }, xml('enable', { xmlns: 'urn:xmpp:carbons:2' })));
    }
    handleStanza(stanza) {
        const receivedOrSentElement = stanza.getChildByAttr('xmlns', 'urn:xmpp:carbons:2');
        const forwarded = receivedOrSentElement && receivedOrSentElement.getChild('forwarded', 'urn:xmpp:forward:0');
        const messageElement = forwarded && forwarded.getChild('message', 'jabber:client');
        const carbonFrom = stanza.attrs.from;
        const userJid = this.xmppChatAdapter.chatConnectionService.userJid;
        if (stanza.is('message') && receivedOrSentElement && forwarded && messageElement && userJid
            && userJid.bare().toString() === carbonFrom) {
            return this.handleCarbonMessageStanza(messageElement, receivedOrSentElement);
        }
        return false;
    }
    handleCarbonMessageStanza(messageElement, receivedOrSent) {
        const direction = receivedOrSent.is('received') ? Direction.in : Direction.out;
        // body can be missing on type=chat messageElements
        const body = messageElement.getChildText('body')?.trim();
        const message = {
            body,
            direction,
            datetime: new Date(),
            delayed: false,
            fromArchive: false,
        };
        const messageReceivedEvent = new MessageReceivedEvent();
        this.xmppChatAdapter.plugins.forEach(plugin => plugin.afterReceiveMessage(message, messageElement, messageReceivedEvent));
        if (!messageReceivedEvent.discard) {
            const { from, to } = messageElement.attrs;
            const contactJid = direction === Direction.in ? from : to;
            const contact = this.xmppChatAdapter.getOrCreateContactById(contactJid);
            contact.addMessage(message);
            if (direction === Direction.in) {
                this.xmppChatAdapter.message$.next(contact);
            }
        }
        return true;
    }
}

class TimeoutError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TimeoutError';
    }
}
function delay(ms) {
    let localDelay;
    const promise = new Promise(resolve => {
        localDelay = setTimeout(resolve, ms);
    });
    promise.timeout = localDelay;
    return promise;
}
function timeout(promise, ms) {
    const promiseDelay = delay(ms);
    // eslint-disable-next-line unicorn/consistent-function-scoping
    function cancelDelay() {
        clearTimeout(promiseDelay.timeout);
    }
    return Promise.race([
        promise.finally(cancelDelay),
        promiseDelay.then(() => {
            throw new TimeoutError();
        }),
    ]);
}

/**
 * XEP-0199 XMPP Ping (https://xmpp.org/extensions/xep-0199.html)
 */
class PingPlugin extends AbstractXmppPlugin {
    constructor(xmppChatAdapter, logService, ngZone) {
        super();
        this.xmppChatAdapter = xmppChatAdapter;
        this.logService = logService;
        this.ngZone = ngZone;
        this.pingInterval = 60000;
        this.xmppChatAdapter.state$.pipe(filter(newState => newState === 'online')).subscribe(() => this.schedulePings());
        this.xmppChatAdapter.state$.pipe(filter(newState => newState === 'disconnected')).subscribe(() => this.unschedulePings());
    }
    schedulePings() {
        this.unschedulePings();
        this.ngZone.runOutsideAngular(() => {
            this.timeoutHandle = window.setInterval(() => this.ping(), this.pingInterval);
        });
    }
    async ping() {
        this.logService.debug('ping...');
        try {
            await timeout(this.sendPing(), 10000);
            this.logService.debug('... pong');
        }
        catch {
            if (this.xmppChatAdapter.state$.getValue() === 'online'
                && this.xmppChatAdapter.chatConnectionService.state$.getValue() === 'online') {
                this.logService.error('... pong errored,  connection should be online, waiting for browser websocket timeout');
            }
        }
    }
    async sendPing() {
        return await this.xmppChatAdapter.chatConnectionService.sendIq(xml('iq', { type: 'get' }, xml('ping', { xmlns: 'urn:xmpp:ping' })));
    }
    unschedulePings() {
        window.clearInterval(this.timeoutHandle);
    }
}

/**
 * xep-0357
 */
class PushPlugin extends AbstractXmppPlugin {
    constructor(xmppChatAdapter, serviceDiscoveryPlugin) {
        super();
        this.xmppChatAdapter = xmppChatAdapter;
        this.serviceDiscoveryPlugin = serviceDiscoveryPlugin;
    }
    async register(node, jid) {
        if (!jid) {
            const service = await this.getPushServiceComponent();
            jid = service.jid;
        }
        return await this.xmppChatAdapter.chatConnectionService.sendIq(xml('iq', { type: 'set' }, xml('enable', { xmlns: 'urn:xmpp:push:0', jid, node })));
    }
    async getPushServiceComponent() {
        return await this.serviceDiscoveryPlugin.findService('pubsub', 'push');
    }
    async unregister(node, jid) {
        if (!jid) {
            const service = await this.getPushServiceComponent();
            jid = service.jid;
        }
        return await this.xmppChatAdapter.chatConnectionService.sendIq(xml('iq', { type: 'set' }, xml('disable', { xmlns: 'urn:xmpp:push:0', jid, node })));
    }
}

/**
 * XEP-0077: In-Band Registration
 * see: https://xmpp.org/extensions/xep-0077.html
 * Handles registration over the XMPP chat instead of relaying on a admin user account management
 */
class RegistrationPlugin extends AbstractXmppPlugin {
    constructor(logService, ngZone) {
        super();
        this.logService = logService;
        this.ngZone = ngZone;
        this.registered$ = new Subject();
        this.cleanUp = new Subject();
        this.loggedIn$ = new Subject();
        this.registrationTimeout = 5000;
    }
    /**
     * Promise resolves if user account is registered successfully,
     * rejects if an error happens while registering, e.g. the username is already taken.
     */
    async register(username, password, service, domain) {
        await this.ngZone.runOutsideAngular(async () => {
            try {
                await timeout((async () => {
                    domain = domain || getDomain(service);
                    this.logService.debug('registration plugin', 'connecting...');
                    await this.connect(username, password, service, domain);
                    this.logService.debug('registration plugin', 'connection established, starting registration');
                    await this.client.iqCaller.request(xml('iq', { type: 'get', to: domain }, xml('query', { xmlns: 'jabber:iq:register' })));
                    this.logService.debug('registration plugin', 'server acknowledged registration request, sending credentials');
                    await this.client.iqCaller.request(xml('iq', { type: 'set' }, xml('query', { xmlns: 'jabber:iq:register' }, xml('username', {}, username), xml('password', {}, password))));
                    this.registered$.next();
                    await this.loggedIn$.pipe(takeUntil(this.cleanUp), first()).toPromise();
                    this.logService.debug('registration plugin', 'registration successful');
                })(), this.registrationTimeout);
            }
            catch (e) {
                this.logService.warn('error registering', e);
                throw e;
            }
            finally {
                this.cleanUp.next();
                this.logService.debug('registration plugin', 'cleaning up');
                await this.client.stop();
            }
        });
    }
    connect(username, password, service, domain) {
        return new Promise(resolveConnectionEstablished => {
            this.client = client({
                domain: domain || getDomain(service),
                service,
                credentials: async (authenticationCallback) => {
                    resolveConnectionEstablished();
                    await this.registered$.pipe(takeUntil(this.cleanUp), first()).toPromise();
                    await authenticationCallback({ username, password });
                }
            });
            this.client.reconnect.stop();
            this.client.timeout = this.registrationTimeout;
            this.client.on('online', () => {
                this.logService.debug('registration plugin', 'online event');
                this.loggedIn$.next();
            });
            this.client.on('error', (err) => {
                this.logService.error('registration plugin', err);
            });
            this.client.on('offline', () => {
                this.logService.debug('registration plugin', 'offline event');
            });
            return this.client.start();
        });
    }
}

class ChatBackgroundNotificationService {
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
ChatBackgroundNotificationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatBackgroundNotificationService, deps: [{ token: CHAT_SERVICE_TOKEN }], target: i0.ɵɵFactoryTarget.Injectable });
ChatBackgroundNotificationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatBackgroundNotificationService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: ChatBackgroundNotificationService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [CHAT_SERVICE_TOKEN]
                }] }]; } });

class NgxChatModule {
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
NgxChatModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: NgxChatModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgxChatModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.7", ngImport: i0, type: NgxChatModule, declarations: [ChatComponent,
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
NgxChatModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: NgxChatModule, imports: [CommonModule,
        HttpClientModule,
        FormsModule,
        TextFieldModule,
        RouterModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: NgxChatModule, decorators: [{
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

function selectFile(params = { accept: '*', multiple: false }) {
    return new Promise((resolve) => {
        const htmlInputElement = document.createElement('input');
        htmlInputElement.style.display = 'none';
        htmlInputElement.type = 'file';
        htmlInputElement.accept = params.accept;
        htmlInputElement.multiple = params.multiple;
        htmlInputElement.addEventListener('change', () => {
            resolve(htmlInputElement.files);
            document.body.removeChild(htmlInputElement);
        });
        document.body.appendChild(htmlInputElement);
        htmlInputElement.click();
    });
}

/*
 * Public API Surface of ngx-chat
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AbstractStanzaBuilder, AbstractXmppPlugin, Affiliation, BlockPlugin, BookmarkPlugin, CHAT_SERVICE_TOKEN, CHAT_STYLE_TOKEN, CONTACT_CLICK_HANDLER_TOKEN, ChatBackgroundNotificationService, ChatComponent, ChatListStateService, ChatMessageComponent, ChatMessageInputComponent, ChatMessageListComponent, ChatMessageListRegistryService, ChatMessageSimpleComponent, ChatWindowComponent, ChatWindowState, Contact, ContactFactoryService, ContactSubscription, Direction, FILE_UPLOAD_HANDLER_TOKEN, FORM_NS, FileDropComponent, HttpFileUploadPlugin, LINK_OPENER_TOKEN, LinksDirective, LogLevel, LogService, MUC_SUB_EVENT_TYPE, MUC_SUB_FEATURE_ID, MessageArchivePlugin, MessageCarbonsPlugin, MessagePlugin, MessageReceivedEvent, MessageState, MessageStatePlugin, MessageStore, MessageUuidPlugin, MucSubPlugin, MultiUserChatPlugin, NgxChatModule, PUBSUB_EVENT_XMLNS, PingPlugin, Presence, PublishSubscribePlugin, PushPlugin, REPORT_USER_INJECTION_TOKEN, RegistrationPlugin, Role, Room, RosterPlugin, STORAGE_BOOKMARKS, ServiceDiscoveryPlugin, UnreadMessageCountPlugin, XmppChatAdapter, XmppChatConnectionService, XmppClientFactoryService, XmppResponseError, dummyAvatarContact, dummyAvatarRoom, getDomain, getField, id, isJid, parseForm, selectFile, serializeToSubmitForm, setFieldValue };
//# sourceMappingURL=pazznetwork-ngx-chat.mjs.map
