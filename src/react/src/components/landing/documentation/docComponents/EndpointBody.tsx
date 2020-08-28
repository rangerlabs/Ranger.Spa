import { PropsWithChildren } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core';
import React from 'react';
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

interface EndpointBodyProps {}

export default function EndpointBody(props: PropsWithChildren<EndpointBodyProps>) {
    const classes = useStyles(props);
    return <div className={classes.subsection}>{props.children}</div>;
}
