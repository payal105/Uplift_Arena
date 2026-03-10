import React, { useEffect } from 'react';

const Gallery = () => {
  const COLUMNS = 5;
  const images = Array.from({ length: Math.floor(43 / COLUMNS) * COLUMNS }, (_, i) => `/assets/gallery/${i + 1}.jpeg`);

  useEffect(() => {
    // Initialize Fancybox when component mounts
    if (window.jQuery && window.jQuery.fancybox) {
      window.jQuery('[data-fancybox="client_gallery"]').fancybox({
        buttons: ['slideShow', 'thumbs', 'zoom', 'fullScreen', 'share', 'close'],
        loop: false,
        protect: true
      });
    }
  }, []);

  return (
    <section className="gallery-section section-padding" id="gallery">
      <div className="container">
        <div className="heading-part text-center">
          <h2>Gallery</h2>
          <p>Take a quick sneak peek at our Turf Courts and facilities</p>
        </div>

        <div className="grid">
          {images.map((image, index) => (
            <div key={index}>
              <a href={image} data-fancybox="client_gallery">
                <img src={image} alt="Gallery" loading="lazy" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
