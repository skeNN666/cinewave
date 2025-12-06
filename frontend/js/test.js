document.addEventListener('DOMContentLoaded', function() {
            const carousel = document.querySelector('.carousel');
            const prevBtn = document.querySelector('.carousel-button.prev-button');
            const nextBtn = document.querySelector('.carousel-button.next-button');
            const card = document.querySelector('.card');
            
            // Нэг картны өргөнийг тооцоолох
            const cardWidth = card.offsetWidth + 10; // card width + gap
            
            // Баруун товч дарах
            nextBtn.addEventListener('click', function() {
                carousel.scrollBy({
                    left: cardWidth * 1, // 3 карт алгасах
                    behavior: 'smooth'
                });
            });
            
            // Зүүн товч дарах
            prevBtn.addEventListener('click', function() {
                carousel.scrollBy({
                    left: -cardWidth * 1, // 3 карт алгасах
                    behavior: 'smooth'
                });
            });
        });

