/* about.html — francais. Cle = texte anglais exact du HTML, espaces normalises.
   Le vocabulaire reprend celui de l'ancienne page fr/apropos.html, valide en
   production : Constat, Benefices, Methode, Offres, Realisations.
   Une chaine identique dans les deux langues (LinkedIn, noms propres, adresses)
   n'a pas d'entree : l'absence de cle laisse l'anglais en place.

   Les trois langues d'une page portent EXACTEMENT le meme jeu de cles, meme
   quand le francais ne change rien au mot ("Vision", "Navigation"). Le moteur
   pose son filtre de collecte sur le premier dictionnaire charge : une cle
   absente d'ici ne serait jamais collectee, donc jamais traduite en espagnol ni
   en allemand par la suite. "(C) i18n-controle.js" verifie cette egalite. */
window.OIA_I18N = window.OIA_I18N || {};
window.OIA_I18N.fr = {
    html: {
        "↗ Meet the founders": "↗ Rencontrer les fondateurs",
  "SEO guides": "Guides SEO",
  "GEO guides": "Guides GEO",
        "About | OptimizIA.xyz": "À propos | OptimizIA.xyz",

        "Why now": "Constat",
        "Benefits": "Bénéfices",
        "Method": "Méthode",
        "Services": "Offres",
        "Case studies": "Réalisations",
        "About": "À propos",
        "FAQ": "FAQ",
        "Free audit": "Audit gratuit",

        "Who we are": "Qui sommes-nous",
        "Vision": "Vision",
        "Navigation": "Navigation",
        "Contact": "Contact",
        "OptimizIA.xyz, <span>AI at work in the field</span>": "OptimizIA.xyz, <span>l'IA au service du terrain</span>",
        "OptimizIA.xyz is a network of experts founded by practitioners, not theorists, who believe <strong>AI only has value when it produces measurable results</strong> inside your organisation, with no unnecessary disruption and no jargon. We step in where it actually hurts: the processes that are slowing your growth.": "OptimizIA.xyz est un réseau d'experts fondé par des praticiens, pas des théoriciens, qui croient que <strong>l'IA n'a de valeur que si elle produit des résultats mesurables</strong> dans votre organisation, sans disruption inutile ni jargon. Nous intervenons là où ça coince vraiment : les processus qui freinent votre croissance.",

        "Make AI <span style=\"color:var(--orange);\">accessible and sustainable</span> for SMEs": "Rendre l'IA <span style=\"color:var(--orange);\">accessible et durable</span> pour les TPE/PME",
        "We believe every SME leader should have access to the same performance levers as large groups, <strong>without the cost, risk and complexity that usually come with them</strong>. Our mission: support transformation through small, concrete steps, from diagnosis to industrial deployment, with a relentless focus on ROI.": "Nous pensons que chaque dirigeant de TPE/PME devrait pouvoir accéder aux mêmes leviers de performance que les grands groupes, <strong>sans les coûts, les risques et la complexité associés</strong>. Notre mission : accompagner la transformation par petits pas concrets, du diagnostic au déploiement industriel, avec une obsession constante pour le ROI.",

        "The team": "L'équipe",
        "Experts, not consultants": "Des experts, pas des consultants",
        "Co-founder &amp; Senior Consultant": "Co-fondateur &amp; Senior Consultant",
        "25 years on the ground in industrial and digital transformation at Volvo Group, Airbus Atlantic, Solvay. Expert in Knowledge Management, agentic AI and Lean 4.0 applied to SMEs.": "25 ans de terrain en transformation industrielle et digitale chez Volvo Group, Airbus Atlantic, Solvay. Expert Knowledge Management, IA agentique et lean 4.0 appliqué aux TPE/PME.",
        "Co-founder &amp; AI Engineer": "Co-fondateur &amp; Ingénieur IA",
        "Engineering student in Applied Mathematics at Polytech Nice Sophia, specialised in automation, AI development and tailor-made integrations. Architect of OptimizIA.xyz's technical solutions. Holder of France's National Student-Entrepreneur Status (SNEE), the PEPITE programme backed by the French Ministry of Higher Education.": "Étudiant-ingénieur en Maths Appliquées à Polytech Nice Sophia, spécialisé en automatisation, développement IA et intégrations sur mesure. Architecte des solutions techniques d'OptimizIA.xyz. Titulaire du Statut National Étudiant-Entrepreneur (SNEE), dispositif PEPITE du ministère de l'Enseignement supérieur.",

        "Let's talk about your project": "Parlons de votre projet",
        "20 minutes, no pitch, just a conversation about what AI can change for you.": "20 minutes, pas de pitch, juste une conversation sur ce que l'IA peut changer pour vous.",
        "Start the conversation": "Démarrer la conversation",

        "A network of AI, automation and Knowledge Management experts. We help SME leaders transform their processes to gain productivity and peace of mind.": "Réseau d'experts en IA, automatisation et Knowledge Management. Nous aidons les dirigeants de TPE/PME à transformer leurs processus pour gagner en productivité et en sérénité.",

        "Resources": "Ressources",
        "Tools": "Nos outils",
        "SEO &amp; GEO audit tool (SEOPlus!)": "Audit SEO et visibilité IA (SEOPlus!)",
        "Béziers · Occitanie, France<br>&amp; International": "Béziers · Occitanie, France<br>&amp; International",

        "© 2026 OptimizIA.xyz · All rights reserved · <a href=\"legal-notice.html\" class=\"legal-link\">Legal Notice</a> · <span style=\"color: var(--text-muted);\">V6.1</span>": "© 2026 OptimizIA.xyz · Tous droits réservés · <a href=\"legal-notice.html\" class=\"legal-link\">Mentions légales</a> · <span style=\"color: var(--text-muted);\">V6.1</span>",
        "OptimizIA.xyz is based in Béziers, in the south of France, and works with SMEs across Occitanie and internationally. French-speaking businesses nearby can start from our local page: <a href=\"agence-ia-beziers.html\">Agence IA à Béziers</a>.": "OptimizIA.xyz est basée à Béziers, dans le sud de la France, et accompagne des PME en Occitanie comme à l'international. Les entreprises proches peuvent partir de notre page locale : <a href=\"agence-ia-beziers.html\">Agence IA à Béziers</a>.",
    },
    attr: {}
};
