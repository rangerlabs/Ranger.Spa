import * as React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Grid, TextField, IconButton, Typography, Tooltip, TooltipProps } from '@material-ui/core';
import Delete from 'mdi-material-ui/Delete';
import PlusCircleOutline from 'mdi-material-ui/PlusCircleOutline';
import InformationOutline from 'mdi-material-ui/InformationOutline';
import { useState, useEffect, ChangeEvent } from 'react';
import KeyValuePair from '../../models/KeyValuePair';
import FormikTextField from './FormikTextField';
import { FormikErrors, FormikTouched, FieldArray, FormikValues, getIn, Field } from 'formik';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        titlePadding: {
            paddingBottom: '0px',
        },
        addContainerMargin: {
            marginTop: theme.spacing(1),
        },
        infoText: {
            position: 'relative',
            top: '3px',
            left: '14px',
        },
    })
);

interface FormikDictionaryBuilderProps {
    name: string;
    title: string;
    addTooltipText: string;
    infoText?: string;
    defaultDictionaryValue?: KeyValuePair[];
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void;
    touchedArray: FormikTouched<KeyValuePair[]>;
    errorsArray: FormikErrors<KeyValuePair[]>;
    valueArray: Array<KeyValuePair>;
    keyRequired?: boolean;
    valueRequired?: boolean;
}

export default function FormikDictionaryBuilder(props: FormikDictionaryBuilderProps) {
    const classes = useStyles(props);

    return (
        <Grid item xs={12}>
            <Grid container alignContent="center" justify="center">
                <Grid classes={{ item: classes.titlePadding }} item xs={11}>
                    <Typography display="inline" color="primary" variant="subtitle1">
                        {props.title}
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    {props.infoText && (
                        <Tooltip className={classes.infoText} title={props.infoText} placement="right">
                            <InformationOutline fontSize="small" />
                        </Tooltip>
                    )}
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <FieldArray
                        name={props.name}
                        render={arrayHelpers => (
                            <React.Fragment>
                                {props.valueArray.map((v, i) => (
                                    <Grid container>
                                        <Grid item xs={11}>
                                            <Grid container spacing={1} justify="space-between">
                                                <Grid item xs={6}>
                                                    <FormikTextField
                                                        name={`${props.name}.${i}.key`}
                                                        label="Name"
                                                        value={v.key}
                                                        fullWidth
                                                        errorText={props.errorsArray ? props.errorsArray[i]?.key : null}
                                                        touched={props.touchedArray ? props.touchedArray[i]?.key : null}
                                                        onBlur={props.onBlur}
                                                        onChange={props.onChange}
                                                        autoComplete="off"
                                                        required={props.keyRequired ? props.keyRequired : false}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <FormikTextField
                                                        name={`${props.name}.${i}.value`}
                                                        label="Value"
                                                        value={v.value}
                                                        fullWidth
                                                        errorText={props.errorsArray ? props.errorsArray[i]?.value : null}
                                                        touched={props.touchedArray ? props.touchedArray[i]?.value : null}
                                                        onBlur={props.onBlur}
                                                        onChange={props.onChange}
                                                        autoComplete="off"
                                                        required={props.valueRequired ? props.valueRequired : false}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Grid container alignContent="center" justify="center">
                                                <Grid item xs={12}>
                                                    <Tooltip title="Delete entry." placement="left">
                                                        <IconButton aria-label="delete row" color="primary" onClick={() => arrayHelpers.remove(i)}>
                                                            <Delete />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                ))}
                                <Grid container className={classes.addContainerMargin}>
                                    <Grid item>
                                        <Tooltip title={props.addTooltipText} placement="right">
                                            <IconButton aria-label="add row" color="primary" onClick={() => arrayHelpers.push({ key: '', value: '' })}>
                                                <PlusCircleOutline />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </React.Fragment>
                        )}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}
