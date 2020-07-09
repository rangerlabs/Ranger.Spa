import * as React from 'react';
import { FormikTouched, FormikErrors } from 'formik';
import { Theme, createStyles, withStyles, WithStyles, Grid, TextareaAutosize, TextareaAutosizeProps, Typography } from '@material-ui/core';

const styles = () => createStyles({});

interface FormikTextAreaProps extends WithStyles<typeof styles> {
    name: string;
    label: string;
    errorText: string | FormikErrors<any>;
    touched: boolean | FormikTouched<any>;
    onBlur(e: React.FocusEvent<any>): void;
    onBlur<T = string | any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
    onChange(e: React.ChangeEvent<any>): void;
    onChange<T = string | React.ChangeEvent<any>>(field: T): T extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
    value: any;
}

class FormikTextField extends React.Component<FormikTextAreaProps & TextareaAutosizeProps> {
    render() {
        const { name, label: placeholder, errorText, touched, onBlur, onChange, classes, value, ...rest } = this.props;
        return (
            <Grid container alignContent="center" justify="center">
                <Grid item xs={12}>
                    <TextareaAutosize
                        id={name}
                        name={name}
                        placeholder={placeholder}
                        rowsMin={10}
                        value={value || ''}
                        onChange={onChange}
                        onBlur={onBlur}
                        {...rest}
                    />
                    {touched && Boolean(errorText) ? (
                        <Typography color="error" variant="caption">
                            {errorText}
                        </Typography>
                    ) : (
                        ''
                    )}
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(FormikTextField);
