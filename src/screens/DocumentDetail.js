import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HISTORY = [
  { id: '1', requester: 'Breja.me', date: '05 Mar 2026', type: 'Verificação de maioridade' },
  { id: '2', requester: 'iFood Bebidas', date: '28 Fev 2026', type: 'Verificação de maioridade' },
  { id: '3', requester: 'Zé Delivery', date: '14 Fev 2026', type: 'Verificação de maioridade' },
];

export default function DocumentDetail({ onBack }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Credential Card */}
        <View style={styles.credentialCard}>
          <View style={styles.checkContainer}>
            <Ionicons name="checkmark-circle" size={64} color="#10B981" />
          </View>
          <Text style={styles.credentialTitle}>Maior de 18 anos</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Credencial Ativa</Text>
          </View>
        </View>

        {/* Metadados */}
        <Text style={styles.sectionTitle}>Informações da Credencial</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Emissor</Text>
            <Text style={styles.infoValue}>Ministério da Gestão e Inovação</Text>
          </View>
          <View style={[styles.infoRow, styles.infoRowBorder]}>
            <Text style={styles.infoLabel}>Data de Emissão</Text>
            <Text style={styles.infoValue}>12 Nov 2024</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Validade</Text>
            <Text style={styles.infoValue}>12 Nov 2026</Text>
          </View>
        </View>

        {/* QR Code placeholder */}
        <Text style={styles.sectionTitle}>Apresentação</Text>
        <View style={styles.qrCard}>
          <View style={styles.qrPlaceholder}>
            <Ionicons name="qr-code" size={120} color="#1E3A8A" />
          </View>
          <Text style={styles.qrHint}>Apresente este código para verificação presencial</Text>
        </View>

        {/* Histórico */}
        <Text style={styles.sectionTitle}>Histórico de Compartilhamentos</Text>
        <View style={styles.historyCard}>
          {HISTORY.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.historyRow,
                index !== HISTORY.length - 1 && styles.historyRowBorder,
              ]}
            >
              <View style={styles.historyIcon}>
                <Ionicons name="share-outline" size={20} color="#6B7280" />
              </View>
              <View style={styles.historyContent}>
                <Text style={styles.historyRequester}>{item.requester}</Text>
                <Text style={styles.historyType}>{item.type}</Text>
              </View>
              <Text style={styles.historyDate}>{item.date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  spacer: {
    width: 40,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 60,
  },
  credentialCard: {
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 24,
    padding: 32,
    marginBottom: 32,
  },
  checkContainer: {
    marginBottom: 16,
  },
  credentialTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  infoRow: {
    paddingVertical: 16,
  },
  infoRowBorder: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  qrCard: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 32,
    marginBottom: 32,
  },
  qrPlaceholder: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
  },
  qrHint: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  historyCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  historyRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyRequester: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  historyType: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  historyDate: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});
