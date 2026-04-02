document.addEventListener("DOMContentLoaded", () => {
            
    // 1. Envelope Animation and Transition Logic
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const envelope = document.getElementById('envelope');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');

    envelope.addEventListener('click', () => {
        // Add open class to trigger CSS animation on the flap and letter
        envelope.classList.add('open');
        
        // Attempt to play background music (often blocked by browsers if no user interaction, but click fixes it)
        bgMusic.volume = 0.3; // keep it soft
        bgMusic.play().catch(e => console.log('Audio autoplay blocked or unavailable.', e));

        // Smoothly transition from the envelope screen to the main content
        setTimeout(() => {
            envelopeWrapper.style.opacity = '0';
            
            setTimeout(() => {
                envelopeWrapper.style.display = 'none';
                mainContent.style.display = 'block';
                
                // Force browser reflow to ensure the scaling transition occurs correctly
                void mainContent.offsetWidth;
                mainContent.classList.add('visible');
                
                // Initialize intersection observer for scrolling elements now that they are visible
                setupIntersectionObserver();
            }, 1000); // duration of the background fade-out
        }, 1300); // delay allowing the opening animation to play
    });

    // 2. Intersection Observer for Scroll Fade-Ins
    function setupIntersectionObserver() {
        const elementsToFadeIn = document.querySelectorAll('.fade-in-element');
        const observerOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px" // triggers slightly before hitting the bottom
        };

        const appearOnScroll = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Stop observing once it has faded in
                }
            });
        }, observerOptions);

        elementsToFadeIn.forEach(el => appearOnScroll.observe(el));
    }

    // 3. Dynamic Countdown Timer Logic
    // Modify this date to match the event's actual date (Year, Month[0-11], Day, Hour, Minute)
    // Using placeholder logic set in November 2026.
    const eventDateStr = "2026-11-25T20:00:00"; 
    const eventDate = new Date(eventDateStr).getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance < 0) {
            // Event has passed or is happening
            const timerContainer = document.getElementById("timer");
            if(timerContainer) {
                timerContainer.innerHTML = "<h3 style='font-family: \"Playfair Display\", serif; font-size: 2rem; color: var(--primary-dark);'>¡El gran día ha llegado!</h3>";
            }
            return;
        }

        // Time calculations for days, hours, minutes, and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update DOM
        document.getElementById("days").innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("mins").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("secs").innerText = seconds.toString().padStart(2, '0');
    };

    // Run interval every second
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Initialize immediately to avoid 1-second delay

    // 4. Lightweight Sparkles Effect on Canvas
    const canvas = document.getElementById('sparkles');
    const ctx = canvas.getContext('2d');
    let particles = [];

    // Helper to resize canvas properly based on window size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5; // Radius between 0.5 and 2.5
            this.speedY = Math.random() * 0.5 + 0.2; // Drift upwards
            this.opacity = Math.random() * 0.6 + 0.2;
            // Slightly varied subtle colors (gold-ish and soft pinks)
            const isGold = Math.random() > 0.5;
            if (isGold) {
                this.color = `rgba(212, 175, 55, ${this.opacity})`; // Gold
            } else {
                this.color = `rgba(201, 138, 155, ${this.opacity})`; // Pink
            }
        }

        update() {
            this.y -= this.speedY;
            this.x += Math.sin(this.y * 0.01) * 0.5; // Subtle horizontal drift
            
            // Reset if it goes off screen
            if (this.y < -10) {
                this.y = canvas.height + 10;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        // Responsively reduce particle count for lower-end devices / mobile
        const particleCount = window.innerWidth < 768 ? 25 : 60;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
    
    // Re-init particles on orientation change or aggressive resize
    window.addEventListener('resize', () => {
        if(window.innerWidth !== canvas.width) {
            initParticles();
        }
    });
});
