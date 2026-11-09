import { useState } from 'react';
import { ActivityIndicator, Image, StyleProp, Text, View, ViewStyle } from 'react-native';
import { Home } from 'lucide-react-native';
import { C } from '../theme';

export default function SmartImage({ src, style }: { src: string; style?: StyleProp<ViewStyle> }) {
  const [state, setState] = useState<'loading' | 'ok' | 'error'>(src ? 'loading' : 'error');
  return (
    <View style={[{ backgroundColor: C.soft, overflow: 'hidden' }, style]}>
      {state === 'error' ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.sky, gap: 6 }}>
          <Home size={36} color="#11234080" />
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#11234080', letterSpacing: 1 }}>FOTOS EM BREVE</Text>
        </View>
      ) : (
        <Image source={{ uri: src }} style={{ width: '100%', height: '100%' }} resizeMode="cover"
          onLoad={() => setState('ok')} onError={() => setState('error')} />
      )}
      {state === 'loading' && <ActivityIndicator style={{ position: 'absolute', top: '45%', alignSelf: 'center' }} color={C.mute} />}
    </View>
  );
}
