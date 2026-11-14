exports.seed = async function(knex) {
  // Opcjonalnie: wyczyszczenie tabeli przed wstawieniem nowych danych
  await knex('subjects').del();

  // Wstawienie przykładowych przedmiotów
  await knex('subjects').insert([
    { 
      name: 'Technologie Webowe i Aplikacje Internetowe', 
      teacher: 'Dr inż. Kowalski', 
      user_id: null 
    },
    { 
      name: 'Bazy Danych', 
      teacher: 'Prof. Nowak', 
      user_id: null 
    },
    { 
      name: 'Inżynieria Oprogramowania', 
      teacher: 'Dr Wiśniewska', 
      user_id: null 
    }
  ]);
};