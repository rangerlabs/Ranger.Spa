import { PropsWithChildren } from 'react';
import { Typography } from '@material-ui/core';
import React from 'react';
import Block from './Block';

interface ParagraphProps {}

export default function Paragraph(props: PropsWithChildren<ParagraphProps>) {
    return (
        <Block>
            <Typography gutterBottom variant="body1">
                {props.children}
            </Typography>
        </Block>
    );
}
