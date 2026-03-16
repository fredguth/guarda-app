import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px 8px;
`;

export const CloseButton = styled.TouchableOpacity`
  padding: 4px;
`;

export const SecurityBadge = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #ecfdf5;
  padding: 6px 12px;
  border-radius: 100px;
`;

export const SecurityText = styled.Text`
  color: #065f46;
  font-size: 12px;
  font-weight: 600;
  margin-left: 6px;
`;

export const ScrollContent = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: true,
  contentContainerStyle: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
})``;

export const Title = styled.Text`
  font-size: 32px;
  font-weight: 800;
  color: #000000;
  margin-bottom: 32px;
  line-height: 38px;
`;

export const RequesterCard = styled.View`
  align-items: center;
  background-color: #f9fafb;
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 32px;
`;

export const RequesterIcon = styled.View`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  background-color: #fef3c7;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

export const RequesterLabel = styled.Text`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
`;

export const RequesterName = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
`;

export const RequesterReason = styled.Text`
  font-size: 15px;
  color: #4b5563;
  text-align: center;
  line-height: 22px;
`;

export const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
`;

export const DataContainer = styled.View`
  background-color: #f9fafb;
  border-radius: 20px;
  padding: 0 20px;
  margin-bottom: 24px;
`;

export const DataRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0;
`;

export const DataRowLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const DataLabel = styled.Text`
  font-size: 16px;
  color: #111827;
  margin-left: 16px;
  font-weight: 500;
`;

export const RetentionCard = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #eff6ff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 20px;
`;

export const RetentionTexts = styled.View`
  margin-left: 12px;
`;

export const RetentionLabel = styled.Text`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 2px;
`;

export const RetentionValue = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: #1e3a8a;
`;

export const Footer = styled.View`
  padding: 16px 24px 24px;
  border-top-width: 1px;
  border-top-color: #f3f4f6;
  background-color: #ffffff;
`;

export const Disclaimer = styled.Text`
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  margin-bottom: 20px;
  line-height: 18px;
`;

export const PrimaryButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ disabled }) => (disabled ? '#4b5563' : '#000000')};
  border-radius: 100px;
  padding: 18px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin-bottom: 12px;
`;

export const PrimaryButtonText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
`;

export const ButtonIcon = styled.View`
  margin-right: 8px;
`;

export const SecondaryButton = styled.TouchableOpacity`
  padding: 16px;
  align-items: center;
`;

export const SecondaryButtonText = styled.Text`
  color: #4b5563;
  font-size: 16px;
  font-weight: 600;
`;
