# Guarda - Carteira Digital

Aplicativo mobile de carteira digital construído com React Native e Expo.

## Tecnologias

- **React Native** 0.81
- **Expo** SDK 54
- **NativeWind** (TailwindCSS para React Native)
- **React Navigation** (navegação entre telas)
- **Expo Local Authentication** (biometria)

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Para iOS: macOS com [Xcode](https://developer.apple.com/xcode/) instalado (v15+)
- Para Android: [Android Studio](https://developer.android.com/studio) com SDK configurado

## Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd guarda

# Instale as dependências
npm install
```

## Executando o projeto

### Expo Go (desenvolvimento rápido)

```bash
npm start
```

Isso abre o Metro Bundler. A partir daí:

- **iOS**: Escaneie o QR code com a câmera do iPhone ou abra no app Expo Go
- **Android**: Escaneie o QR code com o app Expo Go

### iOS (build nativo)

```bash
# Roda no simulador iOS (requer macOS + Xcode)
npm run ios
```

> Na primeira execução, o Expo vai gerar o projeto nativo na pasta `ios/` e compilar. Isso pode levar alguns minutos.

### Android (build nativo)

```bash
# Roda no emulador Android (requer Android Studio)
npm run android
```

> Certifique-se de que um emulador Android está rodando ou um dispositivo físico está conectado via USB com depuração USB ativada.

## Estrutura do projeto

```
guarda/
├── App.js                  # Componente raiz com navegação
├── index.js                # Entry point do app
├── app.json                # Configuração do Expo
├── tailwind.config.js      # Configuração do TailwindCSS/NativeWind
├── src/
│   └── screens/
│       ├── Splash.js       # Tela de splash/carregamento
│       ├── Home.js         # Tela principal
│       ├── AddDocument.js  # Tela de adicionar documento
│       └── Consent.js      # Tela de consentimento
├── assets/                 # Ícones e imagens
├── ios/                    # Projeto nativo iOS
└── android/                # Projeto nativo Android
```

## Scripts disponíveis

| Comando         | Descrição                          |
| --------------- | ---------------------------------- |
| `npm start`     | Inicia o Metro Bundler (Expo Go)   |
| `npm run ios`   | Compila e roda no simulador iOS    |
| `npm run android` | Compila e roda no emulador Android |
| `npm run web`   | Inicia versão web (experimental)   |
