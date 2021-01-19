import React, {useState, useContext, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {Card} from 'react-native-paper';
import AuthContext from '../../auth/contexts/AuthContext';
import { useHeader } from '../hooks/CalendarHeader';
import { BASE_URL } from '../../config/APIConfig';

const CalendarScreen = ({navigation}) => {
    const {
        auth: { logout },
        user,
    } = useContext(AuthContext);
    const { setCalendarHeader } = useHeader();
    const [riskAssessmentScheduleIdsList, setRiskAssessmentScheduleIdsList] = useState([]);
    const [riskAssessmentScheduleList, setRiskAssessmentScheduleList] = useState([]);
    const [itemsList, setItemsListForAgenda] = useState([]);
    const today = new Date().toISOString().slice(0, 10);

    useEffect(() => {
        setCalendarHeader(navigation, logout);
    }, [navigation, logout]);

    useEffect(() => {
        async function getAssignedRiskAssessmentScheduleIds(){
            const siteMaintenanceAssociate = await fetch(`${BASE_URL}/getSiteMaintenanceAssociateById?id=${user.id}`);
            const data = await siteMaintenanceAssociate.json();
            const idsList = data.assignedRiskAssessmentScheduleIds;
            setRiskAssessmentScheduleIdsList(idsList);
        }
        getAssignedRiskAssessmentScheduleIds();
    }, []);

    useEffect(() => {
        async function getRiskAssessmentSchedules(){
            if(riskAssessmentScheduleIdsList.length > 0){
                const rawData = JSON.stringify({"riskAssessmentScheduleIds": riskAssessmentScheduleIdsList});
                const riskAssessmentSchedules = await fetch(`${BASE_URL}/getRiskAssessmentSchedulesByRiskAssessmentSchedulesIdsList`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: rawData
                });
                const data = await riskAssessmentSchedules.json();
                setRiskAssessmentScheduleList(data);
            }
        }
        getRiskAssessmentSchedules();
    }, [riskAssessmentScheduleIdsList]);

    useEffect(() => {
        async function formatRiskAssessmentSchedules(){
            const items = {};
            for (const schedule of riskAssessmentScheduleList){
                items[schedule["dueDate"].slice(0, 10)] = [{name : schedule["title"], id: schedule["id"]}];
            }
            setItemsListForAgenda(items);
        }
        formatRiskAssessmentSchedules();
    }, [riskAssessmentScheduleList]);

    const renderItem = (item) => {
        return (
        <TouchableOpacity style={{marginRight: 10, marginTop: 17}}>
            <Card>
                <Card.Content>
                    <View 
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                        <Text>{item.name}</Text>
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>
        );
    };

    return (
        <View style={{flex: 1}}>
            <Agenda
            items={itemsList}
            selected={today}
            renderItem={renderItem}
            />
        </View>
    );

};

export default CalendarScreen;