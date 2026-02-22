import React, { useEffect } from 'react';

const Gallery = () => {
  const images = [
    '/assets/images/gallery1.jpg',
    '/assets/images/gallery2.jpg',
    '/assets/images/gallery3.jpg',
    '/assets/images/gallery4.jpg',
    '/assets/images/gallery5.jpg',
    '/assets/images/gallery6.jpg',
    '/assets/images/gallery7.jpg',
    '/assets/images/gallery1.jpg',
    '/assets/images/gallery4.jpg',
    '/assets/images/gallery2.jpg'
  ];

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
