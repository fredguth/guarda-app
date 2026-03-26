import React from 'react';
import { Animated, View } from 'react-native';
import {
  Card,
  CardHeader,
  CardBadge,
  CardBadgeText,
  CardTitle,
  CardSubtitle,
  CardFooter,
  CardAcesso,
  CARD_HEIGHT,
} from './styles';

const CARD_COLORS = ['#4C1D95', '#1E3A5F', '#065F46', '#7C2D12', '#1E1B4B'];
const TAB_HEIGHT = 52;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

function getExpiryLabel(cred: any): string {
  const rawDate = cred.vc?.credentialSubject?.dataValidade || cred.vc?.expirationDate;
  if (!rawDate) return 'Ativo';

  const expiry = new Date(rawDate);
  if (isNaN(expiry.getTime())) return 'Ativo';

  const diffDays = Math.ceil((expiry.getTime() - Date.now()) / MS_PER_DAY);

  if (diffDays < 0) return 'Expirado';
  if (diffDays === 0) return 'Expira hoje';
  if (diffDays <= 30) return `Expira em ${diffDays}d`;

  const diffMonths = Math.ceil(diffDays / 30);
  if (diffMonths < 12) return `Expira em ${diffMonths}m`;

  return `Expira em ${Math.floor(diffMonths / 12)}a`;
}

// Ao adicionar novas credenciais altere aqui
function getCredentialInfo(cred: any) {
  const types: string[] = cred.vc?.type || [];
  const subject = cred.vc?.credentialSubject;

  if (types.includes('ECACredential') || types.includes('AgeVerificationCredential')) {
    const isOver18 = subject?.isOver18 ?? subject?.maiorDeIdade ?? subject?.maior18;
    const subtitle =
      isOver18 === true  ? 'Maior de 18 anos' :
      isOver18 === false ? 'Menor de 18 anos' :
                           'Faixa etária';
    return { title: 'Credencial de Faixa Etária', subtitle, isWarn: isOver18 === false };
  }

  return { title: 'Credencial', subtitle: cred.vc?.issuer || '', isWarn: false };
}

export interface CredentialCardProps {
  cred: any;
  credIdx: number;
  totalCards: number;
  stackOrder: number[];
  isTop: boolean;
  animatedPosition: Animated.Value;
  onPress: () => void;
}

export default function CredentialCard({
  cred,
  credIdx,
  totalCards,
  stackOrder,
  isTop,
  animatedPosition,
  onPress,
}: CredentialCardProps) {
  const { title, subtitle } = getCredentialInfo(cred);
  const color = CARD_COLORS[credIdx % CARD_COLORS.length];

  const translateY = animatedPosition.interpolate({
    inputRange: [0, totalCards - 1],
    outputRange: [0, (totalCards - 1) * TAB_HEIGHT],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: '100%',
        top: 0,
        zIndex: stackOrder.indexOf(credIdx),
        transform: [{ translateY }],
      }}
    >
      <Card
        backgroundColor={color}
        activeOpacity={isTop ? 0.9 : 0.75}
        style={{ height: CARD_HEIGHT }}
        onPress={onPress}
      >
        <CardHeader>
          <View style={{ flex: 1, marginRight: 8 }}>
            <CardTitle numberOfLines={2}>{title}</CardTitle>
            {isTop && <CardSubtitle>{subtitle}</CardSubtitle>}
          </View>
          <CardBadge>
            <CardBadgeText>{getExpiryLabel(cred)}</CardBadgeText>
          </CardBadge>
        </CardHeader>
        {isTop && (
          <CardFooter>
            <CardAcesso>Ver documento →</CardAcesso>
          </CardFooter>
        )}
      </Card>
    </Animated.View>
  );
}
