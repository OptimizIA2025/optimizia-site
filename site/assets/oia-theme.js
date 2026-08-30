/* Bascule clair/sombre. Charge SYNCHRONE dans le <head> (anti-flash : l'attribut
 * data-theme doit etre pose avant le premier rendu). Le choix vit dans
 * localStorage ; par defaut le site reste clair, comme il a ete concu.
 * Les boutons sont injectes a cote de chaque selecteur de langue
 * ([data-lang-picker] : nav desktop + menu mobile). */
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
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injecter);
    else injecter();
})();
