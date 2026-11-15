# Changelog

## 1.0.0
- Première version.
- **Poubelles** : une par appareil, avec `sensor.<poubelle>_prochaine_collecte`, `sensor.<poubelle>_jours`, `binary_sensor.<poubelle>_a_sortir` et `switch.<poubelle>_sortie`.
- **Dates de collecte** : récurrence (un ou plusieurs jours, toutes les 1 à 4 semaines, ou le 1er / 2e / 3e / 4e / dernier jour du mois), calendrier Home Assistant, ou dates à la main ; mois de collecte, jours fériés décalés au lendemain, dates ajoutées et annulées.
- **Rappels** : la veille, relance et matin de la collecte, regroupés en une notification avec un bouton « C'est fait » ; évènement `holm_bins_a_sortir`.
- **Reprise des calendriers** à l'installation, convertis en récurrence quand les collectes sont régulières.
- **Carte HOLM Poubelles** : bacs dessinés à la couleur de chaque poubelle (6 styles), délai, date, barre d'approche, coche « sortie », dispositions en rangée, en liste ou compacte ; réglages complets des poubelles et des rappels depuis la roue crantée ; 8 animations intégrées et les ambiances HOLM FX pour la veille, le jour de collecte et une fois sortie.
- 8 langues : français, anglais, allemand, espagnol, italien, néerlandais, portugais, polonais.
