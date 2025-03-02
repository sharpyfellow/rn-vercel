import React, { useContext, useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import axios from "axios";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../AuthContext"; // Import the context

const HomeScreen = () => {
  const { token } = useContext(AuthContext); // Get the token from context
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("https://rn-atlas-image-picker-1.onrender.com/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(response.data);
      console.log("Fetched posts:", response.data); // Log the fetched posts
    } catch (error) {
      console.log("Error fetching posts:", error.response.data);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [token])
  );

  const renderItem = ({ item }) => {
    const formattedDate = moment(item.createdAt).format("DD:MM:YYYY");
    return (
      <View style={styles.postContainer}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postDescription}>{item.description}</Text>
        <Text style={styles.author}>Posted by: {item.postedBy.name}</Text>
        <Text style={styles.date}>Date: {formattedDate}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
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
  postContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  postDescription: {
    fontSize: 14,
  },
  author: {
    fontSize: 12,
    fontStyle: "italic",
  },
  date: {
    fontSize: 12,
    color: "gray",
  },
});

export default HomeScreen;
