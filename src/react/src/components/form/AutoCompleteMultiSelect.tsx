import * as React from "react";
import classNames from "classnames";
import Select from "react-select";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import CancelIcon from "@material-ui/icons/Cancel";
import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core";
import { ValueType } from "react-select/src/types";

type AutocompleteOptionType = {
    value: string;
    label: string;
};

const styles = (theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        input: {
            display: "flex",
            padding: 0,
            height: "auto",
        },
        valueContainer: {
            display: "flex",
            flexWrap: "wrap",
            flex: 1,
            alignItems: "center",
            overflow: "hidden",
        },
        chip: {
            margin: theme.spacing(0.5, 0.25),
        },
        chipFocused: {
            backgroundColor: theme.palette.type === "light" ? theme.palette.grey[300] : theme.palette.grey[700],
        },
        noOptionsMessage: {
            padding: theme.spacing(1, 2),
        },
        placeholder: {
            position: "absolute",
            left: 2,
            fontSize: theme.typography.body1.fontSize,
            fontWeight: theme.typography.body1.fontWeight,
        },
        paper: {
            position: "absolute",
            zIndex: 1,
            marginTop: theme.spacing(1),
            left: 0,
            right: 0,
        },
        divider: {
            height: theme.spacing(2),
        },
    });

interface FormikAutoCompleteMultiSelectProps extends WithStyles<typeof styles> {
    suggestions: string[];
    defaultValues?: string[];
    onChange: (values: string[]) => void;
}

interface FormikAutoCompleteMultiSelectState {
    multiValues: AutocompleteOptionType[];
}

function NoOptionsMessage(props: any) {
    return (
        <Typography color="textSecondary" className={props.selectProps.classes.noOptionsMessage} {...props.innerProps}>
            {props.children}
        </Typography>
    );
}

function inputComponent({ inputRef, ...props }: any) {
    return <div ref={inputRef} {...props} />;
}

function Control(props: any) {
    return (
        <TextField
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    className: props.selectProps.classes.input,
                    inputRef: props.innerRef,
                    children: props.children,
                    ...props.innerProps,
                },
            }}
            {...props.selectProps.textFieldProps}
        />
    );
}

function Option(props: any) {
    return (
        <MenuItem
            buttonRef={props.innerRef}
            selected={props.isFocused}
            component="div"
            style={{
                fontWeight: props.isSelected ? 400 : 300,
            }}
            {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    );
}

function Placeholder(props: any) {
    return (
        <Typography color="textSecondary" className={props.selectProps.classes.placeholder} {...props.innerProps}>
            {props.children}
        </Typography>
    );
}

function ValueContainer(props: any) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props: any) {
    return (
        <Chip
            tabIndex={-1}
            label={props.children}
            className={classNames(props.selectProps.classes.chip, {
                [props.selectProps.classes.chipFocused]: props.isFocused,
            })}
            onDelete={props.removeProps.onClick}
            deleteIcon={<CancelIcon {...props.removeProps} />}
        />
    );
}

function Menu(props: any) {
    return (
        <Paper elevation={0} square className={props.selectProps.classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    );
}

const components = {
    Control,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    ValueContainer,
};

const toAutocompleteOptionTypeArray = (label: string[]): AutocompleteOptionType[] => {
    let result = undefined;
    if (label)
        result = label.map(s => {
            return { value: s, label: s } as AutocompleteOptionType;
        });
    return result;
};

class IntegrationReactSelect extends React.Component<FormikAutoCompleteMultiSelectProps, FormikAutoCompleteMultiSelectState> {
    constructor(props: FormikAutoCompleteMultiSelectProps) {
        super(props);
        if (props.defaultValues) {
            this.state = { multiValues: this.defaultValues() };
        }
    }

    state: FormikAutoCompleteMultiSelectState = {
        multiValues: null as AutocompleteOptionType[],
    };

    defaultValues = (): AutocompleteOptionType[] => {
        const result = this.props.suggestions.filter(s => (this.props.defaultValues.find(v => v === s) ? true : false));
        return toAutocompleteOptionTypeArray(result);
    };

    handleChangeMulti(values: ValueType<AutocompleteOptionType>) {
        const valuesArray = values as AutocompleteOptionType[];
        const stringValues = valuesArray.map(v => v.value);
        this.props.onChange(stringValues);
        this.setState({ multiValues: valuesArray });
    }

    render() {
        const { classes, suggestions } = this.props;
        return (
            <div className={classes.root}>
                <Select
                    classes={classes}
                    closeMenuOnSelect={false}
                    options={toAutocompleteOptionTypeArray(suggestions)}
                    components={components}
                    value={this.state.multiValues}
                    onChange={(v: ValueType<AutocompleteOptionType>) => this.handleChangeMulti(v)}
                    placeholder="Select integrations"
                    isMulti
                />
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(IntegrationReactSelect);
