import { PropsWithChildren } from 'react';
import { Typography } from '@material-ui/core';
import React from 'react';
import Block from './Block';

interface SectionProps {
    id: string;
    text: string;
}

export default function Section(props: PropsWithChildren<SectionProps>) {
    return (
        <React.Fragment>
            <Block>
                <Typography id={props.id} gutterBottom variant="h5">
                    {props.text}
                </Typography>
            </Block>
            {props.children}
        </React.Fragment>
    );
}
