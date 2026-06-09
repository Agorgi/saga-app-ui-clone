// Wireframe clone: production gates features behind OpenFeature / Flagsmith flags
// (see app-web's useFeatures). Here every flag the crowd-commission UI checks is simply
// on, so the surfaces render. Signature mirrors the production hook so callers stay verbatim.
export interface Features {
  crowdCommissionsEnabled: boolean;
  crowdCommissionsGoalEnabled: boolean;
  canCreateCrowdCommission: boolean;
  canCreateCommunity: boolean;
}

export function useFeatures(): Features {
  return {
    crowdCommissionsEnabled: true,
    crowdCommissionsGoalEnabled: true,
    canCreateCrowdCommission: true,
    canCreateCommunity: true,
  };
}
