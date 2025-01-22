import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { theme } from "../styles/theme";

interface BookSelectProps {
  isOpen: boolean;
  onClose: () => void;
  section: string;
}

export default function BookSelect({
  isOpen,
  onClose,
  section,
}: BookSelectProps): JSX.Element | null {
  const [bookCovers, setBookCovers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(new Set<number>());

  const isbnList = [
    "9780141439518", // Pride and Prejudice
    "9780141439563", // Great Expectations
    "9780141439471", // Frankenstein
    "9780141439587", // Jane Eyre
    "9780141439495", // The Picture of Dorian Gray
    "9780141439747", // The Count of Monte Cristo
    "9780141439594", // Little Women
    "9780141439662", // Sense and Sensibility
    "9780141439679", // Hard Times
    "9780141439846"  // Dracula
  ];

  const bookData: { [key: string]: { title: string; author: string } } = {
    "9780141439518": { title: "Pride and Prejudice", author: "Jane Austen" },
    "9780141439563": { title: "Great Expectations", author: "Charles Dickens" },
    "9780141439471": { title: "Frankenstein", author: "Mary Shelley" },
    "9780141439587": { title: "Emma", author: "Jane Austen" },
    "9780141439495": { title: "Gulliver's Travels", author: "Jonathan Swift" },
    "9780141439747": { title: "Oliver Twist", author: "Charles Dickens" },
    "9780141439594": { title: "Tess of the D'Urbervilles", author: "Thomas Hardy" },
    "9780141439662": { title: "Sense and Sensibility", author: "Jane Austen" },
    "9780141439679": { title: "Hard Times", author: "Charles Dickens" },
    "9780141439846": { title: "Dracula", author: "Bram Stoker" }
  };

  useEffect(() => {
    if (isOpen) {
      // Reset states
      setLoading(true);
      setLoadedImages(new Set());
      setBookCovers([]); // Clear existing covers

      const booksCount =
        section === "Poetry"
          ? 5
          : section === "Excripts"
          ? 4
          : section === "What They Say"
          ? 6
          : section === "Written Work"
          ? 10
          : section === "Puicos"
          ? 10
          : 3;

      const getRandomISBNs = (count: number) => {
        const shuffled = [...isbnList].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
      };

      // Set new covers
      const coverUrls = getRandomISBNs(booksCount).map(
        (isbn) => `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
      );
      setBookCovers(coverUrls);
    }
  }, [isOpen, section]);

  useEffect(() => {
    console.log(`Loaded ${loadedImages.size} of ${bookCovers.length} images`);
    if (bookCovers.length > 0 && loadedImages.size === bookCovers.length) {
      setLoading(false);
    }
  }, [loadedImages.size, bookCovers.length]);

  const handleImageLoad = (index: number) => {
    console.log(`Image ${index} loaded`);
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
  };

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.content, { minHeight: height * 0.7 }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{section}</Text>

          <ScrollView
            contentContainerStyle={styles.booksGrid}
            showsVerticalScrollIndicator={true}
            indicatorStyle="black"
            style={styles.scrollView}
          >
            {bookCovers.map((coverUrl, index) => {
              const isbn = coverUrl.split("/isbn/")[1].split("-")[0];
              const book = bookData[isbn] || {
                title: `Book ${index + 1}`,
                author: "Unknown Author",
              };

              return (
                <View key={index} style={styles.bookContainer}>
                  <Image
                    source={{ uri: coverUrl }}
                    style={styles.bookCover}
                    onLoad={() => handleImageLoad(index)}
                    defaultSource={require('../../assets/images/default-book.jpg')}
                  />
                  <View style={styles.bookInfo}>
                    <Text style={styles.bookTitle}>{book.title}</Text>
                    <Text style={styles.bookAuthor}>{book.author}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {loading && (
            <View style={styles.loaderOverlay}>
              <ActivityIndicator
                size="large"
                color={theme.colors.goldishBrown}
              />
              <Text style={styles.loadingText}>
                Loading books... ({loadedImages.size}/{bookCovers.length})
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  content: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 8,
    width: "90%",
    maxHeight: "90%",
    padding: 16,
    paddingRight: 8,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: theme.colors.primary,
  },
  title: {
    fontFamily: "Monserrat",
    fontSize: 24,
    color: theme.colors.goldishDarkBrown,
    textTransform: "uppercase",
    textAlign: "center",
    marginVertical: 16,
    letterSpacing: 2,
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: theme.colors.goldishBrown,
    fontSize: 16,
  },
  booksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "flex-start",
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  bookContainer: {
    width: width * 0.4,
    marginBottom: 24,
    alignItems: 'center',
  },
  bookCover: {
    width: width * 0.35,
    height: height * 0.25,
    resizeMode: 'cover',
    borderRadius: 4,
  },
  bookInfo: {
    alignItems: "center",
    marginTop: 8,
    maxWidth: width * 0.35,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.goldishBrown,
    textAlign: "center",
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 12,
    color: theme.colors.darkWine,
    fontStyle: "italic",
    textAlign: "center",
  },
  scrollView: {
    marginRight: -8,
    paddingRight: 8,
  },
});
