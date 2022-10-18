export declare class TimeoutError extends Error {
    constructor(message?: string);
}
export declare function delay(ms: number): Promise<unknown>;
export declare function timeout(promise: Promise<any>, ms: number): Promise<any>;
