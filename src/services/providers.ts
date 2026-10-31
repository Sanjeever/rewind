const providers = {
  netEase: 'netEase',
  qqMusic: 'qqMusic',
  local: 'local',
} as const;
export type Provider = (typeof providers)[keyof typeof providers];
export type OnlineProvider = Exclude<Provider, 'local'>;
export default providers;
