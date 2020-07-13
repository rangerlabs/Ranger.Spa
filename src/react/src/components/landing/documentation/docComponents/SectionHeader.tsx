import { PropsWithChildren } from 'react';
import { Typography } from '@material-ui/core';
import React from 'react';
import Block from './Block';

interface SectionHeaderProps {
    id?: string;
    text: string;
}

export default function SectionHeader(props: PropsWithChildren<SectionHeaderProps>) {
    return (
        <Block>
            <Typography id={props.id} gutterBottom variant="h5">
                {props.text}
            </Typography>
        </Block>
    );
}
