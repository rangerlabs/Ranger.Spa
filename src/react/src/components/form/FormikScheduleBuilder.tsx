import * as React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Grid, IconButton, Typography, Tooltip, Collapse, Hidden, Fade, Button, Box } from '@material-ui/core';
import InformationOutline from 'mdi-material-ui/InformationOutline';
import { useState, ChangeEvent } from 'react';
import { FormikErrors, FormikTouched, FormikHandlers } from 'formik';
import ExpandLess from '@material-ui/icons/ExpandLess';
import classNames from 'classnames';
import { KeyboardTimePicker } from '@material-ui/pickers';
import Schedule from '../../models/Schedule';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { ScheduleEnum } from '../../models/ScheduleEnum';
import { AssertionError } from 'assert';
import ClockOutline from 'mdi-material-ui/ClockOutline';
import { startOfToday, isEqual, parseISO, isValid, endOfToday } from 'date-fns';
import AlertOutline from 'mdi-material-ui/AlertOutline';
import CloseCircleOutline from 'mdi-material-ui/CloseCircleOutline';
import { red } from '@material-ui/core/colors';

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
        warning: {
            marginTop: theme.spacing(2),
            color: red[600],
            '&:hover': {
                backgroundColor: '#e539351c',
                color: theme.palette.error.main,
            },
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: red[600],
        },
        strikeThrough: {
            '&::before': {
                content: '""',
                borderBottom: '2px solid red',
                width: '100%',
                position: 'absolute',
                right: 0,
                top: '63%',
            },
        },
        relativePosition: {
            position: 'relative',
        },
    })
);

interface FormikScheduleBuilderProps {
    name: string;
    onChange: (fieldName: string, value: Date) => void;
    onBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void;
    touched: FormikTouched<Schedule>;
    errors: FormikErrors<Schedule>;
    schedule: Schedule;
}

export default function FormikScheduleBuilder(props: FormikScheduleBuilderProps) {
    const classes = useStyles(props);
    const [expanded, setExpanded] = useState(false);
    const { name, schedule, touched, errors } = props;

    function assertIsDay(val: string): asserts val is ScheduleEnum {
        if (!(val.toUpperCase() in ScheduleEnum)) {
            throw new AssertionError({ message: 'Value not a day!' });
        }
    }

    const errorTextStartTime = (v: ScheduleEnum): string | null =>
        touched && errors && touched[v]?.startTime && Boolean(errors[v]?.startTime) ? (errors[v]?.startTime as string) : '';
    const errorTextEndTime = (v: ScheduleEnum): string | null => (errors && Boolean(errors[v]?.endTime) ? (errors[v]?.endTime as string) : '');
    const isErrorStartTime = (v: ScheduleEnum): boolean => touched && errors && touched[v]?.startTime && Boolean(errors[v]?.startTime);
    const isErrorEndTime = (v: ScheduleEnum): boolean => errors && Boolean(errors[v]?.endTime);
    const areDatesEqual = (v: ScheduleEnum): boolean => {
        const start = parseISO(schedule[v].startTime);
        const end = parseISO(schedule[v].endTime);
        return isValid(start) && isValid(end) && isEqual(start, end);
    };

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid item xs={12}>
                <Grid container alignContent="center" justify="center">
                    <Grid classes={{ item: classes.titlePadding }} item xs={11}>
                        <Typography display="inline" variant="subtitle1" color="primary">
                            Geofence Schedule
                        </Typography>
                        <Tooltip title={expanded ? 'Collapse' : 'Expand'} placement="right">
                            <span>
                                <IconButton aria-label="expand" onClick={() => setExpanded(!expanded)}>
                                    <ExpandLess className={classNames(classes.expandIcon, expanded ? classes.expanded : classes.collapsed)} />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={1}>
                        <Tooltip
                            className={classes.infoText}
                            title="Create an optional schedule for your geofence. Select a timezone for the geofence and Breadcrumbs which have triggered this geofence will be converted from UTC to the timezone you have selected to determine if events should be sent. Setting times equal to each other will deactivate the geofence for the day."
                            placement="right"
                        >
                            <InformationOutline fontSize="small" />
                        </Tooltip>
                    </Grid>
                </Grid>
                <Fade in={!expanded} timeout={500}>
                    <Typography variant="caption">Expand to modify this geofence's schedule</Typography>
                </Fade>
                <Collapse in={expanded} timeout={500}>
                    <React.Fragment>
                        {Object.values(ScheduleEnum).map((v, i) => {
                            assertIsDay(v);
                            return (
                                <Grid container spacing={1} key={`${name}.${v}.{i}`}>
                                    <Grid item xs={12}>
                                        <Grid container spacing={1} justify="space-between">
                                            <Grid item xs={3}>
                                                <Grid container alignContent="center" justify="center">
                                                    <Grid item xs={12}>
                                                        <Typography variant="body1">{v}</Typography>
                                                        <Fade in={areDatesEqual(v)} timeout={350}>
                                                            <Tooltip
                                                                className={classes.infoText}
                                                                title="Events will not be sent for this day. Alter the times to active this day."
                                                                placement="right"
                                                            >
                                                                <AlertOutline color="error" />
                                                            </Tooltip>
                                                        </Fade>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={8} className={classNames(classes.relativePosition, areDatesEqual(v) ? classes.strikeThrough : '')}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={6}>
                                                        <KeyboardTimePicker
                                                            value={schedule[v].startTime}
                                                            FormHelperTextProps={{ className: classes.helperText }}
                                                            id={`${name}.${v}.startTime`}
                                                            name={`${name}.${v}.startTime`}
                                                            label="Start Time"
                                                            helperText={errorTextStartTime(v)}
                                                            error={isErrorStartTime(v)}
                                                            onChange={(date: Date, value?: string) => {
                                                                props.onChange(`${name}.${v}.startTime`, date);
                                                            }}
                                                            keyboardIcon={<ClockOutline />}
                                                            onBlur={props.onBlur}
                                                            fullWidth
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            autoComplete="off"
                                                            mask="__:__ _M"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <KeyboardTimePicker
                                                            value={schedule[v].endTime}
                                                            FormHelperTextProps={{ className: classes.helperText }}
                                                            id={`${name}.${v}.endTime`}
                                                            name={`${name}.${v}.endTime`}
                                                            label="End Time"
                                                            helperText={errorTextEndTime(v)}
                                                            error={isErrorEndTime(v)}
                                                            onChange={(date: Date, value?: string) => {
                                                                props.onChange(`${name}.${v}.endTime`, date);
                                                            }}
                                                            keyboardIcon={<ClockOutline />}
                                                            onBlur={props.onBlur}
                                                            fullWidth
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            autoComplete="off"
                                                            mask="__:__ _M"
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={1}>
                                                <Grid container alignContent="center" justify="center">
                                                    <Grid item xs={12}>
                                                        <Tooltip title="Clear this day's schedule." placement="left">
                                                            <span>
                                                                <IconButton
                                                                    aria-label="delete day"
                                                                    color="primary"
                                                                    onClick={() => {
                                                                        var date = startOfToday();
                                                                        props.onChange(`${name}.${v}.startTime`, date);
                                                                        props.onChange(`${name}.${v}.endTime`, date);
                                                                    }}
                                                                >
                                                                    <CloseCircleOutline />
                                                                </IconButton>
                                                            </span>
                                                        </Tooltip>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            );
                        })}
                    </React.Fragment>
                    <Button
                        className={classes.warning}
                        onClick={() => {
                            Object.values(ScheduleEnum).map((v, i) => {
                                assertIsDay(v);
                                props.onChange(`${name}.${v}.startTime`, startOfToday());
                                props.onChange(`${name}.${v}.endTime`, endOfToday());
                            });
                        }}
                        variant="outlined"
                    >
                        Reset Schedule
                    </Button>
                </Collapse>
            </Grid>
        </MuiPickersUtilsProvider>
    );
}
