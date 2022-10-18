import { InjectionToken } from '@angular/core';
import { Contact } from '../core/contact';
/**
 * Optional injectable token to handle contact reports in the chat
 */
export declare const REPORT_USER_INJECTION_TOKEN: InjectionToken<ReportUserService>;
export interface ReportUserService {
    reportUser(user: Contact): void;
}
