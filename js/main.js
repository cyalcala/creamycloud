/*
  CreamyCloud - Luxury Interaction Logic
  Includes: GSAP Image Sequence, Navbar Scroll, FAQ Accordion
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. Lenis Smooth Scroll ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // --- 1. Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 2. FAQ Accordion (GSAP) ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');
        const icon = trigger.querySelector('iconify-icon');
        
        trigger.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close others
            faqItems.forEach(i => {
                if (i !== item && i.classList.contains('active')) {
                    i.classList.remove('active');
                    gsap.to(i.querySelector('.faq-content'), { height: 0, duration: 0.5, ease: 'power2.inOut' });
                    gsap.to(i.querySelector('iconify-icon'), { rotation: 0, duration: 0.5 });
                }
            });
            
            // Toggle current
            if (isOpen) {
                item.classList.remove('active');
                gsap.to(content, { height: 0, duration: 0.5, ease: 'power2.inOut' });
                gsap.to(icon, { rotation: 0, duration: 0.5 });
            } else {
                item.classList.add('active');
                gsap.set(content, { height: 'auto' });
                const height = content.offsetHeight;
                gsap.fromTo(content, { height: 0 }, { height: height, duration: 0.5, ease: 'power2.inOut' });
                gsap.to(icon, { rotation: 180, duration: 0.5 });
            }
        });
    });

    // --- 3. GSAP Hero Image Sequence ---
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const context = canvas.getContext('2d');
        const frameCount = 80;
        const currentFrame = index => `images/hero/hero_${(index + 1).toString().padStart(3, '0')}.jpg`;

        const images = [];
        const airbnb = { frame: 0 };
        let imagesLoaded = 0;

        // Preload and Size Initializer
        function updateCanvasSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render();
        }

        // Preload images with completion check
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            img.onload = () => {
                imagesLoaded++;
                if (imagesLoaded === 1) render(); // Show first frame immediately
                if (imagesLoaded === frameCount) initScrollTrigger();
            };
            images.push(img);
        }

        function initScrollTrigger() {
            gsap.to(airbnb, {
                frame: frameCount - 1,
                snap: "frame",
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: 2, // Slightly higher for "silk" smoothness
                    pin: true,
                    anticipatePin: 1,
                }
            });

            // Using GSAP ticker for the render loop instead of onUpdate
            // This ensures it runs at the screen's refresh rate and is highly optimized
            gsap.ticker.add(render);
        }

        function render() {
            const img = images[airbnb.frame];
            if (img && img.complete) {
                const hRatio = canvas.width / img.width;
                const vRatio = canvas.height / img.height;
                const ratio = Math.max(hRatio, vRatio);
                const centerShift_x = (canvas.width - img.width * ratio) / 2;
                const centerShift_y = (canvas.height - img.height * ratio) / 2;
                
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0, img.width, img.height,
                    centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
            }
        }

        window.addEventListener('resize', updateCanvasSize);
        updateCanvasSize(); // Initial call
    }

    // --- 4. Flavor Carousel ---
    const track = document.querySelector('.flavor-track');
    const nextBtn = document.getElementById('next-flavor');
    const prevBtn = document.getElementById('prev-flavor');
    let scrollPos = 0;

    if (track && nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            const maxScroll = track.scrollWidth - track.parentElement.clientWidth;
            scrollPos = Math.min(scrollPos + 440, maxScroll);
            track.style.transform = `translateX(-${scrollPos}px)`;
        });

        prevBtn.addEventListener('click', () => {
            scrollPos = Math.max(scrollPos - 440, 0);
            track.style.transform = `translateX(-${scrollPos}px)`;
        });
    }

    // --- 5. Magnetic Buttons ---
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const position = btn.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;
            
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });

    // --- 5. Scroll Reveals ---
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.hero-content > *', {
        y: 60,
        opacity: 0,
        duration: 1.5,
        stagger: 0.15,
        ease: 'power4.out'
    });

    gsap.from('.card', {
        scrollTrigger: {
            trigger: '.grid',
            start: 'top 85%',
        },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out'
    });
});
