import React, { ChangeEvent } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
    },
}));

interface FormikAutocompleteMultiselectProps {
    name: string;
    label: string;
    placeholder: string;
    options: any[];
    getOptionLabel: (option: any) => string;
    defaultValue?: string;
    onChange: (values: any[]) => void;
}

export default function FormikAutocompleteMultiselect(props: FormikAutocompleteMultiselectProps) {
    const classes = useStyles(props);

    return (
        <div className={classes.root}>
            <Autocomplete
                multiple
                options={props.options}
                getOptionLabel={props.getOptionLabel}
                defaultValue={props.defaultValue ? props.defaultValue : ''}
                renderInput={params => (
                    <TextField {...params} name={props.name} variant="standard" label={props.label} placeholder={props.placeholder} margin="normal" fullWidth />
                )}
                onChange={(event: ChangeEvent<{}>, value: any) => {
                    props.onChange(value);
                }}
            />
        </div>
    );
}
