# Vinculação Pessoa-CPF: como uma credencial digital chega à sua carteira

## Visão geral

Quando você adiciona uma credencial (ex: "Maior de 18 anos") na sua carteira digital, três sistemas trabalham juntos:

- **Gov.br** — confirma que você é você (autenticação)
- **Certify (emissor)** — consulta seus dados e emite a credencial
- **Carteira (app)** — guarda a credencial no seu celular

Nenhum desses sistemas sozinho faz tudo. Cada um tem um papel específico.

---

## Passo a passo

### 1. Você se identifica no Gov.br

A carteira abre a página de login do Gov.br no navegador do celular. Você digita seu CPF e senha (ou usa biometria, app do banco, etc.) **diretamente no site do Gov.br**. A carteira nunca vê sua senha.

Após o login, o Gov.br devolve um **token de acesso** — um documento digital assinado que diz:

> "O portador deste token é o CPF 123.456.789-00. Assinado: Gov.br."

Esse token tem validade curta (minutos) e é assinado criptograficamente. Qualquer sistema pode verificar que foi o Gov.br quem emitiu, sem precisar ligar para o Gov.br.

### 2. A carteira prova que tem uma chave própria

Cada instalação da carteira tem um **par de chaves criptográficas** — uma pública (que pode ser compartilhada) e uma privada (que nunca sai do celular).

Antes de pedir a credencial, a carteira envia ao emissor uma prova de que controla a chave privada. Isso é feito com um JWT assinado que contém a chave pública no cabeçalho.

O emissor verifica a assinatura e agora sabe: "este solicitante realmente controla esta chave pública."

### 3. O emissor consulta seus dados e emite a credencial

O emissor recebe os dois elementos:

- O **token do Gov.br** → extrai o CPF
- A **prova da carteira** → extrai a chave pública

Com o CPF em mãos, o emissor faz uma consulta interna (no caso, à base do Dataprev) para obter sua data de nascimento. A partir dela, calcula se você tem mais de 18 anos.

O emissor então monta a credencial:

- **Quem emitiu**: Ministério da Gestão e Inovação
- **Para qual carteira**: a chave pública da sua carteira (codificada como `did:jwk`)
- **O que afirma**: "esta pessoa é maior de 18 anos"
- **Assinatura do emissor**: prova criptográfica de que o emissor realmente emitiu isso

A credencial **não contém seu CPF nem sua data de nascimento**. Apenas a afirmação "é maior de 18" e a vinculação à sua carteira.

### 4. A credencial fica vinculada ao seu celular

A credencial emitida contém a chave pública da sua carteira. Isso significa que só a sua carteira — que tem a chave privada correspondente — pode provar que é a dona da credencial.

Se alguém copiar a credencial para outro celular, não vai conseguir usá-la: o outro celular não tem a chave privada.

### 5. Você apresenta a credencial a um verificador

Quando um estabelecimento (bar, delivery, etc.) pede para verificar sua idade:

1. A carteira apresenta a credencial
2. O verificador pede um **desafio**: "assine este valor aleatório com sua chave privada"
3. A carteira assina o desafio
4. O verificador confere:
   - A assinatura do emissor é válida? (a credencial é legítima?)
   - A assinatura do desafio bate com a chave pública da credencial? (quem apresentou é o dono?)

Se ambas conferem, a verificação passa. O verificador nunca vê seu CPF, nome ou data de nascimento.

---

## Cadeia de confiança

```
Você (cidadão)
  │
  │  login com CPF + senha/biometria
  ▼
Gov.br
  │
  │  token assinado (contém CPF)
  ▼
Carteira ──── prova de posse da chave ────┐
                                          ▼
                                       Emissor (Certify)
                                          │
                                          │  consulta Dataprev com o CPF
                                          │  obtém data de nascimento
                                          │  calcula maioridade
                                          │
                                          ▼
                                    Credencial assinada
                                    (vinculada à chave da carteira,
                                     sem CPF, sem data de nascimento)
                                          │
                                          ▼
                                    Verificador
                                    (bar, app de delivery, etc.)
                                    → vê apenas: "maior de 18"
                                    → confirma: assinatura do emissor + posse da chave
```

---

## Perguntas frequentes

### Se alguém roubar meu celular, pode usar minha credencial?

Depende. A chave privada da carteira é armazenada no enclave seguro do celular (Keychain no iOS, TEE/StrongBox no Android). Para usá-la, é preciso desbloquear o dispositivo (biometria, PIN). Se o celular está bloqueado, a credencial não pode ser apresentada.

### O verificador (bar, delivery) fica sabendo meu CPF?

Não. A credencial contém apenas a afirmação "é maior de 18" e a chave pública da carteira. Seu CPF, nome e data de nascimento não estão na credencial.

### O emissor fica sabendo para quem eu apresento a credencial?

Não. Após a emissão, o emissor não participa mais. A apresentação é direta entre a carteira e o verificador. O emissor não é notificado.

### E se eu trocar de celular?

A chave privada não pode ser exportada do enclave seguro. Você precisaria emitir a credencial novamente no novo celular, passando pelo mesmo processo (login Gov.br → prova de chave → emissão).

### A carteira poderia mentir sobre minha idade?

Não. A carteira não decide o conteúdo da credencial. Quem consulta a data de nascimento e calcula a maioridade é o emissor (via Dataprev). A carteira só recebe o resultado final, já assinado. Se alterar qualquer bit, a assinatura do emissor fica inválida e o verificador rejeita.

### Por que o Gov.br não emite a credencial diretamente?

Separação de responsabilidades. O Gov.br é especialista em **autenticação** (confirmar que você é você). O emissor (Certify/MGI) é especialista em **emitir credenciais verificáveis** com dados de fontes autoritativas (Dataprev, INCRA, etc.). Cada sistema faz o que faz melhor.

### O que impede alguém de pedir uma credencial com o CPF de outra pessoa?

A autenticação no Gov.br. Para obter o token com um CPF, é preciso fazer login com as credenciais daquele CPF (senha, biometria facial, certificado digital, app de banco). Não basta saber o número do CPF — é preciso **ser** a pessoa.

### A credencial tem validade?

Sim. O emissor define uma data de expiração. Após essa data, o verificador deve rejeitar a credencial. Para renová-la, o cidadão repete o processo.

### Isso é o mesmo que o login com Gov.br que já existe em sites?

Não. O login Gov.br em sites é uma autenticação online — o site fala com o Gov.br em tempo real. A credencial verificável é **offline**: uma vez emitida, pode ser apresentada sem internet, sem contato com Gov.br ou com o emissor. É como a diferença entre mostrar seu RG físico (offline) e logar num site com CPF e senha (online).
