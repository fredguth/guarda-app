import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Consent from './Consent';
import GuardaLogo from '../../assets/guarda_logo2.svg';

export default function Home({ onNavigateAdd, onNavigateDocument, onNavigateSplash }) {
  const [showConsent, setShowConsent] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <TouchableOpacity onPress={onNavigateSplash}>
            <GuardaLogo width={42} height={42} style={styles.headerLogo} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Documentos</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={onNavigateAdd} style={styles.iconButton}>
            <Ionicons name="add" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="person-outline" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContainer}
        snapToInterval={300}
        decelerationRate="fast"
      >
        {/* Card Maioridade 18+ */}
        <TouchableOpacity
          style={[styles.card, styles.cardMaioridade]}
          activeOpacity={0.8}
          onPress={onNavigateDocument}
        >
          <Text style={styles.cardTitleWhite}>Maioridade 18+</Text>
          <Text style={styles.cardSubtitleWhite}>Identidade Digital</Text>

          <View style={styles.cardFooter}>
            <Text style={styles.cardValidade}>Validade: 12 Nov 2026</Text>
            <Text style={styles.cardAcesso}>Acessar Documento</Text>
          </View>
        </TouchableOpacity>

        {/* Spacer for ending */}
        <View style={{width: 20}} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.qrButton} onPress={() => setShowConsent(true)}>
          <Ionicons name="qr-code-outline" size={24} color="#FFF" />
          <Text style={styles.qrButtonText}>Ler QR-Code</Text>
        </TouchableOpacity>
      </View>

      <Consent 
        visible={showConsent} 
        onClose={() => setShowConsent(false)}
        onConfirm={() => setShowConsent(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000000',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
    color: '#000',
  },
  carouselContainer: {
    paddingLeft: 24,
    paddingTop: 20,
    alignItems: 'center',
  },
  card: {
    width: 280,
    height: 420,
    borderRadius: 24,
    padding: 24,
    marginRight: 16,
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  cardMaioridade: {
    backgroundColor: '#4C1D95',
  },
  cardTitleWhite: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardSubtitleWhite: {
    fontSize: 16,
    color: '#E5E7EB',
    marginTop: 4,
  },
  cardFooter: {
    marginTop: 'auto',
  },
  cardValidade: {
    color: '#E5E7EB',
    fontSize: 14,
    marginBottom: 8,
  },
  cardAcesso: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  qrButton: {
    backgroundColor: '#000000',
    borderRadius: 100,
    paddingVertical: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  qrButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
});
