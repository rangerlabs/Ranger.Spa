import { PropsWithChildren } from 'react';
import { Typography, makeStyles, Theme, createStyles } from '@material-ui/core';
import React from 'react';
import Block from './Block';
import { getDocsBreakpoint } from '../../../../helpers/Helpers';
import Constants from '../../../../theme/Constants';
import { EndpointBodyListItem } from './EndpointBodyList';

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
