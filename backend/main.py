
import os
import httpx
import asyncpg
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="API الخريطة الفلاحية – الجزائر",
    version="1.0.0",
    description="Backend للإحصاء الفلاحي مع بيانات مناخية حية",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # في الإنتاج: ضع عنوان frontend الفعلي
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
#  قاعدة البيانات – Pool
# ─────────────────────────────────────────────
DB_DSN = (
    f"postgresql://{os.getenv('DB_USER','postgres')}:"
    f"{os.getenv('DB_PASS','password')}@"
    f"{os.getenv('DB_HOST','localhost')}:"
    f"{os.getenv('DB_PORT','5432')}/"
    f"{os.getenv('DB_NAME','agriculture_db')}"
)

db_pool: asyncpg.Pool = None


@app.on_event("startup")
async def startup():
    global db_pool
    db_pool = await asyncpg.create_pool(DB_DSN, min_size=2, max_size=10)


@app.on_event("shutdown")
async def shutdown():
    await db_pool.close()


# ─────────────────────────────────────────────
#  HELPER
# ─────────────────────────────────────────────
def rows_to_list(rows) -> List[dict]:
    return [dict(r) for r in rows]


# ══════════════════════════════════════════════
#  1.  WILAYAS
# ══════════════════════════════════════════════
@app.get("/api/wilayas", tags=["Géographie"])
async def get_wilayas():
    """قائمة كل الولايات"""
    async with db_pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT id, code, nom_fr, nom_ar FROM wilayas ORDER BY id"
        )
    return rows_to_list(rows)


@app.get("/api/wilayas/{wilaya_id}", tags=["Géographie"])
async def get_wilaya(wilaya_id: int):
    """تفاصيل ولاية واحدة"""
    async with db_pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT id, code, nom_fr, nom_ar FROM wilayas WHERE id=$1", wilaya_id
        )
    if not row:
        raise HTTPException(404, "Wilaya introuvable")
    return dict(row)


# ══════════════════════════════════════════════
#  2.  COMMUNES
# ══════════════════════════════════════════════
@app.get("/api/wilayas/{wilaya_id}/communes", tags=["Géographie"])
async def get_communes(wilaya_id: int):
    """بلديات ولاية معينة"""
    async with db_pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT c.id, c.nom_fr, c.nom_ar, c.wilaya_id,
                   w.nom_fr AS wilaya_fr, w.nom_ar AS wilaya_ar, w.code AS wilaya_code
            FROM communes c
            JOIN wilayas w ON w.id = c.wilaya_id
            WHERE c.wilaya_id = $1
            ORDER BY c.nom_fr
            """,
            wilaya_id,
        )
    return rows_to_list(rows)


# ══════════════════════════════════════════════
#  3.  EXPLOITATIONS
# ══════════════════════════════════════════════
@app.get("/api/exploitations", tags=["Exploitations"])
async def list_exploitations(
    commune_id: Optional[int] = None,
    wilaya_id: Optional[int] = None,
    limit: int = Query(100, le=500),
    offset: int = 0,
):
    """
    قائمة المستثمرات الفلاحية.
    يمكن تصفية حسب: commune_id أو wilaya_id
    """
    where_clauses = []
    params = []
    i = 1

    if commune_id:
        where_clauses.append(f"e.commune_id = ${i}")
        params.append(commune_id)
        i += 1
    if wilaya_id:
        where_clauses.append(f"c.wilaya_id = ${i}")
        params.append(wilaya_id)
        i += 1

    where_sql = ("WHERE " + " AND ".join(where_clauses)) if where_clauses else ""

    params += [limit, offset]

    sql = f"""
        SELECT
            e.id,
            e.nom_exploitation_fr,
            e.nom_exploitation_ar,
            e.district_fr,
            e.district_ar,
            e.latitude,
            e.longitude,
            e.superficie_batie,
            e.superficie_non_batie,
            e.commune_id,
            c.nom_fr  AS commune_fr,
            c.nom_ar  AS commune_ar,
            c.wilaya_id,
            w.nom_fr  AS wilaya_fr,
            w.nom_ar  AS wilaya_ar,
            w.code    AS wilaya_code,
            sj.nom_fr AS statut_juridique,
            ta.nom_fr AS activite,
            ex.nom_fr AS exploitant_nom,
            ex.prenom_fr AS exploitant_prenom
        FROM exploitations e
        JOIN communes   c  ON c.id  = e.commune_id
        JOIN wilayas    w  ON w.id  = c.wilaya_id
        LEFT JOIN statut_juridique sj ON sj.id = e.statut_juridique_id
        LEFT JOIN type_activite    ta ON ta.id = e.activite_exploitation_id
        LEFT JOIN exploitants      ex ON ex.id = e.exploitant_id
        {where_sql}
        ORDER BY e.id
        LIMIT ${i} OFFSET ${i+1}
    """

    async with db_pool.acquire() as conn:
        rows = await conn.fetch(sql, *params)
    return {"total": len(rows), "offset": offset, "data": rows_to_list(rows)}


@app.get("/api/exploitations/{exploitation_id}", tags=["Exploitations"])
async def get_exploitation(exploitation_id: int):
    """تفاصيل كاملة لمستثمرة واحدة"""
    async with db_pool.acquire() as conn:

        # الجدول الرئيسي
        row = await conn.fetchrow(
            """
            SELECT
                e.*,
                c.nom_fr AS commune_fr, c.nom_ar AS commune_ar,
                w.nom_fr AS wilaya_fr,  w.nom_ar AS wilaya_ar, w.code AS wilaya_code,
                sj.nom_fr AS statut_juridique, sj.nom_ar AS statut_juridique_ar,
                ta.nom_fr AS activite,  ta.nom_ar AS activite_ar,
                ex.nom_fr AS exploitant_nom, ex.prenom_fr AS exploitant_prenom,
                ex.telephone AS exploitant_tel
            FROM exploitations e
            JOIN communes        c  ON c.id  = e.commune_id
            JOIN wilayas         w  ON w.id  = c.wilaya_id
            LEFT JOIN statut_juridique sj ON sj.id = e.statut_juridique_id
            LEFT JOIN type_activite    ta ON ta.id = e.activite_exploitation_id
            LEFT JOIN exploitants      ex ON ex.id = e.exploitant_id
            WHERE e.id = $1
            """,
            exploitation_id,
        )
        if not row:
            raise HTTPException(404, "Exploitation introuvable")

        # Blocks
        blocks = await conn.fetch(
            """
            SELECT b.superficie, me.nom_fr AS mode, st.nom_fr AS statut_terre
            FROM blocks b
            LEFT JOIN mode_exploitation me ON me.id = b.mode_exploi_id
            LEFT JOIN statut_terre       st ON st.id = b.statut_terre_id
            WHERE b.exploitation_id = $1
            """,
            exploitation_id,
        )

        # Sources énergie
        energy = await conn.fetch(
            """
            SELECT se.nom_fr FROM sources_energie s
            JOIN source_energie_type se ON se.id = s.type_source_id
            WHERE s.exploitation_id = $1
            """,
            exploitation_id,
        )

        # Accessibilité
        access = await conn.fetch(
            """
            SELECT ta.nom_fr FROM exploitation_accessibilite ea
            JOIN type_accessibilite ta ON ta.id = ea.accessibilite_id
            WHERE ea.exploitation_id = $1
            """,
            exploitation_id,
        )

    result = dict(row)
    # إزالة عمود geom (geometry غير قابل للتسلسل مباشرة)
    result.pop("geom", None)
    result["blocks"] = rows_to_list(blocks)
    result["sources_energie"] = [r["nom_fr"] for r in energy]
    result["accessibilite"] = [r["nom_fr"] for r in access]
    return result


# ══════════════════════════════════════════════
#  4.  RECENSEMENTS
# ══════════════════════════════════════════════
@app.get("/api/recensements", tags=["Recensements"])
async def list_recensements(
    exploitation_id: Optional[int] = None,
    campagne_id: Optional[int] = None,
    status_id: Optional[int] = None,
):
    """قائمة الإحصاءات"""
    conditions = []
    params = []
    i = 1
    for val, col in [
        (exploitation_id, "r.exploitation_id"),
        (campagne_id, "r.campagne_id"),
        (status_id, "r.status_id"),
    ]:
        if val is not None:
            conditions.append(f"{col} = ${i}")
            params.append(val)
            i += 1

    where = ("WHERE " + " AND ".join(conditions)) if conditions else ""

    sql = f"""
        SELECT
            r.id,
            r.date_recensement,
            r.date_controle,
            rc.annee,
            rc.nom_fr AS campagne,
            e.nom_exploitation_fr AS exploitation,
            rs.nom_fr AS status,
            rs.nom_ar AS status_ar,
            u1.email AS recenseur,
            u2.email AS controleur
        FROM recensements r
        JOIN recensement_campagne rc ON rc.id = r.campagne_id
        JOIN exploitations e         ON e.id  = r.exploitation_id
        LEFT JOIN recensement_status rs ON rs.id = r.status_id
        LEFT JOIN users u1              ON u1.id = r.recenseur_id
        LEFT JOIN users u2              ON u2.id = r.controleur_id
        {where}
        ORDER BY r.date_recensement DESC
    """
    async with db_pool.acquire() as conn:
        rows = await conn.fetch(sql, *params)
    return rows_to_list(rows)


@app.get("/api/recensements/{rec_id}/details", tags=["Recensements"])
async def get_recensement_details(rec_id: int):
    """
    تفاصيل إحصاء واحد:
    superficies, cultures, arbres, cheptel, bovins,
    aviculture, apiculture, batiments, materiels,
    main_oeuvre, menage_agricole, ouvrages_eau,
    irrigation, intrants
    """
    async with db_pool.acquire() as conn:

        rec = await conn.fetchrow(
            """
            SELECT r.*, rc.annee, rc.nom_fr AS campagne,
                   e.nom_exploitation_fr AS exploitation,
                   rs.nom_fr AS status
            FROM recensements r
            JOIN recensement_campagne rc ON rc.id = r.campagne_id
            JOIN exploitations e         ON e.id  = r.exploitation_id
            LEFT JOIN recensement_status rs ON rs.id = r.status_id
            WHERE r.id = $1
            """,
            rec_id,
        )
        if not rec:
            raise HTTPException(404, "Recensement introuvable")

        superficies = await conn.fetch(
            """SELECT ts.nom_fr AS type, s.surface_sec, s.surface_irrigue
               FROM superficies s JOIN type_superficie ts ON ts.id=s.type_superficie_id
               WHERE s.recensement_id=$1""",
            rec_id,
        )
        cultures = await conn.fetch(
            """SELECT tc.nom_fr AS type, c.surface_sec, c.surface_irrigue, c.surface_intercalaire
               FROM cultures c JOIN type_culture tc ON tc.id=c.type_culture_id
               WHERE c.recensement_id=$1""",
            rec_id,
        )
        arbres = await conn.fetch(
            """SELECT ta.nom_fr AS type, a.nombre
               FROM arbres a JOIN type_arbre ta ON ta.id=a.type_arbre_id
               WHERE a.recensement_id=$1""",
            rec_id,
        )
        cheptel = await conn.fetch(
            """SELECT at2.nom_fr AS animal, ch.nombre_total, ch.nb_femelle
               FROM cheptel ch JOIN type_animal at2 ON at2.id=ch.animal_type_id
               WHERE ch.recensement_id=$1""",
            rec_id,
        )
        bovins = await conn.fetch(
            """SELECT cb.nom_fr AS categorie, b.nombre
               FROM bovins b JOIN categorie_bovin cb ON cb.id=b.categorie_bovin_id
               WHERE b.recensement_id=$1""",
            rec_id,
        )
        aviculture = await conn.fetch(
            """SELECT tv.nom_fr AS type, av.nb_ponte, av.nb_chaire
               FROM aviculture av JOIN type_aviculture tv ON tv.id=av.type_aviculture_id
               WHERE av.recensement_id=$1""",
            rec_id,
        )
        apiculture = await conn.fetch(
            """SELECT tr.nom_fr AS ruche, ap.nb_ruches_total, ap.nb_ruches_pleine
               FROM apiculture ap JOIN type_ruche tr ON tr.id=ap.type_ruche_id
               WHERE ap.recensement_id=$1""",
            rec_id,
        )
        batiments = await conn.fetch(
            """SELECT tb.nom_fr AS type, b.nombre, b.surface
               FROM batiments b JOIN type_batiment tb ON tb.id=b.type_batiment_id
               WHERE b.recensement_id=$1""",
            rec_id,
        )
        materiels = await conn.fetch(
            """SELECT tm.nom_fr AS type, m.nombre
               FROM materiels m JOIN type_materiel tm ON tm.id=m.type_materiel_id
               WHERE m.recensement_id=$1""",
            rec_id,
        )
        main_oeuvre = await conn.fetch(
            """SELECT tt.nom_fr AS travail, sx.nom_fr AS sexe, tp.nom_fr AS temps, mo.nb
               FROM main_oeuvre mo
               JOIN type_travail tt ON tt.id=mo.type_travail_id
               JOIN sexe sx ON sx.id=mo.sexe_id
               JOIN type_temps_travail tp ON tp.id=mo.type_temps_id
               WHERE mo.recensement_id=$1""",
            rec_id,
        )
        menage = await conn.fetchrow(
            "SELECT nb_personnes, nb_adultes, nb_enfants FROM menage_agricole WHERE recensement_id=$1",
            rec_id,
        )
        ouvrages = await conn.fetch(
            """SELECT to2.nom_fr AS type, oe.nombre
               FROM ouvrages_eau oe JOIN type_ouvrage_eau to2 ON to2.id=oe.type_ouvrage_id
               WHERE oe.recensement_id=$1""",
            rec_id,
        )
        irrigation = await conn.fetch(
            """SELECT mi.nom_fr AS mode, ir.surface
               FROM irrigation ir JOIN mode_irrigation mi ON mi.id=ir.mode_irrigation_id
               WHERE ir.recensement_id=$1""",
            rec_id,
        )
        intrants = await conn.fetchrow(
            "SELECT * FROM intrants WHERE recensement_id=$1", rec_id
        )

    return {
        "recensement": dict(rec),
        "superficies": rows_to_list(superficies),
        "cultures": rows_to_list(cultures),
        "arbres": rows_to_list(arbres),
        "cheptel": rows_to_list(cheptel),
        "bovins": rows_to_list(bovins),
        "aviculture": rows_to_list(aviculture),
        "apiculture": rows_to_list(apiculture),
        "batiments": rows_to_list(batiments),
        "materiels": rows_to_list(materiels),
        "main_oeuvre": rows_to_list(main_oeuvre),
        "menage_agricole": dict(menage) if menage else None,
        "ouvrages_eau": rows_to_list(ouvrages),
        "irrigation": rows_to_list(irrigation),
        "intrants": dict(intrants) if intrants else None,
    }


# ══════════════════════════════════════════════
#  5.  STATISTIQUES
# ══════════════════════════════════════════════
@app.get("/api/stats/wilayas", tags=["Statistiques"])
async def stats_by_wilaya():
    """إحصاءات المستثمرات حسب الولاية"""
    sql = """
        SELECT
            w.id,
            w.nom_fr,
            w.nom_ar,
            COUNT(e.id) AS nb_exploitations,
            ROUND(SUM(e.superficie_batie)::numeric,2) AS superficie_totale_ha
        FROM wilayas w
        LEFT JOIN communes c ON c.wilaya_id = w.id
        LEFT JOIN exploitations e ON e.commune_id = c.id
        GROUP BY w.id, w.nom_fr, w.nom_ar
        ORDER BY nb_exploitations DESC
    """
    async with db_pool.acquire() as conn:
        rows = await conn.fetch(sql)
    return rows_to_list(rows)


@app.get("/api/stats/campagne/{annee}", tags=["Statistiques"])
async def stats_campagne(annee: int):
    """إحصاءات حملة بعينها"""
    sql = """
        SELECT
            rs.nom_fr AS status,
            COUNT(*) AS nb
        FROM recensements r
        JOIN recensement_campagne rc ON rc.id = r.campagne_id
        JOIN recensement_status   rs ON rs.id = r.status_id
        WHERE rc.annee = $1
        GROUP BY rs.nom_fr
    """
    async with db_pool.acquire() as conn:
        rows = await conn.fetch(sql, annee)
    return rows_to_list(rows)


# ══════════════════════════════════════════════
#  6.  API CLIMATIQUE – Open-Meteo
# ══════════════════════════════════════════════
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

WMO_ICONS = {
    0: ("☀️", "صافٍ"),
    1: ("🌤️", "صافٍ جزئياً"), 2: ("⛅", "متقلب"), 3: ("☁️", "غائم"),
    45: ("🌫️", "ضبابي"), 48: ("🌫️", "ضباب"),
    51: ("🌦️", "رذاذ خفيف"), 53: ("🌦️", "رذاذ"), 55: ("🌧️", "رذاذ كثيف"),
    61: ("🌧️", "مطر خفيف"), 63: ("🌧️", "مطر"), 65: ("🌧️", "مطر غزير"),
    71: ("🌨️", "ثلج خفيف"), 73: ("🌨️", "ثلج"), 75: ("❄️", "ثلج كثيف"),
    80: ("🌦️", "زخات"), 81: ("🌦️", "زخات"), 82: ("⛈️", "زخات عاصفة"),
    95: ("⛈️", "عاصفة رعدية"), 96: ("⛈️", "عاصفة+برد"), 99: ("⛈️", "عاصفة شديدة"),
}


@app.get("/api/climat/actuel", tags=["Climatique"])
async def get_climat_actuel(
    lat: float = Query(..., description="خط العرض"),
    lon: float = Query(..., description="خط الطول"),
):
    """
    الطقس الحالي – Open-Meteo (مجاني، لا يحتاج API key)
    """
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "wind_speed_10m",
            "wind_direction_10m",
            "surface_pressure",
            "precipitation",
            "weathercode",
            "cloud_cover",
        ],
        "wind_speed_unit": "kmh",
        "timezone": "Africa/Algiers",
    }
    async with httpx.AsyncClient(timeout=8) as client:
        resp = await client.get(OPEN_METEO_URL, params=params)
    if resp.status_code != 200:
        raise HTTPException(502, "خطأ في خدمة الطقس")

    data = resp.json().get("current", {})
    wcode = data.get("weathercode", 0)
    icon, desc = WMO_ICONS.get(wcode, ("🌡️", "غير معروف"))

    return {
        "latitude": lat,
        "longitude": lon,
        "temperature": data.get("temperature_2m"),
        "apparent_temperature": data.get("apparent_temperature"),
        "humidity": data.get("relative_humidity_2m"),
        "wind_speed": data.get("wind_speed_10m"),
        "wind_direction": data.get("wind_direction_10m"),
        "pressure": data.get("surface_pressure"),
        "precipitation": data.get("precipitation"),
        "cloud_cover": data.get("cloud_cover"),
        "weathercode": wcode,
        "icon": icon,
        "description": desc,
        "time": data.get("time"),
    }


@app.get("/api/climat/previsions", tags=["Climatique"])
async def get_previsions(
    lat: float = Query(...),
    lon: float = Query(...),
    jours: int = Query(7, ge=1, le=16, description="عدد أيام التوقعات"),
):
    """
    توقعات الطقس لعدة أيام
    """
    params = {
        "latitude": lat,
        "longitude": lon,
        "daily": [
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_sum",
            "weathercode",
            "windspeed_10m_max",
        ],
        "forecast_days": jours,
        "wind_speed_unit": "kmh",
        "timezone": "Africa/Algiers",
    }
    async with httpx.AsyncClient(timeout=8) as client:
        resp = await client.get(OPEN_METEO_URL, params=params)
    if resp.status_code != 200:
        raise HTTPException(502, "خطأ في خدمة التوقعات")

    daily = resp.json().get("daily", {})
    dates = daily.get("time", [])
    result = []
    for i, date in enumerate(dates):
        wcode = daily["weathercode"][i]
        icon, desc = WMO_ICONS.get(wcode, ("🌡️", "غير معروف"))
        result.append({
            "date": date,
            "temp_max": daily["temperature_2m_max"][i],
            "temp_min": daily["temperature_2m_min"][i],
            "precipitation": daily["precipitation_sum"][i],
            "wind_max": daily["windspeed_10m_max"][i],
            "icon": icon,
            "description": desc,
        })
    return {"latitude": lat, "longitude": lon, "previsions": result}


@app.get("/api/climat/historique", tags=["Climatique"])
async def get_historique(
    lat: float = Query(...),
    lon: float = Query(...),
    date_debut: str = Query(..., description="YYYY-MM-DD"),
    date_fin: str = Query(..., description="YYYY-MM-DD"),
):
    """
    بيانات مناخية تاريخية (Open-Meteo Archive API)
    """
    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": date_debut,
        "end_date": date_fin,
        "daily": [
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_sum",
            "windspeed_10m_max",
        ],
        "wind_speed_unit": "kmh",
        "timezone": "Africa/Algiers",
    }
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(
            "https://archive-api.open-meteo.com/v1/archive", params=params
        )
    if resp.status_code != 200:
        raise HTTPException(502, "خطأ في قاعدة البيانات المناخية")

    daily = resp.json().get("daily", {})
    dates = daily.get("time", [])
    result = [
        {
            "date": dates[i],
            "temp_max": daily["temperature_2m_max"][i],
            "temp_min": daily["temperature_2m_min"][i],
            "precipitation": daily["precipitation_sum"][i],
            "wind_max": daily["windspeed_10m_max"][i],
        }
        for i in range(len(dates))
    ]
    return {"latitude": lat, "longitude": lon, "historique": result}


# ══════════════════════════════════════════════

# ══════════════════════════════════════════════
@app.get("/api/users", tags=["Utilisateurs"])
async def list_users():
    async with db_pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT u.id, u.nom_fr, u.prenom_fr, u.email, u.tel, u.status,
                   STRING_AGG(r.name, ', ') AS roles
            FROM users u
            LEFT JOIN user_roles ur ON ur.user_id = u.id
            LEFT JOIN roles r ON r.id = ur.role_id
            GROUP BY u.id
            ORDER BY u.id
            """
        )
    return rows_to_list(rows)


# ══════════════════════════════════════════════
#  8.  HEALTH CHECK
# ══════════════════════════════════════════════
@app.get("/api/health", tags=["Système"])
async def health():
    try:
        async with db_pool.acquire() as conn:
            await conn.fetchval("SELECT 1")
        return {"status": "ok", "database": "connecté", "api": "v1.0.0"}
    except Exception as e:
        raise HTTPException(503, f"DB non disponible: {e}")
    
        
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0", port=8000)


    #uvicorn main:app --host 0.0.0.0 --port 8000