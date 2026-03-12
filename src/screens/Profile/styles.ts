import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #FFFFFF;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px 20px 20px;
  border-bottom-width: 1px;
  border-bottom-color: #F3F4F6;
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

export const Content = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
`;

export const ProfileSection = styled.View`
  align-items: center;
  padding: 32px 24px;
`;

export const AvatarContainer = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: #F3F4F6;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

export const UserName = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
`;

export const UserEmail = styled.Text`
  font-size: 14px;
  color: #6B7280;
`;

export const MenuSection = styled.View`
  padding: 0 24px;
`;

export const MenuItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom-width: 1px;
  border-bottom-color: #F3F4F6;
`;

export const MenuItemLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const MenuItemText = styled.Text`
  font-size: 16px;
  color: #111827;
  margin-left: 12px;
`;

export const LogoutButton = styled.TouchableOpacity`
  background-color: #EF4444;
  border-radius: 100px;
  padding: 16px;
  margin: 24px;
  align-items: center;
`;

export const LogoutButtonText = styled.Text`
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 700;
`;
