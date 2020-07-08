import { GlobalVariable } from 'store/items/schema/global-variable'

declare global {
  interface Window {
    sujin: GlobalVariable
    twttr: any
    adsbygoogle: any
    opera: any
  }
}

export default global;
