/* Chrome de la nav, charge sur toutes les pages.
 *
 * Bascule clair/sombre. Charge SYNCHRONE dans le <head> (anti-flash : l'attribut
 * data-theme doit etre pose avant le premier rendu). Le choix vit dans
 * localStorage ; par defaut le site reste clair, comme il a ete concu.
 * Les boutons sont injectes a cote de chaque selecteur de langue
 * ([data-lang-picker] : nav desktop + menu mobile).
 *
 * Menu « Home » (.nav-dd) : les sections de l'accueil. Styles dans site.css. */
(function () {
    var KEY = 'oia-theme';
    var racine = document.documentElement;
    var choix = null;
    try { choix = localStorage.getItem(KEY); } catch (e) { }
    if (choix === 'dark') racine.setAttribute('data-theme', 'dark');

    var LUNE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    var SOLEIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>';

    function peindre() {
        var sombre = racine.getAttribute('data-theme') === 'dark';
        document.querySelectorAll('.theme-btn').forEach(function (b) {
            b.innerHTML = sombre ? SOLEIL : LUNE;
            b.setAttribute('aria-label', sombre ? 'Switch to light mode' : 'Switch to dark mode');
        });
    }
    function basculer() {
        var sombre = racine.getAttribute('data-theme') === 'dark';
        if (sombre) racine.removeAttribute('data-theme');
        else racine.setAttribute('data-theme', 'dark');
        try { localStorage.setItem(KEY, sombre ? 'light' : 'dark'); } catch (e) { }
        peindre();
    }
    function bouton() {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'theme-btn';
        b.setAttribute('data-no-i18n', '');
        b.addEventListener('click', basculer);
        return b;
    }
    function injecter() {
        var pickers = document.querySelectorAll('[data-lang-picker]');
        if (pickers.length) {
            pickers.forEach(function (h) { h.parentNode.insertBefore(bouton(), h.nextSibling); });
        } else {
            /* pages des silos : pas de selecteur de langue, on termine la nav */
            document.querySelectorAll('.nav-links, .mobile-menu').forEach(function (c) { c.appendChild(bouton()); });
        }
        peindre();
    }

    /* A la souris, le survol ouvre et ferme ; un clic sur le bouton ne doit donc
       pas refermer un menu que le survol vient d'ouvrir. Au doigt et au clavier,
       le bouton bascule. */
    function menuAccueil(dd) {
        var btn = dd.querySelector('.nav-dd-btn');
        var minuterie = null;
        var souris = false;
        function poser(ouvert) {
            clearTimeout(minuterie);
            dd.classList.toggle('open', ouvert);
            btn.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
        }
        dd.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') poser(true); });
        dd.addEventListener('pointerleave', function (e) {
            if (e.pointerType === 'mouse') minuterie = setTimeout(function () { poser(false); }, 150);
        });
        btn.addEventListener('pointerdown', function (e) { souris = e.pointerType === 'mouse'; });
        btn.addEventListener('click', function () {
            poser(souris || !dd.classList.contains('open'));
            souris = false;
        });
        /* Sur l'accueil le lien fait defiler la page sans la recharger : le menu
           doit se refermer de lui-meme. */
        dd.querySelector('.nav-dd-menu').addEventListener('click', function (e) {
            if (e.target.closest('a')) poser(false);
        });
        dd.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && dd.classList.contains('open')) { poser(false); btn.focus(); }
        });
        dd.addEventListener('focusout', function (e) { if (!dd.contains(e.relatedTarget)) poser(false); });
        document.addEventListener('pointerdown', function (e) { if (!dd.contains(e.target)) poser(false); });
    }

    function demarrer() {
        injecter();
        document.querySelectorAll('.nav-dd').forEach(menuAccueil);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
    else demarrer();
})();
