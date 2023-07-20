import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
export class FileDropComponent {
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
FileDropComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: FileDropComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
FileDropComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.9", type: FileDropComponent, selector: "ngx-chat-filedrop", inputs: { dropMessage: "dropMessage", enabled: "enabled" }, outputs: { fileUpload: "fileUpload" }, host: { listeners: { "dragover": "onDragOver($event)", "dragenter": "onDragOver($event)", "dragleave": "onDragLeave($event)", "dragexit": "onDragLeave($event)", "drop": "onDrop($event)" } }, ngImport: i0, template: "<div>\n    <div class=\"drop-message\"\n         [class.drop-message--visible]=\"isDropTarget\">\n        {{dropMessage}}\n    </div>\n    <div>\n        <ng-content></ng-content>\n    </div>\n</div>\n", styles: [".drop-message{pointer-events:none;display:none}.drop-message--visible{position:absolute;inset:0;display:flex;justify-content:center;align-content:center;flex-direction:column;text-align:center;font-size:1.5em;z-index:999;background-color:#fff9;padding:1em}\n"] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.9", ngImport: i0, type: FileDropComponent, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1kcm9wLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9jaGF0LWZpbGVkcm9wL2ZpbGUtZHJvcC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2NvbXBvbmVudHMvY2hhdC1maWxlZHJvcC9maWxlLWRyb3AuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBT3JGLE1BQU0sT0FBTyxpQkFBaUI7SUFMOUI7UUFRYSxlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQU0vQyxZQUFPLEdBQUcsSUFBSSxDQUFDO1FBRWYsaUJBQVksR0FBRyxLQUFLLENBQUM7S0FzQ3hCO0lBbENHLFVBQVUsQ0FBQyxLQUFVO1FBQ2pCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7U0FDNUI7SUFDTCxDQUFDO0lBSUQsV0FBVyxDQUFDLEtBQVU7UUFDbEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3ZCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztJQUM5QixDQUFDO0lBR0QsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFVO1FBQ25CLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7WUFFeEIsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7WUFFMUIseUNBQXlDO1lBQ3pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3RELE1BQU0sZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JELElBQUksZ0JBQWdCLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtvQkFDbEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztpQkFDdEQ7YUFDSjtTQUNKO0lBQ0wsQ0FBQzs7OEdBL0NRLGlCQUFpQjtrR0FBakIsaUJBQWlCLDJWQ1A5QiwyTUFTQTsyRkRGYSxpQkFBaUI7a0JBTDdCLFNBQVM7K0JBQ0ksbUJBQW1COzhCQU9wQixVQUFVO3NCQURsQixNQUFNO2dCQUlQLFdBQVc7c0JBRFYsS0FBSztnQkFJTixPQUFPO3NCQUROLEtBQUs7Z0JBT04sVUFBVTtzQkFGVCxZQUFZO3VCQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7c0JBQ25DLFlBQVk7dUJBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQVdyQyxXQUFXO3NCQUZWLFlBQVk7dUJBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDOztzQkFDcEMsWUFBWTt1QkFBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBUTlCLE1BQU07c0JBRFgsWUFBWTt1QkFBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyLCBJbnB1dCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnbmd4LWNoYXQtZmlsZWRyb3AnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9maWxlLWRyb3AuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogWycuL2ZpbGUtZHJvcC5jb21wb25lbnQubGVzcyddLFxufSlcbmV4cG9ydCBjbGFzcyBGaWxlRHJvcENvbXBvbmVudCB7XG5cbiAgICBAT3V0cHV0KClcbiAgICByZWFkb25seSBmaWxlVXBsb2FkID0gbmV3IEV2ZW50RW1pdHRlcjxGaWxlPigpO1xuXG4gICAgQElucHV0KClcbiAgICBkcm9wTWVzc2FnZTogc3RyaW5nO1xuXG4gICAgQElucHV0KClcbiAgICBlbmFibGVkID0gdHJ1ZTtcblxuICAgIGlzRHJvcFRhcmdldCA9IGZhbHNlO1xuXG4gICAgQEhvc3RMaXN0ZW5lcignZHJhZ292ZXInLCBbJyRldmVudCddKVxuICAgIEBIb3N0TGlzdGVuZXIoJ2RyYWdlbnRlcicsIFsnJGV2ZW50J10pXG4gICAgb25EcmFnT3ZlcihldmVudDogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLmVuYWJsZWQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHRoaXMuaXNEcm9wVGFyZ2V0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIFsnJGV2ZW50J10pXG4gICAgQEhvc3RMaXN0ZW5lcignZHJhZ2V4aXQnLCBbJyRldmVudCddKVxuICAgIG9uRHJhZ0xlYXZlKGV2ZW50OiBhbnkpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHRoaXMuaXNEcm9wVGFyZ2V0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignZHJvcCcsIFsnJGV2ZW50J10pXG4gICAgYXN5bmMgb25Ecm9wKGV2ZW50OiBhbnkpIHtcbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlZCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICAgICB0aGlzLmlzRHJvcFRhcmdldCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJlZmVyLWZvci1vZlxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudC5kYXRhVHJhbnNmZXIuaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhVHJhbnNmZXJJdGVtID0gZXZlbnQuZGF0YVRyYW5zZmVyLml0ZW1zW2ldO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhVHJhbnNmZXJJdGVtLmtpbmQgPT09ICdmaWxlJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbGVVcGxvYWQuZW1pdChkYXRhVHJhbnNmZXJJdGVtLmdldEFzRmlsZSgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiIsIjxkaXY+XG4gICAgPGRpdiBjbGFzcz1cImRyb3AtbWVzc2FnZVwiXG4gICAgICAgICBbY2xhc3MuZHJvcC1tZXNzYWdlLS12aXNpYmxlXT1cImlzRHJvcFRhcmdldFwiPlxuICAgICAgICB7e2Ryb3BNZXNzYWdlfX1cbiAgICA8L2Rpdj5cbiAgICA8ZGl2PlxuICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPC9kaXY+XG48L2Rpdj5cbiJdfQ==