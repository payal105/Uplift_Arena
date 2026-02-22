jQuery(document).ready(function(){	
onloadmethod();	


    jQuery('[data-fancybox="client_gallery"]').fancybox({
        buttons: [
        "slideShow",
        "thumbs",
        "zoom",
        "fullScreen",
        "share",
        "close"
        ],
        loop: false,
        protect: true
    });

        






});



jQuery(window).resize(function(){	
	onloadmethod();	  
});

function onloadmethod(){	
	var fullwidth = jQuery('.fullwidth').width();
	jQuery('.fullwidth').css('left', -fullwidth/2)
}







// Mobile Dropdown menu -----------

document.addEventListener("DOMContentLoaded", function() {
    const dropdownMenuList = document.querySelectorAll(".dropdown-submenu .dropdown-menu");

    dropdownMenuList.forEach(function(dropdownMenu) {
      const dropdownToggle = dropdownMenu.closest(".dropdown-submenu").querySelector(".dropdown-toggle");
  
      dropdownToggle.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopPropagation();
        dropdownMenu.classList.toggle("show");
      });
    });
  });

  // Mobile Dropdown menu End-----------


// Sticky Header on Scroll -----------
window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  if (header) {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
});
// Sticky Header End -----------


