/**
 * Serviço de análise de impacto — regras simples (MVP)
 * Slot preparado para upgrade com Claude API sem alterar a interface.
 *
 * Interface pública:
 *   getRelated(journey: Journey, allJourneys: Journey[]) → RelatedJourney[]
 *   getImpactWarning(step: Step, journey: Journey, allJourneys: Journey[]) → Warning[]
 */

const STOP_WORDS = new Set([
  "de", "do", "da", "dos", "das", "e", "o", "a", "os", "as",
  "em", "no", "na", "nos", "nas", "por", "para", "com", "que",
  "se", "ao", "um", "uma", "ou", "mais",
]);

function extractKeyTerms(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 3 && !STOP_WORDS.has(t));
}

function journeyTerms(journey) {
  const texts = [
    journey.channel,
    ...(journey.steps || []).flatMap((s) => [
      s.channel,
      s.who,
      s.title,
      s.description,
    ]),
  ];
  return new Set(texts.flatMap(extractKeyTerms));
}

/**
 * Retorna jornadas relacionadas à jornada atual, com os termos em comum.
 */
export function getRelated(journey, allJourneys) {
  const sourceTerms = journeyTerms(journey);

  return allJourneys
    .filter((j) => j.id !== journey.id)
    .map((j) => {
      const targetTerms = journeyTerms(j);
      const shared = [...sourceTerms].filter((t) => targetTerms.has(t));
      return { journey: j, sharedTerms: shared, score: shared.length };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);
}

/**
 * Retorna alertas de impacto ao editar/excluir um step.
 * Verifica se o canal ou responsável do step aparece em outras jornadas.
 */
export function getImpactWarning(step, currentJourney, allJourneys) {
  const stepTerms = new Set([
    ...extractKeyTerms(step.channel || ""),
    ...extractKeyTerms(step.who || ""),
    ...extractKeyTerms(step.title || ""),
  ]);

  const affected = allJourneys
    .filter((j) => j.id !== currentJourney.id)
    .flatMap((j) =>
      (j.steps || [])
        .filter((s) => {
          const sTerms = new Set([
            ...extractKeyTerms(s.channel || ""),
            ...extractKeyTerms(s.who || ""),
          ]);
          return [...stepTerms].some((t) => sTerms.has(t));
        })
        .map((s) => ({ journey: j, step: s }))
    );

  return affected;
}
