import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px 20px 20px;
  border-bottom-width: 1px;
  border-bottom-color: #f3f4f6;
`;

export const BackButton = styled.TouchableOpacity`
  padding: 8px;
`;

export const HeaderTitle = styled.Text`
  flex: 1;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: #000000;
`;

export const Spacer = styled.View`
  width: 40px;
`;

export const ScrollContent = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: { padding: 24, paddingBottom: 60 },
})``;

export const AgeCard = styled.View<{ isMinor: boolean }>`
  align-items: center;
  background-color: ${({ isMinor }) => (isMinor ? '#fef3c7' : '#f0fdf4')};
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 32px;
`;

export const AgeIconContainer = styled.View`
  margin-bottom: 16px;
`;

export const AgeTitle = styled.Text`
  font-size: 26px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 12px;
`;

export const StatusBadge = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #ecfdf5;
  padding: 6px 14px;
  border-radius: 100px;
`;

export const StatusDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #10b981;
  margin-right: 8px;
`;

export const StatusText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #065f46;
`;

export const WarningBadge = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #fef3c7;
  padding: 6px 14px;
  border-radius: 100px;
`;

export const WarningText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #92400e;
  margin-left: 8px;
`;

export const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
`;

export const InfoCard = styled.View`
  background-color: #f9fafb;
  border-radius: 20px;
  padding: 0 20px;
  margin-bottom: 32px;
`;

export const InfoRow = styled.View<{ bordered?: boolean }>`
  padding: 16px 0;
  ${({ bordered }) => bordered && `
    border-top-width: 1px;
    border-bottom-width: 1px;
    border-color: #e5e7eb;
  `}
`;

export const InfoLabel = styled.Text`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 4px;
`;

export const InfoValue = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;
