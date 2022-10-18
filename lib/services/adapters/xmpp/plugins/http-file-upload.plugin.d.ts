import { HttpClient } from '@angular/common/http';
import { LogService } from '../../../log.service';
import { XmppChatAdapter } from '../xmpp-chat-adapter.service';
import { AbstractXmppPlugin } from './abstract-xmpp-plugin';
import { ServiceDiscoveryPlugin } from './service-discovery.plugin';
import { FileUploadHandler } from '../../../../hooks/file-upload-handler';
/**
 * XEP-0363 http file upload
 */
export declare class HttpFileUploadPlugin extends AbstractXmppPlugin implements FileUploadHandler {
    private readonly httpClient;
    private readonly serviceDiscoveryPlugin;
    private readonly xmppChatAdapter;
    private readonly logService;
    private fileUploadSupported;
    private uploadService;
    constructor(httpClient: HttpClient, serviceDiscoveryPlugin: ServiceDiscoveryPlugin, xmppChatAdapter: XmppChatAdapter, logService: LogService);
    onBeforeOnline(): Promise<void>;
    onOffline(): void;
    upload(file: File): Promise<string>;
    isUploadSupported(): boolean;
    private requestSlot;
    private uploadToSlot;
}
