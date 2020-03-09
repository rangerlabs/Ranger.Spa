import * as React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Grid, IconButton, Typography, Tooltip } from '@material-ui/core';
import InformationOutline from 'mdi-material-ui/InformationOutline';
import { useState, ChangeEvent } from 'react';
import { FormikErrors, FormikTouched } from 'formik';
import ExpandLess from '@material-ui/icons/ExpandLess';
import classNames from 'classnames';
import { TimePicker } from '@material-ui/pickers';
import { Moment } from 'moment';
import Schedule from '../../models/Schedule';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        helperText: { fontSize: theme.typography.fontSize - 2 },
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
        expandIcon: {
            transition: theme.transitions.create(['transform'], {
                duration: 500,
            }),
        },
        expanded: {
            transform: 'rotate(-180deg)',
        },
        collapsed: {
            transform: 'rotate(0)',
        },
    })
);

interface FormikScheduleBuilderProps {
    name: string;
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void;
    touchedArray: FormikTouched<Schedule>;
    errorsArray: FormikErrors<Schedule>;
    schedule: Schedule;
}

export default function FormikScheduleBuilder(props: FormikScheduleBuilderProps) {
    const classes = useStyles(props);
    const [expanded, setExpanded] = useState(false);

    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <Grid item xs={12}>
                <Grid container alignContent="center" justify="center">
                    <Grid classes={{ item: classes.titlePadding }} item xs={11}>
                        <Typography display="inline" color="primary" variant="subtitle1">
                            Geofence Schedule
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <Tooltip
                            className={classes.infoText}
                            title="Create a schedule for your geofence. Incoming Breadcrumbs will be converted from UTC to the selected timezone."
                            placement="right"
                        >
                            <InformationOutline fontSize="small" />
                        </Tooltip>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Grid classes={{ item: classes.titlePadding }} item xs={11}>
                            <Typography display="inline" color="primary" variant="body1">
                                Sunday
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1} justify="space-between">
                            <Grid item xs={6}>
                                <TimePicker
                                    value={props.schedule.Sunday.startTime || ''}
                                    FormHelperTextProps={{ className: classes.helperText }}
                                    id={`${props.name}.Sunday.startTime`}
                                    name={`${props.name}.Sunday.startTime`}
                                    label="Start Time"
                                    helperText={
                                        props.touchedArray?.Sunday.startTime && Boolean(props.errorsArray?.Sunday.startTime)
                                            ? props.errorsArray?.Sunday.startTime
                                            : ''
                                    }
                                    error={props.touchedArray?.Sunday.startTime && Boolean(props.errorsArray?.Sunday.startTime)}
                                    onChange={(date: Moment) => {
                                        console.log(date);
                                        // props.onChange;
                                    }}
                                    onBlur={props.onBlur}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TimePicker
                                    value={props.schedule.Sunday.startTime || ''}
                                    FormHelperTextProps={{ className: classes.helperText }}
                                    id={`${props.name}.Sunday.endTime`}
                                    name={`${props.name}.Sunday.endTime`}
                                    label="End Time"
                                    helperText={
                                        props.touchedArray?.Sunday.startTime && Boolean(props.errorsArray?.Sunday.startTime)
                                            ? props.errorsArray?.Sunday.startTime
                                            : ''
                                    }
                                    error={props.touchedArray?.Sunday.startTime && Boolean(props.errorsArray?.Sunday.startTime)}
                                    onChange={(date: Moment) => {
                                        console.log(date);
                                        // props.onChange;
                                    }}
                                    onBlur={props.onBlur}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container className={classes.addContainerMargin}>
                    <Grid item>
                        <Tooltip title={expanded ? 'Collapse' : 'Expand'} placement="right">
                            <span>
                                <IconButton aria-label="expand" onClick={() => setExpanded(true)}>
                                    <ExpandLess className={classNames(classes.expandIcon, expanded ? classes.expanded : classes.collapsed)} />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
        </MuiPickersUtilsProvider>
    );
}
