/* =====================================================
   NGO DASHBOARD
   PREMIUM LIGHT + DARK DESIGN
===================================================== */

:root {
  --ngo-dash-bg: #f8f5ef;
  --ngo-dash-surface: #ffffff;
  --ngo-dash-surface-soft: #fcfaf6;

  --ngo-dash-text: #182235;
  --ngo-dash-muted: #737b89;

  --ngo-dash-border: #e5dfd5;

  --ngo-dash-navy: #172033;
  --ngo-dash-navy-light: #26334a;

  --ngo-dash-coral: #e8755c;
  --ngo-dash-coral-dark: #d85f47;
  --ngo-dash-coral-soft: #f8e1da;

  --ngo-dash-green: #4d8066;
  --ngo-dash-green-soft: #edf5ef;

  --ngo-dash-blue: #557da5;
  --ngo-dash-blue-soft: #eaf1f7;

  --ngo-dash-gold: #a47735;
  --ngo-dash-gold-soft: #f8f0df;

  --ngo-dash-red: #bd5b54;
  --ngo-dash-red-soft: #f8e5e3;

  --ngo-dash-shadow:
    0 15px 45px rgba(23, 32, 51, 0.08);
}


/* =====================================================
   DARK MODE
===================================================== */

body.dark-theme {
  --ngo-dash-bg: #0d111b;
  --ngo-dash-surface: #151c2a;
  --ngo-dash-surface-soft: #192231;

  --ngo-dash-text: #f3f5f8;
  --ngo-dash-muted: #9aa4b4;

  --ngo-dash-border: #293344;

  --ngo-dash-navy: #090e18;
  --ngo-dash-navy-light: #151e2d;

  --ngo-dash-coral-soft: #35201d;
  --ngo-dash-green-soft: #17271f;
  --ngo-dash-blue-soft: #182737;
  --ngo-dash-gold-soft: #30291c;
  --ngo-dash-red-soft: #321f1e;

  --ngo-dash-shadow:
    0 20px 55px rgba(0, 0, 0, 0.3);
}


/* =====================================================
   MAIN PAGE
===================================================== */

.ngo-dashboard {
  min-height: 100vh;

  padding: 70px 6% 80px;

  box-sizing: border-box;

  position: relative;

  overflow: hidden;

  background:
    radial-gradient(
      circle at 5% 10%,
      rgba(232, 117, 92, 0.08),
      transparent 25%
    ),
    radial-gradient(
      circle at 95% 40%,
      rgba(91, 122, 158, 0.08),
      transparent 25%
    ),
    var(--ngo-dash-bg);

  color: var(--ngo-dash-text);

  transition:
    background 0.3s ease,
    color 0.3s ease;
}


/* Decorative circles */

.ngo-dashboard::before {
  content: "";

  position: absolute;

  width: 450px;
  height: 450px;

  right: -270px;
  top: -240px;

  border-radius: 50%;

  border: 1px solid
    rgba(232, 117, 92, 0.12);

  pointer-events: none;
}

.ngo-dashboard::after {
  content: "";

  position: absolute;

  width: 320px;
  height: 320px;

  left: -190px;
  bottom: -200px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(91, 122, 158, 0.08),
      transparent 70%
    );

  pointer-events: none;
}


/* =====================================================
   HEADER
===================================================== */

.ngo-dashboard-header {
  position: relative;

  z-index: 2;

  max-width: 900px;

  margin: 0 auto 40px;

  text-align: center;
}

.ngo-dashboard-badge {
  display: inline-flex;

  align-items: center;

  padding: 8px 15px;

  border: 1px solid
    rgba(232, 117, 92, 0.2);

  border-radius: 30px;

  background: var(--ngo-dash-coral-soft);

  color: var(--ngo-dash-coral);

  font-size: 9px;

  font-weight: 800;

  letter-spacing: 1.8px;
}

.ngo-dashboard-header h1 {
  margin: 17px 0 9px;

  color: var(--ngo-dash-text);

  font-size: clamp(
    38px,
    5vw,
    55px
  );

  line-height: 1;

  letter-spacing: -2.5px;
}

.ngo-dashboard-header p {
  margin: 0;

  color: var(--ngo-dash-muted);

  font-size: 11px;

  line-height: 1.7;
}


/* =====================================================
   STATISTICS
===================================================== */

.ngo-stats {
  position: relative;

  z-index: 2;

  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 15px;

  max-width: 1150px;

  margin: 0 auto 50px;
}

.ngo-stat-card {
  position: relative;

  min-height: 145px;

  padding: 23px;

  box-sizing: border-box;

  border: 1px solid var(--ngo-dash-border);

  border-radius: 18px;

  background:
    linear-gradient(
      145deg,
      var(--ngo-dash-surface),
      var(--ngo-dash-surface-soft)
    );

  box-shadow: var(--ngo-dash-shadow);

  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.ngo-stat-card:hover {
  transform: translateY(-5px);

  border-color:
    rgba(232, 117, 92, 0.25);

  box-shadow:
    0 20px 45px
    rgba(23, 32, 51, 0.11);
}

.ngo-stat-card span {
  display: flex;

  width: 42px;
  height: 42px;

  align-items: center;
  justify-content: center;

  margin-bottom: 13px;

  border-radius: 12px;

  background: var(--ngo-dash-coral-soft);

  font-size: 18px;
}

.ngo-stat-card h3 {
  margin: 0 0 3px;

  color: var(--ngo-dash-muted);

  font-size: 9px;

  font-weight: 750;

  text-transform: uppercase;

  letter-spacing: 0.8px;
}

.ngo-stat-card strong {
  color: var(--ngo-dash-text);

  font-size: 30px;

  line-height: 1;
}


/* =====================================================
   DONATION SECTION
===================================================== */

.ngo-donation-section {
  position: relative;

  z-index: 2;

  max-width: 1150px;

  margin: 0 auto;
}

.ngo-donation-section > h2 {
  margin: 0 0 20px;

  color: var(--ngo-dash-text);

  font-size: 25px;

  letter-spacing: -0.7px;
}


/* =====================================================
   DONATION LIST
===================================================== */

.ngo-donation-list {
  display: flex;

  flex-direction: column;

  gap: 16px;
}


/* =====================================================
   DONATION CARD
===================================================== */

.ngo-donation-card {
  display: flex;

  gap: 24px;

  padding: 22px;

  box-sizing: border-box;

  border: 1px solid var(--ngo-dash-border);

  border-radius: 19px;

  background:
    linear-gradient(
      145deg,
      var(--ngo-dash-surface),
      var(--ngo-dash-surface-soft)
    );

  box-shadow: var(--ngo-dash-shadow);

  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.ngo-donation-card:hover {
  transform: translateY(-3px);

  border-color:
    rgba(232, 117, 92, 0.22);

  box-shadow:
    0 20px 45px
    rgba(23, 32, 51, 0.11);
}


/* =====================================================
   DONATION IMAGE
===================================================== */

.donation-item-image {
  width: 175px;
  height: 175px;

  flex-shrink: 0;

  object-fit: cover;

  border-radius: 14px;

  background: var(--ngo-dash-border);
}


/* =====================================================
   DONATION CONTENT
===================================================== */

.ngo-donation-content {
  flex: 1;

  min-width: 0;
}

.donation-title-row {
  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 15px;
}

.donation-title-row h3 {
  margin: 0;

  color: var(--ngo-dash-text);

  font-size: 21px;

  letter-spacing: -0.4px;
}


/* =====================================================
   STATUS
===================================================== */

.status {
  display: inline-flex;

  align-items: center;

  width: fit-content;

  padding: 6px 12px;

  border-radius: 30px;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 0.5px;

  text-transform: uppercase;

  white-space: nowrap;
}

.status-pending {
  background: #fff3df;

  color: #ad761f;
}

.status-accepted {
  background: var(--ngo-dash-green-soft);

  color: var(--ngo-dash-green);
}

.status-rejected {
  background: var(--ngo-dash-red-soft);

  color: var(--ngo-dash-red);
}

.status-collected {
  background: var(--ngo-dash-blue-soft);

  color: var(--ngo-dash-blue);
}


/* =====================================================
   DONATION DETAILS
===================================================== */

.donation-details {
  margin-top: 15px;
}

.donation-details p {
  margin: 7px 0;

  color: var(--ngo-dash-muted);

  font-size: 10px;

  line-height: 1.55;
}


/* =====================================================
   DONOR INFORMATION
===================================================== */

.donor-information {
  margin-top: 17px;

  padding: 15px;

  border: 1px solid var(--ngo-dash-border);

  border-radius: 12px;

  background:
    var(--ngo-dash-surface-soft);
}

.donor-information h4 {
  margin: 0 0 8px;

  color: var(--ngo-dash-text);

  font-size: 10px;
}

.donor-information p {
  margin: 5px 0;

  color: var(--ngo-dash-muted);

  font-size: 9px;
}


/* =====================================================
   ACTION BUTTONS
===================================================== */

.donation-actions {
  display: flex;

  flex-wrap: wrap;

  gap: 9px;

  margin-top: 18px;
}

.donation-actions button {
  min-height: 38px;

  padding: 0 15px;

  border: none;

  border-radius: 9px;

  font-family: inherit;

  font-size: 9px;

  font-weight: 750;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    opacity 0.2s ease,
    box-shadow 0.2s ease;
}

.donation-actions button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.accept-button {
  background: var(--ngo-dash-green);

  color: white;

  box-shadow:
    0 7px 18px
    rgba(77, 128, 102, 0.18);
}

.reject-button {
  background: var(--ngo-dash-red);

  color: white;

  box-shadow:
    0 7px 18px
    rgba(189, 91, 84, 0.15);
}

.collect-button {
  background: var(--ngo-dash-blue);

  color: white;

  box-shadow:
    0 7px 18px
    rgba(85, 125, 165, 0.18);
}

.donation-actions button:disabled {
  opacity: 0.5;

  cursor: not-allowed;
}


/* =====================================================
   EMPTY STATE
===================================================== */

.no-donations {
  padding: 65px 25px;

  border: 1px solid var(--ngo-dash-border);

  border-radius: 19px;

  background:
    linear-gradient(
      145deg,
      var(--ngo-dash-surface),
      var(--ngo-dash-surface-soft)
    );

  text-align: center;

  box-shadow: var(--ngo-dash-shadow);
}

.no-donations-icon {
  width: 65px;
  height: 65px;

  display: flex;

  align-items: center;
  justify-content: center;

  margin: 0 auto 15px;

  border-radius: 18px;

  background: var(--ngo-dash-coral-soft);

  font-size: 30px;
}

.no-donations h3 {
  margin: 0 0 7px;

  color: var(--ngo-dash-text);

  font-size: 18px;
}

.no-donations p {
  margin: 0;

  color: var(--ngo-dash-muted);

  font-size: 10px;
}


/* =====================================================
   LOADING
===================================================== */

.ngo-dashboard-loading {
  min-height: 100vh;

  display: flex;

  align-items: center;
  justify-content: center;

  background: var(--ngo-dash-bg);

  color: var(--ngo-dash-text);

  font-size: 14px;
}


/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 950px) {

  .ngo-stats {
    grid-template-columns:
      repeat(2, 1fr);
  }

}


/* =====================================================
   TABLET
===================================================== */

@media (max-width: 800px) {

  .ngo-dashboard {
    padding: 50px 20px 60px;
  }

  .ngo-donation-card {
    flex-direction: column;
  }

  .donation-item-image {
    width: 100%;
    height: 240px;
  }

}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 550px) {

  .ngo-dashboard {
    padding: 40px 15px 50px;
  }

  .ngo-dashboard-header h1 {
    font-size: 36px;

    letter-spacing: -1.5px;
  }

  .ngo-stats {
    grid-template-columns: 1fr;

    gap: 12px;
  }

  .ngo-stat-card {
    min-height: 125px;
  }

  .donation-title-row {
    flex-direction: column;

    align-items: flex-start;
  }

  .donation-title-row h3 {
    font-size: 19px;
  }

  .donation-actions {
    flex-direction: column;
  }

  .donation-actions button {
    width: 100%;
  }

}


/* =====================================================
   SMALL MOBILE
===================================================== */

@media (max-width: 380px) {

  .ngo-dashboard {
    padding-left: 12px;
    padding-right: 12px;
  }

  .ngo-donation-card {
    padding: 16px;
  }

}