import { PropsWithChildren } from 'react';
import { Typography } from '@material-ui/core';
import React from 'react';

interface HeaderProps {
    text: string;
}

export default function Header(props: PropsWithChildren<HeaderProps>) {
    return (
        <Typography gutterBottom variant="h4">
            {props.text}
        </Typography>
    );
}
