import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * Used to determine if a message component for a given recipient is open.
 */
export class ChatMessageListRegistryService {
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
ChatMessageListRegistryService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.6", ngImport: i0, type: ChatMessageListRegistryService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ChatMessageListRegistryService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.6", ngImport: i0, type: ChatMessageListRegistryService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.6", ngImport: i0, type: ChatMessageListRegistryService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC1tZXNzYWdlLWxpc3QtcmVnaXN0cnkuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvc2VydmljZXMvY2hhdC1tZXNzYWdlLWxpc3QtcmVnaXN0cnkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxlQUFlLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDOztBQUdoRDs7R0FFRztBQUVILE1BQU0sT0FBTyw4QkFBOEI7SUFNdkM7UUFKTyxlQUFVLEdBQUcsSUFBSSxlQUFlLENBQWlCLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM1RCxnQkFBVyxHQUFHLElBQUksT0FBTyxFQUFhLENBQUM7UUFDdEMsb0NBQStCLEdBQUcsSUFBSSxHQUFHLEVBQXFCLENBQUM7SUFHdkUsQ0FBQztJQUVELFVBQVUsQ0FBQyxTQUFvQjtRQUMzQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsd0JBQXdCLENBQUMsU0FBb0I7UUFDekMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsK0JBQStCLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6RixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2pELGFBQWEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNoQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNwQztJQUNMLENBQUM7SUFFRCx3QkFBd0IsQ0FBQyxTQUFvQjtRQUN6QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckQsSUFBSSxRQUFRLElBQUksQ0FBQyxFQUFFO1lBQ2YsSUFBSSxDQUFDLCtCQUErQixDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNqRCxhQUFhLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ3ZDO2FBQU07WUFDSCxJQUFJLENBQUMsK0JBQStCLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUNqRTtJQUNMLENBQUM7SUFFTyxZQUFZLENBQUMsU0FBb0IsRUFBRSxZQUFvQjtRQUMzRCxPQUFPLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksWUFBWSxDQUFDO0lBQy9FLENBQUM7OzJIQXRDUSw4QkFBOEI7K0hBQTlCLDhCQUE4QjsyRkFBOUIsOEJBQThCO2tCQUQxQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBSZWNpcGllbnQgfSBmcm9tICcuLi9jb3JlL3JlY2lwaWVudCc7XG5cbi8qKlxuICogVXNlZCB0byBkZXRlcm1pbmUgaWYgYSBtZXNzYWdlIGNvbXBvbmVudCBmb3IgYSBnaXZlbiByZWNpcGllbnQgaXMgb3Blbi5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENoYXRNZXNzYWdlTGlzdFJlZ2lzdHJ5U2VydmljZSB7XG5cbiAgICBwdWJsaWMgb3BlbkNoYXRzJCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8U2V0PFJlY2lwaWVudD4+KG5ldyBTZXQoKSk7XG4gICAgcHVibGljIGNoYXRPcGVuZWQkID0gbmV3IFN1YmplY3Q8UmVjaXBpZW50PigpO1xuICAgIHByaXZhdGUgcmVjaXBpZW50VG9PcGVuTWVzc2FnZUxpc3RDb3VudCA9IG5ldyBNYXA8UmVjaXBpZW50LCBudW1iZXI+KCk7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBpc0NoYXRPcGVuKHJlY2lwaWVudDogUmVjaXBpZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldE9yRGVmYXVsdChyZWNpcGllbnQsIDApID4gMDtcbiAgICB9XG5cbiAgICBpbmNyZW1lbnRPcGVuV2luZG93Q291bnQocmVjaXBpZW50OiBSZWNpcGllbnQpIHtcbiAgICAgICAgY29uc3Qgd2FzV2luZG93T3BlbiA9IHRoaXMuaXNDaGF0T3BlbihyZWNpcGllbnQpO1xuICAgICAgICB0aGlzLnJlY2lwaWVudFRvT3Blbk1lc3NhZ2VMaXN0Q291bnQuc2V0KHJlY2lwaWVudCwgdGhpcy5nZXRPckRlZmF1bHQocmVjaXBpZW50LCAwKSArIDEpO1xuICAgICAgICBjb25zdCBvcGVuV2luZG93U2V0ID0gdGhpcy5vcGVuQ2hhdHMkLmdldFZhbHVlKCk7XG4gICAgICAgIG9wZW5XaW5kb3dTZXQuYWRkKHJlY2lwaWVudCk7XG4gICAgICAgIHRoaXMub3BlbkNoYXRzJC5uZXh0KG9wZW5XaW5kb3dTZXQpO1xuICAgICAgICBpZiAoIXdhc1dpbmRvd09wZW4pIHtcbiAgICAgICAgICAgIHRoaXMuY2hhdE9wZW5lZCQubmV4dChyZWNpcGllbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVjcmVtZW50T3BlbldpbmRvd0NvdW50KHJlY2lwaWVudDogUmVjaXBpZW50KSB7XG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gdGhpcy5nZXRPckRlZmF1bHQocmVjaXBpZW50LCAwKSAtIDE7XG4gICAgICAgIGlmIChuZXdWYWx1ZSA8PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnJlY2lwaWVudFRvT3Blbk1lc3NhZ2VMaXN0Q291bnQuc2V0KHJlY2lwaWVudCwgMCk7XG4gICAgICAgICAgICBjb25zdCBvcGVuV2luZG93U2V0ID0gdGhpcy5vcGVuQ2hhdHMkLmdldFZhbHVlKCk7XG4gICAgICAgICAgICBvcGVuV2luZG93U2V0LmRlbGV0ZShyZWNpcGllbnQpO1xuICAgICAgICAgICAgdGhpcy5vcGVuQ2hhdHMkLm5leHQob3BlbldpbmRvd1NldCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlY2lwaWVudFRvT3Blbk1lc3NhZ2VMaXN0Q291bnQuc2V0KHJlY2lwaWVudCwgbmV3VmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRPckRlZmF1bHQocmVjaXBpZW50OiBSZWNpcGllbnQsIGRlZmF1bHRWYWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlY2lwaWVudFRvT3Blbk1lc3NhZ2VMaXN0Q291bnQuZ2V0KHJlY2lwaWVudCkgfHwgZGVmYXVsdFZhbHVlO1xuICAgIH1cblxufVxuIl19