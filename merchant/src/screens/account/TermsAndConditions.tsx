import React, { useRef, useState, useCallback } from 'react';
import PopUpModal from '../../components/PopUpModal';
import Styles from '../../utils/styles';
import { FlatList, Linking, View } from 'react-native';
import { Button, Header } from '../../components';
import { Text } from '../../constants';
import { MOBILE } from '../../utils/orientation';
import {
  COLORS,
  FONT_FAMILY,
  MODAL_ANIMATION,
  WEIGHT,
} from '../../constants/theme';
import { useStyles } from './styles';
import { generateRandomId } from '../../utils';

const TermsAndConditions = ({ open, onClose, handleAccept }) => {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const flatListRef = useRef(null);
  const styles = useStyles();
  const DISCLAIMER_POINTS = [
    "The Services enable connections between you and Customers and Drivers for fulfillment of the transactions you enter into through the Sophali Platform (the 'Transactions'). Sophali is not responsible for the performance or communications of users on the site, including the performance of Customers and Drivers in relation to Transactions, nor does it have control over the quality, timing, legality, failure to provide, or any other aspect whatsoever of services provided by Customers and Drivers or other third-parties, nor of the integrity, responsibility, competence, qualifications, or any of the actions or omissions whatsoever of any Customers and Drivers, or of any ratings or reviews provided by other users.",
    'Drivers are independent business owners and independent contractors of Sophali and not employees, partners, representatives, agents, or joint venturers of Sophali. Sophali does not perform any services provided by Drivers, but rather facilitates Transactions to take place by way of the Services on the Sophali Platform and connects you with Drivers and Customers who wish to enter into Transactions with you.',
    'You are hereby made aware that there may be risks of dealing with people acting under false pretenses. Sophali uses reasonable efforts to verify the accuracy of the profile information of Customers and Drivers, however, because user verification on the Internet is difficult, Sophali cannot and does not confirm each Customer or Driver’s purported identity. We encourage you to use various means, as well as common sense, to evaluate with whom you are dealing.',
    'Sophali makes no warranties or representations about the suitability, reliability, timeliness, or accuracy of the services requested or services provided by, or the communications of or between, you and Drivers, Customers, or other third-parties identified through the Sophali Platform, whether in public or private, through on- or off-line interactions, or otherwise.',
    "You acknowledge that you are fully assuming the risks of facilitating any Transaction in connection with using the Sophali Platform or Services, and that you are fully assuming the risks of liability or harm of any kind in connection with subsequent activity of any kind relating to products or services that are the subject of Transactions in connection with the Sophali Platform or Services. Such risks shall include, but are not limited to, misrepresentation of services, fraudulent schemes, unsatisfactory quality, failure to meet specifications or regulatory and operational standards, defective or dangerous products, unlawful products, delay or default in delivery or payment, cost miscalculations, breach of warranty, breach of contract, and transportation accidents. All of the foregoing risks are hereafter referred to as 'Transaction Risks'. You agree that Sophali shall not be liable or responsible for any damages, claims, liabilities, costs, harms, inconveniences, business disruptions, or expenditures of any kind that may arise as a result of or in connection with any Transaction Risks.",
    'If you are also using the Sophali Platform as a Customer, then the Sophali Terms of Service – Customer shall apply to you in connection with such use. If you are using the Sophali Platform as a Driver, then the Sophali Terms of Service – Drivers shall also apply to you in connection with such use.',
  ];
  const Content = [
    'Violate any applicable law including any laws regarding the export of data or software, patent, trademark, trade secret, copyright, or other intellectual property, legal rights (including the rights of publicity and privacy of others) or contain any material that could give rise to any civil or criminal liability under applicable laws or that otherwise may conflict with these Terms.',
    'In any manner violate any third party right or any agreement between you and a third party.',
    'Include or contain any material that is exploitive, obscene, harmful, threatening, abusive, harassing, hateful, defamatory, sexually explicit or pornographic, violent, inflammatory, or discriminatory based on race, sex, religion, nationality, disability, sexual orientation, or age or other such legally prohibited ground or be otherwise objectionable, such determination to be made in Sophali’s sole discretion.',
    'Involve, provide, or contribute any false, inaccurate, or misleading information.',
    'Impersonate or attempt to impersonate us, our employee(s), another user, or any other person or entity (including, without limitation, by using email addresses, or screen names associated with any of the foregoing or that are not yours).',
    "Transmit, or procure the sending of, any advertisements or promotions, sales, or encourage any other commercial activities, including, without limitation, any 'spam', 'junk mail', 'chain letter', contests, sweepstakes and other sales promotions, barter, or advertising or any other similar solicitation.",
    "Encourage any other conduct that restricts or inhibits anyone's use or enjoyment of the Services, or which, as determined by us, may harm us or users of the Sophali Platform or other Services or expose them to liability.",
    'Cause annoyance, inconvenience, or needless anxiety or be likely to upset, embarrass, or alarm any other person.',
    'Promote any illegal activity, or advocate, promote, or assist any unlawful act.',
    'Give the impression that they originate from or are endorsed by us or any other person or entity, if this is not the case.',
    'Sophali has the right, without notice to:',
    'Remove or refuse to post any of Your Content for any or no reason in our sole discretion.',
    'At all times, take such actions with respect to any of Your Content Sophali deems necessary or appropriate in our sole discretion.',
    'Take appropriate legal action, including, without limitation, referral to law enforcement or any other governmental authority with respect to Your Content or your use of any of the Services. Without limiting the foregoing, we will fully cooperate with any law enforcement authorities or court order requesting or directing us to disclose the identity or other information of anyone posting any materials on or through the Sophali Platform or other Services.',
    'Sophali has no obligation, nor any responsibility to any party to monitor the Sophali Platform or other services provided by Sophali, and do not and cannot undertake to review material that you or other users submit. We cannot ensure prompt removal of objectionable material after it has been posted and we have no liability for any action or inaction regarding transmissions, communications, or content provided by any user or third party, subject to applicable laws.',
  ];
  const ReferralProgram = [
    "Membership in the Referral Program is limited to individuals with a valid account with Sophali and is limited to one account per individual. No purchase is necessary to become a member and accountholders can join the Referral Program at any time. Once you become a member, you will be considered a 'Referral Partner' of Sophali.",
    "Once you become a Referral Partner, you will receive a code ('Referral Code') as well as an attribution link you can share with others. If an individual clicks on your link or enters your Referral Code and registers to use the Sophali Platform as a merchant, you may be eligible for rewards in accordance with the Referral Program. Each user that performs a Transaction after registering using your Referral Code will become an 'Attributed User.' Each Attributed User that creates an account may get a credit they can use toward Transactions after they sign up through use of your Referral Code ('Referral Credits'). You may earn Referral Credits that can be used toward Transactions where an individual signs up using your Referral Code as well.",
    'From time to time, we may offer other ways to earn Referral Credits, including through hitting certain achievements or participating in promotional programs, but we are under no obligation to do so. Referral Credits accrued are non-transferable to other members or accounts and have no cash or monetary value – they can only be used on the Sophali Platform.',
    "Referral Credits cannot be redeemed in conjunction with any other discount code or deal. You can commence the redemption process by going to the referral portal and clicking 'redeem' on a reward that you have enough Referral Credits for.",
    'To the fullest extent permitted by applicable law, we reserve the right to terminate the Referral Program or modify, alter, limit or otherwise change the Referral Program at any time, including changes to benefits, membership eligibility and the structure and credits system. Any such modification, alternation or change will be communicated to you in accordance with these Terms. We reserve the right to exclude individuals from the Referral Program for any reason whatsoever at Sophali’s sole discretion, including for any abuse of the Referral Program, failure to follow any of these Terms, misrepresentation or any conduct detrimental to the proper functioning of the Referral Program.',
  ];
  const handleScroll = useCallback(
    event => {
      event.persist();
      const offsetY = event?.nativeEvent?.contentOffset?.y || 0;
      const contentHeight = event?.nativeEvent?.contentSize?.height || 0;
      const viewHeight = event?.nativeEvent?.layoutMeasurement?.height || 0;

      if (offsetY + viewHeight >= contentHeight - 150) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    },
    [isAtBottom],
  );
  const scrollToItem = useCallback(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [flatListRef]);

  return (
    <PopUpModal
      open={open}
      onClose={() => onClose()}
      swipeDirection={MODAL_ANIMATION.RIGHT}>
      <View style={[Styles.flex, Styles.primaryBackground]}>
        <Header title={'Terms & Conditions'} onPress={() => onClose()} />
        <View style={[Styles.flex, Styles.mT10, Styles.pH10, Styles.w100]}>
          <FlatList
            ref={flatListRef}
            style={[Styles.flex, Styles.w100]}
            data={[0]}
            contentContainerStyle={[Styles.flexGrow, Styles.pB30, Styles.w100]}
            maxToRenderPerBatch={20}
            initialNumToRender={20}
            bounces={false}
            keyExtractor={() => generateRandomId()}
            onScroll={handleScroll}
            removeClippedSubviews
            renderItem={() => (
              <View style={[Styles.flex, Styles.w100]}>
                <Text style={styles.simpleText}>
                  <Text
                    styles={styles.boldText}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    SOPHALI INC. (“Sophali”, “we”, “our” or “us”){' '}
                  </Text>
                  offers a proprietary marketplace platform that allows users
                  and merchants to perform transactions relating to the
                  purchase, acquisition and delivery of goods and services by
                  way of its mobile applications and web applications, including
                  the Sophali Apple App and the Sophali Google App
                  (collectively, the
                  <Text
                    styles={styles.boldText}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    {' '}
                    “Sophali Platform”
                  </Text>
                  ). You might access the Sophali Platform through your mobile
                  device, your computer or by other means as provided by Sophali
                  from time to time.
                </Text>

                <Text style={[styles.simpleText, Styles.mT10]}>
                  PLEASE READ THESE TERMS OF SERVICE (
                  <Text
                    styles={styles.boldText}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    “TERMS”
                  </Text>
                  ) CAREFULLY. THESE TERMS CONSTITUTE A LEGALLY BINDING
                  AGREEMENT BETWEEN YOU AND SOPHALI. THESE TERMS GOVERN YOUR
                  ACCESS TO AND USE OF THE SERVICES. BY SIGNING UP FOR AN
                  ACCOUNT, BY USING OR ACCESSING THE SOPHALI PLATFORM OR
                  OTHERWISE USING THE SERVICES, YOU AGREE TO BE BOUND BY THESE
                  TERMS (INCLUDING THE LINKED DOCUMENTS REFERRED TO IN THESE
                  TERMS), AS REVISED FROM TIME TO TIME. IF YOU DO NOT ACCEPT
                  THESE TERMS, YOU MUST NOT ACCESS OR USE THE SERVICES. IF YOU
                  ARE DISSATISFIED WITH THESE TERMS OR ANY OTHER TERMS,
                  CONDITIONS, RULES, POLICIES, GUIDELINES OR PRACTICES
                  APPLICABLE TO THE SERVICES, YOUR SOLE AND EXCLUSIVE REMEDY IS
                  TO DISCONTINUE ACCESS TO AND USE OF THE SOPHALI PLATFORM AND
                  ALL OTHER ASPECTS OF THE SERVICES. YOU REPRESENT THAT YOU ARE
                  AT LEAST THE LEGAL AGE OF MAJORITY IN YOUR JURISDICTION.
                </Text>

                <Text style={[styles.simpleText, Styles.mT10]}>
                  These Terms are effective on the earlier of the date (a) you
                  click to accept these Terms, or (b) you first sign up for an
                  account, use the Sophali Platform or otherwise use the
                  Services. You acknowledge the Sophali Privacy Statement (the{' '}
                  <Text
                    style={styles.boldText}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    {' '}
                    “Privacy Statement”{' '}
                  </Text>
                  ) located at{' '}
                  <Text
                    style={styles.underLineText}
                    color={COLORS.blue}
                    onPress={() => Linking.openURL('https://www.sophali.ca/')}>
                    www.sophali.ca
                  </Text>
                  , as revised from time to time, and you consent and agree to
                  our collection, use and disclosure of personal information as
                  described in the Privacy Statement.
                </Text>
                <Text
                  style={[styles.boldText, Styles.mT10]}
                  weight={WEIGHT.w800}
                  size={MOBILE.textSize.common}
                  fontFamily={FONT_FAMILY.SEMI_BOLD}>
                  Description of the Services.
                </Text>
                <Text style={styles.simpleText}>
                  By way of the Sophali Platform, Sophali a digital marketplace
                  and communication platform that enables you, as a merchant on
                  the Sophali Platform, to connect with third-parties to: (a)
                  market, advertise and make available for sale your goods and
                  services to end users and consumers (the “Customers”) and
                  deliver such goods and services to Customers through the use
                  of drivers and transportation carriers registered to provide
                  such services with Sophali (the “Drivers”); (b) manage, track,
                  store and deposit currency and digital assets you receive from
                  Customers; and (c) facilitate payment from Customers and to
                  Drivers, to the extent applicable, in exchange for your goods
                  and services provided to these parties; and (d) other services
                  provided by Sophali in association with the Sophali Platform,
                  as updated from time to time (paragraphs (a), (b), (c) and (d)
                  collectively are the “Services”).
                </Text>
                <Text
                  style={[styles.boldText, Styles.mT10]}
                  weight={WEIGHT.w800}
                  size={MOBILE.textSize.common}
                  fontFamily={FONT_FAMILY.SEMI_BOLD}>
                  Disclaimer{' '}
                </Text>
                <Text style={styles.simpleText}>
                  The software provided by Sophali Inc. ("Company") is intended
                  for general commercial use by merchants ("Merchants") to
                  facilitate the sale of food items to customers ("Customers").
                  The Company is not responsible for the production, quality
                  control, safety, or distribution of the food items sold by
                  Merchants using the software.{'\n\n'}The Company hereby
                  disclaims all liability for any harm, including but not
                  limited to illness, allergic reactions, discomfort, loss of
                  health, wages, lifestyle, or life, that may result from the
                  consumption of food items sold by Merchants. The Merchants are
                  solely responsible for ensuring that the food items sold
                  comply with all applicable laws and regulations and are safe
                  for consumption.{'\n\n'}By using the software, Merchants agree
                  to indemnify, defend, and hold harmless the Company from any
                  claims, damages, losses, liabilities, costs, and expenses
                  (including reasonable attorneys' fees) arising from or related
                  to the sale of food items to Customers. This indemnification
                  includes, but is not limited to, any claims of negligence,
                  product liability, or breach of warranty or contract by the
                  Merchants. Customers are encouraged to exercise due diligence
                  and care when purchasing and consuming food items.
                  {'\n\n'}The Company does not endorse any food items sold by
                  Merchants and makes no representations or warranties regarding
                  the safety or quality of such items.{'\n\n'}This disclaimer
                  shall be governed by and construed in accordance with the laws
                  of the jurisdiction in which the Company operates, without
                  giving effect to any principles of conflicts of law.
                </Text>

                {DISCLAIMER_POINTS.map((value, index) => (
                  <View
                    key={index}
                    style={[Styles.w100, Styles.flexDirectionRow, Styles.mT5]}>
                    <View style={styles.dotStyle} />
                    <Text style={[styles.simpleText, Styles.pL5]}>{value}</Text>
                  </View>
                ))}
                <Text
                  style={[styles.boldText, Styles.mT10]}
                  weight={WEIGHT.w800}
                  size={MOBILE.textSize.common}
                  fontFamily={FONT_FAMILY.SEMI_BOLD}>
                  Merchant-Specific Terms{' '}
                </Text>
                <Text style={styles.simpleText}>
                  By registering as a “merchant” to use the Services, you agree
                  to: (i) provide Sophali with your menu, including the price of
                  each item; (ii) monitor your menu and store information on the
                  Sophali Platform, promptly make updates to reflect the most
                  up-to-date products, pricing and other information or
                  immediately notify Sophali of any errors or changes in writing
                  (email is sufficient); (iii) accept and confirm orders placed
                  by Customers from the Sophali Platform in a prompt and timely
                  manner; (iv) prepare the goods and services for each order for
                  pickup by a Driver, or the Customer, as applicable, at the
                  designated time; (v) process orders in the order in which they
                  are received; (vi) notify Sophali of its days and hours of
                  operation, including on holidays, and remain open for business
                  on Sophali the same days and hours of operation as your
                  in-store business; notify Sophali of any changes to your hours
                  of operations on holidays; and notify Sophali if you close
                  earlier than your standard hours of operation or plans to
                  close earlier than your standard hours of operation; (vii)
                  notify all staff members of the relationship with Sophali, and
                  train staff members on receiving and fulfilling Sophali orders
                  as soon as practicable upon entering into these Terms and on
                  an ongoing basis; (viii) use its standard business practices
                  to prepare your goods and services that are the subject of
                  each Customer order and provide the same materials that you
                  typically would provide in a standard order happening in real
                  time outside of the Sophali Platform; (ix) on an ongoing
                  basis, review and confirm the transactions, fees and charges
                  on orders via the Sophali Platform, and promptly communicate
                  to Sophali any inaccuracies; and (x) if Sophali collects and
                  passes tips from Customers to you, you will distribute such
                  tips in accordance with applicable law, including but not
                  limited to tip pooling laws. Sophali acknowledges that you are
                  solely responsible for the prices of its menu items, which may
                  vary based on factors such as location, time of the year, or
                  competition from other restaurants.
                </Text>

                <View
                  style={[Styles.w100, Styles.flexDirectionRow, Styles.mT5]}>
                  <View style={styles.dotStyle} />
                  <Text style={[styles.simpleText, Styles.pL5]}>
                    You agree that you hold title to your goods and services
                    sold on the Sophali Platform until the goods and services
                    are picked up from your place of business, at which point
                    title passes from you to the Customer. You agree that
                    neither the Driver nor Sophali holds title or acquires any
                    ownership interest in any of your goods and services sold on
                    the Sophali Platform.
                  </Text>
                </View>

                <View
                  style={[Styles.w100, Styles.flexDirectionRow, Styles.mT5]}>
                  <View style={styles.dotStyle} />
                  <Text style={[styles.simpleText, Styles.pL5]}>
                    To the extent applicable, Sophali shall provide instructions
                    on how to integrate the Sophali Platform and use of the
                    Services with your POS system, including the installation of
                    equipment agreed upon by the parties for you to receive and
                    process orders provided by Customers when and if the
                    capability and integration is possible.
                  </Text>
                </View>

                <View
                  style={[Styles.w100, Styles.flexDirectionRow, Styles.mT5]}>
                  <View style={styles.dotStyle} />
                  <Text style={[styles.simpleText, Styles.pL5]}>
                    You agree not to access, collect, store, retain, transfer,
                    use, disclose, or otherwise process in any manner any data
                    collected through use of the Sophali Platform, including
                    without limitation Personal Information, except as required
                    to perform under these Terms. You shall maintain appropriate
                    organizational and technical measures for the protection of
                    the security, confidentiality and integrity of the Sophali
                    Platform and any information about an identifiable
                    individual (“Personal Data”) accessed or processed through
                    the Sophali Platform, and/or in connection with these Terms
                    in accordance with applicable laws. You shall promptly
                    inform Sophali and take appropriate remedial actions if you
                    become aware of any unauthorized access or use to the
                    Sophali Platform or data used or collected from its use,
                    including Personal Data, and you shall cooperate
                    investigations and potentially required notices, and provide
                    any information reasonably requested by Sophali.
                  </Text>
                </View>

                <Text style={[styles.simpleText, Styles.mT10]}>
                  <Text
                    style={[styles.boldText, Styles.mT10]}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    Your Account:
                  </Text>
                  You can register to use the Services by downloading or
                  accessing the Sophali Platform and following the registration
                  prompts. To register, you will need to include your email
                  address, password and banking information as prompted through
                  the registration process, as further detailed in our Privacy
                  Statement. You are responsible for maintaining the
                  confidentiality of your account credentials. Sophali
                  recommends that you use a strong password, that you change it
                  frequently, and that you do not reuse passwords. You agree not
                  to disclose your username or password to any third party.
                  Sophali may reject, or require that you change, your username
                  or password. You represent and warrant to Sophali that you
                  have not misrepresented any information that you have provided
                  to Sophali in connection with your­­­­­­­ account. You are
                  solely responsible for all activities that occur under your
                  account. You shall abide by all applicable local, provincial,
                  national and foreign laws, treaties and regulations in
                  connection with use of the Services, including those related
                  to data privacy, international communications and the
                  transmission of technical or personal information. If you
                  become aware of any unauthorized use of your account, you must
                  notify Sophali immediately. It is your responsibility to
                  update or change your account information, as appropriate.
                </Text>

                <Text style={[styles.simpleText, Styles.mT10]}>
                  <Text
                    style={[styles.boldText, Styles.mT10]}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    Your Privacy and Personal Information:
                  </Text>
                  For a summary of how Sophali collects, uses and discloses
                  personal information, please see Sophali’s Privacy Statement.
                </Text>

                <Text style={[styles.simpleText, Styles.mT10]}>
                  <Text
                    style={[styles.boldText, Styles.mT10]}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    License:{' '}
                  </Text>
                  Sophali grants you a personal, revocable, limited,
                  non-exclusive, royalty-free, non-transferable license to use
                  the Sophali Platform to access and use the end user
                  functionality of the Services, and the content that Sophali
                  makes available to you on the Sophali Platform, including
                  marketing materials, text, audio, video, photographs, maps,
                  illustrations, graphics, the Marks (as hereinafter defined)
                  and other media (“Content”), in each case subject to and
                  conditional on your continued compliance with the terms and
                  conditions of these Terms. All Content available through the
                  Sophali Platform is owned by Sophali and Sophali’s third-party
                  providers. All Content is provided for informational purposes
                  only, and you are solely responsible for verifying the
                  accuracy, completeness, and applicability of all Content and
                  for your use of any Content. These Terms permit you to use the
                  Services for your personal use only, and not for any
                  commercial purpose. For greater certainty, Sophali, in its
                  sole discretion, may terminate or suspend your license to use
                  some or all the Services or Content at any time, for any
                  reason or no reason, with or without notice to you, and
                  without any liability to you or any other person. If Sophali
                  terminates or suspends your license to use the some or all the
                  Services or Content, these Terms will nevertheless continue to
                  apply in respect of your use of the Services and Content prior
                  to such termination or suspension.
                </Text>

                <Text
                  style={[styles.boldText, Styles.mT10]}
                  weight={WEIGHT.w800}
                  size={MOBILE.textSize.common}
                  fontFamily={FONT_FAMILY.SEMI_BOLD}>
                  Unacceptable Use:
                </Text>
                <Text style={[styles.simpleText, Styles.mT10]}>
                  You will, and will not permit any third party to: (a) make the
                  Sophali Platform or the Services generally or the Content
                  available to, or use the Services or the Content for the
                  benefit of, anyone other than yourself, (b) sell, resell,
                  license, sublicense, distribute, make available, rent or lease
                  the Services or the Content, or include the Services or the
                  Content in a service bureau or outsourcing offering, (c) use
                  the Services to publish or transmit any content of links that
                  incite violence, depict a violent act, depict child
                  pornography, or threaten anyone’s health and safety, or to
                  store or transmit infringing, libelous, obscene, defamatory or
                  otherwise unlawful or tortious material, or to store or
                  transmit material in violation of third-party rights,
                  including intellectual property rights and privacy rights,
                  (d) use Services to send unsolicited bulk or commercial
                  messages in violation of the laws and regulations applicable
                  to your jurisdiction, or to store or transmit any virus,
                  Trojan horse, worm, or other software, script or code, the
                  effect of which is to permit unauthorized access to, or to
                  alter, disable, encrypt, erase, or otherwise harm, any
                  computer, systems, software or data (collectively, “Malicious
                  Code”), (e) interfere with or disrupt the integrity or
                  performance of the Services, (f) attempt to gain unauthorized
                  access to the Sophali Platform or Content or their related
                  systems or networks, (g) access or use any Sophali
                  intellectual property except as permitted under these Terms,
                  (h) alter, modify, reproduce, copy or make derivative works
                  from all or any part of the Sophali Platform or the Content or
                  any part, feature, function or user interface of the Sophali
                  Platform, (include any copyright, trademark, or any other
                  notices that are provided on or in connection with any
                  Content), (i) frame or mirror any part of the Sophali Platform
                  or the Content, or otherwise incorporate any portion of the
                  Sophali Platform or the Content into any product or service,
                  (j) access or use the Services, in whole or in part in order
                  to build a competitive product or service or to benchmark with
                  a non-Sophali product or service, (k) reverse engineer the
                  Sophali Platform, or any software used to provide them (to the
                  extent such restriction is permitted by applicable laws),
                  (l) access or use any part of the Services or Content that is
                  (expressly or implicitly) not intended for use by you, (m) use
                  any non-Sophali automation code in relation to the Services or
                  Content (including any “bot” or “spider”), (n) collect or
                  harvest any information from the Services or Content in a bulk
                  or systematic way, (o) remove, alter, or obscure any
                  proprietary notices on the Sophali Platform, or the Content,
                  (p) probe, scan, or test the vulnerability of the Services or
                  any network connected to them, or breach the security or
                  authentication measures on them or on any network connected to
                  them, (q) collect, harvest, reverse look-up, trace, or
                  otherwise seek to obtain any information on any other user of
                  or visitor to the Sophali Platform, (r) take any action that
                  imposes an unreasonable or disproportionately large load on
                  the infrastructure of the Services or any systems or networks
                  connected to them, or (s) forge headers, impersonate a person,
                  or otherwise manipulate identifiers in order to disguise your
                  identity or the origin of any message you send to Sophali or
                  any other person on or through the Services.
                </Text>

                <Text
                  style={[styles.boldText, Styles.mT10]}
                  weight={WEIGHT.w800}
                  size={MOBILE.textSize.common}
                  fontFamily={FONT_FAMILY.SEMI_BOLD}>
                  Your Content
                </Text>
                <View
                  style={[Styles.w100, Styles.flexDirectionRow, Styles.mT10]}>
                  <View style={styles.dotStyle} />
                  <Text style={[styles.simpleText, Styles.pL5]}>
                    The Sophali Platform enables you to provide and upload
                    content that includes but not limited to data, preferences,
                    recommendations, reviews, feedback, messages, text, images,
                    graphics, geographic data, and other information, data or
                    content (collectively,{' '}
                    <Text
                      style={styles.boldText}
                      weight={WEIGHT.w800}
                      size={MOBILE.textSize.common}
                      fontFamily={FONT_FAMILY.SEMI_BOLD}>
                      {' '}
                      "Your Content"{' '}
                    </Text>
                    ), to the Sophali Platform for the purposes of making Your
                    Content available to merchants, drivers and other users. By
                    using the Services, you acknowledge, agree and expressly
                    consent to Sophali sharing Your Content publicly and with
                    other users, with third parties and as necessary to provide
                    the Services. You acknowledge and agree that you are solely
                    responsible for all Your Content you submit, provide or
                    upload and the consequences for submitting, providing or
                    uploading it. Your Content must comply with all laws and
                    these Terms.
                  </Text>
                </View>

                <View
                  style={[Styles.w100, Styles.flexDirectionRow, Styles.mT5]}>
                  <View style={styles.dotStyle} />
                  <Text style={[styles.simpleText, Styles.pL5]}>
                    Sophali will use Your Content in connection with providing
                    the Services to you and providing Your Content to merchants,
                    drivers and other users. You agree that by providing any of
                    Your Content in whatever form and through whatever means,
                    you grant to Sophali a perpetual, worldwide, irrevocable,
                    non-exclusive, sublicensable, royalty-free license to use,
                    reproduce, process, display, publish, distribute, and make
                    available to the public all or any portion of such Your
                    Content in connection with providing the Services to you and
                    Sophali’s services to other users, and to incorporate Your
                    Content in any form into the Services. This license includes
                    the right to host, index, cache or otherwise format Your
                    Content. In posting Your Content, you represent to Sophali
                    that you have obtained at your own expense all necessary
                    consents, rights and permissions required to grant to
                    Sophali the license provided in this Section 4.2.
                  </Text>
                </View>

                <View style={[Styles.w100, Styles.flexDirectionRow]}>
                  <View style={styles.dotStyle} />
                  <Text style={[styles.simpleText, Styles.pL5]}>
                    You further grant Sophali a non-exclusive, perpetual,
                    irrevocable, royalty-free, worldwide licence to reproduce,
                    distribute, modify, create derivative works of and otherwise
                    use Your Content to create de-identified, anonymized or
                    aggregated data sets that no longer contains any information
                    that identifies you (
                    <Text
                      style={styles.boldText}
                      weight={WEIGHT.w800}
                      size={MOBILE.textSize.common}
                      fontFamily={FONT_FAMILY.SEMI_BOLD}>
                      {' '}
                      “Anonymized Data”{' '}
                    </Text>
                    ). As between Sophali and you, all right, title, and
                    interest in Anonymized Data, and all intellectual property
                    rights therein, belong to and are retained solely by
                    Sophali. You agree that Sophali may (i) make Anonymized Data
                    publicly available in compliance with applicable laws, and
                    (ii) use Anonymized Data to the extent and in the manner
                    permitted under applicable law, including to develop,
                    optimize or promote Sophali’s products or services, provided
                    that such Anonymized Data does not identify you, or include
                    any personal identifiable information that can be
                    re-identified back to you, including your wellness data.
                  </Text>
                </View>

                <View
                  style={[Styles.w100, Styles.flexDirectionRow, Styles.mT5]}>
                  <View style={styles.dotStyle} />
                  <Text style={[styles.simpleText, Styles.pL5]}>
                    You represent and warrant that you own Your Content or have
                    the necessary licenses, rights, consents and permissions to
                    grant the license set forth herein and that its provision to
                    Sophali and Sophali's use of Your Content will not violate
                    the copyrights, privacy rights, publicity rights, trademark
                    rights, contract rights or any other intellectual property
                    rights or other rights of any third party.
                  </Text>
                </View>

                <View
                  style={[Styles.w100, Styles.flexDirectionRow, Styles.mT5]}>
                  <View style={styles.dotStyle} />
                  <Text style={[styles.simpleText, Styles.pL5]}>
                    You agree that Sophali is not responsible for any violations
                    of any third-party intellectual property ­­­­­rights in any
                    of Your Content. You agree to pay all royalties, fees and
                    any other monies owing to any person by reason of the Your
                    Content uploaded, displayed or otherwise provided by you to
                    the Sophali Platform. You will only include in Your Content
                    the personal information of another individual if you have
                    the express permission of that individual or if you are
                    otherwise entitled to do so at law.
                  </Text>
                </View>

                <Text
                  style={[styles.boldText, Styles.mT5]}
                  weight={WEIGHT.w800}
                  size={MOBILE.textSize.common}
                  fontFamily={FONT_FAMILY.SEMI_BOLD}>
                  Your Content shall not:
                </Text>

                {Content.map((value, index) => (
                  <View
                    key={index}
                    style={[Styles.w100, Styles.flexDirectionRow, Styles.mT5]}>
                    <View style={styles.dotStyle} />
                    <Text style={[styles.simpleText, Styles.pL5]}>{value}</Text>
                  </View>
                ))}

                <Text
                  style={[styles.boldText, Styles.mT10]}
                  weight={WEIGHT.w800}
                  size={MOBILE.textSize.common}
                  fontFamily={FONT_FAMILY.SEMI_BOLD}>
                  Transactions:{' '}
                </Text>

                <View
                  style={[Styles.w100, Styles.flexDirectionRow, Styles.mT10]}>
                  <View style={styles.dotStyle} />
                  <Text style={[styles.simpleText, Styles.pL5]}>
                    After you have provided the services or goods purchased by
                    the Customer through use of the Services, Sophali will
                    facilitate your payment in relation to the Transaction in
                    accordance with this section. Payment through Sophali in
                    such manner shall be considered the same as payment made
                    directly to you by the Customer. Sophali may collect a
                    transaction or service fee on each Transaction that occurs
                    on the Sophali Platform. The current fee structure for
                    access to the Services can be viewed at{' '}
                    <Text
                      style={styles.underLineText}
                      color={COLORS.blue}
                      onPress={() =>
                        Linking.openURL('https://www.sophali.ca/')
                      }>
                      https://www.sophali.ca{' '}
                    </Text>
                    , [and includes user and member ship account types as well
                    as additional add-on features that may be purchased].
                    Sophali reserves the right to modify its fees related to the
                    Services and Transactions at any time upon thirty (30)
                    written notice by posting such fee changes through the
                    Services or on the Sophali Platform.
                  </Text>
                </View>

                <View
                  style={[Styles.w100, Styles.flexDirectionRow, Styles.mT5]}>
                  <View style={styles.dotStyle} />
                  <Text style={[styles.simpleText, Styles.pL5]}>
                    You shall pay all fees for Transactions taking place by way
                    of the Services through the Sophali Platform, Unless
                    otherwise specified by Sophali, such fees shall be payable
                    upon completion of the Transaction, and are non-refundable.
                  </Text>
                </View>

                <View
                  style={[Styles.w100, Styles.flexDirectionRow, Styles.mT5]}>
                  <View style={styles.dotStyle} />
                  <Text style={[styles.simpleText, Styles.pL5]}>
                    At our discretion, we may offer free or discounted pricing
                    for use of the Services by you (a
                    <Text
                      styles={styles.boldText}
                      weight={WEIGHT.w800}
                      size={MOBILE.textSize.common}
                      fontFamily={FONT_FAMILY.SEMI_BOLD}>
                      {' '}
                      “Discount Program”{' '}
                    </Text>
                    ). Once the terms of any Discount Program have expired, you
                    agree that our normal billing rates shall apply. You agree
                    to comply with any additional terms, restrictions or
                    limitations (including limitations on the total amount of
                    usage) we impose in connection with any Discount Program.
                    You may not sign-up for multiple Accounts in order to
                    receive additional benefits under any Discount Programs. We
                    may cancel any Discount Program at any time in our sole
                    discretion, without liability to you.
                  </Text>
                </View>

                <View
                  style={[Styles.w100, Styles.flexDirectionRow, Styles.mT5]}>
                  <View style={styles.dotStyle} />
                  <Text style={[styles.simpleText, Styles.pL5]}>
                    Sophali will remit the amounts related to orders placed by
                    Customers in accordance with the Merchant Payment terms set
                    out at in your Merchant account, as updated from time to
                    time. Such amounts remitted will include (1) the pre-tax
                    total of all orders for the prior Sophali collected from
                    Customers as limited payment collection agent for you, plus
                    (2) any taxes Sophali is not required to remit under the
                    marketplace facilitator laws, less (3) the aggregate fees,
                    agreed fees for marketing and promotional deals (if any),
                    any error fees associated with your incorrect preparation of
                    orders, and any taxes and other governmental charges imposed
                    on the fees Sophali charges to you (including, for example,
                    value-added, goods and services, harmonized sales,
                    provincial sales, transaction, transfer, excise, withholding
                    and other similar taxes).
                  </Text>
                </View>

                <View
                  style={[Styles.w100, Styles.flexDirectionRow, Styles.mT5]}>
                  <View style={styles.dotStyle} />
                  <Text style={[styles.simpleText, Styles.pL5]}>
                    Sophali uses a closed-loop system operated by Stripe (
                    <Text
                      styles={styles.boldText}
                      weight={WEIGHT.w800}
                      size={MOBILE.textSize.common}
                      fontFamily={FONT_FAMILY.SEMI_BOLD}>
                      {' '}
                      “Payment Processor”{' '}
                    </Text>
                    ) in processing payments and providing related payment
                    services for Transactions (the
                    <Text
                      styles={styles.boldText}
                      weight={WEIGHT.w800}
                      size={MOBILE.textSize.common}
                      fontFamily={FONT_FAMILY.SEMI_BOLD}>
                      {' '}
                      “Payment Services”{' '}
                    </Text>
                    ). You acknowledge your use of the Payment Services is
                    conditional on your acceptance of the Payment Processor’s
                    terms and policies provided on its website. Personal
                    information you submitted during your use of the Payment
                    Service is subject to Sophali’s Privacy Statement and the
                    Payment Processor’s privacy policies.
                  </Text>
                </View>

                <View
                  style={[Styles.w100, Styles.flexDirectionRow, Styles.mT5]}>
                  <View style={styles.dotStyle} />
                  <Text style={[styles.simpleText, Styles.pL5]}>
                    Sophali may use data about your use of the Payment Services,
                    and about your transactions effected through the Payment
                    Services for the same purposes for which Sophali is
                    permitted to use other data collected by Sophali in
                    connection with the Services, as provided in this Terms and
                    the Privacy Statement.
                  </Text>
                </View>

                <View
                  style={[Styles.w100, Styles.flexDirectionRow, Styles.mT5]}>
                  <View style={styles.dotStyle} />
                  <Text style={[styles.simpleText, Styles.pL5]}>
                    From time to time, Sophali may change the service provider
                    it uses to support the Payment Services, or Sophali may
                    offer the option of using other service providers to support
                    the Payment Services, or Sophali may elect to itself perform
                    some or all of the services that were previously provided by
                    the service provider. If Sophali does so, then, in order to
                    continue to use the Payment Services, you may be required to
                    agree to additional terms imposed by Sophali. If you do not
                    wish to accept those terms, then you must cease using the
                    Payment Services, and may result in your inability to use
                    the Services.
                  </Text>
                </View>

                <View
                  style={[Styles.w100, Styles.flexDirectionRow, Styles.mT5]}>
                  <View style={styles.dotStyle} />
                  <Text style={[styles.simpleText, Styles.pL5]}>
                    You agree that you are solely responsible for the collection
                    and/or payment of all taxes, which you may be liable for in
                    any jurisdiction arising from your use of the Services.
                    Sophali is not responsible for collecting, reporting,
                    paying, or remitting to you any such taxes.
                  </Text>
                </View>

                <Text
                  style={[styles.boldText, Styles.mT10]}
                  weight={WEIGHT.w800}
                  size={MOBILE.textSize.common}
                  fontFamily={FONT_FAMILY.SEMI_BOLD}>
                  Referral Program:{' '}
                </Text>

                <View
                  style={[Styles.w100, Styles.flexDirectionRow, Styles.mT10]}>
                  <View style={styles.dotStyle} />
                  <Text style={[styles.simpleText, Styles.pL5]}>
                    In exchange for inviting or referring other merchants to
                    join and use the Sophali Platform, you may receive referral
                    credits through inviting other merchants to create accounts
                    and perform Transactions on the Sophali Platform (the
                    “Referral Program”). Further details on the Referral Program
                    can be found here:{' '}
                    <Text
                      style={styles.underLineText}
                      color={COLORS.blue}
                      onPress={() =>
                        Linking.openURL('https://www.sophali.ca/')
                      }>
                      https://www.sophali.ca{' '}
                    </Text>
                  </Text>
                </View>
                {ReferralProgram.map((value, index) => (
                  <View
                    key={index}
                    style={[Styles.w100, Styles.flexDirectionRow, Styles.mT5]}>
                    <View style={styles.dotStyle} />
                    <Text style={[styles.simpleText, Styles.pL5]}>{value}</Text>
                  </View>
                ))}

                <Text style={[styles.simpleText, Styles.mT10]}>
                  <Text
                    style={[styles.boldText, Styles.mT10]}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    Trademarks:{' '}
                  </Text>
                  Certain names, graphics, logos, icons, designs, words, titles
                  and phrases on the Sophali Platform, including “Sophali”,
                  “Mobitelligence”, and “Buy Now Eat Later” may constitute
                  trademarks, trade-names, trade dress and/or associated
                  products and services of Sophali, its affiliates or licensors
                  (the
                  <Text
                    styles={styles.boldText}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    {' '}
                    “Marks”{' '}
                  </Text>
                  ), and are protected in Canada and internationally and their
                  display on the Sophali Platform does not convey or create any
                  licence or other rights in the Marks. Any use of any of the
                  Marks, in whole or in part without prior written authorization
                  of Sophali or such third party is strictly prohibited. Other
                  trademarks, trade names, trade dress and associated products
                  and services mentioned on the Sophali Platform, or through the
                  Content and Services, may be the trademarks of their
                  respective owners. The display of these trademarks, trade
                  names, trade dress and associated products and services on the
                  Sophali Platform does not convey or create any licence or
                  other rights in these trademarks or trade names. Any
                  unauthorized use of them is strictly prohibited.
                </Text>

                <Text style={[styles.simpleText]}>
                  <Text
                    style={[styles.boldText]}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    Apple App Store:{' '}
                  </Text>
                  The following applies to any Sophali Platform application you
                  obtain from the Apple App Store (an
                  <Text
                    styles={styles.boldText}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    {' '}
                    “Apple Sophali App”{' '}
                  </Text>
                  ): You acknowledge and agree that these Terms are solely
                  between you and Sophali, and not with Apple, Inc. (
                  <Text
                    styles={styles.boldText}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    {' '}
                    “Apple”{' '}
                  </Text>
                  ) and Sophali, not Apple, is solely responsible for the Apple
                  Sophali App and the content thereof. You may only use the
                  Apple Sophali App on Apple branded products that you own or
                  control. You must comply with the App Store Terms of Service.
                  In the event of any inconsistency between a term of these
                  Terms and a term of the App Store Terms of Service, the term
                  of the App Store Terms of Service will prevail. You
                  acknowledge that Apple has no obligation whatsoever to furnish
                  any maintenance and support services with respect to the Apple
                  Sophali App. In the event of any failure of the Apple Sophali
                  App to conform to any applicable warranty, you may notify
                  Apple, and Apple will refund the purchase price for the Apple
                  Sophali App (if any) to you. To the maximum extent permitted
                  by applicable law, Apple will have no other warranty
                  obligation whatsoever with respect to the Apple Sophali App,
                  and any other claims, losses, liabilities, damages, costs or
                  expenses attributable to any failure to conform to any
                  warranty will be solely governed by these Terms and any law
                  applicable to Sophali as the supplier of the Apple Sophali
                  App. You acknowledge that Apple is not responsible for
                  addressing any claims of you or any third party relating to
                  the Apple Sophali App or your possession and/or use of the
                  Apple Sophali App, including, but not limited to (a) product
                  liability claims, (b) any claim that the Apple Sophali App
                  fails to conform to any applicable legal or regulatory
                  requirement, and (c) claims arising under consumer protection
                  or similar legislation, and all such claims are governed
                  solely by these Terms and any law applicable to Sophali as
                  supplier of the Apple Sophali App. You acknowledge that, in
                  the event of any third-party claim that the Apple Sophali App
                  or your possession and use of the Apple Sophali App infringes
                  that third party’s intellectual property rights, Sophali, not
                  Apple, will be solely responsible for the investigation,
                  defense, settlement and discharge of any such intellectual
                  property infringement claim, to the extent required by these
                  Terms. You represent and warrant that (a) you are not located
                  in a country that is subject to a U.S. Government embargo, or
                  that is on Title 15, Part 740 Supplement 1 Country Group E of
                  the U.S. Code of Federal Regulations, and (b) you are not
                  listed on any U.S. Government list of prohibited or restricted
                  parties. If you have any questions, complaints or claims with
                  respect to the Apple Sophali App, you may direct them to
                  Sophali. by email at info@sophali.ca. You agree to comply with
                  all applicable third-party terms of agreement when using the
                  Apple Sophali App, including your wireless data service
                  agreement. You and Sophali acknowledge and agree that Apple,
                  and Apple’s subsidiaries, are third-party beneficiaries of
                  these Terms, and that, upon your acceptance of the terms and
                  conditions of these Terms, Apple will have the right (and you
                  will be deemed to have accepted the right) to enforce these
                  Terms against you as a third-party beneficiary thereof.
                </Text>

                <Text style={[styles.simpleText]}>
                  <Text
                    style={[styles.boldText]}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    Google Play Store:{' '}
                  </Text>
                  The following applies to any Sophali Platform application you
                  obtain through the Google Play Store (a
                  <Text
                    styles={styles.boldText}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    {' '}
                    “Sophali Google App”{' '}
                  </Text>
                  ): You acknowledge and agree that these Terms are solely
                  between you and Sophali, and not with Google, Inc. or any of
                  its subsidiaries (collectively,
                  <Text
                    styles={styles.boldText}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    {' '}
                    “Google”
                  </Text>
                  ). You must comply with Google’s then-current Google Play
                  Terms of Service. In the event of any inconsistency between a
                  term of these Terms and a term of the Google Play Terms of
                  Service, the term of the Google Play Terms of Service will
                  prevail. Google is only a provider of the Google Play Store
                  where you obtained the Sophali Google App. Sophali, and not
                  Google, is solely responsible for the Sophali Google App.
                  Google has no obligation or liability to you with respect to
                  the Sophali Google App or these Terms. You acknowledge and
                  agree that Google is a third-party beneficiary of these Terms.
                </Text>

                <Text style={[styles.simpleText]}>
                  <Text
                    style={[styles.boldText]}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    Mobile Device Data Charges:{' '}
                  </Text>
                  You are solely responsible for any data charges and similar
                  fees associated with your use of the Services through your
                  mobile device.
                </Text>

                <Text style={[styles.simpleText, Styles.mT10]}>
                  <Text
                    style={[styles.boldText, Styles.mT10]}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    Reservation of Sophali Rights:{' '}
                  </Text>
                  Sophali and its licensors have and will retain all right,
                  title and interest in and to the Sophali Platform and the
                  Content and the software and systems used to provide them
                  (including, without limitation, all patent, copyright, Marks,
                  trade secret and other intellectual property rights), and all
                  copies, modifications and derivative works of any of them. You
                  acknowledge that you are obtaining only a limited right to
                  access and use the Services. No rights are granted to you
                  under these Terms other than as expressly set forth in these
                  Terms. Without limitation, you have no right to use any Marks
                  owned or used by Sophali.
                </Text>

                <View
                  style={[Styles.w100, Styles.flexDirectionRow, Styles.mT10]}>
                  <View style={[styles.dotStyle, Styles.mR5]} />
                  <Text style={[styles.simpleText]}>
                    <Text
                      style={[styles.boldText]}
                      weight={WEIGHT.w800}
                      size={MOBILE.textSize.common}
                      fontFamily={FONT_FAMILY.SEMI_BOLD}>
                      Open Source:{' '}
                    </Text>
                    The Sophali Platform may contain or be provided together
                    with free or open-source software. Notwithstanding the
                    sections titled “License” and “Reservation of Sophali
                    Rights”, each item of free or open-source software is
                    subject to its own applicable license terms, which can be
                    found in the applicable documentation or the applicable
                    help, notices, about or source files as required by the
                    terms of the applicable open-source license. Copyrights to
                    the free and open-source software are held by the respective
                    copyright holders indicated therein.
                  </Text>
                </View>

                <Text style={[styles.simpleText, Styles.mT10]}>
                  <Text
                    style={[styles.boldText, Styles.mT10]}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    License to Use Your Submission and Feedback:{' '}
                  </Text>
                  You grant to Sophali and its affiliates a worldwide,
                  perpetual, irrevocable, royalty-free, transferable,
                  sublicensable (through multiple tiers) license to use and
                  incorporate into the Services. the Content, and any other
                  Sophali products and services any ideas, descriptions,
                  suggestion, enhancement request, recommendation, correction or
                  feedback in the form of message, text, images, graphics,
                  photos, audio, video and any other content provided by you.
                </Text>

                <View
                  style={[Styles.w100, Styles.flexDirectionRow, Styles.mT10]}>
                  <View style={[styles.dotStyle, Styles.mR5]} />
                  <Text style={[styles.simpleText]}>
                    <Text
                      style={[styles.boldText]}
                      weight={WEIGHT.w800}
                      size={MOBILE.textSize.common}
                      fontFamily={FONT_FAMILY.SEMI_BOLD}>
                      Electronic Communication with You:{' '}
                    </Text>
                    The Sophali Platform may include push notifications or other
                    mobile communication capability to you. You hereby approve
                    and consent to Sophali’s delivery of electronic
                    communications directly to your mobile device. These
                    notifications may include information regarding your use of
                    the Services, updates to these Terms or the Privacy
                    Statement, or other notifications related to the features
                    and services of the Sophali Platform. The notifications may
                    be delivered to your device even when the Sophali Platform
                    is running in the background. You have the ability, and it
                    is your responsibility, to control the notifications you do,
                    or do not, receive through your device. It is your
                    responsibility to keep your account information secure when
                    using this feature.
                  </Text>
                </View>

                <View
                  style={[Styles.w100, Styles.flexDirectionRow, Styles.mT10]}>
                  <View style={[styles.dotStyle, Styles.mR5]} />
                  <Text style={[styles.simpleText]}>
                    <Text
                      style={[styles.boldText]}
                      weight={WEIGHT.w800}
                      size={MOBILE.textSize.common}
                      fontFamily={FONT_FAMILY.SEMI_BOLD}>
                      Sophali’s Use of Non-identifiable information:{' '}
                    </Text>
                    Any non-identifiable information gathered by us through your
                    use of the Services may be used by us for our own marketing,
                    promotional and product development and optimization
                    purposes, machine learning and artificial intelligence
                    models, algorithms, and weightings, and more specifically
                    may be stored in a database and used by us to identify,
                    customize and personalize user access, user experience
                    within the Sophali Platform. Such information may be shared
                    with our affiliates, suppliers, licensors, partners and
                    clients in furtherance of the forgoing purposes. For greater
                    certainty, such information shall not identify you and shall
                    be completely de-identified information.
                  </Text>
                </View>

                <Text style={[styles.simpleText, Styles.mT10]}>
                  <Text
                    style={[styles.boldText, Styles.mT10]}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    Third Party Services and Content. :{' '}
                  </Text>
                  The Services may allow you to access and use services provided
                  by third parties (
                  <Text
                    styles={styles.boldText}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    {' '}
                    “Third Party Services”{' '}
                  </Text>
                  ). You are responsible for all fees and taxes that may be
                  charged for the use of Third Party Services. You use any Third
                  Party Services at your own risk. Sophali makes no
                  representations or warranties with respect to, nor does it
                  guarantee or endorse, any Third Party Services. Sophali does
                  not guarantee the continued availability of Third Party
                  Services, and Sophali may disable a Third Party Service in
                  Sophali’s sole discretion. Your dealings with the provider of
                  any Third Party Services are solely between you and the
                  provider. Accordingly, Sophali expressly disclaims
                  responsibility and liability for all Third Party Services, and
                  you agree that Sophali shall not be responsible for any loss
                  or damage of any sort incurred because of any such dealings or
                  because of your use of Third Party Services. If you have any
                  issues with a Third Party Service, you must contact the
                  provider of the Third Party Service directly.
                </Text>

                <Text style={[styles.simpleText]}>
                  <Text
                    style={[styles.boldText]}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    Links to Other Sites:{' '}
                  </Text>
                  The Sophali Platform and the Content may provide links to
                  other sites on the Internet for your convenience in locating
                  or accessing related information, products, and services.
                  These sites have not necessarily been reviewed by Sophali and
                  are maintained by third parties over which Sophali exercises
                  no control. Accordingly, Sophali expressly disclaims any
                  responsibility for the content, the materials, the accuracy of
                  the information, and/or the quality of the products or
                  services provided by, available through, or advertised on
                  these third-party websites. Moreover, these links do not imply
                  an endorsement with respect to any third party or any website
                  or the products or services provided by any third party.
                </Text>

                <Text style={[styles.simpleText, Styles.mT10]}>
                  <Text
                    style={[styles.boldText, Styles.mT10]}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    Content, Functionality and Access:{' '}
                  </Text>
                  Sophali may at any time, with or without notice, without
                  liability, and for any reason (a) remove any Content from the
                  Sophali Platform, (b) remove any functionality from the
                  Services, (c) change any functionality on the Services,
                  (d) modify the Sophali Platform, and (e) deny any person
                  access to the Services. Sophali furthermore reserves the right
                  to take any action related to the Services or the Content that
                  is required to comply with applicable law.
                </Text>

                <Text style={[styles.simpleText, Styles.mT10]}>
                  <Text
                    style={[styles.boldText, Styles.mT10]}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    Disclaimer of Warranties:{' '}
                  </Text>
                  THE SOPHALI PLATFORM, THE CONTENT AND THE SERVICES GENERALLY
                  ARE PROVIDED “AS IS” AND “AS AVAILABLE”, AND MAY INCLUDE
                  ERRORS, OMISSIONS, OR OTHER INACCURACIES. YOUR USE OF THE
                  SERVICES AND THE CONTENT IS AT YOUR OWN RISK. SOPHALI
                  DISCLAIMS ALL WARRANTIES, REPRESENTATIONS, COVENANTS AND
                  CONDITIONS (EXPRESS, IMPLIED OR STATUTORY) IN CONNECTION WITH
                  THE SERVICES AND THE CONTENT, INCLUDING ANY WARRANTIES,
                  REPRESENTATIONS, COVENANTS, CONDITIONS, OR OTHER TERMS OF
                  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY,
                  COMPLETENESS, PERFORMANCE, AND NON-INFRINGEMENT. SOPHALI MAKES
                  NO REPRESENTATION OR WARRANTY OR ANY OTHER TERM THAT THE
                  SERVICES, IN WHOLE OR IN PART, AND THE CONTENT WILL OPERATE
                  ERROR FREE OR IN AN UNINTERRUPTED FASHION, OR THAT THE
                  SERVICES AND THE CONTENT WILL BE SECURE, OR THAT THE SOPHALI
                  PLATFORM THAT YOU DOWNLOAD THROUGH USE OF THE SERVICES, OR
                  THAT THE CONTENT, WILL BE FREE OF MALICIOUS CODE. SOPHALI IS
                  NOT RESPONSIBLE FOR THE SECURITY OF ANY INFORMATION
                  TRANSMITTED TO OR FROM THE SERVICES. SOPHALI MAKES NO
                  REPRESENTATIONS OR WARRANTIES ABOUT ANY THIRD PARTY WEBSITES
                  OR RELATED CONTENT DIRECTLY OR INDIRECTLY ACCESSED THROUGH
                  LINKS IN THE SOPHALI PLATFORM, OTHER SERVICES OR CONTENT. YOUR
                  SOLE AND EXCLUSIVE REMEDY FOR DISSATISFACTION WITH THE
                  SERVICES AND THE CONTENT IS TO STOP USING THEM.
                </Text>

                <Text style={[styles.simpleText, Styles.mT10]}>
                  <Text
                    style={[styles.boldText, Styles.mT10]}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    Limitation of Liability. :{' '}
                  </Text>
                  IN NO EVENT WILL THE TOTAL AGGREGATE LIABILITY OF SOPHALI (AND
                  SOPHALI’S LICENSORS, DIRECTORS, OFFICERS, EMPLOYEES, PARTNERS,
                  SUPPLIERS AND AGENTS, AND THIRD PARTIES OFFERING THE THIRD
                  PARTY SERVICES AND THIRD PARTY CONTENT, AND IT AND THEIR
                  SUPPLIERS) FOR ALL CLAIMS, DAMAGES, LOSSES, LIABILITIES, COSTS
                  AND EXPENSES (INCLUDING LEGAL FEES AND EXPENSES) (COLLECTIVELY
                  “LOSSES”) TO YOU RELATED TO THE SERVICES, OR USE THEREOF, OR
                  THE CONTENT, OR THESE TERMS, EXCEED THE LESSER OF (A) THE
                  DIRECT DAMAGES SUFFERED BY YOU, AND (B) $100.
                </Text>

                <Text style={[styles.simpleText, Styles.mT10]}>
                  <Text
                    style={[styles.boldText, Styles.mT10]}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    No Claim for Certain Damages:{' '}
                  </Text>
                  IN NO EVENT WILL SOPHALI (OR SOPHALI’S LICENSORS, DIRECTORS,
                  OFFICERS, EMPLOYEES, PARTNERS, SUPPLIERS OR AGENTS, OR
                  PROVIDERS OF THE THIRD PARTY SERVICES AND THIRD PARTY CONTENT)
                  BE LIABLE TO YOU FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                  CONSEQUENTIAL, PUNITIVE, EXEMPLARY OR AGGRAVATED DAMAGES, OR
                  FOR ANY LOSS OF REVENUE, SAVINGS, INCOME, BUSINESS, PROFIT,
                  GOODWILL OR REPUTATION WHATSOEVER BASED ON ANY LEGAL THEORY
                  (INCLUDING TORT OR NEGLIGENCE), AND EVEN IF ADVISED OF THE
                  POSSIBILITY OF THOSE DAMAGES.
                </Text>

                <Text style={[styles.simpleText, Styles.mT10]}>
                  <Text
                    style={[styles.boldText, Styles.mT10]}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    Some Disclaimers, Exclusions or Limitations May Not Apply:{' '}
                  </Text>
                  In some circumstances, applicable law may not allow for
                  limitations on certain implied warranties, or exclusions or
                  limitations of certain damages. Solely to the extent that such
                  law applies to you, some or all the above disclaimers,
                  exclusions or limitations may not apply to you.
                </Text>

                <Text style={[styles.simpleText, Styles.mT10]}>
                  <Text
                    style={[styles.boldText, Styles.mT10]}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    Indemnity:{' '}
                  </Text>
                  You will indemnify and hold Sophali (and Sophali’s directors,
                  officers, licensors, employees, partners, suppliers and
                  agents) harmless from all Losses arising from your use of the
                  Services or the Content, or your breach of any of these Terms,
                  and from all Losses resulting from any of Your Content that is
                  untrue, inaccurate or incomplete.
                </Text>

                <Text style={[styles.simpleText, Styles.mT10]}>
                  <Text
                    style={[styles.boldText, Styles.mT10]}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    Failure to Comply:{' '}
                  </Text>
                  If you fail to comply with these Terms, then, without limiting
                  any other right or remedy available to Sophali, Sophali may
                  suspend or terminate your license to use all or any part of
                  the Services or the Content.
                </Text>

                <Text style={[styles.simpleText, Styles.mT10]}>
                  <Text
                    style={[styles.boldText, Styles.mT10]}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    Export Controls:{' '}
                  </Text>
                  These Terms are expressly made subject to any laws,
                  regulations, orders or other restrictions on export from the
                  United States of America (U.S.) or Canada of the Services or
                  the Content, or any information about any of them, which may
                  be imposed from time to time by the governments of the U.S. or
                  Canada. You shall not export the Services or the Content, or
                  any information about any of them without the prior written
                  consent of Sophali and compliance with such laws, regulations,
                  orders and other restrictions. You represent and warrant that
                  (a) you are not located in a country that is subject to a U.S.
                  or Canadian government embargo, or that has been designated by
                  the U.S. or Canadian government as a “terrorist supporting”
                  country, and (b) you are not listed on any U.S. or Canadian
                  government list of prohibited or restricted parties.
                </Text>

                <Text style={[styles.simpleText, Styles.mT10]}>
                  <Text
                    style={[styles.boldText, Styles.mT10]}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    Amendments:{' '}
                  </Text>
                  The “last updated” legend above indicates when these Terms
                  were last amended. Sophali may unilaterally amend all or any
                  part of these Terms at any time by updating these Terms on the
                  Sophali Platform. We will provide you with notice of the
                  proposed amendments by posting an amended version of these
                  Terms with a new version date. We will include a link to the
                  previous version of the Terms beneath the new version date.
                  The amendments will take effect 30 days after the date on
                  which the amended version is posted. Prior to that date, the
                  previous version of the Terms will continue to apply. If you
                  disagree with any amendments, you may refuse the amendments
                  and cease using the Services and the Content within the 30-day
                  notice period. There will be no cost or penalty for doing so.
                  If you continue to access or use the Services or the Content
                  after the 30-day period, you thereby agree to the amended
                  Terms. You agree to review these Terms regularly to determine
                  your rights and responsibilities.
                </Text>

                <Text style={[styles.simpleText, Styles.mT10]}>
                  <Text
                    style={[styles.boldText, Styles.mT10]}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    Governing Law & Jurisdiction:{' '}
                  </Text>
                  These Terms, and any dispute, controversy or claim arising
                  under, out of, in connection with, or related to (a) the
                  Services or the Content, or (b) these Terms, or their subject
                  matter, negotiation, performance, renewal, termination,
                  interpretation, or formation, shall be governed by and
                  interpreted according to the laws of the Province of Ontario
                  and the federal laws of Canada applicable in Ontario, without
                  regard to any conflicts of law rules that might apply the laws
                  of any other jurisdiction. You and Sophali each attorn to the
                  exclusive jurisdiction of the courts of Ontario in respect of
                  any such dispute, controversy or claim, except that,
                  notwithstanding the foregoing, (a) you agree that Sophali
                  shall be entitled to seek and be awarded an injunction or
                  other appropriate equitable relief from a court of competent
                  jurisdiction anywhere in the world restraining any breach,
                  threatened or actual, of your obligations under any provision
                  of these Terms, and (b) you agree that Sophali shall be
                  entitled to seek and be awarded an order from a court of
                  competent jurisdiction anywhere in the world for the purpose
                  of recognizing and enforcing any interim or final judgement,
                  order, injunction, award or other relief granted or provided
                  by the courts of Ontario, and you hereby waive any defence you
                  might then have to the granting of such an order.
                </Text>

                <Text style={[styles.simpleText, Styles.mT10]}>
                  <Text
                    style={[styles.boldText, Styles.mT10]}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    Injunction:{' '}
                  </Text>
                  You acknowledge that any breach, threatened or actual, of
                  these Terms will cause irreparable harm to Sophali, such harm
                  would not be quantifiable in monetary damages, and Sophali
                  would not have an adequate remedy at law. You agree that
                  Sophali shall be entitled, in addition to other available
                  remedies, to seek and be awarded an injunction or other
                  appropriate equitable relief from a court of competent
                  jurisdiction anywhere in the world restraining any breach,
                  threatened or actual, of your obligations under any provision
                  of these Terms, and without the necessity of showing or
                  proving any actual or threatened damage or harm,
                  notwithstanding any rule of law or equity to the contrary. You
                  hereby waive any requirement that Sophali post any bond or
                  other security in the event any injunctive or equitable relief
                  is sought by or awarded to Sophali to enforce any provision of
                  these Terms.
                </Text>

                <Text style={[styles.simpleText, Styles.mT10]}>
                  <Text
                    style={[styles.boldText, Styles.mT10]}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    Class Action Waiver:{' '}
                  </Text>
                  Any proceedings to resolve or litigate any dispute,
                  controversy or claim arising under, out of, in connection
                  with, or related to (a) the Services or the Content, or
                  (b) these Terms, or their subject matter, negotiation,
                  performance, renewal, termination, interpretation, or
                  formation, will be conducted solely on an individual basis.
                  Neither you nor Sophali will seek to have any such dispute
                  heard as a class action, private attorney general action, or
                  in any other proceeding in which either party acts or proposes
                  to act in a representative capacity. No proceeding will be
                  combined with another without the prior written consent of all
                  parties to all affected proceedings. If this class action
                  waiver is found to be illegal or unenforceable as to all or
                  some parts of a dispute, then this section will not apply to
                  those parts.
                </Text>

                <Text style={[styles.simpleText, Styles.mT10]}>
                  <Text
                    style={[styles.boldText, Styles.mT10]}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    General:{' '}
                  </Text>
                  If any provision of these Terms is unlawful, void, or
                  unenforceable, then that provision shall be deemed severed
                  from the remaining provisions and shall not affect the
                  validity and enforceability of the remaining provisions. All
                  rights and remedies of Sophali granted or recognized in these
                  Terms are cumulative, are in addition to and not in
                  substitution for any rights or remedies at law, and may be
                  exercised at any time and from time to time independently or
                  in any combination. In these Terms (a) references to currency
                  are to the lawful money of Canada, (b) “person” includes
                  individuals, corporations, partnerships, joint ventures,
                  associations, trusts, unincorporated organizations, societies
                  and all other organizations and entities recognized by law,
                  and (c) “including” (and similar variations) means including
                  without limitation. These Terms, together with any additional
                  service terms presented on the Sophali Platform (
                  <Text
                    styles={styles.boldText}
                    weight={WEIGHT.w800}
                    size={MOBILE.textSize.common}
                    fontFamily={FONT_FAMILY.SEMI_BOLD}>
                    {' '}
                    “Additional Service Terms”{' '}
                  </Text>
                  ) represent the entire agreement between you and Sophali with
                  respect to use of the Services and Content, and they supersede
                  all prior or contemporaneous terms, agreements, communications
                  and proposals, whether electronic, oral, or written between
                  you and Sophali with respect to any of the foregoing. Failure
                  by Sophali to insist on strict performance of any of the terms
                  or conditions of these Terms or any Additional Service Terms
                  will not operate as a waiver by Sophali of that or any
                  subsequent default or failure of performance. Sophali’s
                  affiliates, Sophali’s directors, officers, employees,
                  partners, suppliers, and agents are third party beneficiaries
                  of the sections titled “Disclaimer of Warranties”, “Limitation
                  of Liability”, “No Claim for Certain Damages” and “Indemnity”.
                  Apple, Google, and their subsidiaries are third party
                  beneficiaries of these Terms. There are no other third-party
                  beneficiaries of these Terms. You may not assign these Terms
                  without the prior written consent of Sophali. Sophali may
                  assign these Terms without restriction. These Terms will enure
                  to the benefit of and will be binding on you and Sophali and
                  your and its respective successors and permitted assigns.
                </Text>

                <Button
                  title={'Accept'}
                  onPress={handleAccept}
                  containerStyle={[Styles.mV10]}
                />
              </View>
            )}
          />
          {!isAtBottom && (
            <Button
              title={'Scroll to accept'}
              onPress={() => scrollToItem()}
              textStyle={Styles.textTransformCap}
              containerStyle={[styles.scrollButton]}
            />
          )}
        </View>
      </View>
    </PopUpModal>
  );
};
export default TermsAndConditions;
