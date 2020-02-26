import * as React from 'react';
import { Checkbox, FormControlLabel, Tooltip, Theme, createStyles, withStyles } from '@material-ui/core';
import { CheckboxProps } from '@material-ui/core/Checkbox';
import InformationOutline from 'mdi-material-ui/InformationOutline';
import { WithStyles } from '@material-ui/styles';

const styles = (theme: Theme) =>
    createStyles({
        infoText: {
            position: 'relative',
            top: '4px',
        },
    });

interface FormikCheckboxProps extends WithStyles<typeof styles> {
    name: string;
    label: string;
    value: boolean;
    color?: 'primary' | 'secondary' | 'default';
    onBlur(e: React.FocusEvent<any>): void;
    onBlur<T = string | any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
    onChange(e: React.ChangeEvent<any>): void;
    onChange<T = string | React.ChangeEvent<any>>(field: T): T extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
    infoText?: string;
}
class FormikCheckbox extends React.Component<FormikCheckboxProps & CheckboxProps> {
    render() {
        const { name, label, onBlur, onChange, classes, value, color, infoText, ...rest } = this.props;
        return (
            <React.Fragment>
                <FormControlLabel
                    control={
                        <Checkbox
                            id={name}
                            name={name}
                            value={value ? 'true' : 'false'}
                            checked={value ? true : false}
                            onChange={onChange}
                            onBlur={onBlur}
                            color={color ? color : 'primary'}
                            {...rest}
                        />
                    }
                    label={label}
                />
                {this.props.infoText && (
                    <Tooltip className={classes.infoText} title={this.props.infoText} placement="bottom">
                        <InformationOutline fontSize="small" />
                    </Tooltip>
                )}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(FormikCheckbox);
