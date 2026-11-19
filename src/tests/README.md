# Testy StudyBuddy

Testy korzystają z wbudowanego test runnera `node:test` (Node.js 18+).

Uruchom z katalogu głównego projektu:

```bash
node --test src/tests/unit/*.test.js src/tests/integration/*.test.js
```

Testy integracyjne uruchamiają aplikację Express na losowym lokalnym porcie i używają atrap repozytoriów, dlatego nie wymagają działającego PostgreSQL. Wymagają jednak standardowych zależności aplikacji (m.in. `express`, `swagger-ui-express`, `jsonwebtoken`, `bcryptjs` i `zod`) zainstalowanych w projekcie.
