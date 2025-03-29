import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput, // Added TextInput for search bar
} from 'react-native';
import axios from 'axios';
import uuid from 'react-native-uuid';
import { useDarkMode, darkModeStyles } from '../context/DarkModeContext';
import { useNavigation } from '@react-navigation/native';

interface Job {
  title: string;
  mainCategory: string;
  companyName: string;
  jobType: string;
  id: string;
}

const API_URL = 'https://empllo.com/api/v1';

const JobFinderScreen: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const styles = darkModeStyles(isDarkMode);
  const navigation = useNavigation();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]); // Filtered jobs state
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search input state
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Jobs Function
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      console.log('API Response:', response.data);
      const jobsWithIds = response.data.jobs.map((job: Job) => ({
        ...job,
        id: uuid.v4() as string,
      }));
      setJobs(jobsWithIds);
      setFilteredJobs(jobsWithIds); // Initialize filteredJobs
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('⚠️ Failed to load jobs');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter jobs based on search query
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter((job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  }, [searchQuery, jobs]);

  // Pull-to-Refresh Function
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };

  const handleSaveJob = (job: Job) => {
    if (savedJobs.some((savedJob) => savedJob.id === job.id)) {
      Alert.alert('Unsave Job', 'Are you sure you want to remove this job from saved?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unsave',
          onPress: () =>
            setSavedJobs((prevSavedJobs) =>
              prevSavedJobs.filter((savedJob) => savedJob.id !== job.id)
            ),
        },
      ]);
    } else {
      setSavedJobs([...savedJobs, job]);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 15,
            padding: 8,
            backgroundColor: '#e1bee7',
            borderRadius: 5,
          }}
          onPress={() => navigation.navigate('SavedJobs', { savedJobs, setSavedJobs })}
        >
          <Text style={{ color: isDarkMode ? 'white' : 'black', fontWeight: 'bold' }}>
            Saved Jobs
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, savedJobs, isDarkMode]);

  if (loading) return <ActivityIndicator size="large" color="#6a0572" />;
  if (error) return <Text style={styles.text}>{error}</Text>;

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={{
          height: 40,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 8,
          marginBottom: 10,
          paddingLeft: 10,
          color: isDarkMode ? 'white' : 'black',
          backgroundColor: isDarkMode ? '#333' : '#fff',
        }}
        placeholder="Search for a job..."
        placeholderTextColor={isDarkMode ? '#bbb' : '#666'}
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      <FlatList
        data={filteredJobs} // Use filteredJobs instead of jobs
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.jobCard}>
            <Text
              style={[
                styles.text,
                { fontSize: 20, fontWeight: 'bold', color: isDarkMode ? 'white' : '#6a0572' },
              ]}
            >
              {item.title}
            </Text>

            <Text style={[styles.text, { fontWeight: 'bold', marginTop: 5 }]}>
              🏷️Category: <Text style={{ fontWeight: 'normal' }}>{item.mainCategory}</Text>
            </Text>

            <Text style={[styles.text, { fontWeight: 'bold', marginTop: 5 }]}>
              🏢Company: <Text style={{ fontWeight: 'normal' }}>{item.companyName}</Text>
            </Text>

            <Text style={[styles.text, { fontWeight: 'bold', marginTop: 5 }]}>
              ⏳Job Type: <Text style={{ fontWeight: 'normal' }}>{item.jobType}</Text>
            </Text>

            {/* Save Job Button */}
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: savedJobs.some((savedJob) => savedJob.id === item.id)
                    ? isDarkMode
                      ? '#d32f2f'
                      : '#4CAF50'
                    : isDarkMode
                    ? '#1976d2'
                    : '#ff9800',
                  borderColor: isDarkMode ? '#555' : '#ddd',
                  marginTop: 10,
                },
              ]}
              onPress={() => handleSaveJob(item)}
            >
              <Text style={{ fontWeight: 'bold', color: 'white' }}>
                {savedJobs.some((savedJob) => savedJob.id === item.id) ? 'Saved' : 'Save Job'}
              </Text>
            </TouchableOpacity>

            {/* Apply Button */}
            <TouchableOpacity
              style={[styles.button, { marginTop: 10 }]}
              onPress={() => navigation.navigate('ApplicationForm')}
            >
              <Text style={{ fontWeight: 'bold', color: 'white' }}>Apply Now</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default JobFinderScreen;
