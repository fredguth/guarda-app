import React, { useState, useRef, useEffect } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { CARD_HEIGHT } from './styles';
import CredentialCard from './CredentialCard';

const TAB_HEIGHT = 52;
const ANIMATION_DURATION = 380;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface StackedCardsProps {
  credentials: any[];
  onNavigateDocument: (cred: any) => void;
}

export default function StackedCards({ credentials, onNavigateDocument }: StackedCardsProps) {
  const count = credentials.length;
  const animatedPositions = useRef<Record<string, Animated.Value>>({}).current;
  const [stackOrder, setStackOrder] = useState(() => credentials.map((_, i) => i));
  const [topIndex, setTopIndex] = useState(count - 1);
  const isAnimating = useRef(false);

  credentials.forEach((cred, i) => {
    if (!animatedPositions[cred.id]) {
      animatedPositions[cred.id] = new Animated.Value(i);
    }
  });

  useEffect(() => {
    const resetOrder = credentials.map((_, i) => i);
    setStackOrder(resetOrder);
    setTopIndex(credentials.length - 1);
    credentials.forEach((cred, i) => animatedPositions[cred.id]?.setValue(i));
  }, [credentials.length]);

  const bringToFront = (targetIdx: number) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const newOrder = [...stackOrder.filter((i) => i !== targetIdx), targetIdx];
    setStackOrder(newOrder);
    setTopIndex(targetIdx);

    const animations = credentials.map((cred, i) =>
      Animated.timing(animatedPositions[cred.id], {
        toValue: newOrder.indexOf(i),
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      })
    );

    Animated.parallel(animations).start(() => {
      isAnimating.current = false;
    });
  };

  const containerHeight = CARD_HEIGHT + (count - 1) * TAB_HEIGHT;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: SCREEN_WIDTH * 0.82, height: containerHeight }}>
        {credentials.map((cred, credIdx) => {
          const anim = animatedPositions[cred.id];
          if (!cred || !anim) return null;

          const isTop = topIndex === credIdx;
          const handlePress = () => isTop ? onNavigateDocument(cred) : bringToFront(credIdx);

          return (
            <CredentialCard
              key={cred.id}
              cred={cred}
              credIdx={credIdx}
              totalCards={count}
              stackOrder={stackOrder}
              isTop={isTop}
              animatedPosition={anim}
              onPress={handlePress}
            />
          );
        })}
      </View>
    </View>
  );
}
