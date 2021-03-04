(function(d, w) {
  const doc = d.documentElement;
  const baseSize = 75;
  function rem() {
    const width = Math.min(doc.getBoundingClientRect().width, 768);
    doc.style.fontSize = baseSize * width / 750 + "px";
  }
  rem();
  w.addEventListener("resize", rem);
})(document, window);
