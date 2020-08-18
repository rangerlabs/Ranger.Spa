import { PropsWithChildren } from 'react';
import { Typography } from '@material-ui/core';
import React from 'react';
import Block from './Block';

interface SubSectionProps {
    id: string;
    text: string;
}

export default function SubSection(props: PropsWithChildren<SubSectionProps>) {
    return (
        <React.Fragment>
            <Block>
                <Typography id={props.id} gutterBottom variant="subtitle1">
                    {props.text}
                </Typography>
            </Block>
            {props.children}
        </React.Fragment>
    );
}
