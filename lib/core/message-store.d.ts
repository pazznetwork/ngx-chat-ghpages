import { Subject } from 'rxjs';
import { LogService } from '../services/log.service';
import { Message } from './message';
export interface DateMessagesGroup<T extends Message> {
    /** is equal to the date where one message on that date was received */
    date: Date;
    messages: T[];
}
export declare class MessageStore<T extends Message> {
    private readonly logService?;
    readonly messages$: Subject<T>;
    readonly messages: T[];
    readonly dateMessageGroups: DateMessagesGroup<T>[];
    readonly messageIdToMessage: Map<string, T>;
    constructor(logService?: LogService);
    addMessage(message: T): boolean;
    get oldestMessage(): T | undefined;
    get mostRecentMessage(): T | undefined;
    get mostRecentMessageReceived(): T | undefined;
    get mostRecentMessageSent(): T | undefined;
    private addToDateMessageGroups;
}
