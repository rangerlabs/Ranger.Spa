export default class DailySchedule {
    public constructor(startTime: Date, endTime: Date) {
        this.startTime = startTime.toISOString();
        this.endTime = endTime.toISOString();
    }
    public startTime: string;
    public endTime: string;
}
