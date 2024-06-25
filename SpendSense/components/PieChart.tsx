
import React from 'react';
import { PieChart } from 'react-native-chart-kit';
import { View, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
console.log(screenWidth);

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
        width={screenWidth*(3/4)}
        height={165}
        chartConfig={chartConfig}
        accessor={"amount"}
        backgroundColor={"white"}
        paddingLeft={"15"}

        absolute
      />
    </View>
  );
};

export default PieChartComponent;
