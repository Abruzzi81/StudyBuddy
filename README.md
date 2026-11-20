# StudyBuddy

StudyBuddy to backend aplikacji do zarządzania nauką. Udostępnia REST API, za pomocą którego użytkownicy mogą zarządzać przedmiotami, zadaniami i ocenami. Aplikacja obsługuje uwierzytelnianie użytkowników, role `USER` i `ADMIN`, walidację danych oraz komunikację z relacyjną bazą danych PostgreSQL.

## Główne funkcjonalności

### Uwierzytelnianie i użytkownicy

- Rejestracja użytkownika.
- Logowanie i wydawanie tokenu JWT.
- Pobieranie danych aktualnie zalogowanego użytkownika.
- Przechowywanie haseł w postaci skrótów tworzonych za pomocą `bcryptjs`.
- Rozróżnienie ról `USER` i `ADMIN`.
- Endpoint administracyjny do pobierania listy użytkowników.

### Przedmioty

- Dodawanie przedmiotów.
- Pobieranie listy przedmiotów z paginacją i sortowaniem.
- Pobieranie pojedynczego przedmiotu.
- Edycja i usuwanie przedmiotów.
- Możliwość zapisania nazwy przedmiotu i nauczyciela.

### Zadania

- Tworzenie, wyświetlanie i edycja zadań.
- Powiązanie zadania z przedmiotem.
- Ustawianie tytułu, opisu, terminu i typu zadania.
- Obsługa statusów: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELED`.
- Anulowanie zadania.
- Filtrowanie listy według statusu i przedmiotu.
- Paginacja, sortowanie oraz podsumowanie zadań.

### Oceny

- Dodawanie i wyświetlanie ocen przypisanych do przedmiotów.
- Zapisywanie wagi, opisu i daty oceny.
- Filtrowanie ocen według przedmiotu.
- Paginacja i sortowanie.
- Obliczanie średniej ważonej.

### Uprawnienia USER i ADMIN

- `USER` korzysta z danych przypisanych do swojego konta.
- `ADMIN` ma dostęp administracyjny do danych użytkowników.
- Zgodnie z wprowadzoną zmianą endpointy listujące `/api/tasks`, `/api/subjects` i `/api/grades` powinny zwracać administratorowi rekordy wszystkich użytkowników, a zwykłemu użytkownikowi wyłącznie jego własne rekordy.
- Dostęp do endpointów chronionych wymaga poprawnego tokenu JWT.


## Technologie

- **Node.js** – środowisko uruchomieniowe JavaScript.
- **Express.js** – framework do budowy REST API.
- **PostgreSQL** – relacyjna baza danych.
- **Knex.js** – zapytania SQL, migracje i seedy.
- **Zod** – walidacja danych wejściowych i konfiguracji.
- **JWT (`jsonwebtoken`)** – uwierzytelnianie tokenami.
- **bcryptjs** – haszowanie i weryfikacja haseł.
- **Swagger UI (`swagger-ui-express`)** – interaktywna dokumentacja API.
- **Node.js `node:test`** – testy jednostkowe i integracyjne.

Projekt wykorzystuje CommonJS (`require` / `module.exports`).

## Konfiguracja środowiska

Utwórz plik `.env` w katalogu głównym projektu:

```env
NODE_ENV=development
PORT=3002
DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/studybuddy
JWT_SECRET=uzupelnij_tutaj_dlugi_losowy_sekret_minimum_32_znaki
JWT_EXPIRES_IN=15m
```

Znaczenie zmiennych:

| Zmienna | Opis |
|---|---|
| `NODE_ENV` | Środowisko uruchomieniowe: `development`, `test` lub `production`. |
| `PORT` | Port serwera HTTP; domyślnie `3002`. |
| `DATABASE_URL` | Adres połączenia z PostgreSQL. |
| `JWT_SECRET` | Sekret używany do podpisywania i weryfikowania JWT; minimum 32 znaki. |
| `JWT_EXPIRES_IN` | Czas ważności tokenu JWT; domyślnie `15m`. |


## Instalacja i uruchomienie

1. Sklonuj repozytorium i przejdź do katalogu głównego:

   ```bash
   git clone <adres-repozytorium>
   cd <katalog-projektu>
   ```

2. Zainstaluj zależności:

   ```bash
   npm install
   ```

   Wśród zależności aplikacji znajdują się m.in. `express`, `knex`, `pg`, `zod`, `jsonwebtoken`, `bcryptjs` i `swagger-ui-express`.

3. Utwórz bazę danych PostgreSQL, a następnie uzupełnij `.env`.

4. Uruchom migracje Knex z katalogu głównego (wymaga konfiguracji `knexfile.js`):

   ```bash
   npx knex migrate:latest
   ```

5. Opcjonalnie załaduj dane przykładowe:

   ```bash
   npx knex seed:run
   ```

   **Uwaga:** seedy z przykładowymi danymi mogą czyścić istniejące rekordy. Uruchamiaj je wyłącznie na lokalnej/testowej bazie danych, po sprawdzeniu ich zawartości.

6. Uruchom serwer:

   ```bash
   node src/server.js
   ```

Po uruchomieniu API powinno być dostępne pod adresem:

```text
http://localhost:3002
```

Port może być inny, jeśli ustawiono inną wartość `PORT`.

# StudyBuddy – diagram modelu danych (ERD)

Diagram opracowano na podstawie migracji Knex znajdujących się w `src/db/migrations/` w przesłanym archiwum.

## Diagram ERD

```mermaid
erDiagram
    USERS ||--o{ SUBJECTS : "owns"
    USERS ||--o{ TASKS : "owns"
    USERS o|--o{ TASKS : "created_by"
    USERS ||--o{ GRADES : "owns"
    SUBJECTS o|--o{ TASKS : "has"
    SUBJECTS ||--o{ GRADES : "has"

    USERS {
        int id PK
        varchar email UK
        varchar password_hash
        varchar role
        timestamp created_at
    }

    SUBJECTS {
        int id PK
        int user_id FK
        varchar name
        varchar teacher
        timestamp createdAt
    }

    TASKS {
        int id PK
        int user_id FK
        int subject_id FK "nullable"
        int created_by FK "nullable"
        varchar title
        text description
        timestamp due_date
        enum type
        timestamp createdAt
        enum status
    }

    GRADES {
        int id PK
        int user_id FK
        int subject_id FK
        decimal grade
        decimal weight
        varchar description
        date grade_date
        timestamp createdAt
    }
```

## Opis relacji

| Relacja | Znaczenie | Ograniczenie |
|---|---|---|
| `USERS` → `SUBJECTS` | Jeden użytkownik może mieć wiele przedmiotów; każdy przedmiot ma jednego właściciela. | `subjects.user_id` → `users.id`, `ON DELETE CASCADE` |
| `USERS` → `TASKS` (właściciel) | Jeden użytkownik może mieć wiele zadań; każde zadanie ma jednego właściciela. | `tasks.user_id` → `users.id`, `ON DELETE CASCADE` |
| `USERS` → `TASKS` (twórca) | Zadanie może wskazywać użytkownika, który je utworzył. Pole jest opcjonalne. | `tasks.created_by` → `users.id`, `ON DELETE SET NULL` |
| `SUBJECTS` → `TASKS` | Przedmiot może mieć wiele zadań; zadanie może nie być przypisane do przedmiotu. | `tasks.subject_id` → `subjects.id`, `ON DELETE CASCADE` |
| `USERS` → `GRADES` | Jeden użytkownik może mieć wiele ocen; każda ocena ma jednego właściciela. | `grades.user_id` → `users.id`, `ON DELETE CASCADE` |
| `SUBJECTS` → `GRADES` | Jeden przedmiot może mieć wiele ocen; każda ocena jest przypisana do jednego przedmiotu. | `grades.subject_id` → `subjects.id`, `ON DELETE CASCADE` |

## Ograniczenia i wartości pól

- `users.email` jest wymagany i unikalny.
- `users.password_hash` jest wymagany.
- `users.role` przyjmuje `USER` albo `ADMIN` (ograniczenie CHECK); domyślnie `USER`.
- `subjects.user_id`, `tasks.user_id` i `grades.user_id` są wymagane po wykonaniu migracji `20261119000000_add_user_ownership`.
- `tasks.subject_id` jest opcjonalny.
- `tasks.created_by` jest opcjonalny.
- `tasks.type`: `HOMEWORK`, `TEST`, `OTHER`; domyślnie `OTHER`.
- `tasks.status`: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELED`; domyślnie `PENDING`.
- `grades.grade` i `grades.weight` są typu `DECIMAL(3,2)`; domyślna waga to `1.00`.
- `grades.grade_date` jest wymagane i domyślnie przyjmuje bieżącą datę.
  

## Dokumentacja API

Interaktywna dokumentacja Swagger UI jest dostępna pod adresem:

```text
http://localhost:3002/api/docs
```

Po zalogowaniu skopiuj `accessToken` z odpowiedzi endpointu logowania. W Swagger UI użyj przycisku **Authorize** i przekaż token jako Bearer JWT.

## Główne endpointy

Wszystkie ścieżki poniżej są poprzedzone prefiksem `/api`.

| Metoda | Endpoint | Opis |
|---|---|---|
| `POST` | `/auth/register` | Rejestracja użytkownika. |
| `POST` | `/auth/login` | Logowanie i pobranie tokenu JWT. |
| `GET` | `/auth/me` | Dane zalogowanego użytkownika. |
| `GET` | `/admin/users` | Lista użytkowników dostępna dla ADMIN. |
| `GET` | `/subjects` | Lista przedmiotów. |
| `POST` | `/subjects` | Utworzenie przedmiotu. |
| `GET` | `/subjects/:id` | Szczegóły przedmiotu. |
| `PATCH` | `/subjects/:id` | Aktualizacja przedmiotu. |
| `DELETE` | `/subjects/:id` | Usunięcie przedmiotu. |
| `GET` | `/tasks` | Lista zadań. |
| `GET` | `/tasks/summary` | Podsumowanie zadań. |
| `POST` | `/tasks` | Utworzenie zadania. |
| `GET` | `/tasks/:id` | Szczegóły zadania. |
| `PATCH` | `/tasks/:id` | Aktualizacja zadania. |
| `PATCH` | `/tasks/:id/cancel` | Anulowanie zadania. |
| `GET` | `/grades` | Lista ocen. |
| `GET` | `/grades/average` | Średnia ocen. |
| `POST` | `/grades` | Dodanie oceny. |
| `GET` | `/grades/:id` | Szczegóły oceny. |
| `DELETE` | `/grades/:id` | Usunięcie oceny. |

Endpointy wymagające uwierzytelnienia przyjmują nagłówek:

```http
Authorization: Bearer <accessToken>
```

Listy przedmiotów, zadań i ocen obsługują paginację (`page`, `limit`) oraz parametry sortowania. Zadania można dodatkowo filtrować m.in. po `status` i `subject_id`, a oceny po `subject_id`. Szczegółowe parametry i schematy odpowiedzi znajdują się w Swagger UI.

## Testy

W projekcie znajdują się testy oparte na wbudowanym module `node:test`.

Aktualnie dostarczone pliki testowe:

- `src/tests/unit/services.test.js` – testy jednostkowe serwisów.
- `src/tests/integration/api.test.js` – testy integracyjne API.
- `src/tests/README.md` – dodatkowe informacje o uruchamianiu testów.

Testy integracyjne korzystają z atrap repozytoriów i nie wymagają działającej bazy PostgreSQL. Wymagają natomiast zainstalowanych zależności aplikacji.

Uruchom wszystkie obecne testy z katalogu głównego:

```bash
node --test src/tests/unit/*.test.js src/tests/integration/*.test.js
```

Albo krócej:

```bash
node --test
```


## Struktura katalogu `src`

```text
src/
├── app.js
├── server.js
├── config/
├── db/
│   ├── migrations/
│   └── seeds/
├── docs/
│   └── openapi.json
├── errors/
├── middleware/
├── modules/
│   ├── auth/
│   ├── tasks/
│   ├── subjects/
│   └── grades/
└── tests/
    ├── unit/
    └── integration/
```

Kod jest podzielony na moduły funkcjonalne. W modułach zastosowano osobne pliki tras, kontrolerów, serwisów, repozytoriów, schematów walidacyjnych i mapperów odpowiedzi. Warstwa `app.js` składa aplikację i przekazuje zależności do poszczególnych modułów.

## Bezpieczeństwo

- Hasła użytkowników są haszowane przed zapisaniem w bazie.
- Endpointy chronione wymagają poprawnego tokenu JWT.
- Dane wejściowe są walidowane za pomocą Zod.
- Dostęp administracyjny do listy użytkowników jest ograniczony rolą `ADMIN`.
- Nie udostępniaj sekretu JWT ani danych połączeniowych do bazy.
- Nie uruchamiaj seedów czyszczących dane na środowisku produkcyjnym.
