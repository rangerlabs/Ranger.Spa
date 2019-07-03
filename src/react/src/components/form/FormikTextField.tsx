import * as React from "react";
import { FormikTouched, FormikErrors } from "formik";
import { TextField } from "@material-ui/core";
import { TextFieldProps } from "@material-ui/core/TextField";

interface FormikTextFieldProps {
    name: string;
    label: string;
    errorText: string | FormikErrors<any>;
    touched: boolean | FormikTouched<any>;
    onBlur(e: React.FocusEvent<any>): void;
    onBlur<T = string | any>(fieldOrEvent: T): T extends string ? ((e: any) => void) : void;
    onChange(e: React.ChangeEvent<any>): void;
    onChange<T = string | React.ChangeEvent<any>>(field: T): T extends React.ChangeEvent<any> ? void : ((e: string | React.ChangeEvent<any>) => void);
    value: any;
}
class FormikTextField extends React.Component<FormikTextFieldProps & TextFieldProps> {
    render() {
        const { name, label, errorText, touched, onBlur, onChange, classes, value, ...rest } = this.props;
        return (
            <TextField
                id={name}
                name={name}
                label={label}
                value={value}
                helperText={touched ? errorText : ""}
                error={touched && Boolean(errorText)}
                onChange={onChange}
                onBlur={onBlur}
                fullWidth
                {...rest}
            />
        );
    }
}

export default FormikTextField;
