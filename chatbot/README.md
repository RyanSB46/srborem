# Chatbot Sr. Borém (Node.js + Evolution API)

MVP fiel ao fluxo definido:

- atendimento inicial e qualificação;
- preços por instrumento;
- informações de matrícula e pagamento;
- coleta guiada de dados de matrícula;
- recebimento de comprovante;
- handoff humano para Henrique;
- anti-loop e redução de mensagens repetidas.

## 1) Configurar ambiente

1. Copie `.env.example` para `.env`.
2. Preencha:
   - `EVOLUTION_API_URL`
   - `EVOLUTION_API_KEY`
   - `EVOLUTION_INSTANCE=srborem`

## 2) Instalar e rodar local

```bash
npm install
npm run dev
```

API local:

- Healthcheck: `GET http://localhost:3000/health`
- Webhook: `POST http://localhost:3000/webhook`

URL para painel da Evolution (cenário atual):

`http://host.docker.internal:3000/webhook`

## 3) Eventos recomendados na Evolution (MVP)

Ative:

- `MENSAGENS_UPSERT`
- `ATUALIZAÇÃO DE MENSAGENS`
- `ATUALIZAÇÃO DE CONEXÃO`
- `QRCODE_ATUALIZADO`
- `INSTÂNCIA_DE_LOGOUT`
- `ENVIAR_MENSAGEM`

## 4) Rodar via Docker

```bash
docker compose up -d --build
```

> Se rodar bot dentro do Docker e Evolution fora, mantenha `EVOLUTION_API_URL` acessível a partir do container.

## 5) Observações importantes

- Os preços foram padronizados conforme o bloco geral de preços enviado.
- Fluxo de horários está como triagem (coleta período preferido + encaminhamento para confirmação humana).
- O schema Prisma foi criado para a próxima etapa de persistência em banco.
