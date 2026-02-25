import { StyleSheet } from 'react-native';
import 'typeface-open-sans';

const bannerHeight = 100;
const baseColor = '#f7f7f7ff';
const menuColor = '#2e59a7';
const bannerColor = '#003462';
const toggleColor = '#f3f3e7';
const settingColor = '#fa0014';
const bannerTextColor = '#f9f1db';
const tabColor = '#003462';
const activeColor = '#fa0014';

const authCardColor = '#ffffff';
const authInputBg = '#f8fafc';
const authInputBorder = '#cbd5e1';
const authPrimary = '#003462';
const authPrimaryText = '#ffffff';
const authBodyText = '#1f2937';

export default StyleSheet.create({
    app: {
        container: {
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#f1f5f9',
        },
        iconButtonContainer: {
            position: 'absolute',
            top: 14,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            zIndex: 3,
        },
        iconButton: {
            width: 42,
            height: 42,
            borderRadius: 12,
            backgroundColor: '#ffffff',
            borderWidth: 1,
            borderColor: '#e2e8f0',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 8,
            elevation: 3,
        },
        menu: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '86%',
            maxWidth: 340,
            height: '100%',
            backgroundColor: '#0f2747',
            paddingHorizontal: 14,
            paddingTop: 10,
            zIndex: 4,
            alignItems: 'center',
            justifyContent: 'flex-start',
            shadowColor: '#000',
            shadowOffset: { width: 3, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 10,
        },
        backIcon: {
            fontSize: 30,
            alignSelf: 'flex-end',
            marginTop: 6,
            marginBottom: 8,
            padding: 8,
            color: '#dbeafe',
        },
        settingIcon: {
            fontSize: 22,
            color: '#0f2747',
        },
        refreshIcon: {
            fontSize: 22,
            color: '#0f2747',
        },
        content: {
            flex: 1,
            width: '100%',
            paddingTop: bannerHeight,
            alignItems: 'center',
        },
        banner: {
            backgroundColor: bannerColor,
            width: '100%',
            height: bannerHeight,
            justifyContent: 'flex-end',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            zIndex: 1,
            paddingBottom: 14,
            borderBottomLeftRadius: 18,
            borderBottomRightRadius: 18,
        },
        bannerText: {
            color: '#e2e8f0',
            fontSize: 18,
            fontWeight: '600',
            fontFamily: 'Open Sans',
        },
        menuRow: {
            width: '100%',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
        },
        logoutButton: {
            paddingVertical: 10,
            paddingHorizontal: 18,
            backgroundColor: '#dc2626',
            alignItems: 'center',
            borderRadius: 8,
            marginTop: 20,
        },
        logoutButtonText: {
            color: '#ffffff',
            fontWeight: '600',
        },
        bottomContainer: {
            marginTop: 'auto',
            alignItems: 'center',
            paddingBottom: 22,
        },
        centeredModalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
        },
        enlargedModalContent: {
            width: '90%',
            maxWidth: 380,
            backgroundColor: '#ffffff',
            padding: 24,
            borderRadius: 14,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#e2e8f0',
        },
        confirmationText: {
            fontSize: 20,
            fontWeight: '600',
            marginBottom: 18,
            textAlign: 'center',
            color: '#0f172a',
        },
        confirmButton: {
            marginTop: 8,
            paddingVertical: 11,
            paddingHorizontal: 30,
            backgroundColor: '#003462',
            borderRadius: 8,
            minWidth: 130,
            alignItems: 'center',
        },
        confirmButtonText: {
            fontSize: 15,
            color: '#fff',
            fontWeight: '600',
        },
        cancelButton: {
            marginTop: 10,
            paddingVertical: 11,
            paddingHorizontal: 30,
            backgroundColor: '#e2e8f0',
            borderRadius: 8,
            minWidth: 130,
            alignItems: 'center',
        },
        cancelButtonText: {
            fontSize: 15,
            color: '#1f2937',
            fontWeight: '600',
        },
    },
    messageView: {
        container: {
            minHeight: 64,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '100%',
            wordWrap: 'break-word',
            marginLeft: 0,
        },
        headLine: {
            minHeight: 18,
            flexDirection: 'row',
            alignItems: 'center',
        },
        subjectLine: {
            minHeight: 18,
            alignItems: 'flex-start',
            marginLeft: 20,
            marginTop: 2,
        },
        subject: {
            fontSize: 15,
            fontWeight: '600',
            textAlign: 'center',
            fontFamily: 'Open Sans',
        },
        sender: {
            fontSize: 13,
            color: '#334155',
            marginLeft: '8px',
            fontFamily: 'Open Sans',
        },
        time: {
            fontSize: 11,
            color: '#64748b',
            marginLeft: 'auto',
            marginRight: '4px',
            fontFamily: 'Open Sans',
        },
        indicator: {
            height: 10,
            width: 10,
            borderRadius: 5,
            marginRight: 5,
            alignSelf: 'center',
        },
        readIndicator: {
        },
        unreadIndicator: {
            backgroundColor: 'green', // Color for unread messages
        },
    },
    messageDetail: {
        container: {
            flex: 1,
            flexGrow: 1,
            justifyContent: 'space-between',
            alignItems: 'stretch',
            backgroundColor: baseColor,
            maxWidth: '100%',
        },
        content: {
            minHeight: '30vw',
            maxWidth: '100%',
        },
        subject: {
            fontSize: 15,
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: 5,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            fontFamily: 'Open Sans',
        },
        info: {
            fontSize: 16,
            color: 'gray',
            textAlign: 'left',
            paddingHorizontal: 20,
            fontFamily: 'Open Sans',
        },
        contentContainer: {
            flexGrow: 1, // Important for making sure the container can grow
            justifyContent: 'flex-start', // Centers content when less than screen height
            backgroundColor: baseColor,
            maxWidth: '100%',
        },
        body: {
            fontSize: 14,
            lineHeight: 22,
            color: '#0f172a',
            textAlign: 'justify',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
            fontFamily: 'Open Sans',
            backgroundColor: baseColor,
            paddingBottom: 18,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor: baseColor,
            paddingBottom: 18,
        },
        buttonText: {
            fontWeight: 'bold',
            letterSpacing: 0.25,
            color: 'white',
            fontFamily: 'Open Sans',
        },
        infoContainer: {
            paddingHorizontal: 20,
            fontSize: 14,
            color: 'gray',
            flexDirection: 'row',
            paddingBottom: 15,
        },
        sender: {
            fontSize: 14,
            marginLeft: '15px',
            fontFamily: 'Open Sans',
        },
        time: {
            fontSize: 14,
            marginLeft: 'auto',
            marginRight: '15px',
            fontFamily: 'Open Sans',
        },
    },
    login: {
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
            paddingHorizontal: 16,
        },
        form: {
            padding: 20,
            borderRadius: 14,
            backgroundColor: authCardColor,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 5,
            borderWidth: 1,
            borderColor: '#e2e8f0',
        },
        header: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
            color: authBodyText,
        },
        text: {
            fontSize: 16,
            marginBottom: 20,
            textAlign: 'center',
            color: authBodyText,
        },
        helperText: {
            fontSize: 12,
            color: '#475569',
            marginBottom: 10,
            lineHeight: 18,
        },
        checkboxContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        checkbox: {
            marginRight: 10,
        },
        input: {
            marginBottom: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: authInputBorder,
            borderRadius: 8,
            textAlign: 'left',
            width: '100%',
            backgroundColor: authInputBg,
            color: authBodyText,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
        },
        tabButton: {
            alignItems: 'center',
            justifyContent: 'center',
            height: 42,
            borderRadius: 8,
            backgroundColor: authPrimary,
            paddingHorizontal: 14,
        },
        tabButtonText: {
            color: authPrimaryText,
            fontWeight: '600',
            fontSize: 14,
        },
        backgroundImage: {
            flex: 1,
            width: '100%',
            height: '100%',
        },
    },
    useSetting: {
        container: {
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50,
        },
        iconLink: {
            flexDirection: 'column',
            alignItems: 'center',
            marginVertical: 10,
        },
        toggleText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: toggleColor,
            fontFamily: 'Open Sans',
        },
        feedbackButton: {
            fontSize: 36,
            marginTop: 20,
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
            fontFamily: 'Open Sans',
        },
        feedbackButtonText: {
            fontSize: 16,
            color: '#ffffff',
            fontFamily: 'Open Sans',
        },
        centeredView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent background
        },
        modalView: {
            margin: 20,
            backgroundColor: '#6e909c',
            borderRadius: 20,
            padding: 35,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            width: '80%', // Fixed width for the modal
            maxHeight: '80%', // Maximum height to avoid covering the entire screen
        },
        feedbackInput: {
            backgroundColor: 'lightgray',
            width: '100%', // Take up all available width within the modal
            minHeight: 250, // Minimum height for the text input
            marginBottom: 20, // Margin bottom for spacing
            borderColor: '#ccc', // Border color for the text input
            borderWidth: 1, // Border width
            padding: 10, // Padding inside the text input
        },
        nameInput: {
            backgroundColor: 'lightgray',
            width: '60%', // Take up all available width within the modal
            minHeight: 25, // Minimum height for the text input
            marginBottom: 20, // Margin bottom for spacing
            borderColor: '#ccc', // Border color for the text input
            borderWidth: 1, // Border width
            padding: 10, // Padding inside the text input
        },
        buttonGroup: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 20,
        },
        buttonClose: {
            marginTop: 15,
        },
        textStyle: {
            color: "white",
            fontWeight: "bold",
            textAlign: "center"
        },
        linkText: {
            fontSize: 12,
            color: toggleColor,
            textAlign: 'justify',
            fontFamily: 'Open Sans',
        },
    },
    notificationModal: {
        container: {
            flex: 1,
            paddingHorizontal: 12,
            paddingTop: 6,
            paddingBottom: 8,
            backgroundColor: baseColor,
            position: 'static',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '100%',
        },
        tabButtonContainer: {
            flexDirection: 'row',
            alignItems: 'end',
            justifyContent: 'center',
            width: '100%',
            backgroundColor: tabColor,
        },
        tabButton: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            fontWeight: 'bold',
            marginBottom: 8,
        },
        activeTab: {
            color: activeColor,
        },
        inactiveTab: {
            color: baseColor,
        },
        messagesContainer: {
            marginTop: 6,
            width: '100%',
            maxWidth: 960,
            alignSelf: 'center',
        },
        notificationContainer: {
            width: '100%',
            maxWidth: 960,
            alignSelf: 'center',
        },
        tabButtonText: {
            fontSize: 14,
            fontWeight: '600',
        },
        refreshButtonContainer: {
            marginTop: 20,
            alignItems: 'center',
        },
        refreshButton: {
            backgroundColor: '#007bff',
            paddingHorizontal: 12,
            paddingTop: 6,
            paddingBottom: 8,
            borderRadius: 5,
        },
        completedSurvey: {
            opacity: 0.5,
        },
        loadingContainer: {
            marginTop: 56,
            alignItems: 'center',
            justifyContent: 'center',
        },
        loadingText: {
            marginTop: 6,
            fontSize: 16,
            color: '#555',
        },
    },
    SurveyRenderer: {
        container: {
            width: '100%',
            backgroundColor: baseColor,
        },
        questionContainer: {
            marginBottom: 20,
            paddingHorizontal: 20,
            width: '100%',
            maxWidth: 960,
            alignSelf: 'center',
        },
        text:
        {
            textAlign: 'justify',
            fontFamily: 'Open Sans',
            fontSize: 13,
        },
        title: {
            textAlign: 'center',
            marginBottom: 10,
            fontFamily: 'Open Sans',
            fontWeight: 'bold',
            fontSize: 13,
        },
        choiceContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            width: '100%',
            maxWidth: 960,
            alignSelf: 'center',
        },
        radioCircle: {
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#000',
            marginHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        selectedRadio: {
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: '#000',
        },
        input: {
            borderWidth: 1,
            borderColor: '#ccc',
            paddingHorizontal: 12,
            paddingTop: 6,
            paddingBottom: 8,
            borderRadius: 5,
            fontFamily: 'Open Sans',
            fontSize: 13,
        },
        checkbox: {
            width: 20,
            height: 20,
            borderWidth: 1,
            borderColor: '#000',
            marginHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        checkedBox: {
            width: 12,
            height: 12,
            backgroundColor: '#000',
            fontFamily: 'Open Sans',
        },
        sliderContainer: {
            width: '100%',
            maxWidth: 960,
            alignSelf: 'center',
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
            marginBottom: 20,
        },
    },
});
