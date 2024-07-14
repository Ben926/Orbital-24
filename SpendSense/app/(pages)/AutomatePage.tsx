import styles from "@/styles/styles.js";
import { Text, Pressable, View, Modal } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AutomatedTransactions from "@/components/AutomatedTransactions";
import { DescriptionText } from "@/components/DescriptionText";

const AutomatePage= () => {
  const header = 'Automate Transactions';
  const description = 'Automate your daily, weekly or monthly transactions and save time by eliminating the need for manual entries!'
  return (
    <SafeAreaView style = {styles.indexContainer}>
      <AutomatedTransactions />
      <DescriptionText header={header} description={description}/>
    </SafeAreaView>
  );
};

export default AutomatePage;