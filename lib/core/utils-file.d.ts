export interface SelectFileParameters {
    accept?: string;
    multiple?: boolean;
}
export declare function selectFile(params?: SelectFileParameters): Promise<FileList>;
