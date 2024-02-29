import React from 'react';
import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    Dimensions,
    ScrollView,
  } from 'react-native';

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart,
  } from 'react-native-chart-kit';

import { VictoryBar, VictoryChart, VictoryTheme, VictoryGroup, VictoryLine, VictoryLegend } from "victory-native";

import colors from '../config/colors';
import textStyles from '../styles/text';


export const VictoryBarChart = (props) =>{
    const {title, data1, data2} = props
    return (
        <View style={{margin:5, borderColor:colors.lightGray, borderWidth:0.5, borderRadius:5, padding:5}}>
            <Text style={textStyles.textSmallBlue}>{title}</Text>
            <VictoryChart width={360} height={280} theme={VictoryTheme.material}>
            <VictoryLegend x={120} y={10}
                orientation="horizontal"
                gutter={20}
                colorScale={[ colors.backgroundDarkBlue, colors.lightGray ]}
                data={[
                { name: "Actual" }, { name: "Target" }
                ]}
                />
            <VictoryGroup offset={15} animate={{onLoad: { duration: 1000 }}}>
                    <VictoryBar style={{ data: { fill: colors.backgroundDarkBlue } }} data={data1}/>
                    <VictoryBar style={{ data: { fill: colors.lightGray } }} data={data2}/>
            </VictoryGroup>
            </VictoryChart>
        </View>
    )
}

export const VictoryLineChart = (props) =>{
    const {data1, data2} = props
    return (
        <VictoryChart width={350} theme={VictoryTheme.material}>
          <VictoryGroup offset={20} animate={{ duration: 1000, onLoad: { duration: 1000 }}}>
                <VictoryLine data={data1}/>
                <VictoryLine data={data2}/>
          </VictoryGroup>
        </VictoryChart>
    )
}


export const MyLineChart = (props) => {

    const {x,y,title} = props

    return (
      <View style={{borderColor: colors.backgroundWhite, borderWidth:1, padding:10}}>
        <Text style={[textStyles.textMedBlue, {textAlign:'center'}]}>{title}</Text>
        <LineChart
          data={{
            labels: x,
            datasets: [
              {
                data: y,
                color: () => colors.backgroundDarkBlue,
              },
              {
                data: [5,4,3,2,1],
                color: () => colors.textGray,
              },
            ],
          }}
          width={Dimensions.get('window').width - 20}
          height={220}
          chartConfig = {lineChartConfig}
        />
      </View>
    );
  };

  export const MyBarChart = (props) => {

    const {x,y,title} = props

    return (
      <View style={{borderColor: colors.backgroundWhite, borderWidth:1, padding:10}}>
        <Text style={[textStyles.textMedBlue, {textAlign:'center'}]}>{title}</Text>
        <BarChart
          data={{
            labels: x,
            datasets: [
                {
                data: y,
                color: () => colors.textGray,
                },
                {
                data: [5,4,3,2,1],
                color: () => colors.textGray,
                },
            ],
          }}
          
          width={Dimensions.get('window').width - 20}
          height={220}
          chartConfig = {barChartConfig}
          //flatColor={true}
          showBarTops={false}
          //showValuesOnTopOfBars={true}
          fromZero = {true}
        />
      </View>
    );
  };

const lineChartConfig={
    backgroundColor: colors.backgroundBlue,
    backgroundGradientFrom: colors.backgroundBlue,
    backgroundGradientTo: colors.backgroundBlue,
    decimalPlaces: 1,
    color: () => colors.backgroundDarkBlue,
    strokeWidth: 1,
    fillShadowGradientFromOpacity: 0,
    fillShadowGradientToOpacity: 0,
    propsForBackgroundLines:{
        stroke:'none'
    },
    style: {
      borderRadius: 16,
    },
  }

  const barChartConfig={
    backgroundColor: colors.backgroundBlue,
    backgroundGradientFrom: colors.backgroundBlue,
    backgroundGradientTo: colors.backgroundBlue,
    decimalPlaces: 1,
    color: () => colors.backgroundDarkBlue,
    strokeWidth: 1,
    fillShadowGradientOpacity: 1,
    propsForBackgroundLines:{
        stroke:'none'
    },
    style: {
      borderRadius: 16,
    },
  }