import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ForceGraph3D, { type ForceGraphMethods } from 'react-force-graph-3d'
import SpriteText from 'three-spritetext'
import * as THREE from 'three'
import { X, RotateCcw, Maximize2, Minimize2 } from 'lucide-react'

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────
type NodeType =
  | 'law'
  | 'section'
  | 'component'
  | 'rule'
  | 'process'
  | 'task'
  | 'entity'
  | 'gra'
  | 'standard'
  | 'chatapi'

interface GraphNode {
  id: string
  label: string
  type: NodeType
  description: string
  details?: Record<string, string>
  x?: number
  y?: number
  z?: number
}

interface GraphLink {
  source: string | { id: string }
  target: string | { id: string }
  type: string
  description?: string
}

interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}

// ────────────────────────────────────────────
// Color palette per node type
// ────────────────────────────────────────────
const NODE_COLORS: Record<NodeType, string> = {
  law: '#3b82f6',
  section: '#6366f1',
  component: '#8b5cf6',
  rule: '#f59e0b',
  process: '#10b981',
  task: '#14b8a6',
  entity: '#ec4899',
  gra: '#f97316',
  standard: '#06b6d4',
  chatapi: '#22c55e',
}

const NODE_LABELS: Record<NodeType, string> = {
  law: '📘 Gesetz',
  section: '📄 Paragraph',
  component: '🧩 Kernkomponente',
  rule: '📏 Geschäftsregel',
  process: '🔄 Prozess',
  task: '✅ Aufgabe',
  entity: '👤 Entität',
  gra: '📋 GRA-Anweisung',
  standard: '🛡️ Standard',
  chatapi: '💬 Chat-API',
}

// ────────────────────────────────────────────
// DRV Pension Law Knowledge Graph Data
// ────────────────────────────────────────────
function buildCaseData(): GraphData {
  const nodes: GraphNode[] = [
    // ── LAWS (CT_LAW) ──
    { id: 'sgb_vi', label: 'SGB VI', type: 'law', description: 'Gesetzliche Rentenversicherung — Primärgesetz der DRV', details: { 'Titel': 'Sozialgesetzbuch Sechstes Buch', 'Paragraphen': '~323 §§', 'Regelungsbereich': 'Beiträge, Leistungen, Alters-/Erwerbsminderungsrente', 'URL': 'https://www.gesetze-im-internet.de/sgb_6/' } },
    { id: 'sgb_iv', label: 'SGB IV', type: 'law', description: 'Gemeinsame Vorschriften für die Sozialversicherung', details: { 'Titel': 'Sozialgesetzbuch Viertes Buch', 'Paragraphen': '~120 §§', 'Regelungsbereich': 'Versicherungspflicht, Beiträge, Meldeverfahren' } },
    { id: 'sgb_i', label: 'SGB I', type: 'law', description: 'Allgemeiner Teil — Framework für alle Sozialgesetzbücher', details: { 'Titel': 'Sozialgesetzbuch Erstes Buch', 'Paragraphen': '~70 §§', 'Regelungsbereich': 'Leistungsansprüche, Fristen, Zuständigkeit' } },
    { id: 'sgb_ix', label: 'SGB IX', type: 'law', description: 'Rehabilitation und Teilhabe — DRV als Reha-Träger', details: { 'Titel': 'Sozialgesetzbuch Neuntes Buch', 'Paragraphen': '~240 §§', 'Regelungsbereich': 'Rehabilitation, Teilhabe behinderter Menschen' } },
    { id: 'sgb_x', label: 'SGB X', type: 'law', description: 'Verwaltungsverfahren und Sozialdatenschutz', details: { 'Titel': 'Sozialgesetzbuch Zehntes Buch', 'Paragraphen': '~115 §§', 'Regelungsbereich': 'Verwaltungsverfahren, Datenschutz, Widerspruch' } },

    // ── KEY SECTIONS (S_SECTION) — SGB VI ──
    { id: 'sec_33', label: '§33 Rentenarten', type: 'section', description: 'Übersicht aller Rentenarten in der gesetzlichen Rentenversicherung', details: { 'Gesetz': 'SGB VI', 'Inhalt': 'Renten wegen Alters, Erwerbsminderung, Todes' } },
    { id: 'sec_35', label: '§35 Regelaltersrente', type: 'section', description: 'Voraussetzungen für die Regelaltersrente', details: { 'Gesetz': 'SGB VI', 'Wartezeit': '5 Jahre allgemeine Wartezeit', 'Altersgrenze': 'Regelaltersgrenze (stufenweise 67)' } },
    { id: 'sec_43', label: '§43 Erwerbsminderungsrente', type: 'section', description: 'Rente wegen voller oder teilweiser Erwerbsminderung', details: { 'Gesetz': 'SGB VI', 'Wartezeit': '5 Jahre allgemeine Wartezeit', 'Pflichtbeiträge': '3 von 5 Jahren vor Eintritt der EM', 'Prüfkriterien': '<3h (voll) bzw. 3-6h (teilweise) arbeitsfähig' } },
    { id: 'sec_50', label: '§50 Wartezeiten', type: 'section', description: 'Definition und Berechnung der rentenrechtlichen Wartezeiten', details: { 'Gesetz': 'SGB VI', 'Allgemeine Wartezeit': '5 Jahre (60 Monate)', 'Wartezeit 15 Jahre': 'Altersrente für Frauen', 'Wartezeit 35 Jahre': 'Altersrente für langjährig Versicherte', 'Wartezeit 45 Jahre': 'Altersrente für besonders langj. Versicherte' } },
    { id: 'sec_56', label: '§56 Kindererziehungszeiten', type: 'section', description: 'Anrechnung von Kindererziehungszeiten', details: { 'Gesetz': 'SGB VI', 'Dauer': '36 Monate (ab 1992) / 30 Monate (vor 1992)', 'Zuordnung': 'Elternteil, das Kind erzogen hat' } },
    { id: 'sec_63', label: '§63 Rentenformel', type: 'section', description: 'Grundsätze der Rentenberechnung: EP × ZF × RAF × aRW', details: { 'Gesetz': 'SGB VI', 'Formel': 'Monatliche Rente = EP × ZF × RAF × aRW', 'EP': 'Entgeltpunkte', 'ZF': 'Zugangsfaktor', 'RAF': 'Rentenartfaktor', 'aRW': 'Aktueller Rentenwert' } },
    { id: 'sec_99', label: '§99 Rentenbeginn', type: 'section', description: 'Beginn und Ende von Renten', details: { 'Gesetz': 'SGB VI', 'Regelaltersrente': 'Ab Monat nach Erreichen der Regelaltersgrenze', 'EM-Rente': 'Ab 7. Kalendermonat nach Eintritt der EM' } },
    { id: 'sec_235', label: '§235 Regelaltersgrenze', type: 'section', description: 'Übergangsregelungen: Stufenweise Anhebung 65→67', details: { 'Gesetz': 'SGB VI', 'Jahrgang 1947': '65 Jahre + 1 Monat', 'Jahrgang 1958': '66 Jahre', 'Jahrgang 1964+': '67 Jahre', 'Zeitraum': '2012–2031' } },
    { id: 'sec_53', label: '§53 Vorzeitige Wartezeit', type: 'section', description: 'Vorzeitige Wartezeiterfüllung bei Arbeitsunfall', details: { 'Gesetz': 'SGB VI', 'Besonderheit': 'Wartezeit gilt als sofort erfüllt', 'Anlass': 'Arbeitsunfall, Berufskrankheit, Wehrdienst' } },
    { id: 'sec_9', label: '§9 Rehabilitation', type: 'section', description: 'Aufgaben der Rentenversicherung bei Rehabilitation', details: { 'Gesetz': 'SGB VI', 'Grundsatz': 'Reha vor Rente', 'Leistungsträger': 'DRV als zuständiger Reha-Träger' } },

    // ── SECTIONS from other SGBs ──
    { id: 'sec_sgb4_7', label: '§7 Versicherungspflicht', type: 'section', description: 'Definition der Beschäftigung und Versicherungspflicht', details: { 'Gesetz': 'SGB IV', 'Kernaussage': 'Beschäftigung = nichtselbständige Arbeit' } },
    { id: 'sec_sgb1_17', label: '§17 SGB I Ausführung', type: 'section', description: 'Ausführung der Sozialleistungen', details: { 'Gesetz': 'SGB I', 'Inhalt': 'Leistungen vollständig und rechtzeitig erbringen' } },
    { id: 'sec_sgb10_31', label: '§31 Verwaltungsakt', type: 'section', description: 'Definition und Wirkung des Verwaltungsakts', details: { 'Gesetz': 'SGB X', 'Inhalt': 'Hoheitliche Regelung im Einzelfall', 'Formerfordernis': 'Schriftform bei Rentenbescheiden' } },
    { id: 'sec_sgb10_84', label: '§84 Widerspruchsfrist', type: 'section', description: 'Widerspruchsfrist: 1 Monat nach Bekanntgabe', details: { 'Gesetz': 'SGB X', 'Frist': '1 Monat', 'Folge': 'Bestandskraft bei Fristversäumnis' } },
    { id: 'sec_sgb9_49', label: '§49 Leistungen zur Teilhabe', type: 'section', description: 'Medizinische Rehabilitation und Teilhabe am Arbeitsleben', details: { 'Gesetz': 'SGB IX', 'Reha-Träger': 'DRV für Versicherte der gesetzlichen RV' } },

    // ── BUSINESS RULES (S_BUSINESS_RULE) ──
    { id: 'br_35_01', label: 'BR: Regelaltersrente', type: 'rule', description: 'Anspruch auf Regelaltersrente wenn: Regelaltersgrenze erreicht UND allgemeine Wartezeit 5 Jahre erfüllt', details: { 'Regel-ID': 'BR_SGB6_35_01', 'Quelle': '§35 Abs. 1 SGB VI', 'Bedingung 1': 'Regelaltersgrenze erreicht', 'Bedingung 2': 'Allgemeine Wartezeit (5 Jahre) erfüllt' } },
    { id: 'br_43_01', label: 'BR: EM-Rente (voll)', type: 'rule', description: 'Anspruch auf volle EM-Rente: <3h arbeitsfähig, Wartezeit 5J, 3/5J Pflichtbeiträge', details: { 'Regel-ID': 'BR_SGB6_43_01', 'Quelle': '§43 Abs. 2 SGB VI', 'Arbeitsfähigkeit': '<3 Stunden täglich', 'Wartezeit': '5 Jahre', 'Pflichtbeiträge': '3 von 5 Jahren vor Eintritt' } },
    { id: 'br_43_02', label: 'BR: EM-Rente (teilweise)', type: 'rule', description: 'Anspruch auf teilweise EM-Rente: 3-6h arbeitsfähig', details: { 'Regel-ID': 'BR_SGB6_43_02', 'Quelle': '§43 Abs. 1 SGB VI', 'Arbeitsfähigkeit': '3–6 Stunden täglich' } },
    { id: 'br_50_01', label: 'BR: Allg. Wartezeit', type: 'rule', description: 'Allgemeine Wartezeit = 60 Kalendermonate mit Beitragszeiten', details: { 'Regel-ID': 'BR_SGB6_50_01', 'Quelle': '§50 Abs. 1 SGB VI', 'Dauer': '60 Monate (5 Jahre)' } },
    { id: 'br_53_01', label: 'BR: Vorzeitige Wartezeit', type: 'rule', description: 'Bei Arbeitsunfall/Berufskrankheit gilt Wartezeit als sofort erfüllt', details: { 'Regel-ID': 'BR_SGB6_53_01', 'Quelle': '§53 SGB VI', 'Besonderheit': 'Wartezeit sofort erfüllt', 'Ausnahme': 'Trifft §43 Wartezeit-Prüfung außer Kraft' } },
    { id: 'br_56_01', label: 'BR: Kindererziehung', type: 'rule', description: 'Kindererziehungszeiten werden als Pflichtbeiträge angerechnet (36 Monate ab 1992)', details: { 'Regel-ID': 'BR_SGB6_56_01', 'Quelle': '§56 SGB VI', 'Anrechnung': '1 EP pro Monat (Durchschnittsverdienst)', 'Mütterrente': 'Ab 2019: 30 Monate für vor 1992 geborene Kinder' } },
    { id: 'br_63_01', label: 'BR: Rentenformel', type: 'rule', description: 'Monatliche Rente = EP × ZF × RAF × aRW', details: { 'Regel-ID': 'BR_SGB6_63_01', 'Quelle': '§63 SGB VI', 'aRW 2025': '39,32 € (West) / 38,79 € (Ost)' } },
    { id: 'br_235_01', label: 'BR: Altersgrenze Übergang', type: 'rule', description: 'Stufenweise Anhebung der Regelaltersgrenze von 65 auf 67 (Jahrgänge 1947–1964)', details: { 'Regel-ID': 'BR_SGB6_235_01', 'Quelle': '§235 SGB VI', 'Inkrafttreten': '2012', 'Abschluss': '2031 (Jahrgang 1964)' } },
    { id: 'br_reha_01', label: 'BR: Reha vor Rente', type: 'rule', description: 'Vor Bewilligung einer EM-Rente ist stets Rehabilitation zu prüfen', details: { 'Regel-ID': 'BR_SGB9_REHA_01', 'Quelle': '§9 SGB VI, §49 SGB IX', 'Grundsatz': 'Reha vor Rente — Erwerbsfähigkeit erhalten' } },

    // ── PROCESSES (S_PROCESS) ──
    { id: 'proc_rentenantrag', label: 'Rentenantrag', type: 'process', description: 'Ende-zu-Ende-Prozess: Antragstellung bis Rentenbescheid', details: { 'Schritte': 'Antrag → Prüfung → Berechnung → Bescheid', 'Bearbeitungszeit': 'Ziel: <3 Monate' } },
    { id: 'proc_em_prufung', label: 'EM-Prüfung', type: 'process', description: 'Prozess zur Prüfung der Erwerbsminderung', details: { 'Schritte': 'Antrag → Medizinischer Dienst → Gutachten → Entscheidung', 'Gutachterauswahl': 'Unabhängiger ärztlicher Dienst' } },
    { id: 'proc_reha', label: 'Reha-Antrag', type: 'process', description: 'Rehabilitationsmaßnahme beantragen und durchführen', details: { 'Schritte': 'Antrag → Prüfung Reha-Bedarf → Bewilligung → Durchführung → Nachsorge', 'Dauer': 'Regelfall: 3 Wochen stationär' } },
    { id: 'proc_widerspruch', label: 'Widerspruchsverfahren', type: 'process', description: 'Rechtsbehelfsverfahren gegen Rentenbescheid', details: { 'Frist': '1 Monat nach Bekanntgabe (§84 SGB X)', 'Schritte': 'Widerspruch → Prüfung → Abhilfe oder Widerspruchsbescheid' } },
    { id: 'proc_rentenberechnung', label: 'Rentenberechnung', type: 'process', description: 'Berechnung der monatlichen Rente nach Rentenformel', details: { 'Formel': 'EP × ZF × RAF × aRW', 'Eingabedaten': 'Versicherungskonto, Entgeltpunkte, Zugangsalter' } },

    // ── TASKS (S_TASK) ──
    { id: 'task_antrag_eingang', label: 'Antragseingang', type: 'task', description: 'Eingang und Registrierung des Rentenantrags', details: { 'System': 'rvDialog / eAntrag', 'Eingabekanal': 'Online, Post, Persönlich, Auskunfts- und Beratungsstelle' } },
    { id: 'task_kontenklaerung', label: 'Kontenklärung', type: 'task', description: 'Prüfung und Vervollständigung des Versicherungskontos', details: { 'Inhalt': 'Lücken identifizieren, fehlende Zeiten nachmelden', 'Datenquellen': 'Arbeitgeber, Krankenkasse, Agentur für Arbeit' } },
    { id: 'task_ep_berechnung', label: 'EP-Berechnung', type: 'task', description: 'Berechnung der Entgeltpunkte aus dem Versicherungskonto', details: { 'Methode': 'Jahresverdienst / Durchschnittsentgelt = EP pro Jahr' } },
    { id: 'task_bescheid', label: 'Bescheid erstellen', type: 'task', description: 'Erstellung und Versand des Rentenbescheids', details: { 'Form': 'Schriftlicher Verwaltungsakt gem. §31 SGB X', 'Inhalt': 'Rentenart, Rentenhöhe, Beginn, Rechtsbehelfsbelehrung' } },

    // ── ENTITIES (S_ENT_*) ──
    { id: 'ent_versicherter', label: 'Versicherter', type: 'entity', description: 'Versicherte Person in der gesetzlichen Rentenversicherung', details: { 'Kategorien': 'Pflichtversichert, Freiwillig versichert, Nachversichert' } },
    { id: 'ent_arbeitgeber', label: 'Arbeitgeber', type: 'entity', description: 'Beitragspflichtiger Arbeitgeber', details: { 'Pflichten': 'Beitragsabführung, Meldung, Auskunft' } },
    { id: 'ent_wartezeit', label: 'Wartezeit', type: 'entity', description: 'Rentenrechtliche Mindestversicherungszeit', details: { 'Typen': '5 Jahre, 15 Jahre, 20 Jahre, 25 Jahre, 35 Jahre, 45 Jahre' } },
    { id: 'ent_ep', label: 'Entgeltpunkte', type: 'entity', description: 'Maßeinheit für Rentenanwartschaften', details: { '1 EP': '= 1 Jahr Durchschnittsverdienst', 'Durchschnittsentgelt 2025': '~45.358 €' } },
    { id: 'ent_arw', label: 'Aktueller Rentenwert', type: 'entity', description: 'Wert eines Entgeltpunkts in Euro pro Monat', details: { 'West 2025': '39,32 €', 'Ost 2025': '38,79 €', 'Anpassung': 'Jährlich zum 1. Juli' } },
    { id: 'ent_regelaltersgrenze', label: 'Regelaltersgrenze', type: 'entity', description: 'Altersgrenze für den Bezug der Regelaltersrente', details: { 'Aktuell': '65–67 Jahre (abhängig vom Geburtsjahr)', 'Ziel ab 2031': '67 Jahre für alle ab Jg. 1964' } },
    { id: 'ent_gutachten', label: 'Medizinisches Gutachten', type: 'entity', description: 'Ärztliches Gutachten zur Feststellung der Erwerbsfähigkeit', details: { 'Ersteller': 'Ärztlicher Dienst der DRV', 'Bewertung': 'Restleistungsvermögen in Stunden/Tag' } },

    // ── GRA INSTRUCTIONS ──
    { id: 'gra_sgb6_35', label: 'GRA §35 SGB VI', type: 'gra', description: 'Gemeinsame Rechtliche Anweisung zur Regelaltersrente', details: { 'Quelle': 'rvRecht® Portal', 'Inhalt': 'Auslegungshinweise, Berechnungsbeispiele, Sonderfälle', 'URL': 'https://rvrecht.deutsche-rentenversicherung.de' } },
    { id: 'gra_sgb6_43', label: 'GRA §43 SGB VI', type: 'gra', description: 'GRA zur Erwerbsminderungsrente', details: { 'Quelle': 'rvRecht® Portal', 'Inhalt': 'Beurteilung der Erwerbsminderung, Gutachtenanweisungen' } },
    { id: 'gra_sgb6_63', label: 'GRA §63 SGB VI', type: 'gra', description: 'GRA zur Rentenberechnung und Rentenformel', details: { 'Quelle': 'rvRecht® Portal', 'Inhalt': 'Berechnungsbeispiele, Zurechnungszeit, Abschläge' } },

    // ── STANDARDS & COMPLIANCE ──
    { id: 'std_dsgvo', label: 'DSGVO', type: 'standard', description: 'Datenschutz-Grundverordnung (EU 2016/679)', details: { 'Relevanz': 'Sozialdatenschutz, Auskunftsrecht, Löschpflichten', 'Bezug': '§§67–85 SGB X verweisen auf DSGVO' } },
    { id: 'std_bsi', label: 'BSI IT-Grundschutz', type: 'standard', description: 'IT-Sicherheitsstandard des Bundesamts für Sicherheit in der Informationstechnik', details: { 'Relevanz': 'IT-Sicherheit der DRV-Systeme', 'Zertifizierung': 'ISO 27001 auf Basis IT-Grundschutz' } },

    // ── CHAT API STANDARDS ──
    { id: 'api_openai', label: 'OpenAI Chat API', type: 'chatapi', description: 'De-facto-Standard: POST /v1/chat/completions', details: { 'Format': 'messages[]: {role, content}', 'Rollen': 'system, user, assistant', 'Streaming': 'SSE (Server-Sent Events)', 'Verbreitung': 'OpenAI, Azure OpenAI, LiteLLM, vLLM, Ollama' } },
    { id: 'api_anthropic', label: 'Anthropic Messages', type: 'chatapi', description: 'POST /v1/messages — System-Prompt separiert', details: { 'Format': 'system: str, messages[]: {role, content}', 'Besonderheit': 'System-Prompt als Top-Level-Parameter', 'Streaming': 'SSE mit delta-Events' } },
    { id: 'api_langchain', label: 'LangChain / LangServe', type: 'chatapi', description: 'Framework-Standard für RAG-Pipelines', details: { 'Protokoll': 'invoke / stream / batch Endpoints', 'RAG-Integration': 'Retriever → LLM → Output Parser', 'Deployment': 'LangServe (FastAPI-basiert)' } },
    { id: 'api_openapi', label: 'OpenAPI 3.1', type: 'chatapi', description: 'API-Beschreibungsstandard für REST-Schnittstellen', details: { 'Nutzen': 'Automatische Swagger/ReDoc-Dokumentation', 'CASSA': '/docs und /redoc Endpunkte', 'Tooling': 'Client-SDKs automatisch generierbar' } },
    { id: 'api_cassa', label: 'CASSA Chat API', type: 'chatapi', description: 'CASSA-eigene API: OpenAI-kompatibel + GraphRAG-Erweiterungen', details: { 'Endpunkte': '/api/v1/chat, /api/v1/search', 'Erweiterung': 'citations[], session_id, context{}', 'Kompatibilität': 'OpenAI messages[]-Format', 'Swagger': 'http://localhost:8000/docs' } },
  ]

  const links: GraphLink[] = [
    // Law → Sections
    { source: 'sgb_vi', target: 'sec_33', type: 'SR_CONTAINS', description: 'enthält' },
    { source: 'sgb_vi', target: 'sec_35', type: 'SR_CONTAINS', description: 'enthält' },
    { source: 'sgb_vi', target: 'sec_43', type: 'SR_CONTAINS', description: 'enthält' },
    { source: 'sgb_vi', target: 'sec_50', type: 'SR_CONTAINS', description: 'enthält' },
    { source: 'sgb_vi', target: 'sec_56', type: 'SR_CONTAINS', description: 'enthält' },
    { source: 'sgb_vi', target: 'sec_63', type: 'SR_CONTAINS', description: 'enthält' },
    { source: 'sgb_vi', target: 'sec_99', type: 'SR_CONTAINS', description: 'enthält' },
    { source: 'sgb_vi', target: 'sec_235', type: 'SR_CONTAINS', description: 'enthält' },
    { source: 'sgb_vi', target: 'sec_53', type: 'SR_CONTAINS', description: 'enthält' },
    { source: 'sgb_vi', target: 'sec_9', type: 'SR_CONTAINS', description: 'enthält' },
    { source: 'sgb_iv', target: 'sec_sgb4_7', type: 'SR_CONTAINS', description: 'enthält' },
    { source: 'sgb_i', target: 'sec_sgb1_17', type: 'SR_CONTAINS', description: 'enthält' },
    { source: 'sgb_x', target: 'sec_sgb10_31', type: 'SR_CONTAINS', description: 'enthält' },
    { source: 'sgb_x', target: 'sec_sgb10_84', type: 'SR_CONTAINS', description: 'enthält' },
    { source: 'sgb_ix', target: 'sec_sgb9_49', type: 'SR_CONTAINS', description: 'enthält' },

    // Sections → Business Rules
    { source: 'sec_35', target: 'br_35_01', type: 'SR_DEFINES', description: 'definiert Regel' },
    { source: 'sec_43', target: 'br_43_01', type: 'SR_DEFINES', description: 'definiert Regel' },
    { source: 'sec_43', target: 'br_43_02', type: 'SR_DEFINES', description: 'definiert Regel' },
    { source: 'sec_50', target: 'br_50_01', type: 'SR_DEFINES', description: 'definiert Regel' },
    { source: 'sec_53', target: 'br_53_01', type: 'SR_DEFINES', description: 'definiert Regel' },
    { source: 'sec_56', target: 'br_56_01', type: 'SR_DEFINES', description: 'definiert Regel' },
    { source: 'sec_63', target: 'br_63_01', type: 'SR_DEFINES', description: 'definiert Regel' },
    { source: 'sec_235', target: 'br_235_01', type: 'SR_DEFINES', description: 'definiert Regel' },
    { source: 'sec_9', target: 'br_reha_01', type: 'SR_DEFINES', description: 'definiert Regel' },

    // Rules → Processes
    { source: 'br_35_01', target: 'proc_rentenantrag', type: 'SR_REALIZED_BY', description: 'realisiert durch' },
    { source: 'br_43_01', target: 'proc_em_prufung', type: 'SR_REALIZED_BY', description: 'realisiert durch' },
    { source: 'br_43_02', target: 'proc_em_prufung', type: 'SR_REALIZED_BY', description: 'realisiert durch' },
    { source: 'br_reha_01', target: 'proc_reha', type: 'SR_REALIZED_BY', description: 'realisiert durch' },
    { source: 'br_63_01', target: 'proc_rentenberechnung', type: 'SR_REALIZED_BY', description: 'realisiert durch' },

    // Process → Tasks (Rentenantrag)
    { source: 'proc_rentenantrag', target: 'task_antrag_eingang', type: 'SR_COMPOSED_OF', description: 'besteht aus' },
    { source: 'proc_rentenantrag', target: 'task_kontenklaerung', type: 'SR_COMPOSED_OF', description: 'besteht aus' },
    { source: 'proc_rentenberechnung', target: 'task_ep_berechnung', type: 'SR_COMPOSED_OF', description: 'besteht aus' },
    { source: 'proc_rentenantrag', target: 'task_bescheid', type: 'SR_COMPOSED_OF', description: 'besteht aus' },
    { source: 'task_antrag_eingang', target: 'task_kontenklaerung', type: 'SR_SEQUENCE', description: 'dann' },
    { source: 'task_kontenklaerung', target: 'task_ep_berechnung', type: 'SR_SEQUENCE', description: 'dann' },
    { source: 'task_ep_berechnung', target: 'task_bescheid', type: 'SR_SEQUENCE', description: 'dann' },

    // Cross-law references
    { source: 'sec_35', target: 'sec_50', type: 'SR_REFERENCES', description: 'verweist auf Wartezeit' },
    { source: 'sec_43', target: 'sec_50', type: 'SR_REFERENCES', description: 'verweist auf Wartezeit' },
    { source: 'sec_43', target: 'sec_53', type: 'SR_REFERENCES', description: 'Ausnahme bei Arbeitsunfall' },
    { source: 'sec_35', target: 'sec_235', type: 'SR_REFERENCES', description: 'Übergangsregelung Altersgrenze' },
    { source: 'sec_9', target: 'sec_sgb9_49', type: 'SR_REFERENCES', description: 'verweist auf SGB IX Reha-Leistungen' },
    { source: 'br_43_01', target: 'br_reha_01', type: 'SR_DEPENDS_ON', description: 'Reha vor Rente prüfen' },
    { source: 'task_bescheid', target: 'sec_sgb10_31', type: 'SR_REFERENCES', description: 'Verwaltungsakt gem. SGB X' },
    { source: 'proc_widerspruch', target: 'sec_sgb10_84', type: 'SR_REFERENCES', description: 'Widerspruchsfrist gem. SGB X' },
    { source: 'sec_sgb4_7', target: 'br_50_01', type: 'SR_ASSOCIATES', description: 'Versicherungspflicht → Wartezeit' },
    { source: 'br_35_01', target: 'br_50_01', type: 'SR_DEPENDS_ON', description: 'Wartezeit muss erfüllt sein' },
    { source: 'br_35_01', target: 'br_235_01', type: 'SR_DEPENDS_ON', description: 'Altersgrenze abhängig von Jahrgang' },
    { source: 'br_56_01', target: 'br_50_01', type: 'SR_ASSOCIATES', description: 'KEZ zählt zur Wartezeit' },

    // Entities connected to rules
    { source: 'br_35_01', target: 'ent_versicherter', type: 'SR_ASSOCIATES', description: 'betrifft' },
    { source: 'br_35_01', target: 'ent_wartezeit', type: 'SR_ASSOCIATES', description: 'erfordert' },
    { source: 'br_35_01', target: 'ent_regelaltersgrenze', type: 'SR_ASSOCIATES', description: 'prüft gegen' },
    { source: 'br_63_01', target: 'ent_ep', type: 'SR_ASSOCIATES', description: 'berechnet mit' },
    { source: 'br_63_01', target: 'ent_arw', type: 'SR_ASSOCIATES', description: 'berechnet mit' },
    { source: 'br_43_01', target: 'ent_gutachten', type: 'SR_ASSOCIATES', description: 'erfordert' },
    { source: 'ent_arbeitgeber', target: 'ent_versicherter', type: 'SR_ASSOCIATES', description: 'meldet Beiträge für' },

    // GRA → Sections
    { source: 'gra_sgb6_35', target: 'sec_35', type: 'SR_INSTRUCTS', description: 'Anweisung zu' },
    { source: 'gra_sgb6_43', target: 'sec_43', type: 'SR_INSTRUCTS', description: 'Anweisung zu' },
    { source: 'gra_sgb6_63', target: 'sec_63', type: 'SR_INSTRUCTS', description: 'Anweisung zu' },

    // Standards
    { source: 'std_dsgvo', target: 'sec_sgb10_31', type: 'SR_APPLIES_TO', description: 'Datenschutzanforderung' },
    { source: 'std_bsi', target: 'proc_rentenantrag', type: 'SR_APPLIES_TO', description: 'IT-Sicherheitsanforderung' },

    // Chat API relationships
    { source: 'api_cassa', target: 'api_openai', type: 'SR_COMPATIBLE', description: 'kompatibel mit' },
    { source: 'api_cassa', target: 'api_openapi', type: 'SR_COMPATIBLE', description: 'dokumentiert via' },
    { source: 'api_cassa', target: 'api_langchain', type: 'SR_COMPATIBLE', description: 'integrierbar mit' },
    { source: 'api_openai', target: 'api_anthropic', type: 'SR_SIMILAR', description: 'ähnliches Format' },
  ]

  return { nodes, links }
}

// ────────────────────────────────────────────
// Component
// ────────────────────────────────────────────
export function DRVKnowledgeGraph3D() {
  const graphRef = useRef<ForceGraphMethods | undefined>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 700 })
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const graphData = useMemo(() => buildCaseData(), [])

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width, height: rect.height })
      }
    }
    updateSize()
    const obs = new ResizeObserver(updateSize)
    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [isFullscreen])

  useEffect(() => {
    if (graphRef.current) {
      const fg = graphRef.current
      fg.d3Force('charge')?.strength(-120)
      fg.d3Force('link')?.distance((link: GraphLink) => {
        const src = typeof link.source === 'string' ? link.source : link.source.id
        const tgt = typeof link.target === 'string' ? link.target : link.target.id
        const srcNode = graphData.nodes.find(n => n.id === src)
        const tgtNode = graphData.nodes.find(n => n.id === tgt)
        if (srcNode?.type === 'law' || tgtNode?.type === 'law') return 80
        if (link.type === 'SR_SEQUENCE') return 40
        return 55
      })
    }
  }, [graphData])

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node)
    if (graphRef.current) {
      const distance = 200
      const distRatio = 1 + distance / Math.hypot(node.x || 0, node.y || 0, node.z || 0)
      graphRef.current.cameraPosition(
        { x: (node.x || 0) * distRatio, y: (node.y || 0) * distRatio, z: (node.z || 0) * distRatio },
        { x: node.x || 0, y: node.y || 0, z: node.z || 0 },
        1200
      )
    }
  }, [])

  const resetCamera = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.cameraPosition({ x: 0, y: 0, z: 600 }, { x: 0, y: 0, z: 0 }, 1500)
    }
    setSelectedNode(null)
  }, [])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev)
  }, [])

  const nodeThreeObject = useCallback((node: GraphNode) => {
    const group = new THREE.Group()
    const color = NODE_COLORS[node.type] || '#999'
    const size = node.type === 'law' ? 10 : node.type === 'section' ? 7 : node.type === 'rule' ? 6 : 5

    const geometry = new THREE.SphereGeometry(size, 24, 24)
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.9,
      shininess: 60,
    })
    const sphere = new THREE.Mesh(geometry, material)
    group.add(sphere)

    // Glow effect for laws
    if (node.type === 'law') {
      const glowGeo = new THREE.SphereGeometry(size * 1.4, 24, 24)
      const glowMat = new THREE.MeshPhongMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.15,
      })
      group.add(new THREE.Mesh(glowGeo, glowMat))
    }

    const label = new SpriteText(node.label) as any
    label.color = '#e2e8f0'
    label.textHeight = node.type === 'law' ? 5 : 3.5
    label.backgroundColor = 'rgba(15, 23, 42, 0.75)'
    label.padding = [2, 4]
    label.borderRadius = 3
    label.position.y = -(size + 6)
    group.add(label)

    return group
  }, [])

  const linkColor = useCallback((link: GraphLink) => {
    switch (link.type) {
      case 'SR_CONTAINS': return 'rgba(59, 130, 246, 0.5)'
      case 'SR_DEFINES': return 'rgba(245, 158, 11, 0.6)'
      case 'SR_REALIZED_BY': return 'rgba(16, 185, 129, 0.5)'
      case 'SR_COMPOSED_OF': return 'rgba(20, 184, 166, 0.5)'
      case 'SR_REFERENCES': return 'rgba(139, 92, 246, 0.4)'
      case 'SR_DEPENDS_ON': return 'rgba(239, 68, 68, 0.5)'
      case 'SR_INSTRUCTS': return 'rgba(249, 115, 22, 0.5)'
      case 'SR_SEQUENCE': return 'rgba(34, 197, 94, 0.6)'
      case 'SR_COMPATIBLE': return 'rgba(34, 197, 94, 0.5)'
      case 'SR_SIMILAR': return 'rgba(6, 182, 212, 0.4)'
      default: return 'rgba(148, 163, 184, 0.3)'
    }
  }, [])

  const linkDirectionalParticles = useCallback((link: GraphLink) => {
    return link.type === 'SR_SEQUENCE' ? 3 : link.type === 'SR_DEPENDS_ON' ? 2 : 1
  }, [])

  // Build adjacency for detail panel
  const nodeLinks = useMemo(() => {
    const map = new Map<string, Array<{ link: GraphLink; otherNode: GraphNode }>>()
    graphData.links.forEach(link => {
      const srcId = typeof link.source === 'string' ? link.source : link.source.id
      const tgtId = typeof link.target === 'string' ? link.target : link.target.id
      const srcNode = graphData.nodes.find(n => n.id === srcId)
      const tgtNode = graphData.nodes.find(n => n.id === tgtId)
      if (srcNode && tgtNode) {
        if (!map.has(srcId)) map.set(srcId, [])
        if (!map.has(tgtId)) map.set(tgtId, [])
        map.get(srcId)!.push({ link, otherNode: tgtNode })
        map.get(tgtId)!.push({ link, otherNode: srcNode })
      }
    })
    return map
  }, [graphData])

  return (
    <div
      ref={containerRef}
      className={`relative rounded-xl overflow-hidden border-2 border-border bg-[#0f172a] ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full h-full'
      }`}
    >
      {/* Controls */}
      <div className="absolute top-3 right-3 z-20 flex gap-2">
        <button
          onClick={resetCamera}
          className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white transition-colors backdrop-blur-sm"
          title="Kamera zurücksetzen"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white transition-colors backdrop-blur-sm"
          title={isFullscreen ? 'Vollbild beenden' : 'Vollbild'}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-20 bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700">
        <div className="text-xs text-slate-400 font-semibold mb-2">Knotentypen</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {(Object.keys(NODE_LABELS) as NodeType[]).map(type => (
            <div key={type} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: NODE_COLORS[type] }}
              />
              <span className="text-[10px] text-slate-300 whitespace-nowrap">{NODE_LABELS[type]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="absolute top-3 left-3 z-20 bg-slate-900/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-700">
        <div className="text-[10px] text-slate-400">
          {graphData.nodes.length} Knoten · {graphData.links.length} Beziehungen
        </div>
        <div className="text-[10px] text-blue-400 font-medium">DRV Sozialrecht Knowledge Graph</div>
      </div>

      {/* Graph */}
      <ForceGraph3D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#0f172a"
        nodeThreeObject={nodeThreeObject}
        onNodeClick={handleNodeClick}
        linkColor={linkColor}
        linkWidth={1.5}
        linkOpacity={0.7}
        linkDirectionalArrowLength={4}
        linkDirectionalArrowRelPos={0.85}
        linkDirectionalParticles={linkDirectionalParticles}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleSpeed={0.005}
        enableNodeDrag={true}
        enableNavigationControls={true}
        showNavInfo={false}
      />

      {/* Detail Panel */}
      {selectedNode && (
        <div className="absolute top-14 right-3 z-30 w-80 max-h-[70vh] overflow-y-auto bg-slate-900/95 backdrop-blur-md text-slate-200 rounded-xl border border-slate-600 shadow-2xl">
          <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md p-4 border-b border-slate-700 flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: NODE_COLORS[selectedNode.type] }}
                />
                <span className="text-xs font-medium text-slate-400">{NODE_LABELS[selectedNode.type]}</span>
              </div>
              <h3 className="font-bold text-lg leading-tight truncate">{selectedNode.label}</h3>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1.5 rounded-lg hover:bg-slate-700/80 text-slate-400 hover:text-white transition-colors flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <p className="text-sm text-slate-300 leading-relaxed">{selectedNode.description}</p>

            {selectedNode.details && Object.keys(selectedNode.details).length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Details</h4>
                <div className="space-y-1.5">
                  {Object.entries(selectedNode.details).map(([key, val]) => (
                    <div key={key} className="flex gap-2 text-xs">
                      <span className="text-slate-500 font-medium min-w-[100px] flex-shrink-0">{key}:</span>
                      <span className="text-slate-300">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {nodeLinks.has(selectedNode.id) && (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Beziehungen ({nodeLinks.get(selectedNode.id)!.length})
                </h4>
                <div className="space-y-1">
                  {nodeLinks.get(selectedNode.id)!.map(({ link, otherNode }, i) => (
                    <button
                      key={i}
                      onClick={() => handleNodeClick(otherNode)}
                      className="w-full text-left p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors group flex items-center gap-2"
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: NODE_COLORS[otherNode.type] }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-slate-300 group-hover:text-white truncate">
                          {otherNode.label}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {link.type.replace('SR_', '').replace(/_/g, ' ')} · {link.description || ''}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
