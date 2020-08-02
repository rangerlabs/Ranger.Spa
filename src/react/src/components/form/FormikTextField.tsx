import * as React from 'react';
import { FormikTouched, FormikErrors } from 'formik';
import { TextField, Theme, createStyles, withStyles, WithStyles, Tooltip, Grid, Typography } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';
import InformationOutline from 'mdi-material-ui/InformationOutline';

const styles = (theme: Theme) =>
    createStyles({
        root: { fontSize: theme.typography.fontSize - 2 },
        infoText: {
            position: 'relative',
            top: '20px',
            left: '14px',
        },
    });

interface FormikTextFieldProps extends WithStyles<typeof styles> {
    name: string;
    label: string;
    errorText: string | string[] | FormikErrors<any>;
    touched: boolean | FormikTouched<any>;
    onBlur(e: React.FocusEvent<any>): void;
    onBlur<T = string | any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
    onChange(e: React.ChangeEvent<any>): void;
    onChange<T = string | React.ChangeEvent<any>>(field: T): T extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
    value: any;
    infoText?: string;
}

class FormikTextField extends React.Component<FormikTextFieldProps & TextFieldProps> {
    render() {
        const { name, label, errorText, touched, onBlur, onChange, classes, value, infoText, ...rest } = this.props;

        function renderErrorsArray(errors: string | string[] | FormikErrors<any>) {
            if (touched && Boolean(errorText)) {
                if (Array.isArray(errors)) {
                    return errors.map((e) => (
                        <Typography className={classes.root} color="error">
                            {e}
                        </Typography>
                    ));
                } else {
                    return errors;
                }
            } else {
                return '';
            }
        }

        return (
            <Grid container alignContent="center" justify="center">
                <Grid item xs={this.props.infoText ? 11 : 12}>
                    <TextField
                        FormHelperTextProps={{ className: classes.root }}
                        id={name}
                        name={name}
                        label={label}
                        value={value || ''}
                        helperText={renderErrorsArray(errorText)}
                        error={touched && Boolean(errorText)}
                        onChange={onChange}
                        onBlur={onBlur}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        {...rest}
                    />
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
