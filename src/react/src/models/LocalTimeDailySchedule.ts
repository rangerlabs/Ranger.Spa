import IDailySchedule from './IDailySchedule';

export default class LocalTimeDailySchedule implements IDailySchedule {
    public constructor(public startTime: string, public endTime: string) {}
}
