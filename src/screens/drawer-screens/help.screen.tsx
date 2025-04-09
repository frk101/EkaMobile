import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {AppDispatch, RootState} from '../../business/store';
import {useDispatch, useSelector} from 'react-redux';
import {fetchHelp} from '../../business/slices/help.slice';
import {Colors} from '../../constants';

const HelpScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  const {member} = useSelector((state: RootState) => state.memberSlice);
  const {helpLoading, help} = useSelector(
    (state: RootState) => state.helpSlice,
  );
  useEffect(() => {
    dispatch(fetchHelp({email: member?.email}));
  }, []);
  if (helpLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator color={Colors.blueColor} size="large" />
      </View>
    );
  }
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {/* <Text>HelpScreen</Text> */}
    </View>
  );
};

export default HelpScreen;

const styles = StyleSheet.create({});
