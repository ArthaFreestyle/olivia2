import { Head } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import { Link } from '@inertiajs/react';

export default function Dashboard({ logistik }) {
    const [map, setMap] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [locatingUser, setLocatingUser] = useState(false);
    const leafletRef = useRef(null);

    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css";
        document.head.appendChild(link);

        const iconLink = document.createElement("link");
        iconLink.rel = "stylesheet";
        iconLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css";
        document.head.appendChild(iconLink);

        return () => {
            document.head.removeChild(link);
            document.head.removeChild(iconLink);
        };
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            import("leaflet").then((L) => {
                leafletRef.current = L.default;

                if (!map) {
                    const newMap = L.default
                        .map("map", { zoomControl: false })
                        .setView([-6.2, 106.816666], 13);

                    L.default.control
                        .zoom({ position: "bottomright" })
                        .addTo(newMap);

                    L.default
                        .tileLayer(
                            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                            {
                                attribution:
                                    '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                                maxZoom: 19,
                            }
                        )
                        .addTo(newMap);

                    const style = document.createElement("style");
                    style.textContent = `
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
                    `;
                    document.head.appendChild(style);

                    const customLocateControl = L.default.Control.extend({
                        options: { position: "bottomright" },
                        onAdd: function () {
                            const container = L.default.DomUtil.create("div", "locate-control");
                            const btn = L.default.DomUtil.create("div", "locate-btn", container);
                            btn.innerHTML = '<i className="fas fa-location-crosshairs"></i>';

                            L.default.DomEvent.on(btn, "click", () => locateUser(newMap, L.default));

                            return container;
                        },
                    });

                    new customLocateControl().addTo(newMap);
                    setMap(newMap);
                    setTimeout(() => newMap.invalidateSize(), 100);
                }
            });
        }

        return () => {
            if (map) map.remove();
        };
    }, []);

    const calculatePooledPrice = (basePricePerKg, freightFilledTons, freightCapacityKg) => {
        const freightFilledKg = freightFilledTons ; // Convert tons to kg
        const freightPercentage = (freightFilledKg / freightCapacityKg) * 100;
        let discountFactor = 1;

        // Tiered discount based on freight percentage
        if (freightPercentage <= 50) {
            discountFactor = 0.95; // 5% discount
        } else if (freightPercentage <= 75) {
            discountFactor = 0.85; // 15% discount
        } else if (freightPercentage <= 90) {
            discountFactor = 0.75; // 25% discount
        } else {
            discountFactor = 0.65; // 35% discount
        }

        // Calculate price per kg with discount
        const pricePerKg = Math.max(basePricePerKg * discountFactor, basePricePerKg * 0.7);
        const totalPrice = (pricePerKg * freightFilledKg).toFixed(0);

        return { pricePerKg: pricePerKg.toFixed(0), totalPrice, freightPercentage: freightPercentage.toFixed(2) };
    };

    useEffect(() => {
        if (map && leafletRef.current && logistik?.routes) {
            setLoading(true);
            setError(null);

            try {
                if (!logistik.routes || logistik.routes.length === 0) {
                    throw new Error("Tidak ada rute yang ditemukan");
                }

                console.log("Logistik Data:", logistik);
                const newRoutes = logistik.routes.map((routeData) => {
                    const freightCapacity = routeData.max_weight; // in kg
                    const freightFilled = routeData.weight_filled || 0; // in tons
                    const basePricePerKg = routeData.pricing; // assumed per kg

                    // Calculate pricing with pooling logic
                    const { pricePerKg, totalPrice, freightPercentage } = calculatePooledPrice(
                        basePricePerKg,
                        freightFilled,
                        freightCapacity
                    );

                    const routeGeometry = routeData.geometry;
                    const routeLayer = leafletRef.current.geoJSON(routeGeometry, {
                        style: {
                            color: "#3366FF",
                            weight: 6,
                            opacity: 0.7,
                            lineCap: "round",
                            lineJoin: "round",
                        },
                    }).addTo(map);

                    const coordinates = routeGeometry.coordinates.map((coord) => [
                        coord[1],
                        coord[0],
                    ]);

                    const animatedRoute = leafletRef.current.polyline(coordinates, {
                        color: "#1e40af",
                        weight: 3,
                        opacity: 0.9,
                        dashArray: "10, 15",
                        lineCap: "round",
                        lineJoin: "round",
                    }).addTo(map);

                    let offset = 0;
                    const animateDash = () => {
                        offset -= 1;
                        animatedRoute.setStyle({ dashOffset: offset });
                        requestAnimationFrame(animateDash);
                    };
                    animateDash();

                    const startMarker = leafletRef.current.marker(
                        [routeData.points[0].latitude_start, routeData.points[0].longitude_start],
                        {
                            title: `Titik Awal: ${routeData.name}`,
                            icon: leafletRef.current.divIcon({
                                html: '<div class="custom-marker start-marker"><i class="fas fa-truck"></i></div>',
                                className: "",
                                iconSize: [40, 40],
                                iconAnchor: [20, 20],
                            }),
                        }
                    ).addTo(map);

                    const endMarker = leafletRef.current.marker(
                        [routeData.points[0].latitude_end, routeData.points[0].longitude_end],
                        {
                            title: `Nama Rute: ${routeData.name}`,
                            icon: leafletRef.current.divIcon({
                                html: '<div class="custom-marker end-marker"><i class="fas fa-flag-checkered"></i></div>',
                                className: "",
                                iconSize: [40, 40],
                                iconAnchor: [20, 20],
                            }),
                        }
                    ).addTo(map);

                    const popupContent = createPopupContent(
                        startMarker.options.title,
                        routeData.driver || "Unknown Driver",
                        routeData.vehicle || "Truk Kontainer",
                        freightCapacity,
                        freightFilled,
                        "PT Logistik Cepat",
                        routeData.license_plate || "B 1234 KLM",
                        freightPercentage,
                        pricePerKg,
                        totalPrice,
                        routeData.distance,
                        routeData.duration
                    );

                    startMarker.bindPopup(popupContent, { maxWidth: 300, className: "custom-popup" });
                    endMarker.bindPopup(popupContent, { maxWidth: 300, className: "custom-popup" });

                    startMarker.on("click", () => {
                        console.log(routeData);
                        setSelectedMarker({
                            type: "start",
                            lat: routeData.points[0].latitude_start,
                            lng: routeData.points[0].longitude_start,
                            title: `Nama Rute: ${routeData.name}`,
                            info: {
                                driver: routeData.driver || "Unknown Driver",
                                vehicle: routeData.vehicle || "Truk Kontainer",
                                freightCapacity,
                                freightFilled,
                                company: "PT Logistik Cepat",
                                licensePlate: routeData.license_plate || "B 1234 KLM",
                                freightPercentage,
                                pricing: pricePerKg,
                                totalPrice,
                                distance: (routeData.distance / 1000).toFixed(2),
                                duration: Math.round(routeData.duration / 60),
                            },
                        });
                        setSidebarOpen(true);
                    });

                    endMarker.on("click", () => {
                        setSelectedMarker({
                            type: "end",
                            lat: routeData.points[0].latitude_end,
                            lng: routeData.points[0].longitude_end,
                            title: `Nama Rute: ${routeData.name}`,
                            info: {
                                driver: routeData.driver || "Unknown Driver",
                                vehicle: routeData.vehicle || "Truk Kontainer",
                                freightCapacity,
                                freightFilled,
                                company: "PT Logistik Cepat",
                                licensePlate: routeData.license_plate || "B 1234 KLM",
                                freightPercentage,
                                pricing: pricePerKg,
                                totalPrice,
                                distance: (routeData.distance / 1000).toFixed(2),
                                duration: Math.round(routeData.duration / 60),
                            },
                        });
                        setSidebarOpen(true);
                    });

                    return { main: routeLayer, animated: animatedRoute, startMarker, endMarker };
                });

                setRoutes(newRoutes);
                map.fitBounds(
                    leafletRef.current.featureGroup(newRoutes.map((r) => r.main)).getBounds(),
                    { padding: [50, 50] }
                );
            } catch (err) {
                setError(err.message || "Gagal memproses rute");
            } finally {
                setLoading(false);
            }
        }
    }, [map, logistik]);

    const locateUser = (mapInstance, L) => {
        if (!mapInstance || !L) return;

        setLocatingUser(true);
        const locateBtn = document.querySelector(".locate-btn");
        if (locateBtn) {
            locateBtn.classList.add("locate-btn-active");
            const pulsingCircle = document.createElement("div");
            pulsingCircle.className = "pulsing-circle";
            locateBtn.appendChild(pulsingCircle);
        }

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const userLocationIcon = L.divIcon({
                        html: '<div class="custom-marker" style="background-color: #2196F3;"><i class="fas fa-user"></i></div>',
                        className: "",
                        iconSize: [40, 40],
                        iconAnchor: [20, 20],
                    });

                    const accuracyCircle = L.circle([latitude, longitude], {
                        radius: position.coords.accuracy,
                        color: "#2196F3",
                        fillColor: "#2196F3",
                        fillOpacity: 0.15,
                        weight: 2,
                    }).addTo(mapInstance);

                    const userMarker = L.marker([latitude, longitude], {
                        icon: userLocationIcon,
                    }).addTo(mapInstance);

                    userMarker.bindPopup('<div class="font-semibold">Lokasi Anda</div>', {
                        className: "custom-popup",
                    });

                    mapInstance.setView([latitude, longitude], 16);
                    setLocatingUser(false);

                    if (locateBtn) {
                        locateBtn.classList.remove("locate-btn-active");
                        const pulsingCircle = locateBtn.querySelector(".pulsing-circle");
                        if (pulsingCircle) locateBtn.removeChild(pulsingCircle);
                    }

                    setTimeout(() => {
                        if (mapInstance.hasLayer(accuracyCircle)) {
                            const fadeOut = setInterval(() => {
                                const currentOpacity = accuracyCircle.options.fillOpacity;
                                if (currentOpacity <= 0.02) {
                                    clearInterval(fadeOut);
                                    mapInstance.removeLayer(accuracyCircle);
                                } else {
                                    accuracyCircle.setStyle({
                                        fillOpacity: currentOpacity - 0.02,
                                        opacity: currentOpacity - 0.02,
                                    });
                                }
                            }, 100);
                        }
                    }, 5000);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setError("Gagal mendapatkan lokasi Anda. Periksa izin lokasi browser Anda.");
                    setLocatingUser(false);

                    if (locateBtn) {
                        locateBtn.classList.remove("locate-btn-active");
                        const pulsingCircle = locateBtn.querySelector(".pulsing-circle");
                        if (pulsingCircle) locateBtn.removeChild(pulsingCircle);
                    }
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            setError("Browser Anda tidak mendukung geolocation");
            setLocatingUser(false);

            if (locateBtn) {
                locateBtn.classList.remove("locate-btn-active");
                const pulsingCircle = locateBtn.querySelector(".pulsing-circle");
                if (pulsingCircle) locateBtn.removeChild(pulsingCircle);
            }
        }
    };

    const createPopupContent = (
        title,
        driver,
        vehicle,
        freightCapacity,
        freightFilled,
        company,
        licensePlate,
        freightPercentage,
        pricePerKg,
        totalPrice,
        distance,
        duration
    ) => {
        const popupDiv = document.createElement("div");
        popupDiv.className = "driver-info-card";

        popupDiv.innerHTML = `
            <h3>${title}</h3>
            <div class="driver-info-item">
                <div class="driver-info-icon"><i class="fas fa-user"></i></div>
                <div>Driver: <strong>${driver}</strong></div>
            </div>
            <div class="driver-info-item">
                <div class="driver-info-icon"><i class="fas fa-truck"></i></div>
                <div>Kendaraan: <strong>${vehicle}</strong></div>
            </div>
            <div class="driver-info-item">
                <div class="driver-info-icon"><i class="fas fa-weight-hanging"></i></div>
                <div>Kapasitas: <strong>${freightCapacity} Kg</strong></div>
            </div>
            <div class="driver-info-item">
                <div class="driver-info-icon"><i class="fas fa-boxes"></i></div>
                <div>Muatan Terisi: <strong>${freightFilled} ton (${freightPercentage}%)</strong></div>
            </div>
            <div class="progress-bar">
                <div class="progress-bar-fill" style="width: ${freightPercentage}%"></div>
            </div>
            <div class="driver-info-item">
                <div class="driver-info-icon"><i class="fas fa-money-bill"></i></div>
                <div>Harga per Kg: <strong>Rp ${Number(pricePerKg).toLocaleString("id-ID")}</strong></div>
            </div>
            <div class="driver-info-item">
                <div class="driver-info-icon"><i class="fas fa-wallet"></i></div>
                <div>Total Harga: <strong>Rp ${Number(totalPrice).toLocaleString("id-ID")}</strong></div>
            </div>
            <div class="driver-info-item">
                <div class="driver-info-icon"><i class="fas fa-building"></i></div>
                <div>Perusahaan: <strong>${company}</strong></div>
            </div>
            <div class="driver-info-item">
                <div class="driver-info-icon"><i class="fas fa-id-card"></i></div>
                <div>Plat: <strong>${licensePlate}</strong></div>
            </div>
            <div class="driver-info-item">
                <div class="driver-info-icon"><i class="fas fa-road"></i></div>
                <div>Jarak: <strong>${(distance / 1000).toFixed(2)} km</strong></div>
            </div>
            <div class="driver-info-item">
                <div class="driver-info-icon"><i class="fas fa-clock"></i></div>
                <div>Waktu Tempuh: <strong>${formatDuration(Math.round(duration / 60))}</strong></div>
            </div>
        `;

        return popupDiv;
    };

    const formatDuration = (minutes) => {
        if (!minutes) return "";
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours} jam ${mins} menit` : `${mins} menit`;
    };

    const resetMap = () => {
        if (map) {
            routes.forEach((route) => {
                if (route.main && map.hasLayer(route.main)) map.removeLayer(route.main);
                if (route.animated && map.hasLayer(route.animated)) map.removeLayer(route.animated);
                if (route.startMarker && map.hasLayer(route.startMarker)) map.removeLayer(route.startMarker);
                if (route.endMarker && map.hasLayer(route.endMarker)) map.removeLayer(route.endMarker);
            });

            setRoutes([]);
            setSelectedMarker(null);
            setSidebarOpen(false);
            setError(null);
            map.setView([-6.2, 106.816666], 13);
            setTimeout(() => map.invalidateSize(), 100);
        }
    };

    return (
        <>
            <Head title="OSRM Fullscreen Map" />
            <div className="relative w-screen h-screen overflow-hidden bg-gray-100">
                <div id="map" className="absolute inset-0 z-0" />

                <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white z-10 p-3 shadow-md flex justify-between items-center">
                    <div className="flex items-center">
                        <i className="fas fa-truck-moving text-white text-xl mr-2"></i>
                        <h1 className="font-bold text-lg">PanganMerata</h1>
                    </div>

                    <div className="flex items-center">
                        <button
                            onClick={() => locateUser(map, leafletRef.current)}
                            className="bg-white text-blue-600 hover:bg-blue-50 font-medium px-4 py-2 rounded-lg shadow flex items-center transition mr-2"
                            disabled={locatingUser}
                        >
                            <i className={`fas fa-location-crosshairs mr-2 ${locatingUser ? "animate-pulse" : ""}`}></i>
                            {locatingUser ? "Mencari..." : "Lokasi Saya"}
                        </button>

                        <button
                            onClick={resetMap}
                            className="bg-white text-blue-600 hover:bg-blue-50 font-medium px-4 py-2 rounded-lg shadow flex items-center transition"
                        >
                            <i className="fas fa-redo-alt mr-2"></i>
                            Reset Peta
                        </button>

                        <Link
                            href="/logout"
                            method="post"
                            className="bg-white text-blue-600 hover:bg-blue-50 font-medium px-4 py-2 rounded-lg shadow flex items-center transition ml-2"
                        >
                            <i className="fas fa-sign-out-alt mr-2"></i>
                            Logout
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur p-5 rounded-lg shadow-xl w-80 border border-gray-200">
                    <div className="flex items-center mb-3">
                        <i className="fas fa-info-circle text-blue-600 text-lg mr-2"></i>
                        <h3 className="font-bold text-lg text-gray-800">Informasi Rute</h3>
                    </div>

                    <div className="space-y-3 text-gray-700">
                        <div className="text-sm">
                            Jumlah Rute: <strong>{routes.length}</strong>
                        </div>
                        {loading ? (
                            <div className="mt-4 bg-blue-50 p-3 rounded-lg flex items-center justify-center">
                                <div className="animate-spin mr-2">
                                    <i className="fas fa-circle-notch text-blue-600"></i>
                                </div>
                                <div className="text-blue-600">Memproses rute...</div>
                            </div>
                        ) : error ? (
                            <div className="mt-4 bg-red-50 p-3 rounded-lg">
                                <div className="flex items-center text-red-600 mb-1">
                                    <i className="fas fa-exclamation-circle mr-2"></i>
                                    <div className="font-semibold">Error</div>
                                </div>
                                <div className="text-sm text-red-600">{error}</div>
                            </div>
                        ) : routes.length > 0 ? (
                            <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                                <div className="font-semibold text-gray-700 mb-2">Daftar Rute</div>
                                {routes.map((route, index) => (
                                    <div key={index} className="flex items-center justify-between mb-2">
                                        <div className="flex items-center text-sm">
                                            <i className="fas fa-route text-gray-500 mr-2"></i>
                                            <span>{route.endMarker.options.title}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-4 bg-gray-50 p-3 rounded-lg text-center text-gray-500 text-sm">
                                Tidak ada rute yang tersedia
                            </div>
                        )}
                    </div>
                </div>

                <div
                    className={`absolute top-16 right-0 bottom-0 z-10 bg-white/95 backdrop-blur w-80 p-5 shadow-xl border-l border-gray-200 sidebar ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
                >
                    {selectedMarker && (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg text-gray-800">{selectedMarker.title}</h3>
                                <button
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <div className="mb-4">
                                <div className="text-sm text-gray-500 mb-1">Koordinat</div>
                                <div className="font-medium text-gray-800">
                                    {selectedMarker.lat.toFixed(5)}, {selectedMarker.lng.toFixed(5)}
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="w-full h-32 bg-blue-50 rounded-lg mb-2 flex items-center justify-center">
                                    <div
                                        className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${selectedMarker.type === "start" ? "bg-green-500" : "bg-red-500"}`}
                                    >
                                        <i
                                            className={`fas ${selectedMarker.type === "start" ? "fa-play-circle" : "fa-flag-checkered"} text-2xl`}
                                        ></i>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4 mt-2">
                                <h4 className="font-semibold text-gray-700 mb-3">Informasi Driver</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                            <i className="fas fa-user"></i>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Driver</div>
                                            <div className="font-medium">{selectedMarker.info.driver}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                            <i className="fas fa-truck"></i>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Kendaraan</div>
                                            <div className="font-medium">{selectedMarker.info.vehicle}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                            <i className="fas fa-weight-hanging"></i>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Kapasitas</div>
                                            <div className="font-medium">{selectedMarker.info.freightCapacity} Kg</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                            <i className="fas fa-boxes"></i>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Muatan Terisi</div>
                                            <div className="font-medium">
                                                {selectedMarker.info.freightFilled} ton ({selectedMarker.info.freightPercentage}%)
                                            </div>
                                        </div>
                                    </div>

                                    <div className="progress-bar">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${selectedMarker.info.freightPercentage}%` }}
                                        ></div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                            <i className="fas fa-money-bill"></i>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Harga per Kg</div>
                                            <div className="font-medium">
                                                Rp {Number(selectedMarker.info.pricing).toLocaleString("id-ID")}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                            <i className="fas fa-wallet"></i>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Total Harga</div>
                                            <div className="font-medium">
                                                Rp {Number(selectedMarker.info.totalPrice).toLocaleString("id-ID")}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                            <i className="fas fa-building"></i>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Perusahaan</div>
                                            <div className="font-medium">{selectedMarker.info.company}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                            <i className="fas fa-id-card"></i>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Plat Nomor</div>
                                            <div className="font-medium">{selectedMarker.info.licensePlate}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                            <i className="fas fa-road"></i>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Jarak</div>
                                            <div className="font-medium">{selectedMarker.info.distance} km</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                            <i className="fas fa-clock"></i>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Waktu Tempuh</div>
                                            <div className="font-medium">{formatDuration(selectedMarker.info.duration)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition flex items-center justify-center"
                                    onClick={() => {
                                        map.flyTo([selectedMarker.lat, selectedMarker.lng], 16);
                                    }}
                                >
                                    <i className="fas fa-location-arrow mr-2"></i>
                                    Lihat di Peta
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {!sidebarOpen && selectedMarker && (
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="absolute top-20 right-4 z-20 bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition"
                    >
                        <i className="fas fa-info"></i>
                    </button>
                )}

                <div className="absolute bottom-4 right-4 z-10 bg-blue-600 text-white px-3 py-1 rounded text-xs">
                    © PanganMerata 2025
                </div>
            </div>
        </>
    );
}