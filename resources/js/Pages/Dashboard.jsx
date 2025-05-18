import { Head } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";

export default function Dashboard() {
    const [map, setMap] = useState(null);
    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null);
    const [route, setRoute] = useState(null);
    const [loading, setLoading] = useState(false);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [error, setError] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [locatingUser, setLocatingUser] = useState(false);
    const leafletRef = useRef(null);
    const clickStage = useRef(0);

    // Informasi driver untuk freight pooling yang transparan
    const [driverInfo, setDriverInfo] = useState({
        driver: "Ahmad Zulkifli",
        vehicle: "Truk Kontainer",
        freightCapacity: 20, // Kapasitas total dalam ton
        freightFilled: 5, // Muatan terisi dalam ton
        company: "PT Logistik Cepat",
        licensePlate: "B 1234 KLM",
    });

    // Hitung persentase muatan terisi dan harga dinamis
    const freightPercentage = (
        (driverInfo.freightFilled / driverInfo.freightCapacity) *
        100
    ).toFixed(2);
    const basePricePerTon = 500000; // Harga dasar per ton (dalam IDR)
    const priceAdjustmentFactor = 1 - (freightPercentage / 100) * 0.3; // Harga turun hingga 30% saat muatan penuh
    const pricePerTon = (basePricePerTon * priceAdjustmentFactor).toFixed(0);
    const totalPrice = (pricePerTon * driverInfo.freightFilled).toFixed(0);

    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css";
        document.head.appendChild(link);

        const iconLink = document.createElement("link");
        iconLink.rel = "stylesheet";
        iconLink.href =
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css";
        document.head.appendChild(iconLink);

        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
            if (document.head.contains(iconLink)) {
                document.head.removeChild(iconLink);
            }
        };
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            import("leaflet").then((L) => {
                leafletRef.current = L.default;

                if (!map) {
                    const newMap = L.default
                        .map("map", {
                            zoomControl: false,
                        })
                        .setView([-6.2, 106.816666], 13);

                    L.default.control
                        .zoom({
                            position: "bottomright",
                        })
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

                    const startIcon = L.default.divIcon({
                        html: '<div class="custom-marker start-marker"><i class="fas fa-play-circle"></i></div>',
                        className: "",
                        iconSize: [40, 40],
                        iconAnchor: [20, 20],
                    });

                    const endIcon = L.default.divIcon({
                        html: '<div class="custom-marker end-marker"><i class="fas fa-flag-checkered"></i></div>',
                        className: "",
                        iconSize: [40, 40],
                        iconAnchor: [20, 20],
                    });

                    const userLocationIcon = L.default.divIcon({
                        html: '<div class="custom-marker user-location-marker"><i class="fas fa-user-location"></i></div>',
                        className: "",
                        iconSize: [40, 40],
                        iconAnchor: [20, 20],
                    });

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
                        .user-location-marker {
                            background-color: #2196F3;
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
                            0% {
                                transform: scale(0.5);
                                opacity: 0;
                            }
                            50% {
                                opacity: 0.4;
                            }
                            100% {
                                transform: scale(1.2);
                                opacity: 0;
                            }
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

                    const handleMapClick = (e) => {
                        const { lat, lng } = e.latlng;
                        const L = leafletRef.current;

                        if (clickStage.current === 0) {
                            const startMarker = L.marker([lat, lng], {
                                title: "Titik Awal",
                                draggable: true,
                                icon: startIcon,
                            }).addTo(newMap);

                            const startPopupContent = createPopupContent(
                                "Titik Pengambilan",
                                driverInfo.driver,
                                driverInfo.vehicle,
                                driverInfo.freightCapacity,
                                driverInfo.freightFilled,
                                driverInfo.company,
                                driverInfo.licensePlate,
                                freightPercentage,
                                pricePerTon,
                                totalPrice
                            );

                            startMarker.bindPopup(startPopupContent, {
                                maxWidth: 300,
                                className: "custom-popup",
                            });

                            startMarker.on("dragend", function (e) {
                                const pos = e.target.getLatLng();
                                setStartPoint((prev) => ({
                                    ...prev,
                                    lat: pos.lat,
                                    lng: pos.lng,
                                }));
                            });

                            startMarker.on("click", function () {
                                setSelectedMarker({
                                    type: "start",
                                    lat: lat,
                                    lng: lng,
                                    title: "Titik Pengambilan",
                                    info: {
                                        ...driverInfo,
                                        freightPercentage,
                                        pricePerTon,
                                        totalPrice,
                                    },
                                });
                                setSidebarOpen(true);
                            });

                            setStartPoint({ lat, lng, marker: startMarker });
                            clickStage.current = 1;
                        } else if (clickStage.current === 1) {
                            const endMarker = L.marker([lat, lng], {
                                title: "Titik Akhir",
                                draggable: true,
                                icon: endIcon,
                            }).addTo(newMap);

                            const endPopupContent = createPopupContent(
                                "Titik Pengantaran",
                                driverInfo.driver,
                                driverInfo.vehicle,
                                driverInfo.freightCapacity,
                                driverInfo.freightFilled,
                                driverInfo.company,
                                driverInfo.licensePlate,
                                freightPercentage,
                                pricePerTon,
                                totalPrice
                            );

                            endMarker.bindPopup(endPopupContent, {
                                maxWidth: 300,
                                className: "custom-popup",
                            });

                            endMarker.on("dragend", function (e) {
                                const pos = e.target.getLatLng();
                                setEndPoint((prev) => ({
                                    ...prev,
                                    lat: pos.lat,
                                    lng: pos.lng,
                                }));
                            });

                            endMarker.on("click", function () {
                                setSelectedMarker({
                                    type: "end",
                                    lat: lat,
                                    lng: lng,
                                    title: "Titik Pengantaran",
                                    info: {
                                        ...driverInfo,
                                        freightPercentage,
                                        pricePerTon,
                                        totalPrice,
                                    },
                                });
                                setSidebarOpen(true);
                            });

                            setEndPoint({ lat, lng, marker: endMarker });
                            clickStage.current = 2;
                        } else {
                            if (
                                startPoint?.marker &&
                                newMap.hasLayer(startPoint.marker)
                            ) {
                                newMap.removeLayer(startPoint.marker);
                            }
                            if (
                                endPoint?.marker &&
                                newMap.hasLayer(endPoint.marker)
                            ) {
                                newMap.removeLayer(endPoint.marker);
                            }
                            if (route && newMap.hasLayer(route)) {
                                newMap.removeLayer(route);
                                setRoute(null);
                            }

                            const startMarker = L.marker([lat, lng], {
                                title: "Titik Awal",
                                draggable: true,
                                icon: startIcon,
                            }).addTo(newMap);

                            const startPopupContent = createPopupContent(
                                "Titik Pengambilan",
                                driverInfo.driver,
                                driverInfo.vehicle,
                                driverInfo.freightCapacity,
                                driverInfo.freightFilled,
                                driverInfo.company,
                                driverInfo.licensePlate,
                                freightPercentage,
                                pricePerTon,
                                totalPrice
                            );

                            startMarker.bindPopup(startPopupContent, {
                                maxWidth: 300,
                                className: "custom-popup",
                            });

                            startMarker.on("dragend", function (e) {
                                const pos = e.target.getLatLng();
                                setStartPoint((prev) => ({
                                    ...prev,
                                    lat: pos.lat,
                                    lng: pos.lng,
                                }));
                            });

                            startMarker.on("click", function () {
                                setSelectedMarker({
                                    type: "start",
                                    lat: lat,
                                    lng: lng,
                                    title: "Titik Pengambilan",
                                    info: {
                                        ...driverInfo,
                                        freightPercentage,
                                        pricePerTon,
                                        totalPrice,
                                    },
                                });
                                setSidebarOpen(true);
                            });

                            setStartPoint({ lat, lng, marker: startMarker });
                            setEndPoint(null);
                            setDistance(null);
                            setDuration(null);
                            clickStage.current = 1;
                        }
                    };

                    const customLocateControl = L.default.Control.extend({
                        options: {
                            position: "bottomright",
                        },

                        onAdd: function () {
                            const container = L.default.DomUtil.create(
                                "div",
                                "locate-control"
                            );
                            const btn = L.default.DomUtil.create(
                                "div",
                                "locate-btn",
                                container
                            );
                            btn.innerHTML =
                                '<i class="fas fa-location-crosshairs"></i>';

                            L.default.DomEvent.on(btn, "click", function () {
                                locateUser(newMap, L.default);
                            });

                            return container;
                        },
                    });

                    new customLocateControl().addTo(newMap);

                    newMap.on("click", handleMapClick);
                    setMap(newMap);
                    setTimeout(() => newMap.invalidateSize(), 100);
                }
            });
        }

        return () => {
            if (map) {
                map.remove();
            }
        };
    }, []);

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

                    const accuracyRadius = position.coords.accuracy;
                    const accuracyCircle = L.circle([latitude, longitude], {
                        radius: accuracyRadius,
                        color: "#2196F3",
                        fillColor: "#2196F3",
                        fillOpacity: 0.15,
                        weight: 2,
                    }).addTo(mapInstance);

                    const userMarker = L.marker([latitude, longitude], {
                        icon: userLocationIcon,
                    }).addTo(mapInstance);

                    userMarker.bindPopup(
                        '<div class="font-semibold">Lokasi Anda</div>',
                        {
                            className: "custom-popup",
                        }
                    );

                    mapInstance.setView([latitude, longitude], 16);

                    setLocatingUser(false);

                    if (locateBtn) {
                        locateBtn.classList.remove("locate-btn-active");
                        const pulsingCircle =
                            locateBtn.querySelector(".pulsing-circle");
                        if (pulsingCircle) {
                            locateBtn.removeChild(pulsingCircle);
                        }
                    }

                    setTimeout(() => {
                        if (mapInstance.hasLayer(accuracyCircle)) {
                            const fadeOut = setInterval(() => {
                                const currentOpacity =
                                    accuracyCircle.options.fillOpacity;
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
                    setError(
                        "Gagal mendapatkan lokasi Anda. Periksa izin lokasi browser Anda."
                    );
                    setLocatingUser(false);

                    const locateBtn = document.querySelector(".locate-btn");
                    if (locateBtn) {
                        locateBtn.classList.remove("locate-btn-active");
                        const pulsingCircle =
                            locateBtn.querySelector(".pulsing-circle");
                        if (pulsingCircle) {
                            locateBtn.removeChild(pulsingCircle);
                        }
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        } else {
            setError("Browser Anda tidak mendukung geolocation");
            setLocatingUser(false);

            const locateBtn = document.querySelector(".locate-btn");
            if (locateBtn) {
                locateBtn.classList.remove("locate-btn-active");
                const pulsingCircle =
                    locateBtn.querySelector(".pulsing-circle");
                if (pulsingCircle) {
                    locateBtn.removeChild(pulsingCircle);
                }
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
        pricePerTon,
        totalPrice
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
                <div>Kapasitas: <strong>${freightCapacity} ton</strong></div>
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
                <div>Harga per Ton: <strong>Rp ${Number(
                    pricePerTon
                ).toLocaleString("id-ID")}</strong></div>
            </div>
            <div class="driver-info-item">
                <div class="driver-info-icon"><i class="fas fa-wallet"></i></div>
                <div>Total Harga: <strong>Rp ${Number(
                    totalPrice
                ).toLocaleString("id-ID")}</strong></div>
            </div>
            <div class="driver-info-item">
                <div class="driver-info-icon"><i class="fas fa-building"></i></div>
                <div>Perusahaan: <strong>${company}</strong></div>
            </div>
            <div class="driver-info-item">
                <div class="driver-info-icon"><i class="fas fa-id-card"></i></div>
                <div>Plat: <strong>${licensePlate}</strong></div>
            </div>
        `;

        return popupDiv;
    };

    useEffect(() => {
        if (startPoint && endPoint && leafletRef.current && map) {
            calculateRoute(
                { lat: startPoint.lat, lng: startPoint.lng },
                { lat: endPoint.lat, lng: endPoint.lng },
                map,
                leafletRef.current
            );
        }
    }, [startPoint, endPoint]);

    const calculateRoute = async (start, end, mapInstance, L) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
            );
            if (!response.ok) throw new Error("Gagal mengambil rute");
            const data = await response.json();
            if (
                data.code !== "Ok" ||
                !data.routes ||
                data.routes.length === 0
            ) {
                throw new Error("Rute tidak ditemukan");
            }
            const routeData = data.routes[0];
            const routeGeometry = routeData.geometry;
            if (route) {
                if (typeof route.remove === "function") {
                    route.remove();
                } else {
                    if (route.main && mapInstance.hasLayer(route.main))
                        mapInstance.removeLayer(route.main);
                    if (route.animated && mapInstance.hasLayer(route.animated))
                        mapInstance.removeLayer(route.animated);
                }
            }

            const newRoute = L.geoJSON(routeGeometry, {
                style: {
                    color: "#3366FF",
                    weight: 6,
                    opacity: 0.7,
                    lineCap: "round",
                    lineJoin: "round",
                },
            }).addTo(mapInstance);

            const coordinates = routeGeometry.coordinates.map((coord) => [
                coord[1],
                coord[0],
            ]);

            const animatedRoute = L.polyline(coordinates, {
                color: "#1e40af",
                weight: 3,
                opacity: 0.9,
                dashArray: "10, 15",
                lineCap: "round",
                lineJoin: "round",
            }).addTo(mapInstance);

            let offset = 0;
            const animateDash = () => {
                offset -= 1;
                animatedRoute.setStyle({ dashOffset: offset });
                requestAnimationFrame(animateDash);
            };

            animateDash();

            setRoute({
                main: newRoute,
                animated: animatedRoute,
            });

            setDistance((routeData.distance / 1000).toFixed(2));
            setDuration(Math.round(routeData.duration / 60));
            mapInstance.fitBounds(newRoute.getBounds(), {
                padding: [50, 50],
            });
        } catch (err) {
            setError(err.message || "Gagal menghitung rute");
        } finally {
            setLoading(false);
        }
    };

    const resetMap = () => {
        if (map) {
            if (startPoint?.marker && map.hasLayer(startPoint.marker))
                map.removeLayer(startPoint.marker);
            if (endPoint?.marker && map.hasLayer(endPoint.marker))
                map.removeLayer(endPoint.marker);

            if (route) {
                if (route.main && map.hasLayer(route.main))
                    map.removeLayer(route.main);
                if (route.animated && map.hasLayer(route.animated))
                    map.removeLayer(route.animated);
            }

            setStartPoint(null);
            setEndPoint(null);
            setRoute(null);
            setDistance(null);
            setDuration(null);
            setError(null);
            setSelectedMarker(null);
            setSidebarOpen(false);
            map.setView([-6.2, 106.816666], 13);
            clickStage.current = 0;
            setTimeout(() => map.invalidateSize(), 100);
        }
    };

    const formatDuration = (minutes) => {
        if (!minutes) return "";
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours} jam ${mins} menit` : `${mins} menit`;
    };

    return (
        <>
            <Head title="OSRM Fullscreen Map" />
            <div className="relative w-screen h-screen overflow-hidden bg-gray-100">
                <div id="map" className="absolute inset-0 z-0" />

                <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white z-10 p-3 shadow-md flex justify-between items-center">
                    <div className="flex items-center">
                        <i className="fas fa-truck-moving text-white text-xl mr-2"></i>
                        <h1 className="font-bold text-lg">
                            PanganMerata
                        </h1>
                    </div>

                    <div className="flex items-center">
                        <button
                            onClick={() => locateUser(map, leafletRef.current)}
                            className="bg-white text-blue-600 hover:bg-blue-50 font-medium px-4 py-2 rounded-lg shadow flex items-center transition mr-2"
                            disabled={locatingUser}
                        >
                            <i
                                className={`fas fa-location-crosshairs mr-2 ${
                                    locatingUser ? "animate-pulse" : ""
                                }`}
                            ></i>
                            {locatingUser ? "Mencari..." : "Lokasi Saya"}
                        </button>

                        <button
                            onClick={resetMap}
                            className="bg-white text-blue-600 hover:bg-blue-50 font-medium px-4 py-2 rounded-lg shadow flex items-center transition"
                        >
                            <i className="fas fa-redo-alt mr-2"></i>
                            Reset Peta
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur p-5 rounded-lg shadow-xl w-80 border border-gray-200">
                    <div className="flex items-center mb-3">
                        <i className="fas fa-info-circle text-blue-600 text-lg mr-2"></i>
                        <h3 className="font-bold text-lg text-gray-800">
                            Informasi Rute
                        </h3>
                    </div>

                    <div className="space-y-3 text-gray-700">
                        <div className="flex items-start">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mt-1 mr-3">
                                <i className="fas fa-play-circle"></i>
                            </div>
                            <div>
                                <div className="font-semibold mb-1">
                                    Titik Pengambilan
                                </div>
                                <div className="text-sm">
                                    {startPoint
                                        ? `${startPoint.lat.toFixed(
                                              5
                                          )}, ${startPoint.lng.toFixed(5)}`
                                        : "Belum dipilih"}
                                </div>
                                {startPoint && (
                                    <div className="text-xs text-blue-600 mt-1">
                                        Driver: {driverInfo.driver} •{" "}
                                        {driverInfo.vehicle}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white mt-1 mr-3">
                                <i className="fas fa-flag-checkered"></i>
                            </div>
                            <div>
                                <div className="font-semibold mb-1">
                                    Titik Pengantaran
                                </div>
                                <div className="text-sm">
                                    {endPoint
                                        ? `${endPoint.lat.toFixed(
                                              5
                                          )}, ${endPoint.lng.toFixed(5)}`
                                        : "Belum dipilih"}
                                </div>
                                {endPoint && (
                                    <div className="text-xs text-blue-600 mt-1">
                                        Muatan Terisi:{" "}
                                        {driverInfo.freightFilled} ton (
                                        {freightPercentage}%)
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="font-semibold mb-1">
                                Status Muatan
                            </div>
                            <div className="text-sm">
                                Kapasitas: {driverInfo.freightCapacity} ton
                            </div>
                            <div className="text-sm">
                                Terisi: {driverInfo.freightFilled} ton (
                                {freightPercentage}%)
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${freightPercentage}%` }}
                                ></div>
                            </div>
                            <div className="text-sm mt-2">
                                Harga per Ton: Rp{" "}
                                {Number(pricePerTon).toLocaleString("id-ID")}
                            </div>
                            <div className="text-sm">
                                Total Harga: Rp{" "}
                                {Number(totalPrice).toLocaleString("id-ID")}
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="mt-4 bg-blue-50 p-3 rounded-lg flex items-center justify-center">
                            <div className="animate-spin mr-2">
                                <i className="fas fa-circle-notch text-blue-600"></i>
                            </div>
                            <div className="text-blue-600">
                                Menghitung rute...
                            </div>
                        </div>
                    ) : error ? (
                        <div className="mt-4 bg-red-50 p-3 rounded-lg">
                            <div className="flex items-center text-red-600 mb-1">
                                <i className="fas fa-exclamation-circle mr-2"></i>
                                <div className="font-semibold">Error</div>
                            </div>
                            <div className="text-sm text-red-600">{error}</div>
                        </div>
                    ) : distance && duration ? (
                        <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <div className="font-semibold text-gray-700">
                                    Hasil Rute
                                </div>
                                <div className="text-xs text-blue-600">
                                    OSRM
                                </div>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center text-sm">
                                    <i className="fas fa-road text-gray-500 mr-2"></i>
                                    <span>Jarak</span>
                                </div>
                                <div className="font-semibold">
                                    {distance} km
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-sm">
                                    <i className="fas fa-clock text-gray-500 mr-2"></i>
                                    <span>Waktu Tempuh</span>
                                </div>
                                <div className="font-semibold">
                                    {formatDuration(duration)}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-4 bg-gray-50 p-3 rounded-lg text-center text-gray-500 text-sm">
                            Pilih titik awal dan akhir untuk melihat rute
                        </div>
                    )}
                </div>

                <div
                    className={`absolute top-16 right-0 bottom-0 z-10 bg-white/95 backdrop-blur w-80 p-5 shadow-xl border-l border-gray-200 sidebar ${
                        sidebarOpen ? "sidebar-open" : "sidebar-closed"
                    }`}
                >
                    {selectedMarker && (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg text-gray-800">
                                    {selectedMarker.type === "start"
                                        ? "Titik Pengambilan"
                                        : "Titik Pengantaran"}
                                </h3>
                                <button
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <div className="mb-4">
                                <div className="text-sm text-gray-500 mb-1">
                                    Koordinat
                                </div>
                                <div className="font-medium text-gray-800">
                                    {selectedMarker.lat.toFixed(5)},{" "}
                                    {selectedMarker.lng.toFixed(5)}
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="w-full h-32 bg-blue-50 rounded-lg mb-2 flex items-center justify-center">
                                    <div
                                        className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${
                                            selectedMarker.type === "start"
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                        }`}
                                    >
                                        <i
                                            className={`fas ${
                                                selectedMarker.type === "start"
                                                    ? "fa-play-circle"
                                                    : "fa-flag-checkered"
                                            } text-2xl`}
                                        ></i>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4 mt-2">
                                <h4 className="font-semibold text-gray-700 mb-3">
                                    Informasi Driver
                                </h4>

                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                            <i className="fas fa-user"></i>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">
                                                Driver
                                            </div>
                                            <div className="font-medium">
                                                {selectedMarker.info.driver}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                            <i className="fas fa-truck"></i>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">
                                                Kendaraan
                                            </div>
                                            <div className="font-medium">
                                                {selectedMarker.info.vehicle}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                            <i className="fas fa-weight-hanging"></i>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">
                                                Kapasitas
                                            </div>
                                            <div className="font-medium">
                                                {
                                                    selectedMarker.info
                                                        .freightCapacity
                                                }{" "}
                                                ton
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                            <i className="fas fa-boxes"></i>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">
                                                Muatan Terisi
                                            </div>
                                            <div className="font-medium">
                                                {
                                                    selectedMarker.info
                                                        .freightFilled
                                                }{" "}
                                                ton (
                                                {
                                                    selectedMarker.info
                                                        .freightPercentage
                                                }
                                                %)
                                            </div>
                                        </div>
                                    </div>

                                    <div className="progress-bar">
                                        <div
                                            className="progress-bar-fill"
                                            style={{
                                                width: `${selectedMarker.info.freightPercentage}%`,
                                            }}
                                        ></div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                            <i className="fas fa-money-bill"></i>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">
                                                Harga per Ton
                                            </div>
                                            <div className="font-medium">
                                                Rp{" "}
                                                {Number(
                                                    selectedMarker.info
                                                        .pricePerTon
                                                ).toLocaleString("id-ID")}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                            <i className="fas fa-wallet"></i>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">
                                                Total Harga
                                            </div>
                                            <div className="font-medium">
                                                Rp{" "}
                                                {Number(
                                                    selectedMarker.info
                                                        .totalPrice
                                                ).toLocaleString("id-ID")}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                            <i className="fas fa-building"></i>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">
                                                Perusahaan
                                            </div>
                                            <div className="font-medium">
                                                {selectedMarker.info.company}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                            <i className="fas fa-id-card"></i>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">
                                                Plat Nomor
                                            </div>
                                            <div className="font-medium">
                                                {
                                                    selectedMarker.info
                                                        .licensePlate
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {selectedMarker.type === "start" && (
                                <div className="mt-6">
                                    <button
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition flex items-center justify-center"
                                        onClick={() => {
                                            if (startPoint?.marker) {
                                                map.flyTo(
                                                    [
                                                        startPoint.lat,
                                                        startPoint.lng,
                                                    ],
                                                    16
                                                );
                                            }
                                        }}
                                    >
                                        <i className="fas fa-location-arrow mr-2"></i>
                                        Lihat di Peta
                                    </button>
                                </div>
                            )}

                            {selectedMarker.type === "end" && (
                                <div className="mt-6">
                                    <button
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition flex items-center justify-center"
                                        onClick={() => {
                                            if (endPoint?.marker) {
                                                map.flyTo(
                                                    [
                                                        endPoint.lat,
                                                        endPoint.lng,
                                                    ],
                                                    16
                                                );
                                            }
                                        }}
                                    >
                                        <i className="fas fa-location-arrow mr-2"></i>
                                        Lihat di Peta
                                    </button>
                                </div>
                            )}
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
