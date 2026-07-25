type Year = `${number}${number}${number}${number}`

type Month =
  | "01" | "02" | "03" | "04"
  | "05" | "06" | "07" | "08"
  | "09" | "10" | "11" | "12"

type Day =
  | "01" | "02" | "03" | "04" | "05"
  | "06" | "07" | "08" | "09" | "10"
  | "11" | "12" | "13" | "14" | "15"
  | "16" | "17" | "18" | "19" | "20"
  | "21" | "22" | "23" | "24" | "25"
  | "26" | "27" | "28" | "29" | "30"
  | "31"

export type DateString = `${Year}-${Month}-${Day}`

export type RangeDate = [
  DateString,
  DateString | null
]