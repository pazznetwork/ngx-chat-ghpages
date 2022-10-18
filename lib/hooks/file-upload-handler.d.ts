import { InjectionToken } from '@angular/core';
/**
 * Optional injectable token to handle file uploads in the chat.
 */
export declare const FILE_UPLOAD_HANDLER_TOKEN: InjectionToken<FileUploadHandler>;
export interface FileUploadHandler {
    /**
     * @return {string} Returns the public URL of the uploaded file.
     */
    upload(file: File): Promise<string>;
    isUploadSupported(): boolean;
}
