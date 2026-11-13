/*
 * UPS Card for Home Assistant
 * https://github.com/juju35/ha-ups-card
 *
 * Lovelace cards for uninterruptible power supplies, on top of Network UPS Tools
 * (https://www.home-assistant.io/integrations/nut/), APC UPS Daemon (https://www.home-assistant.io/integrations/apcupsd/)
 * or any sensors given in the card options. Entities of the integrations are resolved through the entity and device
 * registries (platform, translation_key and device), so they work whatever the Home Assistant language or entity ids.
 */

const VERSION = "__VERSION__";
const IMG_NUT = "__IMG_NUT__";
const IMG_APC = "__IMG_APC__";

const STRINGS = {
  en: {
    state_online: "On mains",
    state_charging: "Charging",
    state_on_battery: "On battery",
    state_low_battery: "Low battery",
    state_overload: "Overload",
    state_bypass: "Bypass",
    state_calibrating: "Calibrating",
    state_test: "Battery test",
    state_shutdown: "Shutting down",
    state_offline: "Offline",
    state_unknown: "Unknown",
    battery: "Battery",
    charge: "Charge",
    runtime: "Runtime",
    runtime_left: "{time} left",
    load: "Load",
    input_voltage: "Input",
    output_voltage: "Output",
    power: "Power",
    apparent_power: "Apparent power",
    frequency: "Frequency",
    temperature: "Temperature",
    battery_voltage: "Battery voltage",
    battery_temperature: "Battery temperature",
    battery_date: "Battery installed",
    replace_by: "Replace by",
    self_test: "Self-test",
    section_power: "Power",
    section_battery: "Battery",
    section_outages: "Outages",
    outages_n_days: "Outages ({days} d)",
    time_on_battery: "Time on battery",
    longest: "Longest",
    no_outage: "No outage in the last {days} days",
    history_loading: "Loading history…",
    history_error: "History unavailable",
    ongoing: "ongoing",
    last_transfer: "Last transfer",
    transfers: "Transfers",
    alert_on_battery: "Running on battery",
    alert_on_battery_for: "On battery for {time}",
    alert_low_battery: "Battery low: shutdown imminent",
    alert_overload: "Overload: reduce the connected load",
    alert_replace: "The battery needs replacing",
    alert_replace_due: "Battery replacement due {date}",
    alert_offline: "No communication with the UPS",
    alert_output_off: "UPS output off: the connected devices get no power",
    alert_no_battery: "No battery detected",
    alert_alarm: "The UPS reports an alarm",
    alert_shutdown: "Forced shutdown in progress",
    alert_high_load: "High load: {pct}",
    no_device: "No UPS found. Set up Network UPS Tools (NUT) or APC UPS Daemon, or give the card entities of your own.",
    unknown_device: "UPS not found",
    no_registry: "This card needs Home Assistant 2024.8 or later.",
    generic_name: "UPS",
    device: "UPS",
    device_none: "None (entities below only)",
    device_helper: "UPS of the NUT or APC UPS Daemon integration",
    title: "Title (optional, defaults to the device name)",
    show_title: "Show title",
    show_subtitle: "Show subtitle",
    show_alerts: "Show alerts",
    show_power: "Show power",
    show_battery: "Show battery",
    show_outages: "Show outage history",
    collapsed: "Sections folded by default",
    history_days: "Outage history",
    max_outages: "Outages listed",
    low_runtime: "Low runtime threshold",
    battery_life: "Battery life",
    battery_replaced: "Battery installed on (optional)",
    entities: "Entities (generic sensors or replacements)",
    e_status: "Status",
    e_online: "Mains power (binary sensor, on = mains)",
    e_battery: "Battery charge",
    e_runtime: "Runtime",
    e_load: "Load",
    e_input_voltage: "Input voltage",
    e_output_voltage: "Output voltage",
    e_power: "Power",
    e_temperature: "Temperature",
    e_battery_voltage: "Battery voltage",
    e_frequency: "Frequency",
    e_battery_date: "Battery date",
    unit_days: "days",
    unit_years: "years",
    language: "Language",
    lang_auto: "Automatic",
    zoom: "Detail button",
    zoom_helper: "Button at the top right that switches the mini card to the full card and back",
    zoom_in: "Show the full card",
    zoom_out: "Show the compact card",
  },
  fr: {
    state_online: "Sur secteur",
    state_charging: "En charge",
    state_on_battery: "Sur batterie",
    state_low_battery: "Batterie faible",
    state_overload: "Surcharge",
    state_bypass: "Bypass",
    state_calibrating: "Calibrage",
    state_test: "Test batterie",
    state_shutdown: "Arrêt en cours",
    state_offline: "Hors ligne",
    state_unknown: "Inconnu",
    battery: "Batterie",
    charge: "Charge",
    runtime: "Autonomie",
    runtime_left: "{time} restantes",
    load: "Charge",
    input_voltage: "Entrée",
    output_voltage: "Sortie",
    power: "Puissance",
    apparent_power: "Puissance apparente",
    frequency: "Fréquence",
    temperature: "Température",
    battery_voltage: "Tension batterie",
    battery_temperature: "Température batterie",
    battery_date: "Batterie installée",
    replace_by: "À remplacer avant",
    self_test: "Autotest",
    section_power: "Alimentation",
    section_battery: "Batterie",
    section_outages: "Coupures",
    outages_n_days: "Coupures ({days} j)",
    time_on_battery: "Temps sur batterie",
    longest: "La plus longue",
    no_outage: "Aucune coupure ces {days} derniers jours",
    history_loading: "Chargement de l'historique…",
    history_error: "Historique indisponible",
    ongoing: "en cours",
    last_transfer: "Dernier basculement",
    transfers: "Basculements",
    alert_on_battery: "Fonctionne sur batterie",
    alert_on_battery_for: "Sur batterie depuis {time}",
    alert_low_battery: "Batterie faible : arrêt imminent",
    alert_overload: "Surcharge : réduisez les appareils branchés",
    alert_replace: "La batterie doit être remplacée",
    alert_replace_due: "Remplacement de la batterie prévu le {date}",
    alert_offline: "Pas de communication avec l'onduleur",
    alert_output_off: "Sortie de l'onduleur coupée : les appareils ne sont plus alimentés",
    alert_no_battery: "Aucune batterie détectée",
    alert_alarm: "L'onduleur signale une alarme",
    alert_shutdown: "Arrêt forcé en cours",
    alert_high_load: "Charge élevée : {pct}",
    no_device: "Aucun onduleur trouvé. Configurez Network UPS Tools (NUT) ou APC UPS Daemon, ou indiquez vos propres entités à la carte.",
    unknown_device: "Onduleur introuvable",
    no_registry: "Cette carte nécessite Home Assistant 2024.8 ou plus récent.",
    generic_name: "Onduleur",
    device: "Onduleur",
    device_none: "Aucun (entités ci-dessous uniquement)",
    device_helper: "Onduleur de l'intégration NUT ou APC UPS Daemon",
    title: "Titre (facultatif, nom de l'appareil par défaut)",
    show_title: "Afficher le titre",
    show_subtitle: "Afficher le sous-titre",
    show_alerts: "Afficher les alertes",
    show_power: "Afficher l'alimentation",
    show_battery: "Afficher la batterie",
    show_outages: "Afficher l'historique des coupures",
    collapsed: "Sections repliées par défaut",
    history_days: "Historique des coupures",
    max_outages: "Coupures listées",
    low_runtime: "Seuil d'autonomie faible",
    battery_life: "Durée de vie de la batterie",
    battery_replaced: "Batterie installée le (facultatif)",
    entities: "Entités (capteurs génériques ou remplacements)",
    e_status: "État",
    e_online: "Secteur (capteur binaire, activé = secteur)",
    e_battery: "Charge de la batterie",
    e_runtime: "Autonomie",
    e_load: "Charge",
    e_input_voltage: "Tension d'entrée",
    e_output_voltage: "Tension de sortie",
    e_power: "Puissance",
    e_temperature: "Température",
    e_battery_voltage: "Tension batterie",
    e_frequency: "Fréquence",
    e_battery_date: "Date de la batterie",
    unit_days: "jours",
    unit_years: "ans",
    language: "Langue",
    lang_auto: "Automatique",
    zoom: "Bouton détail",
    zoom_helper: "Bouton en haut à droite qui bascule la mini-carte vers la carte complète et inversement",
    zoom_in: "Afficher la carte complète",
    zoom_out: "Afficher la carte compacte",
  },
  de: {
    state_online: "Netzbetrieb",
    state_charging: "Lädt",
    state_on_battery: "Batteriebetrieb",
    state_low_battery: "Batterie schwach",
    state_overload: "Überlast",
    state_bypass: "Bypass",
    state_calibrating: "Kalibrierung",
    state_test: "Batterietest",
    state_shutdown: "Fährt herunter",
    state_offline: "Offline",
    state_unknown: "Unbekannt",
    battery: "Batterie",
    charge: "Ladung",
    runtime: "Laufzeit",
    runtime_left: "noch {time}",
    load: "Last",
    input_voltage: "Eingang",
    output_voltage: "Ausgang",
    power: "Leistung",
    apparent_power: "Scheinleistung",
    frequency: "Frequenz",
    temperature: "Temperatur",
    battery_voltage: "Batteriespannung",
    battery_temperature: "Batterietemperatur",
    battery_date: "Batterie eingesetzt",
    replace_by: "Tauschen bis",
    self_test: "Selbsttest",
    section_power: "Stromversorgung",
    section_battery: "Batterie",
    section_outages: "Stromausfälle",
    outages_n_days: "Ausfälle ({days} T.)",
    time_on_battery: "Zeit auf Batterie",
    longest: "Längster",
    no_outage: "Kein Ausfall in den letzten {days} Tagen",
    history_loading: "Verlauf wird geladen…",
    history_error: "Verlauf nicht verfügbar",
    ongoing: "läuft",
    last_transfer: "Letzte Umschaltung",
    transfers: "Umschaltungen",
    alert_on_battery: "Läuft auf Batterie",
    alert_on_battery_for: "Seit {time} auf Batterie",
    alert_low_battery: "Batterie schwach: Abschaltung steht bevor",
    alert_overload: "Überlast: angeschlossene Last verringern",
    alert_replace: "Die Batterie muss getauscht werden",
    alert_replace_due: "Batterietausch fällig am {date}",
    alert_offline: "Keine Verbindung zur USV",
    alert_output_off: "USV-Ausgang aus: die angeschlossenen Geräte werden nicht versorgt",
    alert_no_battery: "Keine Batterie erkannt",
    alert_alarm: "Die USV meldet einen Alarm",
    alert_shutdown: "Erzwungene Abschaltung läuft",
    alert_high_load: "Hohe Last: {pct}",
    no_device: "Keine USV gefunden. Richte Network UPS Tools (NUT) oder APC UPS Daemon ein oder gib der Karte eigene Entitäten.",
    unknown_device: "USV nicht gefunden",
    no_registry: "Diese Karte benötigt Home Assistant 2024.8 oder neuer.",
    generic_name: "USV",
    device: "USV",
    device_none: "Keine (nur Entitäten unten)",
    device_helper: "USV der Integration NUT oder APC UPS Daemon",
    title: "Titel (optional, standardmäßig der Gerätename)",
    show_title: "Titel anzeigen",
    show_subtitle: "Untertitel anzeigen",
    show_alerts: "Warnungen anzeigen",
    show_power: "Stromversorgung anzeigen",
    show_battery: "Batterie anzeigen",
    show_outages: "Ausfallverlauf anzeigen",
    collapsed: "Standardmäßig eingeklappte Bereiche",
    history_days: "Ausfallverlauf",
    max_outages: "Aufgelistete Ausfälle",
    low_runtime: "Schwelle geringe Laufzeit",
    battery_life: "Batterielebensdauer",
    battery_replaced: "Batterie eingesetzt am (optional)",
    entities: "Entitäten (generische Sensoren oder Ersatz)",
    e_status: "Status",
    e_online: "Netzstrom (Binärsensor, an = Netz)",
    e_battery: "Batterieladung",
    e_runtime: "Laufzeit",
    e_load: "Last",
    e_input_voltage: "Eingangsspannung",
    e_output_voltage: "Ausgangsspannung",
    e_power: "Leistung",
    e_temperature: "Temperatur",
    e_battery_voltage: "Batteriespannung",
    e_frequency: "Frequenz",
    e_battery_date: "Batteriedatum",
    unit_days: "Tage",
    unit_years: "Jahre",
    language: "Sprache",
    lang_auto: "Automatisch",
    zoom: "Detailschaltfläche",
    zoom_helper: "Schaltfläche oben rechts, die die Mini-Karte zur vollständigen Karte umschaltet und zurück",
    zoom_in: "Vollständige Karte anzeigen",
    zoom_out: "Kompakte Karte anzeigen",
  },
  es: {
    state_online: "Con red eléctrica",
    state_charging: "Cargando",
    state_on_battery: "En batería",
    state_low_battery: "Batería baja",
    state_overload: "Sobrecarga",
    state_bypass: "Bypass",
    state_calibrating: "Calibrando",
    state_test: "Prueba de batería",
    state_shutdown: "Apagándose",
    state_offline: "Sin conexión",
    state_unknown: "Desconocido",
    battery: "Batería",
    charge: "Carga",
    runtime: "Autonomía",
    runtime_left: "quedan {time}",
    load: "Carga",
    input_voltage: "Entrada",
    output_voltage: "Salida",
    power: "Potencia",
    apparent_power: "Potencia aparente",
    frequency: "Frecuencia",
    temperature: "Temperatura",
    battery_voltage: "Tensión de batería",
    battery_temperature: "Temperatura de batería",
    battery_date: "Batería instalada",
    replace_by: "Sustituir antes de",
    self_test: "Autoprueba",
    section_power: "Alimentación",
    section_battery: "Batería",
    section_outages: "Cortes",
    outages_n_days: "Cortes ({days} d)",
    time_on_battery: "Tiempo en batería",
    longest: "El más largo",
    no_outage: "Ningún corte en los últimos {days} días",
    history_loading: "Cargando historial…",
    history_error: "Historial no disponible",
    ongoing: "en curso",
    last_transfer: "Última conmutación",
    transfers: "Conmutaciones",
    alert_on_battery: "Funcionando con batería",
    alert_on_battery_for: "En batería desde hace {time}",
    alert_low_battery: "Batería baja: apagado inminente",
    alert_overload: "Sobrecarga: reduzca los equipos conectados",
    alert_replace: "Hay que sustituir la batería",
    alert_replace_due: "Sustitución de la batería prevista el {date}",
    alert_offline: "Sin comunicación con el SAI",
    alert_output_off: "Salida del SAI apagada: los equipos conectados no reciben energía",
    alert_no_battery: "No se detecta ninguna batería",
    alert_alarm: "El SAI indica una alarma",
    alert_shutdown: "Apagado forzado en curso",
    alert_high_load: "Carga alta: {pct}",
    no_device: "No se encontró ningún SAI. Configure Network UPS Tools (NUT) o APC UPS Daemon, o indique entidades propias a la tarjeta.",
    unknown_device: "SAI no encontrado",
    no_registry: "Esta tarjeta necesita Home Assistant 2024.8 o posterior.",
    generic_name: "SAI",
    device: "SAI",
    device_none: "Ninguno (solo las entidades de abajo)",
    device_helper: "SAI de la integración NUT o APC UPS Daemon",
    title: "Título (opcional, por defecto el nombre del dispositivo)",
    show_title: "Mostrar título",
    show_subtitle: "Mostrar subtítulo",
    show_alerts: "Mostrar alertas",
    show_power: "Mostrar alimentación",
    show_battery: "Mostrar batería",
    show_outages: "Mostrar historial de cortes",
    collapsed: "Secciones plegadas por defecto",
    history_days: "Historial de cortes",
    max_outages: "Cortes listados",
    low_runtime: "Umbral de autonomía baja",
    battery_life: "Vida útil de la batería",
    battery_replaced: "Batería instalada el (opcional)",
    entities: "Entidades (sensores genéricos o sustituciones)",
    e_status: "Estado",
    e_online: "Red eléctrica (sensor binario, encendido = red)",
    e_battery: "Carga de la batería",
    e_runtime: "Autonomía",
    e_load: "Carga",
    e_input_voltage: "Tensión de entrada",
    e_output_voltage: "Tensión de salida",
    e_power: "Potencia",
    e_temperature: "Temperatura",
    e_battery_voltage: "Tensión de batería",
    e_frequency: "Frecuencia",
    e_battery_date: "Fecha de la batería",
    unit_days: "días",
    unit_years: "años",
    language: "Idioma",
    lang_auto: "Automático",
    zoom: "Botón de detalle",
    zoom_helper: "Botón arriba a la derecha que cambia la minitarjeta a la tarjeta completa y viceversa",
    zoom_in: "Mostrar la tarjeta completa",
    zoom_out: "Mostrar la tarjeta compacta",
  },
  it: {
    state_online: "Da rete",
    state_charging: "In carica",
    state_on_battery: "A batteria",
    state_low_battery: "Batteria scarica",
    state_overload: "Sovraccarico",
    state_bypass: "Bypass",
    state_calibrating: "Calibrazione",
    state_test: "Test batteria",
    state_shutdown: "Spegnimento",
    state_offline: "Non in linea",
    state_unknown: "Sconosciuto",
    battery: "Batteria",
    charge: "Carica",
    runtime: "Autonomia",
    runtime_left: "{time} rimanenti",
    load: "Carico",
    input_voltage: "Ingresso",
    output_voltage: "Uscita",
    power: "Potenza",
    apparent_power: "Potenza apparente",
    frequency: "Frequenza",
    temperature: "Temperatura",
    battery_voltage: "Tensione batteria",
    battery_temperature: "Temperatura batteria",
    battery_date: "Batteria installata",
    replace_by: "Sostituire entro",
    self_test: "Autotest",
    section_power: "Alimentazione",
    section_battery: "Batteria",
    section_outages: "Interruzioni",
    outages_n_days: "Interruzioni ({days} g)",
    time_on_battery: "Tempo a batteria",
    longest: "La più lunga",
    no_outage: "Nessuna interruzione negli ultimi {days} giorni",
    history_loading: "Caricamento cronologia…",
    history_error: "Cronologia non disponibile",
    ongoing: "in corso",
    last_transfer: "Ultima commutazione",
    transfers: "Commutazioni",
    alert_on_battery: "Funzionamento a batteria",
    alert_on_battery_for: "A batteria da {time}",
    alert_low_battery: "Batteria scarica: spegnimento imminente",
    alert_overload: "Sovraccarico: ridurre il carico collegato",
    alert_replace: "La batteria va sostituita",
    alert_replace_due: "Sostituzione batteria prevista il {date}",
    alert_offline: "Nessuna comunicazione con l'UPS",
    alert_output_off: "Uscita dell'UPS spenta: i dispositivi collegati non sono alimentati",
    alert_no_battery: "Nessuna batteria rilevata",
    alert_alarm: "L'UPS segnala un allarme",
    alert_shutdown: "Spegnimento forzato in corso",
    alert_high_load: "Carico elevato: {pct}",
    no_device: "Nessun UPS trovato. Configura Network UPS Tools (NUT) o APC UPS Daemon, oppure indica entità tue alla scheda.",
    unknown_device: "UPS non trovato",
    no_registry: "Questa scheda richiede Home Assistant 2024.8 o successivo.",
    generic_name: "UPS",
    device: "UPS",
    device_none: "Nessuno (solo le entità sotto)",
    device_helper: "UPS dell'integrazione NUT o APC UPS Daemon",
    title: "Titolo (facoltativo, predefinito il nome del dispositivo)",
    show_title: "Mostra titolo",
    show_subtitle: "Mostra sottotitolo",
    show_alerts: "Mostra avvisi",
    show_power: "Mostra alimentazione",
    show_battery: "Mostra batteria",
    show_outages: "Mostra cronologia interruzioni",
    collapsed: "Sezioni chiuse per impostazione predefinita",
    history_days: "Cronologia interruzioni",
    max_outages: "Interruzioni elencate",
    low_runtime: "Soglia autonomia bassa",
    battery_life: "Durata della batteria",
    battery_replaced: "Batteria installata il (facoltativo)",
    entities: "Entità (sensori generici o sostituzioni)",
    e_status: "Stato",
    e_online: "Rete elettrica (sensore binario, acceso = rete)",
    e_battery: "Carica batteria",
    e_runtime: "Autonomia",
    e_load: "Carico",
    e_input_voltage: "Tensione d'ingresso",
    e_output_voltage: "Tensione d'uscita",
    e_power: "Potenza",
    e_temperature: "Temperatura",
    e_battery_voltage: "Tensione batteria",
    e_frequency: "Frequenza",
    e_battery_date: "Data batteria",
    unit_days: "giorni",
    unit_years: "anni",
    language: "Lingua",
    lang_auto: "Automatica",
    zoom: "Pulsante dettaglio",
    zoom_helper: "Pulsante in alto a destra che passa dalla mini scheda alla scheda completa e viceversa",
    zoom_in: "Mostra la scheda completa",
    zoom_out: "Mostra la scheda compatta",
  },
  nl: {
    state_online: "Op netstroom",
    state_charging: "Laden",
    state_on_battery: "Op batterij",
    state_low_battery: "Batterij bijna leeg",
    state_overload: "Overbelast",
    state_bypass: "Bypass",
    state_calibrating: "Kalibreren",
    state_test: "Batterijtest",
    state_shutdown: "Wordt uitgeschakeld",
    state_offline: "Offline",
    state_unknown: "Onbekend",
    battery: "Batterij",
    charge: "Lading",
    runtime: "Looptijd",
    runtime_left: "nog {time}",
    load: "Belasting",
    input_voltage: "Ingang",
    output_voltage: "Uitgang",
    power: "Vermogen",
    apparent_power: "Schijnbaar vermogen",
    frequency: "Frequentie",
    temperature: "Temperatuur",
    battery_voltage: "Batterijspanning",
    battery_temperature: "Batterijtemperatuur",
    battery_date: "Batterij geplaatst",
    replace_by: "Vervangen vóór",
    self_test: "Zelftest",
    section_power: "Voeding",
    section_battery: "Batterij",
    section_outages: "Stroomuitval",
    outages_n_days: "Uitval ({days} d)",
    time_on_battery: "Tijd op batterij",
    longest: "Langste",
    no_outage: "Geen uitval in de afgelopen {days} dagen",
    history_loading: "Geschiedenis laden…",
    history_error: "Geschiedenis niet beschikbaar",
    ongoing: "bezig",
    last_transfer: "Laatste omschakeling",
    transfers: "Omschakelingen",
    alert_on_battery: "Draait op batterij",
    alert_on_battery_for: "Al {time} op batterij",
    alert_low_battery: "Batterij bijna leeg: uitschakeling dreigt",
    alert_overload: "Overbelast: verminder de aangesloten belasting",
    alert_replace: "De batterij moet vervangen worden",
    alert_replace_due: "Batterij vervangen op {date}",
    alert_offline: "Geen verbinding met de UPS",
    alert_output_off: "UPS-uitgang uit: de aangesloten apparaten krijgen geen stroom",
    alert_no_battery: "Geen batterij gedetecteerd",
    alert_alarm: "De UPS meldt een alarm",
    alert_shutdown: "Geforceerde uitschakeling bezig",
    alert_high_load: "Hoge belasting: {pct}",
    no_device: "Geen UPS gevonden. Stel Network UPS Tools (NUT) of APC UPS Daemon in, of geef de kaart eigen entiteiten.",
    unknown_device: "UPS niet gevonden",
    no_registry: "Deze kaart vereist Home Assistant 2024.8 of nieuwer.",
    generic_name: "UPS",
    device: "UPS",
    device_none: "Geen (alleen de entiteiten hieronder)",
    device_helper: "UPS van de integratie NUT of APC UPS Daemon",
    title: "Titel (optioneel, standaard de apparaatnaam)",
    show_title: "Titel tonen",
    show_subtitle: "Ondertitel tonen",
    show_alerts: "Waarschuwingen tonen",
    show_power: "Voeding tonen",
    show_battery: "Batterij tonen",
    show_outages: "Uitvalgeschiedenis tonen",
    collapsed: "Standaard ingeklapte secties",
    history_days: "Uitvalgeschiedenis",
    max_outages: "Getoonde uitval",
    low_runtime: "Drempel lage looptijd",
    battery_life: "Levensduur batterij",
    battery_replaced: "Batterij geplaatst op (optioneel)",
    entities: "Entiteiten (generieke sensoren of vervangingen)",
    e_status: "Status",
    e_online: "Netstroom (binaire sensor, aan = net)",
    e_battery: "Batterijlading",
    e_runtime: "Looptijd",
    e_load: "Belasting",
    e_input_voltage: "Ingangsspanning",
    e_output_voltage: "Uitgangsspanning",
    e_power: "Vermogen",
    e_temperature: "Temperatuur",
    e_battery_voltage: "Batterijspanning",
    e_frequency: "Frequentie",
    e_battery_date: "Batterijdatum",
    unit_days: "dagen",
    unit_years: "jaar",
    language: "Taal",
    lang_auto: "Automatisch",
    zoom: "Detailknop",
    zoom_helper: "Knop rechtsboven die de minikaart naar de volledige kaart wisselt en terug",
    zoom_in: "Volledige kaart tonen",
    zoom_out: "Compacte kaart tonen",
  },
  pt: {
    state_online: "Na rede elétrica",
    state_charging: "A carregar",
    state_on_battery: "Em bateria",
    state_low_battery: "Bateria fraca",
    state_overload: "Sobrecarga",
    state_bypass: "Bypass",
    state_calibrating: "A calibrar",
    state_test: "Teste de bateria",
    state_shutdown: "A encerrar",
    state_offline: "Offline",
    state_unknown: "Desconhecido",
    battery: "Bateria",
    charge: "Carga",
    runtime: "Autonomia",
    runtime_left: "faltam {time}",
    load: "Carga",
    input_voltage: "Entrada",
    output_voltage: "Saída",
    power: "Potência",
    apparent_power: "Potência aparente",
    frequency: "Frequência",
    temperature: "Temperatura",
    battery_voltage: "Tensão da bateria",
    battery_temperature: "Temperatura da bateria",
    battery_date: "Bateria instalada",
    replace_by: "Substituir até",
    self_test: "Autoteste",
    section_power: "Alimentação",
    section_battery: "Bateria",
    section_outages: "Falhas de energia",
    outages_n_days: "Falhas ({days} d)",
    time_on_battery: "Tempo em bateria",
    longest: "A mais longa",
    no_outage: "Nenhuma falha nos últimos {days} dias",
    history_loading: "A carregar o histórico…",
    history_error: "Histórico indisponível",
    ongoing: "em curso",
    last_transfer: "Última comutação",
    transfers: "Comutações",
    alert_on_battery: "A funcionar com bateria",
    alert_on_battery_for: "Em bateria há {time}",
    alert_low_battery: "Bateria fraca: encerramento iminente",
    alert_overload: "Sobrecarga: reduza a carga ligada",
    alert_replace: "A bateria tem de ser substituída",
    alert_replace_due: "Substituição da bateria prevista a {date}",
    alert_offline: "Sem comunicação com a UPS",
    alert_output_off: "Saída da UPS desligada: os equipamentos ligados não recebem energia",
    alert_no_battery: "Nenhuma bateria detetada",
    alert_alarm: "A UPS indica um alarme",
    alert_shutdown: "Encerramento forçado em curso",
    alert_high_load: "Carga elevada: {pct}",
    no_device: "Nenhuma UPS encontrada. Configure o Network UPS Tools (NUT) ou o APC UPS Daemon, ou indique entidades próprias ao cartão.",
    unknown_device: "UPS não encontrada",
    no_registry: "Este cartão requer o Home Assistant 2024.8 ou posterior.",
    generic_name: "UPS",
    device: "UPS",
    device_none: "Nenhuma (só as entidades abaixo)",
    device_helper: "UPS da integração NUT ou APC UPS Daemon",
    title: "Título (opcional, por omissão o nome do dispositivo)",
    show_title: "Mostrar título",
    show_subtitle: "Mostrar subtítulo",
    show_alerts: "Mostrar alertas",
    show_power: "Mostrar alimentação",
    show_battery: "Mostrar bateria",
    show_outages: "Mostrar histórico de falhas",
    collapsed: "Secções recolhidas por omissão",
    history_days: "Histórico de falhas",
    max_outages: "Falhas listadas",
    low_runtime: "Limiar de autonomia baixa",
    battery_life: "Vida útil da bateria",
    battery_replaced: "Bateria instalada a (opcional)",
    entities: "Entidades (sensores genéricos ou substituições)",
    e_status: "Estado",
    e_online: "Rede elétrica (sensor binário, ligado = rede)",
    e_battery: "Carga da bateria",
    e_runtime: "Autonomia",
    e_load: "Carga",
    e_input_voltage: "Tensão de entrada",
    e_output_voltage: "Tensão de saída",
    e_power: "Potência",
    e_temperature: "Temperatura",
    e_battery_voltage: "Tensão da bateria",
    e_frequency: "Frequência",
    e_battery_date: "Data da bateria",
    unit_days: "dias",
    unit_years: "anos",
    language: "Idioma",
    lang_auto: "Automático",
    zoom: "Botão de detalhe",
    zoom_helper: "Botão no canto superior direito que alterna o mini cartão para o cartão completo e vice-versa",
    zoom_in: "Mostrar o cartão completo",
    zoom_out: "Mostrar o cartão compacto",
  },
  pl: {
    state_online: "Zasilanie sieciowe",
    state_charging: "Ładowanie",
    state_on_battery: "Na baterii",
    state_low_battery: "Niski poziom baterii",
    state_overload: "Przeciążenie",
    state_bypass: "Bypass",
    state_calibrating: "Kalibracja",
    state_test: "Test baterii",
    state_shutdown: "Wyłączanie",
    state_offline: "Offline",
    state_unknown: "Nieznany",
    battery: "Bateria",
    charge: "Naładowanie",
    runtime: "Czas pracy",
    runtime_left: "pozostało {time}",
    load: "Obciążenie",
    input_voltage: "Wejście",
    output_voltage: "Wyjście",
    power: "Moc",
    apparent_power: "Moc pozorna",
    frequency: "Częstotliwość",
    temperature: "Temperatura",
    battery_voltage: "Napięcie baterii",
    battery_temperature: "Temperatura baterii",
    battery_date: "Bateria założona",
    replace_by: "Wymienić do",
    self_test: "Autotest",
    section_power: "Zasilanie",
    section_battery: "Bateria",
    section_outages: "Awarie zasilania",
    outages_n_days: "Awarie ({days} dni)",
    time_on_battery: "Czas na baterii",
    longest: "Najdłuższa",
    no_outage: "Brak awarii w ciągu ostatnich {days} dni",
    history_loading: "Wczytywanie historii…",
    history_error: "Historia niedostępna",
    ongoing: "trwa",
    last_transfer: "Ostatnie przełączenie",
    transfers: "Przełączenia",
    alert_on_battery: "Praca na baterii",
    alert_on_battery_for: "Na baterii od {time}",
    alert_low_battery: "Niski poziom baterii: wkrótce wyłączenie",
    alert_overload: "Przeciążenie: zmniejsz podłączone obciążenie",
    alert_replace: "Baterię trzeba wymienić",
    alert_replace_due: "Wymiana baterii przewidziana na {date}",
    alert_offline: "Brak komunikacji z UPS",
    alert_output_off: "Wyjście UPS wyłączone: podłączone urządzenia nie są zasilane",
    alert_no_battery: "Nie wykryto baterii",
    alert_alarm: "UPS zgłasza alarm",
    alert_shutdown: "Trwa wymuszone wyłączenie",
    alert_high_load: "Wysokie obciążenie: {pct}",
    no_device: "Nie znaleziono UPS. Skonfiguruj Network UPS Tools (NUT) lub APC UPS Daemon albo podaj karcie własne encje.",
    unknown_device: "Nie znaleziono UPS",
    no_registry: "Ta karta wymaga Home Assistant 2024.8 lub nowszego.",
    generic_name: "UPS",
    device: "UPS",
    device_none: "Brak (tylko encje poniżej)",
    device_helper: "UPS z integracji NUT lub APC UPS Daemon",
    title: "Tytuł (opcjonalny, domyślnie nazwa urządzenia)",
    show_title: "Pokaż tytuł",
    show_subtitle: "Pokaż podtytuł",
    show_alerts: "Pokaż alerty",
    show_power: "Pokaż zasilanie",
    show_battery: "Pokaż baterię",
    show_outages: "Pokaż historię awarii",
    collapsed: "Sekcje domyślnie zwinięte",
    history_days: "Historia awarii",
    max_outages: "Wyświetlane awarie",
    low_runtime: "Próg krótkiego czasu pracy",
    battery_life: "Żywotność baterii",
    battery_replaced: "Bateria założona dnia (opcjonalnie)",
    entities: "Encje (czujniki ogólne lub zamienniki)",
    e_status: "Stan",
    e_online: "Zasilanie sieciowe (czujnik binarny, wł. = sieć)",
    e_battery: "Naładowanie baterii",
    e_runtime: "Czas pracy",
    e_load: "Obciążenie",
    e_input_voltage: "Napięcie wejściowe",
    e_output_voltage: "Napięcie wyjściowe",
    e_power: "Moc",
    e_temperature: "Temperatura",
    e_battery_voltage: "Napięcie baterii",
    e_frequency: "Częstotliwość",
    e_battery_date: "Data baterii",
    unit_days: "dni",
    unit_years: "lat",
    language: "Język",
    lang_auto: "Automatyczny",
    zoom: "Przycisk szczegółów",
    zoom_helper: "Przycisk w prawym górnym rogu przełączający minikartę na pełną kartę i z powrotem",
    zoom_in: "Pokaż pełną kartę",
    zoom_out: "Pokaż kompaktową kartę",
  },
  sr: {
    state_online: "На мрежи",
    state_charging: "Пуни се",
    state_on_battery: "На батерији",
    state_low_battery: "Батерија слаба",
    state_overload: "Преоптерећење",
    state_bypass: "Бајпас",
    state_calibrating: "Калибрација",
    state_test: "Тест батерије",
    state_shutdown: "Гашење",
    state_offline: "Ван мреже",
    state_unknown: "Непознато",
    battery: "Батерија",
    charge: "Напуњеност",
    runtime: "Аутономија",
    runtime_left: "још {time}",
    load: "Оптерећење",
    input_voltage: "Улаз",
    output_voltage: "Излаз",
    power: "Снага",
    apparent_power: "Привидна снага",
    frequency: "Фреквенција",
    temperature: "Температура",
    battery_voltage: "Напон батерије",
    battery_temperature: "Температура батерије",
    battery_date: "Батерија уграђена",
    replace_by: "Заменити до",
    self_test: "Самотест",
    section_power: "Напајање",
    section_battery: "Батерија",
    section_outages: "Нестанци струје",
    outages_n_days: "Нестанци ({days} д)",
    time_on_battery: "Време на батерији",
    longest: "Најдужи",
    no_outage: "Без нестанака у последњих {days} дана",
    history_loading: "Учитавање историје…",
    history_error: "Историја није доступна",
    ongoing: "у току",
    last_transfer: "Последње пребацивање",
    transfers: "Пребацивања",
    alert_on_battery: "Ради на батерији",
    alert_on_battery_for: "На батерији већ {time}",
    alert_low_battery: "Батерија слаба: гашење је неизбежно",
    alert_overload: "Преоптерећење: смањите прикључено оптерећење",
    alert_replace: "Батерију треба заменити",
    alert_replace_due: "Замена батерије предвиђена {date}",
    alert_offline: "Нема комуникације са УПС-ом",
    alert_output_off: "Излаз УПС-а је искључен: прикључени уређаји немају напајање",
    alert_no_battery: "Батерија није откривена",
    alert_alarm: "УПС пријављује аларм",
    alert_shutdown: "Принудно гашење у току",
    alert_high_load: "Високо оптерећење: {pct}",
    no_device: "Није пронађен УПС. Подесите Network UPS Tools (NUT) или APC UPS Daemon, или картици задајте сопствене ентитете.",
    unknown_device: "УПС није пронађен",
    no_registry: "Ова картица захтева Home Assistant 2024.8 или новији.",
    generic_name: "УПС",
    device: "УПС",
    device_none: "Ниједан (само ентитети испод)",
    device_helper: "УПС из интеграције NUT или APC UPS Daemon",
    title: "Наслов (опционо, подразумевано назив уређаја)",
    show_title: "Прикажи наслов",
    show_subtitle: "Прикажи поднаслов",
    show_alerts: "Прикажи упозорења",
    show_power: "Прикажи напајање",
    show_battery: "Прикажи батерију",
    show_outages: "Прикажи историју нестанака",
    collapsed: "Подразумевано скупљени одељци",
    history_days: "Историја нестанака",
    max_outages: "Приказани нестанци",
    low_runtime: "Праг ниске аутономије",
    battery_life: "Век батерије",
    battery_replaced: "Батерија уграђена (опционо)",
    entities: "Ентитети (општи сензори или замене)",
    e_status: "Стање",
    e_online: "Мрежно напајање (бинарни сензор, укључено = мрежа)",
    e_battery: "Напуњеност батерије",
    e_runtime: "Аутономија",
    e_load: "Оптерећење",
    e_input_voltage: "Улазни напон",
    e_output_voltage: "Излазни напон",
    e_power: "Снага",
    e_temperature: "Температура",
    e_battery_voltage: "Напон батерије",
    e_frequency: "Фреквенција",
    e_battery_date: "Датум батерије",
    unit_days: "дана",
    unit_years: "година",
    language: "Језик",
    lang_auto: "Аутоматски",
    zoom: "Дугме за детаље",
    zoom_helper: "Дугме горе десно које пребацује мини картицу на пуну картицу и назад",
    zoom_in: "Прикажи пуну картицу",
    zoom_out: "Прикажи компактну картицу",
  },
  "sr-Latn": {
    state_online: "Na mreži",
    state_charging: "Puni se",
    state_on_battery: "Na bateriji",
    state_low_battery: "Baterija slaba",
    state_overload: "Preopterećenje",
    state_bypass: "Bajpas",
    state_calibrating: "Kalibracija",
    state_test: "Test baterije",
    state_shutdown: "Gašenje",
    state_offline: "Van mreže",
    state_unknown: "Nepoznato",
    battery: "Baterija",
    charge: "Napunjenost",
    runtime: "Autonomija",
    runtime_left: "još {time}",
    load: "Opterećenje",
    input_voltage: "Ulaz",
    output_voltage: "Izlaz",
    power: "Snaga",
    apparent_power: "Prividna snaga",
    frequency: "Frekvencija",
    temperature: "Temperatura",
    battery_voltage: "Napon baterije",
    battery_temperature: "Temperatura baterije",
    battery_date: "Baterija ugrađena",
    replace_by: "Zameniti do",
    self_test: "Samotest",
    section_power: "Napajanje",
    section_battery: "Baterija",
    section_outages: "Nestanci struje",
    outages_n_days: "Nestanci ({days} d)",
    time_on_battery: "Vreme na bateriji",
    longest: "Najduži",
    no_outage: "Bez nestanaka u poslednjih {days} dana",
    history_loading: "Učitavanje istorije…",
    history_error: "Istorija nije dostupna",
    ongoing: "u toku",
    last_transfer: "Poslednje prebacivanje",
    transfers: "Prebacivanja",
    alert_on_battery: "Radi na bateriji",
    alert_on_battery_for: "Na bateriji već {time}",
    alert_low_battery: "Baterija slaba: gašenje je neizbežno",
    alert_overload: "Preopterećenje: smanjite priključeno opterećenje",
    alert_replace: "Bateriju treba zameniti",
    alert_replace_due: "Zamena baterije predviđena {date}",
    alert_offline: "Nema komunikacije sa UPS-om",
    alert_output_off: "Izlaz UPS-a je isključen: priključeni uređaji nemaju napajanje",
    alert_no_battery: "Baterija nije otkrivena",
    alert_alarm: "UPS prijavljuje alarm",
    alert_shutdown: "Prinudno gašenje u toku",
    alert_high_load: "Visoko opterećenje: {pct}",
    no_device: "Nije pronađen UPS. Podesite Network UPS Tools (NUT) ili APC UPS Daemon, ili kartici zadajte sopstvene entitete.",
    unknown_device: "UPS nije pronađen",
    no_registry: "Ova kartica zahteva Home Assistant 2024.8 ili noviji.",
    generic_name: "UPS",
    device: "UPS",
    device_none: "Nijedan (samo entiteti ispod)",
    device_helper: "UPS iz integracije NUT ili APC UPS Daemon",
    title: "Naslov (opciono, podrazumevano naziv uređaja)",
    show_title: "Prikaži naslov",
    show_subtitle: "Prikaži podnaslov",
    show_alerts: "Prikaži upozorenja",
    show_power: "Prikaži napajanje",
    show_battery: "Prikaži bateriju",
    show_outages: "Prikaži istoriju nestanaka",
    collapsed: "Podrazumevano skupljeni odeljci",
    history_days: "Istorija nestanaka",
    max_outages: "Prikazani nestanci",
    low_runtime: "Prag niske autonomije",
    battery_life: "Vek baterije",
    battery_replaced: "Baterija ugrađena (opciono)",
    entities: "Entiteti (opšti senzori ili zamene)",
    e_status: "Stanje",
    e_online: "Mrežno napajanje (binarni senzor, uključeno = mreža)",
    e_battery: "Napunjenost baterije",
    e_runtime: "Autonomija",
    e_load: "Opterećenje",
    e_input_voltage: "Ulazni napon",
    e_output_voltage: "Izlazni napon",
    e_power: "Snaga",
    e_temperature: "Temperatura",
    e_battery_voltage: "Napon baterije",
    e_frequency: "Frekvencija",
    e_battery_date: "Datum baterije",
    unit_days: "dana",
    unit_years: "godina",
    language: "Jezik",
    lang_auto: "Automatski",
    zoom: "Dugme za detalje",
    zoom_helper: "Dugme gore desno koje prebacuje mini karticu na punu karticu i nazad",
    zoom_in: "Prikaži punu karticu",
    zoom_out: "Prikaži kompaktnu karticu",
  },
  ro: {
    state_online: "Pe rețea",
    state_charging: "Se încarcă",
    state_on_battery: "Pe baterie",
    state_low_battery: "Baterie descărcată",
    state_overload: "Suprasarcină",
    state_bypass: "Bypass",
    state_calibrating: "Calibrare",
    state_test: "Test baterie",
    state_shutdown: "Se oprește",
    state_offline: "Offline",
    state_unknown: "Necunoscut",
    battery: "Baterie",
    charge: "Încărcare",
    runtime: "Autonomie",
    runtime_left: "mai sunt {time}",
    load: "Sarcină",
    input_voltage: "Intrare",
    output_voltage: "Ieșire",
    power: "Putere",
    apparent_power: "Putere aparentă",
    frequency: "Frecvență",
    temperature: "Temperatură",
    battery_voltage: "Tensiune baterie",
    battery_temperature: "Temperatură baterie",
    battery_date: "Baterie montată",
    replace_by: "De înlocuit până la",
    self_test: "Autotest",
    section_power: "Alimentare",
    section_battery: "Baterie",
    section_outages: "Pene de curent",
    outages_n_days: "Pene ({days} z)",
    time_on_battery: "Timp pe baterie",
    longest: "Cea mai lungă",
    no_outage: "Nicio pană în ultimele {days} zile",
    history_loading: "Se încarcă istoricul…",
    history_error: "Istoric indisponibil",
    ongoing: "în curs",
    last_transfer: "Ultima comutare",
    transfers: "Comutări",
    alert_on_battery: "Funcționează pe baterie",
    alert_on_battery_for: "Pe baterie de {time}",
    alert_low_battery: "Baterie descărcată: oprire iminentă",
    alert_overload: "Suprasarcină: reduceți sarcina conectată",
    alert_replace: "Bateria trebuie înlocuită",
    alert_replace_due: "Înlocuirea bateriei este prevăzută pe {date}",
    alert_offline: "Nicio comunicare cu UPS-ul",
    alert_output_off: "Ieșirea UPS-ului este oprită: aparatele conectate nu sunt alimentate",
    alert_no_battery: "Nicio baterie detectată",
    alert_alarm: "UPS-ul semnalează o alarmă",
    alert_shutdown: "Oprire forțată în curs",
    alert_high_load: "Sarcină ridicată: {pct}",
    no_device: "Niciun UPS găsit. Configurați Network UPS Tools (NUT) sau APC UPS Daemon ori dați cardului entități proprii.",
    unknown_device: "UPS negăsit",
    no_registry: "Acest card necesită Home Assistant 2024.8 sau mai nou.",
    generic_name: "UPS",
    device: "UPS",
    device_none: "Niciunul (doar entitățile de mai jos)",
    device_helper: "UPS din integrarea NUT sau APC UPS Daemon",
    title: "Titlu (opțional, implicit numele dispozitivului)",
    show_title: "Afișează titlul",
    show_subtitle: "Afișează subtitlul",
    show_alerts: "Afișează alertele",
    show_power: "Afișează alimentarea",
    show_battery: "Afișează bateria",
    show_outages: "Afișează istoricul penelor",
    collapsed: "Secțiuni restrânse implicit",
    history_days: "Istoricul penelor",
    max_outages: "Pene afișate",
    low_runtime: "Prag autonomie scăzută",
    battery_life: "Durata de viață a bateriei",
    battery_replaced: "Baterie montată la (opțional)",
    entities: "Entități (senzori generici sau înlocuiri)",
    e_status: "Stare",
    e_online: "Rețea electrică (senzor binar, pornit = rețea)",
    e_battery: "Încărcarea bateriei",
    e_runtime: "Autonomie",
    e_load: "Sarcină",
    e_input_voltage: "Tensiune de intrare",
    e_output_voltage: "Tensiune de ieșire",
    e_power: "Putere",
    e_temperature: "Temperatură",
    e_battery_voltage: "Tensiune baterie",
    e_frequency: "Frecvență",
    e_battery_date: "Data bateriei",
    unit_days: "zile",
    unit_years: "ani",
    language: "Limbă",
    lang_auto: "Automat",
    zoom: "Buton detalii",
    zoom_helper: "Buton din dreapta sus care comută mini cardul la cardul complet și înapoi",
    zoom_in: "Afișează cardul complet",
    zoom_out: "Afișează cardul compact",
  },
  da: {
    state_online: "På lysnet",
    state_charging: "Oplader",
    state_on_battery: "På batteri",
    state_low_battery: "Lavt batteri",
    state_overload: "Overbelastning",
    state_bypass: "Bypass",
    state_calibrating: "Kalibrerer",
    state_test: "Batteritest",
    state_shutdown: "Lukker ned",
    state_offline: "Offline",
    state_unknown: "Ukendt",
    battery: "Batteri",
    charge: "Opladning",
    runtime: "Driftstid",
    runtime_left: "{time} tilbage",
    load: "Belastning",
    input_voltage: "Indgang",
    output_voltage: "Udgang",
    power: "Effekt",
    apparent_power: "Tilsyneladende effekt",
    frequency: "Frekvens",
    temperature: "Temperatur",
    battery_voltage: "Batterispænding",
    battery_temperature: "Batteritemperatur",
    battery_date: "Batteri isat",
    replace_by: "Udskift senest",
    self_test: "Selvtest",
    section_power: "Strømforsyning",
    section_battery: "Batteri",
    section_outages: "Strømafbrydelser",
    outages_n_days: "Afbrydelser ({days} d)",
    time_on_battery: "Tid på batteri",
    longest: "Længste",
    no_outage: "Ingen afbrydelse de seneste {days} dage",
    history_loading: "Indlæser historik…",
    history_error: "Historik utilgængelig",
    ongoing: "i gang",
    last_transfer: "Seneste omskiftning",
    transfers: "Omskiftninger",
    alert_on_battery: "Kører på batteri",
    alert_on_battery_for: "På batteri i {time}",
    alert_low_battery: "Lavt batteri: nedlukning nært forestående",
    alert_overload: "Overbelastning: reducer den tilsluttede belastning",
    alert_replace: "Batteriet skal udskiftes",
    alert_replace_due: "Batteriudskiftning planlagt {date}",
    alert_offline: "Ingen kommunikation med UPS'en",
    alert_output_off: "UPS'ens udgang er slukket: de tilsluttede enheder får ikke strøm",
    alert_no_battery: "Intet batteri fundet",
    alert_alarm: "UPS'en melder en alarm",
    alert_shutdown: "Tvungen nedlukning i gang",
    alert_high_load: "Høj belastning: {pct}",
    no_device: "Ingen UPS fundet. Opsæt Network UPS Tools (NUT) eller APC UPS Daemon, eller giv kortet dine egne entiteter.",
    unknown_device: "UPS ikke fundet",
    no_registry: "Dette kort kræver Home Assistant 2024.8 eller nyere.",
    generic_name: "UPS",
    device: "UPS",
    device_none: "Ingen (kun entiteterne nedenfor)",
    device_helper: "UPS fra integrationen NUT eller APC UPS Daemon",
    title: "Titel (valgfri, som standard enhedens navn)",
    show_title: "Vis titel",
    show_subtitle: "Vis undertitel",
    show_alerts: "Vis advarsler",
    show_power: "Vis strømforsyning",
    show_battery: "Vis batteri",
    show_outages: "Vis afbrydelseshistorik",
    collapsed: "Sektioner foldet sammen som standard",
    history_days: "Afbrydelseshistorik",
    max_outages: "Viste afbrydelser",
    low_runtime: "Grænse for lav driftstid",
    battery_life: "Batteriets levetid",
    battery_replaced: "Batteri isat den (valgfrit)",
    entities: "Entiteter (generiske sensorer eller erstatninger)",
    e_status: "Status",
    e_online: "Lysnet (binær sensor, til = lysnet)",
    e_battery: "Batteriopladning",
    e_runtime: "Driftstid",
    e_load: "Belastning",
    e_input_voltage: "Indgangsspænding",
    e_output_voltage: "Udgangsspænding",
    e_power: "Effekt",
    e_temperature: "Temperatur",
    e_battery_voltage: "Batterispænding",
    e_frequency: "Frekvens",
    e_battery_date: "Batteridato",
    unit_days: "dage",
    unit_years: "år",
    language: "Sprog",
    lang_auto: "Automatisk",
    zoom: "Detaljeknap",
    zoom_helper: "Knap øverst til højre, der skifter minikortet til det fulde kort og tilbage",
    zoom_in: "Vis det fulde kort",
    zoom_out: "Vis det kompakte kort",
  },
  sv: {
    state_online: "På elnätet",
    state_charging: "Laddar",
    state_on_battery: "På batteri",
    state_low_battery: "Låg batterinivå",
    state_overload: "Överbelastning",
    state_bypass: "Bypass",
    state_calibrating: "Kalibrerar",
    state_test: "Batteritest",
    state_shutdown: "Stänger av",
    state_offline: "Offline",
    state_unknown: "Okänd",
    battery: "Batteri",
    charge: "Laddning",
    runtime: "Drifttid",
    runtime_left: "{time} kvar",
    load: "Belastning",
    input_voltage: "Ingång",
    output_voltage: "Utgång",
    power: "Effekt",
    apparent_power: "Skenbar effekt",
    frequency: "Frekvens",
    temperature: "Temperatur",
    battery_voltage: "Batterispänning",
    battery_temperature: "Batteritemperatur",
    battery_date: "Batteri isatt",
    replace_by: "Byt senast",
    self_test: "Självtest",
    section_power: "Strömförsörjning",
    section_battery: "Batteri",
    section_outages: "Strömavbrott",
    outages_n_days: "Avbrott ({days} d)",
    time_on_battery: "Tid på batteri",
    longest: "Längsta",
    no_outage: "Inget avbrott de senaste {days} dagarna",
    history_loading: "Läser in historik…",
    history_error: "Historik ej tillgänglig",
    ongoing: "pågår",
    last_transfer: "Senaste omkoppling",
    transfers: "Omkopplingar",
    alert_on_battery: "Går på batteri",
    alert_on_battery_for: "På batteri i {time}",
    alert_low_battery: "Låg batterinivå: avstängning nära förestående",
    alert_overload: "Överbelastning: minska den anslutna lasten",
    alert_replace: "Batteriet behöver bytas",
    alert_replace_due: "Batteribyte planerat {date}",
    alert_offline: "Ingen kommunikation med UPS:en",
    alert_output_off: "UPS:ens utgång är avstängd: de anslutna enheterna får ingen ström",
    alert_no_battery: "Inget batteri hittades",
    alert_alarm: "UPS:en rapporterar ett larm",
    alert_shutdown: "Tvingad avstängning pågår",
    alert_high_load: "Hög belastning: {pct}",
    no_device: "Ingen UPS hittades. Konfigurera Network UPS Tools (NUT) eller APC UPS Daemon, eller ge kortet egna entiteter.",
    unknown_device: "UPS hittades inte",
    no_registry: "Det här kortet kräver Home Assistant 2024.8 eller senare.",
    generic_name: "UPS",
    device: "UPS",
    device_none: "Ingen (endast entiteterna nedan)",
    device_helper: "UPS från integrationen NUT eller APC UPS Daemon",
    title: "Titel (valfri, som standard enhetens namn)",
    show_title: "Visa titel",
    show_subtitle: "Visa undertitel",
    show_alerts: "Visa varningar",
    show_power: "Visa strömförsörjning",
    show_battery: "Visa batteri",
    show_outages: "Visa avbrottshistorik",
    collapsed: "Sektioner hopfällda som standard",
    history_days: "Avbrottshistorik",
    max_outages: "Listade avbrott",
    low_runtime: "Gräns för låg drifttid",
    battery_life: "Batteriets livslängd",
    battery_replaced: "Batteri isatt den (valfritt)",
    entities: "Entiteter (generiska sensorer eller ersättningar)",
    e_status: "Status",
    e_online: "Elnät (binär sensor, på = elnät)",
    e_battery: "Batteriladdning",
    e_runtime: "Drifttid",
    e_load: "Belastning",
    e_input_voltage: "Inspänning",
    e_output_voltage: "Utspänning",
    e_power: "Effekt",
    e_temperature: "Temperatur",
    e_battery_voltage: "Batterispänning",
    e_frequency: "Frekvens",
    e_battery_date: "Batteridatum",
    unit_days: "dagar",
    unit_years: "år",
    language: "Språk",
    lang_auto: "Automatiskt",
    zoom: "Detaljknapp",
    zoom_helper: "Knapp uppe till höger som växlar minikortet till hela kortet och tillbaka",
    zoom_in: "Visa hela kortet",
    zoom_out: "Visa det kompakta kortet",
  },
  bg: {
    state_online: "От мрежата",
    state_charging: "Зарежда",
    state_on_battery: "На батерия",
    state_low_battery: "Изтощена батерия",
    state_overload: "Претоварване",
    state_bypass: "Байпас",
    state_calibrating: "Калибриране",
    state_test: "Тест на батерията",
    state_shutdown: "Изключване",
    state_offline: "Офлайн",
    state_unknown: "Неизвестно",
    battery: "Батерия",
    charge: "Заряд",
    runtime: "Автономия",
    runtime_left: "остават {time}",
    load: "Натоварване",
    input_voltage: "Вход",
    output_voltage: "Изход",
    power: "Мощност",
    apparent_power: "Пълна мощност",
    frequency: "Честота",
    temperature: "Температура",
    battery_voltage: "Напрежение на батерията",
    battery_temperature: "Температура на батерията",
    battery_date: "Батерия поставена",
    replace_by: "Смяна до",
    self_test: "Самотест",
    section_power: "Захранване",
    section_battery: "Батерия",
    section_outages: "Прекъсвания",
    outages_n_days: "Прекъсвания ({days} д)",
    time_on_battery: "Време на батерия",
    longest: "Най-дълго",
    no_outage: "Без прекъсвания през последните {days} дни",
    history_loading: "Зареждане на историята…",
    history_error: "Историята не е налична",
    ongoing: "продължава",
    last_transfer: "Последно превключване",
    transfers: "Превключвания",
    alert_on_battery: "Работи на батерия",
    alert_on_battery_for: "На батерия от {time}",
    alert_low_battery: "Изтощена батерия: предстои изключване",
    alert_overload: "Претоварване: намалете свързания товар",
    alert_replace: "Батерията трябва да се смени",
    alert_replace_due: "Смяна на батерията на {date}",
    alert_offline: "Няма връзка с UPS устройството",
    alert_output_off: "Изходът на UPS устройството е изключен: свързаните уреди не се захранват",
    alert_no_battery: "Не е открита батерия",
    alert_alarm: "UPS устройството съобщава за аларма",
    alert_shutdown: "Принудително изключване",
    alert_high_load: "Високо натоварване: {pct}",
    no_device: "Не е намерен UPS. Настройте Network UPS Tools (NUT) или APC UPS Daemon или задайте собствени обекти на картата.",
    unknown_device: "UPS не е намерен",
    no_registry: "Тази карта изисква Home Assistant 2024.8 или по-нов.",
    generic_name: "UPS",
    device: "UPS",
    device_none: "Няма (само обектите по-долу)",
    device_helper: "UPS от интеграцията NUT или APC UPS Daemon",
    title: "Заглавие (по избор, по подразбиране името на устройството)",
    show_title: "Показване на заглавието",
    show_subtitle: "Показване на подзаглавието",
    show_alerts: "Показване на предупрежденията",
    show_power: "Показване на захранването",
    show_battery: "Показване на батерията",
    show_outages: "Показване на историята на прекъсванията",
    collapsed: "Сгънати по подразбиране раздели",
    history_days: "История на прекъсванията",
    max_outages: "Показани прекъсвания",
    low_runtime: "Праг за ниска автономия",
    battery_life: "Живот на батерията",
    battery_replaced: "Батерия поставена на (по избор)",
    entities: "Обекти (общи сензори или заместители)",
    e_status: "Състояние",
    e_online: "Мрежово захранване (двоичен сензор, вкл. = мрежа)",
    e_battery: "Заряд на батерията",
    e_runtime: "Автономия",
    e_load: "Натоварване",
    e_input_voltage: "Входно напрежение",
    e_output_voltage: "Изходно напрежение",
    e_power: "Мощност",
    e_temperature: "Температура",
    e_battery_voltage: "Напрежение на батерията",
    e_frequency: "Честота",
    e_battery_date: "Дата на батерията",
    unit_days: "дни",
    unit_years: "години",
    language: "Език",
    lang_auto: "Автоматично",
    zoom: "Бутон за детайли",
    zoom_helper: "Бутон горе вдясно, който превключва мини картата към пълната карта и обратно",
    zoom_in: "Покажи пълната карта",
    zoom_out: "Покажи компактната карта",
  },
  ru: {
    state_online: "От сети",
    state_charging: "Зарядка",
    state_on_battery: "От батареи",
    state_low_battery: "Батарея разряжена",
    state_overload: "Перегрузка",
    state_bypass: "Байпас",
    state_calibrating: "Калибровка",
    state_test: "Тест батареи",
    state_shutdown: "Выключение",
    state_offline: "Не в сети",
    state_unknown: "Неизвестно",
    battery: "Батарея",
    charge: "Заряд",
    runtime: "Время работы",
    runtime_left: "осталось {time}",
    load: "Нагрузка",
    input_voltage: "Вход",
    output_voltage: "Выход",
    power: "Мощность",
    apparent_power: "Полная мощность",
    frequency: "Частота",
    temperature: "Температура",
    battery_voltage: "Напряжение батареи",
    battery_temperature: "Температура батареи",
    battery_date: "Батарея установлена",
    replace_by: "Заменить до",
    self_test: "Самотест",
    section_power: "Питание",
    section_battery: "Батарея",
    section_outages: "Отключения",
    outages_n_days: "Отключения ({days} д)",
    time_on_battery: "Время от батареи",
    longest: "Самое долгое",
    no_outage: "Нет отключений за последние {days} дн.",
    history_loading: "Загрузка истории…",
    history_error: "История недоступна",
    ongoing: "продолжается",
    last_transfer: "Последнее переключение",
    transfers: "Переключения",
    alert_on_battery: "Работает от батареи",
    alert_on_battery_for: "От батареи уже {time}",
    alert_low_battery: "Батарея разряжена: скоро выключение",
    alert_overload: "Перегрузка: уменьшите подключённую нагрузку",
    alert_replace: "Батарею нужно заменить",
    alert_replace_due: "Замена батареи запланирована на {date}",
    alert_offline: "Нет связи с ИБП",
    alert_output_off: "Выход ИБП отключён: подключённые устройства не получают питание",
    alert_no_battery: "Батарея не обнаружена",
    alert_alarm: "ИБП сообщает о тревоге",
    alert_shutdown: "Идёт принудительное выключение",
    alert_high_load: "Высокая нагрузка: {pct}",
    no_device: "ИБП не найден. Настройте Network UPS Tools (NUT) или APC UPS Daemon либо укажите карточке свои объекты.",
    unknown_device: "ИБП не найден",
    no_registry: "Для этой карточки нужен Home Assistant 2024.8 или новее.",
    generic_name: "ИБП",
    device: "ИБП",
    device_none: "Нет (только объекты ниже)",
    device_helper: "ИБП из интеграции NUT или APC UPS Daemon",
    title: "Заголовок (необязательно, по умолчанию имя устройства)",
    show_title: "Показывать заголовок",
    show_subtitle: "Показывать подзаголовок",
    show_alerts: "Показывать предупреждения",
    show_power: "Показывать питание",
    show_battery: "Показывать батарею",
    show_outages: "Показывать историю отключений",
    collapsed: "Свёрнутые по умолчанию разделы",
    history_days: "История отключений",
    max_outages: "Показанные отключения",
    low_runtime: "Порог малого времени работы",
    battery_life: "Срок службы батареи",
    battery_replaced: "Батарея установлена (необязательно)",
    entities: "Объекты (общие датчики или замены)",
    e_status: "Состояние",
    e_online: "Сетевое питание (бинарный датчик, вкл. = сеть)",
    e_battery: "Заряд батареи",
    e_runtime: "Время работы",
    e_load: "Нагрузка",
    e_input_voltage: "Входное напряжение",
    e_output_voltage: "Выходное напряжение",
    e_power: "Мощность",
    e_temperature: "Температура",
    e_battery_voltage: "Напряжение батареи",
    e_frequency: "Частота",
    e_battery_date: "Дата батареи",
    unit_days: "дн.",
    unit_years: "лет",
    language: "Язык",
    lang_auto: "Автоматически",
    zoom: "Кнопка подробностей",
    zoom_helper: "Кнопка в правом верхнем углу, переключающая мини-карточку на полную и обратно",
    zoom_in: "Показать полную карточку",
    zoom_out: "Показать компактную карточку",
  },
  uk: {
    state_online: "Від мережі",
    state_charging: "Заряджання",
    state_on_battery: "Від батареї",
    state_low_battery: "Батарея розряджена",
    state_overload: "Перевантаження",
    state_bypass: "Байпас",
    state_calibrating: "Калібрування",
    state_test: "Тест батареї",
    state_shutdown: "Вимкнення",
    state_offline: "Не в мережі",
    state_unknown: "Невідомо",
    battery: "Батарея",
    charge: "Заряд",
    runtime: "Час роботи",
    runtime_left: "лишилося {time}",
    load: "Навантаження",
    input_voltage: "Вхід",
    output_voltage: "Вихід",
    power: "Потужність",
    apparent_power: "Повна потужність",
    frequency: "Частота",
    temperature: "Температура",
    battery_voltage: "Напруга батареї",
    battery_temperature: "Температура батареї",
    battery_date: "Батарею встановлено",
    replace_by: "Замінити до",
    self_test: "Самотест",
    section_power: "Живлення",
    section_battery: "Батарея",
    section_outages: "Відключення",
    outages_n_days: "Відключення ({days} д)",
    time_on_battery: "Час від батареї",
    longest: "Найдовше",
    no_outage: "Жодного відключення за останні {days} дн.",
    history_loading: "Завантаження історії…",
    history_error: "Історія недоступна",
    ongoing: "триває",
    last_transfer: "Останнє перемикання",
    transfers: "Перемикання",
    alert_on_battery: "Працює від батареї",
    alert_on_battery_for: "Від батареї вже {time}",
    alert_low_battery: "Батарея розряджена: незабаром вимкнення",
    alert_overload: "Перевантаження: зменште підключене навантаження",
    alert_replace: "Батарею треба замінити",
    alert_replace_due: "Заміну батареї заплановано на {date}",
    alert_offline: "Немає зв'язку з ДБЖ",
    alert_output_off: "Вихід ДБЖ вимкнено: підключені пристрої не отримують живлення",
    alert_no_battery: "Батарею не виявлено",
    alert_alarm: "ДБЖ повідомляє про тривогу",
    alert_shutdown: "Триває примусове вимкнення",
    alert_high_load: "Високе навантаження: {pct}",
    no_device: "ДБЖ не знайдено. Налаштуйте Network UPS Tools (NUT) або APC UPS Daemon чи вкажіть картці власні об'єкти.",
    unknown_device: "ДБЖ не знайдено",
    no_registry: "Для цієї картки потрібен Home Assistant 2024.8 або новіший.",
    generic_name: "ДБЖ",
    device: "ДБЖ",
    device_none: "Немає (лише об'єкти нижче)",
    device_helper: "ДБЖ з інтеграції NUT або APC UPS Daemon",
    title: "Заголовок (необов'язково, типово назва пристрою)",
    show_title: "Показувати заголовок",
    show_subtitle: "Показувати підзаголовок",
    show_alerts: "Показувати попередження",
    show_power: "Показувати живлення",
    show_battery: "Показувати батарею",
    show_outages: "Показувати історію відключень",
    collapsed: "Типово згорнуті розділи",
    history_days: "Історія відключень",
    max_outages: "Показані відключення",
    low_runtime: "Поріг малого часу роботи",
    battery_life: "Термін служби батареї",
    battery_replaced: "Батарею встановлено (необов'язково)",
    entities: "Об'єкти (загальні датчики або заміни)",
    e_status: "Стан",
    e_online: "Мережеве живлення (бінарний датчик, увімк. = мережа)",
    e_battery: "Заряд батареї",
    e_runtime: "Час роботи",
    e_load: "Навантаження",
    e_input_voltage: "Вхідна напруга",
    e_output_voltage: "Вихідна напруга",
    e_power: "Потужність",
    e_temperature: "Температура",
    e_battery_voltage: "Напруга батареї",
    e_frequency: "Частота",
    e_battery_date: "Дата батареї",
    unit_days: "дн.",
    unit_years: "років",
    language: "Мова",
    lang_auto: "Автоматично",
    zoom: "Кнопка деталей",
    zoom_helper: "Кнопка вгорі праворуч, що перемикає міні-картку на повну й назад",
    zoom_in: "Показати повну картку",
    zoom_out: "Показати компактну картку",
  },
  hu: {
    state_online: "Hálózatról",
    state_charging: "Töltés",
    state_on_battery: "Akkumulátorról",
    state_low_battery: "Alacsony töltöttség",
    state_overload: "Túlterhelés",
    state_bypass: "Bypass",
    state_calibrating: "Kalibrálás",
    state_test: "Akkumulátorteszt",
    state_shutdown: "Leállás",
    state_offline: "Offline",
    state_unknown: "Ismeretlen",
    battery: "Akkumulátor",
    charge: "Töltöttség",
    runtime: "Üzemidő",
    runtime_left: "még {time}",
    load: "Terhelés",
    input_voltage: "Bemenet",
    output_voltage: "Kimenet",
    power: "Teljesítmény",
    apparent_power: "Látszólagos teljesítmény",
    frequency: "Frekvencia",
    temperature: "Hőmérséklet",
    battery_voltage: "Akkumulátorfeszültség",
    battery_temperature: "Akkumulátor-hőmérséklet",
    battery_date: "Akkumulátor beszerelve",
    replace_by: "Csere eddig",
    self_test: "Önteszt",
    section_power: "Tápellátás",
    section_battery: "Akkumulátor",
    section_outages: "Áramkimaradások",
    outages_n_days: "Kimaradások ({days} n)",
    time_on_battery: "Idő akkumulátorról",
    longest: "Leghosszabb",
    no_outage: "Nem volt kimaradás az elmúlt {days} napban",
    history_loading: "Előzmények betöltése…",
    history_error: "Az előzmények nem érhetők el",
    ongoing: "folyamatban",
    last_transfer: "Utolsó átkapcsolás",
    transfers: "Átkapcsolások",
    alert_on_battery: "Akkumulátorról üzemel",
    alert_on_battery_for: "{time} óta akkumulátorról",
    alert_low_battery: "Alacsony töltöttség: leállás küszöbön",
    alert_overload: "Túlterhelés: csökkentse a csatlakoztatott terhelést",
    alert_replace: "Az akkumulátort cserélni kell",
    alert_replace_due: "Akkumulátorcsere esedékes: {date}",
    alert_offline: "Nincs kapcsolat a szünetmentessel",
    alert_output_off: "A szünetmentes kimenete ki van kapcsolva: a csatlakoztatott eszközök nem kapnak áramot",
    alert_no_battery: "Nem található akkumulátor",
    alert_alarm: "A szünetmentes riasztást jelez",
    alert_shutdown: "Kényszerleállás folyamatban",
    alert_high_load: "Magas terhelés: {pct}",
    no_device: "Nem található szünetmentes. Állítsa be a Network UPS Tools (NUT) vagy az APC UPS Daemon integrációt, vagy adjon meg saját entitásokat a kártyának.",
    unknown_device: "A szünetmentes nem található",
    no_registry: "Ehhez a kártyához Home Assistant 2024.8 vagy újabb szükséges.",
    generic_name: "Szünetmentes",
    device: "Szünetmentes",
    device_none: "Nincs (csak az alábbi entitások)",
    device_helper: "Szünetmentes a NUT vagy az APC UPS Daemon integrációból",
    title: "Cím (opcionális, alapértelmezés szerint az eszköz neve)",
    show_title: "Cím megjelenítése",
    show_subtitle: "Alcím megjelenítése",
    show_alerts: "Figyelmeztetések megjelenítése",
    show_power: "Tápellátás megjelenítése",
    show_battery: "Akkumulátor megjelenítése",
    show_outages: "Kimaradási előzmények megjelenítése",
    collapsed: "Alapértelmezés szerint összecsukott szakaszok",
    history_days: "Kimaradási előzmények",
    max_outages: "Listázott kimaradások",
    low_runtime: "Alacsony üzemidő küszöbe",
    battery_life: "Akkumulátor élettartama",
    battery_replaced: "Akkumulátor beszerelve (opcionális)",
    entities: "Entitások (általános érzékelők vagy helyettesítők)",
    e_status: "Állapot",
    e_online: "Hálózati áram (bináris érzékelő, be = hálózat)",
    e_battery: "Akkumulátor töltöttsége",
    e_runtime: "Üzemidő",
    e_load: "Terhelés",
    e_input_voltage: "Bemeneti feszültség",
    e_output_voltage: "Kimeneti feszültség",
    e_power: "Teljesítmény",
    e_temperature: "Hőmérséklet",
    e_battery_voltage: "Akkumulátorfeszültség",
    e_frequency: "Frekvencia",
    e_battery_date: "Akkumulátor dátuma",
    unit_days: "nap",
    unit_years: "év",
    language: "Nyelv",
    lang_auto: "Automatikus",
    zoom: "Részletek gomb",
    zoom_helper: "Jobb felső gomb, amely a mini kártyát a teljes kártyára váltja és vissza",
    zoom_in: "Teljes kártya megjelenítése",
    zoom_out: "Kompakt kártya megjelenítése",
  },
  sk: {
    state_online: "Zo siete",
    state_charging: "Nabíja sa",
    state_on_battery: "Na batérii",
    state_low_battery: "Slabá batéria",
    state_overload: "Preťaženie",
    state_bypass: "Bypass",
    state_calibrating: "Kalibrácia",
    state_test: "Test batérie",
    state_shutdown: "Vypína sa",
    state_offline: "Offline",
    state_unknown: "Neznámy",
    battery: "Batéria",
    charge: "Nabitie",
    runtime: "Výdrž",
    runtime_left: "zostáva {time}",
    load: "Záťaž",
    input_voltage: "Vstup",
    output_voltage: "Výstup",
    power: "Výkon",
    apparent_power: "Zdanlivý výkon",
    frequency: "Frekvencia",
    temperature: "Teplota",
    battery_voltage: "Napätie batérie",
    battery_temperature: "Teplota batérie",
    battery_date: "Batéria vložená",
    replace_by: "Vymeniť do",
    self_test: "Autotest",
    section_power: "Napájanie",
    section_battery: "Batéria",
    section_outages: "Výpadky",
    outages_n_days: "Výpadky ({days} d)",
    time_on_battery: "Čas na batérii",
    longest: "Najdlhší",
    no_outage: "Žiadny výpadok za posledných {days} dní",
    history_loading: "Načítava sa história…",
    history_error: "História nie je dostupná",
    ongoing: "prebieha",
    last_transfer: "Posledné prepnutie",
    transfers: "Prepnutia",
    alert_on_battery: "Beží na batérii",
    alert_on_battery_for: "Na batérii už {time}",
    alert_low_battery: "Slabá batéria: hrozí vypnutie",
    alert_overload: "Preťaženie: znížte pripojenú záťaž",
    alert_replace: "Batériu treba vymeniť",
    alert_replace_due: "Výmena batérie plánovaná na {date}",
    alert_offline: "Žiadna komunikácia s UPS",
    alert_output_off: "Výstup UPS je vypnutý: pripojené zariadenia nie sú napájané",
    alert_no_battery: "Nebola zistená žiadna batéria",
    alert_alarm: "UPS hlási alarm",
    alert_shutdown: "Prebieha vynútené vypnutie",
    alert_high_load: "Vysoká záťaž: {pct}",
    no_device: "Nenašla sa žiadna UPS. Nastavte Network UPS Tools (NUT) alebo APC UPS Daemon, alebo zadajte karte vlastné entity.",
    unknown_device: "UPS sa nenašla",
    no_registry: "Táto karta vyžaduje Home Assistant 2024.8 alebo novší.",
    generic_name: "UPS",
    device: "UPS",
    device_none: "Žiadna (iba entity nižšie)",
    device_helper: "UPS z integrácie NUT alebo APC UPS Daemon",
    title: "Názov (voliteľný, predvolene názov zariadenia)",
    show_title: "Zobraziť názov",
    show_subtitle: "Zobraziť podnázov",
    show_alerts: "Zobraziť upozornenia",
    show_power: "Zobraziť napájanie",
    show_battery: "Zobraziť batériu",
    show_outages: "Zobraziť históriu výpadkov",
    collapsed: "Predvolene zbalené sekcie",
    history_days: "História výpadkov",
    max_outages: "Zobrazené výpadky",
    low_runtime: "Prah nízkej výdrže",
    battery_life: "Životnosť batérie",
    battery_replaced: "Batéria vložená dňa (voliteľné)",
    entities: "Entity (všeobecné senzory alebo náhrady)",
    e_status: "Stav",
    e_online: "Sieťové napájanie (binárny senzor, zap. = sieť)",
    e_battery: "Nabitie batérie",
    e_runtime: "Výdrž",
    e_load: "Záťaž",
    e_input_voltage: "Vstupné napätie",
    e_output_voltage: "Výstupné napätie",
    e_power: "Výkon",
    e_temperature: "Teplota",
    e_battery_voltage: "Napätie batérie",
    e_frequency: "Frekvencia",
    e_battery_date: "Dátum batérie",
    unit_days: "dní",
    unit_years: "rokov",
    language: "Jazyk",
    lang_auto: "Automaticky",
    zoom: "Tlačidlo detailu",
    zoom_helper: "Tlačidlo vpravo hore, ktoré prepína minikartu na úplnú kartu a späť",
    zoom_in: "Zobraziť úplnú kartu",
    zoom_out: "Zobraziť kompaktnú kartu",
  },
  cs: {
    state_online: "Ze sítě",
    state_charging: "Nabíjí se",
    state_on_battery: "Na baterii",
    state_low_battery: "Slabá baterie",
    state_overload: "Přetížení",
    state_bypass: "Bypass",
    state_calibrating: "Kalibrace",
    state_test: "Test baterie",
    state_shutdown: "Vypíná se",
    state_offline: "Offline",
    state_unknown: "Neznámý",
    battery: "Baterie",
    charge: "Nabití",
    runtime: "Výdrž",
    runtime_left: "zbývá {time}",
    load: "Zátěž",
    input_voltage: "Vstup",
    output_voltage: "Výstup",
    power: "Výkon",
    apparent_power: "Zdánlivý výkon",
    frequency: "Frekvence",
    temperature: "Teplota",
    battery_voltage: "Napětí baterie",
    battery_temperature: "Teplota baterie",
    battery_date: "Baterie vložena",
    replace_by: "Vyměnit do",
    self_test: "Autotest",
    section_power: "Napájení",
    section_battery: "Baterie",
    section_outages: "Výpadky",
    outages_n_days: "Výpadky ({days} d)",
    time_on_battery: "Čas na baterii",
    longest: "Nejdelší",
    no_outage: "Žádný výpadek za posledních {days} dní",
    history_loading: "Načítání historie…",
    history_error: "Historie není dostupná",
    ongoing: "probíhá",
    last_transfer: "Poslední přepnutí",
    transfers: "Přepnutí",
    alert_on_battery: "Běží na baterii",
    alert_on_battery_for: "Na baterii už {time}",
    alert_low_battery: "Slabá baterie: hrozí vypnutí",
    alert_overload: "Přetížení: snižte připojenou zátěž",
    alert_replace: "Baterii je třeba vyměnit",
    alert_replace_due: "Výměna baterie plánována na {date}",
    alert_offline: "Žádná komunikace s UPS",
    alert_output_off: "Výstup UPS je vypnutý: připojená zařízení nejsou napájena",
    alert_no_battery: "Nebyla zjištěna žádná baterie",
    alert_alarm: "UPS hlásí alarm",
    alert_shutdown: "Probíhá vynucené vypnutí",
    alert_high_load: "Vysoká zátěž: {pct}",
    no_device: "Nenalezena žádná UPS. Nastavte Network UPS Tools (NUT) nebo APC UPS Daemon, nebo zadejte kartě vlastní entity.",
    unknown_device: "UPS nenalezena",
    no_registry: "Tato karta vyžaduje Home Assistant 2024.8 nebo novější.",
    generic_name: "UPS",
    device: "UPS",
    device_none: "Žádná (jen entity níže)",
    device_helper: "UPS z integrace NUT nebo APC UPS Daemon",
    title: "Název (volitelný, výchozí je název zařízení)",
    show_title: "Zobrazit název",
    show_subtitle: "Zobrazit podnázev",
    show_alerts: "Zobrazit upozornění",
    show_power: "Zobrazit napájení",
    show_battery: "Zobrazit baterii",
    show_outages: "Zobrazit historii výpadků",
    collapsed: "Výchozí sbalené sekce",
    history_days: "Historie výpadků",
    max_outages: "Zobrazené výpadky",
    low_runtime: "Práh nízké výdrže",
    battery_life: "Životnost baterie",
    battery_replaced: "Baterie vložena dne (volitelné)",
    entities: "Entity (obecné senzory nebo náhrady)",
    e_status: "Stav",
    e_online: "Síťové napájení (binární senzor, zap. = síť)",
    e_battery: "Nabití baterie",
    e_runtime: "Výdrž",
    e_load: "Zátěž",
    e_input_voltage: "Vstupní napětí",
    e_output_voltage: "Výstupní napětí",
    e_power: "Výkon",
    e_temperature: "Teplota",
    e_battery_voltage: "Napětí baterie",
    e_frequency: "Frekvence",
    e_battery_date: "Datum baterie",
    unit_days: "dní",
    unit_years: "let",
    language: "Jazyk",
    lang_auto: "Automaticky",
    zoom: "Tlačítko detailu",
    zoom_helper: "Tlačítko vpravo nahoře, které přepíná minikartu na úplnou kartu a zpět",
    zoom_in: "Zobrazit úplnou kartu",
    zoom_out: "Zobrazit kompaktní kartu",
  },
  sl: {
    state_online: "Iz omrežja",
    state_charging: "Polnjenje",
    state_on_battery: "Na bateriji",
    state_low_battery: "Prazna baterija",
    state_overload: "Preobremenitev",
    state_bypass: "Obvod",
    state_calibrating: "Umerjanje",
    state_test: "Preizkus baterije",
    state_shutdown: "Izklapljanje",
    state_offline: "Brez povezave",
    state_unknown: "Neznano",
    battery: "Baterija",
    charge: "Napolnjenost",
    runtime: "Avtonomija",
    runtime_left: "še {time}",
    load: "Obremenitev",
    input_voltage: "Vhod",
    output_voltage: "Izhod",
    power: "Moč",
    apparent_power: "Navidezna moč",
    frequency: "Frekvenca",
    temperature: "Temperatura",
    battery_voltage: "Napetost baterije",
    battery_temperature: "Temperatura baterije",
    battery_date: "Baterija vstavljena",
    replace_by: "Zamenjati do",
    self_test: "Samopreizkus",
    section_power: "Napajanje",
    section_battery: "Baterija",
    section_outages: "Izpadi",
    outages_n_days: "Izpadi ({days} d)",
    time_on_battery: "Čas na bateriji",
    longest: "Najdaljši",
    no_outage: "Brez izpadov v zadnjih {days} dneh",
    history_loading: "Nalaganje zgodovine…",
    history_error: "Zgodovina ni na voljo",
    ongoing: "poteka",
    last_transfer: "Zadnji preklop",
    transfers: "Preklopi",
    alert_on_battery: "Deluje na bateriji",
    alert_on_battery_for: "Na bateriji že {time}",
    alert_low_battery: "Prazna baterija: izklop je neizbežen",
    alert_overload: "Preobremenitev: zmanjšajte priključeno obremenitev",
    alert_replace: "Baterijo je treba zamenjati",
    alert_replace_due: "Zamenjava baterije predvidena {date}",
    alert_offline: "Ni komunikacije z UPS",
    alert_output_off: "Izhod UPS je izklopljen: priključene naprave nimajo napajanja",
    alert_no_battery: "Baterija ni zaznana",
    alert_alarm: "UPS javlja alarm",
    alert_shutdown: "Poteka prisilni izklop",
    alert_high_load: "Visoka obremenitev: {pct}",
    no_device: "Ni najdenega UPS. Nastavite Network UPS Tools (NUT) ali APC UPS Daemon ali kartici podajte lastne entitete.",
    unknown_device: "UPS ni najden",
    no_registry: "Ta kartica zahteva Home Assistant 2024.8 ali novejši.",
    generic_name: "UPS",
    device: "UPS",
    device_none: "Brez (samo entitete spodaj)",
    device_helper: "UPS iz integracije NUT ali APC UPS Daemon",
    title: "Naslov (neobvezno, privzeto ime naprave)",
    show_title: "Prikaži naslov",
    show_subtitle: "Prikaži podnaslov",
    show_alerts: "Prikaži opozorila",
    show_power: "Prikaži napajanje",
    show_battery: "Prikaži baterijo",
    show_outages: "Prikaži zgodovino izpadov",
    collapsed: "Privzeto strnjeni razdelki",
    history_days: "Zgodovina izpadov",
    max_outages: "Prikazani izpadi",
    low_runtime: "Prag nizke avtonomije",
    battery_life: "Življenjska doba baterije",
    battery_replaced: "Baterija vstavljena dne (neobvezno)",
    entities: "Entitete (splošni senzorji ali nadomestki)",
    e_status: "Stanje",
    e_online: "Omrežno napajanje (binarni senzor, vklop = omrežje)",
    e_battery: "Napolnjenost baterije",
    e_runtime: "Avtonomija",
    e_load: "Obremenitev",
    e_input_voltage: "Vhodna napetost",
    e_output_voltage: "Izhodna napetost",
    e_power: "Moč",
    e_temperature: "Temperatura",
    e_battery_voltage: "Napetost baterije",
    e_frequency: "Frekvenca",
    e_battery_date: "Datum baterije",
    unit_days: "dni",
    unit_years: "let",
    language: "Jezik",
    lang_auto: "Samodejno",
    zoom: "Gumb za podrobnosti",
    zoom_helper: "Gumb zgoraj desno, ki preklopi mini kartico na polno kartico in nazaj",
    zoom_in: "Prikaži polno kartico",
    zoom_out: "Prikaži kompaktno kartico",
  },
  lv: {
    state_online: "No tīkla",
    state_charging: "Uzlādējas",
    state_on_battery: "No akumulatora",
    state_low_battery: "Zems uzlādes līmenis",
    state_overload: "Pārslodze",
    state_bypass: "Apvads",
    state_calibrating: "Kalibrēšana",
    state_test: "Akumulatora tests",
    state_shutdown: "Izslēdzas",
    state_offline: "Bezsaistē",
    state_unknown: "Nezināms",
    battery: "Akumulators",
    charge: "Uzlāde",
    runtime: "Darbības laiks",
    runtime_left: "atlicis {time}",
    load: "Slodze",
    input_voltage: "Ieeja",
    output_voltage: "Izeja",
    power: "Jauda",
    apparent_power: "Šķietamā jauda",
    frequency: "Frekvence",
    temperature: "Temperatūra",
    battery_voltage: "Akumulatora spriegums",
    battery_temperature: "Akumulatora temperatūra",
    battery_date: "Akumulators ievietots",
    replace_by: "Nomainīt līdz",
    self_test: "Pašpārbaude",
    section_power: "Barošana",
    section_battery: "Akumulators",
    section_outages: "Strāvas pārtraukumi",
    outages_n_days: "Pārtraukumi ({days} d)",
    time_on_battery: "Laiks no akumulatora",
    longest: "Garākais",
    no_outage: "Pēdējās {days} dienās pārtraukumu nav",
    history_loading: "Ielādē vēsturi…",
    history_error: "Vēsture nav pieejama",
    ongoing: "notiek",
    last_transfer: "Pēdējā pārslēgšana",
    transfers: "Pārslēgšanas",
    alert_on_battery: "Darbojas no akumulatora",
    alert_on_battery_for: "No akumulatora jau {time}",
    alert_low_battery: "Zems uzlādes līmenis: drīz izslēgsies",
    alert_overload: "Pārslodze: samaziniet pievienoto slodzi",
    alert_replace: "Akumulators jānomaina",
    alert_replace_due: "Akumulatora nomaiņa paredzēta {date}",
    alert_offline: "Nav saziņas ar UPS",
    alert_output_off: "UPS izeja ir izslēgta: pievienotās ierīces netiek barotas",
    alert_no_battery: "Akumulators nav atrasts",
    alert_alarm: "UPS ziņo par trauksmi",
    alert_shutdown: "Notiek piespiedu izslēgšana",
    alert_high_load: "Augsta slodze: {pct}",
    no_device: "UPS nav atrasts. Iestatiet Network UPS Tools (NUT) vai APC UPS Daemon vai norādiet kartei savas entītijas.",
    unknown_device: "UPS nav atrasts",
    no_registry: "Šai kartei nepieciešams Home Assistant 2024.8 vai jaunāks.",
    generic_name: "UPS",
    device: "UPS",
    device_none: "Nav (tikai zemāk norādītās entītijas)",
    device_helper: "UPS no integrācijas NUT vai APC UPS Daemon",
    title: "Virsraksts (neobligāts, pēc noklusējuma ierīces nosaukums)",
    show_title: "Rādīt virsrakstu",
    show_subtitle: "Rādīt apakšvirsrakstu",
    show_alerts: "Rādīt brīdinājumus",
    show_power: "Rādīt barošanu",
    show_battery: "Rādīt akumulatoru",
    show_outages: "Rādīt pārtraukumu vēsturi",
    collapsed: "Pēc noklusējuma sakļautās sadaļas",
    history_days: "Pārtraukumu vēsture",
    max_outages: "Parādītie pārtraukumi",
    low_runtime: "Zema darbības laika slieksnis",
    battery_life: "Akumulatora kalpošanas laiks",
    battery_replaced: "Akumulators ievietots (neobligāti)",
    entities: "Entītijas (vispārīgi sensori vai aizstājēji)",
    e_status: "Stāvoklis",
    e_online: "Tīkla barošana (binārs sensors, ieslēgts = tīkls)",
    e_battery: "Akumulatora uzlāde",
    e_runtime: "Darbības laiks",
    e_load: "Slodze",
    e_input_voltage: "Ieejas spriegums",
    e_output_voltage: "Izejas spriegums",
    e_power: "Jauda",
    e_temperature: "Temperatūra",
    e_battery_voltage: "Akumulatora spriegums",
    e_frequency: "Frekvence",
    e_battery_date: "Akumulatora datums",
    unit_days: "dienas",
    unit_years: "gadi",
    language: "Valoda",
    lang_auto: "Automātiski",
    zoom: "Detaļu poga",
    zoom_helper: "Poga augšējā labajā stūrī, kas pārslēdz mini karti uz pilno karti un atpakaļ",
    zoom_in: "Rādīt pilno karti",
    zoom_out: "Rādīt kompakto karti",
  },
  el: {
    state_online: "Από το δίκτυο",
    state_charging: "Φόρτιση",
    state_on_battery: "Σε μπαταρία",
    state_low_battery: "Χαμηλή μπαταρία",
    state_overload: "Υπερφόρτωση",
    state_bypass: "Παράκαμψη",
    state_calibrating: "Βαθμονόμηση",
    state_test: "Έλεγχος μπαταρίας",
    state_shutdown: "Τερματισμός",
    state_offline: "Εκτός σύνδεσης",
    state_unknown: "Άγνωστο",
    battery: "Μπαταρία",
    charge: "Φόρτιση",
    runtime: "Αυτονομία",
    runtime_left: "απομένουν {time}",
    load: "Φορτίο",
    input_voltage: "Είσοδος",
    output_voltage: "Έξοδος",
    power: "Ισχύς",
    apparent_power: "Φαινόμενη ισχύς",
    frequency: "Συχνότητα",
    temperature: "Θερμοκρασία",
    battery_voltage: "Τάση μπαταρίας",
    battery_temperature: "Θερμοκρασία μπαταρίας",
    battery_date: "Τοποθέτηση μπαταρίας",
    replace_by: "Αντικατάσταση έως",
    self_test: "Αυτοέλεγχος",
    section_power: "Τροφοδοσία",
    section_battery: "Μπαταρία",
    section_outages: "Διακοπές ρεύματος",
    outages_n_days: "Διακοπές ({days} ημ.)",
    time_on_battery: "Χρόνος σε μπαταρία",
    longest: "Η μεγαλύτερη",
    no_outage: "Καμία διακοπή τις τελευταίες {days} ημέρες",
    history_loading: "Φόρτωση ιστορικού…",
    history_error: "Το ιστορικό δεν είναι διαθέσιμο",
    ongoing: "σε εξέλιξη",
    last_transfer: "Τελευταία μεταγωγή",
    transfers: "Μεταγωγές",
    alert_on_battery: "Λειτουργεί με μπαταρία",
    alert_on_battery_for: "Σε μπαταρία εδώ και {time}",
    alert_low_battery: "Χαμηλή μπαταρία: επικείμενος τερματισμός",
    alert_overload: "Υπερφόρτωση: μειώστε το συνδεδεμένο φορτίο",
    alert_replace: "Η μπαταρία χρειάζεται αντικατάσταση",
    alert_replace_due: "Αντικατάσταση μπαταρίας στις {date}",
    alert_offline: "Καμία επικοινωνία με το UPS",
    alert_output_off: "Η έξοδος του UPS είναι κλειστή: οι συνδεδεμένες συσκευές δεν τροφοδοτούνται",
    alert_no_battery: "Δεν εντοπίστηκε μπαταρία",
    alert_alarm: "Το UPS αναφέρει συναγερμό",
    alert_shutdown: "Αναγκαστικός τερματισμός σε εξέλιξη",
    alert_high_load: "Υψηλό φορτίο: {pct}",
    no_device: "Δεν βρέθηκε UPS. Ρυθμίστε το Network UPS Tools (NUT) ή το APC UPS Daemon ή δώστε στην κάρτα δικές σας οντότητες.",
    unknown_device: "Το UPS δεν βρέθηκε",
    no_registry: "Αυτή η κάρτα απαιτεί Home Assistant 2024.8 ή νεότερο.",
    generic_name: "UPS",
    device: "UPS",
    device_none: "Κανένα (μόνο οι οντότητες παρακάτω)",
    device_helper: "UPS της ενσωμάτωσης NUT ή APC UPS Daemon",
    title: "Τίτλος (προαιρετικός, προεπιλογή το όνομα της συσκευής)",
    show_title: "Εμφάνιση τίτλου",
    show_subtitle: "Εμφάνιση υπότιτλου",
    show_alerts: "Εμφάνιση ειδοποιήσεων",
    show_power: "Εμφάνιση τροφοδοσίας",
    show_battery: "Εμφάνιση μπαταρίας",
    show_outages: "Εμφάνιση ιστορικού διακοπών",
    collapsed: "Ενότητες συμπτυγμένες εξ ορισμού",
    history_days: "Ιστορικό διακοπών",
    max_outages: "Διακοπές στη λίστα",
    low_runtime: "Όριο χαμηλής αυτονομίας",
    battery_life: "Διάρκεια ζωής μπαταρίας",
    battery_replaced: "Τοποθέτηση μπαταρίας στις (προαιρετικό)",
    entities: "Οντότητες (γενικοί αισθητήρες ή αντικαταστάσεις)",
    e_status: "Κατάσταση",
    e_online: "Ρεύμα δικτύου (δυαδικός αισθητήρας, ενεργό = δίκτυο)",
    e_battery: "Φόρτιση μπαταρίας",
    e_runtime: "Αυτονομία",
    e_load: "Φορτίο",
    e_input_voltage: "Τάση εισόδου",
    e_output_voltage: "Τάση εξόδου",
    e_power: "Ισχύς",
    e_temperature: "Θερμοκρασία",
    e_battery_voltage: "Τάση μπαταρίας",
    e_frequency: "Συχνότητα",
    e_battery_date: "Ημερομηνία μπαταρίας",
    unit_days: "ημέρες",
    unit_years: "έτη",
    language: "Γλώσσα",
    lang_auto: "Αυτόματα",
    zoom: "Κουμπί λεπτομερειών",
    zoom_helper: "Κουμπί πάνω δεξιά που αλλάζει τη μίνι κάρτα στην πλήρη κάρτα και πίσω",
    zoom_in: "Εμφάνιση πλήρους κάρτας",
    zoom_out: "Εμφάνιση συμπαγούς κάρτας",
  },
};

// ---------------------------------------------------------------------------
// Icons (24 × 24, drawn with the even-odd rule)
// ---------------------------------------------------------------------------

const ICONS = {
  ups: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v16h10V4zm6.5 2L9 12.5h2.6L10.5 18 15 11.2h-2.6z",
  battery: "M9.5 2h5v2H16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h1.5z",
  clock: "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm-.75 3h1.5v5.3l4.4 2.6-.75 1.3-5.15-3.05z",
  gauge: "M12 4a10 10 0 0 1 8.66 15H3.34A10 10 0 0 1 12 4zm0 2a8 8 0 0 0-7.4 11h14.8A8 8 0 0 0 12 6zm4.3 2.3 1.4 1.4-4.3 4.4a1.6 1.6 0 1 1-1.4-1.4z",
  bolt: "M7 2v11h3v9l7-12h-4l4-8z",
  plug: "M8 3h2v4h4V3h2v4a2 2 0 0 1 2 2v5.5L14.5 18v3h-5v-3L6 14.5V9a2 2 0 0 1 2-2z",
  socket: "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm-3.5 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z",
  thermometer: "M12 2a3 3 0 0 1 3 3v8a5 5 0 1 1-6 0V5a3 3 0 0 1 3-3zm0 2a1 1 0 0 0-1 1v9.1a3 3 0 1 0 2 0V5a1 1 0 0 0-1-1z",
  wave: "M2 11h2.2c.8-3 2-5 3.8-5s3 2.6 3.7 6c.6 2.9 1.4 4 2.3 4s1.6-1.4 2.2-4h2.1c-.8 3.6-2.1 6-4.3 6-2.3 0-3.4-2.6-4.1-5.8C9.3 9.3 8.6 8 8 8c-.7 0-1.4 1.4-1.8 3.4L6 13H2z",
  calendar: "M6 2h2v2h8V2h2v2h1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1zM5 9v11h14V9z",
  history:
    "M13 3a9 9 0 1 1-6.37 15.37l1.42-1.42A7 7 0 1 0 6 12h3l-4 4-4-4h3a9 9 0 0 1 9-9zm-1 5h1.5v4.15l3.5 2.08-.77 1.28L12 13z",
  alert: "M12 2 1 21h22zm-1 7h2v5h-2zm0 7h2v2h-2z",
  check: "M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm4.6 5.6L10 14.2l-2.6-2.6L6 13l4 4 8-8z",
  swap: "M17 5l4 4-4 4v-3h-7V8h7zM7 11v3h7v2H7v3l-4-4z",
  chevron_down: "M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6z",
  expand: "M10 21v-2H6.41l4.5-4.5-1.41-1.41-4.5 4.5V14H3v7zm4.5-10.09 4.5-4.5V10h2V3h-7v2h3.59l-4.5 4.5z",
  collapse: "M19.5 3.09 15 7.59V4h-2v7h7V9h-3.59l4.5-4.5zM4 13v2h3.59l-4.5 4.5 1.41 1.41L9 16.41V20h2v-7z",
};

// ---------------------------------------------------------------------------
// Sources: the integrations the card reads, and how their entities map onto the card's keys
// ---------------------------------------------------------------------------

// translation_key → card key. Entities without a translation_key are matched by their device class (`dc:`), binary
// sensors first by `bs:<translation_key>` (apcupsd has a sensor and a binary sensor named online_status).
const SOURCES = {
  nut: {
    name: "Network UPS Tools",
    logo: IMG_NUT,
    site: "https://networkupstools.org/",
    keys: {
      ups_status: "status",
      ups_status_display: "status_display",
      battery_charge: "battery",
      battery_runtime: "runtime",
      ups_load: "load",
      input_voltage: "input_voltage",
      output_voltage: "output_voltage",
      ups_realpower: "power",
      ups_realpower_nominal: "power_nominal",
      ups_power_nominal: "apparent_power_nominal",
      ups_temperature: "temperature",
      battery_temperature: "battery_temperature",
      battery_voltage: "battery_voltage",
      input_frequency: "frequency",
      battery_date: "battery_date",
      battery_mfr_date: "battery_mfr_date",
      ups_test_result: "self_test",
      battery_charge_low: "battery_low",
      "dc:apparent_power": "apparent_power",
    },
  },
  apcupsd: {
    name: "APC UPS Daemon",
    logo: IMG_APC,
    site: "http://www.apcupsd.org/",
    keys: {
      status: "status",
      "bs:online_status": "online",
      "dc:battery": "battery",
      time_left: "runtime",
      load_capacity: "load",
      line_voltage: "input_voltage",
      output_voltage: "output_voltage",
      nominal_output_power: "power_nominal",
      nominal_apparent_power: "apparent_power_nominal",
      internal_temperature: "temperature",
      battery_voltage: "battery_voltage",
      line_frequency: "frequency",
      battery_replacement_date: "battery_date",
      manufacture_date: "battery_mfr_date",
      self_test_result: "self_test",
      last_transfer: "last_transfer",
      transfer_count: "transfers",
      time_on_battery: "time_on_battery",
      transfer_from_battery: "back_on_mains",
      total_time_on_battery: "total_time_on_battery",
      low_battery_signal: "battery_low",
    },
  },
};

// Keys that can be set by hand (generic sensors, or to replace what an integration gives), in the editor's order.
const ENTITY_KEYS = [
  ["status", ["sensor"]],
  ["online", ["binary_sensor"]],
  ["battery", ["sensor"]],
  ["runtime", ["sensor"]],
  ["load", ["sensor"]],
  ["input_voltage", ["sensor"]],
  ["output_voltage", ["sensor"]],
  ["power", ["sensor"]],
  ["temperature", ["sensor"]],
  ["battery_voltage", ["sensor"]],
  ["frequency", ["sensor"]],
  ["battery_date", ["sensor", "input_datetime"]],
];

const SECTIONS = ["power", "battery", "outages"];
const DEFAULT_COLLAPSED = [];
const DEFAULTS = { history_days: 30, max_outages: 5, battery_life: 4, low_runtime: 10 };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const lang = (hass, config) => {
  const l = config?.language || (hass && (hass.locale?.language || hass.language)) || "en";
  return STRINGS[l] ? l : STRINGS[l.split("-")[0]] ? l.split("-")[0] : "en";
};

// Locale for Intl: the card's language option, else Home Assistant's full locale (keeps its region, e.g. pt-BR,
// de-CH) when its base matches the card language, else that language. A bare "pt" (European Portuguese for Home
// Assistant) becomes "pt-PT", otherwise Intl formats it the Brazilian way.
const intlLocale = (hass, config) => {
  const l = lang(hass, config);
  const src = config?.language || (hass && (hass.locale?.language || hass.language)) || "";
  const out = src && src.split("-")[0] === l.split("-")[0] ? src : l;
  return out === "pt" ? "pt-PT" : out;
};

const t = (hass, config, key, vars = {}) =>
  String(STRINGS[lang(hass, config)][key] ?? STRINGS.en[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

const valid = (s) => !!s && !["unknown", "unavailable", ""].includes(s.state);

const num = (s) => {
  if (!valid(s)) return null;
  const v = parseFloat(s.state);
  return Number.isFinite(v) ? v : null;
};

const clampInt = (v, min, max, def) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && v !== "" && v !== null ? Math.min(max, Math.max(min, n)) : def;
};

// Duration sensor → seconds, whatever its unit (NUT reports seconds, apcupsd minutes).
const seconds = (s) => {
  const v = num(s);
  if (v === null) return null;
  const u = String(s.attributes?.unit_of_measurement ?? "s").toLowerCase();
  if (u === "min" || u.startsWith("minute")) return v * 60;
  if (u === "h" || u.startsWith("hour")) return v * 3600;
  if (u === "d" || u.startsWith("day")) return v * 86400;
  if (u === "ms") return v / 1000;
  return v;
};

const UNIT_FMT = {};
const fmtUnit = (v, unit, locale) =>
  (UNIT_FMT[`${locale}|${unit}`] ??= new Intl.NumberFormat(locale, { style: "unit", unit, unitDisplay: "short" })).format(v);

// Duration in seconds, with the units of the language: "42 s", "4 min 12 s", "38 min", "1 h 12 min", "14 h", "3 d".
const fmtDuration = (sec, locale) => {
  if (sec === null || sec === undefined || !Number.isFinite(sec)) return "—";
  const s = Math.max(0, Math.round(sec));
  if (s < 60) return fmtUnit(s, "second", locale);
  if (s < 600) {
    const r = s % 60;
    const m = fmtUnit(Math.floor(s / 60), "minute", locale);
    return r ? `${m} ${fmtUnit(r, "second", locale)}` : m;
  }
  const min = Math.round(s / 60);
  if (min < 60) return fmtUnit(min, "minute", locale);
  if (min < 600) {
    const r = min % 60;
    const h = fmtUnit(Math.floor(min / 60), "hour", locale);
    return r ? `${h} ${fmtUnit(r, "minute", locale)}` : h;
  }
  if (s < 172800) return fmtUnit(Math.round(s / 3600), "hour", locale);
  return fmtUnit(Math.round(s / 86400), "day", locale);
};

const fmtNum = (v, digits, locale) =>
  v === null || v === undefined ? "—" : Number(v).toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: digits });

// A measurement with its unit: percentages are whole numbers, voltages above 100 V too.
const fmtValue = (v, unit, locale, digits = 1) => {
  if (v === null || v === undefined) return "—";
  const u = unit === undefined || unit === null ? "" : String(unit);
  const d = u === "%" ? 0 : u === "W" || u === "VA" ? 0 : u === "V" && Math.abs(v) >= 100 ? 0 : digits;
  return `${fmtNum(u === "%" ? Math.round(v) : v, d, locale)}${u ? ` ${u}` : ""}`;
};

// Dates of the battery: "2023-05-12", "2023/05/12", "05/12/23" or "05/12/2023" (month first, as NUT and apcupsd
// write them), "12.05.2023", an ISO timestamp. Midnight UTC of that day, or null.
const parseDate = (raw) => {
  const s = String(raw ?? "").trim();
  if (!s) return null;
  let m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  let y;
  let mo;
  let d;
  if (m) [, y, mo, d] = m;
  else if ((m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/))) [, mo, d, y] = m;
  else if ((m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/))) [, d, mo, y] = m;
  else return null;
  y = Number(y);
  if (y < 100) y += 2000;
  const ms = Date.UTC(y, Number(mo) - 1, Number(d));
  const date = new Date(ms);
  return date.getUTCMonth() === Number(mo) - 1 && date.getUTCDate() === Number(d) ? ms : null;
};

const addYears = (ms, years) => {
  const d = new Date(ms);
  d.setUTCFullYear(d.getUTCFullYear() + years);
  return d.getTime();
};

const DATE_FMT = {};
const fmtDate = (ms, locale) =>
  (DATE_FMT[`${locale}|d`] ??= new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" })).format(ms);
// Start of an outage: day, month and time, in Home Assistant's time zone when the profile asks for the server's.
const fmtDateTime = (ms, locale, timeZone) =>
  (DATE_FMT[`${locale}|${timeZone}`] ??= new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...(timeZone ? { timeZone } : {}),
  })).format(ms);

const svgIcon = (path, cls = "") => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;

// ---------------------------------------------------------------------------
// UPS state
// ---------------------------------------------------------------------------

// The UPS state, from a NUT status ("OL CHRG", "OB DISCHRG LB"), its readable form ("Online, Battery Charging"), an
// apcupsd status ("ONLINE", "ONBATT LOWBATT", "COMMLOST") or the words of another sensor ("on battery", "charging").
// Returns { key, flags, onBattery, online, deliberate }: key one of STATES, flags among replace, trim, boost, alarm,
// low, off (NUT OFF: the output is off), nobatt; onBattery / online as the status says them, whatever the key (an
// overload or a forced shutdown on battery is still on battery); deliberate for a calibration or a battery test, which
// run on battery on purpose.
const STATES = ["online", "charging", "on_battery", "low_battery", "overload", "bypass", "calibrating", "test", "shutdown", "offline", "unknown"];
const parseStatus = (raw) => {
  const s = ` ${String(raw ?? "").toUpperCase().replace(/[_,;]+/g, " ").replace(/\s+/g, " ").trim()} `;
  const has = (re) => re.test(s);
  const flags = new Set();
  if (has(/ RB | REPLACEBATT | REPLACE/)) flags.add("replace");
  if (has(/ TRIM| TRIMMING/)) flags.add("trim");
  if (has(/ BOOST/)) flags.add("boost");
  if (has(/ ALARM /)) flags.add("alarm");
  if (has(/ NOBATT | NO BATTERY /)) flags.add("nobatt");
  // NUT OFF (readable form "Offline"): the UPS does not feed its outlets, which is not a lost communication.
  if (has(/ OFF /)) flags.add("off");
  const onBattery = has(/ OB | ONBATT | ON BATTERY /);
  const online = has(/ OL | ONLINE | ON LINE | ON MAINS | MAINS /);
  const low = has(/ LB | LOWBATT | LOW BATTERY /);
  if (low) flags.add("low");
  const calibrating = has(/ CAL | CALIBRATION | CALIBRATING /);
  const testing = has(/ TEST | TESTING /);
  let key = "unknown";
  if (has(/ FSD | SHUTTING DOWN | FORCED SHUTDOWN | SHUTDOWN /)) key = "shutdown";
  else if (has(/ OVER | OVERLOAD/)) key = "overload";
  else if (flags.has("off") || (has(/ OFFLINE | COMMLOST | NOCOMM | UNAVAILABLE /) && !online && !onBattery)) key = "offline";
  // A runtime calibration or a battery test runs on battery on purpose (NUT "OB CAL", "OB TEST"): not an outage.
  else if (calibrating) key = "calibrating";
  else if (testing) key = "test";
  else if (onBattery) key = low ? "low_battery" : "on_battery";
  else if (has(/ BYPASS /)) key = "bypass";
  else if (has(/ CHRG | CHARGING /)) key = "charging";
  else if (online || has(/ TRIM| BOOST/)) key = "online";
  return { key, flags, onBattery, online, deliberate: calibrating || testing };
};

// How a status reads for the outage history: true on battery (an overload or a forced shutdown on battery included,
// a calibration or a battery test left out), false on the mains, null when it tells nothing (no communication,
// unknown words): the outage then goes on until a status says the mains is back.
const statusOnBattery = (raw) => {
  if (["unavailable", "unknown", ""].includes(raw)) return null;
  const p = parseStatus(raw);
  if (p.onBattery || isOnBattery(p.key)) return !p.deliberate;
  if (p.online) return false;
  return p.key === "unknown" || p.key === "offline" || p.key === "shutdown" ? null : false;
};

// State → color class of the dot, chip, header icon and picture.
const STATE_CLASS = {
  online: "ok",
  charging: "active",
  on_battery: "warn",
  low_battery: "crit",
  overload: "crit",
  bypass: "warn",
  calibrating: "active",
  test: "active",
  shutdown: "crit",
  offline: "crit",
  unknown: "idle",
};
// Every state has its color class.
for (const k of STATES) STATE_CLASS[k] ??= "idle";
const isOnBattery = (key) => key === "on_battery" || key === "low_battery";

// Outages from a status history: points [{ state, t }] in time order (t in ms), `battery(state)` telling the ones on
// battery. Returns [{ start, end, duration }] newest first, `end` null for one still going on at `now`. Outages
// shorter than `minSeconds` are left out (a self-test switching to battery for a few seconds, say).
const outagesOf = (points, battery, now, minSeconds = 0) => {
  const out = [];
  let start = null;
  for (const p of points) {
    if (!Number.isFinite(p.t)) continue;
    const b = battery(p.state);
    if (b === null) continue;
    if (b && start === null) start = p.t;
    else if (!b && start !== null) {
      out.push({ start, end: p.t, duration: (p.t - start) / 1000 });
      start = null;
    }
  }
  if (start !== null) out.push({ start, end: null, duration: (now - start) / 1000 });
  return out.filter((o) => o.end === null || o.duration >= minSeconds).reverse();
};

// ---------------------------------------------------------------------------
// Registry-based resolution
// ---------------------------------------------------------------------------

const _cache = new WeakMap();

/**
 * UPS devices of the supported integrations, from hass.entities / hass.devices:
 * [{ id, name, source, manufacturer, model, entities: { key: entity_id } }], in the order of the device names.
 */
const resolve = (hass) => {
  if (!hass?.entities || !hass.devices) return null;
  const cached = _cache.get(hass.entities);
  if (cached && cached.devices === hass.devices) return cached.list;
  const byDevice = new Map();
  for (const e of Object.values(hass.entities)) {
    const src = SOURCES[e.platform];
    if (!src || !e.device_id || e.hidden) continue;
    const domain = e.entity_id.split(".")[0];
    if (domain !== "sensor" && domain !== "binary_sensor") continue;
    const tk = e.translation_key;
    const dc = hass.states?.[e.entity_id]?.attributes?.device_class;
    const key =
      (domain === "binary_sensor" ? src.keys[`bs:${tk}`] : tk && !src.keys[`bs:${tk}`] ? src.keys[tk] : undefined) ??
      (!tk && dc ? src.keys[`dc:${dc}`] : undefined);
    if (!key) continue;
    const item = byDevice.get(e.device_id) || { source: e.platform, entities: {} };
    item.entities[key] ??= e.entity_id;
    byDevice.set(e.device_id, item);
  }
  const list = [];
  for (const [id, item] of byDevice) {
    const d = hass.devices[id];
    if (!d) continue;
    list.push({ id, name: d.name_by_user || d.name || id, manufacturer: d.manufacturer || "", model: d.model || "", ...item });
  }
  list.sort((a, b) => a.name.localeCompare(b.name));
  _cache.set(hass.entities, { devices: hass.devices, list });
  return list;
};

const listDevices = (hass) => (resolve(hass) || []).map((d) => ({ value: d.id, label: `${d.name} (${SOURCES[d.source].name})` }));

// The UPS to show: the integration device given by `device` (id or name) or the first one, with the `entities` of the
// config on top; with entities only and no device, a generic UPS made of them.
const findDevice = (hass, config) => {
  const own = Object.fromEntries(Object.entries(config?.entities || {}).filter(([, v]) => typeof v === "string" && v));
  const list = resolve(hass);
  const generic = () => ({ id: null, name: config.title || t(hass, config, "generic_name"), source: "generic", manufacturer: "", model: "", entities: own });
  if (!list) return Object.keys(own).length ? { dev: generic() } : { error: "no_registry" };
  if (config?.device) {
    const dev = list.find((d) => d.id === config.device || d.name === config.device);
    if (!dev) return { error: "unknown_device" };
    return { dev: { ...dev, entities: { ...dev.entities, ...own } } };
  }
  if (Object.keys(own).length) return { dev: generic() };
  if (!list.length) return { error: "no_device" };
  return { dev: list[0] };
};

// ---------------------------------------------------------------------------
// Drawn UPS
// ---------------------------------------------------------------------------

// A tower UPS on its wall plug feeding a computer. The cables carry moving dashes while power flows (green on the
// mains, blue while charging, orange on battery, red when low or overloaded), the screen's battery gauge fills while
// charging and drains on battery, the power LED blinks when something is wrong. Still otherwise, and with reduced motion.
const upsSvg = (key, pct) => {
  const cls = STATE_CLASS[key] || "idle";
  const bars = pct === null || pct === undefined ? 0 : Math.max(pct > 0 ? 1 : 0, Math.min(4, Math.ceil(pct / 25)));
  const battery = isOnBattery(key);
  const dead = key === "offline" || key === "shutdown";
  const flowIn = !battery && !dead && key !== "unknown";
  const flowOut = !dead && key !== "unknown";
  const bar = (i) => {
    const on = i < bars;
    // The bar being charged blinks while charging, the last one left while on battery.
    const anim = key === "charging" && i === Math.min(bars, 3) ? " fill" : battery && i === bars - 1 ? " drain" : "";
    return `<rect class="bar${on || anim === " fill" ? " on" : ""}${anim}" x="${51.5 + i * 4.3}" y="29.5" width="3.3" height="7" rx=".6"/>`;
  };
  const cableIn = battery
    ? `<path class="cable" d="M17 70H25"/><path class="cable" d="M31 70H38"/><path class="spark" d="M26 66l2 3-2 1 3 4"/>`
    : `<path class="cable" d="M17 70H38"/>${flowIn ? `<path class="flow run in" d="M17 70H38"/>` : ""}`;
  return `<svg class="ups s-${key} ${cls}" viewBox="0 0 124 100" role="img" aria-hidden="true">
    <g class="plug"><rect x="3" y="62" width="14" height="16" rx="3"/><rect x="6" y="57" width="2.5" height="6" rx="1"/><rect x="11.5" y="57" width="2.5" height="6" rx="1"/></g>
    ${cableIn}
    <path class="cable" d="M86 70H98"/>${flowOut ? `<path class="flow run out" d="M86 70H98"/>` : ""}
    <g class="load${dead ? " off" : ""}"><rect class="screen" x="97" y="52" width="24" height="17" rx="2"/><rect class="foot" x="106" y="69" width="6" height="5"/><rect class="foot" x="102" y="74" width="14" height="2.5" rx="1"/></g>
    <g class="body">
      <rect class="case" x="38" y="12" width="48" height="82" rx="7"/>
      <rect class="edge" x="38" y="12" width="48" height="6" rx="3"/>
      <rect class="lcd" x="46" y="22" width="32" height="20" rx="2.5"/>
      <rect class="gauge" x="49.5" y="27.5" width="19" height="11" rx="1.5"/><rect class="nub" x="68.5" y="31" width="2.5" height="4" rx=".8"/>
      ${[0, 1, 2, 3].map(bar).join("")}
      <path class="vent" d="M48 52h28M48 57h28M48 62h28"/>
      ${battery ? `<circle class="wave" cx="62" cy="80" r="9"/><circle class="wave late" cx="62" cy="80" r="9"/>` : ""}
      <circle class="btn-ring" cx="62" cy="80" r="6.5"/>
      <circle class="led${["on_battery", "low_battery", "overload", "bypass", "shutdown"].includes(key) ? " blink" : ""}" cx="62" cy="80" r="3.2"/>
    </g>
  </svg>`;
};

const PICTURE_STYLE = `
  .ups { width: 100%; height: 100%; overflow: visible; --flow: var(--c, var(--uc-ok)); }
  .ups .plug rect { fill: #8b929c; }
  .ups .cable { fill: none; stroke: #8b929c; stroke-width: 3; stroke-linecap: round; }
  .ups .flow { fill: none; stroke: var(--flow); stroke-width: 3; stroke-linecap: round; stroke-dasharray: 3 7; }
  .ups .spark { fill: none; stroke: var(--uc-warn); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
  .ups .load .screen { fill: color-mix(in srgb, var(--flow) 22%, #39414c); stroke: #59626e; stroke-width: 1.5; }
  .ups .load.off .screen { fill: #2b3038; }
  .ups .load .foot { fill: #6b7380; }
  .ups .case { fill: #2f353d; stroke: #1d2228; stroke-width: 1.2; }
  .ups .edge { fill: #434b55; }
  .ups .lcd { fill: color-mix(in srgb, var(--flow) 30%, #10161c); }
  .ups.s-offline .lcd, .ups.s-shutdown .lcd { fill: #161b20; }
  .ups .gauge { fill: none; stroke: #e8edf2; stroke-width: 1.2; }
  .ups .nub { fill: #e8edf2; }
  .ups .bar { fill: #e8edf2; opacity: .14; }
  .ups .bar.on { opacity: .95; }
  .ups .vent { fill: none; stroke: #20252b; stroke-width: 2; stroke-linecap: round; }
  .ups .btn-ring { fill: #232930; stroke: #4a525d; stroke-width: 1.2; }
  .ups .led { fill: var(--flow); }
  .ups.s-offline .led, .ups.s-unknown .led { fill: #4a525d; }
  @keyframes ups-flow { to { stroke-dashoffset: -10; } }
  @keyframes ups-blink { 0%, 100% { opacity: 1; } 50% { opacity: .2; } }
  @keyframes ups-fill { 0%, 100% { opacity: .14; } 50% { opacity: .95; } }
  @keyframes ups-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-1.2px); } 75% { transform: translateX(1.2px); } }
  @keyframes ups-spark { 0%, 100% { opacity: 0; } 40%, 60% { opacity: 1; } }
  @keyframes ups-wave { from { transform: scale(.6); opacity: .9; } to { transform: scale(1.6); opacity: 0; } }
  .ups .wave { fill: none; stroke: var(--flow); stroke-width: 1.5; transform-box: fill-box; transform-origin: center; animation: ups-wave 1.5s ease-out infinite; }
  .ups .wave.late { animation-delay: -.75s; }
  .ups .flow.run { animation: ups-flow .5s linear infinite; }
  .ups.s-on_battery .flow.run, .ups.s-low_battery .flow.run { animation-duration: 1s; }
  .ups .led.blink { animation: ups-blink 1s ease-in-out infinite; }
  .ups.s-low_battery .led.blink, .ups.s-overload .led.blink { animation-duration: .5s; }
  .ups .bar.fill { animation: ups-fill 1.5s ease-in-out infinite; }
  .ups .bar.drain { animation: ups-blink 1.5s ease-in-out infinite; }
  .ups.s-low_battery .bar.drain { fill: var(--uc-crit); animation-duration: .75s; }
  .ups .spark { animation: ups-spark 1.5s ease-in-out infinite; }
  .ups.s-overload .body { animation: ups-shake .25s linear infinite; transform-box: fill-box; }
`;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const BASE_STYLE = `
  :host { --uc-accent: #2e7d32; --uc-ok: var(--success-color, #43a047); --uc-warn: var(--warning-color, #ffa600);
          --uc-crit: var(--error-color, #db4437); --uc-idle: var(--disabled-text-color, #9e9e9e); --uc-active: var(--info-color, #039be5);
          /* Text in a state color is mixed with the text color so that it reads at 4.5:1 at least. */
          --uc-accent-text: color-mix(in srgb, var(--uc-accent) 50%, var(--primary-text-color)); }
  ha-card { overflow: hidden; container-type: inline-size; }
  /* A size container has no width of its own: this zero-height grid gives the card a natural width without a minimum,
     so that it still shrinks to its track in a grid or a flex row. */
  :host { display: block; min-width: 0; --uc-natural-width: 360px; }
  :host::before { content: ""; display: grid; grid-template-columns: minmax(0, var(--uc-natural-width)); height: 0; }
  .icon { width: 18px; height: 18px; fill: currentColor; fill-rule: evenodd; flex: none; }
  .muted { color: var(--secondary-text-color); }
  .clickable { cursor: pointer; }
  [role="button"]:focus-visible { outline: 2px solid var(--primary-color, var(--uc-accent)); outline-offset: 2px; border-radius: 4px; }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; animation: none !important; } }
  .ok { --c: var(--uc-ok); } .warn { --c: var(--uc-warn); } .crit { --c: var(--uc-crit); } .idle { --c: var(--uc-idle); } .active { --c: var(--uc-active); }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--c, var(--uc-ok)); flex: none; display: inline-block; }
  .chip { display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; white-space: nowrap;
          background: color-mix(in srgb, var(--c, var(--uc-ok)) 15%, transparent); color: color-mix(in srgb, var(--c, var(--uc-ok)) 50%, var(--primary-text-color));
          flex: 0 1 auto; min-width: 0; max-width: 50%; overflow: hidden; box-sizing: border-box; }
  .chip-text { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .bar { height: 4px; border-radius: 3px; background: var(--divider-color, rgba(127,127,127,.25)); overflow: hidden; }
  .bar > div { height: 100%; border-radius: 3px; background: var(--c, var(--uc-ok)); transition: width .6s ease; }
  /* Title row: icon, titles, status chip (aligned on the title line) and the mini card's detail button. */
  .header { display: flex; align-items: center; gap: 10px; padding: 12px 12px 0; }
  /* With a subtitle, the chip stays on the title's line (16 px × 1.25 + 12 px subtitle line, centered: 14.4 px up). */
  .header:has(.sub) > .chip { margin-bottom: 14.4px; }
  .titles { flex: 1 1 0; min-width: 5ch; }
  :host([hide-title]) .titles > .name, :host([hide-subtitle]) .titles > .sub { display: none; }
  .name { font-size: 16px; font-weight: 500; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sub { font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .type-icon { position: relative; display: flex; flex: none; width: 40px; height: 40px; border-radius: 50%; align-items: center; justify-content: center;
               --uc-tint: var(--c, var(--uc-accent)); background: color-mix(in srgb, var(--uc-tint) 16%, transparent); transition: background-color .3s ease; }
  .type-icon .icon.type { width: 24px; height: 24px; fill: color-mix(in srgb, var(--uc-tint) 60%, var(--primary-text-color)); transition: fill .3s ease; }
  .type-icon .logo { position: absolute; right: -4px; bottom: -4px; width: 18px; height: 18px; border-radius: 5px; object-fit: contain;
                     background: #fff; box-shadow: 0 0 0 1px var(--divider-color, rgba(0,0,0,.12)), 0 0 0 3px var(--card-background-color, #fff); }
  .warning { padding: 16px; color: color-mix(in srgb, var(--uc-warn) 50%, var(--primary-text-color)); }
  .picture { flex: none; display: flex; align-items: center; justify-content: center; }
  .info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .line { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--secondary-text-color); min-width: 0; }
  .line .icon { width: 16px; height: 16px; color: var(--c, var(--secondary-text-color)); }
  .line span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .line b { font-weight: 500; color: var(--primary-text-color); }
  .alerts { display: flex; flex-direction: column; gap: 6px; }
  .alert { display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 8px 10px; border-radius: 10px;
           background: color-mix(in srgb, var(--c, var(--uc-crit)) 12%, transparent);
           border: 1px solid color-mix(in srgb, var(--c, var(--uc-crit)) 35%, transparent);
           color: color-mix(in srgb, var(--c, var(--uc-crit)) 50%, var(--primary-text-color)); }
  .alert .icon { width: 18px; height: 18px; color: var(--c, var(--uc-crit)); }
  .alert span { min-width: 0; }
  .zoom { all: unset; flex: none; cursor: pointer; width: 24px; height: 24px; margin: -2px -4px 0 0; border-radius: 50%;
          display: grid; place-items: center; color: var(--secondary-text-color);
          background: color-mix(in srgb, var(--uc-idle) 10%, transparent); border: 1px solid color-mix(in srgb, var(--uc-idle) 25%, transparent); }
  .zoom .icon { width: 14px; height: 14px; }
  .zoom:hover { background: color-mix(in srgb, var(--uc-idle) 18%, transparent); color: var(--primary-text-color); }
  .zoom:focus-visible { outline: 2px solid var(--primary-color, var(--uc-accent)); outline-offset: 1px; }
  /* Narrow card: the status chip keeps only its colored dot (its text stays in title and aria-label). */
  @container (max-width: 230px) {
    .chip { padding: 4px; flex: none; }
    .chip-text { display: none; }
    .header { gap: 6px; }
  }
`;

const FULL_STYLE = `
  .content { padding: 8px 12px 12px; display: flex; flex-direction: column; gap: 12px; }
  .hero { display: flex; gap: 12px; align-items: center; }
  .picture { width: 112px; height: 90px; }
  .batt { display: flex; align-items: center; gap: 8px; }
  .batt .pct { font-size: 30px; font-weight: 400; line-height: 1; }
  .batt .pct small { font-size: 14px; margin-left: 2px; color: var(--secondary-text-color); }
  .batt .icon { color: var(--c); width: 22px; height: 22px; }
  .meter { display: flex; flex-direction: column; gap: 3px; }
  .section-title { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; text-transform: uppercase;
                   letter-spacing: .04em; color: var(--secondary-text-color); margin-bottom: 6px; }
  .section-title .icon { width: 16px; height: 16px; }
  .section-title span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .section-title .count { margin-left: 4px; text-transform: none; letter-spacing: 0; font-weight: 400; }
  .section-title.toggle { cursor: pointer; user-select: none; }
  .section-title.toggle[aria-expanded="false"] { margin-bottom: 0; }
  .section-title .chevron { margin-left: auto; width: 16px; height: 16px; transition: transform .2s ease; }
  .section-title.toggle[aria-expanded="false"] .chevron { transform: rotate(-90deg); }
  .tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(116px, 1fr)); gap: 6px; }
  .tile { display: flex; flex-direction: column; gap: 2px; padding: 6px 10px; border-radius: 10px; min-width: 0;
          background: var(--secondary-background-color, rgba(127,127,127,.08)); }
  .tile .k { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; }
  .tile .k span { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
  .tile .k .icon { width: 14px; height: 14px; color: var(--c, var(--secondary-text-color)); }
  .tile .v { font-size: 14px; font-weight: 500; line-height: 1.3; overflow-wrap: anywhere; }
  .tile .v small { font-size: 11px; font-weight: 400; color: var(--secondary-text-color); }
  .tile.warn .v, .tile.crit .v { color: color-mix(in srgb, var(--c) 50%, var(--primary-text-color)); }
  .outages { display: flex; flex-direction: column; gap: 2px; margin-top: 8px; }
  .outage { display: grid; grid-template-columns: 16px minmax(0, 1fr) auto; align-items: center; gap: 8px; font-size: 12px;
            padding: 5px 8px; border-radius: 8px; }
  .outage:nth-child(odd) { background: color-mix(in srgb, var(--secondary-background-color, rgba(127,127,127,.08)) 70%, transparent); }
  .outage .icon { width: 16px; height: 16px; color: var(--c, var(--secondary-text-color)); }
  .outage .when { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .outage .dur { font-weight: 500; white-space: nowrap; }
  .outage.ongoing .dur { color: color-mix(in srgb, var(--uc-warn) 50%, var(--primary-text-color)); }
  .msg { font-size: 12px; color: var(--secondary-text-color); padding: 4px 2px; }
  @container (max-width: 300px) {
    .picture { width: 80px; height: 66px; }
    .hero { gap: 10px; }
    .tiles { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @container (max-width: 200px) {
    .picture { display: none; }
    .batt .pct { font-size: 24px; }
    .tiles { grid-template-columns: minmax(0, 1fr); }
  }
`;

const MINI_STYLE = `
  :host { --uc-natural-width: 300px; }
  .content { padding: 8px 12px 12px; display: flex; flex-direction: column; gap: 8px; }
  .row { display: flex; align-items: center; gap: 12px; }
  .picture { width: 72px; height: 58px; }
  .batt { display: flex; align-items: center; gap: 8px; font-size: 13px; }
  .batt .icon { color: var(--c); width: 16px; height: 16px; }
  .batt .bar { flex: 1; }
  .batt .v { font-weight: 500; min-width: 40px; text-align: right; }
  .alert { padding: 6px 8px; font-size: 12px; }
  @container (max-width: 220px) {
    .picture { display: none; }
  }
`;

// Element names of Home Assistant dialogs (more-info opened from the card, among others).
const DIALOG_TAGS = new Set(["HA-MORE-INFO-DIALOG", "HA-DIALOG", "DIALOG"]);
const isOutside = (card, ev) => {
  const path = ev.composedPath();
  return !path.includes(card) && !path.some((n) => DIALOG_TAGS.has(n.tagName));
};

// "A click elsewhere" is caught on the pointer, not only on the click event: on iOS (Safari and the companion app)
// a tap on something that is not clickable (the background, an empty spot, a card with no action) sends no click to
// the page. It counts when the press and the release are both outside the card (a slider dragged out of the card
// does not fold it), and a scroll does not count (the browser cancels the pointer). Keyboard clicks still go through
// the click event.
const watchOutside = (card, handler) => {
  let downOutside = false;
  const onDown = (ev) => {
    downOutside = isOutside(card, ev);
  };
  const onUp = (ev) => {
    if (downOutside && isOutside(card, ev)) handler(ev);
    downOutside = false;
  };
  const onClick = (ev) => {
    if (ev.detail === 0 && isOutside(card, ev)) handler(ev);
  };
  return {
    on() {
      document.addEventListener("pointerdown", onDown, true);
      document.addEventListener("pointerup", onUp, true);
      document.addEventListener("click", onClick, true);
    },
    // A tap (press and release at the same spot), for the tests.
    tap(ev) {
      onDown(ev);
      onUp(ev);
    },
    off() {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointerup", onUp, true);
      document.removeEventListener("click", onClick, true);
    },
  };
};

// Elements a click acts on, and how one is told from the others across renders (see _focusedSpot).
const FOCUS_SELECTOR = "[data-action], [data-entity]";
const focusKey = (el) => {
  const data = Object.entries({ ...el.dataset });
  return data.length ? `${el.tagName}|${JSON.stringify(data)}` : "";
};

const sameDeps = (a, b) => !!a && a.length === b.length && a.every((d, i) => d === b[i]);
const HISTORY_REFRESH_MS = 15 * 60 * 1000;
// How long after the mains came back a battery not full reads "Charging" when the UPS does not say it.
const CHARGING_WINDOW_MS = 12 * 3600 * 1000;

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------

class UpsBase extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._html = "";
    this.shadowRoot.addEventListener("click", (ev) => this._onClick(ev));
    // Enter / Space on an element with the button role acts as a click, as on a <button>.
    this.shadowRoot.addEventListener("keydown", (ev) => {
      if ((ev.key !== "Enter" && ev.key !== " ") || ev.target?.getAttribute?.("role") !== "button") return;
      ev.preventDefault();
      ev.target.click();
    });
  }

  // Home Assistant pushes a new hass on every state change of the whole instance: the card is only rebuilt when
  // something it shows changed (see _deps).
  set hass(hass) {
    this._hass = hass;
    const deps = this._deps();
    if (deps && sameDeps(this._lastDeps, deps)) return;
    this._lastDeps = deps;
    this._update();
  }

  get hass() {
    return this._hass;
  }

  // What a render reads from hass: registries, language, the states of the UPS entities and the relative times
  // (minute tick). null (no UPS found): always render.
  _deps() {
    const h = this._hass;
    if (!h || !this._config) return null;
    const { dev } = findDevice(h, this._config);
    if (!dev) return null;
    const ids = Object.values(dev.entities);
    return [h.entities, h.devices, h.language, h.locale, h.formatEntityState, h.themes?.darkMode, this._history, this._minute, ...ids.map((id) => h.states[id])];
  }

  connectedCallback() {
    // A click elsewhere on the page folds the sections back to their defaults.
    this._outside ??= watchOutside(this, () => {
      if (!this._toggled?.size) return;
      this._toggled = new Map();
      this._update();
    });
    this._outside.on();
    // Back on the page after leaving it: rendered again in its default state.
    if (this._hass && this._config) this._update();
    // "On battery for 4 minutes" moves on its own: re-checked every minute while the card is on the page.
    clearInterval(this._tick);
    this._tick = setInterval(() => {
      this._minute = Math.floor(Date.now() / 60000);
      if (this._hass) this.hass = this._hass;
    }, 60000);
  }

  disconnectedCallback() {
    clearInterval(this._tick);
    this._tick = null;
    this._outside?.off();
    // Left (another dashboard view, a conditional card hidden): back to the defaults, so that the card does not
    // come back unfolded.
    this._toggled = new Map();
  }

  setConfig(config) {
    if (!config || typeof config !== "object") throw new Error("Invalid configuration");
    if (config.entities !== undefined && (typeof config.entities !== "object" || Array.isArray(config.entities))) {
      throw new Error("entities must be a map of keys to entity ids");
    }
    this._config = { ...config };
    this.toggleAttribute?.("hide-title", config.show_title === false);
    this.toggleAttribute?.("hide-subtitle", config.show_subtitle === false);
    this._html = "";
    this._lastDeps = null;
    this._history = null;
    this._update();
  }

  _t(key, vars) {
    return t(this._hass, this._config, key, vars);
  }

  _locale() {
    return intlLocale(this._hass, this._config);
  }

  _s(id) {
    return id ? this._hass.states[id] : undefined;
  }

  _opt(name) {
    const c = this._config;
    const limits = { history_days: [1, 365], max_outages: [1, 50], battery_life: [1, 15], low_runtime: [1, 240] };
    const [min, max] = limits[name];
    return clampInt(c[name], min, max, DEFAULTS[name]);
  }

  _update() {
    if (!this._hass || !this._config) return;
    const html = this._render();
    if (html !== this._html) {
      const kept = this._focusedSpot();
      this._html = html;
      this.shadowRoot.innerHTML = html;
      if (kept) this._restoreFocus(kept);
    }
    this._syncHistory();
  }

  // The focused element of the card, as what identifies it in the next render.
  _focusedSpot() {
    const el = this.shadowRoot.activeElement;
    if (!el?.dataset) return null;
    const key = focusKey(el);
    if (!key) return null;
    const index = this._focusables(key).indexOf(el);
    return index < 0 ? null : { key, index };
  }

  _focusables(key) {
    return [...this.shadowRoot.querySelectorAll(FOCUS_SELECTOR)].filter((n) => focusKey(n) === key);
  }

  _restoreFocus({ key, index }) {
    this._focusables(key)[index]?.focus({ preventScroll: true });
  }

  _onClick(ev) {
    const path = ev.composedPath();
    const el = path.find((n) => n.dataset && (n.dataset.entity || n.dataset.action));
    if (!el) return;
    ev.stopPropagation();
    const { action, entity } = el.dataset;
    if (action === "zoom") return this._toggleZoom(ev);
    if (action === "toggle_section") {
      const key = el.dataset.section;
      this._toggled = new Map(this._toggled).set(key, !this._isCollapsed(key));
      return this._update();
    }
    if (entity) this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: entity }, bubbles: true, composed: true }));
  }

  _toggleZoom() {}

  _isCollapsed(key) {
    if (this._toggled?.has(key)) return this._toggled.get(key);
    const c = this._config.collapsed ?? DEFAULT_COLLAPSED;
    return (Array.isArray(c) ? c : [c]).includes(key);
  }

  // ---- State -------------------------------------------------------------

  // { key, flags, entity, since, text }: what the UPS is doing, from its status sensor, else the mains binary sensor.
  _state(dev) {
    const e = dev.entities;
    const status = this._s(e.status) || this._s(e.status_display);
    const online = this._s(e.online);
    let key = "unknown";
    let flags = new Set();
    let onBattery = false;
    let entity = e.status || e.status_display || e.online;
    let since = null;
    if (status) {
      since = Date.parse(status.last_changed);
      if (status.state === "unavailable") key = "offline";
      else ({ key, flags, onBattery } = parseStatus(status.state));
      // NUT gives the raw status and its readable form: the raw one is read first, the readable one when it says more.
      const display = e.status && this._s(e.status_display);
      if (key === "unknown" && valid(display)) ({ key, flags, onBattery } = parseStatus(display.state));
      // A calibration or a battery test runs on battery on purpose: no outage alert.
      if (key === "calibrating" || key === "test") onBattery = false;
    }
    if ((key === "unknown" || !status) && valid(online)) {
      key = online.state === "on" ? "online" : "on_battery";
      entity = e.online;
      since = Date.parse(online.last_changed);
    }
    const pct = num(this._s(e.battery));
    // apcupsd and generic sensors do not tell charging: a battery not full on the mains is charging only for a while
    // after the mains came back (a battery that settles at 97 % would read "Charging" forever otherwise).
    if (key === "online" && dev.source !== "nut" && pct !== null && pct < 99.5) {
      const back = this._backOnMains(dev, since);
      if (back !== null && Date.now() - back < CHARGING_WINDOW_MS) key = "charging";
    }
    // On battery, under the UPS's own low threshold (or 20 %) or the low runtime option: low battery.
    if (key === "on_battery") {
      const low = num(this._s(e.battery_low)) ?? 20;
      const rt = seconds(this._s(e.runtime));
      if ((pct !== null && pct <= low) || (rt !== null && rt <= this._opt("low_runtime") * 60) || flags.has("low")) key = "low_battery";
    }
    onBattery = onBattery || isOnBattery(key);
    // The start of the outage: apcupsd counts the time on battery itself, else the outage going on in the history;
    // the last change of the status text comes last ("OB DISCHRG" turning "OB DISCHRG LB" is the same outage).
    if (onBattery) {
      const tob = seconds(this._s(e.time_on_battery));
      const ongoing = this._history?.outages?.[0];
      if (tob) since = Date.now() - tob * 1000;
      else if (ongoing && ongoing.end === null) since = ongoing.start;
    }
    return { key, flags, onBattery, entity, since: Number.isFinite(since) ? since : null, text: this._t(`state_${key}`) };
  }

  // When the mains last came back (ms) or null: apcupsd's time of the last transfer from battery, else the end of the
  // latest outage of the history once loaded, else the last change of the status.
  _backOnMains(dev, statusChanged) {
    const back = this._s(dev.entities.back_on_mains);
    const t = valid(back) ? Date.parse(back.state) : Number.NaN;
    if (Number.isFinite(t)) return t;
    const outages = this._history?.outages;
    if (outages) return outages[0]?.end ?? null;
    return Number.isFinite(statusChanged) ? statusChanged : null;
  }

  _battery(dev) {
    const s = this._s(dev.entities.battery);
    const v = num(s);
    const low = num(this._s(dev.entities.battery_low)) ?? 20;
    return { id: dev.entities.battery, v, cls: v === null ? "idle" : v <= low ? "crit" : v <= 50 ? "warn" : "ok" };
  }

  _runtime(dev) {
    const s = this._s(dev.entities.runtime);
    const v = seconds(s);
    const low = this._opt("low_runtime") * 60;
    return { id: dev.entities.runtime, v, cls: v === null ? "idle" : v <= low ? "crit" : v <= 2 * low ? "warn" : "ok" };
  }

  _load(dev) {
    const v = num(this._s(dev.entities.load));
    return { id: dev.entities.load, v, cls: v === null ? "idle" : v >= 90 ? "crit" : v >= 75 ? "warn" : "ok" };
  }

  // Real power: the UPS's sensor, else the load times the nominal power (apcupsd, NUT without ups.realpower), marked "≈".
  _power(dev) {
    const e = dev.entities;
    const s = this._s(e.power);
    const v = num(s);
    if (v !== null) return { id: e.power, v, unit: s.attributes?.unit_of_measurement || "W", estimated: false };
    const load = num(this._s(e.load));
    const nominal = num(this._s(e.power_nominal));
    if (load !== null && nominal !== null) return { id: e.load, v: (load / 100) * nominal, unit: "W", estimated: true };
    return null;
  }

  // Apparent power: NUT's ups.power, else the load times the nominal apparent power (NUT ups.power.nominal, apcupsd
  // NOMAPNT), marked "≈" — many UPS only give a rating in VA.
  _apparent(dev) {
    const e = dev.entities;
    const s = this._s(e.apparent_power);
    const v = num(s);
    if (v !== null) return { id: e.apparent_power, v, unit: s.attributes?.unit_of_measurement || "VA", estimated: false };
    const load = num(this._s(e.load));
    const nominal = num(this._s(e.apparent_power_nominal));
    if (load !== null && nominal !== null) return { id: e.load, v: (load / 100) * nominal, unit: "VA", estimated: true };
    return null;
  }

  // { replaced, due, cls, id }: the date the battery was put in (option, the UPS's battery date, else its
  // manufacturing date) and when it should be replaced (`battery_life` years later).
  _batteryDate(dev) {
    const c = this._config;
    const e = dev.entities;
    let replaced = parseDate(c.battery_replaced);
    let id = null;
    if (replaced === null) {
      for (const k of ["battery_date", "battery_mfr_date"]) {
        const s = this._s(e[k]);
        const d = valid(s) ? parseDate(s.state) : null;
        if (d !== null) {
          replaced = d;
          id = e[k];
          break;
        }
      }
    }
    if (replaced === null) return null;
    const due = addYears(replaced, this._opt("battery_life"));
    const left = due - Date.now();
    return { replaced, due, id, cls: left <= 0 ? "crit" : left <= 90 * 86400e3 ? "warn" : "ok" };
  }

  // Alerts, worst first: [{ cls, text, entity }].
  _alerts(dev, st) {
    if (this._config.show_alerts === false) return [];
    const out = [];
    const L = this._locale();
    const rt = this._runtime(dev);
    if (st.key === "offline") out.push({ cls: "crit", text: this._t(st.flags.has("off") ? "alert_output_off" : "alert_offline"), entity: st.entity });
    if (st.key === "shutdown") out.push({ cls: "crit", text: this._t("alert_shutdown"), entity: st.entity });
    if (st.key === "overload") out.push({ cls: "crit", text: this._t("alert_overload"), entity: dev.entities.load || st.entity });
    if (st.flags.has("nobatt")) out.push({ cls: "crit", text: this._t("alert_no_battery"), entity: st.entity });
    if (st.onBattery) {
      const parts = [st.since ? this._t("alert_on_battery_for", { time: fmtDuration((Date.now() - st.since) / 1000, L) }) : this._t("alert_on_battery")];
      if (rt.v !== null) parts.push(this._t("runtime_left", { time: fmtDuration(rt.v, L) }));
      out.push({ cls: st.key === "low_battery" ? "crit" : "warn", text: parts.join(" · "), entity: st.entity });
      if (st.key === "low_battery") out.push({ cls: "crit", text: this._t("alert_low_battery"), entity: dev.entities.battery || st.entity });
    }
    if (st.flags.has("replace")) out.push({ cls: "crit", text: this._t("alert_replace"), entity: st.entity });
    else {
      const bd = this._batteryDate(dev);
      if (bd && bd.cls !== "ok") out.push({ cls: "warn", text: this._t("alert_replace_due", { date: fmtDate(bd.due, L) }), entity: bd.id || undefined });
    }
    if (st.flags.has("alarm")) out.push({ cls: "warn", text: this._t("alert_alarm"), entity: st.entity });
    const load = this._load(dev);
    if (st.key !== "overload" && load.v !== null && load.v >= 90) out.push({ cls: "warn", text: this._t("alert_high_load", { pct: `${Math.round(load.v)} %` }), entity: load.id });
    return out;
  }

  // ---- Outage history ----------------------------------------------------

  // Entity whose history tells the outages, and how one of its states reads (true: on battery, null: unknown).
  _historySource(dev) {
    const e = dev.entities;
    if (e.status || e.status_display) return { id: e.status || e.status_display, battery: statusOnBattery };
    if (e.online) return { id: e.online, battery: (s) => (s === "on" ? false : s === "off" ? true : null) };
    return null;
  }

  _wantsHistory() {
    return this._config.show_outages !== false;
  }

  // Loads the status history of the last `history_days` days (once, again when the status changes or every 15 minutes).
  _syncHistory() {
    if (!this._wantsHistory() || !this._dev || typeof this._hass?.callWS !== "function") return;
    const src = this._historySource(this._dev);
    if (!src) return;
    const days = this._opt("history_days");
    const st = this._s(src.id);
    const key = `${src.id}|${days}|${st?.last_changed ?? ""}`;
    const h = this._history;
    if (h && h.key === key && (h.loading || Date.now() - h.at < HISTORY_REFRESH_MS)) return;
    if (h?.loading && h.key === key) return;
    const end = Date.now();
    const start = end - days * 86400e3;
    const ticket = { key, loading: true, at: end, outages: h?.outages ?? null, error: false };
    this._history = ticket;
    Promise.resolve(
      this._hass.callWS({
        type: "history/history_during_period",
        start_time: new Date(start).toISOString(),
        end_time: new Date(end).toISOString(),
        entity_ids: [src.id],
        minimal_response: true,
        no_attributes: true,
        significant_changes_only: false,
      }),
    )
      .then((res) => {
        if (this._history !== ticket) return;
        const list = Array.isArray(res?.[src.id]) ? res[src.id] : [];
        // Compressed states ({ s, lu } in seconds) or full ones ({ state, last_changed }).
        const points = list.map((p) => ({ state: p.s ?? p.state, t: p.lu !== undefined ? p.lu * 1000 : Date.parse(p.last_changed ?? p.last_updated) }));
        this._history = { key, loading: false, at: Date.now(), outages: outagesOf(points, src.battery, Date.now(), 0), error: false };
        this._update();
      })
      .catch(() => {
        if (this._history !== ticket) return;
        this._history = { key, loading: false, at: Date.now(), outages: null, error: true };
        this._update();
      });
  }

  // ---- Parts -------------------------------------------------------------

  _logo(dev, cls) {
    const src = SOURCES[dev.source];
    const badge = src ? `<img class="logo" src="${src.logo}" alt="${esc(src.name)}">` : "";
    const icon = svgIcon(ICONS.ups, "type");
    return src
      ? `<a class="type-icon ${cls}" href="${src.site}" target="_blank" rel="noopener noreferrer" title="${esc(src.name)}">${icon}${badge}</a>`
      : `<span class="type-icon ${cls}">${icon}</span>`;
  }

  _subtitle(dev) {
    return [dev.manufacturer, dev.model].filter(Boolean).join(" ");
  }

  _header(dev, st, sub) {
    const cls = STATE_CLASS[st.key];
    const chip = st.entity
      ? `<span class="chip clickable ${cls}" role="button" tabindex="0" data-entity="${esc(st.entity)}" title="${esc(st.text)}" aria-label="${esc(st.text)}"><span class="dot"></span><span class="chip-text">${esc(st.text)}</span></span>`
      : "";
    return `
      <div class="header">
        ${this._logo(dev, cls)}
        <div class="titles">
          <div class="name">${esc(this._config.title || dev.name)}</div>
          ${sub ? `<div class="sub">${esc(sub)}</div>` : ""}
        </div>
        ${chip}
        ${this._zoomButton()}
      </div>`;
  }

  _zoomButton() {
    return "";
  }

  _picture(dev, st) {
    const label = esc(`${dev.name}: ${st.text}`);
    const attrs = st.entity ? ` clickable" role="button" tabindex="0" aria-label="${label}" data-entity="${esc(st.entity)}"` : `" role="img" aria-label="${label}"`;
    return `<div class="picture${attrs}>${upsSvg(st.key, this._battery(dev).v)}</div>`;
  }

  _alertsHtml(alerts) {
    if (!alerts.length) return "";
    return `<div class="alerts" role="alert">${alerts
      .map(
        (a) =>
          `<div class="alert ${a.cls}${a.entity ? ` clickable" role="button" tabindex="0" data-entity="${esc(a.entity)}"` : '"'}>${svgIcon(ICONS.alert)}<span>${esc(a.text)}</span></div>`,
      )
      .join("")}</div>`;
  }

  _line(id, icon, cls, html) {
    return `<div class="line ${cls}${id ? ` clickable" role="button" tabindex="0" data-entity="${esc(id)}"` : '"'}>${svgIcon(icon)}<span>${html}</span></div>`;
  }

  _runtimeLine(dev) {
    const rt = this._runtime(dev);
    if (rt.v === null) return "";
    return this._line(rt.id, ICONS.clock, rt.cls, esc(this._t("runtime_left", { time: fmtDuration(rt.v, this._locale()) })));
  }

  _loadLine(dev) {
    const L = this._locale();
    const load = this._load(dev);
    // Real power, else apparent power.
    const p = this._power(dev) || this._apparent(dev);
    if (load.v === null && !p) return "";
    const parts = [];
    if (load.v !== null) parts.push(`${esc(this._t("load"))} <b>${esc(fmtValue(load.v, "%", L))}</b>`);
    if (p) parts.push(`<b>${p.estimated ? "≈ " : ""}${esc(fmtValue(p.v, p.unit, L))}</b>`);
    return this._line(load.id || p?.id, ICONS.gauge, load.cls, parts.join(" · "));
  }

  _errorCard(key) {
    return `<style>${BASE_STYLE}</style><ha-card><div class="warning">${esc(
      key === "unknown_device" ? `${this._t(key)}: ${this._config.device}` : this._t(key),
    )}</div></ha-card>`;
  }
}

class UpsCard extends UpsBase {
  static getConfigElement() {
    return document.createElement("ups-card-editor");
  }

  static getStubConfig(hass) {
    const list = hass && resolve(hass);
    return list?.length ? { device: list[0].id } : {};
  }

  getCardSize() {
    return 7;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  _render() {
    const { dev, error } = findDevice(this._hass, this._config);
    if (error) return this._errorCard(error);
    this._dev = dev;
    const c = this._config;
    const st = this._state(dev);
    const parts = [this._hero(dev, st), this._alertsHtml(this._alerts(dev, st))];
    if (c.show_power !== false) parts.push(this._powerSection(dev));
    if (c.show_battery !== false) parts.push(this._batterySection(dev));
    if (c.show_outages !== false) parts.push(this._outagesSection(dev));
    return `<style>${BASE_STYLE}${PICTURE_STYLE}${FULL_STYLE}</style>
      <ha-card>
        ${this._header(dev, st, this._subtitle(dev))}
        <div class="content">${parts.filter(Boolean).join("")}</div>
      </ha-card>`;
  }

  _hero(dev, st) {
    const b = this._battery(dev);
    const L = this._locale();
    const batt =
      b.v === null
        ? ""
        : `<div class="meter clickable ${b.cls}" role="button" tabindex="0" data-entity="${esc(b.id)}" aria-label="${esc(`${this._t("battery")} ${Math.round(b.v)} %`)}">
            <div class="batt">${svgIcon(ICONS.battery)}<span class="pct">${fmtNum(Math.round(b.v), 0, L)}<small>%</small></span></div>
            <div class="bar ${b.cls}"><div style="width:${Math.max(0, Math.min(100, b.v))}%"></div></div>
          </div>`;
    return `<div class="hero">
        ${this._picture(dev, st)}
        <div class="info">${batt}${this._runtimeLine(dev)}${this._loadLine(dev)}</div>
      </div>`;
  }

  _sectionTitle(key, icon, label, extra = "") {
    const closed = this._isCollapsed(key);
    return `<div class="section-title toggle" role="button" tabindex="0" data-action="toggle_section" data-section="${key}" aria-expanded="${!closed}">${svgIcon(icon)}<span>${esc(label)}</span>${extra}${svgIcon(ICONS.chevron_down, "chevron")}</div>`;
  }

  _tile(id, icon, label, value, cls = "") {
    const attrs = id ? ` clickable" role="button" tabindex="0" data-entity="${esc(id)}"` : '"';
    return `<div class="tile ${cls}${attrs}><div class="k">${svgIcon(icon)}<span>${esc(label)}</span></div><div class="v">${value}</div></div>`;
  }

  _measure(id, icon, label, digits = 1, cls = "") {
    const s = this._s(id);
    const v = num(s);
    if (v === null) return "";
    return this._tile(id, icon, label, esc(fmtValue(v, s.attributes?.unit_of_measurement, this._locale(), digits)), cls);
  }

  _section(key, icon, label, body, extra = "") {
    if (!body) return "";
    return `<div class="section">${this._sectionTitle(key, icon, label, extra)}${this._isCollapsed(key) ? "" : body}</div>`;
  }

  _powerSection(dev) {
    const e = dev.entities;
    const L = this._locale();
    const load = this._load(dev);
    const p = this._power(dev);
    const ap = this._apparent(dev);
    // "118 W / 480 W": the power against the UPS's rating, "≈" when estimated from the load.
    const powerTile = (q, label, nominalId, unit) => {
      if (!q) return "";
      const nominal = num(this._s(nominalId));
      const of = nominal !== null ? ` <small>/ ${esc(fmtValue(nominal, unit, L))}</small>` : "";
      return this._tile(q.id, ICONS.bolt, label, `${q.estimated ? "≈ " : ""}${esc(fmtValue(q.v, q.unit, L))}${of}`);
    };
    const tiles = [
      this._measure(e.input_voltage, ICONS.plug, this._t("input_voltage")),
      this._measure(e.output_voltage, ICONS.socket, this._t("output_voltage")),
      powerTile(p, this._t("power"), e.power_nominal, "W"),
      load.v !== null ? this._tile(load.id, ICONS.gauge, this._t("load"), esc(fmtValue(load.v, "%", L)), load.cls) : "",
      powerTile(ap, this._t("apparent_power"), e.apparent_power_nominal, "VA"),
      this._measure(e.frequency, ICONS.wave, this._t("frequency")),
      this._measure(e.temperature, ICONS.thermometer, this._t("temperature")),
    ].filter(Boolean);
    return this._section("power", ICONS.bolt, this._t("section_power"), tiles.length ? `<div class="tiles">${tiles.join("")}</div>` : "");
  }

  _batterySection(dev) {
    const e = dev.entities;
    const L = this._locale();
    const b = this._battery(dev);
    const rt = this._runtime(dev);
    const bd = this._batteryDate(dev);
    const test = this._s(e.self_test);
    const tiles = [
      b.v !== null ? this._tile(b.id, ICONS.battery, this._t("charge"), esc(fmtValue(b.v, "%", L)), b.cls) : "",
      rt.v !== null ? this._tile(rt.id, ICONS.clock, this._t("runtime"), esc(fmtDuration(rt.v, L)), rt.cls) : "",
      this._measure(e.battery_voltage, ICONS.bolt, this._t("battery_voltage")),
      this._measure(e.battery_temperature, ICONS.thermometer, this._t("battery_temperature")),
      bd ? this._tile(bd.id, ICONS.calendar, this._t("battery_date"), esc(fmtDate(bd.replaced, L))) : "",
      bd ? this._tile(bd.id, ICONS.calendar, this._t("replace_by"), esc(fmtDate(bd.due, L)), bd.cls) : "",
      valid(test) ? this._tile(e.self_test, ICONS.check, this._t("self_test"), esc(this._fmtState(test))) : "",
    ].filter(Boolean);
    return this._section("battery", ICONS.battery, this._t("section_battery"), tiles.length ? `<div class="tiles">${tiles.join("")}</div>` : "");
  }

  _fmtState(s) {
    if (this._hass.formatEntityState) {
      try {
        return this._hass.formatEntityState(s);
      } catch (_e) {
        /* older Home Assistant */
      }
    }
    return s.state;
  }

  // Outages of the last `history_days` days, read from the status history: count, time on battery, longest, and the
  // latest ones; the transfers counted by apcupsd and the reason of its last one.
  _outagesSection(dev) {
    const src = this._historySource(dev);
    const e = dev.entities;
    if (!src && !e.transfers && !e.last_transfer) return "";
    const L = this._locale();
    const days = this._opt("history_days");
    const h = this._history;
    const outages = h?.outages;
    const tiles = [];
    let body = "";
    if (src) {
      if (outages) {
        const total = outages.reduce((a, o) => a + o.duration, 0);
        const longest = outages.reduce((a, o) => Math.max(a, o.duration), 0);
        tiles.push(
          this._tile(src.id, ICONS.history, this._t("outages_n_days", { days }), esc(fmtNum(outages.length, 0, L))),
          this._tile(src.id, ICONS.clock, this._t("time_on_battery"), esc(outages.length ? fmtDuration(total, L) : "—")),
          this._tile(src.id, ICONS.clock, this._t("longest"), esc(outages.length ? fmtDuration(longest, L) : "—")),
        );
      }
    }
    const transfers = num(this._s(e.transfers));
    if (transfers !== null) tiles.push(this._tile(e.transfers, ICONS.swap, this._t("transfers"), esc(fmtNum(transfers, 0, L))));
    const last = this._s(e.last_transfer);
    if (valid(last)) tiles.push(this._tile(e.last_transfer, ICONS.swap, this._t("last_transfer"), esc(last.state)));
    if (tiles.length) body += `<div class="tiles">${tiles.join("")}</div>`;
    if (src) {
      if (!h || (h.loading && !outages)) body += `<div class="msg">${esc(this._t("history_loading"))}</div>`;
      else if (h.error && !outages) body += `<div class="msg">${esc(this._t("history_error"))}</div>`;
      else if (outages && !outages.length) body += `<div class="msg">${esc(this._t("no_outage", { days }))}</div>`;
      else if (outages) body += this._outageList(src.id, outages.slice(0, this._opt("max_outages")));
    }
    const count = outages ? `<span class="count">(${fmtNum(outages.length, 0, L)})</span>` : "";
    return this._section("outages", ICONS.history, this._t("section_outages"), body, count);
  }

  _outageList(id, outages) {
    const L = this._locale();
    const tz = this._hass.locale?.time_zone === "server" ? this._hass.config?.time_zone : undefined;
    const rows = outages.map((o) => {
      const ongoing = o.end === null;
      const dur = ongoing ? `${fmtDuration(o.duration, L)} · ${this._t("ongoing")}` : fmtDuration(o.duration, L);
      return `<div class="outage clickable${ongoing ? " ongoing warn" : " idle"}" role="button" tabindex="0" data-entity="${esc(id)}">${svgIcon(ICONS.bolt)}<span class="when">${esc(fmtDateTime(o.start, L, tz))}</span><span class="dur">${esc(dur)}</span></div>`;
    });
    return `<div class="outages">${rows.join("")}</div>`;
  }
}

// The mini card is the full card drawn compact: its detail button (top right, `zoom: false` removes it) switches it
// to the full card's content and back, and a click anywhere else on the page brings the compact view back.
class UpsMiniCard extends UpsCard {
  constructor() {
    super();
    this._unzoom = watchOutside(this, () => {
      if (this._zoomed) this._setZoom(false);
    });
  }

  static getConfigElement() {
    return document.createElement("ups-mini-card-editor");
  }

  connectedCallback() {
    super.connectedCallback();
    this._unzoom.on();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unzoom.off();
    // Back to the compact view once off the screen.
    this._zoomed = false;
  }

  getCardSize() {
    return this._zoomed ? super.getCardSize() : 3;
  }

  getGridOptions() {
    return { ...(this._zoomed ? super.getGridOptions() : { columns: 6, min_columns: 6 }), rows: "auto" };
  }

  // The outage history is only read for the detailed view.
  _wantsHistory() {
    return !!this._zoomed && super._wantsHistory();
  }

  _zoomButton() {
    if (this._config.zoom === false) return "";
    const z = this._zoomed;
    const label = esc(this._t(z ? "zoom_out" : "zoom_in"));
    return `<button class="zoom" data-action="zoom" title="${label}" aria-label="${label}" aria-pressed="${!!z}">${svgIcon(z ? ICONS.collapse : ICONS.expand)}</button>`;
  }

  _setZoom(on) {
    this._zoomed = on;
    this._update();
    this.dispatchEvent(new CustomEvent("iron-resize", { bubbles: true, composed: true }));
  }

  _toggleZoom(ev) {
    this._setZoom(!this._zoomed);
    if (ev?.detail === 0) this.shadowRoot.querySelector(".zoom")?.focus({ preventScroll: true });
  }

  _render() {
    if (this._zoomed) return super._render();
    const { dev, error } = findDevice(this._hass, this._config);
    if (error) return this._errorCard(error);
    this._dev = dev;
    const st = this._state(dev);
    const b = this._battery(dev);
    const L = this._locale();
    const batt =
      b.v === null
        ? ""
        : `<div class="batt clickable ${b.cls}" role="button" tabindex="0" data-entity="${esc(b.id)}" aria-label="${esc(`${this._t("battery")} ${Math.round(b.v)} %`)}">${svgIcon(ICONS.battery)}<div class="bar ${b.cls}"><div style="width:${Math.max(0, Math.min(100, b.v))}%"></div></div><span class="v">${esc(fmtValue(b.v, "%", L))}</span></div>`;
    const alert = this._alerts(dev, st)[0];
    return `<style>${BASE_STYLE}${PICTURE_STYLE}${FULL_STYLE}${MINI_STYLE}</style>
      <ha-card>
        ${this._header(dev, st, "")}
        <div class="content">
          <div class="row">
            ${this._picture(dev, st)}
            <div class="info">${batt}${this._runtimeLine(dev)}${this._loadLine(dev)}</div>
          </div>
          ${alert ? this._alertsHtml([alert]) : ""}
        </div>
      </ha-card>`;
  }
}

// ---------------------------------------------------------------------------
// Visual editors (ha-form)
// ---------------------------------------------------------------------------

const LANGUAGES = [
  ["en", "English"],
  ["fr", "Français"],
  ["de", "Deutsch"],
  ["es", "Español"],
  ["it", "Italiano"],
  ["nl", "Nederlands"],
  ["pt", "Português (Portugal)"],
  ["pl", "Polski"],
  ["sr", "Српски"],
  ["sr-Latn", "Srpski (latinica)"],
  ["ro", "Română"],
  ["da", "Dansk"],
  ["sv", "Svenska"],
  ["bg", "Български"],
  ["ru", "Русский"],
  ["uk", "Українська"],
  ["hu", "Magyar"],
  ["sk", "Slovenčina"],
  ["cs", "Čeština"],
  ["sl", "Slovenščina"],
  ["lv", "Latviešu"],
  ["el", "Ελληνικά"],
];

class UpsEditorBase extends HTMLElement {
  // [name, default]
  static get toggles() {
    return [
      ["show_title", true],
      ["show_subtitle", true],
      ["show_alerts", true],
    ];
  }

  static extraFields() {
    return [];
  }

  static get defaults() {
    return {};
  }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _schema() {
    const tr = (k) => t(this._hass, this._config, k);
    return [
      { name: "device", selector: { select: { mode: "dropdown", options: [{ value: "", label: tr("device_none") }, ...listDevices(this._hass)] } } },
      { name: "title", selector: { text: {} } },
      { type: "grid", name: "", schema: this.constructor.toggles.map(([name]) => ({ name, selector: { boolean: {} } })) },
      ...this.constructor.extraFields(tr),
      {
        type: "expandable",
        name: "entities",
        title: tr("entities"),
        icon: "mdi:format-list-bulleted",
        schema: ENTITY_KEYS.map(([name, domain]) => ({ name, selector: { entity: { domain } } })),
      },
      {
        name: "language",
        selector: { select: { mode: "dropdown", options: [{ value: "", label: tr("lang_auto") }, ...LANGUAGES.map(([value, label]) => ({ value, label }))] } },
      },
    ];
  }

  _label(name) {
    const k = ENTITY_KEYS.some(([n]) => n === name) ? `e_${name}` : name;
    return t(this._hass, this._config, k);
  }

  _render() {
    if (!this._hass || !this._config) return;
    const toggles = this.constructor.toggles;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => this._label(s.name);
      this._form.computeHelper = (s) => (s.name === "zoom" ? t(this._hass, this._config, "zoom_helper") : s.name === "device" ? t(this._hass, this._config, "device_helper") : undefined);
      this._form.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        this._config = cleanConfig(ev.detail.value, { ...Object.fromEntries(toggles), ...this.constructor.defaults });
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }
    const data = { ...this.constructor.defaults, ...this._config, entities: { ...this._config.entities } };
    for (const [name, def] of toggles) if (data[name] === undefined) data[name] = def;
    if (data.device === undefined && !Object.keys(data.entities).length) data.device = UpsCard.getStubConfig(this._hass).device ?? "";
    this._form.hass = this._hass;
    const h = this._hass;
    const dataDeps = [this._config, h.entities, h.devices];
    if (!sameDeps(this._dataDeps, dataDeps)) {
      this._dataDeps = dataDeps;
      this._form.data = data;
    }
    const deps = [lang(h, this._config), h.entities, h.devices];
    if (!sameDeps(this._schemaDeps, deps)) {
      this._schemaDeps = deps;
      this._form.schema = this._schema();
    }
  }
}

// Keeps the YAML minimal: drops empty values and options left at their default.
const cleanConfig = (value, defaults) => {
  const config = { ...value };
  for (let [k, v] of Object.entries(config)) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      v = config[k] = { ...v };
      for (const [sk, sv] of Object.entries(v)) if (sv === "" || sv === undefined || sv === null) delete v[sk];
      if (!Object.keys(v).length) delete config[k];
    } else if (v === "" || v === undefined || v === null || (k in defaults && JSON.stringify(v) === JSON.stringify(defaults[k]))) delete config[k];
  }
  return config;
};

class UpsCardEditor extends UpsEditorBase {
  static get toggles() {
    return [...UpsEditorBase.toggles, ["show_power", true], ["show_battery", true], ["show_outages", true]];
  }

  static get defaults() {
    return { collapsed: DEFAULT_COLLAPSED, ...DEFAULTS };
  }

  static extraFields(tr) {
    const number = (name, min, max, unit) => ({ name, selector: { number: { min, max, mode: "box", ...(unit ? { unit_of_measurement: unit } : {}) } } });
    return [
      {
        name: "collapsed",
        selector: { select: { multiple: true, mode: "list", options: SECTIONS.map((value) => ({ value, label: tr(`section_${value}`) })) } },
      },
      number("history_days", 1, 365, tr("unit_days")),
      number("max_outages", 1, 50),
      number("low_runtime", 1, 240, "min"),
      number("battery_life", 1, 15, tr("unit_years")),
      { name: "battery_replaced", selector: { date: {} } },
    ];
  }
}

class UpsMiniCardEditor extends UpsEditorBase {
  static get toggles() {
    return [...UpsEditorBase.toggles, ["zoom", true]];
  }

  static get defaults() {
    return { ...DEFAULTS };
  }

  static extraFields() {
    return [{ name: "low_runtime", selector: { number: { min: 1, max: 240, mode: "box", unit_of_measurement: "min" } } }];
  }
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

const define = (name, cls) => {
  if (!customElements.get(name)) customElements.define(name, cls);
};
define("ups-card", UpsCard);
define("ups-mini-card", UpsMiniCard);
define("ups-card-editor", UpsCardEditor);
define("ups-mini-card-editor", UpsMiniCardEditor);

window.customCards = window.customCards || [];
for (const card of [
  {
    type: "ups-card",
    name: "UPS Card",
    description: "UPS from Network UPS Tools, APC UPS Daemon or generic sensors: state, battery, runtime, load, voltages, power, outage history and battery replacement.",
  },
  { type: "ups-mini-card", name: "UPS Mini Card", description: "Compact UPS overview: state, battery, runtime and load, with a detail button." },
]) {
  if (!window.customCards.some((c) => c.type === card.type)) window.customCards.push({ ...card, preview: true, documentationURL: "https://github.com/juju35/ha-ups-card" });
}

console.info(`%c UPS-CARD %c v${VERSION} `, "color: white; background: #2e7d32; font-weight: 700;", "color: #2e7d32; background: white; font-weight: 700;");
