import { Directive, EventEmitter, Output } from '@angular/core';
import * as i0 from "@angular/core";
export class IntersectionObserverDirective {
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
IntersectionObserverDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: IntersectionObserverDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
IntersectionObserverDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.9", type: IntersectionObserverDirective, selector: "[ngxChatIntersectionObserver]", outputs: { ngxChatIntersectionObserver: "ngxChatIntersectionObserver" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: IntersectionObserverDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngxChatIntersectionObserver]',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { ngxChatIntersectionObserver: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJzZWN0aW9uLW9ic2VydmVyLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvZGlyZWN0aXZlcy9pbnRlcnNlY3Rpb24tb2JzZXJ2ZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWMsWUFBWSxFQUFhLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFLdkYsTUFBTSxPQUFPLDZCQUE2QjtJQU90QyxZQUFvQixFQUFjO1FBQWQsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUpsQyxnQ0FBMkIsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBSzdDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLG9CQUFvQixDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDN0QsSUFBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RCxDQUFDLEVBQUU7WUFDQywwRkFBMEY7WUFDMUYsb0dBQW9HO1lBQ3BHLFVBQVUsRUFBRSxxQkFBcUI7U0FDcEMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsb0JBQW9CLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDM0MsQ0FBQzs7MEhBcEJRLDZCQUE2Qjs4R0FBN0IsNkJBQTZCOzJGQUE3Qiw2QkFBNkI7a0JBSHpDLFNBQVM7bUJBQUM7b0JBQ1AsUUFBUSxFQUFFLCtCQUErQjtpQkFDNUM7aUdBSUcsMkJBQTJCO3NCQUQxQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW25neENoYXRJbnRlcnNlY3Rpb25PYnNlcnZlcl0nLFxufSlcbmV4cG9ydCBjbGFzcyBJbnRlcnNlY3Rpb25PYnNlcnZlckRpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG5cbiAgICBAT3V0cHV0KClcbiAgICBuZ3hDaGF0SW50ZXJzZWN0aW9uT2JzZXJ2ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBwcml2YXRlIGludGVyc2VjdGlvbk9ic2VydmVyOiBJbnRlcnNlY3Rpb25PYnNlcnZlcjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWw6IEVsZW1lbnRSZWYpIHtcbiAgICAgICAgdGhpcy5pbnRlcnNlY3Rpb25PYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcigoZW50cmllcykgPT4ge1xuICAgICAgICAgICAgdGhpcy5uZ3hDaGF0SW50ZXJzZWN0aW9uT2JzZXJ2ZXIuZW1pdChlbnRyaWVzWzBdKTtcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgLy8gZXZlbiBpZiB1c2VyIGlzIG5vdCBwaXhlbC1wZXJmZWN0IGF0IHRoZSBib3R0b20gb2YgYSBjaGF0IG1lc3NhZ2UgbGlzdCB3ZSBzdGlsbCB3YW50IHRvXG4gICAgICAgICAgICAvLyByZWFjdCB0byBuZXcgbWVzc2FnZXMsIGhlbmNlIHdlIGhhdmUgYSBidWZmZXIgb2YgMTUwcHggYXJvdW5kIHRoZSBib3R0b20gb2YgdGhlIGNoYXQgbWVzc2FnZSBsaXN0XG4gICAgICAgICAgICByb290TWFyZ2luOiAnMTUwcHggMHB4IDE1MHB4IDBweCcsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmludGVyc2VjdGlvbk9ic2VydmVyLm9ic2VydmUoZWwubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW50ZXJzZWN0aW9uT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgIH1cblxufVxuIl19