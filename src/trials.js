const trials = [
  {
    id: "il13xtslp-1b",
    name: "IL13xTSLP 1B",
    protocolNumber: "IL13xTSLP-1B",
    phase: "Phase 1b",
    status: "Active",
    indication: "Atopic dermatitis",
    visits: [
      { id: "screening", name: "Screening", window: "Day -28 to -1" },
      { id: "baseline", name: "Baseline", window: "Day 1" },
      { id: "week-4", name: "Week 4", window: "Day 28 ± 3" },
      { id: "week-12", name: "Week 12", window: "Day 84 ± 3" },
    ],
  },
  {
    id: "dupixent-ole",
    name: "Dupixent OLE",
    protocolNumber: "DUP-OLE-01",
    phase: "Open label",
    status: "Enrolling",
    indication: "Asthma",
    visits: [
      { id: "baseline", name: "Baseline", window: "Day 1" },
      { id: "week-12", name: "Week 12", window: "Day 84 ± 7" },
      { id: "week-24", name: "Week 24", window: "Day 168 ± 7" },
    ],
  },
  {
    id: "abc-101",
    name: "ABC-101 Phase 3",
    protocolNumber: "ABC-101-P3",
    phase: "Phase 3",
    status: "Startup",
    indication: "Chronic rhinosinusitis",
    visits: [
      { id: "screening", name: "Screening", window: "Day -14 to -1" },
      { id: "day-1", name: "Day 1", window: "Day 1" },
      { id: "month-6", name: "Month 6", window: "Day 180 ± 14" },
    ],
  },
];

function copyTrial(trial) {
  return {
    id: trial.id,
    name: trial.name,
    protocolNumber: trial.protocolNumber,
    phase: trial.phase,
    status: trial.status,
    indication: trial.indication,
    visits: trial.visits.map((visit) => ({ ...visit })),
  };
}

function listTrials() {
  return trials.map(copyTrial);
}

function getTrial(id) {
  const trial = trials.find((item) => item.id === id);
  return trial ? copyTrial(trial) : null;
}

function getVisit(trial, visitId) {
  if (!trial) return null;
  return trial.visits.find((visit) => visit.id === visitId) || null;
}

module.exports = {
  listTrials,
  getTrial,
  getVisit,
};
