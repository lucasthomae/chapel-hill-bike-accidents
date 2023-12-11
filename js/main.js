document.addEventListener('DOMContentLoaded', function() {
  openModal();
});

function openModal() {
  var modal = document.getElementById('myModal');
  modal.style.display = 'block';
  modal.style.opacity = 1;
}

function closeModal() {
  var modal = document.getElementById('myModal');
  modal.style.opacity = 0;
  setTimeout(function() {
    modal.style.display = 'none';
  }, 300);
}

var latitude = [];
var longitude = [];
var date = [];
var bikeinjury = [];
var driverinjury = [];
var type = [];

$.getJSON("data/BikeCrashesSince2020.json", function(json) {

  $.each(json, function(index, entry) {
    latitude.push(entry.Latitude);
    longitude.push(entry.Longitude);
    date.push(entry.CrashDate);
    bikeinjury.push(entry.BikeInjury);
    driverinjury.push(entry.DrvrInjury);
    type.push(entry.CrashType);

    });

    function initMap() {

      var options = {
        center: { lat: 35.910141, lng: -79.064072 },
        zoom: 15,
        minZoom: 13,
        maxZoom: 18,
        mapTypeId: 'hybrid',
        labels: true,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
      }
    
      var map = new google.maps.Map(document.getElementById('map'), options)
      
      var svgMarker = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "red",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "darkred",
        rotation: 0,
        scale: 6
      };
    
      for (var i = 0; i <= 41; i++) {
        addMarker({
          coords:{lat:latitude[i],lng:longitude[i]},
          iconImage: svgMarker,
          content: '<b>Date: </b>' + date[i] +
                  '<br><b>Type: </b>' + type[i] +
                  '<br><b>Biker Injury: </b>' + bikeinjury[i] +
                  '<br><b>Driver Injury: </b>' + driverinjury[i] +
                  '<br><a href="#bottom-page">Read More</a>'
        });
      
        function addMarker(props){
          var marker = new google.maps.Marker({
            position: props.coords,
            map:map,
            icon:props.iconImage
          });
      
          if(props.content){
            var infoWindow = new google.maps.InfoWindow({
              content:props.content
            });
          
            marker.addListener('click', function(){
              infoWindow.open(map, marker);
            });
          }
        }
      }
  
      var bikeLayer = new google.maps.BicyclingLayer();
    
      bikeLayer.setMap(map);

      const icons = {
        marker: {
          name: "Collision",
          icon: "images/marker.png"
        },
        trails: {
          name: "Trails",
          icon: "images/trails.png",
        },
        lanes: {
          name: "Dedicated lanes",
          icon: "images/lanes.png",
        },
        friendly: {
          name: "Bicycle-friendly roads",
          icon: "images/friendly.png",
        },
        unpaved: {
          name: "Dirt/unpaved trails",
          icon: "images/unpaved.png"
        }
      };

      const legend = document.getElementById("legend");

      for (const key in icons) {
        const type = icons[key];
        const name = type.name;
        const icon = type.icon;
        const div = document.createElement("div");

        div.innerHTML = '<img src="' + icon + '"> ' + name;
        legend.appendChild(div);
      }

      map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
    
    }
    
    initMap();

});

new DataTable('#fullTable', {
  ajax: 'data/BikeCrashesSince2020.txt',
  columns: [
      { data: 'CrashDate' },
      { data: 'CrashType' },
      { data: 'BikeInjury'},
      { data: 'DrvrInjury' },
      { data: 'DrvrVehTyp' },
      { data: 'BikeAge' },
      { data: 'DrvrAge' },
      { data: 'TraffCntrl' },
      { data: 'SpeedLimit' },
      { data: 'RdFeature' },
      { data: 'Weather' }
  ],
  order: [],
  pageLength: 41,
  paging: false
});

document.getElementById('list-button').addEventListener('click', function() {

  var buttonText = document.getElementById('list-button').textContent;

  if (buttonText === 'List View') {
    smoothScroll('bottom-page');
  }
  if (buttonText === 'Map View') {
    smoothScroll('top-page');
  }

  toggleText();

  console.log(buttonText)
});

function smoothScroll(targetId) {
  var targetElement = document.getElementById(targetId);
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth' });
  }
}

function toggleText() {
  var button = document.getElementById('list-button');
  if (button.textContent === 'List View') {
    button.textContent = 'Map View';
  } else {
    button.textContent = 'List View';
  }
}
