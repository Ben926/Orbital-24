import { Text, Pressable, View, Modal } from "react-native";
import { useState } from "react";
import styles from "@/styles/styles";


export const DescriptionText = ({header, description}) => {
    const [descriptionVisible, setDescriptionVisible] = useState(false);
    return (
    <View>
        <Pressable
            style={styles.questionButton}
            onPress={() => setDescriptionVisible(true)}
        >
            <Text style={styles.questionButtonText}>?</Text>
        </Pressable>
        <Modal
            animationType="slide"
            transparent={true}
            visible={descriptionVisible}
            onRequestClose={() => {
            setDescriptionVisible(!descriptionVisible);
            }}
        >
            <View style={styles.modalContainer}>
            <View style={styles.modalView}>
                <Text style={styles.welcomeText}>{header}</Text>
                <Text style={styles.descriptionText}>{description}</Text>
                <Pressable
                style={[styles.button, styles.transparentButton]}
                onPress={() => setDescriptionVisible(!descriptionVisible)}
                >
                <Text style={styles.transparentButtonText}>Close</Text>
                </Pressable>
            </View>
            </View>
        </Modal>
      </View>
    )
}