import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Modal,
    TouchableHighlight,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-ionicons';
import HazardEditor from '../../riskassessment/components/HazardEditor';
import { DARK_BLUE, LIGHT_TEAL } from '../../common/styles/Colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 5,
        marginHorizontal: 2,
        backgroundColor: 'white',
    },
    confirmedContainer: {
        flex: 1,
        marginVertical: 2,
        marginHorizontal: 2,
        backgroundColor: `${LIGHT_TEAL}`,
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        padding: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tripleCell: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
    },
    singleCell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
        padding: 5,
    },
    hazardPreviewText: {
        fontSize: 14,
        fontWeight: '700',
        color: `${DARK_BLUE}`,
        padding: 1,
    },
    iconStyle: {
        color: `${DARK_BLUE}`,
    },
    taskHeaderRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 2,
    },
    taskHeader: {
        fontSize: 17,
        fontWeight: '700',
        color: `${DARK_BLUE}`,
        padding: 5,
    },
});

const HazardPreview = ({
    hazard,
    handleHazardOnSavePress,
    handleHazardCheckPress,
    hazardIndex,
}) => {
    const [modalOpen, setModalOpen] = useState(false);

    function leaveHazardEditorPress() {
        setModalOpen(false);
    }

    function handleOpenHazardEditorPress() {
        setModalOpen(true);
    }

    return (
        <View
            style={
                hazard.didFulfillHazard
                    ? styles.confirmedContainer
                    : styles.container
            }>
            <Modal visible={modalOpen} animationType={'slide'}>
                <HazardEditor
                    leaveHazardEditorPress={leaveHazardEditorPress}
                    isMaintenanceView={true}
                    handleOnSavePress={handleHazardOnSavePress}
                    hazardDetails={hazard}
                    index={hazardIndex}
                />
            </Modal>
            <View style={styles.taskHeaderRow}>
                <Text style={styles.taskHeader}>Task description</Text>
            </View>
            <View style={styles.row}>
                <View style={styles.tripleCell}>
                    <Text style={styles.hazardPreviewText}>
                        {hazard.directions}
                    </Text>
                </View>
                <View style={styles.singleCell}>
                    <TouchableHighlight
                        onPress={() =>
                            handleOpenHazardEditorPress(hazardIndex)
                        }>
                        <Icon
                            name="create"
                            size={23}
                            style={styles.iconStyle}
                        />
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress={() => handleHazardCheckPress(hazardIndex)}>
                        <Icon
                            name="checkmark"
                            size={23}
                            style={styles.iconStyle}
                        />
                    </TouchableHighlight>
                </View>
            </View>
        </View>
    );
};

HazardPreview.propTypes = {
    hazard: PropTypes.object.isRequired,
    handleHazardOnSavePress: PropTypes.func.isRequired,
    handleHazardCheckPress: PropTypes.func.isRequired,
    hazardIndex: PropTypes.number.isRequired,
};

export default HazardPreview;
