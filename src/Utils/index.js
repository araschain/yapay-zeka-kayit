module.exports = {
  düzgünİsim(isim) {
    let kelimeler = isim.split(" ");
    let yeniCumle = "";

    for (let i = 0; i < kelimeler.length; i++) {
      let kelime = kelimeler[i];
      let ilkHarfBuyuk = kelime.charAt(0).toUpperCase();
      let digerHarflerKucuk = kelime.slice(1).toLowerCase();
      yeniCumle += ilkHarfBuyuk + digerHarflerKucuk + " ";
    }

    return {
      yeniIsım: yeniCumle.trim()
    }
  }
}