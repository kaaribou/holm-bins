"""Constantes de HOLM Poubelles."""
DOMAIN = "holm_bins"
VERSION = "1.1.0"
NAME = "HOLM Poubelles"

STORE_KEY = "holm_bins.data"
STORE_VERSION = 1

CONF_IMPORT = "import_calendars"
CONF_DETECT = "detect_rules"

# sources des dates d'une poubelle
SRC_RULE = "rule"          # récurrence (chaque semaine, une semaine sur deux, 1er lundi du mois…)
SRC_CALENDAR = "calendar"  # un calendrier Home Assistant existant (local, ICS, Google…)
SRC_DATES = "dates"        # uniquement des dates saisies à la main
SOURCES = (SRC_RULE, SRC_CALENDAR, SRC_DATES)

RULE_WEEKLY = "weekly"     # tous les N semaines, un ou plusieurs jours
RULE_MONTHLY = "monthly"   # le Ne <jour> du mois (−1 = dernier)

# états d'une poubelle (attribut « etat »)
ST_LATER = "plus_tard"
ST_SOON = "bientot"
ST_EVE = "veille"
ST_TODAY = "aujourdhui"
ST_OUT = "sortie"
ST_NONE = "aucune"

STYLES = ("bac", "bac_jaune", "verre", "sac", "compost", "carton")

DEFAULT_SETTINGS = {
    "targets": [],          # services notify.* qui reçoivent les rappels
    "time": "19:00",        # rappel la veille
    "reminder": "21:30",    # relance si pas encore sortie (vide = pas de relance)
    "morning": "",          # rappel le matin même (vide = aucun)
    "end": "12:00",         # le jour de collecte, la poubelle n'est plus « à sortir » après cette heure
    # vérification par caméra (la veille) : une tâche IA regarde si les poubelles sont sorties
    "camera": "",           # entité caméra (vide = pas de vérification)
    "ai_task": "",          # entité de tâche IA (vide = celle par défaut de Home Assistant)
    "camera_time": "20:00", # heure de la vérification, la veille de la collecte
    "camera_alert": True,   # alerter (avec la photo) si des poubelles ne sont pas vues
    "camera_targets": [],   # destinataires de l'alerte caméra (vide = ceux des rappels)
}

DEFAULT_BIN = {
    "name": "Poubelle",
    "color": "#607d8b",
    "style": "bac",
    "icon": "",
    "source": SRC_RULE,
    "calendar": "",
    "rule": {"type": RULE_WEEKLY, "weekdays": [0], "interval": 1, "anchor": "", "nth": 1, "weekday": 0},
    "months": [],           # mois actifs (vide = toute l'année), ex. déchets verts de mars à novembre
    "holidays": False,      # décaler au lendemain les jours fériés (France)
    "extra": [],            # dates ajoutées
    "skip": [],             # dates annulées
    "notify": True,
    "anim_eve": "pulse",
    "anim_today": "couvercle",
    "anim_out": "coche",
    "image": "",            # image personnalisée du bac (URL), à la place du dessin
}

ACTION_DONE = "HOLM_BINS_DONE"
EVENT_NOTIFY_ACTION = "mobile_app_notification_action"
EVENT_DUE = "holm_bins_a_sortir"
EVENT_CHECK = "holm_bins_verification"
SNAPSHOT = "www/holm_bins/derniere_verification.jpg"
SNAPSHOT_URL = "/local/holm_bins/derniere_verification.jpg"

STATIC_PATH = "/holm_bins_static"
CARD_NAME = "holm-bins-card.js"
CARD_URL = f"{STATIC_PATH}/{CARD_NAME}"

# textes des notifications, dans la langue de Home Assistant
NOTIF = {
    "fr": {"title": "🗑️ Poubelles à sortir", "eve": "Ce soir : {bins} (collecte demain, {date}).", "today": "Aujourd'hui : {bins} (collecte ce jour).",
           "reminder_title": "⏰ Rappel poubelles", "reminder": "Pas encore sortie : {bins}.", "done": "C'est fait ✓", "and": "et", "cam_title": "📷 Poubelles pas sorties", "cam_missing": "La caméra ne voit pas : {bins}. Pensez à les sortir !"},
    "en": {"title": "🗑️ Bins to put out", "eve": "Tonight: {bins} (collection tomorrow, {date}).", "today": "Today: {bins} (collection today).",
           "reminder_title": "⏰ Bin reminder", "reminder": "Not out yet: {bins}.", "done": "Done ✓", "and": "and", "cam_title": "📷 Bins not out", "cam_missing": "The camera cannot see: {bins}. Remember to put them out!"},
    "de": {"title": "🗑️ Mülltonnen rausstellen", "eve": "Heute Abend: {bins} (Abholung morgen, {date}).", "today": "Heute: {bins} (Abholung heute).",
           "reminder_title": "⏰ Mülltonnen-Erinnerung", "reminder": "Noch nicht draußen: {bins}.", "done": "Erledigt ✓", "and": "und", "cam_title": "📷 Tonnen nicht draußen", "cam_missing": "Die Kamera sieht nicht: {bins}. Bitte rausstellen!"},
    "es": {"title": "🗑️ Sacar los cubos", "eve": "Esta noche: {bins} (recogida mañana, {date}).", "today": "Hoy: {bins} (recogida hoy).",
           "reminder_title": "⏰ Recordatorio de cubos", "reminder": "Aún sin sacar: {bins}.", "done": "Hecho ✓", "and": "y", "cam_title": "📷 Cubos sin sacar", "cam_missing": "La cámara no ve: {bins}. ¡No olvide sacarlos!"},
    "it": {"title": "🗑️ Bidoni da portare fuori", "eve": "Stasera: {bins} (raccolta domani, {date}).", "today": "Oggi: {bins} (raccolta oggi).",
           "reminder_title": "⏰ Promemoria bidoni", "reminder": "Non ancora fuori: {bins}.", "done": "Fatto ✓", "and": "e", "cam_title": "📷 Bidoni non fuori", "cam_missing": "La telecamera non vede: {bins}. Ricordati di portarli fuori!"},
    "nl": {"title": "🗑️ Containers buitenzetten", "eve": "Vanavond: {bins} (ophaling morgen, {date}).", "today": "Vandaag: {bins} (ophaling vandaag).",
           "reminder_title": "⏰ Herinnering containers", "reminder": "Nog niet buiten: {bins}.", "done": "Gedaan ✓", "and": "en", "cam_title": "📷 Containers niet buiten", "cam_missing": "De camera ziet niet: {bins}. Vergeet ze niet buiten te zetten!"},
    "pt": {"title": "🗑️ Pôr o lixo na rua", "eve": "Esta noite: {bins} (recolha amanhã, {date}).", "today": "Hoje: {bins} (recolha hoje).",
           "reminder_title": "⏰ Lembrete do lixo", "reminder": "Ainda por pôr: {bins}.", "done": "Feito ✓", "and": "e", "cam_title": "📷 Lixo não posto na rua", "cam_missing": "A câmara não vê: {bins}. Não se esqueça de os pôr na rua!"},
    "pl": {"title": "🗑️ Wystaw kosze", "eve": "Dziś wieczorem: {bins} (odbiór jutro, {date}).", "today": "Dziś: {bins} (odbiór dzisiaj).",
           "reminder_title": "⏰ Przypomnienie o koszach", "reminder": "Jeszcze nie wystawione: {bins}.", "done": "Zrobione ✓", "and": "i", "cam_title": "📷 Kosze niewystawione", "cam_missing": "Kamera nie widzi: {bins}. Pamiętaj, aby je wystawić!"},
}
WEEKDAYS = {
    "fr": ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"],
    "en": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "de": ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
    "es": ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"],
    "it": ["lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"],
    "nl": ["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag", "zondag"],
    "pt": ["segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado", "domingo"],
    "pl": ["poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota", "niedziela"],
}
