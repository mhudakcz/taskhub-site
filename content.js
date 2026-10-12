/*
 * ============================================================================
 *  Taskhub site – EDITABLE CONTENT (Czech + English)
 * ============================================================================
 *  Everything that changes over time lives here: milestone status, modules,
 *  news, numbers, screenshots, the "last updated" date and all page texts.
 *  The page (app.js) renders it.
 *
 *  LANGUAGES
 *  Czech (cs) is the default, English (en) is a full variant. Every visible
 *  text is a pair:
 *      title: { cs: "Wiki pro každého klienta", en: "A wiki for every client" },
 *  and a list of texts is an array of pairs:
 *      items: [ { cs: "…", en: "…" }, { cs: "…", en: "…" } ],
 *  A plain string ("Kanban board") is used as-is in both languages. If `en`
 *  is missing, the Czech text is shown – so nothing breaks, but please always
 *  fill in both. Ids, dates, `status`, `kind`, `milestone`, file names etc.
 *  are NOT translated.
 *  Language choice on the page: ?lang=en|cs in the URL > saved choice >
 *  browser language (en* -> English) > Czech.
 *
 *  ADD A NEWS ITEM ("Novinky" / "What's new")
 *  `news` below, NEWEST FIRST. It mirrors CHANGELOG.md in the repo root – add
 *  the entry there first (Czech), then copy it to the TOP of `news` here and
 *  add the English version next to each Czech text:
 *      {
 *        id: "timer",                 // anchor #news-timer, not translated
 *        date: "2026-10-15",          // ISO date
 *        kind: "feature",             // feature | improvement | fix | design | setup
 *        milestone: "M5",
 *        title: { cs: "Výkazy času a timer", en: "Time tracking and a timer" },
 *        items: [
 *          { cs: "Čas zapíšete jako „1h 30m“.", en: "Log time as “1h 30m”." },
 *        ],
 *      },
 *  The first two entries are also shown as a teaser in the hero.
 *
 *  CHANGE THE ROADMAP
 *  Updating a milestone = change one `status` line in `roadmap` below.
 *  Allowed values: "done" | "in-progress" | "planned".
 *  A new milestone = new object with `id`, `status`, `title: {cs, en}` and
 *  `text: {cs, en}`.
 *
 *  Module status is DERIVED from its milestones (`milestones: [...]`):
 *    all milestones done          -> "Hotovo" / "Done"
 *    some done or in progress     -> "Ve vývoji" / "In development"
 *    otherwise                    -> "Plánováno" / "Planned"
 *  To force a status on a module, add `status: "done"` (etc.) to it.
 *
 *  PAGE TEXTS (`ui` at the bottom)
 *  Static texts of index.html (hero, sections, install guide, footer, alt
 *  texts, aria-labels, <title>, meta description) and texts used by app.js.
 *  index.html marks them with data-i18n="key" (inner HTML) or
 *  data-i18n-attr="attr:key; attr2:key2". The Czech text written directly in
 *  index.html is only a fallback without JavaScript – edit the texts HERE.
 *  Values may contain simple HTML (<code>, <strong>, <span class="grad">).
 * ============================================================================
 */
window.TASKHUB_SITE = {
  updated: "2026-10-08", // ISO date shown in the footer
  repoUrl: "https://github.com/mhudakcz/taskhub",

  /* ---- Numbers shown in the "V číslech" band ------------------------------ */
  // Update after each milestone (pnpm test / pnpm db:test / pnpm test:e2e).
  stats: [
    {
      value: 176,
      label: { cs: "RLS testů hlídá, kdo co smí vidět", en: "RLS tests guard who can see what" },
    },
    { value: 115, label: { cs: "unit testů", en: "unit tests" } },
    { value: 33, label: { cs: "E2E testů v prohlížeči", en: "end-to-end browser tests" } },
  ],

  /* ---- Ticker under the hero (two rows; icon names are in app.js ICONS) -- */
  // tone: "todo" | "doing" | "test" | "done" | "brand"
  ticker: [
    { icon: "board", text: "Kanban board", tone: "todo" },
    {
      icon: "book",
      text: { cs: "Wiki ke každému projektu", en: "A wiki for every project" },
      tone: "test",
    },
    { icon: "clock", text: { cs: "Výkazy času", en: "Time tracking" }, tone: "doing" },
    {
      icon: "handshake",
      text: { cs: "Klient jako host", en: "Clients join as guests" },
      tone: "done",
    },
    { icon: "hash", text: { cs: "ID tasků KEY-123", en: "Task IDs like KEY-123" }, tone: "brand" },
    { icon: "layers", text: { cs: "Podprojekty", en: "Subprojects" }, tone: "todo" },
    {
      icon: "move",
      text: { cs: "Drag & drop i na mobilu", en: "Drag & drop, even on mobile" },
      tone: "doing",
    },
    {
      icon: "shield",
      text: { cs: "Oprávnění hlídá databáze", en: "Permissions enforced by the database" },
      tone: "done",
    },
    { icon: "timer", text: { cs: "Timer jedním klikem", en: "One-click timer" }, tone: "doing" },
    { icon: "receipt", text: { cs: "Fakturační podklady", en: "Billing reports" }, tone: "brand" },
    {
      icon: "bell",
      text: { cs: "Notifikace a @zmínky", en: "Notifications and @mentions" },
      tone: "test",
    },
    { icon: "search", text: { cs: "Ctrl + K vyhledávání", en: "Ctrl + K search" }, tone: "todo" },
    { icon: "moon", text: { cs: "Tmavý režim", en: "Dark mode" }, tone: "test" },
    {
      icon: "palette",
      text: { cs: "Pět barevných schémat", en: "Five color schemes" },
      tone: "brand",
    },
    {
      icon: "languages",
      text: { cs: "Čeština i angličtina", en: "Czech and English" },
      tone: "done",
    },
    { icon: "download", text: { cs: "Export CSV a PDF", en: "CSV and PDF export" }, tone: "todo" },
  ],

  /* ---- News / changelog (mirror of CHANGELOG.md, newest first) ----------- */
  // kind: "feature" (Novinka) | "improvement" (Vylepšení) | "fix" (Oprava)
  //       | "design" (Design) | "setup" (Základ)
  news: [
    {
      id: "notifikace",
      date: "2026-10-09",
      kind: "feature",
      milestone: "M6",
      title: {
        cs: "Notifikace: zvoneček, e-maily a odpověď e-mailem",
        en: "Notifications: the bell, e-mails and replying by e-mail",
      },
      items: [
        {
          cs: "Zvoneček ukáže přidělení, @zmínky, nové komentáře a změny stavu u sledovaných tasků – živě, bez obnovení stránky.",
          en: "The bell shows assignments, @mentions, new comments and status changes on tasks you watch – live, without reloading.",
        },
        {
          cs: "E-maily hned (víc změn v jednom e-mailu), denní souhrn v 8:00, nebo vypnuto. Co už máš v aplikaci přečtené, e-mailem nechodí.",
          en: "E-mails right away (several changes in one e-mail), a daily digest at 8:00, or off. What you've seen in the app isn't e-mailed.",
        },
        {
          cs: "Na e-mail stačí odpovědět – odpověď se uloží jako komentář u tasku. Klient nemusí do aplikace.",
          en: "Just reply to the e-mail – your reply is saved as a comment on the task. Clients don't even need to open the app.",
        },
        {
          cs: "Klient dostane jen to, co smí vidět – nikdy interní komentáře ani interní tasky.",
          en: "Clients only hear about what they may see – never internal comments or internal tasks.",
        },
        {
          cs: "Provoz: kontrola dostupnosti, ping databáze proti uspání a týdenní zálohy do R2.",
          en: "Operations: health check, a database keep-alive against pausing and weekly backups to R2.",
        },
      ],
    },
    {
      id: "vykazy-casu",
      date: "2026-10-08",
      kind: "feature",
      milestone: "M5",
      title: { cs: "Výkazy času, timer a reporty", en: "Time tracking, a timer and reports" },
      items: [
        {
          cs: "Čas zapíšete přímo u tasku jako „1h 30m“, „1.5h“, „90m“ nebo „1:30“, případně spustíte timer.",
          en: "Log time right on a task as “1h 30m”, “1.5h”, “90m” or “1:30” – or start a timer.",
        },
        {
          cs: "Timer běží v postranním panelu, přežije obnovení stránky a jedním klikem se uloží jako záznam.",
          en: "The timer lives in the sidebar, survives a page reload and saves as an entry in one click.",
        },
        {
          cs: "Můj timesheet: týdenní mřížka tasků a dnů se součty, čas se zapisuje rovnou do buňky.",
          en: "My timesheet: a weekly grid of tasks and days with totals; log time straight into a cell.",
        },
        {
          cs: "Reporty podle projektu, tasku, člověka nebo dne – přesný i zaokrouhlený čas vedle sebe, export do CSV pro Excel.",
          en: "Reports by project, task, person or day – exact and rounded time side by side, CSV export for Excel.",
        },
        {
          cs: "Zaokrouhlení (15/30/60 min, nahoru nebo k nejbližšímu, za záznam nebo za task a den) a rozpočet hodin s ukazatelem čerpání pro každého klienta i podprojekt.",
          en: "Rounding (15/30/60 min, up or to nearest, per entry or per task and day) and an hour budget with a usage meter for every client and subproject.",
        },
        {
          cs: "Klient (host) výkazy, timer, odhady ani rozpočty nikdy neuvidí.",
          en: "Clients (guests) never see time entries, timers, estimates or budgets.",
        },
      ],
    },
    {
      id: "mobil-a-limity",
      date: "2026-10-08",
      kind: "improvement",
      milestone: "M5",
      title: {
        cs: "Lepší mobil a tablet, přílohy do 10 MB",
        en: "Better on phones and tablets, attachments up to 10 MB",
      },
      items: [
        {
          cs: "Detail tasku a wiki už na mobilu ani tabletu nepřetékají do strany; hlídá to automatický test na třech šířkách.",
          en: "The task detail and wiki no longer spill sideways on phones or tablets; an automated test checks three widths.",
        },
        {
          cs: "Přílohy mají limit 10 MB. Fotky z mobilu se nejdřív zmenší, takže se vejdou.",
          en: "Attachments are limited to 10 MB. Phone photos are resized first, so they still fit.",
        },
        {
          cs: "Web je nově i v angličtině a má podrobný návod na nasazení do produkce i na vlastní server.",
          en: "This website now speaks English too and has a detailed guide for production and self-hosting.",
        },
      ],
    },
    {
      id: "wiki",
      date: "2026-10-08",
      kind: "feature",
      milestone: "M4",
      title: {
        cs: "Wiki pro každého klienta i pro firmu",
        en: "A wiki for every client – and for your company",
      },
      items: [
        {
          cs: "Každý klient má vlastní wiki se stromem stránek, podprojekty ji sdílejí.",
          en: "Every client gets their own wiki with a page tree, shared by all of its subprojects.",
        },
        {
          cs: "Firemní wiki pro interní tým: onboarding, postupy, zásady.",
          en: "A company wiki for your internal team: onboarding, how-tos and policies.",
        },
        {
          cs: "Editor ve stylu Notion: nadpisy, seznamy, checklisty, tabulky, kód a obrázky.",
          en: "A Notion-style editor: headings, lists, checklists, tables, code and images.",
        },
        {
          cs: "Stránka je interní, nebo i pro klienta. Klient interní stránky nikdy neuvidí.",
          en: "Each page is either internal or shared with the client. Clients never see internal pages.",
        },
        {
          cs: "Každé uložení vytvoří verzi, starší verzi jde zobrazit a obnovit.",
          en: "Every save creates a version – view any older one and restore it.",
        },
        {
          cs: "Hledání funguje i bez diakritiky, napsané KYT-12 se samo proklikne na task.",
          en: "Search ignores diacritics, and typing KYT-12 turns into a link to the task.",
        },
      ],
    },
    {
      id: "detail-tasku",
      date: "2026-10-08",
      kind: "feature",
      milestone: "M3",
      title: {
        cs: "Detail tasku, komentáře a přílohy",
        en: "Task detail, comments and attachments",
      },
      items: [
        {
          cs: "Kliknutím na kartu se detail tasku otevře přímo nad boardem. Odkaz jde poslat dál, Esc detail zavře.",
          en: "Click a card and the task opens right on top of the board. Share the link, close it with Esc.",
        },
        {
          cs: "Komentáře jsou interní (jen pro tým), nebo i pro klienta. Klient interní komentáře nikdy neuvidí.",
          en: "Comments are internal (team only) or visible to the client. Clients never see internal comments.",
        },
        {
          cs: "Kolegu zmíníte zavináčem (@), napsané KYT-12 se samo proklikne na task.",
          en: "Mention a teammate with @, and typing KYT-12 turns into a link to the task.",
        },
        {
          cs: "Přílohy stačí přetáhnout do tasku, velké obrázky se samy zmenší.",
          en: "Just drop attachments onto a task – large images are resized automatically.",
        },
        {
          cs: "Checklist s průběhem i na kartě v boardu, barevné štítky a filtr podle štítku.",
          en: "Checklists with progress right on the board card, colored labels and a label filter.",
        },
        {
          cs: "Historie změn pro interní tým, sledování tasku a koš s obnovou do 30 dnů.",
          en: "Change history for the internal team, task following and a trash you can restore from for 30 days.",
        },
      ],
    },
    {
      id: "chybove-hlasky",
      date: "2026-10-08",
      kind: "improvement",
      milestone: "M2",
      title: {
        cs: "Srozumitelné chybové hlášky ve formulářích",
        en: "Clear error messages in forms",
      },
      items: [
        {
          cs: "Formulář přesně řekne, co je špatně a jak to opravit, a to přímo u daného pole.",
          en: "Forms tell you exactly what's wrong and how to fix it, right next to the field.",
        },
        {
          cs: "Adresa workspace a klíč projektu se při psaní samy upraví do správného tvaru: malá písmena, bez diakritiky, mezery se změní na pomlčky.",
          en: "Workspace addresses and project keys format themselves as you type: lowercase, no diacritics, spaces become dashes.",
        },
        {
          cs: "Nápověda k formátu je vidět pořád, ne až po chybě.",
          en: "Format hints are always visible, not only after a mistake.",
        },
        {
          cs: "Kontrola proběhne hned po opuštění pole, nemusíte čekat na odeslání.",
          en: "Fields are checked as soon as you leave them – no need to wait for submit.",
        },
        {
          cs: "Povinná pole jsou označená hvězdičkou (*).",
          en: "Required fields are marked with an asterisk (*).",
        },
      ],
    },
    {
      id: "podprojekty",
      date: "2026-10-08",
      kind: "feature",
      milestone: "M2",
      title: { cs: "Podprojekty u klientů", en: "Subprojects for clients" },
      items: [
        {
          cs: "Klient může mít podprojekty, například úvodní analýzu, realizaci a podporu. Každý má vlastní board a sloupce.",
          en: "A client can have subprojects such as discovery, delivery and support – each with its own Board and columns.",
        },
        {
          cs: "Tasky všech podprojektů mají společnou číselnou řadu (KYT-1, KYT-2, …), čísla se nikdy neopakují.",
          en: "Tasks across all subprojects share one numbering (KYT-1, KYT-2, …), and numbers are never reused.",
        },
        {
          cs: "Task jde přesunout do jiného podprojektu a své číslo si ponechá. Staré odkazy dál fungují.",
          en: "Move a task to another subproject and it keeps its number. Old links keep working.",
        },
        {
          cs: "Členy, hosty a jejich oprávnění nastavujete jednou, u klienta. Podprojekty je zdědí.",
          en: "Set up members, guests and permissions once, on the client. Subprojects inherit them.",
        },
        {
          cs: "Přepínač podprojektů je v záhlaví projektu i v postranním panelu.",
          en: "Switch subprojects from the project header or the sidebar.",
        },
      ],
    },
    {
      id: "board",
      date: "2026-10-08",
      kind: "feature",
      milestone: "M2",
      title: { cs: "Projekty a board s přetahováním", en: "Projects and a drag-and-drop Board" },
      items: [
        {
          cs: "Projekty s vlastním klíčem a barvou, přehled aktivních i archivovaných.",
          en: "Projects with their own key and color, plus an overview of active and archived ones.",
        },
        {
          cs: "Kanban board: karty i sloupce přetáhnete myší, prstem nebo klávesnicí.",
          en: "Kanban Board: drag cards and columns with a mouse, a finger or the keyboard.",
        },
        {
          cs: "Každý task má lidské ID jako KYT-12 a vlastní adresu.",
          en: "Every task gets a human-friendly ID like KYT-12 and its own URL.",
        },
        {
          cs: "Rychlé přidání tasku, filtry (text, jen moje, řešitel, priorita) a WIP limity sloupců.",
          en: "Quick task entry, filters (text, mine only, assignee, priority) and column WIP limits.",
        },
        {
          cs: "Detail tasku se ukládá sám: stav, řešitel, priorita, termín a odhad.",
          en: "The task detail saves itself: status, assignee, priority, due date and estimate.",
        },
        {
          cs: "Zákazník jako host vidí jen veřejné tasky, a jen když mu to povolíte.",
          en: "A client joining as a guest sees public tasks only – and only if you allow it.",
        },
        {
          cs: "Když task dorazí do Done, oslaví to konfety.",
          en: "When a task reaches Done, confetti celebrates it.",
        },
      ],
    },
    {
      id: "prihlaseni",
      date: "2026-10-08",
      kind: "feature",
      milestone: "M1",
      title: {
        cs: "Přihlášení, workspace, role a pozvánky",
        en: "Sign-in, workspaces, roles and invitations",
      },
      items: [
        {
          cs: "Přihlášení bez hesla, odkazem z e-mailu. Přihlášení přes Google je připravené.",
          en: "Passwordless sign-in with a link from your e-mail. Google sign-in is ready too.",
        },
        {
          cs: "Workspace pro tým s rolemi vlastník, admin, člen a host. Každý workspace má oddělená data.",
          en: "A Workspace for your team with owner, admin, member and guest roles. Each Workspace keeps its data separate.",
        },
        {
          cs: "Pozvánka odkazem ke zkopírování nebo e-mailem, platí 7 dní.",
          en: "Invite people with a copyable link or by e-mail, valid for 7 days.",
        },
        { cs: "Přepínání mezi více workspace.", en: "Switch between multiple Workspaces." },
        {
          cs: "Profil s nastavením vzhledu: světlý nebo tmavý režim, barevné schéma a úroveň animací. Platí na všech zařízeních.",
          en: "A profile with appearance settings: light or dark mode, color scheme and animation level – synced across all your devices.",
        },
        { cs: "Spuštěn tento prezentační web.", en: "This website went live." },
      ],
    },
    {
      id: "sorbet",
      date: "2026-10-07",
      kind: "design",
      milestone: "M0",
      title: {
        cs: "Vizuální styl Sorbet a klikací prototyp",
        en: "The Sorbet visual style and a clickable prototype",
      },
      items: [
        {
          cs: "Hravý a barevný vzhled: každý stav tasku má svůj gradient, k tomu sklo a jemné animace.",
          en: "A playful, colorful look: every task status has its own gradient, plus glass and subtle animations.",
        },
        {
          cs: "Pět barevných schémat včetně vysokého kontrastu.",
          en: "Five color schemes, including high contrast.",
        },
        {
          cs: "Tři úrovně animací (všechny, jemné, vypnuté) podle toho, co vám vyhovuje.",
          en: "Three animation levels (full, subtle, off) – whatever suits you.",
        },
        {
          cs: "Klikací prototyp, podle kterého vzniká skutečná aplikace.",
          en: "A clickable prototype that the real app is built from.",
        },
      ],
    },
    {
      id: "zaklad",
      date: "2026-10-06",
      kind: "setup",
      milestone: "M0",
      title: { cs: "Základ projektu", en: "Project foundations" },
      items: [
        {
          cs: "Aplikace v češtině a angličtině, jazyk se řídí profilem.",
          en: "The app speaks Czech and English, following your profile setting.",
        },
        { cs: "Tmavý režim od prvního dne.", en: "Dark mode from day one." },
        {
          cs: "Automatické testy a kontrola při každé změně.",
          en: "Automated tests and checks on every change.",
        },
        {
          cs: "Běží na Cloudflare, data jsou v Supabase.",
          en: "Runs on Cloudflare, with data in Supabase.",
        },
      ],
    },
  ],

  /* ---- Roadmap (PRD kap. 9) – one line per status change ---------------- */
  roadmap: [
    {
      id: "M0",
      status: "done",
      title: "Setup",
      text: {
        cs: "Next.js 16, TypeScript, Tailwind + shadcn/ui, lokální Supabase, next-intl, Vitest a Playwright, CI a nasazení na Cloudflare Workers. K tomu vizuální systém Sorbet a klikací prototyp.",
        en: "Next.js 16, TypeScript, Tailwind + shadcn/ui, local Supabase, next-intl, Vitest and Playwright, CI and deployment to Cloudflare Workers. Plus the Sorbet design system and a clickable prototype.",
      },
    },
    {
      id: "M1",
      status: "done",
      title: { cs: "Přihlášení a workspace", en: "Sign-in and workspaces" },
      text: {
        cs: "Magic link a Google, profil včetně nastavení vzhledu, workspace, role owner/admin/member/guest, pozvánky odkazem i e-mailem, přepínač workspace, základ RLS.",
        en: "Magic link and Google, a profile with appearance settings, Workspaces, owner/admin/member/guest roles, invitations by link or e-mail, a Workspace switcher and the RLS foundation.",
      },
    },
    {
      id: "M2",
      status: "done",
      title: { cs: "Projekty a board", en: "Projects and Board" },
      text: {
        cs: "Klienti s podprojekty (analýza, realizace, podpora), vlastní sloupce, tasky s ID KEY-123 společné pro celého klienta, drag & drop myší, prstem i klávesnicí, filtry, WIP limity, archivace.",
        en: "Clients with subprojects (discovery, delivery, support), custom columns, KEY-123 task IDs shared across the whole client, drag & drop by mouse, touch or keyboard, filters, WIP limits and archiving.",
      },
    },
    {
      id: "M3",
      status: "done",
      title: { cs: "Detail tasku a guest", en: "Task detail and guests" },
      text: {
        cs: "Komentáře interní a veřejné, přílohy v R2, activity log, štítky, checklist, oprávnění pro hosty.",
        en: "Internal and public comments, attachments in R2, an activity log, labels, checklists and permissions for client guests.",
      },
    },
    {
      id: "M4",
      status: "done",
      title: "Wiki",
      text: {
        cs: "Strom stránek, editor BlockNote, viditelnost, historie verzí, odkazy na tasky, vyhledávání.",
        en: "A page tree, the BlockNote editor, page visibility, version history, task links and search.",
      },
    },
    {
      id: "M5",
      status: "done",
      title: { cs: "Výkazy času", en: "Time tracking" },
      text: {
        cs: "Worklogy, timer, týdenní timesheet, reporty, zaokrouhlování, export CSV.",
        en: "Worklogs, a timer, a weekly Timesheet, reports, rounding and CSV export.",
      },
    },
    {
      id: "M6",
      status: "done",
      title: { cs: "Notifikace", en: "Notifications" },
      text: {
        cs: "In-app zvoneček a e-maily, sledování tasků, @zmínky, nastavení per uživatel. Odpověď na e-mailovou notifikaci se uloží jako veřejný komentář.",
        en: "An in-app bell and e-mails, task following, @mentions and per-user settings. Replying to an e-mail notification posts a public comment.",
      },
    },
    {
      id: "M7",
      status: "in-progress",
      title: { cs: "Fakturace", en: "Billing" },
      text: {
        cs: "Sazby, fakturační podklady, uzamčení období, export PDF.",
        en: "Rates, billing reports, period locking and PDF export.",
      },
    },
    {
      id: "M8",
      status: "planned",
      title: { cs: "Doladění", en: "Polish" },
      text: {
        cs: "Osobní přehled „Moje práce“, globální vyhledávání, seznamový pohled, tmavý režim v celé aplikaci, výkon.",
        en: "A personal “My work” dashboard, global search, a list view, dark mode across the whole app and performance.",
      },
    },
    {
      id: "M9",
      status: "planned",
      title: { cs: "Automatizace", en: "Automation" },
      text: {
        cs: "Šablony projektů a tasků, opakované tasky a založení tasku z e-mailu.",
        en: "Project and task templates, recurring tasks and creating tasks from e-mail.",
      },
    },
    {
      id: "M10",
      status: "planned",
      title: { cs: "API a integrace", en: "API & integrations" },
      text: {
        cs: "Veřejné API s tokeny, webhooky, MCP server pro AI asistenty a napojení na Fakturoid.",
        en: "A public API with tokens, webhooks, an MCP server for AI assistants and a Fakturoid integration.",
      },
    },
  ],

  /* ---- Modules ("Co umí") ------------------------------------------------ */
  modules: [
    {
      icon: "users",
      title: { cs: "Účty, workspace a role", en: "Accounts, workspaces and roles" },
      milestones: ["M1"],
      items: [
        { cs: "Přihlášení přes magic link nebo Google", en: "Sign in with a magic link or Google" },
        {
          cs: "Víc workspace na jeden účet, každý má oddělená data",
          en: "Multiple Workspaces per account, each with separate data",
        },
        { cs: "Role owner, admin, member a guest", en: "Owner, admin, member and guest roles" },
        {
          cs: "Pozvánka odkazem ke zkopírování nebo e-mailem",
          en: "Invite by copyable link or by e-mail",
        },
      ],
    },
    {
      icon: "board",
      title: { cs: "Board a tasky", en: "Board and tasks" },
      milestones: ["M2", "M3"],
      items: [
        {
          cs: "Kanban s vlastními sloupci, WIP limitem a přetahováním karet",
          en: "Kanban with custom columns, WIP limits and drag-and-drop cards",
        },
        {
          cs: "Klient s podprojekty: analýza, realizace, podpora – společná čísla tasků",
          en: "Clients with subprojects – discovery, delivery, support – sharing one task numbering",
        },
        {
          cs: "Lidské ID tasku (KEY-123) s vlastní URL",
          en: "Human-friendly task IDs (KEY-123) with their own URL",
        },
        {
          cs: "Priorita, termín, štítky, odhad, checklist a přílohy",
          en: "Priority, due date, labels, estimate, checklist and attachments",
        },
        {
          cs: "Interní a veřejné komentáře, @zmínky, historie změn",
          en: "Internal and public comments, @mentions and change history",
        },
        { cs: "Filtry a přepínač „jen moje“", en: "Filters and a “mine only” toggle" },
      ],
    },
    {
      icon: "book",
      title: "Wiki",
      milestones: ["M4"],
      items: [
        { cs: "Strom stránek u každého projektu", en: "A page tree for every project" },
        {
          cs: "Editor ve stylu Notion: tabulky, checklisty, obrázky, kód",
          en: "A Notion-style editor: tables, checklists, images, code",
        },
        { cs: "Historie verzí s obnovením", en: "Version history with one-click restore" },
        { cs: "Odkazy na tasky a fulltextové vyhledávání", en: "Task links and full-text search" },
      ],
    },
    {
      icon: "clock",
      title: { cs: "Výkazy času", en: "Time tracking" },
      milestones: ["M5"],
      items: [
        {
          cs: "Zápis „1h 30m“, „1.5h“ nebo „90m“, případně timer",
          en: "Log “1h 30m”, “1.5h” or “90m” – or just run the timer",
        },
        { cs: "Týdenní timesheet s denními součty", en: "A weekly Timesheet with daily totals" },
        {
          cs: "Reporty podle projektu, tasku, člověka a dne, export CSV",
          en: "Reports by project, task, person and day, with CSV export",
        },
        {
          cs: "Zaokrouhlení nastavitelné per projekt, data zůstávají přesná",
          en: "Rounding set per project, while the raw data stays exact",
        },
      ],
    },
    {
      icon: "receipt",
      title: { cs: "Fakturační podklady", en: "Billing reports" },
      milestones: ["M7"],
      items: [
        {
          cs: "Hodinová sazba projektu, volitelně per člověk",
          en: "An hourly rate per project, optionally per person",
        },
        {
          cs: "Podklad za období: zaokrouhlené hodiny × sazba",
          en: "A report for any period: rounded hours × rate",
        },
        { cs: "Uzamčení vyfakturovaného období", en: "Lock periods once they're invoiced" },
        { cs: "Export CSV a PDF", en: "CSV and PDF export" },
      ],
    },
    {
      icon: "handshake",
      title: { cs: "Spolupráce se zákazníkem", en: "Working with clients" },
      milestones: ["M1", "M3"],
      items: [
        {
          cs: "Zákazník se připojí jako guest jen do svého projektu",
          en: "Clients join as guests – only in their own project",
        },
        {
          cs: "Vidí jen veřejné tasky, komentáře a wiki stránky",
          en: "They see only public tasks, comments and wiki pages",
        },
        {
          cs: "Interní komentáře, výkazy ani sazby nikdy neuvidí",
          en: "Internal comments, worklogs and rates stay hidden from them",
        },
        {
          cs: "Oprávnění hlídá databáze (RLS), ne jen rozhraní",
          en: "Permissions are enforced by the database (RLS), not just the UI",
        },
      ],
    },
    {
      icon: "bell",
      title: { cs: "Notifikace", en: "Notifications" },
      milestones: ["M6"],
      items: [
        {
          cs: "Zvoneček v aplikaci: přiřazení, zmínka, komentář, změna stavu",
          en: "An in-app bell: assignments, mentions, comments, status changes",
        },
        { cs: "E-maily s volbou typů a souhrnu", en: "E-mails with a choice of types and digests" },
        {
          cs: "Odpověď na e-mail se uloží jako komentář u tasku",
          en: "Reply to an e-mail and it becomes a comment on the task",
        },
        { cs: "Automatické sledování tasků", en: "Automatic task following" },
      ],
    },
    {
      icon: "search",
      title: { cs: "Vyhledávání a přehled", en: "Search and overview" },
      milestones: ["M4", "M8"],
      items: [
        {
          cs: "Ctrl + K přes tasky, projekty a wiki",
          en: "Ctrl + K across tasks, projects and wiki",
        },
        { cs: "Osobní přehled „Moje práce“", en: "A personal “My work” dashboard" },
        {
          cs: "Výsledky vždy jen v rámci oprávnění",
          en: "Results always respect your permissions",
        },
      ],
    },
    {
      icon: "sparkles",
      title: { cs: "Automatizace", en: "Automation" },
      milestones: ["M9"],
      items: [
        { cs: "Šablony projektů a tasků", en: "Project and task templates" },
        { cs: "Opakované tasky", en: "Recurring tasks" },
        { cs: "Založení tasku z e-mailu", en: "Create tasks from e-mail" },
      ],
    },
    {
      icon: "plug",
      title: { cs: "API a integrace", en: "API & integrations" },
      milestones: ["M10"],
      items: [
        { cs: "Veřejné API s tokeny a webhooky", en: "A public API with tokens and webhooks" },
        { cs: "MCP server pro AI asistenty", en: "An MCP server for AI assistants" },
        { cs: "Napojení na Fakturoid", en: "Fakturoid integration" },
      ],
    },
    {
      icon: "palette",
      title: { cs: "Vzhled a přístupnost", en: "Appearance and accessibility" },
      milestones: ["M1", "M8"],
      items: [
        {
          cs: "Pět barevných schémat včetně vysokého kontrastu",
          en: "Five color schemes, including high contrast",
        },
        { cs: "Světlý a tmavý režim", en: "Light and dark mode" },
        { cs: "Animace: všechny, jemné nebo vypnuté", en: "Animations: full, subtle or off" },
        { cs: "Ovládání klávesnicí, kontrast WCAG AA", en: "Keyboard control, WCAG AA contrast" },
      ],
    },
    {
      icon: "languages",
      title: { cs: "Čeština a angličtina", en: "Czech and English" },
      milestones: ["M0"],
      items: [
        {
          cs: "Jazyk podle profilu, ne podle URL",
          en: "Language follows your profile, not the URL",
        },
        {
          cs: "Formáty dat, čísel a délek podle jazyka",
          en: "Dates, numbers and durations formatted for your language",
        },
      ],
    },
  ],

  /* ---- Interactive mini board in "Vyzkoušejte si to" --------------------- */
  // tone: "blue" | "pink" | "amber" | "violet" | "green"; prio: "urgent" | "high" | "normal"
  demo: {
    columns: [
      { id: "todo", title: "To Do" },
      { id: "doing", title: "In Progress" },
      { id: "test", title: "Test" },
      { id: "done", title: "Done" },
    ],
    cards: [
      {
        key: "KYT-14",
        title: { cs: "Úprava košíku na mobilu", en: "Mobile cart redesign" },
        col: "todo",
        tag: "UX",
        tone: "blue",
        prio: "urgent",
      },
      {
        key: "KYT-17",
        title: { cs: "Wiki: postup nasazení", en: "Wiki: deployment guide" },
        col: "todo",
        tag: { cs: "Dokumentace", en: "Docs" },
        tone: "violet",
        prio: "normal",
      },
      {
        key: "KYT-12",
        title: { cs: "Napojení na Fakturoid", en: "Fakturoid integration" },
        col: "doing",
        tag: { cs: "Integrace", en: "Integration" },
        tone: "amber",
        prio: "high",
      },
      {
        key: "KYT-15",
        title: { cs: "Oprava DPH v exportu", en: "Fix VAT in the export" },
        col: "doing",
        tag: "Bug",
        tone: "pink",
        prio: "urgent",
      },
      {
        key: "KYT-11",
        title: { cs: "Přesměrování starých URL", en: "Redirect old URLs" },
        col: "test",
        tag: "SEO",
        tone: "blue",
        prio: "normal",
      },
      {
        key: "KYT-9",
        title: { cs: "Import produktů z Excelu", en: "Import products from Excel" },
        col: "done",
        tag: "Data",
        tone: "green",
        prio: "normal",
      },
    ],
  },

  /* ---- Sticky showcase ("Jak to vypadá") --------------------------------- */
  // fileDark (optional) is used in dark mode. preview: true = "Návrh rozhraní".
  // Images are the same for both languages (they show the Czech UI).
  showcase: [
    {
      file: "board-light.png",
      fileDark: "board-dark.png",
      title: { cs: "Board, který baví", en: "A Board that's fun to use" },
      text: {
        cs: "Sloupce s gradientem podle stavu, karty s prioritou, štítky a časem. Přetáhnete je myší, prstem i klávesnicí.",
        en: "Columns with a gradient for each status, cards with priority, labels and time. Drag them with a mouse, a finger or the keyboard.",
      },
    },
    {
      file: "task-detail.png",
      title: { cs: "Všechno o tasku na jednom místě", en: "Everything about a task in one place" },
      text: {
        cs: "Otevře se přímo nad boardem: popis, checklist, štítky, přílohy a komentáře interní i pro klienta. Ukládá se samo.",
        en: "Opens right on top of the Board: description, checklist, labels, attachments, and both internal and client comments. It saves itself.",
      },
    },
    {
      file: "app-overview-light.png",
      fileDark: "app-overview-dark.png",
      title: { cs: "Přehled workspace", en: "Workspace overview" },
      text: {
        cs: "Tým, projekty a role na první pohled. Každý workspace má svá data oddělená.",
        en: "Your team, projects and roles at a glance. Every Workspace keeps its data separate.",
      },
    },
    {
      file: "app-settings.png",
      title: { cs: "Nastavení pro celý tým", en: "Settings for the whole team" },
      text: {
        cs: "Zaokrouhlení času, pozvánky odkazem nebo e-mailem a správa členů a hostů.",
        en: "Time rounding, invitations by link or e-mail, and managing members and guests.",
      },
    },
    {
      file: "app-appearance.png",
      title: { cs: "Vzhled podle vás", en: "Make it look your way" },
      text: {
        cs: "Světlý nebo tmavý režim, pět barevných schémat a tři úrovně animací. Platí na všech zařízeních.",
        en: "Light or dark mode, five color schemes and three animation levels – synced across all your devices.",
      },
    },
  ],

  /* ---- Screenshots gallery (files in site/screenshots/) ------------------ */
  // `preview: true` adds the label "Návrh rozhraní" – remove it once the file
  // is replaced by a screenshot of the real app.
  // Files named app-*.png are generated from the running app by `pnpm site:screenshots`.
  // The same images are used for both languages; only the captions are translated.
  screenshots: [
    {
      file: "app-overview-light.png",
      caption: { cs: "Přehled workspace s týmem", en: "Workspace overview with the team" },
    },
    {
      file: "app-overview-dark.png",
      caption: { cs: "Přehled workspace, tmavý režim", en: "Workspace overview, dark mode" },
    },
    {
      file: "app-settings.png",
      caption: {
        cs: "Nastavení workspace: zaokrouhlení času, pozvánky, členové",
        en: "Workspace settings: time rounding, invitations, members",
      },
    },
    {
      file: "app-appearance.png",
      caption: {
        cs: "Profil a vzhled: režim, barevné schéma, animace",
        en: "Profile and appearance: mode, color scheme, animations",
      },
    },
    {
      file: "app-login.png",
      caption: {
        cs: "Přihlášení bez hesla přes odkaz v e-mailu",
        en: "Passwordless sign-in with an e-mail link",
      },
    },
    {
      file: "app-mobile.png",
      caption: { cs: "Mobilní zobrazení se spodní lištou", en: "Mobile view with the bottom bar" },
    },
    {
      file: "board-light.png",
      caption: { cs: "Board projektu, světlý režim", en: "Project Board, light mode" },
    },
    {
      file: "board-dark.png",
      caption: { cs: "Board projektu, tmavý režim", en: "Project Board, dark mode" },
    },
    {
      file: "task-detail.png",
      caption: {
        cs: "Detail tasku nad boardem: komentáře, přílohy, štítky",
        en: "Task detail over the Board: comments, attachments, labels",
      },
    },
    {
      file: "notifications.png",
      caption: {
        cs: "Zvoneček: zmínky, komentáře a přidělení na jednom místě",
        en: "The bell: mentions, comments and assignments in one place",
      },
    },
    {
      file: "timesheet.png",
      caption: {
        cs: "Můj timesheet: týden tasků a dnů se součty",
        en: "My timesheet: a week of tasks and days with totals",
      },
    },
    {
      file: "reports.png",
      caption: {
        cs: "Reporty: přesný a zaokrouhlený čas, export CSV",
        en: "Reports: exact and rounded time, CSV export",
      },
    },
    {
      file: "wiki.png",
      caption: {
        cs: "Wiki klienta: strom stránek, editor a historie verzí",
        en: "Client wiki: page tree, editor and version history",
      },
    },
    {
      file: "scheme-contrast.png",
      caption: { cs: "Schéma vysoký kontrast", en: "High-contrast scheme" },
    },
    {
      file: "mobile-board.png",
      caption: {
        cs: "Board na mobilu se spodní lištou",
        en: "Board on mobile with the bottom bar",
      },
    },
  ],

  /* ---- Page texts (index.html data-i18n keys + texts used by app.js) ----- */
  // {placeholders} are filled in by app.js. Values may contain simple HTML.
  ui: {
    // <head>
    "meta.title": "Taskhub",
    "meta.description": {
      cs: "Taskhub – tasky, wiki a výkazy času pro tým, který pracuje pro zákazníky. Zákazníci se připojí jako hosté.",
      en: "Taskhub – tasks, wiki and time tracking for teams that work for clients. Clients join as guests.",
    },

    // Header
    skip: { cs: "Přeskočit na obsah", en: "Skip to content" },
    "brand.aria": { cs: "Taskhub – na začátek", en: "Taskhub – back to top" },
    "nav.aria": { cs: "Sekce stránky", en: "Page sections" },
    "nav.demo": { cs: "Ukázka", en: "Demo" },
    "nav.features": { cs: "Co umí", en: "Features" },
    "nav.screens": { cs: "Screenshoty", en: "Screenshots" },
    "nav.roadmap": { cs: "Roadmapa", en: "Roadmap" },
    "nav.news": { cs: "Novinky", en: "What's new" },
    "nav.install": { cs: "Instalace", en: "Install" },
    "lang.aria": { cs: "Jazyk webu", en: "Site language" },
    "theme.toDark": { cs: "Přepnout na tmavý režim", en: "Switch to dark mode" },
    "theme.toLight": { cs: "Přepnout na světlý režim", en: "Switch to light mode" },

    // Hero
    "hero.pillTag": { cs: "Novinka", en: "New" },
    "hero.pillText": { cs: "Co je nového", en: "What's new" },
    "hero.srTitle": {
      cs: "Taskhub: jedno místo pro tasky, wiki, výkazy času a klienty",
      en: "Taskhub: one place for tasks, wikis, timesheets and clients",
    },
    "hero.line1": { cs: "Jedno místo", en: "One place" },
    "hero.for": { cs: "pro", en: "for" },
    "hero.words": { cs: "tasky|wiki|výkazy času|klienty", en: "tasks|wikis|timesheets|clients" },
    "hero.word0": { cs: "tasky", en: "tasks" },
    "hero.lead": {
      cs: "<strong>Taskhub</strong> je pro tým, který pracuje pro zákazníky. Kanban jako v Jiře, dokumentace jako v Confluence, výkazy jako v Tempu. Zákazník se připojí jako host a vidí jen to, co mu ukážete.",
      en: "<strong>Taskhub</strong> is built for teams that work for clients. Kanban like Jira, docs like Confluence, time tracking like Tempo. Your client joins as a guest and sees only what you choose to show.",
    },
    "hero.ctaInstall": { cs: "Jak to rozjet", en: "Get it running" },
    "hero.ctaDemo": { cs: "Vyzkoušet board", en: "Try the Board" },
    "hero.fact1": { cs: "Vlastní instalace", en: "Self-hosted" },
    "hero.fact2": { cs: "Čeština i angličtina", en: "Czech and English" },
    "hero.fact3": { cs: "Data týmů oddělená", en: "Team data kept separate" },
    "hero.altLight": {
      cs: "Board projektu se sloupci To Do, In Progress, Test a Done a barevnými kartami tasků",
      en: "Project Board with To Do, In Progress, Test and Done columns and colorful task cards",
    },
    "hero.altDark": {
      cs: "Board projektu se sloupci To Do, In Progress, Test a Done, tmavý režim",
      en: "Project Board with To Do, In Progress, Test and Done columns, dark mode",
    },
    "hero.figcaption": {
      cs: "Board projektu v aplikaci Taskhub",
      en: "A project Board in the Taskhub app",
    },
    "hero.floatCard": { cs: "Napojení na Fakturoid", en: "Fakturoid integration" },
    "hero.floatTimer": { cs: "Timer běží", en: "Timer running" },
    "hero.floatGuest": { cs: "Klient jako host", en: "Client as a guest" },
    "hero.floatGuestNote": { cs: "Vidí jen veřejné tasky", en: "Sees public tasks only" },
    "hero.stageNote": { cs: "Skutečná obrazovka z aplikace", en: "A real screen from the app" },
    "hero.status": { cs: "Ve vývoji", en: "In development" },
    "hero.statusActive": { cs: "Ve vývoji · {id} {title}", en: "In development · {id} {title}" },
    "hero.statusDone": { cs: "Hotovo", en: "Done" },

    // Marquee + numbers
    "marquee.aria": { cs: "Co v Taskhubu najdete", en: "What you'll find in Taskhub" },
    "numbers.aria": { cs: "Taskhub v číslech", en: "Taskhub in numbers" },
    "stats.milestones": { cs: "milníků hotovo", en: "milestones done" },

    // Demo board
    "demo.eyebrow": { cs: "Vyzkoušejte si to", en: "Try it yourself" },
    "demo.title": {
      cs: 'Přetáhněte kartu do <span class="grad">Done</span>',
      en: 'Drag a card to <span class="grad">Done</span>',
    },
    "demo.lead": {
      cs: "Takhle se v Taskhubu pracuje s tasky. Kartu chytněte myší, na mobilu podržte prstem, nebo použijte šipku na kartě.",
      en: "This is how tasks work in Taskhub. Grab a card with your mouse, press and hold on mobile, or use the arrow on the card.",
    },
    "demo.boardAria": { cs: "Ukázkový board", en: "Demo Board" },
    "demo.reset": { cs: "Začít znovu", en: "Start over" },
    "demo.resetAnnounce": { cs: "Board je zpět na začátku", en: "The Board is back to the start" },
    "demo.prioUrgent": { cs: "Urgentní priorita", en: "Urgent priority" },
    "demo.prioHigh": { cs: "Vysoká priorita", en: "High priority" },
    "demo.prioNormal": { cs: "Běžná priorita", en: "Normal priority" },
    "demo.cardAria": {
      cs: "{key} {title}, sloupec {col}. Šipkami doleva a doprava přesunete.",
      en: "{key} {title}, column {col}. Use the left and right arrow keys to move it.",
    },
    "demo.moveAria": { cs: "Posunout {key} do {col}", en: "Move {key} to {col}" },
    "demo.allDone": {
      cs: "Všechno hotovo. Takhle vypadá dobrý den.",
      en: "All done. That's what a good day looks like.",
    },
    "demo.score": { cs: "V Done: {n} z {all}", en: "In Done: {n} of {all}" },
    "demo.doneAnnounce": { cs: "{key} je hotovo.", en: "{key} is done." },
    "demo.allDoneAnnounce": { cs: "Všechny tasky jsou hotové.", en: "All tasks are done." },
    "demo.movedAnnounce": { cs: "{key} přesunuto do {col}", en: "{key} moved to {col}" },

    // Features
    "features.eyebrow": { cs: "Co umí", en: "Features" },
    "features.title": {
      cs: 'Všechno, co tým <span class="grad">potřebuje</span>',
      en: 'Everything your team <span class="grad">needs</span>',
    },
    "features.lead": {
      cs: "Funkce podle modulů. Stav odpovídá roadmapě níže.",
      en: "Features by module. The status matches the roadmap below.",
    },
    milestone: { cs: "Milník", en: "Milestone" },
    milestones: { cs: "Milník", en: "Milestones" },
    "status.done": { cs: "Hotovo", en: "Done" },
    "status.in-progress": { cs: "Ve vývoji", en: "In development" },
    "status.planned": { cs: "Plánováno", en: "Planned" },

    // Showcase + gallery
    "screens.eyebrow": { cs: "Jak to vypadá", en: "See it in action" },
    "screens.title": {
      cs: 'Projděte si <span class="grad">rozhraní</span>',
      en: 'Take a tour of the <span class="grad">interface</span>',
    },
    "screens.lead": {
      cs: "Skutečné screenshoty z aplikace, u obrazovek z prototypu je to uvedeno.",
      en: "Real screenshots from the app (in Czech); screens from the prototype are marked as such.",
    },
    "screens.gallery": { cs: "Všechny screenshoty", en: "All screenshots" },
    "screens.preview": { cs: "Návrh rozhraní", en: "UI concept" },
    "screens.previewParen": { cs: " (návrh rozhraní)", en: " (UI concept)" },
    "screens.zoom": { cs: "Zvětšit: {caption}", en: "Enlarge: {caption}" },
    "lb.prev": { cs: "Předchozí obrázek", en: "Previous image" },
    "lb.next": { cs: "Další obrázek", en: "Next image" },
    "lb.close": { cs: "Zavřít", en: "Close" },

    // Roadmap
    "roadmap.eyebrow": { cs: "Roadmapa", en: "Roadmap" },
    "roadmap.title": {
      cs: 'Kde je <span class="grad">vývoj</span>',
      en: 'Where <span class="grad">development</span> stands',
    },
    "roadmap.lead": {
      cs: "Každý milník končí testy a commitem.",
      en: "Every milestone ends with tests and a commit.",
    },
    "roadmap.asideAria": { cs: "Souhrn roadmapy", en: "Roadmap summary" },
    "roadmap.now": { cs: "Právě teď", en: "Right now" },
    "roadmap.next": { cs: "Na řadě", en: "Up next" },
    "roadmap.working": { cs: "Právě na tom pracujeme", en: "We're working on it right now" },
    "roadmap.summary": {
      cs: "Hotovo {done} z {total} milníků",
      en: "{done} of {total} milestones done",
    },
    "roadmap.allDone": { cs: "Hotovo", en: "All done" },

    // News
    "news.eyebrow": { cs: "Novinky", en: "What's new" },
    "news.title": {
      cs: 'Co je <span class="grad">nového</span>',
      en: 'What\'s <span class="grad">new</span>',
    },
    "news.lead": {
      cs: 'Co přibylo s každou verzí, nejnovější nahoře. Celý přehled je v souboru <a id="changelog-link" href="https://github.com/mhudakcz/taskhub/blob/main/CHANGELOG.md"><code>CHANGELOG.md</code></a> v repozitáři.',
      en: 'What each release brought, newest first. The full history is in <a id="changelog-link" href="https://github.com/mhudakcz/taskhub/blob/main/CHANGELOG.md"><code>CHANGELOG.md</code></a> in the repository (in Czech).',
    },
    "news.type": { cs: "Typ", en: "Type" },
    "kind.feature": { cs: "Novinka", en: "New" },
    "kind.improvement": { cs: "Vylepšení", en: "Improvement" },
    "kind.fix": { cs: "Oprava", en: "Fix" },
    "kind.design": { cs: "Design", en: "Design" },
    "kind.setup": { cs: "Základ", en: "Foundations" },
    months: {
      cs: ["led", "úno", "bře", "dub", "kvě", "čvn", "čvc", "srp", "zář", "říj", "lis", "pro"],
      en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    },

    // Install
    "install.eyebrow": { cs: "Instalace", en: "Install" },
    "install.title": {
      cs: 'Rozjeto za <span class="grad">deset minut</span>',
      en: 'Up and running in <span class="grad">ten minutes</span>',
    },
    "install.lead": {
      cs: "Lokální vývoj, přihlášení, e-maily i nasazení do produkce. Repozitář je zatím soukromý.",
      en: "Local development, sign-in, e-mails and production deployment. The repository is private for now.",
    },
    "install.tabsAria": { cs: "Návody", en: "Guides" },
    "install.tabLocal": { cs: "Lokální vývoj", en: "Local development" },
    "install.tabGoogle": { cs: "Google přihlášení", en: "Google sign-in" },
    "install.tabMail": { cs: "E-maily", en: "E-mails" },
    "install.tabDeploy": { cs: "Produkce", en: "Production" },
    "install.tabWin": { cs: "Tipy pro Windows", en: "Windows tips" },
    "install.s1h": { cs: "Připravte nástroje", en: "Get the tools ready" },
    "install.s1p": {
      cs: "Node 24, pnpm, Git a Docker Desktop (lokální Supabase běží v Dockeru). Docker Desktop musí běžet.",
      en: "Node 24, pnpm, Git and Docker Desktop (local Supabase runs in Docker). Docker Desktop must be running.",
    },
    "install.s2h": {
      cs: "Naklonujte repozitář a nainstalujte závislosti",
      en: "Clone the repository and install dependencies",
    },
    "install.s3h": { cs: "Spusťte lokální Supabase", en: "Start local Supabase" },
    "install.s3p": {
      cs: "Na konci výpisu jsou URL a klíče, budete je potřebovat v dalším kroku.",
      en: "The output ends with URLs and keys – you'll need them in the next step.",
    },
    "install.s4h": { cs: "Vytvořte <code>.env.local</code>", en: "Create <code>.env.local</code>" },
    "install.s4p": {
      cs: "Zkopírujte šablonu a doplňte <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> a <code>SUPABASE_SERVICE_ROLE_KEY</code> z výpisu <code>supabase status</code>. Pro přílohy vyplňte i <code>STORAGE_S3_*</code> a <code>R2_*</code> podle komentářů v šabloně (lokálně se místo R2 použije úložiště Supabase). Soubor se necommituje.",
      en: "Copy the template and fill in <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code> from the <code>supabase status</code> output. For attachments, also fill in <code>STORAGE_S3_*</code> and <code>R2_*</code> as the template comments describe (locally, Supabase Storage stands in for R2). The file is never committed.",
    },
    "install.s5h": { cs: "Vygenerujte typy databáze", en: "Generate database types" },
    "install.s6h": { cs: "Spusťte aplikaci", en: "Start the app" },
    "install.urlApp": { cs: "Aplikace", en: "App" },
    "install.urlMailpit": { cs: "Mailpit (přihlašovací e-maily)", en: "Mailpit (sign-in e-mails)" },
    "install.s6p": {
      cs: "Lokální databáze obsahuje demo workspace <code>magexo</code>. Přihlaste se e-mailem <code>michal@taskhub.test</code> (vlastník), <code>jana@taskhub.test</code> (admin), <code>petr@taskhub.test</code> (člen) nebo <code>klient@taskhub.test</code> (host). Odkaz pro přihlášení najdete v Mailpitu.",
      en: "The local database includes a demo Workspace <code>magexo</code>. Sign in as <code>michal@taskhub.test</code> (owner), <code>jana@taskhub.test</code> (admin), <code>petr@taskhub.test</code> (member) or <code>klient@taskhub.test</code> (client guest). You'll find the sign-in link in Mailpit.",
    },
    "install.s7h": { cs: "Spusťte testy", en: "Run the tests" },
    "install.s7code": {
      cs: "pnpm test        # unit testy\npnpm db:test     # RLS testy databáze\npnpm test:e2e    # end-to-end testy v prohlížeči",
      en: "pnpm test        # unit tests\npnpm db:test     # database RLS tests\npnpm test:e2e    # end-to-end browser tests",
    },
    "install.googleH": { cs: "Google přihlášení", en: "Google sign-in" },
    "install.google1": {
      cs: "V Google Cloud Console založte OAuth client typu „Web application“.",
      en: "In Google Cloud Console, create an OAuth client of type “Web application”.",
    },
    "install.google2": {
      cs: "Jako authorized redirect URI zadejte pro lokální vývoj <code>http://127.0.0.1:54321/auth/v1/callback</code>. V produkci je to stejná cesta na URL vašeho Supabase projektu.",
      en: "For local development, set the authorized redirect URI to <code>http://127.0.0.1:54321/auth/v1/callback</code>. In production it's the same path on your Supabase project URL.",
    },
    "install.google3": {
      cs: "Client ID a secret vložte do <code>.env.local</code> a restartujte Supabase.",
      en: "Put the client ID and secret into <code>.env.local</code> and restart Supabase.",
    },
    "install.mailH": { cs: "E-maily", en: "E-mails" },
    "install.mailP": {
      cs: "Lokálně se přihlašovací e-maily zachytí v Mailpitu, nic se neodesílá. Pozvánky a notifikace posílá Resend: vytvořte API klíč v Resendu a doplňte ho.",
      en: "Locally, sign-in e-mails are caught by Mailpit and nothing is sent out. Invitations and notifications go through Resend: create an API key in Resend and add it here.",
    },
    "install.deployP": {
      cs: "Produkce: aplikace na Cloudflare Workers, data v Supabase Cloud, soubory v Cloudflare R2, e-maily přes Resend. Po nastavení nasazuje GitHub Actions každý push do <code>main</code>.",
      en: "Production: the app on Cloudflare Workers, data in Supabase Cloud, files in Cloudflare R2, e-mails via Resend. Once set up, GitHub Actions deploys every push to <code>main</code>.",
    },
    "install.p1h": {
      cs: "Supabase Cloud: databáze a přihlášení",
      en: "Supabase Cloud: database and sign-in",
    },
    "install.p1p": {
      cs: "Založte projekt v regionu Frankfurt a nahrajte migrace (demo data se do produkce nenahrávají). V Authentication nastavte Site URL a Redirect URLs na vaši doménu a vlastní SMTP přes Resend.",
      en: "Create a project in the Frankfurt region and push the migrations (demo data never goes to production). In Authentication, set the Site URL and Redirect URLs to your domain and a custom SMTP via Resend.",
    },
    "install.p2h": {
      cs: "Cloudflare R2: přílohy a obrázky",
      en: "Cloudflare R2: attachments and images",
    },
    "install.p2p": {
      cs: "Vytvořte soukromý bucket <code>taskhub</code>, API token s oprávněním Object Read &amp; Write a CORS pravidlo, aby prohlížeč mohl nahrávat přímo do R2.",
      en: "Create a private bucket <code>taskhub</code>, an API token with Object Read &amp; Write and a CORS rule so the browser can upload straight to R2.",
    },
    "install.p3h": { cs: "Resend: e-maily", en: "Resend: e-mails" },
    "install.p3p": {
      cs: "Přidejte doménu, do DNS doplňte záznamy SPF a DKIM a vytvořte API klíč. Stejný klíč slouží jako SMTP heslo pro přihlašovací e-maily Supabase.",
      en: "Add your domain, put the SPF and DKIM records into DNS and create an API key. The same key is the SMTP password for Supabase sign-in e-mails.",
    },
    "install.p4h": { cs: "Cloudflare Workers: tajné hodnoty", en: "Cloudflare Workers: secrets" },
    "install.p4p": {
      cs: "Serverové klíče patří jen na Worker, nikdy do repozitáře. Po prvním nasazení přidejte vlastní doménu (Settings → Domains &amp; Routes), HTTPS se nastaví samo.",
      en: "Server keys live only on the Worker, never in the repository. After the first deploy, add your custom domain (Settings → Domains &amp; Routes); HTTPS is set up automatically.",
    },
    "install.p5h": {
      cs: "GitHub Actions: automatické nasazení",
      en: "GitHub Actions: automatic deploys",
    },
    "install.p5p": {
      cs: "V Settings → Secrets and variables → Actions doplňte hodnoty níže. Každý push do <code>main</code> pak projde testy, nahraje migrace a nasadí aplikaci i tento web. Když testy selžou, nic se nenasadí.",
      en: "Add the values below in Settings → Secrets and variables → Actions. Every push to <code>main</code> then runs the tests, applies migrations and deploys the app and this website. If tests fail, nothing is deployed.",
    },
    "install.p6h": { cs: "Kontrola po nasazení", en: "Check after deploying" },
    "install.p6p": {
      cs: "Přihlaste se e-mailem, založte workspace, nahrajte přílohu (ověří R2 a CORS) a zapište čas. Živé logy a návrat na předchozí verzi:",
      en: "Sign in by e-mail, create a Workspace, upload an attachment (checks R2 and CORS) and log some time. Live logs and rolling back to the previous version:",
    },
    "install.p7h": { cs: "Provoz: dostupnost a zálohy", en: "Operations: uptime and backups" },
    "install.p7p": {
      cs: "Supabase Free uspí projekt po 7 dnech bez aktivity. Cron Workeru proto každé 2 minuty rozesílá notifikace a zároveň „pingne“ databázi. Doporučený monitor (např. UptimeRobot) hlídá <code>/api/health</code> a workflow <code>backup.yml</code> ukládá každý týden zálohu do R2.",
      en: "Supabase Free pauses a project after 7 days without activity. The Worker cron therefore sends notifications every 2 minutes and pings the database at the same time. A monitor such as UptimeRobot watches <code>/api/health</code>, and the <code>backup.yml</code> workflow stores a weekly backup in R2.",
    },
    "install.altH": { cs: "Alternativa: vlastní server", en: "Alternative: your own server" },
    "install.altP": {
      cs: "Taskhub nepoužívá nic specifického pro jednoho hostingového poskytovatele, takže běží i jako běžná Node.js aplikace na VPS nebo firemním serveru. Databáze a soubory zůstávají v Supabase a R2 (nebo jiném S3), HTTPS zajistí reverzní proxy, třeba Caddy.",
      en: "Taskhub doesn't depend on any single hosting provider, so it also runs as a regular Node.js app on a VPS or your company server. Data and files stay in Supabase and R2 (or any S3), and a reverse proxy such as Caddy handles HTTPS.",
    },
    "install.docsP": {
      cs: "Podrobný návod krok za krokem je v repozitáři v souboru <code>docs/deployment.md</code>.",
      en: "The detailed step-by-step guide is in the repository: <code>docs/deployment.md</code>.",
    },
    "install.winH": { cs: "Tipy pro Windows", en: "Windows tips" },
    "install.win1": {
      cs: "Pokud cesta k profilu obsahuje diakritiku, <code>next-intl</code> (přes <code>@swc/core</code>) neumí načíst nativní binárku. Nasměrujte cache na krátkou cestu bez diakritiky; složka musí existovat.",
      en: "If your user profile path contains diacritics, <code>next-intl</code> (via <code>@swc/core</code>) can't load its native binary. Point the cache to a short path without diacritics; the folder must exist.",
    },
    "install.win2": {
      cs: "Build přes OpenNext (<code>pnpm cf:build</code>, <code>cf:preview</code>, <code>cf:deploy</code>) na Windows nativně nefunguje. Spouští se v CI nebo ve WSL. Podrobnosti jsou v README repozitáře.",
      en: "The OpenNext build (<code>pnpm cf:build</code>, <code>cf:preview</code>, <code>cf:deploy</code>) doesn't work natively on Windows. Run it in CI or in WSL. Details are in the repository README.",
    },
    "code.copy": { cs: "Kopírovat", en: "Copy" },
    "code.copyAria": { cs: "Kopírovat kód", en: "Copy code" },
    "code.copied": { cs: "Zkopírováno", en: "Copied" },
    "code.copiedAnnounce": { cs: "Zkopírováno do schránky", en: "Copied to clipboard" },
    "code.copyFailed": {
      cs: "Kopírování se nepovedlo, označte text ručně",
      en: "Copying failed, please select the text manually",
    },

    // Tech stack
    "tech.eyebrow": { cs: "Technologie", en: "Tech stack" },
    "tech.title": {
      cs: 'Postaveno na <span class="grad">ověřených</span> základech',
      en: 'Built on <span class="grad">proven</span> foundations',
    },
    "tech.app": { cs: "Aplikace", en: "App" },
    "tech.data": { cs: "Data a přihlášení", en: "Data and auth" },
    "tech.files": { cs: "Soubory", en: "Files" },
    "tech.filesDd": { cs: "Cloudflare R2, presigned URL", en: "Cloudflare R2, presigned URLs" },
    "tech.wiki": { cs: "Wiki editor", en: "Wiki editor" },
    "tech.langs": { cs: "Jazyky", en: "Languages" },
    "tech.forms": { cs: "Formuláře", en: "Forms" },
    "tech.mail": { cs: "E-maily", en: "E-mails" },
    "tech.hostingDd": {
      cs: "Cloudflare Workers přes OpenNext",
      en: "Cloudflare Workers via OpenNext",
    },
    "tech.tests": { cs: "Testy a CI", en: "Tests and CI" },

    // CTA + footer
    "cta.title": { cs: "Taskhub roste každý týden", en: "Taskhub grows every week" },
    "cta.lead": {
      cs: "Sledujte novinky, nebo si ho rovnou rozjeďte u sebe.",
      en: "Follow what's new – or get it running on your own setup right away.",
    },
    "cta.install": { cs: "Jak to rozjet", en: "Get it running" },
    "cta.news": { cs: "Co je nového", en: "What's new" },
    "footer.updated": { cs: "Taskhub · aktualizováno", en: "Taskhub · updated" },
    "footer.repo": { cs: "Repozitář na GitHubu", en: "Repository on GitHub" },
  },
};
