import DailySchedule from './DailySchedule';

export default class Schedule {
    public constructor(
        public Sunday: DailySchedule,
        public Monday: DailySchedule,
        public Tuesday: DailySchedule,
        public Wednesday: DailySchedule,
        public Thursday: DailySchedule,
        public Friday: DailySchedule,
        public Saturday: DailySchedule
    ) {}

    public static FullDay(): DailySchedule {
        return new DailySchedule('', '');
    }

    public static FullSchedule(): Schedule {
        return new Schedule(
            Schedule.FullDay(),
            Schedule.FullDay(),
            Schedule.FullDay(),
            Schedule.FullDay(),
            Schedule.FullDay(),
            Schedule.FullDay(),
            Schedule.FullDay()
        );
    }
}
