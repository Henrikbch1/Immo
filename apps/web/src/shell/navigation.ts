import {
  Building2,
  GraduationCap,
  Inbox,
  Landmark,
  LayoutDashboard,
  type LucideIcon,
  Search,
} from 'lucide-react';

export interface Bereich {
  id: string;
  pfad: string;
  titel: string;
  kurz: string;
  icon: LucideIcon;
  /** Sprint, in dem der Bereich erste Inhalte bekommt (11 §3). */
  ab: string;
  beschreibung: string;
  /** Auf kompakten Breiten nicht in der Tab-Leiste, sondern im Menü (03 §1.2). */
  nurMenueMobil?: boolean;
}

/** Navigationsziele in fester Reihenfolge (03 §1.2). */
export const BEREICHE: readonly Bereich[] = [
  {
    id: 'cockpit',
    pfad: 'cockpit',
    titel: 'Cockpit',
    kurz: 'Cockpit',
    icon: LayoutDashboard,
    ab: 'Z5',
    beschreibung: 'Überblick über Konto, Bestand, Fristen und den aktuellen Monat.',
  },
  {
    id: 'post',
    pfad: 'post',
    titel: 'Posteingang',
    kurz: 'Post',
    icon: Inbox,
    ab: 'Z5',
    beschreibung: 'Nachrichten, Ereignisse und Entscheidungen, die auf dich warten.',
  },
  {
    id: 'markt',
    pfad: 'markt',
    titel: 'Markt',
    kurz: 'Markt',
    icon: Search,
    ab: 'Z6',
    beschreibung: 'Angebote finden, Exposés prüfen und Objekte durchrechnen.',
  },
  {
    id: 'bestand',
    pfad: 'bestand',
    titel: 'Bestand',
    kurz: 'Bestand',
    icon: Building2,
    ab: 'Z8',
    beschreibung: 'Deine Objekte, Einheiten, Mieter und Instandhaltung.',
  },
  {
    id: 'finanzen',
    pfad: 'finanzen',
    titel: 'Finanzen',
    kurz: 'Finanzen',
    icon: Landmark,
    ab: 'Z1',
    beschreibung: 'Liquidität, Kredite, Bank und Steuern.',
  },
  {
    id: 'akademie',
    pfad: 'akademie',
    titel: 'Akademie',
    kurz: 'Akademie',
    icon: GraduationCap,
    ab: 'Z18',
    beschreibung: 'Lernpfad, Glossar, Mikro-Lektionen und Challenges.',
    nurMenueMobil: true,
  },
];

export const DEMO_SPIEL_ID = 'demo';
