import { View, Text, StyleSheet, Image } from 'react-native'
interface Props {
  src: string
  title: string
}
export default function ImageCard({ src, title }: Props) {
  return (
    <View style={styles.ImageContainer}>
      <Text style={styles.ImageTitle}>{title}</Text>
      <View style={styles.ImageCard}>
        <Image
          source={{ uri: src }}
          style={styles.Image}
          resizeMode="contain"
        />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  ImageContainer: {
    marginTop: 16,
    paddingHorizontal: 4
  },
  ImageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  ImageCard: {
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e6e6e6',
    overflow: 'hidden'
  },
  Image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f8f8f8'
  }
})
