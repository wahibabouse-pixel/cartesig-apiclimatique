// ============================================
// قاعدة البيانات
// ============================================
let exploitants = JSON.parse(localStorage.getItem("exploitants") || "[]");
let exploitations = JSON.parse(localStorage.getItem("exploitations") || "[]");
let farmers = JSON.parse(localStorage.getItem("farmers") || "[]");
let campaigns = JSON.parse(localStorage.getItem("campaigns") || "[]");
let drafts = JSON.parse(localStorage.getItem("drafts") || "[]");
let currentCampaignId = null;
// ============================================
// بيانات إضافية للأدمين
// ============================================
let systemUsers = JSON.parse(localStorage.getItem("systemUsers") || "[]");
let securityEvents = JSON.parse(localStorage.getItem("securityEvents") || "[]");
let currentSecurityFilter = 'all';
let currentSecuritySearch = '';

// ===== دالة تسجيل محاولات الدخول المشبوهة (يتم استدعاؤها من صفحة login) =====
function logSecurityEvent(email, ip, reason, details) {
    let newEvent = {
        id: Date.now(),
        email: email || 'غير معروف',
        ip: ip || 'غير معروف',
        reason: reason || 'محاولة غير مصرح بها',
        details: details || '',
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('ar-DZ'),
        time: new Date().toLocaleTimeString('ar-DZ')
    };
    securityEvents.unshift(newEvent);
    // الاحتفاظ فقط بآخر 1000 حدث
    if (securityEvents.length > 1000) securityEvents = securityEvents.slice(0, 1000);
    localStorage.setItem("securityEvents", JSON.stringify(securityEvents));
    updateSecurityBadge();
}

// ===== دالة إضافة مستخدم جديد (عند تسجيل الدخول الناجح) =====
function addSystemUser(name, email, role) {
    // التحقق من عدم وجود المستخدم مسبقاً
    let existing = systemUsers.find(u => u.email === email);
    if (!existing) {
        systemUsers.push({
            id: Date.now(),
            name: name,
            email: email,
            role: role || 'مراقب',
            lastLogin: new Date().toISOString(),
            createdAt: new Date().toISOString()
        });
        localStorage.setItem("systemUsers", JSON.stringify(systemUsers));
        updateUsersBadge();
    } else {
        // تحديث آخر تسجيل دخول
        existing.lastLogin = new Date().toISOString();
        localStorage.setItem("systemUsers", JSON.stringify(systemUsers));
    }
}

// ===== تحديث شارة عدد المستخدمين =====
function updateUsersBadge() {
    let usersCount = document.getElementById('usersCount');
    if (usersCount) usersCount.textContent = systemUsers.length;
}

// ===== تحديث شارة التنبيهات الأمنية =====
function updateSecurityBadge() {
    let alertsCount = document.getElementById('securityAlertsCount');
    if (alertsCount) alertsCount.textContent = securityEvents.length;
}
// ============================================
// نظام الترجمة — Bilingual helper
// ============================================
const LANG_KEY = 'rga_lang';
let currentLang = localStorage.getItem(LANG_KEY) || 'ar';

/** Return ar or fr string based on currentLang */
function L(ar, fr) { return currentLang === 'ar' ? ar : fr; }

/** Locale string for dates */
function dateLocaleStr() { return currentLang === 'ar' ? 'ar-DZ' : 'fr-FR'; }

/** Yes / No display */
function ynL(val) {
    if (val === 'نعم' || val === 'Oui' || val === true || val === 'yes') return L('نعم ✓', 'Oui ✓');
    return L('لا ✗', 'Non ✗');
}
function undL(val) { return val || L('غير محدد', 'Non défini'); }

// إذا لم توجد حملات، أنشئ حملة افتراضية
if (campaigns.length === 0) {
    campaigns.push({ id: Date.now(), name: L("الحملة التجريبية 2026", "Campagne pilote 2026"), region: L("الجزائر", "Algérie"), startDate: new Date().toISOString(), status: "active", description: L("حملة إحصاء تجريبية", "Campagne de recensement pilote"), createdAt: new Date().toISOString() });
    localStorage.setItem("campaigns", JSON.stringify(campaigns));
}

// ============================================
// دوال مساعدة
// ============================================
function showToast(message, type) {
    let toast = document.createElement("div");
    toast.className = "toast-message";
    toast.style.cssText = "position:fixed;top:20px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#1C4B2D,#2E6B3E);color:white;padding:15px 30px;border-radius:50px;z-index:9999;font-weight:600;border:1px solid #D4AF37;";
    if (type === "error") toast.style.background = "linear-gradient(135deg,#8b0000,#a52a2a)";
    if (type === "success") toast.style.background = "linear-gradient(135deg,#28a745,#218838)";
    toast.innerHTML = `<i class="fas fa-${type === "success" ? "check-circle" : "exclamation-circle"}"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

let currentActivePage = 'dashboard';

function showPage(pageId) {




// داخل دالة showPage(pageId) في ملف admin.js
if (pageId === 'gis') {
    // إعادة تحميل الإطار لضمان تحديث البيانات الجغرافية
    const iframe = document.querySelector('#gis iframe');
    if(iframe) iframe.src = iframe.src; 
}










    currentActivePage = pageId;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    if (pageId === 'exploitants') renderExploitantsList();
    if (pageId === 'exploitations') renderExploitationsList();
    if (pageId === 'campaigns') { renderCampaignsList(); updateCampaignsStats(); }
    if (pageId === 'drafts') renderDrafts();
    if (pageId === 'dashboard') updateDashboardStats();
    if (pageId === 'campaigns') {
    renderCampaignsList();
    updateCampaignsStats();
    updateActiveCampaignBar();  
}
else if (pageId === 'users') {
    renderUsersPage();
} else if (pageId === 'gis') {
    // الصفحة فارغة - لا تحتاج إلى شيء
} else if (pageId === 'securityMonitor') {
    renderSecurityMonitorPage();
} else if (pageId === 'database') {
    renderDatabasePage();
}
if (pageId === 'supervisors') {
    renderSupervisorActivityPage();
}
if (pageId === 'userLogs') {
    renderUserLogsPage();
}
}

function updateDashboardStats() {
    document.getElementById("farmerCount").textContent = farmers.length;
    let totalArea = farmers.reduce((s, f) => s + (parseFloat(f.superficie) || 0), 0);
    document.getElementById("totalArea").textContent = totalArea.toFixed(2);
    let totalAnimals = farmers.reduce((s, f) => s + (parseInt(f.bovins)||0) + (parseInt(f.ovins)||0) + (parseInt(f.caprins)||0), 0);
    document.getElementById("totalAnimals").textContent = totalAnimals;
    document.getElementById("draftCount").textContent = drafts.length;
  // تحديث إحصائيات الأدمين في لوحة التحكم
let usersCountEl = document.getElementById('usersCount');
if (usersCountEl) usersCountEl.textContent = systemUsers.length;
let securityAlertsEl = document.getElementById('securityAlertsCount');
if (securityAlertsEl) securityAlertsEl.textContent = securityEvents.length;
 }

// ============================================
// إدارة المستغلين (الفلاحون) - الحقول 1-31
// ============================================
function showAddExploitantModal() {
    document.getElementById("addExploitantModal").style.display = "flex";
}

function closeAddExploitantModal() {
    document.getElementById("addExploitantModal").style.display = "none";
}

function saveNewExploitant() {
    let nom = document.getElementById("newExploitantNom").value;
    let prenom = document.getElementById("newExploitantPrenom").value;
    if (!nom || !prenom) { showToast(L("الرجاء إدخال اللقب والاسم", "Veuillez saisir le nom et le prénom"), "error"); return; }
    
    let newExploitant = {
        id: Date.now(),
        // الحقول 1-12
        passDay: document.getElementById("newExploitantPassDay").value,
        passMonth: document.getElementById("newExploitantPassMonth").value,
        passYear: document.getElementById("newExploitantPassYear").value,
        recenseurNom: document.getElementById("newExploitantRecenseurNom").value,
        recenseurPrenom: document.getElementById("newExploitantRecenseurPrenom").value,
        controlDay: document.getElementById("newExploitantControlDay").value,
        controlMonth: document.getElementById("newExploitantControlMonth").value,
        controlYear: document.getElementById("newExploitantControlYear").value,
        controleurNom: document.getElementById("newExploitantControleurNom").value,
        controleurPrenom: document.getElementById("newExploitantControleurPrenom").value,
        wilaya2: document.getElementById("newExploitantWilaya2").value,
        commune: document.getElementById("newExploitantCommune").value,
        code1: document.getElementById("newExploitantCode1").value,
        code2: document.getElementById("newExploitantCode2").value,
        code3: document.getElementById("newExploitantCode3").value,
        code4: document.getElementById("newExploitantCode4").value,
        lieuDit: document.getElementById("newExploitantLieuDit").value,
        district1: document.getElementById("newExploitantDistrict1").value,
        district2: document.getElementById("newExploitantDistrict2").value,
        numExploitation: document.getElementById("newExploitantNumExploitation").value,
        // الحقول 13-31
        nom: nom, prenom: prenom,
        birthYear: document.getElementById("newExploitantBirthYear").value,
        sexe: document.querySelector('input[name="newExploitantSexe"]:checked')?.value || "",
        education: document.querySelector('input[name="newExploitantEducation"]:checked')?.value || "",
        formation: document.querySelector('input[name="newExploitantFormation"]:checked')?.value || "",
        adresse: document.getElementById("newExploitantAdresse").value,
        phone1: document.getElementById("newExploitantPhone1").value,
        phone2: document.getElementById("newExploitantPhone2").value,
        phone3: document.getElementById("newExploitantPhone3").value,
        phone4: document.getElementById("newExploitantPhone4").value,
        phone5: document.getElementById("newExploitantPhone5").value,
        email: document.getElementById("newExploitantEmail").value,
        nin1: document.getElementById("newExploitantNin1").value, nin2: document.getElementById("newExploitantNin2").value,
        nin3: document.getElementById("newExploitantNin3").value, nin4: document.getElementById("newExploitantNin4").value,
        nin5: document.getElementById("newExploitantNin5").value, nin6: document.getElementById("newExploitantNin6").value,
        nis1: document.getElementById("newExploitantNis1").value, nis2: document.getElementById("newExploitantNis2").value,
        nis3: document.getElementById("newExploitantNis3").value, nis4: document.getElementById("newExploitantNis4").value,
        nis5: document.getElementById("newExploitantNis5").value,
        carte1: document.getElementById("newExploitantCarte1").value, carte2: document.getElementById("newExploitantCarte2").value,
        carte3: document.getElementById("newExploitantCarte3").value, carte4: document.getElementById("newExploitantCarte4").value,
        inscritCAW: document.getElementById("newExploitantInscritCAW")?.checked || false,
        inscritCAPA: document.getElementById("newExploitantInscritCAPA")?.checked || false,
        inscritUNPA: document.getElementById("newExploitantInscritUNPA")?.checked || false,
        inscritCARM: document.getElementById("newExploitantInscritCARM")?.checked || false,
        inscritCCW: document.getElementById("newExploitantInscritCCW")?.checked || false,
        assuranceType26: document.querySelector('input[name="newExploitantAssuranceType"]:checked')?.value || "",
        famille: document.querySelector('input[name="newExploitantFamille"]:checked')?.value || "",
        roleExploitant: document.querySelector('input[name="newExploitantRole"]:checked')?.value || "",
        coExploitantsCount: document.getElementById("newExploitantCoExploitants").value,
        nature: document.querySelector('input[name="newExploitantNature"]:checked')?.value || "",
        dateCreation: new Date().toISOString()
    };
    
    exploitants.push(newExploitant);
    localStorage.setItem("exploitants", JSON.stringify(exploitants));
    closeAddExploitantModal();
    renderExploitantsList();
    updateExploitantsSelects();
    showToast(L("تم إضافة المستغل بنجاح", "Exploitant ajouté avec succès"), "success");
}

function renderExploitantsList() {
    let container = document.getElementById("exploitantsList");
    if (!container) return;
    if (exploitants.length === 0) { container.innerHTML = `<div style='text-align:center;padding:60px;'>${L('لا يوجد مستغلين', 'Aucun exploitant')}</div>`; document.getElementById("exploitantsCount").textContent = "0"; return; }
    container.innerHTML = exploitants.map(e => `
        <div class="file-card pending">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;">
                <div><i class="fas fa-user-tie"></i> <strong>${e.nom} ${e.prenom}</strong><br><small>${e.phone1 || ""}${e.phone2 || ""}${e.phone3 || ""}${e.phone4 || ""}${e.phone5 || ""}</small></div>
                <div><button class="btn btn-sm btn-view" onclick="viewExploitant(${e.id})">${L('عرض', 'Voir')}</button> <button class="btn btn-sm btn-danger" onclick="deleteExploitant(${e.id})">${L('حذف', 'Supprimer')}</button></div>
            </div>
        </div>
    `).join('');
    document.getElementById("exploitantsCount").textContent = exploitants.length;
}

function viewExploitant(id) {
    let e = exploitants.find(x => x.id == id);
    if(!e) return;
    alert(`👤 ${L('المستغل', 'Exploitant')}: ${e.nom} ${e.prenom}\n📞 ${L('الهاتف', 'Tél')}: ${e.phone1}${e.phone2}${e.phone3}${e.phone4}${e.phone5}\n📧 ${L('البريد', 'Email')}: ${e.email}\n📍 ${L('الولاية', 'Wilaya')}: ${e.wilaya2}\n🎓 ${L('التعليم', 'Instruction')}: ${e.education}\n🌱 ${L('التكوين', 'Formation')}: ${e.formation}`);
}

function deleteExploitant(id) {
    if(!confirm(L("هل أنت متأكد؟", "Êtes-vous sûr ?"))) return;
    exploitants = exploitants.filter(x => x.id != id);
    exploitations = exploitations.filter(x => x.exploitantId != id);
    localStorage.setItem("exploitants", JSON.stringify(exploitants));
    localStorage.setItem("exploitations", JSON.stringify(exploitations));
    renderExploitantsList();
    renderExploitationsList();
    updateExploitantsSelects();
    showToast(L("تم الحذف", "Supprimé"), "success");
}

// ============================================
// إدارة المستغلات (المزارع) - الحقول 32-74
// ============================================
function showAddExploitationModal() {
    updateExploitantsSelects();
    document.getElementById("addExploitationModal").style.display = "flex";
    document.getElementById("exploitationFormFields").style.display = "none";
    document.getElementById("saveExploitationBtn").disabled = true;
}

function closeAddExploitationModal() {
    document.getElementById("addExploitationModal").style.display = "none";
}

function checkExploitantSelected() {
    let id = document.getElementById("newExploitationExploitantId").value;
    if(id) { document.getElementById("exploitationFormFields").style.display = "block"; document.getElementById("saveExploitationBtn").disabled = false; }
    else { document.getElementById("exploitationFormFields").style.display = "none"; document.getElementById("saveExploitationBtn").disabled = true; }
}

function saveNewExploitation() {
    let exploitantId = document.getElementById("newExploitationExploitantId").value;
    let nom = document.getElementById("newExploitationNom").value;
    if(!exploitantId || !nom) { showToast(L("اختر فلاحاً وأدخل اسم المستغلة", "Choisir un agriculteur et saisir le nom de l'exploitation"), "error"); return; }
    let exploitant = exploitants.find(e => e.id == exploitantId);
    
    let newExploitation = {
        id: Date.now(),
        exploitantId: parseInt(exploitantId),
        exploitantNom: exploitant ? `${exploitant.nom} ${exploitant.prenom}` : L("غير محدد", "Non défini"),
        // الحقول 32-43
        nom: nom,
        adresse: document.getElementById("newExploitationAdresse").value,
        statut: document.getElementById("newExploitationStatut").value,
        longitude: document.getElementById("newExploitationLongitude").value,
        latitude: document.getElementById("newExploitationLatitude").value,
        vocation: document.getElementById("newExploitationVocation").value,
        terreAnimal: document.getElementById("newExploitationTerreAnimal").value,
        access: document.getElementById("newExploitationAccess").value,
        electricite: document.getElementById("newExploitationElectricite").value,
        telephone: document.getElementById("newExploitationTelephone").value,
        typeTel: document.getElementById("newExploitationTypeTel").value,
        internet: document.getElementById("newExploitationInternet").value,
        internetAgricole: document.getElementById("newExploitationInternetAgricole").value,
        // الحقول 47-63
        herbaceeIrriguee: document.getElementById("newExploitationHerbaceeIrriguee").value,
        herbaceeSec: document.getElementById("newExploitationHerbaceeSec").value,
        jacherIrriguee: document.getElementById("newExploitationJacherIrriguee").value,
        jacherSec: document.getElementById("newExploitationJacherSec").value,
        perenesIrriguee: document.getElementById("newExploitationPerenesIrriguee").value,
        perenesSec: document.getElementById("newExploitationPerenesSec").value,
        prairieIrriguee: document.getElementById("newExploitationPrairieIrriguee").value,
        prairieSec: document.getElementById("newExploitationPrairieSec").value,
        sauIrriguee: document.getElementById("newExploitationSauIrriguee").value,
        sauSec: document.getElementById("newExploitationSauSec").value,
        pacages: document.getElementById("newExploitationPacages").value,
        superficieNonProductive: document.getElementById("newExploitationSuperficieNonProductive").value,
        superficie: document.getElementById("newExploitationSuperficie").value,
        forets: document.getElementById("newExploitationForets").value,
        superficieTotale: document.getElementById("newExploitationSuperficieTotale").value,
        unBloc: document.getElementById("newExploitationUnBloc").value,
        nombreBlocs: document.getElementById("newExploitationNombreBlocs").value,
        indusOccupants: document.getElementById("newExploitationIndusOccupants").value,
        surfaceBatie: document.getElementById("newExploitationSurfaceBatie").value,
        energieReseau: document.getElementById("newExploitationEnergieReseau")?.checked || false,
        energieGroupe: document.getElementById("newExploitationEnergieGroupe")?.checked || false,
        energieSolaire: document.getElementById("newExploitationEnergieSolaire")?.checked || false,
        energieEolienne: document.getElementById("newExploitationEnergieEolienne")?.checked || false,
        // الحقول 65-74
        arbresOliviers: document.getElementById("newExploitationArbresOliviers").value,
        arbresFiguiers: document.getElementById("newExploitationArbresFiguiers").value,
        arbresNoyaux: document.getElementById("newExploitationArbresNoyaux").value,
        arbresVigne: document.getElementById("newExploitationArbresVigne").value,
        arbresGrenadiers: document.getElementById("newExploitationArbresGrenadiers").value,
        arbresAmandiers: document.getElementById("newExploitationArbresAmandiers").value,
        arbresCognassiers: document.getElementById("newExploitationArbresCognassiers").value,
        arbresPalmiers: document.getElementById("newExploitationArbresPalmiers").value,
        arbresCaroubier: document.getElementById("newExploitationArbresCaroubier").value,
        arbresAutres: document.getElementById("newExploitationArbresAutres").value,
        dateCreation: new Date().toISOString()
    };
    
    exploitations.push(newExploitation);
    localStorage.setItem("exploitations", JSON.stringify(exploitations));
    closeAddExploitationModal();
    renderExploitationsList();
    showToast(L("تم إضافة المستغلة بنجاح", "Exploitation ajoutée avec succès"), "success");
}

function renderExploitationsList() {
    let container = document.getElementById("exploitationsList");
    if(!container) return;
    if(exploitations.length === 0) { container.innerHTML = `<div style='text-align:center;padding:60px;'>${L('لا يوجد مستغلات', 'Aucune exploitation')}</div>`; document.getElementById("exploitationsCount").textContent = "0"; return; }
    container.innerHTML = exploitations.map(e => `
        <div class="file-card pending">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;">
                <div><i class="fas fa-tractor"></i> <strong>${e.nom}</strong><br><small>${L('الفلاح', 'Agriculteur')}: ${e.exploitantNom} | ${L('المساحة', 'Superficie')}: ${e.superficie || "0"} ${L('هكتار', 'ha')}</small></div>
                <div><button class="btn btn-sm btn-view" onclick="viewExploitation(${e.id})">${L('عرض', 'Voir')}</button> <button class="btn btn-sm btn-danger" onclick="deleteExploitation(${e.id})">${L('حذف', 'Supprimer')}</button></div>
            </div>
        </div>
    `).join('');
    document.getElementById("exploitationsCount").textContent = exploitations.length;
}

function viewExploitation(id) {
    let e = exploitations.find(x => x.id == id);
    if(!e) return;
    alert(`🏢 ${L('المستغلة', 'Exploitation')}: ${e.nom}\n👤 ${L('الفلاح', 'Agriculteur')}: ${e.exploitantNom}\n📍 ${L('العنوان', 'Adresse')}: ${e.adresse}\n⚖️ ${L('الوضع القانوني', 'Statut juridique')}: ${e.statut}\n🌾 ${L('النشاط', 'Activité')}: ${e.vocation}\n📏 ${L('المساحة', 'Superficie')}: ${e.superficie || "0"} ${L('هكتار', 'ha')}`);
}

function deleteExploitation(id) {
    if(!confirm(L("هل أنت متأكد؟", "Êtes-vous sûr ?"))) return;
    exploitations = exploitations.filter(x => x.id != id);
    localStorage.setItem("exploitations", JSON.stringify(exploitations));
    renderExploitationsList();
    showToast(L("تم الحذف", "Supprimé"), "success");
}

// ============================================
// تحديث القوائم المنسدلة
// ============================================
function updateExploitantsSelects() {
    let select1 = document.getElementById("newExploitationExploitantId");
    let select2 = document.getElementById("surveyExploitantSelect");
    let defaultOpt = `<option value=''>${L('-- اختر فلاحاً --', '-- Choisir un agriculteur --')}</option>`;
    if(select1) select1.innerHTML = defaultOpt + exploitants.map(e => `<option value="${e.id}">${e.nom} ${e.prenom}</option>`).join("");
    if(select2) select2.innerHTML = defaultOpt + exploitants.map(e => `<option value="${e.id}">${e.nom} ${e.prenom}</option>`).join("");
}

// ============================================
// إنشاء ملف إحصاء داخل الحملة - الحقول 75-171
// ============================================
function showNewSurveyFileModal() {
    if(!currentCampaignId) { showToast(L("الرجاء اختيار حملة أولاً", "Veuillez d'abord choisir une campagne"), "error"); return; }
    updateExploitantsSelects();
    document.getElementById("newSurveyFileModal").style.display = "flex";
    document.getElementById("surveyExploitationSelect").innerHTML = `<option value=''>${L('-- اختر فلاحاً أولاً --', '-- Choisir un agriculteur d\'abord --')}</option>`;
    document.getElementById("surveyExploitationSelect").disabled = true;
    document.getElementById("surveyRemainingFields").style.display = "none";
    document.getElementById("saveSurveyFileBtn").disabled = true;
}

function closeNewSurveyFileModal() {
    document.getElementById("newSurveyFileModal").style.display = "none";
}

function loadExploitationsForSurvey() {
    let exploitantId = document.getElementById("surveyExploitantSelect").value;
    let exploitationsSelect = document.getElementById("surveyExploitationSelect");
    if(!exploitantId) {
        exploitationsSelect.innerHTML = `<option value=''>${L('-- اختر فلاحاً أولاً --', '-- Choisir un agriculteur d\'abord --')}</option>`;
        exploitationsSelect.disabled = true;
        document.getElementById("surveyRemainingFields").style.display = "none";
        document.getElementById("saveSurveyFileBtn").disabled = true;
        return;
    }
    
    let filtered = exploitations.filter(e => e.exploitantId == exploitantId);
    if(filtered.length === 0) {
        exploitationsSelect.innerHTML = `<option value=''>${L('-- لا توجد مستغلات لهذا الفلاح --', '-- Aucune exploitation pour cet agriculteur --')}</option>`;
        exploitationsSelect.disabled = false;
        document.getElementById("surveyRemainingFields").style.display = "none";
        document.getElementById("saveSurveyFileBtn").disabled = true;
    } else {
        exploitationsSelect.innerHTML = `<option value=''>${L('-- اختر مستغلة --', '-- Choisir une exploitation --')}</option>` + filtered.map(e => `<option value="${e.id}">${e.nom}</option>`).join("");
        exploitationsSelect.disabled = false;
        document.getElementById("surveyRemainingFields").style.display = "block";
        document.getElementById("saveSurveyFileBtn").disabled = false;
    }
}

function toggleFiliereGroup() {
    let val = document.getElementById("surveyContractuelle").value;
    document.getElementById("filiereGroup").style.display = val === "نعم" ? "block" : "none";
}

function toggleAssuranceCompanies() {
    let val = document.getElementById("surveyAssuranceAgricole").value;
    document.getElementById("assuranceCompanyGroup").style.display = val === "نعم" ? "block" : "none";
}

function saveSurveyFile() {
    let exploitantId = document.getElementById("surveyExploitantSelect").value;
    let exploitationId = document.getElementById("surveyExploitationSelect").value;
    if(!exploitantId || !exploitationId) { showToast(L("اختر الفلاح والمستغلة", "Choisir l'agriculteur et l'exploitation"), "error"); return; }
    let exploitant = exploitants.find(e => e.id == exploitantId);
    let exploitation = exploitations.find(e => e.id == exploitationId);
    
    let surveyFile = {
        id: Date.now(),
        campaignId: currentCampaignId,
        exploitantId: parseInt(exploitantId),
        exploitationId: parseInt(exploitationId),
        exploitantNom: exploitant ? `${exploitant.nom} ${exploitant.prenom}` : "",
        exploitationNom: exploitation ? exploitation.nom : "",
        date: new Date().toISOString(),
        status: "pending",
        // الحقول 75-81
        biologique: document.getElementById("surveyBiologique").value,
        certificatBio: document.getElementById("surveyCertificatBio").value,
        aquaculture: document.getElementById("surveyAquaculture").value,
        helicicult: document.getElementById("surveyHelicicult").value,
        myciculture: document.getElementById("surveyMyciculture").value,
        contractuelle: document.getElementById("surveyContractuelle").value,
        filiereTomate: document.getElementById("surveyFiliereTomate")?.checked || false,
        filiereHuile: document.getElementById("surveyFiliereHuile")?.checked || false,
        filiereAviculture: document.getElementById("surveyFiliereAviculture")?.checked || false,
        filiereMaraichage: document.getElementById("surveyFiliereMaraichage")?.checked || false,
        filierePomme: document.getElementById("surveyFilierePomme")?.checked || false,
        filiereAutre: document.getElementById("surveyFiliereAutre")?.checked || false,
        // الحقول 82-105
        bovins: document.getElementById("surveyBovins").value,
        bovinsBLL: document.getElementById("surveyBovinsBLL").value,
        bovinsBLA: document.getElementById("surveyBovinsBLA").value,
        bovinsBLM: document.getElementById("surveyBovinsBLM").value,
        ovins: document.getElementById("surveyOvins").value,
        ovinsBrebis: document.getElementById("surveyOvinsBrebis").value,
        caprins: document.getElementById("surveyCaprins").value,
        caprinsChevres: document.getElementById("surveyCaprinsChevres").value,
        camelins: document.getElementById("surveyCamelins").value,
        camelinsFemelles: document.getElementById("surveyCamelinsFemelles").value,
        equins: document.getElementById("surveyEquins").value,
        equinsFemelles: document.getElementById("surveyEquinsFemelles").value,
        pouletsChair: document.getElementById("surveyPouletsChair").value,
        dindes: document.getElementById("surveyDindes").value,
        autreAviculture: document.getElementById("surveyAutreAviculture").value,
        mulets: document.getElementById("surveyMulets").value,
        anes: document.getElementById("surveyAnes").value,
        lapins: document.getElementById("surveyLapins").value,
        ruchesModernes: document.getElementById("surveyRuchesModernes").value,
        ruchesModernesPleines: document.getElementById("surveyRuchesModernesPleines").value,
        ruchesTraditionnelles: document.getElementById("surveyRuchesTraditionnelles").value,
        ruchesTraditionnellesPleines: document.getElementById("surveyRuchesTraditionnellesPleines").value,
        // الحقول 106-122
        batimentsHabitationNb: document.getElementById("surveyBatimentsHabitationNb").value,
        batimentsHabitationSurface: document.getElementById("surveyBatimentsHabitationSurface").value,
        bergeriesNb: document.getElementById("surveyBergeriesNb").value,
        bergeriesCapacite: document.getElementById("surveyBergeriesCapacite").value,
        etablesNb: document.getElementById("surveyEtablesNb").value,
        etablesCapacite: document.getElementById("surveyEtablesCapacite").value,
        ecuriesNb: document.getElementById("surveyEcuriesNb").value,
        ecuriesCapacite: document.getElementById("surveyEcuriesCapacite").value,
        poulaillerNb: document.getElementById("surveyPoulaillerNb").value,
        poulaillerCapacite: document.getElementById("surveyPoulaillerCapacite").value,
        pserresNb: document.getElementById("surveyPserresNb").value,
        pserresCapacite: document.getElementById("surveyPserresCapacite").value,
        serresTunnelNb: document.getElementById("surveySerresTunnelNb").value,
        serresTunnelSurface: document.getElementById("surveySerresTunnelSurface").value,
        mulserresNb: document.getElementById("surveyMulserresNb").value,
        mulserresSurface: document.getElementById("surveyMulserresSurface").value,
        stockageNb: document.getElementById("surveyStockageNb").value,
        stockageCapacite: document.getElementById("surveyStockageCapacite").value,
        prodAgriNb: document.getElementById("surveyProdAgriNb").value,
        prodAgriCapacite: document.getElementById("surveyProdAgriCapacite").value,
        uniteConNb: document.getElementById("surveyUniteConNb").value,
        uniteConCapacite: document.getElementById("surveyUniteConCapacite").value,
        uniteTransfoNb: document.getElementById("surveyUniteTransfoNb").value,
        uniteTransfoCapacite: document.getElementById("surveyUniteTransfoCapacite").value,
        centreLaitNb: document.getElementById("surveyCentreLaitNb").value,
        centreLaitCapacite: document.getElementById("surveyCentreLaitCapacite").value,
        autresBatimentsNb: document.getElementById("surveyAutresBatimentsNb").value,
        autresBatimentsCapacite: document.getElementById("surveyAutresBatimentsCapacite").value,
        chambresFroidesNb: document.getElementById("surveyChambresFroidesNb").value,
        chambresFroidesCapacite: document.getElementById("surveyChambresFroidesCapacite").value,
        // الحقول 127-144
        sourcePuits: document.getElementById("surveySourcePuits")?.checked || false,
        sourceForage: document.getElementById("surveySourceForage")?.checked || false,
        sourcePompage: document.getElementById("surveySourcePompage")?.checked || false,
        sourceCrues: document.getElementById("surveySourceCrues")?.checked || false,
        sourceBarrage: document.getElementById("surveySourceBarrage")?.checked || false,
        sourceRetenu: document.getElementById("surveySourceRetenu")?.checked || false,
        sourceFoggara: document.getElementById("surveySourceFoggara")?.checked || false,
        sourceSource: document.getElementById("surveySourceSource")?.checked || false,
        irrigation: document.getElementById("surveyIrrigation").value,
        areaIrriguee: document.getElementById("surveyAreaIrriguee").value,
        culturesIrriguees: document.getElementById("surveyCulturesIrriguees").value,
        // الحقول 147-156
        coexplMalePlein: document.getElementById("surveyCoexplMalePlein").value,
        coexplFemalePlein: document.getElementById("surveyCoexplFemalePlein").value,
        coexplMalePartiel: document.getElementById("surveyCoexplMalePartiel").value,
        coexplFemalePartiel: document.getElementById("surveyCoexplFemalePartiel").value,
        ouvMaleP: document.getElementById("surveyOuvMaleP").value,
        ouvFemaleP: document.getElementById("surveyOuvFemaleP").value,
        ouvMaleJ: document.getElementById("surveyOuvMaleJ").value,
        ouvFemaleJ: document.getElementById("surveyOuvFemaleJ").value,
        etrangMaleP: document.getElementById("surveyEtrangMaleP").value,
        etrangFemaleP: document.getElementById("surveyEtrangFemaleP").value,
        etrangMaleJ: document.getElementById("surveyEtrangMaleJ").value,
        etrangFemaleJ: document.getElementById("surveyEtrangFemaleJ").value,
        indivMaleP: document.getElementById("surveyIndivMaleP").value,
        indivFemaleP: document.getElementById("surveyIndivFemaleP").value,
        childMale: document.getElementById("surveyChildMale").value,
        childFemale: document.getElementById("surveyChildFemale").value,
        sansEmploiM: document.getElementById("surveySansEmploiM").value,
        sansEmploiF: document.getElementById("surveySansEmploiF").value,
        filetSocial: document.getElementById("surveyFiletSocial").value,
        // الحقول 157-159
        familyMale: document.getElementById("surveyFamilyMale").value,
        familyFemale: document.getElementById("surveyFamilyFemale").value,
        adulteMale: document.getElementById("surveyAdulteMale").value,
        adultesFemale: document.getElementById("surveyAdultesFemale").value,
        familyChildMale: document.getElementById("surveyFamilyChildMale").value,
        familyChildFemale: document.getElementById("surveyFamilyChildFemale").value,
        // الحقول 160
        semencesSelectionnees: document.getElementById("surveySemencesSelectionnees")?.checked || false,
        semencesCertifiees: document.getElementById("surveySemencesCertifiees")?.checked || false,
        semencesBio: document.getElementById("surveySemencesBio")?.checked || false,
        semencesFerme: document.getElementById("surveySemencesFerme")?.checked || false,
        engraisAzotes: document.getElementById("surveyEngraisAzotes")?.checked || false,
        engraisPhosphates: document.getElementById("surveyEngraisPhosphates")?.checked || false,
        fumureOrganique: document.getElementById("surveyFumureOrganique")?.checked || false,
        produitsPhyto: document.getElementById("surveyProduitsPhyto")?.checked || false,
        // الحقول 161-166
        financePropress: document.getElementById("surveyFinancePropress")?.checked || false,
        financeCredit: document.getElementById("surveyFinanceCredit")?.checked || false,
        financeSoutien: document.getElementById("surveyFinanceSoutien")?.checked || false,
        financeEmprunt: document.getElementById("surveyFinanceEmprunt")?.checked || false,
        typeCredit: document.getElementById("surveyTypeCredit").value,
        typeSoutien: document.getElementById("surveyTypeSoutien").value,
        assuranceAgricole: document.getElementById("surveyAssuranceAgricole").value,
        compagnieAssurance: document.getElementById("surveyCompagnieAssurance").value,
        assuranceTerre: document.getElementById("surveyAssuranceTerre")?.checked || false,
        assuranceMaterial: document.getElementById("surveyAssuranceMaterial")?.checked || false,
        assuranceMahassel: document.getElementById("surveyAssuranceMahassel")?.checked || false,
        assuranceMawachi: document.getElementById("surveyAssuranceMawachi")?.checked || false,
        // الحقول 167-171
        fournisseurs: document.getElementById("surveyFournisseurs").value,
        proximiteBanque: document.getElementById("surveyProximiteBanque")?.checked || false,
        proximitePoste: document.getElementById("surveyProximitePoste")?.checked || false,
        proximiteVet: document.getElementById("surveyProximiteVet")?.checked || false,
        proximiteCooperative: document.getElementById("surveyProximiteCooperative")?.checked || false,
        ventePied: document.getElementById("surveyVentePied")?.checked || false,
        venteGros: document.getElementById("surveyVenteGros")?.checked || false,
        venteDirecte: document.getElementById("surveyVenteDirecte")?.checked || false,
        marcheLocal: document.getElementById("surveyMarcheLocal")?.checked || false,
        marcheNational: document.getElementById("surveyMarcheNational")?.checked || false,
        marcheInternational: document.getElementById("surveyMarcheInternational")?.checked || false,
        cooperativeAgricole: document.getElementById("surveyCooperativeAgricole")?.checked || false,
        associationProfessionnelle: document.getElementById("surveyAssociationProfessionnelle")?.checked || false,
        groupeInteret: document.getElementById("surveyGroupeInteret")?.checked || false
    };
    
    farmers.push(surveyFile);
    localStorage.setItem("farmers", JSON.stringify(farmers));
    closeNewSurveyFileModal();
    showToast(L("تم حفظ ملف الإحصاء بنجاح", "Dossier de recensement enregistré avec succès"), "success");
    if(currentCampaignId) renderCampaignFilesList(currentCampaignId);
    updateDashboardStats();
}

// ============================================
// إدارة الحملات
// ============================================
function renderCampaignsList() {
    let container = document.getElementById("campaignsList");
    if(!container) return;
    if(campaigns.length === 0) { container.innerHTML = `<div style='text-align:center;padding:60px;'>${L('لا توجد حملات', 'Aucune campagne')}</div>`; return; }
    container.innerHTML = campaigns.map(c => `
        <div class="file-card pending" style="margin-bottom:15px;padding:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;">
                <div><i class="fas fa-chart-line"></i> <strong>${c.name}</strong><br><small>${c.region || L("كل التراب", "Tout le territoire")} | ${new Date(c.startDate).toLocaleDateString(dateLocaleStr())}</small></div>
                <div><button class="btn btn-sm btn-primary" onclick="selectCampaign(${c.id})">${L('فتح', 'Ouvrir')}</button> <button class="btn btn-sm btn-danger" onclick="deleteCampaign(${c.id})">${L('حذف', 'Supprimer')}</button></div>
            </div>
        </div>
    `).join('');
}

function selectCampaign(id) {
    let campaign = campaigns.find(c => c.id == id);
    if (campaign.status === 'completed') {
        showToast(L("لا يمكن فتح حملة مكتملة. الحملة مغلقة.", "Impossible d'ouvrir une campagne terminée."), "warning");
        return;
    }
    
    currentCampaignId = id;
    document.getElementById("campaignDetailsTitle").innerHTML = campaign.name;
    document.getElementById("campaignDetailsDesc").innerHTML = campaign.description || L("لا يوجد وصف", "Pas de description");
    renderCampaignFilesList(id);
    showPage('campaignDetails');
}

function backToCampaigns() {
    currentCampaignId = null;
    showPage('campaigns');
    renderCampaignsList();
}

function renderCampaignFilesList(campaignId) {
    let container = document.getElementById("campaignFilesList");
    if(!container) return;
    let files = farmers.filter(f => f.campaignId == campaignId);
    if(files.length === 0) { container.innerHTML = `<div style='text-align:center;padding:60px;'>${L('لا توجد ملفات إحصاء', 'Aucun dossier de recensement')}</div>`; return; }
    container.innerHTML = files.map(f => `
        <div class="file-card pending">
            <div><i class="fas fa-user-tie"></i> <strong>${f.exploitantNom}</strong><br><small>${L('المستغلة', 'Exploitation')}: ${f.exploitationNom} | ${L('التاريخ', 'Date')}: ${new Date(f.date).toLocaleDateString(dateLocaleStr())}</small></div>
            <div style="margin-top:10px;"><button class="btn btn-sm btn-view" onclick="viewSurveyFile(${f.id})">${L('عرض', 'Voir')}</button> <button class="btn btn-sm btn-danger" onclick="deleteSurveyFile(${f.id})">${L('حذف', 'Supprimer')}</button></div>
        </div>
    `).join('');
}

function viewSurveyFile(id) {
    let f = farmers.find(x => x.id == id);
    if(!f) return;
    alert(`📄 ${L('ملف إحصاء', 'Dossier de recensement')}\n👤 ${L('الفلاح', 'Agriculteur')}: ${f.exploitantNom}\n🏢 ${L('المستغلة', 'Exploitation')}: ${f.exploitationNom}\n🐄 ${L('الأبقار', 'Bovins')}: ${f.bovins || 0}\n🐑 ${L('الأغنام', 'Ovins')}: ${f.ovins || 0}\n📅 ${L('تاريخ التسجيل', 'Date d\'enregistrement')}: ${new Date(f.date).toLocaleDateString(dateLocaleStr())}`);
}

function deleteSurveyFile(id) {
    if(!confirm(L("هل أنت متأكد؟", "Êtes-vous sûr ?"))) return;
    farmers = farmers.filter(f => f.id != id);
    localStorage.setItem("farmers", JSON.stringify(farmers));
    if(currentCampaignId) renderCampaignFilesList(currentCampaignId);
    updateDashboardStats();
    showToast(L("تم الحذف", "Supprimé"), "success");
}

function deleteCampaign(id) {
    if(!confirm(L("سيتم حذف جميع ملفات الإحصاء المرتبطة!", "Tous les dossiers associés seront supprimés !"))) return;
    farmers = farmers.filter(f => f.campaignId != id);
    campaigns = campaigns.filter(c => c.id != id);
    localStorage.setItem("farmers", JSON.stringify(farmers));
    localStorage.setItem("campaigns", JSON.stringify(campaigns));
    if(currentCampaignId == id) currentCampaignId = null;
    renderCampaignsList();
    showToast(L("تم حذف الحملة", "Campagne supprimée"), "success");
}

function showCreateCampaignForm() {
    showCreateCampaignModal();
}

function updateCampaignsStats() {
    document.getElementById("campaignsCount").textContent = campaigns.length;
}

// ============================================
// المسودات
// ============================================
function renderDrafts() {
    let container = document.getElementById("draftsList");
    if(!container) return;
    if(drafts.length === 0) { container.innerHTML = `<div style='text-align:center;padding:60px;'>${L('لا توجد مسودات', 'Aucun brouillon')}</div>`; return; }
    container.innerHTML = drafts.map(d => `<div class="file-card pending"><div>${L('مسودة', 'Brouillon')} ${new Date(d.date).toLocaleDateString(dateLocaleStr())}</div><button class="btn btn-sm btn-danger" onclick="deleteDraft(${d.id})">${L('حذف', 'Supprimer')}</button></div>`).join('');
}

function deleteDraft(id) {
    drafts = drafts.filter(d => d.id != id);
    localStorage.setItem("drafts", JSON.stringify(drafts));
    renderDrafts();
}
// ============================================
// بيانات نشاط المراقبين وسجل الدخول
// ============================================
let supervisorActivities = JSON.parse(localStorage.getItem("supervisorActivities") || "[]");
let userLoginLogs = JSON.parse(localStorage.getItem("userLoginLogs") || "[]");
let currentSupervisorFilter = 'all';
let currentSupervisorSearch = '';
// ============================================
// تبديل اللغة
// ============================================
function toggleLanguage() {
    let isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    document.documentElement.setAttribute('dir', isRtl ? 'ltr' : 'rtl');
    document.documentElement.setAttribute('lang', isRtl ? 'fr' : 'ar');
}

// ============================================
// بدء التشغيل
// ============================================
document.addEventListener("DOMContentLoaded", function() {
    // Apply saved language on load
    applyLang(currentLang);
    showPage('dashboard');
    updateDashboardStats();
    updateExploitantsSelects();
    updateUsersBadge();
    updateSecurityBadge();
});
// ============================================
// بروفايل المستغل (الفلاح) - جميع الحقول 1-31
// ============================================
function showExploitantProfile(id) {
    let e = exploitants.find(x => x.id == id);
    if (!e) return;
    
    let modal = document.getElementById('exploitantProfileModal');
    if (!modal) return;
    
    document.getElementById("exploitantProfileName").innerHTML = `${e.nom || ''} ${e.prenom || ''}`;
    document.getElementById("exploitantProfileBadge").innerHTML = `${L('مستغل مسجل', 'Exploitant enregistré')} | ${new Date(e.dateCreation).toLocaleDateString(dateLocaleStr())}`;
    
    let phoneFull = `${e.phone1 || ''}${e.phone2 || ''}${e.phone3 || ''}${e.phone4 || ''}${e.phone5 || ''}`;
    let ninFull = `${e.nin1 || ''}${e.nin2 || ''}${e.nin3 || ''}${e.nin4 || ''}${e.nin5 || ''}${e.nin6 || ''}`;
    let nisFull = `${e.nis1 || ''}${e.nis2 || ''}${e.nis3 || ''}${e.nis4 || ''}${e.nis5 || ''}`;
    let carteFull = `${e.carte1 || ''}${e.carte2 || ''}${e.carte3 || ''}${e.carte4 || ''}`;
    let codeFull = `${e.code1 || ''}${e.code2 || ''}${e.code3 || ''}${e.code4 || ''}`;
    let districtFull = `${e.district1 || ''}${e.district2 || ''}`;
    let exploitationsCount = exploitations.filter(ex => ex.exploitantId == e.id).length;
    let surveyFilesCount = farmers.filter(f => f.exploitantId == e.id).length;
    
    document.getElementById("exploitantProfileContent").innerHTML = `
        <div style="padding:15px;">
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;">
                <div style="background:#f0f0f0;padding:10px;border-radius:10px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${exploitationsCount}</div><div>${L('المستغلات', 'Exploitations')}</div></div>
                <div style="background:#f0f0f0;padding:10px;border-radius:10px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${surveyFilesCount}</div><div>${L('ملفات الإحصاء', 'Dossiers')}</div></div>
                <div style="background:#f0f0f0;padding:10px;border-radius:10px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${phoneFull || '---'}</div><div>${L('الهاتف', 'Téléphone')}</div></div>
                <div style="background:#f0f0f0;padding:10px;border-radius:10px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${e.wilaya2 || '---'}</div><div>${L('الولاية', 'Wilaya')}</div></div>
            </div>
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('I - المعلومات العامة (الحقول 1-12)', 'I - Informations générales')}</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">1 - ${L('تاريخ المرور', 'Date passage')}</div><div style="font-weight:bold;">${e.passDay || "00"}/${e.passMonth || "00"}/${e.passYear || "2025"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">2 - ${L('لقب المحصي', 'Nom recenseur')}</div><div style="font-weight:bold;">${e.recenseurNom || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">3 - ${L('اسم المحصي', 'Prénom recenseur')}</div><div style="font-weight:bold;">${e.recenseurPrenom || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">4 - ${L('تاريخ المراقبة', 'Date contrôle')}</div><div style="font-weight:bold;">${e.controlDay || "00"}/${e.controlMonth || "00"}/${e.controlYear || ""}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">5 - ${L('لقب المراقب', 'Nom contrôleur')}</div><div style="font-weight:bold;">${e.controleurNom || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">6 - ${L('اسم المراقب', 'Prénom contrôleur')}</div><div style="font-weight:bold;">${e.controleurPrenom || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">7 - ${L('الولاية', 'Wilaya')}</div><div style="font-weight:bold;">${e.wilaya2 || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">8 - ${L('البلدية', 'Commune')}</div><div style="font-weight:bold;">${e.commune || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">9 - ${L('رمز البلدية', 'Code commune')}</div><div style="font-weight:bold;">${codeFull || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">10 - ${L('اسم المكان', 'Lieu-dit')}</div><div style="font-weight:bold;">${e.lieuDit || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">11 - ${L('رقم المنطقة', 'N° district')}</div><div style="font-weight:bold;">${districtFull || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">12 - ${L('رقم المستثمرة', 'N° exploitation')}</div><div style="font-weight:bold;">${e.numExploitation || '---'}</div></div>
                </div>
            </div>
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('II - تعريف المستثمر (الفلاح) - الحقول 13-31', 'II - Identification exploitant')}</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">13 - ${L('اللقب', 'Nom')}</div><div style="font-weight:bold;">${e.nom || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">14 - ${L('الاسم', 'Prénom')}</div><div style="font-weight:bold;">${e.prenom || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">15 - ${L('سنة الميلاد', 'Année naissance')}</div><div style="font-weight:bold;">${e.birthYear || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">16 - ${L('الجنس', 'Sexe')}</div><div style="font-weight:bold;">${e.sexe === 'male' ? L('ذكر', 'Homme') : e.sexe === 'female' ? L('أنثى', 'Femme') : '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">17 - ${L('المستوى التعليمي', 'Niveau instruction')}</div><div style="font-weight:bold;">${e.education || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">18 - ${L('التكوين الفلاحي', 'Formation')}</div><div style="font-weight:bold;">${e.formation || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">19 - ${L('العنوان', 'Adresse')}</div><div style="font-weight:bold;">${e.adresse || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">20 - ${L('الهاتف', 'Téléphone')}</div><div style="font-weight:bold;">${phoneFull || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">21 - ${L('البريد الإلكتروني', 'Email')}</div><div style="font-weight:bold;">${e.email || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">22 - ${L('NIN', 'NIN')}</div><div style="font-weight:bold;">${ninFull || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">23 - ${L('NIS', 'NIS')}</div><div style="font-weight:bold;">${nisFull || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">24 - ${L('بطاقة الفلاح', 'Carte Fellah')}</div><div style="font-weight:bold;">${carteFull || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">25 - ${L('التسجيل في المنظمات', 'Inscriptions')}</div><div style="font-weight:bold;">${e.inscritCAW ? 'CAW ✓ ' : ''}${e.inscritCAPA ? 'CAPA ✓ ' : ''}${e.inscritUNPA ? 'UNPA ✓ ' : ''}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">26 - ${L('نوع التأمين', 'Assurance')}</div><div style="font-weight:bold;">${e.assuranceType26 || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">28 - ${L('عائلة فلاحية', 'Famille agricole')}</div><div style="font-weight:bold;">${e.famille === 'نعم' ? L('نعم', 'Oui') : e.famille === 'لا' ? L('لا', 'Non') : '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">29 - ${L('الفلاح الرئيسي', 'Exploitant principal')}</div><div style="font-weight:bold;">${e.roleExploitant || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">30 - ${L('عدد المتداولين', 'Co-exploitants')}</div><div style="font-weight:bold;">${e.coExploitantsCount || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">31 - ${L('طبيعة الفلاح', 'Nature')}</div><div style="font-weight:bold;">${e.nature === 'مالك' ? L('مالك', 'Propriétaire') : e.nature === 'مسير' ? L('مسير', 'Gérant') : '---'}</div></div>
                </div>
            </div>
        </div>
    `;
    
    // إخفاء جميع النوافذ الأخرى أولاً
    document.getElementById('exploitationProfileModal').style.display = 'none';
    document.getElementById('surveyFileProfileModal').style.display = 'none';
    document.getElementById('campaignProfileModal').style.display = 'none';
    
    // إظهار النافذة المطلوبة
    modal.style.display = 'flex';
}

function closeExploitantProfile() {
    document.getElementById('exploitantProfileModal').style.display = 'none';
}

// ============================================
// بروفايل المستغلة (المزرعة) - جميع الحقول 32-74
// ============================================
function showExploitationProfile(id) {
    let e = exploitations.find(x => x.id == id);
    if (!e) return;
    
    let modal = document.getElementById('exploitationProfileModal');
    if (!modal) return;
    
    document.getElementById("exploitationProfileName").innerHTML = e.nom || L('غير محدد', 'Non défini');
    document.getElementById("exploitationProfileBadge").innerHTML = `${L('مستغلة مسجلة', 'Exploitation enregistrée')} | ${new Date(e.dateCreation).toLocaleDateString(dateLocaleStr())}`;
    
    let totalArea = parseFloat(e.superficie) || 0;
    let totalHerbacee = (parseFloat(e.herbaceeIrriguee) || 0) + (parseFloat(e.herbaceeSec) || 0);
    let totalJacher = (parseFloat(e.jacherIrriguee) || 0) + (parseFloat(e.jacherSec) || 0);
    let totalPerenes = (parseFloat(e.perenesIrriguee) || 0) + (parseFloat(e.perenesSec) || 0);
    let totalSAU = (parseFloat(e.sauIrriguee) || 0) + (parseFloat(e.sauSec) || 0);
    let totalTrees = (parseInt(e.arbresOliviers) || 0) + (parseInt(e.arbresFiguiers) || 0) + (parseInt(e.arbresPalmiers) || 0);
    let surveyFilesCount = farmers.filter(f => f.exploitationId == e.id).length;
    
    document.getElementById("exploitationProfileContent").innerHTML = `
        <div style="padding:15px;">
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;">
                <div style="background:#f0f0f0;padding:10px;border-radius:10px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${totalArea} ${L('هكتار', 'ha')}</div><div>${L('المساحة', 'Superficie')}</div></div>
                <div style="background:#f0f0f0;padding:10px;border-radius:10px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${totalTrees} ${L('شجرة', 'arbre')}</div><div>${L('الأشجار', 'Arbres')}</div></div>
                <div style="background:#f0f0f0;padding:10px;border-radius:10px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${totalSAU} ${L('هكتار', 'ha')}</div><div>SAU</div></div>
                <div style="background:#f0f0f0;padding:10px;border-radius:10px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${surveyFilesCount}</div><div>${L('ملفات', 'Dossiers')}</div></div>
            </div>
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('III - تعريف المستثمرة - الحقول 32-43', 'III - Identification exploitation')}</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">32 - ${L('اسم المستثمرة', 'Nom')}</div><div style="font-weight:bold;">${e.nom || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">${L('الفلاح المالك', 'Agriculteur')}</div><div style="font-weight:bold;">${e.exploitantNom || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">33 - ${L('العنوان', 'Adresse')}</div><div style="font-weight:bold;">${e.adresse || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">34 - ${L('الوضع القانوني', 'Statut')}</div><div style="font-weight:bold;">${e.statut || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">35 - ${L('الإحداثيات', 'Coordonnées')}</div><div style="font-weight:bold;">${e.longitude || "..."} , ${e.latitude || "..."}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">36 - ${L('النشاط', 'Activité')}</div><div style="font-weight:bold;">${e.vocation === 'نباتي' ? L('نباتي', 'Végétale') : e.vocation === 'حيواني' ? L('حيواني', 'Animale') : L('مختلط', 'Mixte')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">37 - ${L('أراضٍ؟', 'Terres?')}</div><div style="font-weight:bold;">${e.terreAnimal || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">38 - ${L('الوصول', 'Accès')}</div><div style="font-weight:bold;">${e.access || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">39 - ${L('كهرباء', 'Électricité')}</div><div style="font-weight:bold;">${e.electricite === 'نعم' ? L('نعم', 'Oui') : L('لا', 'Non')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">40 - ${L('هاتف', 'Téléphone')}</div><div style="font-weight:bold;">${e.telephone === 'نعم' ? L('نعم', 'Oui') : L('لا', 'Non')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">41 - ${L('نوع الهاتف', 'Type téléphone')}</div><div style="font-weight:bold;">${e.typeTel || '---'}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">42 - ${L('إنترنت', 'Internet')}</div><div style="font-weight:bold;">${e.internet === 'نعم' ? L('نعم', 'Oui') : L('لا', 'Non')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">43 - ${L('إنترنت للفلاحة', 'Internet agricole')}</div><div style="font-weight:bold;">${e.internetAgricole === 'نعم' ? L('نعم', 'Oui') : L('لا', 'Non')}</div></div>
                </div>
            </div>
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('IV - مساحة المستثمرة - الحقول 47-63', 'IV - Superficie')}</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">47 - ${L('محاصيل عشبية', 'Herbacées')}</div><div style="font-weight:bold;">${L('مروية', 'Irriguée')}: ${e.herbaceeIrriguee || "0"} | ${L('جافة', 'Pluviale')}: ${e.herbaceeSec || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">48 - ${L('أراضي مستريحة', 'Jachères')}</div><div style="font-weight:bold;">${L('مروية', 'Irriguée')}: ${e.jacherIrriguee || "0"} | ${L('جافة', 'Pluviale')}: ${e.jacherSec || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">49 - ${L('محاصيل دائمة', 'Pérennes')}</div><div style="font-weight:bold;">${L('مروية', 'Irriguée')}: ${e.perenesIrriguee || "0"} | ${L('جافة', 'Pluviale')}: ${e.perenesSec || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">51 - SAU</div><div style="font-weight:bold;">${L('مروية', 'Irriguée')}: ${e.sauIrriguee || "0"} | ${L('جافة', 'Pluviale')}: ${e.sauSec || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">54 - SAT</div><div style="font-weight:bold;"><strong>${totalArea}</strong> ${L('هكتار', 'ha')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">61 - ${L('مساحة مبنية', 'Surface bâtie')}</div><div style="font-weight:bold;">${e.surfaceBatie || "0"} м²</div></div>
                </div>
            </div>
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('V - الأشجار المتفرقة - الحقول 65-74', 'V - Arbres épars')}</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">65 - ${L('الزيتون', 'Oliviers')}</div><div style="font-weight:bold;">${e.arbresOliviers || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">66 - ${L('التين', 'Figuiers')}</div><div style="font-weight:bold;">${e.arbresFiguiers || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">72 - ${L('نخيل التمر', 'Palmiers')}</div><div style="font-weight:bold;">${e.arbresPalmiers || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">74 - ${L('أشجار أخرى', 'Autres')}</div><div style="font-weight:bold;">${e.arbresAutres || "0"}</div></div>
                </div>
            </div>
        </div>
    `;
    
    // إخفاء جميع النوافذ الأخرى أولاً
    document.getElementById('exploitantProfileModal').style.display = 'none';
    document.getElementById('surveyFileProfileModal').style.display = 'none';
    document.getElementById('campaignProfileModal').style.display = 'none';
    
    // إظهار النافذة المطلوبة
    modal.style.display = 'flex';
}
function closeExploitationProfile() {
    document.getElementById('exploitationProfileModal').style.display = 'none';
}
// ===========================================
// بروفايل ملف الإحصاء - جميع الحقول 75-171
// ============================================
function showSurveyFileProfile(id) {
    let f = farmers.find(x => x.id == id);
    if (!f) return;
    
    let modal = document.getElementById('surveyFileProfileModal');
    if (!modal) return;
    
    // جلب بيانات الفلاح والمستغلة المرتبطة بهذا الملف
    let exploitant = exploitants.find(e => e.id == f.exploitantId);
    let exploitation = exploitations.find(e => e.id == f.exploitationId);
    
    let statusTxt = f.status === 'pending' ? L('قيد الانتظار', 'En attente') : f.status === 'approved' ? L('مقبول', 'Approuvé') : L('مرفوض', 'Rejeté');
    
    // إحصائيات سريعة
    let totalAnimals = (parseInt(f.bovins) || 0) + (parseInt(f.ovins) || 0) + (parseInt(f.caprins) || 0) + (parseInt(f.camelins) || 0) + (parseInt(f.equins) || 0);
    let totalHerbacee = (parseFloat(f.herbaceeIrriguee)||0) + (parseFloat(f.herbaceeSec)||0);
    let totalJacher = (parseFloat(f.jacherIrriguee)||0) + (parseFloat(f.jacherSec)||0);
    let totalPerenes = (parseFloat(f.perenesIrriguee)||0) + (parseFloat(f.perenesSec)||0);
    let totalSAU = (parseFloat(f.sauIrriguee)||0) + (parseFloat(f.sauSec)||0);
    
    document.getElementById("surveyFileProfileName").innerHTML = `${L('ملف إحصاء', 'Dossier de recensement')} - ${f.exploitantNom || L('غير محدد', 'Non défini')}`;
    document.getElementById("surveyFileProfileBadge").innerHTML = `${L('تم الإنشاء في', 'Créé le')} ${new Date(f.date).toLocaleDateString(dateLocaleStr())} | ${L('الحالة', 'Statut')}: ${statusTxt}`;
    
    document.getElementById("surveyFileProfileContent").innerHTML = `
        <div style="padding:15px;">
            <!-- ===== قسم الفلاح المالك ===== -->
            <div style="border:2px solid #D4AF37;border-radius:15px;margin-bottom:20px;padding:15px;background:linear-gradient(135deg,rgba(28,75,45,0.05),rgba(212,175,55,0.05));">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                    <div style="font-weight:bold;font-size:18px;color:#1C4B2D;"><i class="fas fa-user-tie"></i> ${L('الفلاح المالك لهذا الملف', 'Agriculteur propriétaire de ce dossier')}</div>
                    <button onclick="showExploitantProfile(${f.exploitantId})" style="background:#1C4B2D;color:white;border:none;border-radius:20px;padding:5px 15px;cursor:pointer;font-size:12px;"><i class="fas fa-eye"></i> ${L('عرض بروفايل الفلاح', 'Voir profil agriculteur')}</button>
                </div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">
                    <div><span style="color:#64748b;">${L('الاسم الكامل', 'Nom complet')}:</span> <strong>${exploitant ? `${exploitant.nom || ''} ${exploitant.prenom || ''}` : f.exploitantNom || L('غير محدد', 'Non défini')}</strong></div>
                    <div><span style="color:#64748b;">${L('رقم الهاتف', 'Téléphone')}:</span> <strong>${exploitant ? `${exploitant.phone1 || ''}${exploitant.phone2 || ''}${exploitant.phone3 || ''}${exploitant.phone4 || ''}${exploitant.phone5 || ''}` : L('غير محدد', 'Non défini')}</strong></div>
                    <div><span style="color:#64748b;">${L('الولاية', 'Wilaya')}:</span> <strong>${exploitant?.wilaya2 || L('غير محدد', 'Non défini')}</strong></div>
                    <div><span style="color:#64748b;">${L('تاريخ التسجيل', 'Date d\'inscription')}:</span> <strong>${new Date(exploitant?.dateCreation || f.date).toLocaleDateString(dateLocaleStr())}</strong></div>
                </div>
            </div>
            
            <!-- ===== قسم المستغلة ===== -->
            <div style="border:2px solid #D4AF37;border-radius:15px;margin-bottom:20px;padding:15px;background:linear-gradient(135deg,rgba(28,75,45,0.05),rgba(212,175,55,0.05));">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                    <div style="font-weight:bold;font-size:18px;color:#1C4B2D;"><i class="fas fa-tractor"></i> ${L('المستغلة (المزرعة) المرتبطة بهذا الملف', 'Exploitation liée à ce dossier')}</div>
                    <button onclick="showExploitationProfile(${f.exploitationId})" style="background:#1C4B2D;color:white;border:none;border-radius:20px;padding:5px 15px;cursor:pointer;font-size:12px;"><i class="fas fa-eye"></i> ${L('عرض بروفايل المستغلة', 'Voir profil exploitation')}</button>
                </div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">
                    <div><span style="color:#64748b;">${L('اسم المستغلة', 'Nom exploitation')}:</span> <strong>${exploitation?.nom || f.exploitationNom || L('غير محدد', 'Non défini')}</strong></div>
                    <div><span style="color:#64748b;">${L('العنوان', 'Adresse')}:</span> <strong>${exploitation?.adresse || L('غير محدد', 'Non défini')}</strong></div>
                    <div><span style="color:#64748b;">${L('نشاط المستغلة', 'Activité')}:</span> <strong>${exploitation?.vocation === 'نباتي' ? L('نباتي', 'Végétal') : exploitation?.vocation === 'حيواني' ? L('حيواني', 'Animal') : exploitation?.vocation === 'مختلط' ? L('مختلط', 'Mixte') : L('غير محدد', 'Non défini')}</strong></div>
                    <div><span style="color:#64748b;">${L('المساحة الإجمالية', 'Superficie totale')}:</span> <strong>${exploitation?.superficie || '0'} ${L('هكتار', 'ha')}</strong></div>
                </div>
            </div>
            
            <!-- إحصائيات سريعة -->
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;">
                <div style="background:#f0f0f0;padding:10px;border-radius:10px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${totalAnimals} ${L('رأس', 'têtes')}</div><div>${L('إجمالي المواشي', 'Total cheptel')}</div></div>
                <div style="background:#f0f0f0;padding:10px;border-radius:10px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${f.batimentsHabitationNb || "0"}</div><div>${L('المباني', 'Bâtiments')}</div></div>
                <div style="background:#f0f0f0;padding:10px;border-radius:10px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${parseInt(f.ouvMaleP || 0) + parseInt(f.ouvFemaleP || 0)}</div><div>${L('العمال الدائمون', 'Ouvriers permanents')}</div></div>
                <div style="background:#f0f0f0;padding:10px;border-radius:10px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${f.typeCredit || '---'}</div><div>${L('التمويل', 'Financement')}</div></div>
            </div>
            
            <!-- الحقول 75-81: الممارسات الزراعية -->
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('VI - الممارسات الزراعية (الحقول 75-81)', 'VI - Pratiques agricoles (champs 75-81)')}</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">75 - ${L('الزراعة البيولوجية', 'Agriculture biologique')}</div><div style="font-weight:bold;">${f.biologique === 'نعم' ? L('نعم ✓', 'Oui ✓') : L('لا ✗', 'Non ✗')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">76 - ${L('لديك شهادة؟', 'Certificat ?')}</div><div style="font-weight:bold;">${f.certificatBio === 'نعم' ? L('نعم ✓', 'Oui ✓') : L('لا ✗', 'Non ✗')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">77 - ${L('الاستزراع المائي', 'Aquaculture')}</div><div style="font-weight:bold;">${f.aquaculture === 'نعم' ? L('نعم ✓', 'Oui ✓') : L('لا ✗', 'Non ✗')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">78 - ${L('تربية الحلزون', 'Héliciculture')}</div><div style="font-weight:bold;">${f.helicicult === 'نعم' ? L('نعم ✓', 'Oui ✓') : L('لا ✗', 'Non ✗')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">79 - ${L('زراعة الفطريات', 'Myciculture')}</div><div style="font-weight:bold;">${f.myciculture === 'نعم' ? L('نعم ✓', 'Oui ✓') : L('لا ✗', 'Non ✗')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">80 - ${L('الزراعة التعاقدية', 'Agriculture contractuelle')}</div><div style="font-weight:bold;">${f.contractuelle === 'نعم' ? L('نعم ✓', 'Oui ✓') : L('لا ✗', 'Non ✗')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;grid-column:span 2;"><div style="font-size:11px;color:#666;">81 - ${L('الشعبة المتعاقد عليها', 'Filière contractuelle')}</div><div style="font-weight:bold;">${f.filiereTomate ? L('طماطم صناعية ✓ ', 'Tomate ind. ✓ ') : ''}${f.filiereHuile ? L('حبوب ✓ ', 'Céréales ✓ ') : ''}${f.filiereAviculture ? L('دواجن ✓ ', 'Aviculture ✓ ') : ''}${f.filiereMaraichage ? L('خضروات ✓ ', 'Maraîchage ✓ ') : ''}${f.filierePomme ? L('بطاطا ✓ ', 'Pomme de terre ✓ ') : ''}${f.filiereAutre ? L('أخرى ✓ ', 'Autre ✓ ') : ''}</div></div>
                </div>
            </div>
            
            <!-- الحقول 82-105: المواشي -->
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('VII - المواشي (عدد الرؤوس) - الحقول 82-105', 'VII - Cheptel (nombre de têtes) - champs 82-105')}</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">82-85 - ${L('الأبقار', 'Bovins')}</div><div style="font-weight:bold;">${L('الإجمالي', 'Total')}: ${f.bovins || "0"} | BLL: ${f.bovinsBLL || "0"} | BLA: ${f.bovinsBLA || "0"} | BLM: ${f.bovinsBLM || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">86-87 - ${L('الأغنام', 'Ovins')}</div><div style="font-weight:bold;">${L('الإجمالي', 'Total')}: ${f.ovins || "0"} | ${L('منها النعاج', 'dont brebis')}: ${f.ovinsBrebis || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">88-89 - ${L('الماعز', 'Caprins')}</div><div style="font-weight:bold;">${L('الإجمالي', 'Total')}: ${f.caprins || "0"} | ${L('منها المعزات', 'dont chèvres')}: ${f.caprinsChevres || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">90-91 - ${L('الإبل', 'Camelins')}</div><div style="font-weight:bold;">${L('الإجمالي', 'Total')}: ${f.camelins || "0"} | ${L('منها النوق', 'dont femelles')}: ${f.camelinsFemelles || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">92-93 - ${L('الخيول', 'Équins')}</div><div style="font-weight:bold;">${L('الإجمالي', 'Total')}: ${f.equins || "0"} | ${L('منها الأفراس', 'dont juments')}: ${f.equinsFemelles || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">94-96 - ${L('الدواجن', 'Volailles')}</div><div style="font-weight:bold;">${L('دجاج', 'Poulets')}: ${f.pouletsChair || "0"} | ${L('ديوك رومي', 'Dindes')}: ${f.dindes || "0"} | ${L('أخرى', 'Autres')}: ${f.autreAviculture || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">97-98 - ${L('البغال والحمير', 'Mulets et ânes')}</div><div style="font-weight:bold;">${L('بغال', 'Mulets')}: ${f.mulets || "0"} | ${L('حمير', 'Ânes')}: ${f.anes || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">99 - ${L('الأرانب', 'Lapins')}</div><div style="font-weight:bold;">${f.lapins || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;grid-column:span 2;"><div style="font-size:11px;color:#666;">100-105 - ${L('تربية النحل', 'Apiculture')}</div><div style="font-weight:bold;">${L('خلايا عصرية', 'Ruches modernes')}: ${f.ruchesModernes || "0"} (${L('ممتلئة', 'pleines')}: ${f.ruchesModernesPleines || "0"}) | ${L('تقليدية', 'traditionnelles')}: ${f.ruchesTraditionnelles || "0"} (${L('ممتلئة', 'pleines')}: ${f.ruchesTraditionnellesPleines || "0"})</div></div>
                </div>
            </div>
            
            <!-- الحقول 106-122: مباني الاستغلال -->
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('VIII - مباني الاستغلال - الحقول 106-122', 'VIII - Bâtiments d\'exploitation - champs 106-122')}</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">106 - ${L('مباني سكنية', 'Habitations')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.batimentsHabitationNb || "0"} | ${L('المساحة', 'Surface')}: ${f.batimentsHabitationSurface || "0"} م²</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">107-108 - ${L('مباني تربية الحيوانات', 'Bâtiments d\'élevage')}</div><div style="font-weight:bold;">${L('حظائر', 'Bergeries')}: ${f.bergeriesNb || "0"} (${f.bergeriesCapacite || "0"} م³) | ${L('إسطبلات', 'Étables')}: ${f.etablesNb || "0"} (${f.etablesCapacite || "0"} м³)</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">109 - ${L('اسطبل خيول', 'Écuries')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.ecuriesNb || "0"} | ${L('السعة', 'Capacité')}: ${f.ecuriesCapacite || "0"} م³</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">110 - ${L('مدجنة (مبنى صلب)', 'Poulailler (dur)')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.poulaillerNb || "0"} | ${L('السعة', 'Capacité')}: ${f.poulaillerCapacite || "0"} م³</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">111 - ${L('مدجنة تحت البيوت البلاستيكية', 'Poulailler sous serre')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.pserresNb || "0"} | ${L('السعة', 'Capacité')}: ${f.pserresCapacite || "0"} م³</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">112 - ${L('بيوت بلاستيكية نفقية', 'Serres tunnels')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.serresTunnelNb || "0"} | ${L('المساحة', 'Surface')}: ${f.serresTunnelSurface || "0"} م²</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">113 - ${L('بيوت متعددة القبب', 'Serres multi-chapelles')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.mulserresNb || "0"} | ${L('المساحة', 'Surface')}: ${f.mulserresSurface || "0"} م²</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">114 - ${L('مباني التخزين', 'Bâtiments de stockage')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.stockageNb || "0"} | ${L('السعة', 'Capacité')}: ${f.stockageCapacite || "0"} م³</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">115 - ${L('مباني تخزين المنتجات الفلاحية', 'Bâtiments produits agricoles')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.prodAgriNb || "0"} | ${L('السعة', 'Capacité')}: ${f.prodAgriCapacite || "0"} م³</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">118 - ${L('وحدة التوظيب', 'Unité de conditionnement')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.uniteConNb || "0"} | ${L('السعة', 'Capacité')}: ${f.uniteConCapacite || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">119 - ${L('وحدة التحول', 'Unité de transformation')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.uniteTransfoNb || "0"} | ${L('السعة', 'Capacité')}: ${f.uniteTransfoCapacite || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">120 - ${L('مركز جمع الحليب', 'Centre collecte lait')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.centreLaitNb || "0"} | ${L('السعة', 'Capacité')}: ${f.centreLaitCapacite || "0"} ${L('لتر/يوم', 'L/jour')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">121 - ${L('مباني أخرى', 'Autres bâtiments')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.autresBatimentsNb || "0"} | ${L('السعة', 'Capacité')}: ${f.autresBatimentsCapacite || "0"} м³</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">122 - ${L('غرف التبريد', 'Chambres froides')}</div><div style="font-weight:bold;">${L('العدد', 'Nb')}: ${f.chambresFroidesNb || "0"} | ${L('السعة', 'Capacité')}: ${f.chambresFroidesCapacite || "0"} м³</div></div>
                </div>
            </div>
            
            <!-- الحقول 127-144: الموارد المائية -->
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('IX - الموارد المائية - الحقول 127-144', 'IX - Ressources en eau - champs 127-144')}</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;grid-column:span 2;"><div style="font-size:11px;color:#666;">127-136 - ${L('مصادر المياه', 'Sources d\'eau')}</div><div style="font-weight:bold;">${f.sourcePuits ? L('بئر ✓ ', 'Puits ✓ ') : ''}${f.sourceForage ? L('ثقب ✓ ', 'Forage ✓ ') : ''}${f.sourcePompage ? L('ضخ وادي ✓ ', 'Pompage oued ✓ ') : ''}${f.sourceCrues ? L('فيض وادي ✓ ', 'Crues ✓ ') : ''}${f.sourceBarrage ? L('سد ✓ ', 'Barrage ✓ ') : ''}${f.sourceRetenu ? L('خزان تلال ✓ ', 'Retenue collinaire ✓ ') : ''}${f.sourceFoggara ? L('فقارة ✓ ', 'Foggara ✓ ') : ''}${f.sourceSource ? L('منبع ✓ ', 'Source ✓ ') : ''}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">137-144 - ${L('طريقة الري', 'Mode d\'irrigation')}</div><div style="font-weight:bold;">${f.irrigation || L('غير محدد', 'Non défini')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">${L('المساحة المسقية', 'Superficie irriguée')}</div><div style="font-weight:bold;">${f.areaIrriguee || "0"} ${L('هكتار', 'ha')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">${L('المزروعات المسقية', 'Cultures irriguées')}</div><div style="font-weight:bold;">${f.culturesIrriguees || L('غير محدد', 'Non défini')}</div></div>
                </div>
            </div>
            
            <!-- الحقول 147-156: اليد العاملة -->
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('X - اليد العاملة - الحقول 147-156', 'X - Main d\'œuvre - champs 147-156')}</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">147 - ${L('مستثمرون مشاركون', 'Co-exploitants')}</div><div style="font-weight:bold;">${L('ذكور دوام كلي', 'H temps plein')}: ${f.coexplMalePlein || "0"} | ${L('إناث دوام كلي', 'F temps plein')}: ${f.coexplFemalePlein || "0"} | ${L('ذكور جزئي', 'H temps partiel')}: ${f.coexplMalePartiel || "0"} | ${L('إناث جزئي', 'F temps partiel')}: ${f.coexplFemalePartiel || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">148 - ${L('عمال فلاحيون', 'Ouvriers agricoles')}</div><div style="font-weight:bold;">${L('ذكور دوام كلي', 'H temps plein')}: ${f.ouvMaleP || "0"} | ${L('إناث دوام كلي', 'F temps plein')}: ${f.ouvFemaleP || "0"} | ${L('ذكور جزئي', 'H temps partiel')}: ${f.ouvMaleJ || "0"} | ${L('إناث جزئي', 'F temps partiel')}: ${f.ouvFemaleJ || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">149 - ${L('عمال أجانب', 'Travailleurs étrangers')}</div><div style="font-weight:bold;">${L('ذكور دوام كلي', 'H temps plein')}: ${f.etrangMaleP || "0"} | ${L('إناث دوام كلي', 'F temps plein')}: ${f.etrangFemaleP || "0"} | ${L('ذكور جزئي', 'H temps partiel')}: ${f.etrangMaleJ || "0"} | ${L('إناث جزئي', 'F temps partiel')}: ${f.etrangFemaleJ || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">150 - ${L('فلاح فردي', 'Exploitant individuel')}</div><div style="font-weight:bold;">${L('ذكور', 'Hommes')}: ${f.indivMaleP || "0"} | ${L('إناث', 'Femmes')}: ${f.indivFemaleP || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">152 - ${L('أطفال (-15 سنة)', 'Enfants (-15 ans)')}</div><div style="font-weight:bold;">${L('ذكور', 'Garçons')}: ${f.childMale || "0"} | ${L('إناث', 'Filles')}: ${f.childFemale || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">155 - ${L('بدون عمل', 'Sans emploi')}</div><div style="font-weight:bold;">${L('ذكور', 'Hommes')}: ${f.sansEmploiM || "0"} | ${L('إناث', 'Femmes')}: ${f.sansEmploiF || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">156 - ${L('مستفيدو الشبكة الاجتماعية', 'Bénéficiaires filet social')}</div><div style="font-weight:bold;">${f.filetSocial || "0"}</div></div>
                </div>
            </div>
            
            <!-- الحقول 157-159: الأسرة الفلاحية -->
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('XI - الأسرة الفلاحية - الحقول 157-159', 'XI - Ménage agricole - champs 157-159')}</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">157 - ${L('عدد الأشخاص', 'Nombre de personnes')}</div><div style="font-weight:bold;">${L('ذكور', 'Hommes')}: ${f.familyMale || "0"} | ${L('إناث', 'Femmes')}: ${f.familyFemale || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">158 - ${L('كبار (+15 سنة)', 'Adultes (+15 ans)')}</div><div style="font-weight:bold;">${L('ذكور', 'Hommes')}: ${f.adulteMale || "0"} | ${L('إناث', 'Femmes')}: ${f.adultesFemale || "0"}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">159 - ${L('أطفال (-15 سنة)', 'Enfants (-15 ans)')}</div><div style="font-weight:bold;">${L('ذكور', 'Garçons')}: ${f.familyChildMale || "0"} | ${L('إناث', 'Filles')}: ${f.familyChildFemale || "0"}</div></div>
                </div>
            </div>
            
            <!-- الحقل 160: استخدام المدخلات -->
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('XII - استخدام المدخلات - الحقل 160', 'XII - Utilisation des intrants - champ 160')}</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">160 - ${L('البذور', 'Semences')}</div><div style="font-weight:bold;">${f.semencesSelectionnees ? L('بذور مختارة ✓ ', 'Sélectionnées ✓ ') : ''}${f.semencesCertifiees ? L('بذور معتمدة ✓ ', 'Certifiées ✓ ') : ''}${f.semencesBio ? L('بيولوجية ✓ ', 'Biologiques ✓ ') : ''}${f.semencesFerme ? L('بذور المزرعة ✓ ', 'Ferme ✓ ') : ''}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">${L('الأسمدة والمبيدات', 'Engrais et pesticides')}</div><div style="font-weight:bold;">${f.engraisAzotes ? L('أسمدة آزوتية ✓ ', 'Azotés ✓ ') : ''}${f.engraisPhosphates ? L('أسمدة فوسفاتية ✓ ', 'Phosphatés ✓ ') : ''}${f.fumureOrganique ? L('سماد عضوي ✓ ', 'Organique ✓ ') : ''}${f.produitsPhyto ? L('مبيدات ✓ ', 'Phytosanitaires ✓ ') : ''}</div></div>
                </div>
            </div>
            
            <!-- الحقول 161-166: التمويل والتأمينات -->
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('XIII - التمويل والتأمينات - الحقول 161-166', 'XIII - Financement et assurances - champs 161-166')}</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">161 - ${L('مصادر التمويل', 'Sources de financement')}</div><div style="font-weight:bold;">${f.financePropress ? L('موارد ذاتية ✓ ', 'Propres ✓ ') : ''}${f.financeCredit ? L('قرض بنكي ✓ ', 'Crédit ✓ ') : ''}${f.financeSoutien ? L('دعم عمومي ✓ ', 'Soutien ✓ ') : ''}${f.financeEmprunt ? L('استلاف من الغير ✓ ', 'Emprunt ✓ ') : ''}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">162 - ${L('نوع القرض البنكي', 'Type de crédit')}</div><div style="font-weight:bold;">${f.typeCredit || L('غير محدد', 'Non défini')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">163 - ${L('نوع الدعم العمومي', 'Type de soutien')}</div><div style="font-weight:bold;">${f.typeSoutien || L('غير محدد', 'Non défini')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">164 - ${L('التأمين الفلاحي', 'Assurance agricole')}</div><div style="font-weight:bold;">${f.assuranceAgricole === 'نعم' ? L('نعم ✓', 'Oui ✓') : L('لا ✗', 'Non ✗')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">165 - ${L('شركة التأمين', 'Compagnie d\'assurance')}</div><div style="font-weight:bold;">${f.compagnieAssurance || L('غير محدد', 'Non défini')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">166 - ${L('نوع التأمين', 'Type d\'assurance')}</div><div style="font-weight:bold;">${f.assuranceTerre ? L('الأرض ✓ ', 'Terre ✓ ') : ''}${f.assuranceMaterial ? L('المعدات ✓ ', 'Équipement ✓ ') : ''}${f.assuranceMahassel ? L('المحاصيل ✓ ', 'Récoltes ✓ ') : ''}${f.assuranceMawachi ? L('المواشي ✓ ', 'Cheptel ✓ ') : ''}</div></div>
                </div>
            </div>
            
            <!-- الحقول 167-171: محيط المستثمرة -->
            <div style="border:1px solid #ddd;border-radius:10px;margin-bottom:15px;padding:10px;">
                <div style="font-weight:bold;border-bottom:2px solid #D4AF37;padding-bottom:5px;margin-bottom:10px;">${L('XIV - محيط المستثمرة - الحقول 167-171', 'XIV - Environnement de l\'exploitation - champs 167-171')}</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">167 - ${L('وجود مقدمي خدمات', 'Prestataires de services')}</div><div style="font-weight:bold;">${f.fournisseurs === 'نعم' ? L('نعم ✓', 'Oui ✓') : L('لا ✗', 'Non ✗')}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;grid-column:span 2;"><div style="font-size:11px;color:#666;">168 - ${L('مؤسسات قريبة', 'Institutions à proximité')}</div><div style="font-weight:bold;">${f.proximiteBanque ? L('بنك ✓ ', 'Banque ✓ ') : ''}${f.proximitePoste ? L('بريد ✓ ', 'Poste ✓ ') : ''}${f.proximiteVet ? L('عيادة بيطرية ✓ ', 'Vétérinaire ✓ ') : ''}${f.proximiteCooperative ? L('تعاونية ✓ ', 'Coopérative ✓ ') : ''}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">169 - ${L('تسويق المنتجات', 'Commercialisation')}</div><div style="font-weight:bold;">${f.ventePied ? L('بيع على الجذع ✓ ', 'Vente sur pied ✓ ') : ''}${f.venteGros ? L('سوق الجملة ✓ ', 'Marché de gros ✓ ') : ''}${f.venteDirecte ? L('بيع مباشر ✓ ', 'Vente directe ✓ ') : ''}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;"><div style="font-size:11px;color:#666;">170 - ${L('سوق التسويق', 'Marché')}</div><div style="font-weight:bold;">${f.marcheLocal ? L('محلي ✓ ', 'Local ✓ ') : ''}${f.marcheNational ? L('وطني ✓ ', 'National ✓ ') : ''}${f.marcheInternational ? L('دولي ✓ ', 'International ✓ ') : ''}</div></div>
                    <div style="background:#f9f9f9;padding:8px;border-radius:8px;grid-column:span 2;"><div style="font-size:11px;color:#666;">171 - ${L('الانخراط في المنظمات', 'Adhésion aux organisations')}</div><div style="font-weight:bold;">${f.cooperativeAgricole ? L('تعاونية فلاحية ✓ ', 'Coopérative ✓ ') : ''}${f.associationProfessionnelle ? L('جمعية مهنية ✓ ', 'Association pro. ✓ ') : ''}${f.groupeInteret ? L('مجموعة مصالح ✓ ', 'Groupe d\'intérêt ✓ ') : ''}</div></div>
                </div>
            </div>
        </div>
    `;
    
    // إخفاء جميع النوافذ الأخرى أولاً
    let modals = ['exploitantProfileModal', 'exploitationProfileModal', 'campaignProfileModal'];
    modals.forEach(m => {
        let mEl = document.getElementById(m);
        if (mEl) mEl.style.display = 'none';
    });
    
    // إظهار النافذة المطلوبة
    modal.style.display = 'flex';
}
function closeSurveyFileProfile() {
    let modal = document.getElementById('surveyFileProfileModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ============================================
// بروفايل الحملة (تفاصيل الحملة الكاملة)
// ============================================
function showCampaignProfile(id) {
    let campaign = campaigns.find(c => c.id == id);
    if (!campaign) return;
    
    let campaignFiles = farmers.filter(f => f.campaignId == id);
    let totalFiles = campaignFiles.length;
    let approved = campaignFiles.filter(f => f.status === 'approved').length;
    let pending = campaignFiles.filter(f => f.status === 'pending').length;
    let rejected = campaignFiles.filter(f => f.status === 'rejected').length;
    let totalArea = campaignFiles.reduce((sum, f) => sum + (parseFloat(f.superficie) || 0), 0);
    let totalAnimals = campaignFiles.reduce((sum, f) => sum + (parseInt(f.bovins)||0) + (parseInt(f.ovins)||0) + (parseInt(f.caprins)||0), 0);
    
    let _und = L('غير محدد', 'Non défini');
    let statusTxt = campaign.status === 'active' ? L('نشطة', 'Active') : campaign.status === 'completed' ? L('مكتملة', 'Terminée') : L('قيد التحضير', 'En préparation');
    
    document.getElementById("campaignProfileTitle").innerHTML = `<i class="fas fa-chart-line"></i> ${campaign.name}`;
    document.getElementById("campaignProfileMeta").innerHTML = `
        <span><i class="fas fa-map-marker-alt"></i> ${campaign.region || L('كل التراب الوطني', 'Tout le territoire')}</span>
        <span><i class="fas fa-calendar"></i> ${L('البداية', 'Début')}: ${new Date(campaign.startDate).toLocaleDateString(dateLocaleStr())}</span>
        ${campaign.endDate ? `<span><i class="fas fa-calendar-check"></i> ${L('النهاية', 'Fin')}: ${new Date(campaign.endDate).toLocaleDateString(dateLocaleStr())}</span>` : ''}
        <span><i class="fas fa-clock"></i> ${statusTxt}</span>
    `;
    
    document.getElementById("campaignProfileStats").innerHTML = `
        <div class="campaign-stat-big"><div class="number">${totalFiles}</div><div class="label">${L('إجمالي الملفات', 'Total dossiers')}</div></div>
        <div class="campaign-stat-big"><div class="number">${approved}</div><div class="label">${L('مقبولة', 'Approuvés')}</div></div>
        <div class="campaign-stat-big"><div class="number">${pending}</div><div class="label">${L('قيد الانتظار', 'En attente')}</div></div>
        <div class="campaign-stat-big"><div class="number">${rejected}</div><div class="label">${L('مرفوضة', 'Rejetés')}</div></div>
        <div class="campaign-stat-big"><div class="number">${totalArea.toFixed(1)}</div><div class="label">${L('المساحة (هكتار)', 'Superficie (ha)')}</div></div>
        <div class="campaign-stat-big"><div class="number">${totalAnimals}</div><div class="label">${L('المواشي (رأس)', 'Cheptel (têtes)')}</div></div>
    `;
    
    if (campaignFiles.length === 0) {
        document.getElementById("campaignProfileFiles").innerHTML = `<div style="text-align:center;padding:40px;color:#64748b;">${L('لا توجد ملفات إحصاء في هذه الحملة', 'Aucun dossier de recensement dans cette campagne')}</div>`;
    } else {
        document.getElementById("campaignProfileFiles").innerHTML = `
            <div class="profile-section-title" style="margin-top:0;">
                <i class="fas fa-file-alt"></i> ${L('ملفات الإحصاء في هذه الحملة', 'Dossiers de recensement de cette campagne')}
                <span class="section-badge">${totalFiles} ${L('ملف', 'dossier(s)')}</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:15px;">
                ${campaignFiles.map(f => `
                    <div class="profile-item" style="cursor:pointer;" onclick="showSurveyFileProfile(${f.id}); closeCampaignProfile();">
                        <div class="profile-item-label"><i class="fas fa-user-tie"></i> ${f.exploitantNom || _und}</div>
                        <div class="profile-item-label"><i class="fas fa-tractor"></i> ${f.exploitationNom || _und}</div>
                        <div class="profile-item-value" style="font-size:12px;">${new Date(f.date).toLocaleDateString(dateLocaleStr())}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    document.getElementById("campaignProfileModal").classList.add("active");
}

function closeCampaignProfile() {
    document.getElementById("campaignProfileModal").classList.remove("active");
}
// ============================================
// إنشاء حملة جديدة (بطاقة جميلة)
// ============================================
function showCreateCampaignModal() {
    document.getElementById("createCampaignModal").classList.add("active");
    document.getElementById("newCampaignName").value = "";
    document.getElementById("newCampaignRegion").value = "";
    document.getElementById("newCampaignStartDate").value = "";
    document.getElementById("newCampaignEndDate").value = "";
    document.getElementById("newCampaignDescription").value = "";
}

function closeCreateCampaignModal() {
    document.getElementById("createCampaignModal").classList.remove("active");
}

function saveNewCampaign() {
    let name = document.getElementById('newCampaignName').value.trim();
    
    if (!name) {
        alert('الرجاء إدخال اسم الحملة');
        return;
    }
    
    let newCampaign = {
        id: Date.now(),
        name: name,
        region: document.getElementById('newCampaignRegion').value || '',
        startDate: document.getElementById('newCampaignStartDate').value || new Date().toISOString().split('T')[0],
        endDate: document.getElementById('newCampaignEndDate').value || '',
        description: document.getElementById('newCampaignDescription').value || '',
        status: 'active',
        createdAt: new Date().toISOString()
    };
    
    // تحميل الحملات الحالية من localStorage
    let campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    campaigns.push(newCampaign);
    localStorage.setItem('campaigns', JSON.stringify(campaigns));
    
    // إغلاق النافذة
    closeCreateCampaignModal();
    
    // تنظيف الحقول
    document.getElementById('newCampaignName').value = '';
    document.getElementById('newCampaignRegion').value = '';
    document.getElementById('newCampaignStartDate').value = '';
    document.getElementById('newCampaignEndDate').value = '';
    document.getElementById('newCampaignDescription').value = '';
    
    // تحديث عرض الحملات مباشرة
    let container = document.getElementById("campaignsList");
    if (container) {
        // إعادة بناء قائمة الحملات
        let allCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
        
        if (allCampaigns.length === 0) {
            container.innerHTML = `<div style='text-align:center;padding:60px;'>لا توجد حملات</div>`;
        } else {
            let dashboardHTML = `
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:30px;">
                    <div style="background:rgba(255,255,255,0.9);border-radius:25px;padding:20px;text-align:center;">
                        <div style="font-size:32px;font-weight:800;">${allCampaigns.length}</div>
                        <div>إجمالي الحملات</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.9);border-radius:25px;padding:20px;text-align:center;">
                        <div style="font-size:32px;font-weight:800;">${allCampaigns.filter(c => c.status === 'active').length}</div>
                        <div>حملات نشطة</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.9);border-radius:25px;padding:20px;text-align:center;">
                        <div style="font-size:32px;font-weight:800;">${allCampaigns.filter(c => c.status === 'completed').length}</div>
                        <div>حملات مكتملة</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.9);border-radius:25px;padding:20px;text-align:center;">
                        <div style="font-size:32px;font-weight:800;">${allCampaigns.filter(c => c.status === 'pending').length}</div>
                        <div>قيد التحضير</div>
                    </div>
                </div>
            `;
            
            container.innerHTML = dashboardHTML + `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:25px;">` + allCampaigns.map(c => {
                let campaignFiles = JSON.parse(localStorage.getItem('farmers') || '[]').filter(f => f.campaignId == c.id);
                let totalFiles = campaignFiles.length;
                let statusText = c.status === 'active' ? 'نشطة' : (c.status === 'completed' ? 'مكتملة' : 'قيد التحضير');
                let statusColor = c.status === 'active' ? '#28a745' : (c.status === 'completed' ? '#17a2b8' : '#ffc107');
                let isCompleted = c.status === 'completed';
                return `
                    <div style="background:white;border-radius:28px;overflow:hidden;box-shadow:0 10px 30px -10px rgba(0,0,0,0.1);border:1px solid rgba(212,175,55,0.2);">
                        <div style="background:linear-gradient(135deg,#1C4B2D,#2E6B3E);padding:20px;color:white;position:relative;">
                            <h3 style="margin:0 0 8px 0;"><i class="fas fa-chart-line"></i> ${c.name}</h3>
                            <p style="margin:0;font-size:13px;"><i class="fas fa-map-marker-alt"></i> ${c.region || 'كل التراب'} | <i class="fas fa-calendar"></i> ${new Date(c.startDate).toLocaleDateString()}</p>
                            <span style="position:absolute;left:20px;top:20px;background:${statusColor};color:white;padding:5px 15px;border-radius:50px;font-size:12px;font-weight:bold;">${statusText}</span>
                        </div>
                        <div style="padding:20px;">
                            <div style="display:flex;justify-content:space-around;margin-bottom:20px;padding-bottom:15px;border-bottom:1px solid #eee;">
                                <div style="text-align:center;"><div style="font-size:28px;font-weight:800;">${totalFiles}</div><div style="font-size:12px;">ملفات</div></div>
                                <div style="text-align:center;"><div style="font-size:28px;font-weight:800;">${campaignFiles.filter(f => f.status === 'approved').length}</div><div style="font-size:12px;">مقبولة</div></div>
                                <div style="text-align:center;"><div style="font-size:28px;font-weight:800;">${campaignFiles.filter(f => f.status === 'pending').length}</div><div style="font-size:12px;">قيد الانتظار</div></div>
                            </div>
                            <div style="display:flex;gap:10px;justify-content:flex-end;">
                                <button style="padding:8px 18px;border-radius:40px;background:#1C4B2D;color:white;border:none;cursor:pointer;" onclick="showCampaignProfile(${c.id})"><i class="fas fa-eye"></i> مشاهدة</button>
                                <button style="padding:8px 18px;border-radius:40px;background:#17a2b8;color:white;border:none;cursor:pointer;" onclick="selectCampaign(${c.id})" ${isCompleted ? 'disabled' : ''}><i class="fas fa-folder-open"></i> فتح</button>
                                <button style="padding:8px 18px;border-radius:40px;background:#D4AF37;color:#1C4B2D;border:none;cursor:pointer;" onclick="editCampaign(${c.id})"><i class="fas fa-edit"></i> تعديل</button>
                                <button style="padding:8px 18px;border-radius:40px;background:#dc3545;color:white;border:none;cursor:pointer;" onclick="deleteCampaign(${c.id})"><i class="fas fa-trash"></i> حذف</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('') + `</div>`;
        }
    }
    
    // تحديث شارة عدد الحملات
    let campaignsCount = document.getElementById('campaignsCount');
    if (campaignsCount) {
        let allCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
        campaignsCount.textContent = allCampaigns.length;
    }
    
    alert('تم إنشاء الحملة بنجاح');
}

// ============================================
// تحديث دوال العرض لاستخدام البروفايلات الجديدة
// ============================================

// عرض المستغلون - بطاقات جميلة
function renderExploitantsList() {
    let container = document.getElementById("exploitantsList");
    if (!container) return;
    
    if (exploitants.length === 0) { 
        container.innerHTML = `<div style="text-align:center;padding:60px;">
            <i class="fas fa-user-tie" style="font-size:64px; color:#D4AF37; opacity:0.3;"></i>
            <h3 style="margin-top:20px;">${L('لا يوجد مستغلين', 'Aucun exploitant')}</h3>
            <button class="btn btn-primary" onclick="showAddExploitantModal()" style="margin-top:15px;">+ ${L('إضافة مستغل جديد', 'Ajouter un exploitant')}</button>
        </div>`; 
        document.getElementById("exploitantsCount").textContent = "0"; 
        return; 
    }
    
    container.innerHTML = `<div class="exploitants-container">` + exploitants.map(e => {
        let phoneFull = `${e.phone1 || ''}${e.phone2 || ''}${e.phone3 || ''}${e.phone4 || ''}${e.phone5 || ''}`;
        let exploitationsCount = exploitations.filter(ex => ex.exploitantId == e.id).length;
        
        return `
            <div class="exploitant-card" onclick="showExploitantProfile(${e.id})">
                <div class="exploitant-card-header">
                    <div class="exploitant-avatar">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <h3>${e.nom || ''} ${e.prenom || ''}</h3>
                    <p><i class="fas fa-map-marker-alt"></i> ${e.wilaya2 || L('ولاية غير محددة', 'Wilaya non définie')}</p>
                </div>
                <div class="exploitant-card-body">
                    <div class="exploitant-info-row">
                        <span class="exploitant-info-label"><i class="fas fa-phone"></i> ${L('الهاتف', 'Téléphone')}</span>
                        <span class="exploitant-info-value">${phoneFull || L('غير محدد', 'Non défini')}</span>
                    </div>
                    <div class="exploitant-info-row">
                        <span class="exploitant-info-label"><i class="fas fa-tractor"></i> ${L('المستغلات', 'Exploitations')}</span>
                        <span class="exploitant-info-value">${exploitationsCount}</span>
                    </div>
                    <div class="exploitant-info-row">
                        <span class="exploitant-info-label"><i class="fas fa-calendar"></i> ${L('تاريخ التسجيل', 'Date d\'inscription')}</span>
                        <span class="exploitant-info-value">${new Date(e.dateCreation).toLocaleDateString(dateLocaleStr())}</span>
                    </div>
                </div>
                <div class="exploitant-card-actions">
                    <button class="btn-modern btn-modern-info" onclick="event.stopPropagation(); showExploitantProfile(${e.id})">
                        <i class="fas fa-eye"></i> ${L('عرض البروفايل', 'Voir le profil')}
                    </button>
                    <button class="btn-modern btn-modern-danger"  onclick="event.stopPropagation(); deleteExploitant(${e.id})">
                        <i class="fas fa-trash"></i> ${L('حذف', 'Supprimer')}
                    </button>
                </div>
            </div>
        `;
    }).join('') + `</div>`;
    
    document.getElementById("exploitantsCount").textContent = exploitants.length;
}
// عرض المستغلات - بطاقات جميلة
function renderExploitationsList() {
    let container = document.getElementById("exploitationsList");
    if(!container) return;
    
    if(exploitations.length === 0) { 
        container.innerHTML = `<div style="text-align:center;padding:60px;">
            <i class="fas fa-tractor" style="font-size:64px; color:#D4AF37; opacity:0.3;"></i>
            <h3 style="margin-top:20px;">${L('لا يوجد مستغلات', 'Aucune exploitation')}</h3>
            <button class="btn btn-primary" onclick="showAddExploitationModal()" style="margin-top:15px;">+ ${L('إضافة مستغلة جديدة', 'Ajouter une exploitation')}</button>
        </div>`; 
        document.getElementById("exploitationsCount").textContent = "0"; 
        return; 
    }
    
    container.innerHTML = `<div class="exploitations-container">` + exploitations.map(e => {
        let surveyFilesCount = farmers.filter(f => f.exploitationId == e.id).length;
        
        return `
            <div class="exploitation-card" onclick="showExploitationProfile(${e.id})">
                <div class="exploitation-card-header">
                    <div class="exploitation-avatar">
                        <i class="fas fa-tractor"></i>
                    </div>
                    <h3>${e.nom || L('غير محدد', 'Non défini')}</h3>
                    <p><i class="fas fa-user-tie"></i> ${e.exploitantNom || L('فلاح غير محدد', 'Agriculteur non défini')}</p>
                </div>
                <div class="exploitation-card-body">
                    <div class="exploitation-info-row">
                        <span class="exploitation-info-label"><i class="fas fa-ruler-combined"></i> ${L('المساحة', 'Superficie')}</span>
                        <span class="exploitation-info-value">${e.superficie || "0"} ${L('هكتار', 'ha')}</span>
                    </div>
                    <div class="exploitation-info-row">
                        <span class="exploitation-info-label"><i class="fas fa-seedling"></i> ${L('النشاط', 'Activité')}</span>
                        <span class="exploitation-info-value">${e.vocation === 'نباتي' ? L('🌱 نباتي', '🌱 Végétal') : e.vocation === 'حيواني' ? L('🐄 حيواني', '🐄 Animal') : L('🌾 مختلط', '🌾 Mixte')}</span>
                    </div>
                    <div class="exploitation-info-row">
                        <span class="exploitation-info-label"><i class="fas fa-file-alt"></i> ${L('ملفات الإحصاء', 'Dossiers recensement')}</span>
                        <span class="exploitation-info-value">${surveyFilesCount}</span>
                    </div>
                </div>
                <div class="exploitation-card-actions">
                    <button class="btn-modern btn-modern-info" onclick="event.stopPropagation(); showExploitationProfile(${e.id})">
                        <i class="fas fa-eye"></i> ${L('عرض التفاصيل', 'Voir les détails')}
                    </button>
                    <button class="btn-modern btn-modern-danger" onclick="event.stopPropagation(); deleteExploitation(${e.id})">
                        <i class="fas fa-trash"></i> ${L('حذف', 'Supprimer')}
                    </button>
                </div>
            </div>
        `;
    }).join('') + `</div>`;
    
    document.getElementById("exploitationsCount").textContent = exploitations.length;
}
// عرض الحملات - مع داشبورد وأزرار منظمة
function renderCampaignsList() {
    let container = document.getElementById("campaignsList");
    if(!container) return;
    
    let totalCampaigns = campaigns.length;
    let activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    let completedCampaigns = campaigns.filter(c => c.status === 'completed').length;
    let pendingCampaigns = campaigns.filter(c => c.status === 'pending').length;
    
    let dashboardHTML = `
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:30px;">
            <div style="background:rgba(255,255,255,0.9);border-radius:25px;padding:20px;text-align:center;">
                <div style="font-size:32px;font-weight:800;">${totalCampaigns}</div>
                <div>${L('إجمالي الحملات', 'Total campagnes')}</div>
            </div>
            <div style="background:rgba(255,255,255,0.9);border-radius:25px;padding:20px;text-align:center;">
                <div style="font-size:32px;font-weight:800;">${activeCampaigns}</div>
                <div>${L('حملات نشطة', 'Campagnes actives')}</div>
            </div>
            <div style="background:rgba(255,255,255,0.9);border-radius:25px;padding:20px;text-align:center;">
                <div style="font-size:32px;font-weight:800;">${completedCampaigns}</div>
                <div>${L('حملات مكتملة', 'Campagnes terminées')}</div>
            </div>
            <div style="background:rgba(255,255,255,0.9);border-radius:25px;padding:20px;text-align:center;">
                <div style="font-size:32px;font-weight:800;">${pendingCampaigns}</div>
                <div>${L('قيد التحضير', 'En préparation')}</div>
            </div>
        </div>
    `;
    
    if(campaigns.length === 0) { 
        container.innerHTML = dashboardHTML + `<div style="text-align:center;padding:60px;">${L('لا توجد حملات', 'Aucune campagne')}</div>`; 
        return; 
    }
    
    container.innerHTML = dashboardHTML + `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:25px;">` + campaigns.map(c => {
        let campaignFiles = farmers.filter(f => f.campaignId == c.id);
        let totalFiles = campaignFiles.length;
        
        let statusText = c.status === 'active' ? L('نشطة', 'Active') : (c.status === 'completed' ? L('مكتملة', 'Terminée') : L('قيد التحضير', 'En préparation'));
        let statusColor = c.status === 'active' ? '#28a745' : (c.status === 'completed' ? '#17a2b8' : '#ffc107');
        let isCompleted = c.status === 'completed';
        
        return `
            <div style="background:white;border-radius:28px;overflow:hidden;box-shadow:0 10px 30px -10px rgba(0,0,0,0.1);border:1px solid rgba(212,175,55,0.2);">
                <div style="background:linear-gradient(135deg,#1C4B2D,#2E6B3E);padding:20px;color:white;position:relative;">
                    <h3 style="margin:0 0 8px 0;"><i class="fas fa-chart-line"></i> ${c.name}</h3>
                    <p style="margin:0;font-size:13px;"><i class="fas fa-map-marker-alt"></i> ${c.region || L('كل التراب', 'Tout le territoire')} | <i class="fas fa-calendar"></i> ${new Date(c.startDate).toLocaleDateString(dateLocaleStr())}</p>
                    <span style="position:absolute;left:20px;top:20px;background:${statusColor};color:white;padding:5px 15px;border-radius:50px;font-size:12px;font-weight:bold;">
                        ${statusText}
                    </span>
                </div>
                <div style="padding:20px;">
                    <div style="display:flex;justify-content:space-around;margin-bottom:20px;padding-bottom:15px;border-bottom:1px solid #eee;">
                        <div style="text-align:center;"><div style="font-size:28px;font-weight:800;">${totalFiles}</div><div style="font-size:12px;">${L('ملفات', 'dossiers')}</div></div>
                        <div style="text-align:center;"><div style="font-size:28px;font-weight:800;">${campaignFiles.filter(f => f.status === 'approved').length}</div><div style="font-size:12px;">${L('مقبولة', 'approuvés')}</div></div>
                        <div style="text-align:center;"><div style="font-size:28px;font-weight:800;">${campaignFiles.filter(f => f.status === 'pending').length}</div><div style="font-size:12px;">${L('قيد الانتظار', 'en attente')}</div></div>
                    </div>
                    <div style="display:flex;gap:10px;justify-content:flex-end;">
                        <button style="padding:8px 18px;border-radius:40px;background:#1C4B2D;color:white;border:none;cursor:pointer;" onclick="showCampaignProfile(${c.id})"><i class="fas fa-eye"></i> ${L('مشاهدة', 'Voir')}</button>
                        <button style="padding:8px 18px;border-radius:40px;background:#17a2b8;color:white;border:none;cursor:pointer;" onclick="selectCampaign(${c.id})" ${isCompleted ? 'disabled' : ''}><i class="fas fa-folder-open"></i> ${L('فتح', 'Ouvrir')}</button>
                        <button style="padding:8px 18px;border-radius:40px;background:#D4AF37;color:#1C4B2D;border:none;cursor:pointer;" onclick="editCampaign(${c.id})"><i class="fas fa-edit"></i> ${L('تعديل', 'Modifier')}</button>
                        ${!isCompleted ? `<button style="padding:8px 18px;border-radius:40px;background:#138496;color:white;border:none;cursor:pointer;" onclick="completeCampaign(${c.id})"><i class="fas fa-check-double"></i> ${L('إكمال', 'Terminer')}</button>` : ''}
                        <button style="padding:8px 18px;border-radius:40px;background:#dc3545;color:white;border:none;cursor:pointer;" onclick="deleteCampaign(${c.id})"><i class="fas fa-trash"></i> ${L('حذف', 'Supprimer')}</button>
                    </div>
                </div>
            </div>
        `;
    }).join('') + `</div>`;
}
// ============================================
// دوال تعديل الحملة وإكمالها
// ============================================

// فتح نافذة تعديل الحملة
function editCampaign(id) {
    let campaign = campaigns.find(c => c.id == id);
    if (!campaign) return;
    
    document.getElementById("editCampaignId").value = campaign.id;
    document.getElementById("editCampaignName").value = campaign.name;
    document.getElementById("editCampaignRegion").value = campaign.region || "";
    document.getElementById("editCampaignStartDate").value = campaign.startDate?.split('T')[0] || "";
    document.getElementById("editCampaignEndDate").value = campaign.endDate?.split('T')[0] || "";
    document.getElementById("editCampaignDescription").value = campaign.description || "";
    document.getElementById("editCampaignStatus").value = campaign.status || "active";
    
    document.getElementById("editCampaignModal").classList.add("active");
}

function closeEditCampaignModal() {
    document.getElementById("editCampaignModal").classList.remove("active");
}

// تحديث الحملة بعد التعديل
function updateCampaign() {
    let id = parseInt(document.getElementById("editCampaignId").value);
    let name = document.getElementById("editCampaignName").value;
    
    if (!name) {
        showToast(L("الرجاء إدخال اسم الحملة", "Veuillez saisir le nom de la campagne"), "error");
        return;
    }
    
    let index = campaigns.findIndex(c => c.id == id);
    if (index !== -1) {
        campaigns[index] = {
            ...campaigns[index],
            name: name,
            region: document.getElementById("editCampaignRegion").value,
            startDate: document.getElementById("editCampaignStartDate").value || campaigns[index].startDate,
            endDate: document.getElementById("editCampaignEndDate").value,
            description: document.getElementById("editCampaignDescription").value,
            status: document.getElementById("editCampaignStatus").value
        };
        
        localStorage.setItem("campaigns", JSON.stringify(campaigns));
        closeEditCampaignModal();
        renderCampaignsList();
        showToast(L("تم تعديل الحملة بنجاح", "Campagne modifiée avec succès"), "success");
    }
}

// إكمال الحملة (لا يمكن إضافة ملفات جديدة)
function completeCampaign(id) {
    if (!confirm(L("هل أنت متأكد من إكمال هذه الحملة؟ بعد الإكمال لن تتمكن من إضافة ملفات إحصاء جديدة فيها!", "Êtes-vous sûr de vouloir terminer cette campagne ? Vous ne pourrez plus y ajouter de dossiers !"))) return;
    
    let index = campaigns.findIndex(c => c.id == id);
    if (index !== -1) {
        campaigns[index].status = "completed";
        campaigns[index].endDate = campaigns[index].endDate || new Date().toISOString().split('T')[0];
        localStorage.setItem("campaigns", JSON.stringify(campaigns));
        
        // إذا كانت هذه هي الحملة النشطة حالياً، قم بإلغائها
        if (currentCampaignId == id) {
            currentCampaignId = null;
        }
        
        renderCampaignsList();
        showToast(L("تم إكمال الحملة بنجاح", "Campagne terminée avec succès"), "success");
    }
}

// تحديث دالة showNewSurveyFileModal لمنع إنشاء ملفات في الحملات المكتملة
function showNewSurveyFileModal() {
    if(!currentCampaignId) { 
        showToast(L("الرجاء اختيار حملة أولاً", "Veuillez d'abord choisir une campagne"), "error"); 
        return; 
    }
    
    let campaign = campaigns.find(c => c.id == currentCampaignId);
    if (campaign && campaign.status === 'completed') {
        showToast(L("لا يمكن إضافة ملفات جديدة إلى حملة مكتملة", "Impossible d'ajouter des dossiers à une campagne terminée"), "warning");
        return;
    }
    
    updateExploitantsSelects();
    document.getElementById("newSurveyFileModal").style.display = "flex";
    document.getElementById("surveyExploitationSelect").innerHTML = `<option value=''>${L('-- اختر فلاحاً أولاً --', '-- Choisir un agriculteur d\'abord --')}</option>`;
    document.getElementById("surveyExploitationSelect").disabled = true;
    document.getElementById("surveyRemainingFields").style.display = "none";
    document.getElementById("saveSurveyFileBtn").disabled = true;
}

// تعديل دالة renderCampaignFilesList
// عرض ملفات الإحصاء داخل الحملة - واجهة جميلة
function renderCampaignFilesList(campaignId) {
    let container = document.getElementById("campaignFilesList");
    if(!container) return;
    
    let files = farmers.filter(f => f.campaignId == campaignId);
    
    if(files.length === 0) { 
        container.innerHTML = `
            <div style="text-align:center;padding:60px;background:rgba(255,255,255,0.5);border-radius:30px;">
                <i class="fas fa-folder-open" style="font-size:64px; color:#D4AF37; opacity:0.5;"></i>
                <h3 style="margin-top:20px; color:#1C4B2D;">${L('لا توجد ملفات إحصاء', 'Aucun dossier de recensement')}</h3>
                <p style="color:#64748b;">${L('انقر على "إنشاء ملف إحصاء جديد" لإضافة أول ملف', 'Cliquez sur "Créer un nouveau dossier" pour ajouter le premier')}</p>
            </div>
        `; 
        return; 
    }
    
    container.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));gap:20px;">
            ${files.map(f => {
                let exploitant = exploitants.find(e => e.id == f.exploitantId);
                let exploitation = exploitations.find(e => e.id == f.exploitationId);
                let statusColor = f.status === 'approved' ? '#28a745' : (f.status === 'pending' ? '#ffc107' : '#dc3545');
                let statusText = f.status === 'approved' ? L('مقبول', 'Approuvé') : (f.status === 'pending' ? L('قيد الانتظار', 'En attente') : L('مرفوض', 'Rejeté'));
                
                return `
                    <div style="background:white;border-radius:25px;overflow:hidden;box-shadow:0 10px 25px -10px rgba(0,0,0,0.1);border:1px solid rgba(212,175,55,0.2);transition:transform 0.3s;cursor:pointer;" 
                         onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                        
                        <!-- رأس البطاقة -->
                        <div style="background:linear-gradient(135deg,#1C4B2D,#2E6B3E);padding:15px 20px;color:white;display:flex;justify-content:space-between;align-items:center;">
                            <div>
                                <i class="fas fa-user-tie" style="font-size:20px; margin-left:10px;"></i>
                                <span style="font-weight:bold;">${f.exploitantNom || L('غير محدد', 'Non défini')}</span>
                            </div>
                            <div style="background:${statusColor};padding:4px 12px;border-radius:50px;font-size:12px;font-weight:bold;">
                                ${statusText}
                            </div>
                        </div>
                        
                        <!-- محتوى البطاقة -->
                        <div style="padding:15px 20px;">
                            <!-- المستغلة -->
                            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;padding-bottom:10px;border-bottom:1px dashed #eee;">
                                <i class="fas fa-tractor" style="color:#D4AF37; width:25px;"></i>
                                <div>
                                    <div style="font-size:12px;color:#64748b;">${L('المستغلة', 'Exploitation')}</div>
                                    <div style="font-weight:600;">${f.exploitationNom || L('غير محدد', 'Non défini')}</div>
                                </div>
                            </div>
                            
                            <!-- المنطقة والتاريخ -->
                            <div style="display:flex;gap:15px;margin-bottom:12px;padding-bottom:10px;border-bottom:1px dashed #eee;">
                                <div style="flex:1;">
                                    <div style="display:flex;align-items:center;gap:8px;">
                                        <i class="fas fa-map-marker-alt" style="color:#D4AF37; width:20px;"></i>
                                        <span style="font-size:13px;">${exploitation?.wilaya2 || exploitation?.wilaya || L('غير محدد', 'Non défini')}</span>
                                    </div>
                                </div>
                                <div style="flex:1;">
                                    <div style="display:flex;align-items:center;gap:8px;">
                                        <i class="fas fa-calendar" style="color:#D4AF37; width:20px;"></i>
                                        <span style="font-size:13px;">${new Date(f.date).toLocaleDateString(dateLocaleStr())}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- إحصائيات سريعة -->
                            <div style="display:flex;justify-content:space-around;margin-bottom:15px;padding:10px;background:#f8fafc;border-radius:15px;">
                                <div style="text-align:center;">
                                    <div style="font-weight:800;color:#1C4B2D;">${parseInt(f.bovins) + parseInt(f.ovins) + parseInt(f.caprins) || 0}</div>
                                    <div style="font-size:10px;color:#64748b;">${L('مواشي', 'cheptel')}</div>
                                </div>
                                <div style="text-align:center;">
                                    <div style="font-weight:800;color:#1C4B2D;">${f.superficie || exploitation?.superficie || '0'}</div>
                                    <div style="font-size:10px;color:#64748b;">${L('هكتار', 'ha')}</div>
                                </div>
                                <div style="text-align:center;">
                                    <div style="font-weight:800;color:#1C4B2D;">${parseInt(f.batimentsHabitationNb) + parseInt(f.bergeriesNb) || 0}</div>
                                    <div style="font-size:10px;color:#64748b;">${L('مباني', 'bâtiments')}</div>
                                </div>
                            </div>
                            
                            <!-- الأزرار -->
                            <div style="display:flex;gap:10px;justify-content:flex-end;">
                                <button onclick="event.stopPropagation(); showSurveyFileProfile(${f.id})" 
                                        style="padding:8px 15px;border-radius:30px;background:#1C4B2D;color:white;border:none;cursor:pointer;font-size:12px;display:flex;align-items:center;gap:5px;">
                                    <i class="fas fa-eye"></i> ${L('عرض التفاصيل', 'Détails')}
                                </button>
                                <button onclick="event.stopPropagation(); editSurveyFileInCampaign(${f.id})" 
                                        style="padding:8px 15px;border-radius:30px;background:#D4AF37;color:#1C4B2D;border:none;cursor:pointer;font-size:12px;display:flex;align-items:center;gap:5px;">
                                    <i class="fas fa-edit"></i> ${L('تعديل', 'Modifier')}
                                </button>
                                <button onclick="event.stopPropagation(); deleteSurveyFile(${f.id})" 
                                        style="padding:8px 15px;border-radius:30px;background:#dc3545;color:white;border:none;cursor:pointer;font-size:12px;display:flex;align-items:center;gap:5px;">
                                    <i class="fas fa-trash"></i> ${L('حذف', 'Supprimer')}
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// تعديل ملف الإحصاء داخل الحملة
function editSurveyFileInCampaign(fileId) {
    let file = farmers.find(f => f.id == fileId);
    if (!file) return;
    
    // حفظ معرف الملف الجاري تعديله
    window.editingSurveyFileId = fileId;
    
    // تعبئة النموذج ببيانات الملف
    document.getElementById("surveyExploitantSelect").value = file.exploitantId;
    loadExploitationsForSurvey();
    
    setTimeout(() => {
        document.getElementById("surveyExploitationSelect").value = file.exploitationId;
        
        // تعبئة باقي الحقول
        document.getElementById("surveyBiologique").value = file.biologique || "";
        document.getElementById("surveyCertificatBio").value = file.certificatBio || "";
        document.getElementById("surveyAquaculture").value = file.aquaculture || "";
        document.getElementById("surveyHelicicult").value = file.helicicult || "";
        document.getElementById("surveyMyciculture").value = file.myciculture || "";
        document.getElementById("surveyContractuelle").value = file.contractuelle || "";
        
        document.getElementById("surveyBovins").value = file.bovins || "";
        document.getElementById("surveyOvins").value = file.ovins || "";
        document.getElementById("surveyCaprins").value = file.caprins || "";
        document.getElementById("surveyCamelins").value = file.camelins || "";
        document.getElementById("surveyEquins").value = file.equins || "";
        document.getElementById("surveyPouletsChair").value = file.pouletsChair || "";
        document.getElementById("surveyLapins").value = file.lapins || "";
        
        document.getElementById("surveyBatimentsHabitationNb").value = file.batimentsHabitationNb || "";
        document.getElementById("surveyBatimentsHabitationSurface").value = file.batimentsHabitationSurface || "";
        document.getElementById("surveyBergeriesNb").value = file.bergeriesNb || "";
        document.getElementById("surveyStockageNb").value = file.stockageNb || "";
        
        document.getElementById("surveyOuvMaleP").value = file.ouvMaleP || "";
        document.getElementById("surveyOuvFemaleP").value = file.ouvFemaleP || "";
        document.getElementById("surveyOuvMaleJ").value = file.ouvMaleJ || "";
        document.getElementById("surveyOuvFemaleJ").value = file.ouvFemaleJ || "";
        
        document.getElementById("surveyFinancePropress").checked = file.financePropress || false;
        document.getElementById("surveyFinanceCredit").checked = file.financeCredit || false;
        document.getElementById("surveyAssuranceAgricole").value = file.assuranceAgricole || "";
        document.getElementById("surveyTypeCredit").value = file.typeCredit || "";
        
        document.getElementById("surveyFournisseurs").value = file.fournisseurs || "";
        document.getElementById("surveyVenteDirecte").checked = file.venteDirecte || false;
        document.getElementById("surveyVenteGros").checked = file.venteGros || false;
        
        document.getElementById("surveyRemainingFields").style.display = "block";
        document.getElementById("saveSurveyFileBtn").disabled = false;
        
        // تغيير نص زر الحفظ
        let saveBtn = document.getElementById("saveSurveyFileBtn");
        if (saveBtn) {
            saveBtn.innerHTML = `<i class="fas fa-save"></i> ${L('تحديث الملف', 'Mettre à jour')}`;
            saveBtn.setAttribute("onclick", "updateSurveyFile()");
        }
        
        document.getElementById("newSurveyFileModal").style.display = "flex";
    }, 100);
}

// تحديث ملف الإحصاء بدلاً من إنشاء جديد
function updateSurveyFile() {
    let exploitantId = document.getElementById("surveyExploitantSelect").value;
    let exploitationId = document.getElementById("surveyExploitationSelect").value;
    
    if(!exploitantId || !exploitationId) { 
        showToast(L("اختر الفلاح والمستغلة", "Choisir l'agriculteur et l'exploitation"), "error"); 
        return; 
    }
    
    let updatedFile = {
        id: window.editingSurveyFileId,
        campaignId: currentCampaignId,
        exploitantId: parseInt(exploitantId),
        exploitationId: parseInt(exploitationId),
        exploitantNom: exploitants.find(e => e.id == exploitantId)?.nom || "",
        exploitationNom: exploitations.find(e => e.id == exploitationId)?.nom || "",
        date: new Date().toISOString(),
        status: "pending",
        
        biologique: document.getElementById("surveyBiologique").value,
        certificatBio: document.getElementById("surveyCertificatBio").value,
        aquaculture: document.getElementById("surveyAquaculture").value,
        helicicult: document.getElementById("surveyHelicicult").value,
        myciculture: document.getElementById("surveyMyciculture").value,
        contractuelle: document.getElementById("surveyContractuelle").value,
        
        bovins: document.getElementById("surveyBovins").value,
        ovins: document.getElementById("surveyOvins").value,
        caprins: document.getElementById("surveyCaprins").value,
        camelins: document.getElementById("surveyCamelins").value,
        equins: document.getElementById("surveyEquins").value,
        pouletsChair: document.getElementById("surveyPouletsChair").value,
        lapins: document.getElementById("surveyLapins").value,
        
        batimentsHabitationNb: document.getElementById("surveyBatimentsHabitationNb").value,
        batimentsHabitationSurface: document.getElementById("surveyBatimentsHabitationSurface").value,
        bergeriesNb: document.getElementById("surveyBergeriesNb").value,
        stockageNb: document.getElementById("surveyStockageNb").value,
        
        ouvMaleP: document.getElementById("surveyOuvMaleP").value,
        ouvFemaleP: document.getElementById("surveyOuvFemaleP").value,
        ouvMaleJ: document.getElementById("surveyOuvMaleJ").value,
        ouvFemaleJ: document.getElementById("surveyOuvFemaleJ").value,
        
        financePropress: document.getElementById("surveyFinancePropress")?.checked || false,
        financeCredit: document.getElementById("surveyFinanceCredit")?.checked || false,
        assuranceAgricole: document.getElementById("surveyAssuranceAgricole").value,
        typeCredit: document.getElementById("surveyTypeCredit").value,
        
        fournisseurs: document.getElementById("surveyFournisseurs").value,
        venteDirecte: document.getElementById("surveyVenteDirecte")?.checked || false,
        venteGros: document.getElementById("surveyVenteGros")?.checked || false
    };
    
    // تحديث الملف في المصفوفة
    let index = farmers.findIndex(f => f.id == window.editingSurveyFileId);
    if (index !== -1) {
        farmers[index] = updatedFile;
        localStorage.setItem("farmers", JSON.stringify(farmers));
        showToast(L("تم تحديث ملف الإحصاء بنجاح", "Dossier mis à jour avec succès"), "success");
    }
    
    closeNewSurveyFileModal();
    if(currentCampaignId) renderCampaignFilesList(currentCampaignId);
    
    // إعادة تعيين زر الحفظ
    let saveBtn = document.getElementById("saveSurveyFileBtn");
    if (saveBtn) {
        saveBtn.innerHTML = `<i class="fas fa-save"></i> ${L('حفظ ملف الإحصاء', 'Enregistrer le dossier')}`;
        saveBtn.setAttribute("onclick", "saveSurveyFile()");
    }
    window.editingSurveyFileId = null;
}
    function deconnexion() {
  localStorage.removeItem('user');
  sessionStorage.clear();
  window.location.href = '../login.html';
}

    /**
     * Toggle between Arabic (RTL) and French (LTR)
     */
    function toggleLang() {
        currentLang = (currentLang === 'ar') ? 'fr' : 'ar';
        localStorage.setItem(LANG_KEY, currentLang);
        applyLang(currentLang);
        // Re-render current page to update JS-generated content
        showPage(currentActivePage || 'dashboard');
    }

    /**
     * Apply language to all translated elements
     */
  

/**
 * تطبيق اللغة على جميع عناصر الصفحة وترتيب القائمة والمحتوى بشكل صحيح
 */
function applyLang(lang) {
    const isAr = (lang === 'ar');
    const html = document.documentElement;
    
    // 1. تعيين اتجاه الصفحة واللغة (هذا هو الأساس)
    html.setAttribute('lang', lang);
    html.setAttribute('dir', isAr ? 'rtl' : 'ltr');
    
    // 2. تحديث نص زر تبديل اللغة
    const langBtnLabel = document.getElementById('langBtnLabel');
    if (langBtnLabel) {
        langBtnLabel.textContent = isAr ? 'Français' : 'عربي';
    }
    
    // 3. تحديث جميع النصوص الثابتة (العناصر التي تحمل data-ar و data-fr)
    document.querySelectorAll('[data-ar][data-fr]').forEach(el => {
        // نتخطى عناصر الإدخال لأن لها معالجة منفصلة
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return;
        el.textContent = isAr ? el.dataset.ar : el.dataset.fr;
    });
    
    // 4. تحديث النصوص داخل الأزرار والعناصر التفاعلية التي قد تحتوي على HTML
    document.querySelectorAll('[data-ar][data-fr]').forEach(el => {
        if (el.innerHTML.includes('<i class="fas')) return; // نحتفظ بالأيقونات
        if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') {
            el.textContent = isAr ? el.dataset.ar : el.dataset.fr;
        }
    });
    
    // 5. تحديث الـ placeholders
    document.querySelectorAll('[data-placeholder-ar][data-placeholder-fr]').forEach(el => {
        el.placeholder = isAr ? el.dataset.placeholderAr : el.dataset.placeholderFr;
    });
    
    // 6. تحديث خيارات القوائم المنسدلة (select options)
    document.querySelectorAll('option[data-ar][data-fr]').forEach(opt => {
        opt.textContent = isAr ? opt.dataset.ar : opt.dataset.fr;
    });
    
    // 7. الحل السحري: إعادة تعيين أي أنماط مضمنة قد تسبب المشكلة
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
        // نزيل أي style مضمن قد يكون تسبب في الخلل
        mainContainer.style.gridTemplateColumns = '';
        mainContainer.style.direction = '';
    }
    
    // 8. تحديث هوامش الشارات (badges) داخل القائمة الجانبية
    document.querySelectorAll('.badge').forEach(badge => {
        if (isAr) {
            badge.style.marginRight = 'auto';
            badge.style.marginLeft = '';
        } else {
            badge.style.marginLeft = 'auto';
            badge.style.marginRight = '';
        }
    });
    
    // 9. إعادة تحميل الصفحة الحالية لتحديث جميع المحتويات الديناميكية
    if (typeof currentActivePage !== 'undefined' && currentActivePage) {
        // نستخدم setTimeout لضمان تطبيق تغيير الاتجاه قبل إعادة الرسم
        setTimeout(() => {
            showPage(currentActivePage);
        }, 10);
    }
    
    // 10. تحديث إحصائيات لوحة التحكم إذا كنا فيها
    if (typeof updateDashboardStats !== 'undefined') {
        updateDashboardStats();
    }
}

// ============================================
// دوال المستخدمين والأقاليم والصلاحيات (نسخة كاملة وعاملة)
// ============================================

// ربط زر إضافة مستخدم جديد بعد تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    let addBtn = document.getElementById('addUserBtn');
    if (addBtn) {
        addBtn.onclick = function() {
            console.log('تم الضغط على زر إضافة مستخدم');
            showAddUserModal();
        };
    }
});

// إظهار نافذة إضافة مستخدم جديد
function showAddUserModal() {
    console.log('فتح نافذة إضافة مستخدم');
    document.getElementById('userModalTitle').innerHTML = 'مستخدم جديد';
    document.getElementById('editUserId').value = '';
    document.getElementById('userFirstName').value = '';
    document.getElementById('userLastName').value = '';
    document.getElementById('userEmail').value = '';
    document.getElementById('userPassword').value = '';
    document.getElementById('userRole').value = 'Agent';
    document.getElementById('userStatus').value = 'active';
    
    document.getElementById('pwdRequired').style.display = 'inline';
    document.getElementById('pwdNote').style.display = 'block';
    
    document.getElementById('userModal').style.display = 'flex';
}

// إغلاق نافذة المستخدم
function closeUserModal() {
    document.getElementById('userModal').style.display = 'none';
}

// حفظ المستخدم (جديد أو تعديل)
function saveUser() {
    console.log('حفظ المستخدم');
    let userId = document.getElementById('editUserId').value;
    let firstName = document.getElementById('userFirstName').value.trim();
    let lastName = document.getElementById('userLastName').value.trim();
    let email = document.getElementById('userEmail').value.trim();
    let password = document.getElementById('userPassword').value;
    let role = document.getElementById('userRole').value;
    let status = document.getElementById('userStatus').value;
    
    if (!firstName || !lastName) {
        alert('الرجاء إدخال الاسم واللقب');
        return;
    }
    if (!email) {
        alert('الرجاء إدخال البريد الإلكتروني');
        return;
    }
    
    let fullName = firstName + ' ' + lastName;
    
    // تحميل البيانات الحالية
    let systemUsers = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    let userTerritories = JSON.parse(localStorage.getItem('userTerritories') || '{}');
    let userPermissions = JSON.parse(localStorage.getItem('userPermissions') || '{}');
    
    if (userId) {
        // تعديل مستخدم موجود
        let index = systemUsers.findIndex(u => u.id == userId);
        if (index !== -1) {
            systemUsers[index].name = fullName;
            systemUsers[index].email = email;
            systemUsers[index].role = role;
            systemUsers[index].status = status;
            if (password) {
                systemUsers[index].password = btoa(password);
            }
            systemUsers[index].updatedAt = new Date().toISOString();
            alert('تم تعديل المستخدم بنجاح');
        }
    } else {
        // إضافة مستخدم جديد
        if (!password) {
            alert('الرجاء إدخال كلمة المرور للمستخدم الجديد');
            return;
        }
        
        if (systemUsers.find(u => u.email === email)) {
            alert('هذا البريد الإلكتروني موجود مسبقاً');
            return;
        }
        
        let newUser = {
            id: Date.now(),
            name: fullName,
            email: email,
            password: btoa(password),
            role: role,
            status: status,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };
        systemUsers.push(newUser);
        
        // إنشاء كائنات فارغة للأقاليم والصلاحيات
        if (!userTerritories[newUser.id]) userTerritories[newUser.id] = [];
        if (!userPermissions[newUser.id]) userPermissions[newUser.id] = { evaluation: 'none', statistics: 'none', dailyQuota: '' };
        
        alert('تم إنشاء المستخدم بنجاح');
    }
    
    // حفظ البيانات
    localStorage.setItem('systemUsers', JSON.stringify(systemUsers));
    localStorage.setItem('userTerritories', JSON.stringify(userTerritories));
    localStorage.setItem('userPermissions', JSON.stringify(userPermissions));
    
    closeUserModal();
    renderUsersPage(); // تحديث الجدول
    updateUsersBadge();
}

// عرض جدول المستخدمين
function renderUsersPage() {
    console.log('عرض صفحة المستخدمين');
    let tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    let systemUsers = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    let userTerritories = JSON.parse(localStorage.getItem('userTerritories') || '{}');
    
    if (systemUsers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;">لا يوجد مستخدمون</td></tr>';
        document.getElementById('usersCount').textContent = '0';
        return;
    }
    
    tbody.innerHTML = systemUsers.map(user => {
        let territories = userTerritories[user.id] || [];
        let territoryText = territories.length > 0 ? territories.map(t => t.wilayaName || t.wilaya).join(', ') : 'غير محدد';
        
        let roleColor = user.role === 'Admin' ? '#1C4B2D' : (user.role === 'Supervisor' ? '#D4AF37' : (user.role === 'Controleur' ? '#17a2b8' : '#6c757d'));
        let statusColor = user.status === 'active' ? '#28a745' : '#dc3545';
        let statusText = user.status === 'active' ? 'نشط' : 'غير نشط';
        
        return `
            <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:15px;">${user.name}</td>
                <td style="padding:15px;color:#1C4B2D;direction:ltr;text-align:left;">${user.email}</td>
                <td style="padding:15px;">
                    <span style="background:${roleColor}20;color:${roleColor};padding:5px 12px;border-radius:50px;font-size:12px;font-weight:bold;">
                        ${user.role}
                    </span>
                </td>
                <td style="padding:15px;">
                    <span style="background:${statusColor}20;color:${statusColor};padding:5px 12px;border-radius:50px;font-size:12px;">
                        ${statusText}
                    </span>
                </td>
                <td style="padding:15px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${territoryText}">
                    ${territoryText.length > 20 ? territoryText.substring(0,20)+'...' : territoryText}
                </td>
                <td style="padding:15px;">
                    <button onclick="openTerritoryPermissionsModal(${user.id}, '${user.name}')" style="background:#D4AF37;border:none;border-radius:8px;padding:6px 12px;margin-left:5px;cursor:pointer;color:#1C4B2D;" title="الأقاليم والصلاحيات">
                        <i class="fas fa-map-marked-alt"></i>
                    </button>
                    <button onclick="editUser(${user.id})" style="background:#17a2b8;border:none;border-radius:8px;padding:6px 12px;margin-left:5px;cursor:pointer;color:white;" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteUser(${user.id})" style="background:#dc3545;border:none;border-radius:8px;padding:6px 12px;cursor:pointer;color:white;" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    document.getElementById('usersCount').textContent = systemUsers.length;
}

// تعديل مستخدم
function editUser(userId) {
    let systemUsers = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    let user = systemUsers.find(u => u.id == userId);
    if (!user) return;
    
    document.getElementById('userModalTitle').innerHTML = 'تعديل مستخدم';
    document.getElementById('editUserId').value = user.id;
    
    let nameParts = (user.name || '').split(' ');
    document.getElementById('userFirstName').value = nameParts[0] || '';
    document.getElementById('userLastName').value = nameParts.slice(1).join(' ') || '';
    document.getElementById('userEmail').value = user.email || '';
    document.getElementById('userPassword').value = '';
    document.getElementById('userRole').value = user.role || 'Agent';
    document.getElementById('userStatus').value = user.status || 'active';
    
    document.getElementById('pwdRequired').style.display = 'none';
    document.getElementById('pwdNote').style.display = 'block';
    
    document.getElementById('userModal').style.display = 'flex';
}

// حذف مستخدم
function deleteUser(userId) {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    
    let systemUsers = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    let userTerritories = JSON.parse(localStorage.getItem('userTerritories') || '{}');
    let userPermissions = JSON.parse(localStorage.getItem('userPermissions') || '{}');
    
    systemUsers = systemUsers.filter(u => u.id != userId);
    delete userTerritories[userId];
    delete userPermissions[userId];
    
    localStorage.setItem('systemUsers', JSON.stringify(systemUsers));
    localStorage.setItem('userTerritories', JSON.stringify(userTerritories));
    localStorage.setItem('userPermissions', JSON.stringify(userPermissions));
    
    renderUsersPage();
    updateUsersBadge();
    alert('تم حذف المستخدم');
}

// تحديث شارة عدد المستخدمين
function updateUsersBadge() {
    let systemUsers = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    let badge = document.getElementById('usersCount');
    if (badge) badge.textContent = systemUsers.length;
}

// ============================================
// دوال الأقاليم والصلاحيات
// ============================================

function openTerritoryPermissionsModal(userId, userName) {
    document.getElementById('territoryUserId').value = userId;
    document.getElementById('territoryUserName').innerHTML = userName || 'مستخدم';
    
    renderUserTerritories(userId);
    
    let userPermissions = JSON.parse(localStorage.getItem('userPermissions') || '{}');
    let perms = userPermissions[userId] || { evaluation: 'none', statistics: 'none', dailyQuota: '' };
    document.getElementById('permEvaluation').value = perms.evaluation || 'none';
    document.getElementById('permStatistics').value = perms.statistics || 'none';
    document.getElementById('permDailyQuota').value = perms.dailyQuota || '';
    
    document.getElementById('territoryPermissionsModal').style.display = 'flex';
}



function addTerritoryToUser() {
    let userId = document.getElementById('territoryUserId').value;
    let wilaya = document.getElementById('newTerritoryWilaya').value;
    let type = document.getElementById('newTerritoryType').value;
    
    if (!wilaya) {
        alert('الرجاء اختيار الولاية');
        return;
    }
    
    let selectEl = document.getElementById('newTerritoryWilaya');
    let wilayaName = selectEl.options[selectEl.selectedIndex]?.text || wilaya;
    
    let userTerritories = JSON.parse(localStorage.getItem('userTerritories') || '{}');
    if (!userTerritories[userId]) userTerritories[userId] = [];
    
    if (userTerritories[userId].find(t => t.wilaya === wilaya)) {
        alert('هذه الولاية مضافـة مسبقاً');
        return;
    }
    
    userTerritories[userId].push({
        wilaya: wilaya,
        wilayaName: wilayaName,
        type: type
    });
    
    localStorage.setItem('userTerritories', JSON.stringify(userTerritories));
    renderUserTerritories(userId);
    renderUsersPage();
    alert('تم إضافة الإقليم بنجاح');
    
    document.getElementById('newTerritoryWilaya').value = '';
}

function removeTerritoryFromUser(userId, index) {
    if (!confirm('هل أنت متأكد من حذف هذا الإقليم؟')) return;
    
    let userTerritories = JSON.parse(localStorage.getItem('userTerritories') || '{}');
    userTerritories[userId].splice(index, 1);
    localStorage.setItem('userTerritories', JSON.stringify(userTerritories));
    renderUserTerritories(userId);
    renderUsersPage();
    alert('تم حذف الإقليم');
}

function saveTerritoryPermissions() {
    let userId = document.getElementById('territoryUserId').value;
    let userPermissions = JSON.parse(localStorage.getItem('userPermissions') || '{}');
    
    userPermissions[userId] = {
        evaluation: document.getElementById('permEvaluation').value,
        statistics: document.getElementById('permStatistics').value,
        dailyQuota: document.getElementById('permDailyQuota').value
    };
    
    localStorage.setItem('userPermissions', JSON.stringify(userPermissions));
    alert('تم حفظ الصلاحيات بنجاح');
    closeTerritoryModal();
}

function closeTerritoryModal() {
    document.getElementById('territoryPermissionsModal').style.display = 'none';
}

// ============================================
// بيانات تجريبية افتراضية
// ============================================
function initDefaultUsers() {
    let systemUsers = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    if (systemUsers.length === 0) {
        systemUsers = [
            { id: 1, name: 'كريم بن علي', email: 'admin@agri.dz', password: btoa('admin123'), role: 'Admin', status: 'active', createdAt: new Date().toISOString(), lastLogin: new Date().toISOString() },
            { id: 2, name: 'محمد نور', email: 'supervisor.nord@agri.dz', password: btoa('super123'), role: 'Supervisor', status: 'active', createdAt: new Date().toISOString(), lastLogin: new Date().toISOString() },
            { id: 3, name: 'يوسف راشدي', email: 'controleur.tipaza@agri.dz', password: btoa('ctrl123'), role: 'Controleur', status: 'active', createdAt: new Date().toISOString(), lastLogin: new Date().toISOString() }
        ];
        localStorage.setItem('systemUsers', JSON.stringify(systemUsers));
        
        let userTerritories = {};
        userTerritories[2] = [{ wilaya: '16', wilayaName: '16 - الجزائر', type: 'supervisor' }];
        userTerritories[3] = [{ wilaya: '42', wilayaName: '42 - تيبازة', type: 'controleur' }];
        localStorage.setItem('userTerritories', JSON.stringify(userTerritories));
        
        let userPermissions = {};
        userPermissions[2] = { evaluation: 'full', statistics: 'full', dailyQuota: '' };
        userPermissions[3] = { evaluation: 'view', statistics: 'view', dailyQuota: '50' };
        localStorage.setItem('userPermissions', JSON.stringify(userPermissions));
    }
}

// تشغيل التهيئة
initDefaultUsers();
// ============================================
// دوال الأقاليم والصلاحيات
// ============================================

// ============================================
// دوال الأقاليم والصلاحيات - إصلاح كامل
// ============================================

// فتح نافذة الأقاليم والصلاحيات
function openTerritoryPermissionsModal(userId, userName) {
    console.log('فتح نافذة الأقاليم لمستخدم:', userId, userName);
    
    // التأكد من وجود العناصر في الصفحة
    if (!document.getElementById('territoryPermissionsModal')) {
        console.error('نافذة الأقاليم غير موجودة في الصفحة');
        alert('خطأ: نافذة الأقاليم غير موجودة. تأكد من إضافة HTML الخاص بها.');
        return;
    }
    
    document.getElementById('territoryUserId').value = userId;
    document.getElementById('territoryUserName').innerHTML = userName || 'مستخدم';
    
    // عرض الأقاليم المسندة للمستخدم
    renderUserTerritories(userId);
    
    // عرض الصلاحيات المحفوظة
    let userPermissions = JSON.parse(localStorage.getItem('userPermissions') || '{}');
    let perms = userPermissions[userId] || { evaluation: 'none', statistics: 'none', dailyQuota: '' };
    
    let evalSelect = document.getElementById('permEvaluation');
    let statSelect = document.getElementById('permStatistics');
    let quotaInput = document.getElementById('permDailyQuota');
    
    if (evalSelect) evalSelect.value = perms.evaluation || 'none';
    if (statSelect) statSelect.value = perms.statistics || 'none';
    if (quotaInput) quotaInput.value = perms.dailyQuota || '';
    
    // إظهار النافذة
    document.getElementById('territoryPermissionsModal').style.display = 'flex';
}

// عرض أقاليم المستخدم في الجدول
function renderUserTerritories(userId) {
    let tbody = document.getElementById('userTerritoriesList');
    if (!tbody) {
        console.error('عنصر userTerritoriesList غير موجود');
        return;
    }
    
    let userTerritories = JSON.parse(localStorage.getItem('userTerritories') || '{}');
    let territories = userTerritories[userId] || [];
    
    if (territories.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;padding:30px;">لا توجد أقاليم مسندة لهذا المستخدم</td></tr>`;
        return;
    }
    
    tbody.innerHTML = territories.map((t, index) => `
        <tr>
            <td style="padding:10px;">${t.wilayaName || t.wilaya}</td>
            <td style="padding:10px;">
                <span style="background:${t.type === 'supervisor' ? '#D4AF3720' : '#17a2b820'};color:${t.type === 'supervisor' ? '#D4AF37' : '#17a2b8'};padding:4px 10px;border-radius:50px;font-size:12px;">
                    ${t.type === 'supervisor' ? 'مراقب' : 'محكم'}
                </span>
            </td>
            <td style="padding:10px;">
                <button onclick="removeTerritoryFromUser(${userId}, ${index})" style="background:#dc3545;border:none;border-radius:5px;padding:4px 10px;cursor:pointer;color:white;">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </td>
        </tr>
    `).join('');
}

// إضافة إقليم لمستخدم
function addTerritoryToUser() {
    let userId = document.getElementById('territoryUserId').value;
    let wilaya = document.getElementById('newTerritoryWilaya').value;
    let type = document.getElementById('newTerritoryType').value;
    
    if (!userId) {
        alert('خطأ: لم يتم تحديد المستخدم');
        return;
    }
    
    if (!wilaya) {
        alert('الرجاء اختيار الولاية');
        return;
    }
    
    // الحصول على اسم الولاية
    let selectEl = document.getElementById('newTerritoryWilaya');
    let wilayaName = selectEl.options[selectEl.selectedIndex]?.text || wilaya;
    
    // تحميل البيانات الحالية
    let userTerritories = JSON.parse(localStorage.getItem('userTerritories') || '{}');
    if (!userTerritories[userId]) userTerritories[userId] = [];
    
    // التحقق من عدم التكرار
    if (userTerritories[userId].find(t => t.wilaya === wilaya)) {
        alert('هذه الولاية مضافـة مسبقاً');
        return;
    }
    
    // إضافة الإقليم
    userTerritories[userId].push({
        wilaya: wilaya,
        wilayaName: wilayaName,
        type: type
    });
    
    localStorage.setItem('userTerritories', JSON.stringify(userTerritories));
    
    // تحديث العرض
    renderUserTerritories(userId);
    renderUsersPage(); // تحديث الجدول الرئيسي
    
    alert('تم إضافة الإقليم بنجاح');
    
    // إعادة تعيين الحقول
    document.getElementById('newTerritoryWilaya').value = '';
}

// حذف إقليم من مستخدم
function removeTerritoryFromUser(userId, index) {
    if (!confirm('هل أنت متأكد من حذف هذا الإقليم؟')) return;
    
    let userTerritories = JSON.parse(localStorage.getItem('userTerritories') || '{}');
    userTerritories[userId].splice(index, 1);
    localStorage.setItem('userTerritories', JSON.stringify(userTerritories));
    
    renderUserTerritories(userId);
    renderUsersPage();
    
    alert('تم حذف الإقليم');
}





// دالة مساعدة لعرض رسائل في console للتأكد من تحميل الدوال
console.log('✅ دوال الأقاليم والصلاحيات تم تحميلها بنجاح');
// حفظ صلاحيات المستخدم


function closeTerritoryModal() {
    document.getElementById('territoryPermissionsModal').style.display = 'none';
}
// ===== عرض صفحة المراقب الأمني =====
function renderSecurityMonitorPage() {
    let container = document.getElementById('securityEventsList');
    if (!container) return;
    
    let events = [...securityEvents];
    
    // تطبيق التصفية
    if (currentSecurityFilter !== 'all') {
        events = events.filter(e => e.reason === currentSecurityFilter || 
            (currentSecurityFilter === 'failed' && e.reason.includes('فاشلة')) ||
            (currentSecurityFilter === 'suspicious' && e.reason.includes('مشبوهة')) ||
            (currentSecurityFilter === 'blocked' && e.reason.includes('محظورة')));
    }
    
    if (currentSecuritySearch) {
        events = events.filter(e => 
            (e.email && e.email.toLowerCase().includes(currentSecuritySearch)) ||
            (e.ip && e.ip.includes(currentSecuritySearch))
        );
    }
    
    // تحديث الإحصائيات
    document.getElementById('totalAttacks').textContent = securityEvents.length;
    let today = new Date().toLocaleDateString('ar-DZ');
    document.getElementById('todayAttacks').textContent = securityEvents.filter(e => e.date === today).length;
    let uniqueIPs = [...new Set(securityEvents.map(e => e.ip))];
    document.getElementById('uniqueIPs').textContent = uniqueIPs.length;
    
    if (events.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:60px;"><i class="fas fa-shield-alt" style="font-size:64px;opacity:0.3;"></i><h3>لا توجد أحداث أمنية مسجلة</h3><p>سيتم تسجيل محاولات الدخول المشبوهة هنا</p></div>`;
        return;
    }
    
    container.innerHTML = events.map(e => `
        <div class="file-card pending" style="border-right-color: ${e.reason.includes('محظورة') ? '#dc3545' : e.reason.includes('مشبوهة') ? '#ffc107' : '#17a2b8'}">
            <div class="file-header">
                <div class="file-title">
                    <div class="file-icon"><i class="fas fa-${e.reason.includes('محظورة') ? 'ban' : e.reason.includes('مشبوهة') ? 'exclamation-triangle' : 'clock'}"></i></div>
                    <div class="file-info">
                        <h3>${e.email || 'بريد غير معروف'}</h3>
                        <div class="file-meta">
                            <span><i class="fas fa-network-wired"></i> ${e.ip}</span>
                            <span><i class="fas fa-calendar"></i> ${e.date} - ${e.time}</span>
                        </div>
                    </div>
                </div>
                <div class="file-status" style="background:${e.reason.includes('محظورة') ? '#dc354520' : e.reason.includes('مشبوهة') ? '#ffc10720' : '#17a2b820'};color:${e.reason.includes('محظورة') ? '#dc3545' : e.reason.includes('مشبوهة') ? '#ffc107' : '#17a2b8'}">
                    ${e.reason}
                </div>
            </div>
            ${e.details ? `<div style="padding:10px;background:#f8f9fa;border-radius:10px;margin-top:10px;"><small>${e.details}</small></div>` : ''}
        </div>
    `).join('');
}

// ===== عرض صفحة قاعدة البيانات =====
function renderDatabasePage() {
    document.getElementById('dbExploitants').textContent = exploitants.length;
    document.getElementById('dbExploitations').textContent = exploitations.length;
    document.getElementById('dbFarmers').textContent = farmers.length;
    document.getElementById('dbCampaigns').textContent = campaigns.length;
    document.getElementById('dbDrafts').textContent = drafts.length;
    document.getElementById('dbUsers').textContent = systemUsers.length;
}

// ===== دوال مساعدة للأمن =====
function filterSecurityEvents(filter) {
    currentSecurityFilter = filter;
    document.querySelectorAll('#securityMonitor .filter-tab').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderSecurityMonitorPage();
}

function filterSecurityEventsByText() {
    currentSecuritySearch = document.getElementById('securitySearch')?.value.toLowerCase() || '';
    renderSecurityMonitorPage();
}

function clearSecurityEvents() {
    if (confirm('هل أنت متأكد من مسح جميع سجلات الأمان؟')) {
        securityEvents = [];
        localStorage.setItem("securityEvents", JSON.stringify(securityEvents));
        renderSecurityMonitorPage();
        updateSecurityBadge();
        showToast('تم مسح سجل الأمان', 'success');
    }
}



function exportDatabase() {
    let exportData = {
        exploitants: exploitants,
        exploitations: exploitations,
        farmers: farmers,
        campaigns: campaigns,
        drafts: drafts,
        systemUsers: systemUsers,
        securityEvents: securityEvents,
        exportDate: new Date().toISOString()
    };
    let dataStr = JSON.stringify(exportData, null, 2);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    let exportFileDefaultName = 'database_export_' + new Date().toISOString().slice(0,19) + '.json';
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showToast('تم تصدير قاعدة البيانات', 'success');
}

function clearAllData() {
    if (confirm('تحذير! هذا الإجراء سيحذف جميع البيانات نهائياً. هل أنت متأكد؟')) {
        if (confirm('تأكيد نهائي: هل أنت متأكد من حذف كل البيانات؟')) {
            localStorage.clear();
            showToast('تم حذف جميع البيانات', 'warning');
            setTimeout(() => location.reload(), 2000);
        }
    }
}
// ===== تسجيل نشاط المراقب (عند قبول أو رفض ملف) =====
function logSupervisorActivity(activity) {
    let newActivity = {
        id: Date.now(),
        supervisorName: activity.supervisorName || 'محمد العربي',
        supervisorEmail: activity.supervisorEmail || 'controller@snea.dz',
        action: activity.action, // 'approve' أو 'reject'
        fileId: activity.fileId,
        farmerName: activity.farmerName,
        exploitationName: activity.exploitationName,
        notes: activity.notes || '',
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('ar-DZ'),
        time: new Date().toLocaleTimeString('ar-DZ')
    };
    supervisorActivities.unshift(newActivity);
    if (supervisorActivities.length > 500) supervisorActivities = supervisorActivities.slice(0, 500);
    localStorage.setItem("supervisorActivities", JSON.stringify(supervisorActivities));
    updateSupervisorsBadge();
}

// ===== تسجيل دخول المستخدم =====
function logUserLogin(user) {
    let existingLog = userLoginLogs.find(l => l.email === user.email);
    if (existingLog) {
        existingLog.lastLogin = new Date().toISOString();
        existingLog.lastLoginDate = new Date().toLocaleDateString('ar-DZ');
        existingLog.lastLoginTime = new Date().toLocaleTimeString('ar-DZ');
        existingLog.ip = user.ip;
        existingLog.loginCount = (existingLog.loginCount || 0) + 1;
    } else {
        userLoginLogs.push({
            id: Date.now(),
            name: user.name,
            email: user.email,
            role: user.role,
            firstLogin: new Date().toISOString(),
            firstLoginDate: new Date().toLocaleDateString('ar-DZ'),
            lastLogin: new Date().toISOString(),
            lastLoginDate: new Date().toLocaleDateString('ar-DZ'),
            lastLoginTime: new Date().toLocaleTimeString('ar-DZ'),
            ip: user.ip,
            loginCount: 1
        });
    }
    localStorage.setItem("userLoginLogs", JSON.stringify(userLoginLogs));
    updateUserLogsBadge();
}

// ===== تحديث شارات المراقبين =====
function updateSupervisorsBadge() {
    let countEl = document.getElementById('supervisorsCount');
    if (countEl) countEl.textContent = supervisorActivities.length;
}

// ===== تحديث شارات سجل الدخول =====
function updateUserLogsBadge() {
    // يمكن استخدامها لتحديث أي شارة
}
// ===== عرض صفحة نشاط المراقبين =====
function renderSupervisorActivityPage() {
    let container = document.getElementById('supervisorActivityList');
    if (!container) return;
    
    let activities = [...supervisorActivities];
    
    // تطبيق التصفية
    if (currentSupervisorFilter !== 'all') {
        activities = activities.filter(a => a.action === currentSupervisorFilter);
    }
    
    if (currentSupervisorSearch) {
        activities = activities.filter(a => 
            a.supervisorName.toLowerCase().includes(currentSupervisorSearch) ||
            (a.farmerName && a.farmerName.toLowerCase().includes(currentSupervisorSearch))
        );
    }
    
    // تحديث الإحصائيات
    document.getElementById('totalApproved').textContent = supervisorActivities.filter(a => a.action === 'approve').length;
    document.getElementById('totalRejected').textContent = supervisorActivities.filter(a => a.action === 'reject').length;
    let activeSup = [...new Set(supervisorActivities.map(a => a.supervisorName))];
    document.getElementById('activeSupervisors').textContent = activeSup.length;
    
    if (activities.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:60px;"><i class="fas fa-user-check" style="font-size:64px;opacity:0.3;"></i><h3>لا توجد نشاطات للمراقبين</h3><p>سيتم تسجيل نشاطات المراقبين عند قبول أو رفض الملفات</p></div>`;
        return;
    }
    
    container.innerHTML = activities.map(a => `
        <div class="file-card ${a.action === 'approve' ? 'approved' : 'rejected'}" style="margin-bottom:15px;">
            <div class="file-header">
                <div class="file-title">
                    <div class="file-icon"><i class="fas fa-${a.action === 'approve' ? 'check-circle' : 'times-circle'}"></i></div>
                    <div class="file-info">
                        <h3>${a.supervisorName}</h3>
                        <div class="file-meta">
                            <span><i class="fas fa-envelope"></i> ${a.supervisorEmail}</span>
                            <span><i class="fas fa-calendar"></i> ${a.date} - ${a.time}</span>
                        </div>
                    </div>
                </div>
                <div class="file-status ${a.action === 'approve' ? 'approved' : 'rejected'}">
                    ${a.action === 'approve' ? 'قبول' : 'رفض'}
                </div>
            </div>
            <div class="data-grid">
                <div class="data-item"><div class="data-item-label">الفلاح</div><div class="data-item-value">${a.farmerName || 'غير محدد'}</div></div>
                <div class="data-item"><div class="data-item-label">المستغلة</div><div class="data-item-value">${a.exploitationName || 'غير محدد'}</div></div>
                <div class="data-item"><div class="data-item-label">رقم الملف</div><div class="data-item-value">${a.fileId || 'غير محدد'}</div></div>
            </div>
            ${a.notes ? `<div style="background:#f8f9fa;padding:10px;border-radius:10px;margin-top:10px;"><i class="fas fa-comment"></i> <strong>ملاحظات:</strong> ${a.notes}</div>` : ''}
        </div>
    `).join('');
}

// ===== عرض صفحة سجل دخول المستخدمين =====
function renderUserLogsPage() {
    let container = document.getElementById('userLogsList');
    if (!container) return;
    
    let logs = [...userLoginLogs];
    let searchTerm = document.getElementById('userLogsSearch')?.value.toLowerCase() || '';
    
    if (searchTerm) {
        logs = logs.filter(l => 
            (l.name && l.name.toLowerCase().includes(searchTerm)) ||
            (l.email && l.email.toLowerCase().includes(searchTerm))
        );
    }
    
    // تحديث الإحصائيات
    document.getElementById('totalUsersLogs').textContent = userLoginLogs.length;
    let today = new Date().toLocaleDateString('ar-DZ');
    document.getElementById('todayLogins').textContent = userLoginLogs.filter(l => l.lastLoginDate === today).length;
    
    let weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    document.getElementById('weeklyLogins').textContent = userLoginLogs.filter(l => new Date(l.lastLogin) > weekAgo).length;
    
    if (logs.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:60px;"><i class="fas fa-history" style="font-size:64px;opacity:0.3;"></i><h3>لا يوجد سجل دخول للمستخدمين</h3><p>سيتم تسجيل المستخدمين عند تسجيل الدخول من صفحة login</p></div>`;
        return;
    }
    
    container.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));gap:20px;">
            ${logs.map(l => `
                <div class="file-card pending">
                    <div class="file-header">
                        <div class="file-title">
                            <div class="file-icon"><i class="fas fa-user-circle"></i></div>
                            <div class="file-info">
                                <h3>${l.name || 'غير محدد'}</h3>
                                <div class="file-meta">
                                    <span><i class="fas fa-envelope"></i> ${l.email}</span>
                                    <span><i class="fas fa-user-tag"></i> ${l.role || 'مستخدم'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="data-grid">
                        <div class="data-item"><div class="data-item-label">آخر دخول</div><div class="data-item-value">${l.lastLoginDate || 'غير محدد'} - ${l.lastLoginTime || ''}</div></div>
                        <div class="data-item"><div class="data-item-label">عدد مرات الدخول</div><div class="data-item-value">${l.loginCount || 1}</div></div>
                        <div class="data-item"><div class="data-item-label">عنوان IP</div><div class="data-item-value">${l.ip || 'غير معروف'}</div></div>
                        <div class="data-item"><div class="data-item-label">أول دخول</div><div class="data-item-value">${l.firstLoginDate || 'غير محدد'}</div></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ===== دوال التصفية =====
function filterSupervisorActivity(filter) {
    currentSupervisorFilter = filter;
    document.querySelectorAll('#supervisors .filter-tab').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderSupervisorActivityPage();
}

function filterSupervisorActivityByText() {
    currentSupervisorSearch = document.getElementById('supervisorSearch')?.value.toLowerCase() || '';
    renderSupervisorActivityPage();
}

function filterUserLogs() {
    renderUserLogsPage();
}
 // ============================================
// دوال البحث في حملات الإحصاء
// ============================================

let currentCampaignSearchTerm = '';
let currentCampaignFilterWilaya = '';

// إضافة شريط البحث في صفحة الحملات
function addCampaignSearchBar() {
    let campaignsContainer = document.getElementById('campaignsList');
    if (!campaignsContainer) return;
    
    // التحقق إذا كان شريط البحث موجوداً بالفعل
    if (document.getElementById('campaignSearchSection')) return;
    
    let searchHTML = `
        <div id="campaignSearchSection" style="background:white;border-radius:25px;padding:20px;margin-bottom:25px;box-shadow:0 5px 15px rgba(0,0,0,0.05);">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:15px;">
                <div>
                    <label style="display:block;margin-bottom:8px;color:#1C4B2D;font-weight:600;">
                        <i class="fas fa-search"></i> <span data-ar="بحث بالاسم" data-fr="Rechercher par nom">بحث بالاسم</span>
                    </label>
                    <input type="text" id="campaignSearchName" class="input-box" placeholder="أدخل اسم الحملة..." style="width:100%;" onkeyup="filterCampaigns()">
                </div>
                <div>
                    <label style="display:block;margin-bottom:8px;color:#1C4B2D;font-weight:600;">
                        <i class="fas fa-map-marker-alt"></i> <span data-ar="بحث بالولاية" data-fr="Rechercher par wilaya">بحث بالولاية</span>
                    </label>
                    <select id="campaignSearchWilaya" class="input-box" style="width:100%;" onchange="filterCampaigns()">
                        <option value="">-- جميع الولايات --</option>
                        <option value="أدرار">01 - أدرار</option><option value="الشلف">02 - الشلف</option>
                        <option value="الأغواط">03 - الأغواط</option><option value="أم البواقي">04 - أم البواقي</option>
                        <option value="باتنة">05 - باتنة</option><option value="بجاية">06 - بجاية</option>
                        <option value="بسكرة">07 - بسكرة</option><option value="بشار">08 - بشار</option>
                        <option value="البليدة">09 - البليدة</option><option value="البويرة">10 - البويرة</option>
                        <option value="تمنراست">11 - تمنراست</option><option value="تبسة">12 - تبسة</option>
                        <option value="تلمسان">13 - تلمسان</option><option value="تيارت">14 - تيارت</option>
                        <option value="تيزي وزو">15 - تيزي وزو</option><option value="الجزائر">16 - الجزائر</option>
                        <option value="الجلفة">17 - الجلفة</option><option value="جيجل">18 - جيجل</option>
                        <option value="سطيف">19 - سطيف</option><option value="سعيدة">20 - سعيدة</option>
                        <option value="سكيكدة">21 - سكيكدة</option><option value="سيدي بلعباس">22 - سيدي بلعباس</option>
                        <option value="عنابة">23 - عنابة</option><option value="قالمة">24 - قالمة</option>
                        <option value="قسنطينة">25 - قسنطينة</option><option value="المدية">26 - المدية</option>
                        <option value="مستغانم">27 - مستغانم</option><option value="المسيلة">28 - المسيلة</option>
                        <option value="معسكر">29 - معسكر</option><option value="ورقلة">30 - ورقلة</option>
                        <option value="وهران">31 - وهران</option>
                    </select>
                </div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <button class="btn btn-secondary" onclick="resetCampaignSearch()" style="padding:8px 20px;">
                    <i class="fas fa-undo"></i> <span data-ar="إعادة تعيين" data-fr="Réinitialiser">إعادة تعيين</span>
                </button>
                <div id="campaignSearchResultCount" style="color:#64748b;font-size:14px;"></div>
            </div>
        </div>
    `;
    
    // إضافة شريط البحث قبل قائمة الحملات
    campaignsContainer.insertAdjacentHTML('beforebegin', searchHTML);
}

// تصفية الحملات
function filterCampaigns() {
    let searchName = document.getElementById('campaignSearchName')?.value.toLowerCase() || '';
    let searchWilaya = document.getElementById('campaignSearchWilaya')?.value || '';
    
    let campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    
    let filtered = campaigns.filter(campaign => {
        // فلترة بالاسم
        let nameMatch = searchName === '' || campaign.name.toLowerCase().includes(searchName);
        // فلترة بالولاية
        let wilayaMatch = searchWilaya === '' || (campaign.region && campaign.region.includes(searchWilaya));
        return nameMatch && wilayaMatch;
    });
    
    // عرض النتائج
    displayFilteredCampaigns(filtered);
    
    // تحديث عدد النتائج
    let resultCount = document.getElementById('campaignSearchResultCount');
    if (resultCount) {
        resultCount.innerHTML = `<i class="fas fa-chart-line"></i> ${filtered.length} / ${campaigns.length} <span data-ar="حملة" data-fr="campagne(s)">حملة</span>`;
    }
}

// عرض الحملات المصفاة
function displayFilteredCampaigns(filteredCampaigns) {
    let container = document.getElementById('campaignsList');
    if (!container) return;
    
    if (filteredCampaigns.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:60px;background:white;border-radius:25px;">
            <i class="fas fa-search" style="font-size:64px;color:#D4AF37;opacity:0.5;"></i>
            <h3 style="margin-top:20px;">${currentLang === 'ar' ? 'لا توجد حملات مطابقة للبحث' : 'Aucune campagne correspondante'}</h3>
        </div>`;
        return;
    }
    
    // إعادة استخدام دالة renderCampaignsList مع البيانات المصفاة
    renderFilteredCampaignsList(filteredCampaigns);
}

function renderFilteredCampaignsList(campaigns) {
    let container = document.getElementById("campaignsList");
    if(!container) return;
    
    let totalCampaigns = campaigns.length;
    let activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    let completedCampaigns = campaigns.filter(c => c.status === 'completed').length;
    let pendingCampaigns = campaigns.filter(c => c.status === 'pending').length;
    
    let dashboardHTML = `
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:30px;">
            <div style="background:rgba(255,255,255,0.9);border-radius:25px;padding:20px;text-align:center;">
                <div style="font-size:32px;font-weight:800;">${totalCampaigns}</div>
                <div>${L('إجمالي الحملات', 'Total campagnes')}</div>
            </div>
            <div style="background:rgba(255,255,255,0.9);border-radius:25px;padding:20px;text-align:center;">
                <div style="font-size:32px;font-weight:800;">${activeCampaigns}</div>
                <div>${L('حملات نشطة', 'Campagnes actives')}</div>
            </div>
            <div style="background:rgba(255,255,255,0.9);border-radius:25px;padding:20px;text-align:center;">
                <div style="font-size:32px;font-weight:800;">${completedCampaigns}</div>
                <div>${L('حملات مكتملة', 'Campagnes terminées')}</div>
            </div>
            <div style="background:rgba(255,255,255,0.9);border-radius:25px;padding:20px;text-align:center;">
                <div style="font-size:32px;font-weight:800;">${pendingCampaigns}</div>
                <div>${L('قيد التحضير', 'En préparation')}</div>
            </div>
        </div>
    `;
    
    if(campaigns.length === 0) { 
        container.innerHTML = dashboardHTML + `<div style="text-align:center;padding:60px;">${L('لا توجد حملات', 'Aucune campagne')}</div>`; 
        return; 
    }
    
    container.innerHTML = dashboardHTML + `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:25px;">` + campaigns.map(c => {
        let campaignFiles = farmers.filter(f => f.campaignId == c.id);
        let totalFiles = campaignFiles.length;
        
        let statusText = c.status === 'active' ? L('نشطة', 'Active') : (c.status === 'completed' ? L('مكتملة', 'Terminée') : L('قيد التحضير', 'En préparation'));
        let statusColor = c.status === 'active' ? '#28a745' : (c.status === 'completed' ? '#17a2b8' : '#ffc107');
        let isCompleted = c.status === 'completed';
        
        return `
            <div style="background:white;border-radius:28px;overflow:hidden;box-shadow:0 10px 30px -10px rgba(0,0,0,0.1);border:1px solid rgba(212,175,55,0.2);">
                <div style="background:linear-gradient(135deg,#1C4B2D,#2E6B3E);padding:20px;color:white;position:relative;">
                    <h3 style="margin:0 0 8px 0;"><i class="fas fa-chart-line"></i> ${c.name}</h3>
                    <p style="margin:0;font-size:13px;"><i class="fas fa-map-marker-alt"></i> ${c.region || L('كل التراب', 'Tout le territoire')} | <i class="fas fa-calendar"></i> ${new Date(c.startDate).toLocaleDateString(dateLocaleStr())}</p>
                    <span style="position:absolute;left:20px;top:20px;background:${statusColor};color:white;padding:5px 15px;border-radius:50px;font-size:12px;font-weight:bold;">
                        ${statusText}
                    </span>
                </div>
                <div style="padding:20px;">
                    <div style="display:flex;justify-content:space-around;margin-bottom:20px;padding-bottom:15px;border-bottom:1px solid #eee;">
                        <div style="text-align:center;"><div style="font-size:28px;font-weight:800;">${totalFiles}</div><div style="font-size:12px;">${L('ملفات', 'dossiers')}</div></div>
                        <div style="text-align:center;"><div style="font-size:28px;font-weight:800;">${campaignFiles.filter(f => f.status === 'approved').length}</div><div style="font-size:12px;">${L('مقبولة', 'approuvés')}</div></div>
                        <div style="text-align:center;"><div style="font-size:28px;font-weight:800;">${campaignFiles.filter(f => f.status === 'pending').length}</div><div style="font-size:12px;">${L('قيد الانتظار', 'en attente')}</div></div>
                    </div>
                    <div style="display:flex;gap:10px;justify-content:flex-end;">
                        <button style="padding:8px 18px;border-radius:40px;background:#1C4B2D;color:white;border:none;cursor:pointer;" onclick="showCampaignProfile(${c.id})"><i class="fas fa-eye"></i> ${L('مشاهدة', 'Voir')}</button>
                        <button style="padding:8px 18px;border-radius:40px;background:#17a2b8;color:white;border:none;cursor:pointer;" onclick="selectCampaign(${c.id})" ${isCompleted ? 'disabled' : ''}><i class="fas fa-folder-open"></i> ${L('فتح', 'Ouvrir')}</button>
                        <button style="padding:8px 18px;border-radius:40px;background:#D4AF37;color:#1C4B2D;border:none;cursor:pointer;" onclick="editCampaign(${c.id})"><i class="fas fa-edit"></i> ${L('تعديل', 'Modifier')}</button>
                        <button style="padding:8px 18px;border-radius:40px;background:#dc3545;color:white;border:none;cursor:pointer;" onclick="deleteCampaign(${c.id})"><i class="fas fa-trash"></i> ${L('حذف', 'Supprimer')}</button>
                    </div>
                </div>
            </div>
        `;
    }).join('') + `</div>`;
}

function resetCampaignSearch() {
    let nameInput = document.getElementById('campaignSearchName');
    let wilayaSelect = document.getElementById('campaignSearchWilaya');
    
    if (nameInput) nameInput.value = '';
    if (wilayaSelect) wilayaSelect.value = '';
    
    filterCampaigns();
}

// تعديل دالة renderCampaignsList الأصلية لإضافة شريط البحث
let originalRenderCampaignsList = renderCampaignsList;
renderCampaignsList = function() {
    addCampaignSearchBar();
    originalRenderCampaignsList();
};


// ============================================
// دوال البحث في المستغلين
// ============================================

let currentExploitantSearchTerm = '';

function addExploitantSearchBar() {
    let container = document.getElementById('exploitantsList');
    if (!container) return;
    
    if (document.getElementById('exploitantSearchSection')) return;
    
    let searchHTML = `
        <div id="exploitantSearchSection" style="background:white;border-radius:25px;padding:20px;margin-bottom:25px;box-shadow:0 5px 15px rgba(0,0,0,0.05);">
            <div style="display:flex;gap:20px;align-items:flex-end;flex-wrap:wrap;">
                <div style="flex:1;">
                    <label style="display:block;margin-bottom:8px;color:#1C4B2D;font-weight:600;">
                        <i class="fas fa-search"></i> <span data-ar="بحث بالاسم" data-fr="Rechercher par nom">بحث بالاسم</span>
                    </label>
                    <input type="text" id="exploitantSearchName" class="input-box" placeholder="أدخل اسم المستغل..." style="width:100%;" onkeyup="filterExploitants()">
                </div>
                <div>
                    <button class="btn btn-secondary" onclick="resetExploitantSearch()" style="padding:10px 20px;">
                        <i class="fas fa-undo"></i> <span data-ar="إعادة تعيين" data-fr="Réinitialiser">إعادة تعيين</span>
                    </button>
                </div>
            </div>
            <div id="exploitantSearchResultCount" style="margin-top:10px;color:#64748b;font-size:14px;"></div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforebegin', searchHTML);
}

function filterExploitants() {
    let searchName = document.getElementById('exploitantSearchName')?.value.toLowerCase() || '';
    
    let exploitants = JSON.parse(localStorage.getItem('exploitants') || '[]');
    
    let filtered = exploitants.filter(exploitant => {
        let fullName = `${exploitant.nom || ''} ${exploitant.prenom || ''}`.toLowerCase();
        return searchName === '' || fullName.includes(searchName);
    });
    
    displayFilteredExploitants(filtered);
    
    let resultCount = document.getElementById('exploitantSearchResultCount');
    if (resultCount) {
        resultCount.innerHTML = `<i class="fas fa-user-tie"></i> ${filtered.length} / ${exploitants.length} <span data-ar="مستغل" data-fr="exploitant(s)">مستغل</span>`;
    }
}

function displayFilteredExploitants(filteredExploitants) {
    let container = document.getElementById('exploitantsList');
    if (!container) return;
    
    if (filteredExploitants.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:60px;background:white;border-radius:25px;">
            <i class="fas fa-search" style="font-size:64px;color:#D4AF37;opacity:0.5;"></i>
            <h3 style="margin-top:20px;">${currentLang === 'ar' ? 'لا توجد مستغلين مطابقين للبحث' : 'Aucun exploitant correspondant'}</h3>
        </div>`;
        return;
    }
    
    // إعادة استخدام دالة العرض مع البيانات المصفاة
    renderFilteredExploitantsList(filteredExploitants);
}

function renderFilteredExploitantsList(exploitants) {
    let container = document.getElementById("exploitantsList");
    if (!container) return;
    
    container.innerHTML = `<div class="exploitants-container">` + exploitants.map(e => {
        let phoneFull = `${e.phone1 || ''}${e.phone2 || ''}${e.phone3 || ''}${e.phone4 || ''}${e.phone5 || ''}`;
        let exploitationsCount = JSON.parse(localStorage.getItem('exploitations') || '[]').filter(ex => ex.exploitantId == e.id).length;
        
        return `
            <div class="exploitant-card" onclick="showExploitantProfile(${e.id})">
                <div class="exploitant-card-header">
                    <div class="exploitant-avatar">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <h3>${e.nom || ''} ${e.prenom || ''}</h3>
                    <p><i class="fas fa-map-marker-alt"></i> ${e.wilaya2 || L('ولاية غير محددة', 'Wilaya non définie')}</p>
                </div>
                <div class="exploitant-card-body">
                    <div class="exploitant-info-row">
                        <span class="exploitant-info-label"><i class="fas fa-phone"></i> ${L('الهاتف', 'Téléphone')}</span>
                        <span class="exploitant-info-value">${phoneFull || L('غير محدد', 'Non défini')}</span>
                    </div>
                    <div class="exploitant-info-row">
                        <span class="exploitant-info-label"><i class="fas fa-tractor"></i> ${L('المستغلات', 'Exploitations')}</span>
                        <span class="exploitant-info-value">${exploitationsCount}</span>
                    </div>
                    <div class="exploitant-info-row">
                        <span class="exploitant-info-label"><i class="fas fa-calendar"></i> ${L('تاريخ التسجيل', 'Date d\'inscription')}</span>
                        <span class="exploitant-info-value">${new Date(e.dateCreation).toLocaleDateString(dateLocaleStr())}</span>
                    </div>
                </div>
                <div class="exploitant-card-actions">
                    <button class="btn-modern btn-modern-info" onclick="event.stopPropagation(); showExploitantProfile(${e.id})">
                        <i class="fas fa-eye"></i> ${L('عرض البروفايل', 'Voir le profil')}
                    </button>
                    <button class="btn-modern btn-modern-danger" onclick="event.stopPropagation(); deleteExploitant(${e.id})">
                        <i class="fas fa-trash"></i> ${L('حذف', 'Supprimer')}
                    </button>
                </div>
            </div>
        `;
    }).join('') + `</div>`;
    
    document.getElementById("exploitantsCount").textContent = exploitants.length;
}

function resetExploitantSearch() {
    let nameInput = document.getElementById('exploitantSearchName');
    if (nameInput) nameInput.value = '';
    filterExploitants();
}

// تعديل دالة renderExploitantsList الأصلية
let originalRenderExploitantsList = renderExploitantsList;
renderExploitantsList = function() {
    addExploitantSearchBar();
    originalRenderExploitantsList();
};

// ============================================
// دوال البحث في المستغلات
// ============================================

function addExploitationSearchBar() {
    let container = document.getElementById('exploitationsList');
    if (!container) return;
    
    if (document.getElementById('exploitationSearchSection')) return;
    
    let searchHTML = `
        <div id="exploitationSearchSection" style="background:white;border-radius:25px;padding:20px;margin-bottom:25px;box-shadow:0 5px 15px rgba(0,0,0,0.05);">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:15px;">
                <div>
                    <label style="display:block;margin-bottom:8px;color:#1C4B2D;font-weight:600;">
                        <i class="fas fa-search"></i> <span data-ar="بحث باسم المستغلة" data-fr="Rechercher par nom exploitation">بحث باسم المستغلة</span>
                    </label>
                    <input type="text" id="exploitationSearchName" class="input-box" placeholder="أدخل اسم المستغلة..." style="width:100%;" onkeyup="filterExploitations()">
                </div>
                <div>
                    <label style="display:block;margin-bottom:8px;color:#1C4B2D;font-weight:600;">
                        <i class="fas fa-map-marker-alt"></i> <span data-ar="بحث بالولاية" data-fr="Rechercher par wilaya">بحث بالولاية</span>
                    </label>
                    <select id="exploitationSearchWilaya" class="input-box" style="width:100%;" onchange="filterExploitations()">
                        <option value="">-- جميع الولايات --</option>
                        <option value="01">01 - أدرار</option><option value="02">02 - الشلف</option>
                        <option value="16">16 - الجزائر</option><option value="31">31 - وهران</option>
                        <option value="25">25 - قسنطينة</option><option value="19">19 - سطيف</option>
                        <option value="09">09 - البليدة</option><option value="42">42 - تيبازة</option>
                    </select>
                </div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <button class="btn btn-secondary" onclick="resetExploitationSearch()" style="padding:8px 20px;">
                    <i class="fas fa-undo"></i> <span data-ar="إعادة تعيين" data-fr="Réinitialiser">إعادة تعيين</span>
                </button>
                <div id="exploitationSearchResultCount" style="color:#64748b;font-size:14px;"></div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforebegin', searchHTML);
}

function filterExploitations() {
    let searchName = document.getElementById('exploitationSearchName')?.value.toLowerCase() || '';
    let searchWilaya = document.getElementById('exploitationSearchWilaya')?.value || '';
    
    let exploitations = JSON.parse(localStorage.getItem('exploitations') || '[]');
    let exploitants = JSON.parse(localStorage.getItem('exploitants') || '[]');
    
    let filtered = exploitations.filter(exploitation => {
        // فلترة بالاسم
        let nameMatch = searchName === '' || (exploitation.nom && exploitation.nom.toLowerCase().includes(searchName));
        
        // فلترة بالولاية (نبحث عن الفلاح المرتبط ثم نأخذ ولايته)
        let wilayaMatch = true;
        if (searchWilaya !== '') {
            let owner = exploitants.find(e => e.id == exploitation.exploitantId);
            wilayaMatch = owner && owner.wilaya2 === searchWilaya;
        }
        
        return nameMatch && wilayaMatch;
    });
    
    displayFilteredExploitations(filtered);
    
    let resultCount = document.getElementById('exploitationSearchResultCount');
    if (resultCount) {
        resultCount.innerHTML = `<i class="fas fa-tractor"></i> ${filtered.length} / ${exploitations.length} <span data-ar="مستغلة" data-fr="exploitation(s)">مستغلة</span>`;
    }
}

function displayFilteredExploitations(filteredExploitations) {
    let container = document.getElementById('exploitationsList');
    if (!container) return;
    
    if (filteredExploitations.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:60px;background:white;border-radius:25px;">
            <i class="fas fa-search" style="font-size:64px;color:#D4AF37;opacity:0.5;"></i>
            <h3 style="margin-top:20px;">${currentLang === 'ar' ? 'لا توجد مستغلات مطابقة للبحث' : 'Aucune exploitation correspondante'}</h3>
        </div>`;
        return;
    }
    
    renderFilteredExploitationsList(filteredExploitations);
}

function renderFilteredExploitationsList(exploitations) {
    let container = document.getElementById("exploitationsList");
    if(!container) return;
    
    container.innerHTML = `<div class="exploitations-container">` + exploitations.map(e => {
        let surveyFilesCount = JSON.parse(localStorage.getItem('farmers') || '[]').filter(f => f.exploitationId == e.id).length;
        
        return `
            <div class="exploitation-card" onclick="showExploitationProfile(${e.id})">
                <div class="exploitation-card-header">
                    <div class="exploitation-avatar">
                        <i class="fas fa-tractor"></i>
                    </div>
                    <h3>${e.nom || L('غير محدد', 'Non défini')}</h3>
                    <p><i class="fas fa-user-tie"></i> ${e.exploitantNom || L('فلاح غير محدد', 'Agriculteur non défini')}</p>
                </div>
                <div class="exploitation-card-body">
                    <div class="exploitation-info-row">
                        <span class="exploitation-info-label"><i class="fas fa-ruler-combined"></i> ${L('المساحة', 'Superficie')}</span>
                        <span class="exploitation-info-value">${e.superficie || "0"} ${L('هكتار', 'ha')}</span>
                    </div>
                    <div class="exploitation-info-row">
                        <span class="exploitation-info-label"><i class="fas fa-seedling"></i> ${L('النشاط', 'Activité')}</span>
                        <span class="exploitation-info-value">${e.vocation === 'نباتي' ? L('🌱 نباتي', '🌱 Végétal') : e.vocation === 'حيواني' ? L('🐄 حيواني', '🐄 Animal') : L('🌾 مختلط', '🌾 Mixte')}</span>
                    </div>
                    <div class="exploitation-info-row">
                        <span class="exploitation-info-label"><i class="fas fa-file-alt"></i> ${L('ملفات الإحصاء', 'Dossiers recensement')}</span>
                        <span class="exploitation-info-value">${surveyFilesCount}</span>
                    </div>
                </div>
                <div class="exploitation-card-actions">
                    <button class="btn-modern btn-modern-info" onclick="event.stopPropagation(); showExploitationProfile(${e.id})">
                        <i class="fas fa-eye"></i> ${L('عرض التفاصيل', 'Voir les détails')}
                    </button>
                    <button class="btn-modern btn-modern-danger" onclick="event.stopPropagation(); deleteExploitation(${e.id})">
                        <i class="fas fa-trash"></i> ${L('حذف', 'Supprimer')}
                    </button>
                </div>
            </div>
        `;
    }).join('') + `</div>`;
    
    document.getElementById("exploitationsCount").textContent = exploitations.length;
}

function resetExploitationSearch() {
    let nameInput = document.getElementById('exploitationSearchName');
    let wilayaSelect = document.getElementById('exploitationSearchWilaya');
    
    if (nameInput) nameInput.value = '';
    if (wilayaSelect) wilayaSelect.value = '';
    
    filterExploitations();
}

// تعديل دالة renderExploitationsList الأصلية
let originalRenderExploitationsList = renderExploitationsList;
renderExploitationsList = function() {
    addExploitationSearchBar();
    originalRenderExploitationsList();
};

// ============================================
// دوال البحث في ملفات الإحصاء داخل الحملة
// ============================================

let currentSurveySearchTerm = '';
let currentSurveySearchType = 'name'; // 'name' or 'exploitation'

function addSurveyFileSearchBar() {
    let container = document.getElementById('campaignFilesList');
    if (!container) return;
    
    if (document.getElementById('surveyFileSearchSection')) return;
    
    let searchHTML = `
        <div id="surveyFileSearchSection" style="background:white;border-radius:25px;padding:20px;margin-bottom:25px;box-shadow:0 5px 15px rgba(0,0,0,0.05);">
            <div style="display:flex;gap:20px;align-items:flex-end;flex-wrap:wrap;">
                <div style="flex:2;">
                    <label style="display:block;margin-bottom:8px;color:#1C4B2D;font-weight:600;">
                        <i class="fas fa-search"></i> <span data-ar="بحث" data-fr="Rechercher">بحث</span>
                    </label>
                    <input type="text" id="surveyFileSearchInput" class="input-box" placeholder="ابحث باسم الفلاح أو المستغلة..." style="width:100%;" onkeyup="filterSurveyFiles()">
                </div>
                <div style="flex:1;">
                    <label style="display:block;margin-bottom:8px;color:#1C4B2D;font-weight:600;">
                        <i class="fas fa-filter"></i> <span data-ar="نوع البحث" data-fr="Type de recherche">نوع البحث</span>
                    </label>
                    <select id="surveyFileSearchType" class="input-box" style="width:100%;" onchange="filterSurveyFiles()">
                        <option value="name">بحث باسم الفلاح</option>
                        <option value="exploitation">بحث باسم المستغلة</option>
                    </select>
                </div>
                <div>
                    <button class="btn btn-secondary" onclick="resetSurveyFileSearch()" style="padding:10px 20px;">
                        <i class="fas fa-undo"></i> <span data-ar="إعادة تعيين" data-fr="Réinitialiser">إعادة تعيين</span>
                    </button>
                </div>
            </div>
            <div id="surveyFileSearchResultCount" style="margin-top:10px;color:#64748b;font-size:14px;"></div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforebegin', searchHTML);
}

function filterSurveyFiles() {
    let searchTerm = document.getElementById('surveyFileSearchInput')?.value.toLowerCase() || '';
    let searchType = document.getElementById('surveyFileSearchType')?.value || 'name';
    
    let files = JSON.parse(localStorage.getItem('farmers') || '[]');
    
    // فلترة حسب الحملة الحالية
    if (currentCampaignId) {
        files = files.filter(f => f.campaignId == currentCampaignId);
    }
    
    let filtered = files.filter(file => {
        if (searchTerm === '') return true;
        
        if (searchType === 'name') {
            // بحث باسم الفلاح
            return (file.exploitantNom && file.exploitantNom.toLowerCase().includes(searchTerm));
        } else {
            // بحث باسم المستغلة
            return (file.exploitationNom && file.exploitationNom.toLowerCase().includes(searchTerm));
        }
    });
    
    displayFilteredSurveyFiles(filtered);
    
    let resultCount = document.getElementById('surveyFileSearchResultCount');
    if (resultCount) {
        resultCount.innerHTML = `<i class="fas fa-file-alt"></i> ${filtered.length} / ${files.length} <span data-ar="ملف" data-fr="dossier(s)">ملف</span>`;
    }
}

function displayFilteredSurveyFiles(filteredFiles) {
    let container = document.getElementById('campaignFilesList');
    if (!container) return;
    
    if (filteredFiles.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:60px;background:rgba(255,255,255,0.5);border-radius:30px;">
                <i class="fas fa-search" style="font-size:64px; color:#D4AF37; opacity:0.5;"></i>
                <h3 style="margin-top:20px; color:#1C4B2D;">${currentLang === 'ar' ? 'لا توجد ملفات مطابقة للبحث' : 'Aucun dossier correspondant'}</h3>
            </div>
        `;
        return;
    }
    
    renderFilteredSurveyFilesList(filteredFiles);
}

function renderFilteredSurveyFilesList(files) {
    let container = document.getElementById("campaignFilesList");
    if(!container) return;
    
    container.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));gap:20px;">
            ${files.map(f => {
                let exploitant = JSON.parse(localStorage.getItem('exploitants') || '[]').find(e => e.id == f.exploitantId);
                let exploitation = JSON.parse(localStorage.getItem('exploitations') || '[]').find(e => e.id == f.exploitationId);
                let statusColor = f.status === 'approved' ? '#28a745' : (f.status === 'pending' ? '#ffc107' : '#dc3545');
                let statusText = f.status === 'approved' ? L('مقبول', 'Approuvé') : (f.status === 'pending' ? L('قيد الانتظار', 'En attente') : L('مرفوض', 'Rejeté'));
                
                return `
                    <div style="background:white;border-radius:25px;overflow:hidden;box-shadow:0 10px 25px -10px rgba(0,0,0,0.1);border:1px solid rgba(212,175,55,0.2);transition:transform 0.3s;cursor:pointer;" 
                         onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                        
                        <div style="background:linear-gradient(135deg,#1C4B2D,#2E6B3E);padding:15px 20px;color:white;display:flex;justify-content:space-between;align-items:center;">
                            <div>
                                <i class="fas fa-user-tie" style="font-size:20px; margin-left:10px;"></i>
                                <span style="font-weight:bold;">${f.exploitantNom || L('غير محدد', 'Non défini')}</span>
                            </div>
                            <div style="background:${statusColor};padding:4px 12px;border-radius:50px;font-size:12px;font-weight:bold;">
                                ${statusText}
                            </div>
                        </div>
                        
                        <div style="padding:15px 20px;">
                            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;padding-bottom:10px;border-bottom:1px dashed #eee;">
                                <i class="fas fa-tractor" style="color:#D4AF37; width:25px;"></i>
                                <div>
                                    <div style="font-size:12px;color:#64748b;">${L('المستغلة', 'Exploitation')}</div>
                                    <div style="font-weight:600;">${f.exploitationNom || L('غير محدد', 'Non défini')}</div>
                                </div>
                            </div>
                            
                            <div style="display:flex;gap:15px;margin-bottom:12px;padding-bottom:10px;border-bottom:1px dashed #eee;">
                                <div style="flex:1;">
                                    <div style="display:flex;align-items:center;gap:8px;">
                                        <i class="fas fa-map-marker-alt" style="color:#D4AF37; width:20px;"></i>
                                        <span style="font-size:13px;">${exploitation?.wilaya2 || exploitation?.wilaya || L('غير محدد', 'Non défini')}</span>
                                    </div>
                                </div>
                                <div style="flex:1;">
                                    <div style="display:flex;align-items:center;gap:8px;">
                                        <i class="fas fa-calendar" style="color:#D4AF37; width:20px;"></i>
                                        <span style="font-size:13px;">${new Date(f.date).toLocaleDateString(dateLocaleStr())}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div style="display:flex;justify-content:space-around;margin-bottom:15px;padding:10px;background:#f8fafc;border-radius:15px;">
                                <div style="text-align:center;">
                                    <div style="font-weight:800;color:#1C4B2D;">${parseInt(f.bovins) + parseInt(f.ovins) + parseInt(f.caprins) || 0}</div>
                                    <div style="font-size:10px;color:#64748b;">${L('مواشي', 'cheptel')}</div>
                                </div>
                                <div style="text-align:center;">
                                    <div style="font-weight:800;color:#1C4B2D;">${f.superficie || exploitation?.superficie || '0'}</div>
                                    <div style="font-size:10px;color:#64748b;">${L('هكتار', 'ha')}</div>
                                </div>
                                <div style="text-align:center;">
                                    <div style="font-weight:800;color:#1C4B2D;">${parseInt(f.batimentsHabitationNb) + parseInt(f.bergeriesNb) || 0}</div>
                                    <div style="font-size:10px;color:#64748b;">${L('مباني', 'bâtiments')}</div>
                                </div>
                            </div>
                            
                            <div style="display:flex;gap:10px;justify-content:flex-end;">
                                <button onclick="event.stopPropagation(); showSurveyFileProfile(${f.id})" 
                                        style="padding:8px 15px;border-radius:30px;background:#1C4B2D;color:white;border:none;cursor:pointer;font-size:12px;display:flex;align-items:center;gap:5px;">
                                    <i class="fas fa-eye"></i> ${L('عرض التفاصيل', 'Détails')}
                                </button>
                                <button onclick="event.stopPropagation(); editSurveyFileInCampaign(${f.id})" 
                                        style="padding:8px 15px;border-radius:30px;background:#D4AF37;color:#1C4B2D;border:none;cursor:pointer;font-size:12px;display:flex;align-items:center;gap:5px;">
                                    <i class="fas fa-edit"></i> ${L('تعديل', 'Modifier')}
                                </button>
                                <button onclick="event.stopPropagation(); deleteSurveyFile(${f.id})" 
                                        style="padding:8px 15px;border-radius:30px;background:#dc3545;color:white;border:none;cursor:pointer;font-size:12px;display:flex;align-items:center;gap:5px;">
                                    <i class="fas fa-trash"></i> ${L('حذف', 'Supprimer')}
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function resetSurveyFileSearch() {
    let searchInput = document.getElementById('surveyFileSearchInput');
    let searchType = document.getElementById('surveyFileSearchType');
    
    if (searchInput) searchInput.value = '';
    if (searchType) searchType.value = 'name';
    
    filterSurveyFiles();
}

//  تعديل دالة renderCampaignFilesList الأصلية لإضافة شريط البحث
let originalRenderCampaignFilesList = renderCampaignFilesList;
renderCampaignFilesList = function(campaignId) {
    addSurveyFileSearchBar();
    originalRenderCampaignFilesList(campaignId);
};
