import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

export default function Day(props) {
  let daysMapping = {0: 'Mo', 1:'Tu', 2: 'We', 3: 'Th', 4:'Fr', 5:'Sa', 6:'Su' }
  return (
    <TouchableOpacity 
      style={ [props.style, styles.default, props.isActive ? styles.active : styles.inactive]}
      onPress={() => props.toggleDay(props.day)}
    >
      <Text style={props.isActive ? styles.activeText : styles.inactiveText}>
        {daysMapping[props.day]}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  default:{
    height: 37,
    width: 37,
    borderRadius: 37,
    alignItems: 'center',
    justifyContent: 'center'
  },
  active: { 
    backgroundColor: '#000051'
  },
  inactive: {

  },
  activeText: {
    color: '#ffffff'
  },
  inactiveText: {
    color: '#aaaaaa'
  }
});
