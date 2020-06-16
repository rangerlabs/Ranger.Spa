import IsoDailySchedule from './IsoDailySchedule';
import { endOfToday, startOfToday, parseISO, format, parse } from 'date-fns';
import IDailySchedule from './IDailySchedule';
import LocalTimeDailySchedule from './LocalTimeDailySchedule';
import { AssertionError } from 'assert';
var deepEqual = require('deep-equal');
var moment = require('moment-timezone');

export default class Schedule {
    public constructor(
        public timeZoneId: string,
        public sunday: IDailySchedule,
        public monday: IDailySchedule,
        public tuesday: IDailySchedule,
        public wednesday: IDailySchedule,
        public thursday: IDailySchedule,
        public friday: IDailySchedule,
        public saturday: IDailySchedule
    ) {}

    public static FullDay(): IsoDailySchedule {
        return new IsoDailySchedule(startOfToday(), endOfToday());
    }

    public ToLocalTimeSchedule(): Schedule {
        return new Schedule(
            this.timeZoneId,
            this.IsoDailyToLocalTimeDailySchedule(this.sunday),
            this.IsoDailyToLocalTimeDailySchedule(this.monday),
            this.IsoDailyToLocalTimeDailySchedule(this.tuesday),
            this.IsoDailyToLocalTimeDailySchedule(this.wednesday),
            this.IsoDailyToLocalTimeDailySchedule(this.thursday),
            this.IsoDailyToLocalTimeDailySchedule(this.friday),
            this.IsoDailyToLocalTimeDailySchedule(this.saturday)
        );
    }

    public static CreateIsoScheduleFromResponse(response: Object): Schedule {
        Schedule.assertIsSchedule(response);
        return new Schedule(
            response.timeZoneId,
            this.LocalTimeDailyScheduleToIsoDaily(response.sunday),
            this.LocalTimeDailyScheduleToIsoDaily(response.monday),
            this.LocalTimeDailyScheduleToIsoDaily(response.tuesday),
            this.LocalTimeDailyScheduleToIsoDaily(response.wednesday),
            this.LocalTimeDailyScheduleToIsoDaily(response.thursday),
            this.LocalTimeDailyScheduleToIsoDaily(response.friday),
            this.LocalTimeDailyScheduleToIsoDaily(response.saturday)
        );
    }

    private IsoDailyToLocalTimeDailySchedule(isoDailySchedule: IsoDailySchedule): LocalTimeDailySchedule {
        return new LocalTimeDailySchedule(
            this.toLocalTimeString(parseISO(isoDailySchedule.startTime)),
            this.toLocalTimeString(parseISO(isoDailySchedule.endTime))
        );
    }

    private static assertIsSchedule(object: any): asserts object is Schedule {
        if (!(object as Schedule).timeZoneId) {
            throw new AssertionError({ message: 'Value not a valid schedule!' });
        }
    }

    private static LocalTimeDailyScheduleToIsoDaily(localTimeDailySchedule: LocalTimeDailySchedule): IsoDailySchedule {
        const startTime = moment(localTimeDailySchedule.startTime, 'HH:mm:ss');
        const endTime = moment(localTimeDailySchedule.endTime, 'HH:mm:ss');
        return new IsoDailySchedule(startTime, endTime);
    }

    private toLocalTimeString(date: Date) {
        return format(date, 'HH:mm:ss');
    }

    public static FullUtcSchedule(): Schedule {
        return Schedule.fullSchedule;
    }

    public static IsFullUtcSchedule(schedule: Schedule): boolean {
        return deepEqual(schedule, Schedule.FullUtcSchedule());
    }

    private static fullSchedule = new Schedule(
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
