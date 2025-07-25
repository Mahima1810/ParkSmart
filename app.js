
        // ===== APPLICATION STATE =====
        let currentView = 'dashboard';
        let currentTheme = 'light';
        let selectedDuration = 1;
        let bookingData = {
            location: 'Phoenix Mall Complex',
            address: 'Velachery Main Road, Chennai',
            price: 30,
            date: '',
            time: '',
            duration: 1
        };

        // ===== SAMPLE DATA =====
        const parkingSpots = [
            {
                id: 1,
                name: 'Phoenix Mall Complex',
                address: 'Velachery Main Road, Chennai',
                price: 30,
                available: 18,
                total: 50,
                distance: '0.2 km',
                amenities: ['CCTV', 'Security', 'Covered', 'EV Charging'],
                rating: 4.8
            },
            {
                id: 2,
                name: 'Express Avenue Mall',
                address: 'Royapettah, Chennai',
                price: 35,
                available: 12,
                total: 40,
                distance: '0.5 km',
                amenities: ['CCTV', 'Security', 'Valet'],
                rating: 4.6
            },
            {
                id: 3,
                name: 'Forum Vijaya Mall',
                address: 'Vadapalani, Chennai',
                price: 25,
                available: 0,
                total: 30,
                distance: '0.8 km',
                amenities: ['CCTV', 'Covered'],
                rating: 4.4
            },
            {
                id: 4,
                name: 'VR Chennai',
                address: 'Anna Nagar, Chennai',
                price: 40,
                available: 25,
                total: 60,
                distance: '1.2 km',
                amenities: ['CCTV', 'Security', 'Covered', 'EV Charging', 'Valet'],
                rating: 4.9
            }
        ];

        const activeBookings = [
            {
                id: 1,
                location: 'Phoenix Mall Complex',
                spot: 'Level 2 - A15',
                vehicle: 'KA-01-AB-1234',
                time: 'Today at 14:30',
                amount: 90,
                duration: '3h',
                status: 'active'
            }
        ];

        const bookingHistory = [
            {
                id: 1,
                location: 'Phoenix Mall Complex',
                spot: 'Level 2 - A15',
                duration: '3 hours',
                date: 'Jan 15, 2024',
                amount: 90,
                status: 'completed'
            },
            {
                id: 2,
                location: 'Express Avenue Mall',
                spot: 'Level 1 - B08',
                duration: '2 hours',
                date: 'Jan 12, 2024',
                amount: 70,
                status: 'completed'
            },
            {
                id: 3,
                location: 'Forum Vijaya Mall',
                spot: 'Ground - C12',
                duration: '4 hours',
                date: 'Jan 10, 2024',
                amount: 100,
                status: 'completed'
            }
        ];

        // ===== INITIALIZATION =====
        document.addEventListener('DOMContentLoaded', function() {
            initializeApp();
        });

        function initializeApp() {
            updateCurrentTime();
            setInterval(updateCurrentTime, 1000);
            
            // Set current date and time for booking
            const now = new Date();
            const today = now.toISOString().split('T')[0];
            const currentTime = now.toTimeString().slice(0, 5);
            
            document.getElementById('bookingDate').value = today;
            document.getElementById('bookingTime').value = currentTime;
            
            // Initialize views
            renderActiveBookings();
            renderParkingSpots();
            renderRecentBookings();
            renderBookingHistory();
            
            // Initialize duration buttons
            initializeDurationButtons();
            
            // Initialize search functionality
            initializeSearch();
            
            // Load saved theme
            loadTheme();
        }

        // ===== TIME MANAGEMENT =====
        function updateCurrentTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
            const dateString = now.toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'short',
                day: 'numeric'
            });
            
            document.getElementById('currentTime').textContent = `${dateString} • ${timeString}`;
        }

        // ===== THEME MANAGEMENT =====
        function toggleTheme() {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme();
            saveTheme();
        }

        function applyTheme() {
            document.body.setAttribute('data-theme', currentTheme);
            
            const lightIcon = document.getElementById('light-icon');
            const darkIcon = document.getElementById('dark-icon');
            
            if (currentTheme === 'dark') {
                lightIcon.classList.add('active');
                lightIcon.classList.remove('inactive');
                darkIcon.classList.add('inactive');
                darkIcon.classList.remove('active');
            } else {
                darkIcon.classList.add('active');
                darkIcon.classList.remove('inactive');
                lightIcon.classList.add('inactive');
                lightIcon.classList.remove('active');
            }
        }

        function saveTheme() {
            // In a real app, this would save to localStorage
            // localStorage.setItem('parksmartTheme', currentTheme);
        }

        function loadTheme() {
            // In a real app, this would load from localStorage
            // const savedTheme = localStorage.getItem('parksmartTheme');
            // if (savedTheme) {
            //     currentTheme = savedTheme;
            //     applyTheme();
            // }
        }

        // ===== VIEW MANAGEMENT =====
        function showView(viewName) {
            // Hide all views
            const views = ['dashboard-view', 'map-view', 'booking-view', 'profile-view', 'history-view'];
            views.forEach(view => {
                document.getElementById(view).classList.add('hidden');
            });
            
            // Show selected view
            document.getElementById(viewName + '-view').classList.remove('hidden');
            
            // Update navigation
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => item.classList.remove('active'));
            
            const activeNav = document.getElementById('nav-' + viewName);
            if (activeNav) {
                activeNav.classList.add('active');
            }
            
            currentView = viewName;
            
            // Trigger view-specific actions
            if (viewName === 'map') {
                renderParkingSpots();
            } else if (viewName === 'booking') {
                updateBookingPrice();
            } else if (viewName === 'history') {
                renderBookingHistory();
            }
        }

        // ===== BOOKING MANAGEMENT =====
        function renderActiveBookings() {
            const container = document.getElementById('activeBookingsList');
            container.innerHTML = '';
            
            activeBookings.forEach(booking => {
                const bookingElement = createBookingCard(booking, true);
                container.appendChild(bookingElement);
            });
        }

        function createBookingCard(booking, isActive = false) {
            const card = document.createElement('div');
            card.className = 'booking-card';
            
            card.innerHTML = `
                <div class="booking-header">
                    <div class="booking-icon">🚗</div>
                    <div class="booking-details">
                        <div class="booking-location">${booking.location}</div>
                        <div class="booking-spot">${booking.spot}${booking.vehicle ? ' • ' + booking.vehicle : ''}</div>
                        <div class="booking-time">${booking.time || booking.date}</div>
                    </div>
                    <div class="booking-amount">
                        <div class="amount-text">₹${booking.amount}</div>
                        <div class="duration-text">${booking.duration}</div>
                    </div>
                </div>
                ${isActive ? `
                <div class="booking-actions">
                    <button class="btn btn-primary" onclick="navigateToSpot(${booking.id})">
                        <span>🧭</span> Navigate
                    </button>
                    <button class="btn btn-secondary" onclick="showQRCode(${booking.id})">
                        <span>📱</span> QR Code
                    </button>
                </div>
                ` : ''}
            `;
            
            return card;
        }

        function renderRecentBookings() {
            const container = document.getElementById('recentBookingsList');
            container.innerHTML = '';
            
            bookingHistory.slice(0, 3).forEach(booking => {
                const bookingElement = createBookingCard(booking);
                container.appendChild(bookingElement);
            });
        }

        function renderBookingHistory() {
            const container = document.getElementById('historyList');
            container.innerHTML = '';
            
            bookingHistory.forEach(booking => {
                const bookingElement = createBookingCard(booking);
                container.appendChild(bookingElement);
            });
        }

        // ===== PARKING SPOTS MANAGEMENT =====
        function renderParkingSpots() {
            const container = document.getElementById('parking-spots');
            container.innerHTML = '';
            
            parkingSpots.forEach(spot => {
                const spotElement = createSpotCard(spot);
                container.appendChild(spotElement);
            });
        }

        function createSpotCard(spot) {
            const card = document.createElement('div');
            card.className = 'spot-card';
            
            const isAvailable = spot.available > 0;
            const statusClass = isAvailable ? 'available' : 'full';
            
            card.innerHTML = `
                <div class="spot-header">
                    <div class="spot-info">
                        <div class="spot-name">${spot.name}</div>
                        <div class="spot-address">${spot.address}</div>
                        <div class="spot-meta">
                            <div class="meta-item">
                                <span>📍</span>
                                <span>${spot.distance}</span>
                            </div>
                            <div class="meta-item">
                                <span>⭐</span>
                                <span>${spot.rating}</span>
                            </div>
                        </div>
                    </div>
                    <div class="price-container">
                        <div class="price-text">₹${spot.price}</div>
                        <div class="price-label">per hour</div>
                    </div>
                </div>
                <div class="availability-row">
                    <div class="status-dot ${statusClass}"></div>
                    <span>${spot.available} of ${spot.total} spots available</span>
                </div>
                <div class="amenities">
                    ${spot.amenities.map(amenity => `<span class="amenity-tag">${amenity}</span>`).join('')}
                </div>
                <button class="book-btn" ${!isAvailable ? 'disabled' : ''} onclick="selectSpot(${spot.id})">
                    ${isAvailable ? 'Book Now' : 'Full'}
                </button>
            `;
            
            return card;
        }

        function selectSpot(spotId) {
            const spot = parkingSpots.find(s => s.id === spotId);
            if (!spot || spot.available === 0) return;
            
            bookingData.location = spot.name;
            bookingData.address = spot.address;
            bookingData.price = spot.price;
            
            document.getElementById('selectedLocation').textContent = spot.name;
            document.getElementById('selectedAddress').textContent = spot.address;
            document.getElementById('selectedPrice').textContent = `₹${spot.price}/hour`;
            
            showView('booking');
            updateBookingPrice();
        }

        // ===== DURATION MANAGEMENT =====
        function initializeDurationButtons() {
            const buttons = document.querySelectorAll('.duration-btn');
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    buttons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    selectedDuration = parseInt(this.dataset.duration);
                    bookingData.duration = selectedDuration;
                    updateBookingPrice();
                });
            });
        }

        function updateBookingPrice() {
            const totalPrice = bookingData.price * selectedDuration;
            const bookingBtn = document.getElementById('completeBookingBtn');
            if (bookingBtn) {
                bookingBtn.textContent = `Complete Booking - ₹${totalPrice}`;
            }
        }

        // ===== SEARCH FUNCTIONALITY =====
        function initializeSearch() {
            const searchInput = document.getElementById('searchInput');
            searchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase();
                filterParkingSpots(query);
            });
        }

        function filterParkingSpots(query) {
            if (currentView !== 'map') return;
            
            const container = document.getElementById('parking-spots');
            const spotCards = container.querySelectorAll('.spot-card');
            
            spotCards.forEach(card => {
                const spotName = card.querySelector('.spot-name').textContent.toLowerCase();
                const spotAddress = card.querySelector('.spot-address').textContent.toLowerCase();
                
                if (spotName.includes(query) || spotAddress.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = query === '' ? 'block' : 'none';
                }
            });
        }

        // ===== MODAL MANAGEMENT =====
        function showBookingSuccess() {
            // Update booking data
            bookingData.date = document.getElementById('bookingDate').value;
            bookingData.time = document.getElementById('bookingTime').value;
            
            // Show loading state
            const btn = document.getElementById('completeBookingBtn');
            btn.classList.add('loading');
            btn.textContent = 'Processing...';
            
            // Simulate booking process
            setTimeout(() => {
                btn.classList.remove('loading');
                btn.textContent = `Complete Booking - ₹${bookingData.price * selectedDuration}`;
                
                // Add to active bookings
                const newBooking = {
                    id: Date.now(),
                    location: bookingData.location,
                    spot: 'Level 2 - A15',
                    vehicle: 'KA-01-AB-1234',
                    time: `${bookingData.date} at ${bookingData.time}`,
                    amount: bookingData.price * selectedDuration,
                    duration: `${selectedDuration}h`,
                    status: 'active'
                };
                
                activeBookings.push(newBooking);
                renderActiveBookings();
                
                document.getElementById('successModal').classList.add('show');
                showToast('Booking Confirmed!', 'Your parking spot has been reserved successfully.', 'success');
            }, 2000);
        }

        function closeModal() {
            document.getElementById('successModal').classList.remove('show');
            showView('dashboard');
        }

        // ===== NOTIFICATION FUNCTIONS =====
        function showNotifications() {
            showToast('Notifications', 'You have 3 new notifications', 'success');
        }

        function showFilters() {
            showToast('Filters', 'Filter options coming soon!', 'success');
        }

        function navigateToSpot(bookingId) {
            showToast('Navigation', 'Opening navigation to your parking spot...', 'success');
        }

        function showQRCode(bookingId) {
            showToast('QR Code', 'QR code for parking entry generated!', 'success');
        }

        // ===== TOAST NOTIFICATIONS =====
        function showToast(title, message, type = 'success') {
            const toast = document.getElementById('toast');
            const toastIcon = document.getElementById('toast-icon');
            const toastTitle = document.getElementById('toast-title');
            const toastMessage = document.getElementById('toast-message');
            
            // Set content
            toastTitle.textContent = title;
            toastMessage.textContent = message;
            
            // Set icon based on type
            switch(type) {
                case 'success':
                    toastIcon.textContent = '✅';
                    toast.className = 'toast success';
                    break;
                case 'error':
                    toastIcon.textContent = '❌';
                    toast.className = 'toast error';
                    break;
                case 'warning':
                    toastIcon.textContent = '⚠️';
                    toast.className = 'toast warning';
                    break;
                default:
                    toastIcon.textContent = 'ℹ️';
                    toast.className = 'toast';
            }
            
            // Show toast
            toast.classList.add('show');
            
            // Hide after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // ===== UTILITY FUNCTIONS =====
        function formatDate(date) {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }

        function formatTime(time) {
            return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }

        function formatCurrency(amount) {
            return `₹${amount.toLocaleString()}`;
        }

        // ===== EVENT LISTENERS =====
        document.addEventListener('click', function(e) {
            // Close modals when clicking outside
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
            }
        });

        // Prevent form submission on Enter key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
                e.preventDefault();
            }
        });

        // Handle online/offline status
        window.addEventListener('online', function() {
            showToast('Connected', 'You are back online!', 'success');
        });

        window.addEventListener('offline', function() {
            showToast('Offline', 'You are currently offline. Some features may be limited.', 'warning');
        });

        // ===== PWA SUPPORT =====
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later
            deferredPrompt = e;
            // Show install prompt
            showInstallPrompt();
        });

        function showInstallPrompt() {
            const installPrompt = document.createElement('div');
            installPrompt.className = 'install-prompt show';
            installPrompt.innerHTML = `
                <div class="install-text">
                    <strong>Install ParkSmart</strong><br>
                    Get quick access to parking spots
                </div>
                <button class="install-btn" onclick="installApp()">Install</button>
                <button class="install-btn" onclick="dismissInstall()" style="background: transparent; color: white;">Later</button>
            `;
            
            document.body.appendChild(installPrompt);
        }

        function installApp() {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        showToast('Success', 'ParkSmart installed successfully!', 'success');
                    }
                    deferredPrompt = null;
                });
            }
            dismissInstall();
        }

        function dismissInstall() {
            const installPrompt = document.querySelector('.install-prompt');
            if (installPrompt) {
                installPrompt.remove();
            }
        }

        // ===== SERVICE WORKER REGISTRATION =====
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                        console.log('SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }

        // ===== PERFORMANCE OPTIMIZATIONS =====
        // Lazy load images
        function lazyLoadImages() {
            const images = document.querySelectorAll('img[data-lazy]');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.lazy;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }

        // Debounce function for search
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // ===== ANALYTICS & TRACKING =====
        function trackEvent(eventName, properties = {}) {
            // In a real app, this would send data to analytics service
            console.log('Event tracked:', eventName, properties);
        }

        // Track view changes
        function trackViewChange(viewName) {
            trackEvent('view_changed', { view: viewName, timestamp: Date.now() });
        }

        // Track booking attempts
        function trackBookingAttempt(spotId) {
            trackEvent('booking_attempted', { spotId, timestamp: Date.now() });
        }

        // ===== ERROR HANDLING =====
        window.addEventListener('error', function(e) {
            console.error('Global error:', e.error);
            showToast('Error', 'Something went wrong. Please try again.', 'error');
        });

        window.addEventListener('unhandledrejection', function(e) {
            console.error('Unhandled promise rejection:', e.reason);
            showToast('Error', 'Network error. Please check your connection.', 'error');
        });

        // ===== ACCESSIBILITY ENHANCEMENTS =====
        // Keyboard navigation support
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });

        // Screen reader announcements
        function announceToScreenReader(message) {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.style.position = 'absolute';
            announcement.style.left = '-10000px';
            announcement.style.width = '1px';
            announcement.style.height = '1px';
            announcement.style.overflow = 'hidden';
            announcement.textContent = message;
            
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        }

        // ===== FINAL INITIALIZATION =====
        // Initialize app when DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeApp);
        } else {
            initializeApp();
        }

        // Initialize lazy loading
        if (document.readyState === 'complete') {
            lazyLoadImages();
        } else {
            window.addEventListener('load', lazyLoadImages);
        }

        // Add keyboard navigation styles
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-navigation *:focus {
                outline: 2px solid var(--accent-primary) !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);

        console.log('ParkSmart App initialized successfully! 🚗✨');
    