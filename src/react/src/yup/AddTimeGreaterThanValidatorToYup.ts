import * as Yup from 'yup';
import { isValid } from 'date-fns';

const invalidMsg = 'End time must be greater than Start time';

export default function AddTimeGreaterThanValidatorToYup() {
    Yup.addMethod<Yup.DateSchema>(Yup.date, 'timeGreaterThan', function () {
        const message = invalidMsg;
        return this.test('timeFormat', message, function (value) {
            const start = this.parent['startTime'];
            if (isValid(start) && isValid(value)) {
                if (value.getTime() >= start.getTime()) {
                    return true;
                } else {
                    return this.createError({ path: this.path, message });
                }
            } else {
                return true; //validation cannot be completed
            }
        });
    });
}
