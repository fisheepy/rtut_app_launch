import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { formatTimeString } from './utils';
import commonStyles from './styles/commonStyles';
import { useDrag } from '@use-gesture/react';

const MessageDetailComponent = ({ notification, onBack, windowDimensions }) => {
    const styles = {
        container: { ...commonStyles.messageDetail.container, width: '100%', maxWidth: windowDimensions.width },
        content: commonStyles.messageDetail.content,
        contentContainer: { ...commonStyles.messageDetail.contentContainer, maxWidth: '100%' },
        card: commonStyles.messageDetail.card,
        subject: commonStyles.messageDetail.subject,
        infoContainer: { ...commonStyles.messageDetail.infoContainer, maxWidth: '100%' },
        body: { ...commonStyles.messageDetail.body, maxWidth: '100%' },
        buttonContainer: { ...commonStyles.messageDetail.buttonContainer, width: windowDimensions.width },
        time: commonStyles.messageDetail.time,
        backButton: commonStyles.messageDetail.backButton,
        backButtonText: commonStyles.messageDetail.backButtonText,
    };

    const [dragX, setDragX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const bind = useDrag(({ down, movement: [mx], direction: [xDir], velocity }) => {
        const swipeDistanceThreshold = 60;
        const swipeVelocityThreshold = 0.25;
        const isRightSwipe = xDir > 0;

        setIsDragging(down);

        if (!down) {
            const shouldNavigateBack = isRightSwipe && (mx > swipeDistanceThreshold || velocity > swipeVelocityThreshold);

            setDragX(0);
            if (shouldNavigateBack) {
                onBack();
            }
        } else {
            setDragX(Math.max(0, Math.min(mx, 240)));
        }
    }, { axis: 'x', threshold: 8 });

    return (
        <View style={styles.container}>
            <div
                {...bind()}
                style={{
                    transform: `translate3d(${dragX}px, 0, 0)`,
                    transition: isDragging ? 'none' : 'transform 180ms ease-out',
                    touchAction: 'pan-y',
                    width: '100%',
                }}
            >
                <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} nestedScrollEnabled={true}>
                    <View style={styles.card}>
                        <Text style={styles.subject}>{notification.payload.subject || notification.payload.messageType}</Text>
                        <View style={styles.infoContainer}>
                            <Text style={styles.sender}>From: {notification.payload.sender}</Text>
                            <Text style={styles.time}>{formatTimeString(notification.createdAt)}</Text>
                        </View>
                        <Text style={styles.body}>{notification.payload.messageContent}</Text>
                    </View>
                </ScrollView>
            </div>
            <View style={styles.buttonContainer}>
                <Pressable onPress={onBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Back to list</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default MessageDetailComponent;
