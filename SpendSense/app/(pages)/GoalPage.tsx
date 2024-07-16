import styles from "@/styles/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import Goals from "@/components/Goals";
import { DescriptionText } from "@/components/DescriptionText";

const ViewGoals = () => {
  const header = "Purchase Goals"
  const description = "Dreaming of buying something special? Keep track of how much you have saved toward your desired purchase!\n\nThe amount in each goal card is the amount of money saved in that time period, or the total outflows subtracted from the total inflows."
  return (
    <SafeAreaView style = {styles.indexContainer}>
      <Goals />
      <DescriptionText header={header} description={description}/>
    </SafeAreaView>
  );
};

export default ViewGoals;