import { PropsWithChildren } from 'react';
import { Typography } from '@material-ui/core';
import React from 'react';
import Block from './Block';

interface IntroductionProps {
    id: string;
    text: string;
}

export default function Introduction(props: PropsWithChildren<IntroductionProps>) {
    return (
        <React.Fragment>
            <Block>
                <Typography id={props.id} gutterBottom variant="h4">
                    {props.text}
                </Typography>
            </Block>
            {props.children}
        </React.Fragment>
    );
}
