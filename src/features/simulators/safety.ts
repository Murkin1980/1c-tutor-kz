const identifierDigits = /^\d{12}$/;
const forbiddenHosts = [
  "kgd.gov.kz",
  "cabinet.salyk.kz",
  "esf.gov.kz",
  "pki.gov.kz",
  "ncalayer.kz",
];

export function isRealIdentifierLike(value: string) {
  return identifierDigits.test(value.replace(/\s|-/g, ""));
}

export function assertTrainingIdentifier(value: string) {
  if (isRealIdentifierLike(value)) {
    throw new Error("В учебном симуляторе запрещён ввод реального ИИН/БИН.");
  }
  return value;
}

export function isSimulationNetworkAllowed(input: string | URL, appOrigin = window.location.origin) {
  const url = new URL(input.toString(), appOrigin);
  if (forbiddenHosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`))) return false;
  return url.origin === appOrigin;
}
