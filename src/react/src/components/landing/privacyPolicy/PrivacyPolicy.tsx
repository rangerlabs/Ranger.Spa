import * as React from 'react';
import { Grid, createStyles, Theme, makeStyles, Typography, Paper, Link } from '@material-ui/core';
import Footer from '../footer/Footer';
import GetStartedForFree from '../getStartedForFree/GetStartedForFree';
import Section from '../documentation/docComponents/Section';
import Introduction from '../documentation/docComponents/Introduction';
import Paragraph from '../documentation/docComponents/Paragraph';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import RoutePaths from '../../RoutePaths';
import { UnorderedList } from '../documentation/docComponents/UnorderedList';
import Bold from '../documentation/textEnhancers/Bold';
import Block from '../documentation/docComponents/Block';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        push: {
            paddingTop: '3%',
        },
    })
);

interface PrivacyPolicyProps {
    push: typeof push;
}
const endUserPersonalData = [
    'Precise location (e.g., GPS-level) data, such as latitude, longitude, accuracy, altitude, speed, heading',
    'Mobile advertising identifiers (e.g., Apple IDFA, Android advertising ID)',
    'IP addresses',
    'Device information (e.g., device make, device model, operating system version, Apple IDFV, Android ID)',
    'Time zone information',
    'Privacy preferences',
];
const sdkInformation = [
    'We share the SDK Information with our Clients in order to provide our Services to them.',
    "We may share the SDK Information with the End User that is the subject of the SDK Information, upon Client's request.",
    "We share the SDK Information with our integration partners on Client's behalf and request in order to provide the Services to our Clients.",
];
const collectedInformation = [
    'First and last name',
    'Email address',
    'Phone number',
    'Company name',
    'Payment information',
    'IP address',
    'Web browser information',
    'Page view statistics',
    'Browsing history',
    'Usage information',
    'Transaction information (e.g., transaction amount, date and time such transaction occurred)',
    'Cookies and other tracking technologies (e.g. web beacons, pixel tags, SDKs, etc.)',
    'Log data (e.g., access times, hardware and software information)',
];
const informationUse = [
    'Create and manage Client profiles',
    'Communicate with you about the Services',
    'Process orders',
    'Contact you about Service announcements, updates or offers',
    'Provide support and assistance for the Services',
    'Personalize website content and communications based on your preferences',
    'Meet contract or legal obligations',
    'Respond to Client inquiries',
    'Fulfill Client requests',
    'Comply with our legal or contractual obligations',
    'Resolve disputes',
    'Protect against or deter fraudulent, illegal or harmful actions',
    'Enforce our Terms',
];
const contractualNecessity = ['First and last name', 'Email address', 'Payment information', 'IP addresses'];
const legitimateInterest = ['Email address', 'Payment information', 'IP address'];
const legitimateInterestExamples = [
    'Operation and improvement of our business, products and services',
    'Marketing of our products and services',
    'Provision of customer support',
    'Protection from fraud or security threats',
    'Compliance with legal obligations',
    'Completion of corporate transactions',
];
const shareDataWith = [
    'Payment processors',
    'Analytics service providers',
    'Email marketing and management service providers',
    'Customer support providers',
    'Hosting service providers',
];
const shareDataWithIncludes = ['Third party business partners who you access through the Services', 'Other parties authorized by you'];
const shareCompliesWIth = [
    'Comply with applicable law or respond to valid legal process, including from law enforcement or other government agencies',
    'Protect us, our business or our users, for example to enforce our terms of service, prevent spam or other unwanted communications and investigate or protect against fraud',
    'Maintain the security of our products and services',
    'Last, we share Personal Data with our affiliates or other members of our corporate family.',
];
const rights = [
    'Access: You can request more information about the Personal Data we hold about you and request a copy of such Personal Data. You can also access certain of your Personal Data by going into your account and going into the account settings and preferences tab and adjust your preferences and see our Personal Data.',
    'Rectification: If you believe that any Personal Data we are holding about you is incorrect or incomplete, you can request that we correct or supplement such data. You can correct some of this information directly by going into your account and going into the account settings and preferences tab and adjust your preferences and see our Personal Data.',
    'Erasure: You can request that we erase some or all of your Personal Data from our systems.',
    'Withdrawal of Consent: If we are processing your Personal Data based on your consent (as indicated at the time of collection of such data), you have the right to withdraw your consent at any time. Please note, however, that if you exercise this right, you may have to then provide express consent on a case-by-case basis for the use or disclosure of certain of your Personal Data, if such use or disclosure is necessary to enable you to utilize some or all of our Services.',
    'Portability: You can ask for a copy of your Personal Data in a machine-readable format. You can also request that we transmit the data to another controller where technically feasible.',
    'Objection: You can contact us to let us know that you object to the further use or disclosure of your Personal Data for certain purposes.',
    'Restriction of Processing: You can ask us to restrict further processing of your Personal Data.',
    "Right to File Complaint: You have the right to lodge a complaint about Company's practices with respect to your Personal Data with the supervisory authority of your country or EU Member State.",
];

function PrivacyPolicy(props: PrivacyPolicyProps) {
    const classes = useStyles(props);
    const push = props.push;

    return (
        <React.Fragment>
            <Grid className={classes.push} container direction="column" alignItems="center" spacing={5}>
                <Grid container item justify="center">
                    <Grid item xs={12}>
                        <Typography align="center" variant="h4">
                            Privacy Policy
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={11} md={6}>
                    <Introduction id="Introduction" text="">
                        <Paragraph>
                            Ranger Labs, a Limited Liability Company (<Bold>"Ranger,"</Bold> <Bold>"we,"</Bold> <Bold>"us,"</Bold> and
                            <Bold>"our"</Bold>), provides this privacy policy (<Bold>"Privacy Policy"</Bold>) because we believe that consumers should clearly
                            understand how their information and data is collected and used. This Privacy Policy covers our treatment of information that can be
                            used to individually identify a person (<Bold>"Personal Data"</Bold>), which includes data and information that we gather through
                            our Services, but not to the practices of companies we don't own or control, or people that we don't manage.
                        </Paragraph>
                        <Paragraph>
                            <Bold>
                                By using or accessing the Services in any manner, you acknowledge that you accept the practices and policies outlined in this
                                Privacy Policy and you hereby consent that we will collect, use, and share data and information in the following ways.
                            </Bold>
                        </Paragraph>
                        <Paragraph>
                            Remember that your use of Ranger's Services is at all times subject to the Ranger Terms of Use (<Bold>"Terms"</Bold>) available at{' '}
                            <Link variant="body1" component="button" onClick={() => push(RoutePaths.TermsOfUse)}>
                                https://rangerlabs.io/terms
                            </Link>
                            , which incorporates this Privacy Policy. Any terms we use in this Privacy Policy without defining them have the definitions given
                            to them in the Terms.
                        </Paragraph>
                    </Introduction>
                    <Section id="introduction" text="1. Introduction">
                        <Paragraph>
                            Ranger offers its Services to application developers. Ranger's Services allow developers to collect, analyze, and act on location
                            data collected from individual devices. All of Ranger's developers and partners are referred to collectively as our{' '}
                            <Bold>"Clients."</Bold>
                        </Paragraph>
                        <Paragraph>
                            This Privacy Policy explains how we may collect, use, store, and disclose information about the end users (<Bold>"End Users"</Bold>)
                            of third-party mobile applications that use our Services as well as our Clients.
                        </Paragraph>
                        <Paragraph>
                            This Privacy Policy covers our processing of Personal Data that we gather when you are accessing or using our Services, but not to
                            the practices of companies we don't own or control, or people that we don't manage. As used in this Privacy Policy,{' '}
                            <Bold>"Personal Data"</Bold>
                            means any information that can be used to individually identify a person, and "processing" generally covers actions that can be
                            performed in connection with data such as collection, use, storage and disclosure.
                        </Paragraph>
                        <Paragraph>
                            We gather various types of Personal Data from our users, as explained in more detail below, and we use this Personal Data internally
                            in connection with our Services, including to personalize, provide, and improve our services, to allow you to set up a user account
                            and profile, to contact you and allow other users to contact you, to fulfill your requests for certain products and services, and to
                            analyze how you use the Services. In certain cases, we may also share some Personal Data with third parties, but only as described
                            below.
                        </Paragraph>
                        <Paragraph>
                            If you are a resident of the European Union (<Bold>"EU"</Bold>), United Kingdom, Lichtenstein, Norway, or Iceland, you may have
                            additional rights under the EU General Data Protection Regulation (the <Bold>"GDPR"</Bold>) with respect to your Personal Data, as
                            outlined below. Ranger Labs, LLC may be the controller of your Personal Data processed in connection with the Services. If you have
                            any questions about this section or whether any of the following applies to you, please contact us at{' '}
                            <Link href="mailto:legal@rangerlabs.io" variant="body1">
                                legal@rangerlabs.io
                            </Link>
                            . Note that we may also process Personal Data of our customers' end users in connection with our provision of services to customers,
                            in which case we are the processor of Personal Data. If we are the processor of your Personal Data (i.e., not the controller),
                            please contact the controller party in the first instance to address your rights with respect to such data.
                        </Paragraph>
                    </Section>
                    <Section id="end-user-information" text="2. End User Information">
                        <Paragraph>
                            We refer to the information we collect from End Users automatically through our Services on behalf of our Clients as the{' '}
                            <Bold>"SDK Information."</Bold> We only use SDK Information to provide the Services to our Clients, and for no other purpose. We
                            will not sell or provide access to your SDK Information to any third party without your consent. The SDK Information may include,
                            without limitation, the following types of data, some of which may be Personal Data:
                        </Paragraph>
                        <Block>
                            <UnorderedList items={endUserPersonalData} />
                        </Block>
                        <Paragraph>We may additionally share the SDK Information with third parties in the following ways:</Paragraph>
                        <Block>
                            <UnorderedList items={sdkInformation} />
                        </Block>
                        <Paragraph>
                            This Privacy Policy does not apply to SDK Information or to the products, services and applications of our Clients (
                            <Bold>"Client Services"</Bold>), and we are not responsible for our Clients' handling of SDK Information. Our Clients have their own
                            policies regarding the collection, use and disclosure of your Personal Data. To learn about how a particular Client handles your
                            personal information, we encourage you to read the Client's privacy statement. Our use of SDK Information provided by our Clients in
                            connection with our Services is subject to the written agreement between us and Client.
                        </Paragraph>
                    </Section>
                    <Section id="information-we-collect" text="3. Information We Collect From You">
                        <Paragraph>
                            If you are a Client, we collect your Personal Data when you sign up, and register for, the Services (
                            <Bold>"Client Information"</Bold>). The Client Information may include, without limitation, the following types of data, some of
                            which may be Personal Data:
                        </Paragraph>
                        <Block>
                            <UnorderedList items={collectedInformation} />
                        </Block>
                        <Paragraph>
                            <Bold>Cookies.</Bold> When you visit our sites, we will send you a cookie, which is a small file stored on your computer that allows
                            us to uniquely identify it. Where required by applicable law, we obtain your consent for the use of cookies. You may choose to
                            delete or not accept our cookies as described in this privacy policy. If you delete or choose not to accept our cookies, you may not
                            be able to utilize all the features of our products and services. If you are a resident of the EU or other jurisdiction that
                            requires us to obtain your consent to use cookies on our sites, then you will have an opportunity to manage your cookie preferences
                            on such sites; except that certain cookies are essential to enable core site functionality, and you cannot choose to disable those
                            cookies. Through cookies we place on your browser or device, we may collect information about your online activity after you leave
                            our Services. Just like any other usage information we collect, this information allows us to improve the Services and customize
                            your online experience, and otherwise as described in this Privacy Policy. Your browser may offer you a "Do Not Track" option, which
                            allows you to signal to operators of websites and web applications and services (including behavioral advertising services) that you
                            do not wish such operators to track certain of your online activities over time and/or across different websites. Our Services do
                            not support Do Not Track requests at this time, which means that we collect information about your online activity both while you
                            are using the Services and after you leave our Services.
                        </Paragraph>
                        <Paragraph>
                            <Bold>Third Party Analytics.</Bold> Our Services may use third party analytics tools, such as Segment, Google Analytics, and
                            Amplitude (the <Bold>"Analytics Providers"</Bold>), that use cookies, web beacons, or other similar information gathering
                            technologies to collect standard internet log information and usage information. The information generated is used to compile
                            statistical reports on user activity. The Analytics Providers collects information such as how often users visit a website, what
                            pages they visit when they do so, and what other websites they visited prior to coming to a website. We use the information obtained
                            from these applications only to improve our Services and our product and service offerings. The information generated about your use
                            of our Services will be transferred and saved to the vendor's server in the United States.
                        </Paragraph>
                    </Section>
                    <Section id="personal-data-use" text="4. How We Use Your Personal Data">
                        <Paragraph>
                            We process Client Information to operate, improve, understand and personalize our Services. For example, we use Client Information
                            to:
                        </Paragraph>
                        <Block>
                            <UnorderedList items={informationUse} />
                        </Block>
                        <Paragraph>
                            We will only process your Client Information if we have a lawful basis for doing so. Lawful bases for processing include consent,
                            contractual necessity and our "legitimate interests" or the legitimate interest of others, as further described below.
                        </Paragraph>
                        <Paragraph>
                            <Bold>Contractual Necessity:</Bold> We process the following categories of Client Information as a matter of "contractual
                            necessity", meaning that we need to process the data to perform under our Terms of Service with you, which enables us to provide you
                            with the Services. When we process data due to contractual necessity, failure to provide such Client Information will result in your
                            inability to use some or all portions of the Services that require such data.
                        </Paragraph>
                        <Block>
                            <UnorderedList items={contractualNecessity} />
                        </Block>
                        <Paragraph>First and last name Email address Payment information IP addresses</Paragraph>
                        <Paragraph>
                            Legitimate Interest: We process the following categories of Client Information when we believe it furthers the legitimate interest
                            of us or third parties.
                        </Paragraph>
                        <Block>
                            <UnorderedList items={legitimateInterest} />
                        </Block>
                        <Paragraph>Examples of these legitimate interests include:</Paragraph>
                        <Block>
                            <UnorderedList items={legitimateInterestExamples} />
                        </Block>
                        <Paragraph>
                            <Bold>Consent:</Bold> In some cases, we process Personal Data based on the consent you expressly grant to us at the time we collect
                            such data, for example marketing and promotional emails. When we process Personal Data based on your consent, it will be expressly
                            indicated to you at the point and time of collection.
                        </Paragraph>
                        <Paragraph>
                            <Bold>Other Processing Grounds:</Bold> From time to time we may also need to process Personal Data to comply with a legal
                            obligation, if it is necessary to protect the vital interests of you or other data subjects, or if it is necessary for a task
                            carried out in the public interest.
                        </Paragraph>
                        <Paragraph>
                            <Bold>Information that's no longer personally identifiable.</Bold> We may anonymize your Personal Data so that you are not
                            individually identified, and provide that information to our partners. We may also provide aggregate usage information to our
                            partners, who may use such information to understand how often and in what ways people use our Services, so that they, too, can
                            provide you with an optimal online experience. However, we never disclose aggregate usage information to a partner in a manner that
                            would identify you personally, as an individual. For example, we currently use Analytics Providers to perform and support our
                            marketing and analytics functions as described in this Privacy Policy.
                        </Paragraph>
                    </Section>
                    <Section id="personal-data-share" text="5. With Whom We Share Your Personal Data">
                        <Paragraph>
                            We may share Client Information with vendors, third party service providers and agents who work on our behalf and provide us with
                            services related to the purposes described in this Privacy Policy or our Terms. These parties may include:
                        </Paragraph>
                        <Block>
                            <UnorderedList items={shareDataWith} />
                        </Block>
                        <Paragraph>
                            We also share Client Information when necessary to complete a transaction initiated or authorized by you or provide you with a
                            product or service you have requested. In addition to those set forth above, these parties also include:
                        </Paragraph>
                        <Block>
                            <UnorderedList items={shareDataWithIncludes} />
                        </Block>
                        <Paragraph>
                            We also share information with third parties when you have given us consent to do so (as indicated at the point such information is
                            collected). We also share Personal Data when we believe it is necessary to:
                        </Paragraph>
                        <Block>
                            <UnorderedList items={shareCompliesWIth} />
                        </Block>
                        <Paragraph>
                            Furthermore, if we choose to buy or sell assets, user information is typically one of the transferred business assets. Moreover, if
                            we, or substantially all of our assets, were acquired, or if we go out of business or enter bankruptcy, user information would be
                            one of the assets that is transferred or acquired by a third party, and we would share Personal Data with the party that is
                            acquiring our assets. You acknowledge that such transfers may occur, and that any acquirer of us or our assets may continue to use
                            your Personal Data as set forth in this policy.
                        </Paragraph>
                    </Section>
                    <Section id="consumer-control" text="6. Consumer Control and Opt Out Options">
                        <Paragraph>
                            End Users can opt out of sharing their location by turning off location services. On iOS, go to Settings &gt; Privacy &gt; Location
                            Services. On Android, go to Settings &gt; Location. When you opt out of location sharing, the Services no longer collect any
                            location based-data from your device.
                        </Paragraph>
                        <Paragraph>
                            End Users can also opt out of sharing their mobile advertising identifiers. On iOS, go to Settings &gt; Privacy &gt; Advertising and
                            turn on "Limit Ad Tracking." On Android, go to Settings &gt; Google &gt; Ads and turn on "Opt Out of Ads Personalization."
                        </Paragraph>
                        <Paragraph>
                            If End Users opt out of sharing the aforementioned data with us, please note that the Services provided may be affected and some
                            features may be unavailable.
                        </Paragraph>
                        <Paragraph>Please note that the instructions above may change.</Paragraph>
                    </Section>
                    <Section id="eu-us-swiss-us" text="7. Notice of EU-U.S. and Swiss-U.S. Privacy Shield Participation">
                        <Paragraph>
                            Ranger has certified to the EU-U.S. and Swiss-U.S. Privacy Shield Frameworks set forth by the U.S. Department of Commerce regarding
                            the collection and use of Personal Data transferred from the EU and Switzerland. For more information about the Privacy Shield
                            Program, and to view Ranger's certification, please visit{' '}
                            <Link href="https://www.privacyshield.gov" variant="body1">
                                https://www.privacyshield.gov
                            </Link>
                            . Ranger is committed to the Privacy Shield Principles of (1) notice, (2) consent, (3) accountability for onward transfer, (4)
                            security, (5) data integrity and purpose limitation, (6) access and (7) recourse, enforcement and liability with respect to all
                            Personal Data received from within the EU in reliance on the Privacy Shield. The Privacy Shield Principles require that we remain
                            potentially liable if any third party processing Personal Data on our behalf fails to comply with these Privacy Shield Principles
                            (except to the extent we are not responsible for the event giving rise to any alleged damage). Ranger's compliance with the Privacy
                            Shield is subject to the investigatory and enforcement powers of the U.S. Federal Trade Commission.
                        </Paragraph>
                        <Paragraph>
                            The Services are hosted and operated in the United States ("U.S.") through Ranger and its service providers, and laws in the U.S.
                            may differ from the laws where you reside. By using the Services, you acknowledge that any Personal Data about you and End Users,
                            regardless of whether provided by you or obtained from a third-party, is being provided to Ranger in the U.S. and will be hosted on
                            U.S. servers, and you authorize Ranger to transfer, store and process your information to and in the U.S., and possibly other
                            countries. You hereby consent to the transfer of your data to the U.S. pursuant to the EU-U.S. and Swiss-U.S. Privacy Shield
                            Frameworks.
                        </Paragraph>
                    </Section>
                    <Section id="data-access" text="8. Data Access and Retention">
                        <Paragraph>
                            Generally speaking, we retain the SDK Information for as long as necessary to achieve our objectives as detailed in this Privacy
                            Policy, and to comply with our legal obligations, resolve disputes, and enforce our Terms and other agreements.
                        </Paragraph>
                        <Paragraph>
                            You can contact us at{' '}
                            <Link href="mailto:legal@rangerlabs.io" variant="body1">
                                legal@rangerlabs.io
                            </Link>{' '}
                            if you have any other questions about access to, or correction or deletion of, your Personal Data or SDK Information.
                        </Paragraph>
                        <Paragraph>
                            California Privacy Rights: Under California Civil Code sections 1798.83-1798.84, California residents are entitled to ask us for a
                            notice identifying the categories of personal customer information which we share with our affiliates and/or third parties for
                            marketing purposes, and providing contact information for such affiliates and/or third parties. If you are a California resident and
                            would like a copy of this notice, please submit a written request to the following address: Ranger Labs, LLC, 3423 Fairmount Blvd,
                            Cleveland Heights, OH 44118
                        </Paragraph>
                        <Paragraph></Paragraph>
                    </Section>
                    <Section id="personal-data-of-children" text="9. Personal Data of Children">
                        <Paragraph>
                            As noted in the Terms, we do not knowingly collect or solicit personal information from anyone under the age of 13. Please do not
                            send any personal information about any children under the age of 13 to us. If we learn that we have collected personal information
                            from a child under age 13, we will delete that information as quickly as possible. If you believe that a child under 13 may have
                            provided us personal information, please contact us at{' '}
                            <Link href="mailto:legal@rangerlabs.io" variant="body1">
                                legal@rangerlabs.io
                            </Link>
                            .
                        </Paragraph>
                    </Section>
                    <Section id="data-security" text="10. Data Security">
                        <Paragraph>
                            We have administrative, technical, and physical safeguards in place in our physical facilities and in our computer systems,
                            databases, and communications networks that are intended to protect information contained within our systems (including SDK
                            Information) against unauthorized loss, misuse, or alteration. However, no method of electronic transmission or storage is 100%
                            secure. Therefore, we cannot guarantee absolute security of your personal information and other information and data.
                        </Paragraph>
                    </Section>
                    <Section id="third-party-sites" text="11. Third-Party Websites and Applications">
                        <Paragraph>
                            We are not responsible for the privacy practices or disclosures of our Clients or any other websites and applications that use our
                            Services. Likewise, when you access the Ranger Website, you may be directed to other websites that are also beyond our control. We
                            encourage you to read the applicable privacy policies and terms and conditions of such third parties and websites, and the industry
                            tools that we have referenced in this Privacy Policy. This Privacy Policy, however, only applies to the Ranger Website and Services.
                        </Paragraph>
                    </Section>
                    <Section id="eu-residents" text="12. EU Residents">
                        <Paragraph>
                            If you are a resident of the European Union (<Bold>"EU"</Bold>), United Kingdom, Lichtenstein, Norway, or Iceland, you may have
                            additional rights under the EU General Data Protection Regulation (the <Bold>"GDPR"</Bold>) with respect to your Personal Data, as
                            outlined below.
                        </Paragraph>
                        <Paragraph>
                            For this section, we use the terms "Personal Data" and "processing" as they are defined in the GDPR, but "Personal Data" generally
                            means information that can be used to individually identify a person, and "processing" generally covers actions that can be
                            performed in connection with data such as collection, use, storage and disclosure. Company will be the controller of your Personal
                            Data processed in connection with the Services.
                        </Paragraph>
                        <Paragraph>
                            If there are any conflicts between this section and any other provision of this Privacy Policy, the policy or portion that is more
                            protective of Personal Data shall control to the extent of such conflict. If you have any questions about this section or whether
                            any of the following applies to you, please contact us at{' '}
                            <Link href="mailto:ranger@gdpr-rep.eu" variant="body1">
                                ranger@gdpr-rep.eu
                            </Link>
                            . For purposes of this section only, Personal Data shall be limited to Client Information.
                        </Paragraph>
                        <Paragraph>
                            <Bold>What Personal Data Do We Collect From You?</Bold> Please see the Section "Information We Collect From You" above for details
                            of the Personal Data we collect.
                        </Paragraph>
                        <Paragraph>
                            <Bold>Information we collect directly from you:</Bold> We receive Personal Data directly from you when you provide us with such
                            Personal Data.
                        </Paragraph>
                        <Paragraph>
                            <Bold>How Do We Use Your Personal Data?</Bold> Please refer to the Section "With Whom We Share Your Personal Data" above for details
                            on how we use and process your Personal Data.
                        </Paragraph>
                        <Paragraph>
                            <Bold>How Long Do We Retain Your Personal Data?</Bold> We retain Personal Data about you for as long as you have an open account
                            with us or as otherwise necessary to provide you Services. In some cases we retain Personal Data for longer, if doing so is
                            necessary to comply with our legal obligations, resolve disputes or collect fees owed, or is otherwise permitted or required by
                            applicable law, rule or regulation. Afterwards, we retain some information in a depersonalized or aggregated form but not in a way
                            that would identify you personally. We also may retain your information during the period of time needed for us to pursue our
                            legitimate business interests, conduct audits, comply with our legal obligations, resolve disputes and enforce our agreements.
                        </Paragraph>
                        <Paragraph>
                            <Bold>What Rights Do You Have Regarding Your Personal Data?</Bold> You have certain rights with respect to your Personal Data,
                            including those set forth below. For more information about these rights, or to submit a request, please contact us at
                            ranger@gdpr-rep.eu. Please note that in some circumstances, we may not be able to fully comply with your request, such as if it is
                            frivolous or extremely impractical, if it jeopardizes the rights of others, or if it is not required by law, but in those
                            circumstances, we will still respond to notify you of such a decision. In some cases, we may also need to you to provide us with
                            additional information, which may include Personal Data, if necessary to verify your identity and the nature of your request.
                        </Paragraph>
                        <Block>
                            <UnorderedList items={rights} />
                        </Block>
                    </Section>
                    <Section id="questions-concerns-complaints" text="13. Questions, Concerns, or Complaints">
                        <Paragraph>
                            If you have any questions or concerns regarding privacy using the Services or about our Privacy Shield Certification, please send us
                            a detailed message to{' '}
                            <Link href="mailto:legal@rangerlabs.io" variant="body1">
                                legal@rangerlabs.io
                            </Link>
                            , and we will make every attempt to resolve your concerns. If you do not receive timely acknowledgment of your Privacy
                            Shield-related complaint from us, or if we have not resolved your complaint, you may also resolve a Privacy Shield-related complaint
                            through our third-party dispute resolution provider located in the United States. You can visit{' '}
                            <Link variant="body1" href="https://feedback-form.truste.com/watchdog/request">
                                https://feedback-form.truste.com/watchdog/request
                            </Link>{' '}
                            for more information or to file a complaint, at no cost to you. Under certain conditions, you may also be entitled to invoke binding
                            arbitration for complaints not resolved by other means.
                        </Paragraph>
                    </Section>
                    <Section id="contacting-us" text="14. Contacting Us">
                        <Paragraph>
                            If you have any questions regarding this Privacy Policy, or would like to request that we delete any SDK Information about you that
                            is collected or stored through the Services, please contact us at{' '}
                            <Link href="mailto:legal@rangerlabs.io" variant="body1">
                                legal@rangerlabs.io
                            </Link>
                            .
                        </Paragraph>
                        <Paragraph>
                            We have also appointed an external data protection officer to contact directly for any questions or concerns about our personal data
                            policies or practices. Please contact Arno Schlösser at arno@dp-dock.com.
                        </Paragraph>
                    </Section>
                    <Section id="changes" text="15. Changes">
                        <Paragraph>
                            We may make changes to this Privacy Policy in our sole discretion from time to time. When we do, we will revise the "last updated"
                            date given below. It is your responsibility to review this Privacy Policy frequently and to remain informed of any changes. The
                            then-current version of this Privacy Policy will supersede all earlier versions. You agree that your continued use of the Services
                            after such changes have been published to will constitute your acceptance of the revised Privacy Policy.
                        </Paragraph>
                    </Section>
                    <Paragraph>Last updated: September 12, 2020</Paragraph>
                </Grid>
            </Grid>
            <GetStartedForFree />
            <Footer />
        </React.Fragment>
    );
}

export default connect(null, { push })(PrivacyPolicy);
