import { Head, Link } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
axios.defaults.baseURL = import.meta.env.VITE_APP_URL || '/';
axios.defaults.withCredentials = true;

export default function RouteSubmission({ driver, freights, routes, users }) {
    const [map, setMap] = useState(null);
    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null);
    const [route, setRoute] = useState(null);
    const [loading, setLoading] = useState(false);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [geometry, setGeometry] = useState(null);
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState(null);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [locatingUser, setLocatingUser] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null); // New state for selected route
    const [loadFormData, setLoadFormData] = useState({ weight: "", customer_id: "" }); // Form data for adding load
    const leafletRef = useRef(null);
    const clickStage = useRef(0);
    const mapRef = useRef(null);

    const [formData, setFormData] = useState({
        name: "",
        freight_id: "",
        pricing: "",
    });

    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css";
        document.head.appendChild(link);

        const iconLink = document.createElement("link");
        iconLink.rel = "stylesheet";
        iconLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css";
        document.head.appendChild(iconLink);

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
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(link);
            document.head.removeChild(iconLink);
            document.head.removeChild(style);
        };
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            import("leaflet").then((L) => {
                leafletRef.current = L.default;

                if (!mapRef.current) {
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

                    const handleMapClick = (e) => {
                        const { lat, lng } = e.latlng;
                        const L = leafletRef.current;

                        if (clickStage.current === 0) {
                            const startMarker = L.marker([lat, lng], {
                                title: "Titik Awal",
                                draggable: true,
                                icon: startIcon,
                            }).addTo(newMap);

                            startMarker.bindPopup("Titik Pengambilan", {
                                maxWidth: 300,
                            });

                            startMarker.on("dragend", (e) => {
                                const pos = e.target.getLatLng();
                                setStartPoint((prev) => ({
                                    ...prev,
                                    lat: pos.lat,
                                    lng: pos.lng,
                                }));
                            });

                            setStartPoint({ lat, lng, marker: startMarker });
                            clickStage.current = 1;
                        } else if (clickStage.current === 1) {
                            const endMarker = L.marker([lat, lng], {
                                title: "Titik Akhir",
                                draggable: true,
                                icon: endIcon,
                            }).addTo(newMap);

                            endMarker.bindPopup("Titik Pengantaran", {
                                maxWidth: 300,
                            });

                            endMarker.on("dragend", (e) => {
                                const pos = e.target.getLatLng();
                                setEndPoint((prev) => ({
                                    ...prev,
                                    lat: pos.lat,
                                    lng: pos.lng,
                                }));
                            });

                            setEndPoint({ lat, lng, marker: endMarker });
                            clickStage.current = 2;
                        } else {
                            resetMap();
                            const startMarker = L.marker([lat, lng], {
                                title: "Titik Awal",
                                draggable: true,
                                icon: startIcon,
                            }).addTo(newMap);

                            startMarker.bindPopup("Titik Pengambilan", {
                                maxWidth: 300,
                            });

                            startMarker.on("dragend", (e) => {
                                const pos = e.target.getLatLng();
                                setStartPoint((prev) => ({
                                    ...prev,
                                    lat: pos.lat,
                                    lng: pos.lng,
                                }));
                            });

                            setStartPoint({ lat, lng, marker: startMarker });
                            clickStage.current = 1;
                        }
                    };

                    const customLocateControl = L.default.Control.extend({
                        options: { position: "bottomright" },
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

                            L.default.DomEvent.on(btn, "click", () =>
                                locateUser(newMap, L.default)
                            );

                            return container;
                        },
                    });

                    new customLocateControl().addTo(newMap);

                    newMap.on("click", handleMapClick);
                    mapRef.current = newMap;
                    setMap(newMap);
                    setTimeout(() => newMap.invalidateSize(), 100);
                }
            });
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                setMap(null);
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
                    mapInstance.setView([latitude, longitude], 16);
                    setLocatingUser(false);
                    if (locateBtn) {
                        locateBtn.classList.remove("locate-btn-active");
                        locateBtn.removeChild(
                            locateBtn.querySelector(".pulsing-circle")
                        );
                    }
                },
                (err) => {
                    setError("Gagal mendapatkan lokasi: " + err.message);
                    setLocatingUser(false);
                    if (locateBtn) {
                        locateBtn.classList.remove("locate-btn-active");
                        locateBtn.removeChild(
                            locateBtn.querySelector(".pulsing-circle")
                        );
                    }
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } else {
            setError("Geolocation tidak didukung oleh browser.");
            setLocatingUser(false);
            if (locateBtn) {
                locateBtn.classList.remove("locate-btn-active");
                locateBtn.removeChild(
                    locateBtn.querySelector(".pulsing-circle")
                );
            }
        }
    };

    useEffect(() => {
        if (startPoint && endPoint && leafletRef.current && mapRef.current) {
            calculateRoute(
                { lat: startPoint.lat, lng: startPoint.lng },
                { lat: endPoint.lat, lng: endPoint.lng },
                mapRef.current,
                leafletRef.current
            );
        }
    }, [startPoint, endPoint]);

    const calculateRoute = async (start, end, mapInstance, L) => {
        if (!mapInstance || !L) return;

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
                if (route.main && mapInstance.hasLayer(route.main))
                    mapInstance.removeLayer(route.main);
                if (route.animated && mapInstance.hasLayer(route.animated))
                    mapInstance.removeLayer(route.animated);
            }

            const newRoute = L.geoJSON(routeGeometry, {
                style: { color: "#3366FF", weight: 6, opacity: 0.7 },
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
            }).addTo(mapInstance);

            let offset = 0;
            const animateDash = () => {
                offset -= 1;
                animatedRoute.setStyle({ dashOffset: offset });
                if (mapInstance) requestAnimationFrame(animateDash);
            };
            animateDash();

            setRoute({ main: newRoute, animated: animatedRoute });
            setDistance((routeData.distance / 1000).toFixed(2));
            setDuration(Math.round(routeData.duration / 60));
            setGeometry(routeGeometry);
            mapInstance.fitBounds(newRoute.getBounds(), { padding: [50, 50] });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetMap = () => {
        if (mapRef.current) {
            if (startPoint?.marker)
                mapRef.current.removeLayer(startPoint.marker);
            if (endPoint?.marker) mapRef.current.removeLayer(endPoint.marker);
            if (route?.main) mapRef.current.removeLayer(route.main);
            if (route?.animated) mapRef.current.removeLayer(route.animated);

            setStartPoint(null);
            setEndPoint(null);
            setRoute(null);
            setDistance(null);
            setDuration(null);
            setGeometry(null);
            setError(null);
            setFormError(null);
            setFormData({
                name: "",
                freight_id: "",
                pricing: "",
            });
            setSelectedRoute(null); // Reset selected route
            setLoadFormData({ weight: "", customer_id: "" }); // Reset load form
            clickStage.current = 0;
            mapRef.current.setView([-6.2, 106.816666], 13);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        if (!distance || !duration || !geometry) {
            setError("Rute belum lengkap. Pilih titik awal dan akhir.");
            return;
        }

        if (!formData.name || !formData.freight_id || !formData.pricing) {
            setError("Semua kolom formulir harus diisi.");
            return;
        }

        if (!driver.vehicle || !driver.vehicle[0]) {
            setError("Tidak ada kendaraan yang tersedia untuk pengemudi.");
            return;
        }

        const payload = {
            driver_id: driver.id,
            vehicle_id: driver.vehicle[0].id,
            freight_id: formData.freight_id,
            name: formData.name,
            pricing: formData.pricing,
            distance: distance,
            duration: duration,
            geometry,
            start_point: {
                lat: startPoint.lat,
                lng: startPoint.lng,
            },
            end_point: {
                lat: endPoint.lat,
                lng: endPoint.lng,
            },
        };

        try {
            axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
            const token = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");
            if (token) {
                axios.defaults.headers.common["X-CSRF-TOKEN"] = token;
            }
            const response = await axios.post("/routes", payload);
            alert(response.data.message);
            resetMap();
        } catch (err) {
            if (err.response?.status === 422) {
                setFormError(err.response.data.errors);
            } else {
                console.error(err.response?.data);
                setError("Gagal menyimpan rute: " + err.response?.data);
            }
        }
    };

    const handleLoadSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        if (!loadFormData.weight || !loadFormData.customer_id) {
            setError("Semua kolom formulir muatan harus diisi.");
            return;
        }

        const payload = {
            route_id: selectedRoute.id,
            weight: parseFloat(loadFormData.weight),
            user_id: loadFormData.customer_id,
        };

        try {
            axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
            const token = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");
            if (token) {
                axios.defaults.headers.common["X-CSRF-TOKEN"] = token;
            }
            const response = await axios.post("/loads", payload); // Adjust endpoint as needed
            alert(response.data.message);
            setLoadFormData({ weight: "", customer_id: "" }); // Reset form
            setSelectedRoute(null); // Return to route submission form
        } catch (err) {
            if (err.response?.status === 422) {
                setFormError(err.response.data.errors);
            } else {
                console.error(err.response?.data);
                setError("Gagal menyimpan muatan: " + err.response?.data);
            }
        }
    };

   const handleRouteClick = (selectedRoute) => {
    console.log("Route clicked:", selectedRoute);
    setSelectedRoute(selectedRoute);
    setRightSidebarOpen(true); // Open sidebar when route is clicked

    if (!mapRef.current || !leafletRef.current) return;

    const L = leafletRef.current;
    const mapInstance = mapRef.current;

    // Clear existing map elements - gunakan state yang lama, bukan parameter function
    if (startPoint?.marker) mapInstance.removeLayer(startPoint.marker);
    if (endPoint?.marker) mapInstance.removeLayer(endPoint.marker);
    if (route?.main) mapInstance.removeLayer(route.main); // Gunakan state route yang lama
    if (route?.animated) mapInstance.removeLayer(route.animated); // Gunakan state route yang lama
    setStartPoint(null);
    setEndPoint(null);
    setRoute(null);

    // Parse the route geometry
    const geometry = JSON.parse(selectedRoute.geometry);
    if (geometry.type !== "LineString" || !geometry.coordinates) {
        setError("Geometri rute tidak valid.");
        return;
    }

    // Extract start and end coordinates
    const coordinates = geometry.coordinates;
    const startCoord = coordinates[0]; // [lng, lat]
    const endCoord = coordinates[coordinates.length - 1]; // [lng, lat]

    // Create start and end markers
    const startIcon = L.divIcon({
        html: '<div class="custom-marker start-marker"><i class="fas fa-play-circle"></i></div>',
        className: "",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });

    const endIcon = L.divIcon({
        html: '<div class="custom-marker end-marker"><i class="fas fa-flag-checkered"></i></div>',
        className: "",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });

    const startMarker = L.marker([startCoord[1], startCoord[0]], {
        title: "Titik Awal",
        icon: startIcon,
    }).addTo(mapInstance);
    startMarker.bindPopup(`Titik Pengambilan: ${selectedRoute.name}`, { maxWidth: 300 });

    const endMarker = L.marker([endCoord[1], endCoord[0]], {
        title: "Titik Akhir",
        icon: endIcon,
    }).addTo(mapInstance);
    endMarker.bindPopup(`Titik Pengantaran: ${selectedRoute.name}`, { maxWidth: 300 });

    // Set start and end points for state
    setStartPoint({ lat: startCoord[1], lng: startCoord[0], marker: startMarker });
    setEndPoint({ lat: endCoord[1], lng: endCoord[0], marker: endMarker });

    // Draw the route
    const newRoute = L.geoJSON(geometry, {
        style: { color: "#3366FF", weight: 6, opacity: 0.7 },
    }).addTo(mapInstance);

    // Add animated route
    const leafletCoords = coordinates.map((coord) => [coord[1], coord[0]]); // Convert to [lat, lng]
    const animatedRoute = L.polyline(leafletCoords, {
        color: "#1e40af",
        weight: 3,
        opacity: 0.9,
        dashArray: "10, 15",
    }).addTo(mapInstance);

    // Animate the dashed line
    let offset = 0;
    const animateDash = () => {
        offset -= 1;
        animatedRoute.setStyle({ dashOffset: offset });
        if (mapInstance) requestAnimationFrame(animateDash);
    };
    animateDash();

    // Update route state
    setRoute({ main: newRoute, animated: animatedRoute });

    // Set distance and duration from route data
    setDistance(parseFloat(selectedRoute.distance).toFixed(2));
    setDuration(Math.round(parseFloat(selectedRoute.duration)));

    // Fit map to route bounds
    mapInstance.fitBounds(newRoute.getBounds(), { padding: [50, 50] });
};

    const formatDuration = (minutes) => {
        if (!minutes) return "";
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours} jam ${mins} menit` : `${mins} menit`;
    };

    // Calculate current load and available capacity
    const calculateCurrentLoad = (route) => {
        // Assuming route.loads is an array of load objects with weight_kg
        return route.loads?.reduce((sum, load) => sum + (load.weight_kg || 0), 0) || 0;
    };

    const calculateAvailableCapacity = (route) => {
        const freight = freights.find(f => f.id === route.freight_id);
        const maxCapacity = freight?.max_weight_kg || 0;
        const currentLoad = calculateCurrentLoad(route);
        return maxCapacity - currentLoad;
    };

    return (
        <>
            <Head title="Driver Route Submission" />
            <div className="relative w-screen h-screen overflow-hidden bg-gray-100">
                <div id="map" className="absolute inset-0 z-0" />

                {/* Header */}
                <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white z-10 p-3 shadow-md flex justify-between items-center">
                    <div className="flex items-center">
                        <i className="fas fa-truck-moving text-white text-xl mr-2"></i>
                        <h1 className="font-bold text-lg">Driver Dashboard</h1>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={() => locateUser(mapRef.current, leafletRef.current)}
                            className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow mr-2"
                            disabled={locatingUser}
                        >
                            <i
                                className={`fas fa-location-crosshairs mr-2 ${locatingUser ? "animate-pulse" : ""}`}
                            ></i>
                            {locatingUser ? "Mencari..." : "Lokasi Saya"}
                        </button>
                        <button
                            onClick={resetMap}
                            className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow"
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

                {/* Left Sidebar (Menu) */}
                <div
                    className={`absolute top-16 left-0 bottom-0 z-10 bg-white/95 w-64 p-5 shadow-xl border-r border-gray-200 left-sidebar ${
                        leftSidebarOpen ? "left-sidebar-open" : "left-sidebar-closed"
                    }`}
                >
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Menu</h3>
                    <div className="space-y-2">
                        {routes.map((route) => (
                            <div
                                key={route.id}
                                className="menu-item text-gray-700"
                                onClick={() => handleRouteClick(route)}
                            >
                                <i className="fa fa-truck"></i>
                                {route.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Toggle Button for Left Sidebar */}
                {!leftSidebarOpen && (
                    <button
                        onClick={() => setLeftSidebarOpen(true)}
                        className="absolute top-20 left-4 z-20 bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
                    >
                        <i className="fas fa-arrow-right"></i>
                    </button>
                )}
                {leftSidebarOpen && (
                    <button
                        onClick={() => setLeftSidebarOpen(false)}
                        className="absolute top-20 left-4 z-20 bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
                    >
                        <i className="fas fa-arrow-left"></i>
                    </button>
                )}

                {/* Right Sidebar (Form) */}
                <div
                    className={`absolute top-16 right-0 bottom-0 z-10 bg-white/95 w-96 p-5 shadow-xl border-l border-gray-200 right-sidebar ${
                        rightSidebarOpen ? "right-sidebar-open" : "right-sidebar-closed"
                    }`}
                >
                    {selectedRoute ? (
                        <>
                            <h3 className="font-bold text-lg text-gray-800 mb-4">
                                Tambah Muatan untuk {selectedRoute.name}
                            </h3>
                            <div className="bg-blue-50 p-3 rounded-lg mb-4">
                                
                                <div className="font-semibold mb-2">Status Muatan</div>
                                <div className="flex justify-between mb-2">
                                    <span>Jumlah Muatan Saat Ini</span>
                                    <span>{selectedRoute.weight_now_sum_contributed_weight_kg} kg</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Kapasitas Tersedia</span>
                                    <span>{selectedRoute.max_weight} kg</span>
                                </div>
                            </div>
                            <form onSubmit={handleLoadSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Jumlah Muatan (kg)
                                    </label>
                                    <input
                                        type="number"
                                        value={loadFormData.weight}
                                        onChange={(e) =>
                                            setLoadFormData({
                                                ...loadFormData,
                                                weight: e.target.value,
                                            })
                                        }
                                        className="input-field"
                                        required
                                        min="0"
                                        step="0.1"
                                    />
                                    {formError?.weight_kg && (
                                        <div className="error-text">{formError.weight_kg[0]}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nama Customer
                                    </label>
                                    <select
                                        value={loadFormData.customer_id}
                                        onChange={(e) =>
                                            setLoadFormData({
                                                ...loadFormData,
                                                customer_id: e.target.value,
                                            })
                                        }
                                        className="input-field"
                                        required
                                    >
                                        <option value="">Pilih Customer</option>
                                        {users?.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                    {formError?.customer_id && (
                                        <div className="error-text">{formError.customer_id[0]}</div>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                                    disabled={loading}
                                >
                                    Tambah Muatan
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedRoute(null)}
                                    className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 mt-2"
                                >
                                    Kembali ke Form Rute
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <h3 className="font-bold text-lg text-gray-800 mb-4">
                                Submit Rute
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nama Rute
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            })
                                        }
                                        className="input-field"
                                        required
                                    />
                                    {formError?.name && (
                                        <div className="error-text">{formError.name[0]}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Kapasitas
                                    </label>
                                    <select
                                        value={formData.freight_id}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                freight_id: e.target.value,
                                            })
                                        }
                                        className="input-field"
                                        required
                                    >
                                        <option value="">Pilih Freight</option>
                                        {freights?.map((freight) => (
                                            <option key={freight.id} value={freight.id}>
                                                {freight.max_weight_kg} kg
                                            </option>
                                        ))}
                                    </select>
                                    {formError?.freight_id && (
                                        <div className="error-text">{formError.freight_id[0]}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Harga
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.pricing}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                pricing: e.target.value,
                                            })
                                        }
                                        className="input-field"
                                        required
                                    />
                                    {formError?.pricing && (
                                        <div className="error-text">{formError.pricing[0]}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Titik Pengambilan
                                    </label>
                                    <div className="text-sm">
                                        {startPoint
                                            ? `${startPoint.lat.toFixed(5)}, ${startPoint.lng.toFixed(5)}`
                                            : "Belum dipilih"}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Titik Pengantaran
                                    </label>
                                    <div className="text-sm">
                                        {endPoint
                                            ? `${endPoint.lat.toFixed(5)}, ${endPoint.lng.toFixed(5)}`
                                            : "Belum dipilih"}
                                    </div>
                                </div>
                                {distance && duration && (
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <div className="font-semibold mb-2">Hasil Rute</div>
                                        <div className="flex justify-between mb-2">
                                            <span>Jarak</span>
                                            <span>{distance} km</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Waktu Tempuh</span>
                                            <span>{formatDuration(duration)}</span>
                                        </div>
                                    </div>
                                )}
                                {loading && (
                                    <div className="bg-blue-50 p-3 rounded-lg flex items-center">
                                        <i className="fas fa-circle-notch animate-spin mr-2"></i>
                                        Menghitung rute...
                                    </div>
                                )}
                                {error && (
                                    <div className="bg-red-50 p-3 rounded-lg text-red-600">
                                        <i className="fas fa-exclamation-circle mr-2"></i>
                                        {error}
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                                    disabled={loading || !startPoint || !endPoint || !geometry}
                                >
                                    Simpan Rute
                                </button>
                            </form>
                        </>
                    )}
                </div>

                {/* Toggle Button for Right Sidebar */}
                {!rightSidebarOpen && (
                    <button
                        onClick={() => setRightSidebarOpen(true)}
                        className="absolute top-20 right-4 z-20 bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
                    >
                        <i className="fas fa-arrow-left"></i>
                    </button>
                )}
                {rightSidebarOpen && (
                    <button
                        onClick={() => setRightSidebarOpen(false)}
                        className="absolute top-20 right-4 z-20 bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
                    >
                        <i className="fas fa-arrow-right"></i>
                    </button>
                )}
            </div>
        </>
    );
}