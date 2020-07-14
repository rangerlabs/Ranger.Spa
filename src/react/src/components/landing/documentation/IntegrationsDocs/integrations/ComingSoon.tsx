import React from 'react';
import SectionHeader from '../../docComponents/SectionHeader';
import Block from '../../docComponents/Block';
import Paragraph from '../../docComponents/Paragraph';

const ComingSoon = function () {
    return (
        <React.Fragment>
            <SectionHeader text="Coming Soon" id="coming-soon" />
            <Block>
                <Paragraph>Third-party Integrations are in the works and will be arriving soon. Stay tuned.</Paragraph>
            </Block>
        </React.Fragment>
    );
};

export default ComingSoon;
