import { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Linking
} from 'react-native'
import { RecommendResponse, Result } from '../types/recommend'
import mockData from '../mock/recommend.json'
import React from 'react'

interface RecommendViewProps {
  data?: RecommendResponse | null
}

export default function RecommendView({ data }: RecommendViewProps) {
  const [displayData, setDisplayData] = useState<RecommendResponse | null>(data)

  useEffect(() => {
    if (data) {
      setDisplayData(data)
    } else {
      setDisplayData(mockData as RecommendResponse)
    }
  }, [data])

  const handleLinkPress = async (link: string | null | undefined) => {
    if (link) {
      try {
        const canOpen = await Linking.canOpenURL(link)
        if (canOpen) {
          await Linking.openURL(link)
        }
      } catch (error) {
        console.error('링크 열기 실패:', error)
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>추천 결과</Text>
      <ScrollView contentContainerStyle={styles.gridContainer}>
        {displayData?.results?.map((item: Result, index: number) => (
          <View
            key={index}
            style={styles.card}>
            {item.image && (
              <Image
                source={{ uri: item.image }}
                style={styles.cardImage}
                resizeMode="contain"
              />
            )}
            <View style={styles.cardContent}>
              {item.link && (
                <Pressable onPress={() => handleLinkPress(item.link)}>
                  <Text style={styles.linkText}>주소: 링크 열기</Text>
                </Pressable>
              )}
              {item.price && (
                <Text style={styles.priceText}>가격: {item.price}</Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  card: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: 'hidden',
    marginBottom: 12
  },
  cardImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f8f8f8'
  },
  cardContent: {
    padding: 12
  },
  linkText: {
    fontSize: 12,
    color: '#0066cc',
    marginBottom: 6,
    textDecorationLine: 'underline'
  },
  priceText: {
    fontSize: 12,
    color: '#333'
  }
})
