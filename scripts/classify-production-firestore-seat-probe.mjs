/**
 * Classify a missing canonical Seat probe without creating documents.
 * Live Gate 3 evidence: teamDocumentCount=0 with a successful team list is an
 * operator-authorized hierarchy blocker, not a probe or index defect.
 */
export function classifyMissingSeatProbe({ teamIds, teamListError } = {}) {
  if (teamListError) {
    return {
      result: 'canonical_seat_not_found',
      blockerClass: 'team_list_failed',
      operatorActionRequired: false,
    };
  }

  const ids = Array.isArray(teamIds) ? teamIds : [];
  if (ids.length === 0) {
    return {
      result: 'canonical_seat_not_found',
      blockerClass: 'operator_hierarchy_absent',
      operatorActionRequired: true,
    };
  }

  return {
    result: 'canonical_seat_not_found',
    blockerClass: 'canonical_seat_missing_in_existing_hierarchy',
    operatorActionRequired: false,
  };
}
