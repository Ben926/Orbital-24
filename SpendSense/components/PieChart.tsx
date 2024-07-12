
import React from 'react';
import { PieChart } from 'react-native-chart-kit';
import { View, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const PieChartComponent = ({ data }) => {
  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientTo: "#08130D",
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  };

  return (
    <View>
      <PieChart
        data={data}
        width={screenWidth*(1)}
        height={160}
        chartConfig={chartConfig}
        accessor={"amount"}
        backgroundColor={"white"}
        paddingLeft='-30'
        absolute
      />
    </View>
  );
};

export default PieChartComponent;
