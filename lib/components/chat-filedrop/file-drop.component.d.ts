import { EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export declare class FileDropComponent {
    readonly fileUpload: EventEmitter<File>;
    dropMessage: string;
    enabled: boolean;
    isDropTarget: boolean;
    onDragOver(event: any): void;
    onDragLeave(event: any): void;
    onDrop(event: any): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<FileDropComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FileDropComponent, "ngx-chat-filedrop", never, { "dropMessage": "dropMessage"; "enabled": "enabled"; }, { "fileUpload": "fileUpload"; }, never, ["*"], false>;
}
