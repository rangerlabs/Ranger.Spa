import * as React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Grid, IconButton, Typography, Tooltip, Collapse, Fade, Button, Box } from '@material-ui/core';
import InformationOutline from 'mdi-material-ui/InformationOutline';
import { useState, useEffect } from 'react';
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
import Restore from 'mdi-material-ui/Restore';
import { red } from '@material-ui/core/colors';
import FormikAutocompleteSearch from './FormikAutocompleteSearch';
import { titleCase } from 'change-case';
import { useFormikContext } from 'formik';
import Geofence from '../../models/app/geofences/Geofence';
var moment = require('moment-timezone');

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
}

export default function FormikScheduleBuilder(props: FormikScheduleBuilderProps) {
    const classes = useStyles(props);
    const { name } = props;
    const [expanded, setExpanded] = useState(false);
    const { values, setFieldValue, handleBlur, touched, errors } = useFormikContext<Geofence>();
    const [isUtcFullSchedule, setCanReset] = useState(Schedule.IsFullUtcSchedule(values.schedule));

    function assertIsDay(val: string): asserts val is ScheduleEnum {
        if (!(val in ScheduleEnum)) {
            throw new AssertionError({ message: 'Value is not a day!' });
        }
    }

    useEffect(() => {
        setCanReset(Schedule.IsFullUtcSchedule(values.schedule));
    }, [values.schedule]);

    const errorTextStartTime = (v: ScheduleEnum): string | null =>
        touched.schedule && errors.schedule && touched.schedule[v]?.startTime && Boolean(errors.schedule[v]?.startTime)
            ? (errors.schedule[v]?.startTime as string)
            : '';
    const errorTextEndTime = (v: ScheduleEnum): string | null =>
        errors.schedule && Boolean(errors.schedule[v]?.endTime) ? (errors.schedule[v]?.endTime as string) : '';
    const isErrorStartTime = (v: ScheduleEnum): boolean =>
        touched.schedule && errors.schedule && touched.schedule[v]?.startTime && Boolean(errors.schedule[v]?.startTime);
    const isErrorEndTime = (v: ScheduleEnum): boolean => errors.schedule && Boolean(errors.schedule[v]?.endTime);
    const areDatesEqual = (v: ScheduleEnum): boolean => {
        const start = values.schedule[v].startTime;
        console.log('start: ' + values.schedule[v].startTime);
        console.log('start iso: ' + start);
        const end = values.schedule[v].endTime;
        console.log('end: ' + values.schedule[v].endTime);
        console.log('end iso: ' + end);
        const equal = isValid(start) && isValid(end) && isEqual(start, end);

        return equal;
    };
    const timeZoneIds = moment.tz.names();

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
                {!expanded && <Typography variant="caption">Expand to modify this geofence's schedule</Typography>}
                <Collapse unmountOnExit in={expanded} timeout={500}>
                    <Box marginBottom={2}>
                        <FormikAutocompleteSearch
                            name={`${name}.timeZoneId`}
                            label="Timezone Id"
                            renderOption={(option: string) => <Typography variant="subtitle1">{`${option} (GMT${moment.tz(option).format('Z')})`}</Typography>}
                            options={timeZoneIds}
                            value={values.schedule.timeZoneId}
                            errorText={errors.schedule?.timeZoneId}
                            touched={touched.schedule?.timeZoneId}
                            onChange={(event: React.ChangeEvent<{}>, values: string) => {
                                setFieldValue(`${name}.timeZoneId`, values, true);
                            }}
                            onBlur={handleBlur}
                            required
                        />
                    </Box>
                    <React.Fragment>
                        {Object.values(ScheduleEnum).map((v, i) => {
                            assertIsDay(v);
                            const isInactive = areDatesEqual(v);
                            return (
                                <Grid container spacing={1} key={`${name}.${v}.{i}`}>
                                    <Grid item xs={12}>
                                        <Grid container spacing={1} justify="space-between">
                                            <Grid item xs={3}>
                                                <Grid container alignContent="center" justify="center">
                                                    <Grid item xs={12}>
                                                        <Typography variant="body1">{titleCase(v)}</Typography>
                                                        <Fade in={isInactive} timeout={350}>
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
                                            <Grid item xs={8} className={classNames(classes.relativePosition, isInactive ? classes.strikeThrough : '')}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={6}>
                                                        <KeyboardTimePicker
                                                            value={values.schedule[v].startTime}
                                                            FormHelperTextProps={{ className: classes.helperText }}
                                                            id={`${name}.${v}.startTime`}
                                                            name={`${name}.${v}.startTime`}
                                                            label="Start Time"
                                                            helperText={errorTextStartTime(v)}
                                                            error={isErrorStartTime(v)}
                                                            onChange={(date: Date, value?: string) => {
                                                                setFieldValue(`${name}.${v}.startTime`, date, true);
                                                            }}
                                                            keyboardIcon={<ClockOutline />}
                                                            onBlur={handleBlur}
                                                            fullWidth
                                                            format="hh:mm:ss"
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            autoComplete="off"
                                                            mask="__:__:__ _M"
                                                            views={['hours', 'minutes', 'seconds']}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <KeyboardTimePicker
                                                            value={values.schedule[v].endTime}
                                                            FormHelperTextProps={{ className: classes.helperText }}
                                                            id={`${name}.${v}.endTime`}
                                                            name={`${name}.${v}.endTime`}
                                                            label="End Time"
                                                            helperText={errorTextEndTime(v)}
                                                            error={isErrorEndTime(v)}
                                                            onChange={(date: Date, value?: string) => {
                                                                date.setMilliseconds(999);
                                                                setFieldValue(`${name}.${v}.endTime`, date, true);
                                                            }}
                                                            keyboardIcon={<ClockOutline />}
                                                            onBlur={handleBlur}
                                                            fullWidth
                                                            format="hh:mm:ss"
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            autoComplete="off"
                                                            mask="__:__:__ _M"
                                                            views={['hours', 'minutes', 'seconds']}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={1}>
                                                <Grid container alignContent="center" justify="center">
                                                    <Grid item xs={12}>
                                                        {areDatesEqual(v) ? (
                                                            <Tooltip title="Reset this day's schedule." placement="left">
                                                                <span>
                                                                    <IconButton
                                                                        aria-label="reset day"
                                                                        color="primary"
                                                                        onClick={() => {
                                                                            setFieldValue(`${name}.${v}.startTime`, startOfToday().toISOString());
                                                                            setFieldValue(`${name}.${v}.endTime`, endOfToday().toISOString());
                                                                        }}
                                                                    >
                                                                        <Restore />
                                                                    </IconButton>
                                                                </span>
                                                            </Tooltip>
                                                        ) : (
                                                            <Tooltip title="Clear this day's schedule." placement="left">
                                                                <span>
                                                                    <Box color={red}>
                                                                        <IconButton
                                                                            aria-label="delete day"
                                                                            color="inherit"
                                                                            onClick={() => {
                                                                                var date = startOfToday().toISOString();
                                                                                setFieldValue(`${name}.${v}.startTime`, date);
                                                                                setFieldValue(`${name}.${v}.endTime`, date);
                                                                            }}
                                                                        >
                                                                            <CloseCircleOutline />
                                                                        </IconButton>
                                                                    </Box>
                                                                </span>
                                                            </Tooltip>
                                                        )}
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
                            setFieldValue(`${name}.timeZoneId`, 'UTC', true);
                            Object.values(ScheduleEnum).map((v, i) => {
                                assertIsDay(v);
                                setFieldValue(`${name}.${v}.startTime`, startOfToday().toISOString());
                                setFieldValue(`${name}.${v}.endTime`, endOfToday().toISOString());
                            });
                        }}
                        disabled={isUtcFullSchedule}
                        variant="outlined"
                    >
                        Reset Schedule
                    </Button>
                </Collapse>
            </Grid>
        </MuiPickersUtilsProvider>
    );
}
