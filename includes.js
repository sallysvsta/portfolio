// Loads every <div data-include="..."> from its partial file, swaps the
// placeholder for the partial's markup (so the final DOM is identical to the
// old single-file index.html), then starts the site scripts.
(function () {
    var slots = Array.prototype.slice.call(document.querySelectorAll('[data-include]'));

    function load(slot) {
        return fetch(slot.getAttribute('data-include'))
            .then(function (res) {
                if (!res.ok) throw new Error(res.status + ' ' + res.url);
                return res.text();
            })
            .then(function (html) { return { slot: slot, html: html }; });
    }

    Promise.all(slots.map(load))
        .then(function (parts) {
            parts.forEach(function (p) {
                p.slot.insertAdjacentHTML('beforebegin', p.html);
                p.slot.remove();
            });
            if (typeof window.initPortfolio === 'function') window.initPortfolio();

            // Jump to #section if the page was opened with a hash
            if (location.hash) {
                var target = document.getElementById(location.hash.slice(1));
                if (target) target.scrollIntoView();
            }
        })
        .catch(function (err) {
            console.error('Failed to load page sections:', err);
            document.body.insertAdjacentHTML('afterbegin',
                '<p style="padding:2rem;font-family:sans-serif">Could not load page sections. ' +
                'Open this site through a local server (e.g. VS Code Live Server) or GitHub Pages, not by double-clicking index.html.</p>');
        });
})();