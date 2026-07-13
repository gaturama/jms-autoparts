import { ImageSourcePropType } from 'react-native';

export const PRODUCT_IMAGES: Record<string, ImageSourcePropType> = {
  'pneu-michelin-pilot-sport-4-225-45r17': require('../assets/images/pneu-michelin-pilot-sport-4.png'),
  'roda-oz-racing-ultraleggera-17x75-et40': require('../assets/images/roda-oz-racing-ultraleggera.png'),
  'kit-suspensao-hr-springs-golf-gti-mk7': require('../assets/images/suspensao-hr-springs-golf.jpg'),
  'amortecedor-bilstein-b8-performance-plus-dianteiro': require('../assets/images/amortecedor-bilstein-b8.png'),
  'oleo-motul-8100-x-clean-plus-5w30-5l': require('../assets/images/oleo-motul-8100-5w30.jpg'),
  'intake-esportivo-kn-69-series-typhoon-universal': require('../assets/images/intake-kn-69-typhoon.png'),
  'farol-led-sequencial-universal-h4-6000k-par': require('../assets/images/farol-led-h4-6000k.png'),
  'ponteira-escape-dupla-oval-inox-304-universal': require('../assets/images/ponteira-escape-oval-inox.png'),
  'escape-esportivo-completo-scorpion-evo-civic-15t': require('../assets/images/escape-scorpion-evo-civic.png'),
  'aerofólio-traseiro-carbono-universal-gt': require('../assets/images/aerofolio-carbono-gt.png'),
  'kit-led-interno-ambiente-rgb-16-cores-controle': require('../assets/images/led-interno-rgb.png'),
};

export const getBundledProductImage = (slug?: string): ImageSourcePropType | undefined =>
  slug ? PRODUCT_IMAGES[slug] : undefined;