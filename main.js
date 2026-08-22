document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       ROTATING LOGO / TEXT
       ========================================================= */

    const slides = [
        {
            src: 'images/thumbs/fulir.jpg',
            alt: 'Fulir',
            text: 'Ja, prosim, nisam nikakav šnel-fotograf'
        },
        {
            src: 'images/thumbs/davola2.png',
            alt: 'Davola',
            text: 'I developed them myself in my dark room. Would you like to see?'
        },
        {
            src: 'images/thumbs/fulir2.jpeg',
            alt: 'Fulir',
            text: 'Ne snimam za nofce. Ja snimam iz umjetničkog užitka'
        },
        {
            src: 'images/thumbs/fred.jpg',
            alt: 'Fred',
            text: 'I like to remember things my own way. How I remembered them, not necessarily the way they happened'
        },
        {
            src: 'images/thumbs/tito.jpeg',
            alt: 'Tito',
            text: 'Ništa nije toliko sveto da ne može da bude prevaziđeno'
        },
        {
            src: 'images/thumbs/bora.jpeg',
            alt: 'Todorovic',
            text: 'Bravo, devojčice, divno izgledaš'
        }
    ];

    const header = document.getElementById('header');
    const imgEl = document.getElementById('rotator-img');
    const textEl = document.getElementById('rotator-text');

    const DURATION = 12000;
    const FADE = 2000;

    function applySlide(index) {

        const slide = slides[index];

        imgEl.alt = slide.alt || '';
        imgEl.src = slide.src;
        textEl.textContent = slide.text;
    }

    slides.forEach(slide => {

        const image = new Image();
        image.src = slide.src;
    });

    let currentSlide =
        Math.floor(Math.random() * slides.length);

    applySlide(currentSlide);

    function nextSlide() {

        header.classList.add('is-fading');

        currentSlide =
            (currentSlide + 1) % slides.length;

        setTimeout(() => {

            applySlide(currentSlide);

            header.classList.remove('is-fading');

        }, FADE);
    }

    setInterval(nextSlide, DURATION);


    /* =========================================================
       CLASSIC MASONRY GALLERY
       ========================================================= */

    const gallery = document.querySelector('.gallery');

    if (!gallery) {
        return;
    }

    const items = Array.from(
        gallery.querySelectorAll('.category')
    );

    const images = Array.from(
        gallery.querySelectorAll('.category img')
    );


    function layoutGallery() {

        const galleryWidth = gallery.clientWidth;

        let columns;
        let gap;

        if (window.innerWidth < 600) {

            columns = 2;
            gap = 8;

        } else {

            columns = 3;
            gap = 14;
        }

        const itemWidth =
            (
                galleryWidth -
                gap * (columns - 1)
            ) / columns;

        const columnHeights =
            new Array(columns).fill(0);


        items.forEach(item => {

            item.style.width =
                itemWidth + 'px';


            /*
             * Traži trenutno najkraći stupac.
             */

            let shortestColumn = 0;

            for (let i = 1; i < columns; i++) {

                if (
                    columnHeights[i] <
                    columnHeights[shortestColumn]
                ) {
                    shortestColumn = i;
                }
            }


            const x =
                shortestColumn *
                (itemWidth + gap);

            const y =
                columnHeights[shortestColumn];


            item.style.left =
                x + 'px';

            item.style.top =
                y + 'px';


            const itemHeight =
                item.offsetHeight;


            columnHeights[shortestColumn] =
                y + itemHeight + gap;
        });


        const tallestColumn =
            Math.max(...columnHeights);


        gallery.style.height =
            Math.max(
                0,
                tallestColumn - gap
            ) + 'px';
    }


    /* =========================================================
       WAIT FOR GALLERY IMAGES
       ========================================================= */

    function waitForImages() {

        if (images.length === 0) {

            layoutGallery();
            return;
        }

        let remaining =
            images.length;


        function imageFinished() {

            remaining--;

            if (remaining <= 0) {

                requestAnimationFrame(() => {

                    requestAnimationFrame(() => {

                        layoutGallery();
                    });
                });
            }
        }


        images.forEach(image => {

            if (
                image.complete &&
                image.naturalWidth > 0
            ) {

                imageFinished();

            } else {

                image.addEventListener(
                    'load',
                    imageFinished,
                    { once: true }
                );

                image.addEventListener(
                    'error',
                    imageFinished,
                    { once: true }
                );
            }
        });
    }


    waitForImages();


    /* =========================================================
       RESPONSIVE RELAYOUT
       ========================================================= */

    let resizeTimer = null;

    window.addEventListener('resize', () => {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {

            layoutGallery();

        }, 100);
    });

});