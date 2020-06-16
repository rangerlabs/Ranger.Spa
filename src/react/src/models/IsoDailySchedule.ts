import IDailySchedule from './IDailySchedule';
import { formatISO } from 'date-fns';

export default class IsoDailySchedule implements IDailySchedule {
    public constructor(startTime: Date, endTime: Date) {
        this.startTime = formatISO(startTime);
        this.endTime = formatISO(endTime);
    }
    public startTime: string;
    public endTime: string;
}
