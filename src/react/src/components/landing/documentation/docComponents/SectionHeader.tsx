import { PropsWithChildren } from 'react';
import { Typography } from '@material-ui/core';
import React from 'react';

interface SectionHeaderProps {
    text: string;
}

export default function SectionHeader(props: PropsWithChildren<SectionHeaderProps>) {
    return (
        <Typography gutterBottom variant="h5">
            {props.text}
        </Typography>
    );
}
