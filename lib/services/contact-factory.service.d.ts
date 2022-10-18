import { Contact } from '../core/contact';
import { LogService } from './log.service';
import * as i0 from "@angular/core";
export declare class ContactFactoryService {
    private logService;
    constructor(logService: LogService);
    createContact(jidPlain: string, name?: string, avatar?: string): Contact;
    static ɵfac: i0.ɵɵFactoryDeclaration<ContactFactoryService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ContactFactoryService>;
}
