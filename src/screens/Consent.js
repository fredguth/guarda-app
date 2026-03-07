import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Modal, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';

export default function Consent({ visible, onClose, onConfirm }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Mock Data Request
  const requestDetails = {
    requesterName: 'Breja.me',
    reason: 'Para verificar sua maioridade na entrega de bebidas alcoólicas.',
    requestedData: [
      { id: '1', label: 'Maior de 18 anos', icon: 'checkmark-done-circle-outline' },
    ],
    retentionPolicy: 'Uso Único (Sem armazenamento)',
  };

  const handleConfirm = async () => {
    try {
      setIsAuthenticating(true);
      
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        // Fallback or warning if device doesn't have biometrics set up
        Alert.alert(
          'Atenção',
          'Biometria não configurada neste dispositivo. Deseja prosseguir sem biometria?',
          [
            { text: 'Cancelar', style: 'cancel', onPress: () => setIsAuthenticating(false) },
            { text: 'Prosseguir', onPress: () => {
                setIsAuthenticating(false);
                onConfirm(); 
            }}
          ]
        );
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique-se para autorizar o compartilhamento',
        fallbackLabel: 'Usar senha',
        cancelLabel: 'Cancelar',
        disableDeviceFallback: false,
      });

      setIsAuthenticating(false);

      if (result.success) {
        onConfirm(); // Call the original onConfirm if auth succeeds
      } else {
        // Auth failed or was cancelled by user - do not confirm
      }
    } catch (error) {
      console.error(error);
      setIsAuthenticating(false);
      Alert.alert('Erro', 'Ocorreu um erro na autenticação biométrica.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#000" />
          </TouchableOpacity>
          <View style={styles.securityBadge}>
            <Ionicons name="shield-checkmark" size={16} color="#065F46" />
            <Text style={styles.securityText}>Conexão Segura</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
          {/* Title */}
          <Text style={styles.title}>Deseja compartilhar seus dados?</Text>
          
          {/* Requester Info */}
          <View style={styles.requesterCard}>
            <View style={styles.requesterIconPlaceholder}>
              <Ionicons name="beer" size={32} color="#F59E0B" />
            </View>
            <Text style={styles.requesterLabel}>Solicitado por</Text>
            <Text style={styles.requesterName}>{requestDetails.requesterName}</Text>
            <Text style={styles.requesterReason}>{requestDetails.reason}</Text>
          </View>

          {/* Data List */}
          <Text style={styles.sectionTitle}>Dados solicitados (obrigatórios):</Text>
          <View style={styles.dataContainer}>
            {requestDetails.requestedData.map((item, index) => (
              <View 
                key={item.id} 
                style={[
                  styles.dataRow, 
                  index !== requestDetails.requestedData.length - 1 && styles.dataRowBorder
                ]}
              >
                <View style={styles.dataLeft}>
                  <Ionicons name={item.icon} size={24} color="#6B7280" />
                  <Text style={styles.dataLabel}>{item.label}</Text>
                </View>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              </View>
            ))}
          </View>

          {/* Retention Policy Extension */}
          <View style={styles.retentionCard}>
            <Ionicons name="shield-half-outline" size={20} color="#6B7280" />
            <View style={styles.retentionTexts}>
              <Text style={styles.retentionLabel}>Política de Retenção</Text>
              <Text style={styles.retentionValue}>{requestDetails.retentionPolicy}</Text>
            </View>
          </View>

        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footer}>
           {/* Disclaimer */}
           <Text style={styles.disclaimer}>
            Ao autorizar o compartilhamento, você concorda que o solicitante terá acesso apenas aos dados listados acima. Você não poderá revogar essa ação para solicitações de uso único após a confirmação.
          </Text>

          <TouchableOpacity 
            style={[styles.primaryButton, isAuthenticating && styles.primaryButtonDisabled]} 
            onPress={handleConfirm}
            disabled={isAuthenticating}
          >
            {isAuthenticating ? (
               <ActivityIndicator color="#FFFFFF" />
            ) : (
               <>
                 <Ionicons name="finger-print" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                 <Text style={styles.primaryButtonText}>Autorizar Compartilhamento</Text>
               </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
            <Text style={styles.secondaryButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  closeButton: {
    padding: 4,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5', // Light emerald green
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  securityText: {
    color: '#065F46', // Dark emerald
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 32,
    lineHeight: 38,
  },
  requesterCard: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
  },
  requesterIconPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF3C7', // Light yellow/amber
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  requesterLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  requesterName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  requesterReason: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  dataContainer: {
    backgroundColor: '#F9FAFB', // Light gray background
    borderRadius: 20,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
  },
  dataRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dataLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 16,
    fontWeight: '500',
  },
  retentionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF', // Light blue
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  retentionTexts: {
    marginLeft: 12,
  },
  retentionLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  retentionValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E3A8A', // Dark blue
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  disclaimer: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  primaryButton: {
    backgroundColor: '#000000',
    borderRadius: 100,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 12,
  },
  primaryButtonDisabled: {
    backgroundColor: '#4B5563', // Gray when authenticating
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '600',
  },
});
