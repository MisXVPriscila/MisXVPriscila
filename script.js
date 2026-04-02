document.addEventListener("DOMContentLoaded", () => {
    
    // Core Elements
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const envelope = document.getElementById('envelope');
    const mainContent = document.getElementById('main-content');
    
    // Audio Player Elements
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = document.getElementById('music-icon');
    let isMusicPlaying = false;

    // 1. Interactive Envelope & Music Start Logic
    envelope.addEventListener('click', () => {
        // Run animation
        envelope.classList.add('open');
        
        // Start playing music smoothly at a low luxurious volume
        bgMusic.volume = 0.2;
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            musicIcon.className = 'fa-solid fa-volume-high'; // Sound icon
        }).catch(e => {
            // Failsafe in case browser explicitly blocks media without interaction
            console.log('Audio autoplay prevented.', e);
            isMusicPlaying = false;
            musicIcon.className = 'fa-solid fa-volume-xmark'; // Muted icon
        });

        // Extended timings for smoother feel
        setTimeout(() => {
            envelopeWrapper.style.opacity = '0'; // Envelope container begins to fade
            
            setTimeout(() => {
                envelopeWrapper.style.display = 'none'; // Erase envelope object
                mainContent.style.display = 'block'; // Make content displayable
                musicToggle.style.display = 'flex'; // Reveal the floating music widget
                
                // Trigger reflow calculation
                void mainContent.offsetWidth; 
                
                // Allow CSS transition to gracefully show the content layer
                mainContent.classList.add('visible');
                
                // Activate observer on completely loaded content
                setupIntersectionObserver();
            }, 1500); // Fading time
        }, 1800); // Waiting after opening flap to start fade
    });

    // Handle Custom Music Player Button
    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicIcon.className = 'fa-solid fa-volume-xmark';
        } else {
            bgMusic.play();
            musicIcon.className = 'fa-solid fa-volume-high';
        }
        isMusicPlaying = !isMusicPlaying;
    });

    // 2. High-Performance Intersection Observer for Scroll Tracking
    function setupIntersectionObserver() {
        const elementsToFadeIn = document.querySelectorAll('.fade-in-element');
        const observerOptions = {
            threshold: 0.1, // Trigger earlier
            rootMargin: "0px 0px -50px 0px"
        };

        const appearOnScroll = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Memory optimization, unobserve when triggered
                }
            });
        }, observerOptions);

        elementsToFadeIn.forEach(el => appearOnScroll.observe(el));
    }

    // 3. Perfect Sync Countdown Logic (July 11, 2026 at 20:00)
    const eventDateStr = "2026-07-11T20:00:00"; 
    const eventDate = new Date(eventDateStr).getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance < 0) {
            const timerContainer = document.getElementById("timer");
            if(timerContainer) {
                // Ensure typography syncs with CSS
                timerContainer.innerHTML = "<h3 style='font-family: \"Playfair Display\", serif; font-size: 1.5rem; font-weight: 400; color: var(--text-dark); letter-spacing: 2px;'>¡El gran momento ha llegado!</h3>";
            }
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Fill strings to strictly enforce 00 padding look on singles digits
        document.getElementById("days").innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("mins").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("secs").innerText = seconds.toString().padStart(2, '0');
    };

    // Keep it rolling per second
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Execute immediately so user never sees 00

    // 4. Elegantly Restrained Particle Canvas Loop
    const canvas = document.getElementById('sparkles');
    const ctx = canvas.getContext('2d');
    let particles = [];

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
            this.size = Math.random() * 1.5 + 0.2; // Keep sizes minimalist
            this.speedY = Math.random() * 0.3 + 0.1; // Slow drift
            this.opacity = Math.random() * 0.4 + 0.1;
            this.color = `rgba(209, 191, 174, ${this.opacity})`; // Champagne tint
        }
        update() {
            this.y -= this.speedY; // Upward drift
            this.x += Math.sin(this.y * 0.005) * 0.3; // Light floating curve logic
            if (this.y < -10) {
                // Return to bottom on overflow 
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

    // Spawn a limited amount for aesthetic cleanups 
    function initParticles() {
        particles = [];
        const particleCount = window.innerWidth < 768 ? 15 : 30; // Further reduced quantity
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        // Clear full map per tick
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animateParticles); // Browser GPU tick optimized caller loop
    }

    initParticles();
    animateParticles();
});
