# Plano de Integração: Inji Wallet no Guarda

## 1. Análise do inji-wallet-ref-react (Referência Funcional)

### 1.1 Stack Tecnológica
- **Expo 54** / React Native 0.81.5 / React 19
- **expo-router** (file-based routing em `app/`)
- **styled-components** para estilização
- **AsyncStorage** para persistência
- **VCSDK (vc-sdk-headless)** — SDK local para credenciais verificáveis
- **Criptografia:** @noble/ed25519, @noble/secp256k1, node-forge, expo-crypto, react-native-keychain

### 1.2 Funcionalidades Implementadas

#### A. Autenticação OAuth 2.0 com gov.br (PKCE)
- Fluxo completo de Authorization Code com PKCE
- WebView customizada para login gov.br (incognito mode)
- Troca de código por tokens (access_token, id_token)
- Obtenção de informações do usuário (nome, email, foto, CPF)
- Armazenamento de tokens com controle de expiração (⚠️ no ref usa AsyncStorage em texto plano — no Guarda corrigir para Keychain)
- ⚠️ **Falhas de segurança no ref a NÃO reproduzir:**
  - Tokens e PII salvos em AsyncStorage (texto plano)
  - `client_secret` exposto no bundle JS via `EXPO_PUBLIC_`
  - Sem certificate pinning
  - `mixedContentMode="compatibility"` na WebView
- Logout com limpeza de dados
- **Arquivos-chave:**
  - `components/CustomAuthWebView/CustomAuthWebView.tsx` — WebView OAuth
  - `components/CustomAuthWebView/authStorage.ts` — persistência de estado auth
  - `app/login.tsx` — tela de login

#### B. Gerenciamento de Credenciais (Verifiable Credentials)
- Download de credenciais de emissores via VCSDK
- Armazenamento local criptografado
- Filtragem por emissor (MGI) e tipo de credencial
- Rastreamento de status de download
- **Arquivos-chave:**
  - `hooks/useWallet.ts` — gerenciamento de credenciais
  - `hooks/useIssuers.ts` — busca de emissores disponíveis
  - `components/Carteira/Carteira.tsx` — tela principal da carteira
  - `components/DocumentModal/DocumentModal.tsx` — seleção de documento/emissor

#### C. Compartilhamento de Credenciais (OpenID4VP)
- Suporte ao protocolo OpenID4VP
- Deep-link handling (`openid4vp://` scheme)
- Parsing de Presentation Definition
- Tela de consentimento antes do compartilhamento
- Submissão de VP Token via POST direto
- Opção de recusar compartilhamento
- **Arquivos-chave:**
  - `app/authorize.tsx` — handler de deep-link OpenID4VP
  - `app/consentimento.tsx` — tela de consentimento
  - `components/Consentimento/Consentimento.tsx` — componente de consentimento
  - `components/Consentimento/shareService.ts` — lógica de compartilhamento VP

#### D. Verificação de Maioridade (Age Proof)
- Tipo especial de credencial para verificação de idade
- Categorias: +18, 16-18, 14-16, 12-14, -12
- Feedback visual com indicadores
- Tela dedicada para exibição da credencial de maioridade
- **Arquivos-chave:**
  - `app/credencial-maioridade.tsx` — tela da credencial
  - `components/CredencialMaioridade/CredencialMaioridade.tsx` — componente
  - `components/AgeFeedbackCard/AgeFeedbackCard.tsx` — feedback visual

#### E. UI da Carteira
- Dashboard com lista de credenciais
- Cards empilhados para credenciais
- Botão de adicionar documentos
- Modal de seleção de emissor/tipo
- Estados vazios
- Header com perfil do usuário e modal de informações
- **Arquivos-chave:**
  - `components/Carteira/Carteira.tsx`
  - `components/CredentialCard/CredentialCard.tsx`
  - `components/PrimaryHeader/PrimaryHeader.tsx`
  - `components/DocumentModal/DocumentModal.tsx`

### 1.3 APIs e Serviços Externos

| Serviço | URL Base | Uso |
|---------|----------|-----|
| gov.br OAuth | Variáveis de ambiente | Autenticação do cidadão |
| Inji Web (VCSDK) | `injiweb.credenciaisverificaveis-hml.dataprev.gov.br` | Download de credenciais |
| Inji Verify | `injiverify.credenciaisverificaveis-hml.dataprev.gov.br` | Submissão de VP |

### 1.4 Fluxos de Dados

```
AUTENTICAÇÃO:
Login → gov.br OAuth WebView → Auth Code → Token Exchange (PKCE) →
User Info → Tokens em Keychain, PII derivada do id_token em memória → Redirect para Carteira

DOWNLOAD DE CREDENCIAL:
Carteira → Botão Adicionar → DocumentModal → Seleciona Emissor/Tipo →
Tela Verificação → Download via VCSDK → Exibição da Credencial

COMPARTILHAMENTO (OpenID4VP):
Deep Link → Authorize Screen → Parse Request → Login (se necessário) →
Tela Consentimento → Aprovação → VCSDK Share → VP Token POST → Redirect
```

---

## 2. Análise do Guarda (Estado Atual)

### 2.1 Stack Tecnológica
- **Expo 54** / React Native 0.81.5 / React 19 (mesma base!)
- **Navegação manual** via estado no App.js (sem expo-router)
- **NativeWind/TailwindCSS** para estilização
- **expo-local-authentication** para biometria
- **Sem VCSDK, sem OAuth, sem credenciais reais**

### 2.2 Telas Existentes (5)
1. **Splash** — Tela inicial com logo e versão
2. **Home** — Dashboard com carrossel de credenciais (mock)
3. **AddDocument** — Lista de tipos de documentos (5 de 6 "em breve")
4. **DocumentDetail** — Detalhes da credencial (mock) com histórico de compartilhamentos
5. **Consent** — Modal de consentimento com biometria

### 2.3 O que já existe no Guarda
- Design visual completo e polido
- Autenticação biométrica (expo-local-authentication)
- UI responsiva com safe areas
- Configuração de API endpoints no .env (SSO client ID/secret, Certify URL)
- Suporte a SVG (metro configurado)

### 2.4 O que falta no Guarda
- Autenticação OAuth gov.br
- Integração com VCSDK (vc-sdk-headless)
- Download real de credenciais
- Compartilhamento OpenID4VP
- Deep-link handling
- Persistência de dados reais (AsyncStorage/Keychain)
- Criptografia e gerenciamento de chaves

---

## 3. Plano de Integração

### Fase 0: Preparação da Infraestrutura
1. **Instalar dependências do VCSDK e criptografia:**
   - `vc-sdk-headless` (link local para `../inji-wallet-sdk/vc-sdk-headless`)
   - `@noble/ed25519`, `@noble/secp256k1`, `@noble/hashes`
   - `expo-crypto`, `react-native-keychain`, `node-forge`, `crypto-js`
   - `jose`, `jwt-decode`, `jsonpath-plus`
   - `@digitalcredentials/vc`
   - `react-native-webview`
   - `expo-web-browser`
   - `short-unique-id`, `uuid`
2. **Configurar variáveis de ambiente** (copiar `.env.example` do ref e adaptar)
3. **Migrar navegação para expo-router** (file-based routing em `app/`)
4. **Configurar deep-link scheme** `openid4vp://` no `app.json`

### Fase 1: Autenticação OAuth gov.br
1. **Portar `CustomAuthWebView`** — WebView para login gov.br com PKCE
2. **Portar `authStorage`** — Funções de persistência de tokens
3. **Criar tela de Login** integrando o visual do Guarda com a lógica OAuth do ref
4. **Implementar verificação de autenticação** na tela inicial (redirect automático)
5. **Implementar logout** com limpeza de dados

### Fase 2: Gerenciamento de Credenciais
1. **Portar `useWallet` hook** — Gerenciamento de credenciais via VCSDK
2. **Portar `useIssuers` hook** — Busca de emissores
3. **Adaptar tela Home** — Substituir dados mock por dados reais do VCSDK
4. **Adaptar tela AddDocument** — Conectar com emissores reais via VCSDK
5. **Criar tela de download/verificação** — Adaptar o visual do Guarda para o fluxo de download
6. **Adaptar DocumentDetail** — Exibir dados reais da credencial

### Fase 3: Compartilhamento OpenID4VP
1. **Portar `shareService`** — Lógica de compartilhamento VP
2. **Criar handler de deep-link** (`authorize`) para OpenID4VP
3. **Adaptar tela Consent** — Conectar com dados reais da presentation definition
4. **Implementar submissão de VP Token**
5. **Integrar biometria** (já existe no Guarda) com o fluxo de compartilhamento

### Fase 4: Polimento
1. **Tela de credencial de maioridade** com feedback visual
2. **Tratamento de erros** e estados de loading
3. **Testes de integração** end-to-end
4. **Revisão de segurança** (tokens, chaves, storage)

---

## 4. Mapeamento de Arquivos: Ref → Guarda

| Funcionalidade | inji-wallet-ref-react | Guarda (destino) |
|---|---|---|
| Layout/Navegação | `app/_layout.tsx` | `app/_layout.tsx` (criar) |
| Login | `app/login.tsx` + `components/Login/` | `app/login.tsx` (criar) |
| OAuth WebView | `components/CustomAuthWebView/` | `src/components/CustomAuthWebView/` (portar) |
| Auth Storage | `components/CustomAuthWebView/authStorage.ts` | `src/services/authStorage.ts` (portar) |
| Carteira/Home | `components/Carteira/` | `src/screens/Home.js` (adaptar) |
| Add Document | `components/DocumentModal/` | `src/screens/AddDocument.js` (adaptar) |
| Download Credencial | `app/verificacao-credencial.tsx` | `app/verificacao-credencial.tsx` (criar) |
| Credencial Maioridade | `app/credencial-maioridade.tsx` | `app/credencial-maioridade.tsx` (criar) |
| Consentimento | `components/Consentimento/` | `src/screens/Consent.js` (adaptar) |
| Share Service | `components/Consentimento/shareService.ts` | `src/services/shareService.ts` (portar) |
| Deep-link Handler | `app/authorize.tsx` | `app/authorize.tsx` (criar) |
| Hook: Wallet | `hooks/useWallet.ts` | `src/hooks/useWallet.ts` (portar) |
| Hook: Issuers | `hooks/useIssuers.ts` | `src/hooks/useIssuers.ts` (portar) |
| Credential Card | `components/CredentialCard/` | `src/components/CredentialCard/` (criar) |
| Headers | `components/PrimaryHeader/` | Manter visual existente do Guarda |

---

## 5. Decisões Arquiteturais

1. **Manter o visual do Guarda** — O objetivo é manter o novo design e inserir a lógica funcional.
2. **Migrar para expo-router** — Necessário para deep-links e organização.
3. **Manter NativeWind** — O Guarda usa NativeWind; adaptar componentes portados do ref (que usam styled-components) para NativeWind.
4. **Reusar hooks de lógica** — `useWallet`, `useIssuers`, `authStorage`, `shareService` devem ser portados com mínima alteração.
5. **Manter biometria do Guarda** — A integração de biometria via `expo-local-authentication` já existe e deve ser preservada no fluxo de consentimento.
6. **Corrigir falhas de segurança do ref** — Não reproduzir os erros do inji-wallet-ref-react:
   - **Tokens (access_token, id_token)** → `react-native-keychain` com `accessControl: BIOMETRY_ANY_OR_DEVICE_PASSCODE` e `accessible: WHEN_UNLOCKED_THIS_DEVICE_ONLY`
   - **PII (nome, email, foto)** → Derivar do `id_token` (JWT) em memória a cada sessão. Não persistir PII no disco.
   - **AsyncStorage** → Apenas para dados não sensíveis (preferências, flags de onboarding)
   - **client_secret** → `.env` fora do git (já está no `.gitignore` do Guarda)

---

## 6. Prompt para Implementação

```
Você é um desenvolvedor React Native/Expo experiente. Preciso integrar a
funcionalidade de uma inji-wallet no app "Guarda".

## Contexto
- O app "Guarda" (em /guarda) é um protótipo visual de carteira digital com
  NativeWind/TailwindCSS, 5 telas mockadas, e autenticação biométrica.
- O app "inji-wallet-ref-react" (em /inji-wallet-ref-react) é uma carteira
  inji-wallet funcional com OAuth gov.br, VCSDK, download de credenciais,
  e compartilhamento OpenID4VP.
- Ambos usam Expo 54, React Native 0.81.5, React 19.

## Objetivo
Integrar toda a funcionalidade da inji-wallet-ref-react no Guarda,
MANTENDO o visual/design do Guarda e SUBSTITUINDO os dados mock por
funcionalidade real.

## Tarefas (em ordem)

### Fase 0: Infraestrutura
1. Instalar as dependências necessárias no Guarda:
   - vc-sdk-headless (file:../inji-wallet-sdk/vc-sdk-headless)
   - @noble/ed25519, @noble/secp256k1, @noble/hashes
   - expo-crypto, react-native-keychain, node-forge, crypto-js
   - jose, jwt-decode, jsonpath-plus
   - @digitalcredentials/vc
   - react-native-webview, expo-web-browser
   - short-unique-id, uuid
2. Migrar a navegação do App.js (estado manual) para expo-router (file-based).
   Criar a estrutura em app/ com:
   - app/_layout.tsx (root layout)
   - app/index.tsx (splash/auth check)
   - app/login.tsx
   - app/authorize.tsx (deep-link OpenID4VP)
   - app/consentimento.tsx
   - app/verificacao-credencial.tsx
   - app/credencial-maioridade.tsx
   - app/(tabs)/_layout.tsx
   - app/(tabs)/index.tsx (home/carteira)
3. Configurar o scheme "openid4vp" no app.json para deep-links.
4. Configurar variáveis de ambiente (.env) com os endpoints OAuth e VCSDK:
   - EXPO_PUBLIC_OAUTH_AUTHORIZATION_URL
   - EXPO_PUBLIC_OAUTH_TOKEN_URL
   - EXPO_PUBLIC_OAUTH_USER_INFO_URL
   - EXPO_PUBLIC_OAUTH_CLIENT_ID
   - EXPO_PUBLIC_OAUTH_CLIENT_SECRET
   - EXPO_PUBLIC_OAUTH_REDIRECT_URI

### Fase 1: Autenticação OAuth gov.br
1. Portar components/CustomAuthWebView/ do ref para src/components/.
   Adaptar estilos de styled-components para NativeWind.
2. Reescrever authStorage.ts para src/services/authStorage.ts usando
   react-native-keychain em vez de AsyncStorage:
   - Salvar tokens (access_token, id_token, expires_at) no Keychain com
     accessControl: BIOMETRY_ANY_OR_DEVICE_PASSCODE e
     accessible: WHEN_UNLOCKED_THIS_DEVICE_ONLY.
   - PII (nome, email, foto) NÃO salvar em disco. Derivar do id_token
     (JWT decode) em memória quando necessário.
   - AsyncStorage apenas para dados não sensíveis (pending_deep_link, etc).
3. Criar app/login.tsx usando o visual do Guarda (Splash.js como inspiração)
   mas com a lógica OAuth do ref (CustomAuthWebView + PKCE).
4. Em app/index.tsx, verificar autenticação e redirecionar:
   - Autenticado → Home (tabs)
   - Não autenticado → Login
5. Implementar logout no header do Home.

### Fase 2: Credenciais
1. Portar hooks/useWallet.ts e hooks/useIssuers.ts para src/hooks/.
2. Adaptar src/screens/Home.js: substituir dados mock pelo hook useWallet.
   Manter o design visual (carrossel, cards) mas com dados reais.
3. Adaptar src/screens/AddDocument.js: usar useIssuers para listar
   emissores reais. Ao selecionar, navegar para verificacao-credencial.
4. Criar app/verificacao-credencial.tsx: tela de download com animação
   de loading, usando a lógica de download do ref.
5. Criar app/credencial-maioridade.tsx: exibição da credencial baixada
   com feedback de faixa etária.
6. Adaptar DocumentDetail.js: exibir dados reais da credencial selecionada.

### Fase 3: Compartilhamento OpenID4VP
1. Portar components/Consentimento/shareService.ts para src/services/.
2. Criar app/authorize.tsx: handler de deep-link que parseia a requisição
   OpenID4VP e redireciona para consentimento.
3. Adaptar Consent.js: usar dados reais da presentation definition
   (campos solicitados, nome do solicitante, política de retenção).
   Manter a biometria existente (expo-local-authentication).
4. Implementar submissão de VP Token ao endpoint de verificação.

### Fase 4: Polimento
1. Tratamento de erros em todos os fluxos.
2. Estados de loading apropriados.
3. Testar deep-links openid4vp://.
4. Verificar que a biometria funciona no fluxo completo.

## Regras
- MANTER o visual/design do Guarda (cores, tipografia, layout).
- Usar NativeWind para estilos (converter styled-components do ref).
- A lógica de negócio (hooks, services) deve ser portada com mínima
  alteração — foco em compatibilidade com VCSDK.
- Não criar arquivos desnecessários.
- Manter o código TypeScript onde possível.
- Referência de como os fluxos funcionam: ler os arquivos correspondentes
  no inji-wallet-ref-react.

## Regras de Segurança (OBRIGATÓRIO — não reproduzir erros do ref)
- Tokens OAuth (access_token, id_token) → react-native-keychain com
  accessControl: BIOMETRY_ANY_OR_DEVICE_PASSCODE e
  accessible: WHEN_UNLOCKED_THIS_DEVICE_ONLY.
- PII (nome, email, foto, CPF) → NUNCA salvar em disco. Derivar do
  id_token (JWT decode) em memória.
- AsyncStorage → APENAS para dados não sensíveis (pending_deep_link,
  preferências de UI, flags de onboarding).
- .env → Já está no .gitignore. Nunca commitar secrets.
- client_secret → Idealmente mover para backend. Se mantiver no app,
  não usar prefixo EXPO_PUBLIC_ (que embute no bundle JS).
```
