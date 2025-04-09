import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../constants';

interface DotStepsProps {
  currStepIndex: number;
  stepCount: number;
}

const DotSteps: React.FC<DotStepsProps> = ({ currStepIndex, stepCount }) => {
  const dotCreator = () => {
    let dots = [];
    for (let i = 0; i < stepCount; i++) {
      dots.push(
        <View
          key={`dot-${i}`}
          style={[styles.dot, currStepIndex === i ? styles.activeDot : null]}
        />,
      );
    }
    return dots;
  };

  return <View style={styles.container}>{dotCreator()}</View>;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  dot: {
    height: 15,
    width: 15,
    borderRadius: 15,
    backgroundColor: Colors.greyColor2,
    margin: 5,
  },
  activeDot: {
    height: 15,
    width: 15,
    borderRadius: 15,
    backgroundColor: Colors.WHITE,
    margin: 5,
  },
});

export default DotSteps;
