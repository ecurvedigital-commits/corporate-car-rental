// ============================================
// BOOKING POPUP - Shared JavaScript
// ============================================

// Load the popup HTML dynamically
function loadBookingPopup() {
        return fetch('booking-popup.html')
                .then(response => response.text())
                .then(html => {
                        // Create a container and insert the HTML
                        const container = document.createElement('div');
                        container.id = 'bookingPopupContainer';
                        container.innerHTML = html;
                        document.body.appendChild(container);

                        // Initialize the popup after DOM is ready
                        setTimeout(initBookingPopup, 100);
                })
                .catch(err => console.error('Failed to load booking popup:', err));
}

// Initialize the booking popup
function initBookingPopup() {
        const bookingModal = document.getElementById('bookingModal');
        const bookingForm = document.getElementById('bookingForm');
        const bookingSuccess = document.getElementById('bookingSuccess');
        const bookingScroll = document.getElementById('bookingScroll');
        const scrollIndicator = document.getElementById('scrollIndicator');
        const scrollThumb = document.getElementById('scrollThumb');

        if (!bookingModal) return;

        // Make functions globally accessible
        window.openBookingModal = function () {
                // Reset to form state
                bookingForm.classList.remove('hidden');
                bookingSuccess.classList.add('hidden');
                bookingForm.reset();
                // Clear any error states
                bookingForm.querySelectorAll('.form-field').forEach(f => f.classList.remove('error'));
                // Open modal
                bookingModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                // Reset scroll & indicator
                bookingScroll.scrollTop = 0;
                setTimeout(updateScrollIndicator, 50);
        };

        window.closeBookingModal = function () {
                bookingModal.classList.remove('active');
                document.body.style.overflow = '';
                localStorage.setItem('em_booking_visited', 'true');
        };

        window.showBookingModal = function () {
                if (!localStorage.getItem('em_booking_visited')) {
                        bookingModal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                }
        };

        // Close on overlay click
        bookingModal.addEventListener('click', (e) => {
                if (e.target === bookingModal) closeBookingModal();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
                        closeBookingModal();
                }
        });

        // Custom scroll indicator
        function updateScrollIndicator() {
                const { scrollTop, scrollHeight, clientHeight } = bookingScroll;
                if (scrollHeight <= clientHeight) {
                        scrollIndicator.classList.remove('active');
                        return;
                }
                scrollIndicator.classList.add('active');
                const trackHeight = clientHeight;
                const thumbHeight = Math.max(20, (clientHeight / scrollHeight) * trackHeight);
                const maxTop = trackHeight - thumbHeight;
                const scrollRatio = scrollTop / (scrollHeight - clientHeight);
                const thumbTop = scrollRatio * maxTop;
                scrollThumb.style.height = thumbHeight + 'px';
                scrollThumb.style.top = thumbTop + 'px';
        }

        // Make updateScrollIndicator globally accessible for manual calls
        window.updateScrollIndicator = updateScrollIndicator;

        bookingScroll.addEventListener('scroll', updateScrollIndicator);
        window.addEventListener('resize', updateScrollIndicator);

        // Form validation & submit
        window.handleBookingSubmit = function (e) {
                e.preventDefault();
                const form = e.target;
                const fields = form.querySelectorAll('.form-field');
                let valid = true;

                fields.forEach(field => {
                        const input = field.querySelector('input, select, textarea');
                        if (input && input.hasAttribute('required') && !input.value.trim()) {
                                field.classList.add('error');
                                valid = false;
                        } else if (input && input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
                                field.classList.add('error');
                                valid = false;
                        } else {
                                field.classList.remove('error');
                        }
                });

                if (valid) {
                        // Collect form data
                        const formData = new FormData(form);
                        const data = Object.fromEntries(formData.entries());
                        console.log('Booking request:', data);

                        // Show success state
                        bookingForm.classList.add('hidden');
                        bookingSuccess.classList.remove('hidden');
                }
        };

        // Remove error on input
        document.querySelectorAll('.booking-modal input, .booking-modal select, .booking-modal textarea').forEach(el => {
                el.addEventListener('input', () => {
                        el.closest('.form-field')?.classList.remove('error');
                });
        });
}

// ============================================
// MOBILE MENU DRAWER - Shared Functionality
// ============================================

function initMobileMenu() {
        if (document.getElementById('mobileMenuDrawer')) return;

        const mobileMenuHTML = `
        <div id="mobileMenuDrawer" class="fixed inset-0 bg-black/95 text-white z-[100] transform -translate-y-full transition-transform duration-300 ease-in-out flex flex-col justify-between p-6 md:hidden overflow-y-auto">
                <div>
                        <div class="flex justify-between items-center pb-6 border-b border-white/10 mb-8">
                                <a href="index.html" class="font-headline-md text-xl font-bold text-white tracking-tight">Executive Motion</a>
                                <button id="closeMobileMenuBtn" class="text-white p-2 focus:outline-none hover:text-electric-lime transition-colors">
                                        <span class="material-symbols-outlined text-3xl">close</span>
                                </button>
                        </div>
                        <nav class="flex flex-col gap-5 font-label-caps text-base uppercase tracking-widest text-white/90">
                                <a class="hover:text-electric-lime transition-colors py-2 border-b border-white/5" href="index.html">Home</a>
                                <a class="hover:text-electric-lime transition-colors py-2 border-b border-white/5" href="company.html">Company</a>
                                <a class="hover:text-electric-lime transition-colors py-2 border-b border-white/5" href="fleet.html">Fleet</a>
                                <a class="hover:text-electric-lime transition-colors py-2 border-b border-white/5" href="pricing.html">Pricing & Services</a>
                                <a class="hover:text-electric-lime transition-colors py-2 border-b border-white/5" href="careers.html">Careers</a>
                                <a class="hover:text-electric-lime transition-colors py-2 border-b border-white/5" href="contact.html">Contact</a>
                                <a class="hover:text-electric-lime transition-colors py-2 text-electric-lime font-bold" href="dashboard.html">Corporate Login</a>
                        </nav>
                </div>
                <div class="pt-6 border-t border-white/10 mt-8">
                        <button id="mobileQuoteBtn" class="w-full font-label-caps uppercase tracking-widest py-4 rounded-lg font-bold btn-lime transition-colors text-center text-black">
                                Get a Quote
                        </button>
                </div>
        </div>
        `;

        const container = document.createElement('div');
        container.innerHTML = mobileMenuHTML;
        document.body.appendChild(container.firstElementChild);

        const drawer = document.getElementById('mobileMenuDrawer');
        const closeBtn = document.getElementById('closeMobileMenuBtn');
        const quoteBtn = document.getElementById('mobileQuoteBtn');

        window.openMobileMenu = function() {
                drawer.classList.remove('-translate-y-full');
                drawer.classList.add('translate-y-0');
                document.body.style.overflow = 'hidden';
        };

        window.closeMobileMenu = function() {
                drawer.classList.remove('translate-y-0');
                drawer.classList.add('-translate-y-full');
                document.body.style.overflow = '';
        };

        window.toggleMobileMenu = function() {
                if (drawer.classList.contains('translate-y-0')) {
                        window.closeMobileMenu();
                } else {
                        window.openMobileMenu();
                }
        };

        if (closeBtn) closeBtn.addEventListener('click', window.closeMobileMenu);
        if (quoteBtn) {
                quoteBtn.addEventListener('click', () => {
                        window.closeMobileMenu();
                        if (window.openBookingModal) window.openBookingModal();
                });
        }

        // Close on nav link click
        drawer.querySelectorAll('nav a').forEach(link => {
                link.addEventListener('click', window.closeMobileMenu);
        });

        // Bind all hamburger menu buttons across the page
        document.querySelectorAll('button.md\\:hidden').forEach(btn => {
                btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.openMobileMenu();
                });
        });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
        initMobileMenu();
        loadBookingPopup().then(() => {
                // Show popup after 1.5s delay on first visit
                setTimeout(() => {
                        if (window.showBookingModal) {
                                window.showBookingModal();
                        }
                }, 1500);
        });
});

