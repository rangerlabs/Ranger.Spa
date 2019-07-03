import { LoggerInterface } from "./LoggerInterface";

export default class Logger implements LoggerInterface {
    public Debug(error: string, data: any[]): void {
        console.log("Error: " + error);
    }

    public Warn(error: string, data: any[]): void {
        console.log("Error: " + error);
    }

    public Error(error: string, data: any[]): void {
        console.log("Error: " + error);
    }

    public Info(error: string, data: any[]): void {
        console.log("Error: " + error);
    }
}
