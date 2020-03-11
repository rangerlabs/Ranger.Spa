import React, { ChangeEvent, useState } from 'react';
import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import Autocomplete from '@material-ui/lab/Autocomplete';
import InputBase from '@material-ui/core/InputBase';
import { Button, Checkbox, Typography, ListItem, ListItemText, List, Grid, Tooltip } from '@material-ui/core';
import CheckboxMarked from 'mdi-material-ui/CheckboxMarked';
import CheckboxBlankOutline from 'mdi-material-ui/CheckboxBlankOutline';
import InformationOutline from 'mdi-material-ui/InformationOutline';
import { FormikErrors, FormikTouched } from 'formik';
import FormikTextField from './FormikTextField';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            // boxShadow: 'none',
            margin: 0,
            background: theme.palette.common.white,
        },
        option: {
            minHeight: 'auto',
            alignItems: 'flex-start',
            padding: theme.spacing(1),
            '&[aria-selected="true"]': {
                backgroundColor: 'transparent',
            },
            '&[data-focus="true"]': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    })
);

interface FormikAutocompleteSearchProps {
    name: string;
    label: string;
    renderOption: (displayOption: string) => JSX.Element;
    options: string[];
    value?: string;
    disabled?: boolean;
    onChange: (event: ChangeEvent<{}>, values: string) => void;
    onBlur: (event: ChangeEvent<{}>, values: string) => void;
    errorText: string | FormikErrors<any>;
    touched: boolean | FormikTouched<any>;
    required: boolean;
}

export default function FormikAutocompleteSearch(props: FormikAutocompleteSearchProps) {
    const classes = useStyles(props);
    const { value: value } = props;

    const handleChange = (event: React.ChangeEvent<{}>, value: string) => {
        value = value ? value : '';
        props.onChange(event, value);
    };

    return (
        <React.Fragment>
            <Autocomplete
                classes={{
                    option: classes.option,
                    paper: classes.paper,
                }}
                noOptionsText="No options available"
                renderOption={props.renderOption}
                options={props.options.sort()}
                value={value}
                onChange={handleChange}
                clearOnEscape
                renderInput={(params: any) => (
                    <FormikTextField
                        name={props.name}
                        label={props.label}
                        value={value}
                        errorText={props.errorText}
                        touched={props.touched}
                        onChange={() => {}}
                        onBlur={props.onBlur}
                        autoComplete="off"
                        required={props.required}
                        disabled={props.disabled}
                        {...params}
                    />
                )}
            />
        </React.Fragment>
    );
}
