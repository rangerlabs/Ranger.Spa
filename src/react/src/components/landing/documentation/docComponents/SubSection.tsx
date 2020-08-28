import { PropsWithChildren } from 'react';
import { Typography } from '@material-ui/core';
import React from 'react';
import Block from './Block';
import Bold from '../textEnhancers/Bold';

interface SubSectionProps {
    id: string;
    text: string;
}

export default function SubSection(props: PropsWithChildren<SubSectionProps>) {
    return (
        <React.Fragment>
            <Block>
                <Typography id={props.id} gutterBottom variant="h6">
                    {props.text}
                </Typography>
            </Block>
            {props.children}
        </React.Fragment>
    );
}
