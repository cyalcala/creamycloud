/*
  CreamyCloud - Luxury Interaction Logic
  Includes: GSAP Image Sequence, Navbar Scroll, FAQ Accordion
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 2. FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        trigger.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // --- 3. GSAP Hero Image Sequence ---
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const context = canvas.getContext('2d');
        
        // Configuration: Adjust these to match your provided JPGs
        const frameCount = 60; // Total frames in your sequence
        const currentFrame = index => (
            `images/hero/hero_${(index + 1).toString().padStart(3, '0')}.jpg`
        );

        const images = [];
        const airbnb = {
            frame: 0
        };

        // Preload images
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);
        }

        gsap.to(airbnb, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 1,
                pin: true,
            },
            onUpdate: render
        });

        images[0].onload = render;

        function render() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            // Responsive canvas sizing
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            const img = images[airbnb.frame];
            if (img.complete) {
                const hRatio = canvas.width / img.width;
                const vRatio = canvas.height / img.height;
                const ratio = Math.max(hRatio, vRatio);
                const centerShift_x = (canvas.width - img.width * ratio) / 2;
                const centerShift_y = (canvas.height - img.height * ratio) / 2;
                
                context.drawImage(img, 0, 0, img.width, img.height,
                    centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
            }
        }

        window.addEventListener('resize', render);
    }

    // --- 4. Scroll Reveals ---
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.hero-content > *', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power4.out'
    });

    gsap.from('.card', {
        scrollTrigger: {
            trigger: '.grid',
            start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
    });
});
