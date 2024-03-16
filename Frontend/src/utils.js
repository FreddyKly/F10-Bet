export const getTeamColors = () => {
  return {
    "Red Bull": "#1842a3",
    "AlphaTauri": "#6d99b2",
    "McLaren": "#f68a32",
    "Alfa Romeo": "#d64964",
    "Alpine F1 Team": "#41a8e0",
    "Williams": "#47c3e0",
    "Aston Martin": "#145c37",
    "Mercedes": "#71d4c1",
    "Ferrari": "#fa2948",
    "Haas F1 Team": "#bcb6ae"}
}
export const getCurcuitNames = () => {
  return {
    "Bahrain Grand Prix": "bahrain",
    "Saudi Arabian Grand Prix": "jeddah",
    "Australian Grand Prix": "albert_park",
    "Azerbaijan Grand Prix": "baku",
    "Miami Grand Prix": "miami",
    "Monaco Grand Prix": "monaco",
    "Spanish Grand Prix": "catalunya",
    "Canadian Grand Prix": "villeneuve",
    "Austrian Grand Prix": "red_bull_ring",
    "British Grand Prix": "silverstone",
    "Hungarian Grand Prix": "hungaroring",
    "Belgian Grand Prix": "spa",
    "Dutch Grand Prix": "zandvoort",
    "Italian Grand Prix": "monza",
    "Singapore Grand Prix": "marina_bay",
    "Japanese Grand Prix": "suzuka",
    "Qatar Grand Prix": "losail",
    "United States Grand Prix": "americas",
    "Mexico City Grand Prix": "rodriguez", 
    "São Paulo Grand Prix": "interlagos",
    "Las Vegas Grand Prix": "vegas",
    "Abu Dhabi Grand Prix": "yas_marina"
  }
}
import { api } from 'src/boot/axios';
// Expected return: ['Bahrain Grand Prix', 'Saudi Arabian Grand Prix', 'Australian Grand Prix', ...]
export const getRaceLocations = async () => {
  const f1Response = await api.get('https://ergast.com/api/f1/current.json')
  return f1Response.data.MRData.RaceTable.Races.map(race => race.raceName)
}
