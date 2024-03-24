import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as Leaflet from 'leaflet';
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

  addMarker() {
    const data = {
      position: { lat: 28.625043, lng: 79.810135 },
      draggable: true
    }
    const marker = this.generateMarker(data, this.markers.length - 1);
    marker.addTo(this.map).bindPopup(`<b>${data.position.lat},  ${data.position.lng}</b>`);
    this.markers.push(marker);
  }

  removeMarker(index: number) {
    this.map.removeLayer(this.markers[index])
    this.markers.splice(index, 1)
  }

  updateMarker(index: number) {
    this.markers[index].setLatLng({ lat: 28.625043, lng: 79.810135 });
  }

  ngOnDestroy(): void {

  }
}
