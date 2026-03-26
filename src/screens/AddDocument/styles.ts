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

export const ListContainer = styled.View`
  padding: 20px;
`;

export const Card = styled.TouchableOpacity<{ available: boolean; cardColor: string }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 16px;
  background-color: ${({ cardColor }) => cardColor};
`;

export const CardLeft = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const CardIconContainer = styled.View`
  margin-right: 16px;
`;

export const CardTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
`;

export const CardAction = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`;
