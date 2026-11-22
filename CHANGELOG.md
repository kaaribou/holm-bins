# Changelog

## 1.3.0
- **Titres des notifications personnalisables** ([#7](https://github.com/kaaribou/holm-bins/issues/7)) : « Titre — la veille et le matin » et « Titre — relance » dans l'onglet Rappels (réglages `title_notif` et `title_reminder`), modèles Home Assistant avec les mêmes variables que les textes. Vide ou en erreur : titre par défaut. La notification de test utilise le titre personnalisé.
- **Arrondi des bords** ([#6](https://github.com/kaaribou/holm-bins/issues/6)) : option `border_radius` (aussi dans l'éditeur) et variable de thème `holm-bins-border-radius` ; sinon l'arrondi du thème.
- **Moins de place perdue** ([#6](https://github.com/kaaribou/holm-bins/issues/6)) : marges réduites en haut et en bas de la carte et sous le titre ; nouvelle option `spacing: compact` (« Espacement : Réduit ») pour mobile.
- Traductions dans les 8 langues. Redémarrage de Home Assistant nécessaire (titres envoyés par l'intégration).

## 1.2.0
- **Un seul calendrier pour plusieurs poubelles** ([#4](https://github.com/kaaribou/holm-bins/issues/4)) : nouveau champ **Mot-clé dans le nom de l'événement** pour la source Calendrier. Seuls les événements dont le nom contient ce mot comptent (majuscules et accents ignorés, début de mot, plusieurs mots séparés par des virgules). Les noms d'événements du calendrier sont proposés sous le champ ; un appui en fait le mot-clé.
- **Textes des notifications personnalisables** ([#3](https://github.com/kaaribou/holm-bins/issues/3)) : la veille, le matin de la collecte et la relance, dans l'onglet Rappels. Modèles Home Assistant, avec les variables `{{ poubelles }}`, `{{ date }}`, `{{ jour }}` et `{{ liste }}` (par exemple `{{ states('input_text.message_poubelles') }}`). Un modèle en erreur laisse partir le texte par défaut.
- **Fond de la carte** ([#3](https://github.com/kaaribou/holm-bins/issues/3)) : nouvelle option `background` (couleur, dégradé ou variable de thème), aussi dans l'éditeur visuel.
- **Une carte par poubelle** ([#2](https://github.com/kaaribou/holm-bins/issues/2)) : la roue crantée d'une carte limitée par « Poubelles affichées » (`bins`) ne montre que ses poubelles, avec un lien « Voir toutes les poubelles ».
- **Correction** ([#5](https://github.com/kaaribou/holm-bins/issues/5)) : « Envoyer une notification de test » et « Vérifier maintenant » répondaient « HOLM Poubelles n'est pas configuré » : ils interrogeaient l'intégration pendant le rechargement déclenché par l'enregistrement. L'enregistrement ne recharge plus l'intégration que si des poubelles sont ajoutées, supprimées ou renommées (les autres réglages s'appliquent sur place), le rechargement est terminé avant la réponse, et les boutons attendent l'intégration si besoin. Le message d'erreur est traduit.
- **Correction** ([#1](https://github.com/kaaribou/holm-bins/issues/1)) : la disposition Compacte est centrée dans la carte.

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
