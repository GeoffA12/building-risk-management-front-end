import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';
import isEqual from 'lodash.isequal';
import Icon from 'react-native-ionicons';
import PropTypes from 'prop-types';
import { screenerEnum } from '../config/ScreenerEnum';
import { radioButtonEnum } from '../config/RadioButtonEnum';
import { DARK_BLUE, LIGHT_TEAL } from '../../common/styles/Colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 5,
        marginHorizontal: 2,
        backgroundColor: 'white',
    },
    row: {
        padding: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 4,
    },
    cell: {
        flex: 1,
        padding: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    col: {
        flexDirection: 'column',
        padding: 2,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    questionText: {
        fontSize: 14,
        fontWeight: '500',
        color: `${DARK_BLUE}`,
    },
    iconText: {
        fontSize: 15,
        fontWeight: '600',
        color: `${DARK_BLUE}`,
        marginBottom: 1,
    },
});

const ScreenerResponse = ({
    screener,
    screenerIndex,
    handleScreenerResponseChange,
}) => {
    const [yesIcon, setYesIcon] = useState({
        text: screenerEnum.YES.text,
        iconName: radioButtonEnum.RADIO_BUTTON_OFF,
        apiEnumValue: screenerEnum.YES.apiEnumValue,
    });
    const [noIcon, setNoIcon] = useState({
        text: screenerEnum.NO.text,
        iconName: radioButtonEnum.RADIO_BUTTON_OFF,
        apiEnumValue: screenerEnum.NO.apiEnumValue,
    });
    const [naIcon, setNaIcon] = useState({
        text: screenerEnum.N_A.text,
        iconName: radioButtonEnum.RADIO_BUTTON_OFF,
        apiEnumValue: screenerEnum.N_A.apiEnumValue,
    });
    const [iconArray, setIconArray] = useState([]);

    useEffect(() => {
        switch (screener.response) {
            case screenerEnum.YES.apiEnumValue:
                setYesIcon((prevYesIcon) => {
                    return updateIconName(
                        prevYesIcon,
                        radioButtonEnum.RADIO_BUTTON_ON
                    );
                });
                break;
            case screenerEnum.NO.apiEnumValue:
                setNoIcon((prevNoIcon) => {
                    return updateIconName(
                        prevNoIcon,
                        radioButtonEnum.RADIO_BUTTON_ON
                    );
                });
                break;
            case screenerEnum.N_A.apiEnumValue:
                setNaIcon((prevNaIcon) => {
                    return updateIconName(
                        prevNaIcon,
                        radioButtonEnum.RADIO_BUTTON_ON
                    );
                });
                break;
            default:
                break;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const iconArrayReplica = [...iconArray];
        const prevYesIcon = iconArrayReplica[0];
        const prevNoIcon = iconArrayReplica[1];
        const prevNaIcon = iconArrayReplica[2];
        if (
            !isEqual(prevYesIcon, yesIcon) &&
            yesIcon.iconName === radioButtonEnum.RADIO_BUTTON_ON
        ) {
            handleScreenerResponseChange(screenerIndex, yesIcon.apiEnumValue);
        } else if (
            !isEqual(prevNoIcon, noIcon) &&
            noIcon.iconName === radioButtonEnum.RADIO_BUTTON_ON
        ) {
            handleScreenerResponseChange(screenerIndex, noIcon.apiEnumValue);
        } else if (
            !isEqual(prevNaIcon, naIcon) &&
            naIcon.iconName === radioButtonEnum.RADIO_BUTTON_ON
        ) {
            handleScreenerResponseChange(screenerIndex, naIcon.apiEnumValue);
        } else {
            handleScreenerResponseChange(
                screenerIndex,
                screenerEnum.EMPTY.apiEnumValue
            );
        }
        setIconArray([yesIcon, noIcon, naIcon]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [yesIcon, noIcon, naIcon]);

    function updateIconName(previousIcon, radioValue) {
        let updatedIcon = { ...previousIcon };
        updatedIcon.iconName = radioValue;
        return updatedIcon;
    }

    function switchIconNames(iconList) {
        for (let x = 0; x < iconList.length; ++x) {
            let curr_icon = iconList[x];
            if (
                curr_icon.text === screenerEnum.YES.text &&
                curr_icon.iconName === radioButtonEnum.RADIO_BUTTON_ON
            ) {
                setYesIcon((prevYesIcon) => {
                    return updateIconName(
                        prevYesIcon,
                        radioButtonEnum.RADIO_BUTTON_OFF
                    );
                });
            } else if (
                curr_icon.text === screenerEnum.NO.text &&
                curr_icon.iconName === radioButtonEnum.RADIO_BUTTON_ON
            ) {
                setNoIcon((prevNoIcon) => {
                    return updateIconName(
                        prevNoIcon,
                        radioButtonEnum.RADIO_BUTTON_OFF
                    );
                });
            } else if (
                curr_icon.text === screenerEnum.N_A.text &&
                curr_icon.iconName === radioButtonEnum.RADIO_BUTTON_ON
            ) {
                setNaIcon((prevNaIcon) => {
                    return updateIconName(
                        prevNaIcon,
                        radioButtonEnum.RADIO_BUTTON_OFF
                    );
                });
            }
        }
    }

    function handleScreenerResponsePress(icon) {
        let radioValue =
            icon.iconName === radioButtonEnum.RADIO_BUTTON_OFF
                ? radioButtonEnum.RADIO_BUTTON_ON
                : radioButtonEnum.RADIO_BUTTON_OFF;
        switch (icon.text) {
            case screenerEnum.YES.text:
                setYesIcon((prevYesIcon) => {
                    return updateIconName(prevYesIcon, radioValue);
                });
                switchIconNames([noIcon, naIcon]);
                break;
            case screenerEnum.NO.text:
                setNoIcon((prevNoIcon) => {
                    return updateIconName(prevNoIcon, radioValue);
                });
                switchIconNames([yesIcon, naIcon]);
                break;
            case screenerEnum.N_A.text:
                setNaIcon((prevNaIcon) => {
                    return updateIconName(prevNaIcon, radioValue);
                });
                switchIconNames([noIcon, yesIcon]);
                break;
            default:
                console.log('Unknown text passed in.', icon.text);
        }
    }

    function renderScreenerResponseColumns() {
        return iconArray.length > 0
            ? iconArray.map((icon, index) => {
                  return (
                      <View style={styles.col} key={index}>
                          <Text style={styles.iconText}>{icon.text}</Text>
                          <TouchableHighlight
                              onPress={() => handleScreenerResponsePress(icon)}
                              underlayColor={`${LIGHT_TEAL}`}>
                              <Icon name={icon.iconName} size={23} />
                          </TouchableHighlight>
                      </View>
                  );
              })
            : null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.cell}>
                    <Text style={styles.questionText}>{screener.question}</Text>
                </View>
                <View style={styles.cell}>
                    {renderScreenerResponseColumns()}
                </View>
            </View>
        </View>
    );
};

ScreenerResponse.propTypes = {
    screener: PropTypes.object.isRequired,
    screenerIndex: PropTypes.number.isRequired,
    handleScreenerResponseChange: PropTypes.func.isRequired,
};

export default ScreenerResponse;
