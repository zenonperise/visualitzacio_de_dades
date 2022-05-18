var dataObs = new rxjs.ReplaySubject()
    .pipe(
        rxjs.map(data => data
                    .map(d => ({iso: d.iso_code, country: d.country, 
                        population: parseInt(d.population), 
                        gdp: parseInt(d.gdp), year: parseInt(d.year),
                        renewablesshareenergy: parseFloat(d.renewables_share_energy),
                        fossilshareenergy: parseFloat(d.fossil_share_energy)}))
                    .filter(d => countryList.indexOf(d.country)!=-1)
                    .filter(d => d.year >= 1945)
                    .filter(d => !!d.gdp))
    )

var countryList =                    [
  "Austria",
  "Belgium",
  "Bosnia and Herzegovina",
  "Bulgaria",
  "Croatia",
  "Cyprus",
  "Czechia",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Ireland",
  "Italy",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Netherlands",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "Serbia",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "Switzerland",
  "United Kingdom"
]

d3.csv('World Energy Consumption.csv').then(data => dataObs.next(data))


dataObs.subscribe(data => console.log(data))