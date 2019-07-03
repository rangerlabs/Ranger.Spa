import * as React from "react";
import { FormikTouched, FormikErrors } from "formik";
import { Checkbox, FormLabel, FormControlLabel } from "@material-ui/core";
import { CheckboxProps } from "@material-ui/core/Checkbox";

interface FormikCheckboxProps {
    name: string;
    label: string;
    value: boolean;
    color?: "primary" | "secondary" | "default";
    onBlur(e: React.FocusEvent<any>): void;
    onBlur<T = string | any>(fieldOrEvent: T): T extends string ? ((e: any) => void) : void;
    onChange(e: React.ChangeEvent<any>): void;
    onChange<T = string | React.ChangeEvent<any>>(field: T): T extends React.ChangeEvent<any> ? void : ((e: string | React.ChangeEvent<any>) => void);
}
class FormikCheckbox extends React.Component<FormikCheckboxProps & CheckboxProps> {
    render() {
        const { name, label, onBlur, onChange, classes, value, color, ...rest } = this.props;
        return (
            <FormControlLabel
                control={
                    <Checkbox
                        id={name}
                        name={name}
                        value={value ? "true" : "false"}
                        checked={value ? true : false}
                        onChange={onChange}
                        onBlur={onBlur}
                        color={color ? color : "primary"}
                        {...rest}
                    />
                }
                label={label}
            />
        );
    }
}

export default FormikCheckbox;
