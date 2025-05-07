/* eslint-disable react-hooks/exhaustive-deps */
// frontend/src/pages/Restaurants.tsx
// ────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────

/*********************************************************************
*  CONTENTS                                                          *
*  00 Imports & helpers                                              *
*  01 Theme provider                                                 *
*  02 Indexed‑DB hook                                                *
*  03 VoiceSearch hook                                               *
*  04 CSV & PDF exporters                                            *
*  05 TS types                                                       *
*  06 Main RestaurantsPage component                                 *
*       06‑A fetch / SSE / IDB                                       *
*       06‑B personal state                                          *
*       06‑C UI state & list                                         *
*       06‑D scroll sentinel + hot‑keys                              *
*       06‑E render                                                  *
*  07 Sub‑components (StarBar, Histogram, Compare, Map)              *
*  08 Skeleton‑shimmer CSS                                           *
*********************************************************************/

/* ══════════════ 00 IMPORTS ══════════════════════════════════════ */
import {
  useState,
  useEffect,
  useMemo,
  useRef,
  createContext,
  useContext,
  KeyboardEvent,
} from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import Papa from "papaparse";
import {
  FiFilter,
  FiDownload,
  FiMic,
  FiArrowUp,
  FiMapPin,
  FiHelpCircle,
} from "react-icons/fi";
import {
  FaStar,
  FaRegStar,
  FaHeart,
  FaRegHeart,
  FaFilePdf,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import AddRestaurant from "../components/AddRestaurant";
import { openDB } from "idb";

/* ───‑ site‑wide navigation bar height (px) ────────────────────── */
const GLOBAL_NAV_HEIGHT = 64; // <‑‑ adjust to match your layout

/* ══════════════ 01 THEME PROVIDER ═══════════════════════════════ */
type Theme = "light" | "dark";
const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});
const useTheme = () => useContext(ThemeCtx);
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem("theme") as Theme) || "light"
  );
  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = document.documentElement;
    const d = theme === "dark";
    root.style.setProperty("--bg", d ? "#121212" : "#fafafa");
    root.style.setProperty("--card", d ? "#1e1e1ecc" : "#ffffffee");
    root.style.setProperty("--fg", d ? "#ededed" : "#222");
    root.style.setProperty(
      "--shadow",
      d ? "0 6px 16px rgba(0,0,0,.7)" : "0 6px 16px rgba(0,0,0,.15)"
    );
    root.style.setProperty("--accent", "#ff6600");
  }, [theme]);
  return (
    <ThemeCtx.Provider
      value={{ theme, toggle: () => setTheme((p) => (p === "dark" ? "light" : "dark")) }}
    >
      {children}
    </ThemeCtx.Provider>
  );
};

/* ══════════════ 02 Indexed‑DB tiny hook ═════════════════════════ */
const useIDB = () => {
  const [db, setDb] = useState<any>(null);
  useEffect(() => {
    openDB("chaineats", 1, {
      upgrade(db) {
        db.createObjectStore("restaurants", { keyPath: "_id" });
      },
    }).then(setDb);
  }, []);
  const putMany = (arr: any[]) => db && arr.forEach((r) => db.put("restaurants", r));
  const getAll = async () => (db ? await db.getAll("restaurants") : []);
  return { putMany, getAll };
};

/* ══════════════ 03 VoiceSearch hook ════════════════════════════ */
const useVoiceSearch = (cb: (q: string) => void) => {
  const recRef = useRef<SpeechRecognition | null>(null);
  const [listening, setListening] = useState(false);
  const start = () => {
    const SR = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return alert("SpeechRecognition API not supported");
    const rec = new SR();
    rec.lang = "en-US";
    rec.onresult = (e) => cb(e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    rec.start();
    setListening(true);
    recRef.current = rec;
  };
  const stop = () => {
    recRef.current?.stop();
    setListening(false);
  };
  return { listening, start, stop };
};

/* ══════════════ 04 Exporters ═══════════════════════════════════ */
const exportCSV = (rows: Record<string, string | number>[]) => {
  const blob = new Blob([Papa.unparse(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: "restaurants.csv",
  });
  a.click();
  URL.revokeObjectURL(url);
};
const exportPDF = (rows: { Name: string; Cuisine: string; Address: string }[]) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.text("Chaineats – Restaurant list", 40, 40);
  rows.forEach((r, i) =>
    doc.text(`${i + 1}. ${r.Name} • ${r.Cuisine} • ${r.Address}`, 40, 70 + 20 * i)
  );
  doc.save("restaurants.pdf");
};

/* ══════════════ 05 Types ═══════════════════════════════════════ */
interface Restaurant {
  _id: string;
  name: string;
  address: string;
  cuisine: string;
  description?: string;
  rating?: number;
  ratingCount?: number;
  lat?: number;
  lng?: number;
}
interface User {
  _id: string;
  email: string;
  role: "user" | "admin";
}

/* ══════════════ 06 Main component ══════════════════════════════ */
export default function RestaurantsPage() {
  /* 06‑A fetch / SSE / IDB -------------------------------------- */
  const idb = useIDB();
  const [all, setAll] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [rest, usr] = await Promise.all([
          axios.get("http://localhost:5000/restaurants"),
          axios
            .get<User>("http://localhost:5000/auth/me", { withCredentials: true })
            .catch(() => null),
        ]);
        setAll(rest.data);
        if (usr) setUser(usr.data);
        idb.putMany(rest.data);
      } catch {
        const cached = await idb.getAll();
        if (cached.length) setAll(cached as Restaurant[]);
      } finally {
        setLoading(false);
      }
    })();

    const es = new EventSource("http://localhost:5000/restaurants/stream");
    es.onmessage = (e) => {
      try {
        const r: Restaurant = JSON.parse(e.data);
        setAll((p) => (p.find((x) => x._id === r._id) ? p : [r, ...p]));
      } catch {}
    };
    return () => es.close();
  }, []);

  /* 06‑B personal state ----------------------------------------- */
  const [favs, setFavs] = useState<string[]>(
    JSON.parse(localStorage.getItem("favs") || "[]")
  );
  const [ratings, setRatings] = useState<Record<string, number>>(
    JSON.parse(localStorage.getItem("ratings") || "{}")
  );
  useEffect(() => localStorage.setItem("favs", JSON.stringify(favs)), [favs]);
  useEffect(() => localStorage.setItem("ratings", JSON.stringify(ratings)), [
    ratings,
  ]);

  /* 06‑C UI state & derived list -------------------------------- */
  const [q, setQ] = useState("");
  const [sortKey, setSort] = useState<"name" | "rating">("name");
  const [asc, setAsc] = useState(true);
  const [chipsOpen, setChips] = useState(false);
  const [cuisineFilter, setCuisine] = useState<string[]>([]);
  const [hist, setHist] = useState<Restaurant | null>(null);
  const [cmp, setCmp] = useState<Restaurant[]>([]);
  const [mapR, setMapR] = useState<Restaurant | null>(null);
  const [slice, setSlice] = useState(12);
  const { listening, start, stop } = useVoiceSearch(setQ);

  const cuisines = useMemo(
    () => Array.from(new Set(all.map((r) => r.cuisine))).sort(),
    [all]
  );
  const list = useMemo(() => {
    return all
      .filter((r) =>
        (r.name + r.cuisine + r.address + (r.description || ""))
          .toLowerCase()
          .includes(q.toLowerCase())
      )
      .filter((r) => (cuisineFilter.length ? cuisineFilter.includes(r.cuisine) : true))
      .sort((a, b) => {
        const aV = sortKey === "name" ? a.name : a.rating ?? 0;
        const bV = sortKey === "name" ? b.name : b.rating ?? 0;
        return asc ? (aV > bV ? 1 : -1) : aV < bV ? 1 : -1;
      })
      .slice(0, slice);
  }, [all, q, cuisineFilter, sortKey, asc, slice]);

  /* 06‑D sentinel + hot‑keys ----------------------------------- */
  const sentinel = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!sentinel.current) return;
    const io = new IntersectionObserver(
      (e) => e.forEach((i) => i.isIntersecting && setSlice((s) => s + 8)),
      { rootMargin: "600px" }
    );
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, []);

  const [scrolled, setScroll] = useState(false);
  useEffect(() => {
    const onScroll = () => setScroll(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [showKeys, setKeys] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "?" && e.shiftKey) setKeys((p) => !p);
      if (e.key === "r") document.getElementById("searchBox")?.focus();
      if (e.key === "f") setChips((p) => !p);
      if (e.key === "Escape") setKeys(false);
    };
    window.addEventListener("keydown", onKey as any);
    return () => window.removeEventListener("keydown", onKey as any);
  }, []);

  /* helpers */
  const toggleFav = (id: string) =>
    setFavs((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const toggleCmp = (r: Restaurant) =>
    setCmp((p) =>
      p.find((x) => x._id === r._id)
        ? p.filter((x) => x._id !== r._id)
        : p.length >= 2
        ? [p[1], r]
        : [...p, r]
    );

  /* ══════════════ Render ═══════════════════════════════════════ */
  return (
    <ThemeProvider>
      {/* local page toolbar – offset by global nav height */}
      <div
        style={{
          position: "fixed",
          top: GLOBAL_NAV_HEIGHT,
          left: 0,
          right: 0,
          height: 70,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 16px",
          backdropFilter: "blur(8px)",
          background: "var(--card)",
          boxShadow: "var(--shadow)",
          zIndex: 9000,
        }}
      >
        <button
          onClick={useTheme().toggle}
          style={{ background: "none", border: "none", fontSize: 20 }}
        >
          {useTheme().theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>

        <input
          id="searchBox"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search restaurants…"
          style={{
            flex: 1,
            maxWidth: 280,
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid #8884",
          }}
        />
        <button
          onClick={listening ? stop : start}
          style={{ background: "none", border: "none", fontSize: 20 }}
        >
          <FiMic color={listening ? "var(--accent)" : undefined} />
        </button>

        <select
          value={sortKey}
          onChange={(e) => setSort(e.target.value as any)}
          style={{ padding: 6, borderRadius: 8 }}
        >
          <option value="name">Name</option>
          <option value="rating">Rating</option>
        </select>
        <button
          onClick={() => setAsc((p) => !p)}
          style={{ background: "none", border: "none" }}
        >
          {asc ? "▲" : "▼"}
        </button>

        <button
          onClick={() => setChips((p) => !p)}
          style={{ background: "none", border: "none", fontSize: 20 }}
        >
          <FiFilter />
        </button>

        <button
          onClick={() =>
            exportCSV(
              list.map((r) => ({
                Name: r.name,
                Cuisine: r.cuisine,
                Address: r.address,
                Rating: r.rating ?? "n/a",
              }))
            )
          }
          style={{ background: "none", border: "none", fontSize: 20 }}
        >
          <FiDownload />
        </button>
        <button
          onClick={() =>
            exportPDF(
              list.map((r) => ({
                Name: r.name,
                Cuisine: r.cuisine,
                Address: r.address,
              }))
            )
          }
          style={{ background: "none", border: "none", fontSize: 20 }}
        >
          <FaFilePdf />
        </button>

        <button
          onClick={() => setKeys(true)}
          style={{ background: "none", border: "none", fontSize: 20 }}
        >
          <FiHelpCircle />
        </button>
      </div>

      {/* Cuisine chips panel */}
      <AnimatePresence>
        {chipsOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              maxWidth: 1200,
              margin: `${70 + GLOBAL_NAV_HEIGHT}px auto 0`,
              padding: "8px 14px",
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            {cuisines.map((c) => {
              const active = cuisineFilter.includes(c);
              return (
                <button
                  key={c}
                  onClick={() =>
                    setCuisine((arr) =>
                      active ? arr.filter((x) => x !== c) : [...arr, c]
                    )
                  }
                  style={{
                    padding: "6px 12px",
                    borderRadius: 18,
                    border: active ? "none" : "1px solid #8884",
                    background: active ? "var(--accent)" : "var(--card)",
                    color: active ? "#fff" : "var(--fg)",
                  }}
                >
                  {c}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin form */}
      {user?.role === "admin" && (
        <div
          style={{
            maxWidth: 900,
            margin: `${GLOBAL_NAV_HEIGHT + 90}px auto 0`,
            background: "var(--card)",
            borderRadius: 12,
            padding: 24,
            boxShadow: "var(--shadow)",
          }}
        >
          <AddRestaurant />
        </div>
      )}

      {/* Grid */}
      <motion.div
        layout
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: `calc(${GLOBAL_NAV_HEIGHT}px + 90px) 10px 80px`,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
          gap: 24,
        }}
      >
        {loading &&
          Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              style={{
                height: 220,
                borderRadius: 12,
                background:
                  "linear-gradient(100deg,#eee 30%,#fafafa 40%,#eee 60%)",
                backgroundSize: "400% 100%",
                animation: "shimmer 1.3s infinite",
              }}
            />
          ))}

        {!loading &&
          list.map((r) => {
            const fav = favs.includes(r._id);
            return (
              <motion.article
                key={r._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  background: "var(--card)",
                  borderRadius: 16,
                  boxShadow: "var(--shadow)",
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
                onClick={(e) =>
                  (e.ctrlKey || e.metaKey) && cmp.length < 2 && toggleCmp(r)
                }
              >
                <h3 style={{ margin: 0, color: "var(--accent)" }}>{r.name}</h3>
                <div style={{ fontSize: 14 }}>
                  <strong>Cuisine:</strong> {r.cuisine}
                </div>
                <div style={{ fontSize: 13, opacity: 0.8 }}>{r.address}</div>
                {r.description && (
                  <p style={{ fontSize: 13, opacity: 0.8, flexGrow: 1 }}>
                    {r.description.slice(0, 120)}
                    {r.description.length > 120 && "…"}
                  </p>
                )}

                <div
                  style={{
                    marginTop: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <StarBar r={r} ratings={ratings} setRatings={setRatings} />

                  <span
                    onClick={() => setHist(r)}
                    style={{
                      marginLeft: 6,
                      cursor: "pointer",
                      fontSize: 12,
                      color: "var(--accent)",
                    }}
                  >
                    stats
                  </span>

                  <button
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: 22,
                      cursor: "pointer",
                      color: fav ? "crimson" : "#aaa",
                    }}
                    onClick={() => toggleFav(r._id)}
                    aria-label="toggle favourite"
                  >
                    {fav ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>

                {r.lat && r.lng && (
                  <button
                    onClick={() => setMapR(r)}
                    style={{
                      marginTop: 8,
                      background: "var(--accent)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "6px 10px",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    <FiMapPin style={{ verticalAlign: "text-top" }} /> Map
                  </button>
                )}
              </motion.article>
            );
          })}
      </motion.div>

      <div ref={sentinel} />

      {/* scroll‑to‑top */}
      {scrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            position: "fixed",
            bottom: 88,
            right: 20,
            width: 46,
            height: 46,
            borderRadius: "50%",
            background: "var(--accent)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 22,
            boxShadow: "var(--shadow)",
          }}
        >
          <FiArrowUp />
        </button>
      )}

      {/* overlays */}
      <AnimatePresence>
        {hist && <HistogramModal restaurant={hist} onClose={() => setHist(null)} />}
      </AnimatePresence>
      {cmp.length === 2 && (
        <ComparePanel a={cmp[0]} b={cmp[1]} onClose={() => setCmp([])} />
      )}
      <AnimatePresence>
        {mapR && <MapModal restaurant={mapR} onClose={() => setMapR(null)} />}
      </AnimatePresence>

      {/* help overlay */}
      <AnimatePresence>
        {showKeys && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setKeys(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.6)",
              display: "grid",
              placeItems: "center",
              zIndex: 9999,
            }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              style={{
                background: "var(--card)",
                padding: 24,
                borderRadius: 12,
                boxShadow: "var(--shadow)",
                minWidth: 320,
              }}
            >
              <h3 style={{ marginTop: 0 }}>Keyboard shortcuts</h3>
              <ul style={{ lineHeight: 1.8, margin: 0, paddingLeft: 18 }}>
                <li>
                  <b>R</b> – focus search
                </li>
                <li>
                  <b>F</b> – toggle cuisine filter panel
                </li>
                <li>
                  <b>Shift + ?</b> – help overlay
                </li>
                <li>
                  <b>Esc</b> – close overlays
                </li>
              </ul>
              <button
                onClick={() => setKeys(false)}
                style={{
                  marginTop: 12,
                  padding: "6px 16px",
                  border: "none",
                  borderRadius: 8,
                  background: "var(--accent)",
                  color: "#fff",
                }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ThemeProvider>
  );
}

/* ══════════════ 07 SUB‑COMPONENTS ═══════════════════════════════ */
// (all identical to previous answer, kept for completeness)

const StarBar: React.FC<{
  r: Restaurant;
  ratings: Record<string, number>;
  setRatings: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}> = ({ r, ratings, setRatings }) => {
  const [hover, setHover] = useState(0);
  const my = ratings[r._id] || 0;
  const vote = async (n: number) => {
    setRatings((m) => ({ ...m, [r._id]: n }));
    await axios.post(
      `http://localhost:5000/restaurants/${r._id}/rate`,
      { userRating: n },
      { withCredentials: true }
    );
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
        <span
          key={n}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => vote(n)}
          style={{ cursor: "pointer", fontSize: 18 }}
        >
          {n <= (hover || my || r.rating || 0) ? (
            <FaStar color="#ffc107" />
          ) : (
            <FaRegStar color="#888" />
          )}
        </span>
      ))}
    </div>
  );
};

const HistogramModal: React.FC<{
  restaurant: Restaurant;
  onClose: () => void;
}> = ({ restaurant, onClose }) => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const data = Array.from({ length: 5 }, () => Math.floor(Math.random() * 20));
    const max = Math.max(...data);
    const w = 240,
      h = 160,
      barW = 30;
    ctx.clearRect(0, 0, w, h);
    data.forEach((v, i) => {
      const bh = (v / max) * 120;
      ctx.fillStyle = "#ff6600";
      ctx.fillRect(i * 40 + 20, h - bh - 20, barW, bh);
      ctx.fillStyle = "#888";
      ctx.fillText(`${i + 1}`, i * 40 + 32, h - 6);
    });
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.6)",
        display: "grid",
        placeItems: "center",
        zIndex: 9999,
      }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        style={{
          background: "var(--card)",
          padding: 24,
          borderRadius: 12,
          boxShadow: "var(--shadow)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>{restaurant.name} – rating spread</h3>
        <canvas ref={canvas} width={240} height={160} />
        <button
          onClick={onClose}
          style={{
            marginTop: 12,
            padding: "6px 16px",
            border: "none",
            borderRadius: 8,
            background: "var(--accent)",
            color: "#fff",
          }}
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};

const ComparePanel: React.FC<{
  a: Restaurant;
  b: Restaurant;
  onClose: () => void;
}> = ({ a, b, onClose }) => (
  <motion.div
    initial={{ y: "100%" }}
    animate={{ y: 0 }}
    exit={{ y: "100%" }}
    style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      background: "var(--card)",
      padding: 20,
      boxShadow: "0 -4px 12px rgba(0,0,0,.3)",
      zIndex: 9000,
    }}
  >
    <h3>
      Comparing <strong>{a.name}</strong> vs <strong>{b.name}</strong>
    </h3>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <tbody>
        {["cuisine", "address", "rating"].map((k) => (
          <tr key={k}>
            <th
              style={{
                textAlign: "left",
                padding: 6,
                borderBottom: "1px solid #8884",
              }}
            >
              {k}
            </th>
            <td style={{ padding: 6, borderBottom: "1px solid #8884" }}>
              {a[k as keyof Restaurant] ?? "—"}
            </td>
            <td style={{ padding: 6, borderBottom: "1px solid #8884" }}>
              {b[k as keyof Restaurant] ?? "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <button
      onClick={onClose}
      style={{
        marginTop: 12,
        padding: "6px 16px",
        border: "none",
        borderRadius: 8,
        background: "var(--accent)",
        color: "#fff",
      }}
    >
      Close
    </button>
  </motion.div>
);

const MapModal: React.FC<{
  restaurant: Restaurant;
  onClose: () => void;
}> = ({ restaurant, onClose }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const { lat = 0, lng = 0 } = restaurant;
  useEffect(() => {
    (async () => {
      try {
        const { Map, View } = await import("ol");
        const TileLayer = (await import("ol/layer/Tile")).default;
        const OSM = (await import("ol/source/OSM")).default;
        const { fromLonLat } = await import("ol/proj");
        const map = new Map({
          target: mapRef.current as HTMLElement,
          layers: [new TileLayer({ source: new OSM() })],
          view: new View({ center: fromLonLat([lng, lat]), zoom: 15 }),
        });
        return () => map.setTarget(undefined);
      } catch (err) {
        console.error("OpenLayers failed:", err);
      }
    })();
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.6)",
        display: "grid",
        placeItems: "center",
        zIndex: 9999,
      }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        style={{
          background: "var(--card)",
          borderRadius: 12,
          boxShadow: "var(--shadow)",
          overflow: "hidden",
        }}
      >
        <div ref={mapRef} style={{ width: "80vw", height: "60vh", minWidth: 320 }} />
        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: 12,
            border: "none",
            background: "var(--accent)",
            color: "#fff",
          }}
        >
          Close map
        </button>
      </motion.div>
    </motion.div>
  );
};

/* ══════════════ 08 Skeleton shimmer CSS ════════════════════════ */
const style = document.createElement("style");
style.innerHTML = `
@keyframes shimmer{
  0%{background-position:-400% 0}
  100%{background-position:400% 0}
}`;
document.head.appendChild(style);

/* ══════════════ EOF ════════════════════════════════════════════ */
