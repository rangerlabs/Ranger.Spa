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
        this.sunday = this.IsoDailyToLocalTimeDailySchedule(this.sunday);
        this.monday = this.IsoDailyToLocalTimeDailySchedule(this.monday);
        this.tuesday = this.IsoDailyToLocalTimeDailySchedule(this.tuesday);
        this.wednesday = this.IsoDailyToLocalTimeDailySchedule(this.wednesday);
        this.thursday = this.IsoDailyToLocalTimeDailySchedule(this.thursday);
        this.friday = this.IsoDailyToLocalTimeDailySchedule(this.friday);
        this.saturday = this.IsoDailyToLocalTimeDailySchedule(this.saturday);
        return this;
    }

    public ToIsoSchedule(): Schedule {
        this.sunday = Schedule.LocalTimeDailyScheduleToIsoDaily(this.sunday);
        this.monday = Schedule.LocalTimeDailyScheduleToIsoDaily(this.monday);
        this.tuesday = Schedule.LocalTimeDailyScheduleToIsoDaily(this.tuesday);
        this.wednesday = Schedule.LocalTimeDailyScheduleToIsoDaily(this.wednesday);
        this.thursday = Schedule.LocalTimeDailyScheduleToIsoDaily(this.thursday);
        this.friday = Schedule.LocalTimeDailyScheduleToIsoDaily(this.friday);
        this.saturday = Schedule.LocalTimeDailyScheduleToIsoDaily(this.saturday);
        return this;
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
        const startTime = moment(localTimeDailySchedule.startTime, 'HH:mm:ss.SSS');
        const endTime = moment(localTimeDailySchedule.endTime, 'HH:mm:ss.SSS');
        return new IsoDailySchedule(startTime, endTime);
    }

    private toLocalTimeString(date: Date) {
        return format(date, 'HH:mm:ss.SSS');
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
