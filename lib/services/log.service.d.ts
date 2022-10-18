import * as i0 from "@angular/core";
export declare enum LogLevel {
    Disabled = 0,
    Error = 1,
    Warn = 2,
    Info = 3,
    Debug = 4
}
export declare class LogService {
    logLevel: LogLevel;
    writer: Console;
    messagePrefix: () => string;
    error(...messages: any[]): void;
    warn(...messages: any[]): void;
    info(...messages: any[]): void;
    debug(...messages: any[]): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<LogService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LogService>;
}
