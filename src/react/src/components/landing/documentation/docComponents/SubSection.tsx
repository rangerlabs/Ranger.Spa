import { PropsWithChildren } from 'react';
import { Typography, makeStyles, Theme, createStyles } from '@material-ui/core';
import React from 'react';
import Block from './Block';
import { getDocsBreakpoint } from '../../../../helpers/Helpers';
import Constants from '../../../../theme/Constants';

const useStyles = makeStyles((theme: Theme) => {
    const breakpoint = getDocsBreakpoint(theme, Constants.DOCS.WIDTH);
    return createStyles({
        subsection: {
            [theme.breakpoints.up(breakpoint)]: {
                paddingLeft: theme.spacing(4),
                paddingRight: theme.spacing(4),
            },
        },
    });
});

interface SubSectionProps {
    id: string;
    text: string;
}

export default function SubSection(props: PropsWithChildren<SubSectionProps>) {
    const classes = useStyles(props);
    return (
        <React.Fragment>
            <Block>
                <Typography id={props.id} gutterBottom variant="h6">
                    {props.text}
                </Typography>
            </Block>
            <div className={classes.subsection}>{props.children}</div>
        </React.Fragment>
    );
}
