export const toDiveDto = (dive) => ({
  date: dive.date,
  location: dive.location,
  diveTime: dive.diveTime,
  equipment: dive.equipment,
  decompressionTime: dive.decompressionTime,
  maxDepth: dive.maxDepth,
  notes: dive.notes,
});
