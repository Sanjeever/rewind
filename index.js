import React, {useEffect, useState} from 'react';
import {ActivityIndicator, AppRegistry, Text, View} from 'react-native';
import {initializeStorage} from './src/storage';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

function Bootstrap() {
  const [App, setApp] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    initializeStorage().then(() => {
      setApp(() => require('./src/App').default);
    }).catch(reason => {
      console.error(reason);
      setError(reason);
    });
  }, []);
  if (App) return <SafeAreaView edges={['bottom']} style={{flex: 1, backgroundColor: '#000'}}><App /></SafeAreaView>;
  return (
    <View style={{flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 24}}>
      {error ? <Text selectable style={{color: '#fff'}}>{'启动失败：' + error.message}</Text> : <ActivityIndicator color="#fff" />}
    </View>
  );
}

AppRegistry.registerComponent('rewind', () => function Root() {
  return <SafeAreaProvider><Bootstrap /></SafeAreaProvider>;
});
