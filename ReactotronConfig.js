import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const registerCommands = () => {
  Reactotron.onCustomCommand({
    title: 'Ver AsyncStorage',
    description: 'Lista todas as chaves e valores do AsyncStorage',
    command: 'showAsyncStorage',
    handler: async () => {
      Reactotron.log('handler chamado');
      try {
        const keys = await AsyncStorage.getAllKeys();
        const pairs = await AsyncStorage.multiGet(keys);
        const value = Object.fromEntries(
          pairs.map(([k, v]) => {
            try { return [k, JSON.parse(v)]; } catch { return [k, v]; }
          })
        );
        Reactotron.display({ name: 'ASYNC STORAGE', value, important: true });
      } catch (e) {
        Reactotron.log('Erro ao ler AsyncStorage: ' + e.message);
      }
    },
  });
};

if (__DEV__) {
  Reactotron
    .configure({ host: '10.0.2.2', onConnect: registerCommands })
    .useReactNative({ asyncStorage: { storageHandler: AsyncStorage } })
    .connect();

  console.tron = Reactotron;
}
