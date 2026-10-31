import {useEffect, useState} from 'react';
import type {ComponentType} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {initializeStorage} from '../storage';

export default function Root() {
  const [App, setApp] = useState<ComponentType | null>(null);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let active = true;
    initializeStorage()
      .then(async () => {
        const {default: Application} = await import('../App');
        if (active) setApp(() => Application);
      })
      .catch((reason) => {
        console.error(reason);
        if (active) setError(reason instanceof Error ? reason : new Error(String(reason)));
      });
    return () => {
      active = false;
    };
  }, []);
  return (
    <SafeAreaProvider>
      {App ? (
        <SafeAreaView edges={['bottom']} style={{flex: 1, backgroundColor: '#000'}}>
          <App />
        </SafeAreaView>
      ) : (
        <View style={{flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 24}}>
          {error ? (
            <Text selectable style={{color: '#fff'}}>
              {'启动失败：' + error.message}
            </Text>
          ) : (
            <ActivityIndicator color="#fff" />
          )}
        </View>
      )}
    </SafeAreaProvider>
  );
}
