/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Opcjonalnie: wyczyszczenie tabeli przed wstawieniem nowych danych
  await knex('grades').del();

  // Wstawienie przykładowych ocen (pamiętaj, że subject_id musi odpowiadać istniejącym przedmiotom w tabeli subjects)
  await knex('grades').insert([
    { 
      subject_id: 1, 
      grade: 5.0, 
      weight: 2.0, 
      description: 'Kolokwium z aplikacji internetowych', 
      grade_date: '2026-06-01' 
    },
    { 
      subject_id: 1, 
      grade: 4.5, 
      weight: 1.0, 
      description: 'Projekt semestralny', 
      grade_date: '2026-06-10' 
    },
    { 
      subject_id: 2, 
      grade: 4.0, 
      weight: 3.0, 
      description: 'Egzamin z baz danych', 
      grade_date: '2026-06-15' 
    }
  ]);
};