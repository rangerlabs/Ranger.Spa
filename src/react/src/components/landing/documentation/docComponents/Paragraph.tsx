import { PropsWithChildren } from 'react';
import { Typography } from '@material-ui/core';
import React from 'react';

interface ParagraphProps {}

export default function Paragraph(props: PropsWithChildren<ParagraphProps>) {
    return (
        <Typography gutterBottom variant="body1">
            {props.children}
        </Typography>
    );
}
