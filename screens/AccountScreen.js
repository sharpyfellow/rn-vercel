import React, { useContext, useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { AuthContext } from "../AuthContext"; // Import the context

const AccountScreen = ({ navigation }) => {
  const { user, token, logout } = useContext(AuthContext); // Get the user, token, and logout function from context
  const [image, setImage] = useState(user ? user.profileImageUrl : null);

  useEffect(() => {
    if (user && user.profileImageUrl) {
      setImage(user.profileImageUrl);
      console.log("Profile Image URL set in useEffect:", user.profileImageUrl); // Log the profile image URL
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigation.navigate("Login");
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImage(uri);
        console.log("Image URI from picker:", uri); // Log the image URI
        uploadImage(uri);
      }
    } catch (error) {
      console.log("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImage(uri);
        console.log("Image URI from camera:", uri); // Log the image URI
        uploadImage(uri);
      }
    } catch (error) {
      console.log("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const uploadImage = async (uri) => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: "profile.jpg",
    });
    formData.append("upload_preset", "my_upload_preset"); // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dhb0lbi4w/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const imageUrl = response.data.secure_url;
      console.log("Image URL from Cloudinary:", imageUrl); // Log the image URL from Cloudinary
      updateUserProfileImage(imageUrl);
    } catch (error) {
      console.log("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload image");
    }
  };

  const updateUserProfileImage = async (imageUrl) => {
    try {
      const response = await axios.put(
        `https://rn-atlas-image-picker-1.onrender.com/users/${user.id}`,
        { profileImageUrl: imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("User profile updated:", response.data);
      setImage(imageUrl); // Update the image state with the new URL
      console.log("Profile Image URL set in updateUserProfileImage:", imageUrl); // Log the profile image URL
      Alert.alert("Success", "Profile image updated successfully");
    } catch (error) {
      console.log("Error updating user profile:", error);
      Alert.alert("Error", "Failed to update profile image");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Welcome, {user ? user.name : "User"}!
      </Text>
      {image && <Image source={{ uri: image }} style={styles.profileImage} />}
      <Button title="Pick an image from gallery" onPress={pickImage} />
      <Button title="Take a photo" onPress={takePhoto} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
});

export default AccountScreen;
