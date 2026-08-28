/* Langue du site. Une seule version de chaque page, ecrite en anglais dans le
   HTML servi ; les trois autres langues sont appliquees au rendu, dans le
   navigateur, a partir d'un dictionnaire charge a la demande.

   Consequence assumee de la V6.1 : Google n'indexe que l'anglais. Il n'y a
   plus qu'une URL par page, donc plus rien a declarer en hreflang. Une balise
   alternate qui pointerait vers cette meme URL serait une declaration fausse,
   le robot n'y trouve que de l'anglais. Le silo /fr/ est parti en 301.

   Porte de romainben.cloud/site.js, generalise de deux langues a quatre. La
   cle du dictionnaire est le texte ANGLAIS exact du HTML, espaces normalises :
   aucun data-i18n a semer dans le balisage, et une cle absente retombe en
   silence sur l'anglais plutot que d'afficher un trou.

   La page declare ce qu'elle est sur la balise script :
     <script src="assets/oia-i18n.js?v=1" data-page="index" defer></script>
   data-page nomme le dictionnaire (i18n/index.fr.js), data-base deplace le
   dossier pour les pages qui ne sont pas a la racine. */
(function () {
    'use strict';

    var SOURCE = 'en';
    var LANGS = [
        { code: 'en', nom: 'English' },
        { code: 'fr', nom: 'Français' },
        { code: 'es', nom: 'Español' },
        { code: 'de', nom: 'Deutsch' }
    ];
    var STORE = 'oia-lang';
    var VERSION = '1';

    var self = document.currentScript || document.querySelector('script[data-page]');
    var PAGE = (self && self.getAttribute('data-page')) || '';
    var BASE = (self && self.getAttribute('data-base')) || 'i18n/';
    if (!PAGE) return;

    var root = document.documentElement;
    var courante = SOURCE;

    function connue(code) {
        for (var i = 0; i < LANGS.length; i++) { if (LANGS[i].code === code) return true; }
        return false;
    }

    /* ─────────── Dictionnaires ─────────── */

    /* Un dictionnaire par page ET par langue, charge seulement quand la langue
       est reellement demandee. Les trois dictionnaires d'une page pesent plus
       lourd que la page elle-meme : les charger d'avance ferait payer a tout le
       monde, Googlebot compris, un poids que 90 % des visiteurs n'ouvriront
       jamais. */
    var dicos = {};
    var enVol = {};

    function dico(code) {
        var d = (window.OIA_I18N || {})[code];
        return (d && d.html) || {};
    }

    function attrs(code) {
        var d = (window.OIA_I18N || {})[code];
        return (d && d.attr) || {};
    }

    function charger(code, suite) {
        if (code === SOURCE || dicos[code]) { suite(true); return; }
        if (enVol[code]) { enVol[code].push(suite); return; }
        enVol[code] = [suite];

        var s = document.createElement('script');
        s.src = BASE + PAGE + '.' + code + '.js?v=' + VERSION;
        s.async = true;
        s.onload = function () { fini(code, true); };
        /* Un dictionnaire absent ou casse laisse la page en anglais plutot que
           de la figer a moitie traduite. */
        s.onerror = function () { fini(code, false); };
        document.head.appendChild(s);
    }

    function fini(code, ok) {
        if (ok) dicos[code] = true;
        var attente = enVol[code] || [];
        delete enVol[code];
        attente.forEach(function (f) { f(ok); });
    }

    /* ─────────── Collecte ─────────── */

    var SEL = 'h1, h2, h3, h4, h5, p, li, span, a, button, dt, dd, div, title, option, label, figcaption, summary, th, td, blockquote';
    function norm(s) { return s.replace(/\s+/g, ' ').trim(); }

    /* L'anglais d'origine est memorise au premier passage : passer du francais
       a l'allemand ne repasse pas par une restauration, on reecrit la cible
       depuis la source. Sans cette source gardee, une deuxieme bascule
       traduirait une traduction. */
    var noeuds = [];
    var vus = (typeof WeakSet === 'function') ? new WeakSet() : null;

    /* Un element n'est retenu que si sa cle figure au dictionnaire. Retenir
       tout le document couterait une serialisation de innerHTML par element
       pour rien, et surtout les elements imbriques se chevaucheraient : quand
       un parent traduit est reecrit, ses enfants deja collectes se retrouvent
       detaches. Le chevauchement reste possible entre deux entrees du
       dictionnaire, mais il est alors voulu et sans danger, l'ordre du document
       traduisant le parent en premier avec un texte qui contient deja celui de
       l'enfant.

       Contrainte que le generateur de dictionnaires doit tenir : les trois
       langues d'une meme page portent exactement les memes cles. Le filtre est
       pose au premier dictionnaire charge ; une cle qui n'existerait que dans
       l'un des trois ne serait jamais collectee, donc jamais traduite. */
    function connait(cle) {
        var t = window.OIA_I18N || {};
        for (var code in t) {
            if (t[code] && t[code].html && Object.prototype.hasOwnProperty.call(t[code].html, cle)) return true;
        }
        return false;
    }

    function collecter(scope) {
        Array.prototype.forEach.call(scope.querySelectorAll(SEL), function (el) {
            /* [data-consent] : le bandeau de consentement porte ses langues
               lui-meme et se repeint sur l'evenement oia:lang. [data-no-i18n] :
               echappatoire pour un bloc a ne jamais traduire, un extrait de
               code par exemple. */
            if (el.closest('[data-lang-picker], [data-consent], [data-no-i18n]')) return;
            if (vus) { if (vus.has(el)) return; vus.add(el); }

            /* Cas courant : le balisage interne fait partie de la cle. */
            var cle = norm(el.innerHTML);
            if (cle && connait(cle)) {
                noeuds.push({ el: el, mode: 'html', src: el.innerHTML, cle: cle });
                return;
            }

            /* Boutons et liens a icone : le SVG ne doit pas entrer dans la cle,
               et surtout la traduction ne doit pas l'effacer. On ne touche alors
               qu'aux noeuds texte, l'icone reste en place. */
            if (el.querySelector('svg')) {
                var cleTxt = norm(el.textContent);
                if (!cleTxt) return;
                var textes = [];
                Array.prototype.forEach.call(el.childNodes, function (n) {
                    if (n.nodeType === 3 && n.nodeValue.trim()) textes.push(n);
                });
                if (textes.length) {
                    noeuds.push({
                        el: el, mode: 'texte', node: textes[0], cle: cleTxt, src: textes[0].nodeValue,
                        autres: textes.slice(1).map(function (x) { return { node: x, src: x.nodeValue }; })
                    });
                }
            }
        });
    }

    /* Les attributs traduisibles sont nommes par le dictionnaire lui-meme, sous
       la forme { "selecteur CSS": { "attribut": "valeur traduite" } } : la
       meta description, un aria-label, un title de lien. Leur valeur anglaise
       est relevee ici, une seule fois. */
    var attrSrc = {};
    function relever(sel, attr, el) {
        var k = sel + '|' + attr;
        if (!(k in attrSrc)) attrSrc[k] = el.getAttribute(attr) || '';
        return attrSrc[k];
    }

    var collecte = false;
    function assurerCollecte() {
        if (collecte) return;
        collecte = true;
        collecter(document);
        surveiller();
    }

    /* ─────────── Application ─────────── */

    function appliquer(code) {
        var table = dico(code);
        var source = code === SOURCE;

        noeuds.forEach(function (n) {
            var cible = source ? n.src : table[n.cle];
            if (cible === undefined) cible = n.src;
            if (n.mode === 'texte') {
                var v = source ? n.src : ' ' + cible + ' ';
                if (n.node.nodeValue !== v) n.node.nodeValue = v;
                n.autres.forEach(function (x) {
                    var w = source ? x.src : '';
                    if (x.node.nodeValue !== w) x.node.nodeValue = w;
                });
            } else if (n.el.innerHTML !== cible) {
                /* Le test d'egalite n'est pas une coquetterie : reecrire un
                   innerHTML identique detruit et reconstruit le sous-arbre, et
                   le navigateur recalcule la mise en page de toute la page. */
                n.el.innerHTML = cible;
            }
        });

        var table2 = attrs(code);
        var sels = {};
        Object.keys(table2).forEach(function (s) { sels[s] = 1; });
        Object.keys(attrSrc).forEach(function (k) { sels[k.split('|')[0]] = 1; });

        Object.keys(sels).forEach(function (sel) {
            var el = document.querySelector(sel);
            if (!el) return;
            var spec = table2[sel] || {};
            var noms = {};
            Object.keys(spec).forEach(function (a) { noms[a] = 1; });
            Object.keys(attrSrc).forEach(function (k) {
                var p = k.split('|');
                if (p[0] === sel) noms[p[1]] = 1;
            });
            Object.keys(noms).forEach(function (attr) {
                var origine = relever(sel, attr, el);
                var val = source ? origine : (spec[attr] !== undefined ? spec[attr] : origine);
                if (el.getAttribute(attr) !== val) el.setAttribute(attr, val);
            });
        });

        root.setAttribute('lang', code);
        courante = code;
    }

    /* Une partie des libelles vit dans le JavaScript des pages, pas dans le
       DOM : « Copied! », « See more reviews ». Ils appellent OIA.t au moment ou
       ils s'ecrivent, sinon ils reviendraient en anglais au premier clic. */
    window.OIA = window.OIA || {};
    window.OIA.t = function (texte) {
        if (courante === SOURCE) return texte;
        var v = dico(courante)[norm(texte)];
        return v === undefined ? texte : v;
    };
    window.OIA.langue = function () { return courante; };

    /* Le contenu construit apres coup (modales, listes d'avis depliees) n'existe
       pas a la collecte. On le rattrape, mais seulement hors anglais : en
       anglais l'observateur n'aurait rien a faire a chaque mutation. */
    function surveiller() {
        if (!window.MutationObserver) return;
        var attente = null;
        new MutationObserver(function (records) {
            if (courante === SOURCE) return;
            var neuf = false;
            records.forEach(function (r) {
                Array.prototype.forEach.call(r.addedNodes, function (n) {
                    if (n.nodeType === 1) neuf = true;
                });
            });
            if (!neuf || attente) return;
            attente = setTimeout(function () {
                attente = null;
                var avant = noeuds.length;
                collecter(document);
                if (noeuds.length > avant) appliquer(courante);
            }, 60);
        }).observe(document.body, { childList: true, subtree: true });
    }

    function poser(code, memoriser) {
        if (!connue(code)) code = SOURCE;
        if (code === SOURCE) {
            if (collecte) appliquer(SOURCE); else { root.setAttribute('lang', SOURCE); courante = SOURCE; }
            majPicker();
            if (memoriser) retenir(code);
            document.dispatchEvent(new CustomEvent('oia:lang', { detail: code }));
            return;
        }
        charger(code, function (ok) {
            if (!ok) { majPicker(); return; }
            assurerCollecte();
            appliquer(code);
            majPicker();
            if (memoriser) retenir(code);
            document.dispatchEvent(new CustomEvent('oia:lang', { detail: code }));
        });
    }

    function retenir(code) {
        try { localStorage.setItem(STORE, code); } catch (e) { }
    }

    /* ─────────── Selecteur ─────────── */

    var pickers = [];

    function nomDe(code) {
        for (var i = 0; i < LANGS.length; i++) { if (LANGS[i].code === code) return LANGS[i].nom; }
        return code;
    }

    function majPicker() {
        pickers.forEach(function (p) {
            p.btn.textContent = courante.toUpperCase();
            p.btn.setAttribute('aria-label', 'Language: ' + nomDe(courante));
            Array.prototype.forEach.call(p.liste.children, function (li) {
                var on = li.getAttribute('data-code') === courante;
                li.setAttribute('aria-selected', on ? 'true' : 'false');
                li.classList.toggle('lang-active', on);
            });
        });
    }

    function fermer(p) {
        p.liste.hidden = true;
        p.btn.setAttribute('aria-expanded', 'false');
    }

    function construire(hote, i) {
        hote.textContent = '';

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'lang-btn lang-current';
        btn.setAttribute('aria-haspopup', 'listbox');
        btn.setAttribute('aria-expanded', 'false');
        btn.id = 'lang-btn-' + i;

        var liste = document.createElement('ul');
        liste.className = 'lang-list';
        liste.setAttribute('role', 'listbox');
        liste.setAttribute('aria-labelledby', btn.id);
        liste.hidden = true;

        LANGS.forEach(function (l) {
            var li = document.createElement('li');
            li.className = 'lang-opt';
            li.setAttribute('role', 'option');
            li.setAttribute('data-code', l.code);
            li.setAttribute('tabindex', '0');
            li.textContent = l.nom;
            li.addEventListener('click', function () {
                poser(l.code, true);
                fermer(p);
                btn.focus();
            });
            li.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); li.click(); }
            });
            liste.appendChild(li);
        });

        btn.addEventListener('click', function () {
            var ouvert = liste.hidden === false;
            pickers.forEach(fermer);
            if (!ouvert) {
                liste.hidden = false;
                btn.setAttribute('aria-expanded', 'true');
            }
        });

        hote.appendChild(btn);
        hote.appendChild(liste);

        var p = { hote: hote, btn: btn, liste: liste };
        pickers.push(p);
        return p;
    }

    function monter() {
        var hotes = document.querySelectorAll('[data-lang-picker]');
        if (!hotes.length) return;
        Array.prototype.forEach.call(hotes, construire);

        document.addEventListener('click', function (e) {
            pickers.forEach(function (p) {
                if (!p.hote.contains(e.target)) fermer(p);
            });
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') pickers.forEach(fermer);
        });

        majPicker();
    }

    /* ─────────── Demarrage ─────────── */

    /* Choix memorise d'abord, langue du navigateur ensuite. Aucune redirection
       n'est en jeu ici, contrairement au modele a deux URLs : Googlebot crawle
       en en-US, obtient l'anglais, et ne declenche ni chargement ni traduction.
       Le cout est donc nul pour lui comme pour tout visiteur anglophone. */
    function voulue() {
        var m = null;
        try { m = localStorage.getItem(STORE); } catch (e) { }
        if (m && connue(m)) return m;
        var l = navigator.languages || [navigator.language || ''];
        for (var i = 0; i < l.length; i++) {
            var c = String(l[i]).slice(0, 2).toLowerCase();
            if (connue(c)) return c;
        }
        return SOURCE;
    }

    function demarrer() {
        monter();
        var code = voulue();
        if (code !== SOURCE) poser(code, false); else majPicker();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', demarrer);
    } else {
        demarrer();
    }
})();
