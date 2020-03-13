import DailySchedule from './DailySchedule';
import { endOfToday, startOfToday } from 'date-fns';
var deepEqual = require('deep-equal');

export default class Schedule {
    public constructor(
        public TimeZoneId: string,
        public Sunday: DailySchedule,
        public Monday: DailySchedule,
        public Tuesday: DailySchedule,
        public Wednesday: DailySchedule,
        public Thursday: DailySchedule,
        public Friday: DailySchedule,
        public Saturday: DailySchedule
    ) {}

    public static FullDay(): DailySchedule {
        return new DailySchedule(startOfToday(), endOfToday());
    }

    public static FullUtcSchedule(): Schedule {
        return new Schedule(
            'UTC',
            Schedule.FullDay(),
            Schedule.FullDay(),
            Schedule.FullDay(),
            Schedule.FullDay(),
            Schedule.FullDay(),
            Schedule.FullDay(),
            Schedule.FullDay()
        );
    }

    public static IsFullUtcSchedule(schedule: Schedule): boolean {
        return deepEqual(schedule, Schedule.FullUtcSchedule());
    }
}
