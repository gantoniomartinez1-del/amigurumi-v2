import { GoogleGenerativeAI } from "@google/generative-ai";

const SIZES = [
  { label:"Mini (~8cm)",     hook:"2.0-2.5mm", magic:6 },
  { label:"Pequeño (~12cm)", hook:"2.5-3.0mm", magic:6 },
  { label:"Mediano (~18cm)", hook:"3.0-3.5mm", magic:6 },
  { label:"Grande (~25cm)",  hook:"3.5-4.0mm", magic:8 },
];

const LEVELS = [
  { id:"beginner",     label:"Principiante", emoji:"🌱", desc:"Primera vez tejiendo amigurumis",  color:"#16a34a", bg:"#f0fdf4", border:"#86efac", header:"linear-gradient(135deg,#16a34a,#059669)" },
  { id:"intermediate", label:"Intermedio",   emoji:"🌿", desc:"Conozco los puntos básicos",       color:"#d97706", bg:"#fffbeb", border:"#fcd34d", header:"linear-gradient(135deg,#d97706,#b45309)" },
  { id:"advanced",     label:"Avanzado",     emoji:"🌸", desc:"Experiencia en amigurumis",        color:"#7c3aed", bg:"#fdf4ff", border:"#c4b5fd", header:"linear-gradient(135deg,#6b2fa0,#d946a8)" },
];

export default function App() {
  const [level,    setLevel]    = useState(null);
  const [image,    setImage]    = useState(null);
  const [imgB64,   setImgB64]   = useState(null);
  const [size,     setSize]     = useState(SIZES[1]);
  const [loading,  setLoading]  = useState(false);
  const [loadMsg,  setLoadMsg]  = useState("");
  const [pattern,  setPattern]  = useState(null);
  const [error,    setError]    = useState(null);
  const [tab,      setTab]      = useState("upload");
  const [checked,  setChecked]  = useState({});
  const [printView,setPrintView]= useState(false);
  const fileRef = useRef();

  const lv = LEVELS.find(l => l.id === level) || LEVELS[2];

  const loadFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target.result);
      setImgB64(ev.target.result.split(",")[1]);
      setPattern(null); setError(null); setChecked({});
    };
    reader.readAsDataURL(file);
  };

  const buildPrompt = () => {
    const base = `Tamaño: ${size.label}, gancho: ${size.hook}, anillo mágico base: ${size.magic} puntos.`;
    if (level === "beginner") return `Eres profesora de crochet muy paciente. Analiza la imagen y genera un patrón de amigurumi MUY SENCILLO para principiantes. ${base} Usa palabras simples, sin abreviaturas técnicas, explica cada vuelta con detalle, máximo 5 partes simples. Responde SOLO con JSON sin backticks: {"nombre":"...","descripcion":"...","dificultad":"Principiante","tiempoEstimado":"X-Y horas","nivelMensaje":"...","materiales":["..."],"partes":[{"nombre":"...","color":"...","puntoInicial":"...","vueltas":[{"num":1,"instruccion":"...","total":6,"explicacion":"..."}],"notas":"..."}],"ensamblaje":["..."],"consejosFinales":["..."]}`;
    if (level === "intermediate") return `Eres experta en amigurumis. Genera un patrón INTERMEDIO. ${base} Usa abreviaturas básicas con significado entre paréntesis. Hasta 6 partes. Responde SOLO con JSON sin backticks: {"nombre":"...","descripcion":"...","dificultad":"Intermedio","tiempoEstimado":"X-Y horas","nivelMensaje":"...","materiales":["..."],"partes":[{"nombre":"...","color":"...","puntoInicial":"...","vueltas":[{"num":1,"instruccion":"...","total":6,"explicacion":""}],"notas":"..."}],"ensamblaje":["..."],"consejosFinales":["..."]}`;
    return `Eres diseñadora experta en amigurumis nivel avanzado. ${base} Usa terminología técnica: pm, aum, dis, ap, prs, v. Incluye TODAS las partes con máximo detalle. Responde SOLO con JSON sin backticks: {"nombre":"...","descripcion":"...","dificultad":"Avanzado","tiempoEstimado":"X-Y horas","nivelMensaje":"...","materiales":["..."],"partes":[{"nombre":"...","color":"...","puntoInicial":"ap con ${size.magic} pm","vueltas":[{"num":1,"instruccion":"ap con ${size.magic} pm","total":${size.magic},"explicacion":""}],"notas":"..."}],"ensamblaje":["..."],"consejosFinales":["..."]}`;
  };

  const generate = async () => {
    if (!imgB64 || !level) return;
    setLoading(true); setError(null); setPattern(null); setChecked({});
    setLoadMsg("Analizando imagen...");
    try {
      setLoadMsg("Generando patrón con IA...");
 const generarPatron = async () => {
    if (!imageBase64) {
      alert("Por favor, sube una foto primero.");
      return;
    }

    setLoading(true);
    setLoadMsg("Analizando imagen con Gemini...");

    try {
      // Llamada a tu función de Netlify
     const genAI = new GoogleGenerativeAI("AIzaSyCECMpMvQFRH7SGoDn9yRkakOFgxLIwAJ8");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const imageData = imageBase64.split(",")[1];

    const result = await model.generateContent([
      `Eres un experto en amigurumis. Crea un patrón detallado para tamaño ${selectedSize} con gancho ${selectedHook} basado en la imagen adjunta.`,
      { inlineData: { data: imageData, mimeType: "image/jpeg" } },
    ]);

    const data = { pattern: result.response.text() };

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await response.json();

      if (data.pattern) {
        setPattern(data.pattern);
        setLoadMsg("¡Patrón generado con éxito!");
      } else {
        throw new Error("No se recibió un patrón válido");
      }

    } catch (err) {
      console.error("Error:", err);
      alert("Hubo un problema al generar el patrón. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };
      setLoadMsg("Procesando respuesta...");
      const data = await res.json();
      const text = (data.content || []).map(b => b.text || "").join("");
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Sin JSON");
      const parsed = JSON.parse(match[0]);
      if (!parsed.partes?.length) throw new Error("Vacío");
      setPattern(parsed);
      setTab("pattern");
    } catch(e) {
      setError("No se pudo generar el patrón. Intenta con otra imagen más clara.");
      console.error(e);
    } finally { setLoading(false); setLoadMsg(""); }
  };

  const toggle = (pi, rn) => {
    const k = `${pi}-${rn}`;
    setChecked(prev => ({ ...prev, [k]: !prev[k] }));
  };

  const copyText = () => {
    if (!pattern) return;
    let t = `PATRÓN: ${pattern.nombre}\nNivel: ${pattern.dificultad} | Tamaño: ${size.label} | Tiempo: ${pattern.tiempoEstimado}\n\nMATERIALES:\n${pattern.materiales.map(m=>`• ${m}`).join("\n")}`;
    pattern.partes.forEach(p => {
      t += `\n\n◆ ${p.nombre.toUpperCase()} (${p.color})\nInicio: ${p.puntoInicial}\n`;
      p.vueltas.forEach(v => { t += `V${v.num}: ${v.instruccion} [${v.total}pts]\n`; if(v.explicacion) t += `  → ${v.explicacion}\n`; });
      if(p.notas) t += `Nota: ${p.notas}\n`;
    });
    t += `\nENSAMBLAJE:\n${pattern.ensamblaje.map((s,i)=>`${i+1}. ${s}`).join("\n")}`;
    t += `\nCONSEJOS:\n${(pattern.consejosFinales||[]).map(c=>`• ${c}`).join("\n")}`;
    navigator.clipboard.writeText(t).then(() => alert("✅ Patrón copiado al portapapeles"), () => alert("No se pudo copiar"));
  };

  const totalRows = pattern?.partes?.reduce((a,p) => a + p.vueltas.length, 0) || 0;
  const doneRows  = Object.values(checked).filter(Boolean).length;
  const progress  = totalRows > 0 ? Math.round((doneRows/totalRows)*100) : 0;

  /* LEVEL SELECTOR */
  if (!level) return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#fdf4ff,#f0fdf4)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"Georgia,serif"}}>
      <div style={{fontSize:52,marginBottom:12}}>🧸</div>
      <h1 style={{fontSize:26,fontWeight:"bold",color:"#2d1b3d",marginBottom:6,textAlign:"center"}}>AmigoPatrón IA</h1>
      <p style={{fontSize:14,color:"#6b5080",marginBottom:32,textAlign:"center",maxWidth:300}}>Genera patrones de amigurumi desde una foto. Primero dinos tu nivel:</p>
      <div style={{display:"flex",flexDirection:"column",gap:12,width:"100%",maxWidth:340}}>
        {LEVELS.map(l=>(
          <button key={l.id} onClick={()=>setLevel(l.id)} style={{padding:"16px 18px",borderRadius:14,border:`2px solid ${l.border}`,background:l.bg,cursor:"pointer",textAlign:"left",boxShadow:"0 2px 12px rgba(0,0,0,0.07)"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:28}}>{l.emoji}</span>
              <div><div style={{fontSize:15,fontWeight:"bold",color:l.color}}>{l.label}</div><div style={{fontSize:11,color:"#6b5080",marginTop:2}}>{l.desc}</div></div>
              <span style={{marginLeft:"auto",fontSize:18,color:l.color}}>→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  /* PRINT VIEW */
  if (printView && pattern) return (
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:"Georgia,serif"}}>
      <div style={{background:lv.header,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
        <span style={{color:"#fff",fontWeight:"bold",fontSize:14}}>📄 Vista para imprimir</span>
        <div style={{display:"flex",gap:8}}>
          <button onClick={copyText} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12}}>📋 Copiar</button>
          <button onClick={()=>setPrintView(false)} style={{background:"rgba(255,255,255,0.9)",border:"none",color:lv.color,borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:"bold"}}>← Volver</button>
        </div>
      </div>
      <div style={{background:"#fef9c3",borderBottom:"1px solid #fde047",padding:"10px 16px",fontSize:12,color:"#713f12"}}>
        💡 <strong>Guardar como PDF:</strong> En el navegador toca ⋮ → Imprimir → Guardar como PDF
      </div>
      <div style={{padding:16,maxWidth:680,margin:"0 auto"}}>
        <div style={{background:lv.header,color:"#fff",borderRadius:12,padding:"16px 18px",marginBottom:16}}>
          <div style={{fontSize:20,fontWeight:"bold",marginBottom:4}}>🧸 {pattern.nombre}</div>
          <div style={{fontSize:12,opacity:0.85,marginBottom:6}}>{pattern.descripcion}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {[["📏",size.label],["🔗",`Gancho ${size.hook}`],["🎯",pattern.dificultad],["⏱",pattern.tiempoEstimado]].map(([i,v])=>(
              <span key={v} style={{background:"rgba(255,255,255,0.2)",borderRadius:6,padding:"2px 9px",fontSize:10}}>{i} {v}</span>
            ))}
          </div>
        </div>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:"bold",color:lv.color,borderBottom:`2px solid ${lv.border}`,paddingBottom:4,marginBottom:8}}>🪡 MATERIALES</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3px 16px"}}>
            {[...pattern.materiales,`Gancho ${size.hook}`,"Aguja lanera","Relleno fibra","Ojos de seguridad"].map((m,i)=>(
              <div key={i} style={{fontSize:11,color:"#3a1a5e"}}>• {m}</div>
            ))}
          </div>
        </div>
        {pattern.partes.map((parte,pi)=>(
          <div key={pi} style={{border:`1px solid ${lv.border}`,borderRadius:10,marginBottom:12,overflow:"hidden"}}>
            <div style={{background:lv.bg,padding:"8px 12px",borderBottom:`1px solid ${lv.border}`}}>
              <div style={{fontSize:13,fontWeight:"bold",color:lv.color}}>◆ {parte.nombre.toUpperCase()}</div>
              <div style={{fontSize:10,color:"#7c3aed",marginTop:2}}>🎨 {parte.color} | Inicio: {parte.puntoInicial}</div>
            </div>
            {parte.vueltas.map(v=>(
              <div key={v.num}>
                <div style={{display:"grid",gridTemplateColumns:"auto 1fr auto",gap:6,padding:"5px 12px",borderBottom:"1px solid #f3f0ff",fontSize:11,background:v.num%2===0?"#fafafa":"#fff"}}>
                  <span style={{fontWeight:"bold",color:lv.color,whiteSpace:"nowrap"}}>{level==="beginner"?`Vuelta ${v.num}:`:`V${v.num}:`}</span>
                  <span style={{color:"#1a0a2e",lineHeight:1.5}}>{v.instruccion}</span>
                  <span style={{fontWeight:"bold",color:"#a855d4",textAlign:"right",whiteSpace:"nowrap"}}>[{v.total}pts]</span>
                </div>
                {v.explicacion && level!=="advanced" && <div style={{padding:"3px 12px 5px 12px",fontSize:10,color:"#6b5080",fontStyle:"italic",background:"#f9f5ff"}}> 💬 {v.explicacion}</div>}
              </div>
            ))}
            {parte.notas && <div style={{background:"#fffbeb",padding:"6px 12px",fontSize:10,color:"#92400e",fontStyle:"italic",borderTop:`1px solid ${lv.border}`}}>📌 {parte.notas}</div>}
          </div>
        ))}
        <div style={{marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:"bold",color:lv.color,borderBottom:`2px solid ${lv.border}`,paddingBottom:4,marginBottom:8}}>🔧 ENSAMBLAJE</div>
          {pattern.ensamblaje.map((s,i)=><div key={i} style={{fontSize:11,color:"#3a1a5e",marginBottom:5,lineHeight:1.5}}>{i+1}. {s}</div>)}
        </div>
        {pattern.consejosFinales?.length>0 && (
          <div style={{background:lv.bg,border:`1px solid ${lv.border}`,borderRadius:10,padding:12,marginBottom:14}}>
            <div style={{fontSize:12,fontWeight:"bold",color:lv.color,marginBottom:8}}>💡 CONSEJOS</div>
            {pattern.consejosFinales.map((c,i)=><div key={i} style={{fontSize:11,color:"#3a1a5e",marginBottom:4}}>• {c}</div>)}
          </div>
        )}
        <div style={{textAlign:"center",fontSize:10,color:"#a78bfa",padding:"12px 0",fontStyle:"italic",borderTop:"1px solid #e9d5ff"}}>AmigoPatrón IA · {pattern.nombre}</div>
      </div>
    </div>
  );

  /* MAIN APP */
  return (
    <div style={{minHeight:"100vh",background:lv.bg,fontFamily:"Georgia,serif",color:"#2d1b3d"}}>
      <header style={{background:lv.header,padding:"14px 20px",color:"#fff",boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>
        <div style={{maxWidth:680,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:26}}>🧸</span>
            <div>
              <div style={{fontSize:16,fontWeight:"bold",letterSpacing:1}}>AmigoPatrón IA</div>
              <div style={{fontSize:10,opacity:0.7}}>{lv.emoji} Nivel {lv.label}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:6}}>
            {pattern && ["upload","pattern"].map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{padding:"5px 12px",borderRadius:20,border:"none",cursor:"pointer",fontSize:11,background:tab===t?"rgba(255,255,255,0.95)":"rgba(255,255,255,0.2)",color:tab===t?lv.color:"#fff",fontWeight:tab===t?"bold":"normal"}}>
                {t==="upload"?"📷 Imagen":"📋 Patrón"}
              </button>
            ))}
            <button onClick={()=>{setLevel(null);setPattern(null);setTab("upload");}} style={{padding:"5px 12px",borderRadius:20,border:"1px solid rgba(255,255,255,0.4)",background:"transparent",color:"#fff",fontSize:11,cursor:"pointer"}}>
              Cambiar nivel
            </button>
          </div>
        </div>
      </header>

      <div style={{maxWidth:680,margin:"0 auto",padding:"20px 16px"}}>
        {tab==="upload" && (
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {level==="beginner" && (
              <div style={{background:"#dcfce7",border:"1px solid #86efac",borderRadius:12,padding:"14px 16px"}}>
                <div style={{fontSize:14,fontWeight:"bold",color:"#15803d",marginBottom:4}}>👋 ¡Bienvenida!</div>
                <div style={{fontSize:12,color:"#166534",lineHeight:1.6}}>Sube una foto de un amigurumi que quieras tejer y la IA te genera el patrón paso a paso. ¡Es más fácil de lo que parece!</div>
              </div>
            )}
            <div style={{background:"#fff",borderRadius:14,border:`1px solid ${lv.border}`,padding:16}}>
              <div style={{fontSize:13,fontWeight:"bold",color:lv.color,marginBottom:10,paddingBottom:6,borderBottom:`1px solid ${lv.border}`}}>📷 Foto del amigurumi</div>
              <div onDrop={e=>{e.preventDefault();loadFile(e.dataTransfer.files[0]);}} onDragOver={e=>e.preventDefault()} onClick={()=>fileRef.current?.click()} style={{border:`2px dashed ${image?lv.color:lv.border}`,borderRadius:12,padding:18,textAlign:"center",cursor:"pointer",background:image?"transparent":lv.bg,minHeight:image?"auto":110,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
                {image ? <img src={image} alt="ref" style={{maxWidth:"100%",maxHeight:200,borderRadius:8,objectFit:"contain"}}/> : <><div style={{fontSize:36,marginBottom:8,opacity:0.4}}>🖼️</div><div style={{color:lv.color,fontSize:13}}>Toca aquí para subir la foto</div><div style={{color:"#a89bb0",fontSize:11,marginTop:3}}>JPG · PNG · WEBP</div></>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={e=>loadFile(e.target.files[0])} style={{display:"none"}}/>
              {image && <button onClick={()=>fileRef.current?.click()} style={{width:"100%",marginTop:8,padding:"8px",borderRadius:10,border:`1px solid ${lv.border}`,background:lv.bg,color:lv.color,cursor:"pointer",fontSize:12}}>Cambiar foto</button>}
            </div>
            <div style={{background:"#fff",borderRadius:14,border:`1px solid ${lv.border}`,padding:16}}>
              <div style={{fontSize:13,fontWeight:"bold",color:lv.color,marginBottom:10,paddingBottom:6,borderBottom:`1px solid ${lv.border}`}}>📏 Tamaño</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {SIZES.map(s=>(
                  <button key={s.label} onClick={()=>setSize(s)} style={{padding:"10px 12px",borderRadius:10,cursor:"pointer",textAlign:"left",border:size.label===s.label?`2px solid ${lv.color}`:`2px solid ${lv.border}`,background:size.label===s.label?lv.bg:"#fff"}}>
                    <div style={{fontSize:12,fontWeight:size.label===s.label?"bold":"normal",color:"#2d1b3d"}}>{s.label}</div>
                    <div style={{fontSize:10,color:lv.color,marginTop:2}}>Gancho {s.hook}</div>
                  </button>
                ))}
              </div>
            </div>
            {error && <div style={{background:"#fff0f0",border:"1px solid #fca5a5",borderRadius:10,padding:"12px 16px",color:"#b91c1c",fontSize:13}}>⚠️ {error}</div>}
            <button onClick={generate} disabled={!image||loading} style={{padding:"16px",borderRadius:12,border:"none",cursor:!image||loading?"not-allowed":"pointer",background:!image||loading?"#e2e8f0":lv.header,color:!image||loading?"#94a3b8":"#fff",fontSize:15,fontWeight:"bold",boxShadow:!image||loading?"none":"0 4px 18px rgba(0,0,0,0.25)"}}>
              {loading?`⏳ ${loadMsg}`:`✨ ${level==="beginner"?"¡Crear mi patrón!":"Generar Patrón de Amigurumi"}`}
            </button>
          </div>
        )}

        {tab==="pattern" && (
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {!pattern ? (
              <div style={{textAlign:"center",padding:60,color:"#9a8070"}}>
                <div style={{fontSize:48,marginBottom:14,opacity:0.3}}>🪡</div>
                <button onClick={()=>setTab("upload")} style={{padding:"10px 24px",borderRadius:10,border:`1px solid ${lv.border}`,background:lv.bg,color:lv.color,cursor:"pointer",fontSize:13}}>Ir a configurar</button>
              </div>
            ) : (
              <>
                <div style={{background:lv.header,color:"#fff",borderRadius:14,padding:"16px 18px"}}>
                  <div style={{fontSize:20,fontWeight:"bold",marginBottom:4}}>🧸 {pattern.nombre}</div>
                  <div style={{fontSize:12,opacity:0.85,marginBottom:6}}>{pattern.descripcion}</div>
                  {pattern.nivelMensaje && <div style={{fontSize:11,opacity:0.75,fontStyle:"italic",marginBottom:10}}>✨ {pattern.nivelMensaje}</div>}
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {[["📏",size.label],["🔗",`Gancho ${size.hook}`],["🎯",pattern.dificultad],["⏱",pattern.tiempoEstimado]].map(([i,v])=>(
                      <span key={v} style={{background:"rgba(255,255,255,0.2)",borderRadius:6,padding:"2px 9px",fontSize:10}}>{i} {v}</span>
                    ))}
                  </div>
                </div>
                {totalRows>0 && (
                  <div style={{background:"#fff",borderRadius:14,border:`1px solid ${lv.border}`,padding:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <span style={{fontSize:12,fontWeight:"bold",color:lv.color}}>Progreso {level==="beginner"?"🌟":""}</span>
                      <span style={{fontSize:12,color:lv.color}}>{doneRows}/{totalRows} vueltas · {progress}%</span>
                    </div>
                    <div style={{height:10,background:"#e2e8f0",borderRadius:5,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${progress}%`,background:lv.header,borderRadius:5,transition:"width 0.3s"}}/>
                    </div>
                    {level==="beginner"&&progress===100&&<div style={{marginTop:8,textAlign:"center",fontSize:13,color:"#15803d",fontWeight:"bold"}}>🎉 ¡Completaste todas las vueltas!</div>}
                  </div>
                )}
                {pattern.partes.map((parte,pi)=>{
                  const done=parte.vueltas.filter(v=>checked[`${pi}-${v.num}`]).length;
                  return (
                    <div key={pi} style={{background:"#fff",borderRadius:14,border:`1px solid ${lv.border}`,padding:16,borderLeft:`4px solid ${lv.color}`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                        <div>
                          <div style={{fontSize:15,fontWeight:"bold",color:lv.color}}>◆ {parte.nombre}</div>
                          <div style={{fontSize:11,color:"#6b5080",marginTop:2}}>🎨 {parte.color} · Inicio: {parte.puntoInicial}</div>
                        </div>
                        <div style={{fontSize:11,color:lv.color,textAlign:"right"}}>{done}/{parte.vueltas.length}<br/>vueltas</div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:3}}>
                        {parte.vueltas.map(v=>{
                          const k=`${pi}-${v.num}`, isDone=!!checked[k];
                          return (
                            <div key={v.num}>
                              <div onClick={()=>toggle(pi,v.num)} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"7px 10px",borderRadius:8,cursor:"pointer",background:isDone?"#f0fdf4":"#faf5ff",border:isDone?"1px solid #86efac":`1px solid ${lv.border}`,userSelect:"none"}}>
                                <div style={{width:18,height:18,borderRadius:"50%",flexShrink:0,marginTop:1,border:isDone?"none":`2px solid ${lv.color}`,background:isDone?"#22c55e":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff"}}>{isDone?"✓":""}</div>
                                <div style={{flex:1}}>
                                  <span style={{fontWeight:"bold",color:isDone?"#15803d":lv.color,fontSize:12,marginRight:5}}>{level==="beginner"?`Vuelta ${v.num}:`:`V${v.num}:`}</span>
                                  <span style={{fontSize:12,color:isDone?"#166534":"#2d1b3d",textDecoration:isDone?"line-through":"none",opacity:isDone?0.7:1}}>{v.instruccion}</span>
                                </div>
                                <span style={{fontSize:11,color:isDone?"#15803d":lv.color,fontWeight:"bold",flexShrink:0}}>[{v.total}pts]</span>
                              </div>
                              {v.explicacion&&level!=="advanced"&&!isDone&&<div style={{padding:"3px 12px 5px 38px",fontSize:10,color:"#6b5080",fontStyle:"italic"}}>💬 {v.explicacion}</div>}
                            </div>
                          );
                        })}
                      </div>
                      {parte.notas&&<div style={{marginTop:10,padding:"7px 12px",background:"#fffbeb",borderRadius:8,border:"1px solid #fde68a",fontSize:11,color:"#92400e"}}>📌 {parte.notas}</div>}
                    </div>
                  );
                })}
                <div style={{background:"#fff",borderRadius:14,border:`1px solid ${lv.border}`,padding:16}}>
                  <div style={{fontSize:13,fontWeight:"bold",color:lv.color,marginBottom:10,paddingBottom:6,borderBottom:`1px solid ${lv.border}`}}>🔧 {level==="beginner"?"Cómo armar tu amigurumi":"Ensamblaje"}</div>
                  <ol style={{margin:0,padding:"0 0 0 18px"}}>
                    {pattern.ensamblaje.map((s,i)=><li key={i} style={{fontSize:12,color:"#4a1d6e",marginBottom:6,lineHeight:1.6}}>{s}</li>)}
                  </ol>
                </div>
                {pattern.consejosFinales?.length>0&&(
                  <div style={{background:lv.bg,border:`1px solid ${lv.border}`,borderRadius:14,padding:16}}>
                    <div style={{fontSize:13,fontWeight:"bold",color:lv.color,marginBottom:10,paddingBottom:6,borderBottom:`1px solid ${lv.border}`}}>{level==="beginner"?"💪 ¡Tú puedes! Consejos":"💡 Consejos finales"}</div>
                    <ul style={{margin:0,padding:"0 0 0 16px"}}>
                      {pattern.consejosFinales.map((c,i)=><li key={i} style={{fontSize:12,color:"#4a1d6e",marginBottom:5,lineHeight:1.6}}>{c}</li>)}
                    </ul>
                  </div>
                )}
                <div style={{background:"#1e1030",border:"1px solid #4a2080",borderRadius:14,padding:16}}>
                  <div style={{fontSize:13,fontWeight:"bold",color:"#e9d5ff",marginBottom:10}}>⬇️ Guardar patrón</div>
                  <button onClick={()=>setPrintView(true)} style={{width:"100%",padding:"12px",borderRadius:10,border:"none",background:lv.header,color:"#fff",fontWeight:"bold",fontSize:13,cursor:"pointer",marginBottom:8}}>📄 Ver patrón completo para imprimir</button>
                  <button onClick={copyText} style={{width:"100%",padding:"10px",borderRadius:10,border:"1px solid #4a2080",background:"rgba(107,47,160,0.2)",color:"#e9d5ff",fontSize:13,cursor:"pointer"}}>📋 Copiar texto plano</button>
                </div>
                <button onClick={()=>{setPattern(null);setTab("upload");}} style={{padding:"10px",borderRadius:10,border:`1px solid ${lv.border}`,background:lv.bg,color:lv.color,cursor:"pointer",fontSize:13}}>🔄 Generar nuevo patrón</button>
                <div style={{height:16}}/>
              </>
            )}
          </div>
        )}
      </div>
      <style>{`*{box-sizing:border-box;}`}</style>
    </div>
  );
}
