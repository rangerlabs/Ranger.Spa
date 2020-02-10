import * as React from 'react';
import FormikSelectValues from './interfaces/FormikSelectValuesProp';
import {
    withStyles,
    createStyles,
    Theme,
    WithStyles,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    FormHelperText,
    InputAdornment,
    Tooltip,
    Grid,
    Typography,
} from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';
import InformationOutline from 'mdi-material-ui/InformationOutline';
import { FormikErrors, FormikTouched } from 'formik';

const styles = (theme: Theme) =>
    createStyles({
        menu: {
            width: 200,
        },
        infoText: {
            position: 'relative',
            top: '20px',
            left: '14px',
        },
    });

interface FormikSelectProps extends WithStyles<typeof styles> {
    name: string;
    label: string;
    errorText: string | FormikErrors<any>;
    touched: boolean | FormikTouched<any>;
    onBlur(e: React.FocusEvent<any>): void;
    onBlur<T = string | any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
    onChange(e: React.ChangeEvent<any>): void;
    onChange<T = string | React.ChangeEvent<any>>(field: T): T extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
    selectValues: FormikSelectValues;
    required?: boolean;
    value: any;
    infoText?: string;
}

class FormikTextField extends React.Component<FormikSelectProps & TextFieldProps> {
    render() {
        const { name, label, selectValues, errorText, touched, onBlur, onChange, classes, value, ...rest } = this.props;
        return (
            <Grid container alignContent="center" justify="center">
                <Grid item xs={this.props.infoText ? 11 : 12}>
                    <TextField
                        id={name}
                        name={name}
                        label={label}
                        value={value}
                        helperText={touched ? errorText : ''}
                        error={touched && Boolean(errorText)}
                        onBlur={onBlur}
                        onChange={onChange}
                        SelectProps={{
                            MenuProps: {
                                className: classes.menu,
                            },
                        }}
                        InputLabelProps={{
                            shrink: true,
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
                </Grid>
                {this.props.infoText && (
                    <Grid item xs={1}>
                        <Tooltip className={classes.infoText} title={this.props.infoText} placement="left">
                            <InformationOutline fontSize="small" />
                        </Tooltip>
                    </Grid>
                )}
            </Grid>
        );
    }
}

export default withStyles(styles)(FormikTextField);
