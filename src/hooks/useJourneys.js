import { useState, useCallback } from "react";
import seedData from "../data/journeys.json";

const STORAGE_KEY = "bhub_journeys";

function loadJourneys() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return seedData;
}

function persist(journeys) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(journeys));
  } catch (_) {}
}

function slugify(title) {
  return title
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function uniqueId(title, existing) {
  const base = slugify(title) || "jornada";
  const ids = new Set(existing.map((j) => j.id));
  if (!ids.has(base)) return base;
  let n = 2;
  while (ids.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

/** Salva arquivo de screenshot em public/screenshots/ via download simulado
 *  (no browser não podemos escrever em disco — usamos object URL em memória) */
function screenshotFilename(journeyId, stepIndex, originalName) {
  const ext = originalName.split(".").pop() || "png";
  return `${journeyId}-step${stepIndex}.${ext}`;
}

export function useJourneys() {
  const [journeys, setJourneys] = useState(loadJourneys);

  const save = useCallback((next) => {
    setJourneys(next);
    persist(next);
  }, []);

  // ── Jornada ─────────────────────────────────────────────────────────────

  const createJourney = useCallback((fields) => {
    const id = uniqueId(fields.title, journeys);
    const newJourney = { id, steps: [], ...fields };
    const next = [...journeys, newJourney];
    save(next);
    return id;
  }, [journeys, save]);

  const updateJourney = useCallback((id, fields) => {
    save(journeys.map((j) => j.id === id ? { ...j, ...fields } : j));
  }, [journeys, save]);

  const deleteJourney = useCallback((id) => {
    save(journeys.filter((j) => j.id !== id));
  }, [journeys, save]);

  // ── Steps ────────────────────────────────────────────────────────────────

  const addStep = useCallback((journeyId, stepData) => {
    save(journeys.map((j) => {
      if (j.id !== journeyId) return j;
      const index = j.steps.length;
      const step = resolveStep(stepData, journeyId, index);
      return { ...j, steps: [...j.steps, step] };
    }));
  }, [journeys, save]);

  const updateStep = useCallback((journeyId, stepIndex, stepData) => {
    save(journeys.map((j) => {
      if (j.id !== journeyId) return j;
      const steps = j.steps.map((s, i) => {
        if (i !== stepIndex) return s;
        return resolveStep(stepData, journeyId, i, s);
      });
      return { ...j, steps };
    }));
  }, [journeys, save]);

  const deleteStep = useCallback((journeyId, stepIndex) => {
    save(journeys.map((j) => {
      if (j.id !== journeyId) return j;
      const steps = j.steps.filter((_, i) => i !== stepIndex);
      return { ...j, steps };
    }));
  }, [journeys, save]);

  const moveStep = useCallback((journeyId, fromIndex, toIndex) => {
    save(journeys.map((j) => {
      if (j.id !== journeyId) return j;
      const steps = [...j.steps];
      const [moved] = steps.splice(fromIndex, 1);
      steps.splice(toIndex, 0, moved);
      return { ...j, steps };
    }));
  }, [journeys, save]);

  return {
    journeys,
    createJourney, updateJourney, deleteJourney,
    addStep, updateStep, deleteStep, moveStep,
  };
}

// ── helpers ──────────────────────────────────────────────────────────────────

function resolveStep(stepData, journeyId, index, existing) {
  const { _uploadedFile, ...fields } = stepData;

  let screenshot = fields.screenshot || existing?.screenshot || "";

  if (_uploadedFile) {
    const filename = screenshotFilename(journeyId, index, _uploadedFile.name);
    // Guarda o object URL para exibição imediata; em produção,
    // seria feito upload real para /public/screenshots/.
    screenshot = filename;
    // Armazena o blob URL em um registry para uso nos componentes
    blobRegistry.set(filename, URL.createObjectURL(_uploadedFile));
  }

  return { ...fields, screenshot };
}

/** Registry em memória de blobs de screenshot (object URLs) */
export const blobRegistry = new Map();

/** Resolve a URL de um screenshot: tenta blob registry primeiro, depois /screenshots/ */
export function resolveScreenshotUrl(filename) {
  if (!filename) return null;
  if (blobRegistry.has(filename)) return blobRegistry.get(filename);
  return `/screenshots/${filename}`;
}
