export interface StatisticModel {
    "recordCount": number,
    "genreCount": number,
    "genrePopularityList":
    [
        {
            "genre": string,
            "usageInRecords": number
        }
    ]
}
