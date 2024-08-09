import React, { useEffect, useState, useCallback } from 'react';
import { useNotification } from './context/novuNotifications';
import { View, Pressable, Text, ScrollView } from 'react-native';
import MessageViewComponent from './messageViewComponent';
import MessageDetailComponent from './messageDetailComponent';
import SurveyRenderer from './surveyRenderer';
import { CiSquareQuestion, CiCirclePlus } from "react-icons/ci";
import { TfiAnnouncement } from "react-icons/tfi";
import AsyncStorage from '@react-native-async-storage/async-storage';
import commonStyles from './styles/commonStyles';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import CalendarComponent from './calendarComponent';
import { PushNotifications } from '@capacitor/push-notifications';

const getStorageKey = (userId) => `notifications_${userId}`;

const NotificationModal = ({ windowDimensions, notificationData }) => {
    const styles = {
        container: {
            ...commonStyles.notificationModal.container,
            flexGrow: 1,
            width: windowDimensions.width,
            height: windowDimensions.height - 100,
        },
        tabButtonContainer: { ...commonStyles.notificationModal.tabButtonContainer, height: 110, },
        tabButton: commonStyles.notificationModal.tabButton,
        activeTab: commonStyles.notificationModal.activeTab,
        inactiveTab: commonStyles.notificationModal.inactiveTab,
        messagesContainer: { ...commonStyles.notificationModal.messagesContainer, height: windowDimensions.height - 220, },
        notificationContainer: {
            ...commonStyles.notificationModal.notificationContainer,
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
            marginBottom: 10,
        },
        tabButtonText: commonStyles.notificationModal.tabButtonText,
        refreshButtonContainer: commonStyles.notificationModal.refreshButtonContainer,
        refreshButton: commonStyles.notificationModal.refreshButton,
        completedSurvey: commonStyles.notificationModal.completedSurvey,
    };

    const { notifications, markNotificationsAsRead, fetchAllNotifications, isLoading } = useNotification();
    const [qualifiedNotifications, setQualifiedNotifications] = useState([]);
    const [detailViewMode, setDetailViewMode] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [currentTab, setCurrentTab] = useState('notifications'); // Default tab is notifications
    const [fetchNeeded, setFetchNeeded] = useState(true);
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [lastFetchTime, setLastFetchTime] = useState(() => {
        // Retrieve the last fetch time from localStorage or set to 0
        return parseInt(localStorage.getItem('lastFetchTime'), 10) || 0;
    });
    const completedSurveys = JSON.parse(localStorage.getItem('completedSurveys') || '[]');
    const [isPulledDown, setIsPulledDown] = useState(false);
    const [style, api] = useSpring(() => ({ y: 0 }));
    const [schedulerData, setSchedulerData] = useState([]);
    const [pushNotification, setPushNotification] = useState(null);
    const [pendingMessageId, setPendingMessageId] = useState(null);
    const [notificationUpdated, setNotificationUpdated] = useState(false);

    const bind = useDrag(({ down, movement: [mx, my] }) => {
        if (down) {
            api.start({ y: my });
        } else {
            api.start({ y: 0 });
            if (my > 100) {
                setIsPulledDown(true);
            }
        }
    }, { axis: 'y' });

    const fetchSchedulerData = async () => {
        try {
            // Fetch new data from the server if no cached data is available
            console.log('Fetching new data from server');
            const response = await fetch('https://rtut-app-admin-server-c2d4ae9d37ae.herokuapp.com/api/fetch-events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setSchedulerData(data);
                // Update local storage with new data
                localStorage.setItem('eventsData', JSON.stringify(data));
                console.log('Event Data fetched and cached');
            } else {
                console.error('Failed to fetch scheduler data:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to fetch scheduler data:', error);
        }
    };

    useEffect(() => {
        const handlePushNotificationAction = async (messageId) => {
            console.log('Setting pendingMessageId:', messageId);
            setPendingMessageId(messageId);
            setFetchNeeded(true);
        };
        
        // Register listeners on mount
        PushNotifications.addListener('pushNotificationReceived', (notification) => {
            console.log('Notification received: ', notification);
            const data = notification;
            setPushNotification(data);
            console.log('Notifications fetched by push.');

            fetchAllNotifications().then(() => {
                console.log('Notifications fetched successfully.');
            }).catch(error => {
                console.error('Failed to fetch notifications:', error);
            });
            fetchSchedulerData().then(() => {
                console.log('Events fetched successfully.');
            }).catch(error => {
                console.error('Failed to fetch events:', error);
            });
        });

        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
            console.log('Notification action performed', notification);
            handlePushNotificationAction(notification.notification.data.messageId);
        });

        return () => {
            // Clean up listeners on unmount
            PushNotifications.removeAllListeners();
        };
    }, []);

    useEffect(() => {
        const loadCachedNotifications = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                const cachedNotifications = await AsyncStorage.getItem(getStorageKey(userId));
                if (cachedNotifications) {
                    setQualifiedNotifications(JSON.parse(cachedNotifications));
                    setFetchNeeded(false);
                } else {
                    setFetchNeeded(true);
                }
            } catch (error) {
                setQualifiedNotifications([]);
                setFetchNeeded(true);
            }
        };

        fetchSchedulerData();
        loadCachedNotifications();
    }, []);

    useEffect(() => {
        console.log('useEffect: qualifiedNotifications', pendingMessageId, fetchNeeded);
        // Introduce a delay to ensure fetch is complete
        if (pendingMessageId && !fetchNeeded) {
            const matchedNotification = qualifiedNotifications.find(notification => notification.payload.messageId === pendingMessageId);
            if (matchedNotification) {
                console.log("match:", matchedNotification.payload.messageId);
                // setSelectedNotification(matchedNotification);
                // setDetailViewMode(true);
                setPendingMessageId(null);
            }
        }
    }, [qualifiedNotifications]);

    useEffect(() => {
        if (isPulledDown) {
            // Trigger the refresh logic
            fetchAllNotifications().then(() => {
                console.log('Fetch by pull down successfully.');
            }).catch(error => {
                console.error('Failed to fetch notifications:', error);
            });
            fetchSchedulerData().then(() => {
                console.log('Events fetched successfully.');
            }).catch(error => {
                console.error('Failed to fetch events:', error);
            });
            setIsPulledDown(false); // Reset the flag after refresh
        }
    }, [isPulledDown]);

    useEffect(() => {
        console.log('useEffect: lastFetchTime', lastFetchTime);
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                const now = Date.now();
                const elapsedTime = now - lastFetchTime;

                if (elapsedTime > FETCH_INTERVAL) {
                    setFetchNeeded(true);
                }
            }
        };
        const checkAndFetchNotifications = () => {
            const now = Date.now();
            const elapsedTime = now - lastFetchTime;

            if (elapsedTime > FETCH_INTERVAL) {
                console.log('Fetching notifications due to time interval...');
                setFetchNeeded(true);
            }
        };
        const FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

        document.addEventListener('visibilitychange', handleVisibilityChange);
        const intervalId = setInterval(checkAndFetchNotifications, FETCH_INTERVAL); // Check every 5 minutes
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearInterval(intervalId); // Clean up the interval when the component unmounts or dependencies change
        };
    }, [lastFetchTime]);

    useEffect(() => {
        console.log('useEffect: Fetch', fetchNeeded);
        if (fetchNeeded) {
            fetchAllNotifications().then(() => {
                console.log('Fetch by fetchNeeded successfully.');
                console.log(notifications);
                // Assuming fetchAllNotifications updates the notifications context,
                // the useEffect hook below will trigger and updateQualifiedNotifications.
            }).catch(error => console.error('Failed to fetch notifications:', error));
            fetchSchedulerData().then(() => {
                console.log('Events fetched successfully.');
            }).catch(error => {
                console.error('Failed to fetch events:', error);
            });
            setFetchNeeded(false);
            const now = Date.now();
            setLastFetchTime(now);
            localStorage.setItem('lastFetchTime', now.toString());
        }
    }, [fetchNeeded]);

    // Respond to Changes in Notifications State
    useEffect(() => {
        console.log('useEffect: notifications');
        // This will run after notifications state is updated in the context
        const updateQualifiedNotifications = async () => {
            await AsyncStorage.setItem('qualifiedNotifications', JSON.stringify(notifications));
            setQualifiedNotifications(notifications); // Now this uses the updated notifications
            setNotificationUpdated(true);
            console.log('updateQualifiedNotifications!'); // This should now log the updated state
        };

        if (!isLoading && notifications.length > 0) {
            updateQualifiedNotifications();
        }
    }, [notifications, isLoading]);

    useEffect(() => {
        // Update filteredNotifications when qualifiedNotifications or currentTab changes
        console.log('useEffect: qualifiedNotifications/currentTab',qualifiedNotifications,currentTab);
        const newFilteredNotifications = qualifiedNotifications.filter(notification => {
            if (currentTab === 'surveys') {
                return notification.payload.messageType === 'SURVEY';
            }
            else if (currentTab === 'notifications') {
                return notification.payload.messageType === 'NOTIFICATION' ||
                    !['NOTIFICATION', 'SURVEY'].includes(notification.payload.messageType);
            }
        });
        setFilteredNotifications(newFilteredNotifications);
    }, [qualifiedNotifications, currentTab]);

    useEffect(() => {
        console.log('useEffect: detailViewMode',detailViewMode);
        // Logic that needs to run when detailViewMode changes
        if (detailViewMode) {
            // If detailViewMode is true, perform actions for detail view being active
        } else {
            // If detailViewMode is false, perform actions for returning to the list view
            // For example, refreshing the list view to reflect any changes
            setFetchNeeded(true);
        }
    }, [detailViewMode]);

    const handleNotificationPress = useCallback((notification) => {
        markNotificationsAsRead(notification.id);
        setSelectedNotification(notification);
        setDetailViewMode(true);
    }, [markNotificationsAsRead]);

    const handleReadNotification = () => {
        setDetailViewMode(false);
    };

    const handleSurveyComplete = async (answers) => {
        try {
            const timestamp = Date.now();
            const surveyId = selectedNotification.payload.uniqueId;
            // Send the survey result to the server
            const response = await fetch('https://rtut-app-admin-server-c2d4ae9d37ae.herokuapp.com/api/submit-survey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ surveyId, answers, timestamp }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit survey: ' + response.statusText);
            }

            const completedSurveys = JSON.parse(localStorage.getItem('completedSurveys') || '[]');

            if (!completedSurveys.includes(surveyId)) {
                completedSurveys.push(surveyId);
                localStorage.setItem('completedSurveys', JSON.stringify(completedSurveys));
            }

            // Handle the server response if needed
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const responseData = await response.json();
                console.log('Survey submitted successfully:', responseData);
            }
            else {
                // Handle non-JSON responses
                console.log('Survey submitted successfully:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting survey:', error.message);
        }
        setDetailViewMode(false);
    };

    const handleTabChange = useCallback((tab) => {
        setCurrentTab(tab);
    }, []);

    let surveyJson;

    try {
        if (selectedNotification.payload.messageType === 'SURVEY') {
            surveyJson = JSON.parse(selectedNotification.payload.messageContent);
        }
    } catch (error) {
        console.error('Failed to parse survey JSON:', error);
        surveyJson = null;
    }

    return (
        <View style={styles.container}>
            {detailViewMode ? (
                currentTab === 'surveys' ? (
                    <SurveyRenderer
                        surveyJson={surveyJson}
                        onCancel={() => setDetailViewMode(false)}
                        onSurveyComplete={handleSurveyComplete}
                        windowDimensions={windowDimensions}
                    />
                ) : (
                    <MessageDetailComponent
                        notification={selectedNotification}
                        onBack={handleReadNotification}
                        windowDimensions={windowDimensions}
                    />
                )
            ) : (
                <animated.div {...bind()} style={{ y: style.y.to(y => Math.min(y, 150)) }}>
                    {currentTab === 'calendar' ? (
                        <View style={styles.messagesContainer}>
                            <CalendarComponent windowDimensions={windowDimensions} data={schedulerData} />
                        </View>
                    ) : (
                        <ScrollView
                            style={styles.messagesContainer}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        >
                            {filteredNotifications.map(notification => (
                                <View
                                    key={notification.id}
                                    style={styles.notificationContainer}
                                >
                                    <MessageViewComponent
                                        notification={notification}
                                        onPress={() => {
                                            if (currentTab !== 'surveys' || !completedSurveys.includes(notification.payload.uniqueId)) {
                                                handleNotificationPress(notification);
                                            }
                                        }}
                                        isSurveyCompleted={completedSurveys.includes(notification.payload.uniqueId)}
                                        windowDimensions={windowDimensions}
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    )}
                </animated.div>
            )}
            {!detailViewMode && (
                <View style={styles.tabButtonContainer}>
                    <Pressable
                        style={[
                            styles.tabButton,
                            currentTab === 'notifications' && styles.activeTab,
                            currentTab !== 'notifications' && styles.inactiveTab,
                        ]}
                        onPress={() => handleTabChange('notifications')}
                    >
                        <TfiAnnouncement style={styles.tabButton} />
                        <Text style={[
                            styles.tabButtonText,
                            currentTab === 'notifications' && styles.activeTab,
                            currentTab !== 'notifications' && styles.inactiveTab
                        ]}>
                            Notification
                        </Text>
                    </Pressable>
                    <Pressable
                        style={[
                            styles.tabButton,
                            currentTab === 'surveys' && styles.activeTab,
                            currentTab !== 'surveys' && styles.inactiveTab,
                        ]}
                        onPress={() => handleTabChange('surveys')}
                    >
                        <CiSquareQuestion style={styles.tabButton} />
                        <Text style={[
                            styles.tabButtonText,
                            currentTab === 'surveys' && styles.activeTab,
                            currentTab !== 'surveys' && styles.inactiveTab
                        ]}>
                            Survey
                        </Text>
                    </Pressable>
                    <Pressable
                        style={[
                            styles.tabButton,
                            currentTab === 'calendar' && styles.activeTab,
                            currentTab !== 'calendar' && styles.inactiveTab,
                        ]}
                        onPress={() => handleTabChange('calendar')}
                    >
                        <CiCirclePlus style={styles.tabButton} />
                        <Text style={[
                            styles.tabButtonText,
                            currentTab === 'calendar' && styles.activeTab,
                            currentTab !== 'calendar' && styles.inactiveTab
                        ]}>
                            Calendar
                        </Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}

export default NotificationModal;
