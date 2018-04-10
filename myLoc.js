var watchId=null;
var map=null;
var ourCoords={
	latitude: 47.624851,
	longitude: -122.52099
};
//Codigo para el rastreo
function watchLocation(){
	watchId=navigator.geolocation.watchPosition(
		displayLocation,
		displayError);
}
function clearWatch(){
	if(watchId){
		navigator.geolocation.clearWatch(watchId);
		watchId=null;
	}
}
function scrollMapToPosition(coords){
	var latitude = coords.latitude;
	var longitude = coords.longitude;

	var latlong=new google.maps.LatLng(latitude, longitude);
	map.panTo(latlong);

	addMarker(map, latlong, "Nueva Ubicacion", "Te moviste a: "+latitude+", "+longitude);
}
window.onload=getMyLocation;

function getMyLocation(){
	if(navigator.geolocation){
		var watchButton=document.getElementById("watch");
		watchButton.onclick=watchLocation;
		var clearWatchButton=document.getElementById("clearWatch");
		clearWatchButton.onclick=clearWatch;

	}else{
		alert("Ups, tu navegador no soporta geolocalizacion");
	}
}
function displayLocation(position){
	var latitude=position.coords.latitude;
	var longitude=position.coords.longitude;
	var div=document.getElementById("location");
	
	div.innerHTML="Tu estas en Latitud: "+latitude+", Longitud: "+ longitude;
	div.innerHTML+="(con "+position.coords.accuracy+" metros de exactitud)";
	
	var km=computeDistance(position.coords, ourCoords);
	var distance=document.getElementById("distancia");
	distance.innerHTML="Tu estas a "+km+" km de los cuarteles de WickedlySmart";
	if(map==null){
	showMap(position.coords);	
	}
	else{
		scrollMapToPosition(position.coords);
	}
}
function computeDistance(startCoords, destCoords){
	var startLatRads=degreesToRadians(startCoords.latitude);
	var startLongRads=degreesToRadians(startCoords.longitude);
	var destLatRads=degreesToRadians(destCoords.latitude);
	var destLongRads=degreesToRadians(destCoords.longitude);
	var Radius= 6371;//radio de la tierra en km
	var distance=Math.acos(Math.sin(startLatRads)*Math.sin(destLatRads)+
		Math.cos(startLatRads)*Math.cos(destLatRads)*
		Math.cos(startLongRads-destLongRads))*Radius;
	return distance;
}
function degreesToRadians(degrees){
	var radians=(degrees*Math.PI)/180;
	return radians;
}

function showMap(coords){
	var googleLatAndLong = new google.maps.LatLng(coords.latitude, coords.longitude);

	var mapOptions={
		zoom: 10,
		center: googleLatAndLong,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var mapDiv = document.getElementById("map");
	map = new google.maps.Map(mapDiv, mapOptions);
	//add the user marker
	var title="Tu ubicacion";
	var content="Estas en: "+coords.latitude+", "+coords.longitude;
	addMarker(map, googleLatAndLong, title, content);
}
function addMarker(map, latlong, title, content){
	var markerOptions={
		position: latlong,
		map:map,
		title:title,
		clickable:true
	};
	var marker=new google.maps.Marker(markerOptions);

	var infoWindowOptions={
		content: content,
		position: latlong
	};
	var infoWindow= new google.maps.InfoWindow(infoWindowOptions);

	google.maps.event.addListener(marker, 'click', function(){
		infoWindow.open(map);
	});
}

function displayError(error){
	var errorTypes={
		0: "Error desconocido",
		1: "Permiso negado por el usuario",
		2: "Posicion no disponible",
		3: "Tiempo de respuesta agotado"
	};
	var errorMessage=errorTypes[error.code];
	if(error.code==0||error.code==2){
		errorMessage+" "+error.message;
	}
	var div=document.getElementById("location");
	div.innerHTML=errorMessage;
}

