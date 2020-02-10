import React, { ChangeEvent } from 'react';
import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import Autocomplete from '@material-ui/lab/Autocomplete';
import InputBase from '@material-ui/core/InputBase';
import { Button, Checkbox, Typography, ListItem, ListItemText, List, Grid, Tooltip } from '@material-ui/core';
import CheckboxMarked from 'mdi-material-ui/CheckboxMarked';
import CheckboxBlankOutline from 'mdi-material-ui/CheckboxBlankOutline';
import InformationOutline from 'mdi-material-ui/InformationOutline';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            width: '100%',
            textAlign: 'left',
        },
        tag: {
            marginTop: 3,
            height: 20,
            padding: '.15em 4px',
            lineHeight: '15px',
        },
        inputBase: {
            width: '100%',
            borderBottom: '1px solid #dfe2e5',
            '& input': {
                backgroundColor: theme.palette.common.white,
                padding: theme.spacing(1),
                transition: theme.transitions.create(['border-color', 'box-shadow']),
                border: '1px solid #ced4da',
                '&:focus': {
                    boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
                    borderColor: theme.palette.primary.main,
                },
            },
        },
        popper: {
            border: '1px solid rgba(27,31,35,.15)',
            boxShadow: '0 3px 12px rgba(27,31,35,.15)',
            zIndex: 1,
        },
        paper: {
            boxShadow: 'none',
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
        text: {
            flexGrow: 1,
        },
        popperDisablePortal: {
            position: 'relative',
        },
        checkbox: {
            marginRight: theme.spacing(1),
        },
        listItem: {
            border: '1px solid rgba(0, 0, 0, 0.23)',
            paddingTop: theme.spacing(0.5),
            paddingBottom: theme.spacing(0.5),
            marginBottom: '3px',
        },
        infoText: {
            position: 'relative',
            left: '8px',
        },
    })
);

interface FormikAutocompleteLabelMultiselectProps {
    name: string;
    label: string;
    options: string[];
    placeholder: string;
    enabled: boolean;
    defaultValue?: string[];
    onChange: (event: ChangeEvent<{}>, values: string[]) => void;
    infoText?: string;
}

export default function FormikAutocompleteLabelMultiselect(props: FormikAutocompleteLabelMultiselectProps) {
    const classes = useStyles(props);
    const [anchorEl] = React.useState<React.RefObject<null | HTMLElement>>(React.createRef());
    const [autoCompleteRef] = React.useState<React.RefObject<null | HTMLElement>>(React.createRef());
    const [open, setOpen] = React.useState<boolean>(false);
    const [value, setValue] = React.useState<string[]>(props.defaultValue ? props.defaultValue : []);
    const [pendingValue, setPendingValue] = React.useState<string[]>([]);

    const handleClick = (event: any) => {
        setPendingValue(value);
        setOpen(true);
    };

    const handleClose = (event: any) => {
        setValue(pendingValue);
        setOpen(false);
    };
    const handleChange = (event: React.ChangeEvent<{}>, value: string[]) => {
        setPendingValue(value);
        props.onChange(event, value);
    };

    const id = open ? 'select' : undefined;
    const icon = <CheckboxBlankOutline fontSize="small" />;
    const checkedIcon = <CheckboxMarked fontSize="small" />;

    return (
        <React.Fragment>
            <div>
                <Button
                    disabled={!props.enabled}
                    variant="outlined"
                    color="primary"
                    buttonRef={anchorEl}
                    className={classes.button}
                    aria-describedby={id}
                    onClick={handleClick}
                >
                    <React.Fragment>
                        {props.label}
                        {classes.infoText && (
                            <Tooltip className={classes.infoText} title={props.infoText} placement="bottom">
                                <InformationOutline fontSize="small" />
                            </Tooltip>
                        )}
                    </React.Fragment>
                </Button>
                {props.enabled && (
                    <List>
                        {value.map((label: string) => (
                            <ListItem key={label} className={classes.listItem}>
                                <ListItemText primary={label} />
                            </ListItem>
                        ))}
                    </List>
                )}
            </div>
            <Popper
                id={id}
                open={open}
                anchorEl={anchorEl.current}
                className={classes.popper}
                style={{ width: anchorEl.current ? anchorEl.current.offsetWidth : 0 }}
                placement="bottom"
                disablePortal
            >
                <Autocomplete
                    innerRef={autoCompleteRef}
                    open
                    multiple
                    classes={{
                        option: classes.option,
                        paper: classes.paper,
                        popperDisablePortal: classes.popperDisablePortal,
                    }}
                    value={pendingValue}
                    onChange={handleChange}
                    onClose={handleClose}
                    disableCloseOnSelect
                    disablePortal
                    renderTags={() => null}
                    noOptionsText="No options available"
                    renderOption={(option: string, { selected }) => (
                        <React.Fragment>
                            <Checkbox color="primary" icon={icon} checkedIcon={checkedIcon} className={classes.checkbox} checked={selected} />
                            <Typography variant="subtitle1">{option}</Typography>
                        </React.Fragment>
                    )}
                    options={props.options.sort((a, b) => {
                        // Display the selected labels first.
                        let ai = value.indexOf(a);
                        ai = ai === -1 ? value.length + props.options.indexOf(a) : ai;
                        let bi = value.indexOf(b);
                        bi = bi === -1 ? value.length + props.options.indexOf(b) : bi;
                        return ai - bi;
                    })}
                    renderInput={(params: any) => (
                        <InputBase name={props.name} ref={params.InputProps.ref} inputProps={params.inputProps} autoFocus className={classes.inputBase} />
                    )}
                />
            </Popper>
        </React.Fragment>
    );
}
