import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  ArrowRight, 
  Shield, 
  Database, 
  Network, 
  Clock, 
  ChartBar,
  AlertTriangle,
  Users,
  FileText,
  BrainCircuit,
  CheckCircle2,
  TrendingUp,
  Zap,
  Eye,
  ArrowDown,
  Scale,
  Globe,
  BookOpen,
  ShieldCheck,
  Landmark,
  ScrollText,
  Workflow,
  MessageSquare,
  Search,
  GitCompare,
  XCircle,
  CircleCheck,
  Bot,
  Layers,
  Link2,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { DRVKnowledgeGraph3D } from "@/components/DRVKnowledgeGraph3D"

function App() {
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null)
  const [activeScenario, setActiveScenario] = useState<number>(0)
  const [showIntroGuide, setShowIntroGuide] = useState<boolean>(true)
  const architectureRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.3])

  useEffect(() => {
    const timer = setTimeout(() => setShowIntroGuide(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  // ────────────────────────────────────────────
  // Data: Challenges
  // ────────────────────────────────────────────
  const challenges = [
    {
      icon: ScrollText,
      title: "Komplexe Gesetzeslandschaft",
      stat: "5+",
      statLabel: "Sozialgesetzbücher",
      description: "SGB I, IV, VI, IX, X — über 870 Paragraphen bilden die Rechtsgrundlage der gesetzlichen Rentenversicherung. Querverweise, Übergangsregelungen und Sonderfälle machen die Anwendung hochkomplex.",
      trend: "870+ §§",
      color: "oklch(0.45 0.15 245)"
    },
    {
      icon: Clock,
      title: "Bearbeitungszeiten & Rückstände",
      stat: "3–6",
      statLabel: "Monate Bearbeitungszeit",
      description: "Rentenanträge durchlaufen aufwändige Prüfungen: Kontenklärung, Wartezeitberechnung, Entgeltpunkte. Mitarbeitende müssen Dutzende Querverweise manuell prüfen.",
      trend: "Ziel: <3 Mon.",
      color: "oklch(0.55 0.20 55)"
    },
    {
      icon: Users,
      title: "Fachkräftemangel & Wissenstransfer",
      stat: "56.000",
      statLabel: "DRV-Beschäftigte",
      description: "Erfahrene Sachbearbeiter gehen in den Ruhestand — ihr implizites Wissen über Sonderfälle, GRA-Anweisungen und Berechnungsdetails lässt sich kaum dokumentieren.",
      trend: "Kritisch",
      color: "oklch(0.50 0.18 25)"
    },
    {
      icon: Link2,
      title: "Gesetzesübergreifende Abhängigkeiten",
      stat: "100+",
      statLabel: "Querverweise",
      description: "SGB VI verweist auf SGB IV (Versicherungspflicht), SGB X (Verwaltungsverfahren), SGB IX (Rehabilitation). Fehler bei Querverweisen führen zu falschen Bescheiden.",
      trend: "Komplex",
      color: "oklch(0.45 0.12 200)"
    }
  ]

  // ────────────────────────────────────────────
  // Data: 4-Layer Ontology (DRV)
  // ────────────────────────────────────────────
  const layers = [
    {
      number: 1,
      title: "Normative Schicht",
      subtitle: "Gesetzeshierarchie",
      description: "Hierarchie der Rechtsquellen: EU-Recht → Grundgesetz → Sozialgesetzbücher → Rechtsverordnungen → GRA-Anweisungen. Das System versteht die Normenhierarchie und traversiert sie konsistent.",
      icon: Shield,
      color: "oklch(0.35 0.12 245)",
      examples: ["SGB I–XII", "GRA-Anweisungen", "EU-DSGVO", "Rechtsverordnungen"]
    },
    {
      number: 2,
      title: "Zeitliche Dimension",
      subtitle: "Validität & Übergangsregelungen",
      description: "Zeitliche Gültigkeit jeder Rechtsgrundlage: Übergangsregelungen (§235 SGB VI), stufenweise Anhebung der Altersgrenze, Rentenanpassungen zum 1. Juli. Das System kennt die korrekte Fassung zu jedem Stichtag.",
      icon: Clock,
      color: "oklch(0.45 0.15 200)",
      examples: ["Regelaltersgrenze 65→67", "Mütterrente Erweiterung", "Rentenanpassung 2025", "Beitragssätze"]
    },
    {
      number: 3,
      title: "Prozedurale Schicht",
      subtitle: "Geschäftsprozesse & Workflows",
      description: "DRV-Geschäftsprozesse als formale Abläufe: Rentenantrag, Kontenklärung, EM-Prüfung, Reha-Bewilligung. Proaktive Vorschläge für nächste Schritte und Fristüberwachung.",
      icon: ChartBar,
      color: "oklch(0.50 0.18 160)",
      examples: ["Rentenantrag", "EM-Prüfung", "Reha vor Rente", "Widerspruchsverfahren"]
    },
    {
      number: 4,
      title: "Fallbezogener Overlay",
      subtitle: "Versichertenkontext",
      description: "Konkreter Versicherungsfall: Beitragszeiten, Entgeltpunkte, Kindererziehungszeiten, medizinische Gutachten. Alle Daten im Kontext der Normenhierarchie und Geschäftsregeln.",
      icon: Database,
      color: "oklch(0.55 0.20 55)",
      examples: ["Entgeltpunkte", "Wartezeiten", "Kindererziehung", "Gutachten"]
    }
  ]

  // ────────────────────────────────────────────
  // Data: Scenarios (from DRV_DEMO_PLAN §4)
  // ────────────────────────────────────────────
  const scenarios = [
    {
      title: "Compliance-Analyse",
      description: "Schnell die bindende Geschäftsregel für einen Leistungstyp finden und gegen den Quell-Paragraphen verifizieren — z. B. Regelaltersrente (§35 SGB VI) mit allen Querverweisen.",
      benefits: [
        "Automatische Auflösung aller Querverweise: §35 → §50 (Wartezeit) → §235 (Altersgrenze) → §56 (Kindererziehung)",
        "Chatbot mit Graph-Kontext: Frage stellen und Antwort mit §-Zitaten erhalten",
        "GRA-Anweisungen direkt verlinkt: Von der Geschäftsregel zur Handlungsanweisung in einem Klick",
        "Automatische Prüfung gegen aktuelle Gesetzeslage — kein Risiko veralteter Informationen"
      ],
      icon: FileText,
      color: "oklch(0.45 0.15 245)",
      impact: "Sachbearbeiter Recht: Recherche von Stunden auf Sekunden"
    },
    {
      title: "Prozess-Engineering",
      description: "Geschäftsregeln auf DRV-Prozesse abbilden — z. B. den Rentenantragsprozess von der Antragstellung bis zum Bescheid mit allen Abhängigkeiten visualisieren.",
      benefits: [
        "Prozessgraph: Aufgaben, Sequenzfluss und Entscheidungspunkte als verknüpfte Knoten",
        "Fristen automatisch verknüpft: §17 SGB I (rechtzeitige Erbringung), §84 SGB X (Widerspruchsfrist)",
        "Chatbot: 'Welche Fristen gelten für die Bearbeitung eines Rentenantrags?' — Antwort zitiert §99, §17, §26",
        "Export als strukturierte Daten für BPMN-Modellierung (zukünftige Funktion)"
      ],
      icon: Workflow,
      color: "oklch(0.50 0.18 160)",
      impact: "Prozessoptimierung mit vollständiger Regelabdeckung"
    },
    {
      title: "Gesetzesfolgen-Analyse",
      description: "Impact-Analyse bei Gesetzesänderungen — z. B. 'Was ändert sich durch den neuen §33 für die Erwerbsminderungsrente?' Alle betroffenen Regeln und Prozesse identifizieren.",
      benefits: [
        "Semantische Ähnlichkeitssuche über alle verknüpften Geschäftsregeln",
        "Automatische Identifikation aller betroffenen Prozesse und Aufgaben",
        "Ranking der Auswirkungen nach Abhängigkeitsgrad im Graphen",
        "Chatbot-gestützte Q&A: Gezielte Fragen zur Auswirkung der Änderung"
      ],
      icon: GitCompare,
      color: "oklch(0.55 0.20 55)",
      impact: "Gesetzesänderungsfolgen in Minuten statt Wochen analysieren"
    },
    {
      title: "Onboarding & Wissenstransfer",
      description: "Neue Mitarbeitende verstehen DRV-Zuständigkeiten und Gesetzesgrundlagen — ohne 300+ Seiten Gesetzestext lesen zu müssen.",
      benefits: [
        "Chatbot erklärt komplexe Sachverhalte in einfacher Sprache mit §-Verweisen",
        "Navigierbarer Wissensgraph: Von der Übersicht ins Detail durch interaktive Exploration",
        "GRA-Anweisungen als Handlungsleitfaden direkt verknüpft mit Paragraphen",
        "Häufige Fragen mit Standardantworten und Quellennachweis — kein Halluzinationsrisiko"
      ],
      icon: Users,
      color: "oklch(0.45 0.12 200)",
      impact: "Einarbeitungszeit von Monaten auf Wochen reduzieren"
    }
  ]

  // ────────────────────────────────────────────
  // Data: Graph RAG vs Vector RAG comparison
  // ────────────────────────────────────────────
  const ragComparisons = [
    {
      title: "Multi-Hop-Reasoning: Rentenanspruch",
      question: "Hat Frau Müller (62 Jahre, 38 Beitragsjahre, 3 Kinder geb. 1993, 1996, 1999) Anspruch auf Regelaltersrente?",
      graphAnswer: {
        result: "Korrekte Antwort mit vollständiger Begründung",
        explanation: "Graph RAG traversiert: §35 SGB VI → §50 (Wartezeit ✓: 38 Jahre > 5 Jahre) → §235 (Regelaltersgrenze für Jg. 1964: 67 Jahre → mit 62 noch nicht erreicht) → §56 (Kindererziehungszeiten: 3×36 = 108 Monate zusätzlich). Ergebnis: Noch kein Anspruch, da Altersgrenze nicht erreicht — aber Wartezeit für Altersrente für besonders langjährig Versicherte (45 Jahre) wäre mit KEZ potenziell erfüllt."
      },
      vectorAnswer: {
        result: "Unvollständige oder falsche Antwort",
        explanation: "Vector RAG findet §35 (Regelaltersrente) per Ähnlichkeitssuche, aber verknüpft nicht automatisch §50 (Wartezeit), §235 (Übergangsregelungen für ihr Geburtsjahr) und §56 (Kindererziehungszeiten). Ohne Graph-Traversierung fehlt die systematische Prüfung aller Voraussetzungen."
      }
    },
    {
      title: "Gesetzesübergreifende Abhängigkeit",
      question: "Welche Fristen gelten bei einem abgelehnten Reha-Antrag?",
      graphAnswer: {
        result: "Vollständige Fristenkette über 3 Gesetze",
        explanation: "Graph RAG traversiert: SGB IX §49 (Reha-Leistung) → SGB VI §9 (DRV als Reha-Träger) → SGB X §31 (Bescheid als Verwaltungsakt) → SGB X §84 (Widerspruchsfrist: 1 Monat) → SGG §87 (Klagefrist: 1 Monat nach Widerspruchsbescheid). Liefert die komplette Rechtsmittelkette."
      },
      vectorAnswer: {
        result: "Nur Teilantwort, fehlende Verknüpfung",
        explanation: "Vector RAG findet Texte zu Rehabilitation, kennt aber nicht den systematischen Pfad über SGB X (Verwaltungsverfahren) zum SGG (Sozialgerichtsgesetz). Widerspruchsfristen stehen in einem anderen Gesetz und werden per Vektorähnlichkeit nicht zuverlässig gefunden."
      }
    },
    {
      title: "Ausnahmeregel: Vorzeitige Wartezeit",
      question: "Welche Wartezeit gilt für Erwerbsminderungsrente bei einem Arbeitsunfall?",
      graphAnswer: {
        result: "Erkennt die Ausnahme sofort",
        explanation: "Graph RAG traversiert: §43 SGB VI (EM-Rente, Normalfall: 5 Jahre Wartezeit + 3/5 Pflichtbeiträge) → erkennt verknüpfte Ausnahmeregel §53 SGB VI (vorzeitige Wartezeiterfüllung bei Arbeitsunfall) → Wartezeit gilt als sofort erfüllt. Die Graph-Kante SR_REFERENCES verbindet §43 direkt mit §53."
      },
      vectorAnswer: {
        result: "Gibt nur die Standardregel zurück",
        explanation: "Vector RAG ruft §43 per Vektorsuche ab (hohe Ähnlichkeit zu 'Erwerbsminderungsrente') und antwortet mit der 5-Jahres-Wartezeit. §53 (vorzeitige Wartezeit bei Arbeitsunfall) hat geringere Vektorähnlichkeit zum Query und wird nicht in den Top-K-Ergebnissen gefunden. Die Ausnahme wird übersehen."
      }
    },
    {
      title: "Temporale Validität: Regelaltersgrenze",
      question: "Gilt für einen 1960 Geborenen noch die Altersgrenze 65?",
      graphAnswer: {
        result: "Exakte Antwort mit Übergangsregelung",
        explanation: "Graph RAG traversiert: §35 → §235 SGB VI (Übergangsregelungen) mit temporalen Metadaten → Jahrgang 1960 = 66 Jahre + 4 Monate. Der Graph speichert die stufenweise Anhebung als strukturierte Daten pro Jahrgang und kann die exakte Altersgrenze berechnen."
      },
      vectorAnswer: {
        result: "Gibt generische 67 Jahre an",
        explanation: "Vector RAG findet allgemeine Texte zur Regelaltersgrenze (67 Jahre), hat aber keine strukturierten temporalen Daten. Die Übergangsregelungen in §235 mit der differenzierten Tabelle pro Geburtsjahrgang werden nicht als zusammenhängende Struktur erfasst. Ergebnis: Falsche Altersgrenze."
      }
    }
  ]

  // ────────────────────────────────────────────
  // Data: Chat API Standards
  // ────────────────────────────────────────────
  const chatApiStandards = [
    {
      name: "OpenAI Chat Completions",
      endpoint: "POST /v1/chat/completions",
      description: "De-facto-Industriestandard für Chat-KI. messages[]-Array mit Rollen (system, user, assistant). Streaming via SSE.",
      adoptedBy: "OpenAI, Azure OpenAI, LiteLLM, vLLM, Ollama, Groq, Together AI",
      color: "#10b981"
    },
    {
      name: "Anthropic Messages API",
      endpoint: "POST /v1/messages",
      description: "System-Prompt als separater Top-Level-Parameter. Content-Blocks für multimodales Messaging. Streaming via delta-Events.",
      adoptedBy: "Anthropic Claude, AWS Bedrock (Claude)",
      color: "#8b5cf6"
    },
    {
      name: "LangChain / LangServe",
      endpoint: "POST /invoke, /stream, /batch",
      description: "Framework-Standard für RAG-Pipelines. Retriever → LLM → Output Parser. Deployment als FastAPI-Service.",
      adoptedBy: "LangChain, LangGraph, LangSmith",
      color: "#f59e0b"
    },
    {
      name: "OpenAPI 3.1 / Swagger",
      endpoint: "GET /openapi.json",
      description: "API-Beschreibungsstandard. Automatische Swagger-UI und ReDoc-Dokumentation. Client-SDK-Generierung.",
      adoptedBy: "Universeller Standard — FastAPI, Spring, Express, etc.",
      color: "#3b82f6"
    }
  ]

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatePresence>
        {showIntroGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Card className="shadow-2xl border-2 border-accent">
              <CardContent className="p-6 flex items-center gap-4">
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowDown className="h-6 w-6 text-accent" />
                </motion.div>
                <div>
                  <p className="font-semibold text-foreground">Scrollen Sie, um mehr zu erfahren</p>
                  <p className="text-sm text-muted-foreground">Interaktive Elemente erwarten Sie</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HEADER ── */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-3">
            <SopraLogo />
            <Separator orientation="vertical" className="h-8 hidden md:block" />
            <span className="text-sm font-medium text-muted-foreground hidden md:block">CASSA · DRV</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('architecture')} className="hidden md:flex">
              Architektur
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('graph-rag')} className="hidden md:flex">
              Graph vs Vector RAG
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('chat-api')} className="hidden md:flex">
              Chat API
            </Button>
            <Button variant="ghost" size="sm" onClick={() => scrollToSection('scenarios')} className="hidden md:flex">
              Szenarien
            </Button>
            <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <a href="https://www.soprasteria.de/products/cassa" target="_blank" rel="noopener noreferrer">
                Mehr erfahren
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <motion.section style={{ opacity: heroOpacity }} className="hero-pattern py-32 md:py-40 relative overflow-hidden">
        <AnimatedBackground />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
              <Badge className="mb-6 bg-accent text-accent-foreground text-base px-4 py-2">
                <Zap className="h-4 w-4 mr-2" />
                Compliance Knowledge Graph + GraphRAG
              </Badge>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-foreground leading-tight">
              Digitaler Wissens&shy;assistent für die Renten&shy;versicherung
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed">
              Wie ein Knowledge Graph mit GraphRAG die Komplexität des Sozialrechts beherrschbar macht — und warum Vector RAG bei gesetzesübergreifenden Fragen versagt.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 h-14 shadow-lg hover:shadow-xl transition-shadow"
              >
                <a href="https://www.soprasteria.de/products/cassa" target="_blank" rel="noopener noreferrer">
                  <BrainCircuit className="mr-2 h-5 w-5" />
                  CASSA entdecken
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-10 h-14 border-2"
                onClick={() => scrollToSection('challenges')}
              >
                Herausforderungen verstehen
                <ArrowDown className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ── SECTION: Herausforderungen ── */}
      <section id="challenges" className="py-24 bg-muted/30 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 text-base px-4 py-2">
              <Eye className="h-4 w-4 mr-2" />
              Schritt 1: Das Problem verstehen
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Die Herausforderungen der Rentenversicherung
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              56.000 DRV-Beschäftigte verarbeiten jährlich Millionen von Rentenanträgen — auf Basis eines
              Rechtsrahmens mit über 870 Paragraphen in 5+ Sozialgesetzbüchern.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {challenges.map((challenge, index) => {
              const Icon = challenge.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-2 hover:border-primary/50">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <motion.div 
                          className="p-4 rounded-xl"
                          style={{ backgroundColor: `${challenge.color}15` }}
                          whileHover={{ scale: 1.05, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Icon className="h-8 w-8" style={{ color: challenge.color }} />
                        </motion.div>
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-3 group-hover:text-primary transition-colors">
                            {challenge.title}
                          </CardTitle>
                          <div className="flex items-center gap-3 mb-3">
                            <div>
                              <div className="text-3xl font-bold" style={{ color: challenge.color }}>
                                {challenge.stat}
                              </div>
                              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                                {challenge.statLabel}
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-sm font-semibold">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {challenge.trend}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{challenge.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION: Warum reine LLMs nicht genügen ── */}
      <section className="py-24 bg-card relative">
        <div className="absolute inset-0 bg-destructive/5"></div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-destructive/10 text-destructive border-destructive/20 text-base px-4 py-2">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Schritt 2: Warum reine LLMs nicht genügen
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ChatGPT & Co. für das Sozialrecht ungeeignet
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Large Language Models sind probabilistisch — Rentenberechnung ist deterministisch. 
              Halluzinierte Paragraphen, fehlende Querverweise und temporale Blindheit machen reine LLMs für die DRV unbrauchbar.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "Halluzinierte Paragraphen",
                description: "Ein LLM erfindet plausibel klingende §-Angaben: '§37a SGB VI' existiert nicht, aber ein LLM kann diesen selbstbewusst zitieren. Falsche Rechtsauskunft kann zu fehlerhaften Bescheiden führen.",
                icon: AlertTriangle
              },
              {
                title: "Temporale Blindheit",
                description: "Kein Verständnis für Übergangsregelungen: Welche Altersgrenze gilt für Jahrgang 1960? LLMs kennen nicht die stufenweise Anhebung und antworten generisch mit '67 Jahre' — falsch.",
                icon: Clock
              },
              {
                title: "Fehlende Querverweise",
                description: "§43 EM-Rente verweist auf §53 (Ausnahme bei Arbeitsunfall) — LLMs erkennen diese Spezialregel nicht, weil sie Beziehungen zwischen Normen nicht systematisch traversieren können.",
                icon: Database
              }
            ].map((problem, index) => {
              const Icon = problem.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="h-full bg-destructive/5 border-2 border-destructive/20 hover:border-destructive/40 transition-colors">
                    <CardHeader>
                      <div className="mb-4">
                        <Icon className="h-10 w-10 text-destructive" />
                      </div>
                      <CardTitle className="text-xl leading-tight">{problem.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed">{problem.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION: Architektur (4-Layer Ontologie) ── */}
      <section id="architecture" ref={architectureRef} className="py-32 bg-primary/5 network-pattern relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <Badge className="mb-4 bg-primary text-primary-foreground text-base px-4 py-2">
              <BrainCircuit className="h-4 w-4 mr-2" />
              Schritt 3: Die CASSA-Lösung
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Multi-Layered Ontologie-Architektur
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Structure-Aware Temporal Graph RAG (SAT-Graph RAG) in Neo4j-Graphdatenbank — 
              alle Sozialgesetzbücher, Geschäftsregeln und Prozesse als navigierbarer Knowledge Graph.
            </p>
            <p className="text-base text-primary font-semibold">
              👆 Klicken Sie auf die Schichten, um mehr zu erfahren
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
            <div className="space-y-4">
              {layers.map((layer, index) => {
                const Icon = layer.icon
                const isSelected = selectedLayer === index
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 ${
                        isSelected 
                          ? 'ring-4 ring-primary shadow-2xl scale-105' 
                          : 'hover:shadow-lg hover:scale-102'
                      }`}
                      onClick={() => setSelectedLayer(isSelected ? null : index)}
                    >
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <motion.div 
                            className="p-4 rounded-xl"
                            style={{ backgroundColor: `${layer.color}15` }}
                            animate={{ scale: isSelected ? [1, 1.1, 1] : 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Icon className="h-8 w-8" style={{ color: layer.color }} />
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge 
                                variant="outline"
                                className="text-sm"
                                style={{ borderColor: layer.color, color: layer.color }}
                              >
                                Schicht {layer.number}
                              </Badge>
                              <CardTitle className="text-xl">{layer.title}</CardTitle>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">{layer.subtitle}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CardContent className="pt-0">
                              <Separator className="mb-4" />
                              <p className="text-muted-foreground leading-relaxed mb-4">{layer.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {layer.examples.map((example, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">{example}</Badge>
                                ))}
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="sticky top-24 h-[700px]"
            >
              <DRVKnowledgeGraph3D />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SECTION: Graph RAG vs Vector RAG ── */}
      <section id="graph-rag" className="py-32 bg-background">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 text-base px-4 py-2">
              <GitCompare className="h-4 w-4 mr-2" />
              Schritt 4: Warum Graph RAG?
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Graph RAG vs. Vector RAG
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Vector RAG findet ähnliche Textpassagen — Graph RAG versteht <strong>Beziehungen</strong> zwischen Normen.
              Bei gesetzesübergreifenden Fragen versagt Vector RAG systematisch. Hier sind konkrete Beispiele.
            </p>
          </motion.div>

          {/* Summary comparison */}
          <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
            <Card className="border-2 border-destructive/30 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <XCircle className="h-5 w-5 text-destructive" />
                  Vector RAG — Limitierungen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Findet nur textlich ähnliche Passages — keine strukturellen Verbindungen",
                  "Übersieht Ausnahmeregeln in anderen Paragraphen (§53 bei §43-Suche)",
                  "Keine temporalen Metadaten — kann Übergangsregelungen nicht auswerten",
                  "Kein Multi-Hop: Kann nicht über 3+ Gesetze hinweg Schlüsse ziehen",
                  "Kein Verständnis für Normenhierarchie oder Vorrang-/Spezialitätsregeln"
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <XCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground leading-relaxed">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500/30 bg-green-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CircleCheck className="h-5 w-5 text-green-600" />
                  Graph RAG — Vorteile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Traversiert Gesetz → Paragraph → Regel → Prozess über explizite Kanten",
                  "Folgt Querverweisen (SR_REFERENCES) und Ausnahmen (SR_DEPENDS_ON)",
                  "Temporale Metadaten an jedem Knoten — exakte Gültigkeit pro Stichtag",
                  "Multi-Hop über beliebig viele verknüpfte Gesetze, Regeln und Entitäten",
                  "Normenhierarchie als Graph-Struktur — automatische Vorrangprüfung"
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <CircleCheck className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground leading-relaxed">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Concrete failure examples */}
          <h3 className="text-2xl font-bold text-center mb-8">Konkrete Beispiele: Wo Vector RAG versagt</h3>
          <div className="space-y-8 max-w-5xl mx-auto">
            {ragComparisons.map((comp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-2 hover:shadow-xl transition-shadow overflow-hidden">
                  <CardHeader className="bg-primary/5">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="text-sm font-bold flex-shrink-0">
                        Beispiel {index + 1}
                      </Badge>
                      <div>
                        <CardTitle className="text-lg mb-2">{comp.title}</CardTitle>
                        <CardDescription className="text-base">
                          <span className="font-semibold text-foreground">Frage:</span> '{comp.question}"
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                      {/* Graph RAG */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <CircleCheck className="h-5 w-5 text-green-600" />
                          <span className="font-bold text-green-700">Graph RAG</span>
                          <Badge className="bg-green-100 text-green-800 text-xs">{comp.graphAnswer.result}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{comp.graphAnswer.explanation}</p>
                      </div>
                      {/* Vector RAG */}
                      <div className="p-6 bg-destructive/3">
                        <div className="flex items-center gap-2 mb-3">
                          <XCircle className="h-5 w-5 text-destructive" />
                          <span className="font-bold text-destructive">Vector RAG</span>
                          <Badge className="bg-red-100 text-red-800 text-xs">{comp.vectorAnswer.result}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{comp.vectorAnswer.explanation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION: Chat API Standards ── */}
      <section id="chat-api" className="py-32 bg-muted/30 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 text-base px-4 py-2">
              <MessageSquare className="h-4 w-4 mr-2" />
              Schritt 5: Chat API Standards
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Chatbot API nach Industriestandards
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              CASSA implementiert die gängigen Chat-API-Standards. Jedes Frontend, jeder Chatbot-Client 
              kann sich direkt integrieren — OpenAI-kompatibel mit GraphRAG-Erweiterungen.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {chatApiStandards.map((api, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: api.color }} />
                      <CardTitle className="text-base">{api.name}</CardTitle>
                    </div>
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-primary">{api.endpoint}</code>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">{api.description}</p>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-semibold">Genutzt von:</span> {api.adoptedBy}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CASSA API Detail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-primary/30 bg-primary/5 max-w-5xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Bot className="h-6 w-6 text-primary" />
                  CASSA Chat API — OpenAI-kompatibel + GraphRAG
                </CardTitle>
                <CardDescription>
                  Die CASSA API folgt dem OpenAI messages[]-Format und erweitert es um Zitationen und Sitzungsverwaltung.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      POST /api/v1/chat
                    </h4>
                    <div className="bg-slate-900 rounded-lg p-4 text-sm font-mono text-slate-300 overflow-x-auto">
                      <pre>{`{
  "message": "Welche Voraussetzungen
    gelten für Altersrente?",
  "session_id": null,
  "context": {
    "gesetz": "SGB VI",
    "paragraph": "§ 35"
  },
  "top_k": 10
}`}</pre>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Response mit Zitationen
                    </h4>
                    <div className="bg-slate-900 rounded-lg p-4 text-sm font-mono text-slate-300 overflow-x-auto">
                      <pre>{`{
  "session_id": "a3f1b2c4...",
  "answer": "Nach § 35 SGB VI haben
    Versicherte Anspruch auf...",
  "citations": [{
    "source": "SGB VI",
    "core_component": "Regelaltersrente",
    "br_name": "BR_SGB6_35_01",
    "score": 0.93
  }]
}`}</pre>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { label: "POST /api/v1/chat", desc: "Multi-Turn Chat mit Session (Redis, 8h TTL)" },
                    { label: "POST /api/v1/search", desc: "Single-Turn Search — stateless, keine Session" },
                    { label: "DELETE /api/v1/chat/{id}", desc: "Session löschen" },
                    { label: "GET /…/history", desc: "Konversationsverlauf abrufen" },
                    { label: "GET /docs", desc: "Swagger UI — interaktive API-Dokumentation" },
                    { label: "GET /health", desc: "Health Check Endpoint" },
                  ].map((ep, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <code className="text-xs font-mono font-semibold text-primary">{ep.label}</code>
                      <p className="text-xs text-muted-foreground mt-1">{ep.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION: Praxisszenarien ── */}
      <section id="scenarios" className="py-32 bg-card">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 text-base px-4 py-2">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Schritt 6: Praxis erleben
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Praxisszenarien für die DRV
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Konkrete Anwendungsfälle zeigen, wie CASSA die tägliche Arbeit in der Rentenversicherung unterstützt.
            </p>
          </motion.div>

          <Tabs value={String(activeScenario)} onValueChange={(v) => setActiveScenario(Number(v))} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-auto p-2 mb-12 max-w-5xl mx-auto">
              {scenarios.map((scenario, index) => {
                const Icon = scenario.icon
                return (
                  <TabsTrigger 
                    key={index} 
                    value={String(index)}
                    className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-xs md:text-sm font-medium text-center leading-tight">{scenario.title}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {scenarios.map((scenario, index) => {
              const Icon = scenario.icon
              return (
                <TabsContent key={index} value={String(index)}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="border-2 hover:shadow-2xl transition-shadow">
                      <CardHeader className="pb-8">
                        <div className="flex items-start gap-6">
                          <motion.div 
                            className="p-6 rounded-2xl"
                            style={{ backgroundColor: `${scenario.color}15` }}
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                          >
                            <Icon className="h-12 w-12" style={{ color: scenario.color }} />
                          </motion.div>
                          <div className="flex-1">
                            <CardTitle className="text-3xl mb-4">{scenario.title}</CardTitle>
                            <CardDescription className="text-base leading-relaxed">{scenario.description}</CardDescription>
                            <Badge variant="secondary" className="mt-4">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {scenario.impact}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Separator className="mb-6" />
                        <h4 className="font-semibold text-lg mb-4">CASSA-Funktionen für diesen Fall:</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {scenario.benefits.map((benefit, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: i * 0.1 }}
                              className="flex gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                            >
                              <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-foreground leading-relaxed">{benefit}</span>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              )
            })}
          </Tabs>
        </div>
      </section>

      {/* ── SECTION: Standards & Compliance ── */}
      <section id="standards" className="py-32 bg-muted/30 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 text-base px-4 py-2">
              <Scale className="h-4 w-4 mr-2" />
              Schritt 7: Rechtsgrundlagen
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Gesetzliche Grundlagen im Knowledge Graph
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Die DRV arbeitet auf Basis eines komplexen Geflechts aus Sozialgesetzbüchern, 
              EU-Verordnungen und internen Handlungsanweisungen. CASSA bildet sie alle als Graph ab.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: BookOpen,
                title: "Sozialgesetzbücher",
                color: "oklch(0.45 0.15 245)",
                standards: [
                  { name: "SGB VI — Rentenversicherung", desc: "Primärgesetz: ~323 §§ — Beiträge, Leistungen, Alters-/Erwerbsminderungsrente, Rehabilitation" },
                  { name: "SGB IV — Gemeinsame Vorschriften", desc: "Versicherungspflicht, Beitragsbemessung, Meldeverfahren — Grundlage aller Sozialversicherungen" },
                  { name: "SGB I — Allgemeiner Teil", desc: "Framework: Leistungsansprüche, Fristen, Zuständigkeiten — gilt übergreifend für alle SGBs" },
                  { name: "SGB IX — Rehabilitation", desc: "DRV als Reha-Träger — medizinische Rehabilitation und Teilhabe am Arbeitsleben" },
                  { name: "SGB X — Verwaltungsverfahren", desc: "Verwaltungsakte, Widerspruchsverfahren, Sozialdatenschutz — Verfahrensrecht" },
                ]
              },
              {
                icon: Landmark,
                title: "EU-Recht & Datenschutz",
                color: "oklch(0.50 0.18 200)",
                standards: [
                  { name: "DSGVO (EU 2016/679)", desc: "Datenschutz-Grundverordnung — Rechtsrahmen für die Verarbeitung personenbezogener Sozialdaten" },
                  { name: "EU-VO 883/2004", desc: "Koordinierung der Systeme der sozialen Sicherheit — grenzüberschreitende Rentenansprüche" },
                  { name: "BSI IT-Grundschutz", desc: "IT-Sicherheitsstandard — Pflicht für DRV als Behörde mit kritischer Infrastruktur" },
                  { name: "AAÜG — Anwartschaftsüberführung", desc: "Post-Vereinigungspension: Überführung von DDR-Rentenanwartschaften" },
                  { name: "VersAusglG — Versorgungsausgleich", desc: "Scheidungsbedingter Rentenausgleich zwischen Ehepartnern" },
                ]
              },
              {
                icon: ScrollText,
                title: "DRV-Anweisungen (GRA)",
                color: "oklch(0.55 0.20 55)",
                standards: [
                  { name: "GRA SGB VI", desc: "Gemeinsame Rechtliche Anweisungen zur Rentenversicherung — Auslegungshinweise zu allen §§" },
                  { name: "GRA SGB IV", desc: "Anweisungen zu Versicherungspflicht, Beiträgen und Meldeverfahren" },
                  { name: "GRA SGB IX", desc: "Anweisungen zur Rehabilitation — DRV als zuständiger Leistungsträger" },
                  { name: "GRA Fremdrentenrecht", desc: "Spezialanweisungen für ausländische Versicherungszeiten und Spätaussiedler" },
                  { name: "rvRecht® Portal", desc: "Öffentlich zugängliches DRV-Rechtsportal mit allen GRA — Quelle für CASSA-Import" },
                ]
              }
            ].map((category, catIndex) => {
              const CatIcon = category.icon
              return (
                <motion.div
                  key={catIndex}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: catIndex * 0.15 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl" style={{ backgroundColor: `${category.color}15` }}>
                          <CatIcon className="h-7 w-7" style={{ color: category.color }} />
                        </div>
                        <CardTitle className="text-xl">{category.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {category.standards.map((std, i) => (
                        <div key={i} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                          <div className="font-semibold text-sm text-foreground mb-1">{std.name}</div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{std.desc}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-primary/30 bg-primary/5">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">CASSA-Integration</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Alle genannten Gesetze und Anweisungen sind direkt im Knowledge Graph verankert. 
                      Jeder Paragraph enthält seine Geschäftsregeln, jede Regel verweist auf die relevanten Prozesse und Entitäten.
                      Die zeitliche Dimension speichert die Gültigkeit jeder Fassung — von der Übergangsregelung bis zur aktuellen Rentenanpassung.
                      GRA-Anweisungen des rvRecht®-Portals sind als eigene Knotentypen verknüpft und liefern praxisnahe Auslegungshinweise.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION: Graph-Architektur im Detail ── */}
      <section id="graph-detail" className="py-32 bg-card relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 text-base px-4 py-2">
              <Layers className="h-4 w-4 mr-2" />
              Schritt 8: Graph-Architektur
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Knowledge Graph — Datenmodell
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Die vollständige DRV-Graphstruktur: von Gesetzen über Geschäftsregeln bis zu Prozessen und Entitäten.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-2 bg-slate-900 text-slate-200 overflow-hidden">
              <CardContent className="p-8">
                <pre className="text-sm font-mono leading-relaxed overflow-x-auto whitespace-pre">
{`CT_LAW (5–9 Gesetze: SGB I, IV, VI, IX, X, AAÜG, FRG, VersAusglG, BetrAVG)
 └─[SR_CONTAINS]─► S_SECTION (~1.000 Paragraphen)
      └─[SR_CONTAINS]─► S_CORE_COMPONENT (~2.500 Kernkomponenten)
           ├─[SR_DEFINES]─► S_BUSINESS_RULE (~800 Geschäftsregeln)
           │    └─[SR_REALIZED_BY]─► S_PROCESS (~200 Prozesse)
           │         ├─[SR_SUPPORTS]─► S_GOAL
           │         └─[SR_COMPOSED_OF]─► S_TASK
           └─[SR_ASSOCIATES]─► S_ENT_* (~2.000 Entitäten)
                z.B. S_ENT_PERSON, S_ENT_BUSINESS_OBJECT,
                     S_ENT_DEADLINE, S_ENT_MONEY_AMOUNT

GRA_INSTRUCTION ──[SR_INSTRUCTS]──► S_SECTION
STANDARD        ──[SR_APPLIES_TO]─► S_PROCESS
CHAT_API        ──[SR_COMPATIBLE]─► CHAT_API`}
                </pre>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-4 mt-8">
              {[
                { label: "~4.500+", desc: "Knoten im vollständigen Graph", icon: Database },
                { label: "~8.000+", desc: "Beziehungen zwischen Knoten", icon: Network },
                { label: "5+ SGBs", desc: "Verknüpfte Gesetze mit Querverweisen", icon: Link2 },
              ].map((stat, i) => {
                const StatIcon = stat.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                      <StatIcon className="h-8 w-8 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-bold text-primary mb-1">{stat.label}</div>
                      <div className="text-sm text-muted-foreground">{stat.desc}</div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 network-pattern"></div>
        </div>
        <div className="container mx-auto px-6 max-w-7xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Bereit für den digitalen Wissensassistenten?
            </h2>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-12 leading-relaxed">
              Erfahren Sie mehr über CASSA und wie ein Knowledge Graph mit GraphRAG 
              die Komplexität des Sozialrechts beherrschbar macht — rechtskonform und transparent.
            </p>
            <Button 
              asChild 
              size="lg" 
              variant="secondary"
              className="text-lg px-12 h-16 text-primary font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              <a href="https://www.soprasteria.de/products/cassa" target="_blank" rel="noopener noreferrer">
                Zur offiziellen CASSA-Website
                <ArrowRight className="ml-3 h-6 w-6" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 border-t border-border bg-muted/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <SopraLogo />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p className="text-sm text-muted-foreground text-center">
                © 2025 Sopra Steria. Alle Rechte vorbehalten.
              </p>
              <a
                href="https://www.soprasteria.de/footer/impressum"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                Impressum
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ── Helper Components ──

function SopraLogo() {
  return (
    <img 
      src="https://www.soprasteria.de/ResourcePackages/Bootstrap4/assets/dist/logos/logo-soprasteria.svg" 
      alt="Sopra Steria" 
      className="h-8 md:h-10"
    />
  )
}

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/10 rounded-full"
          initial={{ 
            x: Math.random() * 100 + '%',
            y: Math.random() * 100 + '%',
            scale: 0
          }}
          animate={{ 
            y: [null, Math.random() * 100 + '%'],
            scale: [0, 1, 0],
            opacity: [0, 0.5, 0]
          }}
          transition={{ 
            duration: Math.random() * 10 + 5,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  )
}

export default App
