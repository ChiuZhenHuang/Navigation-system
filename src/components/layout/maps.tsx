import { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  DirectionsRenderer,
} from "@react-google-maps/api";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import { MapPin, Navigation, Search } from "lucide-react";
import type { InputRef } from "antd";
import { useSearchCarType } from "@/hooks/useSearchCarType";
import { useSaveRedcord } from "@/hooks/useSaveRecord";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 25.0478,
  lng: 121.5319,
};

interface Position {
  lat: number;
  lng: number;
}

interface RouteInfo {
  distance: string;
  duration: string;
}

const libraries: "places"[] = ["places"];

interface Props {
  userId: string;
  selectCarType: string;
}

function MyMapComponent({ userId, selectCarType }: Props) {
  const { handSave, contextHolder } = useSaveRedcord();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Position | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const searchInputRef = useRef<InputRef>(null);
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const directionsService = useRef<google.maps.DirectionsService | null>(null);

  useEffect(() => {
    if (isLoaded) {
      directionsService.current = new google.maps.DirectionsService();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded && searchInputRef.current?.input) {
      // 設置搜尋建議的樣式
      const input = searchInputRef.current.input;
      input.setAttribute("autocomplete", "new-password"); // 避免瀏覽器自動完成干擾

      autoCompleteRef.current = new google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: "tw" },
        fields: ["geometry", "formatted_address", "name"],
      });

      autoCompleteRef.current.addListener("place_changed", () => {
        const place = autoCompleteRef.current?.getPlace();
        if (place?.geometry?.location) {
          const pos = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          setSelectedPlace(pos);
          map?.panTo(pos);
          map?.setZoom(16);
          setSearchInput(place.formatted_address || place.name || "");

          // 如果有當前位置，計算路線
          if (currentPosition) {
            calculateRoute(currentPosition, pos);
          }
        }
      });
    }
  }, [isLoaded, map, currentPosition]);

  const calculateRoute = (origin: Position, destination: Position) => {
    if (!directionsService.current) return;

    directionsService.current.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);

          const route = result.routes[0].legs[0];
          setRouteInfo({
            distance: route.distance?.text || "",
            duration: route.duration?.text || "",
          });
        }
      }
    );
  };

  // 開始導航
  const startNavigation = () => {
    if (currentPosition && selectedPlace) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${currentPosition.lat},${currentPosition.lng}&destination=${selectedPlace.lat},${selectedPlace.lng}&travelmode=driving`;
      window.open(url, "_blank");
      setIsNavigating(true);

      const selectedCar = useSearchCarType(selectCarType);
      handSave(userId, {
        place: searchInput,
        distance: String(routeInfo?.distance),
        time: String(routeInfo?.duration),
        carType: selectedCar?.value ?? "未知車款",
        oil: selectedCar?.oil ?? "未知",
      });
    }
  };

  const getCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPosition(pos);
          map?.panTo(pos);
          map?.setZoom(15);
          setIsLocating(false);

          // 如果已有選定地點，重新計算路線
          if (selectedPlace) {
            calculateRoute(pos, selectedPlace);
          }
        },
        (error) => {
          setIsLocating(false);
          alert(`無法取得您的位置: ${error.message}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setIsLocating(false);
      alert("瀏覽器不支援位置服務");
    }
  };

  const onLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  const onUnmount = () => {
    setMap(null);
  };

  if (!isLoaded) {
    return <div className="p-4">地圖載入中...</div>;
  }

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex gap-4">
          <Button
            onClick={getCurrentLocation}
            disabled={isLocating}
            className="flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            {isLocating ? "定位中..." : "定位我的位置"}
          </Button>
        </div>

        <div className="relative">
          <Input
            ref={searchInputRef}
            allowClear
            placeholder="搜尋目的地..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            prefix={<Search className="w-4 h-4 text-gray-400" />}
            className="pac-input"
          />
        </div>
      </div>

      <div className="flex flex-col items-center w-full h-full sm:flex-row">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentPosition || defaultCenter}
          zoom={14}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {!directions && currentPosition && (
            <Marker
              position={currentPosition}
              icon={{
                url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiLz48L3N2Zz4=",
                scaledSize: new google.maps.Size(30, 30),
              }}
            />
          )}

          {!directions && selectedPlace && (
            <Marker
              position={selectedPlace}
              icon={{
                url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZjAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMTBjMCA3LTkgMTMtOSAxM3MtOS02LTktMTNhOSA5IDAgMCAxIDE4IDB6Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMCIgcj0iMyIvPjwvc3ZnPg==",
                scaledSize: new google.maps.Size(30, 30),
              }}
            />
          )}

          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: false,
                polylineOptions: {
                  strokeColor: "#4A90E2",
                  strokeWeight: 5,
                },
              }}
            />
          )}
        </GoogleMap>

        {routeInfo && (
          <div className="p-4 rounded-lg w-full min-w-52 mt-2 sm:mt-0 sm:w-1/3 md:w-1/2">
            <div className="flex flex-row justify-between items-center w-full h-full sm:flex-col">
              <div className="w-full flex flex-col items-start mb-2 md:w-1/2">
                <p className="text-sm text-center text-gray-600 w-full py-0 sm:py-2">
                  預估距離： {routeInfo.distance}
                </p>
                <p className="text-sm text-center text-gray-600 w-full py-0 sm:py-2">
                  預估時間： {routeInfo.duration}
                </p>
              </div>
              <Button
                onClick={startNavigation}
                disabled={!selectedPlace || !currentPosition}
                className="flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                {isNavigating ? "導航中" : "開始導航"}
              </Button>
            </div>
          </div>
        )}
      </div>
      {contextHolder}
    </Card>
  );
}

export default MyMapComponent;
