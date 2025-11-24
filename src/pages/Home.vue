<template>
  <div class="home-wrapper">
    <h1 class="home-title">
      Smart Campus Navigation
    </h1>

    <!-- Search & Filter -->
    <section class="card search-section">
      <h2 class="section-title">Search & Filter</h2>
      <div class="search-grid">
        <input v-model="search" placeholder="Search room or keyword" class="search-input" />
        <select v-model="floor" class="search-input">
          <option value="">All Floors</option>
          <option v-for="f in floors" :key="f.id" :value="f.number">{{ f.number }}</option>
        </select>
        <select v-model="type" class="search-input">
          <option value="">All Types</option>
          <option>Lecture Room</option>
          <option>Lab</option>
          <option>Office</option>
        </select>
        <div class="search-actions">
          <button @click="filterRooms" class="btn btn-primary">Search</button>
          <button @click="clearFilters" class="btn btn-outline">Clear</button>
        </div>
      </div>
    </section>

    <!-- Search Results - Only show when search has been performed -->
    <section v-if="searchPerformed" class="card search-results-section">
      <h2 class="section-title">Search Results</h2>
      
      <!-- Show results list when there are matches -->
      <div v-if="filteredRooms.length > 0" class="results-list-container">
        <div class="results-list">
          <div v-for="room in filteredRooms" :key="room.id" class="room-card">
            <div class="room-card-header">
              <span class="type-badge">
                {{ room.type }}
              </span>
              <span class="floor-text">
                Floor {{ room.floorId }}
              </span>
            </div>
            <h3 class="room-name">{{ room.name }}</h3>
            <div class="room-actions">
              <button @click="openRoom(room)" class="btn btn-primary">View Details</button>
              <button @click="toggleFav(room.id)" class="btn btn-outline">
                {{ isFav(room.id) ? "Remove Favorite" : "Save to Favorites" }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Show no results message when search returns nothing -->
      <div v-else class="no-results">
        No rooms found matching your search criteria.
      </div>
    </section>

    <!-- Floor Map Navigation -->
    <section class="card map-section">
      <div class="map-header">
        <h2 class="section-title">Floor Map and Navigation</h2>
        <div class="map-controls">
          <label class="map-label">View Floor:</label>
          <select v-model="mapFloor" class="map-select">
            <option v-for="f in floors" :key="f.id" :value="f.number">{{ f.number }}</option>
          </select>
          <button class="btn btn-outline small" @click="zoomIn">Zoom In</button>
          <button class="btn btn-outline small" @click="zoomOut">Zoom Out</button>
          <button class="btn btn-outline small" @click="togglePath">Show Route</button>
          <button class="btn btn-outline small" @click="resetMap">Reset Map</button>
        </div>
      </div>

      <!-- SVG Map -->
      <div class="map-container">
        <svg id="floor-map" class="map-svg"
          @mousedown="startDrag" @mousemove="onDrag" @mouseup="endDrag" @mouseleave="endDrag">
          <rect x="0" y="0" width="100%" height="100%" class="map-background"></rect>
          <text x="24" y="32" class="map-floor-title">
            Floor {{ mapFloor }}
          </text>

          <!-- Zoom + Drag -->
          <g class="zoom-group" :transform="`translate(${panX}, ${panY}) scale(${zoomLevel})`">
            <circle v-for="r in roomsOnMap" :key="r.id" :cx="r.x" :cy="r.y" r="8" class="room-dot" />
            <text v-for="r in roomsOnMap" :key="'t' + r.id" :x="r.x + 14" :y="r.y + 4" class="room-label">
              {{ r.name }}
            </text>
            <g v-if="showPath">
              <line x1="100" y1="100" x2="300" y2="180" class="route-line" />
            </g>
          </g>
        </svg>
      </div>
    </section>

    <!-- Room Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-card">
        <button @click="showModal = false" class="modal-close">
          ✕
        </button>
        <h3 class="modal-title">{{ selectedRoom.name }}</h3>
        <p class="modal-text"><b>Type:</b> {{ selectedRoom.type }}</p>
        <p class="modal-text"><b>Floor:</b> {{ selectedRoom.floorId }}</p>
        <div class="modal-actions">
          <button class="btn btn-primary" @click="showModal = false">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Example floors and rooms
const floors = ref([
  { id: 17, number: 17 },
  { id: 18, number: 18 },
  { id: 19, number: 19 },
  { id: 20, number: 20 },
]);
const rooms = ref([
  { id: 1, name: "Lecture 1701", type: "Lecture Room", floorId: 17, x: 120, y: 120 },
  { id: 2, name: "Lab 1802", type: "Lab", floorId: 18, x: 220, y: 180 },
  { id: 3, name: "Office 1903", type: "Office", floorId: 19, x: 300, y: 220 },
]);

// Search and Filter
const search = ref("");
const floor = ref("");
const type = ref("");
const filteredRooms = ref([]); // Start empty
const searchPerformed = ref(false); // Track if search button was clicked

function filterRooms() {
  searchPerformed.value = true; // Set to true when search button is clicked
  
  filteredRooms.value = rooms.value.filter((r) => {
    const s = search.value
      ? r.name.toLowerCase().includes(search.value.toLowerCase())
      : true;
    const f = floor.value ? r.floorId == floor.value : true;
    const t = type.value ? r.type === type.value : true;
    return s && f && t;
  });
}

function clearFilters() {
  search.value = "";
  floor.value = "";
  type.value = "";
  filteredRooms.value = []; // Clear results
  searchPerformed.value = false; // Hide search results section
}

// Map controls
const mapFloor = ref(17);
const showPath = ref(false);

function togglePath() {
  showPath.value = !showPath.value;
}

// Favorites
const favorites = ref(JSON.parse(localStorage.getItem("favorites") || "[]"));
function isFav(id) {
  return favorites.value.includes(id);
}
function toggleFav(id) {
  if (isFav(id)) favorites.value = favorites.value.filter((x) => x !== id);
  else favorites.value.push(id);
  localStorage.setItem("favorites", JSON.stringify(favorites.value));
}

// Modal
const showModal = ref(false);
const selectedRoom = ref({});
function openRoom(r) {
  selectedRoom.value = r;
  showModal.value = true;
}

// ZOOM + PAN FUNCTIONALITY
const zoomLevel = ref(1);
const panX = ref(0);
const panY = ref(0);
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

function zoomIn() {
  if (zoomLevel.value < 2.5) zoomLevel.value += 0.2;
}
function zoomOut() {
  if (zoomLevel.value > 0.6) zoomLevel.value -= 0.2;
}
function resetMap() {
  zoomLevel.value = 1;
  panX.value = 0;
  panY.value = 0;
  showPath.value = false;
}

// Dragging
function startDrag(event) {
  isDragging = true;
  dragStartX = event.clientX - panX.value;
  dragStartY = event.clientY - panY.value;
}
function onDrag(event) {
  if (isDragging) {
    panX.value = event.clientX - dragStartX;
    panY.value = event.clientY - dragStartY;
  }
}
function endDrag() {
  isDragging = false;
}

const roomsOnMap = computed(() =>
  rooms.value.filter((r) => r.floorId === Number(mapFloor.value))
);
</script>

<style scoped>
/* Main wrapper */
.home-wrapper {
  max-width: 84rem;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.home-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
}

/* Card base styles */
.card {
  background-color: #ffffff;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.search-section,
.search-results-section,
.map-section {
  margin-bottom: 1.5rem;
}

/* Section titles */
.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #111827;
}

/* Search grid */
.search-grid {
  display: grid;
  gap: 1rem;
}

@media (min-width: 768px) {
  .search-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

/* Input and select styles */
.search-input {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

/* Button styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  border: 1px solid transparent;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #facc15;
  color: #ffffff;
  padding: 0.5rem 1rem;
}

.btn-primary:hover {
  background-color: #bc980b;
}

.btn-outline {
  background-color: transparent;
  color: #374151;
  border-color: #d1d5db;
  padding: 0.5rem 1rem;
}

.btn-outline:hover {
  background-color: #f9fafb;
}

.btn.small {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

/* Search actions */
.search-actions {
  display: flex;
  gap: 0.5rem;
}

/* Results list container */
.results-list-container {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Room card styles for list view */
.room-card {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem;
  margin: 0;
}

.room-card:last-child {
  border-bottom: none;
}

.room-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.type-badge {
  background-color: #fef3c7;
  color: #92400e;
  font-size: 0.75rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  border-radius: 9999px;
}

.floor-text {
  font-size: 0.75rem;
  color: #6b7280;
}

.room-name {
  font-weight: 600;
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
  color: #111827;
}

.room-actions {
  display: flex;
  gap: 0.5rem;
}

/* No results message */
.no-results {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
}

/* Map section styles */
.map-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.map-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.map-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.map-select {
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

/* Map container */
.map-container {
  margin-top: 1rem;
}

.map-svg {
  width: 100%;
  height: 440px;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #ffffff;
}

.map-background {
  fill: #ffffff;
}

.map-floor-title {
  fill: #374151;
  font-size: 18px;
}

/* Room dots and labels */
.room-dot {
  fill: #facc15;
}

.room-label {
  fill: #374151;
  font-size: 12px;
}

/* Route line */
.route-line {
  stroke: #22c55e;
  stroke-width: 4;
  stroke-dasharray: 6 6;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 50;
}

.modal-card {
  position: relative;
  max-width: 28rem;
  width: 100%;
  background-color: #ffffff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #6b7280;
  font-size: 1rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #111827;
}

.modal-text {
  margin-bottom: 0.25rem;
  color: #374151;
}

.modal-actions {
  margin-top: 1rem;
}

/* Zoom group animation */
.zoom-group {
  transition: transform 0.25s ease;
  transform-origin: center center;
  cursor: grab;
}

.zoom-group:active {
  cursor: grabbing;
}

/* Dark mode styles */
.dark .home-title {
  color: #f9fafb;
}

.dark .home-wrapper {
  color: #f9fafb;
}

.dark .card {
  background-color: #1f2937;
  border-color: #374151;
  color: #f9fafb;
}

.dark .section-title {
  color: #f9fafb;
}

.dark .search-input {
  background-color: #1f2937;
  color: #f9fafb;
  border-color: #4b5563;
}

.dark .search-input::placeholder {
  color: #9ca3af;
}

.dark .floor-text {
  color: #d1d5db;
}

.dark .room-card {
  background-color: #1f2937;
  border-color: #374151;
  color: #f9fafb;
}

.dark .room-name {
  color: #f9fafb;
}

.dark .btn-outline {
  color: #e5e7eb;
  border-color: #4b5563;
}

.dark .btn-outline:hover {
  background-color: #374151;
  color: #f9fafb;
}

.dark .map-label {
  color: #d1d5db;
}

.dark .map-select {
  background-color: #1f2937;
  color: #f9fafb;
  border-color: #4b5563;
}

.dark .map-svg {
  background-color: #111827;
  border-color: #374151;
}

.dark .map-background {
  fill: #111827;
}

.dark map-floor-title {
  fill: #f9fafb;
}

.dark .room-label {
  fill: #f9fafb;
}

.dark .modal-card {
  background-color: #1f2937;
  border-color: #374151;
  color: #f9fafb;
}

.dark .modal-title {
  color: #f9fafb;
}

.dark .modal-text {
  color: #e5e7eb;
}

.dark .modal-close {
  color: #9ca3af;
}

.dark .modal-close:hover {
  color: #f9fafb;
}

.dark .type-badge {
  background-color: #fef3c7;
  color: #92400e;
}

.dark .no-results {
  color: #d1d5db;
}

.dark .results-list-container {
  border-color: #374151;
}

.dark .room-card {
  border-bottom-color: #374151;
}
</style>