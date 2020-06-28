import ReactMarkdown from 'react-markdown';
import React from 'react';
import markdownRetrieverHOC from '../hoc/MarkdownRetrieverHOC';
import { DocumentationSectionEnum } from '../../../models/landing/DocumentationSectionEnum';
import IDocumentationProps from './IDocumentationProps';

class GettingStarted extends React.Component<IDocumentationProps> {
    render() {
        return <ReactMarkdown source={this.props.sectionContent} />;
    }
}

export default markdownRetrieverHOC(DocumentationSectionEnum.GETTING_STARTED, GettingStarted);
