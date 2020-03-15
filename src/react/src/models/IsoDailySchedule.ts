import IDailySchedule from './IDailySchedule';

export default class IsoDailySchedule implements IDailySchedule {
    public constructor(startTime: Date, endTime: Date) {
        this.startTime = startTime.toISOString();
        this.endTime = endTime.toISOString();
    }
    public startTime: string;
    public endTime: string;
}
