import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as Leaflet from 'leaflet';
import { Observable } from 'rxjs';
import { CustomPosition } from './models/map.model';
Leaflet.Icon.Default.imagePath = 'assets/';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LeafletModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  title = 'My Places';
  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];
  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 16,
    center: { lat: 28.626137, lng: 79.821603 }
  }
  geoLocationMarker: Leaflet.Marker<any> | undefined;
  geoLocationMarkerIndex: number | undefined;

  constructor() {

  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }

  initMarkers() {
    // Note:- you can also use mergeOptions() method instead of imagePath property.
    // LeafLet.Icon.Default.mergeOptions({
    //   iconRetinaUrl: 'assets/marker-icon-2x.png',
    //   iconUrl: 'assets/marker-icon.png',
    //   shadowUrl: 'assets/marker-shadow.png'
    // });
    const initialMarkers = [
      {
        position: { lat: 28.625485, lng: 79.821091 },
        draggable: true
      },
      {
        position: { lat: 28.625293, lng: 79.817926 },
        draggable: false
      },
      {
        position: { lat: 28.625182, lng: 79.81464 },
        draggable: true
      }
    ];
    for (let index = 0; index < initialMarkers.length; index++) {
      const data = initialMarkers[index];
      const marker = this.generateMarker(data, index);
      marker.addTo(this.map).bindPopup(`<b>${data.position.lat},  ${data.position.lng}</b>`);
      this.map.panTo(data.position);
      this.markers.push(marker)
    }
  }

  generateMarker(data: any, index: number) {
    return Leaflet.marker(data.position, { draggable: data.draggable })
      .on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }

  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    this.initMarkers();
  }

  mapClicked($event: any) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerClicked($event: any, index: number) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerDragEnd($event: any, index: number) {
    console.log($event.target.getLatLng());
  }

  addMarker(position: CustomPosition) {
    const data = {
      position: position,
      draggable: true
    }
    const marker = this.generateMarker(data, this.markers.length - 1);
    marker.addTo(this.map).bindPopup(`<b>${data.position.lat},  ${data.position.lng}</b>`);
    this.markers.push(marker);
    return this.markers.length - 1;
  }

  removeMarker(index: number | undefined) {
    if (index) {
      this.map.removeLayer(this.markers[index])
      this.markers.splice(index, 1)
    }
  }

  updateMarker(index: number, position: CustomPosition) {
    this.markers[index].setLatLng(position);
  }

  getGeoLocation(): Observable<CustomPosition> {
    return new Observable(subscriber => {
      /* geolocation is available */
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          subscriber.next({ lat: position.coords.latitude, lng: position.coords.longitude });
        });
      } else {
        /* geolocation IS NOT available */
        subscriber.error('Geolocation is not available');
      }
    });
  }

  watchGeoLocation(): Observable<CustomPosition> {
    return new Observable(subscriber => {
      /* geolocation is available */
      if ("geolocation" in navigator) {
        const watchID = navigator.geolocation.watchPosition((position) => {
          subscriber.next({ lat: position.coords.latitude, lng: position.coords.longitude });
        });
      } else {
        /* geolocation IS NOT available */
        subscriber.error('Geolocation is not available');
      }
    });
  }

  locateMe() {
    this.getGeoLocation().subscribe({
      next: location => {
        console.log(location);
        if (this.geoLocationMarker) {
          this.removeMarker(this.geoLocationMarkerIndex)
        }
        this.geoLocationMarkerIndex = this.addMarker(location);
        this.geoLocationMarker = this.markers[this.geoLocationMarkerIndex];
        this.map.panTo(location);
      },
      error: error => {
        alert(error);
      }
    });
  }

  locateAndTrackMe() {
    this.watchGeoLocation().subscribe({
      next: location => {
        console.log(location);
        if (this.geoLocationMarker) {
          this.removeMarker(this.geoLocationMarkerIndex)
        }
        this.geoLocationMarkerIndex = this.addMarker(location);
        this.geoLocationMarker = this.markers[this.geoLocationMarkerIndex];
        this.map.panTo(location);
      },
      error: error => {
        alert(error);
      }
    });
  }

  ngOnDestroy(): void {

  }
}
