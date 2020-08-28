import { PropsWithChildren } from 'react';
import { Typography, makeStyles, Theme, createStyles } from '@material-ui/core';
import React from 'react';
import Block from './Block';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        subsection: {
            paddingLeft: theme.spacing(4),
        },
    })
);

interface SubSectionProps {
    id: string;
    text: string;
}

export default function SubSection(props: PropsWithChildren<SubSectionProps>) {
    const classes = useStyles(props);
    return (
        <div className={classes.subsection}>
            <Block>
                <Typography id={props.id} gutterBottom variant="h6">
                    {props.text}
                </Typography>
            </Block>
            {props.children}
        </div>
    );
}
