import * as React from 'react';
import { Grid, createStyles, Theme, makeStyles, Typography, Paper, Link } from '@material-ui/core';
import Footer from '../footer/Footer';
import GetStartedForFree from '../getStartedForFree/GetStartedForFree';
import Section from '../documentation/docComponents/Section';
import Introduction from '../documentation/docComponents/Introduction';
import Paragraph from '../documentation/docComponents/Paragraph';
import RoutePaths from '../../RoutePaths';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import Bold from '../documentation/textEnhancers/Bold';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        push: {
            paddingTop: '3%',
        },
    })
);

interface DataProcessingAddendumProps {
    push: typeof push;
}

function DataProcessingAddendum(props: DataProcessingAddendumProps) {
    const classes = useStyles(props);
    const push = props.push;

    return (
        <React.Fragment>
            <Grid className={classes.push} container direction="column" alignItems="center" spacing={5}>
                <Grid container item justify="center">
                    <Grid item xs={12}>
                        <Typography align="center" variant="h4">
                            EU Data Processing Addendum
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={11} md={6}>
                    <Introduction id="Introduction" text="">
                        <Paragraph>
                            <Bold>
                                PLEASE READ THIS EU DATA PROCESSING ADDENDUM ("ADDENDUM") CAREFULLY BEFORE USING THE WEBSITE, SOFTWARE OR SERVICES OFFERED BY
                                RANGER LABS, LLC ("RANGER" OR "PROCESSOR"). THIS ADDENDUM SHALL APPLY TO THE EXTENT RANGER IS A PROCESSOR OF PERSONAL DATA
                                (DEFINED BELOW) THAT IS SUBJECT TO CERTAIN DATA PROTECTION LAWS (DEFINED BELOW). YOU OR THE ENTITY YOU REPRESENT ("CUSTOMER" OR
                                "CONTROLLER") AGREE THAT YOU HAVE READ AND ACCEPT THE TERMS IN THIS ADDENDUM, WHICH SUPPLEMENT RANGER'S TERMS OF USE AVAILABLE
                                AT{' '}
                                <Link component="button" onClick={() => push(RoutePaths.TermsOfUse)}>
                                    https://rangerlabs.io/terms
                                </Link>{' '}
                                ("TERMS OF USE" OR "AGREEMENT"). IF YOU ARE ACCESSING THE SERVICES ON BEHALF OF YOUR EMPLOYER, YOU REPRESENT AND WARRANT THAT
                                YOU HAVE THE AUTHORITY TO AGREE TO THESE TERMS ON ITS BEHALF AND THE RIGHT TO BIND YOUR EMPLOYER THERETO. IF EITHER YOU OR YOUR
                                EMPLOYER DO NOT UNCONDITIONALLY AGREE TO ALL THE TERMS AND CONDITIONS OF THIS ADDENDUM, YOU HAVE NO RIGHT TO USE RANGER'S
                                SERVICES AND MUST NAVIGATE AWAY FROM THIS PAGE.
                            </Bold>
                        </Paragraph>
                    </Introduction>
                    <Section id="definitions" text="1. Definitions">
                        <Paragraph>
                            1.1 <Bold>"Anonymous Data"</Bold> means Personal Data that has been processed in such a manner that it can no longer be attributed
                            to an identified or identifiable natural person without additional information unavailable to any third party other than Authorized
                            Subcontractors.
                        </Paragraph>
                        <Paragraph>
                            1.2 <Bold>"Authorized Employee"</Bold> means an employee of Processor who has a need to know or otherwise access Personal Data to
                            enable Processor to perform their obligations under this Addendum or the Agreement.
                        </Paragraph>
                        <Paragraph>
                            1.3 <Bold>"Authorized Individual"</Bold> means an Authorized Employee or Authorized Subcontractor.
                        </Paragraph>
                        <Paragraph>
                            1.4 <Bold>"Authorized Subcontractor"</Bold> means a third-party subcontractor, agent, reseller, or auditor who has a need to know or
                            otherwise access Personal Data to enable Processor to perform its obligations under this Addendum or the Agreement, and who is
                            either (1) listed in Exhibit B or (2) authorized by Controller to do so under Section 4.2 of this Addendum.
                        </Paragraph>
                        <Paragraph>
                            1.5 <Bold>"Data Subject"</Bold> means an identified or identifiable person to whom Personal Data relates.
                        </Paragraph>
                        <Paragraph>
                            1.6 <Bold>"Instruction"</Bold> means a direction, either in writing, in textual form (e.g., by email) or by using a software or
                            online tool, issued by Controller to Processor and directing Processor to Process Personal Data.
                        </Paragraph>
                        <Paragraph>
                            1.7 <Bold>"Personal Data"</Bold> means any information relating to Data Subject which Processor Processes on behalf of Controller
                            other than Anonymous Data, and includes Sensitive Personal Information.
                        </Paragraph>
                        <Paragraph>
                            1.8 <Bold>"Personal Data Breach"</Bold> means a breach of security leading to the accidental or unlawful destruction, loss,
                            alteration, unauthorized disclosure of, or access to, personal data transmitted, stored, or otherwise processed.
                        </Paragraph>
                        <Paragraph>
                            1.9 <Bold>"Privacy Shield Principles"</Bold> means the Swiss-U.S. and EU-U.S. Privacy Shield Framework and Principles issued by the
                            U.S. Department of Commerce, both available at https://www.privacyshield.gov/EU-US-Framework.
                        </Paragraph>
                        <Paragraph>
                            1.10 <Bold>"Process"</Bold> or <Bold>"Processing"</Bold> means any operation or set of operations which is performed upon the
                            Personal Data, whether or not by automatic means, such as collection, recording, organization, storage, adaptation or alteration,
                            retrieval, consultation, disclosure by transmission, dissemination or otherwise making available, alignment or combination,
                            blocking, erasure, or destruction.
                        </Paragraph>
                        <Paragraph>
                            1.11 <Bold>"Sensitive Personal Information"</Bold> means a Data Subject's (i) government-issued identification number (including
                            social security number, driver's license number or state-issued identification number) or email address; (ii) financial account
                            number, credit card number, debit card number, credit report information, with or without any required security code, access code,
                            personal identification number or password, that would permit access to an individual's financial account; (iii) genetic and
                            biometric data or data concerning health; or (iv) Personal Data revealing racial or ethnic origin, political opinions, religious or
                            philosophical beliefs, sexual orientation or sexual activity, criminal convictions and offences (including commission of or
                            proceedings for any offense committed or alleged to have been committed), or trade union membership.
                        </Paragraph>
                        <Paragraph>
                            1.12 <Bold>"Services"</Bold> shall have the meaning set forth in the Agreement.
                        </Paragraph>
                        <Paragraph>
                            1.13 <Bold>"Standard Contractual Clauses"</Bold> means the agreement that may be executed by and between Controller and Processor
                            pursuant to the European Commission's decision (C(2010)593) of February 5, 2010 on standard contractual clauses for the transfer of
                            personal data to processors established in third countries which do not ensure an adequate level of protection.
                        </Paragraph>
                        <Paragraph>
                            1.14 <Bold>"Supervisory Authority"</Bold> means an independent public authority which is established by a member state of the
                            European Union, Iceland, Liechtenstein, or Norway.
                        </Paragraph>
                    </Section>
                    <Section id="processing-data" text="2. Processing of Data">
                        <Paragraph>
                            2.1 The rights and obligations of the Controller with respect to this Processing are described herein. Controller shall, in its use
                            of the Services, at all times Process Personal Data, and provide instructions for the Processing of Personal Data, in compliance
                            with EU Directive 95/46/EC (the <Bold>"Directive"</Bold>), and, when effective, the General Data Protection Regulation (Regulation
                            (EU) 2016/679) (the <Bold>"GDPR"</Bold> and together, <Bold>"Data Protection Laws"</Bold>)). Controller shall ensure that its
                            instructions comply with all laws, rules and regulations applicable in relation to the Personal Data, and that the Processing of
                            Personal Data in accordance with Controller's instructions will not cause Processor to be in breach of the Data Protection Laws.
                            Controller is solely responsible for the accuracy, quality, and legality of (i) the Personal Data provided to Processor by or on
                            behalf of Controller, (ii) the means by which Controller acquired any such Personal Data, and (iii) the instructions it provides to
                            Processor regarding the Processing of such Personal Data. Controller shall not provide or make available to Processor any Personal
                            Data in violation of the Agreement or otherwise inappropriate for the nature of the Services, and shall indemnify Processor from all
                            claims and losses in connection therewith.
                        </Paragraph>
                        <Paragraph>
                            2.2 Processor shall Process Personal Data only (i) for the purposes set forth in the Agreement, (ii) in accordance with the terms
                            and conditions set forth in this Addendum and any other documented instructions provided by Controller, and (iii) in compliance with
                            the Directive, and, when effective, the GDPR. Controller hereby instructs Processor to Process Personal Data for the following
                            purposes as part of any Processing initiated by Controller in its use of the Services.
                        </Paragraph>
                        <Paragraph>
                            2.3 The subject matter, nature, purpose, and duration of this Processing, as well as the types of Personal Data collected and
                            categories of Data Subjects, are described in Exhibit A to this Addendum.
                        </Paragraph>
                        <Paragraph>
                            2.4 Following completion of the Services, at Controller's choice, Processor shall return or delete the Personal Data, except as
                            required to be retained by the laws of the European Union or European Union member states.
                        </Paragraph>
                    </Section>
                    <Section id="authorized-employees" text="3. Authorized Employees">
                        <Paragraph>
                            3.1 Processor shall take commercially reasonable steps to ensure the reliability and appropriate training of any Authorized
                            Employee.
                        </Paragraph>
                        <Paragraph>
                            3.2 Processor shall ensure that all Authorized Employees are made aware of the confidential nature of Personal Data and have
                            executed confidentiality agreements that prevent them from disclosing or otherwise Processing, both during and after their
                            engagement with Processor, any Personal Data except in accordance with their obligations in connection with the Services.
                        </Paragraph>
                        <Paragraph>
                            3.3 Processor shall take commercially reasonable steps to limit access to Personal Data to only Authorized Individuals.
                        </Paragraph>
                    </Section>
                    <Section id="authorized-subcontractors" text="4. Authorized Subcontractors">
                        <Paragraph>
                            4.1 Controller acknowledges and agrees that Processor may (1) engage the Authorized Subcontractors listed in Exhibit B to this
                            Addendum to access and Process Personal Data in connection with the Services and (2) from time to time engage additional third
                            parties for the purpose of providing the Services, including without limitation the Processing of Personal Data.
                        </Paragraph>
                        <Paragraph>
                            4.2 Processor shall notify Controller before engaging any third party other than Authorized Subcontractors to access or participate
                            in the Processing of Personal Data.
                        </Paragraph>
                        <Paragraph>
                            4.3 Processor shall ensure that all Authorized Subcontractors have executed confidentiality agreements that prevent them from
                            disclosing or otherwise Processing, both during and after their engagement by Processor, any Personal Data both during and after
                            their engagement with Processor.
                        </Paragraph>
                        <Paragraph>
                            4.4 Processor shall, by way of contract or other legal act under European Union or European Union member state law (including
                            without limitation approved codes of conduct and standard contractual clauses), ensure that every Authorized Subcontractor is
                            subject to obligations regarding the Processing of Personal Data that are no less protective than those to which the Processor is
                            subject under this Addendum.
                        </Paragraph>
                        <Paragraph>
                            4.5 Processor shall be liable to Controller for the acts and omissions of Authorized Subcontractors to the same extent that
                            Processor would itself be liable under this Addendum had it conducted such acts or omissions.
                        </Paragraph>
                    </Section>
                    <Section id="personal-data" text="5. Security of Personal Data">
                        <Paragraph>
                            5.1 Taking into account the state of the art, the costs of implementation and the nature, scope, context and purposes of Processing
                            as well as the risk of varying likelihood and severity for the rights and freedoms of natural persons, Processor shall maintain
                            appropriate technical and organizational measures to ensure a level of security appropriate to the risk of Processing Personal Data.
                        </Paragraph>
                    </Section>
                    <Section id="transfers-of-personal-data" text="6. Transfers of Personal Data">
                        <Paragraph>
                            6.1 Any transfer of Personal Data made subject to this Addendum from member states of the European Union, Iceland, Liechtenstein,
                            Norway, Switzerland or the United Kingdom to any countries which do not ensure an adequate level of data protection within the
                            meaning of the laws and regulations of these countries shall, to the extent such transfer is subject to such laws and regulations,
                            be undertaken by Processor in accordance with the Swiss-U.S. and EU-U.S. Privacy Shield Framework and Principles issued by the U.S.
                            Department of Commerce, both available at https://www.privacyshield.gov/EU-US-Framework (the{' '}
                            <Bold>"Privacy Shield Principles"</Bold>), or (b) the Standard Contractual Clauses.
                        </Paragraph>
                        <Paragraph>
                            6.2 Processor self-certifies to, and complies with, the Swiss-U.S. and EU-U.S. Privacy Shield Frameworks, as administered by the
                            U.S. Department of Commerce, and shall maintain such self-certification and compliance with respect to the Processing of Personal
                            Data transferred from member states of the European Union, Iceland, Lichtenstein, Norway, Switzerland or the United Kingdom to any
                            countries which do not ensure an adequate level of data protection within the meaning of the laws and regulations of the foregoing
                            countries for the duration of the Agreement.
                        </Paragraph>
                    </Section>
                    <Section id="rights-of-data-subjects" text="7. Rights of Data Subjects">
                        <Paragraph>
                            7.1 Processor shall, to the extent permitted by law, promptly notify Controller upon receipt of a request by a Data Subject to
                            exercise the Data Subject's right of: access, rectification, restriction of Processing, erasure, data portability, restriction or
                            cessation of Processing, withdrawal of consent to Processing, and/or objection to being subject to Processing that constitutes
                            automated decision-making (such requests individually and collectively <Bold>"Data Subject Request(s)"</Bold>).
                        </Paragraph>
                        <Paragraph>
                            7.2 Processor shall, at the request of the Controller, and taking into account the nature of the Processing applicable to any Data
                            Subject Request, apply appropriate technical and organizational measures to assist Controller in complying with Controller's
                            obligation to respond to such Data Subject Request and/or in demonstrating such compliance, where possible, provided that (i)
                            Controller is itself unable to respond without Processor's assistance and (ii) Processor is able to do so in accordance with all
                            applicable laws, rules, and regulations. Controller shall be responsible to the extent legally permitted for any costs and expenses
                            arising from any such assistance by Processor.
                        </Paragraph>
                    </Section>
                    <Section id="actions-and-access-rights" text="8. Actions and Access Requests">
                        <Paragraph>
                            8.1 Processor shall, taking into account the nature of the Processing and the information available to Processor, provide Controller
                            with reasonable cooperation and assistance where necessary for Controller to comply with its obligations under the GDPR to conduct a
                            data protection impact assessment and/or to demonstrate such compliance, provided that Controller does not otherwise have access to
                            the relevant information. Controller shall be responsible to the extent legally permitted for any costs and expenses arising from
                            any such assistance by Processor.
                        </Paragraph>
                        <Paragraph>
                            8.2 Processor shall, taking into account the nature of the Processing and the information available to Processor, provide Controller
                            with reasonable cooperation and assistance with respect to Controller's cooperation and/or prior consultation with any Supervisory
                            Authority, where necessary and where required by the GDPR. Controller shall be responsible to the extent legally permitted for any
                            costs and expenses arising from any such assistance by Processor.
                        </Paragraph>
                        <Paragraph>
                            8.3 Processor shall maintain records sufficient to demonstrate its compliance with its obligations under this Addendum, and retain
                            such records for a period of three (3) years after the termination of the Agreement. Controller shall, with reasonable notice to
                            Processor, have the right to review, audit and copy such records at Processor's offices during regular business hours.
                        </Paragraph>
                        <Paragraph>
                            8.4 Upon Controller's request and at Controller's choice, Processor shall, no more than once per calendar year, make available for
                            Controller's review copies of certifications or reports demonstrating Processor's compliance with prevailing data security standards
                            applicable to the Processing of Controller's Personal Data.
                        </Paragraph>
                        <Paragraph>
                            8.5 In the event of a Personal Data Breach, Processor shall, without undue delay, inform Controller of the Personal Data Breach and
                            take such steps as Processor in its sole discretion deems necessary and reasonable to remediate such violation (to the extent that
                            remediation is within Processor's reasonable control).
                        </Paragraph>
                        <Paragraph>
                            8.6 In the event of a Personal Data Breach, Processor shall, taking into account the nature of the Processing and the information
                            available to Processor, provide Controller with reasonable cooperation and assistance necessary for Controller to comply with its
                            obligations under the GDPR with respect to notifying (i) the relevant Supervisory Authority and (ii) Data Subjects affected by such
                            Personal Data Breach without undue delay.
                        </Paragraph>
                        <Paragraph>
                            8.7 The obligations described in Sections 8.5 and 8.6 shall not apply in the event that a Personal Data Breach results from the
                            actions or omissions of Controller.
                        </Paragraph>
                    </Section>
                    <Section id="limitations-of-liability" text="9. Limitation of Liability">
                        <Paragraph>
                            9.1 The total liability of each of Controller and Processor (and their respective employees, directors, officers, affiliates,
                            successors, and assigns), arising out of or related to this Addendum, whether in contract, tort, or other theory of liability, shall
                            not, when taken together in the aggregate, exceed the limitation of liability set forth in the Agreement.
                        </Paragraph>
                    </Section>
                    <Section id="details-of-processing" text="Exhibit A: Details of Processing">
                        <Paragraph>Nature and Purpose of Processing: Provision of services as described in Agreement</Paragraph>
                        <Paragraph>Duration of Processing: Term as described in Agreement</Paragraph>
                        <Paragraph>Categories of Data Subjects: Controller's end users</Paragraph>
                        <Paragraph>
                            Type of Personal Data: SDK Information as described in the Processor's published privacy policy at{' '}
                            <Link component="button" onClick={() => push(RoutePaths.Privacy)}>
                                https://rangerlabs.io/privacy
                            </Link>
                            .
                        </Paragraph>
                    </Section>
                    <Section id="authorized-subcontractors" text="Exhibit B: Authorized Subcontractors">
                        <Paragraph>
                            Controller acknowledges and agrees that the following entities shall be deemed Authorized Subcontractors that may Process Personal
                            Data pursuant to this Addendum:
                        </Paragraph>
                        <Paragraph>Google, LLC</Paragraph>
                        <Paragraph>MongoDB, Inc.</Paragraph>
                    </Section>
                </Grid>
            </Grid>
            <GetStartedForFree />
            <Footer />
        </React.Fragment>
    );
}

export default connect(null, { push })(DataProcessingAddendum);
