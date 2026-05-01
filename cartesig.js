
// ═══════════════════════════════════════════════
//  TRANSLATIONS – قاموس الترجمة
// ═══════════════════════════════════════════════
const I18N = {
  ar: {
    panel_title:      '🗺️ البحث الجغرافي',
    lbl_wilaya:       '📍 الولاية',
    lbl_commune:      '🏘️ البلدية',
    ph_wilaya:        'اكتب اسم الولاية...',
    ph_commune_init:  'اختر ولاية أولاً...',
    ph_commune_ready: n => `ابحث في ${n} بلدية...`,
    btn_reset:        '↺ إعادة تعيين',
    wx_loading:       'جارٍ تحميل الطقس...',
    wx_unavailable:   'الطقس غير متاح',
    status_default:   'الجزائر – الخريطة الفلاحية',
    status_error:     'خطأ في الاتصال بالخادم',
    legend_title:     '🌿 مفتاح الخريطة',
    legend_farm:      'مستثمرة فلاحية',
    legend_wilaya:    'حدود الولاية',
    legend_commune:   'حدود البلدية',
    drawer_title:     'تفاصيل المستثمرة',
    loader_init:      'جارٍ تحميل الخريطة...',
    loader_wilayas:   'تحميل قائمة الولايات...',
    loader_wilaya:    n => `تحميل ولاية ${n}...`,
    loader_commune:   n => `تحميل بلدية ${n}...`,
    err_server:       '❌ تعذّر الاتصال بالخادم – تحقق من تشغيل FastAPI',
    err_geojson:      '⚠️ تعذّر تحميل ملف الولايات الجغرافي',
    err_farms:        '❌ خطأ في تحميل المستثمرات',
    toast_reset:      '🔄 تمت إعادة التعيين',
    toast_wilaya:     (n, c) => `✅ ولاية ${n} – ${c} بلدية`,
    toast_farms_yes:  (c, n) => `🌾 ${c} مستثمرة في ${n}`,
    toast_farms_no:   n => `لا توجد مستثمرات مسجّلة في ${n}`,
    status_wilaya:    n => `ولاية ${n}`,
    status_commune:   (w, c, f) => `${w} / ${c} – ${f} مستثمرة`,
    count_farms:      (f, n) => `${f} مستثمرة في ${n}`,
    popup_close:      '✕ إغلاق',
    popup_details:    '📋 التفاصيل',
    popup_wx_loading: 'جارٍ تحميل الطقس الحقيقي...',
    popup_wx_source:  t => `مصدر: Open-Meteo • يحسّ كـ ${t}°C`,
    // Drawer sections
    dr_info:          '📋 معلومات الإحصاء',
    dr_surf:          '📐 المساحات (هـ)',
    dr_cult:          '🌾 الزراعات',
    dr_trees:         '🌳 الأشجار',
    dr_cheptel:       '🐑 الماشية',
    dr_bovins:        '🐄 الأبقار',
    dr_poultry:       '🐔 الدواجن',
    dr_bees:          '🍯 تربية النحل',
    dr_irrigation:    '💧 الري',
    dr_buildings:     '🏗️ البنايات',
    dr_equipment:     '🚜 المعدات',
    dr_household:     '🏠 المنزل الزراعي',
    dr_inputs:        '🧪 المدخلات',
    dr_campagne:      'الحملة',
    dr_date:          'التاريخ',
    dr_status:        'الحالة',
    dr_year:          'العام',
    dr_dry:           'جافة',
    dr_irrigated:     'مسقية',
    dr_tree_unit:     'شجرة',
    dr_female:        'إناث',
    dr_persons:       'الأشخاص',
    dr_adults:        'البالغون',
    dr_children:      'الأطفال',
    dr_legal:         'الوضع القانوني',
    dr_activity:      'النشاط',
    dr_built:         'المساحة المبنية',
    dr_unbuilt:       'المساحة غير المبنية',
    dr_exploitant:    'المستغِل',
    dr_weather:       '🌡️ الأحوال الجوية الفعلية',
    dr_heat:          'الحرارة',
    dr_humidity:      'الرطوبة',
    dr_wind:          'الرياح',
    dr_km_h:          'كم/س',
    dr_ha:            'هـ',
    dr_m2:            'م²',
    dr_nodata:        '—',
    dr_loading_data:  'جارٍ جلب البيانات...',
    dr_no_census:     'لا توجد إحصاءات',
    dr_no_census_msg: 'لم يتم إجراء أي إحصاء لهذه المستثمرة',
    dr_err_load:      'خطأ في تحميل البيانات',
    dr_loading_title: 'جارٍ التحميل...',
    // Input tags
    tag_selected_seeds: 'بذور منتقاة',
    tag_cert_seeds:     'بذور معتمدة',
    tag_bio:            'بيولوجي',
    tag_nitrogen:       'سماد آزوتي',
    tag_phosphate:      'سماد فوسفاتي',
    tag_organic:        'سماد عضوي',
    tag_pesticides:     'مبيدات',
    farm_label:         n => `مستثمرة #${n}`,
    // Lang toggle
    lang_current:  'العربية',
    lang_alt:      'Français',
    lang_dir:      'rtl',
    lang_code:     'ar',
  },
  fr: {
    panel_title:      '🗺️ Recherche géographique',
    lbl_wilaya:       '📍 Wilaya',
    lbl_commune:      '🏘️ Commune',
    ph_wilaya:        'Saisir le nom de la wilaya...',
    ph_commune_init:  'Sélectionner une wilaya d\'abord...',
    ph_commune_ready: n => `Rechercher parmi ${n} communes...`,
    btn_reset:        '↺ Réinitialiser',
    wx_loading:       'Chargement météo...',
    wx_unavailable:   'Météo indisponible',
    status_default:   'Algérie – Carte agricole SIG',
    status_error:     'Erreur de connexion au serveur',
    legend_title:     '🌿 Légende',
    legend_farm:      'Exploitation agricole',
    legend_wilaya:    'Limite de wilaya',
    legend_commune:   'Limite de commune',
    drawer_title:     'Détails de l\'exploitation',
    loader_init:      'Chargement de la carte...',
    loader_wilayas:   'Chargement des wilayas...',
    loader_wilaya:    n => `Chargement wilaya ${n}...`,
    loader_commune:   n => `Chargement commune ${n}...`,
    err_server:       '❌ Impossible de contacter le serveur – Vérifiez FastAPI',
    err_geojson:      '⚠️ Échec du chargement du fichier GeoJSON des wilayas',
    err_farms:        '❌ Erreur lors du chargement des exploitations',
    toast_reset:      '🔄 Réinitialisation effectuée',
    toast_wilaya:     (n, c) => `✅ Wilaya ${n} – ${c} commune(s)`,
    toast_farms_yes:  (c, n) => `🌾 ${c} exploitation(s) dans ${n}`,
    toast_farms_no:   n => `Aucune exploitation enregistrée dans ${n}`,
    status_wilaya:    n => `Wilaya ${n}`,
    status_commune:   (w, c, f) => `${w} / ${c} – ${f} exploitation(s)`,
    count_farms:      (f, n) => `${f} exploitation(s) dans ${n}`,
    popup_close:      '✕ Fermer',
    popup_details:    '📋 Détails',
    popup_wx_loading: 'Chargement météo en cours...',
    popup_wx_source:  t => `Source: Open-Meteo • Ressenti ${t}°C`,
    // Drawer sections
    dr_info:          '📋 Informations du recensement',
    dr_surf:          '📐 Superficies (ha)',
    dr_cult:          '🌾 Cultures',
    dr_trees:         '🌳 Arbres',
    dr_cheptel:       '🐑 Cheptel',
    dr_bovins:        '🐄 Bovins',
    dr_poultry:       '🐔 Aviculture',
    dr_bees:          '🍯 Apiculture',
    dr_irrigation:    '💧 Irrigation',
    dr_buildings:     '🏗️ Bâtiments',
    dr_equipment:     '🚜 Matériels',
    dr_household:     '🏠 Ménage agricole',
    dr_inputs:        '🧪 Intrants',
    dr_campagne:      'Campagne',
    dr_date:          'Date',
    dr_status:        'Statut',
    dr_year:          'Année',
    dr_dry:           'Sec',
    dr_irrigated:     'Irrigué',
    dr_tree_unit:     'arbres',
    dr_female:        'femelles',
    dr_persons:       'Personnes',
    dr_adults:        'Adultes',
    dr_children:      'Enfants',
    dr_legal:         'Statut juridique',
    dr_activity:      'Activité',
    dr_built:         'Surface bâtie',
    dr_unbuilt:       'Surface non bâtie',
    dr_exploitant:    'Exploitant',
    dr_weather:       '🌡️ Conditions météo actuelles',
    dr_heat:          'Température',
    dr_humidity:      'Humidité',
    dr_wind:          'Vent',
    dr_km_h:          'km/h',
    dr_ha:            'ha',
    dr_m2:            'm²',
    dr_nodata:        '—',
    dr_loading_data:  'Chargement des données...',
    dr_no_census:     'Aucun recensement',
    dr_no_census_msg: 'Aucun recensement effectué pour cette exploitation',
    dr_err_load:      'Erreur lors du chargement des données',
    dr_loading_title: 'Chargement...',
    // Input tags
    tag_selected_seeds: 'Semences sélectionnées',
    tag_cert_seeds:     'Semences certifiées',
    tag_bio:            'Biologique',
    tag_nitrogen:       'Engrais azotés',
    tag_phosphate:      'Engrais phosphatés',
    tag_organic:        'Fumier organique',
    tag_pesticides:     'Produits phytosanitaires',
    farm_label:         n => `Exploitation #${n}`,
    // Lang toggle
    lang_current:  'Français',
    lang_alt:      'العربية',
    lang_dir:      'ltr',
    lang_code:     'fr',
  }
};

// ═══════════════════════════════════════════════
//  اللغة الحالية
// ═══════════════════════════════════════════════
let LANG = 'ar';
const t = key => I18N[LANG][key] ?? I18N['ar'][key] ?? key;

// ═══════════════════════════════════════════════
//  تطبيق الترجمة على الواجهة
// ═══════════════════════════════════════════════
function applyLang() {
  const lng = I18N[LANG];
  const html = document.documentElement;
  html.lang = lng.lang_code;
  html.dir  = lng.lang_dir;

  // نصوص العناصر
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (lng[key] && typeof lng[key] === 'string') el.textContent = lng[key];
  });
  // placeholders
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (lng[key] && typeof lng[key] === 'string') el.placeholder = lng[key];
  });

  // زر اللغة
  document.getElementById('lb-cur').textContent = lng.lang_current;
  document.getElementById('lb-alt').textContent = lng.lang_alt;

  // الحالة الافتراضية
  if (stxt && stxt.textContent === I18N[LANG === 'ar' ? 'fr' : 'ar'].status_default) {
    stxt.textContent = lng.status_default;
  }

  // تحديث العنوان
  document.title = LANG === 'ar'
    ? 'خريطة SIG الفلاحية – الجزائر'
    : 'Carte SIG Agricole – Algérie';
}

// ═══════════════════════════════════════════════
//  CONFIG
// ═══════════════════════════════════════════════
const API = 'http://localhost:8000/api';

// ═══════════════════════════════════════════════
//  REFS
// ═══════════════════════════════════════════════
const lmsg       = document.getElementById('lmsg');
const loader     = document.getElementById('loader');
const toast      = document.getElementById('toast');
const fab        = document.getElementById('fab');
const panel      = document.getElementById('panel');
const pcBtn      = document.getElementById('pc-btn');
const wi         = document.getElementById('wi');
const wl         = document.getElementById('wl');
const ci         = document.getElementById('ci');
const cl         = document.getElementById('cl');
const resetBtn   = document.getElementById('reset-btn');
const wxbar      = document.getElementById('wxbar');
const wbi        = document.getElementById('wbi');
const wbloc      = document.getElementById('wbloc');
const wbd        = document.getElementById('wbd');
const stxt       = document.getElementById('stxt');
const ctxt       = document.getElementById('ctxt');
const countBadge = document.getElementById('countbadge');
const drawer     = document.getElementById('drawer');
const drawerBody = document.getElementById('drawer-body');
const drawerTitle= document.getElementById('drawer-title');
const drawerClose= document.getElementById('drawer-close');
const langBtn    = document.getElementById('lang-btn');

// ═══════════════════════════════════════════════
//  LEAFLET MAP
// ═══════════════════════════════════════════════
const map = L.map('map', { zoomControl: true, attributionControl: false })
             .setView([28, 2.5], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

const farmLG = L.layerGroup().addTo(map);

let wilayaLayersMap = {};
let WILAYAS_LAYER   = null;
let selWLayer       = null;
let selCLayer       = null;
let selW = null, selC = null;
let WLIST = [];
let cFull = [];

const STYLE_DEFAULT = {
  color:       '#9a975b',
  weight:      1.8,
  opacity:     0.9,
  fillOpacity: 0.08,
  fillColor:   '#1c5433'
};
const STYLE_SELECTED = {
  color:       '#d4af37',
  weight:      3,
  opacity:     1,
  fillOpacity: 0.18,
  fillColor:   '#3da860'
};

// ═══════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════
const showLoader = m => { lmsg.textContent = m || t('loader_init'); loader.classList.remove('hidden'); };
const hideLoader = () => loader.classList.add('hidden');
let toastT;
const showToast = (m, d = 2600) => {
  toast.textContent = m;
  toast.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => toast.classList.remove('show'), d);
};

async function apiFetch(path) {
  const r = await fetch(API + path);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

// ═══════════════════════════════════════════════
//  GeoJSON الولايات
// ═══════════════════════════════════════════════
function loadWilayasGeoJSON() {
  fetch('./data/wilayas.geojson')
    .then(res => res.json())
    .then(data => {
      WILAYAS_LAYER = L.geoJSON(data, {
        style: STYLE_DEFAULT,
        onEachFeature: (feature, layer) => {
          const nameFr = (
            feature.properties?.NL_NAME_1 ||
            feature.properties?.VARNAME_1 ||
            feature.properties?.NAME_1    ||
            feature.properties?.name      ||
            ''
          ).trim();
          if (nameFr) {
            layer.bindTooltip(nameFr, { direction: 'center', permanent: false });
            wilayaLayersMap[nameFr.toLowerCase()] = layer;
          }
          layer.on('click', () => {
            map.flyToBounds(layer.getBounds(), { padding: [20, 20], duration: 0.8 });
          });
        }
      }).addTo(map);
    })
    .catch(err => {
      console.error('GeoJSON error:', err);
      showToast(t('err_geojson'));
    });
}

function highlightWilayaLayer(nomFr, nomAr) {
  if (selWLayer) { selWLayer.setStyle(STYLE_DEFAULT); selWLayer = null; }
  const key = (nomFr || '').toLowerCase();
  let found = wilayaLayersMap[key];
  if (!found) {
    for (const [k, lyr] of Object.entries(wilayaLayersMap)) {
      if (k.includes(key) || key.includes(k)) { found = lyr; break; }
    }
  }
  if (!found && nomAr) {
    const keyAr = nomAr.toLowerCase();
    for (const [k, lyr] of Object.entries(wilayaLayersMap)) {
      if (k.includes(keyAr) || keyAr.includes(k)) { found = lyr; break; }
    }
  }
  if (found) {
    found.setStyle(STYLE_SELECTED);
    found.bringToFront();
    selWLayer = found;
    const bounds = found.getBounds();
    return { bounds, center: bounds.getCenter() };
  }
  return null;
}

// ═══════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════
async function init() {
  showLoader(t('loader_wilayas'));
  try {
    WLIST = await apiFetch('/wilayas');
    renderList(wl, WLIST.map(toWItem), it => {
      wi.value = LANG === 'ar' ? (it.ar || it.fr) : it.fr;
      wl.classList.remove('show');
      selectW(it.id, it.fr, it.ar);
    });
  } catch (e) {
    showToast(t('err_server'));
    stxt.textContent = t('status_error');
  }
  hideLoader();
}

const toWItem = w => ({ id: w.id, fr: w.nom_fr, ar: w.nom_ar, code: w.code });

// ═══════════════════════════════════════════════
//  AUTOCOMPLETE
// ═══════════════════════════════════════════════
function renderList(cont, items, onSel) {
  cont.innerHTML = '';
  if (!items.length) { cont.classList.remove('show'); return; }
  items.slice(0, 60).forEach(it => {
    const d = document.createElement('div');
    d.className = 'ac-item';
    // عرض الاسم حسب اللغة المختارة
    const primary   = LANG === 'ar' ? (it.ar || it.fr) : it.fr;
    const secondary = LANG === 'ar' ? it.fr : (it.ar || '');
    d.innerHTML = `<span class="ac-code">${it.code || it.id}</span><span>${primary}</span>${secondary && secondary !== primary ? `<span class="ac-sub">${secondary}</span>` : ''}`;
    d.addEventListener('mousedown', e => { e.preventDefault(); onSel(it); });
    cont.appendChild(d);
  });
  cont.classList.add('show');
}

function filterW(q) {
  if (!q) return WLIST.map(toWItem);
  const lq = q.toLowerCase();
  return WLIST
    .filter(w => w.nom_fr.toLowerCase().includes(lq) || (w.nom_ar || '').includes(q) || w.code === q)
    .map(toWItem);
}

wi.addEventListener('input',  () => renderList(wl, filterW(wi.value), it => { wi.value = LANG === 'ar' ? (it.ar || it.fr) : it.fr; wl.classList.remove('show'); selectW(it.id, it.fr, it.ar); }));
wi.addEventListener('focus',  () => renderList(wl, filterW(wi.value), it => { wi.value = LANG === 'ar' ? (it.ar || it.fr) : it.fr; wl.classList.remove('show'); selectW(it.id, it.fr, it.ar); }));
wi.addEventListener('blur',   () => setTimeout(() => wl.classList.remove('show'), 200));

function filterC(q) {
  if (!q) return cFull;
  const lq = q.toLowerCase();
  return cFull.filter(c => c.nfr.toLowerCase().includes(lq) || c.nar.includes(q));
}
ci.addEventListener('input',  () => renderList(cl, filterC(ci.value).map(toCItem), it => { ci.value = it.fr; cl.classList.remove('show'); selectC(it.raw); }));
ci.addEventListener('focus',  () => { if (cFull.length) renderList(cl, filterC(ci.value).map(toCItem), it => { ci.value = it.fr; cl.classList.remove('show'); selectC(it.raw); }); });
ci.addEventListener('blur',   () => setTimeout(() => cl.classList.remove('show'), 200));

const toCItem = c => ({ id: c.id, fr: c.nfr, ar: c.nar, code: c.id, raw: c });

// ═══════════════════════════════════════════════
//  SELECT WILAYA
// ═══════════════════════════════════════════════
async function selectW(wid, nfr, nar) {
  const meta = WLIST.find(w => w.id == wid);
  if (!meta) return;
  selW = meta; selC = null;
  const displayName = LANG === 'ar' ? (meta.nom_ar || nfr) : nfr;
  showLoader(I18N[LANG].loader_wilaya(displayName));

  farmLG.clearLayers();
  countBadge.style.display = 'none';
  if (selCLayer) { map.removeLayer(selCLayer); selCLayer = null; }

  const geo = highlightWilayaLayer(nfr, nar || meta.nom_ar);
  let centerLat, centerLng;

  if (geo) {
    map.flyToBounds(geo.bounds, { padding: [40, 40], duration: 0.85 });
    centerLat = geo.center.lat;
    centerLng = geo.center.lng;
  } else {
    console.warn(`Wilaya "${nfr}" not found in local GeoJSON — using Nominatim`);
    const geoNom = await fetchNominatimGeo(nfr, 'Algeria');
    if (geoNom) {
      if (selWLayer) { map.removeLayer(selWLayer); selWLayer = null; }
      selWLayer = L.geoJSON(geoNom, { style: STYLE_SELECTED }).addTo(map);
      map.flyToBounds(selWLayer.getBounds(), { padding: [40, 40], duration: 0.85 });
      const c = selWLayer.getBounds().getCenter();
      centerLat = c.lat; centerLng = c.lng;
    } else {
      map.flyTo([28, 2.5], 6, { duration: 0.85 });
      centerLat = 28; centerLng = 2.5;
    }
  }

  try {
    const communes = await apiFetch(`/wilayas/${wid}/communes`);
    cFull = communes.map(c => ({ id: c.id, nfr: c.nom_fr, nar: c.nom_ar || '' }));
  } catch (e) { cFull = []; }

  ci.disabled    = false;
  ci.placeholder = I18N[LANG].ph_commune_ready(cFull.length);
  ci.value       = '';
  cl.classList.remove('show');

  wi.value = displayName;
  stxt.textContent = I18N[LANG].status_wilaya(displayName);
  showToast(I18N[LANG].toast_wilaya(displayName, cFull.length));

  updateWXBar(centerLat, centerLng, displayName);
  hideLoader();
}

// ═══════════════════════════════════════════════
//  SELECT COMMUNE
// ═══════════════════════════════════════════════
async function selectC(comm) {
  if (!selW) return;
  selC = comm;
  const commName = LANG === 'ar' ? (comm.nar || comm.nfr) : comm.nfr;
  showLoader(I18N[LANG].loader_commune(commName));
  farmLG.clearLayers();
  countBadge.style.display = 'none';
  if (selCLayer) { map.removeLayer(selCLayer); selCLayer = null; }

  const geoNom = await fetchNominatimGeo(comm.nfr, selW.nom_fr, 'Algeria');
  let clat, clng;
  if (geoNom) {
    selCLayer = L.geoJSON(geoNom, {
      style: { color: '#8b4513', weight: 2, fillColor: 'rgba(139,69,19,0.08)', fillOpacity: 1 }
    }).addTo(map);
    map.flyToBounds(selCLayer.getBounds(), { padding: [50, 50], duration: 0.75 });
    const c = selCLayer.getBounds().getCenter();
    clat = c.lat; clng = c.lng;
  } else {
    clat = 28; clng = 2.5;
    map.flyTo([clat, clng], 11, { duration: 0.75 });
  }

  const wName = LANG === 'ar' ? (selW.nom_ar || selW.nom_fr) : selW.nom_fr;

  try {
    const resp = await apiFetch(`/exploitations?commune_id=${comm.id}&limit=200`);
    const farms = resp.data || [];

    farms.forEach((f, i) => {
      const fLat = f.latitude  ? parseFloat(f.latitude)  : clat + (Math.random() - .5) * 0.08;
      const fLng = f.longitude ? parseFloat(f.longitude) : clng + (Math.random() - .5) * 0.08;
      const farmName = LANG === 'ar'
        ? (f.nom_exploitation_ar || f.nom_exploitation_fr || I18N[LANG].farm_label(f.id))
        : (f.nom_exploitation_fr || f.nom_exploitation_ar || I18N[LANG].farm_label(f.id));

      const ico = L.divIcon({
        className: '',
        html: `<div class="fm" style="width:34px;height:34px;animation-delay:${i * 55}ms">🌾</div>`,
        iconSize: [34, 34], iconAnchor: [17, 17]
      });
      const mk = L.marker([fLat, fLng], { icon: ico }).addTo(farmLG);
      mk.bindTooltip(farmName, { permanent: false, direction: 'top', offset: [0, -18] });
      mk.on('click', () => openFarmPopup(mk, f, fLat, fLng));
    });

    ctxt.textContent = I18N[LANG].count_farms(farms.length, commName);
    countBadge.style.display = 'flex';
    stxt.textContent = I18N[LANG].status_commune(wName, commName, farms.length);
    showToast(farms.length
      ? I18N[LANG].toast_farms_yes(farms.length, commName)
      : I18N[LANG].toast_farms_no(commName));
  } catch (e) {
    showToast(t('err_farms'));
  }

  updateWXBar(clat, clng, commName);
  hideLoader();
}

// ═══════════════════════════════════════════════
//  FARM POPUP – مترجم
// ═══════════════════════════════════════════════
function buildPopupHTML(f, wx) {
  const lng     = I18N[LANG];
  const name    = LANG === 'ar'
    ? (f.nom_exploitation_ar || f.nom_exploitation_fr || lng.farm_label(f.id))
    : (f.nom_exploitation_fr || f.nom_exploitation_ar || lng.farm_label(f.id));
  const subtitle = LANG === 'ar'
    ? `${f.wilaya_ar || ''} / ${f.commune_ar || f.commune_fr || ''}`
    : `${f.wilaya_fr || f.wilaya_ar || ''} / ${f.commune_fr || f.commune_ar || ''}`;
  const supB  = f.superficie_batie     ? `${parseFloat(f.superficie_batie).toFixed(1)} ${lng.dr_ha}`     : lng.dr_nodata;
  const supNB = f.superficie_non_batie ? `${parseFloat(f.superficie_non_batie).toFixed(1)} ${lng.dr_ha}` : lng.dr_nodata;

  const wxHTML = wx
    ? `<div class="wx-g">
        <div class="wx-i"><span class="wi">${wx.icon}</span><span class="wv">${wx.temperature}°C</span><span class="wl">${lng.dr_heat}</span></div>
        <div class="wx-i"><span class="wi">💧</span><span class="wv">${wx.humidity}%</span><span class="wl">${lng.dr_humidity}</span></div>
        <div class="wx-i"><span class="wi">🌬️</span><span class="wv">${wx.wind_speed} ${lng.dr_km_h}</span><span class="wl">${lng.dr_wind}</span></div>
       </div>
       <div style="text-align:center;margin-top:.35rem;font-size:.65rem;color:#bbb">${lng.popup_wx_source(wx.apparent_temperature)}</div>`
    : `<div class="wx-ld">${lng.popup_wx_loading}</div>`;

  return `<div class="pop">
    <div class="pop-hd">
      <div class="pop-ic">🌿</div>
      <div><h3>${name}</h3><span>${subtitle}</span></div>
    </div>
    <div class="pop-bd">
      <div class="pr"><span class="ic">⚖️</span><span class="lb">${lng.dr_legal}:</span><span class="vl">${f.statut_juridique || lng.dr_nodata}</span></div>
      <div class="pr"><span class="ic">🌿</span><span class="lb">${lng.dr_activity}:</span><span class="vl">${f.activite || lng.dr_nodata}</span></div>
      <div class="pr"><span class="ic">📐</span><span class="lb">${lng.dr_built}:</span><span class="vl">${supB}</span></div>
      <div class="pr"><span class="ic">🏜️</span><span class="lb">${lng.dr_unbuilt}:</span><span class="vl">${supNB}</span></div>
      <div class="pr"><span class="ic">👤</span><span class="lb">${lng.dr_exploitant}:</span><span class="vl">${f.exploitant_prenom || ''} ${f.exploitant_nom || ''}</span></div>
    </div>
    <div class="wx-sec"><div class="wx-t">${lng.dr_weather}</div>${wxHTML}</div>
    <div class="pop-ft">
      <button class="pbtn pri" onclick="document.querySelector('.leaflet-popup-close-button')?.click()">${lng.popup_close}</button>
      <button class="pbtn sec" onclick="openDetails(${f.id})">${lng.popup_details}</button>
    </div>
  </div>`;
}

async function openFarmPopup(mk, f, lat, lng) {
  mk.bindPopup(L.popup({ maxWidth: 360, closeButton: true }).setContent(buildPopupHTML(f, null))).openPopup();
  try {
    const wx = await apiFetch(`/climat/actuel?lat=${lat}&lon=${lng}`);
    mk.getPopup().setContent(buildPopupHTML(f, wx));
  } catch (e) { /* keeps without weather */ }
}

// ═══════════════════════════════════════════════
//  DETAILS DRAWER – مترجم
// ═══════════════════════════════════════════════
async function openDetails(exploitationId) {
  document.querySelector('.leaflet-popup-close-button')?.click();
  drawerTitle.textContent = t('dr_loading_title');
  drawerBody.innerHTML = `<div class="wx-ld">${t('dr_loading_data')}</div>`;
  drawer.classList.add('open');

  try {
    const recs = await apiFetch(`/recensements?exploitation_id=${exploitationId}`);
    if (!recs.length) {
      drawerTitle.textContent = t('dr_no_census');
      drawerBody.innerHTML = `<p style="text-align:center;color:#aaa;padding:2rem">${t('dr_no_census_msg')}</p>`;
      return;
    }
    const details = await apiFetch(`/recensements/${recs[0].id}/details`);
    drawerTitle.textContent = `${details.recensement.exploitation} – ${details.recensement.campagne}`;
    drawerBody.innerHTML = renderDrawer(details);
  } catch (e) {
    drawerBody.innerHTML = `<p style="color:red;text-align:center">${t('dr_err_load')}</p>`;
  }
}

function renderDrawer(d) {
  const lng = I18N[LANG];
  const r   = d.recensement;
  let html  = '';

  html += section(lng.dr_info,
    `<div class="dr-grid">
      ${card(lng.dr_campagne, r.campagne)}
      ${card(lng.dr_date,     r.date_recensement)}
      ${card(lng.dr_status,   r.status)}
      ${card(lng.dr_year,     r.annee)}
    </div>`);

  if (d.superficies?.length)
    html += section(lng.dr_surf,
      `<div class="dr-grid">${d.superficies.map(s =>
        card(s.type, `${lng.dr_dry}: ${s.surface_sec} | ${lng.dr_irrigated}: ${s.surface_irrigue}`)
      ).join('')}</div>`);

  if (d.cultures?.length)
    html += section(lng.dr_cult,
      `<div class="dr-grid">${d.cultures.map(c =>
        card(c.type, `${lng.dr_dry}: ${c.surface_sec} | ${lng.dr_irrigated}: ${c.surface_irrigue}`)
      ).join('')}</div>`);

  if (d.arbres?.length)
    html += section(lng.dr_trees,
      `<div class="dr-grid">${d.arbres.map(a =>
        card(a.type, `${a.nombre} ${lng.dr_tree_unit}`)
      ).join('')}</div>`);

  if (d.cheptel?.length)
    html += section(lng.dr_cheptel,
      `<div class="dr-grid">${d.cheptel.map(c =>
        card(c.animal, `${c.nombre_total} (${lng.dr_female}: ${c.nb_femelle})`)
      ).join('')}</div>`);

  if (d.bovins?.length)
    html += section(lng.dr_bovins,
      `<div class="dr-grid">${d.bovins.map(b => card(b.categorie, b.nombre)).join('')}</div>`);

  if (d.aviculture?.length)
    html += section(lng.dr_poultry,
      `<div class="dr-grid">${d.aviculture.map(a =>
        card(a.type, `${LANG === 'ar' ? 'بياض' : 'Ponte'}: ${a.nb_ponte} | ${LANG === 'ar' ? 'لحم' : 'Chair'}: ${a.nb_chaire}`)
      ).join('')}</div>`);

  if (d.apiculture?.length)
    html += section(lng.dr_bees,
      `<div class="dr-grid">${d.apiculture.map(a =>
        card(a.ruche, `${a.nb_ruches_total} (${LANG === 'ar' ? 'ممتلئة' : 'Pleines'}: ${a.nb_ruches_pleine})`)
      ).join('')}</div>`);

  if (d.irrigation?.length)
    html += section(lng.dr_irrigation,
      `<div class="dr-grid">${d.irrigation.map(i =>
        card(i.mode, `${i.surface} ${lng.dr_ha}`)
      ).join('')}</div>`);

  if (d.batiments?.length)
    html += section(lng.dr_buildings,
      `<div class="dr-grid">${d.batiments.map(b =>
        card(b.type, `${b.nombre} × ${b.surface} ${lng.dr_m2}`)
      ).join('')}</div>`);

  if (d.materiels?.length)
    html += section(lng.dr_equipment,
      `<div class="dr-grid">${d.materiels.map(m => card(m.type, m.nombre)).join('')}</div>`);

  if (d.menage_agricole) {
    const mg = d.menage_agricole;
    html += section(lng.dr_household,
      `<div class="dr-grid">
        ${card(lng.dr_persons,  mg.nb_personnes)}
        ${card(lng.dr_adults,   mg.nb_adultes)}
        ${card(lng.dr_children, mg.nb_enfants)}
      </div>`);
  }

  if (d.intrants) {
    const inp  = d.intrants;
    const tags = [
      inp.semences_selectionnees && lng.tag_selected_seeds,
      inp.semences_certifiees    && lng.tag_cert_seeds,
      inp.bio                    && lng.tag_bio,
      inp.engrais_azotes         && lng.tag_nitrogen,
      inp.engrais_phosphates     && lng.tag_phosphate,
      inp.fumier_organique       && lng.tag_organic,
      inp.produits_phytosanitaires && lng.tag_pesticides,
    ].filter(Boolean);
    if (tags.length)
      html += section(lng.dr_inputs, tags.map(tg => `<span class="tag">${tg}</span>`).join(''));
  }

  return html;
}

function section(title, content) { return `<div class="dr-section"><h4>${title}</h4>${content}</div>`; }
function card(key, val) { return `<div class="dr-card"><div class="dk">${key}</div><div class="dv">${val ?? t('dr_nodata')}</div></div>`; }

drawerClose.addEventListener('click', () => drawer.classList.remove('open'));

// ═══════════════════════════════════════════════
//  WEATHER BAR
// ═══════════════════════════════════════════════
async function updateWXBar(lat, lng, loc) {
  wxbar.classList.remove('hidden');
  wbloc.textContent = loc;
  wbd.innerHTML = `<span class="wbld">${t('wx_loading')}</span>`;
  try {
    const wx = await apiFetch(`/climat/actuel?lat=${lat}&lon=${lng}`);
    wbi.textContent = wx.icon;
    wbd.innerHTML = `
      <span class="wbc t">${wx.temperature}°C</span>
      <span class="wbc">💧 ${wx.humidity}%</span>
      <span class="wbc">🌬️ ${wx.wind_speed} ${t('dr_km_h')}</span>
      <span class="wbc">${wx.description}</span>`;
  } catch (e) {
    wbd.innerHTML = `<span style="color:#f99;font-size:.7rem">${t('wx_unavailable')}</span>`;
  }
}

// ═══════════════════════════════════════════════
//  NOMINATIM
// ═══════════════════════════════════════════════
const NMCACHE = new Map();
async function fetchNominatimGeo(name, ...extras) {
  const q = [name, ...extras].filter(Boolean).join(', ');
  if (NMCACHE.has(q)) return NMCACHE.get(q);
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=geojson&polygon_geojson=1&limit=1`,
      { headers: { 'Accept-Language': 'fr' } }
    );
    const d = await r.json();
    const g = (d.features && d.features.length) ? d.features[0].geometry : null;
    NMCACHE.set(q, g);
    return g;
  } catch { return null; }
}

// ═══════════════════════════════════════════════
//  LANGUAGE TOGGLE – تبديل اللغة
// ═══════════════════════════════════════════════
langBtn.addEventListener('click', () => {
  LANG = LANG === 'ar' ? 'fr' : 'ar';
  applyLang();

  // تحديث الحقول الديناميكية
  if (!ci.disabled && cFull.length) {
    ci.placeholder = I18N[LANG].ph_commune_ready(cFull.length);
  }
  // تحديث شارة العدد إن كانت ظاهرة
  if (countBadge.style.display !== 'none' && selC && selW) {
    const commName = LANG === 'ar' ? (selC.nar || selC.nfr) : selC.nfr;
    // عدد المستثمرات موجود في النص الحالي – نتركه كما هو (صعب إعادته بدون تخزين)
  }

  showToast(LANG === 'ar' ? '🌐 تم التبديل إلى العربية' : '🌐 Langue changée en Français');
});

// ═══════════════════════════════════════════════
//  PANEL TOGGLE
// ═══════════════════════════════════════════════
fab.addEventListener('click', () => {
  const o = panel.classList.toggle('open');
  fab.classList.toggle('active', o);
});
pcBtn.addEventListener('click', () => { panel.classList.remove('open'); fab.classList.remove('active'); });
map.on('click', () => { panel.classList.remove('open'); fab.classList.remove('active'); });

// ═══════════════════════════════════════════════
//  RESET
// ═══════════════════════════════════════════════
function resetMap() {
  if (selWLayer) {
    try { selWLayer.setStyle(STYLE_DEFAULT); } catch (_) { map.removeLayer(selWLayer); }
    selWLayer = null;
  }
  if (selCLayer) { map.removeLayer(selCLayer); selCLayer = null; }
  farmLG.clearLayers();
  selW = null; selC = null;
  wi.value = ''; ci.value = ''; ci.disabled = true;
  ci.placeholder = t('ph_commune_init'); cFull = [];
  countBadge.style.display = 'none';
  wxbar.classList.add('hidden');
  drawer.classList.remove('open');
  stxt.textContent = t('status_default');
  map.flyTo([28, 2.5], 5, { duration: 0.85 });
  showToast(t('toast_reset'));
}
resetBtn.addEventListener('click', resetMap);

// ═══════════════════════════════════════════════
//  BOOT
// ═══════════════════════════════════════════════
map.whenReady(() => {
  loadWilayasGeoJSON();
  setTimeout(() => { hideLoader(); init(); }, 500);
});

// تطبيق اللغة الافتراضية (عربي) عند التحميل
applyLang();