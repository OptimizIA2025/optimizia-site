/* Suggestion de langue, cote client uniquement.
   Doctrine : jamais de redirection serveur par Accept-Language (Googlebot
   crawle depuis des IP US et ne verrait qu'une seule des deux versions).
   On suggere, on memorise le choix, et on ne redirige automatiquement que
   le visiteur qui a deja choisi l'autre langue, et seulement a l'entree
   sur le site (referrer vide ou externe). La cible vient des balises
   hreflang de la page : pas de table d'URLs a maintenir ici. */
(function () {
    'use strict';
    var KEY = 'oia_lang';
    var here = (document.documentElement.lang || '').slice(0, 2);
    if (here !== 'fr' && here !== 'en') return;
    var other = here === 'fr' ? 'en' : 'fr';
    var alt = document.querySelector('link[rel="alternate"][hreflang="' + other + '"]');
    if (!alt || !alt.href) return;

    /* La cible hreflang est une URL propre, sans query. Sans ce report, la
       redirection de langue EFFACE la chaine de requete. Mesure du 21/08 :
       un ?notrack=1 n'atteignait jamais le traceur, et surtout les utm_*
       d'une campagne etaient perdus pour tout visiteur redirige, alors que
       le traceur lit utm_source et utm_campaign. Le hash suit aussi, sinon
       une ancre profonde partagee retombe en haut de page. */
    function cible() {
        try {
            var u = new URL(alt.href, location.href);
            if (location.search) u.search = location.search;
            if (location.hash) u.hash = location.hash;
            return u.href;
        } catch (e) { return alt.href; }
    }

    var pref = null;
    try { pref = localStorage.getItem(KEY); } catch (e) { return; }

    if (pref === here) return;

    var entree = true;
    try { entree = !document.referrer || new URL(document.referrer).origin !== location.origin; } catch (e) { }

    if (pref === other) {
        if (entree) location.replace(cible());
        return;
    }

    // Pas de choix memorise : bandeau seulement si le navigateur prefere
    // l'autre langue. Googlebot rend chaque page avec un stockage vierge
    // et un navigateur en-US : il voit au pire un bandeau, jamais un saut.
    var nav = ((navigator.languages && navigator.languages[0]) || navigator.language || '').slice(0, 2).toLowerCase();
    if (nav !== other) return;

    var txt = other === 'fr'
        ? { msg: 'Ce site existe en français.', go: 'Voir en français', close: 'Rester en anglais', label: 'Choix de langue' }
        : { msg: 'This site is available in English.', go: 'View in English', close: 'Stay in French', label: 'Language choice' };

    var bar = document.createElement('div');
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', txt.label);
    bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:9999;display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;padding:12px 16px;background:#101418;color:#f5f7fa;font:14px/1.4 system-ui,sans-serif;box-shadow:0 -2px 12px rgba(0,0,0,.35)';

    var msg = document.createElement('span');
    msg.textContent = txt.msg;

    var go = document.createElement('a');
    go.href = cible();
    go.textContent = txt.go;
    go.style.cssText = 'color:#101418;background:#f5f7fa;padding:6px 14px;border-radius:6px;text-decoration:none;font-weight:600';
    go.addEventListener('click', function () {
        try { localStorage.setItem(KEY, other); } catch (e) { }
    });

    var stay = document.createElement('button');
    stay.type = 'button';
    stay.textContent = txt.close;
    stay.style.cssText = 'background:none;border:1px solid #4a5560;color:#f5f7fa;padding:6px 14px;border-radius:6px;cursor:pointer;font:inherit';
    stay.addEventListener('click', function () {
        try { localStorage.setItem(KEY, here); } catch (e) { }
        bar.remove();
    });

    bar.appendChild(msg);
    bar.appendChild(go);
    bar.appendChild(stay);
    if (document.body) document.body.appendChild(bar);
})();
