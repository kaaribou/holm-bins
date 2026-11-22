/* HOLM Poubelles — carte des collectes — https://github.com/kaaribou/holm-bins — licence MIT
 * HOLM — Home Orchestration & Living Management */
(() => {
  const VERSION = "1.3.0";
  // ---- HOLM i18n : textes écrits en français, traduits à l'affichage (en, de, es, it, nl, pt, pl) ----
  const HOLM_LANGS = ["en", "de", "es", "it", "nl", "pt", "pl"];
  const LANG_NAMES = { fr: "Français", en: "English", de: "Deutsch", es: "Español", it: "Italiano", nl: "Nederlands", pt: "Português", pl: "Polski" };
  const LOCALES = { fr: "fr-FR", en: "en-GB", de: "de-DE", es: "es-ES", it: "it-IT", nl: "nl-NL", pt: "pt-PT", pl: "pl-PL" };
  const I18N = {
    "Ce soir : {bins} (collecte demain, {date}).": ["Tonight: {bins} (collection tomorrow, {date}).", "Heute Abend: {bins} (Abholung morgen, {date}).", "Esta noche: {bins} (recogida mañana, {date}).", "Stasera: {bins} (raccolta domani, {date}).", "Vanavond: {bins} (ophaling morgen, {date}).", "Esta noite: {bins} (recolha amanhã, {date}).", "Dziś wieczorem: {bins} (odbiór jutro, {date})."],
    "Aujourd'hui : {bins} (collecte ce jour).": ["Today: {bins} (collection today).", "Heute: {bins} (Abholung heute).", "Hoy: {bins} (recogida hoy).", "Oggi: {bins} (raccolta oggi).", "Vandaag: {bins} (ophaling vandaag).", "Hoje: {bins} (recolha hoje).", "Dziś: {bins} (odbiór dzisiaj)."],
    "Pas encore sortie : {bins}.": ["Not out yet: {bins}.", "Noch nicht draußen: {bins}.", "Aún sin sacar: {bins}.", "Non ancora fuori: {bins}.", "Nog niet buiten: {bins}.", "Ainda por pôr: {bins}.", "Jeszcze nie wystawione: {bins}."],
    "HOLM Poubelles n'est pas chargé : vérifiez l'intégration dans Paramètres → Appareils et services.": ["HOLM Bins is not loaded: check the integration in Settings → Devices & services.", "HOLM Mülltonnen ist nicht geladen: Integration unter Einstellungen → Geräte & Dienste prüfen.", "HOLM Cubos no está cargado: revise la integración en Ajustes → Dispositivos y servicios.", "HOLM Bidoni non è caricato: controlla l'integrazione in Impostazioni → Dispositivi e servizi.", "HOLM Containers is niet geladen: controleer de integratie in Instellingen → Apparaten & diensten.", "HOLM Lixo não está carregado: verifique a integração em Definições → Dispositivos e serviços.", "HOLM Kosze nie jest załadowane: sprawdź integrację w Ustawienia → Urządzenia i usługi."],
    "Cette carte n'affiche que certaines poubelles (option « Poubelles affichées »).": ["This card only shows some bins (\"Bins shown\" option).", "Diese Karte zeigt nur einige Tonnen (Option „Angezeigte Tonnen“).", "Esta tarjeta solo muestra algunos cubos (opción «Cubos mostrados»).", "Questa scheda mostra solo alcuni bidoni (opzione «Bidoni mostrati»).", "Deze kaart toont maar enkele containers (optie \"Getoonde containers\").", "Este cartão só mostra alguns caixotes (opção «Caixotes mostrados»).", "Ta karta pokazuje tylko niektóre kosze (opcja „Wyświetlane kosze”)."],
    "Voir toutes les poubelles": ["Show all bins", "Alle Tonnen zeigen", "Ver todos los cubos", "Mostra tutti i bidoni", "Alle containers tonen", "Ver todos os caixotes", "Pokaż wszystkie kosze"],
    "Seulement celles de cette carte": ["Only this card's bins", "Nur die dieser Karte", "Solo los de esta tarjeta", "Solo quelli di questa scheda", "Alleen die van deze kaart", "Só os deste cartão", "Tylko kosze tej karty"],
    "Pour l'afficher sur cette carte, ajoutez-la dans « Poubelles affichées » (éditeur de la carte).": ["To show it on this card, add it to \"Bins shown\" (card editor).", "Um sie auf dieser Karte zu zeigen, unter „Angezeigte Tonnen“ hinzufügen (Karteneditor).", "Para mostrarlo en esta tarjeta, añádalo en «Cubos mostrados» (editor de la tarjeta).", "Per mostrarlo su questa scheda, aggiungilo in «Bidoni mostrati» (editor della scheda).", "Voeg hem toe aan \"Getoonde containers\" (kaarteditor) om hem op deze kaart te zien.", "Para o mostrar neste cartão, adicione-o em «Caixotes mostrados» (editor do cartão).", "Aby był widoczny na tej karcie, dodaj go w „Wyświetlane kosze” (edytor karty)."],
    "Mot-clé dans le nom de l'événement (facultatif)": ["Keyword in the event name (optional)", "Stichwort im Terminnamen (optional)", "Palabra clave en el nombre del evento (opcional)", "Parola chiave nel nome dell'evento (facoltativa)", "Trefwoord in de naam van de afspraak (optioneel)", "Palavra-chave no nome do evento (opcional)", "Słowo kluczowe w nazwie wydarzenia (opcjonalnie)"],
    "Pour un calendrier commun à plusieurs poubelles : seuls les événements dont le nom contient ce mot comptent (plusieurs mots : séparés par des virgules).": ["For a calendar shared by several bins: only events whose name contains this word count (several words: comma-separated).", "Für einen Kalender mehrerer Tonnen: nur Termine, deren Name dieses Wort enthält, zählen (mehrere Wörter: durch Kommas getrennt).", "Para un calendario común a varios cubos: solo cuentan los eventos cuyo nombre contiene esta palabra (varias palabras: separadas por comas).", "Per un calendario comune a più bidoni: contano solo gli eventi il cui nome contiene questa parola (più parole: separate da virgole).", "Voor een kalender van meerdere containers: alleen afspraken met dit woord in de naam tellen (meerdere woorden: gescheiden door komma's).", "Para um calendário comum a vários caixotes: só contam os eventos cujo nome contém esta palavra (várias palavras: separadas por vírgulas).", "Dla kalendarza wspólnego dla kilku koszy: liczą się tylko wydarzenia, których nazwa zawiera to słowo (kilka słów: oddziel przecinkami)."],
    "Événements du calendrier :": ["Calendar events:", "Kalendertermine:", "Eventos del calendario:", "Eventi del calendario:", "Afspraken in de kalender:", "Eventos do calendário:", "Wydarzenia w kalendarzu:"],
    "Calendrier {c} · « {k} »": ["Calendar {c} · \"{k}\"", "Kalender {c} · „{k}“", "Calendario {c} · «{k}»", "Calendario {c} · «{k}»", "Kalender {c} · \"{k}\"", "Calendário {c} · «{k}»", "Kalendarz {c} · „{k}”"],
    "Titres et textes des notifications (facultatif)": ["Notification titles and texts (optional)", "Titel und Texte der Benachrichtigungen (optional)", "Títulos y textos de las notificaciones (opcional)", "Titoli e testi delle notifiche (facoltativi)", "Titels en teksten van de meldingen (optioneel)", "Títulos e textos das notificações (opcional)", "Tytuły i teksty powiadomień (opcjonalnie)"],
    "Vide = titre ou texte par défaut. Variables : {{ poubelles }} et {{ date }}. Les modèles Home Assistant fonctionnent aussi, par exemple {{ states('input_text.message_poubelles') }}.": ["Empty = default title or text. Variables: {{ poubelles }} and {{ date }}. Home Assistant templates work too, for example {{ states('input_text.message_poubelles') }}.", "Leer = Standardtitel bzw. -text. Variablen: {{ poubelles }} und {{ date }}. Home-Assistant-Vorlagen gehen auch, z. B. {{ states('input_text.message_poubelles') }}.", "Vacío = título o texto por defecto. Variables: {{ poubelles }} y {{ date }}. También funcionan las plantillas de Home Assistant, por ejemplo {{ states('input_text.message_poubelles') }}.", "Vuoto = titolo o testo predefinito. Variabili: {{ poubelles }} e {{ date }}. Funzionano anche i modelli di Home Assistant, ad esempio {{ states('input_text.message_poubelles') }}.", "Leeg = standaardtitel of -tekst. Variabelen: {{ poubelles }} en {{ date }}. Home Assistant-sjablonen werken ook, bijvoorbeeld {{ states('input_text.message_poubelles') }}.", "Vazio = título ou texto predefinido. Variáveis: {{ poubelles }} e {{ date }}. Os modelos do Home Assistant também funcionam, por exemplo {{ states('input_text.message_poubelles') }}.", "Puste = domyślny tytuł lub tekst. Zmienne: {{ poubelles }} i {{ date }}. Działają też szablony Home Assistant, np. {{ states('input_text.message_poubelles') }}."],
    "Titre — la veille et le matin": ["Title — day before and morning", "Titel — Vortag und Morgen", "Título — víspera y mañana", "Titolo — giorno prima e mattina", "Titel — dag ervoor en ochtend", "Título — véspera e manhã", "Tytuł — dzień wcześniej i rano"],
    "Titre — relance": ["Title — follow-up", "Titel — Erinnerung", "Título — recordatorio", "Titolo — sollecito", "Titel — herinnering", "Título — lembrete", "Tytuł — ponowne przypomnienie"],
    "🗑️ Poubelles à sortir": ["🗑️ Bins to put out", "🗑️ Mülltonnen rausstellen", "🗑️ Sacar los cubos", "🗑️ Bidoni da portare fuori", "🗑️ Containers buitenzetten", "🗑️ Pôr o lixo na rua", "🗑️ Wystaw kosze"],
    "⏰ Rappel poubelles": ["⏰ Bin reminder", "⏰ Mülltonnen-Erinnerung", "⏰ Recordatorio de cubos", "⏰ Promemoria bidoni", "⏰ Herinnering containers", "⏰ Lembrete do lixo", "⏰ Przypomnienie o koszach"],
    "Arrondi des bords (ex. 16px ; vide = celui du thème)": ["Corner radius (e.g. 16px; empty = the theme's)", "Eckenradius (z. B. 16px; leer = der des Themes)", "Radio de las esquinas (p. ej. 16px; vacío = el del tema)", "Arrotondamento degli angoli (es. 16px; vuoto = quello del tema)", "Hoekafronding (bijv. 16px; leeg = die van het thema)", "Arredondamento dos cantos (ex. 16px; vazio = o do tema)", "Zaokrąglenie rogów (np. 16px; puste = z motywu)"],
    "Espacement": ["Spacing", "Abstände", "Espaciado", "Spaziatura", "Ruimte", "Espaçamento", "Odstępy"],
    "Normal": ["Normal", "Normal", "Normal", "Normale", "Normaal", "Normal", "Normalne"],
    "Réduit (gain de place)": ["Reduced (saves space)", "Reduziert (platzsparend)", "Reducido (ahorra espacio)", "Ridotta (risparmia spazio)", "Verkleind (bespaart ruimte)", "Reduzido (poupa espaço)", "Zmniejszone (oszczędza miejsce)"],
    "Textes des notifications (facultatif)": ["Notification texts (optional)", "Benachrichtigungstexte (optional)", "Textos de las notificaciones (opcional)", "Testi delle notifiche (facoltativi)", "Teksten van de meldingen (optioneel)", "Textos das notificações (opcional)", "Teksty powiadomień (opcjonalnie)"],
    "Vide = texte par défaut. Variables : {{ poubelles }} et {{ date }}. Les modèles Home Assistant fonctionnent aussi, par exemple {{ states('input_text.message_poubelles') }}.": ["Empty = default text. Variables: {{ poubelles }} (bins) and {{ date }}. Home Assistant templates work too, e.g. {{ states('input_text.bins_message') }}.", "Leer = Standardtext. Variablen: {{ poubelles }} (Tonnen) und {{ date }}. Home-Assistant-Vorlagen gehen auch, z. B. {{ states('input_text.muell_text') }}.", "Vacío = texto por defecto. Variables: {{ poubelles }} (cubos) y {{ date }}. También funcionan las plantillas de Home Assistant, p. ej. {{ states('input_text.mensaje_cubos') }}.", "Vuoto = testo predefinito. Variabili: {{ poubelles }} (bidoni) e {{ date }}. Funzionano anche i modelli di Home Assistant, es. {{ states('input_text.messaggio_bidoni') }}.", "Leeg = standaardtekst. Variabelen: {{ poubelles }} (containers) en {{ date }}. Home Assistant-sjablonen werken ook, bv. {{ states('input_text.bericht_containers') }}.", "Vazio = texto predefinido. Variáveis: {{ poubelles }} (caixotes) e {{ date }}. Os modelos do Home Assistant também funcionam, p. ex. {{ states('input_text.mensagem_lixo') }}.", "Puste = tekst domyślny. Zmienne: {{ poubelles }} (kosze) i {{ date }}. Działają też szablony Home Assistant, np. {{ states('input_text.wiadomosc_kosze') }}."],
    "La veille": ["The day before", "Am Vortag", "La víspera", "Il giorno prima", "De dag ervoor", "Na véspera", "Dzień wcześniej"],
    "Le matin de la collecte": ["Collection morning", "Am Morgen der Abholung", "La mañana de la recogida", "La mattina della raccolta", "De ochtend van de ophaling", "Na manhã da recolha", "Rano w dniu odbioru"],
    "Relance": ["Follow-up", "Erinnerung", "Recordatorio", "Sollecito", "Herinnering", "Lembrete", "Ponowne przypomnienie"],
    "Fond de la carte (couleur ou variable de thème)": ["Card background (colour or theme variable)", "Kartenhintergrund (Farbe oder Theme-Variable)", "Fondo de la tarjeta (color o variable del tema)", "Sfondo della scheda (colore o variabile del tema)", "Achtergrond van de kaart (kleur of themavariabele)", "Fundo do cartão (cor ou variável do tema)", "Tło karty (kolor lub zmienna motywu)"],
    "1er": ["1st", "1.", "1.er", "1°", "1e", "1.º", "1."],
    "2e": ["2nd", "2.", "2.º", "2°", "2e", "2.º", "2."],
    "3e": ["3rd", "3.", "3.er", "3°", "3e", "3.º", "3."],
    "4e": ["4th", "4.", "4.º", "4°", "4e", "4.º", "4."],
    "Afficher la date": ["Show the date", "Datum anzeigen", "Mostrar la fecha", "Mostra la data", "Datum tonen", "Mostrar a data", "Pokaż datę"],
    "Ajouter": ["Add", "Hinzufügen", "Añadir", "Aggiungi", "Toevoegen", "Adicionar", "Dodaj"],
    "Ajouter une poubelle": ["Add a bin", "Tonne hinzufügen", "Añadir un cubo", "Aggiungi un bidone", "Container toevoegen", "Adicionar um contentor", "Dodaj kosz"],
    "Ajoutez au moins une date pour « {n} ».": ["Add at least one date for \"{n}\".", "Mindestens ein Datum für „{n}“ hinzufügen.", "Añada al menos una fecha para «{n}».", "Aggiungi almeno una data per «{n}».", "Voeg minstens één datum toe voor \"{n}\".", "Adicione pelo menos uma data para «{n}».", "Dodaj co najmniej jedną datę dla „{n}”."],
    "Alerte envoyée à (aucun = les destinataires des rappels)": ["Alert sent to (none = reminder recipients)", "Warnung senden an (keine = Empfänger der Erinnerungen)", "Alerta enviada a (ninguno = destinatarios de los recordatorios)", "Avviso inviato a (nessuno = destinatari dei promemoria)", "Waarschuwing naar (geen = ontvangers van de herinneringen)", "Alerta enviado para (nenhum = destinatários dos lembretes)", "Alert wysyłany do (brak = odbiorcy przypomnień)"],
    "Alerter avec la photo si des poubelles ne sont pas vues": ["Alert with the photo if bins are not seen", "Mit Foto warnen, wenn Tonnen nicht zu sehen sind", "Alertar con la foto si no se ven cubos", "Avvisa con la foto se i bidoni non sono visibili", "Waarschuwen met de foto als containers niet gezien worden", "Alertar com a foto se os contentores não forem vistos", "Wyślij alert ze zdjęciem, jeśli kosze nie są widoczne"],
    "Ambiances HOLM FX": ["HOLM FX ambiences", "HOLM-FX-Ambiente", "Ambientes HOLM FX", "Ambientazioni HOLM FX", "HOLM FX-sferen", "Ambientes HOLM FX", "Efekty HOLM FX"],
    "Animation la veille (J-1)": ["Animation the day before", "Animation am Vortag", "Animación la víspera", "Animazione il giorno prima", "Animatie de dag ervoor", "Animação na véspera", "Animacja dzień wcześniej"],
    "Animation le jour de collecte": ["Animation on collection day", "Animation am Abholtag", "Animación el día de recogida", "Animazione il giorno di raccolta", "Animatie op ophaaldag", "Animação no dia da recolha", "Animacja w dniu odbioru"],
    "Animation une fois sortie": ["Animation once put out", "Animation nach dem Rausstellen", "Animación una vez sacado", "Animazione una volta fuori", "Animatie zodra buiten", "Animação depois de posto na rua", "Animacja po wystawieniu"],
    "Animations intégrées": ["Built-in animations", "Integrierte Animationen", "Animaciones integradas", "Animazioni integrate", "Ingebouwde animaties", "Animações integradas", "Wbudowane animacje"],
    "Annuler": ["Cancel", "Abbrechen", "Cancelar", "Annulla", "Annuleren", "Cancelar", "Anuluj"],
    "Appui sur une poubelle": ["Tapping a bin", "Tippen auf eine Tonne", "Al pulsar un cubo", "Tocco su un bidone", "Tikken op een container", "Toque num contentor", "Dotknięcie kosza"],
    "Aucun destinataire valide : cochez au moins un appareil.": ["No valid recipient: tick at least one device.", "Kein gültiger Empfänger: mindestens ein Gerät auswählen.", "Ningún destinatario válido: marque al menos un dispositivo.", "Nessun destinatario valido: seleziona almeno un dispositivo.", "Geen geldige ontvanger: vink minstens één apparaat aan.", "Nenhum destinatário válido: marque pelo menos um dispositivo.", "Brak odbiorcy: zaznacz co najmniej jedno urządzenie."],
    "Aucun service de notification": ["No notification service", "Kein Benachrichtigungsdienst", "Ningún servicio de notificación", "Nessun servizio di notifica", "Geen meldingsdienst", "Nenhum serviço de notificação", "Brak usługi powiadomień"],
    "Aucune": ["None", "Keine", "Ninguna", "Nessuna", "Geen", "Nenhuma", "Brak"],
    "Aucune (vérification désactivée)": ["None (check turned off)", "Keine (Prüfung aus)", "Ninguna (comprobación desactivada)", "Nessuna (controllo disattivato)", "Geen (controle uit)", "Nenhuma (verificação desativada)", "Brak (sprawdzanie wyłączone)"],
    "Aucune action": ["No action", "Keine Aktion", "Ninguna acción", "Nessuna azione", "Geen actie", "Nenhuma ação", "Brak akcji"],
    "Aucune collecte dans la période choisie.": ["No collection in the chosen period.", "Keine Abholung im gewählten Zeitraum.", "Ninguna recogida en el periodo elegido.", "Nessuna raccolta nel periodo scelto.", "Geen ophaling in de gekozen periode.", "Nenhuma recolha no período escolhido.", "Brak odbioru w wybranym okresie."],
    "Aucune collecte prévue": ["No collection scheduled", "Keine Abholung geplant", "Ninguna recogida prevista", "Nessuna raccolta prevista", "Geen ophaling gepland", "Nenhuma recolha prevista", "Brak zaplanowanego odbioru"],
    "Aucune poubelle : installez l'intégration HOLM Poubelles, puis ajoutez vos poubelles avec la roue crantée.": ["No bins: install the HOLM Bins integration, then add your bins with the gear icon.", "Keine Tonnen: Integration HOLM Mülltonnen installieren und Tonnen über das Zahnrad hinzufügen.", "Ningún cubo: instale la integración HOLM Cubos y añada sus cubos con la rueda dentada.", "Nessun bidone: installa l'integrazione HOLM Bidoni, poi aggiungi i bidoni con l'ingranaggio.", "Geen containers: installeer de integratie HOLM Containers en voeg ze toe via het tandwiel.", "Nenhum contentor: instale a integração HOLM Contentores e adicione-os com a roda dentada.", "Brak koszy: zainstaluj integrację HOLM Kosze, a potem dodaj kosze ikoną koła zębatego."],
    "Aujourd'hui": ["Today", "Heute", "Hoy", "Oggi", "Vandaag", "Hoje", "Dziś"],
    "Automatique (profil)": ["Automatic (profile)", "Automatisch (Profil)", "Automático (perfil)", "Automatica (profilo)", "Automatisch (profiel)", "Automático (perfil)", "Automatycznie (profil)"],
    "Bac biodéchets": ["Food / garden waste bin", "Biotonne", "Cubo orgánico", "Bidone organico", "GFT-container", "Contentor de orgânicos", "Kosz na bioodpady"],
    "Bac de tri (recyclage)": ["Recycling bin", "Wertstofftonne", "Cubo de reciclaje", "Bidone della differenziata", "PMD-container", "Contentor de reciclagem", "Kosz do segregacji"],
    "Bac papier / carton": ["Paper / cardboard bin", "Papiertonne", "Cubo de papel / cartón", "Bidone carta / cartone", "Papiercontainer", "Contentor de papel / cartão", "Kosz na papier"],
    "Bac roulant": ["Wheelie bin", "Rolltonne", "Cubo con ruedas", "Bidone carrellato", "Rolcontainer", "Contentor com rodas", "Pojemnik na kółkach"],
    "Barre d'approche de la collecte": ["Collection approach bar", "Balken bis zur Abholung", "Barra de cercanía de la recogida", "Barra di avvicinamento alla raccolta", "Balk tot de ophaling", "Barra de aproximação da recolha", "Pasek zbliżania się odbioru"],
    "Bouton Réglages (administrateurs)": ["Settings button (administrators)", "Einstellungs-Taste (Administratoren)", "Botón Ajustes (administradores)", "Pulsante Impostazioni (amministratori)", "Knop Instellingen (beheerders)", "Botão Definições (administradores)", "Przycisk Ustawienia (administratorzy)"],
    "Calendrier": ["Calendar", "Kalender", "Calendario", "Calendario", "Kalender", "Calendário", "Kalendarz"],
    "Calendrier {c}": ["Calendar {c}", "Kalender {c}", "Calendario {c}", "Calendario {c}", "Kalender {c}", "Calendário {c}", "Kalendarz {c}"],
    "Camion qui passe": ["Passing truck", "Vorbeifahrender Müllwagen", "Camión que pasa", "Camion che passa", "Voorbijrijdende vrachtwagen", "Camião a passar", "Przejeżdżająca śmieciarka"],
    "Caméra": ["Camera", "Kamera", "Cámara", "Telecamera", "Camera", "Câmara", "Kamera"],
    "Celle par défaut de Home Assistant": ["Home Assistant's default one", "Standard von Home Assistant", "La predeterminada de Home Assistant", "Quella predefinita di Home Assistant", "Standaard van Home Assistant", "A predefinida do Home Assistant", "Domyślne z Home Assistant"],
    "Chaque poubelle doit avoir un nom.": ["Each bin needs a name.", "Jede Tonne braucht einen Namen.", "Cada cubo necesita un nombre.", "Ogni bidone deve avere un nome.", "Elke container heeft een naam nodig.", "Cada contentor precisa de um nome.", "Każdy kosz musi mieć nazwę."],
    "Chaque semaine": ["Every week", "Jede Woche", "Cada semana", "Ogni settimana", "Elke week", "Todas as semanas", "Co tydzień"],
    "Chaque semaine, le {d}": ["Every week, on {d}", "Jede Woche, {d}", "Cada semana, el {d}", "Ogni settimana, il {d}", "Elke week, op {d}", "Todas as semanas, à {d}", "Co tydzień, {d}"],
    "Chargement…": ["Loading…", "Wird geladen…", "Cargando…", "Caricamento…", "Laden…", "A carregar…", "Ładowanie…"],
    "Choisissez le calendrier de « {n} ».": ["Choose the calendar for \"{n}\".", "Kalender für „{n}“ wählen.", "Elija el calendario de «{n}».", "Scegli il calendario di «{n}».", "Kies de kalender van \"{n}\".", "Escolha o calendário de «{n}».", "Wybierz kalendarz dla „{n}”."],
    "Coche de réussite": ["Success tick", "Erfolgs-Häkchen", "Marca de éxito", "Spunta di successo", "Vinkje", "Visto de sucesso", "Znacznik sukcesu"],
    "Compacte (pastilles)": ["Compact (pills)", "Kompakt (Pillen)", "Compacta (píldoras)", "Compatta (pillole)", "Compact (pillen)", "Compacta (pastilhas)", "Kompaktowy (pigułki)"],
    "Confirmer la suppression": ["Confirm deletion", "Löschen bestätigen", "Confirmar la eliminación", "Conferma l'eliminazione", "Verwijderen bevestigen", "Confirmar a eliminação", "Potwierdź usunięcie"],
    "Conteneur à verre": ["Glass bank", "Glascontainer", "Contenedor de vidrio", "Campana del vetro", "Glasbak", "Vidrão", "Pojemnik na szkło"],
    "Contour clignotant": ["Blinking outline", "Blinkender Rahmen", "Contorno parpadeante", "Contorno lampeggiante", "Knipperende rand", "Contorno a piscar", "Migający obrys"],
    "Couleur": ["Colour", "Farbe", "Color", "Colore", "Kleur", "Cor", "Kolor"],
    "Couvercle qui s'ouvre": ["Lid opening", "Öffnender Deckel", "Tapa que se abre", "Coperchio che si apre", "Deksel dat opengaat", "Tampa a abrir", "Otwierająca się klapa"],
    "Dans {n} jours": ["In {n} days", "In {n} Tagen", "En {n} días", "Tra {n} giorni", "Over {n} dagen", "Daqui a {n} dias", "Za {n} dni"],
    "Dates ajoutées": ["Added dates", "Zusätzliche Termine", "Fechas añadidas", "Date aggiunte", "Toegevoegde data", "Datas adicionadas", "Dodane daty"],
    "Dates annulées": ["Cancelled dates", "Ausfallende Termine", "Fechas anuladas", "Date annullate", "Geannuleerde data", "Datas canceladas", "Odwołane daty"],
    "Dates de collecte": ["Collection dates", "Abholtermine", "Fechas de recogida", "Date di raccolta", "Ophaaldata", "Datas de recolha", "Terminy odbioru"],
    "Dates à la main": ["Manual dates", "Manuelle Termine", "Fechas manuales", "Date manuali", "Handmatige data", "Datas manuais", "Daty ręczne"],
    "Demain": ["Tomorrow", "Morgen", "Mañana", "Domani", "Morgen", "Amanhã", "Jutro"],
    "Dernière vérification": ["Last check", "Letzte Prüfung", "Última comprobación", "Ultimo controllo", "Laatste controle", "Última verificação", "Ostatnie sprawdzenie"],
    "Descendre": ["Move down", "Nach unten", "Bajar", "Sposta giù", "Omlaag", "Mover para baixo", "W dół"],
    "Dessin HOLM": ["HOLM drawing", "HOLM-Zeichnung", "Dibujo HOLM", "Disegno HOLM", "HOLM-tekening", "Desenho HOLM", "Rysunek HOLM"],
    "Disposition": ["Layout", "Anordnung", "Disposición", "Disposizione", "Indeling", "Disposição", "Układ"],
    "Décaler au lendemain les jours fériés": ["Move public holidays to the next day", "Feiertage auf den nächsten Tag verschieben", "Pasar los festivos al día siguiente", "Spostare i festivi al giorno dopo", "Feestdagen naar de volgende dag verschuiven", "Passar os feriados para o dia seguinte", "Przesuwać święta na następny dzień"],
    "En liste": ["As a list", "Als Liste", "En lista", "In elenco", "Als lijst", "Em lista", "Jako lista"],
    "En rangée": ["In a row", "In einer Reihe", "En fila", "In fila", "Op een rij", "Em linha", "W rzędzie"],
    "Enregistrement impossible : {e}": ["Cannot save: {e}", "Speichern nicht möglich: {e}", "No se puede guardar: {e}", "Impossibile salvare: {e}", "Opslaan mislukt: {e}", "Não foi possível guardar: {e}", "Nie można zapisać: {e}"],
    "Enregistrement…": ["Saving…", "Wird gespeichert…", "Guardando…", "Salvataggio…", "Opslaan…", "A guardar…", "Zapisywanie…"],
    "Enregistrer": ["Save", "Speichern", "Guardar", "Salva", "Opslaan", "Guardar", "Zapisz"],
    "Enregistrez d'abord la poubelle pour voir l'animation sur la carte.": ["Save the bin first to see the animation on the card.", "Tonne zuerst speichern, um die Animation auf der Karte zu sehen.", "Guarde primero el cubo para ver la animación en la tarjeta.", "Salva prima il bidone per vedere l'animazione sulla scheda.", "Sla de container eerst op om de animatie op de kaart te zien.", "Guarde primeiro o contentor para ver a animação no cartão.", "Najpierw zapisz kosz, aby zobaczyć animację na karcie."],
    "Envoi impossible : {e}": ["Cannot send: {e}", "Senden nicht möglich: {e}", "No se puede enviar: {e}", "Impossibile inviare: {e}", "Verzenden mislukt: {e}", "Não foi possível enviar: {e}", "Nie można wysłać: {e}"],
    "Envoi…": ["Uploading…", "Wird hochgeladen…", "Enviando…", "Invio…", "Uploaden…", "A enviar…", "Wysyłanie…"],
    "Envoyer une notification de test": ["Send a test notification", "Testbenachrichtigung senden", "Enviar una notificación de prueba", "Invia una notifica di prova", "Testmelding sturen", "Enviar uma notificação de teste", "Wyślij powiadomienie testowe"],
    "Envoyer à": ["Send to", "Senden an", "Enviar a", "Invia a", "Sturen naar", "Enviar para", "Wyślij do"],
    "Fréquence": ["Frequency", "Häufigkeit", "Frecuencia", "Frequenza", "Frequentie", "Frequência", "Częstotliwość"],
    "HOLM Poubelles": ["HOLM Bins", "HOLM Mülltonnen", "HOLM Cubos", "HOLM Bidoni", "HOLM Containers", "HOLM Contentores", "HOLM Kosze"],
    "Halo lumineux": ["Glowing halo", "Leuchtender Schein", "Halo luminoso", "Alone luminoso", "Lichtende halo", "Halo luminoso", "Świetlna aureola"],
    "Heure de la vérification (la veille)": ["Check time (the day before)", "Prüfzeit (am Vortag)", "Hora de la comprobación (la víspera)", "Ora del controllo (il giorno prima)", "Tijd van de controle (dag ervoor)", "Hora da verificação (na véspera)", "Godzina sprawdzenia (dzień wcześniej)"],
    "Image du bac": ["Bin image", "Tonnenbild", "Imagen del cubo", "Immagine del bidone", "Afbeelding van de container", "Imagem do contentor", "Obraz kosza"],
    "Image personnalisée": ["Custom image", "Eigenes Bild", "Imagen personalizada", "Immagine personalizzata", "Eigen afbeelding", "Imagem personalizada", "Własny obraz"],
    "Indiquez une date de collecte connue pour « {n} ».": ["Enter a known collection date for \"{n}\".", "Ein bekanntes Abholdatum für „{n}“ angeben.", "Indique una fecha de recogida conocida para «{n}».", "Indica una data di raccolta nota per «{n}».", "Geef een bekende ophaaldatum op voor \"{n}\".", "Indique uma data de recolha conhecida para «{n}».", "Podaj znaną datę odbioru dla „{n}”."],
    "Installez la carte HOLM FX pour choisir aussi parmi ses ambiances animées.": ["Install the HOLM FX card to also choose from its animated ambiences.", "Installieren Sie die HOLM-FX-Karte, um auch aus ihren Animationen zu wählen.", "Instale la tarjeta HOLM FX para elegir también entre sus ambientes animados.", "Installa la scheda HOLM FX per scegliere anche tra le sue ambientazioni animate.", "Installeer de HOLM FX-kaart om ook uit haar animaties te kiezen.", "Instale o cartão HOLM FX para escolher também entre os seus ambientes animados.", "Zainstaluj kartę HOLM FX, aby wybierać także z jej animowanych efektów."],
    "Intégration HOLM Poubelles introuvable : {e}": ["HOLM Bins integration not found: {e}", "Integration HOLM Mülltonnen nicht gefunden: {e}", "Integración HOLM Cubos no encontrada: {e}", "Integrazione HOLM Bidoni non trovata: {e}", "Integratie HOLM Containers niet gevonden: {e}", "Integração HOLM Contentores não encontrada: {e}", "Nie znaleziono integracji HOLM Kosze: {e}"],
    "Jour": ["Day", "Tag", "Día", "Giorno", "Dag", "Dia", "Dzień"],
    "Jour(s)": ["Day(s)", "Tag(e)", "Día(s)", "Giorno/i", "Dag(en)", "Dia(s)", "Dzień/dni"],
    "La veille de la collecte, à l'heure choisie, la caméra prend une photo et une tâche IA de Home Assistant regarde quelles poubelles sont sorties : celles qu'elle voit sont marquées sorties (plus de relance), pour les autres une alerte part avec la photo.": ["The day before the collection, at the chosen time, the camera takes a picture and a Home Assistant AI task looks at which bins are out: those it sees are marked out (no more follow-ups); for the others an alert is sent with the photo.", "Am Vortag der Abholung macht die Kamera zur gewählten Zeit ein Foto, und eine KI-Aufgabe von Home Assistant prüft, welche Tonnen draußen sind: gesehene werden als rausgestellt markiert (keine Erinnerung mehr), für die anderen kommt eine Warnung mit Foto.", "La víspera de la recogida, a la hora elegida, la cámara toma una foto y una tarea de IA de Home Assistant mira qué cubos están fuera: los que ve se marcan como sacados (sin más recordatorios); para los demás se envía una alerta con la foto.", "Il giorno prima della raccolta, all'ora scelta, la telecamera scatta una foto e un compito IA di Home Assistant controlla quali bidoni sono fuori: quelli visti sono segnati come fuori (niente più solleciti); per gli altri parte un avviso con la foto.", "De dag voor de ophaling maakt de camera op het gekozen tijdstip een foto en kijkt een AI-taak van Home Assistant welke containers buiten staan: geziene worden als buiten gemarkeerd (geen herinneringen meer), voor de andere gaat een waarschuwing met de foto.", "Na véspera da recolha, à hora escolhida, a câmara tira uma foto e uma tarefa de IA do Home Assistant vê que contentores estão na rua: os vistos ficam marcados (sem mais lembretes); para os outros é enviado um alerta com a foto.", "Dzień przed odbiorem, o wybranej godzinie, kamera robi zdjęcie, a zadanie AI Home Assistant sprawdza, które kosze są wystawione: widoczne są oznaczane jako wystawione (bez kolejnych przypomnień), dla pozostałych wysyłany jest alert ze zdjęciem."],
    "Langue": ["Language", "Sprache", "Idioma", "Lingua", "Taal", "Idioma", "Język"],
    "Le": ["The", "Am", "El", "Il", "De", "O", "W"],
    "Le jour de collecte, passer à la suivante à": ["On collection day, move to the next one at", "Am Abholtag zur nächsten wechseln um", "El día de recogida, pasar a la siguiente a las", "Il giorno di raccolta, passare alla successiva alle", "Op ophaaldag overgaan naar de volgende om", "No dia da recolha, passar à seguinte às", "W dniu odbioru przejdź do następnego o"],
    "Le test enregistre les réglages, prend une photo et interroge l'IA, sans marquer de poubelle ni envoyer d'alerte.": ["The test saves the settings, takes a picture and asks the AI, without marking any bin or sending an alert.", "Der Test speichert die Einstellungen, macht ein Foto und fragt die KI, ohne Tonnen zu markieren oder Warnungen zu senden.", "La prueba guarda los ajustes, toma una foto y consulta a la IA, sin marcar cubos ni enviar alertas.", "Il test salva le impostazioni, scatta una foto e interroga l'IA, senza segnare bidoni né inviare avvisi.", "De test slaat de instellingen op, maakt een foto en vraagt de AI, zonder containers te markeren of waarschuwingen te sturen.", "O teste guarda as definições, tira uma foto e consulta a IA, sem marcar contentores nem enviar alertas.", "Test zapisuje ustawienia, robi zdjęcie i pyta AI, bez oznaczania koszy i wysyłania alertów."],
    "Le {n} {d} du mois": ["The {n} {d} of the month", "Am {n} {d} des Monats", "El {n} {d} del mes", "Il {n} {d} del mese", "De {n} {d} van de maand", "A {n} {d} do mês", "{n} {d} miesiąca"],
    "Les rappels partent pour les poubelles dont la notification est activée. Le bouton « C'est fait » de la notification marque les poubelles comme sorties.": ["Reminders are sent for bins with notifications turned on. The notification's \"Done\" button marks the bins as put out.", "Erinnerungen gehen für Tonnen mit aktivierter Benachrichtigung raus. Die Taste „Erledigt“ markiert die Tonnen als rausgestellt.", "Los recordatorios se envían para los cubos con la notificación activada. El botón «Hecho» marca los cubos como sacados.", "I promemoria partono per i bidoni con la notifica attivata. Il pulsante «Fatto» segna i bidoni come portati fuori.", "Herinneringen gaan uit voor containers met meldingen aan. De knop \"Gedaan\" markeert de containers als buitengezet.", "Os lembretes são enviados para os contentores com notificação ativa. O botão «Feito» marca-os como postos na rua.", "Przypomnienia wysyłane są dla koszy z włączonym powiadomieniem. Przycisk „Zrobione” oznacza kosze jako wystawione."],
    "Marquer sortie (veille, jour J), sinon détails": ["Mark as put out (day before, collection day), otherwise details", "Als rausgestellt markieren (Vortag, Abholtag), sonst Details", "Marcar como sacado (víspera, día de recogida), si no detalles", "Segna come fuori (giorno prima, giorno di raccolta), altrimenti dettagli", "Markeren als buiten (dag ervoor, ophaaldag), anders details", "Marcar como na rua (véspera, dia da recolha), senão detalhes", "Oznacz jako wystawiony (dzień przed, dzień odbioru), w innym razie szczegóły"],
    "Masquer les collectes au-delà de (0 = jamais)": ["Hide collections beyond (0 = never)", "Abholungen ausblenden nach (0 = nie)", "Ocultar recogidas más allá de (0 = nunca)", "Nascondi raccolte oltre (0 = mai)", "Ophalingen verbergen na (0 = nooit)", "Ocultar recolhas além de (0 = nunca)", "Ukryj odbiory po (0 = nigdy)"],
    "Mois de collecte (aucun = toute l'année)": ["Collection months (none = all year)", "Abholmonate (keine = ganzjährig)", "Meses de recogida (ninguno = todo el año)", "Mesi di raccolta (nessuno = tutto l'anno)", "Ophaalmaanden (geen = heel het jaar)", "Meses de recolha (nenhum = todo o ano)", "Miesiące odbioru (brak = cały rok)"],
    "Monter": ["Move up", "Nach oben", "Subir", "Sposta su", "Omhoog", "Mover para cima", "W górę"],
    "Nom": ["Name", "Name", "Nombre", "Nome", "Naam", "Nome", "Nazwa"],
    "Notification de rappel": ["Reminder notification", "Erinnerungsbenachrichtigung", "Notificación de recordatorio", "Notifica di promemoria", "Herinneringsmelding", "Notificação de lembrete", "Powiadomienie przypominające"],
    "Notification envoyée à {n} appareil(s).": ["Notification sent to {n} device(s).", "Benachrichtigung an {n} Gerät(e) gesendet.", "Notificación enviada a {n} dispositivo(s).", "Notifica inviata a {n} dispositivo/i.", "Melding verstuurd naar {n} apparaat/apparaten.", "Notificação enviada para {n} dispositivo(s).", "Powiadomienie wysłane do {n} urządzeń."],
    "Ordre": ["Order", "Reihenfolge", "Orden", "Ordine", "Volgorde", "Ordem", "Kolejność"],
    "Ordre des réglages": ["Settings order", "Reihenfolge der Einstellungen", "Orden de los ajustes", "Ordine delle impostazioni", "Volgorde van de instellingen", "Ordem das definições", "Kolejność z ustawień"],
    "PNG ou SVG au fond transparent conseillé. Une adresse /local/… (dossier www) ou https://… fonctionne aussi.": ["PNG or SVG with a transparent background recommended. A /local/… (www folder) or https://… address works too.", "PNG oder SVG mit transparentem Hintergrund empfohlen. Eine Adresse /local/… (Ordner www) oder https://… geht auch.", "Se recomienda PNG o SVG con fondo transparente. También sirve una dirección /local/… (carpeta www) o https://….", "Consigliato PNG o SVG con sfondo trasparente. Funziona anche un indirizzo /local/… (cartella www) o https://….", "PNG of SVG met transparante achtergrond aanbevolen. Een adres /local/… (map www) of https://… werkt ook.", "Recomenda-se PNG ou SVG com fundo transparente. Um endereço /local/… (pasta www) ou https://… também funciona.", "Zalecany PNG lub SVG z przezroczystym tłem. Działa też adres /local/… (folder www) lub https://…."],
    "Pas vues": ["Not seen", "Nicht gesehen", "No vistos", "Non visti", "Niet gezien", "Não vistos", "Niewidoczne"],
    "Poubelle {n}": ["Bin {n}", "Tonne {n}", "Cubo {n}", "Bidone {n}", "Container {n}", "Contentor {n}", "Kosz {n}"],
    "Poubelles": ["Bins", "Tonnen", "Cubos", "Bidoni", "Containers", "Contentores", "Kosze"],
    "Poubelles affichées (aucune = toutes)": ["Bins shown (none = all)", "Angezeigte Tonnen (keine = alle)", "Cubos mostrados (ninguno = todos)", "Bidoni mostrati (nessuno = tutti)", "Getoonde containers (geen = alle)", "Contentores mostrados (nenhum = todos)", "Wyświetlane kosze (brak = wszystkie)"],
    "Prochaine collecte d'abord": ["Next collection first", "Nächste Abholung zuerst", "Próxima recogida primero", "Prossima raccolta prima", "Volgende ophaling eerst", "Próxima recolha primeiro", "Najbliższy odbiór najpierw"],
    "Prochaines collectes :": ["Next collections:", "Nächste Abholungen:", "Próximas recogidas:", "Prossime raccolte:", "Volgende ophalingen:", "Próximas recolhas:", "Najbliższe odbiory:"],
    "Prochaines collectes, rappels « à sortir » et animations par poubelle, avec réglage des dates depuis la carte.": ["Next collections, \"put out\" reminders and per-bin animations, with dates set from the card.", "Nächste Abholungen, Rausstell-Erinnerungen und Animationen je Tonne, Termine direkt in der Karte einstellbar.", "Próximas recogidas, recordatorios «para sacar» y animaciones por cubo, con fechas ajustables desde la tarjeta.", "Prossime raccolte, promemoria «da portare fuori» e animazioni per bidone, con date impostabili dalla scheda.", "Volgende ophalingen, buitenzet-herinneringen en animaties per container, met data instelbaar in de kaart.", "Próximas recolhas, lembretes «para pôr na rua» e animações por contentor, com datas definidas no cartão.", "Najbliższe odbiory, przypomnienia o wystawieniu i animacje dla każdego kosza, z datami ustawianymi na karcie."],
    "Pulsation": ["Pulse", "Pulsieren", "Pulsación", "Pulsazione", "Pulseren", "Pulsação", "Pulsowanie"],
    "Rappel la veille à": ["Reminder the day before at", "Erinnerung am Vortag um", "Recordatorio la víspera a las", "Promemoria il giorno prima alle", "Herinnering de dag ervoor om", "Lembrete na véspera às", "Przypomnienie dzień wcześniej o"],
    "Rappel le matin de la collecte à": ["Reminder on collection morning at", "Erinnerung am Abholmorgen um", "Recordatorio la mañana de la recogida a las", "Promemoria la mattina della raccolta alle", "Herinnering op de ophaalochtend om", "Lembrete na manhã da recolha às", "Przypomnienie rano w dniu odbioru o"],
    "Rappels": ["Reminders", "Erinnerungen", "Recordatorios", "Promemoria", "Herinneringen", "Lembretes", "Przypomnienia"],
    "Rebond": ["Bounce", "Hüpfen", "Rebote", "Rimbalzo", "Stuiteren", "Ressalto", "Podskok"],
    "Relance si pas sortie à": ["Follow-up if not out at", "Nachfassen, wenn nicht draußen, um", "Insistir si no se ha sacado a las", "Sollecito se non fuori alle", "Opnieuw herinneren als niet buiten om", "Insistir se não estiver na rua às", "Ponowne przypomnienie, jeśli nie wystawiony, o"],
    "Rien à vérifier : choisissez une caméra.": ["Nothing to check: choose a camera.", "Nichts zu prüfen: Kamera wählen.", "Nada que comprobar: elija una cámara.", "Niente da controllare: scegli una telecamera.", "Niets te controleren: kies een camera.", "Nada a verificar: escolha uma câmara.", "Nic do sprawdzenia: wybierz kamerę."],
    "Récurrence": ["Recurrence", "Wiederholung", "Recurrencia", "Ricorrenza", "Herhaling", "Recorrência", "Cykl"],
    "Réglages des poubelles": ["Bin settings", "Tonnen-Einstellungen", "Ajustes de los cubos", "Impostazioni dei bidoni", "Instellingen containers", "Definições dos contentores", "Ustawienia koszy"],
    "Sac": ["Bag", "Sack", "Bolsa", "Sacco", "Zak", "Saco", "Worek"],
    "Secousse": ["Shake", "Schütteln", "Sacudida", "Scossa", "Schudden", "Abanão", "Potrząsanie"],
    "Sortie": ["Out", "Draußen", "Sacado", "Fuori", "Buiten", "Na rua", "Wystawiony"],
    "Style du bac": ["Bin style", "Tonnen-Stil", "Estilo del cubo", "Stile del bidone", "Stijl van de container", "Estilo do contentor", "Styl kosza"],
    "Supprimer cette poubelle": ["Delete this bin", "Diese Tonne löschen", "Eliminar este cubo", "Elimina questo bidone", "Deze container verwijderen", "Eliminar este contentor", "Usuń ten kosz"],
    "Titre (optionnel)": ["Title (optional)", "Titel (optional)", "Título (opcional)", "Titolo (facoltativo)", "Titel (optioneel)", "Título (opcional)", "Tytuł (opcjonalnie)"],
    "Toujours ouvrir les détails": ["Always open details", "Immer Details öffnen", "Abrir siempre los detalles", "Apri sempre i dettagli", "Altijd details openen", "Abrir sempre os detalhes", "Zawsze otwieraj szczegóły"],
    "Toutes les semaines": ["Weekly", "Wöchentlich", "Semanal", "Settimanale", "Wekelijks", "Semanal", "Tygodniowo"],
    "Toutes les {n} semaines": ["Every {n} weeks", "Alle {n} Wochen", "Cada {n} semanas", "Ogni {n} settimane", "Elke {n} weken", "A cada {n} semanas", "Co {n} tygodnie"],
    "Toutes les {n} semaines, le {d}": ["Every {n} weeks, on {d}", "Alle {n} Wochen, {d}", "Cada {n} semanas, el {d}", "Ogni {n} settimane, il {d}", "Elke {n} weken, op {d}", "A cada {n} semanas, à {d}", "Co {n} tygodnie, {d}"],
    "Tâche IA": ["AI task", "KI-Aufgabe", "Tarea de IA", "Compito IA", "AI-taak", "Tarefa de IA", "Zadanie AI"],
    "Téléversement impossible : {e}": ["Upload failed: {e}", "Hochladen fehlgeschlagen: {e}", "Error al subir: {e}", "Caricamento non riuscito: {e}", "Uploaden mislukt: {e}", "Falha no envio: {e}", "Nie udało się wysłać: {e}"],
    "Téléverser une image": ["Upload an image", "Bild hochladen", "Subir una imagen", "Carica un'immagine", "Afbeelding uploaden", "Enviar uma imagem", "Prześlij obraz"],
    "Une date de collecte connue": ["A known collection date", "Ein bekanntes Abholdatum", "Una fecha de recogida conocida", "Una data di raccolta nota", "Een bekende ophaaldatum", "Uma data de recolha conhecida", "Znana data odbioru"],
    "Une fois par mois": ["Once a month", "Einmal im Monat", "Una vez al mes", "Una volta al mese", "Eens per maand", "Uma vez por mês", "Raz w miesiącu"],
    "Voir sur la carte": ["Preview on the card", "Auf der Karte ansehen", "Ver en la tarjeta", "Vedi sulla scheda", "Bekijken op de kaart", "Ver no cartão", "Podgląd na karcie"],
    "Vues": ["Seen", "Gesehen", "Vistos", "Visti", "Gezien", "Vistos", "Widoczne"],
    "Vérification en cours…": ["Checking…", "Wird geprüft…", "Comprobando…", "Controllo in corso…", "Bezig met controleren…", "A verificar…", "Sprawdzanie…"],
    "Vérification impossible : {e}": ["Check failed: {e}", "Prüfung fehlgeschlagen: {e}", "Comprobación fallida: {e}", "Controllo non riuscito: {e}", "Controle mislukt: {e}", "Falha na verificação: {e}", "Sprawdzenie nie powiodło się: {e}"],
    "Vérifier maintenant (test)": ["Check now (test)", "Jetzt prüfen (Test)", "Comprobar ahora (prueba)", "Controlla ora (test)", "Nu controleren (test)", "Verificar agora (teste)", "Sprawdź teraz (test)"],
    "aucune": ["none", "keine", "ninguna", "nessuna", "geen", "nenhuma", "brak"],
    "dernier": ["last", "letzten", "último", "ultimo", "laatste", "último", "ostatni"],
    "{n} date(s) saisie(s)": ["{n} date(s) entered", "{n} Termin(e) eingetragen", "{n} fecha(s) introducida(s)", "{n} data/e inserita/e", "{n} datum/data ingevoerd", "{n} data(s) introduzida(s)", "Wpisane daty: {n}"]
  };
  let LANG = "fr", NUMLOC = "fr-FR";
  const langOf = (hass, c) => { const l = String((c && c.language) || (hass && ((hass.locale && hass.locale.language) || hass.language)) || navigator.language || "en").toLowerCase().split(/[-_]/)[0]; return l === "fr" || HOLM_LANGS.includes(l) ? l : "en"; };
  const setLang = (hass, c) => { LANG = langOf(hass, c); const p = hass && hass.locale && hass.locale.language; NUMLOC = !(c && c.language) && p && p.toLowerCase().startsWith(LANG) ? p : LOCALES[LANG]; return LANG; };
  const _ = (s, v) => { let o = LANG === "fr" ? s : ((I18N[s] && I18N[s][HOLM_LANGS.indexOf(LANG)]) || s); if (v) for (const k in v) o = o.split("{" + k + "}").join(v[k]); return o; };
  const langField = () => ({ name: "language", selector: { select: { mode: "dropdown", options: [{ value: "", label: _("Automatique (profil)") }, ...Object.entries(LANG_NAMES).map(([value, label]) => ({ value, label }))] } } });
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const errText = (e) => (e && e.code === "not_loaded" ? _("HOLM Poubelles n'est pas chargé : vérifiez l'intégration dans Paramètres → Appareils et services.") : (e && e.message) || e);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const parseIso = (s) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s || ""); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; };
  const fmtDate = (s, long) => { const d = parseIso(s); if (!d) return "—"; return d.toLocaleDateString(NUMLOC, long ? { weekday: "long", day: "numeric", month: "long" } : { weekday: "short", day: "2-digit", month: "2-digit" }); };
  const dayName = (i, short) => new Date(2024, 0, 1 + i).toLocaleDateString(NUMLOC, { weekday: short ? "short" : "long" }).replace(".", "");   // 1er janvier 2024 = lundi
  const monthName = (i) => new Date(2024, i, 1).toLocaleDateString(NUMLOC, { month: "short" }).replace(".", "");

  // ---- animations intégrées (HOLM FX en plus quand la carte HOLM FX est installée) ----
  const ANIMS = [
    ["pulse", "Pulsation"], ["halo", "Halo lumineux"], ["couvercle", "Couvercle qui s'ouvre"], ["secousse", "Secousse"],
    ["rebond", "Rebond"], ["clignote", "Contour clignotant"], ["camion", "Camion qui passe"], ["coche", "Coche de réussite"],
  ];
  const fxList = () => (Array.isArray(window.HOLM_FX_AMBIANCES) ? window.HOLM_FX_AMBIANCES : []);
  const animLabel = (v) => { if (!v) return _("Aucune"); if (v.startsWith("fx:")) { const a = fxList().find((x) => x.id === v.slice(3)); return `HOLM FX · ${a ? a.name : v.slice(3)}`; } const a = ANIMS.find((x) => x[0] === v); return a ? _(a[1]) : v; };
  const STYLES = [["bac", "Bac roulant"], ["bac_jaune", "Bac de tri (recyclage)"], ["compost", "Bac biodéchets"], ["carton", "Bac papier / carton"], ["verre", "Conteneur à verre"], ["sac", "Sac"]];
  const PALETTE = ["#78828c", "#37474f", "#f5c518", "#43a047", "#1e88e5", "#8d6e63", "#fb8c00", "#e53935", "#8e24aa", "#00acc1"];

  // ---- dessins des bacs (SVG, couleur de la poubelle) ----
  const EMBLEM = { bac_jaune: "mdi:recycle", compost: "mdi:leaf", carton: "mdi:package-variant-closed", verre: "mdi:bottle-wine-outline" };
  const emblem = (style) => (EMBLEM[style] ? `<ha-icon class="emb ${style === "verre" ? "low" : ""}" icon="${EMBLEM[style]}"></ha-icon>` : "");
  // texte lisible (noir ou blanc) sur la couleur de la poubelle
  const ink = (hex) => { const m = /^#?([0-9a-f]{6})$/i.exec(hex || ""); if (!m) return "#fff"; const n = parseInt(m[1], 16), l = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; return l > 0.62 ? "#1b1b1b" : "#fff"; };
  const svgBin = (style) => {
    if (style === "verre") return `<svg viewBox="0 0 64 72" class="art verre"><ellipse cx="32" cy="66" rx="22" ry="3" class="sh"/>
      <path class="lid" d="M22 15 Q32 9 42 15 Z"/><path class="body" d="M9 64 L9 40 Q9 15 32 15 Q55 15 55 40 L55 64 Z"/><path class="shine" d="M15 58 L15 40 Q15 24 28 20"/>
      <circle cx="24" cy="27" r="3.4" class="hole"/><circle cx="40" cy="27" r="3.4" class="hole"/></svg>${emblem(style)}`;
    if (style === "sac") return `<svg viewBox="0 0 64 72" class="art sac"><ellipse cx="32" cy="66" rx="18" ry="3" class="sh"/>
      <g class="lid"><path class="dark" d="M27 16 Q32 6 37 16 Q34 12 32 12 Q30 12 27 16Z"/><path class="dark" d="M24 10 Q27 14 30 16 M40 10 Q37 14 34 16" stroke-width="3" fill="none" stroke-linecap="round"/></g>
      <path class="body" d="M27 17 Q12 30 13 48 Q14 64 32 64 Q50 64 51 48 Q52 30 37 17 Z"/><path class="shine" d="M20 50 Q19 34 28 24"/><path class="dark" d="M27 17 L37 17 L35 20 L29 20Z"/></svg>`;
    return `<svg viewBox="0 0 64 72" class="art bac"><ellipse cx="32" cy="66" rx="22" ry="3" class="sh"/>
      <path class="body" d="M12 21 L52 21 L48 62 L16 62 Z"/><path class="shine" d="M17 27 L19 56"/>
      <path class="rib ${EMBLEM[style] ? "soft" : ""}" d="M25 27 L24.5 56 M32 27 V56 M39 27 L39.5 56"/>
      <circle cx="19" cy="63" r="5" class="wheel"/><circle cx="45" cy="63" r="5" class="wheel"/><circle cx="19" cy="63" r="1.8" class="hub"/><circle cx="45" cy="63" r="1.8" class="hub"/>
      <g class="lid"><path class="light" d="M8 19 Q32 10 56 19 L56 22 L8 22 Z"/><rect x="25" y="12.6" width="14" height="3.2" rx="1.6" class="dark"/></g></svg>${emblem(style)}`;
  };

  const STATE_TXT = (st, days, next) => {
    if (days === null || days === undefined) return _("Aucune collecte prévue");
    if (days === 0) return _("Aujourd'hui");
    if (days === 1) return _("Demain");
    return _("Dans {n} jours", { n: days });
  };

  // ======================================================================
  class HolmBinsCard extends HTMLElement {
    static getConfigElement() { return document.createElement("holm-bins-card-editor"); }
    static getStubConfig() { return {}; }
    setConfig(c) {
      this._c = { layout: "row", show_date: true, show_progress: true, show_settings: true, fx: true, tap_action: "out", hide_after: 0, ...c };
      if (this.shadowRoot) { this._key = ""; this._render(); }
    }
    set hass(h) {
      this._hass = h;
      { const l = setLang(h, this._c); if (this._lang && l !== this._lang) this._key = ""; this._lang = l; }
      if (!this.shadowRoot) { this.attachShadow({ mode: "open" }); this._build(); }
      const key = this._bins().map((b) => b.entity_id + b.last_updated + JSON.stringify(b.attributes)).join("|") + (this._preview || "");
      if (key !== this._key) { this._key = key; this._render(); }
    }
    getCardSize() { return this._c && this._c.layout === "list" ? 1 + this._bins().length : 3; }
    getGridOptions() { return { columns: 12, min_columns: 4, rows: "auto" }; }
    connectedCallback() { this._fxReady = !!customElements.get("holm-fx-card"); if (!this._fxReady) customElements.whenDefined("holm-fx-card").then(() => { this._fxReady = true; this._key = ""; this._render(); }); }
    _admin() { return !!(this._hass && this._hass.user && this._hass.user.is_admin); }
    _bins() {
      const h = this._hass; if (!h) return [];
      let list = Object.entries(h.states).filter(([k, s]) => k.startsWith("sensor.") && s.attributes && s.attributes.holm_bins).map(([, s]) => s);
      const want = (this._c && this._c.bins) || [];
      if (want.length) list = want.map((id) => list.find((s) => s.attributes.holm_bins === id)).filter(Boolean);
      else list.sort((a, b) => (a.attributes.ordre ?? 0) - (b.attributes.ordre ?? 0));
      if (this._c && this._c.sort === "date") list = [...list].sort((a, b) => (a.attributes.jours ?? 9999) - (b.attributes.jours ?? 9999));
      const max = +((this._c && this._c.hide_after) || 0);
      if (max > 0) list = list.filter((s) => s.attributes.jours !== null && s.attributes.jours !== undefined && s.attributes.jours <= max);
      return list;
    }
    _build() {
      this.shadowRoot.innerHTML = `<style>${HolmBinsCard.css()}</style><ha-card><div class="hd" id="hd"></div><div class="bins" id="bins"></div><div class="set" id="set"></div></ha-card>`;
      const r = this.shadowRoot;
      r.getElementById("hd").addEventListener("click", (e) => { if (e.target.closest(".gear")) this._openSettings(); });
      r.getElementById("bins").addEventListener("click", (e) => {
        if (e.target.closest(".gear")) return this._openSettings();
        const t = e.target.closest(".bin"); if (t) this._tap(t.dataset.id, t.dataset.ent);
      });
      ["keydown", "keyup", "keypress"].forEach((ev) => r.getElementById("set").addEventListener(ev, (e) => e.stopPropagation()));
    }
    _tap(id, ent) {
      const st = this._hass.states[ent]; if (!st) return;
      const a = st.attributes, sw = `switch.${id}_sortie`;
      if (this._c.tap_action === "out" && this._hass.states[sw] && (a.etat === "veille" || a.etat === "aujourdhui" || a.etat === "sortie")) {
        this._hass.callService("switch", a.sortie ? "turn_off" : "turn_on", { entity_id: sw });
        return;
      }
      if (this._c.tap_action === "none") return;
      this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: ent }, bubbles: true, composed: true }));
    }
    _animFor(a, id) {
      if (this._preview && this._preview.startsWith(id + "|")) return this._preview.split("|")[1];
      if (a.etat === "veille") return a.animation_veille || "";
      if (a.etat === "aujourdhui") return a.animation_jour || "";
      if (a.etat === "sortie") return a.animation_sortie || "";
      return "";
    }
    _render() {
      if (!this.shadowRoot || !this._c || !this._hass) return;
      setLang(this._hass, this._c);
      const r = this.shadowRoot, card = r.querySelector("ha-card"), box = r.getElementById("bins"), hd = r.getElementById("hd");
      card.dataset.layout = this._c.layout || "row";
      card.style.background = this._c.background || "";   // couleur, dégradé ou variable de thème (var(--…))
      // arrondi : option de la carte, sinon variable de thème holm-bins-border-radius, sinon celui du thème
      const rad = String(this._c.border_radius ?? "").trim();
      this.style.setProperty("--hb-radius", rad ? (/^\d+(\.\d+)?$/.test(rad) ? rad + "px" : rad) : "");
      if (!rad) this.style.removeProperty("--hb-radius");
      card.dataset.spacing = this._c.spacing === "compact" ? "compact" : "normal";
      const gear = this._c.show_settings !== false && this._admin() ? `<button class="gear" title="${esc(_("Réglages des poubelles"))}"><ha-icon icon="mdi:cog-outline"></ha-icon></button>` : "";
      hd.innerHTML = this._c.title ? `<div class="ttl">${esc(this._c.title)}</div>${gear}` : "";
      hd.style.display = this._c.title ? "" : "none";
      const bins = this._bins();
      if (!bins.length) {
        const any = Object.values(this._hass.states).some((s) => s.attributes && s.attributes.holm_bins);
        box.innerHTML = `<div class="miss">${any ? _("Aucune collecte dans la période choisie.") : _("Aucune poubelle : installez l'intégration HOLM Poubelles, puis ajoutez vos poubelles avec la roue crantée.")}</div>${this._c.title ? "" : gear}`;
        return;
      }
      const tiles = bins.map((s) => {
        const a = s.attributes, id = a.holm_bins, anim = this._animFor(a, id), fx = anim.startsWith("fx:") && this._c.fx !== false && this._fxReady;
        const ds = a.prochaines_dates || [], days = a.jours;
        let prog = 0;
        if (days !== null && days !== undefined && ds.length > 1) { const cyc = (parseIso(ds[1]) - parseIso(ds[0])) / 86400000; prog = Math.max(0, Math.min(1, 1 - days / Math.max(1, cyc))); }
        else if (days !== null && days !== undefined) prog = Math.max(0, 1 - days / 7);
        const out = a.etat === "sortie";
        return `<div class="bin st-${esc(a.etat)}${anim && !fx ? " an-" + esc(anim) : ""}${fx ? " has-fx" : ""}" data-id="${esc(id)}" data-ent="${esc(s.entity_id)}" data-fx="${fx ? esc(anim.slice(3)) : ""}" style="--c:${esc(a.couleur || "#607d8b")};--ink:${ink(a.couleur)}" title="${esc(a.nom)}">
          <div class="fxh"></div>
          <div class="pic">${a.image ? `<img class="art img" src="${esc(a.image)}" alt="" loading="lazy">` : svgBin(a.style)}${out ? `<span class="ok"><ha-icon icon="mdi:check-bold"></ha-icon></span>` : ""}${anim === "camion" && !fx ? `<ha-icon class="truck" icon="mdi:truck"></ha-icon>` : ""}</div>
          <div class="txt"><div class="nm">${esc(a.nom)}</div>
            <div class="when">${out ? `${esc(_("Sortie"))} ✓` : esc(STATE_TXT(a.etat, days, s.state))}</div>
            ${this._c.show_date !== false && s.state && s.state !== "unknown" && s.state !== "unavailable" ? `<div class="dt"><ha-icon icon="mdi:calendar-blank"></ha-icon>${esc(fmtDate(s.state))}</div>` : ""}
            ${this._c.show_progress !== false && days !== null && days !== undefined ? `<div class="bar"><i style="width:${(prog * 100).toFixed(0)}%"></i></div>` : ""}</div></div>`;
      }).join("");
      box.innerHTML = tiles + (this._c.title ? "" : gear);
      // ambiances HOLM FX en fond des bacs concernés
      box.querySelectorAll(".bin.has-fx").forEach((t) => {
        const fx = document.createElement("holm-fx-card");
        try { fx.setConfig({ ambiance: t.dataset.fx, height: "100%", background: "transparent", color: t.style.getPropertyValue("--c"), intensity: 1 }); fx.hass = this._hass; t.querySelector(".fxh").appendChild(fx); }
        catch (e) { /* HOLM FX absent ou ambiance inconnue : pas de fond */ }
      });
    }

    // ================= réglages (roue crantée, administrateurs) =================
    async _openSettings() {
      const box = this.shadowRoot.getElementById("set");
      if (box.classList.contains("on")) return this._closeSettings();
      box.classList.add("on");
      box.innerHTML = `<div class="sh">${_("Chargement…")}</div>`;
      try { this._cfg = await this._hass.callWS({ type: "holm_bins/get" }); }
      catch (e) { box.innerHTML = `<div class="sh err">${esc(_("Intégration HOLM Poubelles introuvable : {e}", { e: errText(e) }))}</div>`; return; }
      this._draft = { bins: clone(this._cfg.bins), settings: clone(this._cfg.settings) };
      this._showAll = false;
      this._open = this._draft.bins.findIndex((b) => this._mine(b));
      this._tab = "bins";
      this._drawSettings();
    }
    // poubelles de cette carte (option « Poubelles affichées ») ; sans filtre, ou « voir toutes », toutes
    _filtered() { return !!(this._c.bins && this._c.bins.length) && !this._showAll; }
    _mine(b) { return !this._filtered() || !b.id || this._c.bins.includes(b.id); }
    _closeSettings() { const box = this.shadowRoot.getElementById("set"); box.classList.remove("on"); box.innerHTML = ""; this._preview = ""; this._key = ""; this._render(); }
    _animOptions(cur) {
      const fx = fxList();
      return `<option value="" ${!cur ? "selected" : ""}>${_("Aucune")}</option><optgroup label="${esc(_("Animations intégrées"))}">${ANIMS.map(([v, l]) => `<option value="${v}" ${cur === v ? "selected" : ""}>${esc(_(l))}</option>`).join("")}</optgroup>
        ${fx.length ? `<optgroup label="HOLM FX">${fx.map((a) => `<option value="fx:${esc(a.id)}" ${cur === "fx:" + a.id ? "selected" : ""}>${esc(a.name)}</option>`).join("")}</optgroup>` : ""}`;
    }
    _ruleText(b) {
      if (b.source === "calendar") { const c = b.calendar ? (this._hass.states[b.calendar]?.attributes.friendly_name || b.calendar) : "—"; return b.keyword ? _("Calendrier {c} · « {k} »", { c, k: b.keyword }) : _("Calendrier {c}", { c }); }
      if (b.source === "dates") return _("{n} date(s) saisie(s)", { n: (b.extra || []).length });
      const r = b.rule || {};
      if (r.type === "monthly") return _("Le {n} {d} du mois", { n: r.nth === -1 ? _("dernier") : _(["1er", "2e", "3e", "4e"][(r.nth || 1) - 1]), d: dayName(r.weekday || 0) });
      const days = (r.weekdays || []).map((d) => dayName(d)).join(", ");
      return r.interval > 1 ? _("Toutes les {n} semaines, le {d}", { n: r.interval, d: days }) : _("Chaque semaine, le {d}", { d: days });
    }
    _drawSettings(msg = "") {
      const box = this.shadowRoot.getElementById("set"), d = this._draft, s = d.settings;
      const tabs = `<div class="tabs"><button class="tab ${this._tab === "bins" ? "on" : ""}" data-tab="bins"><ha-icon icon="mdi:delete-variant"></ha-icon>${_("Poubelles")}</button>
        <button class="tab ${this._tab === "notif" ? "on" : ""}" data-tab="notif"><ha-icon icon="mdi:bell-ring-outline"></ha-icon>${_("Rappels")}</button>
        <button class="tab ${this._tab === "cam" ? "on" : ""}" data-tab="cam"><ha-icon icon="mdi:cctv"></ha-icon>${_("Caméra")}</button></div>`;
      let body = "";
      if (this._tab === "bins") {
        const filt = this._c.bins && this._c.bins.length;
        body = (filt ? `<div class="hint row">${_("Cette carte n'affiche que certaines poubelles (option « Poubelles affichées »).")}
            <button class="lnk all">${this._showAll ? _("Seulement celles de cette carte") : _("Voir toutes les poubelles")}</button></div>` : "")
          + d.bins.map((b, i) => !this._mine(b) ? "" : `<div class="acc ${this._open === i ? "open" : ""}" data-i="${i}" style="--c:${esc(b.color)};--ink:${ink(b.color)}">
          <div class="acch"><span class="dot"></span><b>${esc(b.name)}</b><span class="rt">${esc(this._ruleText(b))}</span>
            <button class="ib up" title="${esc(_("Monter"))}" ${i === 0 ? "disabled" : ""}><ha-icon icon="mdi:chevron-up"></ha-icon></button>
            <button class="ib dn" title="${esc(_("Descendre"))}" ${i === d.bins.length - 1 ? "disabled" : ""}><ha-icon icon="mdi:chevron-down"></ha-icon></button>
            <ha-icon class="chev" icon="mdi:chevron-${this._open === i ? "up" : "down"}"></ha-icon></div>
          ${this._open === i ? this._binForm(b, i) : ""}${filt && !b.id ? `<div class="hint nb">${_("Pour l'afficher sur cette carte, ajoutez-la dans « Poubelles affichées » (éditeur de la carte).")}</div>` : ""}</div>`).join("")
          + `<button class="add"><ha-icon icon="mdi:plus"></ha-icon>${_("Ajouter une poubelle")}</button>`;
      } else if (this._tab === "cam") {
        body = this._camForm(s);
      } else {
        const svcs = this._cfg.notify_services || [];
        const ordered = [...svcs.filter((x) => x.startsWith("mobile_app_")), ...svcs.filter((x) => !x.startsWith("mobile_app_"))];
        body = `<div class="hint">${_("Les rappels partent pour les poubelles dont la notification est activée. Le bouton « C'est fait » de la notification marque les poubelles comme sorties.")}</div>
          <div class="fl"><label>${_("Envoyer à")}</label><div class="chips">${ordered.map((x) => `<label class="chip ${s.targets.includes(x) ? "on" : ""}"><input type="checkbox" data-t="${esc(x)}" ${s.targets.includes(x) ? "checked" : ""}>${esc(x.replace(/^mobile_app_/, "📱 "))}</label>`).join("") || `<i>${_("Aucun service de notification")}</i>`}</div></div>
          <div class="grid2">
            <label class="fl"><span>${_("Rappel la veille à")}</span><input type="time" data-s="time" value="${esc(s.time)}"></label>
            <label class="fl"><span>${_("Relance si pas sortie à")}</span><span class="row"><input type="time" data-s="reminder" value="${esc(s.reminder)}" ${s.reminder ? "" : "disabled"}><input type="checkbox" data-on="reminder" ${s.reminder ? "checked" : ""}></span></label>
            <label class="fl"><span>${_("Rappel le matin de la collecte à")}</span><span class="row"><input type="time" data-s="morning" value="${esc(s.morning || "07:00")}" ${s.morning ? "" : "disabled"}><input type="checkbox" data-on="morning" ${s.morning ? "checked" : ""}></span></label>
            <label class="fl"><span>${_("Le jour de collecte, passer à la suivante à")}</span><input type="time" data-s="end" value="${esc(s.end)}"></label>
          </div>
          <div class="sep"></div>
          <div class="fl"><label>${_("Titres et textes des notifications (facultatif)")}</label></div>
          <div class="hint">${esc(_("Vide = titre ou texte par défaut. Variables : {{ poubelles }} et {{ date }}. Les modèles Home Assistant fonctionnent aussi, par exemple {{ states('input_text.message_poubelles') }}."))}</div>
          ${[["title_notif", "Titre — la veille et le matin", "🗑️ Poubelles à sortir"], ["title_reminder", "Titre — relance", "⏰ Rappel poubelles"]].map(([k, l, ph]) => `<label class="fl"><span>${_(l)}</span><input type="text" data-s="${k}" maxlength="120" placeholder="${esc(_(ph))}" value="${esc(s[k] || "")}"></label>`).join("")}
          ${[["text_eve", "La veille"], ["text_today", "Le matin de la collecte"], ["text_reminder", "Relance"]].map(([k, l]) => `<label class="fl"><span>${_(l)}</span><textarea data-s="${k}" rows="2" maxlength="500" placeholder="${esc(_({ text_eve: "Ce soir : {bins} (collecte demain, {date}).", text_today: "Aujourd'hui : {bins} (collecte ce jour).", text_reminder: "Pas encore sortie : {bins}." }[k], { bins: "{{ poubelles }}", date: "{{ date }}" }))}">${esc(s[k] || "")}</textarea></label>`).join("")}
          <button class="add test"><ha-icon icon="mdi:send-outline"></ha-icon>${_("Envoyer une notification de test")}</button>`;
      }
      box.innerHTML = `${tabs}<div class="body">${body}</div>${msg ? `<div class="msg">${esc(msg)}</div>` : ""}
        <div class="acts"><button class="cancel">${_("Annuler")}</button><button class="save"><ha-icon icon="mdi:content-save-outline"></ha-icon>${_("Enregistrer")}</button></div>`;
      this._wire(box);
      if (this._tab === "bins" && this._open >= 0 && d.bins[this._open]) this._refreshPreview();
    }
    _camForm(s) {
      const h = this._hass, ids = (dom) => Object.keys(h.states).filter((e) => e.startsWith(dom + ".")).sort();
      const fname = (e) => esc((h.states[e] && h.states[e].attributes.friendly_name) || e);
      const svcs = this._cfg.notify_services || [], ct = s.camera_targets || [];
      const ordered = [...svcs.filter((x) => x.startsWith("mobile_app_")), ...svcs.filter((x) => !x.startsWith("mobile_app_"))];
      const lc = this._cfg.last_check || {}, names = Object.fromEntries((this._draft.bins || []).map((b) => [b.id, b.name]));
      const last = lc.time ? `<div class="camres"><img src="${esc(lc.image || "")}?v=${encodeURIComponent(lc.time)}" alt="" onerror="this.style.display='none'">
        <div><b>${_("Dernière vérification")}</b> · ${esc(new Date(lc.time).toLocaleString(NUMLOC, { weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }))}
        ${lc.error ? `<div class="bad">${esc(lc.error)}</div>` : `<div class="okc">✓ ${_("Vues")} : ${esc((lc.seen || []).map((x) => names[x] || x).join(", ") || "—")}</div>
        <div class="bad">✗ ${_("Pas vues")} : ${esc((lc.missing || []).map((x) => names[x] || x).join(", ") || "—")}</div>`}</div></div>` : "";
      return `<div class="hint">${_("La veille de la collecte, à l'heure choisie, la caméra prend une photo et une tâche IA de Home Assistant regarde quelles poubelles sont sorties : celles qu'elle voit sont marquées sorties (plus de relance), pour les autres une alerte part avec la photo.")}</div>
        <div class="grid2">
          <label class="fl"><span>${_("Caméra")}</span><select data-c="camera"><option value="">${_("Aucune (vérification désactivée)")}</option>${ids("camera").map((e) => `<option value="${esc(e)}" ${s.camera === e ? "selected" : ""}>${fname(e)}</option>`).join("")}</select></label>
          <label class="fl"><span>${_("Tâche IA")}</span><select data-c="ai_task"><option value="">${_("Celle par défaut de Home Assistant")}</option>${ids("ai_task").map((e) => `<option value="${esc(e)}" ${s.ai_task === e ? "selected" : ""}>${fname(e)}</option>`).join("")}</select></label>
          <label class="fl"><span>${_("Heure de la vérification (la veille)")}</span><input type="time" data-c="camera_time" value="${esc(s.camera_time || "20:00")}"></label>
        </div>
        <label class="ck"><input type="checkbox" data-c="camera_alert" ${s.camera_alert !== false ? "checked" : ""}><ha-icon icon="mdi:alert-outline"></ha-icon>${_("Alerter avec la photo si des poubelles ne sont pas vues")}</label>
        <div class="fl"><label>${_("Alerte envoyée à (aucun = les destinataires des rappels)")}</label><div class="chips">${ordered.map((x) => `<label class="chip ${ct.includes(x) ? "on" : ""}"><input type="checkbox" data-ct="${esc(x)}" ${ct.includes(x) ? "checked" : ""}>${esc(x.replace(/^mobile_app_/, "📱 "))}</label>`).join("")}</div></div>
        ${s.camera ? `<button class="add check"><ha-icon icon="mdi:camera-iris"></ha-icon>${_("Vérifier maintenant (test)")}</button>
        <div class="hint">${_("Le test enregistre les réglages, prend une photo et interroge l'IA, sans marquer de poubelle ni envoyer d'alerte.")}</div>` : ""}
        ${last}`;
    }
    _binForm(b, i) {
      const r = b.rule || {}, src = b.source || "rule", cals = Object.keys(this._hass.states).filter((e) => e.startsWith("calendar.")).sort();
      const seg = (name, cur, opts) => `<div class="seg">${opts.map(([v, l]) => `<button data-seg="${name}" data-v="${v}" class="${String(cur) === String(v) ? "on" : ""}">${esc(_(l))}</button>`).join("")}</div>`;
      const dateList = (key, label, icon) => `<div class="fl"><label>${_(label)}</label><div class="chips">${(b[key] || []).map((x) => `<span class="chip on dch">${esc(fmtDate(x))}<button class="ib rm" data-k="${key}" data-d="${esc(x)}"><ha-icon icon="mdi:close"></ha-icon></button></span>`).join("")}
        <span class="row"><input type="date" data-new="${key}"><button class="ib addd" data-k="${key}" title="${esc(_("Ajouter"))}"><ha-icon icon="${icon}"></ha-icon></button></span></div></div>`;
      return `<div class="form">
        <div class="grid2">
          <label class="fl"><span>${_("Nom")}</span><input type="text" data-f="name" value="${esc(b.name)}" maxlength="40"></label>
          <label class="fl"><span>${_("Style du bac")}</span><select data-f="style">${STYLES.map(([v, l]) => `<option value="${v}" ${b.style === v ? "selected" : ""}>${esc(_(l))}</option>`).join("")}</select></label>
        </div>
        <div class="fl"><label>${_("Image du bac")}</label>${seg("imgmode", b.image || b._img ? "image" : "draw", [["draw", "Dessin HOLM"], ["image", "Image personnalisée"]])}
          ${b.image || b._img ? `<div class="imgrow">${b.image ? `<img class="imgprev" src="${esc(b.image)}" alt="">` : `<span class="imgprev none"><ha-icon icon="mdi:image-outline"></ha-icon></span>`}
            <div class="imgf"><input type="text" data-f="image" placeholder="/local/images/ma-poubelle.png" value="${esc(b.image || "")}">
            <span class="row"><button class="add up"><ha-icon icon="mdi:upload"></ha-icon>${_("Téléverser une image")}</button><input type="file" accept="image/*" class="file" hidden></span>
            <span class="hint">${_("PNG ou SVG au fond transparent conseillé. Une adresse /local/… (dossier www) ou https://… fonctionne aussi.")}</span></div></div>` : ""}</div>
        <div class="fl"><label>${_("Couleur")}</label><div class="pal">${PALETTE.map((c) => `<button class="sw ${b.color.toLowerCase() === c ? "on" : ""}" data-col="${c}" style="background:${c}"></button>`).join("")}<input type="color" data-f="color" value="${esc(b.color)}"></div></div>
        <div class="fl"><label>${_("Dates de collecte")}</label>${seg("source", src, [["rule", "Récurrence"], ["calendar", "Calendrier"], ["dates", "Dates à la main"]])}</div>
        ${src === "rule" ? `
          ${seg("rtype", r.type || "weekly", [["weekly", "Toutes les semaines"], ["monthly", "Une fois par mois"]])}
          ${(r.type || "weekly") === "weekly" ? `
            <div class="fl"><label>${_("Jour(s)")}</label><div class="days">${[0, 1, 2, 3, 4, 5, 6].map((x) => `<button data-wd="${x}" class="${(r.weekdays || []).includes(x) ? "on" : ""}" title="${esc(dayName(x))}">${esc(dayName(x, true))}</button>`).join("")}</div></div>
            <div class="grid2"><label class="fl"><span>${_("Fréquence")}</span><select data-r="interval">${[1, 2, 3, 4].map((n) => `<option value="${n}" ${+r.interval === n ? "selected" : ""}>${n === 1 ? _("Chaque semaine") : _("Toutes les {n} semaines", { n })}</option>`).join("")}</select></label>
            ${+r.interval > 1 ? `<label class="fl"><span>${_("Une date de collecte connue")}</span><input type="date" data-r="anchor" value="${esc(r.anchor || "")}"></label>` : ""}</div>`
          : `<div class="grid2"><label class="fl"><span>${_("Le")}</span><select data-r="nth">${[[1, "1er"], [2, "2e"], [3, "3e"], [4, "4e"], [-1, "dernier"]].map(([v, l]) => `<option value="${v}" ${+r.nth === v ? "selected" : ""}>${esc(_(l))}</option>`).join("")}</select></label>
            <label class="fl"><span>${_("Jour")}</span><select data-r="weekday">${[0, 1, 2, 3, 4, 5, 6].map((x) => `<option value="${x}" ${+r.weekday === x ? "selected" : ""}>${esc(dayName(x))}</option>`).join("")}</select></label></div>`}
          <label class="ck"><input type="checkbox" data-f="holidays" ${b.holidays ? "checked" : ""}>${_("Décaler au lendemain les jours fériés")}</label>` : ""}
        ${src === "calendar" ? `<div class="grid2"><label class="fl"><span>${_("Calendrier")}</span><select data-f="calendar"><option value="">—</option>${cals.map((c) => `<option value="${esc(c)}" ${b.calendar === c ? "selected" : ""}>${esc(this._hass.states[c].attributes.friendly_name || c)}</option>`).join("")}</select></label>
          <label class="fl"><span>${_("Mot-clé dans le nom de l'événement (facultatif)")}</span><input type="text" data-f="keyword" maxlength="80" placeholder="Tri, recyclage" value="${esc(b.keyword || "")}"></label></div>
          <div class="hint">${_("Pour un calendrier commun à plusieurs poubelles : seuls les événements dont le nom contient ce mot comptent (plusieurs mots : séparés par des virgules).")}</div>
          <div class="kws chips"></div>` : ""}
        ${src !== "dates" ? `<div class="fl"><label>${_("Mois de collecte (aucun = toute l'année)")}</label><div class="days months">${Array.from({ length: 12 }, (_x, m) => `<button data-mo="${m + 1}" class="${(b.months || []).includes(m + 1) ? "on" : ""}">${esc(monthName(m))}</button>`).join("")}</div></div>` : ""}
        ${dateList("extra", src === "dates" ? "Dates de collecte" : "Dates ajoutées", "mdi:calendar-plus")}
        ${src !== "dates" ? dateList("skip", "Dates annulées", "mdi:calendar-remove") : ""}
        <div class="prev"><ha-icon icon="mdi:calendar-search"></ha-icon><span>${_("Prochaines collectes :")}</span><span class="pv">…</span></div>
        <div class="sep"></div>
        <label class="ck"><input type="checkbox" data-f="notify" ${b.notify ? "checked" : ""}><ha-icon icon="mdi:bell-outline"></ha-icon>${_("Notification de rappel")}</label>
        <div class="grid3">
          ${[["anim_eve", "Animation la veille (J-1)"], ["anim_today", "Animation le jour de collecte"], ["anim_out", "Animation une fois sortie"]].map(([k, l]) => `<label class="fl"><span>${_(l)}</span><span class="row"><select data-f="${k}">${this._animOptions(b[k] || "")}</select><button class="ib play" data-k="${k}" title="${esc(_("Voir sur la carte"))}"><ha-icon icon="mdi:play-circle-outline"></ha-icon></button></span></label>`).join("")}
        </div>
        ${fxList().length ? "" : `<div class="hint">${_("Installez la carte HOLM FX pour choisir aussi parmi ses ambiances animées.")}</div>`}
        <div class="row end"><button class="del"><ha-icon icon="mdi:delete-outline"></ha-icon>${_("Supprimer cette poubelle")}</button></div>
      </div>`;
    }
    _wire(box) {
      const d = this._draft, s = d.settings, cur = () => d.bins[this._open];
      box.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => { this._tab = t.dataset.tab; this._drawSettings(); }));
      const all = box.querySelector(".all");
      if (all) all.addEventListener("click", () => { this._showAll = !this._showAll; if (this._open >= 0 && !this._mine(d.bins[this._open])) this._open = -1; this._drawSettings(); });
      box.querySelector(".cancel").addEventListener("click", () => this._closeSettings());
      box.querySelector(".save").addEventListener("click", () => this._save());
      // ---- rappels ----
      box.querySelectorAll("[data-t]").forEach((c) => c.addEventListener("change", () => { const t = c.dataset.t; s.targets = c.checked ? [...new Set([...s.targets, t])] : s.targets.filter((x) => x !== t); c.closest(".chip").classList.toggle("on", c.checked); }));
      box.querySelectorAll("[data-s]").forEach((inp) => inp.addEventListener("change", () => { s[inp.dataset.s] = inp.value; }));
      box.querySelectorAll("[data-on]").forEach((c) => c.addEventListener("change", () => { const k = c.dataset.on, inp = box.querySelector(`[data-s="${k}"]`); inp.disabled = !c.checked; s[k] = c.checked ? inp.value : ""; }));
      const test = box.querySelector(".test");
      if (test) test.addEventListener("click", async () => {
        try { await this._saveDraft(); const r = await this._hass.callWS({ type: "holm_bins/test" }); this._drawSettings(r.sent ? _("Notification envoyée à {n} appareil(s).", { n: r.sent }) : _("Aucun destinataire valide : cochez au moins un appareil.")); }
        catch (e) { this._drawSettings(_("Envoi impossible : {e}", { e: errText(e) })); }
      });
      // ---- caméra ----
      box.querySelectorAll("[data-c]").forEach((inp) => inp.addEventListener("change", () => { const k = inp.dataset.c; s[k] = inp.type === "checkbox" ? inp.checked : inp.value; if (k === "camera") this._drawSettings(); }));
      box.querySelectorAll("[data-ct]").forEach((c) => c.addEventListener("change", () => { const t = c.dataset.ct, cur = s.camera_targets || []; s.camera_targets = c.checked ? [...new Set([...cur, t])] : cur.filter((x) => x !== t); c.closest(".chip").classList.toggle("on", c.checked); }));
      const chk = box.querySelector(".check");
      if (chk) chk.addEventListener("click", async () => {
        chk.disabled = true; chk.textContent = _("Vérification en cours…");
        try { await this._saveDraft(); const r = await this._hass.callWS({ type: "holm_bins/check" }); this._cfg.last_check = r; this._drawSettings(r.skipped ? _("Rien à vérifier : choisissez une caméra.") : r.error ? _("Vérification impossible : {e}", { e: r.error }) : ""); }
        catch (e) { this._drawSettings(_("Vérification impossible : {e}", { e: errText(e) })); }
      });
      // ---- poubelles ----
      box.querySelectorAll(".acch").forEach((h) => h.addEventListener("click", (e) => {
        const i = +h.closest(".acc").dataset.i;
        if (e.target.closest(".up")) { [d.bins[i - 1], d.bins[i]] = [d.bins[i], d.bins[i - 1]]; this._open = this._open === i ? i - 1 : this._open; return this._drawSettings(); }
        if (e.target.closest(".dn")) { [d.bins[i + 1], d.bins[i]] = [d.bins[i], d.bins[i + 1]]; this._open = this._open === i ? i + 1 : this._open; return this._drawSettings(); }
        this._open = this._open === i ? -1 : i; this._drawSettings();
      }));
      const add = box.querySelector(".add:not(.test)");
      if (add) add.addEventListener("click", () => {
        const n = d.bins.length, today = new Date();
        d.bins.push({ name: _("Poubelle {n}", { n: n + 1 }), color: PALETTE[n % PALETTE.length], style: "bac", icon: "", source: "rule", calendar: "",
          rule: { type: "weekly", weekdays: [(today.getDay() + 6) % 7], interval: 1, anchor: iso(today), nth: 1, weekday: 0 }, months: [], holidays: false, extra: [], skip: [], notify: true, anim_eve: "pulse", anim_today: "couvercle", anim_out: "coche" });
        this._open = n; this._drawSettings();
      });
      const b = cur(); if (!b) return;
      const redraw = () => this._drawSettings(), again = () => this._refreshPreview();
      box.querySelectorAll("[data-f]").forEach((inp) => inp.addEventListener(inp.type === "text" && inp.dataset.f !== "image" ? "input" : "change", () => {
        const k = inp.dataset.f; b[k] = inp.type === "checkbox" ? inp.checked : inp.value;
        if (k === "name") { const t = box.querySelector(".acc.open .acch b"); if (t) t.textContent = inp.value; return; }
        if (k === "keyword") { const t = box.querySelector(".acc.open .acch .rt"); if (t) t.textContent = this._ruleText(b); clearTimeout(this._kt); this._kt = setTimeout(again, 350); return; }
        if (k === "image") { b.image = inp.value.trim(); return redraw(); }
        if (k === "color") return redraw();
        if (k === "calendar" || k === "holidays") again();
      }));
      box.querySelectorAll("[data-col]").forEach((c) => c.addEventListener("click", () => { b.color = c.dataset.col; redraw(); }));
      box.querySelectorAll("[data-seg]").forEach((c) => c.addEventListener("click", () => {
        if (c.dataset.seg === "source") b.source = c.dataset.v;
        else if (c.dataset.seg === "imgmode") { if (c.dataset.v === "draw") { b.image = ""; b._img = false; } else b._img = true; }
        else b.rule = { ...b.rule, type: c.dataset.v };
        redraw();
      }));
      box.querySelectorAll("[data-wd]").forEach((c) => c.addEventListener("click", () => {
        const x = +c.dataset.wd, w = new Set(b.rule.weekdays || []); w.has(x) ? w.delete(x) : w.add(x); if (!w.size) w.add(x);
        b.rule = { ...b.rule, weekdays: [...w].sort() }; redraw();
      }));
      box.querySelectorAll("[data-mo]").forEach((c) => c.addEventListener("click", () => {
        const x = +c.dataset.mo, m = new Set(b.months || []); m.has(x) ? m.delete(x) : m.add(x); b.months = [...m].sort((p, q) => p - q); redraw();
      }));
      box.querySelectorAll("[data-r]").forEach((inp) => inp.addEventListener("change", () => {
        const k = inp.dataset.r; b.rule = { ...b.rule, [k]: k === "anchor" ? inp.value : +inp.value };
        if (k === "interval" && +inp.value > 1 && !b.rule.anchor) b.rule.anchor = iso(new Date());
        k === "interval" ? redraw() : again();
      }));
      box.querySelectorAll(".addd").forEach((btn) => btn.addEventListener("click", () => {
        const k = btn.dataset.k, v = box.querySelector(`[data-new="${k}"]`).value; if (!v) return;
        b[k] = [...new Set([...(b[k] || []), v])].sort(); redraw();
      }));
      box.querySelectorAll(".rm").forEach((btn) => btn.addEventListener("click", () => { const k = btn.dataset.k; b[k] = (b[k] || []).filter((x) => x !== btn.dataset.d); redraw(); }));
      box.querySelectorAll(".play").forEach((btn) => btn.addEventListener("click", () => {
        const v = b[btn.dataset.k] || ""; if (!b.id) return this._drawSettings(_("Enregistrez d'abord la poubelle pour voir l'animation sur la carte."));
        this._preview = `${b.id}|${v}`; this._key = ""; this._render();
        clearTimeout(this._pt); this._pt = setTimeout(() => { this._preview = ""; this._key = ""; this._render(); }, 8000);
      }));
      const up = box.querySelector(".imgf .up"), file = box.querySelector(".imgf .file");
      if (up) { up.addEventListener("click", () => file.click()); file.addEventListener("change", async () => {
        const f = file.files && file.files[0]; if (!f) return;
        up.disabled = true; up.textContent = _("Envoi…");
        try {
          const fd = new FormData(); fd.append("file", f);
          const r = await fetch("/api/image/upload", { method: "POST", body: fd, headers: { Authorization: `Bearer ${this._hass.auth.data.access_token}` } });
          if (!r.ok) throw new Error(`${r.status}`);
          const j = await r.json(); b.image = `/api/image/serve/${j.id}/512x512`; redraw();
        } catch (e) { this._drawSettings(_("Téléversement impossible : {e}", { e: errText(e) })); }
      }); }
      const del = box.querySelector(".del");
      if (del) del.addEventListener("click", () => {
        if (del.dataset.sure) { d.bins.splice(this._open, 1); this._open = -1; return redraw(); }
        del.dataset.sure = "1"; del.innerHTML = `<ha-icon icon="mdi:alert-outline"></ha-icon>${esc(_("Confirmer la suppression"))}`;
      });
    }
    // enregistre le brouillon (bouton de test) et récupère les identifiants des poubelles nouvellement créées
    async _saveDraft() {
      const d = this._draft, r = await this._hass.callWS({ type: "holm_bins/save", bins: d.bins, settings: d.settings });
      if (r && Array.isArray(r.bins) && r.bins.length === d.bins.length) r.bins.forEach((b, i) => { d.bins[i].id = b.id; });
      return r;
    }
    async _refreshPreview() {
      const b = this._draft.bins[this._open], el = this.shadowRoot.querySelector(".pv"); if (!b || !el) return;
      const seq = (this._pseq = (this._pseq || 0) + 1);
      try {
        const r = await this._hass.callWS({ type: "holm_bins/preview", bin: b, count: 6 });
        if (seq !== this._pseq) return;
        const ok = this.shadowRoot.querySelector(".pv"); if (ok) ok.textContent = r.dates.length ? r.dates.map((x) => fmtDate(x)).join(" · ") : _("aucune");
        const kw = this.shadowRoot.querySelector(".kws");
        if (kw) {
          kw.innerHTML = (r.names || []).length ? `<span class="hint">${esc(_("Événements du calendrier :"))}</span>${r.names.map((n) => `<button class="chip kwc" data-k="${esc(n)}">${esc(n)}</button>`).join("")}` : "";
          kw.querySelectorAll(".kwc").forEach((c) => c.addEventListener("click", () => { b.keyword = c.dataset.k; const i = this.shadowRoot.querySelector('[data-f="keyword"]'); if (i) i.value = b.keyword; const t = this.shadowRoot.querySelector(".acc.open .acch .rt"); if (t) t.textContent = this._ruleText(b); this._refreshPreview(); }));
        }
      } catch (e) { el.textContent = "—"; }
    }
    async _save() {
      const d = this._draft;
      for (const b of d.bins) {
        if (!String(b.name || "").trim()) return this._drawSettings(_("Chaque poubelle doit avoir un nom."));
        if (b.source === "calendar" && !b.calendar) return this._drawSettings(_("Choisissez le calendrier de « {n} ».", { n: b.name }));
        if (b.source === "dates" && !(b.extra || []).length) return this._drawSettings(_("Ajoutez au moins une date pour « {n} ».", { n: b.name }));
        if (b.source === "rule" && (b.rule.interval || 1) > 1 && !b.rule.anchor) return this._drawSettings(_("Indiquez une date de collecte connue pour « {n} ».", { n: b.name }));
      }
      const btn = this.shadowRoot.querySelector(".set .save"); if (btn) { btn.disabled = true; btn.textContent = _("Enregistrement…"); }
      try { await this._hass.callWS({ type: "holm_bins/save", bins: d.bins, settings: d.settings }); this._closeSettings(); }
      catch (e) { this._drawSettings(_("Enregistrement impossible : {e}", { e: errText(e) })); }
    }

    static css() {
      return `
      :host { display:block; }
      ha-card { position:relative; overflow:hidden; padding:8px 10px 10px; border-radius: var(--hb-radius, var(--holm-bins-border-radius, var(--ha-card-border-radius, 12px))); }
      .hd { display:flex; align-items:center; gap:8px; margin:0 4px 4px; }
      /* espacement réduit : moins de marge autour de la carte, du titre et des poubelles */
      ha-card[data-spacing="compact"] { padding:4px 6px 6px; }
      ha-card[data-spacing="compact"] .hd { margin:0 4px 2px; }
      ha-card[data-spacing="compact"] .ttl { font-size:14px; }
      ha-card[data-spacing="compact"] .bins > .gear { top:2px; right:2px; }
      .ttl { flex:1; font-size:15px; font-weight:700; }
      .gear { border:0; background:none; color:inherit; opacity:.55; cursor:pointer; padding:3px; border-radius:50%; }
      .gear:hover { opacity:1; background: rgba(127,127,127,.18); } .gear ha-icon { --mdc-icon-size:18px; display:block; }
      .bins > .gear { position:absolute; top:6px; right:6px; z-index:3; }
      .bins { display:flex; gap:8px; }
      ha-card { container-type: inline-size; }
      ha-card[data-layout="row"] .bins { flex-wrap:wrap; justify-content:space-around; gap:4px; }
      ha-card[data-layout="row"] .bin { flex:1 1 0; min-width:62px; max-width:180px; flex-direction:column; text-align:center; padding:8px 2px 10px; }
      @container (max-width: 340px) {
        ha-card[data-layout="row"] .pic { width:46px; height:52px; --em:17px; }
        ha-card[data-spacing="compact"][data-layout="row"] .pic { width:42px; height:48px; --em:15px; }
        ha-card[data-layout="row"] .when { font-size:12.5px; }
        ha-card[data-layout="row"] .nm { font-size:11px; }
        ha-card[data-layout="row"] .dt { font-size:10px; }
      }
      ha-card[data-layout="list"] .bins { flex-direction:column; }
      ha-card[data-layout="list"] .bin { flex-direction:row; text-align:left; }
      ha-card[data-layout="list"] .pic { width:46px; height:52px; }
      ha-card[data-layout="list"] .txt { flex:1; }
      ha-card[data-layout="compact"] .bins { flex-wrap:wrap; gap:6px; justify-content:center; }
      ha-card[data-layout="compact"] .bin { flex-direction:row; padding:4px 10px 4px 4px; border-radius:22px; gap:6px; }
      ha-card[data-layout="compact"] .pic { width:28px; height:32px; }
      ha-card[data-layout="compact"] .nm, ha-card[data-layout="compact"] .dt, ha-card[data-layout="compact"] .bar { display:none; }
      ha-card[data-layout="compact"] .when { font-size:12px; margin:0; }
      ha-card[data-spacing="compact"][data-layout="row"] .bin { padding:2px 2px 4px; }
      ha-card[data-spacing="compact"][data-layout="row"] .pic { width:52px; height:58px; --em:19px; }
      ha-card[data-spacing="compact"] .bar { margin-top:4px; }
      ha-card[data-spacing="compact"][data-layout="list"] .bin { padding:4px 6px; }
      .bin { position:relative; display:flex; align-items:center; gap:4px 10px; padding:8px 6px 10px; border-radius:16px; cursor:pointer; isolation:isolate;
        transition: background .3s, box-shadow .3s; -webkit-tap-highlight-color: transparent; }
      .bin:hover { background: rgba(127,127,127,.08); }
      .fxh { position:absolute; inset:0; border-radius:inherit; overflow:hidden; z-index:-1; pointer-events:none; }
      .fxh holm-fx-card { position:absolute; inset:0; display:block; }
      .pic { position:relative; width:64px; height:72px; flex:none; }
      .art { width:100%; height:100%; overflow:visible; }
      .art .body { fill: var(--c); }
      .art .light { fill: color-mix(in srgb, var(--c) 82%, #fff); }
      .art .dark { fill: color-mix(in srgb, var(--c) 60%, #000); stroke: color-mix(in srgb, var(--c) 60%, #000); }
      .art .rib { stroke: color-mix(in srgb, var(--c) 72%, #000); stroke-width:2.4; stroke-linecap:round; fill:none; opacity:.7; }
      .art .shine { stroke: rgba(255,255,255,.35); stroke-width:3; stroke-linecap:round; fill:none; }
      .art .rib.soft { opacity:.3; }
      .pic { --em:24px; }
      ha-card[data-layout="list"] .pic { --em:17px; } ha-card[data-layout="compact"] .pic { --em:11px; }
      .emb { position:absolute; left:50%; top:58%; transform: translate(-50%, -50%); --mdc-icon-size: var(--em); display:flex; color: var(--ink, #fff); opacity:.92; pointer-events:none; }
      .emb.low { top:70%; }
      .art .wheel { fill:#20252b; } .art .hub { fill:#9aa4ae; } .art .hole { fill: color-mix(in srgb, var(--c) 45%, #000); }
      .art .sh { fill: rgba(0,0,0,.25); }
      .art .lid { transform-box: fill-box; transform-origin: 0% 100%; transition: transform .4s; }
      .verre .lid, .sac .lid { transform-origin: 50% 100%; }
      .ok { position:absolute; right:-2px; top:4px; width:22px; height:22px; border-radius:50%; background:#2e7d32; color:#fff; display:grid; place-items:center; box-shadow:0 0 0 2px var(--card-background-color,#1c1c1c); }
      .ok ha-icon { --mdc-icon-size:14px; }
      ha-card[data-layout="compact"] .ok { width:14px; height:14px; right:-5px; top:-3px; } ha-card[data-layout="compact"] .ok ha-icon { --mdc-icon-size:10px; }
      ha-card[data-layout="list"] .ok { width:18px; height:18px; } ha-card[data-layout="list"] .ok ha-icon { --mdc-icon-size:12px; }
      .nm { font-size:12px; font-weight:700; color: var(--c); line-height:1.2; filter: brightness(1.15); }
      .when { font-size:14px; font-weight:800; line-height:1.25; margin-top:1px; }
      .dt { display:flex; align-items:center; justify-content:center; gap:3px; font-size:11px; opacity:.72; margin-top:2px; }
      ha-card[data-layout="list"] .dt { justify-content:flex-start; }
      .dt ha-icon { --mdc-icon-size:12px; }
      .bar { height:3px; border-radius:2px; margin:6px auto 0; width:min(100%, 110px); background: color-mix(in srgb, var(--c) 22%, transparent); overflow:hidden; }
      ha-card[data-layout="list"] .bar { margin-left:0; }
      .bar i { display:block; height:100%; background: var(--c); border-radius:2px; transition: width .6s; }
      .st-veille .when, .st-aujourdhui .when { color: var(--c); filter: brightness(1.2); }
      .st-sortie { opacity:.9; } .st-sortie .when { color:#4caf50; }
      .st-plus_tard .pic { opacity:.85; }
      .miss { padding:8px; font-size:13px; opacity:.8; }
      /* ---- animations intégrées ---- */
      .an-pulse { animation: b-pulse 1.8s ease-in-out infinite; }
      @keyframes b-pulse { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--c) 0%, transparent); } 50% { box-shadow: 0 0 0 4px color-mix(in srgb, var(--c) 45%, transparent), 0 0 22px color-mix(in srgb, var(--c) 40%, transparent); } }
      .an-halo .pic::before { content:""; position:absolute; inset:-8px; border-radius:50%; z-index:-1; background: radial-gradient(circle, color-mix(in srgb, var(--c) 70%, transparent), transparent 68%); animation: b-halo 2.6s ease-in-out infinite; }
      @keyframes b-halo { 0%,100% { opacity:.35; transform: scale(.85); } 50% { opacity:1; transform: scale(1.12); } }
      .an-couvercle .lid { animation: b-lid 2.8s ease-in-out infinite; }
      .an-couvercle .verre .lid, .an-couvercle .sac .lid { animation: b-lid2 2.8s ease-in-out infinite; }
      @keyframes b-lid { 0%,55%,100% { transform: rotate(0); } 70%,85% { transform: rotate(-32deg) translateY(-2px); } }
      @keyframes b-lid2 { 0%,55%,100% { transform: translateY(0); } 70%,85% { transform: translateY(-5px); } }
      .an-secousse .art { animation: b-shake 2.2s ease-in-out infinite; transform-origin: 50% 90%; }
      @keyframes b-shake { 0%,60%,100% { transform: rotate(0); } 65% { transform: rotate(-7deg); } 72% { transform: rotate(6deg); } 79% { transform: rotate(-4deg); } 86% { transform: rotate(2deg); } }
      .an-rebond .art { animation: b-bounce 1.6s cubic-bezier(.3,.6,.4,1) infinite; }
      @keyframes b-bounce { 0%,100% { transform: translateY(0) scale(1,1); } 15% { transform: translateY(0) scale(1.06,.94); } 45% { transform: translateY(-9px) scale(.97,1.03); } 70% { transform: translateY(0) scale(1.04,.96); } }
      .an-clignote { box-shadow: inset 0 0 0 2px var(--c); animation: b-blink 1.1s steps(2, jump-none) infinite; }
      @keyframes b-blink { 50% { box-shadow: inset 0 0 0 2px transparent; } }
      .truck { position:absolute; bottom:-2px; left:-30px; --mdc-icon-size:22px; color: var(--c); filter: brightness(1.25); animation: b-truck 4.5s linear infinite; }
      @keyframes b-truck { 0% { transform: translateX(0); opacity:0; } 10% { opacity:1; } 85% { opacity:1; } 100% { transform: translateX(120px); opacity:0; } }
      .an-coche .ok { animation: b-pop 2.4s ease-in-out infinite; }
      .an-coche .pic::after { content:""; position:absolute; inset:-6px; border-radius:50%; border:2px solid #4caf50; opacity:0; animation: b-ring 2.4s ease-out infinite; }
      @keyframes b-pop { 0%,100% { transform: scale(1); } 15% { transform: scale(1.35); } 30% { transform: scale(1); } }
      @keyframes b-ring { 0% { opacity:.8; transform: scale(.7); } 60%,100% { opacity:0; transform: scale(1.25); } }
      @media (prefers-reduced-motion: reduce) { .bin, .bin * { animation: none !important; } }
      /* ---- réglages ---- */
      .set { display:none; margin:10px -12px -12px; padding:10px 12px 12px; border-top:1px solid rgba(127,127,127,.25); background: color-mix(in srgb, var(--card-background-color, #1c1c1c) 92%, #000); }
      .set.on { display:block; }
      .sh { font-size:13px; padding:6px 2px; } .sh.err { color: var(--error-color, #e53935); }
      .tabs { display:flex; gap:6px; margin-bottom:10px; }
      .tab { flex:1; display:flex; align-items:center; justify-content:center; gap:6px; border:0; border-radius:10px; padding:7px; font:inherit; font-weight:700; font-size:13px; cursor:pointer; background: rgba(127,127,127,.12); color:inherit; }
      .tab.on { background: var(--primary-color); color: var(--text-primary-color, #fff); } .tab ha-icon { --mdc-icon-size:17px; }
      .acc { border-radius:12px; background: rgba(127,127,127,.08); margin-bottom:6px; border-left:4px solid var(--c); }
      .acch { display:flex; align-items:center; gap:8px; padding:8px 8px 8px 10px; cursor:pointer; font-size:13.5px; }
      .acch .dot { width:12px; height:12px; border-radius:50%; background: var(--c); flex:none; }
      .acch .rt { flex:1; font-size:11.5px; opacity:.7; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .chev { --mdc-icon-size:18px; opacity:.6; }
      .form { padding:2px 12px 12px; }
      .fl { display:flex; flex-direction:column; gap:4px; font-size:12px; margin:8px 0; }
      .fl > label, .fl > span:first-child { opacity:.8; font-weight:600; }
      .grid2 { display:grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap:0 12px; }
      .grid3 { display:grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap:0 12px; }
      input, select { padding:6px 8px; border-radius:8px; border:1px solid rgba(127,127,127,.35); font:inherit; font-size:13px; background: var(--card-background-color, #fff); color: var(--primary-text-color, #222); min-width:0; }
      select { flex:1; } input[type="color"] { width:38px; height:30px; padding:2px; }
      input[type="checkbox"] { accent-color: var(--primary-color); width:16px; height:16px; }
      .row { display:flex; align-items:center; gap:6px; } .row.end { justify-content:flex-end; margin-top:6px; }
      .pal { display:flex; flex-wrap:wrap; gap:6px; align-items:center; }
      .sw { width:24px; height:24px; border-radius:50%; border:2px solid transparent; cursor:pointer; box-shadow: 0 0 0 1px rgba(127,127,127,.4); }
      .sw.on { border-color: var(--primary-text-color); }
      .seg { display:flex; flex-wrap:wrap; gap:4px; margin:4px 0; }
      .seg button, .days button { border:0; border-radius:8px; padding:6px 10px; font:inherit; font-size:12.5px; cursor:pointer; background: rgba(127,127,127,.14); color:inherit; }
      .seg button.on, .days button.on { background: var(--c, var(--primary-color)); color: var(--ink, #fff); font-weight:700; }
      .days { display:flex; flex-wrap:wrap; gap:4px; } .days button { min-width:34px; padding:6px 0; text-transform:capitalize; }
      .months button { min-width:44px; padding:5px 0; }
      .chips { display:flex; flex-wrap:wrap; gap:5px; align-items:center; }
      .chip { display:inline-flex; align-items:center; gap:5px; padding:4px 9px; border-radius:14px; background: rgba(127,127,127,.14); font-size:12px; cursor:pointer; }
      .chip.on { background: color-mix(in srgb, var(--primary-color) 30%, transparent); }
      .chip input { width:14px; height:14px; margin:0; } .dch { padding-right:3px; cursor:default; }
      .ck { display:flex; align-items:center; gap:7px; font-size:13px; margin:8px 0; cursor:pointer; } .ck ha-icon { --mdc-icon-size:17px; opacity:.8; }
      .ib { border:0; background:none; color:inherit; cursor:pointer; padding:3px; border-radius:50%; opacity:.75; display:inline-grid; place-items:center; }
      .ib:hover { opacity:1; background: rgba(127,127,127,.18); } .ib:disabled { opacity:.2; cursor:default; } .ib ha-icon { --mdc-icon-size:17px; display:block; }
      .play ha-icon { --mdc-icon-size:22px; color: var(--c); }
      .prev { display:flex; flex-wrap:wrap; align-items:center; gap:6px; font-size:12px; padding:8px 10px; border-radius:10px; background: color-mix(in srgb, var(--c) 14%, transparent); margin-top:6px; }
      .prev ha-icon { --mdc-icon-size:16px; color: var(--c); } .prev span:nth-child(2) { font-weight:700; } .pv { opacity:.9; }
      .sep { height:1px; background: rgba(127,127,127,.2); margin:10px 0 2px; }
      .hint { font-size:11.5px; opacity:.7; margin:4px 0 8px; line-height:1.4; }
      .hint.row { display:flex; flex-wrap:wrap; align-items:center; gap:6px; } .hint.nb { margin:0 12px 8px; }
      .lnk { border:0; background:none; color: var(--primary-color); font:inherit; font-weight:700; cursor:pointer; padding:0; text-decoration:underline; }
      .kws { margin:-2px 0 6px; } .kws .hint { margin:0 4px 0 0; } .kwc { border:0; font:inherit; font-size:12px; color:inherit; }
      textarea { padding:6px 8px; border-radius:8px; border:1px solid rgba(127,127,127,.35); font:inherit; font-size:13px; background: var(--card-background-color, #fff); color: var(--primary-text-color, #222); resize:vertical; width:100%; box-sizing:border-box; }
      .add { display:inline-flex; align-items:center; gap:5px; border:0; border-radius:10px; padding:7px 12px; font:inherit; font-size:12.5px; font-weight:600; cursor:pointer; background: rgba(127,127,127,.14); color:inherit; margin-top:4px; }
      .add ha-icon, .acts ha-icon, .del ha-icon { --mdc-icon-size:16px; }
      .imgrow { display:flex; gap:10px; align-items:flex-start; margin-top:6px; }
      .imgprev { width:56px; height:62px; object-fit:contain; border-radius:10px; background: rgba(127,127,127,.12); flex:none; display:grid; place-items:center; }
      .imgprev.none ha-icon { --mdc-icon-size:26px; opacity:.5; }
      .imgf { flex:1; display:flex; flex-direction:column; gap:6px; } .imgf .add { margin:0; }
      .art.img { object-fit:contain; display:block; filter: drop-shadow(0 3px 3px rgba(0,0,0,.3)); }
      .an-couvercle .art.img { animation: b-tilt 2.8s ease-in-out infinite; transform-origin: 50% 100%; }
      @keyframes b-tilt { 0%,55%,100% { transform: rotate(0); } 70% { transform: rotate(-6deg) translateY(-2px); } 85% { transform: rotate(4deg); } }
      .camres { display:flex; gap:10px; align-items:flex-start; margin-top:10px; padding:8px; border-radius:10px; background: rgba(127,127,127,.1); font-size:12.5px; line-height:1.5; }
      .camres img { width:140px; border-radius:8px; flex:none; }
      .okc { color:#4caf50; } .bad { color: var(--warning-color, #ffa000); }
      .del { display:inline-flex; align-items:center; gap:5px; border:0; border-radius:10px; padding:6px 10px; font:inherit; font-size:12px; cursor:pointer; background: color-mix(in srgb, var(--error-color, #e53935) 18%, transparent); color: var(--error-color, #e53935); }
      .msg { margin-top:8px; font-size:12.5px; color: var(--warning-color, #ffa000); }
      .acts { display:flex; justify-content:flex-end; gap:8px; margin-top:12px; }
      .acts button { border:0; border-radius:10px; padding:7px 14px; font:inherit; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:5px; }
      .acts .cancel { background: rgba(127,127,127,.15); color:inherit; } .acts .save { background: var(--primary-color); color: var(--text-primary-color, #fff); }
      .acts button:disabled { opacity:.6; }`;
    }
  }

  // ======================================================================
  const locSchema = (sc) => (sc || []).map((x) => { const o = { ...x }; if (o.title) o.title = _(o.title); if (o.schema) o.schema = locSchema(o.schema);
    if (o.selector && o.selector.select && o.name !== "language") o.selector = { ...o.selector, select: { ...o.selector.select, options: (o.selector.select.options || []).map((op) => (typeof op === "string" ? op : { ...op, label: _(op.label) })) } };
    return o; });

  class HolmBinsCardEditor extends HTMLElement {
    setConfig(c) { this._config = { ...c }; this._update(); }
    set hass(h) { this._hass = h; this._update(); }
    _update() {
      if (!this._hass || !this._config) return;
      { const l = setLang(this._hass, this._config); if (this._form && l !== this._lang) { this._form.remove(); this._form = null; } this._lang = l; }
      const bins = Object.entries(this._hass.states).filter(([k, s]) => k.startsWith("sensor.") && s.attributes && s.attributes.holm_bins).map(([, s]) => s);
      const sig = bins.map((b) => b.attributes.holm_bins).join(",");
      if (this._form && sig !== this._sig) { this._form.remove(); this._form = null; }
      this._sig = sig;
      if (!this._form) {
        this._form = document.createElement("ha-form");
        this._form.schema = locSchema([
          langField(),
          { name: "title", selector: { text: {} } },
          { name: "background", selector: { text: {} } },
          { type: "grid", name: "", schema: [{ name: "border_radius", selector: { text: {} } },
            { name: "spacing", selector: { select: { mode: "dropdown", options: [{ value: "normal", label: "Normal" }, { value: "compact", label: "Réduit (gain de place)" }] } } }] },
          { name: "layout", selector: { select: { mode: "dropdown", options: [{ value: "row", label: "En rangée" }, { value: "list", label: "En liste" }, { value: "compact", label: "Compacte (pastilles)" }] } } },
          { name: "bins", selector: { select: { multiple: true, mode: "list", options: bins.map((b) => ({ value: b.attributes.holm_bins, label: b.attributes.nom })) } } },
          { name: "sort", selector: { select: { mode: "dropdown", options: [{ value: "", label: "Ordre des réglages" }, { value: "date", label: "Prochaine collecte d'abord" }] } } },
          { name: "hide_after", selector: { number: { min: 0, max: 60, mode: "box", unit_of_measurement: "j" } } },
          { name: "tap_action", selector: { select: { mode: "dropdown", options: [{ value: "out", label: "Marquer sortie (veille, jour J), sinon détails" }, { value: "more-info", label: "Toujours ouvrir les détails" }, { value: "none", label: "Aucune action" }] } } },
          { type: "grid", name: "", schema: [{ name: "show_date", selector: { boolean: {} } }, { name: "show_progress", selector: { boolean: {} } }, { name: "fx", selector: { boolean: {} } }, { name: "show_settings", selector: { boolean: {} } }] },
        ]);
        const L = { language: "Langue", title: "Titre (optionnel)", layout: "Disposition", bins: "Poubelles affichées (aucune = toutes)", sort: "Ordre",
          hide_after: "Masquer les collectes au-delà de (0 = jamais)", background: "Fond de la carte (couleur ou variable de thème)", tap_action: "Appui sur une poubelle", show_date: "Afficher la date", show_progress: "Barre d'approche de la collecte",
          fx: "Ambiances HOLM FX", show_settings: "Bouton Réglages (administrateurs)",
          border_radius: "Arrondi des bords (ex. 16px ; vide = celui du thème)", spacing: "Espacement" };
        this._form.computeLabel = (s) => (L[s.name] ? _(L[s.name]) : s.name);
        this._form.addEventListener("value-changed", (ev) => {
          const out = { ...this._config, ...ev.detail.value };
          for (const [k, v] of Object.entries(out)) if (v === "" || v === undefined || v === null || (Array.isArray(v) && !v.length)) delete out[k];
          const defs = { layout: "row", spacing: "normal", show_date: true, show_progress: true, show_settings: true, fx: true, tap_action: "out", hide_after: 0 };
          for (const [k, v] of Object.entries(defs)) if (out[k] === v) delete out[k];
          this._config = out;
          this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: out }, bubbles: true, composed: true }));
        });
        this.appendChild(this._form);
      }
      this._form.hass = this._hass;
      this._form.data = { layout: "row", spacing: "normal", show_date: true, show_progress: true, show_settings: true, fx: true, tap_action: "out", hide_after: 0, sort: "", ...this._config };
    }
  }

  if (!customElements.get("holm-bins-card")) customElements.define("holm-bins-card", HolmBinsCard);
  if (!customElements.get("holm-bins-card-editor")) customElements.define("holm-bins-card-editor", HolmBinsCardEditor);
  window.customCards = window.customCards || [];
  if (!window.customCards.some((c) => c.type === "holm-bins-card")) {
    setLang(document.querySelector("home-assistant")?.hass);
    window.customCards.push({ type: "holm-bins-card", name: _("HOLM Poubelles"), description: _("Prochaines collectes, rappels « à sortir » et animations par poubelle, avec réglage des dates depuis la carte."), preview: true });
  }
  console.info(`%c HOLM-POUBELLES %c ${VERSION} `, "background:#43a047;color:#fff;border-radius:3px 0 0 3px", "background:#123;color:#fff;border-radius:0 3px 3px 0");
})();
