/* Inscription a The Automation Brief, la newsletter hebdomadaire de l'agence.
   Le bloc est injecte en tete du pied de page de toutes les pages : aucune
   balise a poser dans le HTML, un seul fichier a faire evoluer.

   Comme le bandeau de consentement (oia-clarity.js), ce composant construit
   son DOM en JavaScript : ses textes n'existent pas dans le HTML et echappent
   au dictionnaire de oia-i18n.js. Il porte donc ses quatre langues lui-meme,
   se repeint sur l'evenement oia:lang, et [data-no-i18n] le tient hors de la
   collecte du moteur.

   La newsletter n'existe qu'en anglais : les trois autres langues le disent
   dans le texte, pour que personne ne s'inscrive en attendant du francais.

   Content-Type text/plain : c'est ce qui garde la requete CORS simple, le
   webhook n8n ne repond pas au preflight OPTIONS d'un application/json. */
(function () {
    'use strict';

    var self = document.currentScript || document.querySelector('script[src*="oia-newsletter"]');
    var ENDPOINT = (self && self.getAttribute('data-endpoint')) || 'https://n8n.romainben.cloud/webhook/optimizia-newsletter';
    var LEGAL = '/legal-notice.html';
    var STORE = 'oia_newsletter';

    var TEXTES = {
        en: {
            surtitre: 'Newsletter',
            corps: 'AI and automation news, decoded for small businesses. One email every Thursday.',
            label: 'Email address', exemple: 'you@company.com',
            bouton: 'Subscribe', envoi: 'Subscribing…',
            ok: 'You are in. The next issue arrives on Thursday.',
            deja: 'This address is already subscribed. See you on Thursday.',
            invalide: 'This email address does not look right.',
            erreur: 'The subscription did not go through. Please try again in a moment.',
            note: 'No spam. Unsubscribe in one click.', legal: 'Privacy'
        },
        fr: {
            surtitre: 'Newsletter',
            corps: 'L’actualité de l’IA et de l’automatisation, décodée pour les TPE et PME. Un e-mail chaque jeudi, en anglais.',
            label: 'Adresse e-mail', exemple: 'vous@entreprise.fr',
            bouton: 'S’inscrire', envoi: 'Inscription…',
            ok: 'C’est noté. Le prochain numéro arrive jeudi.',
            deja: 'Cette adresse est déjà inscrite. À jeudi.',
            invalide: 'Cette adresse e-mail semble incorrecte.',
            erreur: 'L’inscription n’a pas abouti. Réessayez dans un instant.',
            note: 'Pas de spam. Désinscription en un clic.', legal: 'Confidentialité'
        },
        es: {
            surtitre: 'Newsletter',
            corps: 'La actualidad de la IA y la automatización, explicada para pymes. Un correo cada jueves, en inglés.',
            label: 'Correo electrónico', exemple: 'usted@empresa.es',
            bouton: 'Suscribirme', envoi: 'Enviando…',
            ok: 'Listo. El próximo número llega el jueves.',
            deja: 'Esta dirección ya está suscrita. Hasta el jueves.',
            invalide: 'Esta dirección de correo no parece correcta.',
            erreur: 'La suscripción no se ha completado. Inténtelo de nuevo en un momento.',
            note: 'Sin spam. Baja con un clic.', legal: 'Privacidad'
        },
        de: {
            surtitre: 'Newsletter',
            corps: 'KI- und Automatisierungsnews, verständlich für kleine und mittlere Unternehmen. Eine E-Mail jeden Donnerstag, auf Englisch.',
            label: 'E-Mail-Adresse', exemple: 'sie@firma.de',
            bouton: 'Abonnieren', envoi: 'Wird gesendet…',
            ok: 'Geschafft. Die nächste Ausgabe kommt am Donnerstag.',
            deja: 'Diese Adresse ist bereits angemeldet. Bis Donnerstag.',
            invalide: 'Diese E-Mail-Adresse scheint nicht zu stimmen.',
            erreur: 'Die Anmeldung hat nicht geklappt. Bitte versuchen Sie es gleich noch einmal.',
            note: 'Kein Spam. Abmeldung mit einem Klick.', legal: 'Datenschutz'
        }
    };

    function TXT() {
        var l = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
        return TEXTES[l] || TEXTES.en;
    }

    /* Selecteurs prefixes par l'identifiant du bloc : les feuilles compilees
       par page stylent `footer p`, `footer a` et `footer button`, il faut les
       battre sans !important. */
    var CSS =
        '#newsletter{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:28px 56px;align-items:center;' +
        'padding:0 0 44px;margin:0 0 48px;border-bottom:1px solid rgba(248,250,252,.10);scroll-margin-top:96px}' +
        '#newsletter .oianl-sur{margin:0 0 10px;font-family:"JetBrains Mono",monospace;font-size:.7rem;font-weight:500;' +
        'letter-spacing:.12em;text-transform:uppercase;color:#FDBA74}' +
        '#newsletter .oianl-titre{margin:0 0 8px;font-size:1.5rem;font-weight:700;line-height:1.2;letter-spacing:-.02em;color:#F8FAFC}' +
        '#newsletter .oianl-corps{margin:0;max-width:46ch;font-size:.95rem;line-height:1.65;color:#94A3B8}' +
        '#newsletter form{display:flex;gap:10px;margin:0}' +
        '#newsletter .oianl-champ{flex:1 1 auto;min-width:0;height:48px;padding:0 18px;border-radius:999px;' +
        'border:1px solid rgba(248,250,252,.18);background:rgba(248,250,252,.04);color:#F8FAFC;font:inherit;font-size:.95rem;' +
        'transition:border-color 160ms ease,background-color 160ms ease}' +
        '#newsletter .oianl-champ::placeholder{color:#64748B}' +
        '#newsletter .oianl-champ:focus-visible{outline:2px solid #FDBA74;outline-offset:2px;border-color:#FDBA74;background:rgba(248,250,252,.07)}' +
        /* Bouton en filet : l'aplat orange reste reserve au vrai appel a l'action
           du site, la prise de rendez-vous. */
        '#newsletter .oianl-btn{flex:none;height:48px;padding:0 24px;border-radius:999px;border:1px solid #F97316;' +
        'background:transparent;color:#FDBA74;font:inherit;font-size:.95rem;font-weight:600;white-space:nowrap;cursor:pointer;' +
        'transition:transform 160ms cubic-bezier(.23,1,.32,1),background-color 160ms ease,color 160ms ease}' +
        '#newsletter .oianl-btn:active{transform:scale(.97)}' +
        '#newsletter .oianl-btn:focus-visible{outline:2px solid #FDBA74;outline-offset:3px}' +
        '#newsletter .oianl-btn[disabled]{opacity:.6;cursor:default;transform:none}' +
        '@media (hover:hover) and (pointer:fine){#newsletter .oianl-btn:not([disabled]):hover{background:#F97316;color:#fff}}' +
        '#newsletter .oianl-note{margin:12px 0 0;padding:0 4px;font-size:.8rem;line-height:1.5;color:#64748B}' +
        '#newsletter .oianl-note a{color:#94A3B8;text-decoration:underline;text-underline-offset:2px}' +
        '#newsletter .oianl-etat{margin:10px 0 0;padding:0 4px;min-height:1.5em;font-size:.88rem;line-height:1.5;color:#FCA5A5}' +
        '#newsletter .oianl-etat:empty{display:none}' +
        '#newsletter .oianl-merci{margin:0;display:flex;align-items:center;gap:12px;font-size:1rem;line-height:1.5;color:#F8FAFC;' +
        'transition:opacity 220ms cubic-bezier(.23,1,.32,1),transform 220ms cubic-bezier(.23,1,.32,1)}' +
        '#newsletter .oianl-merci[data-entree]{opacity:0;transform:translateY(6px)}' +
        '#newsletter .oianl-merci::before{content:"";flex:none;width:10px;height:10px;border-radius:50%;background:#34D399;box-shadow:0 0 0 4px rgba(52,211,153,.18)}' +
        '#newsletter .oianl-piege{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}' +
        '#newsletter .oianl-vh{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}' +
        /* Apres les regles qui posent un display : a specificite egale la
           derniere gagne, et sans elle l'attribut hidden ne masque rien. */
        '#newsletter [hidden]{display:none}' +
        '@media (max-width:900px){#newsletter{grid-template-columns:1fr;padding-bottom:36px;margin-bottom:40px}}' +
        '@media (max-width:480px){#newsletter form{flex-direction:column}#newsletter .oianl-btn{width:100%}}' +
        '@media (prefers-reduced-motion:reduce){#newsletter .oianl-btn,#newsletter .oianl-merci{transition:none}' +
        '#newsletter .oianl-btn:active{transform:none}#newsletter .oianl-merci[data-entree]{transform:none}}' +
        '@media print{#newsletter{display:none}}';

    var bloc = null;
    var etat = 'libre';   // libre | envoi | ok | deja
    var erreur = '';      // '' | invalide | erreur

    function inscrit() {
        try { return localStorage.getItem(STORE) === '1'; } catch (e) { return false; }
    }

    /* Une seule fonction repeint tout ce qui porte du texte, appelee a la
       construction, a chaque changement d'etat et a chaque changement de langue. */
    function peindre() {
        if (!bloc) return;
        var t = TXT();
        bloc.setAttribute('aria-label', 'The Automation Brief');
        bloc.querySelector('.oianl-sur').textContent = t.surtitre;
        bloc.querySelector('.oianl-corps').textContent = t.corps;

        var form = bloc.querySelector('form');
        var merci = bloc.querySelector('.oianl-merci');
        var fini = etat === 'ok' || etat === 'deja';
        form.hidden = fini;
        bloc.querySelector('.oianl-note').hidden = fini;
        merci.hidden = !fini;
        merci.textContent = etat === 'deja' ? t.deja : t.ok;

        bloc.querySelector('.oianl-vh').textContent = t.label;
        bloc.querySelector('.oianl-champ').placeholder = t.exemple;
        var btn = bloc.querySelector('.oianl-btn');
        btn.disabled = etat === 'envoi';
        btn.textContent = etat === 'envoi' ? t.envoi : t.bouton;
        bloc.querySelector('.oianl-etat').textContent = erreur ? t[erreur] : '';

        var note = bloc.querySelector('.oianl-note');
        note.textContent = t.note + ' ';
        var a = document.createElement('a');
        a.href = LEGAL;
        a.textContent = t.legal;
        note.appendChild(a);
    }

    function source() {
        var p = location.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/^\/+|\/+$/g, '');
        return (p || 'home').replace(/[^a-z0-9]+/gi, '-').slice(0, 40);
    }

    function terminer(nouvelEtat) {
        etat = nouvelEtat;
        erreur = '';
        try { localStorage.setItem(STORE, '1'); } catch (e) { }
        var merci = bloc.querySelector('.oianl-merci');
        merci.setAttribute('data-entree', '');
        peindre();
        /* Deux images : la premiere pose l'etat de depart, la seconde lance la
           transition. Un seul rAF et le navigateur fusionne les deux styles. */
        requestAnimationFrame(function () {
            requestAnimationFrame(function () { merci.removeAttribute('data-entree'); });
        });
    }

    function envoyer(e) {
        e.preventDefault();
        if (etat === 'envoi') return;
        var champ = bloc.querySelector('.oianl-champ');
        var email = champ.value.trim();
        /* Champ invisible que seul un robot remplit : on lui repond comme a un
           inscrit, sans rien envoyer. */
        if (bloc.querySelector('.oianl-piege').value) { terminer('ok'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) {
            erreur = 'invalide';
            peindre();
            champ.focus();
            return;
        }
        etat = 'envoi';
        erreur = '';
        peindre();
        fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
            body: JSON.stringify({ email: email, source: source() })
        }).then(function (r) { return r.json(); }).then(function (d) {
            if (d && d.ok) { terminer(d.already ? 'deja' : 'ok'); return; }
            etat = 'libre';
            erreur = d && d.error === 'invalid_email' ? 'invalide' : 'erreur';
            peindre();
        }).catch(function () {
            etat = 'libre';
            erreur = 'erreur';
            peindre();
        });
    }

    function construire() {
        var conteneur = document.querySelector('body > footer .container') || document.querySelector('footer .container');
        if (!conteneur || document.getElementById('newsletter')) return;

        var style = document.createElement('style');
        style.textContent = CSS;
        document.head.appendChild(style);

        bloc = document.createElement('section');
        bloc.id = 'newsletter';
        bloc.setAttribute('data-no-i18n', '');
        bloc.innerHTML =
            '<div>' +
                '<p class="oianl-sur"></p>' +
                '<p class="oianl-titre">The Automation Brief</p>' +
                '<p class="oianl-corps"></p>' +
            '</div>' +
            '<div>' +
                '<form novalidate>' +
                    '<label class="oianl-vh" for="oianl-email"></label>' +
                    '<input class="oianl-champ" id="oianl-email" type="email" name="email" autocomplete="email" inputmode="email" spellcheck="false" required>' +
                    '<input class="oianl-piege" type="text" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">' +
                    '<button class="oianl-btn" type="submit"></button>' +
                '</form>' +
                '<p class="oianl-etat" role="alert"></p>' +
                '<p class="oianl-merci" role="status" hidden></p>' +
                '<p class="oianl-note"></p>' +
            '</div>';

        if (inscrit()) etat = 'ok';
        conteneur.insertBefore(bloc, conteneur.firstChild);
        bloc.querySelector('form').addEventListener('submit', envoyer);
        peindre();

        /* Le bloc n'existe pas encore quand le navigateur resout l'ancre d'un
           lien entrant (les e-mails pointent vers /#newsletter). */
        if (location.hash === '#newsletter') bloc.scrollIntoView();
    }

    document.addEventListener('oia:lang', peindre);

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', construire);
    else construire();
})();
