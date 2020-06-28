import * as React from 'react';
import Loading from '../../loading/Loading';
import { DocumentationSectionEnum } from '../../../models/landing/DocumentationSectionEnum';
import GithubService from '../../../services/GithubService';

const githubService = new GithubService();

interface PopulateProjectsComponentState {
    wasError: boolean;
    content: string;
    isLoaded: boolean;
}

const markdownRetrieverHOC = <P extends object>(section: DocumentationSectionEnum, Component: React.ComponentType<P>) => {
    class MarkdownRetrieverComponent extends React.Component<PopulateProjectsComponentState> {
        state: PopulateProjectsComponentState = {
            wasError: false,
            isLoaded: false,
            content: '',
        };

        componentDidMount() {
            githubService.getSection(section).then((sectionContentResponse) => {
                if (sectionContentResponse.isError) {
                    this.setState({ wasError: true });
                } else {
                    this.setState({ content: sectionContentResponse.result, isLoaded: true });
                }
            });
        }

        render() {
            return this.state.isLoaded && !this.state.wasError ? (
                <Component sectionContent={this.state.content} {...(this.props as P)} />
            ) : (
                <Loading wasError={this.state.wasError} />
            );
        }
    }

    return MarkdownRetrieverComponent;
};

export default markdownRetrieverHOC;
