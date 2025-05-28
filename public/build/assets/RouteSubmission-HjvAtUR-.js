const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/leaflet-src-DGpue5TR.js","assets/app-D_BfqPvX.js","assets/app-DtZTGWf_.css"])))=>i.map(i=>d[i]);
import{r as l,_ as ue,j as e,$ as me,Y as he,c as N}from"./app-D_BfqPvX.js";N.defaults.baseURL="https://oliviaaja-cxfuggcqe4f4fuac.canadacentral-01.azurewebsites.net/";N.defaults.withCredentials=!0;function pe({driver:L,freights:O,routes:re,users:E}){const[ge,I]=l.useState(null),[m,S]=l.useState(null),[h,T]=l.useState(null),[r,M]=l.useState(null),[X,Y]=l.useState(!1),[z,G]=l.useState(null),[A,W]=l.useState(null),[B,Z]=l.useState(null),[Q,x]=l.useState(null),[o,F]=l.useState(null),[H,J]=l.useState(!0),[U,ee]=l.useState(!1),[K,D]=l.useState(!1),[R,q]=l.useState(null),[j,$]=l.useState({weight:"",customer_id:""}),_=l.useRef(null),C=l.useRef(0),f=l.useRef(null),[b,P]=l.useState({name:"",freight_id:"",pricing:""});l.useEffect(()=>{const t=document.createElement("link");t.rel="stylesheet",t.href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css",document.head.appendChild(t);const s=document.createElement("link");s.rel="stylesheet",s.href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css",document.head.appendChild(s);const a=document.createElement("style");return a.textContent=`
            .custom-marker {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                color: white;
                font-size: 18px;
            }
            .start-marker {
                background-color: #4CAF50;
                box-shadow: 0 0 10px rgba(0,0,0,0.3);
            }
            .end-marker {
                background-color: #F44336;
                box-shadow: 0 0 10px rgba(0,0,0,0.3);
            }
            .leaflet-popup-content-wrapper {
                border-radius: 8px;
                box-shadow: 0 3px 14px rgba(0,0,0,0.2);
            }
            .leaflet-popup-content {
                margin: 12px;
            }
            .right-sidebar {
                transition: transform 0.3s ease;
            }
            .right-sidebar-open {
                transform: translateX(0);
            }
            .right-sidebar-closed {
                transform: translateX(100%);
            }
            .left-sidebar {
                transition: transform 0.3s ease;
            }
            .left-sidebar-open {
                transform: translateX(0);
            }
            .left-sidebar-closed {
                transform: translateX(-100%);
            }
            .locate-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: white;
                box-shadow: 0 0 10px rgba(0,0,0,0.3);
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .locate-btn:hover {
                background-color: #f0f0f0;
            }
            .locate-btn-active {
                background-color: #2196F3;
                color: white;
            }
            .pulsing-circle {
                border-radius: 50%;
                height: 70px;
                width: 70px;
                position: absolute;
                left: -15px;
                top: -15px;
                z-index: -1;
                background: rgba(33, 150, 243, 0.3);
                opacity: 0;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0% { transform: scale(0.5); opacity: 0; }
                50% { opacity: 0.4; }
                100% { transform: scale(1.2); opacity: 0; }
            }
            .input-field {
                width: 100%;
                padding: 8px;
                border: 1px solid #d1d5db;
                border-radius: 4px;
                margin-top: 4px;
            }
            .error-text {
                color: #dc2626;
                font-size: 0.75rem;
                margin-top: 2px;
            }
            .menu-item {
                display: flex;
                align-items: center;
                padding: 10px;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.2s ease;
            }
            .menu-item:hover {
                background-color: #f0f0f0;
            }
            .menu-item i {
                margin-right: 8px;
            }
        `,document.head.appendChild(a),()=>{document.head.removeChild(t),document.head.removeChild(s),document.head.removeChild(a)}},[]),l.useEffect(()=>(typeof window<"u"&&ue(()=>import("./leaflet-src-DGpue5TR.js").then(t=>t.l),__vite__mapDeps([0,1,2])).then(t=>{if(_.current=t.default,!f.current){const s=t.default.map("map",{zoomControl:!1}).setView([-6.2,106.816666],13);t.default.control.zoom({position:"bottomright"}).addTo(s),t.default.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}).addTo(s);const a=t.default.divIcon({html:'<div class="custom-marker start-marker"><i class="fas fa-play-circle"></i></div>',className:"",iconSize:[40,40],iconAnchor:[20,20]}),n=t.default.divIcon({html:'<div class="custom-marker end-marker"><i class="fas fa-flag-checkered"></i></div>',className:"",iconSize:[40,40],iconAnchor:[20,20]}),c=i=>{const{lat:u,lng:k}=i.latlng,w=_.current;if(C.current===0){const g=w.marker([u,k],{title:"Titik Awal",draggable:!0,icon:a}).addTo(s);g.bindPopup("Titik Pengambilan",{maxWidth:300}),g.on("dragend",v=>{const p=v.target.getLatLng();S(y=>({...y,lat:p.lat,lng:p.lng}))}),S({lat:u,lng:k,marker:g}),C.current=1}else if(C.current===1){const g=w.marker([u,k],{title:"Titik Akhir",draggable:!0,icon:n}).addTo(s);g.bindPopup("Titik Pengantaran",{maxWidth:300}),g.on("dragend",v=>{const p=v.target.getLatLng();T(y=>({...y,lat:p.lat,lng:p.lng}))}),T({lat:u,lng:k,marker:g}),C.current=2}else{V();const g=w.marker([u,k],{title:"Titik Awal",draggable:!0,icon:a}).addTo(s);g.bindPopup("Titik Pengambilan",{maxWidth:300}),g.on("dragend",v=>{const p=v.target.getLatLng();S(y=>({...y,lat:p.lat,lng:p.lng}))}),S({lat:u,lng:k,marker:g}),C.current=1}},d=t.default.Control.extend({options:{position:"bottomright"},onAdd:function(){const i=t.default.DomUtil.create("div","locate-control"),u=t.default.DomUtil.create("div","locate-btn",i);return u.innerHTML='<i class="fas fa-location-crosshairs"></i>',t.default.DomEvent.on(u,"click",()=>te(s,t.default)),i}});new d().addTo(s),s.on("click",c),f.current=s,I(s),setTimeout(()=>s.invalidateSize(),100)}}),()=>{f.current&&(f.current.remove(),f.current=null,I(null))}),[]);const te=(t,s)=>{if(!t||!s)return;D(!0);const a=document.querySelector(".locate-btn");if(a){a.classList.add("locate-btn-active");const n=document.createElement("div");n.className="pulsing-circle",a.appendChild(n)}"geolocation"in navigator?navigator.geolocation.getCurrentPosition(n=>{const{latitude:c,longitude:d}=n.coords;t.setView([c,d],16),D(!1),a&&(a.classList.remove("locate-btn-active"),a.removeChild(a.querySelector(".pulsing-circle")))},n=>{x("Gagal mendapatkan lokasi: "+n.message),D(!1),a&&(a.classList.remove("locate-btn-active"),a.removeChild(a.querySelector(".pulsing-circle")))},{enableHighAccuracy:!0,timeout:1e4}):(x("Geolocation tidak didukung oleh browser."),D(!1),a&&(a.classList.remove("locate-btn-active"),a.removeChild(a.querySelector(".pulsing-circle"))))};l.useEffect(()=>{m&&h&&_.current&&f.current&&ne({lat:m.lat,lng:m.lng},{lat:h.lat,lng:h.lng},f.current,_.current)},[m,h]);const ne=async(t,s,a,n)=>{if(!(!a||!n))try{Y(!0),x(null);const c=await fetch(`https://router.project-osrm.org/route/v1/driving/${t.lng},${t.lat};${s.lng},${s.lat}?overview=full&geometries=geojson`);if(!c.ok)throw new Error("Gagal mengambil rute");const d=await c.json();if(d.code!=="Ok"||!d.routes||d.routes.length===0)throw new Error("Rute tidak ditemukan");const i=d.routes[0],u=i.geometry;r&&(r.main&&a.hasLayer(r.main)&&a.removeLayer(r.main),r.animated&&a.hasLayer(r.animated)&&a.removeLayer(r.animated));const k=n.geoJSON(u,{style:{color:"#3366FF",weight:6,opacity:.7}}).addTo(a),w=u.coordinates.map(y=>[y[1],y[0]]),g=n.polyline(w,{color:"#1e40af",weight:3,opacity:.9,dashArray:"10, 15"}).addTo(a);let v=0;const p=()=>{v-=1,g.setStyle({dashOffset:v}),a&&requestAnimationFrame(p)};p(),M({main:k,animated:g}),G((i.distance/1e3).toFixed(2)),W(Math.round(i.duration/60)),Z(u),a.fitBounds(k.getBounds(),{padding:[50,50]})}catch(c){x(c.message)}finally{Y(!1)}},V=()=>{f.current&&(m!=null&&m.marker&&f.current.removeLayer(m.marker),h!=null&&h.marker&&f.current.removeLayer(h.marker),r!=null&&r.main&&f.current.removeLayer(r.main),r!=null&&r.animated&&f.current.removeLayer(r.animated),S(null),T(null),M(null),G(null),W(null),Z(null),x(null),F(null),P({name:"",freight_id:"",pricing:""}),q(null),$({weight:"",customer_id:""}),C.current=0,f.current.setView([-6.2,106.816666],13))},le=async t=>{var a,n,c,d;if(t.preventDefault(),F(null),!z||!A||!B){x("Rute belum lengkap. Pilih titik awal dan akhir.");return}if(!b.name||!b.freight_id||!b.pricing){x("Semua kolom formulir harus diisi.");return}if(!L.vehicle||!L.vehicle[0]){x("Tidak ada kendaraan yang tersedia untuk pengemudi.");return}const s={driver_id:L.id,vehicle_id:L.vehicle[0].id,freight_id:b.freight_id,name:b.name,pricing:b.pricing,distance:z,duration:A,geometry:B,start_point:{lat:m.lat,lng:m.lng},end_point:{lat:h.lat,lng:h.lng}};try{N.defaults.headers.common["X-Requested-With"]="XMLHttpRequest";const i=(a=document.querySelector('meta[name="csrf-token"]'))==null?void 0:a.getAttribute("content");i&&(N.defaults.headers.common["X-CSRF-TOKEN"]=i);const u=await N.post("/routes",s);alert(u.data.message),V()}catch(i){((n=i.response)==null?void 0:n.status)===422?F(i.response.data.errors):(console.error((c=i.response)==null?void 0:c.data),x("Gagal menyimpan rute: "+((d=i.response)==null?void 0:d.data)))}},oe=async t=>{var a,n,c,d;if(t.preventDefault(),F(null),!j.weight||!j.customer_id){x("Semua kolom formulir muatan harus diisi.");return}const s={route_id:R.id,weight:parseFloat(j.weight),user_id:j.customer_id};try{N.defaults.headers.common["X-Requested-With"]="XMLHttpRequest";const i=(a=document.querySelector('meta[name="csrf-token"]'))==null?void 0:a.getAttribute("content");i&&(N.defaults.headers.common["X-CSRF-TOKEN"]=i);const u=await N.post("/loads",s);alert(u.data.message),$({weight:"",customer_id:""}),q(null)}catch(i){((n=i.response)==null?void 0:n.status)===422?F(i.response.data.errors):(console.error((c=i.response)==null?void 0:c.data),x("Gagal menyimpan muatan: "+((d=i.response)==null?void 0:d.data)))}},ce=t=>{if(console.log("Route clicked:",t),q(t),J(!0),!f.current||!_.current)return;const s=_.current,a=f.current;m!=null&&m.marker&&a.removeLayer(m.marker),h!=null&&h.marker&&a.removeLayer(h.marker),r!=null&&r.main&&a.removeLayer(r.main),r!=null&&r.animated&&a.removeLayer(r.animated),S(null),T(null),M(null);const n=JSON.parse(t.geometry);if(n.type!=="LineString"||!n.coordinates){x("Geometri rute tidak valid.");return}const c=n.coordinates,d=c[0],i=c[c.length-1],u=s.divIcon({html:'<div class="custom-marker start-marker"><i class="fas fa-play-circle"></i></div>',className:"",iconSize:[40,40],iconAnchor:[20,20]}),k=s.divIcon({html:'<div class="custom-marker end-marker"><i class="fas fa-flag-checkered"></i></div>',className:"",iconSize:[40,40],iconAnchor:[20,20]}),w=s.marker([d[1],d[0]],{title:"Titik Awal",icon:u}).addTo(a);w.bindPopup(`Titik Pengambilan: ${t.name}`,{maxWidth:300});const g=s.marker([i[1],i[0]],{title:"Titik Akhir",icon:k}).addTo(a);g.bindPopup(`Titik Pengantaran: ${t.name}`,{maxWidth:300}),S({lat:d[1],lng:d[0],marker:w}),T({lat:i[1],lng:i[0],marker:g});const v=s.geoJSON(n,{style:{color:"#3366FF",weight:6,opacity:.7}}).addTo(a),p=c.map(ie=>[ie[1],ie[0]]),y=s.polyline(p,{color:"#1e40af",weight:3,opacity:.9,dashArray:"10, 15"}).addTo(a);let ae=0;const se=()=>{ae-=1,y.setStyle({dashOffset:ae}),a&&requestAnimationFrame(se)};se(),M({main:v,animated:y}),G(parseFloat(t.distance).toFixed(2)),W(Math.round(parseFloat(t.duration))),a.fitBounds(v.getBounds(),{padding:[50,50]})},de=t=>{if(!t)return"";const s=Math.floor(t/60),a=t%60;return s>0?`${s} jam ${a} menit`:`${a} menit`};return e.jsxs(e.Fragment,{children:[e.jsx(me,{title:"Driver Route Submission"}),e.jsxs("div",{className:"relative w-screen h-screen overflow-hidden bg-gray-100",children:[e.jsx("div",{id:"map",className:"absolute inset-0 z-0"}),e.jsxs("div",{className:"absolute top-0 left-0 right-0 bg-blue-600 text-white z-10 p-3 shadow-md flex justify-between items-center",children:[e.jsxs("div",{className:"flex items-center",children:[e.jsx("i",{className:"fas fa-truck-moving text-white text-xl mr-2"}),e.jsx("h1",{className:"font-bold text-lg",children:"Driver Dashboard"})]}),e.jsxs("div",{className:"flex items-center",children:[e.jsxs("button",{onClick:()=>te(f.current,_.current),className:"bg-white text-blue-600 px-4 py-2 rounded-lg shadow mr-2",disabled:K,children:[e.jsx("i",{className:`fas fa-location-crosshairs mr-2 ${K?"animate-pulse":""}`}),K?"Mencari...":"Lokasi Saya"]}),e.jsxs("button",{onClick:V,className:"bg-white text-blue-600 px-4 py-2 rounded-lg shadow",children:[e.jsx("i",{className:"fas fa-redo-alt mr-2"}),"Reset Peta"]}),e.jsxs(he,{href:"/logout",method:"post",className:"bg-white text-blue-600 hover:bg-blue-50 font-medium px-4 py-2 rounded-lg shadow flex items-center transition ml-2",children:[e.jsx("i",{className:"fas fa-sign-out-alt mr-2"}),"Logout"]})]})]}),e.jsxs("div",{className:`absolute top-16 left-0 bottom-0 z-10 bg-white/95 w-64 p-5 shadow-xl border-r border-gray-200 left-sidebar ${U?"left-sidebar-open":"left-sidebar-closed"}`,children:[e.jsx("h3",{className:"font-bold text-lg text-gray-800 mb-4",children:"Menu"}),e.jsx("div",{className:"space-y-2",children:re.map(t=>e.jsxs("div",{className:"menu-item text-gray-700",onClick:()=>ce(t),children:[e.jsx("i",{className:"fa fa-truck"}),t.name]},t.id))})]}),!U&&e.jsx("button",{onClick:()=>ee(!0),className:"absolute top-20 left-4 z-20 bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center",children:e.jsx("i",{className:"fas fa-arrow-right"})}),U&&e.jsx("button",{onClick:()=>ee(!1),className:"absolute top-20 left-4 z-20 bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center",children:e.jsx("i",{className:"fas fa-arrow-left"})}),e.jsx("div",{className:`absolute top-16 right-0 bottom-0 z-10 bg-white/95 w-96 p-5 shadow-xl border-l border-gray-200 right-sidebar ${H?"right-sidebar-open":"right-sidebar-closed"}`,children:R?e.jsxs(e.Fragment,{children:[e.jsxs("h3",{className:"font-bold text-lg text-gray-800 mb-4",children:["Tambah Muatan untuk ",R.name]}),e.jsxs("div",{className:"bg-blue-50 p-3 rounded-lg mb-4",children:[e.jsx("div",{className:"font-semibold mb-2",children:"Status Muatan"}),e.jsxs("div",{className:"flex justify-between mb-2",children:[e.jsx("span",{children:"Jumlah Muatan Saat Ini"}),e.jsxs("span",{children:[R.weight_now_sum_contributed_weight_kg," kg"]})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"Kapasitas Tersedia"}),e.jsxs("span",{children:[R.max_weight," kg"]})]})]}),e.jsxs("form",{onSubmit:oe,className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Jumlah Muatan (kg)"}),e.jsx("input",{type:"number",value:j.weight,onChange:t=>$({...j,weight:t.target.value}),className:"input-field",required:!0,min:"0",step:"0.1"}),(o==null?void 0:o.weight_kg)&&e.jsx("div",{className:"error-text",children:o.weight_kg[0]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Nama Customer"}),e.jsxs("select",{value:j.customer_id,onChange:t=>$({...j,customer_id:t.target.value}),className:"input-field",required:!0,children:[e.jsx("option",{value:"",children:"Pilih Customer"}),E==null?void 0:E.map(t=>e.jsx("option",{value:t.id,children:t.name},t.id))]}),(o==null?void 0:o.customer_id)&&e.jsx("div",{className:"error-text",children:o.customer_id[0]})]}),e.jsx("button",{type:"submit",className:"w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400",disabled:X,children:"Tambah Muatan"}),e.jsx("button",{type:"button",onClick:()=>q(null),className:"w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 mt-2",children:"Kembali ke Form Rute"})]})]}):e.jsxs(e.Fragment,{children:[e.jsx("h3",{className:"font-bold text-lg text-gray-800 mb-4",children:"Submit Rute"}),e.jsxs("form",{onSubmit:le,className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Nama Rute"}),e.jsx("input",{type:"text",value:b.name,onChange:t=>P({...b,name:t.target.value}),className:"input-field",required:!0}),(o==null?void 0:o.name)&&e.jsx("div",{className:"error-text",children:o.name[0]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Kapasitas"}),e.jsxs("select",{value:b.freight_id,onChange:t=>P({...b,freight_id:t.target.value}),className:"input-field",required:!0,children:[e.jsx("option",{value:"",children:"Pilih Freight"}),O==null?void 0:O.map(t=>e.jsxs("option",{value:t.id,children:[t.max_weight_kg," kg"]},t.id))]}),(o==null?void 0:o.freight_id)&&e.jsx("div",{className:"error-text",children:o.freight_id[0]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Harga"}),e.jsx("input",{type:"text",value:b.pricing,onChange:t=>P({...b,pricing:t.target.value}),className:"input-field",required:!0}),(o==null?void 0:o.pricing)&&e.jsx("div",{className:"error-text",children:o.pricing[0]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Titik Pengambilan"}),e.jsx("div",{className:"text-sm",children:m?`${m.lat.toFixed(5)}, ${m.lng.toFixed(5)}`:"Belum dipilih"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Titik Pengantaran"}),e.jsx("div",{className:"text-sm",children:h?`${h.lat.toFixed(5)}, ${h.lng.toFixed(5)}`:"Belum dipilih"})]}),z&&A&&e.jsxs("div",{className:"bg-blue-50 p-3 rounded-lg",children:[e.jsx("div",{className:"font-semibold mb-2",children:"Hasil Rute"}),e.jsxs("div",{className:"flex justify-between mb-2",children:[e.jsx("span",{children:"Jarak"}),e.jsxs("span",{children:[z," km"]})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"Waktu Tempuh"}),e.jsx("span",{children:de(A)})]})]}),X&&e.jsxs("div",{className:"bg-blue-50 p-3 rounded-lg flex items-center",children:[e.jsx("i",{className:"fas fa-circle-notch animate-spin mr-2"}),"Menghitung rute..."]}),Q&&e.jsxs("div",{className:"bg-red-50 p-3 rounded-lg text-red-600",children:[e.jsx("i",{className:"fas fa-exclamation-circle mr-2"}),Q]}),e.jsx("button",{type:"submit",className:"w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400",disabled:X||!m||!h||!B,children:"Simpan Rute"})]})]})}),!H&&e.jsx("button",{onClick:()=>J(!0),className:"absolute top-20 right-4 z-20 bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center",children:e.jsx("i",{className:"fas fa-arrow-left"})}),H&&e.jsx("button",{onClick:()=>J(!1),className:"absolute top-20 right-4 z-20 bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center",children:e.jsx("i",{className:"fas fa-arrow-right"})})]})]})}export{pe as default};
