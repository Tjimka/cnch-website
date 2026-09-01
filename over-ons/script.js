(function(){
  var images=[
    "https://app.stroomlijn.nu/objects/quick-uploads/82/af3bf7b719997bae.jpg",
    "https://app.stroomlijn.nu/objects/quick-uploads/82/80e2d31def2b5318.jpg",
    "https://app.stroomlijn.nu/objects/quick-uploads/82/a528b5eb69c5f643.jpg",
    "https://app.stroomlijn.nu/objects/quick-uploads/82/6d4051ad360bf5a6.jpg",
    "https://app.stroomlijn.nu/objects/quick-uploads/82/562a5640474cc0e8.jpg",
    "https://app.stroomlijn.nu/objects/quick-uploads/82/b9924118aa8a45d0.jpg",
    "https://app.stroomlijn.nu/objects/quick-uploads/82/524c2010e80170ad.jpg",
    "https://app.stroomlijn.nu/objects/quick-uploads/82/51a0031b1935519b.jpg",
    "https://app.stroomlijn.nu/objects/quick-uploads/82/096f0fbb126a5ebc.jpg",
    "https://app.stroomlijn.nu/objects/quick-uploads/82/e8e722c9326926d0.jpg"
  ];
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var imgs = document.querySelectorAll('#mosaicGrid .mosaic-img');
  if(reduceMotion || !imgs.length) return;
  imgs.forEach(function(img, i){
    var idx = (i*2) % images.length;
    setInterval(function(){
      img.style.opacity = 0;
      setTimeout(function(){
        idx = (idx+1) % images.length;
        img.src = images[idx];
        img.style.opacity = 1;
      }, 550);
    }, 5200 + i*450);
  });
})();

(function(){
  var KEY='cnch_cookie_ack';
  var banner=document.getElementById('cnchCookieBanner');
  if(!banner)return;
  var akkoord=null;
  try{akkoord=localStorage.getItem(KEY);}catch(e){}
  if(akkoord==='1')return;
  banner.style.display='block';
  document.getElementById('cnchCookieOk').addEventListener('click',function(){
    try{localStorage.setItem(KEY,'1');}catch(e){}
    banner.remove();
  });
})();