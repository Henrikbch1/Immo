# ADR 0005 – Spielstand: Snapshot + Befehlslog + Keyframes, Versionen, Migrationen

**Status:** Entwurf (Umsetzung Z5/Z8) · `04-…` §4

- Zustand = Snapshot je Monat (Keyframes) + Befehlslog; deterministisch rekonstruierbar.
- Speicher: IndexedDB (Dexie) im Web; Export/Import `.immosave` mit Round-Trip-Hash.
- Jede Version mit `schemaVersion`; Migrationen als reine Funktionen. Rückgängig nur im laufenden Monat.
