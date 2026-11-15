/**
 * YUME AI — privacy-first visit counting.
 *
 * What is sent: a page view, a session start, and the length of the visit.
 * What is never sent: your IP is not read or stored, no cookies, no
 * fingerprinting, no personal data, no cross-site tracking.
 *
 * If the analytics API is not deployed yet, every request fails silently and
 * the site behaves exactly as before.
 */
(() => {
  if (location.protocol === 'file:') return;
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;

  const ENDPOINT = '/api/track';

  function send(payload) {
    try {
      const body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
        return;
      }
      fetch(ENDPOINT, {
        method: 'POST',
        body,
        keepalive: true,
        headers: { 'content-type': 'application/json' },
      }).catch(() => {});
    } catch (error) {
      /* analytics must never break the page */
    }
  }

  let newSession = false;
  try {
    if (!sessionStorage.getItem('yume:visit')) {
      sessionStorage.setItem('yume:visit', '1');
      newSession = true;
    }
  } catch (error) {
    /* private mode without storage — count the view only */
  }

  send({ type: 'view', path: location.pathname, session: newSession });

  const started = Date.now();
  let durationSent = false;

  function sendDuration() {
    if (durationSent) return;
    const seconds = Math.round((Date.now() - started) / 1000);
    if (seconds < 2 || seconds > 3600) return;
    durationSent = true;
    send({ type: 'duration', seconds });
  }

  window.addEventListener('pagehide', sendDuration, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') sendDuration();
  });
})();
