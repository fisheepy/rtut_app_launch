import React from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import { SiAdp } from "react-icons/si";
import { TbTargetArrow } from "react-icons/tb";
import { FaHandsHelping } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import { FiExternalLink } from "react-icons/fi";
import commonStyles from './styles/commonStyles';

const UsefulLinksComponent = () => {
    const handleLinkPress = (url) => {
        Linking.openURL(url);
    };

    return (
        <View style={commonStyles.useSetting.container}>
            <Text style={commonStyles.useSetting.sectionTitle}>Useful Links</Text>
            <View style={commonStyles.useSetting.linkList}>
                    <Pressable style={commonStyles.useSetting.linkItem} onPress={() => handleLinkPress('https://workforcenow.adp.com/')}>
                        <SiAdp style={{ fontSize: 24, color: '#FF5733' }} />
                        <View style={commonStyles.useSetting.linkInfoWrap}>
                            <Text style={commonStyles.useSetting.linkItemTitle}>ADP</Text>
                            <Text style={commonStyles.useSetting.linkItemSubtitle}>Payroll / Benefits</Text>
                        </View>
                        <FiExternalLink style={commonStyles.useSetting.linkTrailingIcon} />
                    </Pressable>

                    <Pressable style={commonStyles.useSetting.linkItem} onPress={() => handleLinkPress('https://kapnickstrive.com/')}>
                        <TbTargetArrow style={{ fontSize: 24, color: '#3273a8' }} />
                        <View style={commonStyles.useSetting.linkInfoWrap}>
                            <Text style={commonStyles.useSetting.linkItemTitle}>Kapnick</Text>
                            <Text style={commonStyles.useSetting.linkItemSubtitle}>Wellness</Text>
                        </View>
                        <FiExternalLink style={commonStyles.useSetting.linkTrailingIcon} />
                    </Pressable>

                    <Pressable style={commonStyles.useSetting.linkItem} onPress={() => handleLinkPress('https://rtutglovebox.com/')}>
                        <FaHandsHelping style={{ fontSize: 24, color: '#32a867' }} />
                        <View style={commonStyles.useSetting.linkInfoWrap}>
                            <Text style={commonStyles.useSetting.linkItemTitle}>Glovebox</Text>
                            <Text style={commonStyles.useSetting.linkItemSubtitle}>SDS / Safety</Text>
                        </View>
                        <FiExternalLink style={commonStyles.useSetting.linkTrailingIcon} />
                    </Pressable>

                    <Pressable style={commonStyles.useSetting.linkItem} onPress={() => Linking.openURL('tel:+18004488326')}>
                        <MdSupportAgent style={{ fontSize: 24, color: '#f46f42' }} />
                        <View style={commonStyles.useSetting.linkInfoWrap}>
                            <Text style={commonStyles.useSetting.linkItemTitle}>Ulliance EAP</Text>
                            <Text style={commonStyles.useSetting.linkItemSubtitle}>Call 800-448-8326</Text>
                        </View>
                        <FiExternalLink style={commonStyles.useSetting.linkTrailingIcon} />
                    </Pressable>
                </View>
        </View>
    );
};

export default UsefulLinksComponent;
