/**
 * Serviço de busca — TF-IDF local (MVP)
 * Slot preparado para upgrade com Claude API sem alterar a interface.
 *
 * Interface pública:
 *   search(query: string, journeys: Journey[]) → Journey[]
 */

function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function buildDocumentText(journey) {
  const parts = [
    journey.title,
    journey.subtitle,
    journey.description,
    journey.category,
    ...(journey.steps || []).flatMap((s) => [
      s.title,
      s.description,
      s.tip,
      s.who,
      s.channel,
      s.label,
      ...(s.branches || []).flatMap((b) => [b.title, ...(b.steps || [])]),
    ]),
  ];
  return parts.filter(Boolean).join(" ");
}

function tf(term, tokens) {
  const count = tokens.filter((t) => t === term).length;
  return count / tokens.length;
}

function idf(term, allDocs) {
  const docsWithTerm = allDocs.filter((doc) => doc.includes(term)).length;
  if (docsWithTerm === 0) return 0;
  return Math.log(allDocs.length / docsWithTerm);
}

export function search(query, journeys) {
  if (!query || query.trim().length < 2) return journeys;

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return journeys;

  const allDocs = journeys.map((j) => tokenize(buildDocumentText(j)));

  const scored = journeys.map((journey, idx) => {
    const docTokens = allDocs[idx];
    const score = queryTokens.reduce((sum, term) => {
      const tfScore = tf(term, docTokens);
      const idfScore = idf(term, allDocs);
      return sum + tfScore * idfScore;
    }, 0);

    // Boost para correspondências no título e categoria
    const titleMatch = tokenize(journey.title + " " + journey.category);
    const titleBoost = queryTokens.filter((t) => titleMatch.includes(t)).length * 0.5;

    return { journey, score: score + titleBoost };
  });

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ journey }) => journey);
}
