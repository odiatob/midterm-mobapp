import React, { useState, useCallback } from "react"; 
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useDarkMode, darkModeStyles } from "../context/DarkModeContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

interface Job {
  title: string;
  companyName: string;
  jobType: string;
  id: string;
}

interface SavedJobsProps {
  route: { params: { savedJobs: Job[]; setSavedJobs: React.Dispatch<React.SetStateAction<Job[]>> } };
}

const SavedJobs: React.FC<SavedJobsProps> = ({ route }) => {
  const { isDarkMode } = useDarkMode();
  const styles = darkModeStyles(isDarkMode);
  const navigation = useNavigation();

  const { savedJobs: initialSavedJobs, setSavedJobs } = route.params;

  // Create a local state to manage saved jobs
  const [savedJobs, updateSavedJobs] = useState<Job[]>(initialSavedJobs);

  // Refresh saved jobs list when screen is revisited
  useFocusEffect(
    useCallback(() => {
      updateSavedJobs(initialSavedJobs);
    }, [initialSavedJobs])
  );

  // Function to remove a job from saved jobs
  const handleUnsaveJob = (jobId: string) => {
    Alert.alert("Unsave Job", "Are you sure you want to remove this job from saved?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Unsave",
        onPress: () => {
          const updatedJobs = savedJobs.filter((job) => job.id !== jobId);
          updateSavedJobs(updatedJobs); // Update local state
          setSavedJobs(updatedJobs); // Update global state
          Alert.alert("Removed", "The job has been removed from your saved list.");
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      {savedJobs.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>No saved jobs</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <FlatList
            data={savedJobs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.jobCard}>
                <Text style={[styles.text, { fontSize: 20, fontWeight: "bold" }]}>{item.title}</Text>
                <Text style={styles.text}>{item.companyName}</Text>
                <Text style={styles.text}>{item.jobType}</Text>

                {/* Unsave Job Button */}
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    padding: 5,
                    backgroundColor: "#d32f2f",
                    borderRadius: 15,
                  }}
                  onPress={() => handleUnsaveJob(item.id)}
                >
                  <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>X</Text>
                </TouchableOpacity>

                {/* Apply Button */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate("ApplicationForm", { jobDetails: item })}
                >
                  <Text style={styles.buttonText}>Apply</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}

      {/* Go Back Button */}
      <View style={{ alignItems: "center", paddingBottom: 20 }}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back to Jobs</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SavedJobs;