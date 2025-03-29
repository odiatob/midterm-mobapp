import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const ApplicationFormScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const fromSavedJobs = route.params?.fromSavedJobs || false;

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [reason, setReason] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  // Validate email format
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  // Validate contact number (PH, US, UK examples)
  const isValidContact = (number: string) => {
    return /^(09\d{9}|(\+63|0)9\d{9}|(\+1)?\d{10}|(\+44)?\d{10})$/.test(number);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!name || !email || !contactNumber || !reason) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (!isValidContact(contactNumber)) {
      Alert.alert("Invalid Contact Number", "Enter a valid PH, US, or UK number.");
      return;
    }

    // Show modal feedback
    setModalVisible(true);
  };

  // Close modal and reset navigation
  const handleCloseModal = () => {
    setModalVisible(false);

    // Reset form fields
    setName("");
    setEmail("");
    setContactNumber("");
    setReason("");

    if (fromSavedJobs) {
      navigation.reset({
        index: 0,
        routes: [{ name: "JobFinder" }],
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Apply for a Job</Text>

      {/* Name Input */}
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your full name"
        value={name}
        onChangeText={setName}
      />

      {/* Email Input */}
      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Contact Number Input */}
      <Text style={styles.label}>Contact Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        value={contactNumber}
        onChangeText={setContactNumber}
        keyboardType="phone-pad"
      />

      {/* Reason Input */}
      <Text style={styles.label}>Why should we hire you?</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Explain briefly..."
        value={reason}
        onChangeText={setReason}
        multiline
      />

      {/* Apply Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Application</Text>
      </TouchableOpacity>

      {/* Success Modal */}
      <Modal visible={isModalVisible} animationType="fade" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>🎉 Application Submitted!</Text>
            <Text style={styles.modalText}>Your application has been received successfully.</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
              <Text style={styles.modalButtonText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ApplicationFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6a0572",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#6a0572",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 320,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6a0572",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    color: "#555",
  },
  modalButton: {
    backgroundColor: "#6a0572",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
