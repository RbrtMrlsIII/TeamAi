export type AuthorityService =
  | 'firebase-auth'
  | 'firestore-default'
  | 'supabase-edge-functions'
  | 'paypal'
  | 'github'
  | 'firebase-hosting'
  | 'vercel'
  | 'supabase-storage';

export type DomainStateAuthority =
  | 'identity'
  | 'application'
  | 'execution'
  | 'payment'
  | 'engineering'
  | 'delivery'
  | 'content';

export const AUTHORITY_BY_DOMAIN: Record<DomainStateAuthority, AuthorityService> = {
  identity: 'firebase-auth',
  application: 'firestore-default',
  execution: 'supabase-edge-functions',
  payment: 'paypal',
  engineering: 'github',
  delivery: 'firebase-hosting',
  content: 'supabase-storage',
};

export function authorityFor(domain: DomainStateAuthority): AuthorityService {
  return AUTHORITY_BY_DOMAIN[domain];
}

export function assertAuthority(domain: DomainStateAuthority, service: AuthorityService): void {
  const expected = authorityFor(domain);
  if (expected !== service) {
    throw new Error(`authority violation: ${domain} must be owned by ${expected}, not ${service}`);
  }
}
