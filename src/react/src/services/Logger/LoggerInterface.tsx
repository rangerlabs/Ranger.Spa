export interface LoggerInterface {
    Debug(message: string, ...data: any[]): void;
    Warn(message: string, ...data: any[]): void;
    Error(message: string, ...data: any[]): void;
    Info(message: string, ...data: any[]): void;
}
