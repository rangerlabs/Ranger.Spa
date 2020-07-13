import { PropsWithChildren } from 'react';
import { Typography } from '@material-ui/core';
import React from 'react';
import Block from './Block';

interface HeaderProps {
    text: string;
}

export default function Header(props: PropsWithChildren<HeaderProps>) {
    return (
        <Block>
            <Typography gutterBottom variant="h4">
                {props.text}
            </Typography>
        </Block>
    );
}
