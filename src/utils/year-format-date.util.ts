export function calculateYearsOfWork(startDate: string | number | Date) {
  const start = new Date(startDate);
  const today = new Date();

  // Yıl farkını hesapla
  let years = today.getFullYear() - start.getFullYear();

  // Ay ve günlere göre düzeltme yap
  const isBeforeAnniversary =
    today.getMonth() < start.getMonth() ||
    (today.getMonth() === start.getMonth() &&
      today.getDate() < start.getDate());

  // Eğer bugünkü tarih, işe başlama tarihinin yıl dönümünden önce ise, yılı 1 azalt
  if (isBeforeAnniversary) {
    years--;
  }

  return years;
}
