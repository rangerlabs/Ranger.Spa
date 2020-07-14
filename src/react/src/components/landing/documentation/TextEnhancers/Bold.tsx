import { Box } from '@material-ui/core';
import React, { PropsWithChildren } from 'react';

interface BoldProps {}

export default function Bold(props: PropsWithChildren<BoldProps>) {
    return (
        <Box display="inline" fontWeight={700}>
            {props.children}
        </Box>
    );
}
