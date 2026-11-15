# Changelog

## 1.1.0
- **Image personnalisée du bac** : chaque poubelle peut afficher votre propre image (téléversée depuis la carte, ou une adresse `/local/…` / `https://…`) à la place du dessin HOLM. Les animations s'appliquent aussi à l'image (le « couvercle qui s'ouvre » devient un balancement).
- **Vérification par caméra** : la veille de la collecte, à l'heure choisie, une photo de la caméra est analysée par une tâche IA de Home Assistant. Les poubelles vues sont marquées sorties (plus de relance) ; pour les autres, une alerte part avec la photo et le bouton « C'est fait ».
  - Nouvel onglet **Caméra** dans les réglages de la carte : caméra, tâche IA, heure, alerte et destinataires, test immédiat et résultat de la dernière vérification avec sa photo.
  - Nouvelle action `holm_bins.check_camera` et nouvel évènement `holm_bins_verification` (`seen`, `missing`, `names_missing`, `image`).
- Nouvel attribut `image` sur `sensor.<poubelle>_prochaine_collecte`.
- Traductions dans les 8 langues.

## 1.0.0
- Première version.
- **Poubelles** : une par appareil, avec `sensor.<poubelle>_prochaine_collecte`, `sensor.<poubelle>_jours`, `binary_sensor.<poubelle>_a_sortir` et `switch.<poubelle>_sortie`.
- **Dates de collecte** : récurrence (un ou plusieurs jours, toutes les 1 à 4 semaines, ou le 1er / 2e / 3e / 4e / dernier jour du mois), calendrier Home Assistant, ou dates à la main ; mois de collecte, jours fériés décalés au lendemain, dates ajoutées et annulées.
- **Rappels** : la veille, relance et matin de la collecte, regroupés en une notification avec un bouton « C'est fait » ; évènement `holm_bins_a_sortir`.
- **Reprise des calendriers** à l'installation, convertis en récurrence quand les collectes sont régulières.
- **Carte HOLM Poubelles** : bacs dessinés à la couleur de chaque poubelle (6 styles), délai, date, barre d'approche, coche « sortie », dispositions en rangée, en liste ou compacte ; réglages complets des poubelles et des rappels depuis la roue crantée ; 8 animations intégrées et les ambiances HOLM FX pour la veille, le jour de collecte et une fois sortie.
- 8 langues : français, anglais, allemand, espagnol, italien, néerlandais, portugais, polonais.
