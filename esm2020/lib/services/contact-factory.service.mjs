import { Injectable } from '@angular/core';
import { Contact } from '../core/contact';
import * as i0 from "@angular/core";
import * as i1 from "./log.service";
export class ContactFactoryService {
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
ContactFactoryService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: ContactFactoryService, deps: [{ token: i1.LogService }], target: i0.ɵɵFactoryTarget.Injectable });
ContactFactoryService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: ContactFactoryService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: ContactFactoryService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.LogService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFjdC1mYWN0b3J5LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL3NlcnZpY2VzL2NvbnRhY3QtZmFjdG9yeS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGlCQUFpQixDQUFDOzs7QUFJMUMsTUFBTSxPQUFPLHFCQUFxQjtJQUU5QixZQUFvQixVQUFzQjtRQUF0QixlQUFVLEdBQVYsVUFBVSxDQUFZO0lBQUksQ0FBQztJQUUvQyxhQUFhLENBQUMsUUFBZ0IsRUFDaEIsSUFBYSxFQUNiLE1BQWU7UUFDekIsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNQLElBQUksR0FBRyxRQUFRLENBQUM7U0FDbkI7UUFDRCxPQUFPLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNoRSxDQUFDOztrSEFYUSxxQkFBcUI7c0hBQXJCLHFCQUFxQjsyRkFBckIscUJBQXFCO2tCQURqQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udGFjdCB9IGZyb20gJy4uL2NvcmUvY29udGFjdCc7XG5pbXBvcnQgeyBMb2dTZXJ2aWNlIH0gZnJvbSAnLi9sb2cuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb250YWN0RmFjdG9yeVNlcnZpY2Uge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBsb2dTZXJ2aWNlOiBMb2dTZXJ2aWNlKSB7IH1cblxuICAgIGNyZWF0ZUNvbnRhY3QoamlkUGxhaW46IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgIG5hbWU/OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICBhdmF0YXI/OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgICAgICBuYW1lID0gamlkUGxhaW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBDb250YWN0KGppZFBsYWluLCBuYW1lLCB0aGlzLmxvZ1NlcnZpY2UsIGF2YXRhcik7XG4gICAgfVxuXG59XG4iXX0=