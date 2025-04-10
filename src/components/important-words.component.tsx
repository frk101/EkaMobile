import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../constants';

interface Props {
  motto: any;
}
const ImportantWordsComponent: React.FC<Props> = ({motto}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{motto[0].title}</Text>
      <Text style={styles.description}>{motto[0].author}</Text>
    </View>
  );
};

export default ImportantWordsComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  text: {
    fontWeight: '700',
    color: Colors.BLACK,
  },
  description: {
    fontWeight: '300',
    color: Colors.BLACK,
    marginTop: 20,
  },
});
