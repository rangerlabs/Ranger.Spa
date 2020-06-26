import ReactMarkdown from 'react-markdown';
import React from 'react';

export default function GettingStarted(props: any) {
    return <ReactMarkdown source={`url('https://raw.githubusercontent.com/rangerlabs/Ranger.Docs/master/GettingStarted.md')`} />;
}
