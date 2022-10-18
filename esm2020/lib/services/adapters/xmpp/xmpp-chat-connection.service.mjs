import { Injectable } from '@angular/core';
import { xml } from '@xmpp/client';
import { BehaviorSubject, Subject } from 'rxjs';
import { XmppResponseError } from './xmpp-response.error';
import * as i0 from "@angular/core";
import * as i1 from "../../log.service";
import * as i2 from "./xmpp-client-factory.service";
/**
 * Implementation of the XMPP specification according to RFC 6121.
 * @see https://xmpp.org/rfcs/rfc6121.html
 * @see https://xmpp.org/rfcs/rfc3920.html
 * @see https://xmpp.org/rfcs/rfc3921.html
 */
export class XmppChatConnectionService {
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
XmppChatConnectionService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.6", ngImport: i0, type: XmppChatConnectionService, deps: [{ token: i1.LogService }, { token: i0.NgZone }, { token: i2.XmppClientFactoryService }], target: i0.ɵɵFactoryTarget.Injectable });
XmppChatConnectionService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.6", ngImport: i0, type: XmppChatConnectionService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.6", ngImport: i0, type: XmppChatConnectionService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.LogService }, { type: i0.NgZone }, { type: i2.XmppClientFactoryService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1wcC1jaGF0LWNvbm5lY3Rpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvc2VydmljZXMvYWRhcHRlcnMveG1wcC94bXBwLWNoYXQtY29ubmVjdGlvbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFVLEdBQUcsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUczQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUloRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQzs7OztBQUsxRDs7Ozs7R0FLRztBQUVILE1BQU0sT0FBTyx5QkFBeUI7SUFhbEMsWUFDcUIsVUFBc0IsRUFDdEIsTUFBYyxFQUNkLHdCQUFrRDtRQUZsRCxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQTBCO1FBZHZELFdBQU0sR0FBRyxJQUFJLGVBQWUsQ0FBaUIsY0FBYyxDQUFDLENBQUM7UUFDN0QsbUJBQWMsR0FBRyxJQUFJLE9BQU8sRUFBVSxDQUFDO1FBTS9DLGNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3hCLDJCQUFzQixHQUFHLElBQUksR0FBRyxFQUEwRCxDQUFDO0lBT3pHLENBQUM7SUFFRyxRQUFRLENBQUMsR0FBUTtRQUNwQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEs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bXBvcnQgeyBJbmplY3RhYmxlLCBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENsaWVudCwgeG1sIH0gZnJvbSAnQHhtcHAvY2xpZW50JztcbmltcG9ydCB7IEpJRCB9IGZyb20gJ0B4bXBwL2ppZCc7XG5pbXBvcnQgeyBFbGVtZW50IH0gZnJvbSAnbHR4JztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTG9nSW5SZXF1ZXN0IH0gZnJvbSAnLi4vLi4vLi4vY29yZS9sb2ctaW4tcmVxdWVzdCc7XG5pbXBvcnQgeyBJcVJlc3BvbnNlU3RhbnphLCBTdGFuemEgfSBmcm9tICcuLi8uLi8uLi9jb3JlL3N0YW56YSc7XG5pbXBvcnQgeyBMb2dTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vbG9nLnNlcnZpY2UnO1xuaW1wb3J0IHsgWG1wcFJlc3BvbnNlRXJyb3IgfSBmcm9tICcuL3htcHAtcmVzcG9uc2UuZXJyb3InO1xuaW1wb3J0IHsgWG1wcENsaWVudEZhY3RvcnlTZXJ2aWNlIH0gZnJvbSAnLi94bXBwLWNsaWVudC1mYWN0b3J5LnNlcnZpY2UnO1xuXG5leHBvcnQgdHlwZSBYbXBwQ2hhdFN0YXRlcyA9ICdkaXNjb25uZWN0ZWQnIHwgJ29ubGluZScgfCAncmVjb25uZWN0aW5nJztcblxuLyoqXG4gKiBJbXBsZW1lbnRhdGlvbiBvZiB0aGUgWE1QUCBzcGVjaWZpY2F0aW9uIGFjY29yZGluZyB0byBSRkMgNjEyMS5cbiAqIEBzZWUgaHR0cHM6Ly94bXBwLm9yZy9yZmNzL3JmYzYxMjEuaHRtbFxuICogQHNlZSBodHRwczovL3htcHAub3JnL3JmY3MvcmZjMzkyMC5odG1sXG4gKiBAc2VlIGh0dHBzOi8veG1wcC5vcmcvcmZjcy9yZmMzOTIxLmh0bWxcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFhtcHBDaGF0Q29ubmVjdGlvblNlcnZpY2Uge1xuXG4gICAgcHVibGljIHJlYWRvbmx5IHN0YXRlJCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8WG1wcENoYXRTdGF0ZXM+KCdkaXNjb25uZWN0ZWQnKTtcbiAgICBwdWJsaWMgcmVhZG9ubHkgc3RhbnphVW5rbm93biQgPSBuZXcgU3ViamVjdDxTdGFuemE+KCk7XG5cbiAgICAvKipcbiAgICAgKiBVc2VyIEpJRCB3aXRoIHJlc291cmNlLCBub3QgYmFyZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgdXNlckppZD86IEpJRDtcbiAgICBwcml2YXRlIHJlcXVlc3RJZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgc3RhbnphUmVzcG9uc2VIYW5kbGVycyA9IG5ldyBNYXA8c3RyaW5nLCBbKHN0YW56YTogU3RhbnphKSA9PiB2b2lkLCAoZTogRXJyb3IpID0+IHZvaWRdPigpO1xuICAgIHB1YmxpYyBjbGllbnQ/OiBDbGllbnQ7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBsb2dTZXJ2aWNlOiBMb2dTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IG5nWm9uZTogTmdab25lLFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHhtcHBDbGllbnRGYWN0b3J5U2VydmljZTogWG1wcENsaWVudEZhY3RvcnlTZXJ2aWNlLFxuICAgICkge31cblxuICAgIHB1YmxpYyBvbk9ubGluZShqaWQ6IEpJRCk6IHZvaWQge1xuICAgICAgICB0aGlzLmxvZ1NlcnZpY2UuaW5mbygnb25saW5lID0nLCAnb25saW5lIGFzJywgamlkLnRvU3RyaW5nKCkpO1xuICAgICAgICB0aGlzLnVzZXJKaWQgPSBqaWQ7XG4gICAgICAgIHRoaXMuc3RhdGUkLm5leHQoJ29ubGluZScpO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25PZmZsaW5lKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnN0YW56YVJlc3BvbnNlSGFuZGxlcnMuZm9yRWFjaCgoWywgcmVqZWN0XSkgPT4gcmVqZWN0KG5ldyBFcnJvcignb2ZmbGluZScpKSk7XG4gICAgICAgIHRoaXMuc3RhbnphUmVzcG9uc2VIYW5kbGVycy5jbGVhcigpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBzZW5kUHJlc2VuY2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IHRoaXMuc2VuZChcbiAgICAgICAgICAgIHhtbCgncHJlc2VuY2UnKSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgc2VuZChjb250ZW50OiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5sb2dTZXJ2aWNlLmRlYnVnKCc+Pj4nLCBjb250ZW50KTtcbiAgICAgICAgYXdhaXQgdGhpcy5jbGllbnQuc2VuZChjb250ZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2VuZEF3YWl0aW5nUmVzcG9uc2UocmVxdWVzdDogRWxlbWVudCk6IFByb21pc2U8U3RhbnphPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICByZXF1ZXN0LmF0dHJzID0ge1xuICAgICAgICAgICAgICAgIGlkOiB0aGlzLmdldE5leHRSZXF1ZXN0SWQoKSxcbiAgICAgICAgICAgICAgICBmcm9tOiB0aGlzLnVzZXJKaWQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAuLi5yZXF1ZXN0LmF0dHJzLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnN0IHtpZH0gPSByZXF1ZXN0LmF0dHJzO1xuXG4gICAgICAgICAgICB0aGlzLnN0YW56YVJlc3BvbnNlSGFuZGxlcnMuc2V0KGlkLCBbXG4gICAgICAgICAgICAgICAgKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5hdHRycy50eXBlID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IFhtcHBSZXNwb25zZUVycm9yKHJlc3BvbnNlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJlamVjdCxcbiAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICB0aGlzLnNlbmQocmVxdWVzdCkuY2F0Y2goKGU6IHVua25vd24pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ1NlcnZpY2UuZXJyb3IoJ2Vycm9yIHNlbmRpbmcgc3RhbnphJywgZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFuemFSZXNwb25zZUhhbmRsZXJzLmRlbGV0ZShpZCk7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBvblN0YW56YVJlY2VpdmVkKHN0YW56YTogU3RhbnphKTogdm9pZCB7XG4gICAgICAgIGxldCBoYW5kbGVkID0gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgW2hhbmRsZVJlc3BvbnNlXSA9IHRoaXMuc3RhbnphUmVzcG9uc2VIYW5kbGVycy5nZXQoc3RhbnphLmF0dHJzLmlkKSA/PyBbXTtcbiAgICAgICAgaWYgKGhhbmRsZVJlc3BvbnNlKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ1NlcnZpY2UuZGVidWcoJzw8PCcsIHN0YW56YS50b1N0cmluZygpLCAnaGFuZGxlZCBieSByZXNwb25zZSBoYW5kbGVyJyk7XG4gICAgICAgICAgICB0aGlzLnN0YW56YVJlc3BvbnNlSGFuZGxlcnMuZGVsZXRlKHN0YW56YS5hdHRycy5pZCk7XG4gICAgICAgICAgICBoYW5kbGVSZXNwb25zZShzdGFuemEpO1xuICAgICAgICAgICAgaGFuZGxlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWhhbmRsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhbnphVW5rbm93biQubmV4dChzdGFuemEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHNlbmRJcShyZXF1ZXN0OiBFbGVtZW50KTogUHJvbWlzZTxJcVJlc3BvbnNlU3RhbnphPCdyZXN1bHQnPj4ge1xuICAgICAgICBjb25zdCByZXF1ZXN0VHlwZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gcmVxdWVzdC5hdHRycy50eXBlO1xuICAgICAgICAvLyBzZWUgaHR0cHM6Ly9kYXRhdHJhY2tlci5pZXRmLm9yZy9kb2MvaHRtbC9kcmFmdC1pZXRmLXhtcHAtMzkyMGJpcyNzZWN0aW9uLTguMi4zXG4gICAgICAgIGlmICghcmVxdWVzdFR5cGUgfHwgKHJlcXVlc3RUeXBlICE9PSAnZ2V0JyAmJiByZXF1ZXN0VHlwZSAhPT0gJ3NldCcpKSB7XG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gYGlxIHN0YW56YSB3aXRob3V0IHR5cGU6ICR7cmVxdWVzdC50b1N0cmluZygpfWA7XG4gICAgICAgICAgICB0aGlzLmxvZ1NlcnZpY2UuZXJyb3IobWVzc2FnZSk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuc2VuZEF3YWl0aW5nUmVzcG9uc2UocmVxdWVzdCk7XG4gICAgICAgIGlmICghdGhpcy5pc0lxU3RhbnphUmVzcG9uc2UocmVzcG9uc2UpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHJlY2VpdmVkIHVuZXhwZWN0ZWQgc3RhbnphIGFzIGlxIHJlc3BvbnNlOiB0eXBlPSR7cmVzcG9uc2UuYXR0cnMudHlwZX0sIHN0YW56YT0ke3Jlc3BvbnNlLnRvU3RyaW5nKCl9YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlIGFzIElxUmVzcG9uc2VTdGFuemE8J3Jlc3VsdCc+O1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNJcVN0YW56YVJlc3BvbnNlKHN0YW56YTogU3RhbnphKTogc3RhbnphIGlzIElxUmVzcG9uc2VTdGFuemEge1xuICAgICAgICBjb25zdCBzdGFuemFUeXBlID0gc3RhbnphLmF0dHJzLnR5cGU7XG4gICAgICAgIHJldHVybiBzdGFuemEubmFtZSA9PT0gJ2lxJyAmJiAoc3RhbnphVHlwZSA9PT0gJ3Jlc3VsdCcgfHwgc3RhbnphVHlwZSA9PT0gJ2Vycm9yJyk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHNlbmRJcUFja1Jlc3VsdChpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IHRoaXMuc2VuZChcbiAgICAgICAgICAgIHhtbCgnaXEnLCB7ZnJvbTogdGhpcy51c2VySmlkLnRvU3RyaW5nKCksIGlkLCB0eXBlOiAncmVzdWx0J30pLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIGFzeW5jIGxvZ0luKGxvZ0luUmVxdWVzdDogTG9nSW5SZXF1ZXN0KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGlmIChsb2dJblJlcXVlc3QudXNlcm5hbWUuaW5kZXhPZignQCcpID49IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ1NlcnZpY2Uud2FybigndXNlcm5hbWUgc2hvdWxkIG5vdCBjb250YWluIGRvbWFpbiwgb25seSBsb2NhbCBwYXJ0LCB0aGlzIGNhbiBsZWFkIHRvIGVycm9ycyEnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jbGllbnQgPSB0aGlzLnhtcHBDbGllbnRGYWN0b3J5U2VydmljZS5jbGllbnQobG9nSW5SZXF1ZXN0KTtcblxuICAgICAgICAgICAgdGhpcy5jbGllbnQub24oJ2Vycm9yJywgKGVycjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dTZXJ2aWNlLmVycm9yKCdjaGF0IHNlcnZpY2UgZXJyb3IgPT4nLCBlcnIudG9TdHJpbmcoKSwgZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmNsaWVudC5vbignc3RhdHVzJywgKHN0YXR1czogYW55LCB2YWx1ZTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dTZXJ2aWNlLmluZm8oJ3N0YXR1cyB1cGRhdGUgPScsIHN0YXR1cywgdmFsdWUgPyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkgOiAnJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT09ICdvZmZsaW5lJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSQubmV4dCgnZGlzY29ubmVjdGVkJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmNsaWVudC5vbignb25saW5lJywgKGppZDogSklEKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm9uT25saW5lKGppZCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5jbGllbnQub24oJ3N0YW56YScsIChzdGFuemE6IFN0YW56YSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnNraXBYbXBwQ2xpZW50UmVzcG9uc2VzKHN0YW56YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uU3RhbnphUmVjZWl2ZWQoc3RhbnphKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmNsaWVudC5vbignZGlzY29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlJC5uZXh0KCdyZWNvbm5lY3RpbmcnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmNsaWVudC5vbignb2ZmbGluZScsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uT2ZmbGluZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGF3YWl0IHRoaXMuY2xpZW50LnN0YXJ0KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdlIHNob3VsZCBza2lwIG91ciBpcSBoYW5kbGluZyBmb3IgdGhlIGZvbGxvd2luZyB4bXBwL2NsaWVudCByZXNwb25zZTpcbiAgICAgKiAtIHJlc291cmNlIGJpbmQgb24gc3RhcnQgYnkgaHR0cHM6Ly94bXBwLm9yZy9yZmNzL3JmYzYxMjAuaHRtbCNiaW5kXG4gICAgICovXG4gICAgcHJpdmF0ZSBza2lwWG1wcENsaWVudFJlc3BvbnNlcyhzdGFuemE6IFN0YW56YSkge1xuICAgICAgICBjb25zdCB4bXBwQmluZE5TID0gJ3VybjppZXRmOnBhcmFtczp4bWw6bnM6eG1wcC1iaW5kJztcbiAgICAgICAgcmV0dXJuIHN0YW56YS5nZXRDaGlsZCgnYmluZCcpPy5nZXROUygpID09PSB4bXBwQmluZE5TO1xuICAgIH1cblxuICAgIGFzeW5jIGxvZ091dCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgLy8gVE9ETzogbW92ZSB0aGlzIHRvIGEgcHJlc2VuY2UgcGx1Z2luIGluIGEgaGFuZGxlclxuICAgICAgICB0aGlzLmxvZ1NlcnZpY2UuZGVidWcoJ2xvZ2dpbmcgb3V0Jyk7XG4gICAgICAgIGlmICh0aGlzLmNsaWVudCkge1xuICAgICAgICAgICAgdGhpcy5jbGllbnQucmVjb25uZWN0LnN0b3AoKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5zZW5kKHhtbCgncHJlc2VuY2UnLCB7dHlwZTogJ3VuYXZhaWxhYmxlJ30pKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ1NlcnZpY2UuZXJyb3IoJ2Vycm9yIHNlbmRpbmcgcHJlc2VuY2UgdW5hdmFpbGFibGUnKTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGllbnQuc3RvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0TmV4dFJlcXVlc3RJZCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gU3RyaW5nKHRoaXMucmVxdWVzdElkKyspO1xuICAgIH1cblxuICAgIHJlY29ubmVjdFNpbGVudGx5KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmxvZ1NlcnZpY2Uud2FybignaGFyZCByZWNvbm5lY3QuLi4nKTtcbiAgICAgICAgdGhpcy5zdGF0ZSQubmV4dCgnZGlzY29ubmVjdGVkJyk7XG4gICAgfVxufVxuIl19