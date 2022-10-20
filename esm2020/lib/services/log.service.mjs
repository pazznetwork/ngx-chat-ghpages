import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Disabled"] = 0] = "Disabled";
    LogLevel[LogLevel["Error"] = 1] = "Error";
    LogLevel[LogLevel["Warn"] = 2] = "Warn";
    LogLevel[LogLevel["Info"] = 3] = "Info";
    LogLevel[LogLevel["Debug"] = 4] = "Debug";
})(LogLevel || (LogLevel = {}));
export class LogService {
    constructor() {
        this.logLevel = LogLevel.Info;
        this.writer = console;
        this.messagePrefix = () => 'ChatService:';
    }
    error(...messages) {
        if (this.logLevel >= LogLevel.Error) {
            this.writer.error(this.messagePrefix(), ...messages);
        }
    }
    warn(...messages) {
        if (this.logLevel >= LogLevel.Warn) {
            this.writer.warn(this.messagePrefix(), ...messages);
        }
    }
    info(...messages) {
        if (this.logLevel >= LogLevel.Info) {
            this.writer.info(this.messagePrefix(), ...messages);
        }
    }
    debug(...messages) {
        if (this.logLevel >= LogLevel.Debug) {
            this.writer.debug(this.messagePrefix(), ...messages);
        }
    }
}
LogService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: LogService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
LogService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: LogService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.7", ngImport: i0, type: LogService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL3NlcnZpY2VzL2xvZy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBRTNDLE1BQU0sQ0FBTixJQUFZLFFBTVg7QUFORCxXQUFZLFFBQVE7SUFDaEIsK0NBQVksQ0FBQTtJQUNaLHlDQUFLLENBQUE7SUFDTCx1Q0FBSSxDQUFBO0lBQ0osdUNBQUksQ0FBQTtJQUNKLHlDQUFLLENBQUE7QUFDVCxDQUFDLEVBTlcsUUFBUSxLQUFSLFFBQVEsUUFNbkI7QUFHRCxNQUFNLE9BQU8sVUFBVTtJQUR2QjtRQUdXLGFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pCLFdBQU0sR0FBRyxPQUFPLENBQUM7UUFDakIsa0JBQWEsR0FBRyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUM7S0EwQi9DO0lBeEJVLEtBQUssQ0FBQyxHQUFHLFFBQWU7UUFDM0IsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxLQUFLLEVBQUU7WUFDakMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUM7U0FDeEQ7SUFDTCxDQUFDO0lBRU0sSUFBSSxDQUFDLEdBQUcsUUFBZTtRQUMxQixJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLElBQUksRUFBRTtZQUNoQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQztTQUN2RDtJQUNMLENBQUM7SUFFTSxJQUFJLENBQUMsR0FBRyxRQUFlO1FBQzFCLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFDO1NBQ3ZEO0lBQ0wsQ0FBQztJQUVNLEtBQUssQ0FBQyxHQUFHLFFBQWU7UUFDM0IsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxLQUFLLEVBQUU7WUFDakMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUM7U0FDeEQ7SUFDTCxDQUFDOzt1R0E1QlEsVUFBVTsyR0FBVixVQUFVOzJGQUFWLFVBQVU7a0JBRHRCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCBlbnVtIExvZ0xldmVsIHtcbiAgICBEaXNhYmxlZCA9IDAsXG4gICAgRXJyb3IsXG4gICAgV2FybixcbiAgICBJbmZvLFxuICAgIERlYnVnLFxufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTG9nU2VydmljZSB7XG5cbiAgICBwdWJsaWMgbG9nTGV2ZWwgPSBMb2dMZXZlbC5JbmZvO1xuICAgIHB1YmxpYyB3cml0ZXIgPSBjb25zb2xlO1xuICAgIHB1YmxpYyBtZXNzYWdlUHJlZml4ID0gKCkgPT4gJ0NoYXRTZXJ2aWNlOic7XG5cbiAgICBwdWJsaWMgZXJyb3IoLi4ubWVzc2FnZXM6IGFueVtdKSB7XG4gICAgICAgIGlmICh0aGlzLmxvZ0xldmVsID49IExvZ0xldmVsLkVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLndyaXRlci5lcnJvcih0aGlzLm1lc3NhZ2VQcmVmaXgoKSwgLi4ubWVzc2FnZXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHdhcm4oLi4ubWVzc2FnZXM6IGFueVtdKSB7XG4gICAgICAgIGlmICh0aGlzLmxvZ0xldmVsID49IExvZ0xldmVsLldhcm4pIHtcbiAgICAgICAgICAgIHRoaXMud3JpdGVyLndhcm4odGhpcy5tZXNzYWdlUHJlZml4KCksIC4uLm1lc3NhZ2VzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBpbmZvKC4uLm1lc3NhZ2VzOiBhbnlbXSkge1xuICAgICAgICBpZiAodGhpcy5sb2dMZXZlbCA+PSBMb2dMZXZlbC5JbmZvKSB7XG4gICAgICAgICAgICB0aGlzLndyaXRlci5pbmZvKHRoaXMubWVzc2FnZVByZWZpeCgpLCAuLi5tZXNzYWdlcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZGVidWcoLi4ubWVzc2FnZXM6IGFueVtdKSB7XG4gICAgICAgIGlmICh0aGlzLmxvZ0xldmVsID49IExvZ0xldmVsLkRlYnVnKSB7XG4gICAgICAgICAgICB0aGlzLndyaXRlci5kZWJ1Zyh0aGlzLm1lc3NhZ2VQcmVmaXgoKSwgLi4ubWVzc2FnZXMpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iXX0=