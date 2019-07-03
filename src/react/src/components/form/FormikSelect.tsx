import * as React from "react";
import FormikSelectValues from "./interfaces/FormikSelectValuesProp";
import { withStyles, createStyles, Theme, WithStyles, TextField, MenuItem, Select, InputLabel, FormControl, FormHelperText } from "@material-ui/core";
import { TextFieldProps } from "@material-ui/core/TextField";
import { FormikErrors, FormikTouched } from "formik";

const styles = (theme: Theme) =>
    createStyles({
        menu: {
            width: 200,
        },
    });

interface FormikSelectProps extends WithStyles<typeof styles> {
    name: string;
    label: string;
    errorText: string | FormikErrors<any>;
    touched: boolean | FormikTouched<any>;
    onBlur(e: React.FocusEvent<any>): void;
    onBlur<T = string | any>(fieldOrEvent: T): T extends string ? ((e: any) => void) : void;
    onChange(e: React.ChangeEvent<any>): void;
    onChange<T = string | React.ChangeEvent<any>>(field: T): T extends React.ChangeEvent<any> ? void : ((e: string | React.ChangeEvent<any>) => void);
    selectValues: FormikSelectValues;
    required?: boolean;
    value: any;
}

class FormikTextField extends React.Component<FormikSelectProps & TextFieldProps> {
    render() {
        const { name, label, selectValues, errorText, touched, onBlur, onChange, classes, value, ...rest } = this.props;
        return (
            <TextField
                id={name}
                name={name}
                label={label}
                value={value}
                helperText={touched ? errorText : ""}
                error={touched && Boolean(errorText)}
                onBlur={onBlur}
                onChange={onChange}
                SelectProps={{
                    MenuProps: {
                        className: classes.menu,
                    },
                }}
                fullWidth
                select
                {...rest}
            >
                {selectValues.map(v => (
                    <MenuItem key={v.value} value={v.value}>
                        {v.label}
                    </MenuItem>
                ))}
            </TextField>
        );
    }
}

export default withStyles(styles)(FormikTextField);
