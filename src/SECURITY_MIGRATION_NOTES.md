# Zmiany autoryzacji i izolacji danych

## Co zostało zmienione
- JWT jest wymagany dla `/api/tasks`, `/api/subjects` i `/api/grades`.
- ID użytkownika jest pobierane wyłącznie z `req.user.id`, czyli ze zweryfikowanego JWT.
- Repozytoria filtrują rekordy po `user_id`.
- Tworzenie przedmiotu, zadania i oceny zapisuje właściciela z tokenu, a nie z body.
- Zadania i oceny mogą być odczytywane/usuwane wyłącznie przez właściciela.
- Tworzenie zadania/oceny z `subject_id` sprawdza, czy przedmiot należy do zalogowanego użytkownika.
- `tasks` i `grades` otrzymują bezpośrednie `user_id`, dzięki czemu zadania bez przedmiotu również mają właściciela.
- Migracja uzupełnia istniejące rekordy pierwszym użytkownikiem z rolą USER.

## Przed wdrożeniem
1. Wykonaj kopię bazy danych.
2. Upewnij się, że istnieje co najmniej jeden użytkownik z rolą `USER`.
3. Uruchom migracje: `npx knex migrate:latest`.
4. Jeśli używasz seedów, uruchom je w kolejności users, subjects, tasks, grades.
5. Zrestartuj API i przetestuj scenariusze dwóch różnych użytkowników.

## Ważne
Migracja przypisuje dotychczasowe rekordy bez właściciela pierwszemu użytkownikowi USER. Jeśli dane w obecnej bazie należą do różnych osób, przed migracją należy przygotować własne mapowanie właścicieli zamiast używać automatycznego przypisania.

Nie uruchamiaj `knex seed:run` na bazie z danymi produkcyjnymi — seedy przykładowe usuwają wcześniejsze dane.
