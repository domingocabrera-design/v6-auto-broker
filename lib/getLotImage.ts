export default function getLotImage(lot: any) {
  return (
    lot?.lotImages?.FULL?.[0]?.url ||
    lot?.lotImages?.MAIN?.url ||
    lot?.lotImages?.PRIMARY?.url ||
    `https://content.copart.com/v1/AUTH_svc.pdoc00001/LPP/${lot?.lotNumberStr}/f_primary.jpg`
  );
}
