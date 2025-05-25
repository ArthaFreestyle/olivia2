const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/leaflet-src-B13EGD2h.js","assets/app-BRVKEMDs.js","assets/app-BG0z73Tt.css"])))=>i.map(i=>d[i]);
import{r as o,_ as U,j as e,$ as B,Y as H}from"./app-BRVKEMDs.js";function q({logistik:u}){const[a,_]=o.useState(null),[j,M]=o.useState([]),[O,P]=o.useState(!1),[L,g]=o.useState(null),[r,w]=o.useState(null),[S,p]=o.useState(!1),[k,y]=o.useState(!1),d=o.useRef(null);o.useEffect(()=>{const i=document.createElement("link");i.rel="stylesheet",i.href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css",document.head.appendChild(i);const s=document.createElement("link");return s.rel="stylesheet",s.href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css",document.head.appendChild(s),()=>{document.head.removeChild(i),document.head.removeChild(s)}},[]),o.useEffect(()=>(typeof window<"u"&&U(()=>import("./leaflet-src-B13EGD2h.js").then(i=>i.l),__vite__mapDeps([0,1,2])).then(i=>{if(d.current=i.default,!a){const s=i.default.map("map",{zoomControl:!1}).setView([-6.2,106.816666],13);i.default.control.zoom({position:"bottomright"}).addTo(s),i.default.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}).addTo(s);const t=document.createElement("style");t.textContent=`
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
                            margin: 12px 12px;
                        }
                        .driver-info-card {
                            padding: 5px;
                        }
                        .driver-info-card h3 {
                            color: #333;
                            margin-bottom: 8px;
                            font-weight: 600;
                        }
                        .driver-info-item {
                            display: flex;
                            margin-bottom: 5px;
                            align-items: center;
                        }
                        .driver-info-icon {
                            margin-right: 8px;
                            color: #555;
                            width: 20px;
                        }
                        .sidebar {
                            transition: transform 0.3s ease;
                        }
                        .sidebar-open {
                            transform: translateX(0);
                        }
                        .sidebar-closed {
                            transform: translateX(100%);
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
                            margin-bottom: 10px;
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
                        .progress-bar {
                            background-color: #e5e7eb;
                            border-radius: 9999px;
                            overflow: hidden;
                            height: 10px;
                            margin-top: 8px;
                        }
                        .progress-bar-fill {
                            background-color: #10b981;
                            height: 100%;
                            transition: width 0.3s ease;
                        }
                    `,document.head.appendChild(t);const n=i.default.Control.extend({options:{position:"bottomright"},onAdd:function(){const l=i.default.DomUtil.create("div","locate-control"),m=i.default.DomUtil.create("div","locate-btn",l);return m.innerHTML='<i class="fas fa-location-crosshairs"></i>',i.default.DomEvent.on(m,"click",()=>$(s,i.default)),l}});new n().addTo(s),_(s),setTimeout(()=>s.invalidateSize(),100)}}),()=>{a&&a.remove()}),[]),o.useEffect(()=>{if(a&&d.current&&(u!=null&&u.routes)){P(!0),g(null);try{if(!u.routes||u.routes.length===0)throw new Error("Tidak ada rute yang ditemukan");console.log("Logistik Data:",u);const i=u.routes.map(s=>{const n=s.weight_filled||0,l=(n/20*100).toFixed(2),m=5e5,b=1-l/100*.3,c=(m*b).toFixed(0),h=(c*n).toFixed(0),f=s.geometry,x=d.current.geoJSON(f,{style:{color:"#3366FF",weight:6,opacity:.7,lineCap:"round",lineJoin:"round"}}).addTo(a),C=f.coordinates.map(R=>[R[1],R[0]]),v=d.current.polyline(C,{color:"#1e40af",weight:3,opacity:.9,dashArray:"10, 15",lineCap:"round",lineJoin:"round"}).addTo(a);let A=0;const E=()=>{A-=1,v.setStyle({dashOffset:A}),requestAnimationFrame(E)};E();const N=d.current.marker([s.points[0].latitude_start,s.points[0].longitude_start],{title:`Titik Awal: ${s.name}`,icon:d.current.divIcon({html:'<div class="custom-marker start-marker"><i class="fas fa-regular fa-truck"></i></div>',className:"",iconSize:[40,40],iconAnchor:[20,20]})}).addTo(a),T=d.current.marker([s.points[0].latitude_end,s.points[0].longitude_end],{title:`Titik Akhir: ${s.name}`,icon:d.current.divIcon({html:'<div class="custom-marker end-marker"><i class="fas fa-flag-checkered"></i></div>',className:"",iconSize:[40,40],iconAnchor:[20,20]})}).addTo(a),z=K(N.options.title,s.driver||"Unknown Driver","Truk Kontainer",20,n,"PT Logistik Cepat","B 1234 KLM",l,c,h,s.distance,s.duration);return N.bindPopup(z,{maxWidth:300,className:"custom-popup"}),T.bindPopup(z,{maxWidth:300,className:"custom-popup"}),N.on("click",()=>{w({type:"start",lat:s.points[0].latitude_start,lng:s.points[0].longitude_start,title:`Titik Awal: ${s.name}`,info:{driver:s.driver||"Unknown Driver",vehicle:"Truk Kontainer",freightCapacity:20,freightFilled:n,company:"PT Logistik Cepat",licensePlate:"B 1234 KLM",freightPercentage:l,pricePerTon:c,totalPrice:h,distance:(s.distance/1e3).toFixed(2),duration:Math.round(s.duration/60)}}),p(!0)}),T.on("click",()=>{w({type:"end",lat:s.points[0].latitude_end,lng:s.points[0].longitude_end,title:`Titik Akhir: ${s.name}`,info:{driver:s.driver||"Unknown Driver",vehicle:"Truk Kontainer",freightCapacity:20,freightFilled:n,company:"PT Logistik Cepat",licensePlate:"B 1234 KLM",freightPercentage:l,pricePerTon:c,totalPrice:h,distance:(s.distance/1e3).toFixed(2),duration:Math.round(s.duration/60)}}),p(!0)}),{main:x,animated:v,startMarker:N,endMarker:T}});M(i),a.fitBounds(d.current.featureGroup(i.map(s=>s.main)).getBounds(),{padding:[50,50]})}catch(i){g(i.message||"Gagal memproses rute")}finally{P(!1)}}},[a,u]);const $=(i,s)=>{if(!i||!s)return;y(!0);const t=document.querySelector(".locate-btn");if(t){t.classList.add("locate-btn-active");const n=document.createElement("div");n.className="pulsing-circle",t.appendChild(n)}if("geolocation"in navigator)navigator.geolocation.getCurrentPosition(n=>{const{latitude:l,longitude:m}=n.coords,b=s.divIcon({html:'<div class="custom-marker" style="background-color: #2196F3;"><i class="fas fa-user"></i></div>',className:"",iconSize:[40,40],iconAnchor:[20,20]}),c=s.circle([l,m],{radius:n.coords.accuracy,color:"#2196F3",fillColor:"#2196F3",fillOpacity:.15,weight:2}).addTo(i);if(s.marker([l,m],{icon:b}).addTo(i).bindPopup('<div class="font-semibold">Lokasi Anda</div>',{className:"custom-popup"}),i.setView([l,m],16),y(!1),t){t.classList.remove("locate-btn-active");const f=t.querySelector(".pulsing-circle");f&&t.removeChild(f)}setTimeout(()=>{if(i.hasLayer(c)){const f=setInterval(()=>{const x=c.options.fillOpacity;x<=.02?(clearInterval(f),i.removeLayer(c)):c.setStyle({fillOpacity:x-.02,opacity:x-.02})},100)}},5e3)},n=>{if(console.error("Error getting location:",n),g("Gagal mendapatkan lokasi Anda. Periksa izin lokasi browser Anda."),y(!1),t){t.classList.remove("locate-btn-active");const l=t.querySelector(".pulsing-circle");l&&t.removeChild(l)}},{enableHighAccuracy:!0,timeout:1e4,maximumAge:0});else if(g("Browser Anda tidak mendukung geolocation"),y(!1),t){t.classList.remove("locate-btn-active");const n=t.querySelector(".pulsing-circle");n&&t.removeChild(n)}},K=(i,s,t,n,l,m,b,c,h,f,x,C)=>{const v=document.createElement("div");return v.className="driver-info-card",v.innerHTML=`
            <h3>${i}</h3>
            <div class="driver-info-item">
                <div class="driver-info-icon"><i class="fas fa-user"></i></div>
                <div>Driver: <strong>${s}</strong></div>
            </div>
            <div class="driver-info-item">
                <div class="driver-info-icon"><i class="fas fa-truck"></i></div>
                <div>Kendaraan: <strong>${t}</strong></div>
            </div>
            <div class="driver-info-item">
                <div class="driver-info-icon"><i class="fas fa-weight-hanging"></i></div>
                <div>Kapasitas: <strong>${n} ton</strong></div>
            </div>
            <div class="driver-info-item">
                <div class="driver-info-icon"><i class="fas fa-boxes"></i></div>
                <div>Muatan Terisi: <strong>${l} ton (${c}%)</strong></div>
            </div>
            <div class="progress-bar">
                <div class="progress-bar-fill" style="width: ${c}%"></div>
            </div>
            <div class="driver-info-item">
                <div class="driver-info-icon"><i class=" aliases="fas fa-money-bill"></i></div>
                <div>Harga per Ton: <strong>Rp ${Number(h).toLocaleString("id-ID")}</strong></div>
            </div>
            <div class="driver-info-item">
                <div class="driver-info-icon"><i class="fas fa-wallet"></i></div>
                <div>Total Harga: <strong>Rp ${Number(f).toLocaleString("id-ID")}</strong></div>
            </div>
            <div class="driver-info-item">
                <div class="driver-info-icon"><i class="fas fa-building"></i></div>
                <div>Perusahaan: <strong>${m}</strong></div>
            </div>
            <div class="driver-info-item">
                <div class="driver-info-icon"><i class="fas fa-id-card"></i></div>
                <div>Plat: <strong>${b}</strong></div>
            </div>
            <div class="driver-info-item">
                <div class="driver-info-icon"><i class="fas fa-road"></i></div>
                <div>Jarak: <strong>${(x/1e3).toFixed(2)} km</strong></div>
            </div>
            <div class="driver-info-item">
                <div class="driver-info-icon"><i class="fas fa-clock"></i></div>
                <div>Waktu Tempuh: <strong>${F(Math.round(C/60))}</strong></div>
            </div>
        `,v},F=i=>{if(!i)return"";const s=Math.floor(i/60),t=i%60;return s>0?`${s} jam ${t} menit`:`${t} menit`},I=()=>{a&&(j.forEach(i=>{i.main&&a.hasLayer(i.main)&&a.removeLayer(i.main),i.animated&&a.hasLayer(i.animated)&&a.removeLayer(i.animated),i.startMarker&&a.hasLayer(i.startMarker)&&a.removeLayer(i.startMarker),i.endMarker&&a.hasLayer(i.endMarker)&&a.removeLayer(i.endMarker)}),M([]),w(null),p(!1),g(null),a.setView([-6.2,106.816666],13),setTimeout(()=>a.invalidateSize(),100))};return e.jsxs(e.Fragment,{children:[e.jsx(B,{title:"OSRM Fullscreen Map"}),e.jsxs("div",{className:"relative w-screen h-screen overflow-hidden bg-gray-100",children:[e.jsx("div",{id:"map",className:"absolute inset-0 z-0"}),e.jsxs("div",{className:"absolute top-0 left-0 right-0 bg-blue-600 text-white z-10 p-3 shadow-md flex justify-between items-center",children:[e.jsxs("div",{className:"flex items-center",children:[e.jsx("i",{className:"fas fa-truck-moving text-white text-xl mr-2"}),e.jsx("h1",{className:"font-bold text-lg",children:"PanganMerata"})]}),e.jsxs("div",{className:"flex items-center",children:[e.jsxs("button",{onClick:()=>$(a,d.current),className:"bg-white text-blue-600 hover:bg-blue-50 font-medium px-4 py-2 rounded-lg shadow flex items-center transition mr-2",disabled:k,children:[e.jsx("i",{className:`fas fa-location-crosshairs mr-2 ${k?"animate-pulse":""}`}),k?"Mencari...":"Lokasi Saya"]}),e.jsxs("button",{onClick:I,className:"bg-white text-blue-600 hover:bg-blue-50 font-medium px-4 py-2 rounded-lg shadow flex items-center transition",children:[e.jsx("i",{className:"fas fa-redo-alt mr-2"}),"Reset Peta"]}),e.jsxs(H,{href:"/logout",method:"post",className:"bg-white text-blue-600 hover:bg-blue-50 font-medium px-4 py-2 rounded-lg shadow flex items-center transition ml-2",children:[e.jsx("i",{className:"fas fa-sign-out-alt mr-2"}),"Logout"]})]})]}),e.jsxs("div",{className:"absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur p-5 rounded-lg shadow-xl w-80 border border-gray-200",children:[e.jsxs("div",{className:"flex items-center mb-3",children:[e.jsx("i",{className:"fas fa-info-circle text-blue-600 text-lg mr-2"}),e.jsx("h3",{className:"font-bold text-lg text-gray-800",children:"Informasi Rute"})]}),e.jsxs("div",{className:"space-y-3 text-gray-700",children:[e.jsxs("div",{className:"text-sm",children:["Jumlah Rute: ",e.jsx("strong",{children:j.length})]}),O?e.jsxs("div",{className:"mt-4 bg-blue-50 p-3 rounded-lg flex items-center justify-center",children:[e.jsx("div",{className:"animate-spin mr-2",children:e.jsx("i",{className:"fas fa-circle-notch text-blue-600"})}),e.jsx("div",{className:"text-blue-600",children:"Memproses rute..."})]}):L?e.jsxs("div",{className:"mt-4 bg-red-50 p-3 rounded-lg",children:[e.jsxs("div",{className:"flex items-center text-red-600 mb-1",children:[e.jsx("i",{className:"fas fa-exclamation-circle mr-2"}),e.jsx("div",{className:"font-semibold",children:"Error"})]}),e.jsx("div",{className:"text-sm text-red-600",children:L})]}):j.length>0?e.jsxs("div",{className:"mt-4 bg-blue-50 p-3 rounded-lg",children:[e.jsx("div",{className:"font-semibold text-gray-700 mb-2",children:"Daftar Rute"}),j.map((i,s)=>e.jsx("div",{className:"flex items-center justify-between mb-2",children:e.jsxs("div",{className:"flex items-center text-sm",children:[e.jsx("i",{className:"fas fa-route text-gray-500 mr-2"}),e.jsxs("span",{children:["Rute ",s+1]})]})},s))]}):e.jsx("div",{className:"mt-4 bg-gray-50 p-3 rounded-lg text-center text-gray-500 text-sm",children:"Tidak ada rute yang tersedia"})]})]}),e.jsx("div",{className:`absolute top-16 right-0 bottom-0 z-10 bg-white/95 backdrop-blur w-80 p-5 shadow-xl border-l border-gray-200 sidebar ${S?"sidebar-open":"sidebar-closed"}`,children:r&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex justify-between items-center mb-4",children:[e.jsx("h3",{className:"font-bold text-lg text-gray-800",children:r.title}),e.jsx("button",{className:"text-gray-500 hover:text-gray-700",onClick:()=>p(!1),children:e.jsx("i",{className:"fas fa-times"})})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("div",{className:"text-sm text-gray-500 mb-1",children:"Koordinat"}),e.jsxs("div",{className:"font-medium text-gray-800",children:[r.lat.toFixed(5),", ",r.lng.toFixed(5)]})]}),e.jsx("div",{className:"mb-4",children:e.jsx("div",{className:"w-full h-32 bg-blue-50 rounded-lg mb-2 flex items-center justify-center",children:e.jsx("div",{className:`w-16 h-16 rounded-full flex items-center justify-center text-white ${r.type==="start"?"bg-green-500":"bg-red-500"}`,children:e.jsx("i",{className:`fas ${r.type==="start"?"fa-play-circle":"fa-flag-checkered"} text-2xl`})})})}),e.jsxs("div",{className:"border-t border-gray-200 pt-4 mt-2",children:[e.jsx("h4",{className:"font-semibold text-gray-700 mb-3",children:"Informasi Driver"}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3",children:e.jsx("i",{className:"fas fa-user"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-xs text-gray-500",children:"Driver"}),e.jsx("div",{className:"font-medium",children:r.info.driver})]})]}),e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3",children:e.jsx("i",{className:"fas fa-truck"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-xs text-gray-500",children:"Kendaraan"}),e.jsx("div",{className:"font-medium",children:r.info.vehicle})]})]}),e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3",children:e.jsx("i",{className:"fas fa-weight-hanging"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-xs text-gray-500",children:"Kapasitas"}),e.jsxs("div",{className:"font-medium",children:[r.info.freightCapacity," ton"]})]})]}),e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3",children:e.jsx("i",{className:"fas fa-boxes"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-xs text-gray-500",children:"Muatan Terisi"}),e.jsxs("div",{className:"font-medium",children:[r.info.freightFilled," ton (",r.info.freightPercentage,"%)"]})]})]}),e.jsx("div",{className:"progress-bar",children:e.jsx("div",{className:"progress-bar-fill",style:{width:`${r.info.freightPercentage}%`}})}),e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3",children:e.jsx("i",{className:"fas fa-money-bill"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-xs text-gray-500",children:"Harga per Ton"}),e.jsxs("div",{className:"font-medium",children:["Rp ",Number(r.info.pricePerTon).toLocaleString("id-ID")]})]})]}),e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3",children:e.jsx("i",{className:"fas fa-wallet"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-xs text-gray-500",children:"Total Harga"}),e.jsxs("div",{className:"font-medium",children:["Rp ",Number(r.info.totalPrice).toLocaleString("id-ID")]})]})]}),e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3",children:e.jsx("i",{className:"fas fa-building"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-xs text-gray-500",children:"Perusahaan"}),e.jsx("div",{className:"font-medium",children:r.info.company})]})]}),e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3",children:e.jsx("i",{className:"fas fa-id-card"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-xs text-gray-500",children:"Plat Nomor"}),e.jsx("div",{className:"font-medium",children:r.info.licensePlate})]})]}),e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3",children:e.jsx("i",{className:"fas fa-road"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-xs text-gray-500",children:"Jarak"}),e.jsxs("div",{className:"font-medium",children:[r.info.distance," km"]})]})]}),e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3",children:e.jsx("i",{className:"fas fa-clock"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-xs text-gray-500",children:"Waktu Tempuh"}),e.jsx("div",{className:"font-medium",children:F(r.info.duration)})]})]})]})]}),e.jsx("div",{className:"mt-6",children:e.jsxs("button",{className:"w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition flex items-center justify-center",onClick:()=>{a.flyTo([r.lat,r.lng],16)},children:[e.jsx("i",{className:"fas fa-location-arrow mr-2"}),"Lihat di Peta"]})})]})}),!S&&r&&e.jsx("button",{onClick:()=>p(!0),className:"absolute top-20 right-4 z-20 bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition",children:e.jsx("i",{className:"fas fa-info"})}),e.jsx("div",{className:"absolute bottom-4 right-4 z-10 bg-blue-600 text-white px-3 py-1 rounded text-xs",children:"© PanganMerata 2025"})]})]})}export{q as default};
