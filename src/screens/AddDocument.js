import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DOCUMENTS = [
  { id: '1', title: 'Maioridade 18+', color: '#3B82F6', icon: 'shield-checkmark', subtitle: 'Identidade Digital' },
  { id: '2', title: 'Carteira de Identidade (RG)', color: '#F3F4F6', icon: 'card-outline', subtitle: 'Registro Geral' },
  { id: '3', title: 'Carteira de Motorista (CNH)', color: '#F3F4F6', icon: 'car-outline', subtitle: 'Habilitação' },
  { id: '4', title: 'Cartão de Saúde (SUS)', color: '#F3F4F6', icon: 'medkit-outline', subtitle: 'Saúde Pública' },
  { id: '5', title: 'Passaporte', color: '#F3F4F6', icon: 'airplane-outline', subtitle: 'Viagem' },
  { id: '6', title: 'CPF', color: '#F3F4F6', icon: 'document-text-outline', subtitle: 'Cadastro de Pessoa Física' },
];

export default function AddDocument({ onBack }) {
  const renderItem = ({ item, index }) => {
    const isFirst = index === 0;
    
    // Ghost placeholder styling for non-first items
    const cardStyle = isFirst ? [styles.card, { backgroundColor: item.color }] : [styles.card, styles.cardGhost];
    const titleStyle = isFirst ? [styles.cardTitle, styles.textWhite] : [styles.cardTitle, styles.textGhost];
    const subtitleStyle = isFirst ? [styles.cardSubtitle, styles.textWhiteAlpha] : [styles.cardSubtitle, styles.textGhostAlpha];
    const actionStyle = isFirst ? [styles.cardAction, styles.textWhite] : [styles.cardAction, styles.textGhostAction];
    const iconColor = isFirst ? '#FFF' : '#A1A1AA'; // Zinc 400 for ghosts
    const actionText = isFirst ? 'Adicionar' : 'Em breve';

    return (
      <TouchableOpacity 
         style={cardStyle}
         disabled={!isFirst} // Disable touch for ghost items
         activeOpacity={isFirst ? 0.7 : 1}
      >
        <View style={styles.cardLeft}>
          <View style={styles.cardIconContainer}>
            <Ionicons name={item.icon} size={28} color={iconColor} />
          </View>
          <View>
            <Text style={titleStyle}>{item.title}</Text>
            <Text style={subtitleStyle}>{item.subtitle}</Text>
          </View>
        </View>
        <Text style={actionStyle}>{actionText}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adicionar Documento</Text>
        <View style={styles.spacer} />
      </View>

      <FlatList
        data={DOCUMENTS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
  backIcon: {
    fontSize: 24,
    color: '#000000',
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
  listContainer: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIconContainer: {
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  cardAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textWhiteAlpha: {
    color: 'rgba(255,255,255,0.7)',
  },
  // Ghost Styles
  cardGhost: {
    backgroundColor: '#FAFAFA', // Very light gray background
    borderWidth: 1,
    borderColor: '#F4F4F5', // Zinc 100 border
    borderStyle: 'dashed',
  },
  textGhost: {
    color: '#A1A1AA', // Zinc 400
  },
  textGhostAlpha: {
    color: '#D4D4D8', // Zinc 300
  },
  textGhostAction: {
    color: '#E4E4E7', // Zinc 200
  }
});
