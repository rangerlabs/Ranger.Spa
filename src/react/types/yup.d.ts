// Add custom yup validation for time inputs that are used by 'MUI pickers'
// Specifically for the scheduling component
import { DateSchema, DateSchemaConstructor } from 'yup';
declare module 'yup' {
    interface DateSchema {
        timeGreaterThan(): DateSchema;
    }
}
export const date: DateSchemaConstructor;
