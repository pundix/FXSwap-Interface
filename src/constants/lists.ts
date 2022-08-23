// used to mark unsupported tokens, these are hosted lists of unsupported tokens

const FX_LIST = 'https://raw.githubusercontent.com/YP010/FXSwap-TokenList/main/FXList.json'

export const UNSUPPORTED_LIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  FX_LIST,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [FX_LIST]
